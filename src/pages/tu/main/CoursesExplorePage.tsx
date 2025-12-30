import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, Loader2 } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useCourseExplore, useCourseCategories } from '@/hooks/tu';
import type { CourseExploreItem, ExploreCourseCategory } from '@/types/tu';

// 환경 설정: true면 API 사용, false면 더미 데이터 사용
const USE_API = false;

// 더미 카테고리 데이터
const MOCK_CATEGORIES: ExploreCourseCategory[] = [
  { id: 'all', name: '전체', count: 12 },
  { id: 'dev', name: '개발', count: 4 },
  { id: 'ai', name: 'AI', count: 2 },
  { id: 'data', name: '데이터', count: 1 },
  { id: 'design', name: '디자인', count: 2 },
  { id: 'business', name: '비즈니스', count: 1 },
  { id: 'marketing', name: '마케팅', count: 1 },
  { id: 'language', name: '외국어', count: 1 },
];

// 더미 강의 데이터
const MOCK_COURSES: CourseExploreItem[] = [
  {
    id: 1,
    title: '실전! Next.js 15 완벽 마스터',
    instructor: '김개발',
    originalPrice: 129000,
    price: 89000,
    rating: 4.9,
    reviewCount: 1234,
    studentCount: 5678,
    totalHours: 32,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    tags: ['NEW', '할인중'],
    category: 'dev',
    level: 'intermediate',
    discount: 31,
    isNew: true,
  },
  {
    id: 2,
    title: 'ChatGPT API 활용 실무 프로젝트',
    instructor: '이에이아이',
    originalPrice: 120000,
    price: 120000,
    rating: 4.8,
    reviewCount: 892,
    studentCount: 3421,
    totalHours: 28,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    tags: ['베스트'],
    category: 'ai',
    level: 'intermediate',
    discount: 0,
    isBestseller: true,
  },
  {
    id: 3,
    title: '데이터 분석 with Python',
    instructor: '박데이터',
    originalPrice: 75000,
    price: 75000,
    rating: 4.7,
    reviewCount: 2156,
    studentCount: 8765,
    totalHours: 24,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    tags: [],
    category: 'data',
    level: 'beginner',
    discount: 0,
  },
  {
    id: 4,
    title: 'Figma 마스터 클래스',
    instructor: '최디자인',
    originalPrice: 65000,
    price: 65000,
    rating: 4.9,
    reviewCount: 567,
    studentCount: 2341,
    totalHours: 18,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    tags: ['NEW'],
    category: 'design',
    level: 'beginner',
    discount: 0,
    isNew: true,
  },
  {
    id: 5,
    title: '스타트업 마케팅 A to Z',
    instructor: '정마케팅',
    originalPrice: 65000,
    price: 55000,
    rating: 4.6,
    reviewCount: 334,
    studentCount: 1234,
    totalHours: 15,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    tags: ['할인중'],
    category: 'marketing',
    level: 'beginner',
    discount: 15,
  },
  {
    id: 6,
    title: 'React Native로 앱 만들기',
    instructor: '강모바일',
    originalPrice: 95000,
    price: 95000,
    rating: 4.8,
    reviewCount: 723,
    studentCount: 2876,
    totalHours: 26,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
    tags: ['베스트'],
    category: 'dev',
    level: 'intermediate',
    discount: 0,
    isBestseller: true,
  },
  {
    id: 7,
    title: '비즈니스 영어 회화',
    instructor: '제임스킴',
    originalPrice: 45000,
    price: 45000,
    rating: 4.5,
    reviewCount: 1567,
    studentCount: 4532,
    totalHours: 20,
    image: 'https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=400&h=250&fit=crop',
    tags: [],
    category: 'language',
    level: 'beginner',
    discount: 0,
  },
  {
    id: 8,
    title: 'AWS 클라우드 실무',
    instructor: '윤클라우드',
    originalPrice: 110000,
    price: 110000,
    rating: 4.9,
    reviewCount: 445,
    studentCount: 1987,
    totalHours: 30,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    tags: ['NEW', '베스트'],
    category: 'dev',
    level: 'advanced',
    discount: 0,
    isNew: true,
    isBestseller: true,
  },
  {
    id: 9,
    title: '엑셀 업무 자동화',
    instructor: '한비즈',
    originalPrice: 45000,
    price: 35000,
    rating: 4.7,
    reviewCount: 2890,
    studentCount: 9876,
    totalHours: 12,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
    tags: ['할인중'],
    category: 'business',
    level: 'beginner',
    discount: 22,
  },
  {
    id: 10,
    title: 'UI/UX 디자인 시스템',
    instructor: '오유엑스',
    originalPrice: 85000,
    price: 85000,
    rating: 4.8,
    reviewCount: 678,
    studentCount: 2345,
    totalHours: 22,
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=250&fit=crop',
    tags: ['베스트'],
    category: 'design',
    level: 'intermediate',
    discount: 0,
    isBestseller: true,
  },
  {
    id: 11,
    title: 'Spring Boot 3.0 실전',
    instructor: '김스프링',
    originalPrice: 99000,
    price: 99000,
    rating: 4.9,
    reviewCount: 1023,
    studentCount: 3456,
    totalHours: 35,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
    tags: ['NEW'],
    category: 'dev',
    level: 'intermediate',
    discount: 0,
    isNew: true,
  },
  {
    id: 12,
    title: '딥러닝 기초부터 실전까지',
    instructor: '이딥러닝',
    originalPrice: 150000,
    price: 150000,
    rating: 4.8,
    reviewCount: 567,
    studentCount: 1876,
    totalHours: 40,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop',
    tags: ['베스트'],
    category: 'ai',
    level: 'advanced',
    discount: 0,
    isBestseller: true,
  },
];

