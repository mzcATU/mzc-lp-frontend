/**
 * TA용 시스템 공지사항 서비스 (SA가 배포한 공지)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import type { Notice } from '@/types/admin';
import type { PageResponse } from '@/types/common';

export interface SystemNoticeListParams {
  page?: number;
  size?: number;
}

export const systemNoticeService = {
  /**
   * 현재 테넌트에 배포된 시스템 공지 목록 조회
   */
  async getNotices(params?: SystemNoticeListParams): Promise<PageResponse<Notice>> {
    const { data } = await axiosInstance.get<PageResponse<Notice>>('/ta/notices', {
      params,
    });
    return data;
  },

  /**
   * 시스템 공지 상세 조회
   */
  async getNotice(noticeId: number): Promise<Notice> {
    const { data } = await axiosInstance.get<Notice>(`/ta/notices/${noticeId}`);
    return data;
  },

  /**
   * 시스템 공지 읽음 처리
   */
  async markAsRead(noticeId: number): Promise<void> {
    await axiosInstance.post(`/ta/notices/${noticeId}/read`);
  },
};
