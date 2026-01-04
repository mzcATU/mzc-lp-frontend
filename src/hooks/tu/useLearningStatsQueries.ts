/**
 * Learning Stats React Query Hooks (TU - 학습자용)
 */
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { learningStatsService } from '@/services/tu/learningStatsService';

// Query Keys
export const learningStatsKeys = {
  all: ['learning-stats'] as const,
  my: () => [...learningStatsKeys.all, 'my'] as const,
};

/**
 * 내 학습 통계 조회 훅
 *
 * @description
 * 현재 로그인한 사용자의 학습 통계를 조회합니다.
 * 수강 현황, 수료율, 진도율 등의 정보를 제공합니다.
 *
 * @returns 학습 통계 (overview, progress)
 *
 * @example
 * ```tsx
 * const { data: stats, isLoading } = useMyLearningStats();
 *
 * if (isLoading) return <Skeleton />;
 *
 * return (
 *   <div>
 *     <p>전체 과정: {stats?.overview.totalCourses}</p>
 *     <p>진행 중: {stats?.overview.inProgress}</p>
 *     <p>수료 완료: {stats?.overview.completed}</p>
 *     <p>수료율: {stats?.overview.completionRate}%</p>
 *     <p>평균 진도율: {stats?.progress.averageProgress}%</p>
 *   </div>
 * );
 * ```
 */
export const useMyLearningStats = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: learningStatsKeys.my(),
    queryFn: () => learningStatsService.getMyLearningStats(),
    enabled: isAuthenticated,
  });
};
