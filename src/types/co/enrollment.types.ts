/**
 * TO(Tenant Operator) 수강 관리 타입 정의
 */

// ============================================
// Enums
// ============================================

/** 수강 상태 */
export type EnrollmentStatus = 'PENDING' | 'ENROLLED' | 'COMPLETED' | 'DROPPED' | 'FAILED' | 'REJECTED';

/** 수강 타입 */
export type EnrollmentType = 'VOLUNTARY' | 'MANDATORY';

// ============================================
// Response DTOs
// ============================================

/** 수강 목록 응답 */
export interface EnrollmentResponse {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  courseTimeId: number;
  enrolledAt: string;
  type: EnrollmentType;
  status: EnrollmentStatus;
  progressPercent: number;
  score?: number;
  completedAt?: string;
}

/** 수강 상세 응답 */
export interface EnrollmentDetailResponse {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  courseTimeId: number;
  enrolledAt: string;
  enrolledBy?: number;
  type: EnrollmentType;
  status: EnrollmentStatus;
  progressPercent: number;
  score?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** 강제 배정 결과 응답 */
export interface ForceEnrollResultResponse {
  successCount: number;
  failCount: number;
  enrollments: EnrollmentResponse[];
  failures: FailureDetail[];
}

interface FailureDetail {
  userId: number;
  reason: string;
}

/** 차수별 수강 통계 응답 */
export interface CourseTimeEnrollmentStatsResponse {
  courseTimeId: number;
  totalEnrollments: number;
  enrolledCount: number;
  completedCount: number;
  droppedCount: number;
  failedCount: number;
  averageProgress: number;
  completionRate: number;
}

/** 사용자별 수강 통계 응답 */
export interface UserEnrollmentStatsResponse {
  userId: number;
  totalEnrollments: number;
  completedCount: number;
  inProgressCount: number;
  droppedCount: number;
  failedCount: number;
  completionRate: number;
  averageScore: number;
  averageProgress: number;
}

// ============================================
// Request DTOs
// ============================================

/** 강제 배정 요청 */
export interface ForceEnrollRequest {
  userIds: number[];
  reason?: string;
}

/** 수료 처리 요청 */
export interface CompleteEnrollmentRequest {
  score?: number;
}

/** 상태 변경 요청 */
export interface UpdateEnrollmentStatusRequest {
  status: EnrollmentStatus;
  reason?: string;
}

/** 수강 목록 조회 파라미터 */
export interface EnrollmentFilterParams {
  status?: EnrollmentStatus;
  keyword?: string; // 수강생 이름, 이메일로 검색
  page?: number;
  size?: number;
  sort?: string;
}

// ============================================
// Labels
// ============================================

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  PENDING: '승인 대기',
  ENROLLED: '수강 중',
  COMPLETED: '수료',
  DROPPED: '중도 탈락',
  FAILED: '미이수',
  REJECTED: '승인 거절',
};

export const ENROLLMENT_TYPE_LABELS: Record<EnrollmentType, string> = {
  VOLUNTARY: '자발적',
  MANDATORY: '필수',
};
