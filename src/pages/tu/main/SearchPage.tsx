import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Loader2,
  BookOpen,
  Map,
  MessageSquare,
  Clock,
  Star,
  ChevronRight,
  X,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingCourseCard } from '@/components/landing';
import { useCourseTimeCatalog, useRoadmapExplore, useCommunityPosts } from '@/hooks/tu';
import { useSubdomainPath } from '@/hooks/common';
import { useTenantFeatures } from '@/contexts/TenantFeaturesContext';
import type { RoadmapExploreItem } from '@/types/tu/roadmapExplore.types';
import type { CommunityPost } from '@/types/tu/community.types';
import type { CourseTimeCatalogResponse } from '@/types/tu/courseTimeCatalog.types';
import { ROADMAP_LEVEL_LABELS } from '@/types/tu/roadmapExplore.types';
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
    rating: 0,
    reviewCount: 0,
    price: null,
  };
}

// 탭 타입
type SearchTab = 'all' | 'courses' | 'roadmaps' | 'community';

// 필터 옵션 상수
const SORT_OPTIONS = [
  { value: 'relevance', label: '관련도순' },
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
  { value: 'rating', label: '평점순' },
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

const PRICE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'free', label: '무료' },
  { value: 'paid', label: '유료' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'recruiting', label: '모집중' },
  { value: 'ongoing', label: '상시모집' },
];

const POST_TYPE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'tip', label: '팁/노하우' },
  { value: 'question', label: '질문' },
  { value: 'discussion', label: '토론' },
  { value: 'review', label: '후기' },
];

const COMMUNITY_CATEGORY_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: '개발 질문', label: '개발 질문' },
  { value: '스터디 모집', label: '스터디 모집' },
  { value: '경험 공유', label: '경험 공유' },
  { value: '자유 토론', label: '자유 토론' },
];

// 필터 타입
interface Filters {
  sort: string;
  category: string;
  level: string;
  price: string;
  status: string;
  postType: string;
  communityCategory: string;
}

// 상대 시간 포맷
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  return date.toLocaleDateString('ko-KR');
};

/**
 * 로드맵 카드 컴포넌트
 */
