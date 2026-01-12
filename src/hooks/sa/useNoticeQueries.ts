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
  // 배포 통계
  distributions: () => [...noticeKeys.all, 'distributions'] as const,
  distributionList: (params?: { page?: number; size?: number }) => [...noticeKeys.distributions(), 'list', params] as const,
  distributionSummary: () => [...noticeKeys.distributions(), 'summary'] as const,
  distributionDetail: (id: number) => [...noticeKeys.distributions(), 'detail', id] as const,
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
      queryClient.invalidateQueries({ queryKey: noticeKeys.distributions() });
    },
  });
};

// ============================================
// 배포 통계 Queries
// ============================================

/** 배포 통계 목록 조회 */
export const useDistributionStats = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: noticeKeys.distributionList(params),
    queryFn: () => noticeService.getDistributionStats(params),
  });
};

/** 배포 통계 요약 조회 */
export const useDistributionSummary = () => {
  return useQuery({
    queryKey: noticeKeys.distributionSummary(),
    queryFn: () => noticeService.getDistributionSummary(),
  });
};

/** 특정 공지 배포 상세 조회 */
export const useDistributionStatsForNotice = (id: number) => {
  return useQuery({
    queryKey: noticeKeys.distributionDetail(id),
    queryFn: () => noticeService.getDistributionStatsForNotice(id),
    enabled: !!id,
  });
};
