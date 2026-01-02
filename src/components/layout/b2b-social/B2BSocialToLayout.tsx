import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { B2BSocialToSidebar } from './B2BSocialToSidebar';
import { designTokens } from '@/styles/admin-design-tokens';
import { b2bSocialToMenuData } from '@/config/sidebar-menus';
import { useUIStore } from '@/store/common/uiStore';

interface B2BSocialToLayoutProps {
  children: ReactNode;
}

export function B2BSocialToLayout({ children }: B2BSocialToLayoutProps) {
  const navigate = useNavigate();
  const { isSidebarExpanded, isDarkMode, language, toggleSidebar } = useUIStore();

  const handleMenuItemClick = (itemId: string) => {
    // Check top-level menu items
    const menuItem = b2bSocialToMenuData.find((item) => item.id === itemId);
    if (menuItem?.path) {
      navigate(menuItem.path);
      return;
    }

    // Check subItems
    for (const item of b2bSocialToMenuData) {
      const subItem = item.subItems?.find((sub) => sub.id === itemId);
      if (subItem?.path) {
        navigate(subItem.path);
        return;
      }
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <B2BSocialToSidebar
        isExpanded={isSidebarExpanded}
        onToggle={toggleSidebar}
        onMenuItemClick={handleMenuItemClick}
        isDarkMode={isDarkMode}
        language={language}
      />

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
