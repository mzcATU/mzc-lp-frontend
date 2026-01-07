/**
 * Tenant Features React Query Hooks (TA - Tenant Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantFeaturesService } from '@/services/ta';
import type { UpdateTenantFeaturesRequest } from '@/services/ta/tenantFeaturesService';

// Query Keys
export const tenantFeaturesKeys = {
  all: ['tenantFeatures'] as const,
  detail: () => [...tenantFeaturesKeys.all, 'detail'] as const,
};

// ============================================
// Queries
// ============================================

/** 테넌트 기능 설정 조회 */
export const useTenantFeatures = () => {
  return useQuery({
    queryKey: tenantFeaturesKeys.detail(),
    queryFn: () => tenantFeaturesService.getFeatures(),
  });
};

/** 공개 테넌트 기능 설정 조회 (인증 불필요) */
export const usePublicTenantFeatures = () => {
  return useQuery({
    queryKey: [...tenantFeaturesKeys.all, 'public'] as const,
    queryFn: () => tenantFeaturesService.getPublicFeatures(),
  });
};

// ============================================
// Mutations
// ============================================

/** 테넌트 기능 설정 수정 */
export const useUpdateTenantFeatures = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTenantFeaturesRequest) =>
      tenantFeaturesService.updateFeatures(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantFeaturesKeys.all });
    },
  });
};
