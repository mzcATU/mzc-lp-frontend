import { useState, useEffect, useMemo, ComponentType } from 'react';
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

/** 강의 카드 props 인터페이스 - LandingCourseCard와 B2BCourseCard 공통 */
interface CourseCardProps {
  id: number;
  title: string;
  instructor: string;
  image: string;
  tags: string[];
  category: string;
  studentCount: number;
  // LandingCourseCard 전용 (필수)
  price: string | null;
  rating: number;
  reviewCount: number;
  courseBasePath?: string;
  // 공통 옵션
  deliveryType?: string;
  level?: string;
  classStartDate?: string;
  isOnDemand?: boolean;
}

/** SearchPage props */
interface SearchPageProps {
  /** 커스텀 헤더 컴포넌트 (B2B 등에서 사용) */
  HeaderComponent?: ComponentType;
  /** 로드맵/커뮤니티 탭 표시 여부 (B2B에서는 false) */
  showRoadmapAndCommunity?: boolean;
  /** 가격 표시 여부 (B2B에서는 false) */
  showPrice?: boolean;
  /** 가격 필터 표시 여부 (B2B에서는 false) */
  showPriceFilter?: boolean;
  /** 강의 상세 페이지 기본 경로 (B2B: /tu/b2b/courses) */
  courseBasePath?: string;
  /** 페이지 제목 (기본: 통합 검색) */
  pageTitle?: string;
  /** 페이지 설명 (기본: 강의, 로드맵, 커뮤니티를 한 번에 검색하세요) */
  pageDescription?: string;
  /** 검색 입력란 플레이스홀더 */
  searchPlaceholder?: string;
  /** 커스텀 강의 카드 컴포넌트 (B2B에서 B2BCourseCard 사용) */
  CourseCardComponent?: ComponentType<CourseCardProps>;
}
import { LandingCourseCard } from '@/components/landing';
import { useCourseTimeCatalog, useRoadmapExplore, useCommunityPosts } from '@/hooks/tu';
import { useSubdomainPath } from '@/hooks/common';
import { useTenantFeatures } from '@/contexts/TenantFeaturesContext';
import type { RoadmapExploreItem } from '@/types/tu/roadmapExplore.types';
import type { CommunityPost } from '@/types/tu/community.types';
import type { CourseTimeCatalogResponse } from '@/types/tu/courseTimeCatalog.types';
import { ROADMAP_LEVEL_LABELS } from '@/types/tu/roadmapExplore.types';
import { DELIVERY_TYPE_LABELS, PROGRAM_LEVEL_LABELS } from '@/types/tu/courseTimeCatalog.types';

// API 사용 여부 (false면 더미 데이터 사용)
const USE_API = true;

/**
 * CourseTime API 데이터를 카드 컴포넌트 props로 변환
 */
function convertCourseTimeToCardProps(courseTime: CourseTimeCatalogResponse): CourseCardProps {
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
    // LandingCourseCard 전용 (선택적)
    rating: 0,
    reviewCount: 0,
    price: null,
  };
}

// 더미 강의 카드 데이터 (LandingCourseCard용)
interface MockCourseCard {
  id: number;
  title: string;
  instructor: string;
  price: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  image: string;
  tags: string[];
  category: string;
  keywords: string[]; // 검색용 키워드
}

