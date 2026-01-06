import { BaseSidebar } from '../../common/BaseSidebar';
import { superAdminMenuData, roleLabels } from '@/config/sidebar-menus';

interface SuperAdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
}

export function SuperAdminSidebar(props: SuperAdminSidebarProps) {
  return (
    <BaseSidebar
      {...props}
      menuData={superAdminMenuData}
      roleLabel={roleLabels.superAdmin}
      roleType="sa"
    />
  );
}
