/**
 * TA 브랜딩/설정 관련 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  brandingService,
  type UpdateDesignSettingsRequest,
  type UpdateLayoutSettingsRequest,
  type UpdateExtendedBrandingRequest,
  type NavigationItemRequest,
} from '@/services/ta/brandingService';

// ============================================
// Query Keys
// ============================================

export const brandingKeys = {
  all: ['ta-branding'] as const,
  settings: () => [...brandingKeys.all, 'settings'] as const,
  navigation: () => [...brandingKeys.all, 'navigation'] as const,
};

// ============================================
// 설정 조회/업데이트 훅
// ============================================

/** 테넌트 설정 조회 */
export const useTenantSettings = () => {
  return useQuery({
    queryKey: brandingKeys.settings(),
    queryFn: () => brandingService.getSettings(),
  });
};

/** 디자인 설정 업데이트 */
export const useUpdateDesignSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateDesignSettingsRequest) =>
      brandingService.updateDesignSettings(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingKeys.settings() });
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
      queryClient.invalidateQueries({ queryKey: brandingKeys.settings() });
    },
  });
};

/** 확장 브랜딩 설정 업데이트 (배너, 랜딩페이지, 사이드바 TU/TO) */
export const useUpdateExtendedBrandingSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateExtendedBrandingRequest) =>
      brandingService.updateExtendedBrandingSettings(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingKeys.settings() });
    },
  });
};

// ============================================
// 네비게이션 관리 훅
// ============================================

/** 네비게이션 항목 목록 조회 */
export const useNavigationItems = () => {
  return useQuery({
    queryKey: brandingKeys.navigation(),
    queryFn: () => brandingService.getNavigationItems(),
  });
};

/** 네비게이션 항목 생성 */
export const useCreateNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: NavigationItemRequest) =>
      brandingService.createNavigationItem(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingKeys.navigation() });
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
      queryClient.invalidateQueries({ queryKey: brandingKeys.navigation() });
    },
  });
};

/** 네비게이션 항목 삭제 */
export const useDeleteNavigationItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandingService.deleteNavigationItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingKeys.navigation() });
    },
  });
};

/** 네비게이션 항목 순서 변경 */
export const useReorderNavigationItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemIds: number[]) => brandingService.reorderNavigationItems(itemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingKeys.navigation() });
    },
  });
};

/** 네비게이션 초기화 */
export const useResetNavigationItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => brandingService.resetNavigationItems(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandingKeys.navigation() });
    },
  });
};
