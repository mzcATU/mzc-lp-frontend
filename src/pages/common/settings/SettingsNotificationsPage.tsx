import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Button,
  Card,
  CardContent,
} from '@/components/common';

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
        <Card className="border-dashed border-2">
          <CardContent className="py-12 px-6 text-center">
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: designTokens.status.warning_background }}
            >
              <Construction
                className="w-10 h-10"
                style={{ color: designTokens.status.warning_text }}
              />
            </div>

            <h2
              style={{
                color: designTokens.text.primary,
                marginBottom: '12px',
                fontSize: '20px',
                fontWeight: 500,
              }}
            >
              개발 예정
            </h2>

            <p
              style={{
                color: designTokens.text.secondary,
                fontSize: '14px',
                lineHeight: '1.6',
                maxWidth: '400px',
                margin: '0 auto',
              }}
            >
              알림 설정 기능은 현재 개발 중입니다. 곧 다양한 알림 옵션을 제공할 예정입니다.
            </p>

            <div
              className="mt-8 p-4 rounded-lg text-left"
              style={{ backgroundColor: designTokens.bg.secondary }}
            >
              <p
                style={{
                  fontSize: '12px',
                  color: designTokens.text.secondary,
                  marginBottom: '8px',
                }}
              >
                예정된 기능:
              </p>
              <ul
                style={{
                  fontSize: '12px',
                  color: designTokens.text.secondary,
                  paddingLeft: '20px',
                  margin: 0,
                }}
              >
                <li>이메일 알림 설정</li>
                <li>브라우저 푸시 알림</li>
                <li>알림 시간 설정</li>
                <li>카테고리별 알림 관리</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
