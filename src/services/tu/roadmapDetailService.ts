import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  RoadmapDetail,
  RoadmapCard,
  RoadmapFilterParams,
  RoadmapReview,
  CreateReviewRequest,
  ReviewPageResponse,
} from '@/types/tu';
import type { PageResponse } from '@/services/tu/catalogService';

/**
 * 로드맵 상세 서비스
 * 로드맵 상세 정보 조회 및 관련 API 호출
 */

/**
 * 로드맵 상세 서비스
 */
export const roadmapDetailService = {
  /**
   * 로드맵 상세 조회
   * @param id 로드맵 ID
   */
  getRoadmapDetail: async (id: number): Promise<RoadmapDetail> => {
    const response = await axiosInstance.get<RoadmapDetail>(
      `/roadmaps/${id}`
    );
    return response.data;
  },

  /**
   * 로드맵 목록 조회 (카드 정보)
   * @param params 필터 파라미터
   */
  getRoadmaps: async (params?: RoadmapFilterParams): Promise<PageResponse<RoadmapCard>> => {
    const response = await axiosInstance.get<PageResponse<RoadmapCard>>(
      '/roadmaps',
      { params }
    );
    return response.data;
  },

  /**
   * 인기 로드맵 조회
   * @param limit 조회 개수
   */
  getPopularRoadmaps: async (limit: number = 10): Promise<RoadmapCard[]> => {
    const response = await axiosInstance.get<RoadmapCard[]>(
      '/roadmaps/popular',
      { params: { limit } }
    );
    return response.data;
  },

  /**
   * 추천 로드맵 조회
   * @param limit 조회 개수
   */
  getRecommendedRoadmaps: async (limit: number = 10): Promise<RoadmapCard[]> => {
    const response = await axiosInstance.get<RoadmapCard[]>(
      '/roadmaps/recommended',
      { params: { limit } }
    );
    return response.data;
  },

  /**
   * 로드맵 수강평 목록 조회
   * @param roadmapId 로드맵 ID
   * @param page 페이지 번호
   * @param size 페이지 크기
   */
  getReviews: async (
    roadmapId: number,
    page: number = 0,
    size: number = 10
  ): Promise<ReviewPageResponse> => {
    const response = await axiosInstance.get<ReviewPageResponse>(
      `/roadmaps/${roadmapId}/reviews`,
      { params: { page, size } }
    );
    return response.data;
  },

  /**
   * 수강평 작성
   * @param request 수강평 작성 요청
   */
  createReview: async (request: CreateReviewRequest): Promise<RoadmapReview> => {
    const response = await axiosInstance.post<RoadmapReview>(
      `/roadmaps/${request.roadmapId}/reviews`,
      { rating: request.rating, content: request.content }
    );
    return response.data;
  },

  /**
   * 수강평 도움됨 표시
   * @param roadmapId 로드맵 ID
   * @param reviewId 수강평 ID
   */
  markReviewHelpful: async (roadmapId: number, reviewId: number): Promise<void> => {
    await axiosInstance.post(`/roadmaps/${roadmapId}/reviews/${reviewId}/helpful`);
  },

  /**
   * 로드맵 시작하기 (수강 신청)
   * @param roadmapId 로드맵 ID
   */
  enrollRoadmap: async (roadmapId: number): Promise<{ enrollmentId: number }> => {
    const response = await axiosInstance.post<{ enrollmentId: number }>(
      `/roadmaps/${roadmapId}/enroll`
    );
    return response.data;
  },

  /**
   * 로드맵 진행률 조회 (로그인 사용자)
   * @param roadmapId 로드맵 ID
   */
  getProgress: async (roadmapId: number): Promise<{
    completedCourses: number;
    totalProgress: number;
  }> => {
    const response = await axiosInstance.get<{
      completedCourses: number;
      totalProgress: number;
    }>(`/roadmaps/${roadmapId}/progress`);
    return response.data;
  },
};

export default roadmapDetailService;