const MOCK_COURSES: MockCourseCard[] = [
  {
    id: 1,
    title: 'React 완전 정복: 기초부터 고급까지',
    instructor: '김리액트',
    price: '₩99,000',
    rating: 4.8,
    reviewCount: 45,
    studentCount: 1234,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop',
    tags: ['상시모집', '인기'],
    category: '개발',
    keywords: ['React', '리액트', '프론트엔드', 'JavaScript', 'JS', '강의'],
  },
  {
    id: 2,
    title: 'TypeScript 마스터클래스',
    instructor: '박타입',
    price: '₩79,000',
    rating: 4.7,
    reviewCount: 32,
    studentCount: 856,
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=250&fit=crop',
    tags: ['상시모집'],
    category: '개발',
    keywords: ['TypeScript', '타입스크립트', 'TS', '프론트엔드', '강의'],
  },
  {
    id: 3,
    title: 'Python으로 배우는 AI 기초',
    instructor: '이파이썬',
    price: '₩129,000',
    rating: 4.9,
    reviewCount: 28,
    studentCount: 2341,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    tags: ['모집중', '신규'],
    category: 'AI',
    keywords: ['Python', '파이썬', 'AI', '인공지능', '머신러닝', '강의'],
  },
  {
    id: 4,
    title: 'AWS 클라우드 실전 가이드',
    instructor: '최클라우드',
    price: '무료',
    rating: 4.6,
    reviewCount: 156,
    studentCount: 3456,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
    tags: ['상시모집', '무료'],
    category: '클라우드',
    keywords: ['AWS', '클라우드', 'Cloud', 'DevOps', '강의'],
  },
  {
    id: 5,
    title: 'Next.js 14 완벽 가이드',
    instructor: '정넥스트',
    price: '₩89,000',
    rating: 4.8,
    reviewCount: 41,
    studentCount: 1567,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop',
    tags: ['상시모집', '인기'],
    category: '개발',
    keywords: ['Next.js', 'Next', 'React', '프론트엔드', 'SSR', '강의'],
  },
  {
    id: 6,
    title: 'Vue.js 3 실전 프로젝트',
    instructor: '한뷰',
    price: '₩75,000',
    rating: 4.5,
    reviewCount: 22,
    studentCount: 432,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop',
    tags: ['모집중'],
    category: '개발',
    keywords: ['Vue', 'Vue.js', '뷰', '프론트엔드', 'JavaScript', '강의'],
  },
  {
    id: 7,
    title: 'Docker & Kubernetes 완벽 가이드',
    instructor: '강도커',
    price: '₩149,000',
    rating: 4.9,
    reviewCount: 89,
    studentCount: 2789,
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop',
    tags: ['상시모집', '인기'],
    category: '클라우드',
    keywords: ['Docker', '도커', 'Kubernetes', '쿠버네티스', 'K8s', 'DevOps', '컨테이너', '강의'],
  },
  {
    id: 8,
    title: 'Node.js 백엔드 개발 실전',
    instructor: '노드맨',
    price: '₩110,000',
    rating: 4.7,
    reviewCount: 67,
    studentCount: 1890,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
    tags: ['상시모집'],
    category: '개발',
    keywords: ['Node.js', '노드', 'Express', '백엔드', 'JavaScript', 'API', '강의'],
  },
  {
    id: 9,
    title: 'Spring Boot 3.0 실무 프로젝트',
    instructor: '자바킹',
    price: '₩139,000',
    rating: 4.8,
    reviewCount: 112,
    studentCount: 3210,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=250&fit=crop',
    tags: ['상시모집', '인기'],
    category: '개발',
    keywords: ['Spring', 'Spring Boot', '스프링', 'Java', '자바', '백엔드', '강의'],
  },
  {
    id: 10,
    title: 'Flutter로 만드는 크로스플랫폼 앱',
    instructor: '플러터박사',
    price: '₩95,000',
    rating: 4.6,
    reviewCount: 54,
    studentCount: 987,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
    tags: ['모집중', '신규'],
    category: '개발',
    keywords: ['Flutter', '플러터', 'Dart', '다트', '앱개발', '모바일', '강의'],
  },
  {
    id: 11,
    title: 'SQL과 데이터베이스 기초',
    instructor: '데이터맨',
    price: '₩69,000',
    rating: 4.5,
    reviewCount: 203,
    studentCount: 4567,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop',
    tags: ['상시모집', '무료'],
    category: '데이터',
    keywords: ['SQL', '데이터베이스', 'MySQL', 'PostgreSQL', 'DB', '강의'],
  },
  {
    id: 12,
    title: 'Git & GitHub 협업 마스터',
    instructor: '깃전문가',
    price: '무료',
    rating: 4.8,
    reviewCount: 321,
    studentCount: 5678,
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=250&fit=crop',
    tags: ['상시모집', '무료', '인기'],
    category: '개발',
    keywords: ['Git', '깃', 'GitHub', '깃허브', '버전관리', '협업', '강의'],
  },
  {
    id: 13,
    title: 'ChatGPT API 활용 실전',
    instructor: 'AI개발자',
    price: '₩89,000',
    rating: 4.9,
    reviewCount: 78,
    studentCount: 1876,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
    tags: ['신규', '인기'],
    category: 'AI',
    keywords: ['ChatGPT', 'GPT', 'OpenAI', 'AI', 'LLM', 'API', '강의'],
  },
  {
    id: 14,
    title: 'UI/UX 디자인 실무',
    instructor: '디자이너K',
    price: '₩85,000',
    rating: 4.7,
    reviewCount: 95,
    studentCount: 1345,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
    tags: ['상시모집'],
    category: '디자인',
    keywords: ['UI', 'UX', '디자인', 'Figma', '피그마', '웹디자인', '강의'],
  },
  {
    id: 15,
    title: '데이터 분석 with Python',
    instructor: '분석전문가',
    price: '₩119,000',
    rating: 4.8,
    reviewCount: 134,
    studentCount: 2987,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    tags: ['상시모집', '인기'],
    category: '데이터',
    keywords: ['데이터분석', 'Python', '파이썬', 'Pandas', '판다스', 'NumPy', '강의'],
  },
];

