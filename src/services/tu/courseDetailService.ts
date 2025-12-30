import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  CourseDetail,
  CourseCard,
  CourseFilterParams,
} from '@/types/tu';
import type { PageResponse } from '@/services/tu/catalogService';

/**
 * 강의 상세 서비스
 * 강의 상세 정보 조회 및 관련 API 호출
 */

// API 응답 래퍼 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 강의 상세 서비스
 */
export const courseDetailService = {
  /**
   * 강의 상세 조회
   * @param id 강의 ID
   */
  getCourseDetail: async (id: number): Promise<CourseDetail> => {
    const response = await axiosInstance.get<ApiResponse<CourseDetail>>(
      `/courses/${id}/detail`
    );
    return response.data.data;
  },

  /**
   * 강의 목록 조회 (카드 정보)
   * @param params 필터 파라미터
   */
  getCourses: async (params?: CourseFilterParams): Promise<PageResponse<CourseCard>> => {
    const response = await axiosInstance.get<ApiResponse<PageResponse<CourseCard>>>(
      '/courses/explore',
      { params }
    );
    return response.data.data;
  },

  /**
   * 인기 강의 조회
   * @param limit 조회 개수
   */
  getPopularCourses: async (limit: number = 10): Promise<CourseCard[]> => {
    const response = await axiosInstance.get<ApiResponse<CourseCard[]>>(
      '/courses/popular',
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * 추천 강의 조회
   * @param limit 조회 개수
   */
  getRecommendedCourses: async (limit: number = 10): Promise<CourseCard[]> => {
    const response = await axiosInstance.get<ApiResponse<CourseCard[]>>(
      '/courses/recommended',
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * 관련 강의 조회
   * @param courseId 기준 강의 ID
   * @param limit 조회 개수
   */
  getRelatedCourses: async (courseId: number, limit: number = 4): Promise<CourseCard[]> => {
    const response = await axiosInstance.get<ApiResponse<CourseCard[]>>(
      `/courses/${courseId}/related`,
      { params: { limit } }
    );
    return response.data.data;
  },

  /**
   * 강의 찜하기
   * @param courseId 강의 ID
   */
  addToWishlist: async (courseId: number): Promise<void> => {
    await axiosInstance.post(`/courses/${courseId}/wishlist`);
  },

  /**
   * 강의 찜하기 해제
   * @param courseId 강의 ID
   */
  removeFromWishlist: async (courseId: number): Promise<void> => {
    await axiosInstance.delete(`/courses/${courseId}/wishlist`);
  },

  /**
   * 장바구니에 강의 추가
   * @param courseId 강의 ID
   */
  addToCart: async (courseId: number): Promise<void> => {
    await axiosInstance.post('/cart/items', { courseId });
  },
};

export default courseDetailService;
