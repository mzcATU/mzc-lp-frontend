import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Save,
  Upload,
  Trash2,
  Settings,
  Palette,
  Info,
} from 'lucide-react';
import {
  AdminPageHeader,
  StatusBadge,
  PlanBadge,
} from '@/components/domain/admin';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';
import { Switch } from '@/components/common/Switch';
import type { TenantStatus, PlanType } from '@/types/admin';

// Mock 데이터
interface TenantDetail {
  id: number;
  code: string;
  name: string;
  status: TenantStatus;
  plan: PlanType;
  userCount: number;
  courseCount: number;
  createdAt: string;
  adminEmail: string;
  adminName: string;
  domain?: string;
  branding: {
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    faviconUrl?: string;
  };
  settings: {
    maxUsers: number;
    maxCourses: number;
    maxStorage: number; // GB
    allowCustomDomain: boolean;
    allowCustomBranding: boolean;
    ssoEnabled: boolean;
    apiAccessEnabled: boolean;
  };
}

const mockTenantDetail: TenantDetail = {
  id: 1,
  code: 'mzc',
  name: '메가존클라우드',
  status: 'ACTIVE',
  plan: 'ENTERPRISE',
  userCount: 250,
  courseCount: 45,
  createdAt: '2025-01-15',
  adminEmail: 'admin@megazone.com',
  adminName: '김관리자',
  domain: 'learn.megazone.com',
  branding: {
    logoUrl: '/logos/mzc-logo.png',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    faviconUrl: '/favicons/mzc-favicon.ico',
  },
  settings: {
    maxUsers: 500,
    maxCourses: 100,
    maxStorage: 50,
    allowCustomDomain: true,
    allowCustomBranding: true,
    ssoEnabled: true,
    apiAccessEnabled: true,
  },
};

