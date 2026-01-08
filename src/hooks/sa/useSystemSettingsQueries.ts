/**
 * SA System Settings React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemSettingsService } from '@/services/sa/systemSettingsService';
import type {
  UpdateSystemSettingsRequest,
  UpdateTenantDefaultsRequest,
} from '@/services/sa/systemSettingsService';

// Query Keys
export const systemSettingsKeys = {
  all: ['systemSettings'] as const,
  settings: () => [...systemSettingsKeys.all, 'settings'] as const,
  tenantDefaults: () => [...systemSettingsKeys.all, 'tenantDefaults'] as const,
};

// ============================================
// 시스템 설정 Queries
// ============================================

/** 시스템 설정 조회 */
export const useSystemSettings = () => {
  return useQuery({
    queryKey: systemSettingsKeys.settings(),
    queryFn: () => systemSettingsService.getSystemSettings(),
  });
};

/** 테넌트 기본값 조회 */
export const useTenantDefaults = () => {
  return useQuery({
    queryKey: systemSettingsKeys.tenantDefaults(),
    queryFn: () => systemSettingsService.getTenantDefaults(),
  });
};

// ============================================
// 시스템 설정 Mutations
// ============================================

/** 시스템 설정 업데이트 */
export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateSystemSettingsRequest) =>
      systemSettingsService.updateSystemSettings(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.settings() });
    },
  });
};

/** 테넌트 기본값 업데이트 */
export const useUpdateTenantDefaults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateTenantDefaultsRequest) =>
      systemSettingsService.updateTenantDefaults(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemSettingsKeys.tenantDefaults() });
    },
  });
};