// 더미 로드맵 데이터
const MOCK_ROADMAPS: RoadmapExploreItem[] = [
  {
    id: 1,
    title: '프론트엔드 개발자 로드맵',
    description: 'HTML, CSS부터 React, TypeScript까지 프론트엔드 개발의 모든 것을 배웁니다.',
    image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=250&fit=crop',
    author: '김프론트',
    authorImage: '',
    level: 'beginner',
    courseCount: 12,
    estimatedHours: 120,
    enrollCount: 2500,
    rating: 4.8,
    reviewCount: 320,
    category: '개발',
    tags: ['React', 'TypeScript', 'CSS', '프론트엔드', '강의'],
    isNew: false,
    isPopular: true,
  },
  {
    id: 2,
    title: '백엔드 개발자 로드맵',
    description: 'Node.js, Python, 데이터베이스를 활용한 백엔드 개발 마스터 과정',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop',
    author: '박백엔드',
    authorImage: '',
    level: 'intermediate',
    courseCount: 15,
    estimatedHours: 180,
    enrollCount: 1800,
    rating: 4.7,
    reviewCount: 215,
    category: '개발',
    tags: ['Node.js', 'Python', 'Database', '백엔드', '강의'],
    isNew: false,
    isPopular: true,
  },
  {
    id: 3,
    title: 'AI/ML 엔지니어 로드맵',
    description: '인공지능과 머신러닝의 기초부터 실전 프로젝트까지',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop',
    author: '이에이아이',
    authorImage: '',
    level: 'advanced',
    courseCount: 20,
    estimatedHours: 240,
    enrollCount: 1200,
    rating: 4.9,
    reviewCount: 180,
    category: 'AI',
    tags: ['Python', 'AI', 'TensorFlow', '머신러닝', '딥러닝', '강의'],
    isNew: true,
    isPopular: true,
  },
  {
    id: 4,
    title: '클라우드 아키텍트 로드맵',
    description: 'AWS, GCP, Azure를 활용한 클라우드 인프라 설계 및 구축',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop',
    author: '최클라우드',
    authorImage: '',
    level: 'intermediate',
    courseCount: 10,
    estimatedHours: 100,
    enrollCount: 900,
    rating: 4.6,
    reviewCount: 95,
    category: '클라우드',
    tags: ['AWS', '클라우드', 'DevOps', 'GCP', 'Azure', '강의'],
    isNew: false,
    isPopular: false,
  },
  {
    id: 5,
    title: '풀스택 개발자 로드맵',
    description: '프론트엔드와 백엔드를 모두 아우르는 풀스택 개발자가 되기 위한 종합 과정',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=250&fit=crop',
    author: '풀스택킹',
    authorImage: '',
    level: 'intermediate',
    courseCount: 25,
    estimatedHours: 300,
    enrollCount: 3200,
    rating: 4.8,
    reviewCount: 420,
    category: '개발',
    tags: ['React', 'Node.js', 'Database', '풀스택', '강의'],
    isNew: false,
    isPopular: true,
  },
  {
    id: 6,
    title: '데이터 사이언티스트 로드맵',
    description: '데이터 분석부터 머신러닝까지, 데이터 사이언스 전문가 양성 과정',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
    author: '데이터박사',
    authorImage: '',
    level: 'intermediate',
    courseCount: 18,
    estimatedHours: 200,
    enrollCount: 1500,
    rating: 4.7,
    reviewCount: 185,
    category: '데이터',
    tags: ['Python', 'SQL', '데이터분석', '머신러닝', '강의'],
    isNew: true,
    isPopular: false,
  },
  {
    id: 7,
    title: 'DevOps 엔지니어 로드맵',
    description: 'CI/CD, 컨테이너, 인프라 자동화를 위한 DevOps 완벽 가이드',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop',
    author: '데브옵스마스터',
    authorImage: '',
    level: 'advanced',
    courseCount: 14,
    estimatedHours: 150,
    enrollCount: 800,
    rating: 4.8,
    reviewCount: 110,
    category: '클라우드',
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'DevOps', '강의'],
    isNew: false,
    isPopular: true,
  },
  {
    id: 8,
    title: '모바일 앱 개발자 로드맵',
    description: 'React Native와 Flutter로 iOS, Android 앱을 동시에 개발하는 방법',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop',
    author: '앱개발자',
    authorImage: '',
    level: 'beginner',
    courseCount: 16,
    estimatedHours: 180,
    enrollCount: 2100,
    rating: 4.6,
    reviewCount: 275,
    category: '개발',
    tags: ['React Native', 'Flutter', '모바일', '앱개발', '강의'],
    isNew: false,
    isPopular: true,
  },
];

