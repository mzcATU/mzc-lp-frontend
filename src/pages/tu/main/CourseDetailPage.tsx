import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSubdomainPath } from '@/hooks/common';
import {
  Clock,
  Users,
  PlayCircle,
  FileText,
  ShoppingCart,
  Heart,
  Share2,
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle,
  Calendar,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/common/themeStore';
import { useAuthStore } from '@/store/common/authStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { CourseCommunitySection } from '@/components/domain/course-community';
import { CourseReviewSection } from '@/components/domain/course-review';
import { useCourseTimeDetail, useEnroll, useMyEnrollments, useCheckWishlistStatus, useToggleWishlist, useCheckCartStatus, useToggleCart } from '@/hooks/tu';
import type { CurriculumItemResponse } from '@/types/tu/courseTimeCatalog.types';
import {
  DELIVERY_TYPE_LABELS,
  PROGRAM_LEVEL_LABELS,
  ENROLLMENT_METHOD_LABELS,
  COURSE_TIME_STATUS_LABELS,
} from '@/types/tu/courseTimeCatalog.types';

/**
 * 날짜 포맷팅 (YYYY.MM.DD)
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * 커리큘럼 섹션 컴포넌트 (트리 구조)
 */
interface CurriculumSectionProps {
  item: CurriculumItemResponse;
  isExpanded: boolean;
  onToggle: () => void;
  isDark: boolean;
}

function CurriculumSection({ item, isExpanded, onToggle, isDark }: CurriculumSectionProps) {
  if (!item.isFolder) {
    // 콘텐츠 아이템 - 카드 스타일로 표시
    return (
      <div
        className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
          isDark
            ? 'glass border-white/10 hover:bg-white/5'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-white/10' : 'bg-gray-100'
            }`}
          >
            <PlayCircle className={`w-4 h-4 ${isDark ? 'text-[#6bc2f0]' : 'text-[#6778ff]'}`} />
          </div>
          <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {item.itemName}
          </span>
        </div>
        {item.duration && (
          <span
            className={`text-sm px-2 py-1 rounded-md ${
              isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
          </span>
        )}
      </div>
    );
  }

  // 폴더 아이템
  const childCount = item.children?.length || 0;

  return (
    <div
      className={`rounded-xl overflow-hidden border ${
        isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 transition-colors ${
          isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''} ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {item.itemName}
          </span>
        </div>
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {childCount}개 항목
        </span>
      </button>
      {isExpanded && item.children && item.children.length > 0 && (
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          {item.children.map((child) => (
            <div
              key={child.id}
              className={`flex items-center justify-between p-4 pl-12 transition-colors ${
                isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-white/10' : 'bg-gray-100'
                  }`}
                >
                  {child.isFolder ? (
                    <FileText className={`w-4 h-4 ${isDark ? 'text-[#6bc2f0]' : 'text-[#6778ff]'}`} />
                  ) : (
                    <PlayCircle className={`w-4 h-4 ${isDark ? 'text-[#6bc2f0]' : 'text-[#6778ff]'}`} />
                  )}
                </div>
                <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{child.itemName}</span>
              </div>
              {child.duration && (
                <span
                  className={`text-sm px-2 py-1 rounded-md ${
                    isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {Math.floor(child.duration / 60)}:{String(child.duration % 60).padStart(2, '0')}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const courseTimeId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();

  // CourseTime 상세 조회
  const { data: courseTime, isLoading, error } = useCourseTimeDetail(courseTimeId);

  // 수강 신청 mutation
  const enrollMutation = useEnroll();

  // 인증 상태
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // 내 수강 신청 목록 조회 (이미 수강 중인지 확인용)
  const { data: myEnrollments } = useMyEnrollments({ size: 100 });

  // 이미 수강 신청된 강의인지 확인
  const existingEnrollment = myEnrollments?.content.find(
    (enrollment) => enrollment.courseTimeId === courseTimeId
  );
  const isAlreadyEnrolled = !!existingEnrollment;

  // 찜 상태 확인 및 토글
  const { data: isWishlisted = false, isLoading: isWishlistChecking } = useCheckWishlistStatus(
    courseTimeId,
    isAuthenticated
  );
  const { toggle: toggleWishlist, isLoading: isWishlistToggling } = useToggleWishlist();

  // 장바구니 상태 확인 및 토글
  const { data: isInCart = false, isLoading: isCartChecking } = useCheckCartStatus(
    courseTimeId,
    isAuthenticated
  );
  const toggleCartMutation = useToggleCart();

  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'intro' | 'curriculum' | 'review' | 'community'>('intro');
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const toggleSection = (index: number) => {
    if (expandedSections.includes(index)) {
      setExpandedSections(expandedSections.filter((i) => i !== index));
    } else {
      setExpandedSections([...expandedSections, index]);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      navigate('/auth/login', { state: { from: prefixPath(`/tu/b2c/times/${courseTimeId}`) } });
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
        // 공유 취소 또는 실패 시 클립보드로 fallback
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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      navigate('/auth/login', { state: { from: prefixPath(`/tu/b2c/times/${courseTimeId}`) } });
      return;
    }

    try {
      await toggleCartMutation.mutateAsync({ courseTimeId, isInCart });
      toast.success(isInCart ? '장바구니에서 제거되었습니다.' : '장바구니에 추가되었습니다.');
    } catch {
      toast.error('장바구니 변경에 실패했습니다.');
    }
  };

  const handleEnroll = () => {
    // 로그인 체크
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      navigate('/auth/login', { state: { from: prefixPath(`/tu/b2c/courses/${courseTimeId}`) } });
      return;
    }

    // 이미 수강 신청된 강의인지 체크
    if (isAlreadyEnrolled) {
      toast.error('이미 수강 신청된 강의입니다.');
      return;
    }

    // 수강 신청 API 호출
    enrollMutation.mutate(courseTimeId, {
      onSuccess: () => {
        toast.success('수강 신청이 완료되었습니다.');
        // 내 학습 페이지로 이동
        navigate(prefixPath('/tu/b2c/mypage/learning'));
      },
      onError: (error: Error & { response?: { data?: { error?: { message?: string } } } }) => {
        const message = error.response?.data?.error?.message || '수강 신청에 실패했습니다.';
        toast.error(message);
      },
    });
  };

  // 로딩 상태
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

  // 에러 상태
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
          <Link to={prefixPath('/tu/b2c/courses')} className="text-[#6778ff] hover:underline mt-4 inline-block">
            강의 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 가격 정보
  const price = courseTime.isFree ? 0 : parseFloat(courseTime.price);
  const priceDisplay = courseTime.isFree ? '무료' : `₩${price.toLocaleString()}`;

  // 썸네일
  const thumbnailUrl =
    courseTime.program?.thumbnailUrl ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop';

  // 주강사
  const mainInstructor = courseTime.instructors.find((i) => i.role === 'MAIN');
  const instructorName = mainInstructor?.name || courseTime.instructors[0]?.name || '';
  const instructorImage = mainInstructor?.profileImageUrl || courseTime.instructors[0]?.profileImageUrl;

  // 레벨 라벨
  const levelLabel = courseTime.program?.level
    ? PROGRAM_LEVEL_LABELS[courseTime.program.level]
    : null;

  // 모집 가능 여부 (모집중 또는 진행중일 때 수강 신청 가능)
  const canEnroll = courseTime.status === 'RECRUITING' || courseTime.status === 'ONGOING';

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <LandingHeader />

      {/* Hero Section */}
      <div
        className={`py-12 ${
          isDark
            ? 'bg-gradient-to-b from-[#1a1a2e] to-[#1e1e1e]'
            : 'bg-gradient-to-b from-gray-100 to-gray-50'
        }`}
      >
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
            {/* Left Content */}
            <div className="flex-1">
              {/* Breadcrumb */}
              <nav
                className={`flex items-center gap-2 text-sm mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <Link
                  to="/tu/b2c/courses"
                  className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
                >
                  강의
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{courseTime.title}</span>
              </nav>

              {/* Tags */}
              <div className="flex gap-2 mb-4">
                {/* 상태 태그 */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    courseTime.status === 'RECRUITING'
                      ? 'bg-green-500/20 text-green-400'
                      : courseTime.status === 'ONGOING'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {COURSE_TIME_STATUS_LABELS[courseTime.status]}
                </span>

                {/* 상시모집 태그 */}
                {courseTime.isOnDemand && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#70f2a0] to-[#6bc2f0] text-white">
                    상시모집
                  </span>
                )}

                {/* 무료 태그 */}
                {courseTime.isFree && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#ff7867] to-[#ff9a5a] text-white">
                    무료
                  </span>
                )}

                {/* 운영 방식 */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {DELIVERY_TYPE_LABELS[courseTime.deliveryType]}
                </span>
              </div>

              {/* Title */}
              <h1
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {courseTime.title}
              </h1>

              {/* Description */}
              {courseTime.program?.description && (
                <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {courseTime.program.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* 수강생 수 */}
                {courseTime.currentEnrollment > 0 && (
                  <div
                    className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <Users className="w-5 h-5" />
                    <span>{courseTime.currentEnrollment.toLocaleString()}명 수강중</span>
                  </div>
                )}

                {/* 예상 학습 시간 */}
                {courseTime.program?.estimatedHours && (
                  <div
                    className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <Clock className="w-5 h-5" />
                    <span>총 {courseTime.program.estimatedHours}시간</span>
                  </div>
                )}

                {/* 레벨 */}
                {levelLabel && (
                  <div
                    className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <FileText className="w-5 h-5" />
                    <span>{levelLabel}</span>
                  </div>
                )}
              </div>

              {/* Instructor */}
              {instructorName && (
                <div className="flex items-center gap-3 mb-8">
                  {instructorImage ? (
                    <img
                      src={instructorImage}
                      alt={instructorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-white/10' : 'bg-gray-200'
                      }`}
                    >
                      <Users className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <p
                      className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      {instructorName}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      강사
                    </p>
                  </div>
                </div>
              )}

              {/* Thumbnail */}
              <div
                className={`rounded-xl overflow-hidden border ${
                  isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                }`}
              >
                <div className="relative aspect-video">
                  <img
                    src={thumbnailUrl}
                    alt={courseTime.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right - Course Card */}
            <div className="lg:w-96">
              <div
                className={`rounded-2xl overflow-hidden sticky top-24 border ${
                  isDark ? 'glass border-white/10' : 'bg-white border-gray-200 shadow-lg'
                }`}
              >
                <div className="p-6">
                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                    >
                      {priceDisplay}
                    </span>
                  </div>

                  {/* 모집 기간 (상시모집이 아닌 경우) */}
                  {!courseTime.isOnDemand && (
                    <div
                      className={`mb-4 p-3 rounded-lg ${
                        isDark ? 'bg-white/5' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          모집 기간
                        </span>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(courseTime.enrollStartDate)} ~ {formatDate(courseTime.enrollEndDate)}
                      </p>

                      <div className="flex items-center gap-2 mt-3 mb-2">
                        <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          수강 기간
                        </span>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(courseTime.classStartDate)} ~ {formatDate(courseTime.classEndDate)}
                      </p>
                    </div>
                  )}

                  {/* 잔여석 */}
                  {courseTime.capacity !== null && (
                    <div
                      className={`mb-4 p-3 rounded-lg ${
                        courseTime.availableSeats <= 5
                          ? 'bg-orange-500/10'
                          : isDark
                            ? 'bg-white/5'
                            : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          모집 인원
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            courseTime.availableSeats <= 5
                              ? 'text-orange-500'
                              : isDark
                                ? 'text-white'
                                : 'text-gray-900'
                          }`}
                        >
                          {courseTime.currentEnrollment} / {courseTime.capacity}명
                          {courseTime.availableSeats <= 5 && ` (잔여 ${courseTime.availableSeats}석)`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 수강신청 방식 */}
                  <div
                    className={`mb-4 flex items-center gap-2 text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{ENROLLMENT_METHOD_LABELS[courseTime.enrollmentMethod]} 방식</span>
                  </div>

                  {/* 장소 (오프라인/블렌디드인 경우) */}
                  {(courseTime.deliveryType === 'OFFLINE' || courseTime.deliveryType === 'BLENDED') &&
                    courseTime.locationInfo && (
                      <div
                        className={`mb-4 flex items-start gap-2 text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{courseTime.locationInfo}</span>
                      </div>
                    )}

                  {/* Buttons */}
                  <div className="space-y-3">
                    {isAlreadyEnrolled ? (
                      <>
                        <button
                          onClick={() => navigate(prefixPath(`/tu/b2c/mypage/learning/${existingEnrollment?.id}`))}
                          className="w-full landing-btn-primary py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2"
                        >
                          <PlayCircle className="w-5 h-5" />
                          학습 계속하기
                        </button>
                        <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          이미 수강 신청된 강의입니다
                        </p>
                      </>
                    ) : canEnroll ? (
                      <>
                        <button
                          onClick={handleEnroll}
                          disabled={enrollMutation.isPending}
                          className="w-full landing-btn-primary py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {enrollMutation.isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              신청 중...
                            </>
                          ) : (
                            '수강 신청'
                          )}
                        </button>
                        <button
                          onClick={handleAddToCart}
                          disabled={toggleCartMutation.isPending || isCartChecking}
                          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isInCart
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : isDark
                                ? 'bg-white text-gray-900 hover:bg-gray-100'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                          }`}
                        >
                          {toggleCartMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-5 h-5" />
                          )}
                          {isInCart ? '장바구니에 담김' : '장바구니 담기'}
                        </button>
                      </>
                    ) : (
                      <button
                        disabled
                        className="w-full py-4 rounded-xl font-bold text-lg bg-gray-400 text-white cursor-not-allowed"
                      >
                        {courseTime.status === 'ONGOING'
                          ? '진행 중인 강의입니다'
                          : '모집이 마감되었습니다'}
                      </button>
                    )}

                    <div className="flex gap-3">
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
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        )}
                        {isWishlisted ? '찜함' : '찜하기'}
                      </button>
                      <button
                        onClick={handleShare}
                        className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors border ${
                          isDark
                            ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <Share2 className="w-5 h-5" />
                        공유
                      </button>
                    </div>
                  </div>

                  {/* 수료 조건 */}
                  {courseTime.minProgressForCompletion && (
                    <div
                      className={`mt-6 pt-6 border-t text-sm ${
                        isDark ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>수료 조건: 진도율 {courseTime.minProgressForCompletion}% 이상</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="flex gap-8 max-w-4xl">
            <button
              onClick={() => setActiveTab('intro')}
              className={`py-4 font-medium transition-colors relative ${
                activeTab === 'intro'
                  ? isDark
                    ? 'text-white'
                    : 'text-gray-900'
                  : isDark
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              강의 소개
              {activeTab === 'intro' && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    isDark ? 'bg-white' : 'bg-gray-900'
                  }`}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`py-4 font-medium transition-colors relative ${
                activeTab === 'curriculum'
                  ? isDark
                    ? 'text-white'
                    : 'text-gray-900'
                  : isDark
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              커리큘럼
              {activeTab === 'curriculum' && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    isDark ? 'bg-white' : 'bg-gray-900'
                  }`}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`py-4 font-medium transition-colors relative ${
                activeTab === 'review'
                  ? isDark
                    ? 'text-white'
                    : 'text-gray-900'
                  : isDark
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              수강평
              {activeTab === 'review' && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    isDark ? 'bg-white' : 'bg-gray-900'
                  }`}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`py-4 font-medium transition-colors relative ${
                activeTab === 'community'
                  ? isDark
                    ? 'text-white'
                    : 'text-gray-900'
                  : isDark
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              커뮤니티
              {activeTab === 'community' && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    isDark ? 'bg-white' : 'bg-gray-900'
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-4xl">
          {/* 강의 소개 탭 */}
          {activeTab === 'intro' && (
            <>
              {/* 프로그램 설명 */}
              {courseTime.program?.description && (
                <section className="mb-12">
                  <h2
                    className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    강의 소개
                  </h2>
                  <div
                    className={`rounded-xl p-6 border ${
                      isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                    }`}
                  >
                    <p className={`leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {courseTime.program.description}
                    </p>
                  </div>
                </section>
              )}

              {/* 강사 소개 */}
              {courseTime.instructors.length > 0 && (
                <section className="mb-12">
                  <h2
                    className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    강사 소개
                  </h2>
                  <div className="space-y-4">
                    {courseTime.instructors.map((instructor) => (
                      <div
                        key={instructor.id}
                        className={`rounded-xl p-6 border ${
                          isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {instructor.profileImageUrl ? (
                            <img
                              src={instructor.profileImageUrl}
                              alt={instructor.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                isDark ? 'bg-white/10' : 'bg-gray-200'
                              }`}
                            >
                              <Users className="w-8 h-8" />
                            </div>
                          )}
                          <div>
                            <h3
                              className={`text-lg font-bold ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}
                            >
                              {instructor.name}
                            </h3>
                            <span
                              className={`text-sm px-2 py-0.5 rounded ${
                                instructor.role === 'MAIN'
                                  ? 'bg-[#6778ff]/20 text-[#6778ff]'
                                  : isDark
                                    ? 'bg-white/10 text-gray-400'
                                    : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {instructor.role === 'MAIN'
                                ? '주강사'
                                : instructor.role === 'SUB'
                                  ? '보조강사'
                                  : '조교'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* 커리큘럼 탭 */}
          {activeTab === 'curriculum' && (
            <section className="mb-12">
              <h2
                className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                커리큘럼
              </h2>
              {courseTime.curriculum && courseTime.curriculum.length > 0 ? (
                <div className="space-y-3">
                  {courseTime.curriculum.map((item, index) => (
                    <CurriculumSection
                      key={item.id}
                      item={item}
                      isExpanded={expandedSections.includes(index)}
                      onToggle={() => toggleSection(index)}
                      isDark={isDark}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className={`rounded-xl p-8 text-center border ${
                    isDark ? 'glass border-white/10' : 'bg-white border-gray-200'
                  }`}
                >
                  <FileText
                    className={`w-12 h-12 mx-auto mb-4 ${
                      isDark ? 'text-gray-600' : 'text-gray-300'
                    }`}
                  />
                  <p className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    커리큘럼 준비 중
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    상세 커리큘럼은 곧 업데이트될 예정입니다.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* 수강평 탭 */}
          {activeTab === 'review' && (
            <section className="mb-12">
              <CourseReviewSection
                timeId={courseTimeId}
                isDark={isDark}
                canWrite={isAlreadyEnrolled}
              />
            </section>
          )}

          {/* 커뮤니티 탭 */}
          {activeTab === 'community' && (
            <section className="mb-12">
              <CourseCommunitySection
                timeId={courseTimeId}
                isDark={isDark}
                canWrite={isAlreadyEnrolled}
                instructorIds={courseTime?.instructors?.map((i) => i.id)}
              />
            </section>
          )}
        </div>
      </main>

      <LandingFooter />

      {/* 복사 완료 토스트 */}
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
