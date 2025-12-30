/**
 * Notice React Query Hooks (SA - Super Admin)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noticeService } from '@/services/sa';
import type {
  NoticeListParams,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  DistributeNoticeRequest,
} from '@/types/admin';

// Query Keys
export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (params?: NoticeListParams) => [...noticeKeys.lists(), params] as const,
  details: () => [...noticeKeys.all, 'detail'] as const,
  detail: (id: number) => [...noticeKeys.details(), id] as const,
  tenants: (id: number) => [...noticeKeys.all, 'tenants', id] as const,
};

// ============================================
// Queries
// ============================================

/** 공지사항 목록 조회 */
export const useNotices = (params?: NoticeListParams) => {
  return useQuery({
    queryKey: noticeKeys.list(params),
    queryFn: () => noticeService.getNotices(params),
  });
};

/** 공지사항 상세 조회 */
export const useNotice = (id: number) => {
  return useQuery({
    queryKey: noticeKeys.detail(id),
    queryFn: () => noticeService.getNotice(id),
    enabled: !!id,
  });
};

/** 배포된 테넌트 목록 조회 */
export const useDistributedTenants = (id: number) => {
  return useQuery({
    queryKey: noticeKeys.tenants(id),
    queryFn: () => noticeService.getDistributedTenants(id),
    enabled: !!id,
  });
};

// ============================================
// Mutations
// ============================================

/** 공지사항 생성 */
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateNoticeRequest) => noticeService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
};

/** 공지사항 수정 */
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateNoticeRequest }) =>
      noticeService.update(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
};

/** 공지사항 삭제 */
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => noticeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
};

/** 공지사항 발행 */
export const usePublishNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => noticeService.publish(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
};

/** 공지사항 보관 */
export const useArchiveNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => noticeService.archive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
};

/** 특정 테넌트에 배포 */
export const useDistributeNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: DistributeNoticeRequest }) =>
      noticeService.distribute(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: noticeKeys.tenants(variables.id) });
    },
  });
};

/** 전체 테넌트에 배포 */
export const useDistributeAllNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => noticeService.distributeAll(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: noticeKeys.tenants(id) });
    },
  });
};
