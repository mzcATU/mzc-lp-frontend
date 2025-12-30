/**
 * 로드맵 탐색(Roadmap Explore) React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { roadmapExploreService } from '@/services/tu/roadmapExploreService';
import type { RoadmapExploreFilter } from '@/types/tu/roadmapExplore.types';

// Query Keys
export const roadmapExploreKeys = {
  all: ['roadmapExplore'] as const,
  list: (filter?: RoadmapExploreFilter) => [...roadmapExploreKeys.all, 'list', filter] as const,
  categories: () => [...roadmapExploreKeys.all, 'categories'] as const,
  popular: (limit?: number) => [...roadmapExploreKeys.all, 'popular', limit] as const,
  new: (limit?: number) => [...roadmapExploreKeys.all, 'new', limit] as const,
  recommended: (limit?: number) => [...roadmapExploreKeys.all, 'recommended', limit] as const,
};

/**
 * 로드맵 목록 조회 훅
 */
export function useRoadmapExplore(filter?: RoadmapExploreFilter, enabled = true) {
  return useQuery({
    queryKey: roadmapExploreKeys.list(filter),
    queryFn: () => roadmapExploreService.getRoadmaps(filter),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 카테고리 목록 조회 훅
 */
export function useRoadmapCategories(enabled = true) {
  return useQuery({
    queryKey: roadmapExploreKeys.categories(),
    queryFn: roadmapExploreService.getCategories,
    enabled,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 인기 로드맵 조회 훅
 */
export function usePopularRoadmapsExplore(limit?: number, enabled = true) {
  return useQuery({
    queryKey: roadmapExploreKeys.popular(limit),
    queryFn: () => roadmapExploreService.getPopularRoadmaps(limit),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 신규 로드맵 조회 훅
 */
export function useNewRoadmaps(limit?: number, enabled = true) {
  return useQuery({
    queryKey: roadmapExploreKeys.new(limit),
    queryFn: () => roadmapExploreService.getNewRoadmaps(limit),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 추천 로드맵 조회 훅
 */
export function useRecommendedRoadmapsExplore(limit?: number, enabled = true) {
  return useQuery({
    queryKey: roadmapExploreKeys.recommended(limit),
    queryFn: () => roadmapExploreService.getRecommendedRoadmaps(limit),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
