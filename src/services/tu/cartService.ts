/**
 * 장바구니(Cart) API 서비스 - 백엔드 API 스펙 기반
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  CartItemResponse,
  CartAddRequest,
  CartRemoveRequest,
  CartCountResponse,
} from '@/types/tu/cart.types';

export const cartService = {
  /**
   * 장바구니 목록 조회
   */
  getCart: async (): Promise<CartItemResponse[]> => {
    const response = await axiosInstance.get<ApiResponse<CartItemResponse[]>>(
      API_ENDPOINTS.CART.BASE
    );
    return response.data.data;
  },

  /**
   * 장바구니에 강의 추가
   */
  addToCart: async (request: CartAddRequest): Promise<CartItemResponse> => {
    const response = await axiosInstance.post<ApiResponse<CartItemResponse>>(
      API_ENDPOINTS.CART.ITEMS,
      request
    );
    return response.data.data;
  },

  /**
   * 장바구니에서 강의 삭제
   */
  removeFromCart: async (courseId: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.CART.ITEM(courseId));
  },

  /**
   * 장바구니에서 여러 강의 삭제 (선택 삭제)
   */
  removeFromCartBulk: async (request: CartRemoveRequest): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.CART.ITEMS, { data: request });
  },

  /**
   * 장바구니 개수 조회
   */
  getCartCount: async (): Promise<CartCountResponse> => {
    const response = await axiosInstance.get<ApiResponse<CartCountResponse>>(
      API_ENDPOINTS.CART.COUNT
    );
    return response.data.data;
  },

  /**
   * 특정 강의 장바구니 여부 확인
   */
  checkCartStatus: async (courseId: number): Promise<boolean> => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(
      API_ENDPOINTS.CART.ITEM_CHECK(courseId)
    );
    return response.data.data;
  },
};
