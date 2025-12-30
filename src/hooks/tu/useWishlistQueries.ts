/**
 * 찜 목록(Wishlist) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '@/services/tu/wishlistService';
import type {
  AddToWishlistRequest,
  RemoveFromWishlistRequest,
  AddAllToCartRequest,
} from '@/types/tu/wishlist.types';
import { cartKeys } from './useCartQueries';

// Query Keys
export const wishlistKeys = {
  all: ['wishlist'] as const,
  list: () => [...wishlistKeys.all, 'items'] as const,
};

/**
 * 찜 목록 조회 훅
 */
export function useWishlist(enabled = true) {
  return useQuery({
    queryKey: wishlistKeys.list(),
    queryFn: wishlistService.getWishlist,
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 찜 목록 추가 훅 (Wishlist 서비스용)
 */
export function useWishlistAddItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToWishlistRequest) => wishlistService.addToWishlist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

/**
 * 찜 목록 삭제 훅 (Wishlist 서비스용)
 */
export function useWishlistRemoveItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveFromWishlistRequest) => wishlistService.removeFromWishlist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

/**
 * 찜 목록 비우기 훅
 */
export function useClearWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => wishlistService.clearWishlist(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

/**
 * 찜 목록 전체를 장바구니에 담기 훅
 */
export function useAddAllToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddAllToCartRequest) => wishlistService.addAllToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
