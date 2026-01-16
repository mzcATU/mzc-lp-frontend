import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Bell, Globe, Palette, LucideIcon, ArrowLeft, LogOut } from 'lucide-react';
import { SettingsCard, Button } from '@/components/common';
import { useAuthStore } from '@/store/common/authStore';
import { authService } from '@/services/common/authService';
import { toast } from 'sonner';

type UserRole = 'USER' | 'INSTRUCTOR' | 'DESIGNER' | 'OPERATOR' | 'TENANT_ADMIN' | 'SYSTEM_ADMIN';

interface SettingCardData {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface SettingsPageProps {
  userRole?: UserRole;
}

// 역할별 카드 설정 (개인 설정만 - 관리 기능은 사이드바 메뉴에서 접근)
const getSettingCards = (userRole: UserRole): SettingCardData[] => {
  // USER는 언어 및 지역 설정만 표시
  if (userRole === 'USER') {
    return [
      {
        id: 'language',
        icon: Globe,
        title: '언어 및 지역',
        description: '언어, 시간대 및 날짜 형식',
      },
    ];
  }

  // 관리자용 공통 카드
  return [
    {
      id: 'security',
      icon: Shield,
      title: '계정 및 보안',
      description: '프로필, 비밀번호, 계정 관리',
    },
    {
      id: 'notifications',
      icon: Bell,
      title: '알림',
      description: '알림 설정 및 환경 설정',
    },
    {
      id: 'appearance',
      icon: Palette,
      title: '외관',
      description: '테마, 사이드바 및 표시 옵션',
    },
  ];
};

// URL 경로에서 역할 추출 (subdomain 지원: /sa, /ta, /co 또는 /:subdomain/ta, /:subdomain/co)
const getRoleFromPath = (pathname: string): UserRole => {
  if (pathname.includes('/sa')) return 'SYSTEM_ADMIN';
  if (pathname.includes('/ta')) return 'TENANT_ADMIN';
  if (pathname.includes('/co')) return 'OPERATOR';
  return 'USER';
};

// 역할별 base path (subdomain 지원)
const getBasePath = (pathname: string): string => {
  // /sa 또는 /:subdomain/sa
  const saMatch = pathname.match(/^(\/[^/]+)?\/sa/);
  if (saMatch) return saMatch[0];

  // /ta 또는 /:subdomain/ta
  const taMatch = pathname.match(/^(\/[^/]+)?\/ta/);
  if (taMatch) return taMatch[0];

  // /co 또는 /:subdomain/co
  const coMatch = pathname.match(/^(\/[^/]+)?\/co/);
  if (coMatch) return coMatch[0];

  // /tu 또는 /:subdomain/tu
  const tuMatch = pathname.match(/^(\/[^/]+)?\/tu/);
  if (tuMatch) return tuMatch[0];

  return '/tu';
};

export function SettingsPage({ userRole }: SettingsPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuth } = useAuthStore();

  const detectedRole = userRole || getRoleFromPath(location.pathname);
  const basePath = getBasePath(location.pathname);
  const settingCards = getSettingCards(detectedRole);
  const isUser = detectedRole === 'USER';

  const handleCardClick = (cardId: string) => {
    navigate(`${basePath}/settings/${cardId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = async () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      try {
        await authService.logout();
        clearAuth();
        navigate('/auth/login');
        toast.success('로그아웃되었습니다.');
      } catch (error) {
        console.error('Logout failed:', error);
        toast.error('로그아웃에 실패했습니다.');
      }
    }
  };

  return (
    <div className="p-10 bg-bg-app-default min-h-screen flex flex-col">
      <div className="max-w-[1200px] mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          {isUser && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-4 -ml-2 text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로가기
            </Button>
          )}
          <h1 className="text-text-primary text-2xl font-semibold mb-2">
            설정
          </h1>
          <p className="text-text-secondary text-sm">
            {isUser ? '언어 및 지역 설정을 관리하세요' : '계정 설정 및 환경 설정을 관리하세요'}
          </p>
        </div>

        {/* Settings Cards Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 mb-8">
          {settingCards.map((card, index) => (
            <SettingsCard
              key={card.id}
              icon={card.icon}
              title={card.title}
              description={card.description}
              onClick={() => handleCardClick(card.id)}
              index={index}
            />
          ))}
        </div>

        {/* Spacer to push logout to bottom */}
        <div className="flex-1"></div>

        {/* Divider */}
        <div className="border-t pt-6 border-bg-border">
          {/* Logout Button - Left aligned */}
          <div className="flex justify-start">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-0 py-2 transition-all duration-200 text-text-secondary hover:text-[#EF4444] bg-transparent border-none cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
