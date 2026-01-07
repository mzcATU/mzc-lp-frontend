import { Bell, Construction } from 'lucide-react';
import { useTranslation } from '@/store/common/languageStore';
import { designTokens } from '@/styles/admin-design-tokens';
import { Card, CardHeader, CardTitle, CardContent, EmptyState } from '@/components/common';

export function SettingsNotificationsPage() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: designTokens.bg.app_default,
        minHeight: '100%',
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <h1
          style={{
            color: designTokens.text.primary,
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          {t.mypage.notifications}
        </h1>
        <p style={{ color: designTokens.text.secondary, marginBottom: '32px' }}>
          {t.settings.notificationsDesc}
        </p>

        {/* Notifications Card */}
        <Card>
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
              <CardTitle className="text-lg font-medium">
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
              className="border-2 border-dashed rounded-lg"
              style={{ borderColor: designTokens.bg.border }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
