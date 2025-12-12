import { AdminSidebar } from '../AdminSidebar';
import { superAdminMenuData, roleLabels } from '@/config/sidebar-menus';

interface SuperAdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  language?: 'ko' | 'en';
  onLanguageChange?: (language: 'ko' | 'en') => void;
}

export function SuperAdminSidebar(props: SuperAdminSidebarProps) {
  return (
    <AdminSidebar
      {...props}
      menuData={superAdminMenuData}
      roleLabel={roleLabels.superAdmin}
    />
  );
}
