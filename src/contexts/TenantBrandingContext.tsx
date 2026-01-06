import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePublicBranding } from '@/hooks/tu/usePublicBranding';
import { useBrandingApply } from '@/hooks/tu/useBrandingApply';
import { extractTenantIdentifier } from '@/utils/tenantUtils';
import { useAuthStore } from '@/store/common/authStore';
import { tenantSettingsService } from '@/services/ta/tenantSettingsService';
import type { PublicBrandingResponse } from '@/types/tu/branding.types';

interface TenantBrandingContextValue {
  branding: PublicBrandingResponse | null | undefined;
  isLoading: boolean;
  error: Error | null;
}

const TenantBrandingContext = createContext<TenantBrandingContextValue | undefined>(undefined);

/** 기본 브랜딩 (SA 등 tenantId가 없는 사용자용) */
const DEFAULT_BRANDING: PublicBrandingResponse = {
  tenantName: 'MZC Learning Platform',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  logoUrl: null,
  darkLogoUrl: null,
  faviconUrl: null,
  accentColor: null,
  headingFont: null,
  bodyFont: null,
};

/**
 * 인증된 사용자용 브랜딩 조회 Hook
 */
function useAuthenticatedBranding(enabled: boolean) {
  return useQuery({
    queryKey: ['tenant-branding', 'authenticated'],
    queryFn: () => tenantSettingsService.getBranding(),
    enabled,
    staleTime: 1000 * 60 * 30, // 30분 캐싱
    gcTime: 1000 * 60 * 60, // 1시간 가비지 컬렉션
    retry: 1,
  });
}

export function TenantBrandingProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const tenantIdentifier = extractTenantIdentifier();

  // SA 사용자인지 확인 (tenantId가 없는 인증된 사용자)
  const isSystemAdmin = isAuthenticated && !user?.tenantId;

  // 1. 인증된 사용자(tenantId 있음): tenantId 기반 브랜딩 조회
  const {
    data: authBranding,
    isLoading: authLoading,
    error: authError,
  } = useAuthenticatedBranding(isAuthenticated && !!user?.tenantId);

  // 2. 비로그인 사용자: 도메인 기반 브랜딩 조회
  const {
    data: publicBranding,
    isLoading: publicLoading,
    error: publicError,
  } = usePublicBranding(
    tenantIdentifier?.identifier,
    tenantIdentifier?.type
  );

  // 브랜딩 결정 로직
  const { branding, isLoading, error } = useMemo(() => {
    // SA 사용자: 기본 브랜딩 사용
    if (isSystemAdmin) {
      return { branding: DEFAULT_BRANDING, isLoading: false, error: null };
    }
    // 인증된 사용자(tenantId 있음): authBranding 사용
    if (isAuthenticated && user?.tenantId) {
      return { branding: authBranding, isLoading: authLoading, error: authError };
    }
    // 비로그인 사용자: publicBranding 사용
    return { branding: publicBranding, isLoading: publicLoading, error: publicError };
  }, [isSystemAdmin, isAuthenticated, user?.tenantId, authBranding, authLoading, authError, publicBranding, publicLoading, publicError]);

  // 브랜딩을 전역 CSS 변수로 적용
  useBrandingApply(branding);

  return (
    <TenantBrandingContext.Provider value={{ branding, isLoading, error }}>
      {children}
    </TenantBrandingContext.Provider>
  );
}

export function useTenantBranding() {
  const context = useContext(TenantBrandingContext);
  if (context === undefined) {
    throw new Error('useTenantBranding must be used within TenantBrandingProvider');
  }
  return context;
}
