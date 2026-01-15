/**
 * TO(Tenant Operator) 프로그램(Program) React Query Hooks
 *
 * @deprecated Phase 3: Program 엔티티가 제거되었습니다.
 * 이 hooks는 내부적으로 Course API를 호출합니다.
 * 점진적 전환을 위해 유지됩니다.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { courseService, type CourseFilterParams } from '@/services/co/courseService';
import type { ApproveRequest, RejectRequest } from '@/types/common';

// ============================================
// Query Keys
// ============================================

export const programKeys = {
  all: ['programs'] as const,
  lists: () => [...programKeys.all, 'list'] as const,
  list: (params?: CourseFilterParams) => [...programKeys.lists(), params] as const,
  details: () => [...programKeys.all, 'detail'] as const,
  detail: (id: number) => [...programKeys.details(), id] as const,
  pending: () => [...programKeys.all, 'pending'] as const,
  pendingList: (params?: Pick<CourseFilterParams, 'page' | 'size' | 'sort'>) =>
    [...programKeys.pending(), params] as const,
};

// ============================================
// Query Hooks
// ============================================

/** 프로그램 목록 조회 */
export const usePrograms = (params?: CourseFilterParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: programKeys.list(params),
    queryFn: () => courseService.getPrograms(params),
    enabled: isAuthenticated,
  });
};

/**
 * 승인된 프로그램 목록 조회 (차수 생성용)
 * @deprecated Phase 3: status 'APPROVED' → 'REGISTERED'
 */
export const useApprovedPrograms = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    // Phase 3: APPROVED → REGISTERED (Course의 등록 완료 상태)
    queryKey: programKeys.list({ status: 'REGISTERED' as CourseFilterParams['status'] }),
    queryFn: () => courseService.getPrograms({ status: 'REGISTERED' as CourseFilterParams['status'], size: 100 }),
    enabled: isAuthenticated,
  });
};

/** 프로그램 상세 조회 */
export const useProgram = (id: number) => {
  return useQuery({
    queryKey: programKeys.detail(id),
    queryFn: () => courseService.getProgram(id),
    enabled: !!id,
  });
};

/** 검토 대기 프로그램 목록 조회 */
export const usePendingPrograms = (
  params?: Pick<CourseFilterParams, 'page' | 'size' | 'sort'>
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: programKeys.pendingList(params),
    queryFn: () => courseService.getPendingPrograms(params),
    enabled: isAuthenticated,
  });
};

// ============================================
// Mutation Hooks - 승인/반려
// ============================================

/** 프로그램 승인 (PENDING → APPROVED) */
export const useApproveProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request?: ApproveRequest }) =>
      courseService.approveProgram(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: programKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programKeys.pending() });
    },
  });
};

/** 프로그램 반려 (PENDING → REJECTED) */
export const useRejectProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: RejectRequest }) =>
      courseService.rejectProgram(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: programKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      queryClient.invalidateQueries({ queryKey: programKeys.pending() });
    },
  });
};

/** 프로그램 종료 (APPROVED/DRAFT → CLOSED) */
export const useCloseProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => courseService.closeProgram(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: programKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
    },
  });
};
