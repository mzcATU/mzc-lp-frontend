/**
 * 강사(Instructor) API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  PopularInstructorsResponse,
  InstructorProfileResponse,
  InstructorCoursesResponse,
  InstructorRoadmapsResponse,
  InstructorPostsResponse,
  InstructorReviewsResponse,
  FollowStatusResponse,
} from '@/types/tu/instructor.types';

const BASE_URL = '/api/v1/instructors';

export const instructorService = {
  /**
   * 인기 강사 목록 조회
   */
  getPopularInstructors: async (limit: number = 4): Promise<PopularInstructorsResponse> => {
    const response = await axiosInstance.get<PopularInstructorsResponse>(
      `${BASE_URL}/popular`,
      { params: { limit } }
    );
    return response.data;
  },

  /**
   * 강사 프로필 조회
   */
  getInstructorProfile: async (instructorId: number): Promise<InstructorProfileResponse> => {
    const response = await axiosInstance.get<InstructorProfileResponse>(
      `${BASE_URL}/${instructorId}`
    );
    return response.data;
  },

  /**
   * 강사 강의 목록 조회
   */
  getInstructorCourses: async (
    instructorId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<InstructorCoursesResponse> => {
    const response = await axiosInstance.get<InstructorCoursesResponse>(
      `${BASE_URL}/${instructorId}/courses`,
      { params: { page, pageSize } }
    );
    return response.data;
  },

  /**
   * 강사 로드맵 목록 조회
   */
  getInstructorRoadmaps: async (instructorId: number): Promise<InstructorRoadmapsResponse> => {
    const response = await axiosInstance.get<InstructorRoadmapsResponse>(
      `${BASE_URL}/${instructorId}/roadmaps`
    );
    return response.data;
  },

  /**
   * 강사 게시글 목록 조회
   */
  getInstructorPosts: async (
    instructorId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<InstructorPostsResponse> => {
    const response = await axiosInstance.get<InstructorPostsResponse>(
      `${BASE_URL}/${instructorId}/posts`,
      { params: { page, pageSize } }
    );
    return response.data;
  },

  /**
   * 강사 리뷰 목록 조회
   */
  getInstructorReviews: async (
    instructorId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<InstructorReviewsResponse> => {
    const response = await axiosInstance.get<InstructorReviewsResponse>(
      `${BASE_URL}/${instructorId}/reviews`,
      { params: { page, pageSize } }
    );
    return response.data;
  },

  /**
   * 팔로우 상태 조회
   */
  getFollowStatus: async (instructorId: number): Promise<FollowStatusResponse> => {
    const response = await axiosInstance.get<FollowStatusResponse>(
      `${BASE_URL}/${instructorId}/follow-status`
    );
    return response.data;
  },

  /**
   * 강사 팔로우
   */
  followInstructor: async (instructorId: number): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/${instructorId}/follow`);
  },

  /**
   * 강사 언팔로우
   */
  unfollowInstructor: async (instructorId: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/${instructorId}/follow`);
  },
};
