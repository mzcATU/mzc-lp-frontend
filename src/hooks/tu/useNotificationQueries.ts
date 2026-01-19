/**
 * 알림(Notification) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/tu/notificationService';
import type { NotificationFilter } from '@/types/tu/notification.types';

// Query Keys
export const notificationKeys = {
  all: ['notifications'] as const,
  list: (filter?: NotificationFilter) => [...notificationKeys.all, 'list', filter] as const,
  detail: (id: number) => [...notificationKeys.all, 'detail', id] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
  latestUnread: () => [...notificationKeys.all, 'latestUnread'] as const,
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
 * 알림 상세 조회 훅
 */
export function useNotification(notificationId: number, enabled = true) {
  return useQuery({
    queryKey: notificationKeys.detail(notificationId),
    queryFn: () => notificationService.getNotification(notificationId),
    enabled: enabled && !!notificationId,
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
 * 최신 읽지 않은 알림 1개 조회 훅 (배너용)
 */
export function useLatestUnreadNotification(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.latestUnread(),
    queryFn: notificationService.getLatestUnread,
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
    mutationFn: (notificationId: number) => notificationService.markAsRead(notificationId),
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
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => notificationService.deleteNotification(notificationId),
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