function RoadmapCard({ roadmap, isDark }: { roadmap: RoadmapExploreItem; isDark: boolean }) {
  const { prefixPath } = useSubdomainPath();
  return (
    <Link to={prefixPath(`/tu/b2c/roadmaps/${roadmap.id}`)} className="group block">
      <div
        className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
          isDark
            ? 'bg-white/5 border-white/10 hover:border-[#6778ff]/50'
            : 'bg-white border-gray-200 hover:border-[#6778ff] hover:shadow-lg'
        }`}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={roadmap.image}
            alt={roadmap.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <span
              className={`inline-block text-xs px-2 py-1 rounded-full ${
                roadmap.level === 'beginner'
                  ? 'bg-green-500/80 text-white'
                  : roadmap.level === 'intermediate'
                    ? 'bg-yellow-500/80 text-white'
                    : 'bg-red-500/80 text-white'
              }`}
            >
              {ROADMAP_LEVEL_LABELS[roadmap.level]}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3
            className={`font-bold line-clamp-2 mb-2 group-hover:text-[#6778ff] transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {roadmap.title}
          </h3>
          <p className={`text-sm line-clamp-2 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {roadmap.description}
          </p>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                <BookOpen className="w-3 h-3" />
                {roadmap.courseCount}개 강의
              </span>
              <span className={`flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                <Clock className="w-3 h-3" />
                {roadmap.estimatedHours}시간
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{roadmap.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
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

/**
 * 커뮤니티 게시글 카드 컴포넌트
 */
function CommunityCard({ post, isDark }: { post: CommunityPost; isDark: boolean }) {
  const { prefixPath } = useSubdomainPath();
  return (
    <Link
      to={prefixPath(`/tu/b2c/community/${post.id}`)}
      className={`block p-4 rounded-xl border transition-all duration-300 ${
        isDark
          ? 'bg-white/5 border-white/10 hover:border-[#6778ff]/50'
          : 'bg-white border-gray-200 hover:border-[#6778ff] hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold line-clamp-1 mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {post.title}
          </h3>
          <p className={`text-sm line-clamp-2 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {post.content}
          </p>
          <div className="flex items-center gap-3 text-xs">
            <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>{post.author.name}</span>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>
              {formatRelativeTime(post.createdAt)}
            </span>
            <span className={`flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              <MessageSquare className="w-3 h-3" />
              {post.commentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const DEFAULT_FILTERS: Filters = {
  sort: 'relevance',
  category: 'all',
  level: 'all',
  price: 'all',
  status: 'all',
  postType: 'all',
  communityCategory: 'all',
};

/**
 * B2C 통합 검색 페이지
 */
export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // 기능 설정
  const { isFeatureEnabled } = useTenantFeatures();
  const paidModeEnabled = isFeatureEnabled('paidModeEnabled');

  // 필터 초기화
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (activeTab !== 'all') params.set('tab', activeTab);
    setSearchParams(params);
  };

  // 활성화된 필터 개수
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.sort !== 'relevance') count++;
    if (filters.category !== 'all') count++;
    if (filters.level !== 'all') count++;
    if (filters.price !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.postType !== 'all') count++;
    if (filters.communityCategory !== 'all') count++;
    return count;
  }, [filters]);

  // URL에서 검색어 및 필터 가져오기
  useEffect(() => {
    const search = searchParams.get('search') || searchParams.get('q') || '';
    const tab = searchParams.get('tab') as SearchTab;
    const sort = searchParams.get('sort');
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const price = searchParams.get('price');
    const status = searchParams.get('status');
    const postType = searchParams.get('postType');
    const communityCategory = searchParams.get('communityCategory');

    if (search) {
      setSearchQuery(search);
      setInputValue(search);
    }
    if (tab && ['all', 'courses', 'roadmaps', 'community'].includes(tab)) {
      setActiveTab(tab);
    }

    setFilters({
      sort: sort || 'relevance',
      category: category || 'all',
      level: level || 'all',
      price: price || 'all',
      status: status || 'all',
      postType: postType || 'all',
      communityCategory: communityCategory || 'all',
    });
  }, [searchParams]);

  // 필터 변경 시 URL 업데이트
  const updateFilterWithUrl = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (activeTab !== 'all') params.set('tab', activeTab);
    if (newFilters.sort !== 'relevance') params.set('sort', newFilters.sort);
    if (newFilters.category !== 'all') params.set('category', newFilters.category);
    if (newFilters.level !== 'all') params.set('level', newFilters.level);
    if (newFilters.price !== 'all') params.set('price', newFilters.price);
    if (newFilters.status !== 'all') params.set('status', newFilters.status);
    if (newFilters.postType !== 'all') params.set('postType', newFilters.postType);
    if (newFilters.communityCategory !== 'all') params.set('communityCategory', newFilters.communityCategory);

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
      size: activeTab === 'courses' ? 20 : 6,
    },
    USE_API && !!searchQuery
  );

  const {
    data: roadmapsData,
    isLoading: isRoadmapsLoading,
  } = useRoadmapExplore(
    {
      search: searchQuery || undefined,
      pageSize: activeTab === 'roadmaps' ? 20 : 6,
    },
    USE_API && !!searchQuery
  );

  const {
    data: communityData,
    isLoading: isCommunityLoading,
  } = useCommunityPosts(
    {
      search: searchQuery || undefined,
      pageSize: activeTab === 'community' ? 20 : 6,
    },
    USE_API && !!searchQuery
  );

  const courses = coursesData?.content || [];
  const roadmaps = roadmapsData?.roadmaps || [];
  const communityPosts = communityData?.posts || [];

  const totalCourses = coursesData?.totalElements || 0;
  const totalRoadmaps = roadmapsData?.totalCount || 0;
  const totalCommunity = communityData?.totalCount || 0;
  const totalResults = totalCourses + totalRoadmaps + totalCommunity;

  const isLoading = isCoursesLoading || isRoadmapsLoading || isCommunityLoading;

  // 검색 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchQuery(inputValue.trim());
      setSearchParams({ search: inputValue.trim(), tab: activeTab });
    }
  };

  // 탭 변경
  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
    if (searchQuery) {
      setSearchParams({ search: searchQuery, tab });
    }
  };

  // 검색어 초기화
  const handleClearSearch = () => {
    setSearchQuery('');
    setInputValue('');
    setSearchParams({});
  };

  const tabs = [
    { id: 'all' as const, label: '전체', count: totalResults },
    { id: 'courses' as const, label: '강의', count: totalCourses, icon: BookOpen },
    { id: 'roadmaps' as const, label: '로드맵', count: totalRoadmaps, icon: Map },
    { id: 'community' as const, label: '커뮤니티', count: totalCommunity, icon: MessageSquare },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <LandingHeader />

      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        {/* 검색 헤더 */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            통합 검색
          </h1>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            강의, 로드맵, 커뮤니티를 한 번에 검색하세요
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
              placeholder="강의, 로드맵, 커뮤니티 글을 검색하세요"
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
            {/* 탭 */}
            <div className={`flex gap-1 mb-8 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 md:px-8 py-4 text-sm md:text-base font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? isDark
                        ? 'text-white'
                        : 'text-[#6778ff]'
                      : isDark
                        ? 'text-gray-500 hover:text-gray-300'
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.icon && <tab.icon className="w-4 h-4 md:w-5 md:h-5" />}
                  {tab.label}
                  {searchQuery && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-[#6778ff] text-white'
                          : isDark
                            ? 'bg-white/10 text-gray-400'
                            : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6778ff]" />
                  )}
                </button>
              ))}
            </div>

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

                {(activeTab === 'all' || activeTab === 'courses' || activeTab === 'roadmaps') && (
                  <FilterDropdown
                    label="카테고리"
                    value={filters.category}
                    options={CATEGORY_OPTIONS}
                    onChange={(value) => updateFilterWithUrl('category', value)}
                    isDark={isDark}
                  />
                )}

                {(activeTab === 'courses' || activeTab === 'roadmaps') && (
                  <FilterDropdown
                    label="난이도"
                    value={filters.level}
                    options={LEVEL_OPTIONS}
                    onChange={(value) => updateFilterWithUrl('level', value)}
                    isDark={isDark}
                  />
                )}

                {activeTab === 'courses' && paidModeEnabled && (
                  <FilterDropdown
                    label="가격"
                    value={filters.price}
                    options={PRICE_OPTIONS}
                    onChange={(value) => updateFilterWithUrl('price', value)}
                    isDark={isDark}
                  />
                )}

                {activeTab === 'courses' && (
                  <FilterDropdown
                    label="모집상태"
                    value={filters.status}
                    options={STATUS_OPTIONS}
                    onChange={(value) => updateFilterWithUrl('status', value)}
                    isDark={isDark}
                  />
                )}

                {activeTab === 'community' && (
                  <>
                    <FilterDropdown
                      label="유형"
                      value={filters.postType}
                      options={POST_TYPE_OPTIONS}
                      onChange={(value) => updateFilterWithUrl('postType', value)}
                      isDark={isDark}
                    />
                    <FilterDropdown
                      label="카테고리"
                      value={filters.communityCategory}
                      options={COMMUNITY_CATEGORY_OPTIONS}
                      onChange={(value) => updateFilterWithUrl('communityCategory', value)}
                      isDark={isDark}
                    />
                  </>
                )}

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
                {totalResults}
              </span>
              건
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
                <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  검색 중...
                </span>
              </div>
            ) : totalResults === 0 ? (
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
                {/* 강의 섹션 */}
                {(activeTab === 'all' || activeTab === 'courses') && courses.length > 0 && (
                  <section>
                    {activeTab === 'all' && (
                      <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          강의
                          <span className="ml-2 text-sm font-normal text-[#6778ff]">{totalCourses}</span>
                        </h2>
                        {totalCourses > 6 && (
                          <button
                            onClick={() => handleTabChange('courses')}
                            className="text-sm text-[#6778ff] hover:underline flex items-center gap-1"
                          >
                            더보기 <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {courses.map((course) => {
                        const cardProps = convertCourseTimeToCardProps(course);
                        return (
                          <LandingCourseCard
                            key={cardProps.id}
                            {...cardProps}
                            courseBasePath="/tu/b2c/times"
                          />
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 로드맵 섹션 */}
                {(activeTab === 'all' || activeTab === 'roadmaps') && roadmaps.length > 0 && (
                  <section>
                    {activeTab === 'all' && (
                      <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          로드맵
                          <span className="ml-2 text-sm font-normal text-[#6778ff]">{totalRoadmaps}</span>
                        </h2>
                        {totalRoadmaps > 6 && (
                          <button
                            onClick={() => handleTabChange('roadmaps')}
                            className="text-sm text-[#6778ff] hover:underline flex items-center gap-1"
                          >
                            더보기 <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {roadmaps.map((roadmap) => (
                        <RoadmapCard key={roadmap.id} roadmap={roadmap} isDark={isDark} />
                      ))}
                    </div>
                  </section>
                )}

                {/* 커뮤니티 섹션 */}
                {(activeTab === 'all' || activeTab === 'community') && communityPosts.length > 0 && (
                  <section>
                    {activeTab === 'all' && (
                      <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          커뮤니티
                          <span className="ml-2 text-sm font-normal text-[#6778ff]">{totalCommunity}</span>
                        </h2>
                        {totalCommunity > 6 && (
                          <button
                            onClick={() => handleTabChange('community')}
                            className="text-sm text-[#6778ff] hover:underline flex items-center gap-1"
                          >
                            더보기 <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {communityPosts.map((post) => (
                        <CommunityCard key={post.id} post={post} isDark={isDark} />
                      ))}
                    </div>
                  </section>
                )}
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
                      setSearchParams({ search: keyword, tab: 'all' });
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
