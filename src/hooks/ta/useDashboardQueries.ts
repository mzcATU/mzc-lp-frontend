/**
 * TA Dashboard React Query Hooks
 */
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/ta/dashboardService';

// Query Keys
export const dashboardKeys = {
  all: ['ta-dashboard'] as const,
  kpi: () => [...dashboardKeys.all, 'kpi'] as const,
};

// ============================================
// Queries
// ============================================

/** TA KPI 대시보드 조회 */
export const useTaDashboardKpi = () => {
  return useQuery({
    queryKey: dashboardKeys.kpi(),
    queryFn: () => dashboardService.getKpi(),
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
};
