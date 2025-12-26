/**
 * 내 강의 배정 API 서비스 (TU - 강사 본인용)
 */
import { axiosInstance } from '../common/api';
import { API_ENDPOINTS } from '../common/api/endpoints';
import type {
  InstructorAssignmentResponse,
  InstructorDetailStatResponse,
} from '@/types/tu';

export const myAssignmentService = {
  /**
   * 내 배정 목록 조회
   * GET /api/users/me/instructor-assignments
   */
  getMyAssignments: async (): Promise<InstructorAssignmentResponse[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.INSTRUCTOR_ASSIGNMENTS.MY);
    return response.data.data;
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
    return response.data.data;
  },
};
