import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Bell, Globe, Palette, Building2, Users, Database, FileText } from 'lucide-react';
import { designTokens } from '@/styles/design-tokens';
import { cardStyles } from '@/styles/card-styles';

type UserRole = 'USER' | 'OPERATOR' | 'TENANT_ADMIN' | 'SUPER_ADMIN';

interface SettingCard {
  id: string;
  icon: typeof Shield;
  title: string;
  description: string;
  color: string;
}

interface SettingsPageProps {
  userRole?: UserRole;
}

// 역할별 카드 설정
const getSettingCards = (userRole: UserRole): SettingCard[] => {
  // 공통 카드 (모든 역할)
  const commonCards: SettingCard[] = [
    {
      id: 'security',
      icon: Shield,
      title: '계정 및 보안',
      description: '프로필, 비밀번호, 계정 관리',
      color: '#4C2D9A',
    },
    {
      id: 'notifications',
      icon: Bell,
      title: '알림',
      description: '알림 설정 및 환경 설정',
      color: '#FF7043',
    },
    {
      id: 'appearance',
      icon: Palette,
      title: '외관',
      description: '테마, 사이드바 및 표시 옵션',
      color: '#9C27B0',
    },
  ];

  // USER 전용 카드
  const userOnlyCards: SettingCard[] = [
    {
      id: 'language',
      icon: Globe,
      title: '언어 및 지역',
      description: '언어, 시간대 및 날짜 형식',
      color: '#4CAF50',
    },
    {
      id: 'appearance',
      icon: Palette,
      title: '외관',
      description: '테마, 사이드바 및 표시 옵션',
      color: '#9C27B0',
    },
  ];

  // OPERATOR 전용 카드
  const operatorCards: SettingCard[] = [
    {
      id: 'content-defaults',
      icon: FileText,
      title: '콘텐츠 기본 설정',
      description: '콘텐츠 업로드 및 관리 기본값',
      color: '#2196F3',
    },
  ];

  // TENANT_ADMIN 전용 카드
  const tenantAdminCards: SettingCard[] = [
    {
      id: 'tenant-settings',
      icon: Building2,
      title: '테넌트 설정',
      description: '조직 정보 및 브랜딩 설정',
      color: '#009688',
    },
    {
      id: 'user-management',
      icon: Users,
      title: '사용자 관리 설정',
      description: '사용자 그룹 및 권한 기본값',
      color: '#795548',
    },
  ];

  // SUPER_ADMIN 전용 카드
  const superAdminCards: SettingCard[] = [
    {
      id: 'system-settings',
      icon: Database,
      title: '시스템 설정',
      description: '글로벌 시스템 구성 및 관리',
      color: '#607D8B',
    },
    {
      id: 'tenant-defaults',
      icon: Building2,
      title: '테넌트 기본값',
      description: '신규 테넌트 생성 시 기본 설정',
      color: '#009688',
    },
  ];

  switch (userRole) {
    case 'USER':
      return [...commonCards, ...userOnlyCards];
    case 'OPERATOR':
      return [...commonCards, ...operatorCards];
    case 'TENANT_ADMIN':
      return [...commonCards, ...tenantAdminCards];
    case 'SUPER_ADMIN':
      return [...commonCards, ...superAdminCards];
    default:
      return commonCards;
  }
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
          {settingCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                style={{
                  ...cardStyles.base,
                  ...cardStyles.interactive,
                  padding: cardStyles.padding.md,
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = card.color;
                  e.currentTarget.style.boxShadow = cardStyles.shadow.md;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = designTokens.bg.border;
                  e.currentTarget.style.boxShadow = cardStyles.shadow.sm;
                }}
              >
                {/* Icon Container */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: `${card.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Icon style={{ width: '24px', height: '24px', color: card.color }} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    color: designTokens.text.primary,
                    fontSize: '16px',
                    fontWeight: 500,
                    marginBottom: '8px',
                  }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    color: designTokens.text.secondary,
                    fontSize: '14px',
                    lineHeight: 1.5,
                  }}
                >
                  {card.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
