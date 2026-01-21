/**
 * TO(Tenant Operator) 수강 관리 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  EnrollmentResponse,
  EnrollmentDetailResponse,
  ForceEnrollRequest,
  ForceEnrollResultResponse,
  CompleteEnrollmentRequest,
  UpdateEnrollmentStatusRequest,
  CourseTimeEnrollmentStatsResponse,
  EnrollmentFilterParams,
} from '@/types/co/enrollment.types';

// Spring Page 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const adminEnrollmentService = {
  // ============================================
  // 조회
  // ============================================

  /** 차수별 수강생 목록 조회 */
  async getEnrollmentsByCourseTime(
    courseTimeId: number,
    params?: EnrollmentFilterParams
  ): Promise<PageResponse<EnrollmentResponse>> {
    const response = await axiosInstance.get<PageResponse<EnrollmentResponse>>(
      API_ENDPOINTS.TIMES.ENROLLMENTS(courseTimeId),
      { params }
    );
    return response.data;
  },

  /** 수강 상세 조회 */
  async getEnrollment(id: number): Promise<EnrollmentDetailResponse> {
    const { data } = await axiosInstance.get<EnrollmentDetailResponse>(
      API_ENDPOINTS.ENROLLMENTS.BY_ID(id)
    );
    return data;
  },

  /** 차수별 수강 통계 조회 */
  async getCourseTimeStats(courseTimeId: number): Promise<CourseTimeEnrollmentStatsResponse> {
    const { data } = await axiosInstance.get<CourseTimeEnrollmentStatsResponse>(
      `${API_ENDPOINTS.TIMES.ENROLLMENTS(courseTimeId)}/stats`
    );
    return data;
  },

  // ============================================
  // 강제 배정
  // ============================================

  /** 강제 배정 (필수 교육) */
  async forceEnroll(
    courseTimeId: number,
    request: ForceEnrollRequest
  ): Promise<ForceEnrollResultResponse> {
    const { data } = await axiosInstance.post<ForceEnrollResultResponse>(
      `${API_ENDPOINTS.TIMES.ENROLLMENTS(courseTimeId)}/force`,
      request
    );
    return data;
  },

  // ============================================
  // 수강 관리
  // ============================================

  /** 수료 처리 */
  async completeEnrollment(
    id: number,
    request: CompleteEnrollmentRequest
  ): Promise<EnrollmentDetailResponse> {
    const { data } = await axiosInstance.patch<EnrollmentDetailResponse>(
      `${API_ENDPOINTS.ENROLLMENTS.BY_ID(id)}/complete`,
      request
    );
    return data;
  },

  /** 상태 변경 */
  async updateStatus(
    id: number,
    request: UpdateEnrollmentStatusRequest
  ): Promise<EnrollmentDetailResponse> {
    const { data } = await axiosInstance.patch<EnrollmentDetailResponse>(
      `${API_ENDPOINTS.ENROLLMENTS.BY_ID(id)}/status`,
      request
    );
    return data;
  },

  /** 수강 취소 */
  async cancelEnrollment(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.ENROLLMENTS.BY_ID(id));
  },

  /** 수강신청 승인 */
  async approveEnrollment(id: number): Promise<EnrollmentDetailResponse> {
    const { data } = await axiosInstance.patch<EnrollmentDetailResponse>(
      API_ENDPOINTS.ENROLLMENTS.APPROVE(id)
    );
    return data;
  },

  /** 수강신청 거절 */
  async rejectEnrollment(id: number, reason?: string): Promise<EnrollmentDetailResponse> {
    const { data } = await axiosInstance.patch<EnrollmentDetailResponse>(
      API_ENDPOINTS.ENROLLMENTS.REJECT(id),
      { reason }
    );
    return data;
  },
};
