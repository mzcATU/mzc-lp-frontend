/**
 * TO Dashboard React Query Hooks (OPERATOR)
 */
import { useQuery } from '@tanstack/react-query';
import { toDashboardService, type DashboardPeriod } from '@/services/co';

// Query Keys
export const toDashboardKeys = {
  all: ['to-dashboard'] as const,
  tasks: (period?: DashboardPeriod) => [...toDashboardKeys.all, 'tasks', period ?? 'all'] as const,
};

/** TO 운영 대시보드 통계 조회 */
export const useToDashboard = (period?: DashboardPeriod) => {
  return useQuery({
    queryKey: toDashboardKeys.tasks(period),
    queryFn: () => toDashboardService.getDashboard(period),
  });
};
