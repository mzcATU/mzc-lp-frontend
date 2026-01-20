/**
 * 내 강의 배정 API 서비스 (TU - 강사 본인용)
 */
import { axiosInstance } from '../common/api';
import { API_ENDPOINTS } from '../common/api/endpoints';
import type {
  InstructorAssignmentResponse,
  InstructorDetailStatResponse,
  CourseTimeEnrollmentsResponse,
  CourseTimeEnrollmentItem,
  EnrollmentStats,
  StudentEnrollmentStatus,
} from '@/types/tu';

// 백엔드 EnrollmentResponse 타입
interface BackendEnrollmentResponse {
  id: number;
  userId: number;
  userName: string | null;
  userEmail: string | null;
  courseTimeId: number;
  enrolledAt: string;
  type: string;
  status: string;
  progressPercent: number;
  score: number | null;
  completedAt: string | null;
}

// 백엔드 Page 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const myAssignmentService = {
  /**
   * 내 배정 목록 조회
   * GET /api/users/me/instructor-assignments
   */
  getMyAssignments: async (): Promise<InstructorAssignmentResponse[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.INSTRUCTOR_ASSIGNMENTS.MY);
    return response.data;
  },

  /**
   * 내 강사 통계 조회
   * GET /api/users/me/instructor-statistics
   * @param startDate - 시작일 (선택, YYYY-MM-DD)
   * @param endDate - 종료일 (선택, YYYY-MM-DD)
   */
  getMyStatistics: async (
    startDate?: string,
    endDate?: string
  ): Promise<InstructorDetailStatResponse> => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axiosInstance.get(
      API_ENDPOINTS.INSTRUCTOR_ASSIGNMENTS.MY_STATISTICS,
      { params }
    );
    return response.data;
  },

  /**
   * 차수 수강생 목록 조회 (강사용)
   * GET /api/times/{timeId}/enrollments + /api/times/{timeId}
   * @param timeId - 차수 ID
   */
  getCourseTimeEnrollments: async (timeId: number): Promise<CourseTimeEnrollmentsResponse> => {
    // 1. 수강생 목록 조회 (페이지네이션 없이 전체 조회)
    const enrollmentsRes = await axiosInstance.get(API_ENDPOINTS.TIMES.ENROLLMENTS(timeId), {
      params: { size: 1000 },
    });
    const pageData: PageResponse<BackendEnrollmentResponse> = enrollmentsRes.data;

    // 2. 차수 정보 조회
    const timeRes = await axiosInstance.get(API_ENDPOINTS.TIMES.BY_ID(timeId));
    const timeData = timeRes.data;

    // 3. 백엔드 상태를 프론트엔드 상태로 매핑
    const mapStatus = (status: string): StudentEnrollmentStatus => {
      const statusMap: Record<string, StudentEnrollmentStatus> = {
        ENROLLED: 'ENROLLED',
        IN_PROGRESS: 'IN_PROGRESS',
        COMPLETED: 'COMPLETED',
        DROPPED: 'DROPPED',
        CANCELLED: 'DROPPED',
      };
      return statusMap[status] || 'ENROLLED';
    };

    // 4. 수강생 목록 변환
    const enrollments: CourseTimeEnrollmentItem[] = pageData.content.map((e) => ({
      enrollmentId: e.id,
      userId: e.userId,
      userName: e.userName || `User ${e.userId}`,
      userEmail: e.userEmail || '',
      status: mapStatus(e.status),
      progress: e.progressPercent ?? 0,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
      lastAccessedAt: null,
    }));

    // 5. 통계 계산
    const stats: EnrollmentStats = {
      totalCount: enrollments.length,
      enrolledCount: enrollments.filter((e) => e.status === 'ENROLLED').length,
      inProgressCount: enrollments.filter((e) => e.status === 'IN_PROGRESS').length,
      completedCount: enrollments.filter((e) => e.status === 'COMPLETED').length,
      droppedCount: enrollments.filter((e) => e.status === 'DROPPED').length,
      averageProgress:
        enrollments.length > 0
          ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
          : 0,
      completionRate:
        enrollments.length > 0
          ? Math.round(
              (enrollments.filter((e) => e.status === 'COMPLETED').length / enrollments.length) *
                100
            )
          : 0,
    };

    // 6. 응답 조합
    return {
      timeId,
      timeName: timeData.title || `차수 ${timeId}`,
      programName: timeData.programName || '프로그램',
      startDate: timeData.classStartDate || '',
      endDate: timeData.classEndDate || '',
      enrollments,
      stats,
    };
  },
};
