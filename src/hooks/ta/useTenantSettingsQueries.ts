/**
 * Tenant Settings React Query Hooks (TA - Tenant Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantSettingsService } from '@/services/ta';
import { brandingService } from '@/services/ta/brandingService';
import type {
  UpdateTenantSettingsRequest,
  UpdateBrandingRequest,
  UpdateUserManagementRequest,
} from '@/types/admin';
import type {
  UpdateDesignSettingsRequest,
  UpdateLayoutSettingsRequest,
  NavigationItemRequest,
} from '@/services/ta/brandingService';

// Query Keys
export const tenantSettingsKeys = {
  all: ['tenantSettings'] as const,
  detail: () => [...tenantSettingsKeys.all, 'detail'] as const,
  navigation: () => [...tenantSettingsKeys.all, 'navigation'] as const,
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

/** 네비게이션 항목 목록 조회 */
export const useNavigationItems = () => {
  return useQuery({
    queryKey: tenantSettingsKeys.navigation(),
    queryFn: () => brandingService.getNavigationItems(),
  });
};

// ============================================
// Mutations - 기본 설정
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

/** 브랜딩 설정 수정 (레거시) */
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

// ============================================
// Mutations - 디자인/레이아웃 설정
// ============================================

/** 디자인 설정 업데이트 */
export const useUpdateDesignSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateDesignSettingsRequest) =>
      brandingService.updateDesignSettings(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantSettingsKeys.detail() });
    },
  });
};

/** 레이아웃 설정 업데이트 */
export const useUpdateLayoutSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateLayoutSettingsRequest) =>
      brandingService.updateLayoutSettings(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantSettingsKeys.detail() });
    },
  });
};

// ============================================
// Mutations - 네비게이션 관리
// ============================================

/** 네비게이션 항목 생성 */
export const useCreateNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: NavigationItemRequest) =>
      brandingService.createNavigationItem(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantSettingsKeys.navigation() });
    },
  });
};

/** 네비게이션 항목 수정 */
export const useUpdateNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: NavigationItemRequest }) =>
      brandingService.updateNavigationItem(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantSettingsKeys.navigation() });
    },
  });
};

/** 네비게이션 항목 삭제 */
export const useDeleteNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandingService.deleteNavigationItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantSettingsKeys.navigation() });
    },
  });
};

/** 네비게이션 항목 순서 변경 */
export const useReorderNavigationItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: number[]) => brandingService.reorderNavigationItems(itemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantSettingsKeys.navigation() });
    },
  });
};

/** 네비게이션 초기화 */
export const useResetNavigationItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => brandingService.resetNavigationItems(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantSettingsKeys.navigation() });
    },
  });
};
