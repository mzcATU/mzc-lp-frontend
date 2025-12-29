/**
 * 어드민 사용자 관리 관련 타입 정의
 */

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED';
export type SystemRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'OPERATOR' | 'USER';
export type CourseRole = 'DESIGNER' | 'OWNER' | 'INSTRUCTOR' | 'TUTOR' | 'VIEWER';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  profileImageUrl?: string;
  status: UserStatus;
  systemRole: SystemRole;
  courseRoles: CourseRoleAssignment[];
  tenantId: number;
  organizationId?: number;
  organizationName?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseRoleAssignment {
  id: number;
  userId: number;
  courseId: number;
  courseName: string;
  role: CourseRole;
  assignedAt: string;
  assignedBy: number;
}

// Request/Response types
export interface UpdateUserRoleRequest {
  systemRole: SystemRole;
}

export interface AssignCourseRoleRequest {
  courseId: number;
  role: CourseRole;
}

export interface UserListParams {
  page?: number;
  size?: number;
  status?: UserStatus;
  systemRole?: SystemRole;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface UserListResponse {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// Dashboard stats
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  blocked: number;
  byRole: {
    TENANT_ADMIN: number;
    OPERATOR: number;
    USER: number;
  };
  newUsersThisMonth: number;
  activeToday: number;
}
