/**
 * 인증 관련 타입 - 백엔드 API 스펙 기반
 */

// 사용자 역할 (백엔드 TenantRole enum)
export type TenantRole = 'SYSTEM_ADMIN' | 'TENANT_ADMIN' | 'OPERATOR' | 'DESIGNER' | 'USER';

// 사용자 상태
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'WITHDRAWN';

// --- Request DTOs ---

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

// --- Response DTOs ---

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserResponse {
  userId: number;
  email: string;
  name: string;
  role: TenantRole;
  createdAt: string;
}

export interface UserDetailResponse {
  userId: number;
  email: string;
  name: string;
  phone?: string;
  role: TenantRole;
  status: UserStatus;
  profileImageUrl?: string;
  tenantId?: number;
  tenantName?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Auth Store 타입 ---

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: TenantRole;
  tenantId?: number;
}

// --- 역할 라벨 맵 ---

export const ROLE_LABELS: Record<TenantRole, { ko: string; en: string }> = {
  SYSTEM_ADMIN: { ko: '시스템 관리자', en: 'System Admin' },
  TENANT_ADMIN: { ko: '테넌트 관리자', en: 'Tenant Admin' },
  OPERATOR: { ko: '운영자', en: 'Operator' },
  DESIGNER: { ko: '설계자', en: 'Designer' },
  USER: { ko: '일반 사용자', en: 'User' },
};

// --- 역할별 리다이렉트 경로 ---

export const ROLE_REDIRECT_PATH: Record<TenantRole, string> = {
  SYSTEM_ADMIN: '/sa',
  TENANT_ADMIN: '/ta',
  OPERATOR: '/to',
  DESIGNER: '/tu/teaching',
  USER: '/tu',
};

// --- Legacy (하위 호환용) ---
/** @deprecated Use TenantRole instead */
export enum UserRole {
  SuperAdmin = 'SYSTEM_ADMIN',
  TenantAdmin = 'TENANT_ADMIN',
  TenantOperator = 'OPERATOR',
  TenantUser = 'USER',
}
