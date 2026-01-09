/**
 * 어드민 대시보드 관련 타입 정의
 * - SA Dashboard: GET /api/sa/dashboard
 * - TA Dashboard: GET /api/admin/dashboard/kpi
 */

// ============================================================
// SA Dashboard (SYSTEM_ADMIN)
// ============================================================

/** SA 대시보드 응답 */
export interface SaDashboardResponse {
  tenantStats: SaTenantStats;
  userStats: SaUserStats;
  recentTenants: SaRecentTenant[];
}

/** SA 대시보드 - 테넌트 통계 */
export interface SaTenantStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  terminated: number;
  byPlan: Record<string, number>;
}

/** SA 대시보드 - 사용자 통계 */
export interface SaUserStats {
  total: number;
  active: number;
  suspended: number;
  withdrawn: number;
}

/** SA 대시보드 - 최근 테넌트 */
export interface SaRecentTenant {
  id: number;
  code: string;
  name: string;
  status: string;
  plan: string;
  createdAt: string;
}

// ============================================================
// TA Dashboard (TENANT_ADMIN) - KPI Dashboard
// ============================================================

/** TA KPI 대시보드 응답 */
export interface TaKpiDashboardResponse {
  userStats: TaUserStats;
  programStats: TaProgramStats;
  enrollmentStats: TaEnrollmentStats;
  dailyTrend: TaDailyTrend[];
}

/** TA 대시보드 - 사용자 통계 */
export interface TaUserStats {
  active: number;
  inactive: number;
  suspended: number;
  withdrawn: number;
  total: number;
  newThisMonth: number;
}

/** TA 대시보드 - 프로그램 통계 */
export interface TaProgramStats {
  draft: number;
  pending: number;
  approved: number;
  rejected: number;
  closed: number;
  total: number;
}

/** TA 대시보드 - 수강 통계 */
export interface TaEnrollmentStats {
  totalEnrollments: number;
  byStatus: TaEnrollmentByStatus;
  completionRate: number;
}

/** TA 대시보드 - 수강 상태별 통계 */
export interface TaEnrollmentByStatus {
  enrolled: number;
  completed: number;
  dropped: number;
  failed: number;
}

/** TA 대시보드 - 일별 추이 */
export interface TaDailyTrend {
  date: string;
  enrollments: number;
  completions: number;
}
