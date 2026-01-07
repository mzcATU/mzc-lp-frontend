/**
 * 코스 리뷰 관련 타입 정의
 */

// ============================================
// Response Types
// ============================================

/** 리뷰 작성자 정보 */
export interface ReviewAuthor {
  id: number;
  name: string;
  profileImageUrl: string | null;
}

/** 코스 리뷰 응답 (프론트엔드용) */
export interface CourseReview {
  id: number;
  courseTimeId: number;
  author: ReviewAuthor;
  rating: number; // 1-5
  content: string;
  completionRate: number; // 0-100% 리뷰 작성 시점의 진도율
  createdAt: string;
  updatedAt: string;
  isMyReview: boolean;
}

/** 백엔드 리뷰 응답 (API 원본) */
export interface CourseReviewApiResponse {
  reviewId: number;
  courseTimeId: number;
  userId: number;
  userName: string;
  userProfileImageUrl?: string | null;
  rating: number;
  content: string;
  completionRate?: number;
  createdAt: string;
  updatedAt: string;
  isMyReview?: boolean;
}

/** 리뷰 목록 응답 (프론트엔드용) */
export interface CourseReviewListResponse {
  content: CourseReview[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

/** 백엔드 리뷰 목록 응답 (API 원본) */
export interface CourseReviewListApiResponse {
  reviews: CourseReviewApiResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  averageRating?: number;
  reviewCount?: number;
}

/** 리뷰 통계 응답 */
export interface CourseReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// ============================================
// Request Types
// ============================================

/** 리뷰 작성 요청 */
export interface CreateReviewRequest {
  rating: number; // 1-5
  content: string;
}

/** 리뷰 수정 요청 */
export interface UpdateReviewRequest {
  rating: number; // 1-5
  content: string;
}

/** 리뷰 목록 조회 파라미터 */
export interface CourseReviewParams {
  page?: number;
  size?: number;
  sort?: 'latest' | 'rating_high' | 'rating_low';
}

// ============================================
// Utility Types
// ============================================

/** 정렬 옵션 라벨 */
export const REVIEW_SORT_LABELS: Record<string, string> = {
  latest: '최신순',
  rating_high: '별점 높은순',
  rating_low: '별점 낮은순',
};
