/**
 * 공개 배너 API 서비스
 * 인증 없이 접근 가능한 테넌트 배너 조회
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { BannerResponse, BannerPosition } from '@/types/ta/banner.types';

export const publicBannerService = {
  /**
   * 공개 배너 조회 (인증 불필요)
   * @param position 배너 위치 필터 (선택)
   */
  async getDisplayableBanners(position?: BannerPosition): Promise<BannerResponse[]> {
    const { data } = await axiosInstance.get<BannerResponse[]>(
      API_ENDPOINTS.BANNERS.PUBLIC,
      { params: position ? { position } : undefined }
    );
    return data;
  },
};
