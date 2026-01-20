/**
 * SA Analytics React Query Hooks (전체 시스템)
 */
import { useQuery } from '@tanstack/react-query';
import { saAnalyticsService, ActivityLogsParams, ActivityStatsParams } from '@/services/sa/analyticsService';

// Query Keys
export const saAnalyticsKeys = {
  all: ['sa-analytics'] as const,
  logs: (params?: ActivityLogsParams) => [...saAnalyticsKeys.all, 'logs', params] as const,
  stats: (params?: ActivityStatsParams) => [...saAnalyticsKeys.all, 'stats', params] as const,
  recent: (tenantId?: number) => [...saAnalyticsKeys.all, 'recent', tenantId] as const,
};

// ============================================
// Queries
// ============================================

/** 전체 시스템 활동 로그 목록 조회 */
export const useSaActivityLogs = (params?: ActivityLogsParams) => {
  return useQuery({
    queryKey: saAnalyticsKeys.logs(params),
    queryFn: () => saAnalyticsService.getLogs(params),
    staleTime: 1000 * 60 * 2, // 2분
    refetchOnWindowFocus: false,
  });
};

/** 전체 시스템 활동 통계 조회 */
export const useSaActivityStats = (params?: ActivityStatsParams) => {
  return useQuery({
    queryKey: saAnalyticsKeys.stats(params),
    queryFn: () => saAnalyticsService.getStats(params),
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
  });
};

/** 전체 시스템 최근 활동 목록 조회 */
export const useSaRecentActivities = (tenantId?: number) => {
  return useQuery({
    queryKey: saAnalyticsKeys.recent(tenantId),
    queryFn: () => saAnalyticsService.getRecentActivities(tenantId),
    staleTime: 1000 * 60 * 2, // 2분
    refetchOnWindowFocus: false,
  });
};