// 더미 커뮤니티 데이터
const MOCK_COMMUNITY: CommunityPost[] = [
  {
    id: 1,
    type: 'tip',
    title: 'React 18에서 새로 추가된 기능들 정리',
    content: 'React 18에서 추가된 Concurrent Features, Suspense 개선사항, 자동 배칭 등을 정리해봤습니다.',
    category: '개발 질문',
    author: { id: 1, name: '김개발', avatar: '' },
    viewCount: 342,
    likeCount: 28,
    commentCount: 15,
    tags: ['React', 'JavaScript', '프론트엔드', '강의'],
    createdAt: '2025-01-05T10:30:00',
    updatedAt: '2025-01-05T10:30:00',
    isLiked: false,
  },
  {
    id: 2,
    type: 'tip',
    title: 'TypeScript 5.0 새로운 기능 소개',
    content: 'TypeScript 5.0에서 추가된 데코레이터, const type parameters 등 새로운 기능들을 살펴봅니다.',
    category: '개발 질문',
    author: { id: 2, name: '박타입', avatar: '' },
    viewCount: 256,
    likeCount: 19,
    commentCount: 8,
    tags: ['TypeScript', '프론트엔드', '강의'],
    createdAt: '2025-01-04T14:20:00',
    updatedAt: '2025-01-04T14:20:00',
    isLiked: false,
  },
  {
    id: 3,
    type: 'discussion',
    title: 'Python으로 AI 프로젝트 시작하기',
    content: 'AI 프로젝트를 처음 시작하시는 분들을 위한 가이드입니다. 환경 설정부터 첫 모델 학습까지!',
    category: '스터디 모집',
    author: { id: 3, name: '이파이썬', avatar: '' },
    viewCount: 489,
    likeCount: 45,
    commentCount: 23,
    tags: ['Python', 'AI', '머신러닝', '강의'],
    createdAt: '2025-01-03T09:15:00',
    updatedAt: '2025-01-03T09:15:00',
    isLiked: false,
  },
  {
    id: 4,
    type: 'discussion',
    title: 'AWS 자격증 준비 스터디원 모집합니다',
    content: 'AWS Solutions Architect Associate 자격증 준비 스터디원을 모집합니다. 주 2회 온라인 모임!',
    category: '스터디 모집',
    author: { id: 4, name: '최클라우드', avatar: '' },
    viewCount: 178,
    likeCount: 12,
    commentCount: 31,
    tags: ['AWS', '클라우드', '자격증', '강의'],
    createdAt: '2025-01-02T16:45:00',
    updatedAt: '2025-01-02T16:45:00',
    isLiked: false,
  },
  {
    id: 5,
    type: 'review',
    title: 'Next.js 14 App Router 마이그레이션 경험담',
    content: 'Pages Router에서 App Router로 마이그레이션하면서 겪은 이슈들과 해결 방법을 공유합니다.',
    category: '경험 공유',
    author: { id: 5, name: '정넥스트', avatar: '' },
    viewCount: 623,
    likeCount: 52,
    commentCount: 18,
    tags: ['Next.js', 'React', '마이그레이션', '강의'],
    createdAt: '2025-01-01T11:00:00',
    updatedAt: '2025-01-01T11:00:00',
    isLiked: false,
  },
  {
    id: 6,
    type: 'tip',
    title: 'Vue 3 Composition API 실전 팁',
    content: 'Vue 3 Composition API를 실무에서 효과적으로 사용하는 방법과 팁들을 정리했습니다.',
    category: '개발 질문',
    author: { id: 6, name: '한뷰', avatar: '' },
    viewCount: 198,
    likeCount: 15,
    commentCount: 7,
    tags: ['Vue', 'JavaScript', '프론트엔드', '강의'],
    createdAt: '2024-12-30T13:30:00',
    updatedAt: '2024-12-30T13:30:00',
    isLiked: false,
  },
  {
    id: 7,
    type: 'question',
    title: 'Docker 컨테이너 네트워킹 질문드립니다',
    content: 'Docker Compose로 여러 컨테이너를 연결할 때 네트워크 설정이 헷갈립니다. 도움 부탁드려요!',
    category: '개발 질문',
    author: { id: 7, name: '도커초보', avatar: '' },
    viewCount: 89,
    likeCount: 5,
    commentCount: 12,
    tags: ['Docker', 'DevOps', '네트워크', '강의'],
    createdAt: '2025-01-05T15:20:00',
    updatedAt: '2025-01-05T15:20:00',
    isLiked: false,
  },
  {
    id: 8,
    type: 'tip',
    title: 'Spring Boot 3.0 마이그레이션 가이드',
    content: 'Spring Boot 2.x에서 3.0으로 업그레이드하면서 주의해야 할 점들을 정리했습니다.',
    category: '경험 공유',
    author: { id: 8, name: '스프링매니아', avatar: '' },
    viewCount: 445,
    likeCount: 38,
    commentCount: 21,
    tags: ['Spring', 'Java', '백엔드', '마이그레이션', '강의'],
    createdAt: '2025-01-04T09:00:00',
    updatedAt: '2025-01-04T09:00:00',
    isLiked: false,
  },
  {
    id: 9,
    type: 'discussion',
    title: 'Flutter vs React Native 어떤걸 배워야 할까요?',
    content: '모바일 앱 개발을 시작하려고 합니다. 두 프레임워크 중 어떤 것이 더 좋을까요?',
    category: '자유 토론',
    author: { id: 9, name: '모바일러', avatar: '' },
    viewCount: 567,
    likeCount: 42,
    commentCount: 89,
    tags: ['Flutter', 'React Native', '모바일', '앱개발', '강의'],
    createdAt: '2025-01-03T18:30:00',
    updatedAt: '2025-01-03T18:30:00',
    isLiked: false,
  },
  {
    id: 10,
    type: 'tip',
    title: 'Git 브랜치 전략 - GitFlow vs Trunk-based',
    content: '팀에서 사용할 Git 브랜치 전략을 고민 중이라면 이 글을 참고하세요.',
    category: '개발 질문',
    author: { id: 10, name: '깃마스터', avatar: '' },
    viewCount: 312,
    likeCount: 29,
    commentCount: 16,
    tags: ['Git', 'GitHub', '협업', '버전관리', '강의'],
    createdAt: '2025-01-02T11:15:00',
    updatedAt: '2025-01-02T11:15:00',
    isLiked: false,
  },
  {
    id: 11,
    type: 'review',
    title: 'ChatGPT API를 활용한 챗봇 만들기 후기',
    content: 'OpenAI API를 사용해서 간단한 고객 상담 챗봇을 만들어봤습니다. 생각보다 쉬웠어요!',
    category: '경험 공유',
    author: { id: 11, name: 'AI개발자', avatar: '' },
    viewCount: 892,
    likeCount: 76,
    commentCount: 34,
    tags: ['ChatGPT', 'AI', 'OpenAI', 'API', '강의'],
    createdAt: '2025-01-01T14:00:00',
    updatedAt: '2025-01-01T14:00:00',
    isLiked: false,
  },
  {
    id: 12,
    type: 'discussion',
    title: 'Kubernetes 스터디 그룹 모집 (온라인)',
    content: '쿠버네티스를 함께 공부할 스터디원을 모집합니다. 매주 토요일 오전 진행 예정입니다.',
    category: '스터디 모집',
    author: { id: 12, name: 'K8s러버', avatar: '' },
    viewCount: 234,
    likeCount: 18,
    commentCount: 45,
    tags: ['Kubernetes', 'Docker', 'DevOps', '클라우드', '강의'],
    createdAt: '2024-12-31T10:00:00',
    updatedAt: '2024-12-31T10:00:00',
    isLiked: false,
  },
];

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

