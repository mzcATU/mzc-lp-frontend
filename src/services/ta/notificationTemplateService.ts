/**
 * 알림 템플릿 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  NotificationTemplateResponse,
  CreateNotificationTemplateRequest,
  UpdateNotificationTemplateRequest,
  NotificationCategory,
  TriggerInfo,
  CategoryInfo,
} from '@/types/ta/notificationTemplate.types';

/**
 * 템플릿 목록 조회
 */
export async function getNotificationTemplates(
  category?: NotificationCategory
): Promise<NotificationTemplateResponse[]> {
  const params = category ? { category } : {};
  const { data } = await axiosInstance.get<NotificationTemplateResponse[]>(
    API_ENDPOINTS.NOTIFICATION_TEMPLATES.BASE,
    { params }
  );
  return data;
}

/**
 * 템플릿 상세 조회
 */
export async function getNotificationTemplate(id: number): Promise<NotificationTemplateResponse> {
  const { data } = await axiosInstance.get<NotificationTemplateResponse>(
    API_ENDPOINTS.NOTIFICATION_TEMPLATES.BY_ID(id)
  );
  return data;
}

/**
 * 템플릿 생성
 */
export async function createNotificationTemplate(
  request: CreateNotificationTemplateRequest
): Promise<NotificationTemplateResponse> {
  const { data } = await axiosInstance.post<NotificationTemplateResponse>(
    API_ENDPOINTS.NOTIFICATION_TEMPLATES.BASE,
    request
  );
  return data;
}

/**
 * 템플릿 수정
 */
export async function updateNotificationTemplate(
  id: number,
  request: UpdateNotificationTemplateRequest
): Promise<NotificationTemplateResponse> {
  const { data } = await axiosInstance.put<NotificationTemplateResponse>(
    API_ENDPOINTS.NOTIFICATION_TEMPLATES.BY_ID(id),
    request
  );
  return data;
}

/**
 * 템플릿 삭제
 */
export async function deleteNotificationTemplate(id: number): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.NOTIFICATION_TEMPLATES.BY_ID(id));
}

/**
 * 템플릿 활성화
 */
export async function activateNotificationTemplate(id: number): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.NOTIFICATION_TEMPLATES.ACTIVATE(id));
}

/**
 * 템플릿 비활성화
 */
export async function deactivateNotificationTemplate(id: number): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.NOTIFICATION_TEMPLATES.DEACTIVATE(id));
}

/**
 * 기본 템플릿 초기화
 */
export async function initializeDefaultTemplates(): Promise<void> {
  await axiosInstance.post(API_ENDPOINTS.NOTIFICATION_TEMPLATES.INITIALIZE);
}

/**
 * 사용 가능한 트리거 타입 목록 조회
 */
export async function getTriggerTypes(): Promise<TriggerInfo[]> {
  const { data } = await axiosInstance.get<TriggerInfo[]>(
    API_ENDPOINTS.NOTIFICATION_TEMPLATES.TRIGGERS
  );
  return data;
}

/**
 * 사용 가능한 카테고리 목록 조회
 */
export async function getCategories(): Promise<CategoryInfo[]> {
  const { data } = await axiosInstance.get<CategoryInfo[]>(
    API_ENDPOINTS.NOTIFICATION_TEMPLATES.CATEGORIES
  );
  return data;
}
