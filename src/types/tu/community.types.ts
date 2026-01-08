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
  icon?: string; // 서버에서 오는 아이콘 이름 (문자열)
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

// 댓글 타입
export interface Comment {
  id: number;
  postId: number;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  likeCount: number;
  isLiked?: boolean;
  parentId?: number; // 대댓글인 경우 부모 댓글 ID
  replies?: Comment[];
  createdAt: string;
  updatedAt?: string;
}

// 댓글 목록 응답
export interface CommentListResponse {
  comments: Comment[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 댓글 작성 요청
export interface CreateCommentRequest {
  postId: number;
  content: string;
  parentId?: number; // 대댓글인 경우
}

// 댓글 수정 요청
export interface UpdateCommentRequest {
  content: string;
}

// 게시글 상세 (댓글 포함)
export interface CommunityPostDetail extends CommunityPost {
  comments?: Comment[];
  relatedCourse?: {
    id: number;
    title: string;
    thumbnailUrl?: string;
    instructor: {
      id: number;
      name: string;
      profileImage?: string;
    };
    rating: number;
    studentCount: number;
  };
}
