/**
 * TO Dashboard API 서비스 (OPERATOR)
 * GET /api/operator/dashboard/tasks
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { ToOperatorDashboardResponse } from '@/types/to';

export const toDashboardService = {
  /** TO 운영 대시보드 통계 조회 */
  async getDashboard(): Promise<ToOperatorDashboardResponse> {
    const { data } = await axiosInstance.get<ToOperatorDashboardResponse>(
      API_ENDPOINTS.TO_DASHBOARD.TASKS
    );
    return data;
  },
};
