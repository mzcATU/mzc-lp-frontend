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

// User Detail (상세 페이지용)
export interface UserDetail extends AdminUser {
  phone?: string;
  department?: string;
  position?: string;
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalLearningTime: number;
    averageScore: number;
  };
  enrollments: UserEnrollment[];
  activityLogs: UserActivityLog[];
}

export interface UserEnrollment {
  id: number;
  courseTitle: string;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';
  enrolledAt: string;
  completedAt?: string;
}

export interface UserActivityLog {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  type: 'login' | 'course' | 'assessment' | 'profile';
}

// Update User Detail Request
export interface UpdateUserDetailRequest {
  name?: string;
  phone?: string;
  department?: string;
  position?: string;
  status?: UserStatus;
  systemRole?: SystemRole;
}
