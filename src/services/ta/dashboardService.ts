/**
 * TA Dashboard API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';

// TA Dashboard KPI Response 타입
export interface TaDashboardKpiResponse {
  userStats: {
    active: number;
    inactive: number;
    suspended: number;
    withdrawn: number;
    total: number;
    newThisMonth: number;
  };
  programStats: {
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
    closed: number;
    total: number;
  };
  enrollmentStats: {
    totalEnrollments: number;
    byStatus: {
      enrolled: number;
      completed: number;
      dropped: number;
      failed: number;
    };
    completionRate: number;
  };
  monthlyTrend: Array<{
    month: string;
    enrollments: number;
    completions: number;
  }>;
}

export const dashboardService = {
  /** TA KPI 대시보드 조회 */
  async getKpi(): Promise<TaDashboardKpiResponse> {
    const { data } = await axiosInstance.get<{ data: TaDashboardKpiResponse }>(
      API_ENDPOINTS.DASHBOARD.TA_KPI
    );
    return data.data;
  },
};
