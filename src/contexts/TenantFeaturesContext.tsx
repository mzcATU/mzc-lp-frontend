import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { tenantFeaturesService } from '@/services/ta/tenantFeaturesService';
import type { TenantFeaturesResponse } from '@/services/ta/tenantFeaturesService';

interface TenantFeaturesContextValue {
  features: TenantFeaturesResponse | null | undefined;
  isLoading: boolean;
  error: Error | null;
  // 편의 메서드
  isFeatureEnabled: (feature: keyof TenantFeaturesResponse) => boolean;
}

const TenantFeaturesContext = createContext<TenantFeaturesContextValue | undefined>(undefined);

/** 기본 기능 설정 (SA 등 tenantId가 없는 사용자용) */
const DEFAULT_FEATURES: TenantFeaturesResponse = {
  communityEnabled: true,
  userCourseCreationEnabled: false,
  cartEnabled: true,
  wishlistEnabled: true,
  instructorTabEnabled: true,
  paidModeEnabled: true, // 기본값: 유료 모드
};

/**
 * 인증된 사용자용 기능 설정 조회 Hook
 */
function useAuthenticatedFeatures(enabled: boolean) {
  return useQuery({
    queryKey: ['tenant-features', 'authenticated'],
    queryFn: () => tenantFeaturesService.getFeatures(),
    enabled,
    staleTime: 1000 * 60 * 30, // 30분 캐싱
    gcTime: 1000 * 60 * 60, // 1시간 가비지 컬렉션
    retry: false, // 403 에러 시 재시도 안 함
  });
}

/**
 * 공개 기능 설정 조회 Hook (비로그인 사용자용)
 */
function usePublicFeatures(enabled: boolean) {
  return useQuery({
    queryKey: ['tenant-features', 'public'],
    queryFn: () => tenantFeaturesService.getPublicFeatures(),
    enabled,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: false, // 에러 시 재시도 안 함
  });
}

export function TenantFeaturesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  // SA 사용자인지 확인 (tenantId가 없는 인증된 사용자)
  const isSystemAdmin = isAuthenticated && !user?.tenantId;

  // 1. 인증된 사용자: 공개 API로 기능 설정 조회 (TU용 엔드포인트 사용)
  const {
    data: authFeatures,
    isLoading: authLoading,
    error: authError,
  } = usePublicFeatures(isAuthenticated && !!user?.tenantId);

  // 2. 비로그인 사용자: 공개 API로 기능 설정 조회
  const {
    data: publicFeatures,
    isLoading: publicLoading,
    error: publicError,
  } = usePublicFeatures(!isAuthenticated);

  // 기능 설정 결정 로직
  const { features, isLoading, error } = useMemo(() => {
    // SA 사용자: 기본 기능 설정 사용
    if (isSystemAdmin) {
      return { features: DEFAULT_FEATURES, isLoading: false, error: null };
    }
    // 인증된 사용자(tenantId 있음): authFeatures 사용
    if (isAuthenticated && user?.tenantId) {
      // 403 등 에러 발생 시 기본 기능 설정 사용
      if (authError) {
        console.warn('Failed to load tenant features, using defaults:', authError);
        return { features: DEFAULT_FEATURES, isLoading: false, error: null };
      }
      return { features: authFeatures, isLoading: authLoading, error: authError };
    }
    // 비로그인 사용자: publicFeatures 사용
    if (publicError) {
      console.warn('Failed to load public features, using defaults:', publicError);
      return { features: DEFAULT_FEATURES, isLoading: false, error: null };
    }
    return { features: publicFeatures, isLoading: publicLoading, error: publicError };
  }, [isSystemAdmin, isAuthenticated, user?.tenantId, authFeatures, authLoading, authError, publicFeatures, publicLoading, publicError]);

  // 편의 메서드
  const isFeatureEnabled = (feature: keyof TenantFeaturesResponse): boolean => {
    if (!features) return DEFAULT_FEATURES[feature] ?? true; // 로딩 중이거나 에러 시 기본값 사용
    return features[feature] ?? DEFAULT_FEATURES[feature] ?? true;
  };

  return (
    <TenantFeaturesContext.Provider value={{ features, isLoading, error, isFeatureEnabled }}>
      {children}
    </TenantFeaturesContext.Provider>
  );
}

export function useTenantFeatures() {
  const context = useContext(TenantFeaturesContext);
  if (context === undefined) {
    throw new Error('useTenantFeatures must be used within TenantFeaturesProvider');
  }
  return context;
}

/**
 * 특정 기능이 활성화되어 있는지 확인하는 훅
 * @param feature 확인할 기능 키
 * @returns 기능 활성화 여부
 */
export function useIsFeatureEnabled(feature: keyof TenantFeaturesResponse): boolean {
  const { isFeatureEnabled } = useTenantFeatures();
  return isFeatureEnabled(feature);
}
