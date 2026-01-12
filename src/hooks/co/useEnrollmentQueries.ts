/**
 * TO(Tenant Operator) 수강 관리 React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { adminEnrollmentService } from '@/services/co';
import type {
  EnrollmentFilterParams,
  ForceEnrollRequest,
  CompleteEnrollmentRequest,
  UpdateEnrollmentStatusRequest,
} from '@/types/co';

// ============================================
// Query Keys
// ============================================

export const adminEnrollmentKeys = {
  all: ['admin-enrollments'] as const,
  lists: () => [...adminEnrollmentKeys.all, 'list'] as const,
  byCourseTime: (courseTimeId: number, params?: EnrollmentFilterParams) =>
    [...adminEnrollmentKeys.lists(), 'courseTime', courseTimeId, params] as const,
  details: () => [...adminEnrollmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminEnrollmentKeys.details(), id] as const,
  stats: (courseTimeId: number) => [...adminEnrollmentKeys.all, 'stats', courseTimeId] as const,
};

// ============================================
// Query Hooks
// ============================================

/** 차수별 수강생 목록 조회 */
export const useEnrollmentsByCourseTime = (
  courseTimeId: number,
  params?: EnrollmentFilterParams
) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: adminEnrollmentKeys.byCourseTime(courseTimeId, params),
    queryFn: () => adminEnrollmentService.getEnrollmentsByCourseTime(courseTimeId, params),
    enabled: !!accessToken && !!courseTimeId,
  });
};

/** 수강 상세 조회 (관리자용) */
export const useAdminEnrollment = (id: number) => {
  return useQuery({
    queryKey: adminEnrollmentKeys.detail(id),
    queryFn: () => adminEnrollmentService.getEnrollment(id),
    enabled: !!id,
  });
};

/** 차수별 수강 통계 조회 */
export const useCourseTimeEnrollmentStats = (courseTimeId: number) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: adminEnrollmentKeys.stats(courseTimeId),
    queryFn: () => adminEnrollmentService.getCourseTimeStats(courseTimeId),
    enabled: !!accessToken && !!courseTimeId,
  });
};

// ============================================
// Mutation Hooks
// ============================================

/** 강제 배정 (필수 교육) */
export const useForceEnroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseTimeId,
      request,
    }: {
      courseTimeId: number;
      request: ForceEnrollRequest;
    }) => adminEnrollmentService.forceEnroll(courseTimeId, request),
    onSuccess: (_, variables) => {
      // params가 달라도 모든 해당 courseTime의 수강생 목록을 invalidate
      queryClient.invalidateQueries({
        queryKey: ['admin-enrollments', 'list', 'courseTime', variables.courseTimeId],
      });
      queryClient.invalidateQueries({
        queryKey: adminEnrollmentKeys.stats(variables.courseTimeId),
      });
    },
  });
};

/** 수료 처리 */
export const useCompleteEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: CompleteEnrollmentRequest }) =>
      adminEnrollmentService.completeEnrollment(id, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminEnrollmentKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: adminEnrollmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminEnrollmentKeys.stats(data.courseTimeId),
      });
    },
  });
};

/** 상태 변경 */
export const useUpdateEnrollmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateEnrollmentStatusRequest }) =>
      adminEnrollmentService.updateStatus(id, request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminEnrollmentKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: adminEnrollmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: adminEnrollmentKeys.stats(data.courseTimeId),
      });
    },
  });
};

/** 수강 취소 (관리자용) */
export const useAdminCancelEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminEnrollmentService.cancelEnrollment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminEnrollmentKeys.lists() });
    },
  });
};
