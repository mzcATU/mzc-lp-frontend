import { useNavigate } from 'react-router-dom';
import {
  User,
  BookOpen,
  Award,
  Settings,
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
} from 'lucide-react';
import { LandingHeader, LandingFooter } from '@/components/landing';
import { useAuth } from '@/hooks/common/auth';
import { useMyEnrollments } from '@/hooks/tu';
import { useThemeStore } from '@/store/common/themeStore';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import { Button, Card, CardContent, Badge } from '@/components/common';
import type { EnrollmentStatus } from '@/services/tu/enrollmentService';
import { getLoginPath } from '@/utils/tenantUtils';

const statusLabels: Record<EnrollmentStatus, string> = {
  PENDING: '승인 대기',
  APPROVED: '수강 중',
  ENROLLED: '수강 중',
  REJECTED: '반려됨',
  CANCELLED: '취소됨',
  COMPLETED: '완료',
};

const statusColors: Record<EnrollmentStatus, 'blue' | 'green' | 'red' | 'gray' | 'orange'> = {
  PENDING: 'orange',
  APPROVED: 'blue',
  ENROLLED: 'blue',
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

export function MyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { theme } = useThemeStore();
  const { prefixPath } = useSubdomainPath();
  const isDark = theme === 'dark';

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

  // 로그인하지 않은 경우
  if (!isAuthenticated || !user) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <LandingHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <User className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              로그인이 필요합니다
            </h2>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              마이페이지를 이용하시려면 로그인해주세요
            </p>
            <Button onClick={() => navigate(getLoginPath())}>로그인하기</Button>
          </div>
        </div>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <LandingHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 프로필 섹션 */}
        <section className="mb-10">
          <div
            className={`rounded-2xl p-6 sm:p-8 ${
              isDark
                ? 'bg-gradient-to-r from-[#1a1a2e] to-[#16162a] border border-white/10'
                : 'bg-white shadow-sm border border-gray-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* 프로필 아바타 */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#6778ff] to-[#a855f7] flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>

              {/* 프로필 정보 */}
              <div className="flex-1">
                <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.name}님, 안녕하세요!
                </h1>
                <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.email}
                </p>
                <Badge variant="blue" className="text-xs">
                  {user.role === 'USER' ? '일반 회원' : user.role}
                </Badge>
              </div>

              {/* 설정 버튼 */}
              <Button
                variant="outline"
                onClick={() => navigate(prefixPath('/tu/b2c/mypage/settings'))}
                className={isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}
              >
                <Settings className="w-4 h-4 mr-2" />
                설정
              </Button>
            </div>
          </div>
        </section>

        {/* 학습 통계 */}
        <section className="mb-10">
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            학습 현황
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: '수강 중', value: stats.inProgress, icon: <PlayCircle className="w-5 h-5" />, color: 'blue' },
              { label: '완료', value: stats.completed, icon: <CheckCircle className="w-5 h-5" />, color: 'green' },
              { label: '승인 대기', value: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'orange' },
              { label: '전체', value: stats.total, icon: <TrendingUp className="w-5 h-5" />, color: 'purple' },
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
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              최근 학습
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(prefixPath('/tu/b2c/mypage/learning'))}
              className={isDark ? 'text-gray-400 hover:text-white' : ''}
            >
              전체보기
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
                  onClick={() => navigate(prefixPath(`/tu/b2c/mypage/learning/${enrollment.id}`))}
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
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>진도율</span>
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
                수강 중인 강의가 없습니다
              </h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                새로운 강의를 찾아 학습을 시작해보세요
              </p>
              <Button onClick={() => navigate(prefixPath('/tu/b2c/courses'))}>강의 둘러보기</Button>
            </div>
          )}
        </section>

        {/* 빠른 메뉴 */}
        <section>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            빠른 메뉴
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickMenuItem
              icon={<BookOpen className="w-5 h-5" />}
              title="내 학습"
              description="수강 중인 강의를 확인하세요"
              onClick={() => navigate(prefixPath('/tu/b2c/mypage/learning'))}
              isDark={isDark}
            />
            <QuickMenuItem
              icon={<Award className="w-5 h-5" />}
              title="수료증"
              description="취득한 수료증을 확인하세요"
              onClick={() => navigate(prefixPath('/tu/b2c/mypage/certificates'))}
              isDark={isDark}
            />
            <QuickMenuItem
              icon={<Shield className="w-5 h-5" />}
              title="계정 및 보안"
              description="계정 정보 및 보안 설정"
              onClick={() => navigate(prefixPath('/tu/b2c/mypage/settings/security'))}
              isDark={isDark}
            />
            <QuickMenuItem
              icon={<Bell className="w-5 h-5" />}
              title="알림 설정"
              description="알림 설정을 관리하세요"
              onClick={() => navigate(prefixPath('/tu/b2c/mypage/settings/notifications'))}
              isDark={isDark}
            />
            <QuickMenuItem
              icon={<Globe className="w-5 h-5" />}
              title="언어 및 지역"
              description="언어 및 지역 설정을 변경하세요"
              onClick={() => navigate(prefixPath('/tu/b2c/mypage/settings/language'))}
              isDark={isDark}
            />
            <QuickMenuItem
              icon={<TrendingUp className="w-5 h-5" />}
              title="학습 진도"
              description="전체 학습 진도를 확인하세요"
              onClick={() => navigate(prefixPath('/tu/b2c/mypage/learning'))}
              isDark={isDark}
            />
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

export default MyPage;
