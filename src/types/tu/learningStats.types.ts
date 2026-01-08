/**
 * TU 내 학습 통계 타입 정의
 * GET /api/users/me/learning-stats
 */

/** 학습 유형별 통계 */
export interface LearningStatsByType {
  type: string;
  count: number;
}

/** 학습 통계 개요 */
export interface LearningStatsOverview {
  /** 전체 수강 과정 수 */
  totalCourses: number;
  /** 진행 중 */
  inProgress: number;
  /** 수료 완료 */
  completed: number;
  /** 중도 포기 */
  dropped: number;
  /** 미수료 (기간 만료) */
  failed: number;
  /** 수료율 (%) */
  completionRate: number;
  /** 유형별 통계 */
  byType: LearningStatsByType[];
}

/** 학습 진도 통계 */
export interface LearningStatsProgress {
  /** 평균 진도율 (%) */
  averageProgress: number;
  /** 평균 점수 */
  averageScore: number;
}

/** 내 학습 통계 응답 */
export interface LearningStatsResponse {
  overview: LearningStatsOverview;
  progress: LearningStatsProgress;
}
