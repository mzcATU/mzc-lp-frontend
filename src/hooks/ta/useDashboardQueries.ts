/**
 * TA Dashboard React Query Hooks (TENANT_ADMIN)
 */
import { useQuery } from '@tanstack/react-query';
import { taDashboardService } from '@/services/ta';

// Query Keys
export const taDashboardKeys = {
  all: ['ta-dashboard'] as const,
  kpi: () => [...taDashboardKeys.all, 'kpi'] as const,
};

/** TA KPI 대시보드 통계 조회 */
export const useTaKpiDashboard = () => {
  return useQuery({
    queryKey: taDashboardKeys.kpi(),
    queryFn: () => taDashboardService.getKpiDashboard(),
  });
};
