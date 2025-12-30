/**
 * 로드맵 상세 페이지 타입 정의
 * 백엔드 API 연동 시 사용할 타입들
 */

/**
 * 로드맵 내 코스 정보
 */
export interface RoadmapCourse {
  id: number;
  title: string;
  instructorName: string;
  duration: string; // "12시간" 형식
  lectureCount: number;
  thumbnailUrl?: string;
  isFree: boolean;
  isCompleted?: boolean;
  progress?: number; // 0-100
  order: number;
}

/**
 * 로드맵 제작자 정보
 */
export interface RoadmapAuthor {
  id: number;
  name: string;
  profileImage?: string;
  bio: string;
  roadmapCount?: number;
  studentCount?: number;
}

/**
 * 수강평 정보
 */
export interface RoadmapReview {
  id: number;
  userId: number;
  userName: string;
  userImage?: string;
  rating: number;
  content: string;
  createdAt: string;
  helpful: number;
  isHelpful?: boolean;
}

/**
 * 로드맵 상세 정보
 */
export interface RoadmapDetail {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  thumbnailUrl?: string;

  // 레벨/태그 정보
  level: string;
  tags: string[];

  // 가격 정보
  price: number;
  originalPrice: number;
  discountRate?: number;

  // 통계 정보
  rating: number;
  reviewCount: number;
  participants: number;
  views: number;

  // 로드맵 구성
  totalCourses: number;
  totalHours: number;
  courses: RoadmapCourse[];

  // 상세 내용
  whatYouLearn: string[];
  requirements: string[];
  targetAudience: string[];

  // 제작자 정보
  author: RoadmapAuthor;

  // 수강평
  reviews?: RoadmapReview[];

  // 사용자 진행 정보 (로그인한 경우)
  userProgress?: {
    completedCourses: number;
    totalProgress: number; // 0-100
    isEnrolled: boolean;
    enrolledAt?: string;
  };

  // 메타 정보
  hasRefundPolicy: boolean;
  refundDays?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 로드맵 상세 조회 API 응답
 */
export interface RoadmapDetailResponse {
  success: boolean;
  data: RoadmapDetail;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 로드맵 목록 필터 파라미터
 */
export interface RoadmapFilterParams {
  page?: number;
  size?: number;
  search?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tags?: string[];
  sortBy?: 'createdAt' | 'price' | 'rating' | 'participants' | 'title';
  sortDirection?: 'ASC' | 'DESC';
}

/**
 * 로드맵 카드용 간략 정보 (목록 표시용)
 */
export interface RoadmapCard {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  level: string;
  tags: string[];
  price: number;
  originalPrice: number;
  rating: number;
  participants: number;
  totalCourses: number;
  totalHours: number;
  authorName: string;
}

/**
 * 로드맵 탭 타입
 */
export type RoadmapTab = 'intro' | 'courses' | 'reviews';

/**
 * 수강평 작성 요청
 */
export interface CreateReviewRequest {
  roadmapId: number;
  rating: number;
  content: string;
}

/**
 * 수강평 페이지네이션 응답
 */
export interface ReviewPageResponse {
  content: RoadmapReview[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
