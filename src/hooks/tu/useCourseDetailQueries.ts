/**
 * Course Detail React Query Hooks
 * 강의 상세 페이지용 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseDetailService } from '@/services/tu/courseDetailService';
import type { CourseFilterParams } from '@/types/tu';

// Query Keys
export const courseDetailKeys = {
  all: ['courseDetail'] as const,
  detail: (id: number) => [...courseDetailKeys.all, 'detail', id] as const,
  list: () => [...courseDetailKeys.all, 'list'] as const,
  listFiltered: (params?: CourseFilterParams) => [...courseDetailKeys.list(), params] as const,
  popular: (limit?: number) => [...courseDetailKeys.all, 'popular', limit] as const,
  recommended: (limit?: number) => [...courseDetailKeys.all, 'recommended', limit] as const,
  related: (courseId: number, limit?: number) => [...courseDetailKeys.all, 'related', courseId, limit] as const,
};

/**
 * 강의 상세 조회 훅
 * @param id 강의 ID
 * @param enabled 쿼리 활성화 여부 (기본값: true)
 */
export const useCourseDetail = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: courseDetailKeys.detail(id),
    queryFn: () => courseDetailService.getCourseDetail(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 강의 목록 조회 훅
 * @param params 필터 파라미터
 */
export const useCourses = (params?: CourseFilterParams) => {
  return useQuery({
    queryKey: courseDetailKeys.listFiltered(params),
    queryFn: () => courseDetailService.getCourses(params),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 인기 강의 조회 훅
 * @param limit 조회 개수
 */
export const usePopularCourses = (limit: number = 10) => {
  return useQuery({
    queryKey: courseDetailKeys.popular(limit),
    queryFn: () => courseDetailService.getPopularCourses(limit),
    staleTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 추천 강의 조회 훅
 * @param limit 조회 개수
 */
export const useRecommendedCourses = (limit: number = 10) => {
  return useQuery({
    queryKey: courseDetailKeys.recommended(limit),
    queryFn: () => courseDetailService.getRecommendedCourses(limit),
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * 관련 강의 조회 훅
 * @param courseId 기준 강의 ID
 * @param limit 조회 개수
 */
export const useRelatedCourses = (courseId: number, limit: number = 4) => {
  return useQuery({
    queryKey: courseDetailKeys.related(courseId, limit),
    queryFn: () => courseDetailService.getRelatedCourses(courseId, limit),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 강의 찜하기 뮤테이션
 */
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => courseDetailService.addToWishlist(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: courseDetailKeys.detail(courseId) });
    },
  });
};

/**
 * 강의 찜하기 해제 뮤테이션
 */
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => courseDetailService.removeFromWishlist(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: courseDetailKeys.detail(courseId) });
    },
  });
};

/**
 * 장바구니에 강의 추가 뮤테이션
 */
export const useAddToCart = () => {
  return useMutation({
    mutationFn: (courseId: number) => courseDetailService.addToCart(courseId),
  });
};
