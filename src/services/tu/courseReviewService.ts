/**
 * 코스 리뷰 API 서비스
 * /api/times/{timeId}/reviews/* 엔드포인트 사용
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  CourseReview,
  CourseReviewListResponse,
  CourseReviewStats,
  CreateReviewRequest,
  UpdateReviewRequest,
  CourseReviewParams,
} from '@/types/tu/courseReview.types';

const getBaseUrl = (timeId: number) => `/times/${timeId}/reviews`;

export const courseReviewService = {
  /**
   * 리뷰 목록 조회
   */
  getReviews: async (
    timeId: number,
    params?: CourseReviewParams
  ): Promise<CourseReviewListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) {
      queryParams.append('page', String(params.page));
    }
    if (params?.size) {
      queryParams.append('size', String(params.size));
    }
    if (params?.sort) {
      queryParams.append('sort', params.sort);
    }

    const query = queryParams.toString();
    const url = query ? `${getBaseUrl(timeId)}?${query}` : getBaseUrl(timeId);
    const response = await axiosInstance.get<CourseReviewListResponse>(url);
    return response.data;
  },

  /**
   * 리뷰 통계 조회 (평균 별점, 분포 등)
   */
  getReviewStats: async (timeId: number): Promise<CourseReviewStats> => {
    const response = await axiosInstance.get<CourseReviewStats>(
      `${getBaseUrl(timeId)}/stats`
    );
    return response.data;
  },

  /**
   * 내 리뷰 조회
   */
  getMyReview: async (timeId: number): Promise<CourseReview | null> => {
    try {
      const response = await axiosInstance.get<CourseReview>(
        `${getBaseUrl(timeId)}/my`
      );
      return response.data;
    } catch {
      // 리뷰가 없는 경우 null 반환
      return null;
    }
  },

  /**
   * 리뷰 작성
   */
  createReview: async (
    timeId: number,
    data: CreateReviewRequest
  ): Promise<CourseReview> => {
    const response = await axiosInstance.post<CourseReview>(
      getBaseUrl(timeId),
      data
    );
    return response.data;
  },

  /**
   * 리뷰 수정
   */
  updateReview: async (
    timeId: number,
    reviewId: number,
    data: UpdateReviewRequest
  ): Promise<CourseReview> => {
    const response = await axiosInstance.patch<CourseReview>(
      `${getBaseUrl(timeId)}/${reviewId}`,
      data
    );
    return response.data;
  },

  /**
   * 리뷰 삭제
   */
  deleteReview: async (timeId: number, reviewId: number): Promise<void> => {
    await axiosInstance.delete(`${getBaseUrl(timeId)}/${reviewId}`);
  },
};
