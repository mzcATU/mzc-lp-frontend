/**
 * Auth/User 관련 타입 정의
 */

// API 응답 공통 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

// 사용자 역할
export type TenantRole = 'USER' | 'OPERATOR' | 'TENANT_ADMIN' | 'SUPER_ADMIN';

// 사용자 상태
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'WITHDRAWN';

// ========== Request DTOs ==========

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

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  profileImageUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface WithdrawRequest {
  password: string;
  reason?: string;
}

// ========== Response DTOs ==========

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
}

export interface UserDetailResponse {
  userId: number;
  email: string;
  name: string;
  phone: string | null;
  profileImageUrl: string | null;
  role: TenantRole;
  status: UserStatus;
  tenantId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  userId: number;
  email: string;
  name: string;
  role: TenantRole;
  status: UserStatus;
  createdAt: string;
}

// ========== Auth Context ==========

export interface AuthState {
  user: UserDetailResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
