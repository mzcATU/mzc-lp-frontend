/**
 * Notice API 서비스 (SA - Super Admin)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  Notice,
  NoticeListResponse,
  NoticeListParams,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  DistributeNoticeRequest,
  NoticeDistributionStatsResponse,
  NoticeDistributionSummary,
  NoticeDistributionStats,
} from '@/types/admin';

export const noticeService = {
  /** 공지사항 목록 조회 */
  async getNotices(params?: NoticeListParams): Promise<NoticeListResponse> {
    const { data } = await axiosInstance.get<NoticeListResponse>(
      API_ENDPOINTS.NOTICES.BASE,
      { params }
    );
    return data;
  },

  /** 공지사항 상세 조회 */
  async getNotice(id: number): Promise<Notice> {
    const { data } = await axiosInstance.get<Notice>(
      API_ENDPOINTS.NOTICES.BY_ID(id)
    );
    return data;
  },

  /** 공지사항 생성 */
  async create(request: CreateNoticeRequest): Promise<Notice> {
    const { data } = await axiosInstance.post<Notice>(
      API_ENDPOINTS.NOTICES.BASE,
      request
    );
    return data;
  },

  /** 공지사항 수정 */
  async update(id: number, request: UpdateNoticeRequest): Promise<Notice> {
    const { data } = await axiosInstance.put<Notice>(
      API_ENDPOINTS.NOTICES.BY_ID(id),
      request
    );
    return data;
  },

  /** 공지사항 삭제 */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.NOTICES.BY_ID(id));
  },

  /** 공지사항 발행 */
  async publish(id: number): Promise<Notice> {
    const { data } = await axiosInstance.post<Notice>(
      API_ENDPOINTS.NOTICES.PUBLISH(id)
    );
    return data;
  },

  /** 공지사항 보관 */
  async archive(id: number): Promise<Notice> {
    const { data } = await axiosInstance.post<Notice>(
      API_ENDPOINTS.NOTICES.ARCHIVE(id)
    );
    return data;
  },

  /** 특정 테넌트에 배포 */
  async distribute(id: number, request: DistributeNoticeRequest): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.NOTICES.DISTRIBUTE(id), request);
  },

  /** 전체 테넌트에 배포 */
  async distributeAll(id: number): Promise<void> {
    await axiosInstance.post(API_ENDPOINTS.NOTICES.DISTRIBUTE_ALL(id));
  },

  /** 배포된 테넌트 ID 목록 조회 */
  async getDistributedTenants(id: number): Promise<number[]> {
    const { data } = await axiosInstance.get<number[]>(
      API_ENDPOINTS.NOTICES.TENANTS(id)
    );
    return data;
  },

  // ============================================
  // 배포 통계 API
  // ============================================

  /** 배포 통계 목록 조회 */
  async getDistributionStats(params?: { page?: number; size?: number }): Promise<NoticeDistributionStatsResponse> {
    const { data } = await axiosInstance.get<NoticeDistributionStatsResponse>(
      API_ENDPOINTS.NOTICES.DISTRIBUTIONS,
      { params }
    );
    return data;
  },

  /** 배포 통계 요약 조회 */
  async getDistributionSummary(): Promise<NoticeDistributionSummary> {
    const { data } = await axiosInstance.get<NoticeDistributionSummary>(
      API_ENDPOINTS.NOTICES.DISTRIBUTIONS_SUMMARY
    );
    return data;
  },

  /** 특정 공지 배포 상세 조회 */
  async getDistributionStatsForNotice(id: number): Promise<NoticeDistributionStats> {
    const { data } = await axiosInstance.get<NoticeDistributionStats>(
      API_ENDPOINTS.NOTICES.DISTRIBUTION_BY_ID(id)
    );
    return data;
  },
};
