import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import { Button, EmptyState } from '@/components/common';

export function SettingsNotificationsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = location.pathname.split('/settings')[0];

  const handleBack = () => {
    navigate(`${basePath}/settings`);
  };

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: designTokens.bg.app_default,
        minHeight: '100%',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header with Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>설정으로 돌아가기</span>
        </Button>

        <h1
          style={{
            color: designTokens.text.primary,
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          알림
        </h1>
        <p style={{ color: designTokens.text.secondary, marginBottom: '32px' }}>
          알림 설정을 관리하세요
        </p>

        {/* Under Development Placeholder */}
        <EmptyState
          icon={Construction}
          title="개발 예정"
          description="알림 설정 기능은 현재 개발 중입니다. 곧 다양한 알림 옵션을 제공할 예정입니다."
          className="border-2 border-dashed rounded-lg"
        />
      </div>
    </div>
  );
}
