/**
 * Tenant Settings 타입 정의 (TA)
 */

// ============================================
// 레이아웃 설정 타입 (확장)
// ============================================

// 헤더 설정
export interface HeaderSettings {
  // 기본 설정
  enabled?: boolean;
  style: 'fixed' | 'sticky' | 'static';
  showLogo: boolean;
  showSearch: boolean;
  showCart?: boolean;
  showWishlist?: boolean;
  showNotifications: boolean;
  showThemeToggle?: boolean;
  // 확장 설정
  height: 'compact' | 'default' | 'large'; // 48px / 64px / 80px
  backgroundOpacity: 'solid' | 'translucent' | 'transparent'; // 스크롤 시 효과
  navPosition: 'left' | 'center' | 'right'; // 네비게이션 위치
  userMenuStyle: 'avatar' | 'name' | 'dropdown'; // 사용자 메뉴 스타일
  shadow: 'none' | 'sm' | 'md'; // 그림자
  mobileMenuStyle: 'hamburger' | 'drawer' | 'bottomSheet'; // 모바일 메뉴
  navLinks?: Array<{ label: string; url: string; visible: boolean }>;
}

// 사이드바 설정
export interface SidebarSettings {
  // 기본 설정
  style: 'collapsible' | 'fixed' | 'overlay' | 'hidden';
  defaultCollapsed: boolean;
  showIcons: boolean;
  // 확장 설정
  width: 'narrow' | 'default' | 'wide'; // 200px / 240px / 280px
  menuGroupStyle: 'accordion' | 'expanded' | 'divider'; // 메뉴 그룹 스타일
  activeIndicator: 'background' | 'leftBar' | 'underline' | 'iconColor'; // 활성 메뉴 표시
  itemSpacing: 'compact' | 'default' | 'relaxed'; // 메뉴 아이템 간격
  scrollbarStyle: 'always' | 'hover' | 'hidden'; // 스크롤바 표시
  bottomSection: 'userInfo' | 'logout' | 'settings' | 'none'; // 하단 영역
}

// 푸터 설정
export interface FooterSettings {
  // 기본 설정
  enabled: boolean;
  showLinks: boolean;
  showCopyright: boolean;
  // 확장 설정
  layout: 'single' | 'multi-column' | 'minimal'; // 레이아웃 유형
  showSocialLinks: boolean; // 소셜 링크 표시
  socialPlatforms: ('facebook' | 'twitter' | 'instagram' | 'youtube' | 'linkedin')[]; // 표시할 플랫폼
  showCompanyInfo: boolean; // 회사 정보 표시
  companyInfoFields: ('address' | 'phone' | 'email' | 'businessNumber')[]; // 표시할 정보
  showNewsletter: boolean; // 뉴스레터 구독 폼
}

// 콘텐츠 영역 설정
export interface ContentSettings {
  // 기본 설정
  maxWidth: 'full' | 'xl' | 'lg' | 'md';
  padding: 'none' | 'compact' | 'normal' | 'relaxed';
  // 확장 설정
  pageTransition: 'none' | 'fade' | 'slide'; // 페이지 전환 애니메이션
  cardStyle: 'flat' | 'shadow' | 'border' | 'glass'; // 카드 스타일
  cardRadius: 'none' | 'sm' | 'md' | 'lg'; // 카드 모서리
  tableStyle: 'striped' | 'plain' | 'bordered'; // 테이블 스타일
  buttonStyle: 'square' | 'rounded' | 'pill'; // 버튼 스타일
  loadingIndicator: 'spinner' | 'skeleton' | 'progressBar'; // 로딩 인디케이터
}

// 타이포그래피 설정
export interface TypographySettings {
  fontScale: 'small' | 'default' | 'large'; // 전체 폰트 크기 스케일
  lineHeight: 'tight' | 'normal' | 'relaxed'; // 줄 간격
  headingStyle: 'bold' | 'semibold' | 'normal'; // 제목 굵기
  headingCase: 'normal' | 'uppercase' | 'capitalize'; // 제목 대소문자
}

// 컬러 모드 설정
export interface ColorModeSettings {
  defaultMode: 'light' | 'dark' | 'system'; // 기본 모드
  allowUserToggle: boolean; // 사용자 전환 허용
  togglePosition: 'header' | 'sidebar' | 'footer' | 'hidden'; // 전환 버튼 위치
  transitionDuration: 'instant' | 'fast' | 'normal'; // 전환 속도
}

// 컴포넌트 스타일 설정
export interface ComponentStyleSettings {
  density: 'compact' | 'default' | 'comfortable'; // UI 밀도
  inputStyle: 'outline' | 'filled' | 'underline'; // 입력 필드 스타일
  badgeStyle: 'solid' | 'outline' | 'soft'; // 배지 스타일
  avatarStyle: 'circle' | 'rounded' | 'square'; // 아바타 스타일
  iconSize: 'small' | 'default' | 'large'; // 아이콘 크기
}

// 접근성 설정
export interface AccessibilitySettings {
  highContrastMode: boolean; // 고대비 모드
  fontSizeAdjustable: boolean; // 폰트 크기 조절 허용
  reduceMotion: boolean; // 모션 감소
  focusIndicator: 'default' | 'enhanced' | 'custom'; // 포커스 표시
  screenReaderOptimized: boolean; // 스크린 리더 최적화
}

