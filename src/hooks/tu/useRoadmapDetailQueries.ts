/**
 * Roadmap Detail React Query Hooks
 * 로드맵 상세 페이지용 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapDetailService } from '@/services/tu/roadmapDetailService';
import type { RoadmapFilterParams, CreateReviewRequest } from '@/types/tu';

// Query Keys
export const roadmapDetailKeys = {
  all: ['roadmapDetail'] as const,
  detail: (id: number) => [...roadmapDetailKeys.all, 'detail', id] as const,
  list: () => [...roadmapDetailKeys.all, 'list'] as const,
  listFiltered: (params?: RoadmapFilterParams) => [...roadmapDetailKeys.list(), params] as const,
  popular: (limit?: number) => [...roadmapDetailKeys.all, 'popular', limit] as const,
  recommended: (limit?: number) => [...roadmapDetailKeys.all, 'recommended', limit] as const,
  reviews: (roadmapId: number, page?: number, size?: number) =>
    [...roadmapDetailKeys.all, 'reviews', roadmapId, page, size] as const,
  progress: (roadmapId: number) => [...roadmapDetailKeys.all, 'progress', roadmapId] as const,
};

/**
 * 로드맵 상세 조회 훅
 * @param id 로드맵 ID
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 */
export const useRoadmapDetail = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: roadmapDetailKeys.detail(id),
    queryFn: () => roadmapDetailService.getRoadmapDetail(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 로드맵 목록 조회 훅
 * @param params 필터 파라미터
 */
export const useRoadmaps = (params?: RoadmapFilterParams) => {
  return useQuery({
    queryKey: roadmapDetailKeys.listFiltered(params),
    queryFn: () => roadmapDetailService.getRoadmaps(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 인기 로드맵 조회 훅
 * @param limit 조회 개수
 */
export const usePopularRoadmaps = (limit: number = 10) => {
  return useQuery({
    queryKey: roadmapDetailKeys.popular(limit),
    queryFn: () => roadmapDetailService.getPopularRoadmaps(limit),
    staleTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 추천 로드맵 조회 훅
 * @param limit 조회 개수
 */
export const useRecommendedRoadmaps = (limit: number = 10) => {
  return useQuery({
    queryKey: roadmapDetailKeys.recommended(limit),
    queryFn: () => roadmapDetailService.getRecommendedRoadmaps(limit),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * 로드맵 수강평 목록 조회 훅
 * @param roadmapId 로드맵 ID
 * @param page 페이지 번호
 * @param size 페이지 크기
 */
export const useRoadmapReviews = (
  roadmapId: number,
  page: number = 0,
  size: number = 10
) => {
  return useQuery({
    queryKey: roadmapDetailKeys.reviews(roadmapId, page, size),
    queryFn: () => roadmapDetailService.getReviews(roadmapId, page, size),
    enabled: !!roadmapId,
    staleTime: 2 * 60 * 1000, // 2분
  });
};

/**
 * 로드맵 진행률 조회 훅 (로그인 사용자)
 * @param roadmapId 로드맵 ID
 * @param enabled 쿼리 활성화 여부
 */
export const useRoadmapProgress = (roadmapId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: roadmapDetailKeys.progress(roadmapId),
    queryFn: () => roadmapDetailService.getProgress(roadmapId),
    enabled: enabled && !!roadmapId,
    staleTime: 1 * 60 * 1000, // 1분
  });
};

/**
 * 수강평 작성 뮤테이션
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateReviewRequest) =>
      roadmapDetailService.createReview(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roadmapDetailKeys.reviews(variables.roadmapId)
      });
      queryClient.invalidateQueries({
        queryKey: roadmapDetailKeys.detail(variables.roadmapId)
      });
    },
  });
};

/**
 * 수강평 도움됨 표시 뮤테이션
 */
export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roadmapId, reviewId }: { roadmapId: number; reviewId: number }) =>
      roadmapDetailService.markReviewHelpful(roadmapId, reviewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roadmapDetailKeys.reviews(variables.roadmapId)
      });
    },
  });
};

/**
 * 로드맵 수강 신청 뮤테이션
 */
export const useEnrollRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roadmapId: number) => roadmapDetailService.enrollRoadmap(roadmapId),
    onSuccess: (_, roadmapId) => {
      queryClient.invalidateQueries({
        queryKey: roadmapDetailKeys.detail(roadmapId)
      });
      queryClient.invalidateQueries({
        queryKey: roadmapDetailKeys.progress(roadmapId)
      });
    },
  });
};
