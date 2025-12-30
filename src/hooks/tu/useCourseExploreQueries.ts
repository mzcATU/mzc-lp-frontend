/**
 * 강의 탐색(Course Explore) React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { courseExploreService } from '@/services/tu/courseExploreService';
import type { CourseExploreFilter } from '@/types/tu/courseExplore.types';

// Query Keys
export const courseExploreKeys = {
  all: ['courseExplore'] as const,
  list: (filter?: CourseExploreFilter) => [...courseExploreKeys.all, 'list', filter] as const,
  categories: () => [...courseExploreKeys.all, 'categories'] as const,
  popular: (limit?: number) => [...courseExploreKeys.all, 'popular', limit] as const,
  new: (limit?: number) => [...courseExploreKeys.all, 'new', limit] as const,
  recommended: (limit?: number) => [...courseExploreKeys.all, 'recommended', limit] as const,
};

/**
 * 강의 목록 조회 훅
 */
export function useCourseExplore(filter?: CourseExploreFilter, enabled = true) {
  return useQuery({
    queryKey: courseExploreKeys.list(filter),
    queryFn: () => courseExploreService.getCourses(filter),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 카테고리 목록 조회 훅
 */
export function useCourseCategories(enabled = true) {
  return useQuery({
    queryKey: courseExploreKeys.categories(),
    queryFn: courseExploreService.getCategories,
    enabled,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 인기 강의 조회 훅
 */
export function usePopularCoursesExplore(limit?: number, enabled = true) {
  return useQuery({
    queryKey: courseExploreKeys.popular(limit),
    queryFn: () => courseExploreService.getPopularCourses(limit),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 신규 강의 조회 훅
 */
export function useNewCourses(limit?: number, enabled = true) {
  return useQuery({
    queryKey: courseExploreKeys.new(limit),
    queryFn: () => courseExploreService.getNewCourses(limit),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 추천 강의 조회 훅
 */
export function useRecommendedCoursesExplore(limit?: number, enabled = true) {
  return useQuery({
    queryKey: courseExploreKeys.recommended(limit),
    queryFn: () => courseExploreService.getRecommendedCourses(limit),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
