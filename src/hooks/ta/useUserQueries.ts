/**
 * User React Query Hooks (TA - Tenant Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/ta';
import { useAuthStore } from '@/store/common/authStore';
import { authKeys } from '@/hooks/common/auth/useAuth';
import type {
  UserListParams,
  UpdateUserDetailRequest,
  UpdateUserRoleRequest,
  UpdateUserRolesRequest,
  BulkCreateUsersRequest,
  SystemRole,
} from '@/types/admin';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  roles: (id: number) => [...userKeys.detail(id), 'roles'] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
};

// ============================================
// Queries
// ============================================

/** 사용자 목록 조회 */
export const useUsers = (params?: UserListParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
  });
};

/** 사용자 상세 조회 */
export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
};

/** 사용자 역할 목록 조회 */
export const useUserRoles = (id: number) => {
  return useQuery({
    queryKey: userKeys.roles(id),
    queryFn: () => userService.getUserRoles(id),
    enabled: !!id,
  });
};

/** 사용자 통계 조회 */
export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userService.getStats(),
  });
};

// ============================================
// Mutations
// ============================================

/** 사용자 정보 수정 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateUserDetailRequest }) =>
      userService.update(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/** 사용자 역할 변경 (단일) */
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateUserRoleRequest }) =>
      userService.updateRole(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/** 사용자 역할 전체 업데이트 (다중 역할) */
export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateUserRolesRequest }) =>
      userService.updateUserRoles(id, request),
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.roles(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // 현재 로그인한 사용자의 역할이 변경된 경우 store 직접 업데이트
      const currentUserId = useAuthStore.getState().user?.id;
      if (currentUserId === variables.id) {
        queryClient.invalidateQueries({ queryKey: authKeys.me() });
        // store에 새 roles 직접 업데이트
        useAuthStore.getState().updateUser({ roles: variables.request.roles });
      }
    },
  });
};

/** 사용자에게 역할 추가 */
export const useAddUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: SystemRole }) =>
      userService.addUserRole(id, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.roles(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // 현재 로그인한 사용자의 역할이 변경된 경우 store 직접 업데이트
      const authState = useAuthStore.getState();
      if (authState.user?.id === variables.id) {
        queryClient.invalidateQueries({ queryKey: authKeys.me() });
        const currentRoles = authState.user?.roles || [];
        if (!currentRoles.includes(variables.role)) {
          authState.updateUser({ roles: [...currentRoles, variables.role] });
        }
      }
    },
  });
};

/** 사용자에서 역할 제거 */
export const useRemoveUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: SystemRole }) =>
      userService.removeUserRole(id, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.roles(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // 현재 로그인한 사용자의 역할이 변경된 경우 store 직접 업데이트
      const authState = useAuthStore.getState();
      if (authState.user?.id === variables.id) {
        queryClient.invalidateQueries({ queryKey: authKeys.me() });
        const currentRoles = authState.user?.roles || [];
        authState.updateUser({ roles: currentRoles.filter(r => r !== variables.role) });
      }
    },
  });
};

/** 사용자 상태 변경 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      userService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/** 사용자 삭제 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};

/** 단체 계정 생성 */
export const useBulkCreateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BulkCreateUsersRequest) => userService.bulkCreateUsers(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};
