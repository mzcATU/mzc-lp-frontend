import { useState, type ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import type { MenuItem } from '@/types/sidebar.types';
import { designTokens } from '@/styles/design-tokens';

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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <AdminSidebar
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        onMenuItemClick={onMenuItemClick}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        language={language}
        onLanguageChange={setLanguage}
        menuData={menuData}
        roleLabel={roleLabel}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
