import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  LandingHeader,
  HeroSection,
  LandingCourseCard,
  LandingFooter,
} from '@/components/landing';
import { useThemeStore } from '@/store/common/themeStore';

// 정적 데이터
const categories = [
  { id: 'all', label: '전체' },
  { id: 'cloud', label: '클라우드' },
  { id: 'dev', label: '개발' },
  { id: 'ai', label: 'AI' },
  { id: 'data', label: '데이터' },
  { id: 'security', label: '보안' },
  { id: 'devops', label: 'DevOps' },
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
 * 랜딩 페이지 - 다크/라이트 테마 LMS 메인
 */
export function LandingPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

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
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    activeCategory === cat.id
                      ? 'landing-btn-primary shadow-lg'
                      : 'landing-chip-inactive'
                  }
                `}
              >
                {cat.label}
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
                  ? '지금 주목해야 할 강의'
                  : `${categories.find((c) => c.id === activeCategory)?.label} 관련 강의`}
              </h2>
              <p className="landing-text-muted text-sm mt-2">성장을 위한 최고의 선택</p>
            </div>
            <a
              href="/tu/catalog"
              className="text-sm landing-text-secondary hover:opacity-80 flex items-center gap-1 transition-colors"
            >
              전체보기 <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => <LandingCourseCard key={course.id} {...course} />)
            ) : (
              <p className="col-span-5 text-center landing-text-muted py-10">
                해당 카테고리에 강의가 없습니다.
              </p>
            )}
          </div>
        </section>

        {/* Featured Section 2: New Arrivals */}
        <section className="landing-section-alt py-20">
          <div className="w-full px-4 md:px-8 lg:px-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold landing-text-primary">따끈따끈 신규 강의</h2>
                <p className="landing-text-muted text-sm mt-2">매일 업데이트되는 새로운 배움</p>
              </div>
              <a
                href="/tu/catalog"
                className="text-sm landing-text-secondary hover:opacity-80 flex items-center gap-1 transition-colors"
              >
                전체보기 <ChevronRight className="w-4 h-4" />
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
              <h2 className="text-2xl md:text-3xl font-bold landing-text-primary">왕초보도 할 수 있어요</h2>
              <p className="landing-text-muted text-sm mt-2">시작이 반! 기초부터 탄탄하게</p>
            </div>
            <a
              href="/tu/catalog"
              className="text-sm landing-text-secondary hover:opacity-80 flex items-center gap-1 transition-colors"
            >
              전체보기 <ChevronRight className="w-4 h-4" />
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
