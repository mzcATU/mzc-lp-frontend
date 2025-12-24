import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Palette,
  Monitor,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
  RadioOptionCard,
} from '@/components/common';

export function SettingsAppearancePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [sidebarDefault, setSidebarDefault] = useState<'expanded' | 'collapsed'>('expanded');

  const basePath = location.pathname.split('/settings')[0];

  const handleBack = () => {
    navigate(`${basePath}/settings`);
  };

  const handleSave = () => {
    alert('외관 설정이 저장되었습니다.');
  };

  const themeOptions = [
    {
      value: 'light' as const,
      icon: Sun,
      label: '라이트 모드',
      description: '밝은 배경과 어두운 텍스트',
      iconBg: designTokens.badge.yellow.bg,
      iconColor: designTokens.badge.yellow.text,
    },
    {
      value: 'dark' as const,
      icon: Moon,
      label: '다크 모드',
      description: '어두운 배경과 밝은 텍스트',
      iconBg: designTokens.badge.blue.bg,
      iconColor: designTokens.badge.blue.text,
    },
  ];

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
          외관
        </h1>
        <p style={{ color: designTokens.text.secondary, marginBottom: '32px' }}>
          테마, 사이드바 및 표시 옵션을 설정하세요
        </p>

        {/* Theme Mode Section */}
        <Card className="mb-6">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
              <CardTitle className="text-lg font-medium">테마 모드</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col gap-3">
              {themeOptions.map((option) => (
                <RadioOptionCard
                  key={option.value}
                  name="themeMode"
                  value={option.value}
                  label={option.label}
                  description={option.description}
                  isSelected={themeMode === option.value}
                  onChange={(v) => setThemeMode(v as 'light' | 'dark')}
                  icon={option.icon}
                  iconBg={option.iconBg}
                  iconColor={option.iconColor}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Settings Section */}
        <Card className="mb-6">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
              <CardTitle className="text-lg font-medium">사이드바 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div>
              <Label className="mb-3 text-muted-foreground text-sm">사이드바 기본 상태</Label>
              <div className="flex gap-3 mt-3">
                <Button
                  variant={sidebarDefault === 'expanded' ? 'default' : 'outline'}
                  onClick={() => setSidebarDefault('expanded')}
                  className="flex-1 gap-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  확장
                </Button>
                <Button
                  variant={sidebarDefault === 'collapsed' ? 'default' : 'outline'}
                  onClick={() => setSidebarDefault('collapsed')}
                  className="flex-1 gap-2"
                >
                  <Minimize2 className="w-4 h-4" />
                  축소
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                로그인 시 사이드바의 기본 상태를 설정합니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
