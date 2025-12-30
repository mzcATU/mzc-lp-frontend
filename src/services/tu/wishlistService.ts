/**
 * 찜 목록(Wishlist) API 서비스
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  WishlistResponse,
  AddToWishlistRequest,
  RemoveFromWishlistRequest,
  AddAllToCartRequest,
} from '@/types/tu/wishlist.types';

const BASE_URL = '/tu/wishlist';

export const wishlistService = {
  /**
   * 찜 목록 조회
   */
  getWishlist: async (): Promise<WishlistResponse> => {
    const response = await axiosInstance.get<WishlistResponse>(BASE_URL);
    return response.data;
  },

  /**
   * 찜 목록에 강의 추가
   */
  addToWishlist: async (data: AddToWishlistRequest): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/items`, data);
  },

  /**
   * 찜 목록에서 아이템 삭제
   */
  removeFromWishlist: async (data: RemoveFromWishlistRequest): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/items`, { data });
  },

  /**
   * 찜 목록 전체 비우기
   */
  clearWishlist: async (): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/clear`);
  },

  /**
   * 찜 목록 전체를 장바구니에 담기
   */
  addAllToCart: async (data: AddAllToCartRequest): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/add-all-to-cart`, data);
  },
};
