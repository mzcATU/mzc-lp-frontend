/**
 * TU용 공개 레이아웃 조회 Hook
 */
import { useQuery } from '@tanstack/react-query';
import { tenantSettingsService } from '@/services/ta/tenantSettingsService';
import type { PublicLayoutResponse, NavigationItemResponse } from '@/types/tu/branding.types';

/** 기본 레이아웃 */
const DEFAULT_LAYOUT: PublicLayoutResponse = {
  headerSettings: {
    style: 'fixed',
    height: 'default',
    showLogo: true,
    showSearch: true,
    showNotifications: true,
  },
  footerSettings: {
    enabled: true,
    showLinks: true,
    showCopyright: true,
    showSocialLinks: true,
  },
  contentSettings: {
    maxWidth: 'xl',
    padding: 'normal',
  },
  navigationItems: [],
};

/**
 * 공개 레이아웃 조회 Hook (인증된 사용자용)
 */
export function usePublicLayout(enabled: boolean = true) {
  return useQuery<PublicLayoutResponse>({
    queryKey: ['public-layout'],
    queryFn: async () => {
      try {
        return await tenantSettingsService.getPublicLayout();
      } catch {
        return DEFAULT_LAYOUT;
      }
    },
    enabled,
    staleTime: 1000 * 60 * 30, // 30분 캐싱
    gcTime: 1000 * 60 * 60, // 1시간 GC
    retry: 1,
  });
}

/**
 * 활성화된 네비게이션 조회 Hook (인증된 사용자용)
 */
export function usePublicNavigation(enabled: boolean = true) {
  return useQuery<NavigationItemResponse[]>({
    queryKey: ['public-navigation'],
    queryFn: async () => {
      try {
        return await tenantSettingsService.getPublicNavigation();
      } catch {
        return [];
      }
    },
    enabled,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });
}
