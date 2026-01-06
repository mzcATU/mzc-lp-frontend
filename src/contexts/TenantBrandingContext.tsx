import { createContext, useContext, ReactNode } from 'react';
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

  // 1. 인증된 사용자: tenantId 기반 브랜딩 조회
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

  // 인증된 사용자는 authBranding 우선, 아니면 publicBranding
  const branding = isAuthenticated && user?.tenantId ? authBranding : publicBranding;
  const isLoading = isAuthenticated && user?.tenantId ? authLoading : publicLoading;
  const error = isAuthenticated && user?.tenantId ? authError : publicError;

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
