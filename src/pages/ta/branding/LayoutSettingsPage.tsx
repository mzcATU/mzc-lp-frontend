import { useState } from 'react';
import {
  Save,
  RotateCcw,
  Loader2,
  Palette,
  Image,
  PanelTop,
  PanelBottom,
  Navigation,
  Sidebar,
  Building2,
  FolderTree,
  Upload,
  Code,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  GripVertical,
  ImageIcon,
  Sun,
  Moon,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Label } from '@/components/common/Label';
import { Switch } from '@/components/common/Switch';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';

// 브랜딩 설정 타입
interface BrandingSettings {
  category: {
    enabled: boolean;
    items: string[];
  };
  company: {
    enabled: boolean;
    logo: string | null;
    logoPreview: string | null;
    name: string;
  };
  logo: {
    enabled: boolean;
    lightUrl: string | null;
    lightPreview: string | null;
    darkUrl: string | null;
    darkPreview: string | null;
    faviconUrl: string | null;
    faviconPreview: string | null;
  };
  colors: {
    enabled: boolean;
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  banner: {
    enabled: boolean;
    type: 'image' | 'code';
    imageUrl: string | null;
    imagePreview: string | null;
    code: string;
  };
  footer: {
    enabled: boolean;
    content: string;
    copyright: string;
    links: { label: string; url: string }[];
  };
  header: {
    enabled: boolean;
    showLogo: boolean;
    showSearch: boolean;
    showNotifications: boolean;
    menuItems: { label: string; url: string; visible: boolean }[];
  };
  navbar: {
    enabled: boolean;
    items: { label: string; url: string; icon: string; visible: boolean }[];
  };
  sidebarTU: {
    enabled: boolean;
    items: { label: string; url: string; icon: string; visible: boolean }[];
  };
  sidebarTO: {
    enabled: boolean;
    items: { label: string; url: string; icon: string; visible: boolean }[];
  };
}

// 기본 설정값 - 실제 TU 홈페이지(LandingPage)와 일치
const defaultBrandingSettings: BrandingSettings = {
  category: {
    enabled: true,
    items: ['전체', '개발', 'AI', '데이터', '디자인', '비즈니스', '마케팅', '외국어'],
  },
  company: {
    enabled: true,
    logo: null,
    logoPreview: null,
    name: 'MEGAZONECLOUD',
  },
  logo: {
    enabled: true,
    lightUrl: null,
    lightPreview: null,
    darkUrl: null,
    darkPreview: null,
    faviconUrl: null,
    faviconPreview: null,
  },
  colors: {
    enabled: true,
    primary: '#6778ff',
    secondary: '#a855f7',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#6bc2f0',
  },
  banner: {
    enabled: true,
    type: 'image',
    imageUrl: null,
    imagePreview: null,
    code: '',
  },
  footer: {
    enabled: true,
    content: '',
    copyright: `© ${new Date().getFullYear()} MEGAZONECLOUD. All rights reserved.`,
    links: [
      { label: '개인정보처리방침', url: '/privacy' },
      { label: '이용약관', url: '/terms' },
      { label: '이메일무단수집거부', url: '/email-policy' },
    ],
  },
  header: {
    enabled: true,
    showLogo: true,
    showSearch: true,
    showNotifications: true,
    menuItems: [
      { label: '강의 탐색', url: '/tu/b2c/courses', visible: true },
      { label: '로드맵', url: '/tu/b2c/roadmaps', visible: true },
      { label: '커뮤니티', url: '/tu/b2c/community', visible: true },
    ],
  },
  navbar: {
    enabled: true,
    items: [
      { label: '강의 탐색', url: '/tu/b2c/courses', icon: 'BookOpen', visible: true },
      { label: '로드맵', url: '/tu/b2c/roadmaps', icon: 'Map', visible: true },
      { label: '커뮤니티', url: '/tu/b2c/community', icon: 'Users', visible: true },
    ],
  },
  sidebarTU: {
    enabled: true,
    items: [
      { label: '내 학습', url: '/tu/b2c/mypage/learning', icon: 'BookOpen', visible: true },
      { label: '수강 완료', url: '/tu/b2c/mypage/completed', icon: 'Award', visible: true },
      { label: '인증서', url: '/tu/b2c/mypage/certificates', icon: 'Award', visible: true },
      { label: '프로필 설정', url: '/tu/b2c/mypage/profile', icon: 'Settings', visible: true },
    ],
  },
  sidebarTO: {
    enabled: true,
    items: [
      { label: '대시보드', url: '/tu/dashboard', icon: 'Home', visible: true },
      { label: '강의 디자인', url: '/tu/teaching/courses', icon: 'BookOpen', visible: true },
      { label: '강의 운영', url: '/tu/teaching/assignments', icon: 'Settings', visible: true },
      { label: '내 콘텐츠', url: '/tu/teaching/content', icon: 'FolderTree', visible: true },
      { label: '로드맵', url: '/tu/teaching/roadmaps', icon: 'Map', visible: true },
    ],
  },
};

// 색상 미리보기 컴포넌트
function ColorPreview({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-lg border border-border-default shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-text-secondary uppercase">{color}</p>
      </div>
    </div>
  );
}

// 브랜딩 카드 컴포넌트
function BrandingCard({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Card className={`h-full transition-opacity ${!enabled ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${enabled ? 'bg-brand-primary/10' : 'bg-gray-100'}`}>
              <Icon className={`h-5 w-5 ${enabled ? 'text-brand-primary' : 'text-gray-400'}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      <CardContent className={!enabled ? 'pointer-events-none' : ''}>
        {children}
      </CardContent>
    </Card>
  );
}

export function LayoutSettingsPage() {
  const [settings, setSettings] = useState<BrandingSettings>(defaultBrandingSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 카테고리 업데이트
  const updateCategory = (key: keyof BrandingSettings['category'], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      category: { ...prev.category, [key]: value },
    }));
    setHasChanges(true);
  };

  // 회사 정보 업데이트
  const updateCompany = (key: keyof BrandingSettings['company'], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      company: { ...prev.company, [key]: value },
    }));
    setHasChanges(true);
  };

  // 로고 업데이트
  const updateLogo = (key: keyof BrandingSettings['logo'], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      logo: { ...prev.logo, [key]: value },
    }));
    setHasChanges(true);
  };

  // 색상 업데이트
  const updateColor = (key: keyof BrandingSettings['colors'], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
    setHasChanges(true);
  };

  // 배너 업데이트
  const updateBanner = (key: keyof BrandingSettings['banner'], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      banner: { ...prev.banner, [key]: value },
    }));
    setHasChanges(true);
  };

  // 푸터 업데이트
  const updateFooter = (key: keyof BrandingSettings['footer'], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      footer: { ...prev.footer, [key]: value },
    }));
    setHasChanges(true);
  };

  // 헤더 업데이트
  const updateHeader = (key: keyof BrandingSettings['header'], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      header: { ...prev.header, [key]: value },
    }));
    setHasChanges(true);
  };

  // 네비바 업데이트
  const updateNavbar = (key: keyof BrandingSettings['navbar'], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      navbar: { ...prev.navbar, [key]: value },
    }));
    setHasChanges(true);
  };

  // TU 사이드바 업데이트
  const updateSidebarTU = (key: keyof BrandingSettings['sidebarTU'], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      sidebarTU: { ...prev.sidebarTU, [key]: value },
    }));
    setHasChanges(true);
  };

  // TO 사이드바 업데이트
  const updateSidebarTO = (key: keyof BrandingSettings['sidebarTO'], value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      sidebarTO: { ...prev.sidebarTO, [key]: value },
    }));
    setHasChanges(true);
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner' | 'lightLogo' | 'darkLogo' | 'favicon'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          updateCompany('logoPreview', reader.result as string);
        } else if (type === 'banner') {
          updateBanner('imagePreview', reader.result as string);
        } else if (type === 'lightLogo') {
          updateLogo('lightPreview', reader.result as string);
        } else if (type === 'darkLogo') {
          updateLogo('darkPreview', reader.result as string);
        } else if (type === 'favicon') {
          updateLogo('faviconPreview', reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 초기화
  const handleReset = () => {
    setSettings(defaultBrandingSettings);
    setHasChanges(false);
  };

  // 저장
  const handleSave = async () => {
    setIsSaving(true);
    // TODO: API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="브랜딩 설정"
        description="플랫폼의 브랜드 아이덴티티와 레이아웃을 커스터마이징합니다"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              저장
            </Button>
          </div>
        }
      />

      {/* 2열 그리드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* 1. 메인 컬러 */}
        <BrandingCard
          icon={Palette}
          title="메인 컬러"
          description="브랜드 색상과 시멘틱 컬러를 설정합니다"
          enabled={settings.colors.enabled}
          onToggle={(enabled) => updateColor('enabled', enabled)}
        >
          <div className="space-y-4">
            {/* 브랜드 컬러 */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-3">브랜드 컬러</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">주 색상 (Primary)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={settings.colors.primary}
                      onChange={(e) => updateColor('primary', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-border-default"
                    />
                    <Input
                      value={settings.colors.primary}
                      onChange={(e) => updateColor('primary', e.target.value)}
                      placeholder="#000000"
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">보조 색상 (Secondary)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={settings.colors.secondary}
                      onChange={(e) => updateColor('secondary', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-border-default"
                    />
                    <Input
                      value={settings.colors.secondary}
                      onChange={(e) => updateColor('secondary', e.target.value)}
                      placeholder="#000000"
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 시멘틱 컬러 */}
            <div className="pt-3 border-t border-border-default">
              <p className="text-sm font-medium text-text-secondary mb-3">시멘틱 컬러</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">성공 (Success)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={settings.colors.success}
                      onChange={(e) => updateColor('success', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-border-default"
                    />
                    <Input
                      value={settings.colors.success}
                      onChange={(e) => updateColor('success', e.target.value)}
                      placeholder="#000000"
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">경고 (Warning)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={settings.colors.warning}
                      onChange={(e) => updateColor('warning', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-border-default"
                    />
                    <Input
                      value={settings.colors.warning}
                      onChange={(e) => updateColor('warning', e.target.value)}
                      placeholder="#000000"
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">오류 (Error)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={settings.colors.error}
                      onChange={(e) => updateColor('error', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-border-default"
                    />
                    <Input
                      value={settings.colors.error}
                      onChange={(e) => updateColor('error', e.target.value)}
                      placeholder="#000000"
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">정보 (Info)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={settings.colors.info}
                      onChange={(e) => updateColor('info', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-border-default"
                    />
                    <Input
                      value={settings.colors.info}
                      onChange={(e) => updateColor('info', e.target.value)}
                      placeholder="#000000"
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 미리보기 */}
            <div className="pt-3 border-t border-border-default">
              <p className="text-sm text-text-secondary mb-3">미리보기</p>
              <div className="grid grid-cols-3 gap-3">
                <ColorPreview color={settings.colors.primary} label="주 색상" />
                <ColorPreview color={settings.colors.secondary} label="보조 색상" />
                <ColorPreview color={settings.colors.success} label="성공" />
                <ColorPreview color={settings.colors.warning} label="경고" />
                <ColorPreview color={settings.colors.error} label="오류" />
                <ColorPreview color={settings.colors.info} label="정보" />
              </div>
            </div>
          </div>
        </BrandingCard>

        {/* 2. 회사 로고 & 네이밍 */}
        <BrandingCard
          icon={Building2}
          title="회사 로고 & 네이밍"
          description="브랜드 로고와 회사명을 설정합니다"
          enabled={settings.company.enabled}
          onToggle={(enabled) => updateCompany('enabled', enabled)}
        >
          <div className="space-y-4">
            <div>
              <Label>회사명</Label>
              <Input
                value={settings.company.name}
                onChange={(e) => updateCompany('name', e.target.value)}
                placeholder="회사명을 입력하세요"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>로고 이미지</Label>
              <div className="mt-1.5 border-2 border-dashed border-border-default rounded-lg p-4 text-center hover:border-brand-primary transition-colors">
                {settings.company.logoPreview ? (
                  <div className="space-y-2">
                    <img
                      src={settings.company.logoPreview}
                      alt="Logo preview"
                      className="max-h-20 mx-auto"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateCompany('logoPreview', null)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-text-tertiary mb-2" />
                    <p className="text-sm text-text-secondary">클릭하여 로고 업로드</p>
                    <p className="text-xs text-text-tertiary mt-1">PNG, JPG, SVG (최대 2MB)</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </BrandingCard>

        {/* 3. 로고 (라이트/다크 모드) */}
        <BrandingCard
          icon={ImageIcon}
          title="로고 설정"
          description="라이트/다크 모드 로고와 파비콘을 설정합니다"
          enabled={settings.logo.enabled}
          onToggle={(enabled) => updateLogo('enabled', enabled)}
        >
          <div className="space-y-4">
            {/* 라이트 모드 로고 */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sun className="h-4 w-4 text-amber-500" />
                <Label>라이트 모드 로고</Label>
              </div>
              <div className="border-2 border-dashed border-border-default rounded-lg p-4 text-center bg-white hover:border-brand-primary transition-colors">
                {settings.logo.lightPreview ? (
                  <div className="space-y-2">
                    <img
                      src={settings.logo.lightPreview}
                      alt="Light Logo"
                      className="max-h-16 mx-auto"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateLogo('lightPreview', null)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="h-6 w-6 mx-auto text-text-tertiary mb-1" />
                    <p className="text-xs text-text-secondary">라이트 모드 로고 업로드</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'lightLogo')}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* 다크 모드 로고 */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Moon className="h-4 w-4 text-indigo-400" />
                <Label>다크 모드 로고</Label>
              </div>
              <div className="border-2 border-dashed border-border-default rounded-lg p-4 text-center bg-gray-900 hover:border-brand-primary transition-colors">
                {settings.logo.darkPreview ? (
                  <div className="space-y-2">
                    <img
                      src={settings.logo.darkPreview}
                      alt="Dark Logo"
                      className="max-h-16 mx-auto"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300"
                      onClick={() => updateLogo('darkPreview', null)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="h-6 w-6 mx-auto text-gray-500 mb-1" />
                    <p className="text-xs text-gray-400">다크 모드 로고 업로드</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'darkLogo')}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* 파비콘 */}
            <div>
              <Label>파비콘</Label>
              <div className="flex items-center gap-4 mt-1.5">
                <div className="w-14 h-14 border-2 border-dashed border-border-default rounded-lg flex items-center justify-center bg-bg-secondary">
                  {settings.logo.faviconPreview ? (
                    <img
                      src={settings.logo.faviconPreview}
                      alt="Favicon"
                      className="w-8 h-8"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-text-tertiary" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" />
                        업로드
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*,.ico"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'favicon')}
                    />
                  </label>
                  <p className="text-xs text-text-tertiary mt-1">권장: 32x32px, ICO 또는 PNG</p>
                </div>
                {settings.logo.faviconPreview && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateLogo('faviconPreview', null)}
                  >
                    <Trash2 className="h-4 w-4 text-status-error" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </BrandingCard>

        {/* 4. 카테고리 */}
        <BrandingCard
          icon={FolderTree}
          title="카테고리"
          description="강의 카테고리를 관리합니다"
          enabled={settings.category.enabled}
          onToggle={(enabled) => updateCategory('enabled', enabled)}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              {settings.category.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-text-tertiary cursor-grab" />
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...settings.category.items];
                      newItems[index] = e.target.value;
                      updateCategory('items', newItems);
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newItems = settings.category.items.filter((_, i) => i !== index);
                      updateCategory('items', newItems);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-status-error" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateCategory('items', [...settings.category.items, ''])}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              카테고리 추가
            </Button>
          </div>
        </BrandingCard>

        {/* 6. 배너 */}
        <BrandingCard
          icon={Image}
          title="배너"
          description="메인 페이지 배너를 설정합니다"
          enabled={settings.banner.enabled}
          onToggle={(enabled) => updateBanner('enabled', enabled)}
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={settings.banner.type === 'image' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateBanner('type', 'image')}
              >
                <Image className="mr-2 h-4 w-4" />
                이미지
              </Button>
              <Button
                variant={settings.banner.type === 'code' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateBanner('type', 'code')}
              >
                <Code className="mr-2 h-4 w-4" />
                HTML 코드
              </Button>
            </div>

            {settings.banner.type === 'image' ? (
              <div className="border-2 border-dashed border-border-default rounded-lg p-4 text-center hover:border-brand-primary transition-colors">
                {settings.banner.imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={settings.banner.imagePreview}
                      alt="Banner preview"
                      className="max-h-32 mx-auto rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateBanner('imagePreview', null)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-text-tertiary mb-2" />
                    <p className="text-sm text-text-secondary">배너 이미지 업로드</p>
                    <p className="text-xs text-text-tertiary mt-1">PNG, JPG (권장: 1920x400)</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'banner')}
                    />
                  </label>
                )}
              </div>
            ) : (
              <div>
                <Textarea
                  value={settings.banner.code}
                  onChange={(e) => updateBanner('code', e.target.value)}
                  placeholder="<div>배너 HTML 코드를 입력하세요</div>"
                  className="font-mono text-sm min-h-[120px]"
                />
              </div>
            )}
          </div>
        </BrandingCard>

        {/* 5. 푸터 */}
        <BrandingCard
          icon={PanelBottom}
          title="푸터"
          description="하단 영역을 설정합니다"
          enabled={settings.footer.enabled}
          onToggle={(enabled) => updateFooter('enabled', enabled)}
        >
          <div className="space-y-4">
            <div>
              <Label>푸터 내용</Label>
              <Textarea
                value={settings.footer.content}
                onChange={(e) => updateFooter('content', e.target.value)}
                placeholder="푸터에 표시할 내용을 입력하세요"
                className="mt-1.5 min-h-[80px]"
              />
            </div>
            <div>
              <Label>저작권 표시</Label>
              <Input
                value={settings.footer.copyright}
                onChange={(e) => updateFooter('copyright', e.target.value)}
                placeholder="© 2024 Company. All rights reserved."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>푸터 링크</Label>
              <div className="space-y-2 mt-1.5">
                {settings.footer.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...settings.footer.links];
                        newLinks[index].label = e.target.value;
                        updateFooter('links', newLinks);
                      }}
                      placeholder="링크 이름"
                      className="flex-1"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...settings.footer.links];
                        newLinks[index].url = e.target.value;
                        updateFooter('links', newLinks);
                      }}
                      placeholder="/url"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newLinks = settings.footer.links.filter((_, i) => i !== index);
                        updateFooter('links', newLinks);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-status-error" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateFooter('links', [...settings.footer.links, { label: '', url: '' }]);
                  }}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  링크 추가
                </Button>
              </div>
            </div>
          </div>
        </BrandingCard>

        {/* 6. 헤더 */}
        <BrandingCard
          icon={PanelTop}
          title="헤더"
          description="상단 헤더 영역을 설정합니다"
          enabled={settings.header.enabled}
          onToggle={(enabled) => updateHeader('enabled', enabled)}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm">로고 표시</span>
                <Switch
                  checked={settings.header.showLogo}
                  onCheckedChange={(checked) => updateHeader('showLogo', checked)}
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm">검색 표시</span>
                <Switch
                  checked={settings.header.showSearch}
                  onCheckedChange={(checked) => updateHeader('showSearch', checked)}
                />
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-sm">알림 표시</span>
                <Switch
                  checked={settings.header.showNotifications}
                  onCheckedChange={(checked) => updateHeader('showNotifications', checked)}
                />
              </div>
            </div>
            <div>
              <Label>메뉴 항목</Label>
              <div className="space-y-2 mt-1.5">
                {settings.header.menuItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = [...settings.header.menuItems];
                        newItems[index].visible = !newItems[index].visible;
                        updateHeader('menuItems', newItems);
                      }}
                    >
                      {item.visible ? (
                        <Eye className="h-4 w-4 text-status-success" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-text-tertiary" />
                      )}
                    </Button>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...settings.header.menuItems];
                        newItems[index].label = e.target.value;
                        updateHeader('menuItems', newItems);
                      }}
                      placeholder="메뉴명"
                      className="flex-1"
                    />
                    <Input
                      value={item.url}
                      onChange={(e) => {
                        const newItems = [...settings.header.menuItems];
                        newItems[index].url = e.target.value;
                        updateHeader('menuItems', newItems);
                      }}
                      placeholder="/url"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = settings.header.menuItems.filter((_, i) => i !== index);
                        updateHeader('menuItems', newItems);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-status-error" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateHeader('menuItems', [
                      ...settings.header.menuItems,
                      { label: '', url: '', visible: true },
                    ]);
                  }}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  메뉴 추가
                </Button>
              </div>
            </div>
          </div>
        </BrandingCard>

        {/* 7. 네비바 */}
        <BrandingCard
          icon={Navigation}
          title="네비게이션 바"
          description="네비게이션 메뉴를 설정합니다"
          enabled={settings.navbar.enabled}
          onToggle={(enabled) => updateNavbar('enabled', enabled)}
        >
          <div className="space-y-4">
            <div>
              <Label>네비게이션 항목</Label>
              <div className="space-y-2 mt-1.5">
                {settings.navbar.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = [...settings.navbar.items];
                        newItems[index].visible = !newItems[index].visible;
                        updateNavbar('items', newItems);
                      }}
                    >
                      {item.visible ? (
                        <Eye className="h-4 w-4 text-status-success" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-text-tertiary" />
                      )}
                    </Button>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...settings.navbar.items];
                        newItems[index].label = e.target.value;
                        updateNavbar('items', newItems);
                      }}
                      placeholder="항목명"
                      className="flex-1"
                    />
                    <Input
                      value={item.url}
                      onChange={(e) => {
                        const newItems = [...settings.navbar.items];
                        newItems[index].url = e.target.value;
                        updateNavbar('items', newItems);
                      }}
                      placeholder="/url"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = settings.navbar.items.filter((_, i) => i !== index);
                        updateNavbar('items', newItems);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-status-error" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateNavbar('items', [
                      ...settings.navbar.items,
                      { label: '', url: '', icon: '', visible: true },
                    ]);
                  }}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </div>
            </div>
          </div>
        </BrandingCard>

        {/* 8. 사이드바 (마이페이지) */}
        <BrandingCard
          icon={Sidebar}
          title="사이드바 (마이페이지)"
          description="마이페이지 사이드바 메뉴를 설정합니다"
          enabled={settings.sidebarTU.enabled}
          onToggle={(enabled) => updateSidebarTU('enabled', enabled)}
        >
          <div className="space-y-4">
            <div>
              <Label>사이드바 항목</Label>
              <div className="space-y-2 mt-1.5">
                {settings.sidebarTU.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = [...settings.sidebarTU.items];
                        newItems[index].visible = !newItems[index].visible;
                        updateSidebarTU('items', newItems);
                      }}
                    >
                      {item.visible ? (
                        <Eye className="h-4 w-4 text-status-success" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-text-tertiary" />
                      )}
                    </Button>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...settings.sidebarTU.items];
                        newItems[index].label = e.target.value;
                        updateSidebarTU('items', newItems);
                      }}
                      placeholder="항목명"
                      className="flex-1"
                    />
                    <Input
                      value={item.url}
                      onChange={(e) => {
                        const newItems = [...settings.sidebarTU.items];
                        newItems[index].url = e.target.value;
                        updateSidebarTU('items', newItems);
                      }}
                      placeholder="/url"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = settings.sidebarTU.items.filter((_, i) => i !== index);
                        updateSidebarTU('items', newItems);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-status-error" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateSidebarTU('items', [
                      ...settings.sidebarTU.items,
                      { label: '', url: '', icon: '', visible: true },
                    ]);
                  }}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </div>
            </div>
          </div>
        </BrandingCard>

        {/* 9. 사이드바 (TO - 테넌트 관리자) */}
        <BrandingCard
          icon={Sidebar}
          title="사이드바 (TO)"
          description="테넌트 관리자용 사이드바 메뉴를 설정합니다"
          enabled={settings.sidebarTO.enabled}
          onToggle={(enabled) => updateSidebarTO('enabled', enabled)}
        >
          <div className="space-y-4">
            <div>
              <Label>사이드바 항목</Label>
              <div className="space-y-2 mt-1.5">
                {settings.sidebarTO.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = [...settings.sidebarTO.items];
                        newItems[index].visible = !newItems[index].visible;
                        updateSidebarTO('items', newItems);
                      }}
                    >
                      {item.visible ? (
                        <Eye className="h-4 w-4 text-status-success" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-text-tertiary" />
                      )}
                    </Button>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...settings.sidebarTO.items];
                        newItems[index].label = e.target.value;
                        updateSidebarTO('items', newItems);
                      }}
                      placeholder="항목명"
                      className="flex-1"
                    />
                    <Input
                      value={item.url}
                      onChange={(e) => {
                        const newItems = [...settings.sidebarTO.items];
                        newItems[index].url = e.target.value;
                        updateSidebarTO('items', newItems);
                      }}
                      placeholder="/url"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newItems = settings.sidebarTO.items.filter((_, i) => i !== index);
                        updateSidebarTO('items', newItems);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-status-error" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    updateSidebarTO('items', [
                      ...settings.sidebarTO.items,
                      { label: '', url: '', icon: '', visible: true },
                    ]);
                  }}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </div>
            </div>
          </div>
        </BrandingCard>
      </div>
    </div>
  );
}
