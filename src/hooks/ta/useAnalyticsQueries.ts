/**
 * TA Analytics React Query Hooks
 */
import { useQuery } from '@tanstack/react-query';
import { analyticsService, ActivityLogsParams } from '@/services/ta/analyticsService';

// Query Keys
export const analyticsKeys = {
  all: ['ta-analytics'] as const,
  logs: (params?: ActivityLogsParams) => [...analyticsKeys.all, 'logs', params] as const,
  stats: (days: number) => [...analyticsKeys.all, 'stats', days] as const,
  recent: () => [...analyticsKeys.all, 'recent'] as const,
};

// ============================================
// Queries
// ============================================

/** 활동 로그 목록 조회 */
export const useActivityLogs = (params?: ActivityLogsParams) => {
  return useQuery({
    queryKey: analyticsKeys.logs(params),
    queryFn: () => analyticsService.getLogs(params),
    staleTime: 1000 * 60 * 2, // 2분
    refetchOnWindowFocus: false,
  });
};

/** 활동 통계 조회 */
export const useActivityStats = (days: number = 30) => {
  return useQuery({
    queryKey: analyticsKeys.stats(days),
    queryFn: () => analyticsService.getStats(days),
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
};

/** 최근 활동 목록 조회 */
export const useRecentActivities = () => {
  return useQuery({
    queryKey: analyticsKeys.recent(),
    queryFn: () => analyticsService.getRecentActivities(),
    staleTime: 1000 * 60 * 2, // 2분
    refetchOnWindowFocus: false,
  });
};
