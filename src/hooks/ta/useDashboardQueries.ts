/**
 * TA Dashboard React Query Hooks (TENANT_ADMIN)
 */
import { useQuery } from '@tanstack/react-query';
import { taDashboardService, type DashboardPeriod } from '@/services/ta';

// Query Keys
export const taDashboardKeys = {
  all: ['ta-dashboard'] as const,
  kpi: (period?: DashboardPeriod) => [...taDashboardKeys.all, 'kpi', period ?? 'all'] as const,
};

/** TA KPI 대시보드 통계 조회 */
export const useTaKpiDashboard = (period?: DashboardPeriod) => {
  return useQuery({
    queryKey: taDashboardKeys.kpi(period),
    queryFn: () => taDashboardService.getKpiDashboard(period),
  });
};
