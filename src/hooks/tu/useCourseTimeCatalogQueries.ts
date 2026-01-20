/**
 * 학습자용 CourseTime 카탈로그 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { courseTimeCatalogService } from '@/services/tu/courseTimeCatalogService';
import { extractTenantIdentifier } from '@/utils/tenantUtils';
import { useAuthStore } from '@/store/common/authStore';
import type { CourseTimeCatalogParams } from '@/types/tu/courseTimeCatalog.types';

// 현재 서브도메인 가져오기
function getCurrentSubdomain(): string | null {
  const tenant = extractTenantIdentifier();
  return tenant?.type === 'subdomain' ? tenant.identifier : null;
}

// Query Keys (서브도메인 + 인증 상태 포함)
export const courseTimeCatalogKeys = {
  all: ['courseTimeCatalog'] as const,
  catalog: (params?: CourseTimeCatalogParams, subdomain?: string | null, isAuthenticated?: boolean) =>
    [...courseTimeCatalogKeys.all, 'catalog', subdomain, isAuthenticated, params] as const,
  detail: (id: number, subdomain?: string | null, isAuthenticated?: boolean) =>
    [...courseTimeCatalogKeys.all, 'detail', subdomain, isAuthenticated, id] as const,
};

/**
 * 학습자용 차수 목록 조회 훅 (카탈로그)
 * @param params 검색/필터 파라미터
 * @param enabled 쿼리 활성화 여부
 */
export function useCourseTimeCatalog(params?: CourseTimeCatalogParams, enabled = true) {
  const subdomain = getCurrentSubdomain();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: courseTimeCatalogKeys.catalog(params, subdomain, isAuthenticated),
    queryFn: () => courseTimeCatalogService.getCatalog(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 학습자용 차수 상세 조회 훅
 * @param id 차수 ID
 * @param enabled 쿼리 활성화 여부
 */
export function useCourseTimeDetail(id: number, enabled = true) {
  const subdomain = getCurrentSubdomain();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: courseTimeCatalogKeys.detail(id, subdomain, isAuthenticated),
    queryFn: () => courseTimeCatalogService.getDetail(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
