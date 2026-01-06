/**
 * Tenant API 서비스 (SA - System Admin)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  TenantDetail,
  TenantListResponse,
  TenantStats,
  CreateTenantRequest,
  CreateTenantResponse,
  UpdateTenantDetailRequest,
} from '@/types/admin';

// 테넌트 필터 파라미터
export interface TenantFilterParams {
  keyword?: string;
  status?: string;
  plan?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const tenantService = {
  // ============================================
  // Tenant CRUD
  // ============================================

  /** 테넌트 생성 (관리자 계정도 함께 생성됨) */
  async create(request: CreateTenantRequest): Promise<CreateTenantResponse> {
    const { data } = await axiosInstance.post<{ data: CreateTenantResponse }>(
      API_ENDPOINTS.TENANTS.BASE,
      request
    );
    return data.data;
  },

  /** 테넌트 목록 조회 */
  async getTenants(params?: TenantFilterParams): Promise<TenantListResponse> {
    const { data } = await axiosInstance.get<TenantListResponse>(
      API_ENDPOINTS.TENANTS.BASE,
      { params }
    );
    return data;
  },

  /** 테넌트 상세 조회 */
  async getTenant(id: number): Promise<TenantDetail> {
    const { data } = await axiosInstance.get<TenantDetail>(
      API_ENDPOINTS.TENANTS.BY_ID(id)
    );
    return data;
  },

  /** 테넌트 수정 */
  async update(id: number, request: UpdateTenantDetailRequest): Promise<TenantDetail> {
    const { data } = await axiosInstance.put<TenantDetail>(
      API_ENDPOINTS.TENANTS.BY_ID(id),
      request
    );
    return data;
  },

  /** 테넌트 삭제 */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.TENANTS.BY_ID(id));
  },

  // ============================================
  // Statistics
  // ============================================

  /** 테넌트 통계 조회 */
  async getStats(): Promise<TenantStats> {
    const { data } = await axiosInstance.get<TenantStats>(
      `${API_ENDPOINTS.TENANTS.BASE}/stats`
    );
    return data;
  },
};
