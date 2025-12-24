import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantOperatorSidebar } from './TenantOperatorSidebar';
import { designTokens } from '@/styles/design-tokens';
import { tenantOperatorMenuData } from '@/config/sidebar-menus';

interface TenantOperatorLayoutProps {
  children: ReactNode;
}

export function TenantOperatorLayout({
  children,
}: TenantOperatorLayoutProps) {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  const handleMenuItemClick = (itemId: string) => {
    // Check top-level menu items
    const menuItem = tenantOperatorMenuData.find((item) => item.id === itemId);
    if (menuItem?.path) {
      navigate(menuItem.path);
      return;
    }

    // Check subItems
    for (const item of tenantOperatorMenuData) {
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
      <TenantOperatorSidebar
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        onMenuItemClick={handleMenuItemClick}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
