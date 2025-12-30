/**
 * 로드맵 탐색(Roadmap Explore) 관련 타입 정의
 */

// 로드맵 카드 (탐색 목록용)
export interface RoadmapExploreItem {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  authorImage?: string;
  courseCount: number;
  estimatedHours: number;
  enrollCount: number;
  rating: number;
  reviewCount: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags?: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

// 로드맵 탐색 응답
export interface RoadmapExploreResponse {
  roadmaps: RoadmapExploreItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 로드맵 카테고리
export interface RoadmapCategory {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

// 로드맵 카테고리 응답
export interface RoadmapCategoryResponse {
  categories: RoadmapCategory[];
}

// 로드맵 탐색 필터
export interface RoadmapExploreFilter {
  search?: string;
  category?: string;
  level?: 'all' | 'beginner' | 'intermediate' | 'advanced';
  sortBy?: 'popular' | 'newest' | 'rating';
  page?: number;
  pageSize?: number;
}

// 레벨 레이블
export const ROADMAP_LEVEL_LABELS = {
  beginner: '입문',
  intermediate: '중급',
  advanced: '고급',
} as const;

// 정렬 옵션
export const ROADMAP_SORT_OPTIONS = [
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '최신순' },
  { value: 'rating', label: '평점순' },
] as const;
