/**
 * TA용 시스템 공지사항 React Query Hooks (SA가 배포한 공지)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemNoticeService, type SystemNoticeListParams } from '@/services/ta/systemNoticeService';

// Query Keys
export const systemNoticeKeys = {
  all: ['system-notices'] as const,
  lists: () => [...systemNoticeKeys.all, 'list'] as const,
  list: (params?: SystemNoticeListParams) => [...systemNoticeKeys.lists(), params] as const,
  details: () => [...systemNoticeKeys.all, 'detail'] as const,
  detail: (id: number) => [...systemNoticeKeys.details(), id] as const,
};

/**
 * 시스템 공지 목록 조회 (TA에 배포된 SA 공지)
 */
export const useSystemNotices = (params?: SystemNoticeListParams) => {
  return useQuery({
    queryKey: systemNoticeKeys.list(params),
    queryFn: () => systemNoticeService.getNotices(params),
  });
};

/**
 * 시스템 공지 상세 조회
 */
export const useSystemNotice = (id: number) => {
  return useQuery({
    queryKey: systemNoticeKeys.detail(id),
    queryFn: () => systemNoticeService.getNotice(id),
    enabled: !!id,
  });
};

/**
 * 시스템 공지 읽음 처리
 */
export const useMarkSystemNoticeAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: number) => systemNoticeService.markAsRead(noticeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemNoticeKeys.lists() });
    },
  });
};
