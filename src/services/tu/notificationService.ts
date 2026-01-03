/**
 * 알림(Notification) API 서비스
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  NotificationListResponse,
  NotificationItem,
  NotificationFilter,
  UnreadCountResponse,
} from '@/types/tu/notification.types';

const BASE_URL = '/tu/notifications';

// API 응답 래퍼 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const notificationService = {
  /**
   * 알림 목록 조회
   */
  getNotifications: async (filter?: NotificationFilter): Promise<NotificationListResponse> => {
    const params = new URLSearchParams();
    if (filter?.type && filter.type !== 'all') {
      params.append('type', filter.type);
    }
    if (filter?.isRead !== undefined) {
      params.append('isRead', String(filter.isRead));
    }
    if (filter?.page !== undefined) {
      params.append('page', String(filter.page));
    }
    if (filter?.pageSize !== undefined) {
      params.append('pageSize', String(filter.pageSize));
    }

    const query = params.toString();
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;
    const response = await axiosInstance.get<ApiResponse<NotificationListResponse>>(url);
    return response.data.data;
  },

  /**
   * 알림 상세 조회
   */
  getNotification: async (notificationId: number): Promise<NotificationItem> => {
    const response = await axiosInstance.get<ApiResponse<NotificationItem>>(
      `${BASE_URL}/${notificationId}`
    );
    return response.data.data;
  },

  /**
   * 알림 읽음 처리
   */
  markAsRead: async (notificationId: number): Promise<void> => {
    await axiosInstance.patch(`${BASE_URL}/${notificationId}/read`);
  },

  /**
   * 모든 알림 읽음 처리
   */
  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.patch(`${BASE_URL}/read-all`);
  },

  /**
   * 알림 삭제
   */
  deleteNotification: async (notificationId: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${notificationId}`);
  },

  /**
   * 읽은 알림 전체 삭제
   */
  deleteReadNotifications: async (): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/read`);
  },

  /**
   * 읽지 않은 알림 개수 조회
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await axiosInstance.get<ApiResponse<UnreadCountResponse>>(
      `${BASE_URL}/unread-count`
    );
    return response.data.data;
  },
};