// 검색 필터 함수
function searchCourses(courses: MockCourseCard[], keyword: string): MockCourseCard[] {
  const lowerKeyword = keyword.toLowerCase();
  return courses.filter(course =>
    course.title.toLowerCase().includes(lowerKeyword) ||
    course.instructor.toLowerCase().includes(lowerKeyword) ||
    course.category.toLowerCase().includes(lowerKeyword) ||
    course.keywords.some(k => k.toLowerCase().includes(lowerKeyword)) ||
    course.tags.some(t => t.toLowerCase().includes(lowerKeyword))
  );
}

function searchRoadmaps(roadmaps: RoadmapExploreItem[], keyword: string): RoadmapExploreItem[] {
  const lowerKeyword = keyword.toLowerCase();
  return roadmaps.filter(roadmap =>
    roadmap.title.toLowerCase().includes(lowerKeyword) ||
    roadmap.description.toLowerCase().includes(lowerKeyword) ||
    roadmap.category.toLowerCase().includes(lowerKeyword) ||
    (roadmap.tags || []).some(t => t.toLowerCase().includes(lowerKeyword))
  );
}

function searchCommunity(posts: CommunityPost[], keyword: string): CommunityPost[] {
  const lowerKeyword = keyword.toLowerCase();
  return posts.filter(post =>
    post.title.toLowerCase().includes(lowerKeyword) ||
    post.content.toLowerCase().includes(lowerKeyword) ||
    post.category.toLowerCase().includes(lowerKeyword) ||
    (post.tags || []).some(t => t.toLowerCase().includes(lowerKeyword))
  );
}

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

