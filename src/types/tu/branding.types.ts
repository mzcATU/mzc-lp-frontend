/**
 * 공개 브랜딩 정보 타입
 */
export interface PublicBrandingResponse {
  tenantName: string;
  logoUrl: string | null;
  darkLogoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string | null;
  headingFont: string | null;
  bodyFont: string | null;
}

/**
 * 네비게이션 아이템 타입
 */
export interface NavigationItemResponse {
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

/**
 * 헤더 설정 타입
 */
export interface HeaderSettings {
  style?: 'fixed' | 'sticky' | 'static';
  height?: 'compact' | 'default' | 'large';
  showLogo?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  backgroundOpacity?: number;
  navigationPosition?: 'left' | 'center' | 'right';
  userMenuStyle?: 'dropdown' | 'drawer';
  showShadow?: boolean;
  mobileMenuStyle?: 'drawer' | 'fullscreen';
}

/**
 * 푸터 설정 타입
 */
export interface FooterSettings {
  enabled?: boolean;
  showLinks?: boolean;
  showCopyright?: boolean;
  showSocialLinks?: boolean;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
  companyInfoFields?: string[];
  showNewsletter?: boolean;
}

/**
 * 콘텐츠 설정 타입
 */
export interface ContentSettings {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'compact' | 'normal' | 'relaxed';
  pageTransition?: 'none' | 'fade' | 'slide';
  cardStyle?: 'flat' | 'bordered' | 'elevated';
  tableStyle?: 'simple' | 'striped' | 'bordered';
  buttonStyle?: 'square' | 'rounded' | 'pill';
}

/**
 * 공개 레이아웃 정보 타입 (TU용)
 */
export interface PublicLayoutResponse {
  headerSettings: HeaderSettings | null;
  footerSettings: FooterSettings | null;
  contentSettings: ContentSettings | null;
  navigationItems: NavigationItemResponse[];
  // 확장 브랜딩 설정
  companyName: string | null;
  bannerSettings: BannerSettings | null;
  landingPageSettings: LandingPageSettings | null;
  sidebarTUSettings: SidebarRoleSettings | null;
  sidebarTOSettings: SidebarRoleSettings | null;
}

/**
 * 배너 아이템 타입
 */
export interface BannerItem {
  id: string;
  type: 'image' | 'code';
  imageUrl: string | null;
  code: string;
  title: string;
  order: number;
}

/**
 * 배너 설정 타입
 */
export interface BannerSettings {
  enabled: boolean;
  items: BannerItem[];
}

/**
 * 랜딩 카테고리 설정 타입
 */
export interface LandingCategorySettings {
  enabled: boolean;
  items: string[];
  sectionTitle: string;
}

/**
 * 강좌 섹션 아이템 타입
 */
export interface CourseSectionItem {
  id: string;
  title: string;
}

/**
 * 강좌 섹션 설정 타입
 */
export interface CourseSectionsSettings {
  enabled: boolean;
  items: CourseSectionItem[];
}

/**
 * 랜딩 페이지 설정 타입
 */
export interface LandingPageSettings {
  landingCategory: LandingCategorySettings;
  courseSections: CourseSectionsSettings;
}

/**
 * 사이드바 메뉴 아이템 타입
 */
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

/**
 * TU/TO 사이드바 설정 타입
 */
export interface SidebarRoleSettings {
  enabled: boolean;
  items: SidebarMenuItem[];
}
