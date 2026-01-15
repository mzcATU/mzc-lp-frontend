import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  UpdateProgressRequest,
  EnrollmentWithCurriculumResponse,
  EnrollmentPlayerData,
} from '@/types/tu';

/**
 * 수강 신청 상태
 */
export type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

/**
 * 백엔드 EnrollmentResponse 타입 (실제 API 응답)
 */
interface BackendEnrollmentResponse {
  id: number;
  userId: number;
  courseTimeId: number;
  enrolledAt: string;
  type: string;
  status: string;
  progressPercent: number | null;
  score: number | null;
  completedAt: string | null;
}

/**
 * 백엔드 CourseTime 응답 타입 (차수 정보)
 */
interface BackendCourseTimeResponse {
  id: number;
  title: string;
  programId: number | null;
  programName: string | null;
  classStartDate: string;
  classEndDate: string;
  snapshotId: number | null;
  courseTitle: string | null;
}

/**
 * 수강 신청 타입 (프론트엔드용)
 */
export interface Enrollment {
  id: number;
  userId: number;
  courseTimeId: number;
  programId: number;
  programTitle: string;
  courseTimeName: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
  progress?: number;
  startDate: string;
  endDate: string;
}

/**
 * 수강 신청 필터 파라미터
 */
export interface EnrollmentFilterParams {
  page?: number;
  size?: number;
  status?: EnrollmentStatus;
}

/**
 * 페이지네이션 응답 타입
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

/**
 * 백엔드 상태를 프론트엔드 상태로 매핑
 */
const mapEnrollmentStatus = (status: string): EnrollmentStatus => {
  const statusMap: Record<string, EnrollmentStatus> = {
    ENROLLED: 'APPROVED',
    IN_PROGRESS: 'APPROVED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    DROPPED: 'CANCELLED',
  };
  return statusMap[status] || 'PENDING';
};

/**
 * 프론트엔드 상태를 백엔드 상태로 매핑 (API 요청용)
 */
const mapStatusToBackend = (status: EnrollmentStatus): string | undefined => {
  const statusMap: Record<EnrollmentStatus, string> = {
    APPROVED: 'ENROLLED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'DROPPED',
    PENDING: 'ENROLLED', // PENDING은 백엔드에 없으므로 ENROLLED로
    REJECTED: 'DROPPED', // REJECTED도 백엔드에 없으므로 DROPPED로
  };
  return statusMap[status];
};

/**
 * 백엔드 응답을 프론트엔드 Enrollment로 변환
 */
const transformEnrollment = (
  backend: BackendEnrollmentResponse,
  courseTimeInfo?: BackendCourseTimeResponse
): Enrollment => ({
  id: backend.id,
  userId: backend.userId,
  courseTimeId: backend.courseTimeId,
  programId: courseTimeInfo?.programId ?? 0,
  programTitle: courseTimeInfo?.programName ?? '',
  courseTimeName: courseTimeInfo?.title ?? '',
  status: mapEnrollmentStatus(backend.status),
  enrolledAt: backend.enrolledAt,
  completedAt: backend.completedAt ?? undefined,
  progress: backend.progressPercent ?? 0,
  startDate: courseTimeInfo?.classStartDate ?? '',
  endDate: courseTimeInfo?.classEndDate ?? '',
});

/**
 * 일괄 수강 신청 응답 타입
 */
export interface BulkEnrollmentResult {
  courseTimeId: number;
  success: boolean;
  enrollmentId?: number;
  errorMessage?: string;
}

export interface BulkEnrollmentResponse {
  results: BulkEnrollmentResult[];
  successCount: number;
  failureCount: number;
}

/**
 * 수강 신청 서비스
 */
