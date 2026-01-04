/**
 * 강사(Owner) 통계 API 서비스 (TU)
 * GET /api/owners/me/stats
 */
import { axiosInstance } from '../common/api';
import { API_ENDPOINTS } from '../common/api/endpoints';
import type { OwnerStatsResponse } from '@/types/tu';

export const ownerStatsService = {
  /**
   * 내 강사 통계 조회
   * @returns 강사 통계 (overview, enrollmentStats, programStats)
   */
  getMyOwnerStats: async (): Promise<OwnerStatsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.OWNERS.ME_STATS);
    return response.data.data;
  },
};
