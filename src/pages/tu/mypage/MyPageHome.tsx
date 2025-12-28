import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  BookOpen,
  Award,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Bell,
  Shield,
  Globe,
  Loader2,
  Camera,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/common/auth';
import { useMyProfile, useUploadProfileImage } from '@/hooks/common';
import { useMyEnrollments } from '@/hooks/tu';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation, useLanguageStore } from '@/store/common/languageStore';
import { Button, Card, CardContent, Badge } from '@/components/common';
import type { EnrollmentStatus } from '@/services/tu/enrollmentService';

const statusColors: Record<EnrollmentStatus, 'blue' | 'green' | 'red' | 'gray' | 'orange'> = {
  PENDING: 'orange',
  APPROVED: 'blue',
  REJECTED: 'red',
  CANCELLED: 'gray',
  COMPLETED: 'green',
};

interface QuickMenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  isDark: boolean;
}

function QuickMenuItem({ icon, title, description, onClick, isDark }: QuickMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl text-left transition-all hover:scale-[1.02] ${
        isDark
          ? 'bg-white/5 hover:bg-white/10 border border-white/10'
          : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDark ? 'bg-gradient-to-r from-[#6778ff] to-[#a855f7]' : 'bg-blue-100'
          }`}
        >
          <div className={isDark ? 'text-white' : 'text-blue-600'}>{icon}</div>
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
        </div>
        <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    </button>
  );
}

export function MyPageHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useMyProfile();
  const uploadImageMutation = useUploadProfileImage();
  const { theme } = useThemeStore();
  const { language } = useLanguageStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // 프로필 이미지 URL 생성
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace('/api', '');

  // 서버에서 받아온 프로필 이미지로 프리뷰 동기화
  useEffect(() => {
    if (profile?.profileImageUrl) {
      const imageUrl = profile.profileImageUrl.startsWith('http')
        ? profile.profileImageUrl
        : `${apiBaseUrl}${profile.profileImageUrl}`;
      setProfileImagePreview(imageUrl);
    }
  }, [profile, apiBaseUrl]);

  // 상태 라벨 (다국어)
  const statusLabels: Record<EnrollmentStatus, string> = {
    PENDING: t.mypage.pending,
    APPROVED: t.mypage.inProgress,
    REJECTED: language === 'ko' ? '반려됨' : 'Rejected',
    CANCELLED: language === 'ko' ? '취소됨' : 'Cancelled',
    COMPLETED: t.mypage.completed,
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(language === 'ko' ? '이미지 파일만 업로드 가능합니다.' : 'Only image files can be uploaded.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'ko' ? '파일 크기는 5MB 이하여야 합니다.' : 'File size must be 5MB or less.');
      return;
    }

    // 즉시 프리뷰 표시
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 서버에 업로드
    try {
      await uploadImageMutation.mutateAsync(file);
      toast.success(language === 'ko' ? '프로필 이미지가 업로드되었습니다.' : 'Profile image uploaded.');
    } catch {
      toast.error(language === 'ko' ? '이미지 업로드에 실패했습니다.' : 'Failed to upload image.');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 학습 현황 조회
  const { data: enrollmentData, isLoading: isLoadingEnrollments } = useMyEnrollments({
    page: 0,
    size: 100,
  });

  // 통계 계산
  const stats = {
    inProgress: enrollmentData?.content.filter((e) => e.status === 'APPROVED').length ?? 0,
    completed: enrollmentData?.content.filter((e) => e.status === 'COMPLETED').length ?? 0,
    pending: enrollmentData?.content.filter((e) => e.status === 'PENDING').length ?? 0,
    total: enrollmentData?.content.length ?? 0,
  };

  // 최근 학습 (수강 중인 강의 최대 3개)
  const recentLearning = enrollmentData?.content
    .filter((e) => e.status === 'APPROVED')
    .slice(0, 3) ?? [];

  return (
    <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#0a0a14]' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        {/* 프로필 섹션 */}
        <section className="mb-8">
          <div
            className={`rounded-2xl p-6 sm:p-8 ${
              isDark
                ? 'bg-gradient-to-r from-[#1a1a2e] to-[#16162a] border border-white/10'
                : 'bg-white shadow-sm border border-gray-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* 프로필 아바타 */}
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#6778ff] to-[#a855f7] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt={t.mypage.profile} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  disabled={uploadImageMutation.isPending}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
                  title={t.mypage.editProfile}
                >
                  {uploadImageMutation.isPending ? (
                    <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>

              {/* 프로필 정보 */}
              <div className="flex-1">
                <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user?.name}{t.mypage.hello}
                </h1>
                <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user?.email}
                </p>
                <Badge variant="blue" className="text-xs">
                  {user?.role === 'USER' ? t.mypage.generalMember : user?.role}
                </Badge>
              </div>

              {/* 프로필 수정 버튼 */}
              <Button
                variant="outline"
                onClick={() => navigate('/mypage/profile')}
                className={isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}
              >
                {t.mypage.editProfile}
              </Button>
            </div>
          </div>
        </section>

        {/* 학습 통계 */}
        <section className="mb-8">
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.mypage.learningStatus}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: t.mypage.inProgress, value: stats.inProgress, icon: <PlayCircle className="w-5 h-5" />, color: 'blue' },
              { label: t.mypage.completed, value: stats.completed, icon: <CheckCircle className="w-5 h-5" />, color: 'green' },
              { label: t.mypage.pending, value: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'orange' },
              { label: t.mypage.total, value: stats.total, icon: <TrendingUp className="w-5 h-5" />, color: 'purple' },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`p-4 rounded-xl ${
                  isDark
                    ? 'bg-white/5 border border-white/10'
                    : 'bg-white border border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`${
                      stat.color === 'blue'
                        ? isDark ? 'text-blue-400' : 'text-blue-600'
                        : stat.color === 'green'
                        ? isDark ? 'text-green-400' : 'text-green-600'
                        : stat.color === 'orange'
                        ? isDark ? 'text-orange-400' : 'text-orange-600'
                        : isDark ? 'text-purple-400' : 'text-purple-600'
                    }`}
                  >
                    {stat.icon}
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {isLoadingEnrollments ? '-' : stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 최근 학습 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.mypage.recentLearning}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/mypage/learning')}
              className={isDark ? 'text-gray-400 hover:text-white' : ''}
            >
              {t.mypage.viewAll}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {isLoadingEnrollments ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
          ) : recentLearning.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentLearning.map((enrollment) => (
                <Card
                  key={enrollment.id}
                  className={`cursor-pointer transition-all hover:scale-[1.02] ${
                    isDark
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-white hover:shadow-md'
                  }`}
                  onClick={() => navigate(`/mypage/learning/${enrollment.id}`)}
                >
                  <CardContent className="p-5">
                    <Badge variant={statusColors[enrollment.status]} className="text-xs mb-3">
                      {statusLabels[enrollment.status]}
                    </Badge>
                    <h3
                      className={`font-medium mb-2 line-clamp-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {enrollment.programTitle}
                    </h3>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {enrollment.courseTimeName}
                    </p>
                    {enrollment.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            {language === 'ko' ? '진도율' : 'Progress'}
                          </span>
                          <span className={isDark ? 'text-white' : 'text-gray-900'}>
                            {enrollment.progress}%
                          </span>
                        </div>
                        <div
                          className={`w-full h-2 rounded-full overflow-hidden ${
                            isDark ? 'bg-white/10' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#6778ff] to-[#a855f7]"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(enrollment.startDate).toLocaleDateString()} ~{' '}
                        {new Date(enrollment.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-12 rounded-xl ${
                isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'
              }`}
            >
              <BookOpen className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t.mypage.noEnrolledCourses}
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.mypage.noEnrolledCoursesDesc}
              </p>
              <Button onClick={() => navigate('/tu/catalog')}>{t.mypage.browseCourses}</Button>
            </div>
          )}
        </section>

        {/* 빠른 메뉴 */}
        <section>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.mypage.quickMenu}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickMenuItem
              icon={<BookOpen className="w-5 h-5" />}
              title={t.mypage.myLearning}
              description={t.mypage.myLearningDesc}
              onClick={() => navigate('/mypage/learning')}
              isDark={isDark}
            />
            <QuickMenuItem
              icon={<Award className="w-5 h-5" />}
              title={t.mypage.certificates}
              description={t.mypage.certificatesDesc}
              onClick={() => navigate('/mypage/certifications')}
              isDark={isDark}
            />
            <QuickMenuItem
              icon={<Shield className="w-5 h-5" />}
              title={t.mypage.profileAndSecurity}
              description={t.mypage.profileSecurityDesc}
              onClick={() => navigate('/mypage/profile')}
              isDark={isDark}
            />
            <QuickMenuItem
              icon={<Bell className="w-5 h-5" />}
              title={t.mypage.notifications}
              description={t.mypage.notificationsDesc}
              onClick={() => navigate('/mypage/notifications')}
              isDark={isDark}
            />
            <QuickMenuItem
              icon={<Globe className="w-5 h-5" />}
              title={t.mypage.languageRegion}
              description={t.mypage.languageRegionDesc}
              onClick={() => navigate('/mypage/language')}
              isDark={isDark}
            />
            <QuickMenuItem
              icon={<TrendingUp className="w-5 h-5" />}
              title={t.mypage.learningProgress}
              description={t.mypage.learningProgressDesc}
              onClick={() => navigate('/tu/progress')}
              isDark={isDark}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
