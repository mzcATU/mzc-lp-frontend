/**
 * Domain Settings API 서비스 (TA - Tenant Admin)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { TenantDomainSettings, UpdateCustomDomainRequest } from '@/types/admin/domain.types';

export const domainSettingsService = {
  /**
   * 도메인 설정 조회
   */
  async getSettings(): Promise<TenantDomainSettings> {
    const { data } = await axiosInstance.get<TenantDomainSettings>(
      API_ENDPOINTS.TA_DOMAIN_SETTINGS.BASE
    );
    return data;
  },

  /**
   * 커스텀 도메인 설정/수정
   */
  async updateCustomDomain(request: UpdateCustomDomainRequest): Promise<TenantDomainSettings> {
    const { data } = await axiosInstance.put<TenantDomainSettings>(
      API_ENDPOINTS.TA_DOMAIN_SETTINGS.CUSTOM,
      request
    );
    return data;
  },

  /**
   * 커스텀 도메인 삭제
   */
  async deleteCustomDomain(): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.TA_DOMAIN_SETTINGS.CUSTOM);
  },
};
