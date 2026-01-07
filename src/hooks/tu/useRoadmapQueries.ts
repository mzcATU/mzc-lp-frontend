/**
 * TU 로드맵 관리 React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { roadmapService } from '@/services/tu/roadmapService';
import type {
  CreateRoadmapRequest,
  UpdateRoadmapRequest,
  SaveDraftRequest,
  RoadmapQueryParams,
} from '@/types/tu/roadmap.types';

// ============================================
// Query Keys
// ============================================

export const roadmapKeys = {
  all: ['roadmaps'] as const,
  lists: () => [...roadmapKeys.all, 'list'] as const,
  list: (params?: RoadmapQueryParams) => [...roadmapKeys.lists(), params] as const,
  details: () => [...roadmapKeys.all, 'detail'] as const,
  detail: (id: number) => [...roadmapKeys.details(), id] as const,
  statistics: () => [...roadmapKeys.all, 'statistics'] as const,
};

// ============================================
// Query Hooks
// ============================================

/**
 * 내 로드맵 목록 조회
 */
export const useMyRoadmaps = (params?: RoadmapQueryParams) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: roadmapKeys.list(params),
    queryFn: () => roadmapService.getMyRoadmaps(params),
    enabled: !!accessToken,
  });
};

/**
 * 로드맵 통계 조회
 */
export const useRoadmapStatistics = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: roadmapKeys.statistics(),
    queryFn: () => roadmapService.getStatistics(),
    enabled: !!accessToken,
  });
};

/**
 * 로드맵 상세 조회
 */
export const useRoadmap = (id: number) => {
  return useQuery({
    queryKey: roadmapKeys.detail(id),
    queryFn: () => roadmapService.getRoadmap(id),
    enabled: !!id,
  });
};

// ============================================
// Mutation Hooks
// ============================================

/**
 * 로드맵 생성
 */
export const useCreateRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRoadmapRequest) => roadmapService.createRoadmap(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.statistics() });
    },
  });
};

/**
 * 로드맵 수정
 */
export const useUpdateRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...request }: { id: number } & UpdateRoadmapRequest) =>
      roadmapService.updateRoadmap(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.statistics() });
    },
  });
};

/**
 * 로드맵 임시 저장
 */
export const useSaveDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...request }: { id: number } & SaveDraftRequest) =>
      roadmapService.saveDraft(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.statistics() });
    },
  });
};

/**
 * 로드맵 삭제
 */
export const useDeleteRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => roadmapService.deleteRoadmap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.statistics() });
    },
  });
};

/**
 * 로드맵 복제
 */
export const useDuplicateRoadmap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => roadmapService.duplicateRoadmap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roadmapKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roadmapKeys.statistics() });
    },
  });
};
