/**
 * User Group 타입 정의 (TA)
 */

export interface UserGroup {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserGroupListResponse {
  content: UserGroup[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface UserGroupListParams {
  keyword?: string;
  page?: number;
  size?: number;
}

export interface CreateUserGroupRequest {
  name: string;
  description?: string;
}

export interface UpdateUserGroupRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}
