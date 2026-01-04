/**
 * TO(Tenant Operator) 사용자 관리 타입 정의
 */
import type { TenantRole, UserStatus } from '@/types/common';

// Re-export for convenience
export type { TenantRole, UserStatus } from '@/types/common';

// ============================================
// CourseRole 관련 타입
// ============================================

/** 프로그램 역할 타입 */
export type CourseRole = 'DESIGNER' | 'OWNER' | 'INSTRUCTOR';

/** CourseRole 응답 */
export interface CourseRoleResponse {
  courseRoleId: number;
  programId: number | null;
  courseName: string | null;
  role: CourseRole;
  revenueSharePercent: number | null;
  createdAt: string;
}

// ============================================
// Response DTOs
// ============================================

/** 사용자 목록 응답 */
export interface UserListResponse {
  userId: number;
  email: string;
  name: string;
  role: TenantRole;
  status: UserStatus;
  createdAt: string;
}

/** TO 사용자 상세 응답 (관리용) */
export interface TOUserDetailResponse {
  userId: number;
  email: string;
  name: string;
  phone?: string;
  profileImageUrl?: string;
  role: TenantRole;
  status: UserStatus;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
  /** 프로그램 역할 목록 */
  courseRoles?: CourseRoleResponse[];
}

// ============================================
// Request DTOs
// ============================================

/** 상태 변경 요청 */
export interface ChangeStatusRequest {
  status: UserStatus;
  reason?: string;
}

/** 사용자 목록 조회 파라미터 */
export interface UserFilterParams {
  keyword?: string;
  role?: TenantRole;
  status?: UserStatus;
  page?: number;
  size?: number;
  sort?: string;
}

// ============================================
// Labels
// ============================================

export const TENANT_ROLE_LABELS: Record<TenantRole, string> = {
  SYSTEM_ADMIN: '시스템 관리자',
  TENANT_ADMIN: '테넌트 관리자',
  OPERATOR: '강의소유자',
  DESIGNER: '강의설계자',
  USER: '사용자',
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
  SUSPENDED: '정지',
  WITHDRAWN: '탈퇴',
};

export const COURSE_ROLE_LABELS: Record<CourseRole, string> = {
  DESIGNER: 'Designer',
  OWNER: 'Owner',
  INSTRUCTOR: 'Instructor',
};
