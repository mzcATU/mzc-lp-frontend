/**
 * TO(Tenant Operator) 사용자 관리 React Query Hooks
 */
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { userService } from '@/services/to';
import type { UserFilterParams, ChangeStatusRequest, EnrollmentFilterParams } from '@/types/to';

// ============================================
// Query Keys
// ============================================

export const adminUserKeys = {
  all: ['admin-users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (params?: UserFilterParams) => [...adminUserKeys.lists(), params] as const,
  infinite: (params?: Omit<UserFilterParams, 'page'>) => [...adminUserKeys.all, 'infinite', params] as const,
  details: () => [...adminUserKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminUserKeys.details(), id] as const,
  enrollments: (userId: number, params?: EnrollmentFilterParams) =>
    [...adminUserKeys.all, 'enrollments', userId, params] as const,
  enrollmentStats: (userId: number) => [...adminUserKeys.all, 'enrollment-stats', userId] as const,
  instructorStats: (userId: number) => [...adminUserKeys.all, 'instructor-stats', userId] as const,
};

// ============================================
// Query Hooks
// ============================================

/** 사용자 목록 조회 */
export const useUsers = (params?: UserFilterParams) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: () => userService.getUsers(params),
    enabled: !!accessToken,
  });
};

/** 사용자 목록 무한 스크롤 조회 */
export const useUsersInfinite = (params?: Omit<UserFilterParams, 'page'>) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const pageSize = params?.size ?? 20;

  return useInfiniteQuery({
    queryKey: adminUserKeys.infinite(params),
    queryFn: ({ pageParam = 0 }) =>
      userService.getUsers({ ...params, page: pageParam, size: pageSize }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // 마지막 페이지면 undefined 반환
      if (lastPage.number >= lastPage.totalPages - 1) {
        return undefined;
      }
      return lastPage.number + 1;
    },
    enabled: !!accessToken,
  });
};

/** 사용자 상세 조회 */
export const useUser = (id: number) => {
  return useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
};

/** 사용자별 수강 이력 조회 */
export const useUserEnrollments = (userId: number, params?: EnrollmentFilterParams) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: adminUserKeys.enrollments(userId, params),
    queryFn: () => userService.getUserEnrollments(userId, params),
    enabled: !!accessToken && !!userId,
  });
};

/** 사용자별 수강 통계 조회 */
export const useUserEnrollmentStats = (userId: number) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: adminUserKeys.enrollmentStats(userId),
    queryFn: () => userService.getUserEnrollmentStats(userId),
    enabled: !!accessToken && !!userId,
  });
};

/** 사용자별 강사 통계 조회 (DESIGNER 역할용) */
export const useUserInstructorStats = (userId: number, enabled: boolean = true) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: adminUserKeys.instructorStats(userId),
    queryFn: () => userService.getUserInstructorStats(userId),
    enabled: !!accessToken && !!userId && enabled,
  });
};

// ============================================
// Mutation Hooks
// ============================================

/** 사용자 상태 변경 */
export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: ChangeStatusRequest }) =>
      userService.changeStatus(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() });
    },
  });
};
