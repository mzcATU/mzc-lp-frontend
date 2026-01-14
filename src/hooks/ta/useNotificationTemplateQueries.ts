/**
 * 알림 템플릿 관리 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationTemplates,
  getNotificationTemplate,
  createNotificationTemplate,
  updateNotificationTemplate,
  deleteNotificationTemplate,
  activateNotificationTemplate,
  deactivateNotificationTemplate,
  initializeDefaultTemplates,
  getTriggerTypes,
  getCategories,
} from '@/services/ta/notificationTemplateService';
import type {
  NotificationCategory,
  CreateNotificationTemplateRequest,
  UpdateNotificationTemplateRequest,
} from '@/types/ta/notificationTemplate.types';

// Query Keys
export const notificationTemplateKeys = {
  all: ['notificationTemplates'] as const,
  lists: () => [...notificationTemplateKeys.all, 'list'] as const,
  list: (category?: NotificationCategory) =>
    [...notificationTemplateKeys.lists(), { category }] as const,
  details: () => [...notificationTemplateKeys.all, 'detail'] as const,
  detail: (id: number) => [...notificationTemplateKeys.details(), id] as const,
  triggers: () => [...notificationTemplateKeys.all, 'triggers'] as const,
  categories: () => [...notificationTemplateKeys.all, 'categories'] as const,
};

/**
 * 템플릿 목록 조회 훅
 */
export function useNotificationTemplates(category?: NotificationCategory) {
  return useQuery({
    queryKey: notificationTemplateKeys.list(category),
    queryFn: () => getNotificationTemplates(category),
  });
}

/**
 * 템플릿 상세 조회 훅
 */
export function useNotificationTemplate(id: number) {
  return useQuery({
    queryKey: notificationTemplateKeys.detail(id),
    queryFn: () => getNotificationTemplate(id),
    enabled: !!id,
  });
}

/**
 * 트리거 타입 목록 조회 훅
 */
export function useTriggerTypes() {
  return useQuery({
    queryKey: notificationTemplateKeys.triggers(),
    queryFn: getTriggerTypes,
    staleTime: Infinity, // 정적 데이터
  });
}

/**
 * 카테고리 목록 조회 훅
 */
export function useCategories() {
  return useQuery({
    queryKey: notificationTemplateKeys.categories(),
    queryFn: getCategories,
    staleTime: Infinity, // 정적 데이터
  });
}

/**
 * 템플릿 생성 훅
 */
export function useCreateNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateNotificationTemplateRequest) =>
      createNotificationTemplate(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationTemplateKeys.lists() });
    },
  });
}

/**
 * 템플릿 수정 훅
 */
export function useUpdateNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateNotificationTemplateRequest }) =>
      updateNotificationTemplate(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: notificationTemplateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationTemplateKeys.detail(id) });
    },
  });
}

/**
 * 템플릿 삭제 훅
 */
export function useDeleteNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNotificationTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationTemplateKeys.lists() });
    },
  });
}

/**
 * 템플릿 활성화 훅
 */
export function useActivateNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => activateNotificationTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationTemplateKeys.lists() });
    },
  });
}

/**
 * 템플릿 비활성화 훅
 */
export function useDeactivateNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deactivateNotificationTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationTemplateKeys.lists() });
    },
  });
}

/**
 * 기본 템플릿 초기화 훅
 */
export function useInitializeDefaultTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializeDefaultTemplates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationTemplateKeys.lists() });
    },
  });
}
