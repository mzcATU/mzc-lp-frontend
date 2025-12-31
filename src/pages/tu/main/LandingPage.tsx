import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, ArrowRight, Loader2 } from 'lucide-react';
import {
  LandingHeader,
  HeroSection,
  LandingCourseCard,
  LandingFooter,
} from '@/components/landing';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation } from '@/store/common/languageStore';
import { usePopularInstructors } from '@/hooks/tu';
import type { InstructorSummary } from '@/types/tu';

// API 사용 여부 플래그 (백엔드 연동 시 true로 변경)
const USE_API = false;

// 더미 인기 강사 데이터
const dummyPopularInstructors: InstructorSummary[] = [
  {
    id: 1,
    name: '김클라우드',
    slug: 'kim-cloud',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    specialty: 'AWS / 클라우드 아키텍처',
    studentCount: 15420,
    courseCount: 8,
    rating: 4.9,
    description: 'AWS 공인 솔루션스 아키텍트. 10년간 엔터프라이즈 클라우드 구축 경험',
  },
  {
    id: 2,
    name: '이에이아이',
    slug: 'lee-ai',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    specialty: 'AI / 머신러닝',
    studentCount: 12350,
    courseCount: 6,
    rating: 4.8,
    description: 'OpenAI 공식 파트너사 AI 엔지니어. GPT, LLM 전문가',
  },
  {
    id: 3,
    name: '강리액트',
    slug: 'kang-react',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    specialty: 'React / TypeScript',
    studentCount: 18900,
    courseCount: 12,
    rating: 4.9,
    description: '네이버 시니어 프론트엔드 개발자 출신. React 생태계 전문가',
  },
  {
    id: 4,
    name: '박데이터',
    slug: 'park-data',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
    specialty: '데이터 분석 / Python',
    studentCount: 9870,
    courseCount: 5,
    rating: 4.7,
    description: '카카오 데이터 사이언티스트 출신. 실무 데이터 분석 전문',
  },
];

// 카테고리 ID 목록
const categoryIds = ['all', 'cloud', 'dev', 'ai', 'data', 'security', 'devops'] as const;

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
 * 랜딩 페이지 - 다크/라이트 테마 LMS 메인
 */
export function LandingPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  // 인기 강사 데이터 로드
  const { data: instructorsData, isLoading: isInstructorsLoading } = usePopularInstructors(4, USE_API);
  const popularInstructors = USE_API ? (instructorsData?.instructors ?? []) : dummyPopularInstructors;

  // 카테고리 레이블을 번역으로 가져오기
  const getCategoryLabel = (id: string) => {
    return t.landing[id as keyof typeof t.landing] as string;
  };

  const filteredCourses =
    activeCategory === 'all'
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  const featuredCourses = courses.filter((c) => c.tags.includes('베스트')).slice(0, 5);
  const newCourses = courses.filter((c) => c.tags.includes('NEW')).slice(0, 5);

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

        {/* Popular Instructors Section */}
        <section className="landing-section-alt py-20">
          <div className="w-full px-4 md:px-8 lg:px-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold landing-text-primary">
                  인기 강사
                </h2>
                <p className="landing-text-muted text-sm mt-2">
                  수강생들이 가장 많이 찾는 검증된 전문가들을 만나보세요
                </p>
              </div>
            </div>

            {isInstructorsLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularInstructors.map((instructor) => (
                <Link
                  key={instructor.id}
                  to={`/tu/instructors/${instructor.id}`}
                  className={`group block rounded-2xl p-6 transition-all duration-300 border ${
                    isDark
                      ? 'glass border-white/10 hover:border-[#6778ff]/50'
                      : 'bg-white border-gray-200 hover:border-[#6778ff] hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={instructor.profileImage}
                      alt={instructor.name}
                      className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-white/20 group-hover:ring-[#6778ff]/30 transition-all"
                    />
                    <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {instructor.name}
                    </h3>
                    <p className="text-[#6778ff] text-sm font-medium mb-2">
                      {instructor.specialty}
                    </p>
                    <p className={`text-xs mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {instructor.description}
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {instructor.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <div className="text-center">
                        <span className={`font-semibold block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {instructor.studentCount.toLocaleString()}
                        </span>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>수강생</p>
                      </div>
                      <div className="text-center">
                        <span className={`font-semibold block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {instructor.courseCount}
                        </span>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>강의</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* Become Instructor CTA Section */}
        <section className="w-full px-4 md:px-8 lg:px-16 py-20">
          <div className={`relative overflow-hidden rounded-3xl ${
            isDark
              ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]'
              : 'bg-gradient-to-br from-[#6778ff] via-[#8b5cf6] to-[#6366f1]'
          }`}>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                  당신의 지식을 나누어 보세요
                </h2>
                <p className="text-white/80 text-lg max-w-xl">
                  전문 지식을 가진 분들을 위한 강사 프로그램에 참여하세요.
                  수천 명의 수강생들에게 영감을 주고, 수익도 창출하세요.
                </p>
              </div>
              <Link
                to="/mypage/teaching"
                className="flex items-center gap-2 px-8 py-4 bg-white text-[#6778ff] font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                강사 시작하기
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
