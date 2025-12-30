/**
 * 강의 탐색(Course Explore) API 서비스
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  CourseExploreResponse,
  CourseCategoryResponse,
  CourseExploreFilter,
} from '@/types/tu/courseExplore.types';

const BASE_URL = '/tu/courses';

export const courseExploreService = {
  /**
   * 강의 목록 조회 (탐색용)
   */
  getCourses: async (filter?: CourseExploreFilter): Promise<CourseExploreResponse> => {
    const params = new URLSearchParams();

    if (filter?.search) {
      params.append('search', filter.search);
    }
    if (filter?.category && filter.category !== 'all') {
      params.append('category', filter.category);
    }
    if (filter?.level && filter.level !== 'all') {
      params.append('level', filter.level);
    }
    if (filter?.rating) {
      params.append('rating', String(filter.rating));
    }
    if (filter?.priceRange?.min !== undefined) {
      params.append('minPrice', String(filter.priceRange.min));
    }
    if (filter?.priceRange?.max !== undefined) {
      params.append('maxPrice', String(filter.priceRange.max));
    }
    if (filter?.sortBy) {
      params.append('sortBy', filter.sortBy);
    }
    if (filter?.page) {
      params.append('page', String(filter.page));
    }
    if (filter?.pageSize) {
      params.append('pageSize', String(filter.pageSize));
    }

    const query = params.toString();
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;
    const response = await axiosInstance.get<CourseExploreResponse>(url);
    return response.data;
  },

  /**
   * 카테고리 목록 조회
   */
  getCategories: async (): Promise<CourseCategoryResponse> => {
    const response = await axiosInstance.get<CourseCategoryResponse>(`${BASE_URL}/categories`);
    return response.data;
  },

  /**
   * 인기 강의 조회
   */
  getPopularCourses: async (limit?: number): Promise<CourseExploreResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await axiosInstance.get<CourseExploreResponse>(`${BASE_URL}/popular${params}`);
    return response.data;
  },

  /**
   * 신규 강의 조회
   */
  getNewCourses: async (limit?: number): Promise<CourseExploreResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await axiosInstance.get<CourseExploreResponse>(`${BASE_URL}/new${params}`);
    return response.data;
  },

  /**
   * 추천 강의 조회
   */
  getRecommendedCourses: async (limit?: number): Promise<CourseExploreResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await axiosInstance.get<CourseExploreResponse>(`${BASE_URL}/recommended${params}`);
    return response.data;
  },
};
