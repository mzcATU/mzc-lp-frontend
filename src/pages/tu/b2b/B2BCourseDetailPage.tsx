import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSubdomainPath } from '@/hooks/common';
import {
  Clock,
  Users,
  PlayCircle,
  FileText,
  Heart,
  Share2,
  ChevronRight,
  ChevronDown,
  Loader2,
  CheckCircle,
  Calendar,
  MapPin,
  AlertCircle,
  Megaphone,
} from 'lucide-react';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/common/themeStore';
import { useAuthStore } from '@/store/common/authStore';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { B2BLandingHeader } from './components/B2BLandingHeader';
import { useCourseTimeDetail, useEnroll, useMyEnrollments, useCheckWishlistStatus, useToggleWishlist } from '@/hooks/tu';
import {
  DELIVERY_TYPE_LABELS,
  PROGRAM_LEVEL_LABELS,
  ENROLLMENT_METHOD_LABELS,
  COURSE_TIME_STATUS_LABELS,
} from '@/types/tu/courseTimeCatalog.types';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

interface Announcement {
  id: number;
  type: 'important' | 'info';
  title: string;
  message: string;
  date?: string;
}

// TODO: API 연동 시 실제 공지사항 데이터로 교체
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    type: 'important',
    title: '수강 안내',
    message: '본 과정은 수료 후 인증서가 발급됩니다. 진도율 80% 이상 달성 시 수료 처리됩니다.',
    date: '2025.01.10',
  },
  {
    id: 2,
    type: 'info',
    title: '학습 팁',
    message: '각 차시별 학습을 완료한 후 퀴즈를 풀면 학습 효과가 높아집니다.',
    date: '2025.01.08',
  },
];

interface AnnouncementSectionProps {
  announcements: Announcement[];
  isDark: boolean;
}

function AnnouncementSection({ announcements, isDark }: AnnouncementSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (announcements.length === 0) return null;

  return (
    <div
      className={`rounded-xl border overflow-hidden mb-8 ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      {/* 아코디언 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
          isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <Megaphone className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            공지사항
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
            }`}
          >
            {announcements.length}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          } ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 아코디언 콘텐츠 */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`px-4 py-3 ${
                index !== announcements.length - 1
                  ? isDark
                    ? 'border-b border-white/5'
                    : 'border-b border-gray-50'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                    announcement.type === 'important'
                      ? 'bg-orange-500'
                      : isDark
                        ? 'bg-blue-400'
                        : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        announcement.type === 'important'
                          ? isDark
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-orange-100 text-orange-600'
                          : isDark
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {announcement.type === 'important' ? '중요' : '안내'}
                    </span>
                    <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {announcement.title}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {announcement.message}
                  </p>
                  {announcement.date && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {announcement.date}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <B2BLandingHeader />

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
            <div className="flex-1">
              <nav
                className={`flex items-center gap-2 text-sm mb-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <Link
                  to="/tu/b2b/courses"
                  className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
                >
                  강의
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>{courseTime.title}</span>
              </nav>

              {/* Tags (가격 관련 태그 제외) */}
              <div className="flex gap-2 mb-4">
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

                {courseTime.isOnDemand && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#70f2a0] to-[#6bc2f0] text-white">
                    상시모집
                  </span>
                )}

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {DELIVERY_TYPE_LABELS[courseTime.deliveryType]}
                </span>
              </div>

              <h1
                className={`text-3xl md:text-4xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {courseTime.title}
              </h1>

              {courseTime.program?.description && (
                <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {courseTime.program.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {courseTime.currentEnrollment > 0 && (
                  <div
                    className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <Users className="w-5 h-5" />
                    <span>{courseTime.currentEnrollment.toLocaleString()}명 수강중</span>
                  </div>
                )}

                {courseTime.program?.estimatedHours && (
                  <div
                    className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <Clock className="w-5 h-5" />
                    <span>총 {courseTime.program.estimatedHours}시간</span>
                  </div>
                )}

                {levelLabel && (
                  <div
                    className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    <FileText className="w-5 h-5" />
                    <span>{levelLabel}</span>
                  </div>
                )}
              </div>

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
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {instructorName}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      강사
                    </p>
                  </div>
                </div>
              )}

              {/* 공지사항 아코디언 섹션 */}
              <AnnouncementSection announcements={MOCK_ANNOUNCEMENTS} isDark={isDark} />

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

            {/* Right - Course Card (가격/장바구니 제외) */}
            <div className="lg:w-96">
              <div
                className={`rounded-2xl overflow-hidden sticky top-24 border ${
                  isDark ? 'glass border-white/10' : 'bg-white border-gray-200 shadow-lg'
                }`}
              >
                <div className="p-6">
                  {/* B2B: 가격 표시 없음 */}

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

                  <div
                    className={`mb-4 flex items-center gap-2 text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{ENROLLMENT_METHOD_LABELS[courseTime.enrollmentMethod]} 방식</span>
                  </div>

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

                  {/* Buttons (장바구니 제외) */}
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
                          '수강하기'
                        )}
                      </button>
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
