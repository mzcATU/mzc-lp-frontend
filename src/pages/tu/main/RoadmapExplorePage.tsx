import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Users, Star, CheckCircle, Loader2, Search, Heart } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useRoadmapExplore, useRoadmapCategories } from '@/hooks/tu';
import type { RoadmapExploreItem, RoadmapCategory } from '@/types/tu';

// 환경 설정: true면 API 사용, false면 더미 데이터 사용
const USE_API = false;

// 더미 카테고리 데이터
const MOCK_CATEGORIES: RoadmapCategory[] = [
  { id: 'all', name: '전체', count: 6 },
  { id: 'frontend', name: '프론트엔드', count: 2 },
  { id: 'backend', name: '백엔드', count: 1 },
  { id: 'ai', name: 'AI/ML', count: 1 },
  { id: 'data', name: '데이터', count: 1 },
  { id: 'devops', name: 'DevOps', count: 1 },
];

// 더미 로드맵 데이터
const MOCK_ROADMAPS: RoadmapExploreItem[] = [
  {
    id: 1,
    title: '프론트엔드 개발자 로드맵',
    description: 'HTML/CSS부터 React, Next.js까지 프론트엔드 개발의 모든 것',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    author: '김프론트',
    courseCount: 12,
    estimatedHours: 180,
    enrollCount: 3420,
    rating: 4.9,
    reviewCount: 567,
    level: 'beginner',
    category: 'frontend',
    tags: ['인기', 'NEW'],
    isPopular: true,
    isNew: true,
  },
  {
    id: 2,
    title: '백엔드 개발자 로드맵',
    description: 'Java, Spring Boot, 데이터베이스, 클라우드까지 백엔드 완전 정복',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
    author: '이백엔드',
    courseCount: 15,
    estimatedHours: 240,
    enrollCount: 2890,
    rating: 4.8,
    reviewCount: 445,
    level: 'intermediate',
    category: 'backend',
    tags: ['베스트'],
    isPopular: true,
  },
  {
    id: 3,
    title: 'AI/ML 엔지니어 로드맵',
    description: 'Python, 머신러닝, 딥러닝, LLM까지 AI 전문가 되기',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
    author: '박에이아이',
    courseCount: 18,
    estimatedHours: 300,
    enrollCount: 1567,
    rating: 4.9,
    reviewCount: 321,
    level: 'advanced',
    category: 'ai',
    tags: ['NEW'],
    isNew: true,
  },
  {
    id: 4,
    title: '데이터 분석가 로드맵',
    description: '데이터 수집, 분석, 시각화, 머신러닝까지 데이터 분석 마스터',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    author: '최데이터',
    courseCount: 10,
    estimatedHours: 150,
    enrollCount: 2134,
    rating: 4.7,
    reviewCount: 234,
    level: 'beginner',
    category: 'data',
    tags: [],
  },
  {
    id: 5,
    title: 'DevOps 엔지니어 로드맵',
    description: 'Docker, Kubernetes, CI/CD, 클라우드 인프라 구축',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    author: '정데브옵스',
    courseCount: 14,
    estimatedHours: 210,
    enrollCount: 987,
    rating: 4.8,
    reviewCount: 178,
    level: 'intermediate',
    category: 'devops',
    tags: [],
  },
  {
    id: 6,
    title: '풀스택 개발자 로드맵',
    description: '프론트엔드 + 백엔드를 모두 다루는 풀스택 개발자 되기',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
    author: '강풀스택',
    courseCount: 24,
    estimatedHours: 360,
    enrollCount: 1823,
    rating: 4.9,
    reviewCount: 389,
    level: 'beginner',
    category: 'frontend',
    tags: ['인기'],
    isPopular: true,
  },
];

// 기간 텍스트 변환
const getDurationText = (hours: number): string => {
  const months = Math.ceil(hours / 30);
  return `${months}개월`;
};

// 카테고리별 색상 매핑
const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'frontend': return 'from-[#6778ff] to-[#a855f7]';
    case 'backend': return 'from-[#10b981] to-[#059669]';
    case 'ai': return 'from-[#f59e0b] to-[#d97706]';
    case 'data': return 'from-[#ec4899] to-[#be185d]';
    case 'devops': return 'from-[#06b6d4] to-[#0891b2]';
    default: return 'from-[#8b5cf6] to-[#6d28d9]';
  }
};

interface RoadmapCardProps {
  roadmap: RoadmapExploreItem;
  isDark: boolean;
}

