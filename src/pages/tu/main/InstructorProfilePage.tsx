/**
 * InstructorProfilePage
 * 강사 프로필 상세 페이지
 */
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Users,
  BookOpen,
  Award,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Youtube,
  Heart,
  Share2,
  ChevronRight,
  Clock,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { LandingHeader, LandingFooter } from '@/components/landing';
import { Button } from '@/components/common';
import { useThemeStore } from '@/store/common/themeStore';
import {
  useInstructorProfile,
  useInstructorCourses,
  useInstructorRoadmaps,
  useInstructorReviews,
  useFollowInstructor,
  useUnfollowInstructor,
} from '@/hooks/tu';
import type { InstructorProfile, InstructorCourse, InstructorRoadmap, InstructorReview } from '@/types/tu';

// API 사용 여부 플래그
const USE_API = false;

// 더미 강사 프로필 데이터
const dummyInstructor: InstructorProfile = {
  id: 1,
  name: '김클라우드',
  slug: 'kim-cloud',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=400&fit=crop',
  title: 'AWS 공인 솔루션스 아키텍트 Professional',
  specialty: 'AWS / 클라우드 아키텍처',
  bio: '10년간 엔터프라이즈 클라우드 구축 경험을 보유한 AWS 전문가입니다.',
  description: `안녕하세요, 김클라우드입니다.

저는 10년 이상 클라우드 인프라 분야에서 일하며, 수많은 기업의 클라우드 전환 프로젝트를 성공적으로 이끌어왔습니다.

AWS 공인 솔루션스 아키텍트 Professional 자격을 보유하고 있으며, 현재까지 15,000명 이상의 수강생에게 클라우드 기술을 전달해왔습니다.

제 강의는 실무 중심으로 구성되어 있어, 배운 내용을 바로 현업에 적용할 수 있습니다. 이론뿐만 아니라 실제 프로젝트 경험을 바탕으로 한 인사이트를 공유합니다.`,
  studentCount: 15420,
  courseCount: 8,
  reviewCount: 2847,
  rating: 4.9,
  totalStudents: 15420,
  experience: [
    'AWS 솔루션스 아키텍트 (현) - 5년',
    '삼성SDS 클라우드 엔지니어 - 3년',
    'LG CNS 인프라 엔지니어 - 2년',
  ],
  certifications: [
    'AWS Solutions Architect Professional',
    'AWS DevOps Engineer Professional',
    'Google Cloud Professional Architect',
    'Kubernetes Administrator (CKA)',
  ],
  socialLinks: {
    website: 'https://kimcloud.dev',
    linkedin: 'https://linkedin.com/in/kimcloud',
    github: 'https://github.com/kimcloud',
    youtube: 'https://youtube.com/@kimcloud',
  },
  isFollowing: false,
  followerCount: 8520,
  createdAt: '2020-03-15',
};

// 더미 강의 데이터
const dummyCourses: InstructorCourse[] = [
  {
    id: 1,
    title: 'AWS 클라우드 실무 완벽 마스터',
    instructor: '김클라우드',
    price: 89000,
    originalPrice: 129000,
    discount: 31,
    rating: 4.9,
    reviewCount: 1234,
    studentCount: 5420,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    category: 'cloud',
    level: 'intermediate',
    duration: '32시간',
    isNew: false,
    isBestseller: true,
    tags: ['AWS', 'EC2', 'S3', 'VPC'],
  },
  {
    id: 2,
    title: 'AWS 서버리스 아키텍처 완벽 가이드',
    instructor: '김클라우드',
    price: 79000,
    originalPrice: 99000,
    discount: 20,
    rating: 4.8,
    reviewCount: 856,
    studentCount: 3210,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    category: 'cloud',
    level: 'advanced',
    duration: '28시간',
    isNew: true,
    isBestseller: false,
    tags: ['Lambda', 'API Gateway', 'DynamoDB'],
  },
  {
    id: 3,
    title: 'DevOps와 CI/CD 파이프라인 구축',
    instructor: '김클라우드',
    price: 69000,
    originalPrice: 89000,
    discount: 22,
    rating: 4.7,
    reviewCount: 542,
    studentCount: 2150,
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
    category: 'devops',
    level: 'intermediate',
    duration: '24시간',
    isNew: false,
    isBestseller: false,
    tags: ['Jenkins', 'GitHub Actions', 'Docker'],
  },
];

