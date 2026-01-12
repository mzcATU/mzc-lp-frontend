/**
 * CO Dashboard React Query Hooks (OPERATOR)
 */
import { useQuery } from '@tanstack/react-query';
import { coDashboardService, type DashboardPeriod } from '@/services/co';

// Query Keys
export const coDashboardKeys = {
  all: ['co-dashboard'] as const,
  tasks: (period?: DashboardPeriod) => [...coDashboardKeys.all, 'tasks', period ?? 'all'] as const,
};

/** CO 운영 대시보드 통계 조회 */
export const useCoDashboard = (period?: DashboardPeriod) => {
  return useQuery({
    queryKey: coDashboardKeys.tasks(period),
    queryFn: () => coDashboardService.getDashboard(period),
  });
};
