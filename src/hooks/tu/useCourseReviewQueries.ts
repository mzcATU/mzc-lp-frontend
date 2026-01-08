/**
 * 코스 리뷰 React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseReviewService } from '@/services/tu/courseReviewService';
import type {
  CourseReviewParams,
  CreateReviewRequest,
  UpdateReviewRequest,
} from '@/types/tu/courseReview.types';

// Query Keys
export const courseReviewKeys = {
  all: ['courseReview'] as const,
  reviews: (timeId: number, params?: CourseReviewParams) =>
    [...courseReviewKeys.all, 'reviews', timeId, params] as const,
  stats: (timeId: number) =>
    [...courseReviewKeys.all, 'stats', timeId] as const,
  myReview: (timeId: number) =>
    [...courseReviewKeys.all, 'myReview', timeId] as const,
};

/**
 * 코스 리뷰 목록 조회 훅
 */
export function useCourseReviews(
  timeId: number,
  params?: CourseReviewParams,
  enabled = true
) {
  return useQuery({
    queryKey: courseReviewKeys.reviews(timeId, params),
    queryFn: () => courseReviewService.getReviews(timeId, params),
    enabled: enabled && !!timeId,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 코스 리뷰 통계 조회 훅
 */
export function useCourseReviewStats(timeId: number, enabled = true) {
  return useQuery({
    queryKey: courseReviewKeys.stats(timeId),
    queryFn: () => courseReviewService.getReviewStats(timeId),
    enabled: enabled && !!timeId,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 내 리뷰 조회 훅
 */
export function useMyCourseReview(timeId: number, enabled = true) {
  return useQuery({
    queryKey: courseReviewKeys.myReview(timeId),
    queryFn: () => courseReviewService.getMyReview(timeId),
    enabled: enabled && !!timeId,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 리뷰 작성 훅
 */
export function useCreateCourseReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      data,
    }: {
      timeId: number;
      data: CreateReviewRequest;
    }) => courseReviewService.createReview(timeId, data),
    onSuccess: (_, variables) => {
      // 리뷰 목록 갱신
      queryClient.invalidateQueries({
        queryKey: [...courseReviewKeys.all, 'reviews', variables.timeId],
      });
      // 통계 갱신
      queryClient.invalidateQueries({
        queryKey: courseReviewKeys.stats(variables.timeId),
      });
      // 내 리뷰 갱신
      queryClient.invalidateQueries({
        queryKey: courseReviewKeys.myReview(variables.timeId),
      });
    },
  });
}

/**
 * 리뷰 수정 훅
 */
export function useUpdateCourseReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      reviewId,
      data,
    }: {
      timeId: number;
      reviewId: number;
      data: UpdateReviewRequest;
    }) => courseReviewService.updateReview(timeId, reviewId, data),
    onSuccess: (_, variables) => {
      // 리뷰 목록 갱신
      queryClient.invalidateQueries({
        queryKey: [...courseReviewKeys.all, 'reviews', variables.timeId],
      });
      // 통계 갱신
      queryClient.invalidateQueries({
        queryKey: courseReviewKeys.stats(variables.timeId),
      });
      // 내 리뷰 갱신
      queryClient.invalidateQueries({
        queryKey: courseReviewKeys.myReview(variables.timeId),
      });
    },
  });
}

/**
 * 리뷰 삭제 훅
 */
export function useDeleteCourseReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ timeId, reviewId }: { timeId: number; reviewId: number }) =>
      courseReviewService.deleteReview(timeId, reviewId),
    onSuccess: (_, variables) => {
      // 리뷰 목록 갱신
      queryClient.invalidateQueries({
        queryKey: [...courseReviewKeys.all, 'reviews', variables.timeId],
      });
      // 통계 갱신
      queryClient.invalidateQueries({
        queryKey: courseReviewKeys.stats(variables.timeId),
      });
      // 내 리뷰 갱신
      queryClient.invalidateQueries({
        queryKey: courseReviewKeys.myReview(variables.timeId),
      });
    },
  });
}
