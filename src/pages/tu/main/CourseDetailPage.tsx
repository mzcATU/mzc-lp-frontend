import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Star, Clock, Users, PlayCircle, FileText, Award, ShoppingCart, Heart, Share2, ChevronDown, ChevronRight, Check, Loader2 } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useCourseDetail, useAddToWishlist, useRemoveFromWishlist, useAddToCart } from '@/hooks/tu';
import type { CourseDetail, CurriculumSection, CourseCategory, CourseTag } from '@/types/tu';
import { CATEGORY_LABELS, TAG_STYLES } from '@/types/tu';

/**
 * 개발용 더미 데이터
 * API 연동 전까지 사용하며, 연동 후에는 제거 가능
 */
const MOCK_COURSES: Record<string, CourseDetail> = {
  '1': {
    id: 1,
    title: '실전! Next.js 15 완벽 마스터',
    description: 'Next.js 15의 새로운 기능부터 실무에서 바로 활용할 수 있는 프로젝트까지! App Router, Server Components, Server Actions 등 최신 기술을 완벽하게 마스터하세요.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    category: 'dev',
    tags: ['NEW', '할인중'],
    price: 89000,
    originalPrice: 129000,
    rating: 4.9,
    reviewCount: 1234,
    studentCount: 5678,
    totalHours: 32,
    totalLectures: 156,
    level: '중급',
    lastUpdated: '2024년 11월',
    whatYouLearn: [
      'Next.js 15의 핵심 개념과 새로운 기능 완벽 이해',
      'App Router를 활용한 모던 라우팅 구현',
      'Server Components와 Client Components 효율적 활용',
      'Server Actions로 폼 처리 및 데이터 뮤테이션',
      '실무 프로젝트를 통한 포트폴리오 완성',
      'Vercel 배포 및 최적화 전략',
    ],
    requirements: [
      'React 기초 지식 (useState, useEffect 등)',
      'JavaScript/TypeScript 기본 문법',
      'HTML/CSS 기초',
    ],
    curriculum: [
      {
        id: 1,
        title: '섹션 1: Next.js 15 소개',
        lectures: [
          { id: 1, title: '강의 소개 및 학습 목표', duration: '5:30', isPreview: true },
          { id: 2, title: 'Next.js 15의 새로운 기능 살펴보기', duration: '12:45', isPreview: true },
          { id: 3, title: '개발 환경 설정하기', duration: '8:20', isPreview: false },
        ],
      },
      {
        id: 2,
        title: '섹션 2: App Router 기초',
        lectures: [
          { id: 4, title: 'App Router vs Pages Router', duration: '15:00', isPreview: false },
          { id: 5, title: '파일 기반 라우팅 이해하기', duration: '18:30', isPreview: false },
          { id: 6, title: '레이아웃과 템플릿', duration: '20:15', isPreview: false },
          { id: 7, title: '로딩과 에러 처리', duration: '14:50', isPreview: false },
        ],
      },
      {
        id: 3,
        title: '섹션 3: Server Components',
        lectures: [
          { id: 8, title: 'Server Components란?', duration: '16:40', isPreview: false },
          { id: 9, title: 'Client Components와의 차이점', duration: '12:20', isPreview: false },
          { id: 10, title: '데이터 페칭 패턴', duration: '22:10', isPreview: false },
        ],
      },
      {
        id: 4,
        title: '섹션 4: 실전 프로젝트',
        lectures: [
          { id: 11, title: '프로젝트 소개 및 설계', duration: '10:00', isPreview: false },
          { id: 12, title: '인증 시스템 구현', duration: '45:30', isPreview: false },
          { id: 13, title: 'CRUD 기능 구현', duration: '38:20', isPreview: false },
          { id: 14, title: '배포 및 최적화', duration: '25:00', isPreview: false },
        ],
      },
    ],
    instructor: {
      id: 1,
      name: '김개발',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      bio: '네이버 시니어 프론트엔드 개발자 출신. 10년 이상의 웹 개발 경력을 보유하고 있으며, React와 Next.js 생태계의 전문가입니다.',
    },
    hasCertificate: true,
    isLifetimeAccess: true,
  },
  '2': {
    id: 2,
    title: 'ChatGPT API 활용 실무 프로젝트',
    description: 'ChatGPT API를 활용하여 실제 서비스를 만들어보는 실전 프로젝트 강의입니다. 프롬프트 엔지니어링부터 RAG, Fine-tuning까지 AI 서비스 개발의 모든 것을 배웁니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    category: 'ai',
    tags: ['베스트'],
    price: 120000,
    originalPrice: 150000,
    rating: 4.8,
    reviewCount: 892,
    studentCount: 3421,
    totalHours: 28,
    totalLectures: 98,
    level: '중급',
    lastUpdated: '2024년 10월',
    whatYouLearn: [
      'ChatGPT API 기초부터 고급 활용법',
      '효과적인 프롬프트 엔지니어링',
      'RAG(Retrieval-Augmented Generation) 구현',
      'Fine-tuning으로 커스텀 모델 만들기',
      '실제 AI 서비스 배포하기',
    ],
    requirements: [
      'Python 기초 문법',
      'REST API 개념 이해',
      'OpenAI API 키 (유료)',
    ],
    curriculum: [
      {
        id: 1,
        title: '섹션 1: OpenAI API 시작하기',
        lectures: [
          { id: 1, title: 'OpenAI API 소개', duration: '8:00', isPreview: true },
          { id: 2, title: 'API 키 발급 및 설정', duration: '6:30', isPreview: true },
          { id: 3, title: '첫 번째 API 호출', duration: '12:00', isPreview: false },
        ],
      },
      {
        id: 2,
        title: '섹션 2: 프롬프트 엔지니어링',
        lectures: [
          { id: 4, title: '프롬프트 설계 원칙', duration: '20:00', isPreview: false },
          { id: 5, title: 'Few-shot Learning 활용', duration: '18:00', isPreview: false },
          { id: 6, title: 'Chain of Thought 기법', duration: '15:00', isPreview: false },
        ],
      },
    ],
    instructor: {
      id: 2,
      name: '이에이아이',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      bio: 'OpenAI 공식 파트너사 AI 엔지니어. GPT-4, DALL-E 등 최신 AI 기술을 활용한 다양한 프로젝트 경험 보유.',
    },
    hasCertificate: true,
    isLifetimeAccess: true,
  },
  '3': {
    id: 3,
    title: 'AWS 클라우드 실무',
    description: 'AWS의 핵심 서비스부터 실무에서 자주 사용하는 아키텍처 패턴까지! EC2, S3, Lambda, RDS 등을 활용한 실전 프로젝트를 진행합니다.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    category: 'cloud',
    tags: ['인기'],
    price: 110000,
    originalPrice: 130000,
    rating: 4.7,
    reviewCount: 567,
    studentCount: 2341,
    totalHours: 24,
    totalLectures: 85,
    level: '초급~중급',
    lastUpdated: '2024년 9월',
    whatYouLearn: [
      'AWS 핵심 서비스 완벽 이해',
      'EC2, S3, RDS 실전 활용법',
      'Lambda와 API Gateway로 서버리스 구현',
      'CloudFormation으로 IaC 실습',
      '비용 최적화 전략',
    ],
    requirements: [
      '리눅스 기초 명령어',
      '네트워크 기본 개념',
      'AWS 프리티어 계정',
    ],
    curriculum: [
      {
        id: 1,
        title: '섹션 1: AWS 시작하기',
        lectures: [
          { id: 1, title: 'AWS 소개 및 계정 설정', duration: '10:00', isPreview: true },
          { id: 2, title: 'IAM 사용자 및 권한 관리', duration: '15:00', isPreview: true },
          { id: 3, title: 'AWS CLI 설정', duration: '8:00', isPreview: false },
        ],
      },
      {
        id: 2,
        title: '섹션 2: 컴퓨팅 서비스',
        lectures: [
          { id: 4, title: 'EC2 인스턴스 생성', duration: '20:00', isPreview: false },
          { id: 5, title: '보안 그룹 설정', duration: '12:00', isPreview: false },
          { id: 6, title: 'Auto Scaling 구성', duration: '25:00', isPreview: false },
        ],
      },
    ],
    instructor: {
      id: 3,
      name: '윤클라우드',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      bio: 'AWS Solutions Architect Professional 자격 보유. 대규모 클라우드 인프라 설계 및 운영 전문가.',
    },
    hasCertificate: true,
    isLifetimeAccess: true,
  },
};

