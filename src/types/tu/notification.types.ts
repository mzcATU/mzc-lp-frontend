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

// 알림 메타데이터 (타입별 추가 정보)
export interface NotificationMetadata {
  // COURSE 알림
  courseName?: string;
  courseId?: number;
  courseTimeId?: number;
  enrollmentStatus?: 'APPROVED';

  // ASSIGNMENT 알림
  assignmentName?: string;
  assignmentId?: number;
  dueDate?: string;
  score?: number;
  maxScore?: number;

  // SYSTEM 알림
  noticeCategory?: string;

  // COMMENT/LIKE 알림
  postTitle?: string;
  postId?: number;
}

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
  metadata?: NotificationMetadata;
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
  SYSTEM: '공지사항',
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

// 참조 타입 (Backend NotificationReferenceType enum과 일치)
export type NotificationReferenceType =
  | 'COURSE'
  | 'ENROLLMENT'
  | 'ASSIGNMENT'
  | 'ASSIGNMENT_SUBMISSION'
  | 'NOTICE'
  | 'POST'
  | 'COMMENT';

// COURSE 알림 서브타입
export type CourseNotificationSubtype =
  | 'ENROLLMENT_APPROVED'   // 수강신청 승인
  | 'COURSE_STARTED'        // 강의 시작
  | 'COURSE_ENDED';         // 강의 종료

// ASSIGNMENT 알림 서브타입
export type AssignmentNotificationSubtype =
  | 'ASSIGNMENT_CREATED'    // 과제 출제
  | 'ASSIGNMENT_DEADLINE'   // 마감 임박
  | 'ASSIGNMENT_GRADED';    // 채점 완료

/**
 * 알림 아이템에서 딥링크 URL 생성
 * @param notification 알림 아이템
 * @returns 이동할 URL (없으면 null)
 */
export function getNotificationDeepLink(notification: NotificationItem): string | null {
  // 1. 명시적 link가 있으면 우선 사용
  if (notification.link) {
    return notification.link;
  }

  // 2. referenceType과 referenceId 기반으로 링크 생성
  const { type, referenceType, referenceId, message } = notification;

  if (!referenceType || !referenceId) {
    return null;
  }

  switch (type) {
    case 'COURSE':
      return getCourseNotificationLink(referenceType, referenceId, message, notification.metadata);
    case 'ASSIGNMENT':
      return getAssignmentNotificationLink(referenceType, referenceId, message);
    case 'SYSTEM':
      return getSystemNotificationLink(referenceType, referenceId);
    case 'COMMENT':
    case 'LIKE':
      return getInteractionNotificationLink(referenceType, referenceId, notification.metadata);
    default:
      return null;
  }
}

function getCourseNotificationLink(
  referenceType: string,
  referenceId: number,
  _message?: string,
  metadata?: NotificationMetadata
): string | null {
  const courseTimeId = metadata?.courseTimeId;

  // courseTimeId가 있으면 해당 강의 페이지로
  if (courseTimeId) {
    return `/tu/b2c/times/${courseTimeId}`;
  }

  if (referenceType === 'COURSE') {
    return `/tu/b2c/times/${referenceId}`;
  }

  // enrollment의 경우 내 강의 목록으로
  return '/tu/b2c/my-courses';
}

function getAssignmentNotificationLink(
  referenceType: string,
  referenceId: number,
  message?: string
): string | null {
  // 채점 완료 시 결과 페이지로
  if (message?.includes('채점') || referenceType === 'ASSIGNMENT_SUBMISSION') {
    return `/tu/assignments/${referenceId}/result`;
  }

  // 과제 출제/마감임박은 과제 상세로
  if (referenceType === 'ASSIGNMENT') {
    return `/tu/assignments/${referenceId}`;
  }

  return null;
}

function getSystemNotificationLink(
  referenceType: string,
  referenceId: number
): string | null {
  if (referenceType === 'NOTICE') {
    return `/tu/notices/${referenceId}`;
  }
  return null;
}

function getInteractionNotificationLink(
  referenceType: string,
  referenceId: number,
  _metadata?: NotificationMetadata
): string | null {
  if (referenceType === 'POST' || referenceType === 'COMMENT') {
    return `/tu/b2c/community/${referenceId}`;
  }
  return null;
}
