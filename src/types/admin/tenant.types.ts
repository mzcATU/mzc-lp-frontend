/**
 * 테넌트 관련 타입 정의
 */

export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'TERMINATED';
export type TenantType = 'B2C' | 'B2B';
export type PlanType = 'BASIC' | 'PRO' | 'ENTERPRISE';

export interface Tenant {
  tenantId: number;
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
  storageUsed?: number;
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

/** 테넌트 생성 응답 (관리자 정보 포함) */
export interface CreateTenantResponse {
  tenantId: number;
  code: string;
  name: string;
  type: TenantType;
  status: TenantStatus;
  plan: PlanType;
  subdomain: string;
  customDomain?: string;
  createdAt: string;
  admin: {
    userId: number;
    email: string;
    name: string;
    tempPassword: string;  // 생성 시에만 반환되는 임시 비밀번호
  };
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

// 테넌트별 사용자 수 통계
export interface TenantUserCount {
  tenantId: number;
  tenantCode: string;
  tenantName: string;
  userCount: number;
}

export interface TenantUserStatsResponse {
  tenantUserCounts: TenantUserCount[];
  totalUsers: number;
}
