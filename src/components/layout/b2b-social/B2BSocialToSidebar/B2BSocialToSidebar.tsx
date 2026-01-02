import { BaseSidebar } from '../../common/BaseSidebar';
import { b2bSocialToMenuData, roleLabels } from '@/config/sidebar-menus';

interface B2BSocialToSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onMenuItemClick?: (itemId: string) => void;
  isDarkMode?: boolean;
  language?: 'ko' | 'en';
}

export function B2BSocialToSidebar(props: B2BSocialToSidebarProps) {
  return (
    <BaseSidebar
      {...props}
      menuData={b2bSocialToMenuData}
      roleLabel={roleLabels.b2bSocialTo}
    />
  );
}
