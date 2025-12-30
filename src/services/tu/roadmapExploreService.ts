/**
 * 로드맵 탐색(Roadmap Explore) API 서비스
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  RoadmapExploreResponse,
  RoadmapCategoryResponse,
  RoadmapExploreFilter,
} from '@/types/tu/roadmapExplore.types';

const BASE_URL = '/tu/roadmaps';

export const roadmapExploreService = {
  /**
   * 로드맵 목록 조회 (탐색용)
   */
  getRoadmaps: async (filter?: RoadmapExploreFilter): Promise<RoadmapExploreResponse> => {
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
    const response = await axiosInstance.get<RoadmapExploreResponse>(url);
    return response.data;
  },

  /**
   * 카테고리 목록 조회
   */
  getCategories: async (): Promise<RoadmapCategoryResponse> => {
    const response = await axiosInstance.get<RoadmapCategoryResponse>(`${BASE_URL}/categories`);
    return response.data;
  },

  /**
   * 인기 로드맵 조회
   */
  getPopularRoadmaps: async (limit?: number): Promise<RoadmapExploreResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await axiosInstance.get<RoadmapExploreResponse>(`${BASE_URL}/popular${params}`);
    return response.data;
  },

  /**
   * 신규 로드맵 조회
   */
  getNewRoadmaps: async (limit?: number): Promise<RoadmapExploreResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await axiosInstance.get<RoadmapExploreResponse>(`${BASE_URL}/new${params}`);
    return response.data;
  },

  /**
   * 추천 로드맵 조회
   */
  getRecommendedRoadmaps: async (limit?: number): Promise<RoadmapExploreResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await axiosInstance.get<RoadmapExploreResponse>(`${BASE_URL}/recommended${params}`);
    return response.data;
  },
};
