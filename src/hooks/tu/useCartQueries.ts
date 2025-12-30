/**
 * 장바구니(Cart) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/tu/cartService';
import type {
  AddToCartRequest,
  RemoveFromCartRequest,
  ApplyCouponRequest,
} from '@/types/tu/cart.types';

// Query Keys
export const cartKeys = {
  all: ['cart'] as const,
  cart: () => [...cartKeys.all, 'items'] as const,
};

/**
 * 장바구니 조회 훅
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
 * 장바구니 추가 훅 (Cart 서비스용)
 */
export function useCartAddItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * 장바구니 아이템 삭제 훅
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoveFromCartRequest) => cartService.removeFromCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * 장바구니 비우기 훅
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * 쿠폰 적용 훅
 */
export function useApplyCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplyCouponRequest) => cartService.applyCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * 쿠폰 제거 훅
 */
export function useRemoveCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.removeCoupon(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
