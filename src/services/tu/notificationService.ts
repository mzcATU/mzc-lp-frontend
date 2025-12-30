/**
 * 알림(Notification) API 서비스
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  NotificationListResponse,
  NotificationFilter,
  MarkAsReadRequest,
  DeleteNotificationRequest,
} from '@/types/tu/notification.types';

const BASE_URL = '/tu/notifications';

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

    const query = params.toString();
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;
    const response = await axiosInstance.get<NotificationListResponse>(url);
    return response.data;
  },

  /**
   * 알림 읽음 처리
   */
  markAsRead: async (data: MarkAsReadRequest): Promise<void> => {
    await axiosInstance.patch(`${BASE_URL}/read`, data);
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
  deleteNotifications: async (data: DeleteNotificationRequest): Promise<void> => {
    await axiosInstance.delete(BASE_URL, { data });
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
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await axiosInstance.get<{ count: number }>(`${BASE_URL}/unread-count`);
    return response.data;
  },
};
