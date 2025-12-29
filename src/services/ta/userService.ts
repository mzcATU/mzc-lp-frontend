/**
 * User API 서비스 (TA - Tenant Admin)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  AdminUser,
  UserDetail,
  UserListResponse,
  UserListParams,
  UserStats,
  UpdateUserDetailRequest,
  UpdateUserRoleRequest,
} from '@/types/admin';

export const userService = {
  // ============================================
  // User CRUD
  // ============================================

  /** 사용자 목록 조회 */
  async getUsers(params?: UserListParams): Promise<UserListResponse> {
    const { data } = await axiosInstance.get<UserListResponse>(
      API_ENDPOINTS.USERS.BASE,
      { params }
    );
    return data;
  },

  /** 사용자 상세 조회 */
  async getUser(id: number): Promise<UserDetail> {
    const { data } = await axiosInstance.get<{ data: UserDetail }>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return data.data;
  },

  /** 사용자 정보 수정 */
  async update(id: number, request: UpdateUserDetailRequest): Promise<UserDetail> {
    const { data } = await axiosInstance.put<{ data: UserDetail }>(
      API_ENDPOINTS.USERS.BY_ID(id),
      request
    );
    return data.data;
  },

  /** 사용자 역할 변경 */
  async updateRole(id: number, request: UpdateUserRoleRequest): Promise<AdminUser> {
    const { data } = await axiosInstance.patch<{ data: AdminUser }>(
      API_ENDPOINTS.USERS.ROLE(id),
      request
    );
    return data.data;
  },

  /** 사용자 상태 변경 */
  async updateStatus(id: number, status: string): Promise<AdminUser> {
    const { data } = await axiosInstance.patch<{ data: AdminUser }>(
      API_ENDPOINTS.USERS.STATUS(id),
      { status }
    );
    return data.data;
  },

  /** 사용자 삭제 */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.USERS.BY_ID(id));
  },

  // ============================================
  // Statistics
  // ============================================

  /** 사용자 통계 조회 */
  async getStats(): Promise<UserStats> {
    const { data } = await axiosInstance.get<{ data: UserStats }>(
      `${API_ENDPOINTS.USERS.BASE}/stats`
    );
    return data.data;
  },
};
