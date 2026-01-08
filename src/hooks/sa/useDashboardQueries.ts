/**
 * SA Dashboard React Query Hooks (SYSTEM_ADMIN)
 */
import { useQuery } from '@tanstack/react-query';
import { saDashboardService } from '@/services/sa';

// Query Keys
export const saDashboardKeys = {
  all: ['sa-dashboard'] as const,
  dashboard: () => [...saDashboardKeys.all, 'stats'] as const,
};

/** SA 대시보드 통계 조회 */
export const useSaDashboard = () => {
  return useQuery({
    queryKey: saDashboardKeys.dashboard(),
    queryFn: () => saDashboardService.getDashboard(),
  });
};
