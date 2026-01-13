import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Save,
  RotateCcw,
  Loader2,
  Palette,
  Image as ImageIcon,
  PanelTop,
  PanelBottom,
  Sidebar,
  FolderTree,
  Upload,
  Code,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  GripVertical,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Search,
  Heart,
  ShoppingCart,
  Bell,
  BookOpen,
  ToggleRight,
  MessageCircle,
  GraduationCap,
  FileText,
  Home,
  LayoutDashboard,
  BookCheck,
  PenTool,
  Users,
  User,
  Settings,
  FolderEdit,
  Calendar,
  Briefcase,
  Package,
  Database,
  FileEdit,
  Layers,
  Shield,
  Award,
  TrendingUp,
  Activity,
  MessageSquare,
  Star,
  CheckSquare,
  CheckCircle,
  Circle,
  Square,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Label } from '@/components/common/Label';
import { Switch } from '@/components/common/Switch';
import { Input } from '@/components/common/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/common/Tabs';
import { useTenantFeatures, useUpdateTenantFeatures } from '@/hooks/ta';
import {
  useTenantSettings,
  useUpdateDesignSettings,
  useUpdateLayoutSettings,
  useUpdateExtendedBrandingSettings,
} from '@/hooks/ta/useBrandingQueries';
import type { UpdateTenantFeaturesRequest } from '@/services/ta/tenantFeaturesService';

// 사용 가능한 아이콘 목록
const availableIcons = [
  { value: 'home', label: 'Home' },
  { value: 'layout-dashboard', label: 'Dashboard' },
  { value: 'book-open', label: 'Book Open' },
  { value: 'book-check', label: 'Book Check' },
  { value: 'pen-tool', label: 'Pen Tool' },
  { value: 'users', label: 'Users' },
  { value: 'user', label: 'User' },
  { value: 'settings', label: 'Settings' },
  { value: 'search', label: 'Search' },
  { value: 'folder-tree', label: 'Folder Tree' },
  { value: 'folder-edit', label: 'Folder Edit' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'briefcase', label: 'Briefcase' },
  { value: 'package', label: 'Package' },
  { value: 'database', label: 'Database' },
  { value: 'file-text', label: 'File Text' },
  { value: 'file-edit', label: 'File Edit' },
  { value: 'layers', label: 'Layers' },
  { value: 'shield', label: 'Shield' },
  { value: 'award', label: 'Award' },
  { value: 'trending-up', label: 'Trending Up' },
  { value: 'activity', label: 'Activity' },
  { value: 'message-square', label: 'Message' },
  { value: 'bell', label: 'Bell' },
  { value: 'heart', label: 'Heart' },
  { value: 'star', label: 'Star' },
  { value: 'check-square', label: 'Check Square' },
  { value: 'check-circle', label: 'Check Circle' },
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
];

// 아이콘 문자열 -> 컴포넌트 매핑
const iconMap: Record<string, LucideIcon> = {
  'home': Home,
  'layout-dashboard': LayoutDashboard,
  'book-open': BookOpen,
  'book-check': BookCheck,
  'pen-tool': PenTool,
  'users': Users,
  'user': User,
  'settings': Settings,
  'search': Search,
  'folder-tree': FolderTree,
  'folder-edit': FolderEdit,
  'calendar': Calendar,
  'briefcase': Briefcase,
  'package': Package,
  'database': Database,
  'file-text': FileText,
  'file-edit': FileEdit,
  'layers': Layers,
  'shield': Shield,
  'award': Award,
  'trending-up': TrendingUp,
  'activity': Activity,
  'message-square': MessageSquare,
  'bell': Bell,
  'heart': Heart,
  'star': Star,
  'check-square': CheckSquare,
  'check-circle': CheckCircle,
  'circle': Circle,
  'square': Square,
};

// 브랜딩 설정 타입
interface BrandingSettings {
  landingCategory: {
    enabled: boolean;
    items: string[];
    sectionTitle: string;
  };
  courseSections: {
    enabled: boolean;
    items: { id: string; title: string }[];
  };
  company: {
    name: string;
  };
  logo: {
    lightPreview: string | null;
    darkPreview: string | null;
    faviconPreview: string | null;
  };
  colors: {
    primary: string;
    secondary: string;
  };
  header: {
    enabled: boolean;
    showLogo: boolean;
    showSearch: boolean;
    showWishlist: boolean;
    showCart: boolean;
    showNotifications: boolean;
    showThemeToggle: boolean;
    navLinks: { label: string; url: string; visible: boolean }[];
  };
  banner: {
    enabled: boolean;
    items: {
      id: string;
      type: 'image' | 'code';
      imagePreview: string | null;
      code: string;
      title: string;
    }[];
  };
  footer: {
    enabled: boolean;
    companyInfo: {
      ceo: string;
      businessNo: string;
      address: string;
      phone: string;
    };
    copyright: string;
    legalLinks: { label: string; url: string }[];
    socialLinks: {
      facebook: { enabled: boolean; url: string };
      twitter: { enabled: boolean; url: string };
      youtube: { enabled: boolean; url: string };
      instagram: { enabled: boolean; url: string };
      linkedin: { enabled: boolean; url: string };
      github: { enabled: boolean; url: string };
    };
  };
  sidebarTU: {
    enabled: boolean;
    items: {
      id: string;
      label: string;
      url: string;
      icon: string;
      visible: boolean;
      children?: { id: string; label: string; url: string; icon?: string; visible: boolean }[];
    }[];
  };
  sidebarCO: {
    enabled: boolean;
    items: {
      id: string;
      label: string;
      url: string;
      icon: string;
      visible: boolean;
      children?: { id: string; label: string; url: string; icon?: string; visible: boolean }[];
    }[];
  };
}

// 기본값
const defaultBrandingSettings: BrandingSettings = {
  landingCategory: {
    enabled: true,
    items: ['개발', '디자인', '마케팅', '비즈니스', '데이터'],
    sectionTitle: '카테고리',
  },
  courseSections: {
    enabled: true,
    items: [
      { id: '1', title: '인기 강의' },
      { id: '2', title: '추천 강의' },
      { id: '3', title: '신규 강의' },
    ],
  },
  company: { name: 'MZC Learn Platform' },
  logo: { lightPreview: null, darkPreview: null, faviconPreview: null },
  colors: { primary: '#4C2D9A', secondary: '#6366F1' },
  header: {
    enabled: true,
    showLogo: true,
    showSearch: true,
    showWishlist: true,
    showCart: true,
    showNotifications: true,
    showThemeToggle: true,
    navLinks: [
      { label: '강의 탐색', url: '/courses', visible: true },
      { label: '로드맵', url: '/roadmaps', visible: true },
      { label: '커뮤니티', url: '/community', visible: true },
    ],
  },
  banner: {
    enabled: true,
    items: [
      {
        id: 'default-1',
        type: 'code',
        imagePreview: null,
        code: `<div class="flex flex-col items-start justify-center h-full px-8 md:px-16">
      <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 mb-6">MZC LEARN</span>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">Empower Your</h2>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-[#6778ff] to-[#a855f7] bg-clip-text text-transparent">Future</h2>
      <p class="text-xl md:text-2xl font-medium text-gray-300 mt-6">최신 기술 트렌드를 선도하는<br/>실무 중심의 IT 교육</p>
      <p class="text-base md:text-lg text-gray-500 mt-2">AWS, AI, 클라우드 전문가가 되는 가장 빠른 길</p>
    </div>`,
        title: 'Empower Your Future',
      },
      {
        id: 'default-2',
        type: 'code',
        imagePreview: null,
        code: `<div class="flex flex-col items-start justify-center h-full px-8 md:px-16">
      <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 mb-6">ROADMAP</span>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">Build Your</h2>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">Career</h2>
      <p class="text-xl md:text-2xl font-medium text-gray-300 mt-6">단계별 로드맵으로<br/>체계적인 성장을 경험하세요</p>
      <p class="text-base md:text-lg text-gray-500 mt-2">입문부터 전문가까지, 맞춤형 학습 경로 제공</p>
    </div>`,
        title: 'Build Your Career',
      },
      {
        id: 'default-3',
        type: 'code',
        imagePreview: null,
        code: `<div class="flex flex-col items-start justify-center h-full px-8 md:px-16">
      <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 mb-6">CLOUD</span>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">Master</h2>
      <h2 class="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-[#6778ff] to-[#6bc2f0] bg-clip-text text-transparent">Cloud</h2>
      <p class="text-xl md:text-2xl font-medium text-gray-300 mt-6">클라우드 기술의 핵심을<br/>실습과 함께 마스터하세요</p>
      <p class="text-base md:text-lg text-gray-500 mt-2">AWS, Azure, GCP 공인 자격증 취득 지원</p>
    </div>`,
        title: 'Master Cloud',
      },
    ],
  },
  footer: {
    enabled: true,
    companyInfo: {
      ceo: '이주완',
      businessNo: '114-86-16505',
      address: '서울특별시 강남구 논현로 508 (역삼동) GS타워 22층',
      phone: '1644-2243',
    },
    copyright: '© 2024 MEGAZONECLOUD Corp. All rights reserved.',
    legalLinks: [
      { label: '개인정보처리방침', url: '/privacy' },
      { label: '이용약관', url: '/terms' },
      { label: '이메일무단수집거부', url: '/email-policy' },
    ],
    socialLinks: {
      facebook: { enabled: false, url: '' },
      twitter: { enabled: false, url: '' },
      youtube: { enabled: false, url: '' },
      instagram: { enabled: false, url: '' },
      linkedin: { enabled: false, url: '' },
      github: { enabled: false, url: '' },
    },
  },
  sidebarTU: {
    enabled: true,
    items: [
      { id: 'tu-1', label: '마이페이지', url: '/tu/b2c/mypage', icon: 'home', visible: true },
      {
        id: 'tu-2',
        label: '내 수강 강의',
        url: '',
        icon: 'book-open',
        visible: true,
        children: [
          { id: 'tu-2-1', label: '수강 중인 강의', url: '/tu/b2c/mypage/learning', visible: true },
          { id: 'tu-2-2', label: '완료한 강의', url: '/tu/b2c/mypage/completed', visible: true },
          { id: 'tu-2-3', label: '수료증', url: '/tu/b2c/mypage/certificates', visible: true },
        ],
      },
      {
        id: 'tu-3',
        label: '내 강의 관리',
        url: '',
        icon: 'pen-tool',
        visible: true,
        children: [
          { id: 'tu-3-1', label: '내 강의', url: '/tu/b2c/mypage/teaching', visible: true },
          { id: 'tu-3-2', label: '강의 개설하기', url: '/tu/teaching/courses/create', visible: true },
        ],
      },
      { id: 'tu-4', label: '설정', url: '/tu/b2c/mypage/settings', icon: 'settings', visible: true },
    ],
  },
  sidebarCO: {
    enabled: true,
    items: [
      { id: 'co-1', label: '대시보드', url: '/co/dashboard', icon: 'layout-dashboard', visible: true },
      {
        id: 'co-2',
        label: '교육 과정 탐색',
        url: '',
        icon: 'search',
        visible: true,
        children: [
          { id: 'co-2-1', label: '과정 검색', url: '/co/courses', visible: true },
          { id: 'co-2-2', label: '과정 등록/수정', url: '/co/courses/pending', visible: true },
        ],
      },
      { id: 'co-3', label: '사용자 관리', url: '/co/users', icon: 'users', visible: true },
      { id: 'co-4', label: '설정', url: '/co/settings', icon: 'settings', visible: true },
    ],
  },
};

