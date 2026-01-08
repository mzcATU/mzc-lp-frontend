/**
 * 코스(차수) 커뮤니티 React Query 훅
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseTimeCommunityService } from '@/services/tu/courseTimeCommunityService';
import type {
  CourseCommunityFilter,
  CreateCourseCommunityPostRequest,
  UpdateCourseCommunityPostRequest,
  CreateCourseCommunityCommentRequest,
  UpdateCommentRequest,
} from '@/types/tu/courseCommunity.types';

// Query Keys
export const courseCommunityKeys = {
  all: ['courseCommunity'] as const,
  posts: (timeId: number, filter?: CourseCommunityFilter) =>
    [...courseCommunityKeys.all, 'posts', timeId, filter] as const,
  post: (timeId: number, postId: number) =>
    [...courseCommunityKeys.all, 'post', timeId, postId] as const,
  comments: (timeId: number, postId: number) =>
    [...courseCommunityKeys.all, 'comments', timeId, postId] as const,
};

// ========== 게시글 관련 훅 ==========

/**
 * 코스 커뮤니티 게시글 목록 조회 훅
 */
export function useCourseCommunityPosts(
  timeId: number,
  filter?: CourseCommunityFilter,
  enabled = true
) {
  return useQuery({
    queryKey: courseCommunityKeys.posts(timeId, filter),
    queryFn: () => courseTimeCommunityService.getPosts(timeId, filter),
    enabled: enabled && !!timeId,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 코스 커뮤니티 게시글 상세 조회 훅
 */
export function useCourseCommunityPost(
  timeId: number,
  postId: number,
  enabled = true
) {
  return useQuery({
    queryKey: courseCommunityKeys.post(timeId, postId),
    queryFn: () => courseTimeCommunityService.getPost(timeId, postId),
    enabled: enabled && !!timeId && !!postId,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 코스 커뮤니티 게시글 작성 훅
 */
export function useCreateCourseCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      data,
    }: {
      timeId: number;
      data: CreateCourseCommunityPostRequest;
    }) => courseTimeCommunityService.createPost(timeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...courseCommunityKeys.all, 'posts', variables.timeId],
      });
    },
  });
}

/**
 * 코스 커뮤니티 게시글 수정 훅
 */
export function useUpdateCourseCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      postId,
      data,
    }: {
      timeId: number;
      postId: number;
      data: UpdateCourseCommunityPostRequest;
    }) => courseTimeCommunityService.updatePost(timeId, postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseCommunityKeys.post(variables.timeId, variables.postId),
      });
      queryClient.invalidateQueries({
        queryKey: [...courseCommunityKeys.all, 'posts', variables.timeId],
      });
    },
  });
}

/**
 * 코스 커뮤니티 게시글 삭제 훅
 */
export function useDeleteCourseCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ timeId, postId }: { timeId: number; postId: number }) =>
      courseTimeCommunityService.deletePost(timeId, postId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...courseCommunityKeys.all, 'posts', variables.timeId],
      });
    },
  });
}

/**
 * 코스 커뮤니티 게시글 좋아요 훅
 */
export function useLikeCourseCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ timeId, postId }: { timeId: number; postId: number }) =>
      courseTimeCommunityService.likePost(timeId, postId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseCommunityKeys.post(variables.timeId, variables.postId),
      });
      queryClient.invalidateQueries({
        queryKey: [...courseCommunityKeys.all, 'posts', variables.timeId],
      });
    },
  });
}

/**
 * 코스 커뮤니티 게시글 좋아요 취소 훅
 */
export function useUnlikeCourseCommunityPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ timeId, postId }: { timeId: number; postId: number }) =>
      courseTimeCommunityService.unlikePost(timeId, postId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseCommunityKeys.post(variables.timeId, variables.postId),
      });
      queryClient.invalidateQueries({
        queryKey: [...courseCommunityKeys.all, 'posts', variables.timeId],
      });
    },
  });
}

// ========== 댓글 관련 훅 ==========

/**
 * 코스 커뮤니티 댓글 목록 조회 훅
 */
export function useCourseCommunityComments(
  timeId: number,
  postId: number,
  page = 0,
  pageSize = 20,
  enabled = true
) {
  return useQuery({
    queryKey: courseCommunityKeys.comments(timeId, postId),
    queryFn: () =>
      courseTimeCommunityService.getComments(timeId, postId, page, pageSize),
    enabled: enabled && !!timeId && !!postId,
    staleTime: 1000 * 60, // 1분
  });
}

/**
 * 코스 커뮤니티 댓글 작성 훅
 */
export function useCreateCourseCommunityComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      postId,
      data,
    }: {
      timeId: number;
      postId: number;
      data: CreateCourseCommunityCommentRequest;
    }) => courseTimeCommunityService.createComment(timeId, postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseCommunityKeys.comments(variables.timeId, variables.postId),
      });
      queryClient.invalidateQueries({
        queryKey: courseCommunityKeys.post(variables.timeId, variables.postId),
      });
    },
  });
}

/**
 * 코스 커뮤니티 댓글 수정 훅
 */
export function useUpdateCourseCommunityComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      postId,
      commentId,
      data,
    }: {
      timeId: number;
      postId: number;
      commentId: number;
      data: UpdateCommentRequest;
    }) =>
      courseTimeCommunityService.updateComment(timeId, postId, commentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseCommunityKeys.comments(variables.timeId, variables.postId),
      });
    },
  });
}

/**
 * 코스 커뮤니티 댓글 삭제 훅
 */
export function useDeleteCourseCommunityComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      postId,
      commentId,
    }: {
      timeId: number;
      postId: number;
      commentId: number;
    }) => courseTimeCommunityService.deleteComment(timeId, postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseCommunityKeys.comments(variables.timeId, variables.postId),
      });
      queryClient.invalidateQueries({
        queryKey: courseCommunityKeys.post(variables.timeId, variables.postId),
      });
    },
  });
}

/**
 * 코스 커뮤니티 댓글 좋아요 훅
 */
export function useLikeCourseCommunityComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      postId,
      commentId,
    }: {
      timeId: number;
      postId: number;
      commentId: number;
    }) => courseTimeCommunityService.likeComment(timeId, postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseCommunityKeys.comments(variables.timeId, variables.postId),
      });
    },
  });
}

/**
 * 코스 커뮤니티 댓글 좋아요 취소 훅
 */
export function useUnlikeCourseCommunityComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeId,
      postId,
      commentId,
    }: {
      timeId: number;
      postId: number;
      commentId: number;
    }) => courseTimeCommunityService.unlikeComment(timeId, postId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseCommunityKeys.comments(variables.timeId, variables.postId),
      });
    },
  });
}
