/**
 * SA Dashboard API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';

// SA Dashboard Response 타입
export interface SaDashboardResponse {
  tenantStats: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    terminated: number;
    byPlan: Record<string, number>;
  };
  userStats: {
    total: number;
    active: number;
    suspended: number;
    withdrawn: number;
  };
  recentTenants: Array<{
    id: number;
    code: string;
    name: string;
    status: string;
    plan: string;
    createdAt: string;
  }>;
}

export const dashboardService = {
  /** SA 대시보드 조회 */
  async getDashboard(): Promise<SaDashboardResponse> {
    const { data } = await axiosInstance.get<{ data: SaDashboardResponse }>(
      API_ENDPOINTS.DASHBOARD.SA
    );
    return data.data;
  },
};
