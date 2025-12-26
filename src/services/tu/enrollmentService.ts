import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';

/**
 * 수강 신청 상태
 */
export type EnrollmentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

/**
 * 수강 신청 타입
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
 * API 응답 래퍼 타입
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 수강 신청 서비스
 */
export const enrollmentService = {
  /**
   * 수강 신청
   */
  enroll: async (courseTimeId: number): Promise<Enrollment> => {
    const response = await axiosInstance.post<ApiResponse<Enrollment>>(
      API_ENDPOINTS.TIMES.ENROLLMENTS(courseTimeId)
    );
    return response.data.data;
  },

  /**
   * 내 수강 신청 목록 조회
   */
  getMyEnrollments: async (params?: EnrollmentFilterParams): Promise<PageResponse<Enrollment>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<Enrollment>>>(
      API_ENDPOINTS.ENROLLMENTS.MY,
      { params }
    );
    return response.data.data;
  },

  /**
   * 수강 신청 상세 조회
   */
  getEnrollment: async (id: number): Promise<Enrollment> => {
    const response = await axiosInstance.get<ApiResponse<Enrollment>>(
      API_ENDPOINTS.ENROLLMENTS.BY_ID(id)
    );
    return response.data.data;
  },

  /**
   * 수강 신청 취소
   */
  cancelEnrollment: async (id: number): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.ENROLLMENTS.CANCEL(id));
  },
};

export default enrollmentService;
