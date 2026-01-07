/**
 * 코스(차수) 커뮤니티 API 서비스
 * /api/times/{timeId}/community/* 엔드포인트 사용
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  CourseCommunityPostListResponse,
  CourseCommunityPost,
  CourseCommunityPostDetail,
  CourseCommunityFilter,
  CreateCourseCommunityPostRequest,
  UpdateCourseCommunityPostRequest,
  CommentListResponse,
  Comment,
  CreateCourseCommunityCommentRequest,
  UpdateCommentRequest,
} from '@/types/tu/courseCommunity.types';

const getBaseUrl = (timeId: number) => `/times/${timeId}/community`;

export const courseTimeCommunityService = {
  // ========== 게시글 관련 API ==========

  /**
   * 게시글 목록 조회
   */
  getPosts: async (
    timeId: number,
    filter?: CourseCommunityFilter
  ): Promise<CourseCommunityPostListResponse> => {
    const params = new URLSearchParams();

    if (filter?.search) {
      params.append('search', filter.search);
    }
    if (filter?.type && filter.type !== 'all') {
      params.append('type', filter.type);
    }
    if (filter?.sortBy) {
      params.append('sortBy', filter.sortBy);
    }
    if (filter?.page !== undefined) {
      params.append('page', String(filter.page));
    }
    if (filter?.pageSize) {
      params.append('pageSize', String(filter.pageSize));
    }

    const query = params.toString();
    const url = query
      ? `${getBaseUrl(timeId)}/posts?${query}`
      : `${getBaseUrl(timeId)}/posts`;
    const response = await axiosInstance.get<CourseCommunityPostListResponse>(url);
    return response.data;
  },

  /**
   * 게시글 상세 조회
   */
  getPost: async (timeId: number, postId: number): Promise<CourseCommunityPostDetail> => {
    const response = await axiosInstance.get<CourseCommunityPostDetail>(
      `${getBaseUrl(timeId)}/posts/${postId}`
    );
    return response.data;
  },

  /**
   * 게시글 작성
   */
  createPost: async (
    timeId: number,
    data: CreateCourseCommunityPostRequest
  ): Promise<CourseCommunityPost> => {
    const response = await axiosInstance.post<CourseCommunityPost>(
      `${getBaseUrl(timeId)}/posts`,
      data
    );
    return response.data;
  },

  /**
   * 게시글 수정
   */
  updatePost: async (
    timeId: number,
    postId: number,
    data: UpdateCourseCommunityPostRequest
  ): Promise<CourseCommunityPost> => {
    const response = await axiosInstance.patch<CourseCommunityPost>(
      `${getBaseUrl(timeId)}/posts/${postId}`,
      data
    );
    return response.data;
  },

  /**
   * 게시글 삭제
   */
  deletePost: async (timeId: number, postId: number): Promise<void> => {
    await axiosInstance.delete(`${getBaseUrl(timeId)}/posts/${postId}`);
  },

  /**
   * 게시글 좋아요
   */
  likePost: async (timeId: number, postId: number): Promise<void> => {
    await axiosInstance.post(`${getBaseUrl(timeId)}/posts/${postId}/like`);
  },

  /**
   * 게시글 좋아요 취소
   */
  unlikePost: async (timeId: number, postId: number): Promise<void> => {
    await axiosInstance.delete(`${getBaseUrl(timeId)}/posts/${postId}/like`);
  },

  // ========== 댓글 관련 API ==========

  /**
   * 댓글 목록 조회
   */
  getComments: async (
    timeId: number,
    postId: number,
    page = 0,
    pageSize = 20
  ): Promise<CommentListResponse> => {
    const response = await axiosInstance.get<CommentListResponse>(
      `${getBaseUrl(timeId)}/posts/${postId}/comments?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  /**
   * 댓글 작성
   */
  createComment: async (
    timeId: number,
    postId: number,
    data: CreateCourseCommunityCommentRequest
  ): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>(
      `${getBaseUrl(timeId)}/posts/${postId}/comments`,
      data
    );
    return response.data;
  },

  /**
   * 댓글 수정
   */
  updateComment: async (
    timeId: number,
    postId: number,
    commentId: number,
    data: UpdateCommentRequest
  ): Promise<Comment> => {
    const response = await axiosInstance.patch<Comment>(
      `${getBaseUrl(timeId)}/posts/${postId}/comments/${commentId}`,
      data
    );
    return response.data;
  },

  /**
   * 댓글 삭제
   */
  deleteComment: async (
    timeId: number,
    postId: number,
    commentId: number
  ): Promise<void> => {
    await axiosInstance.delete(
      `${getBaseUrl(timeId)}/posts/${postId}/comments/${commentId}`
    );
  },

  /**
   * 댓글 좋아요
   */
  likeComment: async (
    timeId: number,
    postId: number,
    commentId: number
  ): Promise<void> => {
    await axiosInstance.post(
      `${getBaseUrl(timeId)}/posts/${postId}/comments/${commentId}/like`
    );
  },

  /**
   * 댓글 좋아요 취소
   */
  unlikeComment: async (
    timeId: number,
    postId: number,
    commentId: number
  ): Promise<void> => {
    await axiosInstance.delete(
      `${getBaseUrl(timeId)}/posts/${postId}/comments/${commentId}/like`
    );
  },
};
