/**
 * CO Dashboard API 서비스 (OPERATOR)
 * GET /api/operator/dashboard/tasks
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { CoOperatorDashboardResponse } from '@/types/co';

export type DashboardPeriod = '7d' | '30d' | 'all';

export const coDashboardService = {
  /** CO 운영 대시보드 통계 조회 */
  async getDashboard(period?: DashboardPeriod): Promise<CoOperatorDashboardResponse> {
    const { data } = await axiosInstance.get<CoOperatorDashboardResponse>(
      API_ENDPOINTS.CO_DASHBOARD.TASKS,
      {
        params: period && period !== 'all' ? { period } : undefined,
      }
    );
    return data;
  },
};
