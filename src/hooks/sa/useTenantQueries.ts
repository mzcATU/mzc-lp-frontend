/**
 * Tenant React Query Hooks (SA - System Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantService, type TenantFilterParams } from '@/services/sa';
import type { CreateTenantRequest, UpdateTenantDetailRequest } from '@/types/admin';

// Query Keys
export const tenantKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  list: (params?: TenantFilterParams) => [...tenantKeys.lists(), params] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: number) => [...tenantKeys.details(), id] as const,
  stats: () => [...tenantKeys.all, 'stats'] as const,
  userStats: () => [...tenantKeys.all, 'userStats'] as const,
};

// ============================================
// Queries
// ============================================

/** 테넌트 목록 조회 */
export const useTenants = (params?: TenantFilterParams) => {
  return useQuery({
    queryKey: tenantKeys.list(params),
    queryFn: () => tenantService.getTenants(params),
  });
};

/** 테넌트 상세 조회 */
export const useTenant = (id: number) => {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => tenantService.getTenant(id),
    enabled: !!id,
  });
};

/** 테넌트 통계 조회 */
export const useTenantStats = () => {
  return useQuery({
    queryKey: tenantKeys.stats(),
    queryFn: () => tenantService.getStats(),
  });
};

/** 테넌트별 사용자 수 통계 조회 */
export const useTenantUserStats = () => {
  return useQuery({
    queryKey: tenantKeys.userStats(),
    queryFn: () => tenantService.getUserStats(),
  });
};

// ============================================
// Mutations
// ============================================

/** 테넌트 생성 */
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTenantRequest) => tenantService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.stats() });
    },
  });
};

/** 테넌트 수정 */
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateTenantDetailRequest }) =>
      tenantService.update(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
};

/** 테넌트 삭제 */
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tenantService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.stats() });
    },
  });
};

/** 커스텀 도메인 삭제 */
export const useDeleteCustomDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: number) => tenantService.deleteCustomDomain(tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
    },
  });
};
