/**
 * 장바구니(Cart) API 서비스
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  CartResponse,
  AddToCartRequest,
  RemoveFromCartRequest,
  ApplyCouponRequest,
  ApplyCouponResponse,
} from '@/types/tu/cart.types';

const BASE_URL = '/tu/cart';

export const cartService = {
  /**
   * 장바구니 목록 조회
   */
  getCart: async (): Promise<CartResponse> => {
    const response = await axiosInstance.get<CartResponse>(BASE_URL);
    return response.data;
  },

  /**
   * 장바구니에 강의 추가
   */
  addToCart: async (data: AddToCartRequest): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/items`, data);
  },

  /**
   * 장바구니에서 아이템 삭제
   */
  removeFromCart: async (data: RemoveFromCartRequest): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/items`, { data });
  },

  /**
   * 장바구니 비우기
   */
  clearCart: async (): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/clear`);
  },

  /**
   * 쿠폰 적용
   */
  applyCoupon: async (data: ApplyCouponRequest): Promise<ApplyCouponResponse> => {
    const response = await axiosInstance.post<ApplyCouponResponse>(`${BASE_URL}/coupon`, data);
    return response.data;
  },

  /**
   * 쿠폰 제거
   */
  removeCoupon: async (): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/coupon`);
  },
};
