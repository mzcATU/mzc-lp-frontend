import { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Monitor,
  Sidebar,
  PanelTop,
  PanelBottom,
  Loader2,
  Type,
  Palette,
  Layers,
  Accessibility,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Check,
  Tablet,
  Bell,
  Search,
  User,
  Home,
  Settings,
  FileText,
  BarChart3,
  Users,
  Mail,
  Phone,
  MapPin,
  Building,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Menu,
  X,
  Star,
  Map,
  MessageSquare,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Label } from '@/components/common/Label';
import { Switch } from '@/components/common/Switch';
import { Input } from '@/components/common/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';
import { useTenantSettings, useUpdateLayoutSettings } from '@/hooks/ta';
import type {
  HeaderSettings,
  SidebarSettings,
  FooterSettings,
  ContentSettings,
  TypographySettings,
  ColorModeSettings,
  ComponentStyleSettings,
  AccessibilitySettings,
  ResponsiveSettings,
} from '@/types/admin';

// 전체 레이아웃 설정 타입
interface LayoutSettings {
  header: HeaderSettings;
  sidebar: SidebarSettings;
  footer: FooterSettings;
  content: ContentSettings;
  typography: TypographySettings;
  colorMode: ColorModeSettings;
  componentStyle: ComponentStyleSettings;
  accessibility: AccessibilitySettings;
  responsive: ResponsiveSettings;
}

// 기본 설정값
const defaultLayoutSettings: LayoutSettings = {
  header: {
    style: 'fixed',
    showLogo: true,
    showSearch: true,
    showNotifications: true,
    height: 'default',
    backgroundOpacity: 'solid',
    navPosition: 'left',
    userMenuStyle: 'dropdown',
    shadow: 'sm',
    mobileMenuStyle: 'drawer',
  },
  sidebar: {
    style: 'collapsible',
    defaultCollapsed: false,
    showIcons: true,
    width: 'default',
    menuGroupStyle: 'accordion',
    activeIndicator: 'background',
    itemSpacing: 'default',
    scrollbarStyle: 'hover',
    bottomSection: 'userInfo',
  },
  footer: {
    enabled: true,
    showLinks: true,
    showCopyright: true,
    layout: 'single',
    showSocialLinks: false,
    socialPlatforms: [],
    showCompanyInfo: false,
    companyInfoFields: [],
    showNewsletter: false,
  },
  content: {
    maxWidth: 'full',
    padding: 'normal',
    pageTransition: 'fade',
    cardStyle: 'shadow',
    cardRadius: 'md',
    tableStyle: 'striped',
    buttonStyle: 'rounded',
    loadingIndicator: 'spinner',
  },
  typography: {
    fontScale: 'default',
    lineHeight: 'normal',
    headingStyle: 'semibold',
    headingCase: 'normal',
  },
  colorMode: {
    defaultMode: 'system',
    allowUserToggle: true,
    togglePosition: 'header',
    transitionDuration: 'normal',
  },
  componentStyle: {
    density: 'default',
    inputStyle: 'outline',
    badgeStyle: 'solid',
    avatarStyle: 'circle',
    iconSize: 'default',
  },
  accessibility: {
    highContrastMode: false,
    fontSizeAdjustable: true,
    reduceMotion: false,
    focusIndicator: 'default',
    screenReaderOptimized: false,
  },
  responsive: {
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    tabletLayout: 'adaptive',
    mobileNavStyle: 'bottom',
  },
};

