/**
 * 활동 로그 관련 타입 정의
 */

// 활동 유형
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

// 활동 로그 응답
export interface ActivityLogResponse {
  id: number;
  tenantId: number;
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  activityType: ActivityType;
  description: string | null;
  targetType: string | null;
  targetId: number | null;
  targetName: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: string | null;
  createdAt: string;
}

// 활동 유형 정보
export interface ActivityTypeInfo {
  type: ActivityType;
  description: string;
}

// 활동 통계 응답
export interface ActivityStatsResponse {
  totalActivities: number;
  todayActivities: number;
  activeUsers: number;
  byActivityType: Record<string, number>;
  dailyTrend: DailyActivityCount[];
  hourlyTrend: HourlyActivityCount[];
}

export interface DailyActivityCount {
  date: string;
  count: number;
}

export interface HourlyActivityCount {
  hour: number;
  count: number;
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
