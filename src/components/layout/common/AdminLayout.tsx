import { useState, type ReactNode } from 'react';
import { BaseSidebar } from './BaseSidebar';
import type { MenuItem } from '@/types';
import { designTokens } from '@/styles/admin-design-tokens';

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
      <BaseSidebar
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
