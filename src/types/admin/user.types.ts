/**
 * 어드민 사용자 관리 관련 타입 정의
 */

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED';
// 백엔드 TenantRole enum과 동기화: SYSTEM_ADMIN, TENANT_ADMIN, OPERATOR, DESIGNER, INSTRUCTOR, USER
export type SystemRole = 'SYSTEM_ADMIN' | 'TENANT_ADMIN' | 'OPERATOR' | 'DESIGNER' | 'INSTRUCTOR' | 'USER';
// 백엔드 CourseRole enum과 동기화: DESIGNER, INSTRUCTOR
export type CourseRole = 'DESIGNER' | 'INSTRUCTOR';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  profileImageUrl?: string;
  status: UserStatus;
  systemRole: SystemRole;
  roles?: SystemRole[];  // 다중 역할 (1:N)
  courseRoles: CourseRoleAssignment[];
  tenantId: number;
  organizationId?: number;
  organizationName?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  // 임직원 연동 정보
  employeeId?: string;          // 임직원 ID (연동된 경우)
  department?: string;           // 부서
  position?: string;             // 직책
  rank?: string;                 // 직급
  jobRole?: string;              // 직무
  employeeSyncedAt?: string;     // 임직원 정보 동기화 시간
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

// Bulk Create Users Request/Response
export interface BulkCreateUsersRequest {
  emailPrefix: string;
  emailDomain: string;
  count: number;
  password: string;
  startNumber?: number;
  role?: SystemRole;
}

export interface BulkCreateUsersResponse {
  totalRequested: number;
  successCount: number;
  failedCount: number;
  createdUsers: CreatedUserInfo[];
  failedUsers: FailedUserInfo[];
  autoLinkedCount: number;           // 자동 연동된 임직원 수
  autoLinkedUsers: AutoLinkedUserInfo[];
}

export interface CreatedUserInfo {
  id: number;
  email: string;
  name: string;
  employeeLinked?: boolean;         // 임직원 자동 연동 여부
  employeeId?: number;              // 연동된 임직원 ID
}

export interface FailedUserInfo {
  email: string;
  reason: string;
}

export interface AutoLinkedUserInfo {
  userId: number;
  email: string;
  employeeId: number;
  employeeNumber?: string;
  employeeName: string;
  department?: string;
  position?: string;
  jobTitle?: string;
}

// CSV/Excel 파일 업로드 기반 단체 계정 생성
export interface FileBasedBulkCreateRequest {
  users: FileBasedUserData[];
  autoLinkEmployees: boolean;       // 임직원 자동 연동 활성화 여부
  sendWelcomeEmail: boolean;        // 환영 이메일 발송 여부
}

export interface FileBasedUserData {
  email: string;
  name: string;
  department?: string;
  role?: SystemRole;
  password?: string;                // 미제공 시 자동 생성
}

// 임직원 자동 매칭 결과
export interface EmployeeMatchResult {
  email: string;
  name: string;
  matched: boolean;
  employeeInfo?: {
    employeeId: string;
    name: string;
    department: string;
    position: string;
    rank: string;
    jobRole: string;
  };
  matchType?: 'email' | 'name_and_department';  // 매칭 방식
  confidence?: number;              // 매칭 신뢰도 (0-100)
}

// 다중 역할 관리 (1:N)
export interface UpdateUserRolesRequest {
  roles: SystemRole[];
}

export interface UserRolesResponse {
  userId: number;
  email: string;
  name: string;
  roles: SystemRole[];
  primaryRole: SystemRole;
  updatedAt: string;
}
