/**
 * 찜 목록(Wishlist) API 서비스 - 백엔드 API 스펙 기반
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { ApiResponse, PageResponse } from '@/types/common/api.types';
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
    const response = await axiosInstance.post<ApiResponse<WishlistItemResponse>>(
      API_ENDPOINTS.WISHLIST.BASE,
      request
    );
    return response.data.data;
  },

  /**
   * 찜 삭제
   */
  removeFromWishlist: async (courseId: number): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.WISHLIST.COURSE(courseId));
  },

  /**
   * 내 찜 목록 조회 (페이징)
   */
  getMyWishlist: async (
    page: number = 0,
    size: number = 20
  ): Promise<PageResponse<WishlistItemResponse>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<WishlistItemResponse>>>(
      API_ENDPOINTS.WISHLIST.BASE,
      { params: { page, size } }
    );
    return response.data.data;
  },

  /**
   * 특정 강의 찜 여부 확인
   */
  checkWishlistStatus: async (courseId: number): Promise<boolean> => {
    const response = await axiosInstance.get<ApiResponse<boolean>>(
      API_ENDPOINTS.WISHLIST.COURSE_CHECK(courseId)
    );
    return response.data.data;
  },

  /**
   * 여러 강의 찜 여부 일괄 확인
   */
  checkWishlistStatusBulk: async (request: WishlistCheckRequest): Promise<WishlistCheckResponse> => {
    const response = await axiosInstance.post<ApiResponse<WishlistCheckResponse>>(
      API_ENDPOINTS.WISHLIST.CHECK_BULK,
      request
    );
    return response.data.data;
  },

  /**
   * 내 찜 개수 조회
   */
  getMyWishlistCount: async (): Promise<WishlistCountResponse> => {
    const response = await axiosInstance.get<ApiResponse<WishlistCountResponse>>(
      API_ENDPOINTS.WISHLIST.COUNT
    );
    return response.data.data;
  },

  /**
   * 특정 강의의 찜 개수 조회
   */
  getCourseWishlistCount: async (courseId: number): Promise<WishlistCountResponse> => {
    const response = await axiosInstance.get<ApiResponse<WishlistCountResponse>>(
      API_ENDPOINTS.WISHLIST.COURSE_COUNT(courseId)
    );
    return response.data.data;
  },
};
