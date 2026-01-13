import { useLocation } from 'react-router-dom';
import { Bell, Construction } from 'lucide-react';
import { useTranslation } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';
import { Card, CardHeader, CardTitle, CardContent, EmptyState } from '@/components/common';

export function SettingsNotificationsPage() {
  const location = useLocation();
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  // TU 경로에서만 다크모드 적용
  const isTuPage = location.pathname.includes('/tu/');
  const isDark = isTuPage && theme === 'dark';

  const cardClass = isDark
    ? 'bg-white/5 border-white/10'
    : 'bg-white border-gray-200 shadow-sm';

  return (
    <div className={`min-h-full p-6 sm:p-10 overflow-y-auto ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.mypage.notifications}
        </h1>
        <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t.settings.notificationsDesc}
        </p>

        {/* Notifications Card */}
        <Card className={cardClass}>
          <CardHeader className={`border-b px-6 py-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <CardTitle className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t.settings.notificationSettings}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-6">
            {/* Under Development Placeholder */}
            <EmptyState
              icon={Construction}
              title={t.common.comingSoon}
              description={t.settings.notificationsComingSoon}
              className={`border-2 border-dashed rounded-lg ${isDark ? 'border-white/10' : 'border-gray-200'}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
