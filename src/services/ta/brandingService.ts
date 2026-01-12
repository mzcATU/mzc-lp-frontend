/**
 * TA 브랜딩/설정 관리 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  HeaderSettings,
  SidebarSettings,
  FooterSettings,
  ContentSettings,
  TypographySettings,
  ColorModeSettings,
  ComponentStyleSettings,
  AccessibilitySettings,
  ResponsiveSettings,
  UpdateDesignSettingsRequest,
  UpdateLayoutSettingsRequest,
  UpdateExtendedBrandingRequest,
} from '@/types/admin';

// Re-export types for consumers
export type {
  HeaderSettings,
  SidebarSettings,
  FooterSettings,
  ContentSettings,
  TypographySettings,
  ColorModeSettings,
  ComponentStyleSettings,
  AccessibilitySettings,
  ResponsiveSettings,
  UpdateDesignSettingsRequest,
  UpdateLayoutSettingsRequest,
  UpdateExtendedBrandingRequest,
};

// ============================================
// 타입 정의
// ============================================

export interface TenantSettingsResponse {
  id: number;
  tenantId: number;
  // 브랜딩 설정
  logoUrl: string | null;
  darkLogoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string | null;
  fontFamily: string | null;
  headingFont: string | null;
  bodyFont: string | null;
  // 레이아웃 설정
  headerSettings: HeaderSettings;
  sidebarSettings: SidebarSettings;
  footerSettings: FooterSettings;
  contentSettings: ContentSettings;
  // 확장 브랜딩 설정
  companyName: string | null;
  bannerSettings: Record<string, unknown> | null;
  landingPageSettings: Record<string, unknown> | null;
  sidebarTUSettings: Record<string, unknown> | null;
  sidebarTOSettings: Record<string, unknown> | null;
  // 확장 UI 설정
  typographySettings: TypographySettings | null;
  colorModeSettings: ColorModeSettings | null;
  componentStyleSettings: ComponentStyleSettings | null;
  accessibilitySettings: AccessibilitySettings | null;
  responsiveSettings: ResponsiveSettings | null;
  // 일반 설정
  defaultLanguage: string;
  timezone: string;
  // 사용자 관리 설정
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  requireApproval: boolean;
  allowedEmailDomains: string | null;
  // 제한 설정
  maxUsersCount: number;
  maxStorageGB: number;
  maxCourses: number;
  // 기능 활성화 설정
  allowCustomDomain: boolean;
  allowCustomBranding: boolean;
  ssoEnabled: boolean;
  apiAccessEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationItemResponse {
  id: number;
  label: string;
  icon: string;
  path: string;
  enabled: boolean;
  displayOrder: number;
  target: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationItemRequest {
  label: string;
  icon: string;
  path: string;
  enabled?: boolean;
  displayOrder?: number;
  target?: string;
}

// ============================================
// API 서비스
// ============================================

export const brandingService = {
  // ============================================
  // 설정 조회/업데이트
  // ============================================

  /** 테넌트 설정 전체 조회 */
  async getSettings(): Promise<TenantSettingsResponse> {
    const { data } = await axiosInstance.get<TenantSettingsResponse>(
      API_ENDPOINTS.TENANT_SETTINGS.BASE
    );
    return data;
  },

  /** 디자인 설정 업데이트 */
  async updateDesignSettings(request: UpdateDesignSettingsRequest): Promise<TenantSettingsResponse> {
    const { data } = await axiosInstance.put<TenantSettingsResponse>(
      API_ENDPOINTS.TENANT_SETTINGS.DESIGN,
      request
    );
    return data;
  },

  /** 레이아웃 설정 업데이트 */
  async updateLayoutSettings(request: UpdateLayoutSettingsRequest): Promise<TenantSettingsResponse> {
    const { data } = await axiosInstance.put<TenantSettingsResponse>(
      API_ENDPOINTS.TENANT_SETTINGS.LAYOUT,
      request
    );
    return data;
  },

  /** 확장 브랜딩 설정 업데이트 (배너, 랜딩페이지, 사이드바 TU/TO) */
  async updateExtendedBrandingSettings(request: UpdateExtendedBrandingRequest): Promise<TenantSettingsResponse> {
    const { data } = await axiosInstance.put<TenantSettingsResponse>(
      API_ENDPOINTS.TENANT_SETTINGS.BRANDING_EXTENDED,
      request
    );
    return data;
  },

  // ============================================
  // 네비게이션 관리
  // ============================================

  /** 네비게이션 항목 목록 조회 */
  async getNavigationItems(): Promise<NavigationItemResponse[]> {
    const { data } = await axiosInstance.get<NavigationItemResponse[]>(
      API_ENDPOINTS.TENANT_SETTINGS.NAVIGATION
    );
    return data;
  },

  /** 네비게이션 항목 생성 */
  async createNavigationItem(request: NavigationItemRequest): Promise<NavigationItemResponse> {
    const { data } = await axiosInstance.post<NavigationItemResponse>(
      API_ENDPOINTS.TENANT_SETTINGS.NAVIGATION,
      request
    );
    return data;
  },

  /** 네비게이션 항목 수정 */
  async updateNavigationItem(id: number, request: NavigationItemRequest): Promise<NavigationItemResponse> {
    const { data } = await axiosInstance.put<NavigationItemResponse>(
      API_ENDPOINTS.TENANT_SETTINGS.NAVIGATION_ITEM(id),
      request
    );
    return data;
  },

  /** 네비게이션 항목 삭제 */
  async deleteNavigationItem(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.TENANT_SETTINGS.NAVIGATION_ITEM(id));
  },

  /** 네비게이션 항목 순서 변경 */
  async reorderNavigationItems(itemIds: number[]): Promise<NavigationItemResponse[]> {
    const { data } = await axiosInstance.put<NavigationItemResponse[]>(
      API_ENDPOINTS.TENANT_SETTINGS.NAVIGATION_REORDER,
      itemIds
    );
    return data;
  },

  /** 네비게이션 초기화 */
  async resetNavigationItems(): Promise<NavigationItemResponse[]> {
    const { data } = await axiosInstance.post<NavigationItemResponse[]>(
      API_ENDPOINTS.TENANT_SETTINGS.NAVIGATION_RESET
    );
    return data;
  },
};
