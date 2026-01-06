/**
 * TA Dashboard API 서비스 (TENANT_ADMIN)
 * GET /api/admin/dashboard/kpi
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { TaKpiDashboardResponse } from '@/types/admin';

export const taDashboardService = {
  /** TA KPI 대시보드 통계 조회 */
  async getKpiDashboard(): Promise<TaKpiDashboardResponse> {
    const { data } = await axiosInstance.get<TaKpiDashboardResponse>(
      API_ENDPOINTS.TA_DASHBOARD.KPI
    );
    return data;
  },
};
