/**
 * 부서 관리 관련 타입 정의
 */

// 부서 상태
export type DepartmentStatus = 'ACTIVE' | 'INACTIVE';

// 부서 응답
export interface DepartmentResponse {
  id: number;
  name: string;
  code: string;
  description: string | null;
  parentId: number | null;
  parentName: string | null;
  level: number;
  sortOrder: number;
  status: DepartmentStatus;
  employeeCount: number;
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
  sortOrder?: number;
  status?: DepartmentStatus;
}

// 부서 수정 요청
export interface UpdateDepartmentRequest {
  name?: string;
  code?: string;
  description?: string;
  parentId?: number;
  sortOrder?: number;
  status?: DepartmentStatus;
}
