/**
 * TO Dashboard React Query Hooks (OPERATOR)
 */
import { useQuery } from '@tanstack/react-query';
import { toDashboardService } from '@/services/to';

// Query Keys
export const toDashboardKeys = {
  all: ['to-dashboard'] as const,
  tasks: () => [...toDashboardKeys.all, 'tasks'] as const,
};

/** TO 운영 대시보드 통계 조회 */
export const useToDashboard = () => {
  return useQuery({
    queryKey: toDashboardKeys.tasks(),
    queryFn: () => toDashboardService.getDashboard(),
  });
};
