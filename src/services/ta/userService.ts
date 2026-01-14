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
  UpdateUserRolesRequest,
  UserRolesResponse,
  BulkCreateUsersRequest,
  BulkCreateUsersResponse,
  SystemRole,
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
      // 정렬 파라미터 전달 (Spring Pageable 형식: sort=field,direction)
      if (params.sortBy) {
        const direction = params.sortDirection || 'asc';
        apiParams.sort = `${params.sortBy},${direction}`;
      }
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

  /** 사용자 역할 변경 (단일 역할 - 기존 API) */
  async updateRole(id: number, request: UpdateUserRoleRequest): Promise<AdminUser> {
    // 백엔드는 PUT 메서드와 { role: TenantRole } 형식을 기대
    const { data } = await axiosInstance.put<AdminUser>(
      API_ENDPOINTS.USERS.ROLE(id),
      { role: request.systemRole }
    );
    return data;
  },

  // ============================================
  // User Roles (1:N 다중 역할)
  // ============================================

  /** 사용자 역할 목록 조회 */
  async getUserRoles(id: number): Promise<SystemRole[]> {
    const { data } = await axiosInstance.get<SystemRole[]>(
      API_ENDPOINTS.USERS.ROLES(id)
    );
    return data;
  },

  /** 사용자 역할 전체 업데이트 (1:N) */
  async updateUserRoles(id: number, request: UpdateUserRolesRequest): Promise<UserRolesResponse> {
    const { data } = await axiosInstance.put<UserRolesResponse>(
      API_ENDPOINTS.USERS.ROLES(id),
      request
    );
    return data;
  },

  /** 사용자에게 역할 추가 */
  async addUserRole(id: number, role: SystemRole): Promise<UserRolesResponse> {
    const { data } = await axiosInstance.post<UserRolesResponse>(
      API_ENDPOINTS.USERS.ROLE_BY_NAME(id, role)
    );
    return data;
  },

  /** 사용자에서 역할 제거 */
  async removeUserRole(id: number, role: SystemRole): Promise<UserRolesResponse> {
    const { data } = await axiosInstance.delete<UserRolesResponse>(
      API_ENDPOINTS.USERS.ROLE_BY_NAME(id, role)
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

  /** 파일 기반 단체 계정 생성 (Excel/CSV) */
  async fileBulkCreateUsers(
    file: File,
    options?: {
      defaultPassword?: string;
      role?: string;
      autoLinkEmployees?: boolean;
      sendWelcomeEmail?: boolean;
    }
  ): Promise<BulkCreateUsersResponse> {
    const formData = new FormData();
    formData.append('file', file);

    if (options?.defaultPassword) {
      formData.append('defaultPassword', options.defaultPassword);
    }
    if (options?.role) {
      formData.append('role', options.role);
    }
    if (options?.autoLinkEmployees !== undefined) {
      formData.append('autoLinkEmployees', String(options.autoLinkEmployees));
    }
    if (options?.sendWelcomeEmail !== undefined) {
      formData.append('sendWelcomeEmail', String(options.sendWelcomeEmail));
    }

    // Content-Type을 설정하지 않으면 axios가 자동으로 multipart/form-data와 boundary를 설정함
    const { data } = await axiosInstance.post<BulkCreateUsersResponse>(
      API_ENDPOINTS.USERS.BULK_FILE,
      formData
    );
    return data;
  },
};
