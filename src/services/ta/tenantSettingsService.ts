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

export const tenantSettingsService = {
  /** 테넌트 설정 조회 */
  async getSettings(): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.get<{ data: TenantSettingsDetail }>(
      API_ENDPOINTS.TENANT_SETTINGS.BASE
    );
    return data.data;
  },

  /** 테넌트 설정 전체 수정 */
  async update(request: UpdateTenantSettingsRequest): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.put<{ data: TenantSettingsDetail }>(
      API_ENDPOINTS.TENANT_SETTINGS.BASE,
      request
    );
    return data.data;
  },

  /** 브랜딩 설정 수정 */
  async updateBranding(request: UpdateBrandingRequest): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.patch<{ data: TenantSettingsDetail }>(
      API_ENDPOINTS.TENANT_SETTINGS.BRANDING,
      request
    );
    return data.data;
  },

  /** 사용자 관리 설정 수정 */
  async updateUserManagement(request: UpdateUserManagementRequest): Promise<TenantSettingsDetail> {
    const { data } = await axiosInstance.patch<{ data: TenantSettingsDetail }>(
      API_ENDPOINTS.TENANT_SETTINGS.USER_MANAGEMENT,
      request
    );
    return data.data;
  },
};
