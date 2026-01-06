import axiosInstance from '@/services/common/api/axiosInstance';
import type { PublicBrandingResponse } from '@/types/tu/branding.types';

/**
 * 공개 브랜딩 API 서비스
 * 인증 없이 접근 가능한 테넌트 브랜딩 정보 조회
 */
export const publicBrandingService = {
  /**
   * 공개 브랜딩 정보 조회 (인증 불필요)
   * @param identifier subdomain 또는 customDomain
   * @param type 'subdomain' 또는 'customDomain'
   */
  async getPublicBranding(
    identifier: string,
    type: 'subdomain' | 'customDomain' = 'subdomain'
  ): Promise<PublicBrandingResponse> {
    const { data } = await axiosInstance.get<PublicBrandingResponse>(
      '/public/tenants/branding',
      {
        params: { identifier, type },
      }
    );
    return data;
  },
};
