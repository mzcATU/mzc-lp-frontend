/**
 * TA 테넌트 공지사항 관련 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantNoticeService } from '@/services/ta/tenantNoticeService';
import type {
  CreateTenantNoticeRequest,
  UpdateTenantNoticeRequest,
  TenantNoticeListParams,
  TenantNoticeSearchParams,
} from '@/types/ta/tenantNotice.types';

// ============================================
// Query Keys
// ============================================

export const tenantNoticeKeys = {
  all: ['tenant-notices'] as const,
  lists: () => [...tenantNoticeKeys.all, 'list'] as const,
  list: (params?: TenantNoticeListParams) => [...tenantNoticeKeys.lists(), params] as const,
  search: (params: TenantNoticeSearchParams) => [...tenantNoticeKeys.all, 'search', params] as const,
  details: () => [...tenantNoticeKeys.all, 'detail'] as const,
  detail: (id: number) => [...tenantNoticeKeys.details(), id] as const,
  // TU/TO 조회용
  visible: () => [...tenantNoticeKeys.all, 'visible'] as const,
  visibleList: (params?: { page?: number; size?: number }) => [...tenantNoticeKeys.visible(), 'list', params] as const,
  visibleDetail: (id: number) => [...tenantNoticeKeys.visible(), 'detail', id] as const,
  visibleCount: () => [...tenantNoticeKeys.visible(), 'count'] as const,
};

// ============================================
// TA/TO 관리용 훅
// ============================================

/**
 * 공지사항 목록 조회
 */
export const useTenantNotices = (params?: TenantNoticeListParams) => {
  return useQuery({
    queryKey: tenantNoticeKeys.list(params),
    queryFn: () => tenantNoticeService.getNotices(params),
  });
};

/**
 * 공지사항 검색
 */
export const useSearchTenantNotices = (params: TenantNoticeSearchParams) => {
  return useQuery({
    queryKey: tenantNoticeKeys.search(params),
    queryFn: () => tenantNoticeService.searchNotices(params),
    enabled: !!params.keyword,
  });
};

/**
 * 공지사항 상세 조회
 */
export const useTenantNotice = (id: number) => {
  return useQuery({
    queryKey: tenantNoticeKeys.detail(id),
    queryFn: () => tenantNoticeService.getNotice(id),
    enabled: !!id,
  });
};

/**
 * 공지사항 생성
 */
export const useCreateTenantNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTenantNoticeRequest) => tenantNoticeService.createNotice(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantNoticeKeys.lists() });
    },
  });
};

/**
 * 공지사항 수정
 */
export const useUpdateTenantNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateTenantNoticeRequest }) =>
      tenantNoticeService.updateNotice(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tenantNoticeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantNoticeKeys.detail(id) });
    },
  });
};

/**
 * 공지사항 삭제
 */
export const useDeleteTenantNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tenantNoticeService.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantNoticeKeys.lists() });
    },
  });
};

/**
 * 공지사항 발행
 */
export const usePublishTenantNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tenantNoticeService.publishNotice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tenantNoticeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantNoticeKeys.detail(id) });
      // TU/TO 조회용 캐시도 무효화
      queryClient.invalidateQueries({ queryKey: tenantNoticeKeys.visible() });
    },
  });
};

/**
 * 공지사항 보관
 */
export const useArchiveTenantNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tenantNoticeService.archiveNotice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tenantNoticeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantNoticeKeys.detail(id) });
      // TU/TO 조회용 캐시도 무효화
      queryClient.invalidateQueries({ queryKey: tenantNoticeKeys.visible() });
    },
  });
};

// ============================================
// TU/TO 조회용 훅
// ============================================

/**
 * 발행된 공지사항 목록 조회 (TU/TO용)
 */
export const useVisibleTenantNotices = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: tenantNoticeKeys.visibleList(params),
    queryFn: () => tenantNoticeService.getVisibleNotices(params),
  });
};

/**
 * 발행된 공지사항 상세 조회 (TU/TO용, 조회수 증가)
 */
export const useVisibleTenantNotice = (id: number) => {
  return useQuery({
    queryKey: tenantNoticeKeys.visibleDetail(id),
    queryFn: () => tenantNoticeService.getVisibleNotice(id),
    enabled: !!id,
  });
};

/**
 * 발행된 공지사항 수 조회 (TU/TO용)
 */
export const useVisibleTenantNoticeCount = () => {
  return useQuery({
    queryKey: tenantNoticeKeys.visibleCount(),
    queryFn: () => tenantNoticeService.countVisibleNotices(),
  });
};

// ============================================
// 배포 통계 훅
// ============================================

/**
 * 배포 통계 목록 조회
 */
export const useTenantNoticeDistributionStats = (params?: { page?: number; size?: number }) => {
  return useQuery({
    queryKey: [...tenantNoticeKeys.all, 'distribution-stats', params] as const,
    queryFn: () => tenantNoticeService.getDistributionStats(params),
  });
};

/**
 * 배포 통계 요약 조회
 */
export const useTenantNoticeDistributionSummary = () => {
  return useQuery({
    queryKey: [...tenantNoticeKeys.all, 'distribution-summary'] as const,
    queryFn: () => tenantNoticeService.getDistributionSummary(),
  });
};

/**
 * 특정 공지사항의 배포 상세 현황 조회
 */
export const useTenantNoticeDistributionDetail = (noticeId: number) => {
  return useQuery({
    queryKey: [...tenantNoticeKeys.all, 'distribution-detail', noticeId] as const,
    queryFn: () => tenantNoticeService.getDistributionDetail(noticeId),
    enabled: !!noticeId,
  });
};
