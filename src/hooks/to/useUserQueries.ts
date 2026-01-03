/**
 * TO(Tenant Operator) 사용자 관리 React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { userService } from '@/services/to';
import type { UserFilterParams, ChangeStatusRequest } from '@/types/to';

// ============================================
// Query Keys
// ============================================

export const adminUserKeys = {
  all: ['admin-users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (params?: UserFilterParams) => [...adminUserKeys.lists(), params] as const,
  details: () => [...adminUserKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminUserKeys.details(), id] as const,
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

/** 사용자 상세 조회 */
export const useUser = (id: number) => {
  return useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id,
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
