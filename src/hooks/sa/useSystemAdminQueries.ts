/**
 * System Admin User React Query Hooks (SA)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { saUserService, type SystemAdminFilterParams } from '@/services/sa';
import type { CreateSystemAdminRequest } from '@/types/admin';

// Query Keys
export const systemAdminKeys = {
  all: ['systemAdmins'] as const,
  lists: () => [...systemAdminKeys.all, 'list'] as const,
  list: (params?: SystemAdminFilterParams) => [...systemAdminKeys.lists(), params] as const,
};

// ============================================
// Queries
// ============================================

/** SYSTEM_ADMIN 사용자 목록 조회 */
export const useSystemAdmins = (params?: SystemAdminFilterParams) => {
  return useQuery({
    queryKey: systemAdminKeys.list(params),
    queryFn: () => saUserService.getSystemAdmins(params),
  });
};

// ============================================
// Mutations
// ============================================

/** SYSTEM_ADMIN 사용자 생성 */
export const useCreateSystemAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateSystemAdminRequest) => saUserService.createSystemAdmin(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemAdminKeys.lists() });
    },
  });
};