// 반응형 설정
export interface ResponsiveSettings {
  mobileBreakpoint: number; // 모바일 브레이크포인트 (px)
  tabletBreakpoint: number; // 태블릿 브레이크포인트 (px)
  tabletLayout: 'mobile' | 'desktop' | 'adaptive'; // 태블릿 레이아웃
  mobileNavStyle: 'bottom' | 'top' | 'drawer'; // 모바일 네비게이션
}

export interface TenantSettingsDetail {
  id: number;
  tenantId: number;

  // Branding
  logoUrl: string | null;
  darkLogoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontFamily: string | null;
  headingFont: string | null;
  bodyFont: string | null;

  // Layout Settings
  headerSettings: HeaderSettings | null;
  sidebarSettings: SidebarSettings | null;
  footerSettings: FooterSettings | null;
  contentSettings: ContentSettings | null;

  // Extended Branding Settings
  companyName: string | null;
  bannerSettings: Record<string, unknown> | null;
  landingPageSettings: Record<string, unknown> | null;
  sidebarTUSettings: Record<string, unknown> | null;
  sidebarCOSettings: Record<string, unknown> | null;

  // Extended UI Settings
  typographySettings: TypographySettings | null;
  colorModeSettings: ColorModeSettings | null;
  componentStyleSettings: ComponentStyleSettings | null;
  accessibilitySettings: AccessibilitySettings | null;
  responsiveSettings: ResponsiveSettings | null;

  // General Settings
  defaultLanguage: string;
  timezone: string;

  // User Management
  allowSelfRegistration: boolean;
  requireEmailVerification: boolean;
  requireApproval: boolean;
  allowedEmailDomains: string | null;
  defaultUserRole?: string; // deprecated

  // Limits
  maxUsersCount: number;
  maxStorageGB: number;
  maxCourses: number;
  maxUsers?: number | null; // deprecated alias
  maxStorage?: number | null; // deprecated alias

  // Features
  allowCustomDomain: boolean;
  allowCustomBranding: boolean;
  ssoEnabled: boolean;
  apiAccessEnabled: boolean;
  enableDiscussions?: boolean; // deprecated
  enableCertificates?: boolean; // deprecated
  enableAnalytics?: boolean; // deprecated

  createdAt: string;
  updatedAt: string;
}

export interface UpdateTenantSettingsRequest {
  // Branding
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;

  // User Management
  allowSelfRegistration?: boolean;
  requireEmailVerification?: boolean;
  defaultUserRole?: string;

  // Limits
  maxUsers?: number | null;
  maxStorage?: number | null;
  maxCourses?: number | null;

  // Features
  enableDiscussions?: boolean;
  enableCertificates?: boolean;
  enableAnalytics?: boolean;
}

export interface UpdateBrandingRequest {
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export interface UpdateUserManagementRequest {
  allowSelfRegistration?: boolean;
  requireEmailVerification?: boolean;
  defaultUserRole?: string;
}

// 새로운 디자인 설정 요청 타입
export interface UpdateDesignSettingsRequest {
  logoUrl?: string | null;
  darkLogoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

// 새로운 레이아웃 설정 요청 타입
export interface UpdateLayoutSettingsRequest {
  headerSettings?: HeaderSettings;
  sidebarSettings?: SidebarSettings;
  footerSettings?: FooterSettings;
  contentSettings?: ContentSettings;
  typographySettings?: TypographySettings;
  colorModeSettings?: ColorModeSettings;
  componentStyleSettings?: ComponentStyleSettings;
  accessibilitySettings?: AccessibilitySettings;
  responsiveSettings?: ResponsiveSettings;
}

// 네비게이션 항목 타입
export interface NavigationItem {
  id: number;
  label: string;
  icon: string;
  path: string;
  enabled: boolean;
  displayOrder: number;
  target: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationItemRequest {
  label: string;
  icon: string;
  path: string;
  enabled?: boolean;
  displayOrder?: number;
  target?: string;
}

// ============================================
// 확장 브랜딩 설정 타입
// ============================================

// 배너 아이템
export interface BannerItem {
  id: string;
  type: 'image' | 'code';
  imageUrl: string | null;
  code: string;
  title: string;
  order: number;
}

// 배너 설정
export interface BannerSettings {
  enabled: boolean;
  items: BannerItem[];
}

// 랜딩 페이지 카테고리 설정
export interface LandingCategorySettings {
  enabled: boolean;
  items: string[];
  sectionTitle: string;
}

// 강좌 섹션 아이템
export interface CourseSectionItem {
  id: string;
  title: string;
}

// 강좌 섹션 설정
export interface CourseSectionsSettings {
  enabled: boolean;
  items: CourseSectionItem[];
}

// 랜딩 페이지 설정
export interface LandingPageSettings {
  landingCategory: LandingCategorySettings;
  courseSections: CourseSectionsSettings;
}

// 사이드바 메뉴 아이템
export interface SidebarMenuItem {
  id: string;
  label: string;
  url: string;
  icon: string;
  visible: boolean;
  children?: {
    id: string;
    label: string;
    url: string;
    icon?: string;
    visible: boolean;
  }[];
}

// TU/CO 사이드바 설정
export interface SidebarRoleSettings {
  enabled: boolean;
  items: SidebarMenuItem[];
}

// 확장 브랜딩 설정 요청 타입
export interface UpdateExtendedBrandingRequest {
  companyName?: string;
  bannerSettings?: BannerSettings;
  landingPageSettings?: LandingPageSettings;
  sidebarTUSettings?: SidebarRoleSettings;
  sidebarCOSettings?: SidebarRoleSettings;
}
