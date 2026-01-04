import { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Monitor,
  Sidebar,
  PanelTop,
  PanelBottom,
  Loader2,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Label } from '@/components/common/Label';
import { Switch } from '@/components/common/Switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';
import { useTenantSettings, useUpdateLayoutSettings } from '@/hooks/ta';
import type { HeaderSettings, SidebarSettings, FooterSettings, ContentSettings } from '@/types/admin';

// 레이아웃 설정 타입
interface LayoutSettings {
  header: HeaderSettings;
  sidebar: SidebarSettings;
  footer: FooterSettings;
  content: ContentSettings;
}

// 기본 설정값
const defaultLayoutSettings: LayoutSettings = {
  header: {
    style: 'fixed',
    showLogo: true,
    showSearch: true,
    showNotifications: true,
  },
  sidebar: {
    style: 'collapsible',
    defaultCollapsed: false,
    showIcons: true,
  },
  footer: {
    enabled: true,
    showLinks: true,
    showCopyright: true,
  },
  content: {
    maxWidth: 'full',
    padding: 'normal',
  },
};

export function LayoutSettingsPage() {
  const [settings, setSettings] = useState<LayoutSettings>(defaultLayoutSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: tenantSettings, isLoading } = useTenantSettings();
  const updateLayout = useUpdateLayoutSettings();

  // 서버 데이터로 초기화
  useEffect(() => {
    if (tenantSettings) {
      setSettings({
        header: tenantSettings.headerSettings || defaultLayoutSettings.header,
        sidebar: tenantSettings.sidebarSettings || defaultLayoutSettings.sidebar,
        footer: tenantSettings.footerSettings || defaultLayoutSettings.footer,
        content: tenantSettings.contentSettings || defaultLayoutSettings.content,
      });
      setHasChanges(false);
    }
  }, [tenantSettings]);

  const handleReset = () => {
    if (tenantSettings) {
      setSettings({
        header: tenantSettings.headerSettings || defaultLayoutSettings.header,
        sidebar: tenantSettings.sidebarSettings || defaultLayoutSettings.sidebar,
        footer: tenantSettings.footerSettings || defaultLayoutSettings.footer,
        content: tenantSettings.contentSettings || defaultLayoutSettings.content,
      });
      setHasChanges(false);
    }
  };

  const handleSave = () => {
    updateLayout.mutate({
      headerSettings: settings.header as HeaderSettings,
      sidebarSettings: settings.sidebar as SidebarSettings,
      footerSettings: settings.footer as FooterSettings,
      contentSettings: settings.content as ContentSettings,
    }, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminPageHeader
        title="레이아웃/UI 설정"
        description="플랫폼의 레이아웃과 UI 구성을 설정합니다"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || updateLayout.isPending}>
              {updateLayout.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              저장
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-6">
        {/* Header Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PanelTop className="h-5 w-5 text-brand-primary" />
              <CardTitle>헤더 설정</CardTitle>
            </div>
            <CardDescription>상단 헤더 영역 설정입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>헤더 스타일</Label>
              <Select
                value={settings.header.style}
                onValueChange={(v) => {
                  setSettings({
                    ...settings,
                    header: { ...settings.header, style: v as HeaderSettings['style'] },
                  });
                  setHasChanges(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">고정</SelectItem>
                  <SelectItem value="sticky">스티키</SelectItem>
                  <SelectItem value="static">일반</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm">로고 표시</span>
                <Switch
                  checked={settings.header.showLogo}
                  onCheckedChange={(v) => {
                    setSettings({
                      ...settings,
                      header: { ...settings.header, showLogo: v },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">검색창 표시</span>
                <Switch
                  checked={settings.header.showSearch}
                  onCheckedChange={(v) => {
                    setSettings({
                      ...settings,
                      header: { ...settings.header, showSearch: v },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">알림 표시</span>
                <Switch
                  checked={settings.header.showNotifications}
                  onCheckedChange={(v) => {
                    setSettings({
                      ...settings,
                      header: { ...settings.header, showNotifications: v },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sidebar className="h-5 w-5 text-brand-primary" />
              <CardTitle>사이드바 설정</CardTitle>
            </div>
            <CardDescription>좌측 네비게이션 영역 설정입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>사이드바 스타일</Label>
              <Select
                value={settings.sidebar.style}
                onValueChange={(v) => {
                  setSettings({
                    ...settings,
                    sidebar: { ...settings.sidebar, style: v as SidebarSettings['style'] },
                  });
                  setHasChanges(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collapsible">접이식</SelectItem>
                  <SelectItem value="fixed">고정</SelectItem>
                  <SelectItem value="overlay">오버레이</SelectItem>
                  <SelectItem value="hidden">숨김</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm">기본 접힌 상태</span>
                <Switch
                  checked={settings.sidebar.defaultCollapsed}
                  onCheckedChange={(v) => {
                    setSettings({
                      ...settings,
                      sidebar: { ...settings.sidebar, defaultCollapsed: v },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">아이콘 표시</span>
                <Switch
                  checked={settings.sidebar.showIcons}
                  onCheckedChange={(v) => {
                    setSettings({
                      ...settings,
                      sidebar: { ...settings.sidebar, showIcons: v },
                    });
                    setHasChanges(true);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PanelBottom className="h-5 w-5 text-brand-primary" />
              <CardTitle>푸터 설정</CardTitle>
            </div>
            <CardDescription>하단 푸터 영역 설정입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">푸터 사용</p>
                <p className="text-sm text-text-secondary">푸터 영역을 표시합니다</p>
              </div>
              <Switch
                checked={settings.footer.enabled}
                onCheckedChange={(v) => {
                  setSettings({
                    ...settings,
                    footer: { ...settings.footer, enabled: v },
                  });
                  setHasChanges(true);
                }}
              />
            </div>
            {settings.footer.enabled && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">링크 표시</span>
                  <Switch
                    checked={settings.footer.showLinks}
                    onCheckedChange={(v) => {
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, showLinks: v },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">저작권 표시</span>
                  <Switch
                    checked={settings.footer.showCopyright}
                    onCheckedChange={(v) => {
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, showCopyright: v },
                      });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Content Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-brand-primary" />
              <CardTitle>콘텐츠 영역 설정</CardTitle>
            </div>
            <CardDescription>메인 콘텐츠 영역 설정입니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>최대 너비</Label>
              <Select
                value={settings.content.maxWidth}
                onValueChange={(v) => {
                  setSettings({
                    ...settings,
                    content: { ...settings.content, maxWidth: v as ContentSettings['maxWidth'] },
                  });
                  setHasChanges(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">전체 너비</SelectItem>
                  <SelectItem value="xl">Extra Large (1280px)</SelectItem>
                  <SelectItem value="lg">Large (1024px)</SelectItem>
                  <SelectItem value="md">Medium (768px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>여백</Label>
              <Select
                value={settings.content.padding}
                onValueChange={(v) => {
                  setSettings({
                    ...settings,
                    content: { ...settings.content, padding: v as ContentSettings['padding'] },
                  });
                  setHasChanges(true);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">없음</SelectItem>
                  <SelectItem value="compact">좁게</SelectItem>
                  <SelectItem value="normal">보통</SelectItem>
                  <SelectItem value="relaxed">넓게</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>미리보기</CardTitle>
          <CardDescription>현재 설정이 적용된 레이아웃 미리보기입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden h-64 bg-bg-secondary">
            <div className="h-10 bg-brand-primary flex items-center px-4">
              {settings.header.showLogo && <div className="w-20 h-5 bg-white/30 rounded" />}
              {settings.header.showSearch && <div className="ml-auto w-32 h-5 bg-white/20 rounded mr-2" />}
              {settings.header.showNotifications && <div className="w-5 h-5 bg-white/20 rounded" />}
            </div>
            <div className="flex h-[calc(100%-40px)]">
              {settings.sidebar.style !== 'hidden' && (
                <div className={`bg-gray-100 ${settings.sidebar.defaultCollapsed ? 'w-12' : 'w-48'} p-2`}>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        {settings.sidebar.showIcons && <div className="w-4 h-4 bg-gray-300 rounded" />}
                        {!settings.sidebar.defaultCollapsed && <div className="flex-1 h-3 bg-gray-300 rounded" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
                {settings.footer.enabled && (
                  <div className="h-8 bg-gray-200 flex items-center justify-center px-4">
                    {settings.footer.showCopyright && <div className="h-2 w-32 bg-gray-300 rounded" />}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
