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

// 리포트 타입
export type ReportType = 'USERS' | 'COURSES' | 'LEARNING' | 'COMPLETION' | 'ENGAGEMENT';

// 내보내기 형식
export type ExportFormat = 'CSV' | 'XLSX' | 'PDF';

// 리포트 기간
export type ReportPeriod = 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' | 'ALL';

// 리포트 타입 응답
export interface ReportTypeResponse {
  type: ReportType;
  name: string;
  description: string;
}

// 내보내기 작업 응답
export interface ExportJobResponse {
  id: number;
  reportType: string;
  format: string;
  period: string;
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED';
  createdAt: string;
  fileSize?: string;
}

// 내보내기 통계 응답
export interface ReportExportStatsResponse {
  monthlyCount: number;
  totalSize: string;
  mostPopular: string;
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

      // response.data는 이미 Blob이므로 그대로 사용
      const url = window.URL.createObjectURL(response.data);
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

  /** 리포트 유형 목록 조회 */
  async getReportTypes(): Promise<ReportTypeResponse[]> {
    const { data } = await axiosInstance.get<ReportTypeResponse[]>(
      `${API_ENDPOINTS.ANALYTICS.TA_BASE}/reports/types`
    );
    return data;
  },

  /** 리포트 내보내기 (CSV/XLSX/PDF) */
  async exportReport(params: {
    reportType: ReportType;
    format: ExportFormat;
    period: ReportPeriod;
  }): Promise<void> {
    try {
      // arraybuffer로 요청하여 바이너리 데이터를 정확하게 받음
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.ANALYTICS.TA_BASE}/reports/export`,
        {
          params,
          responseType: 'arraybuffer',
        }
      );

      // Content-Type 확인
      const contentType = response.headers['content-type'] || '';

      // Content-Type이 JSON이면 에러 응답임
      if (contentType.includes('application/json')) {
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(response.data);
        const errorData = JSON.parse(text);
        throw new Error(errorData.error?.message || '리포트 생성에 실패했습니다.');
      }

      // Content-Type에 따른 파일 확장자 결정
      let extension = '.csv';
      let mimeType = 'text/csv;charset=utf-8';
      if (params.format === 'XLSX') {
        extension = '.xlsx';
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else if (params.format === 'PDF') {
        extension = '.pdf';
        mimeType = 'application/pdf';
      }

      // 디버깅: response.data 상태 확인
      console.log('Export response:', {
        dataType: typeof response.data,
        isArrayBuffer: response.data instanceof ArrayBuffer,
        byteLength: response.data instanceof ArrayBuffer ? response.data.byteLength : 'N/A',
        contentType,
      });

      // ArrayBuffer를 Blob으로 변환
      const blob = new Blob([response.data], { type: mimeType });

      console.log('Final blob:', { size: blob.size, type: blob.type });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${params.reportType.toLowerCase()}_report_${Date.now()}${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      // axios 에러이고 arraybuffer 응답인 경우 에러 내용 읽기
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data instanceof ArrayBuffer
      ) {
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(error.response.data);
        console.error('Export error response:', text);
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error?.message || errorData.message || '리포트 생성에 실패했습니다.');
        } catch {
          throw new Error(text || '리포트 생성에 실패했습니다.');
        }
      }
      if (error instanceof Error && error.message) {
        throw error;
      }
      throw new Error('리포트 생성에 실패했습니다. 권한을 확인해주세요.');
    }
  },

  /** 내보내기 이력 조회 */
  async getExportHistory(limit: number = 10): Promise<ExportJobResponse[]> {
    const { data } = await axiosInstance.get<ExportJobResponse[]>(
      `${API_ENDPOINTS.ANALYTICS.TA_BASE}/reports/history`,
      { params: { limit } }
    );
    return data;
  },

  /** 내보내기 통계 조회 */
  async getExportStats(): Promise<ReportExportStatsResponse> {
    const { data } = await axiosInstance.get<ReportExportStatsResponse>(
      `${API_ENDPOINTS.ANALYTICS.TA_BASE}/reports/stats`
    );
    return data;
  },
};
