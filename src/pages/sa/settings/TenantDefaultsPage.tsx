import { useState } from 'react';
import {
  Building2,
  Save,
  RotateCcw,
  Users,
  BookOpen,
  HardDrive,
  Palette,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Switch } from '@/components/common/Switch';

// Mock 데이터
const mockDefaults = {
  limits: {
    maxUsers: 100,
    maxCourses: 50,
    maxStorage: 50,
    maxAdmins: 5,
  },
  features: {
    customDomain: false,
    ssoIntegration: false,
    apiAccess: false,
    whiteLabeling: false,
    advancedAnalytics: false,
  },
  branding: {
    allowCustomLogo: true,
    allowCustomColors: true,
    allowCustomFonts: false,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
  },
};

export function TenantDefaultsPage() {
  const [defaults, setDefaults] = useState(mockDefaults);

  const handleReset = () => {
    setDefaults(mockDefaults);
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="테넌트 기본값 설정"
        description="새 테넌트 생성 시 적용되는 기본값을 설정합니다"
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

      <div className="grid grid-cols-2 gap-6">
        {/* Resource Limits */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-primary" />
              <CardTitle>리소스 제한</CardTitle>
            </div>
            <CardDescription>테넌트별 기본 리소스 제한입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                최대 사용자 수
              </Label>
              <Input
                type="number"
                value={defaults.limits.maxUsers}
                onChange={(e) => setDefaults({
                  ...defaults,
                  limits: { ...defaults.limits, maxUsers: Number(e.target.value) },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                최대 강좌 수
              </Label>
              <Input
                type="number"
                value={defaults.limits.maxCourses}
                onChange={(e) => setDefaults({
                  ...defaults,
                  limits: { ...defaults.limits, maxCourses: Number(e.target.value) },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                스토리지 용량 (GB)
              </Label>
              <Input
                type="number"
                value={defaults.limits.maxStorage}
                onChange={(e) => setDefaults({
                  ...defaults,
                  limits: { ...defaults.limits, maxStorage: Number(e.target.value) },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>최대 관리자 수</Label>
              <Input
                type="number"
                value={defaults.limits.maxAdmins}
                onChange={(e) => setDefaults({
                  ...defaults,
                  limits: { ...defaults.limits, maxAdmins: Number(e.target.value) },
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>기능 활성화</CardTitle>
            <CardDescription>기본으로 활성화되는 기능입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">커스텀 도메인</p>
                <p className="text-sm text-text-secondary">자체 도메인 연결 허용</p>
              </div>
              <Switch
                checked={defaults.features.customDomain}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  features: { ...defaults.features, customDomain: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SSO 연동</p>
                <p className="text-sm text-text-secondary">Single Sign-On 통합</p>
              </div>
              <Switch
                checked={defaults.features.ssoIntegration}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  features: { ...defaults.features, ssoIntegration: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">API 접근</p>
                <p className="text-sm text-text-secondary">REST API 사용 허용</p>
              </div>
              <Switch
                checked={defaults.features.apiAccess}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  features: { ...defaults.features, apiAccess: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">화이트 라벨링</p>
                <p className="text-sm text-text-secondary">브랜드 커스터마이징</p>
              </div>
              <Switch
                checked={defaults.features.whiteLabeling}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  features: { ...defaults.features, whiteLabeling: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">고급 분석</p>
                <p className="text-sm text-text-secondary">상세 분석 리포트</p>
              </div>
              <Switch
                checked={defaults.features.advancedAnalytics}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  features: { ...defaults.features, advancedAnalytics: v },
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding Permissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-brand-primary" />
              <CardTitle>브랜딩 권한</CardTitle>
            </div>
            <CardDescription>테넌트별 브랜딩 커스터마이징 권한입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">커스텀 로고</p>
                <p className="text-sm text-text-secondary">자체 로고 업로드 허용</p>
              </div>
              <Switch
                checked={defaults.branding.allowCustomLogo}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  branding: { ...defaults.branding, allowCustomLogo: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">커스텀 색상</p>
                <p className="text-sm text-text-secondary">색상 테마 변경 허용</p>
              </div>
              <Switch
                checked={defaults.branding.allowCustomColors}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  branding: { ...defaults.branding, allowCustomColors: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">커스텀 폰트</p>
                <p className="text-sm text-text-secondary">폰트 변경 허용</p>
              </div>
              <Switch
                checked={defaults.branding.allowCustomFonts}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  branding: { ...defaults.branding, allowCustomFonts: v },
                })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Defaults */}
        <Card>
          <CardHeader>
            <CardTitle>알림 기본값</CardTitle>
            <CardDescription>기본 알림 설정입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">이메일 알림</p>
                <p className="text-sm text-text-secondary">이메일로 알림 발송</p>
              </div>
              <Switch
                checked={defaults.notifications.emailNotifications}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  notifications: { ...defaults.notifications, emailNotifications: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">푸시 알림</p>
                <p className="text-sm text-text-secondary">브라우저 푸시 알림</p>
              </div>
              <Switch
                checked={defaults.notifications.pushNotifications}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  notifications: { ...defaults.notifications, pushNotifications: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS 알림</p>
                <p className="text-sm text-text-secondary">문자 메시지 알림</p>
              </div>
              <Switch
                checked={defaults.notifications.smsNotifications}
                onCheckedChange={(v) => setDefaults({
                  ...defaults,
                  notifications: { ...defaults.notifications, smsNotifications: v },
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
