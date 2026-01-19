/**
 * 인증 관련 타입 - 백엔드 API 스펙 기반
 */

// 사용자 역할 (백엔드 TenantRole enum)
export type TenantRole = 'SYSTEM_ADMIN' | 'TENANT_ADMIN' | 'OPERATOR' | 'DESIGNER' | 'INSTRUCTOR' | 'USER';

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

export interface SwitchRoleRequest {
  targetRole: TenantRole;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  profileImageUrl?: string;
  department?: string;  // 부서 (개발팀, 회계팀 등)
  position?: string;    // 직급 (인턴, 신입, 대리, 과장, 차장, 팀장 등)
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
  roles?: TenantRole[];  // 다중 역할 (1:N) - TA에서 부여된 시스템 역할
  status: UserStatus;
  profileImageUrl?: string;
  department?: string;    // 부서 (개발팀, 회계팀 등)
  position?: string;      // 직급 (인턴, 신입, 대리, 과장, 차장, 팀장 등)
  tenantId?: number;
  tenantName?: string;
  tenantSubdomain?: string;
  tenantCustomDomain?: string;
  createdAt: string;
  updatedAt: string;
  profileCompleted?: boolean;  // 프로필 완성 여부 (단체 계정 생성 시 false)
}

// --- Auth Store 타입 ---

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: TenantRole;
  roles?: TenantRole[];  // 1:N 역할 지원
  currentRole?: TenantRole;  // 현재 선택된 역할
  tenantId?: number;
  tenantSubdomain?: string;
}

// --- 역할 라벨 맵 ---

export const ROLE_LABELS: Record<TenantRole, { ko: string; en: string }> = {
  SYSTEM_ADMIN: { ko: '시스템 관리자', en: 'System Admin' },
  TENANT_ADMIN: { ko: '테넌트 관리자', en: 'Tenant Admin' },
  OPERATOR: { ko: '운영자', en: 'Operator' },
  DESIGNER: { ko: '설계자', en: 'Designer' },
  INSTRUCTOR: { ko: '강사', en: 'Instructor' },
  USER: { ko: '일반 사용자', en: 'User' },
};

// --- 역할별 리다이렉트 경로 ---

export const ROLE_REDIRECT_PATH: Record<TenantRole, string> = {
  SYSTEM_ADMIN: '/sa',
  TENANT_ADMIN: '/ta',
  OPERATOR: '/co',
  DESIGNER: '/',
  INSTRUCTOR: '/',
  USER: '/',
};

// --- Legacy (하위 호환용) ---
/** @deprecated Use TenantRole instead */
export enum UserRole {
  SuperAdmin = 'SYSTEM_ADMIN',
  TenantAdmin = 'TENANT_ADMIN',
  CourseOperator = 'OPERATOR',
  TenantUser = 'USER',
}
