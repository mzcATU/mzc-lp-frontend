/**
 * 어드민 대시보드 관련 타입 정의
 */

import type { TenantStats, Tenant } from './tenant.types';
import type { UserStats } from './user.types';

// SA 대시보드 응답
export interface SADashboardResponse {
  tenantStats: TenantStats;
  userStats: {
    totalUsers: number;
    activeToday: number;
  };
  recentTenants: Tenant[];
  systemHealth: SystemHealth;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

// TA 대시보드 응답
export interface TADashboardResponse {
  userStats: UserStats;
  courseStats: CourseStats;
  enrollmentStats: EnrollmentStats;
  recentActivities: RecentActivity[];
}

export interface CourseStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  totalEnrollments: number;
}

export interface EnrollmentStats {
  total: number;
  inProgress: number;
  completed: number;
  avgCompletionRate: number;
  completionsThisMonth: number;
}

export interface RecentActivity {
  id: number;
  type: 'USER_JOINED' | 'COURSE_CREATED' | 'ENROLLMENT' | 'COURSE_COMPLETED' | 'ROLE_CHANGED';
  userId: number;
  userName: string;
  description: string;
  targetId?: number;
  targetName?: string;
  createdAt: string;
}
