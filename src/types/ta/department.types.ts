/**
 * 부서 관리 관련 타입 정의
 */

// 부서 응답 (Backend DepartmentResponse와 일치)
export interface DepartmentResponse {
  id: number;
  name: string;
  code: string;
  description: string | null;
  parentId: number | null;
  parentName: string | null;
  managerId: number | null;
  managerName: string | null;
  sortOrder: number;
  isActive: boolean;
  memberCount: number;
  children: DepartmentResponse[];
  createdAt: string;
  updatedAt: string;
}

// 부서 생성 요청
export interface CreateDepartmentRequest {
  name: string;
  code: string;
  description?: string;
  parentId?: number;
  managerId?: number;
  sortOrder?: number;
}

// 부서 수정 요청
export interface UpdateDepartmentRequest {
  name?: string;
  code?: string;
  description?: string;
  parentId?: number;
  managerId?: number;
  sortOrder?: number;
}

// 부서 멤버 응답 (Backend DepartmentMemberResponse와 일치)
export interface DepartmentMemberResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  role: string | null;
}
