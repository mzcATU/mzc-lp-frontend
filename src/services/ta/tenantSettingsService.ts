/**
 * Tenant Settings API 서비스 (TA - Tenant Admin)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  TenantSettingsDetail,
  UpdateTenantSettingsRequest,
  UpdateBrandingRequest,
  UpdateUserManagementRequest,
} from '@/types/admin';
import type {
  PublicBrandingResponse,
  PublicLayoutResponse,
  NavigationItemResponse,
} from '@/types/tu/branding.types';

/** 기본 브랜딩 (fallback) */
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

export const tenantSettingsService = {
  /** 현재 테넌트 브랜딩 조회 (로그인 사용자용) */
  async getBranding(): Promise<PublicBrandingResponse> {
    const { data } = await axiosInstance.get<PublicBrandingResponse>(
      API_ENDPOINTS.TENANT_SETTINGS.BRANDING
    );
// data가 null/undefined인 경우 기본 브랜딩 반환
    return data ?? DEFAULT_BRANDING;
  },

  /** 테넌트 설정 조회 */
  async getSettings(): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.get<TenantSettingsDetail>(
      API_ENDPOINTS.TENANT_SETTINGS.BASE
    );
    return data;
  },

  /** 테넌트 설정 전체 수정 */
  async update(request: UpdateTenantSettingsRequest): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.put<TenantSettingsDetail>(
      API_ENDPOINTS.TENANT_SETTINGS.BASE,
      request
    );
    return data;
  },

  /** 브랜딩 설정 수정 */
  async updateBranding(request: UpdateBrandingRequest): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.patch<TenantSettingsDetail>(
      API_ENDPOINTS.TENANT_SETTINGS.BRANDING,
      request
    );
    return data;
  },

  /** 사용자 관리 설정 수정 */
  async updateUserManagement(request: UpdateUserManagementRequest): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.patch<TenantSettingsDetail>(
      API_ENDPOINTS.TENANT_SETTINGS.USER_MANAGEMENT,
      request
    );
    return data;
  },

  // ============================================
  // TU용 공개 API
  // ============================================

  /** 공개 레이아웃 조회 (TU용, 인증된 사용자) */
  async getPublicLayout(): Promise<PublicLayoutResponse> {
    const { data } = await axiosInstance.get<PublicLayoutResponse>(
      API_ENDPOINTS.TENANT_SETTINGS.LAYOUT_PUBLIC
    );
    return data;
  },

  /** 활성화된 네비게이션 항목 조회 (TU용) */
  async getPublicNavigation(): Promise<NavigationItemResponse[]> {
    const { data } = await axiosInstance.get<NavigationItemResponse[]>(
      API_ENDPOINTS.TENANT_SETTINGS.NAVIGATION_PUBLIC
    );
    return data;
  },
};
