/**
 * SA Analytics API 서비스 (전체 시스템)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';

// ActivityType 열거형
export type ActivityType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'PASSWORD_CHANGE'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'ROLE_CHANGE'
  | 'COURSE_VIEW'
  | 'COURSE_CREATE'
  | 'COURSE_UPDATE'
  | 'COURSE_DELETE'
  | 'PROGRAM_CREATE'
  | 'PROGRAM_UPDATE'
  | 'PROGRAM_APPROVE'
  | 'PROGRAM_REJECT'
  | 'ENROLLMENT_CREATE'
  | 'ENROLLMENT_COMPLETE'
  | 'ENROLLMENT_DROP'
  | 'CONTENT_VIEW'
  | 'CONTENT_COMPLETE'
  | 'SETTINGS_UPDATE'
  | 'TENANT_CREATE'
  | 'TENANT_UPDATE'
  | 'OTHER';

// 활동 로그 응답 타입
export interface ActivityLogResponse {
  id: number;
  tenantId: number | null;
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  activityType: ActivityType;
  activityTypeLabel: string;
  description: string;
  targetType: string | null;
  targetId: number | null;
  targetName: string | null;
  ipAddress: string | null;
  createdAt: string;
}

// 일별 활동 카운트
export interface DailyActivityCount {
  date: string;
  count: number;
}

// 시간대별 활동 카운트
export interface HourlyActivityCount {
  hour: number;
  count: number;
}

// 활동 통계 응답 타입
export interface ActivityStatsResponse {
  totalActivities: number;
  todayActivities: number;
  activeUsers: number;
  byActivityType: Record<string, number>;
  dailyTrend: DailyActivityCount[];
  hourlyTrend: HourlyActivityCount[];
}

// 페이징 응답 타입
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 요청 파라미터
export interface ActivityLogsParams {
  type?: ActivityType;
  tenantId?: number;
  page?: number;
  size?: number;
}

export interface ActivityStatsParams {
  days?: number;
  tenantId?: number;
}

export const saAnalyticsService = {
  /** 전체 시스템 활동 로그 목록 조회 */
  async getLogs(params?: ActivityLogsParams): Promise<Page<ActivityLogResponse>> {
    const { data } = await axiosInstance.get<Page<ActivityLogResponse>>(
      API_ENDPOINTS.ANALYTICS.SA_LOGS,
      { params }
    );
    return data;
  },

  /** 전체 시스템 활동 통계 조회 */
  async getStats(params?: ActivityStatsParams): Promise<ActivityStatsResponse> {
    const { data } = await axiosInstance.get<ActivityStatsResponse>(
      API_ENDPOINTS.ANALYTICS.SA_STATS,
      { params }
    );
    return data;
  },

  /** 전체 시스템 최근 활동 목록 조회 */
  async getRecentActivities(tenantId?: number): Promise<ActivityLogResponse[]> {
    const { data } = await axiosInstance.get<ActivityLogResponse[]>(
      API_ENDPOINTS.ANALYTICS.SA_RECENT,
      { params: tenantId ? { tenantId } : undefined }
    );
    return data;
  },
};
