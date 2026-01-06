/**
 * TA 배너 관리 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  BannerResponse,
  CreateBannerRequest,
  UpdateBannerRequest,
  BannerListParams,
  BannerPosition,
} from '@/types/ta/banner.types';

/**
 * 요청 객체에서 undefined 값만 제거 (null은 유지)
 */
function cleanRequest<T extends object>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      // undefined는 제외, null은 유지
      if (value === undefined) continue;
      cleaned[key as keyof T] = value;
    }
  }
  return cleaned;
}

export const bannerService = {
  /**
   * 배너 목록 조회
   */
  async getBanners(params?: BannerListParams): Promise<BannerResponse[]> {
    const { data } = await axiosInstance.get<BannerResponse[]>(
      API_ENDPOINTS.BANNERS.BASE,
      { params }
    );
    return data;
  },

  /**
   * 배너 상세 조회
   */
  async getBanner(id: number): Promise<BannerResponse> {
    const { data } = await axiosInstance.get<BannerResponse>(
      API_ENDPOINTS.BANNERS.BY_ID(id)
    );
    return data;
  },

  /**
   * 배너 생성
   */
  async createBanner(request: CreateBannerRequest): Promise<BannerResponse> {
    const cleanedRequest = cleanRequest(request);
    const { data } = await axiosInstance.post<BannerResponse>(
      API_ENDPOINTS.BANNERS.BASE,
      cleanedRequest
    );
    return data;
  },

  /**
   * 배너 수정
   */
  async updateBanner(id: number, request: UpdateBannerRequest): Promise<BannerResponse> {
    const cleanedRequest = cleanRequest(request);
    const { data } = await axiosInstance.put<BannerResponse>(
      API_ENDPOINTS.BANNERS.BY_ID(id),
      cleanedRequest
    );
    return data;
  },

  /**
   * 배너 삭제
   */
  async deleteBanner(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.BANNERS.BY_ID(id));
  },

  /**
   * 배너 활성화
   */
  async activateBanner(id: number): Promise<BannerResponse> {
    const { data } = await axiosInstance.put<BannerResponse>(
      API_ENDPOINTS.BANNERS.ACTIVATE(id)
    );
    return data;
  },

  /**
   * 배너 비활성화
   */
  async deactivateBanner(id: number): Promise<BannerResponse> {
    const { data } = await axiosInstance.put<BannerResponse>(
      API_ENDPOINTS.BANNERS.DEACTIVATE(id)
    );
    return data;
  },

  /**
   * 공개 배너 조회 (TU용, 인증 불필요)
   */
  async getPublicBanners(position?: BannerPosition): Promise<BannerResponse[]> {
    const { data } = await axiosInstance.get<BannerResponse[]>(
      API_ENDPOINTS.BANNERS.PUBLIC,
      { params: position ? { position } : undefined }
    );
    return data;
  },
};
