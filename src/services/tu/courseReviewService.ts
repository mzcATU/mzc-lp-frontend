/**
 * 코스 리뷰 API 서비스
 * /api/times/{timeId}/reviews/* 엔드포인트 사용
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  CourseReview,
  CourseReviewListResponse,
  CourseReviewListApiResponse,
  CourseReviewApiResponse,
  CourseReviewStats,
  CreateReviewRequest,
  UpdateReviewRequest,
  CourseReviewParams,
} from '@/types/tu/courseReview.types';

const getBaseUrl = (timeId: number) => `/times/${timeId}/reviews`;

/** 백엔드 리뷰를 프론트엔드 형식으로 변환 */
const mapReview = (review: CourseReviewApiResponse): CourseReview => ({
  id: review.reviewId,
  courseTimeId: review.courseTimeId,
  author: {
    id: review.userId,
    name: review.userName,
    profileImageUrl: review.userProfileImageUrl || null,
  },
  rating: review.rating,
  content: review.content,
  completionRate: review.completionRate || 0,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
  isMyReview: review.isMyReview || false,
});

/** 백엔드 리뷰 목록을 프론트엔드 형식으로 변환 */
const mapReviewList = (response: CourseReviewListApiResponse): CourseReviewListResponse => ({
  content: response.reviews.map(mapReview),
  totalElements: response.totalElements,
  totalPages: response.totalPages,
  page: response.currentPage,
  size: response.pageSize,
});

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
    const response = await axiosInstance.get<CourseReviewListApiResponse>(url);
    console.log('📝 Reviews API Response:', response.data);
    return mapReviewList(response.data);
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
      const response = await axiosInstance.get<CourseReviewApiResponse>(
        `${getBaseUrl(timeId)}/my`
      );
      // 빈 객체나 reviewId가 없으면 null 반환
      if (!response.data || !response.data.reviewId) {
        return null;
      }
      return mapReview(response.data);
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
    const response = await axiosInstance.post<CourseReviewApiResponse>(
      getBaseUrl(timeId),
      data
    );
    return mapReview(response.data);
  },

  /**
   * 리뷰 수정
   */
  updateReview: async (
    timeId: number,
    reviewId: number,
    data: UpdateReviewRequest
  ): Promise<CourseReview> => {
    const response = await axiosInstance.patch<CourseReviewApiResponse>(
      `${getBaseUrl(timeId)}/${reviewId}`,
      data
    );
    return mapReview(response.data);
  },

  /**
   * 리뷰 삭제
   */
  deleteReview: async (timeId: number, reviewId: number): Promise<void> => {
    await axiosInstance.delete(`${getBaseUrl(timeId)}/${reviewId}`);
  },
};
