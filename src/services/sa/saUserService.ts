/**
 * SA User API 서비스 (System Admin Users)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { SystemAdminUser, SystemAdminListResponse, CreateSystemAdminRequest } from '@/types/admin';

export interface SystemAdminFilterParams {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}

export const saUserService = {
  /**
   * SYSTEM_ADMIN 사용자 목록 조회
   */
  async getSystemAdmins(params?: SystemAdminFilterParams): Promise<SystemAdminListResponse> {
    const { data } = await axiosInstance.get<SystemAdminListResponse>(
      API_ENDPOINTS.SA_USERS.BASE,
      { params }
    );
    return data;
  },

  /**
   * SYSTEM_ADMIN 사용자 생성
   */
  async createSystemAdmin(request: CreateSystemAdminRequest): Promise<SystemAdminUser> {
    const { data } = await axiosInstance.post<SystemAdminUser>(
      API_ENDPOINTS.SA_USERS.BASE,
      request
    );
    return data;
  },
};
