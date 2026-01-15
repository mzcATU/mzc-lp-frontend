/**
 * 알림 템플릿 관련 타입 정의
 */

// 알림 카테고리
export type NotificationCategory = 'AUTH' | 'NOTIFICATION' | 'MARKETING' | 'SYSTEM';

// 알림 트리거 타입 (작동하는 트리거만)
export type NotificationTrigger =
  | 'WELCOME'
  | 'ENROLLMENT_COMPLETE'
  | 'COURSE_COMPLETE';

// 트리거 정보
export interface TriggerInfo {
  value: NotificationTrigger;
  label: string;
  category: NotificationCategory;
  categoryLabel: string;
}

// 카테고리 정보
export interface CategoryInfo {
  value: NotificationCategory;
  label: string;
}

// 알림 템플릿 응답
export interface NotificationTemplateResponse {
  id: number;
  triggerType: NotificationTrigger;
  triggerDisplayName: string;
  category: NotificationCategory;
  categoryDisplayName: string;
  name: string;
  titleTemplate: string;
  messageTemplate: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 템플릿 생성 요청
export interface CreateNotificationTemplateRequest {
  triggerType: NotificationTrigger;
  name: string;
  titleTemplate: string;
  messageTemplate: string;
  description?: string;
}

// 템플릿 수정 요청
export interface UpdateNotificationTemplateRequest {
  name: string;
  titleTemplate: string;
  messageTemplate: string;
  description?: string;
}

// 카테고리 설정
export const CATEGORY_CONFIG: Record<NotificationCategory, { label: string; color: string }> = {
  AUTH: { label: '인증', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  NOTIFICATION: { label: '알림', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  MARKETING: { label: '마케팅', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  SYSTEM: { label: '시스템', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400' },
};

// 트리거 타입별 사용 가능한 변수
export const TRIGGER_VARIABLES: Record<NotificationTrigger, string[]> = {
  WELCOME: ['userName'],
  ENROLLMENT_COMPLETE: ['userName', 'courseName'],
  COURSE_COMPLETE: ['userName', 'courseName'],
};
