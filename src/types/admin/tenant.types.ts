/**
 * 테넌트 관련 타입 정의
 */

export type TenantStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
export type TenantType = 'B2C' | 'B2B';
export type PlanType = 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface Tenant {
  id: number;
  code: string;
  name: string;
  type: TenantType;
  status: TenantStatus;
  plan: PlanType;
  subdomain: string;
  customDomain?: string;
  logoUrl?: string;
  primaryColor?: string;
  userCount?: number;
  courseCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenantBranding {
  tenantId: number;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface TenantSettings {
  tenantId: number;
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  defaultLanguage: 'ko' | 'en';
  timezone: string;
  maxStorageGB: number;
  maxUsersCount: number;
}

// Request/Response types
export interface CreateTenantRequest {
  code: string;
  name: string;
  type: TenantType;
  plan: PlanType;
  subdomain: string;
  adminEmail: string;
  adminName: string;
}

export interface UpdateTenantRequest {
  name?: string;
  status?: TenantStatus;
  plan?: PlanType;
  customDomain?: string;
}

export interface TenantListResponse {
  content: Tenant[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// Dashboard stats
export interface TenantStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byPlan: {
    BASIC: number;
    PRO: number;
    ENTERPRISE: number;
  };
  byType: {
    B2C: number;
    B2B: number;
  };
}

// Tenant Detail (상세 페이지용)
export interface TenantDetail extends Tenant {
  adminEmail: string;
  adminName: string;
  branding: TenantBranding;
  settings: TenantSettings & {
    maxCourses: number;
    allowCustomDomain: boolean;
    allowCustomBranding: boolean;
    ssoEnabled: boolean;
    apiAccessEnabled: boolean;
  };
}

// Update Tenant Detail Request
export interface UpdateTenantDetailRequest {
  name?: string;
  status?: TenantStatus;
  plan?: PlanType;
  customDomain?: string;
  adminName?: string;
  adminEmail?: string;
  branding?: Partial<TenantBranding>;
  settings?: Partial<TenantSettings>;
}
