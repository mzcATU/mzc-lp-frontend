/**
 * TO(Tenant Operator) 회원 풀 React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { memberPoolService } from '@/services/co/memberPoolService';
import type {
  CreateMemberPoolRequest,
  UpdateMemberPoolRequest,
  PreviewMembersRequest,
  MemberPoolQueryParams,
  MemberPoolMemberQueryParams,
} from '@/types/co/memberPool.types';

// ============================================
// Query Keys
// ============================================

export const memberPoolKeys = {
  all: ['memberPools'] as const,
  lists: () => [...memberPoolKeys.all, 'list'] as const,
  list: (params?: MemberPoolQueryParams) => [...memberPoolKeys.lists(), params] as const,
  details: () => [...memberPoolKeys.all, 'detail'] as const,
  detail: (id: number) => [...memberPoolKeys.details(), id] as const,
  members: (id: number, params?: MemberPoolMemberQueryParams) =>
    [...memberPoolKeys.detail(id), 'members', params] as const,
  matchCount: (id: number) => [...memberPoolKeys.detail(id), 'matchCount'] as const,
};

// ============================================
// Query Hooks
// ============================================

/**
 * 회원 풀 목록 조회
 */
export const useMemberPools = (params?: MemberPoolQueryParams) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: memberPoolKeys.list(params),
    queryFn: () => memberPoolService.getMemberPools(params),
    enabled: isAuthenticated,
  });
};

/**
 * 회원 풀 상세 조회
 */
export const useMemberPool = (id: number) => {
  return useQuery({
    queryKey: memberPoolKeys.detail(id),
    queryFn: () => memberPoolService.getMemberPool(id),
    enabled: !!id,
  });
};

/**
 * 회원 풀 멤버 조회
 */
export const useMemberPoolMembers = (
  id: number,
  params?: MemberPoolMemberQueryParams
) => {
  return useQuery({
    queryKey: memberPoolKeys.members(id, params),
    queryFn: () => memberPoolService.getMemberPoolMembers(id, params),
    enabled: !!id,
  });
};

/**
 * 회원 풀 매칭 카운트 조회
 */
export const useMemberPoolMatchCount = (id: number) => {
  return useQuery({
    queryKey: memberPoolKeys.matchCount(id),
    queryFn: () => memberPoolService.getMemberPoolMatchCount(id),
    enabled: !!id,
  });
};

// ============================================
// Mutation Hooks
// ============================================

/**
 * 회원 풀 생성
 */
export const useCreateMemberPool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateMemberPoolRequest) =>
      memberPoolService.createMemberPool(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberPoolKeys.lists() });
    },
  });
};

/**
 * 회원 풀 수정
 */
export const useUpdateMemberPool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...request }: { id: number } & UpdateMemberPoolRequest) =>
      memberPoolService.updateMemberPool(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: memberPoolKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: memberPoolKeys.lists() });
    },
  });
};

/**
 * 회원 풀 삭제
 */
export const useDeleteMemberPool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => memberPoolService.deleteMemberPool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberPoolKeys.lists() });
    },
  });
};

/**
 * 회원 풀 활성화
 */
export const useActivateMemberPool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => memberPoolService.activateMemberPool(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: memberPoolKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: memberPoolKeys.lists() });
    },
  });
};

/**
 * 회원 풀 비활성화
 */
export const useDeactivateMemberPool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => memberPoolService.deactivateMemberPool(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: memberPoolKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: memberPoolKeys.lists() });
    },
  });
};

/**
 * 멤버 미리보기
 */
export const usePreviewMembers = () => {
  return useMutation({
    mutationFn: (request: PreviewMembersRequest) =>
      memberPoolService.previewMembers(request),
  });
};
