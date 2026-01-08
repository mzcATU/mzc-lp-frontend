/**
 * User Group React Query Hooks (TA - Tenant Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService } from '@/services/ta';
import type {
  UserGroupListParams,
  CreateUserGroupRequest,
  UpdateUserGroupRequest,
} from '@/types/admin';

// Query Keys
export const groupKeys = {
  all: ['groups'] as const,
  lists: () => [...groupKeys.all, 'list'] as const,
  list: (params?: UserGroupListParams) => [...groupKeys.lists(), params] as const,
  active: () => [...groupKeys.all, 'active'] as const,
  details: () => [...groupKeys.all, 'detail'] as const,
  detail: (id: number) => [...groupKeys.details(), id] as const,
};

// ============================================
// Queries
// ============================================

/** 그룹 목록 조회 */
export const useGroups = (params?: UserGroupListParams) => {
  return useQuery({
    queryKey: groupKeys.list(params),
    queryFn: () => groupService.getGroups(params),
  });
};

/** 활성 그룹 목록 조회 */
export const useActiveGroups = () => {
  return useQuery({
    queryKey: groupKeys.active(),
    queryFn: () => groupService.getActiveGroups(),
  });
};

/** 그룹 상세 조회 */
export const useGroup = (id: number) => {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => groupService.getGroup(id),
    enabled: !!id,
  });
};

// ============================================
// Mutations
// ============================================

/** 그룹 생성 */
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateUserGroupRequest) => groupService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.active() });
    },
  });
};

/** 그룹 수정 */
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateUserGroupRequest }) =>
      groupService.update(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.active() });
    },
  });
};

/** 그룹 삭제 */
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => groupService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
      queryClient.invalidateQueries({ queryKey: groupKeys.active() });
    },
  });
};

/** 그룹에 멤버 추가 */
export const useAddGroupMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
      groupService.addMember(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
};

/** 그룹에서 멤버 제거 */
export const useRemoveGroupMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: number; userId: number }) =>
      groupService.removeMember(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: groupKeys.detail(variables.groupId) });
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
};
