/**
 * 알림(Notification) 관련 타입 정의
 */

// 알림 타입 (Backend NotificationType enum과 일치)
export type NotificationType =
  | 'COMMENT'     // 댓글 알림
  | 'LIKE'        // 좋아요 알림
  | 'COURSE'      // 강의 관련 알림
  | 'SYSTEM'      // 시스템 알림
  | 'ASSIGNMENT'; // 과제 알림

// 알림 아이템
export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  referenceId?: number;
  referenceType?: string;
  actorId?: number;
  actorName?: string;
}

// 알림 목록 응답
export interface NotificationListResponse {
  notifications: NotificationItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  unreadCount: number;
}

// 읽지 않은 알림 개수 응답
export interface UnreadCountResponse {
  count: number;
}

// 알림 필터 옵션
export interface NotificationFilter {
  type?: NotificationType | 'all';
  isRead?: boolean;
  page?: number;
  pageSize?: number;
}

// 알림 타입 레이블
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  COMMENT: '댓글',
  LIKE: '좋아요',
  COURSE: '강의',
  SYSTEM: '시스템',
  ASSIGNMENT: '과제',
};

// 알림 타입 아이콘 색상
export const NOTIFICATION_TYPE_COLORS: Record<NotificationType, string> = {
  COMMENT: 'emerald',
  LIKE: 'rose',
  COURSE: 'blue',
  SYSTEM: 'amber',
  ASSIGNMENT: 'purple',
};
