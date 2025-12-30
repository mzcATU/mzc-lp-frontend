/**
 * 알림(Notification) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/tu/notificationService';
import type {
  NotificationFilter,
  MarkAsReadRequest,
  DeleteNotificationRequest,
} from '@/types/tu/notification.types';

// Query Keys
export const notificationKeys = {
  all: ['notifications'] as const,
  list: (filter?: NotificationFilter) => [...notificationKeys.all, 'list', filter] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
};

/**
 * 알림 목록 조회 훅
 */
export function useNotifications(filter?: NotificationFilter, enabled = true) {
  return useQuery({
    queryKey: notificationKeys.list(filter),
    queryFn: () => notificationService.getNotifications(filter),
    enabled,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 읽지 않은 알림 개수 조회 훅
 */
export function useUnreadNotificationCount(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationService.getUnreadCount,
    enabled,
    staleTime: 1000 * 30, // 30초
    refetchInterval: 1000 * 60, // 1분마다 자동 갱신
  });
}

/**
 * 알림 읽음 처리 훅
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAsReadRequest) => notificationService.markAsRead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * 모든 알림 읽음 처리 훅
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * 알림 삭제 훅
 */
export function useDeleteNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteNotificationRequest) => notificationService.deleteNotifications(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * 읽은 알림 전체 삭제 훅
 */
export function useDeleteReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.deleteReadNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
