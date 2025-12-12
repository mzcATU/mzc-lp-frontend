import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantUserSidebar } from './TenantUserSidebar';
import { designTokens } from '@/styles/design-tokens';

// 메뉴 ID와 라우트 매핑
const menuRoutes: Record<string, string> = {
  home: '/tu',
  'my-courses': '/tu/teaching/courses',
  'content-creation': '/tu/teaching/content',
  'grading-evaluation': '/tu/teaching/grading',
  'full-library': '/tu/catalog',
  'courses-by-role': '/tu/catalog/role',
  'courses-by-skill': '/tu/catalog/skill',
  'my-competency': '/tu/certifications/competency',
  'my-certifications': '/tu/certifications',
  'account-security': '/tu/settings/security',
  'language-timezone': '/tu/settings/language',
  'notification-settings': '/tu/settings/notifications',
};

interface TenantUserLayoutProps {
  children: ReactNode;
}

export function TenantUserLayout({ children }: TenantUserLayoutProps) {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  const handleMenuItemClick = (itemId: string) => {
    const route = menuRoutes[itemId];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <TenantUserSidebar
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