export function TenantDetailPage() {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 실제로는 API에서 id를 사용해 데이터를 가져옴
  const [tenant, setTenant] = useState<TenantDetail>(mockTenantDetail);

  const handleSave = () => {
    // API 호출
    console.log('Save tenant:', tenant);
  };

  const handleStatusChange = (status: TenantStatus) => {
    setTenant({ ...tenant, status });
  };

  const handlePlanChange = (plan: PlanType) => {
    setTenant({ ...tenant, plan });
  };

  const handleBrandingChange = (key: keyof TenantDetail['branding'], value: string) => {
    setTenant({
      ...tenant,
      branding: { ...tenant.branding, [key]: value },
    });
  };

  const handleSettingChange = (key: keyof TenantDetail['settings'], value: boolean | number) => {
    setTenant({
      ...tenant,
      settings: { ...tenant.settings, [key]: value },
    });
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title={tenant.name}
        description={`테넌트 코드: ${tenant.code}`}
        breadcrumb={[
          { label: '테넌트 관리', href: '/sa/tenants' },
          { label: tenant.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/sa/tenants')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </div>
        }
      />

      {/* 상태 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">상태</p>
                <div className="mt-1">
                  <StatusBadge status={tenant.status} />
                </div>
              </div>
              <Building2 className="h-8 w-8 text-text-secondary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">플랜</p>
                <div className="mt-1">
                  <PlanBadge plan={tenant.plan} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-text-secondary">사용자</p>
              <p className="text-2xl font-bold mt-1">
                {tenant.userCount.toLocaleString()}
                <span className="text-sm font-normal text-text-secondary ml-1">
                  / {tenant.settings.maxUsers.toLocaleString()}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-text-secondary">강좌</p>
              <p className="text-2xl font-bold mt-1">
                {tenant.courseCount}
                <span className="text-sm font-normal text-text-secondary ml-1">
                  / {tenant.settings.maxCourses}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 탭 컨텐츠 */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">
            <Info className="w-4 h-4 mr-2" />
            기본 정보
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Palette className="w-4 h-4 mr-2" />
            브랜딩 설정
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            테넌트 설정
          </TabsTrigger>
        </TabsList>

        {/* 기본 정보 탭 */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>테넌트의 기본 정보를 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">테넌트명</Label>
                  <Input
                    id="name"
                    value={tenant.name}
                    onChange={(e) => setTenant({ ...tenant, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">테넌트 코드</Label>
                  <Input
                    id="code"
                    value={tenant.code}
                    disabled
                    className="bg-bg-secondary"
                  />
                  <p className="text-xs text-text-secondary">테넌트 코드는 변경할 수 없습니다.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select value={tenant.status} onValueChange={(v) => handleStatusChange(v as TenantStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">활성</SelectItem>
                      <SelectItem value="INACTIVE">비활성</SelectItem>
                      <SelectItem value="SUSPENDED">정지</SelectItem>
                      <SelectItem value="PENDING">대기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">플랜</Label>
                  <Select value={tenant.plan} onValueChange={(v) => handlePlanChange(v as PlanType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="PRO">Pro</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">커스텀 도메인</Label>
                  <Input
                    id="domain"
                    value={tenant.domain || ''}
                    onChange={(e) => setTenant({ ...tenant, domain: e.target.value })}
                    placeholder="learn.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="createdAt">생성일</Label>
                  <Input
                    id="createdAt"
                    value={tenant.createdAt}
                    disabled
                    className="bg-bg-secondary"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">관리자 정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">관리자명</Label>
                    <Input
                      id="adminName"
                      value={tenant.adminName}
                      onChange={(e) => setTenant({ ...tenant, adminName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">관리자 이메일</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={tenant.adminEmail}
                      onChange={(e) => setTenant({ ...tenant, adminEmail: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 브랜딩 설정 탭 */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>브랜딩 설정</CardTitle>
              <CardDescription>테넌트의 로고, 색상 등 브랜딩을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 로고 업로드 */}
              <div className="space-y-4">
                <Label>로고</Label>
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-bg-secondary">
                    {tenant.branding.logoUrl ? (
                      <img
                        src={tenant.branding.logoUrl}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-text-secondary" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      로고 업로드
                    </Button>
                    {tenant.branding.logoUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleBrandingChange('logoUrl', '')}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        삭제
                      </Button>
                    )}
                    <p className="text-xs text-text-secondary">
                      권장 크기: 200x200px, PNG 또는 SVG
                    </p>
                  </div>
                </div>
              </div>

              {/* 파비콘 업로드 */}
              <div className="space-y-4">
                <Label>파비콘</Label>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-bg-secondary">
                    {tenant.branding.faviconUrl ? (
                      <img
                        src={tenant.branding.faviconUrl}
                        alt="Favicon"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-text-secondary" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      파비콘 업로드
                    </Button>
                    <p className="text-xs text-text-secondary">
                      권장 크기: 32x32px, ICO 또는 PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* 색상 설정 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">주 색상 (Primary)</Label>
                  <div className="flex gap-2">
                    <div
                      className="w-10 h-10 rounded-lg border cursor-pointer"
                      style={{ backgroundColor: tenant.branding.primaryColor }}
                    />
                    <Input
                      id="primaryColor"
                      value={tenant.branding.primaryColor}
                      onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">보조 색상 (Secondary)</Label>
                  <div className="flex gap-2">
                    <div
                      className="w-10 h-10 rounded-lg border cursor-pointer"
                      style={{ backgroundColor: tenant.branding.secondaryColor }}
                    />
                    <Input
                      id="secondaryColor"
                      value={tenant.branding.secondaryColor}
                      onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                      placeholder="#1E40AF"
                    />
                  </div>
                </div>
              </div>

              {/* 미리보기 */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">미리보기</h4>
                <div className="p-4 border rounded-lg">
                  <div
                    className="h-12 rounded-lg flex items-center px-4 text-white font-medium"
                    style={{ backgroundColor: tenant.branding.primaryColor }}
                  >
                    {tenant.name} 학습 플랫폼
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm"
                      style={{ backgroundColor: tenant.branding.primaryColor }}
                    >
                      주 버튼
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm"
                      style={{ backgroundColor: tenant.branding.secondaryColor }}
                    >
                      보조 버튼
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 테넌트 설정 탭 */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>테넌트 설정</CardTitle>
              <CardDescription>테넌트의 기능 제한 및 권한을 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 제한 설정 */}
              <div>
                <h4 className="font-medium mb-4">리소스 제한</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="maxUsers">최대 사용자 수</Label>
                    <Input
                      id="maxUsers"
                      type="number"
                      value={tenant.settings.maxUsers}
                      onChange={(e) => handleSettingChange('maxUsers', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-text-secondary">
                      현재: {tenant.userCount}명 사용 중
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxCourses">최대 강좌 수</Label>
                    <Input
                      id="maxCourses"
                      type="number"
                      value={tenant.settings.maxCourses}
                      onChange={(e) => handleSettingChange('maxCourses', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-text-secondary">
                      현재: {tenant.courseCount}개 사용 중
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxStorage">최대 저장 용량 (GB)</Label>
                    <Input
                      id="maxStorage"
                      type="number"
                      value={tenant.settings.maxStorage}
                      onChange={(e) => handleSettingChange('maxStorage', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* 기능 설정 */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">기능 설정</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">커스텀 도메인</p>
                      <p className="text-sm text-text-secondary">
                        자체 도메인으로 학습 플랫폼 접속 허용
                      </p>
                    </div>
                    <Switch
                      checked={tenant.settings.allowCustomDomain}
                      onCheckedChange={(checked) => handleSettingChange('allowCustomDomain', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">커스텀 브랜딩</p>
                      <p className="text-sm text-text-secondary">
                        로고, 색상 등 브랜딩 커스터마이징 허용
                      </p>
                    </div>
                    <Switch
                      checked={tenant.settings.allowCustomBranding}
                      onCheckedChange={(checked) => handleSettingChange('allowCustomBranding', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">SSO (Single Sign-On)</p>
                      <p className="text-sm text-text-secondary">
                        SAML, OAuth 등 SSO 연동 허용
                      </p>
                    </div>
                    <Switch
                      checked={tenant.settings.ssoEnabled}
                      onCheckedChange={(checked) => handleSettingChange('ssoEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">API 접근</p>
                      <p className="text-sm text-text-secondary">
                        REST API를 통한 데이터 접근 허용
                      </p>
                    </div>
                    <Switch
                      checked={tenant.settings.apiAccessEnabled}
                      onCheckedChange={(checked) => handleSettingChange('apiAccessEnabled', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* 위험 영역 */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4 text-red-600">위험 영역</h4>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-600">테넌트 삭제</p>
                      <p className="text-sm text-text-secondary">
                        이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제됩니다.
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      테넌트 삭제
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