// 기능 설정 항목
const FEATURES = [
  { key: 'communityEnabled' as const, label: '커뮤니티 기능', description: '사용자들이 커뮤니티에서 질문하고 토론할 수 있습니다', icon: MessageCircle },
  { key: 'userCourseCreationEnabled' as const, label: '사용자 강좌 생성', description: '일반 사용자가 직접 강좌를 생성할 수 있습니다', icon: BookOpen },
  { key: 'cartEnabled' as const, label: '장바구니 기능', description: '사용자가 강좌를 장바구니에 담을 수 있습니다', icon: ShoppingCart },
  { key: 'wishlistEnabled' as const, label: '찜하기 기능', description: '사용자가 강좌를 찜 목록에 추가할 수 있습니다', icon: Heart },
  { key: 'instructorTabEnabled' as const, label: '강사 탭 표시', description: '강좌 상세에서 강사 정보 탭을 표시합니다', icon: GraduationCap },
];

// 설정 패널 탭 타입
type SettingTab = 'brand' | 'layout' | 'features';

export function BrandingSettingsPage() {
  const queryClient = useQueryClient();

  // 브랜딩 설정 상태
  const [settings, setSettings] = useState<BrandingSettings>(defaultBrandingSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingTab>('brand');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [previewPage, setPreviewPage] = useState<'tu-main' | 'tu-mypage' | 'to'>('tu-main');

  // 드래그앤드롭 상태
  const [draggedBannerIndex, setDraggedBannerIndex] = useState<number | null>(null);
  const [draggedNavLinkIndex, setDraggedNavLinkIndex] = useState<number | null>(null);
  const [draggedLegalLinkIndex, setDraggedLegalLinkIndex] = useState<number | null>(null);
  const [draggedLandingCategoryIndex, setDraggedLandingCategoryIndex] = useState<number | null>(null);
  const [draggedCourseSectionIndex, setDraggedCourseSectionIndex] = useState<number | null>(null);
  const [expandedSidebarItems, setExpandedSidebarItems] = useState<Set<string>>(new Set(['tu-2', 'tu-3', 'co-2']));
  const [expandedMenuItems, setExpandedMenuItems] = useState<Set<string>>(new Set(['mypage-home']));

  // 브랜딩 설정 API 관련
  const { data: tenantSettings, isLoading: settingsLoading } = useTenantSettings();
  const updateDesignMutation = useUpdateDesignSettings();
  const updateLayoutMutation = useUpdateLayoutSettings();
  const updateExtendedBrandingMutation = useUpdateExtendedBrandingSettings();

  // 기능 설정 관련
  const { data: features, isLoading: featuresLoading } = useTenantFeatures();
  const updateFeaturesMutation = useUpdateTenantFeatures();
  const [featureFormData, setFeatureFormData] = useState<UpdateTenantFeaturesRequest>({
    communityEnabled: true,
    userCourseCreationEnabled: false,
    cartEnabled: true,
    wishlistEnabled: true,
    instructorTabEnabled: true,
  });

  // 기능 설정 동기화
  useEffect(() => {
    if (features) {
      setFeatureFormData({
        communityEnabled: features.communityEnabled,
        userCourseCreationEnabled: features.userCourseCreationEnabled,
        cartEnabled: features.cartEnabled,
        wishlistEnabled: features.wishlistEnabled,
        instructorTabEnabled: features.instructorTabEnabled,
      });
    }
  }, [features]);

  // 서버에서 받아온 브랜딩 설정을 로컬 상태에 초기화
  useEffect(() => {
    if (tenantSettings) {
      setSettings(prev => ({
        ...prev,
        company: {
          name: tenantSettings.companyName || prev.company.name,
        },
        logo: {
          lightPreview: tenantSettings.logoUrl || prev.logo.lightPreview,
          darkPreview: tenantSettings.darkLogoUrl || prev.logo.darkPreview,
          faviconPreview: tenantSettings.faviconUrl || prev.logo.faviconPreview,
        },
        colors: {
          primary: tenantSettings.primaryColor || prev.colors.primary,
          secondary: tenantSettings.secondaryColor || prev.colors.secondary,
        },
        // 확장 브랜딩 설정 (배너 설정이 있고 items가 있으면 사용, 없으면 기본값 유지)
        ...((tenantSettings.bannerSettings as { items?: unknown[] } | undefined)?.items?.length &&
          (tenantSettings.bannerSettings as { items?: unknown[] }).items!.length > 0 && {
          banner: tenantSettings.bannerSettings as typeof prev.banner,
        }),
        ...(tenantSettings.landingPageSettings && {
          landingCategory: (tenantSettings.landingPageSettings as { landingCategory?: typeof prev.landingCategory }).landingCategory || prev.landingCategory,
          courseSections: (tenantSettings.landingPageSettings as { courseSections?: typeof prev.courseSections }).courseSections || prev.courseSections,
        }),
        ...(tenantSettings.sidebarTUSettings && {
          sidebarTU: tenantSettings.sidebarTUSettings as typeof prev.sidebarTU,
        }),
        ...(tenantSettings.sidebarCOSettings && {
          sidebarCO: tenantSettings.sidebarCOSettings as typeof prev.sidebarCO,
        }),
        // 헤더 설정 로드
        ...(tenantSettings.headerSettings && {
          header: {
            ...prev.header,
            enabled: (tenantSettings.headerSettings as { enabled?: boolean }).enabled ?? prev.header.enabled,
            showLogo: (tenantSettings.headerSettings as { showLogo?: boolean }).showLogo ?? prev.header.showLogo,
            showSearch: (tenantSettings.headerSettings as { showSearch?: boolean }).showSearch ?? prev.header.showSearch,
            showCart: (tenantSettings.headerSettings as { showCart?: boolean }).showCart ?? prev.header.showCart,
            showWishlist: (tenantSettings.headerSettings as { showWishlist?: boolean }).showWishlist ?? prev.header.showWishlist,
            showNotifications: (tenantSettings.headerSettings as { showNotifications?: boolean }).showNotifications ?? prev.header.showNotifications,
            showThemeToggle: (tenantSettings.headerSettings as { showThemeToggle?: boolean }).showThemeToggle ?? prev.header.showThemeToggle,
          },
        }),
      }));
    }
  }, [tenantSettings]);

  // 커뮤니티 관련 항목인지 확인하는 헬퍼 함수
  const isCommunityRelated = (label: string) => {
    const communityKeywords = ['커뮤니티', 'community', '게시판', '게시글', '질문', 'Q&A', 'QnA', '토론'];
    return communityKeywords.some(keyword => label.toLowerCase().includes(keyword.toLowerCase()));
  };

  // 브랜딩 설정 업데이트 함수들
  const updateCompany = (key: keyof BrandingSettings['company'], value: string) => {
    setSettings(prev => ({ ...prev, company: { ...prev.company, [key]: value } }));
    setHasChanges(true);
  };

  const updateLogo = (key: keyof BrandingSettings['logo'], value: string | null) => {
    setSettings(prev => ({ ...prev, logo: { ...prev.logo, [key]: value } }));
    setHasChanges(true);
  };

  const updateColors = (key: keyof BrandingSettings['colors'], value: string) => {
    setSettings(prev => ({ ...prev, colors: { ...prev.colors, [key]: value } }));
    setHasChanges(true);
  };

  const updateHeader = (key: keyof BrandingSettings['header'], value: unknown) => {
    setSettings(prev => ({ ...prev, header: { ...prev.header, [key]: value } }));
    setHasChanges(true);
  };

  const updateBanner = (key: keyof BrandingSettings['banner'], value: unknown) => {
    setSettings(prev => ({ ...prev, banner: { ...prev.banner, [key]: value } }));
    setHasChanges(true);
  };

  const updateFooter = (key: keyof BrandingSettings['footer'], value: unknown) => {
    setSettings(prev => ({ ...prev, footer: { ...prev.footer, [key]: value } }));
    setHasChanges(true);
  };

  const updateSidebarTU = (key: keyof BrandingSettings['sidebarTU'], value: unknown) => {
    setSettings(prev => ({ ...prev, sidebarTU: { ...prev.sidebarTU, [key]: value } }));
    setHasChanges(true);
  };

  const updateSidebarTO = (key: keyof BrandingSettings['sidebarCO'], value: unknown) => {
    setSettings(prev => ({ ...prev, sidebarCO: { ...prev.sidebarCO, [key]: value } }));
    setHasChanges(true);
  };

  const updateLandingCategory = (key: keyof BrandingSettings['landingCategory'], value: unknown) => {
    setSettings(prev => ({ ...prev, landingCategory: { ...prev.landingCategory, [key]: value } }));
    setHasChanges(true);
  };

  const updateCourseSections = (key: keyof BrandingSettings['courseSections'], value: unknown) => {
    setSettings(prev => ({ ...prev, courseSections: { ...prev.courseSections, [key]: value } }));
    setHasChanges(true);
  };

  // 파일 업로드
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'lightLogo' | 'darkLogo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'lightLogo') updateLogo('lightPreview', reader.result as string);
        else if (type === 'darkLogo') updateLogo('darkPreview', reader.result as string);
        else if (type === 'favicon') updateLogo('faviconPreview', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 배너 관련 핸들러
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>, bannerId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItems = settings.banner.items.map(item =>
          item.id === bannerId ? { ...item, imagePreview: reader.result as string } : item
        );
        updateBanner('items', newItems);
      };
      reader.readAsDataURL(file);
    }
  };

  const addBannerItem = () => {
    const newId = Date.now().toString();
    updateBanner('items', [
      ...settings.banner.items,
      { id: newId, type: 'image' as const, imagePreview: null, code: '', title: `배너 ${settings.banner.items.length + 1}` },
    ]);
  };

  const removeBannerItem = (bannerId: string) => {
    updateBanner('items', settings.banner.items.filter(item => item.id !== bannerId));
  };

  const updateBannerItem = (bannerId: string, key: keyof BrandingSettings['banner']['items'][0], value: unknown) => {
    const newItems = settings.banner.items.map(item => (item.id === bannerId ? { ...item, [key]: value } : item));
    updateBanner('items', newItems);
  };

  // 드래그앤드롭 공통 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // 기능 설정 저장
  const handleSaveFeatures = async () => {
    await updateFeaturesMutation.mutateAsync(featureFormData);
  };

  // 전체 저장
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 디자인 설정 저장
      await updateDesignMutation.mutateAsync({
        logoUrl: settings.logo.lightPreview,
        darkLogoUrl: settings.logo.darkPreview,
        faviconUrl: settings.logo.faviconPreview,
        primaryColor: settings.colors.primary,
        secondaryColor: settings.colors.secondary,
      });

      // 레이아웃 설정 저장
      await updateLayoutMutation.mutateAsync({
        headerSettings: {
          enabled: settings.header.enabled,
          showLogo: settings.header.showLogo,
          showSearch: settings.header.showSearch,
          showCart: settings.header.showCart,
          showWishlist: settings.header.showWishlist,
          showNotifications: settings.header.showNotifications,
          showThemeToggle: settings.header.showThemeToggle,
          navLinks: settings.header.navLinks,
        } as unknown as Parameters<typeof updateLayoutMutation.mutateAsync>[0]['headerSettings'],
        footerSettings: {
          enabled: settings.footer.enabled,
          companyInfo: settings.footer.companyInfo,
          copyright: settings.footer.copyright,
          legalLinks: settings.footer.legalLinks,
          socialLinks: settings.footer.socialLinks,
        } as unknown as Parameters<typeof updateLayoutMutation.mutateAsync>[0]['footerSettings'],
      });

      // 확장 브랜딩 설정 저장
      await updateExtendedBrandingMutation.mutateAsync({
        companyName: settings.company.name,
        bannerSettings: {
          enabled: settings.banner.enabled,
          items: settings.banner.items.map((item, index) => ({
            id: item.id,
            type: item.type,
            imageUrl: item.imagePreview,
            code: item.code,
            title: item.title,
            order: index,
          })),
        },
        landingPageSettings: {
          landingCategory: settings.landingCategory,
          courseSections: settings.courseSections,
        },
        sidebarTUSettings: settings.sidebarTU,
        sidebarCOSettings: settings.sidebarCO,
      });

      setHasChanges(false);

      // TU 페이지의 캐시 무효화 (public-layout)
      await queryClient.invalidateQueries({ queryKey: ['public-layout'] });
    } catch (error) {
      console.error('브랜딩 설정 저장 실패:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultBrandingSettings);
    setHasChanges(false);
  };

  // 로딩 중
  if (featuresLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 상단 헤더 */}
      <div className="flex-shrink-0 border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">브랜딩 설정</h1>
            <p className="text-sm text-text-secondary mt-1">테넌트의 브랜드 아이덴티티와 레이아웃을 설정합니다</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠: 좌우 분할 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측: 설정 패널 */}
        <div className="w-[520px] flex-shrink-0 border-r bg-gray-50 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SettingTab)} className="h-full flex flex-col">
            <TabsList className="flex-shrink-0 w-full justify-start rounded-none border-b bg-white px-4 h-12">
              <TabsTrigger value="brand" className="gap-2">
                <Palette className="h-4 w-4" />
                브랜드
              </TabsTrigger>
              <TabsTrigger value="layout" className="gap-2">
                <Sidebar className="h-4 w-4" />
                레이아웃
              </TabsTrigger>
              <TabsTrigger value="features" className="gap-2">
                <ToggleRight className="h-4 w-4" />
                기능
              </TabsTrigger>
            </TabsList>

            {/* 브랜드 탭 */}
            <TabsContent value="brand" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
              {/* 회사명 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">회사명</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={settings.company.name}
                    onChange={(e) => updateCompany('name', e.target.value)}
                    placeholder="회사명을 입력하세요"
                  />
                </CardContent>
              </Card>

              {/* 로고 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">로고</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 라이트 모드 로고 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="h-4 w-4 text-amber-500" />
                      <Label>라이트 모드 로고</Label>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center bg-white">
                      {settings.logo.lightPreview ? (
                        <div className="space-y-2">
                          <img src={settings.logo.lightPreview} alt="Light Logo" className="max-h-12 mx-auto" />
                          <Button variant="ghost" size="sm" onClick={() => updateLogo('lightPreview', null)}>
                            <Trash2 className="mr-2 h-4 w-4" />삭제
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">클릭하여 업로드</p>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'lightLogo')} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* 다크 모드 로고 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="h-4 w-4 text-indigo-400" />
                      <Label>다크 모드 로고</Label>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center bg-gray-900">
                      {settings.logo.darkPreview ? (
                        <div className="space-y-2">
                          <img src={settings.logo.darkPreview} alt="Dark Logo" className="max-h-12 mx-auto" />
                          <Button variant="ghost" size="sm" className="text-gray-300" onClick={() => updateLogo('darkPreview', null)}>
                            <Trash2 className="mr-2 h-4 w-4" />삭제
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <Upload className="h-6 w-6 mx-auto text-gray-500 mb-1" />
                          <p className="text-xs text-gray-400">클릭하여 업로드</p>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'darkLogo')} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* 파비콘 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="h-4 w-4 text-brand-primary" />
                      <Label>파비콘</Label>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      {settings.logo.faviconPreview ? (
                        <div className="space-y-2">
                          <img src={settings.logo.faviconPreview} alt="Favicon" className="w-8 h-8 mx-auto" />
                          <Button variant="ghost" size="sm" onClick={() => updateLogo('faviconPreview', null)}>
                            <Trash2 className="mr-2 h-4 w-4" />삭제
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500">32x32 또는 64x64 권장</p>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'favicon')} />
                        </label>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 색상 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">브랜드 색상</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label>주 색상</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={settings.colors.primary}
                          onChange={(e) => updateColors('primary', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border-0"
                        />
                        <Input
                          value={settings.colors.primary}
                          onChange={(e) => updateColors('primary', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <Label>보조 색상</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={settings.colors.secondary}
                          onChange={(e) => updateColors('secondary', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border-0"
                        />
                        <Input
                          value={settings.colors.secondary}
                          onChange={(e) => updateColors('secondary', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 랜딩 페이지 카테고리 섹션 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderTree className="h-4 w-4 text-brand-primary" />
                      <CardTitle className="text-base">랜딩 페이지 카테고리</CardTitle>
                    </div>
                    <Switch checked={settings.landingCategory.enabled} onCheckedChange={(v) => updateLandingCategory('enabled', v)} />
                  </div>
                </CardHeader>
                {settings.landingCategory.enabled && (
                  <CardContent className="space-y-4">
                    <div>
                      <Label>섹션 제목</Label>
                      <Input
                        value={settings.landingCategory.sectionTitle}
                        onChange={(e) => updateLandingCategory('sectionTitle', e.target.value)}
                        placeholder="카테고리"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>카테고리 항목</Label>
                      <div className="space-y-2 mt-2">
                        {settings.landingCategory.items.map((item, index) => (
                          <div
                            key={index}
                            draggable
                            onDragStart={(e) => { setDraggedLandingCategoryIndex(index); e.dataTransfer.effectAllowed = 'move'; }}
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (draggedLandingCategoryIndex !== null && draggedLandingCategoryIndex !== index) {
                                const newItems = [...settings.landingCategory.items];
                                const [moved] = newItems.splice(draggedLandingCategoryIndex, 1);
                                newItems.splice(index, 0, moved);
                                updateLandingCategory('items', newItems);
                              }
                              setDraggedLandingCategoryIndex(null);
                            }}
                            onDragEnd={() => setDraggedLandingCategoryIndex(null)}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-move ${draggedLandingCategoryIndex === index ? 'opacity-50 border-brand-primary' : 'hover:bg-gray-50'}`}
                          >
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newItems = [...settings.landingCategory.items];
                                newItems[index] = e.target.value;
                                updateLandingCategory('items', newItems);
                              }}
                              className="flex-1"
                              draggable={false}
                              onDragStart={(e) => e.stopPropagation()}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateLandingCategory('items', settings.landingCategory.items.filter((_, i) => i !== index))}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => updateLandingCategory('items', [...settings.landingCategory.items, ''])}>
                        <Plus className="mr-2 h-4 w-4" />
                        카테고리 추가
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* 강의 섹션 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand-primary" />
                      <CardTitle className="text-base">강의 섹션 제목</CardTitle>
                    </div>
                    <Switch checked={settings.courseSections.enabled} onCheckedChange={(v) => updateCourseSections('enabled', v)} />
                  </div>
                </CardHeader>
                {settings.courseSections.enabled && (
                  <CardContent>
                    <div className="space-y-2">
                      {settings.courseSections.items.map((section, index) => (
                        <div
                          key={section.id}
                          draggable
                          onDragStart={(e) => { setDraggedCourseSectionIndex(index); e.dataTransfer.effectAllowed = 'move'; }}
                          onDragOver={handleDragOver}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedCourseSectionIndex !== null && draggedCourseSectionIndex !== index) {
                              const newItems = [...settings.courseSections.items];
                              const [moved] = newItems.splice(draggedCourseSectionIndex, 1);
                              newItems.splice(index, 0, moved);
                              updateCourseSections('items', newItems);
                            }
                            setDraggedCourseSectionIndex(null);
                          }}
                          onDragEnd={() => setDraggedCourseSectionIndex(null)}
                          className={`flex items-center gap-2 p-2 rounded-lg border cursor-move ${draggedCourseSectionIndex === index ? 'opacity-50 border-brand-primary' : 'hover:bg-gray-50'}`}
                        >
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <Input
                            value={section.title}
                            onChange={(e) => {
                              const newItems = [...settings.courseSections.items];
                              newItems[index] = { ...newItems[index], title: e.target.value };
                              updateCourseSections('items', newItems);
                            }}
                            className="flex-1"
                            draggable={false}
                            onDragStart={(e) => e.stopPropagation()}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateCourseSections('items', settings.courseSections.items.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => updateCourseSections('items', [...settings.courseSections.items, { id: Date.now().toString(), title: '새 섹션' }])}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      섹션 추가
                    </Button>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            {/* 레이아웃 탭 */}
            <TabsContent value="layout" className="flex-1 overflow-y-auto p-4 space-y-4 mt-0">
              {/* 헤더 설정 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PanelTop className="h-4 w-4 text-brand-primary" />
                      <CardTitle className="text-base">헤더</CardTitle>
                    </div>
                    <Switch checked={settings.header.enabled} onCheckedChange={(v) => updateHeader('enabled', v)} />
                  </div>
                </CardHeader>
                {settings.header.enabled && (
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>로고 표시</Label>
                      <Switch checked={settings.header.showLogo} onCheckedChange={(v) => updateHeader('showLogo', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>검색 표시</Label>
                      <Switch checked={settings.header.showSearch} onCheckedChange={(v) => updateHeader('showSearch', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>찜 목록 표시</Label>
                      <Switch checked={settings.header.showWishlist} onCheckedChange={(v) => updateHeader('showWishlist', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>장바구니 표시</Label>
                      <Switch checked={settings.header.showCart} onCheckedChange={(v) => updateHeader('showCart', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>알림 표시</Label>
                      <Switch checked={settings.header.showNotifications} onCheckedChange={(v) => updateHeader('showNotifications', v)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>테마 토글 표시</Label>
                      <Switch checked={settings.header.showThemeToggle} onCheckedChange={(v) => updateHeader('showThemeToggle', v)} />
                    </div>

                    {/* 내비게이션 링크 */}
                    <div className="pt-3 border-t">
                      <Label className="mb-2 block">내비게이션 링크</Label>
                      <div className="space-y-2">
                        {settings.header.navLinks.map((link, index) => {
                          // 커뮤니티 관련 링크이고 커뮤니티 기능이 비활성화된 경우
                          const isCommunityDisabled = isCommunityRelated(link.label) && !featureFormData.communityEnabled;
                          return (
                            <div
                              key={index}
                              draggable={!isCommunityDisabled}
                              onDragStart={(e) => { if (!isCommunityDisabled) { setDraggedNavLinkIndex(index); e.dataTransfer.effectAllowed = 'move'; } }}
                              onDragOver={handleDragOver}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (draggedNavLinkIndex !== null && draggedNavLinkIndex !== index) {
                                  const newLinks = [...settings.header.navLinks];
                                  const [moved] = newLinks.splice(draggedNavLinkIndex, 1);
                                  newLinks.splice(index, 0, moved);
                                  updateHeader('navLinks', newLinks);
                                }
                                setDraggedNavLinkIndex(null);
                              }}
                              onDragEnd={() => setDraggedNavLinkIndex(null)}
                              className={`flex items-center gap-2 p-2 rounded-lg border ${
                                isCommunityDisabled
                                  ? 'opacity-50 bg-gray-100 cursor-not-allowed'
                                  : draggedNavLinkIndex === index
                                    ? 'opacity-50 border-brand-primary cursor-move'
                                    : 'hover:bg-gray-50 cursor-move'
                              }`}
                            >
                              <GripVertical className={`h-4 w-4 ${isCommunityDisabled ? 'text-gray-300' : 'text-gray-400'}`} />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={isCommunityDisabled}
                                onClick={() => {
                                  const newLinks = [...settings.header.navLinks];
                                  newLinks[index].visible = !newLinks[index].visible;
                                  updateHeader('navLinks', newLinks);
                                }}
                              >
                                {isCommunityDisabled
                                  ? <EyeOff className="h-4 w-4 text-gray-300" />
                                  : link.visible
                                    ? <Eye className="h-4 w-4 text-green-500" />
                                    : <EyeOff className="h-4 w-4 text-gray-400" />
                                }
                              </Button>
                              <Input
                                value={link.label}
                                onChange={(e) => {
                                  const newLinks = [...settings.header.navLinks];
                                  newLinks[index].label = e.target.value;
                                  updateHeader('navLinks', newLinks);
                                }}
                                placeholder="메뉴명"
                                className="flex-1 h-8"
                                disabled={isCommunityDisabled}
                                draggable={false}
                                onDragStart={(e) => e.stopPropagation()}
                              />
                              <Input
                                value={link.url}
                                onChange={(e) => {
                                  const newLinks = [...settings.header.navLinks];
                                  newLinks[index].url = e.target.value;
                                  updateHeader('navLinks', newLinks);
                                }}
                                placeholder="/url"
                                className="flex-1 h-8"
                                disabled={isCommunityDisabled}
                                draggable={false}
                                onDragStart={(e) => e.stopPropagation()}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={isCommunityDisabled}
                                onClick={() => updateHeader('navLinks', settings.header.navLinks.filter((_, i) => i !== index))}
                              >
                                <Trash2 className={`h-4 w-4 ${isCommunityDisabled ? 'text-gray-300' : 'text-red-500'}`} />
                              </Button>
                              {isCommunityDisabled && (
                                <span className="text-[10px] text-orange-500 whitespace-nowrap">기능 OFF</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => updateHeader('navLinks', [...settings.header.navLinks, { label: '', url: '', visible: true }])}>
                        <Plus className="mr-2 h-4 w-4" />
                        링크 추가
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* 배너 설정 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-brand-primary" />
                      <CardTitle className="text-base">배너</CardTitle>
                    </div>
                    <Switch checked={settings.banner.enabled} onCheckedChange={(v) => updateBanner('enabled', v)} />
                  </div>
                </CardHeader>
                {settings.banner.enabled && (
                  <CardContent>
                    <div className="space-y-2">
                      {settings.banner.items.map((banner, index) => (
                        <div
                          key={banner.id}
                          draggable
                          onDragStart={(e) => { setDraggedBannerIndex(index); e.dataTransfer.effectAllowed = 'move'; }}
                          onDragOver={handleDragOver}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedBannerIndex !== null && draggedBannerIndex !== index) {
                              const newItems = [...settings.banner.items];
                              const [moved] = newItems.splice(draggedBannerIndex, 1);
                              newItems.splice(index, 0, moved);
                              updateBanner('items', newItems);
                            }
                            setDraggedBannerIndex(null);
                          }}
                          onDragEnd={() => setDraggedBannerIndex(null)}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-move ${draggedBannerIndex === index ? 'opacity-50 border-brand-primary' : 'hover:bg-gray-50'}`}
                        >
                          <GripVertical className="h-5 w-5 text-gray-400" />
                          <div className="w-20 h-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {banner.imagePreview ? (
                              <img src={banner.imagePreview} alt={banner.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0" draggable={false} onDragStart={(e) => e.stopPropagation()}>
                            <Input
                              value={banner.title}
                              onChange={(e) => updateBannerItem(banner.id, 'title', e.target.value)}
                              placeholder="배너 제목"
                              className="h-8 text-sm mb-1"
                              draggable={false}
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">#{index + 1}</span>
                              <div className="flex gap-1">
                                <Button
                                  variant={banner.type === 'image' ? 'default' : 'ghost'}
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => updateBannerItem(banner.id, 'type', 'image')}
                                >
                                  이미지
                                </Button>
                                <Button
                                  variant={banner.type === 'code' ? 'default' : 'ghost'}
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => updateBannerItem(banner.id, 'type', 'code')}
                                >
                                  HTML
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {banner.type === 'image' ? (
                              <label className="cursor-pointer">
                                <Button variant="outline" size="sm" asChild>
                                  <span><Upload className="h-4 w-4" /></span>
                                </Button>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBannerFileUpload(e, banner.id)} />
                              </label>
                            ) : (
                              <Button variant="outline" size="sm" onClick={() => {
                                const code = prompt('HTML 코드를 입력하세요:', banner.code);
                                if (code !== null) updateBannerItem(banner.id, 'code', code);
                              }}>
                                <Code className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => removeBannerItem(banner.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={addBannerItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      배너 추가
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">드래그하여 순서 변경. 권장: 1920x400px</p>
                  </CardContent>
                )}
              </Card>

              {/* 푸터 설정 */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PanelBottom className="h-4 w-4 text-brand-primary" />
                      <CardTitle className="text-base">푸터</CardTitle>
                    </div>
                    <Switch checked={settings.footer.enabled} onCheckedChange={(v) => updateFooter('enabled', v)} />
                  </div>
                </CardHeader>
                {settings.footer.enabled && (
                  <CardContent className="space-y-4">
                    {/* 회사 정보 */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">회사 정보</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">대표자</Label>
                          <Input
                            value={settings.footer.companyInfo.ceo}
                            onChange={(e) => updateFooter('companyInfo', { ...settings.footer.companyInfo, ceo: e.target.value })}
                            placeholder="대표자명"
                            className="mt-1 h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">사업자등록번호</Label>
                          <Input
                            value={settings.footer.companyInfo.businessNo}
                            onChange={(e) => updateFooter('companyInfo', { ...settings.footer.companyInfo, businessNo: e.target.value })}
                            placeholder="000-00-00000"
                            className="mt-1 h-8"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">주소</Label>
                          <Input
                            value={settings.footer.companyInfo.address}
                            onChange={(e) => updateFooter('companyInfo', { ...settings.footer.companyInfo, address: e.target.value })}
                            placeholder="회사 주소"
                            className="mt-1 h-8"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">연락처</Label>
                          <Input
                            value={settings.footer.companyInfo.phone}
                            onChange={(e) => updateFooter('companyInfo', { ...settings.footer.companyInfo, phone: e.target.value })}
                            placeholder="0000-0000"
                            className="mt-1 h-8"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 저작권 */}
                    <div className="pt-3 border-t">
                      <Label>저작권 문구</Label>
                      <Input
                        value={settings.footer.copyright}
                        onChange={(e) => updateFooter('copyright', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* 법적 고지 링크 */}
                    <div className="pt-3 border-t">
                      <Label className="mb-2 block">법적 고지 링크</Label>
                      <div className="space-y-2">
                        {settings.footer.legalLinks.map((link, index) => (
                          <div
                            key={index}
                            draggable
                            onDragStart={(e) => { setDraggedLegalLinkIndex(index); e.dataTransfer.effectAllowed = 'move'; }}
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (draggedLegalLinkIndex !== null && draggedLegalLinkIndex !== index) {
                                const newLinks = [...settings.footer.legalLinks];
                                const [moved] = newLinks.splice(draggedLegalLinkIndex, 1);
                                newLinks.splice(index, 0, moved);
                                updateFooter('legalLinks', newLinks);
                              }
                              setDraggedLegalLinkIndex(null);
                            }}
                            onDragEnd={() => setDraggedLegalLinkIndex(null)}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-move ${draggedLegalLinkIndex === index ? 'opacity-50 border-brand-primary' : 'hover:bg-gray-50'}`}
                          >
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <Input
                              value={link.label}
                              onChange={(e) => {
                                const newLinks = [...settings.footer.legalLinks];
                                newLinks[index].label = e.target.value;
                                updateFooter('legalLinks', newLinks);
                              }}
                              placeholder="링크명"
                              className="flex-1 h-8"
                              draggable={false}
                              onDragStart={(e) => e.stopPropagation()}
                            />
                            <Input
                              value={link.url}
                              onChange={(e) => {
                                const newLinks = [...settings.footer.legalLinks];
                                newLinks[index].url = e.target.value;
                                updateFooter('legalLinks', newLinks);
                              }}
                              placeholder="/url"
                              className="flex-1 h-8"
                              draggable={false}
                              onDragStart={(e) => e.stopPropagation()}
                            />
                            <Button variant="ghost" size="sm" onClick={() => updateFooter('legalLinks', settings.footer.legalLinks.filter((_, i) => i !== index))}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => updateFooter('legalLinks', [...settings.footer.legalLinks, { label: '', url: '' }])}>
                        <Plus className="mr-2 h-4 w-4" />
                        링크 추가
                      </Button>
                    </div>

                    {/* 소셜 미디어 */}
                    <div className="pt-3 border-t">
                      <Label className="mb-3 block">소셜 미디어</Label>
                      <div className="space-y-2">
                        {(['facebook', 'twitter', 'youtube', 'instagram', 'linkedin', 'github'] as const).map((platform) => (
                          <div key={platform} className="flex items-center gap-2">
                            <Switch
                              checked={settings.footer.socialLinks[platform].enabled}
                              onCheckedChange={(checked) => {
                                updateFooter('socialLinks', {
                                  ...settings.footer.socialLinks,
                                  [platform]: { ...settings.footer.socialLinks[platform], enabled: checked },
                                });
                              }}
                            />
                            <span className="text-sm capitalize w-20">{platform}</span>
                            {settings.footer.socialLinks[platform].enabled && (
                              <Input
                                value={settings.footer.socialLinks[platform].url}
                                onChange={(e) => {
                                  updateFooter('socialLinks', {
                                    ...settings.footer.socialLinks,
                                    [platform]: { ...settings.footer.socialLinks[platform], url: e.target.value },
                                  });
                                }}
                                placeholder="URL"
                                className="flex-1 h-8"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* 사이드바 TU */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sidebar className="h-4 w-4 text-brand-primary" />
                      <CardTitle className="text-base">사이드바 (사용자)</CardTitle>
                    </div>
                    <Switch checked={settings.sidebarTU.enabled} onCheckedChange={(v) => updateSidebarTU('enabled', v)} />
                  </div>
                </CardHeader>
                {settings.sidebarTU.enabled && (
                  <CardContent>
                    <div className="space-y-1">
                      {settings.sidebarTU.items.map((item, index) => {
                        const isItemCommunityDisabled = isCommunityRelated(item.label) && !featureFormData.communityEnabled;
                        return (
                          <div key={item.id} className="space-y-1">
                            <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                              isItemCommunityDisabled
                                ? 'opacity-50 bg-gray-100'
                                : item.children && item.children.length > 0
                                  ? 'bg-gray-50'
                                  : ''
                            }`}>
                              {item.children && item.children.length > 0 ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => {
                                    setExpandedSidebarItems(prev => {
                                      const newSet = new Set(prev);
                                      if (newSet.has(item.id)) newSet.delete(item.id);
                                      else newSet.add(item.id);
                                      return newSet;
                                    });
                                  }}
                                >
                                  {expandedSidebarItems.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </Button>
                              ) : <div className="w-7" />}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={isItemCommunityDisabled}
                                onClick={() => {
                                  const newItems = [...settings.sidebarTU.items];
                                  newItems[index].visible = !newItems[index].visible;
                                  updateSidebarTU('items', newItems);
                                }}
                              >
                                {isItemCommunityDisabled
                                  ? <EyeOff className="h-4 w-4 text-gray-300" />
                                  : item.visible
                                    ? <Eye className="h-4 w-4 text-green-500" />
                                    : <EyeOff className="h-4 w-4 text-gray-400" />
                                }
                              </Button>
                              <select
                                value={item.icon}
                                disabled={isItemCommunityDisabled}
                                onChange={(e) => {
                                  const newItems = [...settings.sidebarTU.items];
                                  newItems[index].icon = e.target.value;
                                  updateSidebarTU('items', newItems);
                                }}
                                className={`h-7 px-2 border rounded text-xs ${isItemCommunityDisabled ? 'bg-gray-100 text-gray-400' : ''}`}
                              >
                                {availableIcons.map(icon => (
                                  <option key={icon.value} value={icon.value}>{icon.label}</option>
                                ))}
                              </select>
                              <Input
                                value={item.label}
                                disabled={isItemCommunityDisabled}
                                onChange={(e) => {
                                  const newItems = [...settings.sidebarTU.items];
                                  newItems[index].label = e.target.value;
                                  updateSidebarTU('items', newItems);
                                }}
                                placeholder="항목명"
                                className="flex-1 h-7 text-sm"
                              />
                              <Input
                                value={item.url}
                                disabled={isItemCommunityDisabled}
                                onChange={(e) => {
                                  const newItems = [...settings.sidebarTU.items];
                                  newItems[index].url = e.target.value;
                                  updateSidebarTU('items', newItems);
                                }}
                                placeholder="/url"
                                className="flex-1 h-7 text-sm"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={isItemCommunityDisabled}
                                onClick={() => {
                                  const newItems = [...settings.sidebarTU.items];
                                  if (!newItems[index].children) newItems[index].children = [];
                                  newItems[index].children!.push({
                                    id: `${item.id}-${Date.now()}`,
                                    label: '',
                                    url: '',
                                    visible: true,
                                  });
                                  updateSidebarTU('items', newItems);
                                  setExpandedSidebarItems(prev => new Set([...prev, item.id]));
                                }}
                              >
                                <Plus className={`h-4 w-4 ${isItemCommunityDisabled ? 'text-gray-300' : 'text-brand-primary'}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={isItemCommunityDisabled}
                                onClick={() => updateSidebarTU('items', settings.sidebarTU.items.filter((_, i) => i !== index))}
                              >
                                <Trash2 className={`h-4 w-4 ${isItemCommunityDisabled ? 'text-gray-300' : 'text-red-500'}`} />
                              </Button>
                              {isItemCommunityDisabled && (
                                <span className="text-[10px] text-orange-500 whitespace-nowrap">기능 OFF</span>
                              )}
                            </div>
                          {item.children && item.children.length > 0 && expandedSidebarItems.has(item.id) && (
                            <div className="ml-9 space-y-1 border-l-2 pl-3">
                              {item.children.map((child, childIndex) => (
                                <div key={child.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      const newItems = [...settings.sidebarTU.items];
                                      newItems[index].children![childIndex].visible = !newItems[index].children![childIndex].visible;
                                      updateSidebarTU('items', newItems);
                                    }}
                                  >
                                    {child.visible ? <Eye className="h-3 w-3 text-green-500" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
                                  </Button>
                                  <Input
                                    value={child.label}
                                    onChange={(e) => {
                                      const newItems = [...settings.sidebarTU.items];
                                      newItems[index].children![childIndex].label = e.target.value;
                                      updateSidebarTU('items', newItems);
                                    }}
                                    placeholder="항목명"
                                    className="flex-1 h-6 text-xs"
                                  />
                                  <Input
                                    value={child.url}
                                    onChange={(e) => {
                                      const newItems = [...settings.sidebarTU.items];
                                      newItems[index].children![childIndex].url = e.target.value;
                                      updateSidebarTU('items', newItems);
                                    }}
                                    placeholder="/url"
                                    className="flex-1 h-6 text-xs"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      const newItems = [...settings.sidebarTU.items];
                                      newItems[index].children = newItems[index].children!.filter((_, i) => i !== childIndex);
                                      updateSidebarTU('items', newItems);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => updateSidebarTU('items', [...settings.sidebarTU.items, { id: `tu-${Date.now()}`, label: '', url: '', icon: 'home', visible: true }])}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      항목 추가
                    </Button>
                  </CardContent>
                )}
              </Card>

              {/* 사이드바 TO */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sidebar className="h-4 w-4 text-brand-primary" />
                      <CardTitle className="text-base">사이드바 (운영자)</CardTitle>
                    </div>
                    <Switch checked={settings.sidebarCO.enabled} onCheckedChange={(v) => updateSidebarTO('enabled', v)} />
                  </div>
                </CardHeader>
                {settings.sidebarCO.enabled && (
                  <CardContent>
                    <div className="space-y-1">
                      {settings.sidebarCO.items.map((item, index) => {
                        const isItemCommunityDisabled = isCommunityRelated(item.label) && !featureFormData.communityEnabled;
                        return (
                          <div key={item.id} className="space-y-1">
                            <div className={`flex items-center gap-2 p-2 rounded-lg border ${
                              isItemCommunityDisabled
                                ? 'opacity-50 bg-gray-100'
                                : item.children && item.children.length > 0
                                  ? 'bg-gray-50'
                                  : ''
                            }`}>
                              {item.children && item.children.length > 0 ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => {
                                    setExpandedSidebarItems(prev => {
                                      const newSet = new Set(prev);
                                      if (newSet.has(item.id)) newSet.delete(item.id);
                                      else newSet.add(item.id);
                                      return newSet;
                                    });
                                  }}
                                >
                                  {expandedSidebarItems.has(item.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </Button>
                              ) : <div className="w-7" />}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={isItemCommunityDisabled}
                                onClick={() => {
                                  const newItems = [...settings.sidebarCO.items];
                                  newItems[index].visible = !newItems[index].visible;
                                  updateSidebarTO('items', newItems);
                                }}
                              >
                                {isItemCommunityDisabled
                                  ? <EyeOff className="h-4 w-4 text-gray-300" />
                                  : item.visible
                                    ? <Eye className="h-4 w-4 text-green-500" />
                                    : <EyeOff className="h-4 w-4 text-gray-400" />
                                }
                              </Button>
                              <select
                                value={item.icon}
                                disabled={isItemCommunityDisabled}
                                onChange={(e) => {
                                  const newItems = [...settings.sidebarCO.items];
                                  newItems[index].icon = e.target.value;
                                  updateSidebarTO('items', newItems);
                                }}
                                className={`h-7 px-2 border rounded text-xs ${isItemCommunityDisabled ? 'bg-gray-100 text-gray-400' : ''}`}
                              >
                                {availableIcons.map(icon => (
                                  <option key={icon.value} value={icon.value}>{icon.label}</option>
                                ))}
                              </select>
                              <Input
                                value={item.label}
                                disabled={isItemCommunityDisabled}
                                onChange={(e) => {
                                  const newItems = [...settings.sidebarCO.items];
                                  newItems[index].label = e.target.value;
                                  updateSidebarTO('items', newItems);
                                }}
                                placeholder="항목명"
                                className="flex-1 h-7 text-sm"
                              />
                              <Input
                                value={item.url}
                                disabled={isItemCommunityDisabled}
                                onChange={(e) => {
                                  const newItems = [...settings.sidebarCO.items];
                                  newItems[index].url = e.target.value;
                                  updateSidebarTO('items', newItems);
                                }}
                                placeholder="/url"
                                className="flex-1 h-7 text-sm"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={isItemCommunityDisabled}
                                onClick={() => {
                                  const newItems = [...settings.sidebarCO.items];
                                  if (!newItems[index].children) newItems[index].children = [];
                                  newItems[index].children!.push({
                                    id: `${item.id}-${Date.now()}`,
                                    label: '',
                                    url: '',
                                    visible: true,
                                  });
                                  updateSidebarTO('items', newItems);
                                  setExpandedSidebarItems(prev => new Set([...prev, item.id]));
                                }}
                              >
                                <Plus className={`h-4 w-4 ${isItemCommunityDisabled ? 'text-gray-300' : 'text-brand-primary'}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                disabled={isItemCommunityDisabled}
                                onClick={() => updateSidebarTO('items', settings.sidebarCO.items.filter((_, i) => i !== index))}
                              >
                                <Trash2 className={`h-4 w-4 ${isItemCommunityDisabled ? 'text-gray-300' : 'text-red-500'}`} />
                              </Button>
                              {isItemCommunityDisabled && (
                                <span className="text-[10px] text-orange-500 whitespace-nowrap">기능 OFF</span>
                              )}
                            </div>
                          {item.children && item.children.length > 0 && expandedSidebarItems.has(item.id) && (
                            <div className="ml-9 space-y-1 border-l-2 pl-3">
                              {item.children.map((child, childIndex) => (
                                <div key={child.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      const newItems = [...settings.sidebarCO.items];
                                      newItems[index].children![childIndex].visible = !newItems[index].children![childIndex].visible;
                                      updateSidebarTO('items', newItems);
                                    }}
                                  >
                                    {child.visible ? <Eye className="h-3 w-3 text-green-500" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
                                  </Button>
                                  <Input
                                    value={child.label}
                                    onChange={(e) => {
                                      const newItems = [...settings.sidebarCO.items];
                                      newItems[index].children![childIndex].label = e.target.value;
                                      updateSidebarTO('items', newItems);
                                    }}
                                    placeholder="항목명"
                                    className="flex-1 h-6 text-xs"
                                  />
                                  <Input
                                    value={child.url}
                                    onChange={(e) => {
                                      const newItems = [...settings.sidebarCO.items];
                                      newItems[index].children![childIndex].url = e.target.value;
                                      updateSidebarTO('items', newItems);
                                    }}
                                    placeholder="/url"
                                    className="flex-1 h-6 text-xs"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      const newItems = [...settings.sidebarCO.items];
                                      newItems[index].children = newItems[index].children!.filter((_, i) => i !== childIndex);
                                      updateSidebarTO('items', newItems);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => updateSidebarTO('items', [...settings.sidebarCO.items, { id: `to-${Date.now()}`, label: '', url: '', icon: 'home', visible: true }])}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      항목 추가
                    </Button>
                  </CardContent>
                )}
              </Card>
            </TabsContent>

            {/* 기능 탭 */}
            <TabsContent value="features" className="flex-1 overflow-y-auto p-4 mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">기능 On/Off</CardTitle>
                  <CardDescription>테넌트에서 사용할 기능을 활성화하거나 비활성화합니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {FEATURES.map((feature, index) => {
                      const Icon = feature.icon;
                      const isEnabled = featureFormData[feature.key] ?? false;
                      return (
                        <div key={feature.key}>
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isEnabled ? 'bg-brand-primary/10 text-brand-primary' : 'bg-gray-100 text-gray-400'}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{feature.label}</p>
                                <p className="text-xs text-gray-500">{feature.description}</p>
                              </div>
                            </div>
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={(checked) => setFeatureFormData(prev => ({ ...prev, [feature.key]: checked }))}
                            />
                          </div>
                          {index < FEATURES.length - 1 && <hr className="border-gray-100" />}
                        </div>
                      );
                    })}
                  </div>
                  <Button className="w-full mt-4" onClick={handleSaveFeatures} disabled={updateFeaturesMutation.isPending}>
                    {updateFeaturesMutation.isPending ? '저장 중...' : '기능 설정 저장'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>

        {/* 우측: 실시간 미리보기 */}
        <div className="flex-1 bg-gray-100 overflow-hidden flex flex-col">
          {/* 미리보기 컨트롤 */}
          <div className="flex-shrink-0 bg-white border-b px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">미리보기</span>
              <select
                value={previewPage}
                onChange={(e) => setPreviewPage(e.target.value as typeof previewPage)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="tu-main">TU 메인</option>
                <option value="tu-mypage">TU 마이페이지</option>
                <option value="to">TO (관리자)</option>
              </select>
            </div>
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <Button
                variant={previewTheme === 'light' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2"
                onClick={() => setPreviewTheme('light')}
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant={previewTheme === 'dark' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 px-2"
                onClick={() => setPreviewTheme('dark')}
              >
                <Moon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 미리보기 화면 */}
          <div className="flex-1 overflow-auto p-6">
            <div className={`mx-auto max-w-4xl rounded-lg shadow-lg overflow-hidden ${previewTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
              {/* 브라우저 탭 시뮬레이션 */}
              <div className={`flex items-center gap-2 px-3 py-2 border-b ${previewTheme === 'dark' ? 'bg-[#2a2a2a] border-[#3f3f3f]' : 'bg-gray-100 border-gray-200'}`}>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-t-md text-xs ${previewTheme === 'dark' ? 'bg-[#1e1e1e] text-[#d4d4d4]' : 'bg-white text-gray-600'}`}>
                  {settings.logo.faviconPreview ? (
                    <img src={settings.logo.faviconPreview} alt="Favicon" className="w-4 h-4 object-contain" />
                  ) : (
                    <div className="w-4 h-4 rounded bg-gray-300" />
                  )}
                  <span className="truncate max-w-[120px]">
                    {previewPage === 'tu-main' && (settings.company.name || '사이트 제목')}
                    {previewPage === 'tu-mypage' && '마이페이지'}
                    {previewPage === 'to' && '관리자'}
                  </span>
                </div>
              </div>

              {/* 헤더 - 모든 페이지 공통 */}
              {settings.header.enabled && (
                <div
                  onClick={() => setActiveTab('layout')}
                  className={`h-14 border-b flex items-center justify-between px-4 cursor-pointer relative group ${previewTheme === 'dark' ? 'bg-[#1e1e1e] border-[#3f3f3f]' : 'bg-white border-gray-200'}`}
                >
                  <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/10 transition-colors flex items-center justify-center z-10">
                    <span className="opacity-0 group-hover:opacity-100 text-xs font-medium text-brand-primary bg-white px-2 py-1 rounded shadow">헤더 설정</span>
                  </div>
                  <div className="flex items-center gap-6">
                    {settings.header.showLogo && (
                      <div className="flex items-center gap-2">
                        {(settings.logo.lightPreview || settings.logo.darkPreview) && (
                          <img
                            src={(previewTheme === 'dark' ? settings.logo.darkPreview : settings.logo.lightPreview) || settings.logo.lightPreview || settings.logo.darkPreview!}
                            alt="Logo"
                            className="h-7 object-contain"
                          />
                        )}
                        <span className="font-bold text-base" style={{ color: settings.colors.primary }}>
                          {settings.company.name || 'Logo'}
                        </span>
                      </div>
                    )}
                    {/* 네비게이션 링크 */}
                    <div className={`flex gap-4 text-xs font-medium ${previewTheme === 'dark' ? 'text-[#d4d4d4]' : 'text-gray-700'}`}>
                      {settings.header.navLinks
                        .filter(l => l.visible)
                        .filter(l => {
                          const isCommunity = isCommunityRelated(l.label);
                          const shouldShow = !isCommunity || featureFormData.communityEnabled;
                          return shouldShow;
                        })
                        .slice(0, 4)
                        .map((link, i) => (
                          <span
                            key={i}
                            className="relative"
                            style={i === 0 ? { color: settings.colors.primary } : {}}
                          >
                            {link.label}
                            {i === 0 && (
                              <span
                                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                                style={{ backgroundColor: settings.colors.primary }}
                              />
                            )}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.header.showSearch && (
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] ${previewTheme === 'dark' ? 'bg-white/10 text-[#9e9e9e]' : 'bg-gray-100 text-gray-500'}`}>
                        <Search className="w-3 h-3" />
                        <span>검색</span>
                      </div>
                    )}
                    {settings.header.showWishlist && featureFormData.wishlistEnabled && <Heart className={`w-4 h-4 ${previewTheme === 'dark' ? 'text-[#9e9e9e]' : 'text-gray-600'}`} />}
                    {settings.header.showCart && featureFormData.cartEnabled && <ShoppingCart className={`w-4 h-4 ${previewTheme === 'dark' ? 'text-[#9e9e9e]' : 'text-gray-600'}`} />}
                    {settings.header.showNotifications && <Bell className={`w-4 h-4 ${previewTheme === 'dark' ? 'text-[#9e9e9e]' : 'text-gray-600'}`} />}
                    {settings.header.showThemeToggle && (previewTheme === 'dark' ? <Moon className="w-4 h-4 text-[#9e9e9e]" /> : <Sun className="w-4 h-4 text-gray-600" />)}
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ background: `linear-gradient(to bottom right, ${settings.colors.primary}, ${settings.colors.secondary})` }}
                    />
                  </div>
                </div>
              )}

              {/* TU 메인 페이지 */}
              {previewPage === 'tu-main' && (
                <>
                  {/* 배너 */}
                  {settings.banner.enabled && (
                    <div
                      onClick={() => setActiveTab('layout')}
                      className="h-28 flex items-center justify-center text-white cursor-pointer relative group"
                      style={{ background: `linear-gradient(to right, ${settings.colors.primary}, ${settings.colors.secondary})` }}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">배너 설정</span>
                      </div>
                      <span className="font-bold text-lg">{settings.banner.items[0]?.title || '배너 영역'}</span>
                    </div>
                  )}

                  {/* 컨텐츠 영역 */}
                  <div className={`p-4 min-h-[280px] ${previewTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    {/* 랜딩 카테고리 섹션 */}
                    {settings.landingCategory.enabled && settings.landingCategory.items.length > 0 && (
                      <div
                        onClick={() => setActiveTab('brand')}
                        className="mb-5 cursor-pointer relative group rounded-lg p-2 -m-2 hover:bg-brand-primary/5 transition-colors"
                      >
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-medium text-brand-primary bg-white px-1.5 py-0.5 rounded shadow">카테고리 설정</span>
                        </div>
                        <h3 className={`text-xs font-semibold mb-2 ${previewTheme === 'dark' ? 'text-[#d4d4d4]' : 'text-gray-900'}`}>
                          {settings.landingCategory.sectionTitle || '카테고리'}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {settings.landingCategory.items.filter(item => item.trim()).map((item, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                                previewTheme === 'dark' ? 'bg-white/5 border border-white/10 text-[#d4d4d4]' : 'bg-white text-gray-700 shadow-sm'
                              }`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 강의 섹션들 */}
                    {settings.courseSections.enabled && settings.courseSections.items.map((section) => (
                      <div
                        key={section.id}
                        onClick={() => setActiveTab('brand')}
                        className="mb-5 cursor-pointer relative group rounded-lg p-2 -m-2 hover:bg-brand-primary/5 transition-colors"
                      >
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-medium text-brand-primary bg-white px-1.5 py-0.5 rounded shadow">섹션 설정</span>
                        </div>
                        <h3 className={`text-xs font-semibold mb-2 ${previewTheme === 'dark' ? 'text-[#d4d4d4]' : 'text-gray-900'}`}>
                          {section.title}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className={`rounded-lg p-2 ${previewTheme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white'} shadow-sm`}>
                              <div className={`h-12 rounded mb-1.5 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                              <div className={`h-2 rounded w-3/4 mb-1 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                              <div className={`h-1.5 rounded w-1/2 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* 섹션이 없을 때 기본 컨텐츠 */}
                    {(!settings.courseSections.enabled || settings.courseSections.items.length === 0) && (
                      <div
                        onClick={() => setActiveTab('brand')}
                        className="cursor-pointer relative group rounded-lg p-2 -m-2 hover:bg-brand-primary/5 transition-colors"
                      >
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-medium text-brand-primary bg-white px-1.5 py-0.5 rounded shadow">섹션 추가</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className={`rounded-lg p-3 ${previewTheme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white'} shadow-sm`}>
                              <div className={`h-16 rounded mb-2 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                              <div className={`h-3 rounded w-3/4 mb-1.5 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                              <div className={`h-2 rounded w-1/2 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 강좌 상세 탭 미리보기 */}
                    <div className={`mt-4 rounded-lg overflow-hidden ${previewTheme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white'} shadow-sm`}>
                      <div className={`text-[10px] font-medium px-3 pt-2 ${previewTheme === 'dark' ? 'text-[#9e9e9e]' : 'text-gray-500'}`}>강좌 상세 탭 미리보기</div>
                      <div className={`flex gap-6 px-3 border-b ${previewTheme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                        <span className={`py-3 text-[10px] font-medium relative ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          강의 소개
                          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${previewTheme === 'dark' ? 'bg-white' : 'bg-gray-900'}`} />
                        </span>
                        <span className={`py-3 text-[10px] ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>커리큘럼</span>
                        {featureFormData.instructorTabEnabled && (
                          <span className={`py-3 text-[10px] ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>강사</span>
                        )}
                        <span className={`py-3 text-[10px] ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>수강평</span>
                        {featureFormData.communityEnabled && (
                          <span className={`py-3 text-[10px] ${previewTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>커뮤니티</span>
                        )}
                      </div>
                      <div className={`p-3 ${previewTheme === 'dark' ? 'text-[#9e9e9e]' : 'text-gray-600'}`}>
                        <div className={`h-2 rounded w-full mb-2 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                        <div className={`h-2 rounded w-3/4 mb-2 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                        <div className={`h-2 rounded w-1/2 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                      </div>
                    </div>
                  </div>

                  {/* 푸터 */}
                  {settings.footer.enabled && (
                    <div
                      onClick={() => setActiveTab('layout')}
                      className={`px-4 py-4 border-t cursor-pointer relative group ${previewTheme === 'dark' ? 'bg-[#151515] border-[#3f3f3f] text-[#9e9e9e]' : 'bg-gray-900 text-gray-400'}`}
                    >
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">푸터 설정</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold text-xs">{settings.company.name}</span>
                        <div className="flex gap-1.5">
                          {settings.footer.socialLinks.facebook.enabled && <div className="w-5 h-5 rounded-full bg-gray-700" />}
                          {settings.footer.socialLinks.twitter.enabled && <div className="w-5 h-5 rounded-full bg-gray-700" />}
                          {settings.footer.socialLinks.youtube.enabled && <div className="w-5 h-5 rounded-full bg-gray-700" />}
                          {settings.footer.socialLinks.instagram.enabled && <div className="w-5 h-5 rounded-full bg-gray-700" />}
                          {settings.footer.socialLinks.linkedin.enabled && <div className="w-5 h-5 rounded-full bg-gray-700" />}
                          {settings.footer.socialLinks.github.enabled && <div className="w-5 h-5 rounded-full bg-gray-700" />}
                        </div>
                      </div>
                      <p className="text-[10px]">{settings.footer.copyright}</p>
                    </div>
                  )}
                </>
              )}

              {/* TU 마이페이지 */}
              {previewPage === 'tu-mypage' && (
                <div className="flex min-h-[400px]">
                  {/* 사이드바 (마이페이지 스타일) */}
                  {settings.sidebarTU.enabled && (
                    <div
                      onClick={(e) => {
                        // 메뉴 토글 클릭이 아닐 때만 탭 변경
                        if (!(e.target as HTMLElement).closest('.menu-toggle')) {
                          setActiveTab('layout');
                        }
                      }}
                      className={`w-56 border-r p-4 flex-shrink-0 cursor-pointer relative group ${
                        previewTheme === 'dark' ? 'bg-white/5 border-white/10 backdrop-blur-sm' : 'bg-[#f9fafb] border-gray-200'
                      }`}
                    >
                      <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/10 transition-colors flex items-center justify-center z-10 pointer-events-none">
                        <span className="opacity-0 group-hover:opacity-100 text-xs font-medium text-brand-primary bg-white px-2 py-1 rounded shadow">사이드바 (사용자) 설정</span>
                      </div>
                      {/* 모드 전환 탭 */}
                      <div className={`flex gap-1 mb-4 p-1 rounded-lg ${
                        previewTheme === 'dark' ? 'bg-white/5' : 'bg-gray-200'
                      }`}>
                        <button className={`flex-1 px-3 py-2 text-xs rounded-md transition-all hover:scale-[1.02] ${
                          previewTheme === 'dark' ? 'text-[#9e9e9e] hover:text-[#d4d4d4] hover:bg-white/5' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
                        }`}>
                          강사
                        </button>
                        <button
                          className="flex-1 px-3 py-2 text-xs rounded-md transition-all text-white font-medium hover:scale-[1.02] shadow-sm"
                          style={{
                            background: `linear-gradient(to right, ${settings.colors.primary}, ${settings.colors.secondary})`
                          }}
                        >
                          학습자
                        </button>
                      </div>

                      {/* 메뉴 아이템 */}
                      {settings.sidebarTU.items.filter(item => item.visible).filter(item => !isCommunityRelated(item.label) || featureFormData.communityEnabled).slice(0, 5).map((item, idx) => {
                        const isExpanded = expandedMenuItems.has(item.id);
                        const hasChildren = item.children && item.children.length > 0;
                        const IconComponent = item.icon ? iconMap[item.icon] : null;
                        return (
                          <div key={item.id} className="mb-1">
                            <div
                              onClick={(e) => {
                                if (hasChildren) {
                                  e.stopPropagation();
                                  setExpandedMenuItems(prev => {
                                    const newSet = new Set(prev);
                                    if (newSet.has(item.id)) {
                                      newSet.delete(item.id);
                                    } else {
                                      newSet.add(item.id);
                                    }
                                    return newSet;
                                  });
                                }
                              }}
                              className={`menu-toggle px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center gap-2 transition-all relative z-20 ${
                                idx === 0
                                  ? previewTheme === 'dark'
                                    ? 'bg-white/10 text-[#e8e8e8]'
                                    : 'bg-gray-200 text-gray-900 font-medium'
                                  : previewTheme === 'dark'
                                    ? 'text-[#9e9e9e] hover:bg-white/5 hover:text-[#d4d4d4]'
                                    : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                              <span className="truncate">{item.label}</span>
                              {hasChildren && (
                                <ChevronDown
                                  className={`ml-auto w-3 h-3 flex-shrink-0 transition-transform ${
                                    isExpanded ? 'rotate-180' : ''
                                  } ${previewTheme === 'dark' ? 'text-[#9e9e9e]' : 'text-gray-400'}`}
                                />
                              )}
                            </div>
                            {hasChildren && isExpanded && (
                              <div className="ml-4 mt-1 space-y-1 relative z-20">
                                {item.children!.filter(child => child.visible).slice(0, 3).map((child) => {
                                  const ChildIconComponent = child.icon ? iconMap[child.icon] : null;
                                  return (
                                    <div
                                      key={child.id}
                                      className={`px-3 py-1.5 text-xs rounded-md cursor-pointer transition-all hover:translate-x-1 flex items-center gap-2 ${
                                        previewTheme === 'dark'
                                          ? 'text-[#9e9e9e] hover:bg-white/5 hover:text-[#d4d4d4]'
                                          : 'text-gray-500 hover:bg-gray-50'
                                      }`}
                                    >
                                      {ChildIconComponent && <ChildIconComponent className="w-3 h-3 flex-shrink-0" />}
                                      <span className="truncate">{child.label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 메인 컨텐츠 */}
                  <div className={`flex-1 p-4 ${previewTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <h2 className={`text-sm font-bold mb-3 ${previewTheme === 'dark' ? 'text-[#d4d4d4]' : 'text-gray-900'}`}>
                      마이페이지
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`rounded-lg p-3 ${previewTheme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white'} shadow-sm`}>
                          <div className={`h-3 rounded w-1/2 mb-2 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                          <div className={`h-8 rounded ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                        </div>
                      ))}
                    </div>
                    <h3 className={`text-xs font-semibold mt-4 mb-2 ${previewTheme === 'dark' ? 'text-[#d4d4d4]' : 'text-gray-900'}`}>
                      수강 중인 강의
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2].map((i) => (
                        <div key={i} className={`rounded-lg p-2 ${previewTheme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white'} shadow-sm`}>
                          <div className={`h-14 rounded mb-2 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                          <div className={`h-2 rounded w-3/4 mb-1 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                          <div className={`h-1.5 rounded-full ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}>
                            <div className="h-full rounded-full bg-brand-primary" style={{ width: `${30 + i * 20}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TO 관리자 페이지 */}
              {previewPage === 'to' && (
                <div className="flex min-h-[400px]">
                  {/* 사이드바 */}
                  {settings.sidebarCO.enabled && (
                    <div
                      onClick={(e) => {
                        // 메뉴 토글 클릭이 아닐 때만 탭 변경
                        if (!(e.target as HTMLElement).closest('.menu-toggle')) {
                          setActiveTab('layout');
                        }
                      }}
                      className={`w-64 border-r p-4 flex-shrink-0 cursor-pointer relative group ${
                        previewTheme === 'dark' ? 'bg-white/5 border-white/10 backdrop-blur-sm' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/10 transition-colors flex items-center justify-center z-10 pointer-events-none">
                        <span className="opacity-0 group-hover:opacity-100 text-xs font-medium text-brand-primary bg-white px-2 py-1 rounded shadow">사이드바 (운영자) 설정</span>
                      </div>
                      <div className={`text-xs font-semibold mb-3 px-2 ${previewTheme === 'dark' ? 'text-[#9e9e9e]' : 'text-gray-400'}`}>관리 메뉴</div>
                      {settings.sidebarCO.items.filter(item => item.visible).filter(item => !isCommunityRelated(item.label) || featureFormData.communityEnabled).slice(0, 6).map((item, idx) => {
                        const isExpanded = expandedMenuItems.has(item.id);
                        const hasChildren = item.children && item.children.length > 0;
                        const IconComponent = item.icon ? iconMap[item.icon] : null;
                        return (
                          <div key={item.id} className="mb-1">
                            <div
                              onClick={(e) => {
                                if (hasChildren) {
                                  e.stopPropagation();
                                  setExpandedMenuItems(prev => {
                                    const newSet = new Set(prev);
                                    if (newSet.has(item.id)) {
                                      newSet.delete(item.id);
                                    } else {
                                      newSet.add(item.id);
                                    }
                                    return newSet;
                                  });
                                }
                              }}
                              className={`menu-toggle px-3 py-2 text-sm rounded-lg cursor-pointer flex items-center gap-2 transition-all relative z-20 ${
                                idx === 0
                                  ? ''
                                  : previewTheme === 'dark' ? 'text-[#d4d4d4] hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                              style={idx === 0 ? {
                                backgroundColor: previewTheme === 'dark' ? `${settings.colors.primary}33` : `${settings.colors.primary}15`,
                                color: settings.colors.primary
                              } : {}}
                            >
                              {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                              <span className="font-medium flex-1">{item.label}</span>
                              {hasChildren && (
                                <ChevronDown
                                  className={`h-4 w-4 flex-shrink-0 transition-transform ${
                                    isExpanded ? 'rotate-180' : ''
                                  } ${previewTheme === 'dark' ? 'text-[#9e9e9e]' : 'text-gray-400'}`}
                                />
                              )}
                            </div>
                            {hasChildren && isExpanded && (
                              <div className="ml-4 mt-1 space-y-1 relative z-20">
                                {item.children!.filter(c => c.visible).slice(0, 3).map((child) => {
                                  const ChildIconComponent = child.icon ? iconMap[child.icon] : null;
                                  return (
                                    <div
                                      key={child.id}
                                      className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-all hover:translate-x-1 flex items-center gap-2 ${
                                        previewTheme === 'dark' ? 'text-[#9e9e9e] hover:text-[#d4d4d4] hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                      }`}
                                    >
                                      {ChildIconComponent && <ChildIconComponent className="w-3 h-3 flex-shrink-0" />}
                                      <span className="truncate">{child.label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 메인 컨텐츠 */}
                  <div className={`flex-1 p-4 ${previewTheme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
                    <h2 className={`text-sm font-bold mb-3 ${previewTheme === 'dark' ? 'text-[#d4d4d4]' : 'text-gray-900'}`}>
                      대시보드
                    </h2>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {['총 사용자', '총 강의', '이번 달 수강'].map((label, i) => (
                        <div key={i} className={`rounded-lg p-3 ${previewTheme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white'} shadow-sm`}>
                          <div className={`text-[10px] mb-1 ${previewTheme === 'dark' ? 'text-[#9e9e9e]' : 'text-gray-500'}`}>{label}</div>
                          <div className={`text-lg font-bold ${previewTheme === 'dark' ? 'text-[#d4d4d4]' : 'text-gray-900'}`}>
                            {(i + 1) * 123}
                          </div>
                        </div>
                      ))}
                    </div>
                    <h3 className={`text-xs font-semibold mb-2 ${previewTheme === 'dark' ? 'text-[#d4d4d4]' : 'text-gray-900'}`}>
                      최근 활동
                    </h3>
                    <div className={`rounded-lg ${previewTheme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white'} shadow-sm`}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`flex items-center gap-3 p-2 ${i < 3 ? `border-b ${previewTheme === 'dark' ? 'border-white/10' : 'border-gray-100'}` : ''}`}>
                          <div className={`w-6 h-6 rounded-full ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                          <div className="flex-1">
                            <div className={`h-2 rounded w-3/4 mb-1 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                            <div className={`h-1.5 rounded w-1/2 ${previewTheme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
