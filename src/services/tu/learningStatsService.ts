/**
 * 내 학습 통계 API 서비스 (TU)
 * GET /api/users/me/learning-stats
 */
import { axiosInstance } from '../common/api';
import { API_ENDPOINTS } from '../common/api/endpoints';
import type { LearningStatsResponse } from '@/types/tu';

export const learningStatsService = {
  /**
   * 내 학습 통계 조회
   * @returns 학습 통계 (overview, progress)
   */
  getMyLearningStats: async (): Promise<LearningStatsResponse> => {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS.ME_LEARNING_STATS);
    return response.data;
  },
};