function RoadmapCard({ roadmap, isDark }: RoadmapCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: API 연동 시 실제 찜 추가/삭제 로직 구현
  };

  const color = getCategoryColor(roadmap.category);
  const tags: string[] = [];
  if (roadmap.isNew) tags.push('NEW');
  if (roadmap.isPopular) tags.push('인기');

  return (
    <Link
      to={`/tu/main/roadmap/${roadmap.id}`}
      className={`block rounded-2xl p-6 card-hover cursor-pointer group border relative ${
        isDark
          ? 'glass border-white/10'
          : 'bg-white border-gray-200 shadow-sm hover:shadow-lg'
      }`}
    >
      {/* 찜 버튼 */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 z-10 ${
          isWishlisted
            ? 'bg-red-500 text-white'
            : isDark
              ? 'bg-white/10 text-gray-400 hover:bg-red-500 hover:text-white'
              : 'bg-gray-100 text-gray-400 hover:bg-red-500 hover:text-white'
        }`}
        aria-label={isWishlisted ? '찜 해제' : '찜하기'}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div className="flex gap-2 mr-10">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                tag === 'NEW'
                  ? 'bg-[#6778ff]/20 text-[#6778ff]'
                  : tag === '인기'
                  ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                  : 'bg-[#10b981]/20 text-[#10b981]'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <h3 className={`text-xl font-bold mb-2 transition-colors ${
        isDark
          ? 'text-white group-hover:text-[#6778ff]'
          : 'text-gray-900 group-hover:text-[#6778ff]'
      }`}>
        {roadmap.title}
      </h3>
      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {roadmap.description}
      </p>

      {/* Meta Info */}
      <div className={`flex flex-wrap gap-4 mb-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {getDurationText(roadmap.estimatedHours)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {roadmap.enrollCount.toLocaleString()}명
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" />
          {roadmap.rating}
        </span>
      </div>

      {/* Footer */}
      <div className={`flex items-center justify-between pt-4 border-t ${
        isDark ? 'border-white/10' : 'border-gray-200'
      }`}>
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          총 <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{roadmap.courseCount}개</span> 강의
        </span>
        <span className="flex items-center gap-1 text-[#6778ff] font-medium text-sm group-hover:gap-2 transition-all">
          자세히 보기 <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

export function RoadmapExplorePage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');

  // React Query 훅 (API 모드일 때만 활성화)
  const filter = {
    search: searchQuery || undefined,
    category: activeCategory !== 'all' ? activeCategory : undefined,
    sortBy,
  };
  const { data: apiRoadmapData, isLoading, error } = useRoadmapExplore(filter, USE_API);
  const { data: apiCategoryData } = useRoadmapCategories(USE_API);

  // 실제 사용할 데이터 결정
  const categories = USE_API ? (apiCategoryData?.categories || []) : MOCK_CATEGORIES;

  // Mock 모드에서 필터링 및 정렬 적용
  const getFilteredRoadmaps = (): RoadmapExploreItem[] => {
    if (USE_API) {
      return apiRoadmapData?.roadmaps || [];
    }

    let filtered = [...MOCK_ROADMAPS];

    // 카테고리 필터
    if (activeCategory !== 'all') {
      filtered = filtered.filter(roadmap => roadmap.category === activeCategory);
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(roadmap =>
        roadmap.title.toLowerCase().includes(query) ||
        roadmap.description.toLowerCase().includes(query)
      );
    }

    // 정렬
    switch (sortBy) {
      case 'newest':
        filtered = filtered.filter(r => r.isNew).concat(filtered.filter(r => !r.isNew));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.enrollCount - a.enrollCount);
        break;
    }

    return filtered;
  };

  const filteredRoadmaps = getFilteredRoadmaps();

  // 로딩 상태
  if (USE_API && isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
            <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              로드맵을 불러오는 중...
            </span>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  // 에러 상태
  if (USE_API && error) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="text-center py-20">
            <p className={`text-lg ${isDark ? 'text-red-400' : 'text-red-500'}`}>
              로드맵을 불러오는데 실패했습니다.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 landing-btn-primary rounded-full text-white"
            >
              다시 시도
            </button>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <LandingHeader />

      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4 ${
            isDark
              ? 'bg-gradient-to-r from-[#6778ff]/20 to-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30'
              : 'bg-gradient-to-r from-[#6778ff]/10 to-[#a855f7]/10 text-[#6778ff] border border-[#6778ff]/30'
          }`}>
            <Star className="w-4 h-4" />
            체계적인 학습 경로
          </span>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            커리어 <span className="gradient-text">로드맵</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            목표에 맞는 로드맵을 선택하고, 단계별로 학습하며 전문가로 성장하세요.
            <br />검증된 커리큘럼으로 효율적인 학습을 경험해보세요.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="로드맵 검색"
              className={`w-full rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6778ff] focus:border-transparent transition-all ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className={`rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6778ff] cursor-pointer ${
              isDark
                ? 'bg-white/5 border border-white/10 text-white'
                : 'bg-white border border-gray-200 text-gray-900'
            }`}
          >
            <option value="popular">인기순</option>
            <option value="newest">최신순</option>
            <option value="rating">평점순</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#6778ff] to-[#a855f7] text-white shadow-lg shadow-[#6778ff]/25'
                  : isDark
                    ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          총 <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{filteredRoadmaps.length}</span>개의 로드맵
        </p>

        {/* Roadmap Grid */}
        {filteredRoadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} isDark={isDark} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              검색 결과가 없습니다.
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className={`mt-20 text-center rounded-2xl p-12 border ${
          isDark
            ? 'glass border-white/10'
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            어떤 로드맵을 선택해야 할지 모르겠다면?
          </h2>
          <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            간단한 테스트로 나에게 맞는 로드맵을 추천받아보세요.
          </p>
          <button className="landing-btn-primary px-8 py-4 rounded-full text-white font-bold text-lg">
            로드맵 추천받기
          </button>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