export function SearchPage({
  HeaderComponent = LandingHeader,
  showRoadmapAndCommunity = true,
  showPrice = true,
  showPriceFilter = true,
  courseBasePath,
  pageTitle = '통합 검색',
  pageDescription = '강의, 로드맵, 커뮤니티를 한 번에 검색하세요',
  searchPlaceholder = '강의, 로드맵, 커뮤니티 글을 검색하세요',
  CourseCardComponent,
}: SearchPageProps = {}) {
  // 사용할 카드 컴포넌트 결정 (커스텀 또는 기본 LandingCourseCard)
  const CardComponent = CourseCardComponent || LandingCourseCard;
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
    // URL도 초기화
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

    // URL에서 필터 복원
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

    // URL 파라미터 업데이트
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

  // API 데이터 (USE_API가 true일 때만 사용)
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

  // 더미 데이터 검색 결과
  const mockSearchResults = useMemo(() => {
    if (!searchQuery) return { courses: [], roadmaps: [], community: [] };
    return {
      courses: searchCourses(MOCK_COURSES, searchQuery),
      roadmaps: searchRoadmaps(MOCK_ROADMAPS, searchQuery),
      community: searchCommunity(MOCK_COMMUNITY, searchQuery),
    };
  }, [searchQuery]);

  // 필터링된 결과 (더미 데이터용)
  const filteredResults = useMemo(() => {
    let filteredCourses = [...mockSearchResults.courses];
    let filteredRoadmaps = [...mockSearchResults.roadmaps];
    let filteredCommunity = [...mockSearchResults.community];

    // 강의 필터링
    if (filters.category !== 'all') {
      filteredCourses = filteredCourses.filter((c) => c.category === filters.category);
    }
    if (filters.price !== 'all') {
      filteredCourses = filteredCourses.filter((c) =>
        filters.price === 'free' ? c.price === '무료' : c.price !== '무료'
      );
    }
    if (filters.status !== 'all') {
      filteredCourses = filteredCourses.filter((c) =>
        filters.status === 'recruiting'
          ? c.tags.some((t) => t.includes('모집'))
          : c.tags.some((t) => t.includes('상시'))
      );
    }

    // 로드맵 필터링
    if (filters.category !== 'all') {
      filteredRoadmaps = filteredRoadmaps.filter((r) => r.category === filters.category);
    }
    if (filters.level !== 'all') {
      filteredRoadmaps = filteredRoadmaps.filter((r) => r.level === filters.level);
    }

    // 커뮤니티 필터링
    if (filters.postType !== 'all') {
      filteredCommunity = filteredCommunity.filter((p) => p.type === filters.postType);
    }
    if (filters.communityCategory !== 'all') {
      filteredCommunity = filteredCommunity.filter((p) => p.category === filters.communityCategory);
    }

    // 정렬
    const sortFn = (a: { rating?: number; createdAt?: string; viewCount?: number }, b: { rating?: number; createdAt?: string; viewCount?: number }) => {
      switch (filters.sort) {
        case 'latest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'popular':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0; // relevance - 기본 순서 유지
      }
    };

    if (filters.sort !== 'relevance') {
      filteredCourses.sort((a, b) => sortFn({ rating: a.rating }, { rating: b.rating }));
      filteredRoadmaps.sort((a, b) => sortFn({ rating: a.rating, viewCount: a.enrollCount }, { rating: b.rating, viewCount: b.enrollCount }));
      filteredCommunity.sort(sortFn);
    }

    return {
      courses: filteredCourses,
      roadmaps: filteredRoadmaps,
      community: filteredCommunity,
    };
  }, [mockSearchResults, filters]);

  // 실제 사용할 데이터 결정
  const courses = USE_API ? (coursesData?.content || []) : filteredResults.courses;
  const roadmaps = USE_API ? (roadmapsData?.roadmaps || []) : filteredResults.roadmaps;
  const communityPosts = USE_API ? (communityData?.posts || []) : filteredResults.community;

  const totalCourses = USE_API ? (coursesData?.totalElements || 0) : filteredResults.courses.length;
  const totalRoadmaps = USE_API ? (roadmapsData?.totalCount || 0) : filteredResults.roadmaps.length;
  const totalCommunity = USE_API ? (communityData?.totalCount || 0) : filteredResults.community.length;
  const totalResults = totalCourses + totalRoadmaps + totalCommunity;

  const isLoading = USE_API && (isCoursesLoading || isRoadmapsLoading || isCommunityLoading);

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

  // 탭 데이터 (B2B에서는 로드맵/커뮤니티 제외)
  const tabs = showRoadmapAndCommunity
    ? [
        { id: 'all' as const, label: '전체', count: totalResults },
        { id: 'courses' as const, label: '강의', count: totalCourses, icon: BookOpen },
        { id: 'roadmaps' as const, label: '로드맵', count: totalRoadmaps, icon: Map },
        { id: 'community' as const, label: '커뮤니티', count: totalCommunity, icon: MessageSquare },
      ]
    : [
        { id: 'all' as const, label: '전체', count: totalCourses },
        { id: 'courses' as const, label: '강의', count: totalCourses, icon: BookOpen },
      ];

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <HeaderComponent />

      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        {/* 검색 헤더 */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {pageTitle}
          </h1>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {pageDescription}
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
              placeholder={searchPlaceholder}
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
              {/* 필터 토글 버튼 (모바일) */}
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

              {/* 필터 드롭다운들 */}
              <div className={`flex flex-wrap gap-2 ${!showFilters ? 'max-md:hidden' : ''}`}>
                {/* 공통: 정렬 */}
                <FilterDropdown
                  label="정렬"
                  value={filters.sort}
                  options={SORT_OPTIONS}
                  onChange={(value) => updateFilterWithUrl('sort', value)}
                  isDark={isDark}
                />

                {/* 강의/로드맵: 카테고리 */}
                {(activeTab === 'all' || activeTab === 'courses' || activeTab === 'roadmaps') && (
                  <FilterDropdown
                    label="카테고리"
                    value={filters.category}
                    options={CATEGORY_OPTIONS}
                    onChange={(value) => updateFilterWithUrl('category', value)}
                    isDark={isDark}
                  />
                )}

                {/* 강의/로드맵: 난이도 */}
                {(activeTab === 'courses' || activeTab === 'roadmaps') && (
                  <FilterDropdown
                    label="난이도"
                    value={filters.level}
                    options={LEVEL_OPTIONS}
                    onChange={(value) => updateFilterWithUrl('level', value)}
                    isDark={isDark}
                  />
                )}

                {/* 강의: 가격 (B2B에서는 숨김) */}
                {showPriceFilter && activeTab === 'courses' && (
                  <FilterDropdown
                    label="가격"
                    value={filters.price}
                    options={PRICE_OPTIONS}
                    onChange={(value) => updateFilterWithUrl('price', value)}
                    isDark={isDark}
                  />
                )}

                {/* 강의: 모집상태 */}
                {activeTab === 'courses' && (
                  <FilterDropdown
                    label="모집상태"
                    value={filters.status}
                    options={STATUS_OPTIONS}
                    onChange={(value) => updateFilterWithUrl('status', value)}
                    isDark={isDark}
                  />
                )}

                {/* 커뮤니티: 게시글 유형 */}
                {activeTab === 'community' && (
                  <FilterDropdown
                    label="유형"
                    value={filters.postType}
                    options={POST_TYPE_OPTIONS}
                    onChange={(value) => updateFilterWithUrl('postType', value)}
                    isDark={isDark}
                  />
                )}

                {/* 커뮤니티: 카테고리 */}
                {activeTab === 'community' && (
                  <FilterDropdown
                    label="카테고리"
                    value={filters.communityCategory}
                    options={COMMUNITY_CATEGORY_OPTIONS}
                    onChange={(value) => updateFilterWithUrl('communityCategory', value)}
                    isDark={isDark}
                  />
                )}

                {/* 필터 초기화 */}
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
                      {(USE_API ? courses : (courses as MockCourseCard[])).map((course) => {
                        // API 데이터인 경우 변환, 더미 데이터는 그대로 사용
                        const cardProps = USE_API
                          ? convertCourseTimeToCardProps(course as CourseTimeCatalogResponse)
                          : {
                              id: (course as MockCourseCard).id,
                              title: (course as MockCourseCard).title,
                              instructor: (course as MockCourseCard).instructor,
                              price: showPrice && paidModeEnabled ? (course as MockCourseCard).price : null,
                              rating: (course as MockCourseCard).rating,
                              reviewCount: (course as MockCourseCard).reviewCount,
                              studentCount: (course as MockCourseCard).studentCount,
                              image: (course as MockCourseCard).image,
                              tags: (course as MockCourseCard).tags,
                              category: (course as MockCourseCard).category,
                            };

                        return (
                          <CardComponent
                            key={cardProps.id}
                            {...cardProps}
                            courseBasePath={courseBasePath}
                          />
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 로드맵 섹션 (B2B에서는 숨김) */}
                {showRoadmapAndCommunity && (activeTab === 'all' || activeTab === 'roadmaps') && roadmaps.length > 0 && (
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

                {/* 커뮤니티 섹션 (B2B에서는 숨김) */}
                {showRoadmapAndCommunity && (activeTab === 'all' || activeTab === 'community') && communityPosts.length > 0 && (
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

            {/* 인기 검색어 */}
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