// 더미 로드맵 데이터
const dummyRoadmaps: InstructorRoadmap[] = [
  {
    id: 1,
    title: 'AWS 전문가 되기 로드맵',
    description: 'AWS 입문부터 Professional 자격증 취득까지',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    courseCount: 5,
    totalDuration: '120시간',
    level: '입문 → 전문가',
    category: 'cloud',
    enrolledCount: 2340,
  },
];

// 더미 리뷰 데이터
const dummyReviews: InstructorReview[] = [
  {
    id: 1,
    courseId: 1,
    courseTitle: 'AWS 클라우드 실무 완벽 마스터',
    userId: 101,
    userName: '박개발',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    content: '실무에서 바로 적용할 수 있는 내용들로 가득합니다. 특히 VPC 구성 부분이 정말 도움이 많이 되었어요. 강사님의 설명이 명확하고 예제도 풍부해서 이해하기 쉬웠습니다.',
    createdAt: '2024-12-15',
    helpful: 45,
    isVerified: true,
  },
  {
    id: 2,
    courseId: 1,
    courseTitle: 'AWS 클라우드 실무 완벽 마스터',
    userId: 102,
    userName: '이엔지니어',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rating: 5,
    content: '이 강의 덕분에 AWS 솔루션스 아키텍트 자격증을 취득했습니다! 이론과 실습이 균형있게 구성되어 있어서 좋았습니다.',
    createdAt: '2024-12-10',
    helpful: 32,
    isVerified: true,
  },
  {
    id: 3,
    courseId: 2,
    courseTitle: 'AWS 서버리스 아키텍처 완벽 가이드',
    userId: 103,
    userName: '최서버리스',
    rating: 4,
    content: '서버리스 아키텍처에 대한 이해도가 크게 높아졌습니다. 다만 일부 고급 내용은 조금 더 깊이 있게 다뤄주셨으면 합니다.',
    createdAt: '2024-12-05',
    helpful: 18,
    isVerified: true,
  },
];

type TabType = 'about' | 'courses' | 'roadmaps' | 'reviews';

