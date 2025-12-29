import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  LandingHeader,
  HeroSection,
  LandingCourseCard,
  LandingFooter,
  TagFilter,
  BannerCarousel,
  SortViewOptions,
  type Tag,
  type BannerItem,
  type SortOption,
  type ViewMode,
} from '@/components/landing';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation } from '@/store/common/languageStore';

// 테넌트 모드 타입 (실제로는 테넌트 설정에서 가져옴)
type TenantMode = 'B2C' | 'B2B';

// 카테고리 ID 목록 (B2C용)
const categoryIds = ['all', 'cloud', 'dev', 'ai', 'data', 'security', 'devops'] as const;

// B2B용 해시태그 (실제로는 API에서 가져옴)
const b2bTags: Tag[] = [
  { id: 'leadership', label: '리더십', count: 24 },
  { id: 'communication', label: '커뮤니케이션', count: 18 },
  { id: 'compliance', label: '컴플라이언스', count: 32 },
  { id: 'security', label: '보안교육', count: 15 },
  { id: 'onboarding', label: '신입사원', count: 21 },
  { id: 'digital', label: '디지털전환', count: 12 },
  { id: 'excel', label: 'Excel', count: 28 },
  { id: 'presentation', label: '프레젠테이션', count: 9 },
];

// B2B용 배너 (실제로는 TA가 관리하는 데이터)
const b2bBanners: BannerItem[] = [
  {
    id: '1',
    title: '2024년 필수 컴플라이언스 교육 안내',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
    hiddenTags: ['컴플라이언스', '필수교육'],
  },
  {
    id: '2',
    title: '신입사원 온보딩 프로그램',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop',
    hiddenTags: ['신입사원', '온보딩'],
  },
  {
    id: '3',
    title: '리더십 역량 강화 과정 오픈',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=400&fit=crop',
    hiddenTags: ['리더십', '매니저'],
  },
];

// B2B용 콘텐츠 (실제로는 API에서 가져옴)
const b2bContents = [
  {
    id: 101,
    title: '2024 정보보안 필수교육',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop',
    tags: ['보안교육', '필수'],
    contentType: 'VOD' as const,
    duration: 60,
    enrollmentCount: 1234,
  },
  {
    id: 102,
    title: '효과적인 비즈니스 커뮤니케이션',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    tags: ['커뮤니케이션', '소프트스킬'],
    contentType: 'VOD' as const,
    duration: 45,
    enrollmentCount: 892,
  },
  {
    id: 103,
    title: 'Excel 실무 활용 가이드',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    tags: ['Excel', '업무효율'],
    contentType: 'DOCUMENT' as const,
    duration: 30,
    enrollmentCount: 2156,
  },
  {
    id: 104,
    title: '신입사원 온보딩 필수 과정',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop',
    tags: ['신입사원', '온보딩'],
    contentType: 'VOD' as const,
    duration: 90,
    enrollmentCount: 567,
  },
  {
    id: 105,
    title: '리더를 위한 팀 매니지먼트',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=250&fit=crop',
    tags: ['리더십', '매니지먼트'],
    contentType: 'EBOOK' as const,
    duration: 120,
    enrollmentCount: 334,
  },
  {
    id: 106,
    title: '컴플라이언스 기초 교육',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop',
    tags: ['컴플라이언스', '필수'],
    contentType: 'VOD' as const,
    duration: 40,
    enrollmentCount: 3421,
  },
  {
    id: 107,
    title: '디지털 전환 시대의 업무 혁신',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop',
    tags: ['디지털전환', 'DX'],
    contentType: 'VOD' as const,
    duration: 55,
    enrollmentCount: 723,
  },
  {
    id: 108,
    title: '프레젠테이션 스킬 향상',
    image: 'https://images.unsplash.com/photo-1558403194-611308249627?w=400&h=250&fit=crop',
    tags: ['프레젠테이션', '소프트스킬'],
    contentType: 'VOD' as const,
    duration: 35,
    enrollmentCount: 445,
  },
];

