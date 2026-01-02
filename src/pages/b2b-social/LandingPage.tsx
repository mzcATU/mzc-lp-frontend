import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  LandingHeader,
  LandingFooter,
  TagFilter,
  BannerCarousel,
  SortViewOptions,
  type Tag,
  type BannerItem,
  type SortOption,
  type ViewMode,
} from '@/components/landing';
import { LandingCourseCard } from '@/components/b2b-social';
import { useThemeStore } from '@/store/common/themeStore';

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

/**
 * B2B 소셜러닝 랜딩 페이지
 * - 이미지 배너 + 해시태그 필터 + 콘텐츠타입/수강인원 표시
 */
export function LandingPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

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
        filtered = [...filtered].sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  })();

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
            onTagSelect={(tagId) =>
              setSelectedTags((prev) =>
                prev.includes(tagId) ? prev : [...prev, tagId]
              )
            }
            onTagDeselect={(tagId) =>
              setSelectedTags((prev) => prev.filter((t) => t !== tagId))
            }
            onClearAll={() => setSelectedTags([])}
            style="HASHTAG"
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
                href="/b2b-social/catalog"
                className="text-sm landing-text-secondary hover:opacity-80 flex items-center gap-1 transition-colors"
              >
                전체보기 <ChevronRight className="w-4 h-4" />
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
                  필수 교육
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
                인기 콘텐츠
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
                />
              ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