interface CourseCardProps {
  course: CourseExploreItem;
  isDark: boolean;
}

function CourseCard({ course, isDark }: CourseCardProps) {
  const tags: string[] = [];
  if (course.isNew) tags.push('NEW');
  if (course.isBestseller) tags.push('베스트');
  if (course.discount > 0) tags.push('할인중');

  return (
    <Link to={`/tu/main/courses/${course.id}`} className="group block h-full">
      <div className={`h-full card-hover rounded-xl overflow-hidden border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-gray-200 shadow-sm'
      }`}>
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {tags.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg ${
                    tag === 'NEW'
                      ? 'bg-gradient-to-r from-[#70f2a0] to-[#6bc2f0]'
                      : tag === '베스트'
                      ? 'bg-gradient-to-r from-[#6778ff] to-[#a855f7]'
                      : 'bg-gradient-to-r from-[#ff7867] to-[#ff9a5a]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className={`font-bold line-clamp-2 text-[15px] transition-colors h-11 ${
            isDark
              ? 'text-white group-hover:text-[#6bc2f0]'
              : 'text-gray-900 group-hover:text-[#6778ff]'
          }`}>
            {course.title}
          </h3>

          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {course.instructor}
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(course.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : isDark ? 'text-gray-600' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{course.rating}</span>
            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              ({course.reviewCount.toLocaleString()})
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className={`font-bold text-lg ${isDark ? 'text-[#6bc2f0]' : 'text-[#4C2D9A]'}`}>
              ₩{course.price.toLocaleString()}
            </span>
            <div className="flex gap-1.5">
              <span className={`text-[10px] px-2 py-1 rounded-full ${
                isDark
                  ? 'bg-white/10 text-gray-400'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                +{course.studentCount > 100 ? '100' : course.studentCount}명
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CoursesExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating' | 'price_low' | 'price_high'>('popular');
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // React Query 훅 (API 모드일 때만 활성화)
  const filter = {
    search: searchQuery || undefined,
    category: activeCategory !== 'all' ? activeCategory : undefined,
    sortBy,
  };
  const { data: apiCourseData, isLoading, error } = useCourseExplore(filter, USE_API);
  const { data: apiCategoryData } = useCourseCategories(USE_API);

  // 실제 사용할 데이터 결정
  const categories = USE_API ? (apiCategoryData?.categories || []) : MOCK_CATEGORIES;

  // Mock 모드에서 필터링 및 정렬 적용
  const getFilteredCourses = (): CourseExploreItem[] => {
    if (USE_API) {
      return apiCourseData?.courses || [];
    }

    let filtered = [...MOCK_COURSES];

    // 카테고리 필터
    if (activeCategory !== 'all') {
      filtered = filtered.filter(course => course.category === activeCategory);
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query)
      );
    }

    // 정렬
    switch (sortBy) {
      case 'newest':
        filtered = filtered.filter(c => c.isNew).concat(filtered.filter(c => !c.isNew));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.studentCount - a.studentCount);
        break;
    }

    return filtered;
  };

  const filteredCourses = getFilteredCourses();

  // URL에서 검색어와 카테고리 가져오기
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    if (search) {
      setSearchQuery(search);
    }
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  // 검색어 변경 시 URL 업데이트
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  // 로딩 상태
  if (USE_API && isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
            <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              강의를 불러오는 중...
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
              강의를 불러오는데 실패했습니다.
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
        {/* Page Title */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            전체 강의
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            원하는 강의를 찾아보세요
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="강의명, 강사명으로 검색"
              className={`w-full rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#6778ff] focus:border-transparent transition-all ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
          <div className="flex gap-3">
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
              <option value="price_low">가격 낮은순</option>
              <option value="price_high">가격 높은순</option>
            </select>
            <button className={`flex items-center gap-2 rounded-xl px-4 py-3 transition-colors ${
              isDark
                ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'
            }`}>
              <SlidersHorizontal className="w-5 h-5" />
              필터
            </button>
          </div>
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
          총 <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{filteredCourses.length}</span>개의 강의
        </p>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} isDark={isDark} />
            ))
          ) : (
            <p className={`col-span-full text-center py-20 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
