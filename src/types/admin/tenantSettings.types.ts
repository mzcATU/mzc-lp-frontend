/**
 * Tenant Settings 타입 정의 (TA)
 */

export interface TenantSettingsDetail {
  id: number;
  tenantId: number;

  // Branding
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;

  // User Management
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  defaultUserRole: string;

  // Limits
  maxUsers: number | null;
  maxStorage: number | null;
  maxCourses: number | null;

  // Features
  enableDiscussions: boolean;
  enableCertificates: boolean;
  enableAnalytics: boolean;

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
