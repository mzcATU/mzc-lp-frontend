/**
 * CO 운영 대시보드 관련 타입 정의
 * GET /api/operator/dashboard/tasks
 */

/** CO 운영 대시보드 응답 */
export interface CoOperatorDashboardResponse {
  pendingTasks: CoPendingTasks;
  courseTimeStats: CoCourseTimeStats;
  enrollmentStats: CoEnrollmentStats;
  dailyTrend: CoDailyEnrollment[];
}

/** 대기 중인 작업 */
export interface CoPendingTasks {
  programsPendingApproval: number;
  courseTimesNeedingInstructor: number;
}

/** 차수 통계 */
export interface CoCourseTimeStats {
  byStatus: CoCourseTimeByStatus;
  byDeliveryType: CoCourseTimeByDeliveryType;
  freeVsPaid: CoFreeVsPaid;
  total: number;
}

/** 차수 상태별 통계 */
export interface CoCourseTimeByStatus {
  draft: number;
  recruiting: number;
  ongoing: number;
  closed: number;
  archived: number;
}

/** 차수 운영 방식별 통계 */
export interface CoCourseTimeByDeliveryType {
  online: number;
  offline: number;
  blended: number;
  live: number;
}

/** 무료/유료 통계 */
export interface CoFreeVsPaid {
  free: number;
  paid: number;
}

/** 수강 통계 */
export interface CoEnrollmentStats {
  totalEnrollments: number;
  byStatus: CoEnrollmentByStatus;
  byType: CoEnrollmentByType;
  completionRate: number;
  averageCapacityUtilization: number;
}

/** 수강 상태별 통계 */
export interface CoEnrollmentByStatus {
  enrolled: number;
  completed: number;
  dropped: number;
  failed: number;
}

/** 수강 유형별 통계 */
export interface CoEnrollmentByType {
  voluntary: number;
  mandatory: number;
}

/** 일별 수강신청 추이 */
export interface CoDailyEnrollment {
  date: string;
  enrollments: number;
}
