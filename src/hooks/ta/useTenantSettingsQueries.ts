/**
 * Tenant Settings React Query Hooks (TA - Tenant Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantSettingsService } from '@/services/ta';
import type {
  UpdateTenantSettingsRequest,
  UpdateBrandingRequest,
  UpdateUserManagementRequest,
} from '@/types/admin';

// Query Keys
export const tenantSettingsKeys = {
  all: ['tenantSettings'] as const,
  detail: () => [...tenantSettingsKeys.all, 'detail'] as const,
};

// ============================================
// Queries
// ============================================

/** 테넌트 설정 조회 */
export const useTenantSettings = () => {
  return useQuery({
    queryKey: tenantSettingsKeys.detail(),
    queryFn: () => tenantSettingsService.getSettings(),
  });
};

// ============================================
// Mutations
// ============================================

/** 테넌트 설정 전체 수정 */
export const useUpdateTenantSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTenantSettingsRequest) =>
      tenantSettingsService.update(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantSettingsKeys.detail() });
    },
  });
};

/** 브랜딩 설정 수정 */
export const useUpdateBranding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateBrandingRequest) =>
      tenantSettingsService.updateBranding(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantSettingsKeys.detail() });
    },
  });
};

/** 사용자 관리 설정 수정 */
export const useUpdateUserManagement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateUserManagementRequest) =>
      tenantSettingsService.updateUserManagement(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantSettingsKeys.detail() });
    },
  });
};
