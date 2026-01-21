/**
 * TO(Tenant Operator) 회원 풀 관리 타입 정의
 * 백엔드 MemberPool Entity 및 API 응답 구조에 맞춰 작성
 */

// ============================================
// Enums & Constants
// ============================================

/** 직원 상태 */
export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED';

// ============================================
// Request Types
// ============================================

/** 회원 풀 조건 DTO */
export interface MemberPoolConditionDto {
  departments: number[]; // 부서 ID 목록
  positions: string[]; // 직책 목록
  jobTitles: string[]; // 직무 목록
  employeeStatuses: EmployeeStatus[]; // 직원 상태 목록
}

/** 회원 풀 생성 요청 */
export interface CreateMemberPoolRequest {
  name: string; // 회원 풀 이름 (max 200자)
  description?: string; // 설명 (max 500자)
  conditions: MemberPoolConditionDto; // 조건
  sortOrder?: number; // 정렬 순서 (기본값: 0)
}

/** 회원 풀 수정 요청 */
export interface UpdateMemberPoolRequest {
  name?: string;
  description?: string;
  conditions?: MemberPoolConditionDto;
  sortOrder?: number;
}

/** 멤버 미리보기 요청 */
export interface PreviewMembersRequest {
  condition: MemberPoolConditionDto;
  page?: number;
  size?: number;
}

// ============================================
// Response Types
// ============================================

/** 회원 풀 조건 응답 DTO (응답용 - departmentIds 사용) */
export interface MemberPoolConditionResponse {
  departmentIds: number[]; // 부서 ID 목록
  positions: string[]; // 직책 목록
  jobTitles: string[]; // 직무 목록
  employeeStatuses: EmployeeStatus[]; // 직원 상태 목록
}

/** 회원 풀 기본 응답 (목록용) */
export interface MemberPoolResponse {
  id: number;
  name: string;
  description: string;
  conditions: MemberPoolConditionResponse | null; // 백엔드에서 conditions로 반환
  memberCount: number; // 매칭된 멤버 수
  isActive: boolean;
  sortOrder: number;
  createdAt: string; // ISO 8601 형식
  updatedAt: string; // ISO 8601 형식
}

/** 회원 풀 멤버 DTO */
export interface MemberPoolMemberDto {
  id: number;
  name: string;
  email: string;
  employeeNumber: string;
  departmentName: string;
  position: string;
  jobTitle: string;
  status: string;
}

/** 회원 풀 멤버 목록 응답 (페이징) */
export interface MemberPoolMembersResponse {
  content: MemberPoolMemberDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ============================================
// Query Parameters
// ============================================

/** 회원 풀 목록 조회 파라미터 */
export interface MemberPoolQueryParams {
  isActive?: boolean;
  search?: string; // 이름으로 검색
  sortBy?: 'name' | 'memberCount' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
}

/** 회원 풀 멤버 조회 파라미터 */
export interface MemberPoolMemberQueryParams {
  page?: number;
  size?: number;
  sort?: string;
}
