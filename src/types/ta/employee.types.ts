/**
 * 임직원 관리 관련 타입 정의
 */

// 임직원 상태
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'RESIGNED' | 'ON_LEAVE';

// 임직원 응답
export interface EmployeeResponse {
  id: number;
  employeeNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  userPhone: string | null;
  profileImageUrl: string | null;
  departmentId: number | null;
  departmentName: string | null;
  departmentCode: string | null;
  position: string | null;
  jobTitle: string | null;
  hireDate: string | null;
  resignationDate: string | null;
  status: EmployeeStatus;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
}

// 임직원 목록 응답 (페이지네이션)
export interface EmployeeListResponse {
  content: EmployeeResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 임직원 검색 파라미터
export interface EmployeeSearchParams {
  departmentId?: number;
  status?: EmployeeStatus;
  keyword?: string;
  page?: number;
  size?: number;
}

// 임직원 생성 요청
export interface CreateEmployeeRequest {
  employeeNumber: string;
  userId: number;
  departmentId?: number;
  position?: string;
  jobTitle?: string;
  hireDate?: string;
  status?: EmployeeStatus;
  sortOrder?: number;
}

// 임직원 수정 요청
export interface UpdateEmployeeRequest {
  departmentId?: number;
  position?: string;
  jobTitle?: string;
  hireDate?: string;
  resignationDate?: string;
  sortOrder?: number;
}

// 임직원 상태 변경 요청
export interface ChangeEmployeeStatusRequest {
  status: EmployeeStatus;
  resignationDate?: string;
}

// LMS 계정 조회 응답
export interface EmployeeLmsAccountResponse {
  employeeId: number;
  userId: number;
  userName: string;
  userEmail: string;
  hasLmsAccount: boolean;
  lmsAccountCreatedAt: string | null;
}

// LMS 계정 생성 요청
export interface CreateLmsAccountRequest {
  password: string;
  sendWelcomeEmail?: boolean;
}

// LMS 계정 생성 응답
export interface CreateLmsAccountResponse {
  userId: number;
  email: string;
  name: string;
  createdAt: string;
}
