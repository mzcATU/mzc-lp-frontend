import { BaseSidebar } from '../../common/BaseSidebar';
import { tenantAdminMenuData, roleLabels } from '@/config/sidebar-menus';

interface TenantAdminSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
}

export function TenantAdminSidebar(props: TenantAdminSidebarProps) {
  return (
    <BaseSidebar
      {...props}
      menuData={tenantAdminMenuData}
      roleLabel={roleLabels.tenantAdmin}
      roleType="ta"
    />
  );
}
