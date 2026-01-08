/**
 * 커뮤니티(Community) React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityService } from '@/services/tu/communityService';
import type {
  CommunityFilter,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/types/tu/community.types';

// Query Keys
export const communityKeys = {
  all: ['community'] as const,
  posts: (filter?: CommunityFilter) => [...communityKeys.all, 'posts', filter] as const,
  post: (postId: number) => [...communityKeys.all, 'post', postId] as const,
  categories: () => [...communityKeys.all, 'categories'] as const,
  popular: (limit?: number) => [...communityKeys.all, 'popular', limit] as const,
  comments: (postId: number) => [...communityKeys.all, 'comments', postId] as const,
  myPosts: (page: number, pageSize: number) => [...communityKeys.all, 'myPosts', page, pageSize] as const,
  commentedPosts: (page: number, pageSize: number) => [...communityKeys.all, 'commentedPosts', page, pageSize] as const,
};

/**
 * 게시글 목록 조회 훅
 */
export function useCommunityPosts(filter?: CommunityFilter, enabled = true) {
  return useQuery({
    queryKey: communityKeys.posts(filter),
    queryFn: () => communityService.getPosts(filter),
    enabled,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 게시글 상세 조회 훅
 */
export function useCommunityPost(postId: number, enabled = true) {
  return useQuery({
    queryKey: communityKeys.post(postId),
    queryFn: () => communityService.getPost(postId),
    enabled: enabled && !!postId,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 카테고리 목록 조회 훅
 */
export function useCommunityCategories(enabled = true) {
  return useQuery({
    queryKey: communityKeys.categories(),
    queryFn: communityService.getCategories,
    enabled,
    staleTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 인기 게시글 조회 훅
 */
export function usePopularPosts(limit?: number, enabled = true) {
  return useQuery({
    queryKey: communityKeys.popular(limit),
    queryFn: () => communityService.getPopularPosts(limit),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 내 게시글 목록 조회 훅
 */
export function useMyPosts(page = 0, pageSize = 20, enabled = true) {
  return useQuery({
    queryKey: communityKeys.myPosts(page, pageSize),
    queryFn: () => communityService.getMyPosts(page, pageSize),
    enabled,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 내가 댓글 단 게시글 목록 조회 훅
 */
export function useCommentedPosts(page = 0, pageSize = 20, enabled = true) {
  return useQuery({
    queryKey: communityKeys.commentedPosts(page, pageSize),
    queryFn: () => communityService.getCommentedPosts(page, pageSize),
    enabled,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 게시글 작성 훅
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => communityService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

/**
 * 게시글 수정 훅
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: number; data: UpdatePostRequest }) =>
      communityService.updatePost(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

/**
 * 게시글 삭제 훅
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => communityService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

/**
 * 게시글 좋아요 훅
 */
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => communityService.likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

/**
 * 게시글 좋아요 취소 훅
 */
export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => communityService.unlikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

// ========== 댓글 관련 훅 ==========

/**
 * 댓글 목록 조회 훅
 */
export function useComments(postId: number, page = 1, pageSize = 20, enabled = true) {
  return useQuery({
    queryKey: communityKeys.comments(postId),
    queryFn: () => communityService.getComments(postId, page, pageSize),
    enabled: enabled && !!postId,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 댓글 작성 훅
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => communityService.createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(variables.postId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.post(variables.postId) });
    },
  });
}

/**
 * 댓글 수정 훅
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId, data }: { postId: number; commentId: number; data: UpdateCommentRequest }) =>
      communityService.updateComment(postId, commentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(variables.postId) });
    },
  });
}

/**
 * 댓글 삭제 훅
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      communityService.deleteComment(postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(variables.postId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.post(variables.postId) });
    },
  });
}

/**
 * 댓글 좋아요 훅
 */
export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      communityService.likeComment(postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(variables.postId) });
    },
  });
}

/**
 * 댓글 좋아요 취소 훅
 */
export function useUnlikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, commentId }: { postId: number; commentId: number }) =>
      communityService.unlikeComment(postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(variables.postId) });
    },
  });
}
