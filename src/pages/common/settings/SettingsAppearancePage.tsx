import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Palette,
  Monitor,
  Sun,
  Moon,
  Laptop,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { designTokens } from '@/styles/design-tokens';

export function SettingsAppearancePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');
  const [sidebarDefault, setSidebarDefault] = useState<'expanded' | 'collapsed'>('expanded');

  const basePath = location.pathname.split('/settings')[0];

  const handleBack = () => {
    navigate(`${basePath}/settings`);
  };

  const handleSave = () => {
    alert('외관 설정이 저장되었습니다.');
  };

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: designTokens.bg.app_default,
        minHeight: '100%',
        overflowY: 'auto',
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
          외관
        </h1>
        <p style={{ color: designTokens.text.secondary, marginBottom: '32px' }}>
          테마, 사이드바 및 표시 옵션을 설정하세요
        </p>

        {/* Theme Mode Section */}
        <section
          style={{
            backgroundColor: designTokens.bg.default,
            border: `1px solid ${designTokens.bg.border}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: `1px solid ${designTokens.bg.border}`,
            }}
          >
            <Palette style={{ width: '20px', height: '20px', color: '#4C2D9A' }} />
            <h2 style={{ color: designTokens.text.primary, fontSize: '18px', fontWeight: 500 }}>
              테마 모드
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Light Mode */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: `2px solid ${themeMode === 'light' ? '#4C2D9A' : designTokens.bg.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor: themeMode === 'light' ? '#F8F5FC' : 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (themeMode !== 'light') {
                  e.currentTarget.style.backgroundColor = '#FAFAFA';
                }
              }}
              onMouseLeave={(e) => {
                if (themeMode !== 'light') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <input
                type="radio"
                name="themeMode"
                value="light"
                checked={themeMode === 'light'}
                onChange={() => setThemeMode('light')}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#FFF9E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                }}
              >
                <Sun style={{ width: '24px', height: '24px', color: '#FFB74D' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: designTokens.text.primary,
                    fontSize: '16px',
                    marginBottom: '4px',
                  }}
                >
                  라이트 모드
                </div>
                <div
                  style={{
                    color: designTokens.text.secondary,
                    fontSize: '13px',
                  }}
                >
                  밝은 배경과 어두운 텍스트
                </div>
              </div>
              {themeMode === 'light' && (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#4C2D9A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                    }}
                  />
                </div>
              )}
            </label>

            {/* Dark Mode */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: `2px solid ${themeMode === 'dark' ? '#4C2D9A' : designTokens.bg.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor: themeMode === 'dark' ? '#F8F5FC' : 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (themeMode !== 'dark') {
                  e.currentTarget.style.backgroundColor = '#FAFAFA';
                }
              }}
              onMouseLeave={(e) => {
                if (themeMode !== 'dark') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <input
                type="radio"
                name="themeMode"
                value="dark"
                checked={themeMode === 'dark'}
                onChange={() => setThemeMode('dark')}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#E3F2FD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                }}
              >
                <Moon style={{ width: '24px', height: '24px', color: '#5C6BC0' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: designTokens.text.primary,
                    fontSize: '16px',
                    marginBottom: '4px',
                  }}
                >
                  다크 모드
                </div>
                <div
                  style={{
                    color: designTokens.text.secondary,
                    fontSize: '13px',
                  }}
                >
                  어두운 배경과 밝은 텍스트
                </div>
              </div>
              {themeMode === 'dark' && (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#4C2D9A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                    }}
                  />
                </div>
              )}
            </label>

            {/* System Mode */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                border: `2px solid ${themeMode === 'system' ? '#4C2D9A' : designTokens.bg.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                backgroundColor: themeMode === 'system' ? '#F8F5FC' : 'transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (themeMode !== 'system') {
                  e.currentTarget.style.backgroundColor = '#FAFAFA';
                }
              }}
              onMouseLeave={(e) => {
                if (themeMode !== 'system') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <input
                type="radio"
                name="themeMode"
                value="system"
                checked={themeMode === 'system'}
                onChange={() => setThemeMode('system')}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#F3E5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                }}
              >
                <Laptop style={{ width: '24px', height: '24px', color: '#9C27B0' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: designTokens.text.primary,
                    fontSize: '16px',
                    marginBottom: '4px',
                  }}
                >
                  시스템 설정 따라가기
                </div>
                <div
                  style={{
                    color: designTokens.text.secondary,
                    fontSize: '13px',
                  }}
                >
                  운영체제 테마 설정을 따릅니다
                </div>
              </div>
              {themeMode === 'system' && (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#4C2D9A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                    }}
                  />
                </div>
              )}
            </label>
          </div>
        </section>

        {/* Sidebar Settings Section */}
        <section
          style={{
            backgroundColor: designTokens.bg.default,
            border: `1px solid ${designTokens.bg.border}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: `1px solid ${designTokens.bg.border}`,
            }}
          >
            <Monitor style={{ width: '20px', height: '20px', color: '#4C2D9A' }} />
            <h2 style={{ color: designTokens.text.primary, fontSize: '18px', fontWeight: 500 }}>
              사이드바 설정
            </h2>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: designTokens.text.secondary,
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              사이드바 기본 상태
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setSidebarDefault('expanded')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor:
                    sidebarDefault === 'expanded'
                      ? designTokens.button.brand_default
                      : designTokens.bg.default,
                  color: sidebarDefault === 'expanded' ? 'white' : designTokens.text.primary,
                  border: `1px solid ${sidebarDefault === 'expanded' ? designTokens.button.brand_default : designTokens.bg.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (sidebarDefault !== 'expanded') {
                    e.currentTarget.style.borderColor = '#4C2D9A';
                    e.currentTarget.style.backgroundColor = '#F8F5FC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sidebarDefault !== 'expanded') {
                    e.currentTarget.style.borderColor = designTokens.bg.border;
                    e.currentTarget.style.backgroundColor = designTokens.bg.default;
                  }
                }}
              >
                <Maximize2 style={{ width: '18px', height: '18px' }} />
                확장
              </button>
              <button
                onClick={() => setSidebarDefault('collapsed')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor:
                    sidebarDefault === 'collapsed'
                      ? designTokens.button.brand_default
                      : designTokens.bg.default,
                  color: sidebarDefault === 'collapsed' ? 'white' : designTokens.text.primary,
                  border: `1px solid ${sidebarDefault === 'collapsed' ? designTokens.button.brand_default : designTokens.bg.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (sidebarDefault !== 'collapsed') {
                    e.currentTarget.style.borderColor = '#4C2D9A';
                    e.currentTarget.style.backgroundColor = '#F8F5FC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sidebarDefault !== 'collapsed') {
                    e.currentTarget.style.borderColor = designTokens.bg.border;
                    e.currentTarget.style.backgroundColor = designTokens.bg.default;
                  }
                }}
              >
                <Minimize2 style={{ width: '18px', height: '18px' }} />
                축소
              </button>
            </div>
            <p
              style={{
                fontSize: '12px',
                color: designTokens.text.secondary,
                marginTop: '12px',
              }}
            >
              로그인 시 사이드바의 기본 상태를 설정합니다.
            </p>
          </div>
        </section>

        {/* Save Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '16px',
          }}
        >
          <button
            onClick={handleSave}
            style={{
              padding: '10px 24px',
              backgroundColor: designTokens.button.brand_default,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
