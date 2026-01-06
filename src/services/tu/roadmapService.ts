/**
 * TU 로드맵 관리 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  RoadmapResponse,
  RoadmapDetailResponse,
  RoadmapStatisticsResponse,
  RoadmapPageResponse,
  CreateRoadmapRequest,
  UpdateRoadmapRequest,
  SaveDraftRequest,
  RoadmapQueryParams,
} from '@/types/tu/roadmap.types';
import type { ApiResponse } from '@/types/common';

export const roadmapService = {
  /**
   * 내 로드맵 목록 조회
   * GET /api/roadmaps
   */
  async getMyRoadmaps(params?: RoadmapQueryParams): Promise<RoadmapPageResponse> {
    const { data } = await axiosInstance.get<ApiResponse<RoadmapPageResponse>>(
      API_ENDPOINTS.ROADMAPS.BASE,
      { params }
    );
    return data.data;
  },

  /**
   * 로드맵 통계 조회
   * GET /api/roadmaps/statistics
   */
  async getStatistics(): Promise<RoadmapStatisticsResponse> {
    const { data } = await axiosInstance.get<ApiResponse<RoadmapStatisticsResponse>>(
      API_ENDPOINTS.ROADMAPS.STATISTICS
    );
    return data.data;
  },

  /**
   * 로드맵 생성
   * POST /api/roadmaps
   */
  async createRoadmap(request: CreateRoadmapRequest): Promise<RoadmapResponse> {
    const { data } = await axiosInstance.post<ApiResponse<RoadmapResponse>>(
      API_ENDPOINTS.ROADMAPS.BASE,
      request
    );
    return data.data;
  },

  /**
   * 로드맵 상세 조회
   * GET /api/roadmaps/{id}
   */
  async getRoadmap(id: number): Promise<RoadmapDetailResponse> {
    const { data } = await axiosInstance.get<ApiResponse<RoadmapDetailResponse>>(
      API_ENDPOINTS.ROADMAPS.BY_ID(id)
    );
    return data.data;
  },

  /**
   * 로드맵 수정
   * PATCH /api/roadmaps/{id}
   */
  async updateRoadmap(id: number, request: UpdateRoadmapRequest): Promise<RoadmapResponse> {
    const { data } = await axiosInstance.patch<ApiResponse<RoadmapResponse>>(
      API_ENDPOINTS.ROADMAPS.BY_ID(id),
      request
    );
    return data.data;
  },

  /**
   * 로드맵 임시 저장
   * PATCH /api/roadmaps/{id}/draft
   */
  async saveDraft(id: number, request: SaveDraftRequest): Promise<RoadmapResponse> {
    const { data } = await axiosInstance.patch<ApiResponse<RoadmapResponse>>(
      API_ENDPOINTS.ROADMAPS.DRAFT(id),
      request
    );
    return data.data;
  },

  /**
   * 로드맵 삭제
   * DELETE /api/roadmaps/{id}
   */
  async deleteRoadmap(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.ROADMAPS.BY_ID(id));
  },

  /**
   * 로드맵 복제
   * POST /api/roadmaps/{id}/duplicate
   */
  async duplicateRoadmap(id: number): Promise<RoadmapResponse> {
    const { data } = await axiosInstance.post<ApiResponse<RoadmapResponse>>(
      API_ENDPOINTS.ROADMAPS.DUPLICATE(id)
    );
    return data.data;
  },
};
