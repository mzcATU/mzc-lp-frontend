import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { designTokens } from '@/styles/admin-design-tokens';
import { superAdminMenuData } from '@/config/sidebar-menus';
import { useUIStore, useIsDarkMode } from '@/store/common/uiStore';

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const navigate = useNavigate();
  const { isSidebarExpanded, language, toggleSidebar } = useUIStore();
  const isDarkMode = useIsDarkMode();

  const handleMenuItemClick = (itemId: string) => {
    // Check top-level menu items
    const menuItem = superAdminMenuData.find((item) => item.id === itemId);
    if (menuItem?.path) {
      navigate(menuItem.path);
      return;
    }

    // Check subItems
    for (const item of superAdminMenuData) {
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
      <SuperAdminSidebar
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
