import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Bell, Globe, Palette, LucideIcon } from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import { SettingsCard } from '@/components/common';

type UserRole = 'USER' | 'OPERATOR' | 'TENANT_ADMIN' | 'SUPER_ADMIN';

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
// 새 카드 추가 시 색상은 자동으로 순환됨 (SettingsCard 컴포넌트에서 처리)
const getSettingCards = (userRole: UserRole): SettingCardData[] => {
  // 공통 카드 (모든 역할) - 개인 설정
  const commonCards: SettingCardData[] = [
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

  // USER 전용 카드 (언어 및 지역 설정)
  const userOnlyCards: SettingCardData[] = [
    {
      id: 'language',
      icon: Globe,
      title: '언어 및 지역',
      description: '언어, 시간대 및 날짜 형식',
    },
  ];

  // USER만 언어 설정 추가, 나머지 역할은 공통 카드만
  if (userRole === 'USER') {
    return [...commonCards, ...userOnlyCards];
  }

  return commonCards;
};

// URL 경로에서 역할 추출
const getRoleFromPath = (pathname: string): UserRole => {
  if (pathname.startsWith('/sa')) return 'SUPER_ADMIN';
  if (pathname.startsWith('/ta')) return 'TENANT_ADMIN';
  if (pathname.startsWith('/to')) return 'OPERATOR';
  return 'USER';
};

// 역할별 base path
const getBasePath = (pathname: string): string => {
  if (pathname.startsWith('/sa')) return '/sa';
  if (pathname.startsWith('/ta')) return '/ta';
  if (pathname.startsWith('/to')) return '/to';
  return '/tu';
};

export function SettingsPage({ userRole }: SettingsPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const detectedRole = userRole || getRoleFromPath(location.pathname);
  const basePath = getBasePath(location.pathname);
  const settingCards = getSettingCards(detectedRole);

  const handleCardClick = (cardId: string) => {
    navigate(`${basePath}/settings/${cardId}`);
  };

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: designTokens.bg.app_default,
        minHeight: '100%',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              color: designTokens.text.primary,
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '8px',
            }}
          >
            설정
          </h1>
          <p style={{ color: designTokens.text.secondary, fontSize: '14px' }}>
            계정 설정 및 환경 설정을 관리하세요
          </p>
        </div>

        {/* Settings Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
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
      </div>
    </div>
  );
}
