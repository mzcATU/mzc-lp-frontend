import { useState } from 'react';
import {
  Building2,
  Save,
  RotateCcw,
  Globe,
  Clock,
  Bell,
  Shield,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Switch } from '@/components/common/Switch';
import { Textarea } from '@/components/common/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';

// Mock 데이터
const mockTenantSettings = {
  general: {
    name: '메가존클라우드',
    description: '클라우드 전문 교육 플랫폼',
    contactEmail: 'support@megazone.com',
    timezone: 'Asia/Seoul',
    language: 'ko',
  },
  features: {
    allowSelfRegistration: true,
    requireEmailVerification: true,
    enableSocialLogin: false,
    enableCertificates: true,
    enableDiscussions: true,
  },
  notifications: {
    emailNotifications: true,
    browserNotifications: true,
    courseReminders: true,
    marketingEmails: false,
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireStrongPassword: true,
    enable2FA: false,
  },
};

export function TenantSettingsPage() {
  const [settings, setSettings] = useState(mockTenantSettings);

  const handleReset = () => {
    setSettings(mockTenantSettings);
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="테넌트 설정"
        description="테넌트 전반적인 설정을 관리합니다"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-primary" />
              <CardTitle>기본 정보</CardTitle>
            </div>
            <CardDescription>테넌트 기본 정보를 설정합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>테넌트 이름</Label>
                <Input
                  value={settings.general.name}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, name: e.target.value },
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>연락처 이메일</Label>
                <Input
                  type="email"
                  value={settings.general.contactEmail}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, contactEmail: e.target.value },
                  })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>설명</Label>
              <Textarea
                value={settings.general.description}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, description: e.target.value },
                })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  타임존
                </Label>
                <Select
                  value={settings.general.timezone}
                  onValueChange={(v) => setSettings({
                    ...settings,
                    general: { ...settings.general, timezone: v },
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Seoul">Asia/Seoul (KST)</SelectItem>
                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  기본 언어
                </Label>
                <Select
                  value={settings.general.language}
                  onValueChange={(v) => setSettings({
                    ...settings,
                    general: { ...settings.general, language: v },
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>기능 설정</CardTitle>
            <CardDescription>테넌트에서 사용할 기능을 설정합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">자체 회원가입 허용</p>
                <p className="text-sm text-text-secondary">사용자가 직접 계정을 생성할 수 있습니다</p>
              </div>
              <Switch
                checked={settings.features.allowSelfRegistration}
                onCheckedChange={(v) => setSettings({
                  ...settings,
                  features: { ...settings.features, allowSelfRegistration: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">이메일 인증 필수</p>
                <p className="text-sm text-text-secondary">가입 시 이메일 인증을 요구합니다</p>
              </div>
              <Switch
                checked={settings.features.requireEmailVerification}
                onCheckedChange={(v) => setSettings({
                  ...settings,
                  features: { ...settings.features, requireEmailVerification: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">소셜 로그인</p>
                <p className="text-sm text-text-secondary">Google, Kakao 등 소셜 로그인 허용</p>
              </div>
              <Switch
                checked={settings.features.enableSocialLogin}
                onCheckedChange={(v) => setSettings({
                  ...settings,
                  features: { ...settings.features, enableSocialLogin: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">수료증 발급</p>
                <p className="text-sm text-text-secondary">강좌 완료 시 수료증을 발급합니다</p>
              </div>
              <Switch
                checked={settings.features.enableCertificates}
                onCheckedChange={(v) => setSettings({
                  ...settings,
                  features: { ...settings.features, enableCertificates: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">토론 기능</p>
                <p className="text-sm text-text-secondary">강좌 내 토론 게시판을 사용합니다</p>
              </div>
              <Switch
                checked={settings.features.enableDiscussions}
                onCheckedChange={(v) => setSettings({
                  ...settings,
                  features: { ...settings.features, enableDiscussions: v },
                })}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-brand-primary" />
                <CardTitle>알림 설정</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">이메일 알림</span>
                <Switch
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(v) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailNotifications: v },
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">브라우저 알림</span>
                <Switch
                  checked={settings.notifications.browserNotifications}
                  onCheckedChange={(v) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, browserNotifications: v },
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">강좌 리마인더</span>
                <Switch
                  checked={settings.notifications.courseReminders}
                  onCheckedChange={(v) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, courseReminders: v },
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">마케팅 이메일</span>
                <Switch
                  checked={settings.notifications.marketingEmails}
                  onCheckedChange={(v) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, marketingEmails: v },
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand-primary" />
                <CardTitle>보안 설정</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>세션 타임아웃 (분)</Label>
                <Input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeout: Number(e.target.value) },
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>최대 로그인 시도</Label>
                <Input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, maxLoginAttempts: Number(e.target.value) },
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">강력한 비밀번호 필수</span>
                <Switch
                  checked={settings.security.requireStrongPassword}
                  onCheckedChange={(v) => setSettings({
                    ...settings,
                    security: { ...settings.security, requireStrongPassword: v },
                  })}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">2단계 인증 (2FA)</span>
                <Switch
                  checked={settings.security.enable2FA}
                  onCheckedChange={(v) => setSettings({
                    ...settings,
                    security: { ...settings.security, enable2FA: v },
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
