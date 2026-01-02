/**
 * 장바구니(Cart) React Query 훅 - 백엔드 API 스펙 기반
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/tu/cartService';
import type { CartAddRequest, CartRemoveRequest } from '@/types/tu/cart.types';

// Query Keys
export const cartKeys = {
  all: ['cart'] as const,
  cart: () => [...cartKeys.all, 'items'] as const,
  count: () => [...cartKeys.all, 'count'] as const,
  check: (courseId: number) => [...cartKeys.all, 'check', courseId] as const,
};

/**
 * 장바구니 목록 조회 훅
 */
export function useCart(enabled = true) {
  return useQuery({
    queryKey: cartKeys.cart(),
    queryFn: cartService.getCart,
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 장바구니 개수 조회 훅
 */
export function useCartCount(enabled = true) {
  return useQuery({
    queryKey: cartKeys.count(),
    queryFn: cartService.getCartCount,
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 특정 강의 장바구니 여부 확인 훅
 */
export function useCheckCartStatus(courseId: number, enabled = true) {
  return useQuery({
    queryKey: cartKeys.check(courseId),
    queryFn: () => cartService.checkCartStatus(courseId),
    enabled: enabled && courseId > 0,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 장바구니 추가 훅
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CartAddRequest) => cartService.addToCart(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * 장바구니 단일 삭제 훅
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: number) => cartService.removeFromCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * 장바구니 일괄 삭제 훅 (선택 삭제)
 */
export function useRemoveFromCartBulk() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CartRemoveRequest) => cartService.removeFromCartBulk(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * 장바구니 토글 훅 (추가/삭제)
 */
export function useToggleCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, isInCart }: { courseId: number; isInCart: boolean }) => {
      if (isInCart) {
        await cartService.removeFromCart(courseId);
        return { added: false };
      } else {
        await cartService.addToCart({ courseId });
        return { added: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
