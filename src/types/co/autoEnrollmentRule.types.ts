/**
 * TO(Tenant Operator) 자동 입과 규칙 관리 타입 정의
 * 백엔드 AutoEnrollmentRule Entity 및 API 응답 구조에 맞춰 작성
 */

// ============================================
// Enums & Constants
// ============================================

/** 자동 입과 트리거 타입 */
export type AutoEnrollmentTrigger = 'USER_JOIN' | 'DEPARTMENT_ASSIGN' | 'ROLE_CHANGE';

/** 트리거 타입 라벨 */
export const AUTO_ENROLLMENT_TRIGGER_LABELS: Record<AutoEnrollmentTrigger, string> = {
  USER_JOIN: '신규 입사',
  DEPARTMENT_ASSIGN: '부서 배정',
  ROLE_CHANGE: '역할 변경',
};

// ============================================
// Request Types
// ============================================

/** 자동 입과 규칙 생성 요청 */
export interface CreateAutoEnrollmentRuleRequest {
  name: string; // 규칙 이름 (max 200자)
  description?: string; // 설명 (max 500자)
  trigger: AutoEnrollmentTrigger; // 트리거 타입
  departmentId?: number; // 대상 부서 ID (선택)
  courseTimeId: number; // 대상 차수 ID (필수)
  sortOrder?: number; // 정렬 순서 (기본값: 0)
}

/** 자동 입과 규칙 수정 요청 */
export interface UpdateAutoEnrollmentRuleRequest {
  name?: string;
  description?: string;
  trigger?: AutoEnrollmentTrigger;
  departmentId?: number;
  courseTimeId?: number;
  sortOrder?: number;
}

// ============================================
// Response Types
// ============================================

/** 자동 입과 규칙 응답 */
export interface AutoEnrollmentRuleResponse {
  id: number;
  name: string;
  description: string | null;
  trigger: AutoEnrollmentTrigger;
  departmentId: number | null;
  departmentName: string | null;
  courseTimeId: number | null;
  courseTimeTitle: string | null;
  isActive: boolean;
  sortOrder: number | null;
  createdAt: string; // ISO 8601 형식
  updatedAt: string; // ISO 8601 형식
}

// ============================================
// Query Parameters
// ============================================

/** 자동 입과 규칙 목록 조회 파라미터 */
export interface AutoEnrollmentRuleQueryParams {
  isActive?: boolean;
  trigger?: AutoEnrollmentTrigger;
}
