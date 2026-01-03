/**
 * SA Analytics API 서비스 (전체 시스템)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  ActivityType,
  ActivityLogResponse,
  ActivityStatsResponse,
  Page,
  ActivityLogsParams,
} from '@/services/ta/analyticsService';

// TA와 동일한 타입 re-export
export type {
  ActivityType,
  ActivityLogResponse,
  ActivityStatsResponse,
  Page,
  ActivityLogsParams,
};

export const saAnalyticsService = {
  /** 전체 시스템 활동 로그 목록 조회 */
  async getLogs(params?: ActivityLogsParams): Promise<Page<ActivityLogResponse>> {
    const { data } = await axiosInstance.get<{ data: Page<ActivityLogResponse> }>(
      API_ENDPOINTS.ANALYTICS.SA_LOGS,
      { params }
    );
    return data.data;
  },

  /** 전체 시스템 활동 통계 조회 */
  async getStats(days: number = 30): Promise<ActivityStatsResponse> {
    const { data } = await axiosInstance.get<{ data: ActivityStatsResponse }>(
      API_ENDPOINTS.ANALYTICS.SA_STATS,
      { params: { days } }
    );
    return data.data;
  },

  /** 전체 시스템 최근 활동 목록 조회 */
  async getRecentActivities(): Promise<ActivityLogResponse[]> {
    const { data } = await axiosInstance.get<{ data: ActivityLogResponse[] }>(
      API_ENDPOINTS.ANALYTICS.SA_RECENT
    );
    return data.data;
  },
};
