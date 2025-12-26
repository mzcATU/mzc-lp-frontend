import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantAdminSidebar } from './TenantAdminSidebar';
import { designTokens } from '@/styles/admin-design-tokens';
import { tenantAdminMenuData } from '@/config/sidebar-menus';
import { useUIStore } from '@/store/common/uiStore';

interface TenantAdminLayoutProps {
  children: ReactNode;
}

export function TenantAdminLayout({ children }: TenantAdminLayoutProps) {
  const navigate = useNavigate();
  const { isSidebarExpanded, isDarkMode, language, toggleSidebar } = useUIStore();

  const handleMenuItemClick = (itemId: string) => {
    // Check top-level menu items
    const menuItem = tenantAdminMenuData.find((item) => item.id === itemId);
    if (menuItem?.path) {
      navigate(menuItem.path);
      return;
    }

    // Check subItems
    for (const item of tenantAdminMenuData) {
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
      <TenantAdminSidebar
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
