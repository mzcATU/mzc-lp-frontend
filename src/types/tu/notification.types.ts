/**
 * 알림(Notification) 관련 타입 정의
 */

// 알림 타입
export type NotificationType =
  | 'course'      // 강의 관련
  | 'system'      // 시스템 알림
  | 'promotion'   // 프로모션
  | 'comment'     // 댓글/답변
  | 'assignment'; // 과제/제출

// 알림 아이템
export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

// 알림 목록 응답
export interface NotificationListResponse {
  notifications: NotificationItem[];
  totalCount: number;
  unreadCount: number;
}

// 알림 읽음 처리 요청
export interface MarkAsReadRequest {
  notificationIds: number[];
}

// 알림 삭제 요청
export interface DeleteNotificationRequest {
  notificationIds: number[];
}

// 알림 필터 옵션
export interface NotificationFilter {
  type?: NotificationType | 'all';
  isRead?: boolean;
}

// 알림 타입 레이블
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  course: '강의',
  system: '시스템',
  promotion: '프로모션',
  comment: '댓글',
  assignment: '과제',
};
