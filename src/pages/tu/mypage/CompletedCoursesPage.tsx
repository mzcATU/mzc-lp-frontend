import { CheckCircle, Construction } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation } from '@/store/common/languageStore';
import { Card, CardHeader, CardTitle, CardContent, EmptyState } from '@/components/common';

export function CompletedCoursesPage() {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const cardClass = isDark
    ? 'bg-white/5 border-white/10'
    : 'bg-white border-gray-200 shadow-sm';

  return (
    <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.mypage.completed}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t.mypage.completedDesc}
          </p>
        </div>

        {/* Completed Courses Card */}
        <Card className={cardClass}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                {t.mypage.completedCourses}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {/* Under Development Placeholder */}
            <EmptyState
              icon={Construction}
              title={t.common.comingSoon}
              description={t.mypage.completedComingSoon}
              className={`border-2 border-dashed rounded-lg ${isDark ? 'border-white/10' : 'border-gray-200'}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
