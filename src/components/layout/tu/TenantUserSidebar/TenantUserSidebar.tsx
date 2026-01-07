import { BaseSidebar } from '../../common/BaseSidebar';
import { tenantUserMenuData, roleLabels } from '@/config/sidebar-menus';

interface TenantUserSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
}

export function TenantUserSidebar(props: TenantUserSidebarProps) {
  return (
    <BaseSidebar
      {...props}
      menuData={tenantUserMenuData}
      roleLabel={roleLabels.tenantUser}
      showModeSwitcher={true}
      currentMode="instructor"
      roleType="tu"
    />
  );
}
