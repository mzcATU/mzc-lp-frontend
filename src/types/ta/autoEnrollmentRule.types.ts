/**
 * 자동 등록 규칙 관련 타입 정의
 */

// 자동 등록 트리거 타입
export type AutoEnrollmentTrigger = 'USER_JOIN' | 'DEPARTMENT_ASSIGN' | 'ROLE_CHANGE';

// 자동 등록 규칙 응답
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
  createdAt: string;
  updatedAt: string;
}

// 자동 등록 규칙 생성 요청
export interface CreateAutoEnrollmentRuleRequest {
  name: string;
  description?: string;
  trigger: AutoEnrollmentTrigger;
  departmentId?: number;
  courseTimeId: number;
  sortOrder?: number;
}

// 자동 등록 규칙 수정 요청
export interface UpdateAutoEnrollmentRuleRequest {
  name?: string;
  description?: string;
  trigger?: AutoEnrollmentTrigger;
  departmentId?: number;
  courseTimeId?: number;
  sortOrder?: number;
}
