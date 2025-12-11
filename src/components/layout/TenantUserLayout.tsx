import { useState, type ReactNode } from 'react';
import { TenantUserSidebar } from './TenantUserSidebar';
import { designTokens } from '@/styles/design-tokens';

interface TenantUserLayoutProps {
  children: ReactNode;
  onMenuItemClick?: (itemId: string) => void;
}

export function TenantUserLayout({
  children,
  onMenuItemClick,
}: TenantUserLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <TenantUserSidebar
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
