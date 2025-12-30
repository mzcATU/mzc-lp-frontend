/**
 * 커뮤니티(Community) 관련 타입 정의
 */

// 게시글 타입
export type PostType = 'question' | 'discussion' | 'tip' | 'review' | 'announcement';

// 게시글 아이템
export interface CommunityPost {
  id: number;
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
  isSolved?: boolean; // 질문 게시글의 경우
  createdAt: string;
  updatedAt?: string;
}

// 게시글 목록 응답
export interface CommunityPostListResponse {
  posts: CommunityPost[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 커뮤니티 카테고리
export interface CommunityCategory {
  id: string;
  name: string;
  description?: string;
  count: number;
  icon?: string;
}

// 카테고리 목록 응답
export interface CommunityCategoryResponse {
  categories: CommunityCategory[];
}

// 커뮤니티 필터
export interface CommunityFilter {
  search?: string;
  category?: string;
  type?: PostType | 'all';
  sortBy?: 'latest' | 'popular' | 'most_commented' | 'most_liked';
  page?: number;
  pageSize?: number;
}

// 게시글 작성 요청
export interface CreatePostRequest {
  type: PostType;
  title: string;
  content: string;
  category: string;
  tags?: string[];
}

// 게시글 수정 요청
export interface UpdatePostRequest {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

// 게시글 타입 레이블
export const POST_TYPE_LABELS: Record<PostType, string> = {
  question: '질문',
  discussion: '토론',
  tip: '팁',
  review: '후기',
  announcement: '공지',
};

// 정렬 옵션
export const COMMUNITY_SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'most_commented', label: '댓글순' },
  { value: 'most_liked', label: '좋아요순' },
] as const;
