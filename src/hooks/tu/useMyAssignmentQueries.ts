/**
 * My Assignment React Query Hooks (TU - 강사 본인용)
 */
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { myAssignmentService } from '@/services/tu/myAssignmentService';

// Query Keys
export const myAssignmentKeys = {
  all: ['my-assignments'] as const,
  list: () => [...myAssignmentKeys.all, 'list'] as const,
  statistics: (startDate?: string, endDate?: string) =>
    [...myAssignmentKeys.all, 'statistics', { startDate, endDate }] as const,
  courseTimeEnrollments: (timeId: number) =>
    [...myAssignmentKeys.all, 'course-time-enrollments', timeId] as const,
};

/**
 * 내 강사 배정 목록 조회 훅
 *
 * @description
 * 현재 로그인한 사용자의 강사 배정 목록을 조회합니다.
 * 인증된 사용자만 접근 가능합니다.
 *
 * @returns 강사 배정 목록
 *
 * @example
 * ```tsx
 * const { data: assignments, isLoading } = useMyAssignments();
 *
 * if (isLoading) return <div>로딩 중...</div>;
 *
 * return (
 *   <div>
 *     {assignments?.map(assignment => (
 *       <div key={assignment.id}>
 *         {assignment.userName} - {assignment.role}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useMyAssignments = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: myAssignmentKeys.list(),
    queryFn: () => myAssignmentService.getMyAssignments(),
    enabled: isAuthenticated,
  });
};

/**
 * 내 강사 통계 조회 훅
 *
 * @description
 * 현재 로그인한 사용자의 강사 활동 통계를 조회합니다.
 * 기간을 지정하지 않으면 전체 통계를 조회합니다.
 *
 * @param startDate - 시작일 (선택, YYYY-MM-DD)
 * @param endDate - 종료일 (선택, YYYY-MM-DD)
 * @returns 강사 통계 (총 배정 수, 역할별 배정 수, 차수별 통계)
 *
 * @example
 * ```tsx
 * // 전체 기간 통계
 * const { data: stats } = useMyInstructorStatistics();
 *
 * // 특정 기간 통계
 * const { data: stats } = useMyInstructorStatistics('2024-01-01', '2024-12-31');
 *
 * return (
 *   <div>
 *     <h2>총 배정: {stats?.totalCount}건</h2>
 *     <p>주강사: {stats?.mainCount}건</p>
 *     <p>보조강사: {stats?.subCount}건</p>
 *     <ul>
 *       {stats?.courseTimeStats.map(stat => (
 *         <li key={stat.timeKey}>
 *           {stat.courseName} - 수료율: {stat.completionRate}%
 *         </li>
 *       ))}
 *     </ul>
 *   </div>
 * );
 * ```
 */
export const useMyInstructorStatistics = (startDate?: string, endDate?: string) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: myAssignmentKeys.statistics(startDate, endDate),
    queryFn: () => myAssignmentService.getMyStatistics(startDate, endDate),
    enabled: isAuthenticated,
  });
};

/**
 * 차수 수강생 목록 조회 훅 (강사용)
 *
 * @description
 * 특정 차수의 수강생 목록과 통계를 조회합니다.
 * 강사가 배정된 차수의 수강생 현황을 확인하는 용도입니다.
 *
 * @param timeId - 차수 ID
 * @returns 수강생 목록 및 통계
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useCourseTimeEnrollments(1);
 *
 * return (
 *   <div>
 *     <h2>{data?.programName} - {data?.timeName}</h2>
 *     <p>총 수강생: {data?.stats.totalCount}명</p>
 *     <p>수료율: {data?.stats.completionRate}%</p>
 *   </div>
 * );
 * ```
 */
export const useCourseTimeEnrollments = (timeId: number) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: myAssignmentKeys.courseTimeEnrollments(timeId),
    queryFn: () => myAssignmentService.getCourseTimeEnrollments(timeId),
    enabled: isAuthenticated && !!timeId,
  });
};
