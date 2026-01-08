/**
 * SA Dashboard React Query Hooks (SYSTEM_ADMIN)
 */
import { useQuery } from '@tanstack/react-query';
import { saDashboardService, type DashboardPeriod } from '@/services/sa';

// Query Keys
export const saDashboardKeys = {
  all: ['sa-dashboard'] as const,
  dashboard: (period?: DashboardPeriod) => [...saDashboardKeys.all, 'stats', period ?? 'all'] as const,
};

/** SA 대시보드 통계 조회 */
export const useSaDashboard = (period?: DashboardPeriod) => {
  return useQuery({
    queryKey: saDashboardKeys.dashboard(period),
    queryFn: () => saDashboardService.getDashboard(period),
  });
};
