/**
 * TA Analytics API 서비스
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
  page?: number;
  size?: number;
}

// 검색 파라미터
export interface ActivityLogSearchParams {
  userId?: number;
  type?: ActivityType;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

// 활동 유형 정보
export interface ActivityTypeInfo {
  type: ActivityType;
  description: string;
}

export const analyticsService = {
  /** 활동 로그 목록 조회 */
  async getLogs(params?: ActivityLogsParams): Promise<Page<ActivityLogResponse>> {
    const { data } = await axiosInstance.get<Page<ActivityLogResponse>>(
      API_ENDPOINTS.ANALYTICS.TA_LOGS,
      { params }
    );
    return data;
  },

  /** 활동 통계 조회 */
  async getStats(days: number = 30): Promise<ActivityStatsResponse> {
    const { data } = await axiosInstance.get<ActivityStatsResponse>(
      API_ENDPOINTS.ANALYTICS.TA_STATS,
      { params: { days } }
    );
    return data;
  },

  /** 최근 활동 목록 조회 */
  async getRecentActivities(): Promise<ActivityLogResponse[]> {
    const { data } = await axiosInstance.get<ActivityLogResponse[]>(
      API_ENDPOINTS.ANALYTICS.TA_RECENT
    );
    return data;
  },

  /** 활동 로그 검색 */
  async searchLogs(params: ActivityLogSearchParams): Promise<Page<ActivityLogResponse>> {
    const { data } = await axiosInstance.get<Page<ActivityLogResponse>>(
      `${API_ENDPOINTS.ANALYTICS.TA_LOGS}/search`,
      { params }
    );
    return data;
  },

  /** 특정 사용자 활동 로그 조회 */
  async getLogsByUser(userId: number, params?: { page?: number; size?: number }): Promise<Page<ActivityLogResponse>> {
    const { data } = await axiosInstance.get<Page<ActivityLogResponse>>(
      `${API_ENDPOINTS.ANALYTICS.TA_LOGS}/users/${userId}`,
      { params }
    );
    return data;
  },

  /** 활동 유형 목록 조회 */
  async getActivityTypes(): Promise<ActivityTypeInfo[]> {
    const { data } = await axiosInstance.get<ActivityTypeInfo[]>(
      API_ENDPOINTS.ANALYTICS.TA_TYPES
    );
    return data;
  },

  /** 활동 로그 CSV 내보내기 (Blob 다운로드) */
  async exportLogs(params?: {
    userId?: number;
    type?: ActivityType;
    startDate?: string;
    endDate?: string;
  }): Promise<void> {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.ANALYTICS.TA_LOGS}/export`,
        {
          params,
          responseType: 'blob',
        }
      );

      // Content-Type이 JSON이면 에러 응답임
      const contentType = response.headers['content-type'];
      if (contentType?.includes('application/json')) {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.error?.message || '내보내기에 실패했습니다.');
      }

      // Blob으로 파일 다운로드
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `activity_logs_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      // axios 에러이고 blob 응답인 경우 에러 내용 읽기
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data instanceof Blob
      ) {
        const text = await error.response.data.text();
        console.error('Export error response:', text);
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error?.message || errorData.message || '내보내기에 실패했습니다.');
        } catch {
          // JSON 파싱 실패시 text 내용 그대로 사용
          throw new Error(text || '내보내기에 실패했습니다.');
        }
      }
      if (error instanceof Error && error.message) {
        throw error;
      }
      throw new Error('CSV 내보내기에 실패했습니다. 권한을 확인해주세요.');
    }
  },
};
