/**
 * 강사 배정 관련 타입 정의 (TU - 강사 본인용)
 */

// ========== 상수 타입 ==========

/**
 * 강사 역할
 */
export type InstructorRole = 'MAIN' | 'SUB' | 'ASSISTANT';

/**
 * 배정 상태
 */
export type AssignmentStatus = 'ACTIVE' | 'REPLACED' | 'CANCELLED';

// ========== 응답 타입 ==========

/**
 * 강사 배정 응답
 */
export interface InstructorAssignmentResponse {
  id: number;
  userId: number;
  userName: string | null;
  userEmail: string | null;
  timeId: number;
  role: InstructorRole;
  status: AssignmentStatus;
  assignedAt: string;
  replacedAt: string | null;
  assignedBy: number;
  createdAt: string;
}

/**
 * 차수별 강사 통계 응답
 */
export interface CourseTimeStatResponse {
  timeKey: number;
  courseName: string;
  timeName: string;
  role: InstructorRole;
  totalStudents: number | null;
  completedStudents: number | null;
  completionRate: number | null;
}

/**
 * 강사 상세 통계 응답 (내 통계용)
 */
export interface InstructorDetailStatResponse {
  userId: number;
  userName: string;
  totalCount: number;
  mainCount: number;
  subCount: number;
  courseTimeStats: CourseTimeStatResponse[];
}

// ========== 라벨 매핑 ==========

/**
 * 강사 역할 라벨
 */
export const INSTRUCTOR_ROLE_LABELS: Record<InstructorRole, { ko: string; en: string }> = {
  MAIN: { ko: '주강사', en: 'Main Instructor' },
  SUB: { ko: '보조강사', en: 'Sub Instructor' },
  ASSISTANT: { ko: '조교', en: 'Assistant' },
};

/**
 * 배정 상태 라벨
 */
export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, { ko: string; en: string }> = {
  ACTIVE: { ko: '활동 중', en: 'Active' },
  REPLACED: { ko: '교체됨', en: 'Replaced' },
  CANCELLED: { ko: '취소됨', en: 'Cancelled' },
};
