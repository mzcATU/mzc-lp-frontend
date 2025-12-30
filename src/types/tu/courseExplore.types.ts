/**
 * 강의 탐색(Course Explore) 관련 타입 정의
 */

// 강의 카드 (탐색 목록용)
export interface CourseExploreItem {
  id: number;
  title: string;
  instructor: string;
  originalPrice: number;
  price: number;
  image: string;
  discount: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  totalHours: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isNew?: boolean;
  isBestseller?: boolean;
  tags?: string[];
}

// 강의 탐색 응답
export interface CourseExploreResponse {
  courses: CourseExploreItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 카테고리 정보 (탐색 페이지용)
export interface ExploreCourseCategory {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

// 카테고리 목록 응답
export interface CourseCategoryResponse {
  categories: ExploreCourseCategory[];
}

// 강의 탐색 필터
export interface CourseExploreFilter {
  search?: string;
  category?: string;
  level?: 'all' | 'beginner' | 'intermediate' | 'advanced';
  priceRange?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  sortBy?: 'popular' | 'newest' | 'rating' | 'price_low' | 'price_high';
  page?: number;
  pageSize?: number;
}

// 레벨 레이블
export const COURSE_LEVEL_LABELS = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
} as const;

// 정렬 옵션
export const COURSE_SORT_OPTIONS = [
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '최신순' },
  { value: 'rating', label: '평점순' },
  { value: 'price_low', label: '낮은 가격순' },
  { value: 'price_high', label: '높은 가격순' },
] as const;
