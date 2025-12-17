/**
 * 인증 관련 타입
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: number;
}

export enum UserRole {
  SuperAdmin = 'SUPER_ADMIN',
  TenantAdmin = 'TENANT_ADMIN',
  TenantOperator = 'TENANT_OPERATOR',
  TenantUser = 'TENANT_USER',
}
