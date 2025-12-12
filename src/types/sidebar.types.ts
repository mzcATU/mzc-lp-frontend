import type { LucideIcon } from 'lucide-react';

/**
 * 사이드바 메뉴 아이템 타입
 */
export interface MenuItem {
  id: string;
  label: { ko: string; en: string };
  icon: LucideIcon;
  path?: string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  label: { ko: string; en: string };
  icon: LucideIcon;
  path?: string;
  instructorOnly?: boolean;
}

/**
 * 사이드바 색상 토큰 타입
 */
export interface SidebarColors {
  bg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  hover: string;
  activeBg: string;
  activeText: string;
  tooltipBg: string;
}

/**
 * 사이드바 Props
 */
export interface AdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  language?: 'ko' | 'en';
  onLanguageChange?: (language: 'ko' | 'en') => void;
  menuData: MenuItem[];
  roleLabel: { ko: string; en: string };
}

/**
 * 사이드바 타입 (역할별)
 */
export type SidebarType = 'user' | 'operator' | 'tenant-admin' | 'super-admin';
