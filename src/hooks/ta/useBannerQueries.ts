/**
 * TA 배너 관련 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '@/services/ta/bannerService';
import type {
  CreateBannerRequest,
  UpdateBannerRequest,
  BannerListParams,
  BannerPosition,
} from '@/types/ta/banner.types';

// ============================================
// Query Keys
// ============================================

export const bannerKeys = {
  all: ['ta-banners'] as const,
  lists: () => [...bannerKeys.all, 'list'] as const,
  list: (params?: BannerListParams) => [...bannerKeys.lists(), params] as const,
  details: () => [...bannerKeys.all, 'detail'] as const,
  detail: (id: number) => [...bannerKeys.details(), id] as const,
  public: (position?: BannerPosition) => [...bannerKeys.all, 'public', position] as const,
};

// ============================================
// 배너 조회 훅
// ============================================

/**
 * 배너 목록 조회
 */
export const useBanners = (params?: BannerListParams) => {
  return useQuery({
    queryKey: bannerKeys.list(params),
    queryFn: () => bannerService.getBanners(params),
  });
};

/**
 * 배너 상세 조회
 */
export const useBanner = (id: number) => {
  return useQuery({
    queryKey: bannerKeys.detail(id),
    queryFn: () => bannerService.getBanner(id),
    enabled: !!id,
  });
};

/**
 * 공개 배너 조회 (TU용)
 */
export const usePublicBanners = (position?: BannerPosition) => {
  return useQuery({
    queryKey: bannerKeys.public(position),
    queryFn: () => bannerService.getPublicBanners(position),
  });
};

// ============================================
// 배너 변이 훅
// ============================================

/**
 * 배너 생성
 */
export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateBannerRequest) => bannerService.createBanner(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};

/**
 * 배너 수정
 */
export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateBannerRequest }) =>
      bannerService.updateBanner(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.detail(id) });
    },
  });
};

/**
 * 배너 삭제
 */
export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bannerService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};

/**
 * 배너 활성화
 */
export const useActivateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bannerService.activateBanner(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.detail(id) });
    },
  });
};

/**
 * 배너 비활성화
 */
export const useDeactivateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bannerService.deactivateBanner(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.detail(id) });
    },
  });
};
