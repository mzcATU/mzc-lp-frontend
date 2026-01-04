/**
 * Tenant Settings 타입 정의 (TA)
 */

// 레이아웃 설정 타입
export interface HeaderSettings {
  style: 'fixed' | 'sticky' | 'static';
  showLogo: boolean;
  showSearch: boolean;
  showNotifications: boolean;
}

export interface SidebarSettings {
  style: 'collapsible' | 'fixed' | 'overlay' | 'hidden';
  defaultCollapsed: boolean;
  showIcons: boolean;
}

export interface FooterSettings {
  enabled: boolean;
  showLinks: boolean;
  showCopyright: boolean;
}

export interface ContentSettings {
  maxWidth: 'full' | 'xl' | 'lg' | 'md';
  padding: 'none' | 'compact' | 'normal' | 'relaxed';
}

export interface TenantSettingsDetail {
  id: number;
  tenantId: number;

  // Branding
  logoUrl: string | null;
  darkLogoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontFamily: string | null;
  headingFont: string | null;
  bodyFont: string | null;

  // Layout Settings
  headerSettings: HeaderSettings | null;
  sidebarSettings: SidebarSettings | null;
  footerSettings: FooterSettings | null;
  contentSettings: ContentSettings | null;

  // General Settings
  defaultLanguage: string;
  timezone: string;

  // User Management
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  requireApproval: boolean;
  allowedEmailDomains: string | null;
  defaultUserRole?: string; // deprecated

  // Limits
  maxUsersCount: number;
  maxStorageGB: number;
  maxCourses: number;
  maxUsers?: number | null; // deprecated alias
  maxStorage?: number | null; // deprecated alias

  // Features
  allowCustomDomain: boolean;
  allowCustomBranding: boolean;
  ssoEnabled: boolean;
  apiAccessEnabled: boolean;
  enableDiscussions?: boolean; // deprecated
  enableCertificates?: boolean; // deprecated
  enableAnalytics?: boolean; // deprecated

  createdAt: string;
  updatedAt: string;
}

export interface UpdateTenantSettingsRequest {
  // Branding
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;

  // User Management
  allowSelfRegistration?: boolean;
  requireEmailVerification?: boolean;
  defaultUserRole?: string;

  // Limits
  maxUsers?: number | null;
  maxStorage?: number | null;
  maxCourses?: number | null;

  // Features
  enableDiscussions?: boolean;
  enableCertificates?: boolean;
  enableAnalytics?: boolean;
}

export interface UpdateBrandingRequest {
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export interface UpdateUserManagementRequest {
  allowSelfRegistration?: boolean;
  requireEmailVerification?: boolean;
  defaultUserRole?: string;
}

// 새로운 디자인 설정 요청 타입
export interface UpdateDesignSettingsRequest {
  logoUrl?: string | null;
  darkLogoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

// 새로운 레이아웃 설정 요청 타입
export interface UpdateLayoutSettingsRequest {
  headerSettings?: HeaderSettings;
  sidebarSettings?: SidebarSettings;
  footerSettings?: FooterSettings;
  contentSettings?: ContentSettings;
}

// 네비게이션 항목 타입
export interface NavigationItem {
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
