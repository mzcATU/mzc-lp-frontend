/**
 * TO(Tenant Operator) 프로그램(Program) React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { programService, type ProgramFilterParams } from '@/services/co/programService';
import type { ApproveRequest, RejectRequest } from '@/types/common';

// ============================================
// Query Keys
// ============================================

export const programKeys = {
  all: ['programs'] as const,
  lists: () => [...programKeys.all, 'list'] as const,
  list: (params?: ProgramFilterParams) => [...programKeys.lists(), params] as const,
  details: () => [...programKeys.all, 'detail'] as const,
  detail: (id: number) => [...programKeys.details(), id] as const,
  pending: () => [...programKeys.all, 'pending'] as const,
  pendingList: (params?: Pick<ProgramFilterParams, 'page' | 'size' | 'sort'>) =>
    [...programKeys.pending(), params] as const,
};

// ============================================
// Query Hooks
// ============================================

/** 프로그램 목록 조회 */
export const usePrograms = (params?: ProgramFilterParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: programKeys.list(params),
    queryFn: () => programService.getPrograms(params),
    enabled: isAuthenticated,
  });
};

/** 승인된 프로그램 목록 조회 (차수 생성용) */
export const useApprovedPrograms = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: programKeys.list({ status: 'APPROVED' }),
    queryFn: () => programService.getPrograms({ status: 'APPROVED', size: 100 }),
    enabled: isAuthenticated,
  });
};

/** 프로그램 상세 조회 */
export const useProgram = (id: number) => {
  return useQuery({
    queryKey: programKeys.detail(id),
    queryFn: () => programService.getProgram(id),
    enabled: !!id,
  });
};

/** 검토 대기 프로그램 목록 조회 */
export const usePendingPrograms = (
  params?: Pick<ProgramFilterParams, 'page' | 'size' | 'sort'>
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: programKeys.pendingList(params),
    queryFn: () => programService.getPendingPrograms(params),
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
      programService.approveProgram(id, request),
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
      programService.rejectProgram(id, request),
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
    mutationFn: (id: number) => programService.closeProgram(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: programKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
    },
  });
};