const courses = [
  {
    id: 1,
    title: 'AWS 클라우드 실무 완벽 마스터',
    instructor: '김클라우드',
    price: '₩89,000',
    rating: 4.9,
    reviewCount: 1234,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    tags: ['NEW', '베스트'],
    category: 'cloud',
  },
  {
    id: 2,
    title: 'Azure 기초부터 실전까지',
    instructor: '이에저',
    price: '₩120,000',
    rating: 4.8,
    reviewCount: 892,
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop',
    tags: ['베스트'],
    category: 'cloud',
  },
  {
    id: 3,
    title: 'GCP로 배우는 클라우드 아키텍처',
    instructor: '박지씨피',
    price: '₩75,000',
    rating: 4.7,
    reviewCount: 2156,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
    tags: [],
    category: 'cloud',
  },
  {
    id: 4,
    title: 'Kubernetes 완전 정복',
    instructor: '최쿠버',
    price: '₩65,000',
    rating: 4.9,
    reviewCount: 567,
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop',
    tags: ['NEW'],
    category: 'devops',
  },
  {
    id: 5,
    title: 'ChatGPT API 활용 실무 프로젝트',
    instructor: '정에이아이',
    price: '₩55,000',
    rating: 4.6,
    reviewCount: 334,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    tags: ['할인중'],
    category: 'ai',
  },
  {
    id: 6,
    title: 'React & TypeScript 실전 가이드',
    instructor: '강리액트',
    price: '₩95,000',
    rating: 4.8,
    reviewCount: 723,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    tags: ['베스트'],
    category: 'dev',
  },
  {
    id: 7,
    title: '데이터 분석 with Python',
    instructor: '제임스킴',
    price: '₩45,000',
    rating: 4.5,
    reviewCount: 1567,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    tags: [],
    category: 'data',
  },
  {
    id: 8,
    title: '클라우드 보안 기초와 실전',
    instructor: '윤시큐리티',
    price: '₩110,000',
    rating: 4.9,
    reviewCount: 445,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=250&fit=crop',
    tags: ['NEW', '베스트'],
    category: 'security',
  },
  {
    id: 9,
    title: 'Docker 컨테이너 마스터',
    instructor: '한도커',
    price: '₩35,000',
    rating: 4.7,
    reviewCount: 2890,
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=250&fit=crop',
    tags: ['할인중'],
    category: 'devops',
  },
  {
    id: 10,
    title: 'Terraform으로 인프라 자동화',
    instructor: '오테라폼',
    price: '₩85,000',
    rating: 4.8,
    reviewCount: 678,
    image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=250&fit=crop',
    tags: ['베스트'],
    category: 'devops',
  },
];

/**
 * 랜딩 페이지 - B2C/B2B 겸용 LMS 메인
 * - B2C: 히어로 슬라이드 + 카테고리 칩 + 가격/별점 표시
 * - B2B: 이미지 배너 + 해시태그 필터 + 콘텐츠타입/수강인원 표시
 */