export function InstructorProfilePage() {
  const { instructorId } = useParams<{ instructorId: string }>();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const id = Number(instructorId);

  // API 훅 (USE_API가 true일 때만 활성화)
  const { data: profileData, isLoading: profileLoading } = useInstructorProfile(id, USE_API);
  const { data: coursesData, isLoading: coursesLoading } = useInstructorCourses(id, 1, USE_API);
  const { data: roadmapsData } = useInstructorRoadmaps(id, USE_API);
  const { data: reviewsData, isLoading: reviewsLoading } = useInstructorReviews(id, 1, USE_API);
  const followMutation = useFollowInstructor();
  const unfollowMutation = useUnfollowInstructor();

  // 데이터 선택 (API 또는 더미)
  const instructor = USE_API ? profileData?.instructor : dummyInstructor;
  const courses = USE_API ? coursesData?.courses : dummyCourses;
  const roadmaps = USE_API ? roadmapsData?.roadmaps : dummyRoadmaps;
  const reviews = USE_API ? reviewsData?.reviews : dummyReviews;

  const isLoading = USE_API && profileLoading;

  const handleFollow = () => {
    if (USE_API) {
      if (isFollowing) {
        unfollowMutation.mutate(id);
      } else {
        followMutation.mutate(id);
      }
    }
    setIsFollowing(!isFollowing);
  };

  const handleShare = async () => {
    const url = window.location.href;

    // Web Share API 지원 확인 (모바일 등)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${instructor?.name} - 강사 프로필`,
          text: `${instructor?.name} 강사의 프로필을 확인해보세요!`,
          url: url,
        });
      } catch {
        // 사용자가 공유를 취소한 경우
      }
    } else {
      // 클립보드에 복사
      try {
        await navigator.clipboard.writeText(url);
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 2000);
      } catch {
        // 클립보드 복사 실패 시 fallback
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 2000);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen dark-scrollbar ${isDark ? 'landing-dark' : 'landing-light'}`}>
        <LandingHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
        </div>
        <LandingFooter />
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className={`min-h-screen dark-scrollbar ${isDark ? 'landing-dark' : 'landing-light'}`}>
        <LandingHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>강사를 찾을 수 없습니다.</p>
          <Link to="/tu/main" className="mt-4 text-[#6778ff] hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
        <LandingFooter />
      </div>
    );
  }

  const tabs = [
    { id: 'about' as const, label: '소개' },
    { id: 'courses' as const, label: '강의', count: courses?.length || 0 },
    { id: 'roadmaps' as const, label: '로드맵', count: roadmaps?.length || 0 },
    { id: 'reviews' as const, label: '수강평', count: instructor.reviewCount },
  ];

  return (
    <div className={`min-h-screen dark-scrollbar ${isDark ? 'landing-dark' : 'landing-light'}`}>
      <LandingHeader />

      {/* 커버 이미지 */}
      <div className="relative h-48 md:h-64 lg:h-80">
        <img
          src={instructor.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=400&fit=crop'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* 프로필 섹션 */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
        <div className={`rounded-2xl p-6 md:p-8 shadow-xl backdrop-blur-xl ${isDark ? 'glass border border-white/10' : 'bg-white/80 border border-white/50'}`}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* 프로필 이미지 */}
            <div className="flex-shrink-0">
              <img
                src={instructor.profileImage}
                alt={instructor.name}
                className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 shadow-lg object-cover ${isDark ? 'border-[#6778ff]/30 ring-4 ring-[#6778ff]/10' : 'border-white'}`}
              />
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold landing-text-primary">
                    {instructor.name}
                  </h1>
                  <p className="text-lg mt-1 landing-text-secondary">
                    {instructor.title}
                  </p>
                  <p className="text-[#6778ff] font-medium mt-1">{instructor.specialty}</p>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleFollow}
                    className={`gap-2 ${
                      isFollowing
                        ? isDark
                          ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-[#6778ff] text-white hover:bg-[#5563dd]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
                    {isFollowing ? '팔로잉' : '팔로우'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className={`gap-2 ${isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}`}
                  >
                    <Share2 className="w-4 h-4" />
                    공유
                  </Button>
                </div>
              </div>

              {/* 통계 */}
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold landing-text-primary">
                    {instructor.rating}
                  </span>
                  <span className="landing-text-muted">
                    ({instructor.reviewCount.toLocaleString()} 리뷰)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold landing-text-primary">
                    {instructor.studentCount.toLocaleString()}
                  </span>
                  <span className="landing-text-muted">수강생</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <span className="font-semibold landing-text-primary">
                    {instructor.courseCount}
                  </span>
                  <span className="landing-text-muted">강의</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-semibold landing-text-primary">
                    {instructor.followerCount.toLocaleString()}
                  </span>
                  <span className="landing-text-muted">팔로워</span>
                </div>
              </div>

              {/* 소셜 링크 */}
              <div className="flex gap-3 mt-4">
                {instructor.socialLinks.website && (
                  <a href={instructor.socialLinks.website} target="_blank" rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-all ${isDark ? 'bg-white/10 hover:bg-[#6778ff]/30 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {instructor.socialLinks.linkedin && (
                  <a href={instructor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-all ${isDark ? 'bg-white/10 hover:bg-[#0077b5]/30 text-gray-300 hover:text-[#0077b5]' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-[#0077b5]'}`}>
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {instructor.socialLinks.github && (
                  <a href={instructor.socialLinks.github} target="_blank" rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-all ${isDark ? 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}>
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {instructor.socialLinks.youtube && (
                  <a href={instructor.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-all ${isDark ? 'bg-white/10 hover:bg-[#ff0000]/30 text-gray-300 hover:text-[#ff0000]' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-[#ff0000]'}`}>
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className={`flex gap-1 p-1.5 rounded-xl ${isDark ? 'glass border border-white/10' : 'bg-gray-100'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#6778ff] text-white shadow-lg shadow-[#6778ff]/25'
                  : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-2 text-sm ${activeTab === tab.id ? 'text-white/80' : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* 강의 탭 */}
        {activeTab === 'courses' && (
          <div>
            {coursesLoading && USE_API ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses?.map((course) => {
                  const tags: string[] = [];
                  if (course.isNew) tags.push('NEW');
                  if (course.isBestseller) tags.push('베스트');
                  if (course.discount > 0) tags.push('할인중');

                  return (
                    <Link
                      key={course.id}
                      to={`/tu/main/courses/${course.id}`}
                      className="group block h-full"
                    >
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
                          {/* 찜 버튼 */}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // TODO: 찜 기능 구현
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-red-500 transition-all duration-300"
                            aria-label="찜하기"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
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
                })}
              </div>
            )}
          </div>
        )}

        {/* 로드맵 탭 */}
        {activeTab === 'roadmaps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmaps?.map((roadmap) => (
              <Link
                key={roadmap.id}
                to={`/tu/main/roadmaps/${roadmap.id}`}
                className={`block rounded-2xl p-6 card-hover cursor-pointer group border transition-all ${
                  isDark
                    ? 'glass border-white/10'
                    : 'bg-white border-gray-200 shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6778ff] to-[#a855f7] flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#6778ff]/20 text-[#6778ff]">
                    {roadmap.level}
                  </span>
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
                    {roadmap.totalDuration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {roadmap.enrolledCount.toLocaleString()}명
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
            ))}
          </div>
        )}

        {/* 수강평 탭 */}
        {activeTab === 'reviews' && (
          <div>
            {reviewsLoading && USE_API ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
              </div>
            ) : (
              <div className="space-y-4">
                {reviews?.map((review) => (
                  <div
                    key={review.id}
                    className={`rounded-2xl p-6 transition-all border ${isDark ? 'glass border-white/10 hover:border-white/20' : 'bg-white border-gray-200 hover:shadow-md'}`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=6778ff&color=fff`}
                        alt={review.userName}
                        className={`w-12 h-12 rounded-full object-cover ${isDark ? 'ring-2 ring-white/10' : ''}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold landing-text-primary">
                                {review.userName}
                              </span>
                              {review.isVerified && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                  수강인증
                                </span>
                              )}
                            </div>
                            <p className="text-sm landing-text-muted">
                              {review.courseTitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : isDark ? 'text-gray-600' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-3 leading-relaxed landing-text-secondary">
                          {review.content}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <span className="text-sm landing-text-muted">
                            {review.createdAt}
                          </span>
                          <button className={`text-sm flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                            👍 도움이 됨 ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 소개 탭 */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={`rounded-2xl p-6 border ${isDark ? 'glass border-white/10' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-4 landing-text-primary">
                  소개
                </h3>
                <div className="whitespace-pre-line leading-relaxed landing-text-secondary">
                  {instructor.description}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* 경력 */}
              <div className={`rounded-2xl p-6 border ${isDark ? 'glass border-white/10' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 landing-text-primary">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-[#6778ff]/20' : 'bg-[#6778ff]/10'}`}>
                    <MapPin className="w-5 h-5 text-[#6778ff]" />
                  </div>
                  경력
                </h3>
                <ul className="space-y-3">
                  {instructor.experience.map((exp, index) => (
                    <li key={index} className="flex items-start gap-2 landing-text-secondary">
                      <ChevronRight className="w-4 h-4 mt-1 text-[#6778ff] flex-shrink-0" />
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 자격증 */}
              <div className={`rounded-2xl p-6 border ${isDark ? 'glass border-white/10' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 landing-text-primary">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-[#6778ff]/20' : 'bg-[#6778ff]/10'}`}>
                    <Award className="w-5 h-5 text-[#6778ff]" />
                  </div>
                  자격증
                </h3>
                <ul className="space-y-3">
                  {instructor.certifications.map((cert, index) => (
                    <li key={index} className="flex items-start gap-2 landing-text-secondary">
                      <ChevronRight className="w-4 h-4 mt-1 text-[#6778ff] flex-shrink-0" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <LandingFooter />

      {/* 복사 완료 토스트 */}
      {showCopiedToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
            isDark
              ? 'bg-[#6778ff] text-white'
              : 'bg-gray-900 text-white'
          }`}>
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">링크가 클립보드에 복사되었습니다</span>
          </div>
        </div>
      )}
    </div>
  );
}
