/**
 * 커뮤니티(Community) API 서비스
 */

import axiosInstance from '@/services/common/api/axiosInstance';
import type {
  CommunityPostListResponse,
  CommunityCategoryResponse,
  CommunityFilter,
  CommunityPost,
  CommunityPostDetail,
  CreatePostRequest,
  UpdatePostRequest,
  CommentListResponse,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/types/tu/community.types';

const BASE_URL = '/community';

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
    if (filter?.page !== undefined) {
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
  getPost: async (postId: number): Promise<CommunityPostDetail> => {
    const response = await axiosInstance.get<CommunityPostDetail>(`${BASE_URL}/posts/${postId}`);
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

  /**
   * 내 게시글 목록 조회
   */
  getMyPosts: async (page = 0, pageSize = 20): Promise<CommunityPostListResponse> => {
    const response = await axiosInstance.get<CommunityPostListResponse>(
      `${BASE_URL}/posts/my?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  /**
   * 내가 댓글 단 게시글 목록 조회
   */
  getCommentedPosts: async (page = 0, pageSize = 20): Promise<CommunityPostListResponse> => {
    const response = await axiosInstance.get<CommunityPostListResponse>(
      `${BASE_URL}/posts/commented?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // ========== 댓글 관련 API ==========

  /**
   * 댓글 목록 조회
   */
  getComments: async (postId: number, page = 0, pageSize = 20): Promise<CommentListResponse> => {
    const response = await axiosInstance.get<CommentListResponse>(
      `${BASE_URL}/posts/${postId}/comments?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  /**
   * 댓글 작성
   */
  createComment: async (data: CreateCommentRequest): Promise<Comment> => {
    const response = await axiosInstance.post<Comment>(
      `${BASE_URL}/posts/${data.postId}/comments`,
      { content: data.content, parentId: data.parentId }
    );
    return response.data;
  },

  /**
   * 댓글 수정
   */
  updateComment: async (postId: number, commentId: number, data: UpdateCommentRequest): Promise<Comment> => {
    const response = await axiosInstance.patch<Comment>(
      `${BASE_URL}/posts/${postId}/comments/${commentId}`,
      data
    );
    return response.data;
  },

  /**
   * 댓글 삭제
   */
  deleteComment: async (postId: number, commentId: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/posts/${postId}/comments/${commentId}`);
  },

  /**
   * 댓글 좋아요
   */
  likeComment: async (postId: number, commentId: number): Promise<void> => {
    await axiosInstance.post(`${BASE_URL}/posts/${postId}/comments/${commentId}/like`);
  },

  /**
   * 댓글 좋아요 취소
   */
  unlikeComment: async (postId: number, commentId: number): Promise<void> => {
    await axiosInstance.delete(`${BASE_URL}/posts/${postId}/comments/${commentId}/like`);
  },

  // ========== 이미지 업로드 API ==========

  /**
   * 이미지 업로드 (단일)
   */
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<{ url: string }>(
      `${BASE_URL}/images/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.url;
  },

  /**
   * 이미지 업로드 (다중)
   */
  uploadMultipleImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await axiosInstance.post<{ urls: string[] }>(
      `${BASE_URL}/images/upload/multiple`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.urls;
  },
};