// 환경 설정: true면 API 사용, false면 더미 데이터 사용
const USE_API = false;

/**
 * 커리큘럼 섹션 컴포넌트
 */
interface CurriculumSectionProps {
  section: CurriculumSection;
  sectionIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
}

function CurriculumSectionItem({ section, sectionIndex, isExpanded, onToggle, isDark }: CurriculumSectionProps) {
  return (
    <div className={`rounded-xl overflow-hidden border ${
      isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
    }`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 transition-colors ${
          isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            } ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {section.title}
          </span>
        </div>
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {section.lectures.length}개 강의
        </span>
      </button>
      {isExpanded && (
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          {section.lectures.map((lecture) => (
            <div
              key={lecture.id}
              className={`flex items-center justify-between p-4 pl-12 transition-colors ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <PlayCircle className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{lecture.title}</span>
                {lecture.isPreview && (
                  <span className="px-2 py-0.5 bg-[#6778ff]/20 text-[#6778ff] text-xs rounded">
                    미리보기
                  </span>
                )}
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {lecture.duration}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const courseId = id ? parseInt(id, 10) : 0;

  // React Query 훅 (API 사용 시)
  const {
    data: apiCourse,
    isLoading,
    error,
  } = useCourseDetail(courseId, USE_API);

  // 더미 데이터 또는 API 데이터 사용
  const course: CourseDetail = USE_API
    ? apiCourse || MOCK_COURSES['1']
    : (id && MOCK_COURSES[id]) || MOCK_COURSES['1'];

  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Mutations
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const toggleSection = (index: number) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter(i => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
  };

  const handleWishlistToggle = async () => {
    if (USE_API) {
      try {
        if (isWishlisted) {
          await removeFromWishlistMutation.mutateAsync(course.id);
        } else {
          await addToWishlistMutation.mutateAsync(course.id);
        }
        setIsWishlisted(!isWishlisted);
      } catch (err) {
        console.error('찜하기 실패:', err);
      }
    } else {
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleAddToCart = async () => {
    if (USE_API) {
      try {
        await addToCartMutation.mutateAsync(course.id);
        alert('장바구니에 추가되었습니다.');
      } catch (err) {
        console.error('장바구니 추가 실패:', err);
      }
    } else {
      alert('장바구니에 추가되었습니다. (데모)');
    }
  };

  const discountPercent = course.discountRate || Math.round((1 - course.price / course.originalPrice) * 100);

  const getCategoryLabel = (category: CourseCategory): string => {
    return CATEGORY_LABELS[category] || category;
  };

  const getTagStyle = (tag: string) => {
    const style = TAG_STYLES[tag as CourseTag];
    if (style) return `${style.bg} ${style.text}`;
    return 'bg-[#10b981]/20 text-[#10b981]';
  };

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
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>강의를 불러올 수 없습니다.</p>
          <Link to="/tu/main/courses" className="text-[#6778ff] hover:underline mt-4 inline-block">
            강의 목록으로 돌아가기
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
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            {/* Left Content */}
            <div className="flex-1">
              {/* Breadcrumb */}
              <nav className={`flex items-center gap-2 text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Link to="/tu/main/courses" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}>
                  강의
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link
                  to={`/tu/main/courses?category=${course.category}`}
                  className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
                >
                  {getCategoryLabel(course.category)}
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{course.title}</span>
              </nav>

              {/* Tags */}
              <div className="flex gap-2 mb-4">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getTagStyle(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {course.title}
              </h1>

              {/* Description */}
              <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{course.rating}</span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    ({course.reviewCount.toLocaleString()}개 리뷰)
                  </span>
                </div>
                <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Users className="w-5 h-5" />
                  <span>{course.studentCount.toLocaleString()}명 수강</span>
                </div>
                <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Clock className="w-5 h-5" />
                  <span>총 {course.totalHours}시간</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={course.instructor.profileImage || 'https://via.placeholder.com/48'}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{course.instructor.name}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>강사</p>
                </div>
              </div>

              {/* Promo Video */}
              <div className={`rounded-xl overflow-hidden border ${
                isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
              }`}>
                <div className="relative aspect-video bg-black/50 flex items-center justify-center group cursor-pointer">
                  <img
                    src={course.thumbnailUrl || 'https://via.placeholder.com/800x450'}
                    alt="강의 프로모션 영상"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <button className="relative z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300">
                    <PlayCircle className="w-10 h-10 text-white fill-white/20" />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <p className="text-white font-medium mb-1">강의 소개 영상</p>
                    <p className="text-gray-300 text-sm">이 강의가 어떤 내용인지 미리 확인해보세요</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Course Card */}
            <div className="lg:w-96">
              <div className={`rounded-2xl overflow-hidden sticky top-24 border ${
                isDark ? 'glass border-white/10' : 'bg-white border-gray-200 shadow-lg'
              }`}>
                <img
                  src={course.thumbnailUrl || 'https://via.placeholder.com/384x216'}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-6">
                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {course.price.toLocaleString()}원
                    </span>
                    {discountPercent > 0 && (
                      <>
                        <span className={`text-lg line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {course.originalPrice.toLocaleString()}원
                        </span>
                        <span className="text-[#6778ff] font-bold">{discountPercent}% 할인</span>
                      </>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={addToCartMutation.isPending}
                      className="w-full landing-btn-primary py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {addToCartMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-5 h-5" />
                      )}
                      장바구니 담기
                    </button>
                    <button className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                      isDark
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}>
                      바로 구매하기
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={handleWishlistToggle}
                        disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                        className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border disabled:opacity-50 ${
                          isWishlisted
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : isDark
                              ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        {isWishlisted ? '찜함' : '찜하기'}
                      </button>
                      <button className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border ${
                        isDark
                          ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <Share2 className="w-5 h-5" />
                        공유
                      </button>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className={`mt-6 pt-6 border-t space-y-3 text-sm ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <PlayCircle className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span>{course.totalLectures}개 강의 ({course.totalHours}시간)</span>
                    </div>
                    <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <FileText className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span>난이도: {course.level}</span>
                    </div>
                    {course.hasCertificate && (
                      <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Award className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>수료증 발급</span>
                      </div>
                    )}
                    {course.isLifetimeAccess && (
                      <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Clock className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span>평생 무제한 수강</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-4xl">
          {/* What You'll Learn */}
          <section className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              이런 걸 배워요
            </h2>
            <div className={`rounded-xl p-6 border ${
              isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#10b981] mt-0.5 flex-shrink-0" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              수강 전 필요한 것
            </h2>
            <div className={`rounded-xl p-6 border ${
              isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
            }`}>
              <ul className="space-y-3">
                {course.requirements.map((item, index) => (
                  <li key={index} className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="w-2 h-2 rounded-full bg-[#6778ff]"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Curriculum */}
          <section className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              커리큘럼
            </h2>
            <div className="space-y-3">
              {course.curriculum.map((section, sectionIndex) => (
                <CurriculumSectionItem
                  key={section.id}
                  section={section}
                  sectionIndex={sectionIndex}
                  isExpanded={expandedSections.includes(sectionIndex)}
                  onToggle={() => toggleSection(sectionIndex)}
                  isDark={isDark}
                />
              ))}
            </div>
          </section>

          {/* Instructor */}
          <section className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              강사 소개
            </h2>
            <div className={`rounded-xl p-6 border ${
              isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-start gap-4">
                <img
                  src={course.instructor.profileImage || 'https://via.placeholder.com/80'}
                  alt={course.instructor.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {course.instructor.name}
                  </h3>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {course.instructor.bio}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
