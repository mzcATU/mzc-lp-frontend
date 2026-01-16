import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCourseTimeCatalog } from './useCourseTimeCatalog';
import type { CourseTimeCatalogResponse } from '@/types/tu/courseTimeCatalog.types';
import { DELIVERY_TYPE_LABELS, PROGRAM_LEVEL_LABELS } from '@/types/tu/courseTimeCatalog.types';

// 필터 타입
export interface SearchFilters {
  sort: string;
  category: string;
  level: string;
  status?: string;
  price?: string;
}

// 필터 옵션 상수
export const SORT_OPTIONS = [
  { value: 'relevance', label: '관련도순' },
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'rating', label: '평점순' },
];

export const CATEGORY_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '개발', label: '개발' },
  { value: 'AI', label: 'AI' },
  { value: '클라우드', label: '클라우드' },
  { value: '데이터', label: '데이터' },
  { value: '디자인', label: '디자인' },
];

export const LEVEL_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'beginner', label: '입문' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
];

export const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'recruiting', label: '모집중' },
  { value: 'ongoing', label: '상시모집' },
];

export const PRICE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'free', label: '무료' },
  { value: 'paid', label: '유료' },
];

/**
 * CourseTime API 데이터를 카드 컴포넌트 props로 변환
 */
export function convertCourseTimeToCardProps(
  courseTime: CourseTimeCatalogResponse,
  includePrice: boolean = true
) {
  const mainInstructor = courseTime.instructors.find((i) => i.role === 'MAIN');
  const instructorName = mainInstructor?.name || courseTime.instructors[0]?.name || '';

  const tags: string[] = [];
  if (courseTime.isOnDemand) {
    tags.push('상시모집');
  } else if (courseTime.status === 'RECRUITING') {
    tags.push('모집중');
  } else if (courseTime.status === 'ONGOING') {
    tags.push('진행중');
  }

  const thumbnailUrl =
    courseTime.program?.thumbnailUrl ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop';

  const baseProps = {
    id: courseTime.id,
    title: courseTime.title,
    instructor: instructorName,
    image: thumbnailUrl,
    tags,
    category: courseTime.program?.categoryName ?? '',
    deliveryType: DELIVERY_TYPE_LABELS[courseTime.deliveryType] || courseTime.deliveryType,
    level: courseTime.program?.level ? PROGRAM_LEVEL_LABELS[courseTime.program.level] : undefined,
    studentCount: courseTime.currentEnrollment,
    classStartDate: courseTime.classStartDate,
    isOnDemand: courseTime.isOnDemand,
  };

  // B2C에서만 가격 정보 포함
  if (includePrice) {
    return {
      ...baseProps,
      rating: 0,
      reviewCount: 0,
      price: null,
    };
  }

  return baseProps;
}

/**
 * 공통 검색 로직을 담당하는 커스텀 훅
 * B2C와 B2B 검색 페이지에서 공유
 */
export function useSearchLogic(includePrice: boolean = true) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // URL에서 검색어 가져오기
  const query = searchParams.get('q') || '';

  // 필터 상태
  const [filters, setFilters] = useState<SearchFilters>({
    sort: 'relevance',
    category: 'all',
    level: 'all',
    status: 'all',
    price: 'all',
  });

  // 검색 입력값 초기화
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // 강의 데이터 가져오기
  const {
    data: coursesData,
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useCourseTimeCatalog({
    search: query || undefined,
    categoryName: filters.category !== 'all' ? filters.category : undefined,
    level: filters.level !== 'all' ? filters.level.toUpperCase() : undefined,
    status:
      filters.status !== 'all'
        ? filters.status === 'recruiting'
          ? 'RECRUITING'
          : 'ONGOING'
        : undefined,
    sort:
      filters.sort === 'latest'
        ? 'classStartDate,desc'
        : filters.sort === 'popular'
          ? 'currentEnrollment,desc'
          : undefined,
    page: 0,
    size: 50,
  });

  // 검색 결과 처리
  const courses = useMemo(() => {
    if (!coursesData?.content) return [];
    return coursesData.content.map((course) => convertCourseTimeToCardProps(course, includePrice));
  }, [coursesData, includePrice]);

  // 검색 실행
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  // 검색어 초기화
  const clearSearch = () => {
    setSearchInput('');
    setSearchParams({});
  };

  // 필터 업데이트
  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilters({
      sort: 'relevance',
      category: 'all',
      level: 'all',
      status: 'all',
      price: 'all',
    });
  };

  return {
    // 검색 상태
    query,
    searchInput,
    setSearchInput,
    isSearchFocused,
    setIsSearchFocused,

    // 필터 상태
    filters,
    showFilters,
    setShowFilters,
    updateFilter,
    resetFilters,

    // 데이터
    courses,
    isLoading: isCoursesLoading,
    error: coursesError,
    totalElements: coursesData?.totalElements || 0,

    // 액션
    handleSearch,
    clearSearch,
  };
}
