/**
 * 커뮤니티(Community) API 서비스
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  CommunityPostListResponse,
  CommunityCategoryResponse,
  CommunityFilter,
  CommunityPost,
  CreatePostRequest,
  UpdatePostRequest,
} from '@/types/tu/community.types';

const BASE_URL = '/tu/community';

export const communityService = {
  /**
   * 게시글 목록 조회
   */
  getPosts: async (filter?: CommunityFilter): Promise<CommunityPostListResponse> => {
    const params = new URLSearchParams();

    if (filter?.search) {
      params.append('search', filter.search);
    }
    if (filter?.category && filter.category !== 'all') {
      params.append('category', filter.category);
    }
    if (filter?.type && filter.type !== 'all') {
      params.append('type', filter.type);
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
    const url = query ? `${BASE_URL}/posts?${query}` : `${BASE_URL}/posts`;
    const response = await axiosInstance.get<CommunityPostListResponse>(url);
    return response.data;
  },

  /**
   * 게시글 상세 조회
   */
  getPost: async (postId: number): Promise<CommunityPost> => {
    const response = await axiosInstance.get<CommunityPost>(`${BASE_URL}/posts/${postId}`);
    return response.data;
  },

  /**
   * 게시글 작성
   */
  createPost: async (data: CreatePostRequest): Promise<CommunityPost> => {
    const response = await axiosInstance.post<CommunityPost>(`${BASE_URL}/posts`, data);
    return response.data;
  },

  /**
   * 게시글 수정
   */
  updatePost: async (postId: number, data: UpdatePostRequest): Promise<CommunityPost> => {
    const response = await axiosInstance.patch<CommunityPost>(`${BASE_URL}/posts/${postId}`, data);
    return response.data;
  },

  /**
   * 게시글 삭제
   */
  deletePost: async (postId: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/posts/${postId}`);
  },

  /**
   * 게시글 좋아요
   */
  likePost: async (postId: number): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/posts/${postId}/like`);
  },

  /**
   * 게시글 좋아요 취소
   */
  unlikePost: async (postId: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/posts/${postId}/like`);
  },

  /**
   * 카테고리 목록 조회
   */
  getCategories: async (): Promise<CommunityCategoryResponse> => {
    const response = await axiosInstance.get<CommunityCategoryResponse>(`${BASE_URL}/categories`);
    return response.data;
  },

  /**
   * 인기 게시글 조회
   */
  getPopularPosts: async (limit?: number): Promise<CommunityPostListResponse> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await axiosInstance.get<CommunityPostListResponse>(`${BASE_URL}/posts/popular${params}`);
    return response.data;
  },
};
