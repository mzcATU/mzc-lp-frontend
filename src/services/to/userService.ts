/**
 * TO(Tenant Operator) 사용자 관리 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  UserListResponse,
  TOUserDetailResponse,
  ChangeStatusRequest,
  UserFilterParams,
} from '@/types/to/user.types';

// Spring Page 응답 타입
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const userService = {
  // ============================================
  // 조회
  // ============================================

  /** 사용자 목록 조회 */
  async getUsers(params?: UserFilterParams): Promise<PageResponse<UserListResponse>> {
    const response = await axiosInstance.get<{ data: PageResponse<UserListResponse> }>(
      API_ENDPOINTS.USERS.BASE,
      { params }
    );
    return response.data.data;
  },

  /** 사용자 상세 조회 */
  async getUser(id: number): Promise<TOUserDetailResponse> {
    const { data } = await axiosInstance.get<{ data: TOUserDetailResponse }>(
      API_ENDPOINTS.USERS.BY_ID(id)
    );
    return data.data;
  },

  // ============================================
  // 상태 변경
  // ============================================

  /** 사용자 상태 변경 */
  async changeStatus(id: number, request: ChangeStatusRequest): Promise<TOUserDetailResponse> {
    const { data } = await axiosInstance.put<{ data: TOUserDetailResponse }>(
      API_ENDPOINTS.USERS.STATUS(id),
      request
    );
    return data.data;
  },
};
