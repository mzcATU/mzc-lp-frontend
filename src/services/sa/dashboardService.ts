/**
 * SA Dashboard API 서비스 (SYSTEM_ADMIN)
 * GET /api/sa/dashboard
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { SaDashboardResponse } from '@/types/admin';

export const saDashboardService = {
  /** SA 대시보드 통계 조회 */
  async getDashboard(): Promise<SaDashboardResponse> {
    const { data } = await axiosInstance.get<SaDashboardResponse>(
      API_ENDPOINTS.SA_DASHBOARD.BASE
    );
    return data;
  },
};