export const enrollmentService = {
  /**
   * 수강 신청
   */
  enroll: async (courseTimeId: number): Promise<Enrollment> => {
    const response = await axiosInstance.post<Enrollment>(
      API_ENDPOINTS.TIMES.ENROLLMENTS(courseTimeId)
    );
    return response.data;
  },

  /**
   * 일괄 수강 신청
   */
  enrollBulk: async (courseTimeIds: number[]): Promise<BulkEnrollmentResponse> => {
    const response = await axiosInstance.post<BulkEnrollmentResponse>(
      API_ENDPOINTS.ENROLLMENTS.BULK,
      { courseTimeIds }
    );
    return response.data;
  },

  /**
   * 내 수강 신청 목록 조회
   * - 백엔드 응답을 프론트엔드 형식으로 변환
   * - 차수(courseTime) 정보를 추가로 조회하여 programTitle, courseTimeName 등 보완
   */
  getMyEnrollments: async (params?: EnrollmentFilterParams): Promise<PageResponse<Enrollment>> => {
    // 1. 수강 목록 조회 (status를 백엔드 형식으로 변환)
    const backendParams = {
      ...params,
      status: params?.status ? mapStatusToBackend(params.status) : undefined,
    };
    const response = await axiosInstance.get<PageResponse<BackendEnrollmentResponse>>(
      API_ENDPOINTS.ENROLLMENTS.MY,
      { params: backendParams }
    );
    const pageData = response.data;

    // 2. 고유한 courseTimeId 목록 추출
    const courseTimeIds = [...new Set(pageData.content.map((e) => e.courseTimeId))];

    // 3. 각 차수 정보 조회 (병렬)
    const courseTimeMap = new Map<number, BackendCourseTimeResponse>();
    if (courseTimeIds.length > 0) {
      const courseTimePromises = courseTimeIds.map(async (id) => {
        try {
          const res = await axiosInstance.get<BackendCourseTimeResponse>(
            API_ENDPOINTS.TIMES.BY_ID(id)
          );
          return { id, data: res.data };
        } catch {
          return { id, data: null };
        }
      });
      const results = await Promise.all(courseTimePromises);
      results.forEach(({ id, data }) => {
        if (data) courseTimeMap.set(id, data);
      });
    }

    // 4. 변환하여 반환
    return {
      ...pageData,
      content: pageData.content.map((e) =>
        transformEnrollment(e, courseTimeMap.get(e.courseTimeId))
      ),
    };
  },

  /**
   * 수강 신청 상세 조회
   * - 백엔드 응답을 프론트엔드 형식으로 변환
   * - 차수(courseTime) 정보를 추가로 조회하여 programTitle, courseTimeName 등 보완
   */
  getEnrollment: async (id: number): Promise<Enrollment> => {
    // 1. 수강 정보 조회
    const response = await axiosInstance.get<BackendEnrollmentResponse>(
      API_ENDPOINTS.ENROLLMENTS.BY_ID(id)
    );
    const enrollment = response.data;

    // 2. 차수 정보 조회
    let courseTimeInfo: BackendCourseTimeResponse | undefined;
    try {
      const courseTimeRes = await axiosInstance.get<BackendCourseTimeResponse>(
        API_ENDPOINTS.TIMES.BY_ID(enrollment.courseTimeId)
      );
      courseTimeInfo = courseTimeRes.data;
    } catch {
      // 차수 정보 조회 실패 시 빈 값 사용
    }

    // 3. 변환하여 반환
    return transformEnrollment(enrollment, courseTimeInfo);
  },

  /**
   * 수강 신청 취소
   */
  cancelEnrollment: async (id: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ENROLLMENTS.CANCEL(id));
  },

  /**
   * 수강 상세 + 커리큘럼 조회 (학습 플레이어용)
   */
  getEnrollmentWithCurriculum: async (id: number): Promise<EnrollmentWithCurriculumResponse> => {
    const response = await axiosInstance.get<EnrollmentWithCurriculumResponse>(
      API_ENDPOINTS.ENROLLMENTS.CURRICULUM(id)
    );
    return response.data;
  },

  /**
   * 학습 진도 업데이트
   */
  updateProgress: async (enrollmentId: number, request: UpdateProgressRequest): Promise<void> => {
    await axiosInstance.patch(
      API_ENDPOINTS.ENROLLMENTS.PROGRESS(enrollmentId),
      request
    );
  },

  /**
   * 차시 완료 처리
   */
  markItemComplete: async (enrollmentId: number, itemId: number): Promise<void> => {
    await axiosInstance.post(
      API_ENDPOINTS.ENROLLMENTS.ITEM_COMPLETE(enrollmentId, itemId)
    );
  },

  /**
   * 학습 플레이어용 Enrollment 데이터 조회
   * - Enrollment + CourseTime 정보를 조합하여 snapshotId까지 획득
   */
  getEnrollmentForPlayer: async (enrollmentId: number): Promise<EnrollmentPlayerData> => {
    // 1. 수강 정보 조회
    const enrollmentRes = await axiosInstance.get<BackendEnrollmentResponse>(
      API_ENDPOINTS.ENROLLMENTS.BY_ID(enrollmentId)
    );
    const enrollment = enrollmentRes.data;

    // 2. 차수(CourseTime) 정보 조회 - snapshotId 포함
    const courseTimeRes = await axiosInstance.get<BackendCourseTimeResponse>(
      API_ENDPOINTS.TIMES.BY_ID(enrollment.courseTimeId)
    );
    const courseTime = courseTimeRes.data;

    return {
      enrollmentId: enrollment.id,
      userId: enrollment.userId,
      courseTimeId: enrollment.courseTimeId,
      courseTimeName: courseTime.title,
      programId: courseTime.programId ?? 0,
      programTitle: courseTime.courseTitle ?? courseTime.programName ?? '',
      snapshotId: courseTime.snapshotId ?? 0,
      status: enrollment.status,
      progressPercent: enrollment.progressPercent ?? 0,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
      classStartDate: courseTime.classStartDate,
      classEndDate: courseTime.classEndDate,
    };
  },
};

export default enrollmentService;
