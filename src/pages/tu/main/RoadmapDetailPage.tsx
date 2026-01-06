import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Users,
  Eye,
  Star,
  ChevronRight,
  BookOpen,
  Target,
  CheckCircle2,
  PlayCircle,
  Lock,
  Tag,
  Loader2,
} from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useRoadmapDetail, useEnrollRoadmap } from '@/hooks/tu';
import type { RoadmapDetail, RoadmapCourse, RoadmapTab } from '@/types/tu';

/**
 * 개발용 더미 데이터
 * API 연동 전까지 사용하며, 연동 후에는 제거 가능
 */
const MOCK_ROADMAPS: Record<string, RoadmapDetail> = {
  '1': {
    id: 1,
    title: '프론트엔드 개발자 로드맵',
    description: 'HTML/CSS부터 React, Next.js까지 프론트엔드 개발의 모든 것',
    longDescription: '이 로드맵은 웹 개발의 기초부터 시작하여 현업에서 가장 많이 사용되는 React와 Next.js까지 체계적으로 학습할 수 있도록 구성되었습니다. 단순히 문법을 배우는 것이 아니라, 실제 프로젝트를 만들어보며 실무 역량을 키울 수 있습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    level: '입문',
    tags: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'CSS'],
    price: 299000,
    originalPrice: 450000,
    rating: 4.9,
    reviewCount: 567,
    participants: 2341,
    views: 15234,
    totalCourses: 8,
    totalHours: 120,
    whatYouLearn: [
      'HTML/CSS의 기초부터 고급 레이아웃 기법까지',
      'JavaScript ES6+ 문법과 비동기 프로그래밍',
      'React의 핵심 개념과 상태 관리',
      'TypeScript를 활용한 타입 안전한 개발',
      'Next.js로 SEO 최적화된 웹 애플리케이션 개발',
      '실무에서 사용하는 개발 도구와 워크플로우',
    ],
    requirements: [
      '기본적인 컴퓨터 활용 능력',
      '프로그래밍 경험이 없어도 괜찮습니다',
      '꾸준히 학습할 의지',
    ],
    targetAudience: [
      '프론트엔드 개발자로 취업을 준비하는 분',
      '백엔드 개발자로서 프론트엔드 역량을 키우고 싶은 분',
      '웹 개발을 처음 시작하는 비전공자',
      '체계적인 커리큘럼으로 학습하고 싶은 분',
    ],
    courses: [
      { id: 1, title: 'HTML/CSS 기초 마스터', instructorName: '김프론트', duration: '12시간', lectureCount: 45, thumbnailUrl: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=250&fit=crop', isFree: true, isCompleted: true, order: 1 },
      { id: 2, title: 'JavaScript 완벽 가이드', instructorName: '김프론트', duration: '20시간', lectureCount: 78, thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop', isFree: false, isCompleted: true, order: 2 },
      { id: 3, title: 'Git & GitHub 실전', instructorName: '이깃헙', duration: '8시간', lectureCount: 32, thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=250&fit=crop', isFree: true, isCompleted: false, order: 3 },
      { id: 4, title: 'React 기초부터 실전까지', instructorName: '김프론트', duration: '25시간', lectureCount: 92, thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop', isFree: false, isCompleted: false, order: 4 },
      { id: 5, title: 'TypeScript 핵심 정리', instructorName: '박타입', duration: '15시간', lectureCount: 56, thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop', isFree: false, isCompleted: false, order: 5 },
      { id: 6, title: 'React 상태 관리 (Redux, Zustand)', instructorName: '김프론트', duration: '12시간', lectureCount: 44, thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop', isFree: false, isCompleted: false, order: 6 },
      { id: 7, title: 'Next.js 14 완벽 마스터', instructorName: '김프론트', duration: '18시간', lectureCount: 65, thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', isFree: false, isCompleted: false, order: 7 },
      { id: 8, title: '프론트엔드 포트폴리오 프로젝트', instructorName: '김프론트', duration: '10시간', lectureCount: 28, thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop', isFree: false, isCompleted: false, order: 8 },
    ],
    author: {
      id: 1,
      name: '김프론트',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      bio: '네이버 시니어 프론트엔드 개발자 출신. 10년 이상의 웹 개발 경력을 보유하고 있으며, React와 Next.js 생태계의 전문가입니다.',
    },
    hasRefundPolicy: true,
    refundDays: 30,
  },
  '2': {
    id: 2,
    title: '백엔드 개발자 로드맵',
    description: 'Java/Spring부터 MSA까지 백엔드 개발의 모든 것',
    longDescription: 'Java 기초부터 Spring Boot, JPA, 그리고 마이크로서비스 아키텍처까지 체계적으로 학습합니다. 실무에서 바로 활용할 수 있는 역량을 갖출 수 있도록 구성되었습니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=450&fit=crop',
    level: '입문~중급',
    tags: ['Java', 'Spring', 'JPA', 'MySQL', 'Docker'],
    price: 349000,
    originalPrice: 520000,
    rating: 4.8,
    reviewCount: 423,
    participants: 1892,
    views: 12456,
    totalCourses: 10,
    totalHours: 150,
    whatYouLearn: [
      'Java 프로그래밍 기초와 객체지향 설계',
      'Spring Boot를 활용한 웹 애플리케이션 개발',
      'JPA와 QueryDSL을 활용한 데이터베이스 연동',
      'RESTful API 설계와 구현',
      'Docker와 Kubernetes 기초',
      '마이크로서비스 아키텍처 이해',
    ],
    requirements: [
      '기본적인 프로그래밍 개념 이해',
      '데이터베이스 기초 지식 (선택)',
    ],
    targetAudience: [
      '백엔드 개발자로 취업을 준비하는 분',
      '프론트엔드 개발자로서 백엔드 역량을 키우고 싶은 분',
      'Java 기반 웹 개발을 배우고 싶은 분',
    ],
    courses: [
      { id: 1, title: 'Java 기초 프로그래밍', instructorName: '이백엔드', duration: '15시간', lectureCount: 55, thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop', isFree: true, order: 1 },
      { id: 2, title: 'Java 객체지향 설계', instructorName: '이백엔드', duration: '12시간', lectureCount: 42, thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop', isFree: false, order: 2 },
      { id: 3, title: 'MySQL 데이터베이스', instructorName: '박디비', duration: '10시간', lectureCount: 38, thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop', isFree: false, order: 3 },
      { id: 4, title: 'Spring Boot 3.0 입문', instructorName: '이백엔드', duration: '18시간', lectureCount: 68, thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop', isFree: false, order: 4 },
      { id: 5, title: 'Spring Data JPA', instructorName: '이백엔드', duration: '14시간', lectureCount: 52, thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop', isFree: false, order: 5 },
    ],
    author: {
      id: 2,
      name: '이백엔드',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      bio: '카카오 시니어 백엔드 개발자. 대규모 트래픽을 처리하는 시스템 설계 전문가입니다.',
    },
    hasRefundPolicy: true,
    refundDays: 30,
  },
};

// 환경 설정: true면 API 사용, false면 더미 데이터 사용
const USE_API = false;

/**
 * 코스 카드 컴포넌트
 */
interface CourseCardProps {
  course: RoadmapCourse;
  index: number;
  isDark: boolean;
}

function CourseCard({ course, index, isDark }: CourseCardProps) {
  return (
    <div
      className={`rounded-xl p-4 border flex gap-4 transition-colors ${
        isDark
          ? 'glass border-white/10 hover:bg-white/5'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      } ${course.isCompleted ? 'opacity-75' : ''}`}
    >
      {/* Number */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        course.isCompleted
          ? 'bg-[#10b981] text-white'
          : isDark
            ? 'bg-white/10 text-gray-400'
            : 'bg-gray-100 text-gray-500'
      }`}>
        {course.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
      </div>

      {/* Image */}
      <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={course.thumbnailUrl || 'https://via.placeholder.com/128x80'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {!course.isFree && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {course.title}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {course.instructorName}
            </p>
          </div>
          {course.isFree && (
            <span className="px-2 py-1 rounded text-xs font-bold bg-[#10b981]/20 text-[#10b981]">
              무료
            </span>
          )}
        </div>
        <div className={`flex items-center gap-4 mt-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <PlayCircle className="w-4 h-4" />
            {course.lectureCount}개 강의
          </span>
        </div>
      </div>

      {/* Action */}
      <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        course.isCompleted
          ? isDark
            ? 'bg-white/10 text-gray-400'
            : 'bg-gray-100 text-gray-500'
          : 'landing-btn-primary text-white'
      }`}>
        {course.isCompleted ? '복습하기' : '학습하기'}
      </button>
    </div>
  );
}

export function RoadmapDetailPage() {
  const { id } = useParams<{ id: string }>();
  const roadmapId = id ? parseInt(id, 10) : 0;

  // React Query 훅 (API 사용 시)
  const {
    data: apiRoadmap,
    isLoading,
    error,
  } = useRoadmapDetail(roadmapId, USE_API);

  // 더미 데이터 또는 API 데이터 사용
  const roadmap: RoadmapDetail = USE_API
    ? apiRoadmap || MOCK_ROADMAPS['1']
    : (id && MOCK_ROADMAPS[id]) || MOCK_ROADMAPS['1'];

  const [activeTab, setActiveTab] = useState<RoadmapTab>('intro');
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Mutations
  const enrollRoadmapMutation = useEnrollRoadmap();

  const handleEnroll = async () => {
    if (USE_API) {
      try {
        await enrollRoadmapMutation.mutateAsync(roadmap.id);
        alert('로드맵 수강이 시작되었습니다.');
      } catch (err) {
        console.error('수강 신청 실패:', err);
      }
    } else {
      alert('로드맵 수강이 시작되었습니다. (데모)');
    }
  };

  const discountPercent = roadmap.discountRate || Math.round((1 - roadmap.price / roadmap.originalPrice) * 100);
  const completedCourses = roadmap.courses.filter(c => c.isCompleted).length;

  // 로딩 상태
  if (USE_API && isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
      </div>
    );
  }

  // 에러 상태
  if (USE_API && error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <div className="text-center">
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>로드맵을 불러올 수 없습니다.</p>
          <Link to="/tu/b2c/roadmaps" className="text-[#6778ff] hover:underline mt-4 inline-block">
            로드맵 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <LandingHeader />

      {/* Hero Section */}
      <div className={`py-12 ${isDark ? 'bg-gradient-to-b from-[#1a1a2e] to-[#1e1e1e]' : 'bg-gradient-to-b from-gray-100 to-gray-50'}`}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Image */}
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={roadmap.thumbnailUrl || 'https://via.placeholder.com/800x450'}
                  alt={roadmap.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#6778ff] to-[#a855f7] text-white">
                      {roadmap.level}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur text-white">
                      {roadmap.totalCourses}개 코스
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:w-1/2">
              {/* Breadcrumb */}
              <nav className={`flex items-center gap-2 text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Link to="/tu/b2c/roadmaps" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  로드맵
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{roadmap.title}</span>
              </nav>

              {/* Title */}
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {roadmap.title}
              </h1>

              {/* Description */}
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {roadmap.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {roadmap.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDark
                        ? 'bg-white/10 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className={`flex flex-wrap gap-6 mb-6 py-4 border-y ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{roadmap.rating}</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>({roadmap.reviewCount})</span>
                </div>
                <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Users className="w-5 h-5" />
                  <span>{roadmap.participants.toLocaleString()}명 참여</span>
                </div>
                <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Eye className="w-5 h-5" />
                  <span>{roadmap.views.toLocaleString()}회 조회</span>
                </div>
                <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Clock className="w-5 h-5" />
                  <span>총 {roadmap.totalHours}시간</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={roadmap.author.profileImage || 'https://via.placeholder.com/48'}
                  alt={roadmap.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{roadmap.author.name}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>로드맵 제작자</p>
                </div>
              </div>

              {/* Price Card */}
              <div className={`rounded-xl p-6 border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {roadmap.price.toLocaleString()}원
                  </span>
                  <span className={`text-lg line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {roadmap.originalPrice.toLocaleString()}원
                  </span>
                  <span className="text-[#6778ff] font-bold">{discountPercent}% 할인</span>
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={enrollRoadmapMutation.isPending}
                  className="w-full landing-btn-primary py-4 rounded-xl text-white font-bold text-lg mb-3 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {enrollRoadmapMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                  로드맵 시작하기
                </button>
                {roadmap.hasRefundPolicy && (
                  <p className={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {roadmap.refundDays}일 환불 보장
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`sticky top-16 z-40 border-b ${isDark ? 'bg-[#1e1e1e] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="flex gap-8">
            {[
              { id: 'intro' as RoadmapTab, label: '로드맵 소개' },
              { id: 'courses' as RoadmapTab, label: '코스 목록' },
              { id: 'reviews' as RoadmapTab, label: '수강평' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#6778ff] text-[#6778ff]'
                    : isDark
                      ? 'border-transparent text-gray-400 hover:text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1">
            {activeTab === 'intro' && (
              <>
                {/* About */}
                <section className="mb-12">
                  <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    로드맵 소개
                  </h2>
                  <div className={`rounded-xl p-6 border ${
                    isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                  }`}>
                    <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {roadmap.longDescription}
                    </p>
                  </div>
                </section>

                {/* What You'll Learn */}
                <section className="mb-12">
                  <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Target className="w-6 h-6 text-[#6778ff]" />
                    이런 걸 배워요
                  </h2>
                  <div className={`rounded-xl p-6 border ${
                    isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roadmap.whatYouLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Target Audience */}
                <section className="mb-12">
                  <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Users className="w-6 h-6 text-[#6778ff]" />
                    이런 분께 추천해요
                  </h2>
                  <div className={`rounded-xl p-6 border ${
                    isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                  }`}>
                    <ul className="space-y-3">
                      {roadmap.targetAudience.map((item, index) => (
                        <li key={index} className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div className="w-2 h-2 rounded-full bg-[#6778ff]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Requirements */}
                <section className="mb-12">
                  <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <BookOpen className="w-6 h-6 text-[#6778ff]" />
                    수강 전 필요한 것
                  </h2>
                  <div className={`rounded-xl p-6 border ${
                    isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                  }`}>
                    <ul className="space-y-3">
                      {roadmap.requirements.map((item, index) => (
                        <li key={index} className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div className="w-2 h-2 rounded-full bg-[#a855f7]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Author Info */}
                <section className="mb-12">
                  <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    제작자 소개
                  </h2>
                  <div className={`rounded-xl p-6 border ${
                    isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <img
                        src={roadmap.author.profileImage || 'https://via.placeholder.com/80'}
                        alt={roadmap.author.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {roadmap.author.name}
                        </h3>
                        <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {roadmap.author.bio}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'courses' && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    코스 목록
                  </h2>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    {completedCourses}/{roadmap.courses.length} 완료
                  </span>
                </div>

                {/* Progress Bar */}
                <div className={`mb-8 p-4 rounded-xl border ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      학습 진행률
                    </span>
                    <span className="text-sm text-[#6778ff] font-bold">
                      {Math.round((completedCourses / roadmap.courses.length) * 100)}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6778ff] to-[#a855f7]"
                      style={{ width: `${(completedCourses / roadmap.courses.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Course List */}
                <div className="space-y-4">
                  {roadmap.courses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'reviews' && (
              <section>
                <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  수강평
                </h2>
                <div className={`text-center py-20 rounded-xl border ${
                  isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                }`}>
                  <Star className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    아직 수강평이 없습니다
                  </h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    이 로드맵의 첫 번째 수강평을 작성해보세요!
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar - Sticky */}
          <div className="lg:w-80 hidden lg:block">
            <div className={`sticky top-32 rounded-xl p-6 border ${
              isDark ? 'glass border-white/10' : 'bg-white border-gray-200 shadow-lg'
            }`}>
              <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                로드맵 구성
              </h3>
              <div className="space-y-3 mb-6">
                <div className={`flex justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>총 코스</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {roadmap.totalCourses}개
                  </span>
                </div>
                <div className={`flex justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>총 학습 시간</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {roadmap.totalHours}시간
                  </span>
                </div>
                <div className={`flex justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>난이도</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {roadmap.level}
                  </span>
                </div>
                <div className={`flex justify-between text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span>수강생</span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {roadmap.participants.toLocaleString()}명
                  </span>
                </div>
              </div>

              <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-[#6778ff]" />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    로드맵 할인 쿠폰
                  </span>
                </div>
                <div className={`p-3 rounded-lg text-center ${
                  isDark ? 'bg-[#6778ff]/10' : 'bg-[#6778ff]/5'
                }`}>
                  <span className="text-[#6778ff] font-bold">{discountPercent}% 할인</span>
                  <span className={`text-sm ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    적용 중
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
