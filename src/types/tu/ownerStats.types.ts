/**
 * TU 강사(Owner) 통계 타입 정의
 * GET /api/owners/me/stats
 */

/** 강사 통계 개요 */
export interface OwnerStatsOverview {
  /** 총 프로그램 수 */
  totalPrograms: number;
  /** 총 차수 수 */
  totalCourseTimes: number;
  /** 총 수강생 수 */
  totalStudents: number;
}

/** 수강 신청 통계 */
export interface OwnerEnrollmentStats {
  /** 총 수강 신청 수 */
  totalEnrollments: number;
  /** 수료 완료 수 */
  completed: number;
  /** 진행 중 수 */
  inProgress: number;
  /** 중도 포기 수 */
  dropped: number;
  /** 평균 수료율 (%) */
  averageCompletionRate: number;
}

/** 프로그램별 통계 */
export interface OwnerProgramStats {
  /** 프로그램 ID */
  programId: number;
  /** 프로그램명 */
  programName: string;
  /** 차수 수 */
  courseTimeCount: number;
  /** 총 수강생 */
  totalStudents: number;
  /** 수료율 (%) */
  completionRate: number;
}

/** 강사(Owner) 통계 응답 */
export interface OwnerStatsResponse {
  overview: OwnerStatsOverview;
  enrollmentStats: OwnerEnrollmentStats;
  programStats: OwnerProgramStats[];
}