export function LandingPage() {
  // TODO: 실제로는 테넌트 설정에서 가져옴
  const tenantMode: TenantMode = 'B2B'; // 'B2C' | 'B2B'

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  // 카테고리 레이블을 번역으로 가져오기 (B2C)
  const getCategoryLabel = (id: string) => {
    return t.landing[id as keyof typeof t.landing] as string;
  };

  // B2C 필터링
  const filteredCourses =
    activeCategory === 'all'
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  const featuredCourses = courses.filter((c) => c.tags.includes('베스트')).slice(0, 5);
  const newCourses = courses.filter((c) => c.tags.includes('NEW')).slice(0, 5);

  // B2B 필터링 및 정렬
  const filteredB2BContents = (() => {
    let filtered =
      selectedTags.length === 0
        ? b2bContents
        : b2bContents.filter((content) =>
            content.tags.some((tag) => selectedTags.includes(tag))
          );

    // 정렬 적용
    switch (sortBy) {
      case 'popular':
        filtered = [...filtered].sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'latest':
      default:
        // 기본: id 역순 (최신순)
        filtered = [...filtered].sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  })();

  // B2B 모드 렌더링
  if (tenantMode === 'B2B') {
    return (
      <div className={`min-h-screen dark-scrollbar ${isDark ? 'landing-dark' : 'landing-light'}`}>
        <LandingHeader />

        <main>
          {/* Banner Carousel (TA 관리) */}
          <div className="w-full px-4 md:px-8 lg:px-16 pt-8">
            <BannerCarousel banners={b2bBanners} />
          </div>

          {/* Tag Filter (해시태그 스타일) */}
          <div className="w-full px-4 md:px-8 lg:px-16 py-8">
            <TagFilter
              tags={b2bTags}
              selectedTags={selectedTags}
              onTagChange={setSelectedTags}
              variant="HASHTAG"
              multiSelect
              showCount
            />
          </div>

          {/* 전체 콘텐츠 */}
          <section className="w-full px-4 md:px-8 lg:px-16 pb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold landing-text-primary">
                  {selectedTags.length > 0
                    ? `#${selectedTags.join(' #')} 관련 콘텐츠`
                    : '전체 콘텐츠'}
                </h2>
                <p className="landing-text-muted text-sm mt-1">
                  총 {filteredB2BContents.length}개의 학습 콘텐츠
                </p>
              </div>
              <div className="flex items-center gap-4">
                <SortViewOptions
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
                <a
                  href="/tu/catalog"
                  className="text-sm landing-text-secondary hover:opacity-80 flex items-center gap-1 transition-colors"
                >
                  {t.landing.viewAll} <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* 그리드 뷰 */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredB2BContents.map((content) => (
                  <LandingCourseCard
                    key={content.id}
                    id={content.id}
                    title={content.title}
                    image={content.image}
                    tags={content.tags}
                    contentType={content.contentType}
                    duration={content.duration}
                    enrollmentCount={content.enrollmentCount}
                    tagStyle="HASHTAG"
                  />
                ))}
              </div>
            )}

            {/* 리스트 뷰 */}
            {viewMode === 'list' && (
              <div className="flex flex-col gap-4">
                {filteredB2BContents.map((content) => (
                  <div
                    key={content.id}
                    className="flex gap-4 p-4 rounded-xl landing-card-bg border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={content.image}
                      alt={content.title}
                      className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold landing-text-primary truncate">
                        {content.title}
                      </h3>
                      <div className="flex gap-2 mt-2">
                        {content.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs landing-text-secondary"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-sm landing-text-muted">
                        <span>{content.contentType}</span>
                        <span>{content.duration}분</span>
                        <span>{content.enrollmentCount.toLocaleString()}명 수강</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredB2BContents.length === 0 && (
              <p className="text-center landing-text-muted py-10">
                선택한 태그에 해당하는 콘텐츠가 없습니다.
              </p>
            )}
          </section>

          {/* 필수 교육 섹션 */}
          <section className="landing-section-alt py-12">
            <div className="w-full px-4 md:px-8 lg:px-16">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold landing-text-primary">
                    📌 필수 교육
                  </h2>
                  <p className="landing-text-muted text-sm mt-1">
                    이번 달 완료해야 하는 필수 교육입니다
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {b2bContents
                  .filter((c) => c.tags.includes('필수'))
                  .map((content) => (
                    <LandingCourseCard
                      key={`required-${content.id}`}
                      id={content.id}
                      title={content.title}
                      image={content.image}
                      tags={content.tags}
                      contentType={content.contentType}
                      duration={content.duration}
                      enrollmentCount={content.enrollmentCount}
                      tagStyle="HASHTAG"
                    />
                  ))}
              </div>
            </div>
          </section>

          {/* 인기 콘텐츠 섹션 */}
          <section className="w-full px-4 md:px-8 lg:px-16 py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold landing-text-primary">
                  🔥 인기 콘텐츠
                </h2>
                <p className="landing-text-muted text-sm mt-1">
                  동료들이 가장 많이 수강한 콘텐츠
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...b2bContents]
                .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
                .slice(0, 4)
                .map((content) => (
                  <LandingCourseCard
                    key={`popular-${content.id}`}
                    id={content.id}
                    title={content.title}
                    image={content.image}
                    tags={content.tags}
                    contentType={content.contentType}
                    duration={content.duration}
                    enrollmentCount={content.enrollmentCount}
                    tagStyle="HASHTAG"
                  />
                ))}
            </div>
          </section>
        </main>

        <LandingFooter />
      </div>
    );
  }

  // B2C 모드 렌더링 (기존)
  return (
    <div className={`min-h-screen dark-scrollbar ${isDark ? 'landing-dark' : 'landing-light'}`}>
      <LandingHeader />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Search/Category Bar */}
        <div className="w-full px-4 md:px-8 lg:px-16 py-12">
          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center gap-3">
            {categoryIds.map((catId) => (
              <button
                key={catId}
                onClick={() => setActiveCategory(catId)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    activeCategory === catId
                      ? 'landing-btn-primary shadow-lg'
                      : 'landing-chip-inactive'
                  }
                `}
              >
                {getCategoryLabel(catId)}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Section 1: User's choice */}
        <section className="w-full px-4 md:px-8 lg:px-16 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold landing-text-primary">
                {activeCategory === 'all'
                  ? t.landing.featuredCourses
                  : `${getCategoryLabel(activeCategory)} ${t.landing.relatedCourses}`}
              </h2>
              <p className="landing-text-muted text-sm mt-2">{t.landing.featuredCoursesDesc}</p>
            </div>
            <a
              href="/tu/catalog"
              className="text-sm landing-text-secondary hover:opacity-80 flex items-center gap-1 transition-colors"
            >
              {t.landing.viewAll} <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => <LandingCourseCard key={course.id} {...course} />)
            ) : (
              <p className="col-span-5 text-center landing-text-muted py-10">
                {t.landing.noCoursesInCategory}
              </p>
            )}
          </div>
        </section>

        {/* Featured Section 2: New Arrivals */}
        <section className="landing-section-alt py-20">
          <div className="w-full px-4 md:px-8 lg:px-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold landing-text-primary">{t.landing.newCourses}</h2>
                <p className="landing-text-muted text-sm mt-2">{t.landing.newCoursesDesc}</p>
              </div>
              <a
                href="/tu/catalog"
                className="text-sm landing-text-secondary hover:opacity-80 flex items-center gap-1 transition-colors"
              >
                {t.landing.viewAll} <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {newCourses.map((course) => (
                <LandingCourseCard key={`new-${course.id}`} {...course} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Section 3: Recommendation */}
        <section className="w-full px-4 md:px-8 lg:px-16 py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold landing-text-primary">{t.landing.beginnerCourses}</h2>
              <p className="landing-text-muted text-sm mt-2">{t.landing.beginnerCoursesDesc}</p>
            </div>
            <a
              href="/tu/catalog"
              className="text-sm landing-text-secondary hover:opacity-80 flex items-center gap-1 transition-colors"
            >
              {t.landing.viewAll} <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredCourses.map((course) => (
              <LandingCourseCard key={`beg-${course.id}`} {...course} />
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
