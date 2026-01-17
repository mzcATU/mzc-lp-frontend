/**
 * TA 테넌트 공지사항 관리 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  TenantNotice,
  TenantNoticeListResponse,
  TenantNoticeListParams,
  TenantNoticeSearchParams,
  CreateTenantNoticeRequest,
  UpdateTenantNoticeRequest,
  TenantNoticeDistributionStatsResponse,
  TenantNoticeDistributionSummary,
  TenantNoticeDistributionDetail,
} from '@/types/ta/tenantNotice.types';

/**
 * 요청 객체에서 undefined 값만 제거 (null은 유지)
 */
function cleanRequest<T extends object>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value === undefined) continue;
      cleaned[key as keyof T] = value;
    }
  }
  return cleaned;
}

export const tenantNoticeService = {
  // ============================================
  // TA/TO 관리용 API
  // ============================================

  /**
   * 공지사항 목록 조회
   */
  async getNotices(params?: TenantNoticeListParams): Promise<TenantNoticeListResponse> {
    const { data } = await axiosInstance.get<TenantNoticeListResponse>(
      API_ENDPOINTS.TENANT_NOTICES.BASE,
      { params }
    );
    return data;
  },

  /**
   * 공지사항 검색
   */
  async searchNotices(params: TenantNoticeSearchParams): Promise<TenantNoticeListResponse> {
    const { data } = await axiosInstance.get<TenantNoticeListResponse>(
      API_ENDPOINTS.TENANT_NOTICES.SEARCH,
      { params }
    );
    return data;
  },

  /**
   * 공지사항 상세 조회
   */
  async getNotice(id: number): Promise<TenantNotice> {
    const { data } = await axiosInstance.get<TenantNotice>(
      API_ENDPOINTS.TENANT_NOTICES.BY_ID(id)
    );
    return data;
  },

  /**
   * 공지사항 생성
   */
  async createNotice(request: CreateTenantNoticeRequest): Promise<TenantNotice> {
    const cleanedRequest = cleanRequest(request);
    const { data } = await axiosInstance.post<TenantNotice>(
      API_ENDPOINTS.TENANT_NOTICES.BASE,
      cleanedRequest
    );
    return data;
  },

  /**
   * 공지사항 수정
   */
  async updateNotice(id: number, request: UpdateTenantNoticeRequest): Promise<TenantNotice> {
    const cleanedRequest = cleanRequest(request);
    const { data } = await axiosInstance.put<TenantNotice>(
      API_ENDPOINTS.TENANT_NOTICES.BY_ID(id),
      cleanedRequest
    );
    return data;
  },

  /**
   * 공지사항 삭제
   */
  async deleteNotice(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.TENANT_NOTICES.BY_ID(id));
  },

  /**
   * 공지사항 발행
   */
  async publishNotice(id: number): Promise<TenantNotice> {
    const { data } = await axiosInstance.post<TenantNotice>(
      API_ENDPOINTS.TENANT_NOTICES.PUBLISH(id)
    );
    return data;
  },

  /**
   * 공지사항 보관
   */
  async archiveNotice(id: number): Promise<TenantNotice> {
    const { data } = await axiosInstance.post<TenantNotice>(
      API_ENDPOINTS.TENANT_NOTICES.ARCHIVE(id)
    );
    return data;
  },

  // ============================================
  // TU/TO 조회용 API
  // ============================================

  /**
   * 발행된 공지사항 목록 조회 (TU/TO용)
   */
  async getVisibleNotices(params?: { page?: number; size?: number }): Promise<TenantNoticeListResponse> {
    const { data } = await axiosInstance.get<TenantNoticeListResponse>(
      API_ENDPOINTS.TENANT_NOTICES.TU_BASE,
      { params }
    );
    return data;
  },

  /**
   * 발행된 공지사항 상세 조회 (TU/TO용, 조회수 증가)
   */
  async getVisibleNotice(id: number): Promise<TenantNotice> {
    const { data } = await axiosInstance.get<TenantNotice>(
      API_ENDPOINTS.TENANT_NOTICES.TU_BY_ID(id)
    );
    return data;
  },

  /**
   * 발행된 공지사항 수 조회 (TU/TO용)
   */
  async countVisibleNotices(): Promise<number> {
    const { data } = await axiosInstance.get<number>(
      API_ENDPOINTS.TENANT_NOTICES.TU_COUNT
    );
    return data;
  },

  // ============================================
  // 배포 통계 API
  // ============================================

  /**
   * 배포 통계 목록 조회
   */
  async getDistributionStats(params?: { page?: number; size?: number }): Promise<TenantNoticeDistributionStatsResponse> {
    const { data } = await axiosInstance.get<TenantNoticeDistributionStatsResponse>(
      API_ENDPOINTS.TENANT_NOTICES.DISTRIBUTION_STATS,
      { params }
    );
    return data;
  },

  /**
   * 배포 통계 요약 조회
   */
  async getDistributionSummary(): Promise<TenantNoticeDistributionSummary> {
    const { data } = await axiosInstance.get<TenantNoticeDistributionSummary>(
      API_ENDPOINTS.TENANT_NOTICES.DISTRIBUTION_SUMMARY
    );
    return data;
  },

  /**
   * 특정 공지사항의 배포 상세 현황 조회
   */
  async getDistributionDetail(noticeId: number): Promise<TenantNoticeDistributionDetail> {
    const { data } = await axiosInstance.get<TenantNoticeDistributionDetail>(
      API_ENDPOINTS.TENANT_NOTICES.DISTRIBUTION_BY_ID(noticeId)
    );
    return data;
  },
};
