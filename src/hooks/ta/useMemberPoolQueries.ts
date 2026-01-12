/**
 * TA(Tenant Admin) 회원 풀 React Query Hooks
 * TA는 회원 풀 조회만 가능 (CRUD는 TO에서 담당)
 */
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { memberPoolService } from '@/services/ta/memberPoolService';
import type { MemberPoolQueryParams, MemberPoolMemberQueryParams } from '@/types/co/memberPool.types';

// ============================================
// Query Keys
// ============================================

export const memberPoolKeys = {
  all: ['ta', 'memberPools'] as const,
  lists: () => [...memberPoolKeys.all, 'list'] as const,
  list: (params?: MemberPoolQueryParams) => [...memberPoolKeys.lists(), params] as const,
  details: () => [...memberPoolKeys.all, 'detail'] as const,
  detail: (id: number) => [...memberPoolKeys.details(), id] as const,
  members: (id: number, params?: MemberPoolMemberQueryParams) =>
    [...memberPoolKeys.detail(id), 'members', params] as const,
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
export const useMemberPoolMembers = (id: number, params?: MemberPoolMemberQueryParams) => {
  return useQuery({
    queryKey: memberPoolKeys.members(id, params),
    queryFn: () => memberPoolService.getMemberPoolMembers(id, params),
    enabled: !!id,
  });
};
