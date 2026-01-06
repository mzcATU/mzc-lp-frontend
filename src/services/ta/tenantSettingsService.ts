/**
 * Tenant Settings API 서비스 (TA - Tenant Admin)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  TenantSettingsDetail,
  UpdateTenantSettingsRequest,
  UpdateBrandingRequest,
  UpdateUserManagementRequest,
} from '@/types/admin';
import type { PublicBrandingResponse } from '@/types/tu/branding.types';

export const tenantSettingsService = {
  /** 현재 테넌트 브랜딩 조회 (로그인 사용자용) */
  async getBranding(): Promise<PublicBrandingResponse> {
    const { data } = await axiosInstance.get<{ data: PublicBrandingResponse }>(
      API_ENDPOINTS.TENANT_SETTINGS.BRANDING
    );
    return data.data;
  },

  /** 테넌트 설정 조회 */
  async getSettings(): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.get<TenantSettingsDetail>(
      API_ENDPOINTS.TENANT_SETTINGS.BASE
    );
    return data;
  },

  /** 테넌트 설정 전체 수정 */
  async update(request: UpdateTenantSettingsRequest): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.put<TenantSettingsDetail>(
      API_ENDPOINTS.TENANT_SETTINGS.BASE,
      request
    );
    return data;
  },

  /** 브랜딩 설정 수정 */
  async updateBranding(request: UpdateBrandingRequest): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.patch<TenantSettingsDetail>(
      API_ENDPOINTS.TENANT_SETTINGS.BRANDING,
      request
    );
    return data;
  },

  /** 사용자 관리 설정 수정 */
  async updateUserManagement(request: UpdateUserManagementRequest): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.patch<TenantSettingsDetail>(
      API_ENDPOINTS.TENANT_SETTINGS.USER_MANAGEMENT,
      request
    );
    return data;
  },
};
