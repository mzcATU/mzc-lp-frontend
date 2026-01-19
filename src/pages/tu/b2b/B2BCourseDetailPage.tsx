import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useSubdomainPath } from '@/hooks/common';
import {
  Clock,
  Users,
  PlayCircle,
  FileText,
  Heart,
  Share2,
  Loader2,
  CheckCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/common/themeStore';
import { useAuthStore } from '@/store/common/authStore';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { B2BLandingHeader } from './components/B2BLandingHeader';
import { B2BCurriculumSection } from './components/B2BCurriculumSection';
import { B2BAnnouncementSection } from './components/B2BAnnouncementSection';
import { B2BInstructorCard } from './components/B2BInstructorCard';
import { B2BLearningPointsCard } from './components/B2BLearningPointsCard';
import { useCourseTimeDetail, useEnroll, useMyEnrollments, useCheckWishlistStatus, useToggleWishlist } from '@/hooks/tu';
import {
  DELIVERY_TYPE_LABELS,
  PROGRAM_LEVEL_LABELS,
} from '@/types/tu/courseTimeCatalog.types';

// 학습 포인트 Mock 데이터
const MOCK_LEARNING_POINTS = [
  '핵심 개념과 원리 이해',
  '실무 적용 가능한 스킬 습득',
  '프로젝트 기반 실습 경험',
  '체계적인 학습 로드맵 제공',
];

/**
 * B2B 강의 상세 페이지
 * - 가격 표시 없음
 * - 장바구니 버튼 없음
 * - 커뮤니티 탭 없음
 */
export function B2BCourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const courseTimeId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();

  const { data: courseTime, isLoading, error } = useCourseTimeDetail(courseTimeId);
  const enrollMutation = useEnroll();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: myEnrollments } = useMyEnrollments({ size: 100 });

  const existingEnrollment = myEnrollments?.content.find(
    (enrollment) => enrollment.courseTimeId === courseTimeId
  );
  const isAlreadyEnrolled = !!existingEnrollment;

  const { data: isWishlisted = false, isLoading: isWishlistChecking } = useCheckWishlistStatus(
    courseTimeId,
    isAuthenticated
  );
  const { toggle: toggleWishlist, isLoading: isWishlistToggling } = useToggleWishlist();

  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      navigate('/auth/login', { state: { from: prefixPath(`/tu/b2b/times/${courseTimeId}`) } });
      return;
    }

    try {
      await toggleWishlist(courseTimeId, isWishlisted);
      toast.success(isWishlisted ? '찜 목록에서 제거되었습니다.' : '찜 목록에 추가되었습니다.');
    } catch {
      toast.error('찜 목록 변경에 실패했습니다.');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    const copyToClipboard = () => {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    };

    if (navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: courseTime?.title || '',
          text: `"${courseTime?.title}" 강의를 확인해보세요!`,
          url,
        });
        return;
      } catch {
        // fallback
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 2000);
      } catch {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      navigate('/auth/login', { state: { from: prefixPath(`/tu/b2b/courses/${courseTimeId}`) } });
      return;
    }

    if (isAlreadyEnrolled) {
      toast.error('이미 수강 신청된 강의입니다.');
      return;
    }

    enrollMutation.mutate(courseTimeId, {
      onSuccess: () => {
        toast.success('수강 신청이 완료되었습니다.');
        navigate(prefixPath('/tu/b2c/mypage/learning'));
      },
      onError: (error: Error & { response?: { data?: { error?: { message?: string } } } }) => {
        const message = error.response?.data?.error?.message || '수강 신청에 실패했습니다.';
        toast.error(message);
      },
    });
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'
        }`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
      </div>
    );
  }

  if (error || !courseTime) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'
        }`}
      >
        <div className="text-center">
          <p className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            강의를 불러올 수 없습니다.
          </p>
          <Link to={prefixPath('/tu/b2b/courses')} className="text-[#6778ff] hover:underline mt-4 inline-block">
            강의 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const thumbnailUrl =
    courseTime.program?.thumbnailUrl ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop';

  const mainInstructor = courseTime.instructors.find((i) => i.role === 'MAIN');
  const instructorName = mainInstructor?.name || courseTime.instructors[0]?.name || '';
  const instructorImage = mainInstructor?.profileImageUrl || courseTime.instructors[0]?.profileImageUrl;

  const levelLabel = courseTime.program?.level
    ? PROGRAM_LEVEL_LABELS[courseTime.program.level]
    : null;

  const canEnroll = courseTime.status === 'RECRUITING' || courseTime.status === 'ONGOING';

  const handleCurriculumItemClick = (itemId: number) => {
    console.log('Curriculum item clicked:', itemId);
    // TODO: 학습 페이지로 이동
  };

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <B2BLandingHeader />

      {/* Main Content - 2 Column Layout */}
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Course Info */}
            <div className="flex-1 min-w-0">
              {/* Thumbnail Image with Enhanced Style */}
              <div className="relative rounded-2xl overflow-hidden mb-6 shadow-xl">
                <div className="relative aspect-video">
                  <img
                    src={thumbnailUrl}
                    alt={courseTime.title}
                    className="w-full h-full object-cover"
                  />
                  {/* "언제든 수강 가능" Badge */}
                  {courseTime.isOnDemand && (
                    <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-sm font-bold flex items-center gap-2 shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      <span>언제든 수강 가능</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Rating */}
              <h1
                className={`text-3xl md:text-4xl font-extrabold mb-4 leading-tight ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {courseTime.title}
              </h1>

              {/* Meta Info (Rating, Enrollment Count, etc.) */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* TODO: 평점 API 추가 시 활성화 */}
                {/* <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">⭐</span>
                    ))}
                  </div>
                  <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    4.8
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    (48개 리뷰)
                  </span>
                </div> */}

                {courseTime.currentEnrollment > 0 && (
                  <div
                    className={`flex items-center gap-1.5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {courseTime.currentEnrollment.toLocaleString()}명이 학습 중
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {courseTime.program?.description && (
                <p
                  className={`text-base leading-relaxed mb-6 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {courseTime.program.description}
                </p>
              )}

              {/* Simple Meta Badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                {levelLabel && (
                  <div
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-2 ${
                      isDark ? 'bg-white/5' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6778ff]' : 'text-purple-600'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {levelLabel}
                    </span>
                  </div>
                )}

                <div
                  className={`px-4 py-2.5 rounded-xl flex items-center gap-2 ${
                    isDark ? 'bg-white/5' : 'bg-white border border-gray-200'
                  }`}
                >
                  <PlayCircle className={`w-4 h-4 ${isDark ? 'text-[#6778ff]' : 'text-purple-600'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {DELIVERY_TYPE_LABELS[courseTime.deliveryType]}
                  </span>
                </div>

                {courseTime.program?.estimatedHours && (
                  <div
                    className={`px-4 py-2.5 rounded-xl flex items-center gap-2 ${
                      isDark ? 'bg-white/5' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <Clock className={`w-4 h-4 ${isDark ? 'text-[#6778ff]' : 'text-purple-600'}`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      총 {courseTime.program.estimatedHours}시간
                    </span>
                  </div>
                )}
              </div>

              {/* Announcements Section */}
              <B2BAnnouncementSection courseTimeId={courseTimeId} isDark={isDark} />
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:w-[420px] shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Curriculum Section */}
                {isAlreadyEnrolled ? (
                  <B2BCurriculumSection
                    curriculum={courseTime.curriculum}
                    enrollmentId={existingEnrollment?.id}
                    onItemClick={handleCurriculumItemClick}
                    isDark={isDark}
                  />
                ) : (
                  <>
                    {/* Enrollment Info Card */}
                    <div
                      className={`rounded-2xl overflow-hidden border ${
                        isDark ? 'glass border-white/10' : 'bg-white border-gray-200 shadow-lg'
                      }`}
                    >
                      <div className="p-6">
                        {/* Capacity Progress */}
                        {courseTime.capacity !== null && (
                          <div
                            className={`mb-5 p-4 rounded-xl ${
                              isDark ? 'bg-white/5' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                수강 신청
                              </span>
                              <div className="flex items-center gap-1.5">
                                <Users className={`w-4 h-4 ${isDark ? 'text-[#6778ff]' : 'text-purple-600'}`} />
                                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {courseTime.currentEnrollment}/{courseTime.capacity}명
                                </span>
                              </div>
                            </div>
                            <div
                              className={`w-full h-1.5 rounded-full overflow-hidden ${
                                isDark ? 'bg-white/10' : 'bg-gray-200'
                              }`}
                            >
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{
                                  width: `${(courseTime.currentEnrollment / courseTime.capacity) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Completion Condition */}
                        {courseTime.minProgressForCompletion && (
                          <div
                            className={`mb-6 p-3.5 rounded-xl border ${
                              isDark
                                ? 'bg-green-500/10 border-green-500/20'
                                : 'bg-green-50 border-green-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span
                                className={`text-sm font-semibold ${
                                  isDark ? 'text-green-400' : 'text-green-700'
                                }`}
                              >
                                진도율 {courseTime.minProgressForCompletion}% 이상 시 수료!
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Enroll Button */}
                        {canEnroll ? (
                          <button
                            onClick={handleEnroll}
                            disabled={enrollMutation.isPending}
                            className="w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {enrollMutation.isPending ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                신청 중...
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-5 h-5" />
                                지금 바로 시작하기
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full py-4 rounded-xl font-bold text-lg bg-gray-400 text-white cursor-not-allowed"
                          >
                            모집이 마감되었습니다
                          </button>
                        )}

                        {/* Wishlist & Share */}
                        <div className="flex gap-3 mt-3">
                          <button
                            onClick={handleWishlistToggle}
                            disabled={isWishlistToggling || isWishlistChecking}
                            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border disabled:opacity-50 disabled:cursor-not-allowed ${
                              isWishlisted
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : isDark
                                  ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {isWishlistToggling ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                            )}
                            <span className="text-sm">{isWishlisted ? '찜함' : '찜하기'}</span>
                          </button>
                          <button
                            onClick={handleShare}
                            className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border ${
                              isDark
                                ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm">공유</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Curriculum Preview Card */}
                    {courseTime.curriculum.length > 0 && (
                      <B2BCurriculumSection
                        curriculum={courseTime.curriculum}
                        onItemClick={handleCurriculumItemClick}
                        isDark={isDark}
                      />
                    )}
                  </>
                )}

                {/* Instructor Card */}
                {instructorName && (
                  <B2BInstructorCard
                    instructorName={instructorName}
                    instructorImage={instructorImage}
                    isDark={isDark}
                  />
                )}

                {/* Learning Points Card */}
                <B2BLearningPointsCard points={MOCK_LEARNING_POINTS} isDark={isDark} />
              </div>
            </div>
          </div>
        </div>
      </div>


      <LandingFooter />

      {showCopiedToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
              isDark ? 'bg-[#6778ff] text-white' : 'bg-gray-900 text-white'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">링크가 클립보드에 복사되었습니다</span>
          </div>
        </div>
      )}
    </div>
  );
}
