/**
 * 코스(차수) 커뮤니티 관련 타입 정의
 * 기존 community.types.ts를 기반으로 courseTimeId가 추가된 타입
 */

import type {
  PostType,
  CommunityFilter,
  Comment,
  CommentListResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from './community.types';

// 기존 타입 re-export
export type {
  PostType,
  Comment,
  CommentListResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
};
export { POST_TYPE_LABELS, COMMUNITY_SORT_OPTIONS } from './community.types';

// 코스 커뮤니티 게시글
export interface CourseCommunityPost {
  id: number;
  courseTimeId: number;
  type: PostType;
  title: string;
  content: string;
  excerpt?: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  category: string;
  tags?: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isPinned?: boolean;
  isSolved?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// 코스 커뮤니티 게시글 목록 응답
export interface CourseCommunityPostListResponse {
  posts: CourseCommunityPost[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 코스 커뮤니티 게시글 상세 (댓글 포함)
export interface CourseCommunityPostDetail extends CourseCommunityPost {
  comments?: Comment[];
}

// 코스 커뮤니티 필터
export interface CourseCommunityFilter extends Omit<CommunityFilter, 'category'> {
  search?: string;
  type?: PostType | 'all';
  sortBy?: 'latest' | 'popular' | 'most_commented' | 'most_liked';
  page?: number;
  pageSize?: number;
}

// 코스 커뮤니티 게시글 작성 요청
export interface CreateCourseCommunityPostRequest {
  type: PostType;
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

// 코스 커뮤니티 게시글 수정 요청
export interface UpdateCourseCommunityPostRequest {
  title?: string;
  content?: string;
  tags?: string[];
}

// 코스 커뮤니티 댓글 작성 요청
export interface CreateCourseCommunityCommentRequest {
  content: string;
  parentId?: number;
}
