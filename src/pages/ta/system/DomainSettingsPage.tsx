import { useState } from 'react';
import {
  Globe,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Badge } from '@/components/common/Badge';
import { Switch } from '@/components/common/Switch';

// Mock 데이터
const mockDomainSettings = {
  primaryDomain: 'learn.megazone.com',
  sslStatus: 'ACTIVE' as const,
  sslExpiry: '2026-06-15',
  sslIssuer: "Let's Encrypt",
  customDomain: {
    enabled: true,
    domain: 'edu.megazone.com',
    verified: true,
  },
  settings: {
    forceHttps: true,
    autoRenewSsl: true,
  },
};

const sslStatusConfig = {
  ACTIVE: { label: '활성', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  PENDING: { label: '발급중', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
  EXPIRED: { label: '만료됨', icon: AlertCircle, color: 'text-red-600 bg-red-100' },
};

export function DomainSettingsPage() {
  const [settings, setSettings] = useState(mockDomainSettings);
  const [customDomainInput, setCustomDomainInput] = useState(settings.customDomain.domain);

  const statusConfig = sslStatusConfig[settings.sslStatus];
  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-6">
      <AdminPageHeader
        title="도메인 및 SSL 설정"
        description="테넌트 도메인과 SSL 인증서를 관리합니다"
      />

      <div className="space-y-6">
        {/* Current Domain Status */}
        <Card>
          <CardHeader>
            <CardTitle>현재 도메인 상태</CardTitle>
            <CardDescription>테넌트에 연결된 도메인 정보입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Primary Domain */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-brand-primary" />
                  <span className="font-medium">기본 도메인</span>
                </div>
                <p className="text-lg font-semibold">{settings.primaryDomain}</p>
                <a
                  href={`https://${settings.primaryDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-primary flex items-center gap-1 mt-2 hover:underline"
                >
                  사이트 열기 <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* SSL Status */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-brand-primary" />
                  <span className="font-medium">SSL 인증서</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`h-5 w-5 ${statusConfig.color.split(' ')[0]}`} />
                  <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                </div>
                <div className="mt-2 text-sm text-text-secondary">
                  <p>만료일: {settings.sslExpiry}</p>
                  <p>발급자: {settings.sslIssuer}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Custom Domain */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>커스텀 도메인</CardTitle>
                <CardDescription>자체 도메인을 연결하여 사용할 수 있습니다</CardDescription>
              </div>
              <Switch
                checked={settings.customDomain.enabled}
                onCheckedChange={(v) => setSettings({
                  ...settings,
                  customDomain: { ...settings.customDomain, enabled: v },
                })}
              />
            </div>
          </CardHeader>
          {settings.customDomain.enabled && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>도메인 주소</Label>
                <div className="flex gap-2">
                  <Input
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    placeholder="example.com"
                  />
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    검증
                  </Button>
                </div>
              </div>

              {settings.customDomain.verified && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-700">도메인이 검증되었습니다</span>
                </div>
              )}

              <div className="p-4 bg-bg-secondary rounded-lg">
                <h4 className="font-medium mb-2">DNS 설정 안내</h4>
                <p className="text-sm text-text-secondary mb-3">
                  도메인을 연결하려면 다음 DNS 레코드를 추가하세요:
                </p>
                <div className="space-y-2 text-sm font-mono bg-white p-3 rounded border">
                  <div className="flex gap-4">
                    <span className="text-text-secondary w-16">Type:</span>
                    <span>CNAME</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-text-secondary w-16">Name:</span>
                    <span>{customDomainInput.split('.')[0] || 'www'}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-text-secondary w-16">Value:</span>
                    <span>{settings.primaryDomain}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* SSL Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SSL 설정</CardTitle>
            <CardDescription>SSL 인증서 관련 설정입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">HTTPS 강제 적용</p>
                <p className="text-sm text-text-secondary">모든 HTTP 요청을 HTTPS로 리다이렉트합니다</p>
              </div>
              <Switch
                checked={settings.settings.forceHttps}
                onCheckedChange={(v) => setSettings({
                  ...settings,
                  settings: { ...settings.settings, forceHttps: v },
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SSL 인증서 자동 갱신</p>
                <p className="text-sm text-text-secondary">만료 30일 전에 자동으로 갱신합니다</p>
              </div>
              <Switch
                checked={settings.settings.autoRenewSsl}
                onCheckedChange={(v) => setSettings({
                  ...settings,
                  settings: { ...settings.settings, autoRenewSsl: v },
                })}
              />
            </div>
            <div className="pt-4 border-t">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                인증서 수동 갱신
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
