import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  HeroSection,
  LandingFooter,
} from '@/components/landing';
import { B2BLandingHeader } from './components/B2BLandingHeader';
import { B2BCourseCard } from './components/B2BCourseCard';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation } from '@/store/common/languageStore';
import { useCourseTimeCatalog, usePublicLayout } from '@/hooks/tu';
import { useTenantBranding } from '@/contexts/TenantBrandingContext';
import { useBrandingApply } from '@/hooks/tu/useBrandingApply';
import type { CourseTimeCatalogResponse } from '@/types/tu/courseTimeCatalog.types';
import { DELIVERY_TYPE_LABELS, PROGRAM_LEVEL_LABELS } from '@/types/tu/courseTimeCatalog.types';

interface CategoryOption {
  id: number | null;
  name: string;
  code: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: null, name: '전체', code: 'all' },
  { id: 1, name: '개발', code: 'dev' },
  { id: 2, name: 'AI', code: 'ai' },
  { id: 3, name: '데이터', code: 'data' },
  { id: 4, name: '디자인', code: 'design' },
  { id: 5, name: '비즈니스', code: 'business' },
  { id: 6, name: '마케팅', code: 'marketing' },
  { id: 7, name: '외국어', code: 'language' },
];

/**
 * CourseTime 데이터를 B2BCourseCard props로 변환
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
    category: courseTime.program?.categoryName ?? undefined,
    deliveryType: DELIVERY_TYPE_LABELS[courseTime.deliveryType] || courseTime.deliveryType,
    level: courseTime.program?.level ? PROGRAM_LEVEL_LABELS[courseTime.program.level] : undefined,
    studentCount: courseTime.currentEnrollment,
    classStartDate: courseTime.classStartDate,
    isOnDemand: courseTime.isOnDemand,
  };
}

/**
 * B2B 랜딩 페이지
 * - 가격 표시 없음
 * - 장바구니 없음
 * - 로드맵 섹션 없음
 * - 커뮤니티 없음
 */
export function B2BLandingPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const { branding } = useTenantBranding();

  useBrandingApply(branding);

  const { data: layoutData } = usePublicLayout();
  const landingPageSettings = layoutData?.landingPageSettings;
  const landingCategory = landingPageSettings?.landingCategory;

  const categoryOptions: CategoryOption[] = landingCategory?.enabled && landingCategory?.items?.length > 0
    ? [
        { id: null, name: '전체', code: 'all' },
        ...landingCategory.items.map((name, index) => ({
          id: index + 1,
          name,
          code: name.toLowerCase().replace(/\s+/g, '-'),
        })),
      ]
    : CATEGORY_OPTIONS;

  const { data: courseTimeData, isLoading: isCoursesLoading } = useCourseTimeCatalog({
    status: ['RECRUITING', 'ONGOING'],
    categoryId: activeCategoryId ?? undefined,
    size: 20,
    sort: 'createdAt,desc',
  });

  const courseTimes = courseTimeData?.content || [];
  const courses = courseTimes.map(convertCourseTimeToCardProps);

  const activeCategory = categoryOptions.find((c) => c.id === activeCategoryId);
  const filteredCourses = courses;

  const featuredCourses = courses.filter((c) => c.tags.includes('상시모집')).slice(0, 5);
  const recommendedCourses = featuredCourses.length > 0 ? featuredCourses : courses.slice(0, 5);

  return (
    <div className={`min-h-screen dark-scrollbar ${isDark ? 'landing-dark' : 'landing-light'}`}>
      {/* B2B 전용 헤더 (장바구니 링크 없음) */}
      <B2BLandingHeader />

      <main>
        <HeroSection />

        {/* Category Bar */}
        <div className="w-full px-6 md:px-12 lg:px-16 py-12">
          <div className="flex flex-wrap items-center gap-3">
            {categoryOptions.map((cat) => (
              <button
                key={cat.code}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    activeCategoryId === cat.id
                      ? 'landing-btn-primary shadow-lg'
                      : 'landing-chip-inactive'
                  }
                `}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 당신을 위한 필수 강의 */}
        <section className="w-full px-6 md:px-12 lg:px-16 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold landing-text-primary">
                {activeCategoryId === null
                  ? '당신을 위한 필수 강의'
                  : `${activeCategory?.name ?? ''} 필수 강의`}
              </h2>
              <p className="landing-text-muted text-sm mt-2">업무 역량 향상을 위한 핵심 강의를 확인해보세요</p>
            </div>
          </div>

          {isCoursesLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.slice(0, 10).map((course) => (
                  <B2BCourseCard key={course.id} {...course} />
                ))
              ) : (
                <p className="col-span-5 text-center landing-text-muted py-10">
                  {t.landing.noCoursesInCategory}
                </p>
              )}
            </div>
          )}
        </section>

        {/* 당신을 위한 추천 강의 */}
        <section className="landing-section-alt py-20">
          <div className="w-full px-6 md:px-12 lg:px-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold landing-text-primary">당신을 위한 추천 강의</h2>
                <p className="landing-text-muted text-sm mt-2">맞춤형 학습 경험을 위한 추천 강의입니다</p>
              </div>
            </div>

            {isCoursesLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {recommendedCourses.map((course) => (
                  <B2BCourseCard key={`rec-${course.id}`} {...course} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* B2B: 인기 강사 섹션 제외 */}
      </main>

      <LandingFooter />
    </div>
  );
}
