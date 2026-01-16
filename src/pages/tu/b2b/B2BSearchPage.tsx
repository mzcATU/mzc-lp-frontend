import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Loader2,
  BookOpen,
  X,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { B2BLandingHeader } from './components/B2BLandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { B2BCourseCard } from './components/B2BCourseCard';
import { useCourseTimeCatalog } from '@/hooks/tu';
import type { CourseTimeCatalogResponse } from '@/types/tu/courseTimeCatalog.types';
import { DELIVERY_TYPE_LABELS, PROGRAM_LEVEL_LABELS } from '@/types/tu/courseTimeCatalog.types';

// API 사용 여부
const USE_API = true;

/**
 * CourseTime API 데이터를 카드 컴포넌트 props로 변환
 */
function convertCourseTimeToCardProps(courseTime: CourseTimeCatalogResponse) {
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

  return {
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
}

// 필터 옵션 상수
const SORT_OPTIONS = [
  { value: 'relevance', label: '관련도순' },
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '개발', label: '개발' },
  { value: 'AI', label: 'AI' },
  { value: '클라우드', label: '클라우드' },
  { value: '데이터', label: '데이터' },
  { value: '디자인', label: '디자인' },
];

const LEVEL_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'beginner', label: '입문' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'recruiting', label: '모집중' },
  { value: 'ongoing', label: '상시모집' },
];

// 필터 타입
interface Filters {
  sort: string;
  category: string;
  level: string;
  status: string;
}

/**
 * 필터 드롭다운 컴포넌트
 */
function FilterDropdown({
  label,
  value,
  options,
  onChange,
  isDark,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  isDark: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isDark
            ? 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
        } ${value !== 'all' && value !== 'relevance' ? (isDark ? 'border-[#6778ff]/50 text-[#6778ff]' : 'border-[#6778ff] text-[#6778ff]') : ''}`}
      >
        <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>{label}:</span>
        <span>{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div
            className={`absolute top-full left-0 mt-1 py-1 rounded-lg shadow-lg z-20 min-w-[140px] ${
              isDark ? 'bg-[#2a2a2a] border border-white/10' : 'bg-white border border-gray-200'
            }`}
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  value === option.value
                    ? 'bg-[#6778ff] text-white'
                    : isDark
                      ? 'text-gray-300 hover:bg-white/5'
                      : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const DEFAULT_FILTERS: Filters = {
  sort: 'relevance',
  category: 'all',
  level: 'all',
  status: 'all',
};

/**
 * B2B 과정 검색 페이지
 */
export function B2BSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // 필터 초기화
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    setSearchParams(params);
  };

  // 활성화된 필터 개수
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.sort !== 'relevance') count++;
    if (filters.category !== 'all') count++;
    if (filters.level !== 'all') count++;
    if (filters.status !== 'all') count++;
    return count;
  }, [filters]);

  // URL에서 검색어 및 필터 가져오기
  useEffect(() => {
    const search = searchParams.get('search') || searchParams.get('q') || '';
    const sort = searchParams.get('sort');
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const status = searchParams.get('status');

    if (search) {
      setSearchQuery(search);
      setInputValue(search);
    }

    setFilters({
      sort: sort || 'relevance',
      category: category || 'all',
      level: level || 'all',
      status: status || 'all',
    });
  }, [searchParams]);

  // 필터 변경 시 URL 업데이트
  const updateFilterWithUrl = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (newFilters.sort !== 'relevance') params.set('sort', newFilters.sort);
    if (newFilters.category !== 'all') params.set('category', newFilters.category);
    if (newFilters.level !== 'all') params.set('level', newFilters.level);
    if (newFilters.status !== 'all') params.set('status', newFilters.status);

    setSearchParams(params);
  };

  // API 데이터
  const {
    data: coursesData,
    isLoading: isCoursesLoading,
  } = useCourseTimeCatalog(
    {
      keyword: searchQuery || undefined,
      status: ['RECRUITING', 'ONGOING'],
      size: 20,
    },
    USE_API && !!searchQuery
  );

  const courses = coursesData?.content || [];
  const totalCourses = coursesData?.totalElements || 0;

  // 검색 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue.trim());
      setSearchParams({ search: inputValue.trim() });
    }
  };

  // 검색어 초기화
  const handleClearSearch = () => {
    setSearchQuery('');
    setInputValue('');
    setSearchParams({});
  };

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <B2BLandingHeader />

      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        {/* 검색 헤더 */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            과정 검색
          </h1>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            과정명, 강사명으로 검색하세요
          </p>

          {/* 검색바 */}
          <form onSubmit={handleSearch} className="relative w-full">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="과정명, 강사명으로 검색하세요"
              className={`w-full rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#6778ff] focus:border-transparent transition-all ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                  isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>

        {/* 검색 결과 */}
        {searchQuery && (
          <>
            {/* 필터 영역 */}
            <div className="mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium mb-4 ${
                  isDark
                    ? 'bg-white/5 border border-white/10 text-gray-300'
                    : 'bg-white border border-gray-200 text-gray-700'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                필터
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#6778ff] text-white text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className={`flex flex-wrap gap-2 ${!showFilters ? 'max-md:hidden' : ''}`}>
                <FilterDropdown
                  label="정렬"
                  value={filters.sort}
                  options={SORT_OPTIONS}
                  onChange={(value) => updateFilterWithUrl('sort', value)}
                  isDark={isDark}
                />

                <FilterDropdown
                  label="카테고리"
                  value={filters.category}
                  options={CATEGORY_OPTIONS}
                  onChange={(value) => updateFilterWithUrl('category', value)}
                  isDark={isDark}
                />

                <FilterDropdown
                  label="난이도"
                  value={filters.level}
                  options={LEVEL_OPTIONS}
                  onChange={(value) => updateFilterWithUrl('level', value)}
                  isDark={isDark}
                />

                <FilterDropdown
                  label="모집상태"
                  value={filters.status}
                  options={STATUS_OPTIONS}
                  onChange={(value) => updateFilterWithUrl('status', value)}
                  isDark={isDark}
                />

                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isDark
                        ? 'text-gray-400 hover:text-white hover:bg-white/5'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    초기화
                  </button>
                )}
              </div>
            </div>

            {/* 검색 결과 요약 */}
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              "<span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{searchQuery}</span>"
              검색 결과{' '}
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {totalCourses}
              </span>
              건
            </p>

            {isCoursesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
                <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  검색 중...
                </span>
              </div>
            ) : totalCourses === 0 ? (
              <div className="text-center py-20">
                <Search className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  검색 결과가 없습니다
                </p>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  다른 키워드로 검색해 보세요
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* 과정 목록 */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      과정
                      <span className="ml-2 text-sm font-normal text-[#6778ff]">{totalCourses}</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {courses.map((course) => {
                      const cardProps = convertCourseTimeToCardProps(course);
                      return <B2BCourseCard key={cardProps.id} {...cardProps} />;
                    })}
                  </div>
                </section>
              </div>
            )}
          </>
        )}

        {/* 검색어 없을 때 */}
        {!searchQuery && (
          <div className="text-center py-16">
            <Search className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              무엇을 찾으시나요?
            </h2>
            <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              위 검색창에 키워드를 입력해주세요
            </p>

            <div className="max-w-lg mx-auto">
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                인기 검색어
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {['React', 'Python', 'AI', '클라우드', 'TypeScript', 'AWS', 'Docker', 'Spring'].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => {
                      setInputValue(keyword);
                      setSearchQuery(keyword);
                      setSearchParams({ search: keyword });
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isDark
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:text-gray-900'
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
