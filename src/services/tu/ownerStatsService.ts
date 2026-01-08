/**
 * 강사(Owner) 통계 API 서비스 (TU)
 * GET /api/owners/me/stats
 */
import { axiosInstance } from '../common/api';
import { API_ENDPOINTS } from '../common/api/endpoints';
import type { OwnerStatsResponse } from '@/types/tu';

/** 백엔드 API 응답 타입 */
interface OwnerStatsApiResponse {
  overview: {
    totalPrograms: number;
    totalCourseTimes: number;
    totalStudents: number;
  };
  enrollmentStats: {
    totalEnrollments: number;
    byStatus: {
      enrolled: number;
      completed: number;
      dropped: number;
      failed: number;
    };
    completionRate: number;
  };
  programStats: Array<{
    programId: number;
    title: string;
    courseTimeCount: number;
    totalStudents: number;
    completionRate: number;
  }>;
}

export const ownerStatsService = {
  /**
   * 내 강사 통계 조회
   * @returns 강사 통계 (overview, enrollmentStats, programStats)
   */
  getMyOwnerStats: async (): Promise<OwnerStatsResponse> => {
    const response = await axiosInstance.get<OwnerStatsApiResponse>(API_ENDPOINTS.OWNERS.ME_STATS);
    const data = response.data;

    // 백엔드 응답 구조를 프론트엔드 타입에 맞게 변환
    return {
      overview: data.overview,
      enrollmentStats: {
        totalEnrollments: data.enrollmentStats.totalEnrollments,
        completed: data.enrollmentStats.byStatus.completed,
        inProgress: data.enrollmentStats.byStatus.enrolled,
        dropped: data.enrollmentStats.byStatus.dropped,
        failed: data.enrollmentStats.byStatus.failed,
        averageCompletionRate: data.enrollmentStats.completionRate,
      },
      programStats: data.programStats.map((p) => ({
        programId: p.programId,
        programName: p.title,
        courseTimeCount: p.courseTimeCount,
        totalStudents: p.totalStudents,
        completionRate: p.completionRate,
      })),
    };
  },
};
