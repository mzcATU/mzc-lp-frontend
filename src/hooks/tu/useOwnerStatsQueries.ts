/**
 * Owner Stats React Query Hooks (TU - 강사용)
 */
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { ownerStatsService } from '@/services/tu/ownerStatsService';

// Query Keys
export const ownerStatsKeys = {
  all: ['owner-stats'] as const,
  my: () => [...ownerStatsKeys.all, 'my'] as const,
};

/**
 * 내 강사(Owner) 통계 조회 훅
 *
 * @description
 * 현재 로그인한 강사의 통계를 조회합니다.
 * 담당 프로그램, 수강생 현황, 수료율 등의 정보를 제공합니다.
 *
 * @returns 강사 통계 (overview, enrollmentStats, programStats)
 *
 * @example
 * ```tsx
 * const { data: stats, isLoading } = useMyOwnerStats();
 *
 * if (isLoading) return <Skeleton />;
 *
 * return (
 *   <div>
 *     <p>총 프로그램: {stats?.overview.totalPrograms}</p>
 *     <p>총 차수: {stats?.overview.totalCourseTimes}</p>
 *     <p>총 수강생: {stats?.overview.totalStudents}</p>
 *     <p>평균 수료율: {stats?.enrollmentStats.averageCompletionRate}%</p>
 *     <ul>
 *       {stats?.programStats.map(program => (
 *         <li key={program.programId}>
 *           {program.programName} - 수료율: {program.completionRate}%
 *         </li>
 *       ))}
 *     </ul>
 *   </div>
 * );
 * ```
 */
export const useMyOwnerStats = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ownerStatsKeys.my(),
    queryFn: () => ownerStatsService.getMyOwnerStats(),
    enabled: isAuthenticated,
  });
};
