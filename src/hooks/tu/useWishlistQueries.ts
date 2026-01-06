/**
 * 찜 목록(Wishlist) React Query 훅
 * CourseTime 기반으로 변경 (#207)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/tu/wishlistService';
import type { WishlistAddRequest } from '@/types/tu/wishlist.types';

// Query Keys
export const wishlistKeys = {
  all: ['wishlist'] as const,
  list: (page?: number, size?: number) => [...wishlistKeys.all, 'list', { page, size }] as const,
  count: () => [...wishlistKeys.all, 'count'] as const,
  check: (courseTimeId: number) => [...wishlistKeys.all, 'check', courseTimeId] as const,
  checkBulk: (courseTimeIds: number[]) => [...wishlistKeys.all, 'checkBulk', courseTimeIds] as const,
};

/**
 * 내 찜 목록 조회 훅 (페이징)
 */
export function useMyWishlist(page: number = 0, size: number = 20, enabled = true) {
  return useQuery({
    queryKey: wishlistKeys.list(page, size),
    queryFn: () => wishlistService.getMyWishlist(page, size),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 내 찜 개수 조회 훅
 */
export function useMyWishlistCount(enabled = true) {
  return useQuery({
    queryKey: wishlistKeys.count(),
    queryFn: wishlistService.getMyWishlistCount,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 특정 CourseTime 찜 여부 확인 훅
 */
export function useCheckWishlistStatus(courseTimeId: number, enabled = true) {
  return useQuery({
    queryKey: wishlistKeys.check(courseTimeId),
    queryFn: () => wishlistService.checkWishlistStatus(courseTimeId),
    enabled: enabled && courseTimeId > 0,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 여러 CourseTime 찜 여부 일괄 확인 훅
 */
export function useCheckWishlistStatusBulk(courseTimeIds: number[], enabled = true) {
  return useQuery({
    queryKey: wishlistKeys.checkBulk(courseTimeIds),
    queryFn: () => wishlistService.checkWishlistStatusBulk({ courseTimeIds }),
    enabled: enabled && courseTimeIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 찜 추가 훅
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: WishlistAddRequest) => wishlistService.addToWishlist(request),
    onSuccess: (_, variables) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      // 특정 CourseTime 찜 여부 캐시 업데이트
      queryClient.setQueryData(wishlistKeys.check(variables.courseTimeId), true);
    },
  });
}

/**
 * 찜 삭제 훅
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseTimeId: number) => wishlistService.removeFromWishlist(courseTimeId),
    onSuccess: (_, courseTimeId) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      // 특정 CourseTime 찜 여부 캐시 업데이트
      queryClient.setQueryData(wishlistKeys.check(courseTimeId), false);
    },
  });
}

/**
 * 찜 토글 훅 (추가/삭제 통합)
 */
export function useToggleWishlist() {
  const addMutation = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const toggle = async (courseTimeId: number, isCurrentlyWishlisted: boolean) => {
    if (isCurrentlyWishlisted) {
      await removeMutation.mutateAsync(courseTimeId);
    } else {
      await addMutation.mutateAsync({ courseTimeId });
    }
  };

  return {
    toggle,
    isLoading: addMutation.isPending || removeMutation.isPending,
    error: addMutation.error || removeMutation.error,
  };
}
