/**
 * 강의 상세 페이지 타입 정의
 * 백엔드 API 연동 시 사용할 타입들
 */

/**
 * 강의 내 개별 레슨(강의)
 */
export interface CourseLecture {
  id: number;
  title: string;
  duration: string; // "5:30" 형식
  isPreview: boolean;
  videoUrl?: string;
}

/**
 * 커리큘럼 섹션
 */
export interface CurriculumSection {
  id: number;
  title: string;
  lectures: CourseLecture[];
}

/**
 * 강사 정보
 */
export interface CourseInstructor {
  id: number;
  name: string;
  profileImage?: string;
  bio: string;
  courseCount?: number;
  studentCount?: number;
  rating?: number;
}

/**
 * 강의 태그
 */
export type CourseTag = 'NEW' | '베스트' | '인기' | '할인중' | '추천';

/**
 * 강의 카테고리
 */
export type CourseCategory = 'dev' | 'ai' | 'cloud' | 'data' | 'design' | 'business' | 'other';

/**
 * 강의 상세 정보
 */
export interface CourseDetail {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  promoVideoUrl?: string;
  category: CourseCategory;
  tags: CourseTag[];

  // 가격 정보
  price: number;
  originalPrice: number;
  discountRate?: number;

  // 통계 정보
  rating: number;
  reviewCount: number;
  studentCount: number;

  // 강의 정보
  totalHours: number;
  totalLectures: number;
  level: string; // '입문', '초급', '중급', '고급' 등
  lastUpdated: string;

  // 상세 내용
  whatYouLearn: string[];
  requirements: string[];

  // 커리큘럼
  curriculum: CurriculumSection[];

  // 강사 정보
  instructor: CourseInstructor;

  // 메타 정보
  hasCertificate: boolean;
  isLifetimeAccess: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 강의 상세 조회 API 응답
 */
export interface CourseDetailResponse {
  success: boolean;
  data: CourseDetail;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 강의 목록 필터 파라미터
 */
export interface CourseFilterParams {
  page?: number;
  size?: number;
  search?: string;
  category?: CourseCategory;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tags?: CourseTag[];
  sortBy?: 'createdAt' | 'price' | 'rating' | 'studentCount' | 'title';
  sortDirection?: 'ASC' | 'DESC';
}

/**
 * 강의 카드용 간략 정보 (목록 표시용)
 */
export interface CourseCard {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  category: CourseCategory;
  tags: CourseTag[];
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  instructorName: string;
  totalHours: number;
  level: string;
}

/**
 * 카테고리 라벨 매핑
 */
export const CATEGORY_LABELS: Record<CourseCategory, string> = {
  dev: '개발',
  ai: 'AI',
  cloud: '클라우드',
  data: '데이터',
  design: '디자인',
  business: '비즈니스',
  other: '기타',
};

/**
 * 태그 스타일 매핑
 */
export const TAG_STYLES: Record<CourseTag, { bg: string; text: string }> = {
  NEW: { bg: 'bg-[#6778ff]/20', text: 'text-[#6778ff]' },
  '베스트': { bg: 'bg-[#f59e0b]/20', text: 'text-[#f59e0b]' },
  '인기': { bg: 'bg-[#f59e0b]/20', text: 'text-[#f59e0b]' },
  '할인중': { bg: 'bg-[#10b981]/20', text: 'text-[#10b981]' },
  '추천': { bg: 'bg-[#a855f7]/20', text: 'text-[#a855f7]' },
};
