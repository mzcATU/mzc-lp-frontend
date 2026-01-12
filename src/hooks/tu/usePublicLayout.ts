/**
 * TU용 공개 레이아웃 조회 Hook
 */
import { useQuery } from '@tanstack/react-query';
import { tenantSettingsService } from '@/services/ta/tenantSettingsService';
import type { PublicLayoutResponse, NavigationItemResponse } from '@/types/tu/branding.types';

/** 기본 배너 아이템 (HeroSection 기본 슬라이드) */
const DEFAULT_BANNER_ITEMS = [
  {
    id: 'default-1',
    type: 'code' as const,
    imageUrl: null,
    code: `<div class="flex flex-col items-start justify-center h-full px-8 md:px-16">
      <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 mb-6">MZC LEARN</span>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">Empower Your</h2>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-[#6778ff] to-[#a855f7] bg-clip-text text-transparent">Future</h2>
      <p class="text-xl md:text-2xl font-medium text-gray-300 mt-6">최신 기술 트렌드를 선도하는<br/>실무 중심의 IT 교육</p>
      <p class="text-base md:text-lg text-gray-500 mt-2">AWS, AI, 클라우드 전문가가 되는 가장 빠른 길</p>
    </div>`,
    title: 'Empower Your Future',
    order: 0,
  },
  {
    id: 'default-2',
    type: 'code' as const,
    imageUrl: null,
    code: `<div class="flex flex-col items-start justify-center h-full px-8 md:px-16">
      <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 mb-6">ROADMAP</span>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">Build Your</h2>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">Career</h2>
      <p class="text-xl md:text-2xl font-medium text-gray-300 mt-6">단계별 로드맵으로<br/>체계적인 성장을 경험하세요</p>
      <p class="text-base md:text-lg text-gray-500 mt-2">입문부터 전문가까지, 맞춤형 학습 경로 제공</p>
    </div>`,
    title: 'Build Your Career',
    order: 1,
  },
  {
    id: 'default-3',
    type: 'code' as const,
    imageUrl: null,
    code: `<div class="flex flex-col items-start justify-center h-full px-8 md:px-16">
      <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 mb-6">CLOUD</span>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">Master</h2>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-[#6778ff] to-[#6bc2f0] bg-clip-text text-transparent">Cloud</h2>
      <p class="text-xl md:text-2xl font-medium text-gray-300 mt-6">클라우드 기술의 핵심을<br/>실습과 함께 마스터하세요</p>
      <p class="text-base md:text-lg text-gray-500 mt-2">AWS, Azure, GCP 공인 자격증 취득 지원</p>
    </div>`,
    title: 'Master Cloud',
    order: 2,
  },
];

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
  // 확장 브랜딩 기본값
  companyName: null,
  bannerSettings: {
    enabled: true,
    items: DEFAULT_BANNER_ITEMS,
  },
  landingPageSettings: null,
  sidebarTUSettings: null,
  sidebarCOSettings: null,
};

/** 기본 배너 설정 */
const DEFAULT_BANNER_SETTINGS = {
  enabled: true,
  items: DEFAULT_BANNER_ITEMS,
};

/**
 * 공개 레이아웃 조회 Hook (인증된 사용자용)
 */
export function usePublicLayout(enabled: boolean = true) {
  return useQuery<PublicLayoutResponse>({
    queryKey: ['public-layout'],
    queryFn: async () => {
      try {
        const response = await tenantSettingsService.getPublicLayout();

        // bannerSettings가 없거나 items가 비어있으면 기본값 사용
        const bannerSettings = response.bannerSettings;
        const hasValidBanners = bannerSettings?.items && bannerSettings.items.length > 0;

        return {
          ...response,
          bannerSettings: hasValidBanners ? bannerSettings : DEFAULT_BANNER_SETTINGS,
        };
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
