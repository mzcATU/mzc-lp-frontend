import { type ReactNode } from 'react';
import { BaseSidebar } from './BaseSidebar';
import type { MenuItem } from '@/types';
import { designTokens } from '@/styles/admin-design-tokens';
import { useUIStore, useIsDarkMode } from '@/store/common/uiStore';

interface AdminLayoutProps {
  children: ReactNode;
  menuData: MenuItem[];
  roleLabel: { ko: string; en: string };
  onMenuItemClick?: (itemId: string) => void;
}

export function AdminLayout({
  children,
  menuData,
  roleLabel,
  onMenuItemClick,
}: AdminLayoutProps) {
  const { isSidebarExpanded, language, toggleSidebar } = useUIStore();
  const isDarkMode = useIsDarkMode();

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <BaseSidebar
        isExpanded={isSidebarExpanded}
        onToggle={toggleSidebar}
        onMenuItemClick={onMenuItemClick}
        isDarkMode={isDarkMode}
        language={language}
        menuData={menuData}
        roleLabel={roleLabel}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
