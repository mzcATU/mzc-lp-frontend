/**
 * 찜 목록(Wishlist) API 서비스
 * CourseTime 기반으로 변경 (#207)
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { PageResponse } from '@/types/common/api.types';
import type {
  WishlistItemResponse,
  WishlistAddRequest,
  WishlistCheckRequest,
  WishlistCheckResponse,
  WishlistCountResponse,
} from '@/types/tu/wishlist.types';

export const wishlistService = {
  /**
   * 찜 추가
   */
  addToWishlist: async (request: WishlistAddRequest): Promise<WishlistItemResponse> => {
    const response = await axiosInstance.post<WishlistItemResponse>(
      API_ENDPOINTS.WISHLIST.BASE,
      request
    );
    return response.data;
  },

  /**
   * 찜 삭제
   */
  removeFromWishlist: async (courseTimeId: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.WISHLIST.COURSE_TIME(courseTimeId));
  },

  /**
   * 내 찜 목록 조회 (페이징)
   */
  getMyWishlist: async (
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<WishlistItemResponse>> => {
    const response = await axiosInstance.get<PageResponse<WishlistItemResponse>>(
      API_ENDPOINTS.WISHLIST.BASE,
      { params: { page, size } }
    );
    return response.data;
  },

  /**
   * 특정 CourseTime 찜 여부 확인
   */
  checkWishlistStatus: async (courseTimeId: number): Promise<boolean> => {
    const response = await axiosInstance.get<boolean>(
      API_ENDPOINTS.WISHLIST.COURSE_TIME_CHECK(courseTimeId)
    );
    return response.data;
  },

  /**
   * 여러 CourseTime 찜 여부 일괄 확인
   */
  checkWishlistStatusBulk: async (request: WishlistCheckRequest): Promise<WishlistCheckResponse> => {
    const response = await axiosInstance.post<WishlistCheckResponse>(
      API_ENDPOINTS.WISHLIST.CHECK_BULK,
      request
    );
    return response.data;
  },

  /**
   * 내 찜 개수 조회
   */
  getMyWishlistCount: async (): Promise<WishlistCountResponse> => {
    const response = await axiosInstance.get<WishlistCountResponse>(
      API_ENDPOINTS.WISHLIST.COUNT
    );
    return response.data;
  },
};
