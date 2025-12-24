import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { designTokens } from '@/styles/design-tokens';

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
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            marginBottom: '24px',
            backgroundColor: 'transparent',
            border: 'none',
            color: designTokens.text.secondary,
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = designTokens.text.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = designTokens.text.secondary)}
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
          <span>설정으로 돌아가기</span>
        </button>

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
        <div
          style={{
            backgroundColor: designTokens.bg.default,
            border: `2px dashed ${designTokens.bg.border}`,
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              backgroundColor: '#FFF3E0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Construction
              style={{
                width: '40px',
                height: '40px',
                color: '#FF9800',
              }}
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
            style={{
              marginTop: '32px',
              padding: '16px',
              backgroundColor: '#F4F4F4',
              borderRadius: '8px',
              textAlign: 'left',
            }}
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
        </div>
      </div>
    </div>
  );
}
