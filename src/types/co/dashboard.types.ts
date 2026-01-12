/**
 * TO 운영 대시보드 관련 타입 정의
 * GET /api/operator/dashboard/tasks
 */

/** TO 운영 대시보드 응답 */
export interface ToOperatorDashboardResponse {
  pendingTasks: ToPendingTasks;
  courseTimeStats: ToCourseTimeStats;
  enrollmentStats: ToEnrollmentStats;
  dailyTrend: ToDailyEnrollment[];
}

/** 대기 중인 작업 */
export interface ToPendingTasks {
  programsPendingApproval: number;
  courseTimesNeedingInstructor: number;
}

/** 차수 통계 */
export interface ToCourseTimeStats {
  byStatus: ToCourseTimeByStatus;
  byDeliveryType: ToCourseTimeByDeliveryType;
  freeVsPaid: ToFreeVsPaid;
  total: number;
}

/** 차수 상태별 통계 */
export interface ToCourseTimeByStatus {
  draft: number;
  recruiting: number;
  ongoing: number;
  closed: number;
  archived: number;
}

/** 차수 운영 방식별 통계 */
export interface ToCourseTimeByDeliveryType {
  online: number;
  offline: number;
  blended: number;
  live: number;
}

/** 무료/유료 통계 */
export interface ToFreeVsPaid {
  free: number;
  paid: number;
}

/** 수강 통계 */
export interface ToEnrollmentStats {
  totalEnrollments: number;
  byStatus: ToEnrollmentByStatus;
  byType: ToEnrollmentByType;
  completionRate: number;
  averageCapacityUtilization: number;
}

/** 수강 상태별 통계 */
export interface ToEnrollmentByStatus {
  enrolled: number;
  completed: number;
  dropped: number;
  failed: number;
}

/** 수강 유형별 통계 */
export interface ToEnrollmentByType {
  voluntary: number;
  mandatory: number;
}

/** 일별 수강신청 추이 */
export interface ToDailyEnrollment {
  date: string;
  enrollments: number;
}