// 옵션 선택 컴포넌트
function OptionSelect({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div>
        <Label>{label}</Label>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// 토글 스위치 컴포넌트
function ToggleOption({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-text-secondary">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

// 체크박스 그룹 컴포넌트
function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              selected.includes(opt.value)
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'bg-bg-secondary text-text-secondary border-border-default hover:border-brand-primary'
            }`}
          >
            {selected.includes(opt.value) && <Check className="w-3 h-3 inline mr-1" />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// 섹션 접기/펼치기 컴포넌트
function CollapsibleSection({
  icon: Icon,
  title,
  description,
  children,
  defaultOpen = true,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-brand-primary" />
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-text-secondary" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-secondary" />
          )}
        </div>
      </CardHeader>
      {isOpen && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

// 미리보기 페이지 타입
type PreviewPageType = 'admin' | 'operator' | 'user';

export function LayoutSettingsPage() {
  const [settings, setSettings] = useState<LayoutSettings>(defaultLayoutSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewPageType, setPreviewPageType] = useState<PreviewPageType>('admin');

  const { data: tenantSettings, isLoading } = useTenantSettings();
  const updateLayout = useUpdateLayoutSettings();

  // 서버 데이터로 초기화
  useEffect(() => {
    if (tenantSettings) {
      setSettings({
        header: { ...defaultLayoutSettings.header, ...tenantSettings.headerSettings },
        sidebar: { ...defaultLayoutSettings.sidebar, ...tenantSettings.sidebarSettings },
        footer: { ...defaultLayoutSettings.footer, ...tenantSettings.footerSettings },
        content: { ...defaultLayoutSettings.content, ...tenantSettings.contentSettings },
        typography: { ...defaultLayoutSettings.typography, ...tenantSettings.typographySettings },
        colorMode: { ...defaultLayoutSettings.colorMode, ...tenantSettings.colorModeSettings },
        componentStyle: { ...defaultLayoutSettings.componentStyle, ...tenantSettings.componentStyleSettings },
        accessibility: { ...defaultLayoutSettings.accessibility, ...tenantSettings.accessibilitySettings },
        responsive: { ...defaultLayoutSettings.responsive, ...tenantSettings.responsiveSettings },
      });
      setHasChanges(false);
    }
  }, [tenantSettings]);

  const updateSettings = <K extends keyof LayoutSettings>(
    section: K,
    key: keyof LayoutSettings[K],
    value: LayoutSettings[K][keyof LayoutSettings[K]]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setHasChanges(true);
  };

  const handleReset = () => {
    if (tenantSettings) {
      setSettings({
        header: { ...defaultLayoutSettings.header, ...tenantSettings.headerSettings },
        sidebar: { ...defaultLayoutSettings.sidebar, ...tenantSettings.sidebarSettings },
        footer: { ...defaultLayoutSettings.footer, ...tenantSettings.footerSettings },
        content: { ...defaultLayoutSettings.content, ...tenantSettings.contentSettings },
        typography: { ...defaultLayoutSettings.typography, ...tenantSettings.typographySettings },
        colorMode: { ...defaultLayoutSettings.colorMode, ...tenantSettings.colorModeSettings },
        componentStyle: { ...defaultLayoutSettings.componentStyle, ...tenantSettings.componentStyleSettings },
        accessibility: { ...defaultLayoutSettings.accessibility, ...tenantSettings.accessibilitySettings },
        responsive: { ...defaultLayoutSettings.responsive, ...tenantSettings.responsiveSettings },
      });
      setHasChanges(false);
    }
  };

  const handleSave = () => {
    updateLayout.mutate(
      {
        headerSettings: settings.header,
        sidebarSettings: settings.sidebar,
        footerSettings: settings.footer,
        contentSettings: settings.content,
        typographySettings: settings.typography,
        colorModeSettings: settings.colorMode,
        componentStyleSettings: settings.componentStyle,
        accessibilitySettings: settings.accessibility,
        responsiveSettings: settings.responsive,
      },
      {
        onSuccess: () => {
          setHasChanges(false);
        },
      }
    );
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
        description="플랫폼의 레이아웃과 UI 구성을 상세하게 설정합니다"
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

      <div className="space-y-6">
        {/* ========== 헤더 설정 ========== */}
        <CollapsibleSection
          icon={PanelTop}
          title="헤더 설정"
          description="상단 헤더 영역의 스타일과 기능을 설정합니다"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <OptionSelect
                label="헤더 스타일"
                description="스크롤 시 헤더 동작 방식"
                value={settings.header.style}
                options={[
                  { value: 'fixed', label: '고정 (항상 상단에 표시)' },
                  { value: 'sticky', label: '스티키 (스크롤 시 나타남)' },
                  { value: 'static', label: '일반 (스크롤과 함께 이동)' },
                ]}
                onChange={(v) => updateSettings('header', 'style', v as HeaderSettings['style'])}
              />
              <OptionSelect
                label="헤더 높이"
                value={settings.header.height}
                options={[
                  { value: 'compact', label: '컴팩트 (48px)' },
                  { value: 'default', label: '기본 (64px)' },
                  { value: 'large', label: '크게 (80px)' },
                ]}
                onChange={(v) => updateSettings('header', 'height', v as HeaderSettings['height'])}
              />
              <OptionSelect
                label="배경 투명도"
                description="스크롤 시 배경 효과"
                value={settings.header.backgroundOpacity}
                options={[
                  { value: 'solid', label: '불투명' },
                  { value: 'translucent', label: '반투명 (블러 효과)' },
                  { value: 'transparent', label: '투명' },
                ]}
                onChange={(v) => updateSettings('header', 'backgroundOpacity', v as HeaderSettings['backgroundOpacity'])}
              />
              <OptionSelect
                label="그림자"
                value={settings.header.shadow}
                options={[
                  { value: 'none', label: '없음' },
                  { value: 'sm', label: '얇은 그림자' },
                  { value: 'md', label: '두꺼운 그림자' },
                ]}
                onChange={(v) => updateSettings('header', 'shadow', v as HeaderSettings['shadow'])}
              />
            </div>
            <div className="space-y-4">
              <OptionSelect
                label="네비게이션 위치"
                value={settings.header.navPosition}
                options={[
                  { value: 'left', label: '좌측' },
                  { value: 'center', label: '중앙' },
                  { value: 'right', label: '우측' },
                ]}
                onChange={(v) => updateSettings('header', 'navPosition', v as HeaderSettings['navPosition'])}
              />
              <OptionSelect
                label="사용자 메뉴 스타일"
                value={settings.header.userMenuStyle}
                options={[
                  { value: 'avatar', label: '아바타만' },
                  { value: 'name', label: '이름 표시' },
                  { value: 'dropdown', label: '드롭다운' },
                ]}
                onChange={(v) => updateSettings('header', 'userMenuStyle', v as HeaderSettings['userMenuStyle'])}
              />
              <OptionSelect
                label="모바일 메뉴 스타일"
                value={settings.header.mobileMenuStyle}
                options={[
                  { value: 'hamburger', label: '햄버거 메뉴' },
                  { value: 'drawer', label: '드로어' },
                  { value: 'bottomSheet', label: '바텀 시트' },
                ]}
                onChange={(v) => updateSettings('header', 'mobileMenuStyle', v as HeaderSettings['mobileMenuStyle'])}
              />
              <div className="pt-4 border-t space-y-2">
                <ToggleOption
                  label="로고 표시"
                  checked={settings.header.showLogo}
                  onChange={(v) => updateSettings('header', 'showLogo', v)}
                />
                <ToggleOption
                  label="검색창 표시"
                  checked={settings.header.showSearch}
                  onChange={(v) => updateSettings('header', 'showSearch', v)}
                />
                <ToggleOption
                  label="알림 아이콘 표시"
                  checked={settings.header.showNotifications}
                  onChange={(v) => updateSettings('header', 'showNotifications', v)}
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* ========== 사이드바 설정 ========== */}
        <CollapsibleSection
          icon={Sidebar}
          title="사이드바 설정"
          description="좌측 네비게이션 영역의 스타일과 동작을 설정합니다"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <OptionSelect
                label="사이드바 스타일"
                value={settings.sidebar.style}
                options={[
                  { value: 'collapsible', label: '접이식' },
                  { value: 'fixed', label: '고정' },
                  { value: 'overlay', label: '오버레이' },
                  { value: 'hidden', label: '숨김' },
                ]}
                onChange={(v) => updateSettings('sidebar', 'style', v as SidebarSettings['style'])}
              />
              <OptionSelect
                label="사이드바 너비"
                value={settings.sidebar.width}
                options={[
                  { value: 'narrow', label: '좁게 (200px)' },
                  { value: 'default', label: '보통 (240px)' },
                  { value: 'wide', label: '넓게 (280px)' },
                ]}
                onChange={(v) => updateSettings('sidebar', 'width', v as SidebarSettings['width'])}
              />
              <OptionSelect
                label="메뉴 그룹 스타일"
                value={settings.sidebar.menuGroupStyle}
                options={[
                  { value: 'accordion', label: '아코디언 (접이식)' },
                  { value: 'expanded', label: '항상 펼침' },
                  { value: 'divider', label: '구분선만' },
                ]}
                onChange={(v) => updateSettings('sidebar', 'menuGroupStyle', v as SidebarSettings['menuGroupStyle'])}
              />
              <OptionSelect
                label="활성 메뉴 표시"
                value={settings.sidebar.activeIndicator}
                options={[
                  { value: 'background', label: '배경색 강조' },
                  { value: 'leftBar', label: '좌측 바' },
                  { value: 'underline', label: '밑줄' },
                  { value: 'iconColor', label: '아이콘 색상' },
                ]}
                onChange={(v) => updateSettings('sidebar', 'activeIndicator', v as SidebarSettings['activeIndicator'])}
              />
            </div>
            <div className="space-y-4">
              <OptionSelect
                label="메뉴 아이템 간격"
                value={settings.sidebar.itemSpacing}
                options={[
                  { value: 'compact', label: '좁게' },
                  { value: 'default', label: '보통' },
                  { value: 'relaxed', label: '넓게' },
                ]}
                onChange={(v) => updateSettings('sidebar', 'itemSpacing', v as SidebarSettings['itemSpacing'])}
              />
              <OptionSelect
                label="스크롤바 표시"
                value={settings.sidebar.scrollbarStyle}
                options={[
                  { value: 'always', label: '항상 표시' },
                  { value: 'hover', label: '호버 시만' },
                  { value: 'hidden', label: '숨김' },
                ]}
                onChange={(v) => updateSettings('sidebar', 'scrollbarStyle', v as SidebarSettings['scrollbarStyle'])}
              />
              <OptionSelect
                label="하단 영역"
                value={settings.sidebar.bottomSection}
                options={[
                  { value: 'userInfo', label: '사용자 정보' },
                  { value: 'logout', label: '로그아웃 버튼' },
                  { value: 'settings', label: '설정 링크' },
                  { value: 'none', label: '없음' },
                ]}
                onChange={(v) => updateSettings('sidebar', 'bottomSection', v as SidebarSettings['bottomSection'])}
              />
              <div className="pt-4 border-t space-y-2">
                <ToggleOption
                  label="기본 접힌 상태"
                  description="페이지 로드 시 사이드바를 접은 상태로 표시"
                  checked={settings.sidebar.defaultCollapsed}
                  onChange={(v) => updateSettings('sidebar', 'defaultCollapsed', v)}
                />
                <ToggleOption
                  label="아이콘 표시"
                  checked={settings.sidebar.showIcons}
                  onChange={(v) => updateSettings('sidebar', 'showIcons', v)}
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* ========== 푸터 설정 ========== */}
        <CollapsibleSection
          icon={PanelBottom}
          title="푸터 설정"
          description="하단 푸터 영역의 구성을 설정합니다"
        >
          <div className="space-y-6">
            <ToggleOption
              label="푸터 사용"
              description="푸터 영역을 표시합니다"
              checked={settings.footer.enabled}
              onChange={(v) => updateSettings('footer', 'enabled', v)}
            />
            {settings.footer.enabled && (
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-4">
                  <OptionSelect
                    label="푸터 레이아웃"
                    value={settings.footer.layout}
                    options={[
                      { value: 'single', label: '단일 행' },
                      { value: 'multi-column', label: '다중 열' },
                      { value: 'minimal', label: '미니멀' },
                    ]}
                    onChange={(v) => updateSettings('footer', 'layout', v as FooterSettings['layout'])}
                  />
                  <ToggleOption
                    label="링크 표시"
                    checked={settings.footer.showLinks}
                    onChange={(v) => updateSettings('footer', 'showLinks', v)}
                  />
                  <ToggleOption
                    label="저작권 표시"
                    checked={settings.footer.showCopyright}
                    onChange={(v) => updateSettings('footer', 'showCopyright', v)}
                  />
                  <ToggleOption
                    label="뉴스레터 구독 폼"
                    checked={settings.footer.showNewsletter}
                    onChange={(v) => updateSettings('footer', 'showNewsletter', v)}
                  />
                </div>
                <div className="space-y-4">
                  <ToggleOption
                    label="소셜 링크 표시"
                    checked={settings.footer.showSocialLinks}
                    onChange={(v) => updateSettings('footer', 'showSocialLinks', v)}
                  />
                  {settings.footer.showSocialLinks && (
                    <CheckboxGroup
                      label="표시할 플랫폼"
                      options={[
                        { value: 'facebook', label: 'Facebook' },
                        { value: 'twitter', label: 'Twitter' },
                        { value: 'instagram', label: 'Instagram' },
                        { value: 'youtube', label: 'YouTube' },
                        { value: 'linkedin', label: 'LinkedIn' },
                      ]}
                      selected={settings.footer.socialPlatforms}
                      onChange={(v) => updateSettings('footer', 'socialPlatforms', v as FooterSettings['socialPlatforms'])}
                    />
                  )}
                  <ToggleOption
                    label="회사 정보 표시"
                    checked={settings.footer.showCompanyInfo}
                    onChange={(v) => updateSettings('footer', 'showCompanyInfo', v)}
                  />
                  {settings.footer.showCompanyInfo && (
                    <CheckboxGroup
                      label="표시할 정보"
                      options={[
                        { value: 'address', label: '주소' },
                        { value: 'phone', label: '연락처' },
                        { value: 'email', label: '이메일' },
                        { value: 'businessNumber', label: '사업자번호' },
                      ]}
                      selected={settings.footer.companyInfoFields}
                      onChange={(v) => updateSettings('footer', 'companyInfoFields', v as FooterSettings['companyInfoFields'])}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* ========== 콘텐츠 영역 설정 ========== */}
        <CollapsibleSection
          icon={Monitor}
          title="콘텐츠 영역 설정"
          description="메인 콘텐츠 영역의 레이아웃과 스타일을 설정합니다"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <OptionSelect
                label="최대 너비"
                value={settings.content.maxWidth}
                options={[
                  { value: 'full', label: '전체 너비' },
                  { value: 'xl', label: 'Extra Large (1280px)' },
                  { value: 'lg', label: 'Large (1024px)' },
                  { value: 'md', label: 'Medium (768px)' },
                ]}
                onChange={(v) => updateSettings('content', 'maxWidth', v as ContentSettings['maxWidth'])}
              />
              <OptionSelect
                label="여백"
                value={settings.content.padding}
                options={[
                  { value: 'none', label: '없음' },
                  { value: 'compact', label: '좁게' },
                  { value: 'normal', label: '보통' },
                  { value: 'relaxed', label: '넓게' },
                ]}
                onChange={(v) => updateSettings('content', 'padding', v as ContentSettings['padding'])}
              />
              <OptionSelect
                label="페이지 전환 애니메이션"
                value={settings.content.pageTransition}
                options={[
                  { value: 'none', label: '없음' },
                  { value: 'fade', label: '페이드' },
                  { value: 'slide', label: '슬라이드' },
                ]}
                onChange={(v) => updateSettings('content', 'pageTransition', v as ContentSettings['pageTransition'])}
              />
              <OptionSelect
                label="로딩 인디케이터"
                value={settings.content.loadingIndicator}
                options={[
                  { value: 'spinner', label: '스피너' },
                  { value: 'skeleton', label: '스켈레톤' },
                  { value: 'progressBar', label: '프로그레스 바' },
                ]}
                onChange={(v) => updateSettings('content', 'loadingIndicator', v as ContentSettings['loadingIndicator'])}
              />
            </div>
            <div className="space-y-4">
              <OptionSelect
                label="카드 스타일"
                value={settings.content.cardStyle}
                options={[
                  { value: 'flat', label: '플랫' },
                  { value: 'shadow', label: '그림자' },
                  { value: 'border', label: '테두리' },
                  { value: 'glass', label: '글래스모피즘' },
                ]}
                onChange={(v) => updateSettings('content', 'cardStyle', v as ContentSettings['cardStyle'])}
              />
              <OptionSelect
                label="카드 모서리"
                value={settings.content.cardRadius}
                options={[
                  { value: 'none', label: '각진' },
                  { value: 'sm', label: '약간 둥글게' },
                  { value: 'md', label: '둥글게' },
                  { value: 'lg', label: '많이 둥글게' },
                ]}
                onChange={(v) => updateSettings('content', 'cardRadius', v as ContentSettings['cardRadius'])}
              />
              <OptionSelect
                label="테이블 스타일"
                value={settings.content.tableStyle}
                options={[
                  { value: 'striped', label: '줄무늬' },
                  { value: 'plain', label: '단색' },
                  { value: 'bordered', label: '테두리' },
                ]}
                onChange={(v) => updateSettings('content', 'tableStyle', v as ContentSettings['tableStyle'])}
              />
              <OptionSelect
                label="버튼 스타일"
                value={settings.content.buttonStyle}
                options={[
                  { value: 'square', label: '각진' },
                  { value: 'rounded', label: '둥근' },
                  { value: 'pill', label: '알약형' },
                ]}
                onChange={(v) => updateSettings('content', 'buttonStyle', v as ContentSettings['buttonStyle'])}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* ========== 타이포그래피 설정 ========== */}
        <CollapsibleSection
          icon={Type}
          title="타이포그래피"
          description="폰트 크기, 줄 간격, 제목 스타일을 설정합니다"
          defaultOpen={false}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <OptionSelect
                label="폰트 크기 스케일"
                description="전체 텍스트 크기 비율"
                value={settings.typography.fontScale}
                options={[
                  { value: 'small', label: '작게 (90%)' },
                  { value: 'default', label: '기본 (100%)' },
                  { value: 'large', label: '크게 (110%)' },
                ]}
                onChange={(v) => updateSettings('typography', 'fontScale', v as TypographySettings['fontScale'])}
              />
              <OptionSelect
                label="줄 간격"
                value={settings.typography.lineHeight}
                options={[
                  { value: 'tight', label: '좁게' },
                  { value: 'normal', label: '보통' },
                  { value: 'relaxed', label: '넓게' },
                ]}
                onChange={(v) => updateSettings('typography', 'lineHeight', v as TypographySettings['lineHeight'])}
              />
            </div>
            <div className="space-y-4">
              <OptionSelect
                label="제목 굵기"
                value={settings.typography.headingStyle}
                options={[
                  { value: 'normal', label: '일반' },
                  { value: 'semibold', label: '세미볼드' },
                  { value: 'bold', label: '볼드' },
                ]}
                onChange={(v) => updateSettings('typography', 'headingStyle', v as TypographySettings['headingStyle'])}
              />
              <OptionSelect
                label="제목 대소문자"
                value={settings.typography.headingCase}
                options={[
                  { value: 'normal', label: '일반' },
                  { value: 'uppercase', label: '대문자' },
                  { value: 'capitalize', label: '첫 글자 대문자' },
                ]}
                onChange={(v) => updateSettings('typography', 'headingCase', v as TypographySettings['headingCase'])}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* ========== 컬러 모드 설정 ========== */}
        <CollapsibleSection
          icon={Palette}
          title="컬러 모드"
          description="다크/라이트 모드 설정을 관리합니다"
          defaultOpen={false}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <OptionSelect
                label="기본 모드"
                value={settings.colorMode.defaultMode}
                options={[
                  { value: 'light', label: '라이트 모드' },
                  { value: 'dark', label: '다크 모드' },
                  { value: 'system', label: '시스템 설정 따라가기' },
                ]}
                onChange={(v) => updateSettings('colorMode', 'defaultMode', v as ColorModeSettings['defaultMode'])}
              />
              <OptionSelect
                label="전환 속도"
                value={settings.colorMode.transitionDuration}
                options={[
                  { value: 'instant', label: '즉시' },
                  { value: 'fast', label: '빠르게' },
                  { value: 'normal', label: '보통' },
                ]}
                onChange={(v) => updateSettings('colorMode', 'transitionDuration', v as ColorModeSettings['transitionDuration'])}
              />
            </div>
            <div className="space-y-4">
              <ToggleOption
                label="사용자 전환 허용"
                description="사용자가 직접 모드를 전환할 수 있도록 허용"
                checked={settings.colorMode.allowUserToggle}
                onChange={(v) => updateSettings('colorMode', 'allowUserToggle', v)}
              />
              {settings.colorMode.allowUserToggle && (
                <OptionSelect
                  label="전환 버튼 위치"
                  value={settings.colorMode.togglePosition}
                  options={[
                    { value: 'header', label: '헤더' },
                    { value: 'sidebar', label: '사이드바' },
                    { value: 'footer', label: '푸터' },
                    { value: 'hidden', label: '숨김 (단축키만)' },
                  ]}
                  onChange={(v) => updateSettings('colorMode', 'togglePosition', v as ColorModeSettings['togglePosition'])}
                />
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* ========== 컴포넌트 스타일 설정 ========== */}
        <CollapsibleSection
          icon={Layers}
          title="컴포넌트 스타일"
          description="UI 컴포넌트의 전반적인 스타일을 설정합니다"
          defaultOpen={false}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <OptionSelect
                label="UI 밀도"
                description="전체 UI 요소의 간격 및 크기"
                value={settings.componentStyle.density}
                options={[
                  { value: 'compact', label: '컴팩트' },
                  { value: 'default', label: '기본' },
                  { value: 'comfortable', label: '편안함' },
                ]}
                onChange={(v) => updateSettings('componentStyle', 'density', v as ComponentStyleSettings['density'])}
              />
              <OptionSelect
                label="입력 필드 스타일"
                value={settings.componentStyle.inputStyle}
                options={[
                  { value: 'outline', label: '외곽선' },
                  { value: 'filled', label: '채워진' },
                  { value: 'underline', label: '밑줄' },
                ]}
                onChange={(v) => updateSettings('componentStyle', 'inputStyle', v as ComponentStyleSettings['inputStyle'])}
              />
              <OptionSelect
                label="아이콘 크기"
                value={settings.componentStyle.iconSize}
                options={[
                  { value: 'small', label: '작게' },
                  { value: 'default', label: '기본' },
                  { value: 'large', label: '크게' },
                ]}
                onChange={(v) => updateSettings('componentStyle', 'iconSize', v as ComponentStyleSettings['iconSize'])}
              />
            </div>
            <div className="space-y-4">
              <OptionSelect
                label="배지 스타일"
                value={settings.componentStyle.badgeStyle}
                options={[
                  { value: 'solid', label: '채움' },
                  { value: 'outline', label: '외곽선' },
                  { value: 'soft', label: '소프트' },
                ]}
                onChange={(v) => updateSettings('componentStyle', 'badgeStyle', v as ComponentStyleSettings['badgeStyle'])}
              />
              <OptionSelect
                label="아바타 스타일"
                value={settings.componentStyle.avatarStyle}
                options={[
                  { value: 'circle', label: '원형' },
                  { value: 'rounded', label: '둥근 사각형' },
                  { value: 'square', label: '사각형' },
                ]}
                onChange={(v) => updateSettings('componentStyle', 'avatarStyle', v as ComponentStyleSettings['avatarStyle'])}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* ========== 접근성 설정 ========== */}
        <CollapsibleSection
          icon={Accessibility}
          title="접근성"
          description="접근성 관련 옵션을 설정합니다"
          defaultOpen={false}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <ToggleOption
                label="고대비 모드"
                description="시각적 대비를 높여 가독성 향상"
                checked={settings.accessibility.highContrastMode}
                onChange={(v) => updateSettings('accessibility', 'highContrastMode', v)}
              />
              <ToggleOption
                label="폰트 크기 조절 허용"
                description="사용자가 폰트 크기를 조절할 수 있도록 허용"
                checked={settings.accessibility.fontSizeAdjustable}
                onChange={(v) => updateSettings('accessibility', 'fontSizeAdjustable', v)}
              />
              <ToggleOption
                label="모션 감소"
                description="애니메이션 및 전환 효과 최소화"
                checked={settings.accessibility.reduceMotion}
                onChange={(v) => updateSettings('accessibility', 'reduceMotion', v)}
              />
            </div>
            <div className="space-y-4">
              <OptionSelect
                label="포커스 표시"
                value={settings.accessibility.focusIndicator}
                options={[
                  { value: 'default', label: '기본' },
                  { value: 'enhanced', label: '강화' },
                  { value: 'custom', label: '커스텀' },
                ]}
                onChange={(v) => updateSettings('accessibility', 'focusIndicator', v as AccessibilitySettings['focusIndicator'])}
              />
              <ToggleOption
                label="스크린 리더 최적화"
                description="스크린 리더 사용자를 위한 추가 최적화"
                checked={settings.accessibility.screenReaderOptimized}
                onChange={(v) => updateSettings('accessibility', 'screenReaderOptimized', v)}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* ========== 반응형 설정 ========== */}
        <CollapsibleSection
          icon={Smartphone}
          title="반응형 설정"
          description="모바일 및 태블릿 화면 설정을 관리합니다"
          defaultOpen={false}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>모바일 브레이크포인트 (px)</Label>
                <Input
                  type="number"
                  value={settings.responsive.mobileBreakpoint}
                  onChange={(e) => updateSettings('responsive', 'mobileBreakpoint', parseInt(e.target.value) || 768)}
                  min={320}
                  max={1024}
                />
              </div>
              <div className="space-y-2">
                <Label>태블릿 브레이크포인트 (px)</Label>
                <Input
                  type="number"
                  value={settings.responsive.tabletBreakpoint}
                  onChange={(e) => updateSettings('responsive', 'tabletBreakpoint', parseInt(e.target.value) || 1024)}
                  min={768}
                  max={1440}
                />
              </div>
            </div>
            <div className="space-y-4">
              <OptionSelect
                label="태블릿 레이아웃"
                value={settings.responsive.tabletLayout}
                options={[
                  { value: 'mobile', label: '모바일 레이아웃 사용' },
                  { value: 'desktop', label: '데스크톱 레이아웃 사용' },
                  { value: 'adaptive', label: '적응형 (자동)' },
                ]}
                onChange={(v) => updateSettings('responsive', 'tabletLayout', v as ResponsiveSettings['tabletLayout'])}
              />
              <OptionSelect
                label="모바일 네비게이션"
                value={settings.responsive.mobileNavStyle}
                options={[
                  { value: 'bottom', label: '하단 탭 바' },
                  { value: 'top', label: '상단 메뉴' },
                  { value: 'drawer', label: '드로어' },
                ]}
                onChange={(v) => updateSettings('responsive', 'mobileNavStyle', v as ResponsiveSettings['mobileNavStyle'])}
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* ========== 미리보기 ========== */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>미리보기</CardTitle>
                  <CardDescription>현재 설정이 적용된 레이아웃 미리보기입니다. 페이지 타입과 뷰 모드를 선택하세요.</CardDescription>
                </div>
                {/* 뷰 모드 선택 */}
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      previewMode === 'desktop'
                        ? 'bg-white text-brand-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    데스크톱
                  </button>
                  <button
                    onClick={() => setPreviewMode('tablet')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      previewMode === 'tablet'
                        ? 'bg-white text-brand-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Tablet className="w-4 h-4" />
                    태블릿
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      previewMode === 'mobile'
                        ? 'bg-white text-brand-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    모바일
                  </button>
                </div>
              </div>

              {/* 페이지 타입 탭 */}
              <div className="flex items-center gap-1 border-b border-gray-200">
                <button
                  onClick={() => setPreviewPageType('admin')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    previewPageType === 'admin'
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  관리자 페이지 (TA/TO)
                </button>
                <button
                  onClick={() => setPreviewPageType('operator')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    previewPageType === 'operator'
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  운영자 페이지 (TO)
                </button>
                <button
                  onClick={() => setPreviewPageType('user')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    previewPageType === 'user'
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  사용자 페이지 (TU)
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 미리보기 컨테이너 */}
            <div className="flex justify-center">
              <div
                className={`border-2 border-gray-300 rounded-xl overflow-hidden transition-all duration-300 ${
                  previewMode === 'desktop' ? 'w-full' : previewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
                } ${settings.colorMode.defaultMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}
                style={{ minHeight: previewMode === 'mobile' ? '600px' : '500px' }}
              >
                {/* ========== 사용자 페이지 (TU) 미리보기 ========== */}
                {previewPageType === 'user' && (
                  <>
                    {/* 랜딩 헤더 */}
                    <div
                      className={`flex items-center justify-between px-6 ${
                        settings.colorMode.defaultMode === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
                      } ${
                        settings.header.height === 'compact' ? 'h-14' : settings.header.height === 'large' ? 'h-20' : 'h-16'
                      } border-b ${settings.colorMode.defaultMode === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
                    >
                      {/* 로고 */}
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          settings.colorMode.defaultMode === 'dark' ? 'bg-[#6778ff]' : 'bg-brand-primary'
                        }`}>
                          <span className="text-white font-bold text-sm">LP</span>
                        </div>
                        {previewMode !== 'mobile' && (
                          <span className={`font-semibold ${
                            settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>Learn Platform</span>
                        )}
                      </div>

                      {/* 네비게이션 */}
                      {previewMode !== 'mobile' && (
                        <nav className="flex items-center gap-6">
                          {['강의', '로드맵', '커뮤니티'].map((item, i) => (
                            <span
                              key={item}
                              className={`text-sm cursor-pointer transition-colors ${
                                i === 0
                                  ? settings.colorMode.defaultMode === 'dark' ? 'text-[#6778ff]' : 'text-brand-primary'
                                  : settings.colorMode.defaultMode === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              {item}
                            </span>
                          ))}
                        </nav>
                      )}

                      {/* 오른쪽 영역 */}
                      <div className="flex items-center gap-3">
                        {settings.header.showSearch && previewMode !== 'mobile' && (
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                            settings.colorMode.defaultMode === 'dark' ? 'bg-white/10' : 'bg-gray-100'
                          }`}>
                            <Search className={`w-4 h-4 ${
                              settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`} />
                            <span className={`text-sm ${
                              settings.colorMode.defaultMode === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>검색...</span>
                          </div>
                        )}
                        {previewMode === 'mobile' && <Search className={`w-5 h-5 ${
                          settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} />}
                        <div className={`w-8 h-8 flex items-center justify-center ${
                          settings.componentStyle.avatarStyle === 'circle' ? 'rounded-full' : 'rounded-lg'
                        } ${settings.colorMode.defaultMode === 'dark' ? 'bg-[#6778ff]/20' : 'bg-brand-primary/10'}`}>
                          <User className={`w-4 h-4 ${
                            settings.colorMode.defaultMode === 'dark' ? 'text-[#6778ff]' : 'text-brand-primary'
                          }`} />
                        </div>
                      </div>
                    </div>

                    {/* 메인 콘텐츠 */}
                    <div className={`${
                      settings.content.padding === 'none' ? 'p-0' : settings.content.padding === 'compact' ? 'p-4' : settings.content.padding === 'relaxed' ? 'p-8' : 'p-6'
                    }`}>
                      {/* 히어로 섹션 */}
                      <div className={`text-center py-8 px-4 mb-6 rounded-xl ${
                        settings.colorMode.defaultMode === 'dark'
                          ? 'bg-gradient-to-r from-[#6778ff]/20 to-purple-500/20'
                          : 'bg-gradient-to-r from-brand-primary/10 to-purple-100'
                      }`}>
                        <h1 className={`${
                          settings.typography.fontScale === 'small' ? 'text-xl' : settings.typography.fontScale === 'large' ? 'text-3xl' : 'text-2xl'
                        } ${
                          settings.typography.headingStyle === 'bold' ? 'font-bold' : 'font-semibold'
                        } ${settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                          나만의 학습 여정을 시작하세요
                        </h1>
                        <p className={`${
                          settings.typography.fontScale === 'small' ? 'text-xs' : 'text-sm'
                        } ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          다양한 강의와 로드맵으로 성장하세요
                        </p>
                      </div>

                      {/* 강의 카드 그리드 */}
                      <h2 className={`${
                        settings.typography.fontScale === 'small' ? 'text-base' : settings.typography.fontScale === 'large' ? 'text-xl' : 'text-lg'
                      } ${settings.typography.headingStyle === 'bold' ? 'font-bold' : 'font-semibold'} ${
                        settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'
                      } mb-4`}>인기 강의</h2>
                      <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-1' : previewMode === 'tablet' ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
                        {[
                          { title: 'React 완전 정복', instructor: '김리액트', price: '₩99,000', rating: 4.8, students: 1234 },
                          { title: 'TypeScript 마스터', instructor: '박타입', price: '₩79,000', rating: 4.7, students: 856 },
                          { title: 'Python AI 기초', instructor: '이파이썬', price: '무료', rating: 4.9, students: 2341 },
                        ].slice(0, previewMode === 'mobile' ? 2 : 3).map((course, i) => (
                          <div
                            key={i}
                            className={`overflow-hidden ${
                              settings.colorMode.defaultMode === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
                            } ${
                              settings.content.cardStyle === 'shadow' ? 'shadow-lg' : settings.content.cardStyle === 'border' ? `border ${settings.colorMode.defaultMode === 'dark' ? 'border-white/10' : 'border-gray-200'}` : ''
                            } ${
                              settings.content.cardRadius === 'none' ? 'rounded-none' : settings.content.cardRadius === 'sm' ? 'rounded' : settings.content.cardRadius === 'lg' ? 'rounded-2xl' : 'rounded-xl'
                            }`}
                          >
                            {/* 썸네일 */}
                            <div className={`h-24 ${
                              i === 0 ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                              i === 1 ? 'bg-gradient-to-br from-indigo-500 to-blue-600' :
                              'bg-gradient-to-br from-green-500 to-teal-600'
                            }`} />
                            <div className="p-3">
                              <div className="flex items-center gap-1 mb-1">
                                <span className={`px-1.5 py-0.5 text-[10px] ${
                                  settings.componentStyle.badgeStyle === 'solid'
                                    ? 'bg-[#6778ff] text-white'
                                    : settings.componentStyle.badgeStyle === 'outline'
                                    ? 'border border-[#6778ff] text-[#6778ff]'
                                    : 'bg-[#6778ff]/10 text-[#6778ff]'
                                } rounded`}>상시모집</span>
                                {course.price === '무료' && (
                                  <span className={`px-1.5 py-0.5 text-[10px] ${
                                    settings.componentStyle.badgeStyle === 'solid'
                                      ? 'bg-green-500 text-white'
                                      : settings.componentStyle.badgeStyle === 'outline'
                                      ? 'border border-green-500 text-green-500'
                                      : 'bg-green-100 text-green-700'
                                  } rounded`}>무료</span>
                                )}
                              </div>
                              <h3 className={`text-sm font-medium mb-1 truncate ${
                                settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>{course.title}</h3>
                              <p className={`text-xs mb-2 ${
                                settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>{course.instructor}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  <span className={`text-xs ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{course.rating}</span>
                                  <span className={`text-xs ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>({course.students})</span>
                                </div>
                                <span className={`text-sm font-semibold ${
                                  course.price === '무료'
                                    ? 'text-green-500'
                                    : settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{course.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 로드맵 섹션 */}
                      <h2 className={`${
                        settings.typography.fontScale === 'small' ? 'text-base' : settings.typography.fontScale === 'large' ? 'text-xl' : 'text-lg'
                      } ${settings.typography.headingStyle === 'bold' ? 'font-bold' : 'font-semibold'} ${
                        settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'
                      } mt-6 mb-4`}>추천 로드맵</h2>
                      <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                        {[
                          { title: '프론트엔드 개발자 되기', courses: 12, duration: '3개월' },
                          { title: '풀스택 마스터 과정', courses: 20, duration: '6개월' },
                        ].map((roadmap, i) => (
                          <div
                            key={i}
                            className={`p-4 ${
                              settings.colorMode.defaultMode === 'dark' ? 'bg-[#2a2a2a]' : 'bg-white'
                            } ${
                              settings.content.cardStyle === 'shadow' ? 'shadow-md' : settings.content.cardStyle === 'border' ? `border ${settings.colorMode.defaultMode === 'dark' ? 'border-white/10' : 'border-gray-200'}` : ''
                            } ${
                              settings.content.cardRadius === 'none' ? 'rounded-none' : settings.content.cardRadius === 'sm' ? 'rounded' : 'rounded-xl'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                                i === 0 ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'
                              }`}>
                                <Map className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className={`text-sm font-medium ${
                                  settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>{roadmap.title}</h3>
                                <p className={`text-xs ${
                                  settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>{roadmap.courses}개 강의 • {roadmap.duration}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 모바일 하단 네비게이션 */}
                    {previewMode === 'mobile' && settings.responsive.mobileNavStyle === 'bottom' && (
                      <div className={`absolute bottom-0 left-0 right-0 flex items-center justify-around py-2 border-t ${
                        settings.colorMode.defaultMode === 'dark' ? 'bg-[#1e1e1e] border-white/10' : 'bg-white border-gray-200'
                      }`}>
                        {[
                          { icon: Home, label: '홈', active: true },
                          { icon: FileText, label: '강의' },
                          { icon: Map, label: '로드맵' },
                          { icon: User, label: '마이' },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className={`flex flex-col items-center gap-0.5 ${
                              item.active
                                ? settings.colorMode.defaultMode === 'dark' ? 'text-[#6778ff]' : 'text-brand-primary'
                                : settings.colorMode.defaultMode === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span className="text-[10px]">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* ========== 운영자 페이지 (TO) 미리보기 ========== */}
                {previewPageType === 'operator' && (
                  <>
                    {/* 헤더 */}
                    <div
                      className={`flex items-center px-4 ${
                        settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800' : 'bg-brand-primary'
                      } ${
                        settings.header.height === 'compact' ? 'h-12' : settings.header.height === 'large' ? 'h-20' : 'h-16'
                      } ${settings.header.shadow === 'md' ? 'shadow-md' : settings.header.shadow === 'sm' ? 'shadow-sm' : ''}`}
                    >
                      {previewMode === 'mobile' && (
                        <button className="mr-2 text-white/80 hover:text-white">
                          <Menu className="w-5 h-5" />
                        </button>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">LP</span>
                        </div>
                        {previewMode !== 'mobile' && (
                          <span className="text-white font-semibold text-sm">운영자 콘솔</span>
                        )}
                      </div>
                      <div className="flex-1" />
                      <div className="flex items-center gap-3">
                        {settings.header.showNotifications && (
                          <div className="relative">
                            <Bell className="w-5 h-5 text-white/80" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">5</span>
                          </div>
                        )}
                        <div className={`w-8 h-8 bg-white/30 flex items-center justify-center ${
                          settings.componentStyle.avatarStyle === 'circle' ? 'rounded-full' : 'rounded-lg'
                        }`}>
                          <User className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* 본문 */}
                    <div className={`flex ${previewMode === 'mobile' ? 'flex-col' : ''}`} style={{ height: 'calc(100% - 64px)' }}>
                      {/* 사이드바 */}
                      {settings.sidebar.style !== 'hidden' && previewMode !== 'mobile' && (
                        <div className={`${
                          settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                        } border-r ${
                          settings.sidebar.defaultCollapsed ? 'w-16' : settings.sidebar.width === 'narrow' ? 'w-48' : settings.sidebar.width === 'wide' ? 'w-72' : 'w-60'
                        } p-3`}>
                          <div className={`space-y-${settings.sidebar.itemSpacing === 'compact' ? '0.5' : settings.sidebar.itemSpacing === 'relaxed' ? '2' : '1'}`}>
                            {[
                              { icon: BarChart3, label: '대시보드', active: true },
                              { icon: FileText, label: '강의 관리' },
                              { icon: Users, label: '수강생 관리' },
                              { icon: MessageSquare, label: 'Q&A 관리' },
                            ].map((item, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-all rounded-lg ${
                                  item.active
                                    ? settings.sidebar.activeIndicator === 'background'
                                      ? 'bg-brand-primary/10 text-brand-primary'
                                      : settings.sidebar.activeIndicator === 'leftBar'
                                      ? 'border-l-3 border-brand-primary text-brand-primary'
                                      : 'text-brand-primary'
                                    : settings.colorMode.defaultMode === 'dark'
                                    ? 'text-gray-400 hover:bg-gray-700/50'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {settings.sidebar.showIcons && <item.icon className="w-5 h-5" />}
                                {!settings.sidebar.defaultCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 콘텐츠 */}
                      <div className={`flex-1 ${
                        settings.content.padding === 'none' ? 'p-0' : settings.content.padding === 'compact' ? 'p-3' : settings.content.padding === 'relaxed' ? 'p-8' : 'p-5'
                      }`}>
                        <h1 className={`${
                          settings.typography.fontScale === 'small' ? 'text-lg' : settings.typography.fontScale === 'large' ? 'text-2xl' : 'text-xl'
                        } ${settings.typography.headingStyle === 'bold' ? 'font-bold' : 'font-semibold'} ${
                          settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'
                        } mb-4`}>강의 관리</h1>

                        {/* 통계 카드 */}
                        <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'} gap-3 mb-4`}>
                          {[
                            { label: '총 강의', value: '24', color: 'blue' },
                            { label: '수강생', value: '1,234', color: 'green' },
                            { label: '완료율', value: '78%', color: 'purple' },
                            { label: 'Q&A', value: '12', color: 'orange' },
                          ].map((stat, i) => (
                            <div
                              key={i}
                              className={`p-3 ${
                                settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800' : 'bg-white'
                              } ${
                                settings.content.cardStyle === 'shadow' ? 'shadow-md' : settings.content.cardStyle === 'border' ? `border ${settings.colorMode.defaultMode === 'dark' ? 'border-gray-700' : 'border-gray-200'}` : ''
                              } ${
                                settings.content.cardRadius === 'none' ? 'rounded-none' : settings.content.cardRadius === 'sm' ? 'rounded' : 'rounded-lg'
                              }`}
                            >
                              <div className={`text-xs ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                              <div className={`text-lg font-bold ${settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* 강의 목록 테이블 */}
                        <div className={`overflow-hidden ${
                          settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800' : 'bg-white'
                        } ${
                          settings.content.cardStyle === 'shadow' ? 'shadow-md' : settings.content.cardStyle === 'border' ? `border ${settings.colorMode.defaultMode === 'dark' ? 'border-gray-700' : 'border-gray-200'}` : ''
                        } ${
                          settings.content.cardRadius === 'none' ? 'rounded-none' : settings.content.cardRadius === 'sm' ? 'rounded' : 'rounded-lg'
                        }`}>
                          <div className={`px-4 py-3 border-b ${settings.colorMode.defaultMode === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                            <h3 className={`text-sm font-semibold ${settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'}`}>내 강의 목록</h3>
                          </div>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className={settings.colorMode.defaultMode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}>
                                <th className={`px-4 py-2 text-left ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>강의명</th>
                                <th className={`px-4 py-2 text-left ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>수강생</th>
                                <th className={`px-4 py-2 text-left ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>상태</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { name: 'React 기초', students: 234, status: '진행중' },
                                { name: 'TypeScript 입문', students: 156, status: '진행중' },
                                { name: 'Node.js 백엔드', students: 89, status: '준비중' },
                              ].map((row, i) => (
                                <tr key={i} className={settings.content.tableStyle === 'striped' && i % 2 === 1 ? (settings.colorMode.defaultMode === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50') : ''}>
                                  <td className={`px-4 py-2 ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{row.name}</td>
                                  <td className={`px-4 py-2 ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{row.students}명</td>
                                  <td className="px-4 py-2">
                                    <span className={`px-2 py-0.5 text-xs rounded ${
                                      row.status === '진행중'
                                        ? settings.componentStyle.badgeStyle === 'solid' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'
                                        : settings.componentStyle.badgeStyle === 'solid' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700'
                                    }`}>{row.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ========== 관리자 페이지 (TA) 미리보기 ========== */}
                {previewPageType === 'admin' && (
                  <>
                {/* ===== 헤더 미리보기 ===== */}
                <div
                  className={`flex items-center px-4 ${
                    settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800' : 'bg-brand-primary'
                  } ${
                    settings.header.height === 'compact' ? 'h-12' : settings.header.height === 'large' ? 'h-20' : 'h-16'
                  } ${
                    settings.header.shadow === 'md' ? 'shadow-md' : settings.header.shadow === 'sm' ? 'shadow-sm' : ''
                  } ${
                    settings.header.backgroundOpacity === 'translucent'
                      ? 'bg-opacity-90'
                      : settings.header.backgroundOpacity === 'transparent'
                      ? 'bg-opacity-70'
                      : ''
                  }`}
                >
                  {/* 모바일 메뉴 버튼 */}
                  {previewMode === 'mobile' && (
                    <button className="mr-2 text-white/80 hover:text-white">
                      <Menu className="w-5 h-5" />
                    </button>
                  )}

                  {/* 로고 */}
                  {settings.header.showLogo && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">LP</span>
                      </div>
                      {previewMode !== 'mobile' && (
                        <span className="text-white font-semibold text-sm">Learn Platform</span>
                      )}
                    </div>
                  )}

                  {/* 네비게이션 */}
                  {previewMode !== 'mobile' && (
                    <div
                      className={`flex-1 flex ${
                        settings.header.navPosition === 'center'
                          ? 'justify-center'
                          : settings.header.navPosition === 'right'
                          ? 'justify-end'
                          : 'justify-start ml-6'
                      }`}
                    >
                      <nav className="flex gap-4">
                        {['홈', '강의', '로드맵', '커뮤니티'].map((item, i) => (
                          <span
                            key={item}
                            className={`text-sm ${
                              i === 0 ? 'text-white font-medium' : 'text-white/70 hover:text-white'
                            } cursor-pointer transition-colors`}
                          >
                            {item}
                          </span>
                        ))}
                      </nav>
                    </div>
                  )}

                  <div className="flex items-center gap-3 ml-auto">
                    {/* 검색 */}
                    {settings.header.showSearch && previewMode !== 'mobile' && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
                        <Search className="w-4 h-4 text-white/70" />
                        <span className="text-sm text-white/70">검색...</span>
                      </div>
                    )}
                    {settings.header.showSearch && previewMode === 'mobile' && (
                      <Search className="w-5 h-5 text-white/80" />
                    )}

                    {/* 알림 */}
                    {settings.header.showNotifications && (
                      <div className="relative">
                        <Bell className="w-5 h-5 text-white/80" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                          3
                        </span>
                      </div>
                    )}

                    {/* 사용자 메뉴 */}
                    <div
                      className={`flex items-center gap-2 ${
                        settings.header.userMenuStyle === 'dropdown'
                          ? 'px-2 py-1 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20'
                          : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 bg-white/30 flex items-center justify-center ${
                          settings.componentStyle.avatarStyle === 'circle'
                            ? 'rounded-full'
                            : settings.componentStyle.avatarStyle === 'rounded'
                            ? 'rounded-lg'
                            : 'rounded-sm'
                        }`}
                      >
                        <User className="w-4 h-4 text-white" />
                      </div>
                      {settings.header.userMenuStyle === 'name' && previewMode !== 'mobile' && (
                        <span className="text-sm text-white">홍길동</span>
                      )}
                      {settings.header.userMenuStyle === 'dropdown' && previewMode !== 'mobile' && (
                        <>
                          <span className="text-sm text-white">홍길동</span>
                          <ChevronDown className="w-4 h-4 text-white/70" />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* ===== 본문 영역 ===== */}
                <div
                  className={`flex ${
                    previewMode === 'mobile' ? 'flex-col' : ''
                  }`}
                  style={{
                    height: `calc(100% - ${
                      settings.header.height === 'compact' ? '48px' : settings.header.height === 'large' ? '80px' : '64px'
                    } - ${settings.footer.enabled ? (settings.footer.layout === 'minimal' ? '40px' : settings.footer.layout === 'multi-column' ? '120px' : '60px') : '0px'})`,
                  }}
                >
                  {/* ===== 사이드바 미리보기 ===== */}
                  {settings.sidebar.style !== 'hidden' && previewMode !== 'mobile' && (
                    <div
                      className={`${
                        settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      } border-r flex flex-col ${
                        settings.sidebar.defaultCollapsed
                          ? 'w-16'
                          : settings.sidebar.width === 'narrow'
                          ? 'w-48'
                          : settings.sidebar.width === 'wide'
                          ? 'w-72'
                          : 'w-60'
                      } ${previewMode === 'tablet' && settings.sidebar.width !== 'narrow' ? 'w-48' : ''}`}
                    >
                      <div
                        className={`flex-1 p-3 overflow-y-auto ${
                          settings.sidebar.scrollbarStyle === 'hidden' ? 'scrollbar-hide' : ''
                        }`}
                      >
                        {/* 메뉴 그룹 */}
                        {settings.sidebar.menuGroupStyle === 'divider' && (
                          <div
                            className={`text-xs uppercase tracking-wider mb-2 px-2 ${
                              settings.colorMode.defaultMode === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}
                          >
                            {!settings.sidebar.defaultCollapsed && '메인 메뉴'}
                          </div>
                        )}

                        <div
                          className={`space-y-${
                            settings.sidebar.itemSpacing === 'compact' ? '0.5' : settings.sidebar.itemSpacing === 'relaxed' ? '2' : '1'
                          }`}
                        >
                          {[
                            { icon: Home, label: '대시보드', active: true },
                            { icon: FileText, label: '내 강의' },
                            { icon: BarChart3, label: '학습 통계' },
                            { icon: Users, label: '커뮤니티' },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-all ${
                                settings.content.cardRadius === 'none'
                                  ? 'rounded-none'
                                  : settings.content.cardRadius === 'sm'
                                  ? 'rounded'
                                  : settings.content.cardRadius === 'lg'
                                  ? 'rounded-xl'
                                  : 'rounded-lg'
                              } ${
                                item.active
                                  ? settings.sidebar.activeIndicator === 'background'
                                    ? 'bg-brand-primary/10 text-brand-primary'
                                    : settings.sidebar.activeIndicator === 'leftBar'
                                    ? 'border-l-3 border-brand-primary bg-brand-primary/5 text-brand-primary -ml-[1px]'
                                    : settings.sidebar.activeIndicator === 'underline'
                                    ? 'border-b-2 border-brand-primary text-brand-primary'
                                    : 'text-brand-primary'
                                  : settings.colorMode.defaultMode === 'dark'
                                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              }`}
                            >
                              {settings.sidebar.showIcons && (
                                <item.icon
                                  className={`${
                                    settings.componentStyle.iconSize === 'small'
                                      ? 'w-4 h-4'
                                      : settings.componentStyle.iconSize === 'large'
                                      ? 'w-6 h-6'
                                      : 'w-5 h-5'
                                  } ${
                                    item.active && settings.sidebar.activeIndicator === 'iconColor'
                                      ? 'text-brand-primary'
                                      : ''
                                  }`}
                                />
                              )}
                              {!settings.sidebar.defaultCollapsed && (
                                <span className="text-sm font-medium">{item.label}</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* 설정 메뉴 그룹 */}
                        {settings.sidebar.menuGroupStyle === 'divider' && !settings.sidebar.defaultCollapsed && (
                          <>
                            <div
                              className={`text-xs uppercase tracking-wider mt-6 mb-2 px-2 ${
                                settings.colorMode.defaultMode === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              }`}
                            >
                              설정
                            </div>
                            <div
                              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-all ${
                                settings.content.cardRadius === 'none'
                                  ? 'rounded-none'
                                  : settings.content.cardRadius === 'sm'
                                  ? 'rounded'
                                  : 'rounded-lg'
                              } ${
                                settings.colorMode.defaultMode === 'dark'
                                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              }`}
                            >
                              {settings.sidebar.showIcons && <Settings className="w-5 h-5" />}
                              <span className="text-sm font-medium">설정</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* 사이드바 하단 영역 */}
                      {settings.sidebar.bottomSection !== 'none' && !settings.sidebar.defaultCollapsed && (
                        <div
                          className={`p-3 border-t ${
                            settings.colorMode.defaultMode === 'dark' ? 'border-gray-700' : 'border-gray-200'
                          }`}
                        >
                          {settings.sidebar.bottomSection === 'userInfo' && (
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 bg-brand-primary/20 flex items-center justify-center ${
                                  settings.componentStyle.avatarStyle === 'circle'
                                    ? 'rounded-full'
                                    : settings.componentStyle.avatarStyle === 'rounded'
                                    ? 'rounded-lg'
                                    : 'rounded-sm'
                                }`}
                              >
                                <User className="w-5 h-5 text-brand-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`text-sm font-medium truncate ${
                                    settings.colorMode.defaultMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                  }`}
                                >
                                  홍길동
                                </div>
                                <div
                                  className={`text-xs truncate ${
                                    settings.colorMode.defaultMode === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                  }`}
                                >
                                  hong@example.com
                                </div>
                              </div>
                            </div>
                          )}
                          {settings.sidebar.bottomSection === 'logout' && (
                            <button
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                                settings.colorMode.defaultMode === 'dark'
                                  ? 'text-gray-400 hover:text-red-400'
                                  : 'text-gray-600 hover:text-red-600'
                              }`}
                            >
                              <X className="w-4 h-4" />
                              로그아웃
                            </button>
                          )}
                          {settings.sidebar.bottomSection === 'settings' && (
                            <button
                              className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                                settings.colorMode.defaultMode === 'dark'
                                  ? 'text-gray-400 hover:text-gray-200'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              <Settings className="w-4 h-4" />
                              설정
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ===== 콘텐츠 영역 ===== */}
                  <div className="flex-1 flex flex-col overflow-y-auto">
                    <div
                      className={`flex-1 ${
                        settings.content.padding === 'none'
                          ? 'p-0'
                          : settings.content.padding === 'compact'
                          ? 'p-3'
                          : settings.content.padding === 'relaxed'
                          ? 'p-8'
                          : 'p-5'
                      }`}
                    >
                      <div
                        className={`${
                          settings.content.maxWidth === 'md'
                            ? 'max-w-2xl'
                            : settings.content.maxWidth === 'lg'
                            ? 'max-w-4xl'
                            : settings.content.maxWidth === 'xl'
                            ? 'max-w-6xl'
                            : ''
                        } mx-auto space-y-4`}
                      >
                        {/* 페이지 제목 */}
                        <div className="mb-4">
                          <h1
                            className={`${
                              settings.typography.fontScale === 'small'
                                ? 'text-lg'
                                : settings.typography.fontScale === 'large'
                                ? 'text-2xl'
                                : 'text-xl'
                            } ${
                              settings.typography.headingStyle === 'bold'
                                ? 'font-bold'
                                : settings.typography.headingStyle === 'semibold'
                                ? 'font-semibold'
                                : 'font-normal'
                            } ${
                              settings.typography.headingCase === 'uppercase'
                                ? 'uppercase'
                                : settings.typography.headingCase === 'capitalize'
                                ? 'capitalize'
                                : ''
                            } ${settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'}`}
                          >
                            대시보드
                          </h1>
                          <p
                            className={`mt-1 ${
                              settings.typography.fontScale === 'small' ? 'text-xs' : settings.typography.fontScale === 'large' ? 'text-base' : 'text-sm'
                            } ${
                              settings.typography.lineHeight === 'tight'
                                ? 'leading-tight'
                                : settings.typography.lineHeight === 'relaxed'
                                ? 'leading-relaxed'
                                : 'leading-normal'
                            } ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                          >
                            학습 현황을 한눈에 확인하세요
                          </p>
                        </div>

                        {/* 통계 카드 그리드 */}
                        <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'} gap-3`}>
                          {[
                            { label: '수강중', value: '12', color: 'blue' },
                            { label: '완료', value: '8', color: 'green' },
                            { label: '진행률', value: '67%', color: 'purple' },
                            { label: '학습시간', value: '24h', color: 'orange' },
                          ].map((stat, i) => (
                            <div
                              key={i}
                              className={`p-3 ${
                                settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800' : 'bg-white'
                              } ${
                                settings.content.cardStyle === 'shadow'
                                  ? 'shadow-md'
                                  : settings.content.cardStyle === 'border'
                                  ? settings.colorMode.defaultMode === 'dark'
                                    ? 'border border-gray-700'
                                    : 'border border-gray-200'
                                  : settings.content.cardStyle === 'glass'
                                  ? 'bg-white/50 backdrop-blur-sm border border-white/20'
                                  : ''
                              } ${
                                settings.content.cardRadius === 'none'
                                  ? 'rounded-none'
                                  : settings.content.cardRadius === 'sm'
                                  ? 'rounded'
                                  : settings.content.cardRadius === 'lg'
                                  ? 'rounded-xl'
                                  : 'rounded-lg'
                              }`}
                            >
                              <div
                                className={`text-xs ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                              >
                                {stat.label}
                              </div>
                              <div
                                className={`mt-1 ${
                                  settings.typography.fontScale === 'small' ? 'text-lg' : settings.typography.fontScale === 'large' ? 'text-2xl' : 'text-xl'
                                } font-bold ${settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'}`}
                              >
                                {stat.value}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* 입력 필드 & 버튼 미리보기 */}
                        <div
                          className={`p-4 ${
                            settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800' : 'bg-white'
                          } ${
                            settings.content.cardStyle === 'shadow'
                              ? 'shadow-md'
                              : settings.content.cardStyle === 'border'
                              ? settings.colorMode.defaultMode === 'dark'
                                ? 'border border-gray-700'
                                : 'border border-gray-200'
                              : ''
                          } ${
                            settings.content.cardRadius === 'none'
                              ? 'rounded-none'
                              : settings.content.cardRadius === 'sm'
                              ? 'rounded'
                              : settings.content.cardRadius === 'lg'
                              ? 'rounded-xl'
                              : 'rounded-lg'
                          }`}
                        >
                          <h3
                            className={`mb-3 ${
                              settings.typography.fontScale === 'small' ? 'text-sm' : settings.typography.fontScale === 'large' ? 'text-lg' : 'text-base'
                            } ${
                              settings.typography.headingStyle === 'bold'
                                ? 'font-bold'
                                : settings.typography.headingStyle === 'semibold'
                                ? 'font-semibold'
                                : 'font-normal'
                            } ${settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'}`}
                          >
                            컴포넌트 스타일
                          </h3>

                          {/* 입력 필드 */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div
                              className={`px-3 py-2 text-sm ${
                                settings.colorMode.defaultMode === 'dark'
                                  ? 'bg-gray-700 text-gray-300 placeholder-gray-500'
                                  : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                              } ${
                                settings.componentStyle.inputStyle === 'outline'
                                  ? settings.colorMode.defaultMode === 'dark'
                                    ? 'border border-gray-600 bg-transparent'
                                    : 'border border-gray-300 bg-white'
                                  : settings.componentStyle.inputStyle === 'underline'
                                  ? 'border-b-2 border-gray-300 bg-transparent rounded-none px-0'
                                  : ''
                              } ${
                                settings.componentStyle.inputStyle !== 'underline'
                                  ? settings.content.cardRadius === 'none'
                                    ? 'rounded-none'
                                    : settings.content.cardRadius === 'sm'
                                    ? 'rounded'
                                    : settings.content.cardRadius === 'lg'
                                    ? 'rounded-xl'
                                    : 'rounded-lg'
                                  : ''
                              }`}
                            >
                              이메일 입력...
                            </div>
                            <div
                              className={`px-3 py-2 text-sm ${
                                settings.colorMode.defaultMode === 'dark'
                                  ? 'bg-gray-700 text-gray-300'
                                  : 'bg-gray-50 text-gray-900'
                              } ${
                                settings.componentStyle.inputStyle === 'outline'
                                  ? settings.colorMode.defaultMode === 'dark'
                                    ? 'border border-gray-600 bg-transparent'
                                    : 'border border-gray-300 bg-white'
                                  : settings.componentStyle.inputStyle === 'underline'
                                  ? 'border-b-2 border-gray-300 bg-transparent rounded-none px-0'
                                  : ''
                              } ${
                                settings.componentStyle.inputStyle !== 'underline'
                                  ? settings.content.cardRadius === 'none'
                                    ? 'rounded-none'
                                    : settings.content.cardRadius === 'sm'
                                    ? 'rounded'
                                    : settings.content.cardRadius === 'lg'
                                    ? 'rounded-xl'
                                    : 'rounded-lg'
                                  : ''
                              }`}
                            >
                              비밀번호 입력...
                            </div>
                          </div>

                          {/* 버튼들 */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <button
                              className={`px-4 py-2 text-sm bg-brand-primary text-white ${
                                settings.content.buttonStyle === 'square'
                                  ? 'rounded-none'
                                  : settings.content.buttonStyle === 'pill'
                                  ? 'rounded-full'
                                  : 'rounded-lg'
                              }`}
                            >
                              Primary
                            </button>
                            <button
                              className={`px-4 py-2 text-sm ${
                                settings.colorMode.defaultMode === 'dark'
                                  ? 'bg-gray-700 text-gray-200'
                                  : 'bg-gray-200 text-gray-700'
                              } ${
                                settings.content.buttonStyle === 'square'
                                  ? 'rounded-none'
                                  : settings.content.buttonStyle === 'pill'
                                  ? 'rounded-full'
                                  : 'rounded-lg'
                              }`}
                            >
                              Secondary
                            </button>
                            <button
                              className={`px-4 py-2 text-sm border ${
                                settings.colorMode.defaultMode === 'dark'
                                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              } ${
                                settings.content.buttonStyle === 'square'
                                  ? 'rounded-none'
                                  : settings.content.buttonStyle === 'pill'
                                  ? 'rounded-full'
                                  : 'rounded-lg'
                              }`}
                            >
                              Outline
                            </button>
                          </div>

                          {/* 배지들 */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span
                              className={`px-2 py-1 text-xs ${
                                settings.componentStyle.badgeStyle === 'solid'
                                  ? 'bg-blue-500 text-white'
                                  : settings.componentStyle.badgeStyle === 'outline'
                                  ? 'border border-blue-500 text-blue-500'
                                  : 'bg-blue-100 text-blue-700'
                              } ${
                                settings.content.buttonStyle === 'pill' ? 'rounded-full' : 'rounded'
                              }`}
                            >
                              진행중
                            </span>
                            <span
                              className={`px-2 py-1 text-xs ${
                                settings.componentStyle.badgeStyle === 'solid'
                                  ? 'bg-green-500 text-white'
                                  : settings.componentStyle.badgeStyle === 'outline'
                                  ? 'border border-green-500 text-green-500'
                                  : 'bg-green-100 text-green-700'
                              } ${
                                settings.content.buttonStyle === 'pill' ? 'rounded-full' : 'rounded'
                              }`}
                            >
                              완료
                            </span>
                            <span
                              className={`px-2 py-1 text-xs ${
                                settings.componentStyle.badgeStyle === 'solid'
                                  ? 'bg-orange-500 text-white'
                                  : settings.componentStyle.badgeStyle === 'outline'
                                  ? 'border border-orange-500 text-orange-500'
                                  : 'bg-orange-100 text-orange-700'
                              } ${
                                settings.content.buttonStyle === 'pill' ? 'rounded-full' : 'rounded'
                              }`}
                            >
                              대기중
                            </span>
                            <span
                              className={`px-2 py-1 text-xs ${
                                settings.componentStyle.badgeStyle === 'solid'
                                  ? 'bg-red-500 text-white'
                                  : settings.componentStyle.badgeStyle === 'outline'
                                  ? 'border border-red-500 text-red-500'
                                  : 'bg-red-100 text-red-700'
                              } ${
                                settings.content.buttonStyle === 'pill' ? 'rounded-full' : 'rounded'
                              }`}
                            >
                              취소됨
                            </span>
                          </div>

                          {/* 아바타들 */}
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              아바타:
                            </span>
                            <div className="flex -space-x-2">
                              {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'].map((color, i) => (
                                <div
                                  key={i}
                                  className={`w-8 h-8 ${color} flex items-center justify-center text-white text-xs font-medium border-2 ${
                                    settings.colorMode.defaultMode === 'dark' ? 'border-gray-800' : 'border-white'
                                  } ${
                                    settings.componentStyle.avatarStyle === 'circle'
                                      ? 'rounded-full'
                                      : settings.componentStyle.avatarStyle === 'rounded'
                                      ? 'rounded-lg'
                                      : 'rounded-sm'
                                  }`}
                                >
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 테이블 미리보기 */}
                        <div
                          className={`overflow-hidden ${
                            settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800' : 'bg-white'
                          } ${
                            settings.content.cardStyle === 'shadow'
                              ? 'shadow-md'
                              : settings.content.cardStyle === 'border'
                              ? settings.colorMode.defaultMode === 'dark'
                                ? 'border border-gray-700'
                                : 'border border-gray-200'
                              : ''
                          } ${
                            settings.content.cardRadius === 'none'
                              ? 'rounded-none'
                              : settings.content.cardRadius === 'sm'
                              ? 'rounded'
                              : settings.content.cardRadius === 'lg'
                              ? 'rounded-xl'
                              : 'rounded-lg'
                          }`}
                        >
                          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                            <h3
                              className={`${
                                settings.typography.fontScale === 'small' ? 'text-sm' : settings.typography.fontScale === 'large' ? 'text-lg' : 'text-base'
                              } ${
                                settings.typography.headingStyle === 'bold'
                                  ? 'font-bold'
                                  : settings.typography.headingStyle === 'semibold'
                                  ? 'font-semibold'
                                  : 'font-normal'
                              } ${settings.colorMode.defaultMode === 'dark' ? 'text-white' : 'text-gray-900'}`}
                            >
                              테이블 스타일
                            </h3>
                          </div>
                          <table className="w-full text-sm">
                            <thead>
                              <tr
                                className={
                                  settings.colorMode.defaultMode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                                }
                              >
                                <th className={`px-3 py-2 text-left ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                  강의명
                                </th>
                                <th className={`px-3 py-2 text-left ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                  진행률
                                </th>
                                <th className={`px-3 py-2 text-left ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                  상태
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { name: 'React 기초', progress: '80%', status: '진행중' },
                                { name: 'TypeScript', progress: '100%', status: '완료' },
                                { name: 'Node.js', progress: '45%', status: '진행중' },
                              ].map((row, i) => (
                                <tr
                                  key={i}
                                  className={`${
                                    settings.content.tableStyle === 'striped' && i % 2 === 1
                                      ? settings.colorMode.defaultMode === 'dark'
                                        ? 'bg-gray-700/30'
                                        : 'bg-gray-50'
                                      : ''
                                  } ${
                                    settings.content.tableStyle === 'bordered'
                                      ? settings.colorMode.defaultMode === 'dark'
                                        ? 'border-b border-gray-700'
                                        : 'border-b border-gray-200'
                                      : ''
                                  }`}
                                >
                                  <td className={`px-3 py-2 ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                    {row.name}
                                  </td>
                                  <td className={`px-3 py-2 ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {row.progress}
                                  </td>
                                  <td className="px-3 py-2">
                                    <span
                                      className={`px-2 py-0.5 text-xs ${
                                        row.status === '완료'
                                          ? settings.componentStyle.badgeStyle === 'solid'
                                            ? 'bg-green-500 text-white'
                                            : settings.componentStyle.badgeStyle === 'outline'
                                            ? 'border border-green-500 text-green-500'
                                            : 'bg-green-100 text-green-700'
                                          : settings.componentStyle.badgeStyle === 'solid'
                                          ? 'bg-blue-500 text-white'
                                          : settings.componentStyle.badgeStyle === 'outline'
                                          ? 'border border-blue-500 text-blue-500'
                                          : 'bg-blue-100 text-blue-700'
                                      } rounded`}
                                    >
                                      {row.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* ===== 푸터 미리보기 ===== */}
                    {settings.footer.enabled && (
                      <div
                        className={`mt-auto ${
                          settings.footer.layout === 'minimal'
                            ? 'py-3'
                            : settings.footer.layout === 'multi-column'
                            ? 'py-6'
                            : 'py-4'
                        } px-4 ${
                          settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                        } border-t`}
                      >
                        {settings.footer.layout === 'multi-column' && (
                          <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-1 gap-4' : 'grid-cols-4 gap-6'} mb-4`}>
                            {/* 회사 정보 */}
                            {settings.footer.showCompanyInfo && (
                              <div>
                                <h4
                                  className={`text-sm font-semibold mb-2 ${
                                    settings.colorMode.defaultMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                  }`}
                                >
                                  회사 정보
                                </h4>
                                <div className={`space-y-1 text-xs ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {settings.footer.companyInfoFields.includes('address') && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>서울시 강남구</span>
                                    </div>
                                  )}
                                  {settings.footer.companyInfoFields.includes('phone') && (
                                    <div className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      <span>02-1234-5678</span>
                                    </div>
                                  )}
                                  {settings.footer.companyInfoFields.includes('email') && (
                                    <div className="flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      <span>info@example.com</span>
                                    </div>
                                  )}
                                  {settings.footer.companyInfoFields.includes('businessNumber') && (
                                    <div className="flex items-center gap-1">
                                      <Building className="w-3 h-3" />
                                      <span>123-45-67890</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* 링크 */}
                            {settings.footer.showLinks && (
                              <div>
                                <h4
                                  className={`text-sm font-semibold mb-2 ${
                                    settings.colorMode.defaultMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                  }`}
                                >
                                  바로가기
                                </h4>
                                <div className={`space-y-1 text-xs ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {['이용약관', '개인정보처리방침', '고객센터'].map((link) => (
                                    <div key={link} className="hover:underline cursor-pointer">
                                      {link}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 뉴스레터 */}
                            {settings.footer.showNewsletter && (
                              <div className="col-span-2">
                                <h4
                                  className={`text-sm font-semibold mb-2 ${
                                    settings.colorMode.defaultMode === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                  }`}
                                >
                                  뉴스레터 구독
                                </h4>
                                <div className="flex gap-2">
                                  <div
                                    className={`flex-1 px-3 py-1.5 text-xs ${
                                      settings.colorMode.defaultMode === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-white text-gray-400'
                                    } rounded`}
                                  >
                                    이메일을 입력하세요
                                  </div>
                                  <button className="px-3 py-1.5 text-xs bg-brand-primary text-white rounded">
                                    구독
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 하단 영역 */}
                        <div
                          className={`flex ${
                            previewMode === 'mobile' ? 'flex-col gap-3' : 'items-center justify-between'
                          }`}
                        >
                          {/* 저작권 */}
                          {settings.footer.showCopyright && (
                            <div className={`text-xs ${settings.colorMode.defaultMode === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              © 2024 Learn Platform. All rights reserved.
                            </div>
                          )}

                          {/* 소셜 링크 */}
                          {settings.footer.showSocialLinks && settings.footer.socialPlatforms.length > 0 && (
                            <div className="flex items-center gap-3">
                              {settings.footer.socialPlatforms.includes('facebook') && (
                                <Facebook
                                  className={`w-4 h-4 cursor-pointer ${
                                    settings.colorMode.defaultMode === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'
                                  }`}
                                />
                              )}
                              {settings.footer.socialPlatforms.includes('twitter') && (
                                <Twitter
                                  className={`w-4 h-4 cursor-pointer ${
                                    settings.colorMode.defaultMode === 'dark' ? 'text-gray-400 hover:text-sky-400' : 'text-gray-500 hover:text-sky-500'
                                  }`}
                                />
                              )}
                              {settings.footer.socialPlatforms.includes('instagram') && (
                                <Instagram
                                  className={`w-4 h-4 cursor-pointer ${
                                    settings.colorMode.defaultMode === 'dark' ? 'text-gray-400 hover:text-pink-400' : 'text-gray-500 hover:text-pink-600'
                                  }`}
                                />
                              )}
                              {settings.footer.socialPlatforms.includes('youtube') && (
                                <Youtube
                                  className={`w-4 h-4 cursor-pointer ${
                                    settings.colorMode.defaultMode === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'
                                  }`}
                                />
                              )}
                              {settings.footer.socialPlatforms.includes('linkedin') && (
                                <Linkedin
                                  className={`w-4 h-4 cursor-pointer ${
                                    settings.colorMode.defaultMode === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-700'
                                  }`}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 모바일 하단 네비게이션 */}
                {previewMode === 'mobile' && settings.responsive.mobileNavStyle === 'bottom' && (
                  <div
                    className={`flex items-center justify-around py-2 border-t ${
                      settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    {[
                      { icon: Home, label: '홈', active: true },
                      { icon: FileText, label: '강의' },
                      { icon: Search, label: '검색' },
                      { icon: User, label: '마이' },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-center gap-0.5 ${
                          item.active
                            ? 'text-brand-primary'
                            : settings.colorMode.defaultMode === 'dark'
                            ? 'text-gray-500'
                            : 'text-gray-400'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px]">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                  </>
                )}
              </div>
            </div>

            {/* 설정 요약 */}
            <div
              className={`p-4 rounded-lg ${
                settings.colorMode.defaultMode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}
            >
              <h4 className="text-sm font-semibold mb-3 text-gray-700">현재 적용된 주요 설정</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500">헤더 높이:</span>{' '}
                  <span className="font-medium text-gray-700">{settings.header.height}</span>
                </div>
                <div>
                  <span className="text-gray-500">사이드바 너비:</span>{' '}
                  <span className="font-medium text-gray-700">{settings.sidebar.width}</span>
                </div>
                <div>
                  <span className="text-gray-500">카드 스타일:</span>{' '}
                  <span className="font-medium text-gray-700">{settings.content.cardStyle}</span>
                </div>
                <div>
                  <span className="text-gray-500">버튼 스타일:</span>{' '}
                  <span className="font-medium text-gray-700">{settings.content.buttonStyle}</span>
                </div>
                <div>
                  <span className="text-gray-500">폰트 크기:</span>{' '}
                  <span className="font-medium text-gray-700">{settings.typography.fontScale}</span>
                </div>
                <div>
                  <span className="text-gray-500">컬러 모드:</span>{' '}
                  <span className="font-medium text-gray-700">{settings.colorMode.defaultMode}</span>
                </div>
                <div>
                  <span className="text-gray-500">입력 필드:</span>{' '}
                  <span className="font-medium text-gray-700">{settings.componentStyle.inputStyle}</span>
                </div>
                <div>
                  <span className="text-gray-500">배지 스타일:</span>{' '}
                  <span className="font-medium text-gray-700">{settings.componentStyle.badgeStyle}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
