import { useState, type ReactNode } from 'react';
import { TenantAdminSidebar } from './TenantAdminSidebar';
import { designTokens } from '@/styles/design-tokens';

interface TenantAdminLayoutProps {
  children: ReactNode;
  onMenuItemClick?: (itemId: string) => void;
}

export function TenantAdminLayout({
  children,
  onMenuItemClick,
}: TenantAdminLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <TenantAdminSidebar
        isExpanded={isSidebarExpanded}
        onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
        onMenuItemClick={onMenuItemClick}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
