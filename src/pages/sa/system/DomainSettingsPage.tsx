import { useState } from 'react';
import {
  Globe,
  Shield,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Switch } from '@/components/common/Switch';

// Mock 데이터
const mockDomains: {
  id: number;
  domain: string;
  type: 'PRIMARY' | 'CUSTOM';
  sslStatus: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  sslExpiry: string;
  tenantName: string;
  createdAt: string;
}[] = [
  { id: 1, domain: 'learn.megazone.com', type: 'CUSTOM', sslStatus: 'ACTIVE', sslExpiry: '2026-06-15', tenantName: '메가존클라우드', createdAt: '2025-01-15' },
  { id: 2, domain: 'edu.samsung.com', type: 'CUSTOM', sslStatus: 'ACTIVE', sslExpiry: '2026-03-20', tenantName: '삼성전자', createdAt: '2025-02-10' },
  { id: 3, domain: 'mzc.lp.cloud', type: 'PRIMARY', sslStatus: 'ACTIVE', sslExpiry: '2026-12-01', tenantName: '기본 도메인', createdAt: '2024-01-01' },
  { id: 4, domain: 'training.kakao.com', type: 'CUSTOM', sslStatus: 'PENDING', sslExpiry: '-', tenantName: '카카오', createdAt: '2025-12-28' },
];

const sslStatusConfig = {
  ACTIVE: { label: '활성', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  PENDING: { label: '발급중', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  EXPIRED: { label: '만료됨', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
};

export function DomainSettingsPage() {
  const [domains] = useState(mockDomains);
  const [forceHttps, setForceHttps] = useState(true);
  const [autoRenewSsl, setAutoRenewSsl] = useState(true);

  return (
    <div className="p-6">
      <AdminPageHeader
        title="도메인 및 SSL 설정"
        description="시스템 도메인과 SSL 인증서를 관리합니다"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            도메인 추가
          </Button>
        }
      />

      {/* Global Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>전역 설정</CardTitle>
          <CardDescription>모든 도메인에 적용되는 설정입니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">HTTPS 강제 적용</p>
              <p className="text-sm text-text-secondary">모든 HTTP 요청을 HTTPS로 리다이렉트합니다</p>
            </div>
            <Switch checked={forceHttps} onCheckedChange={setForceHttps} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SSL 인증서 자동 갱신</p>
              <p className="text-sm text-text-secondary">만료 30일 전에 자동으로 갱신합니다</p>
            </div>
            <Switch checked={autoRenewSsl} onCheckedChange={setAutoRenewSsl} />
          </div>
        </CardContent>
      </Card>

      {/* Domain List */}
      <Card>
        <CardHeader>
          <CardTitle>등록된 도메인</CardTitle>
          <CardDescription>시스템에 등록된 도메인 목록입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domains.map((domain) => {
              const statusConfig = sslStatusConfig[domain.sslStatus];
              const StatusIcon = statusConfig.icon;

              return (
                <div key={domain.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-bg-secondary">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-bg-secondary rounded-lg">
                      {domain.type === 'PRIMARY' ? (
                        <Shield className="h-5 w-5 text-brand-primary" />
                      ) : (
                        <Globe className="h-5 w-5 text-text-secondary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{domain.domain}</p>
                        {domain.type === 'PRIMARY' && (
                          <Badge variant="outline">기본</Badge>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">{domain.tenantName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </div>
                      {domain.sslExpiry !== '-' && (
                        <p className="text-xs text-text-secondary mt-1">만료: {domain.sslExpiry}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      {domain.type !== 'PRIMARY' && (
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
