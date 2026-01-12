/**
 * TO(Tenant Operator) 강사 배정 관리 타입 정의
 * 백엔드 IIS 모듈 API와 연동
 */

// ============================================
// Re-export from TU (공통 타입)
// ============================================

export type {
  InstructorRole,
  AssignmentStatus,
  InstructorAssignmentResponse,
} from '@/types/tu/instructorAssignment.types';

export {
  INSTRUCTOR_ROLE_LABELS,
  ASSIGNMENT_STATUS_LABELS,
} from '@/types/tu/instructorAssignment.types';

// ============================================
// TO 전용 Request Types
// ============================================

/** 강사 배정 요청 */
export interface AssignInstructorRequest {
  userId: number;
  role: import('@/types/tu/instructorAssignment.types').InstructorRole;
  forceAssign?: boolean; // 일정 충돌 무시
}

/** 역할 변경 요청 */
export interface UpdateInstructorRoleRequest {
  role: import('@/types/tu/instructorAssignment.types').InstructorRole;
}

/** 강사 교체 요청 */
export interface ReplaceInstructorRequest {
  newUserId: number;
}

/** 배정 취소 요청 */
export interface CancelAssignmentRequest {
  reason?: string;
}

// ============================================
// Filter Types
// ============================================

/** 강사 배정 목록 필터 */
export interface InstructorAssignmentFilterParams {
  instructorId?: number;
  courseTimeId?: number;
  role?: import('@/types/tu/instructorAssignment.types').InstructorRole;
  status?: import('@/types/tu/instructorAssignment.types').AssignmentStatus;
  page?: number;
  size?: number;
}

// ============================================
// TO 전용 Response Types (목록 조회용)
// ============================================

/** 강사 정보 (목록용) */
export interface InstructorInfo {
  id: number;
  name: string;
  email: string;
}

/** 차수 정보 (목록용) */
export interface CourseTimeInfo {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
}

/** 프로그램 정보 (목록용) */
export interface ProgramInfo {
  id: number;
  title: string;
}

/** 강사 배정 목록 아이템 응답 */
export interface InstructorAssignmentListResponse {
  id: number;
  instructor: InstructorInfo;
  courseTime: CourseTimeInfo;
  program: ProgramInfo;
  role: import('@/types/tu/instructorAssignment.types').InstructorRole;
  status: import('@/types/tu/instructorAssignment.types').AssignmentStatus;
  assignedAt: string;
  createdAt: string;
}
