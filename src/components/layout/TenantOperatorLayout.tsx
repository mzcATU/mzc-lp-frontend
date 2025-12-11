import { useState, type ReactNode } from 'react';
import { TenantOperatorSidebar } from './TenantOperatorSidebar';
import { designTokens } from '@/styles/design-tokens';

interface TenantOperatorLayoutProps {
  children: ReactNode;
  onMenuItemClick?: (itemId: string) => void;
}

export function TenantOperatorLayout({
  children,
  onMenuItemClick,
}: TenantOperatorLayoutProps) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <TenantOperatorSidebar
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
