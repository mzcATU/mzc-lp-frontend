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
  BulkCreateUsersRequest,
  BulkCreateUsersResponse,
} from '@/types/admin';

export const userService = {
  // ============================================
  // User CRUD
  // ============================================

  /** 사용자 목록 조회 */
  async getUsers(params?: UserListParams): Promise<UserListResponse> {
    // 프론트엔드 파라미터를 백엔드 API 파라미터로 매핑
    // undefined 값은 제외하여 쿼리 파라미터로 전달되지 않도록 함
    const apiParams: Record<string, string | number | undefined> = {};

    if (params) {
      if (params.search) apiParams.keyword = params.search;
      if (params.systemRole) apiParams.role = params.systemRole;
      if (params.status) apiParams.status = params.status;
      if (params.page !== undefined) apiParams.page = params.page;
      if (params.size !== undefined) apiParams.size = params.size;
    }

    const { data } = await axiosInstance.get<UserListResponse>(
      API_ENDPOINTS.USERS.BASE,
      { params: Object.keys(apiParams).length > 0 ? apiParams : undefined }
    );
    return data;
  },

  /** 사용자 상세 조회 */
  async getUser(id: number): Promise<UserDetail> {
    const { data } = await axiosInstance.get<UserDetail>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return data;
  },

  /** 사용자 정보 수정 */
  async update(id: number, request: UpdateUserDetailRequest): Promise<UserDetail> {
    const { data } = await axiosInstance.put<UserDetail>(
      API_ENDPOINTS.USERS.BY_ID(id),
      request
    );
    return data;
  },

  /** 사용자 역할 변경 */
  async updateRole(id: number, request: UpdateUserRoleRequest): Promise<AdminUser> {
    // 백엔드는 PUT 메서드와 { role: TenantRole } 형식을 기대
    const { data } = await axiosInstance.put<AdminUser>(
      API_ENDPOINTS.USERS.ROLE(id),
      { role: request.systemRole }
    );
    return data;
  },

  /** 사용자 상태 변경 */
  async updateStatus(id: number, status: string): Promise<AdminUser> {
    const { data } = await axiosInstance.patch<AdminUser>(
      API_ENDPOINTS.USERS.STATUS(id),
      { status }
    );
    return data;
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
    const { data } = await axiosInstance.get<UserStats>(
      `${API_ENDPOINTS.USERS.BASE}/stats`
    );
    return data;
  },

  // ============================================
  // Bulk Operations
  // ============================================

  /** 단체 계정 생성 */
  async bulkCreateUsers(request: BulkCreateUsersRequest): Promise<BulkCreateUsersResponse> {
    const { data } = await axiosInstance.post<BulkCreateUsersResponse>(
      API_ENDPOINTS.USERS.BULK,
      request
    );
    return data;
  },
};
