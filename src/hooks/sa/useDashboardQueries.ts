/**
 * SA Dashboard React Query Hooks
 */
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/sa/dashboardService';

// Query Keys
export const dashboardKeys = {
  all: ['sa-dashboard'] as const,
  dashboard: () => [...dashboardKeys.all, 'main'] as const,
};

// ============================================
// Queries
// ============================================

/** SA 대시보드 조회 */
export const useSaDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.dashboard(),
    queryFn: () => dashboardService.getDashboard(),
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
};
