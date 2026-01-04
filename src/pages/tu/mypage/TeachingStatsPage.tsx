import { BarChart3, Users, BookOpen, GraduationCap, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation } from '@/store/common/languageStore';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, EmptyState } from '@/components/common';
import { useMyOwnerStats } from '@/hooks/tu';
import { designTokens } from '@/styles/admin-design-tokens';

export function TeachingStatsPage() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const { data: stats, isLoading, error } = useMyOwnerStats();

  const cardClass = isDark
    ? 'bg-white/5 border-white/10'
    : 'bg-white border-gray-200 shadow-sm';

  const statCardClass = isDark
    ? 'bg-white/5 border border-white/10'
    : 'bg-white border border-gray-200 shadow-sm';

  // 에러 상태
  if (error) {
    return (
      <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.teaching.stats}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {t.teaching.statsDesc}
            </p>
          </div>
          <Card className={cardClass}>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t.common.error}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.teaching.stats}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t.teaching.statsDesc}
          </p>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {isLoading ? (
            <>
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </>
          ) : (
            <>
              <div className={`p-4 rounded-xl ${statCardClass}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={isDark ? 'text-violet-400' : 'text-violet-600'}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.teaching.totalPrograms}
                  </span>
                </div>
                <p className={`text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats?.overview.totalPrograms ?? 0}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${statCardClass}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={isDark ? 'text-sky-400' : 'text-sky-600'}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.teaching.totalCourseTimes}
                  </span>
                </div>
                <p className={`text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats?.overview.totalCourseTimes ?? 0}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${statCardClass}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>
                    <Users className="w-5 h-5" />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.teaching.totalStudents}
                  </span>
                </div>
                <p className={`text-2xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats?.overview.totalStudents ?? 0}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Enrollment Stats Card */}
        <Card className={`${cardClass} mb-6`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                {t.teaching.enrollmentStats}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-8" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Total Count Header */}
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold tabular-nums ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats?.enrollmentStats.totalEnrollments ?? 0}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t.teaching.totalEnrollments}
                  </span>
                </div>

                {/* Horizontal Stacked Bar */}
                {(() => {
                  // Pastel Neon 톤 색상 팔레트 (Dark Mode 최적화)
                  const colors = {
                    completed: isDark ? '#34d399' : '#059669',   // Emerald-400 / Emerald-600
                    inProgress: isDark ? '#a78bfa' : '#7C3AED',  // Violet-400 / Violet-600
                    dropped: isDark ? '#fb7185' : '#E11D48',     // Rose-400 / Rose-600
                    failed: isDark ? '#475569' : '#9CA3AF',      // Slate-600 / Gray-400
                  };

                  const total = stats?.enrollmentStats.totalEnrollments ?? 0;
                  const items = [
                    { key: 'completed', label: t.teaching.completed, value: stats?.enrollmentStats.completed ?? 0, color: colors.completed },
                    { key: 'inProgress', label: t.teaching.inProgress, value: stats?.enrollmentStats.inProgress ?? 0, color: colors.inProgress },
                    { key: 'dropped', label: t.teaching.dropped, value: stats?.enrollmentStats.dropped ?? 0, color: colors.dropped },
                    { key: 'failed', label: t.teaching.failed, value: stats?.enrollmentStats.failed ?? 0, color: colors.failed },
                  ];

                  // 값이 있는 항목만 필터링
                  const activeItems = items.filter((item) => item.value > 0);

                  // 그라데이션 색상 (다크모드용)
                  const gradientColors = {
                    completed: isDark
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                      : 'bg-emerald-600',
                    inProgress: isDark
                      ? 'bg-gradient-to-r from-violet-400 to-purple-400'
                      : 'bg-violet-600',
                    dropped: isDark
                      ? 'bg-gradient-to-r from-rose-400 to-pink-400'
                      : 'bg-rose-600',
                    failed: isDark
                      ? 'bg-gradient-to-r from-slate-500 to-slate-600'
                      : 'bg-gray-400',
                  };

                  return (
                    <div className="space-y-4">
                      {/* Stacked Bar with Gradients - Entrance Animation */}
                      <div className="flex h-3 w-full gap-1 overflow-hidden">
                        {activeItems.length > 0 ? (
                          activeItems.map((item, index) => {
                            const percentage = total > 0 ? (item.value / total) * 100 : 0;
                            const gradientClass = gradientColors[item.key as keyof typeof gradientColors];

                            return (
                              <div
                                key={item.key}
                                className={`h-full rounded-full ${gradientClass} animate-[grow-width_0.8s_ease-out_forwards]`}
                                style={{
                                  width: `${percentage}%`,
                                  animationDelay: `${index * 0.1}s`,
                                  opacity: 0,
                                  transform: 'scaleX(0)',
                                  transformOrigin: 'left',
                                }}
                              />
                            );
                          })
                        ) : (
                          <div
                            className={`h-full w-full rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}
                          />
                        )}
                      </div>
                      {/* Keyframes for entrance animation */}
                      <style>{`
                        @keyframes grow-width {
                          0% {
                            opacity: 0;
                            transform: scaleX(0);
                          }
                          100% {
                            opacity: 1;
                            transform: scaleX(1);
                          }
                        }
                      `}</style>

                      {/* Legend */}
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {items.map((item) => {
                          const dotGradientClass = gradientColors[item.key as keyof typeof gradientColors];
                          return (
                            <div key={item.key} className="flex items-center gap-2 leading-none">
                              <div
                                className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${isDark ? dotGradientClass : ''}`}
                                style={!isDark ? { backgroundColor: item.color } : undefined}
                              />
                              <span className={`text-sm leading-none ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {item.label}
                              </span>
                              <span className={`text-sm font-semibold tabular-nums leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {item.value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 평균 수료율 */}
                <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium leading-none ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {t.teaching.averageCompletionRate}
                    </span>
                    <span
                      className="text-xl font-bold tabular-nums leading-none"
                      style={{ color: isDark ? '#34d399' : '#059669' }}
                    >
                      {stats?.enrollmentStats.averageCompletionRate ?? 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Program Stats Card */}
        <Card className={cardClass}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <BarChart3 className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                {t.teaching.programStats}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : !stats?.programStats || stats.programStats.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title={t.teaching.noProgramStats}
                description={t.teaching.noProgramStatsDesc}
                className={`border-2 border-dashed rounded-lg ${isDark ? 'border-white/10' : 'border-gray-200'}`}
              />
            ) : (
              <div className="space-y-3">
                {stats.programStats.map((program, index) => (
                  <div
                    key={program.programId}
                    onClick={() => navigate(`/tu/teaching/programs/${program.programId}`)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {program.programName}
                      </h4>
                      <ChevronRight className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {t.teaching.courseTimes}: {program.courseTimeCount}
                      </span>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {t.teaching.students}: {program.totalStudents}
                      </span>
                    </div>
                    {/* 수료율 Progress Bar with Entrance Animation */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                          {t.teaching.completionRate}
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: isDark ? '#34d399' : designTokens.status.success_text }}
                        >
                          {program.completionRate}%
                        </span>
                      </div>
                      <div
                        className={`relative h-2 w-full overflow-hidden rounded-full ${
                          isDark ? 'bg-white/10' : 'bg-gray-200'
                        }`}
                      >
                        <div
                          className={`h-full rounded-full animate-[grow-width_0.8s_ease-out_forwards] ${
                            isDark
                              ? 'bg-gradient-to-r from-violet-400 to-purple-400'
                              : ''
                          }`}
                          style={{
                            width: `${program.completionRate}%`,
                            ...(!isDark && { backgroundColor: designTokens.button.brand_default }),
                            boxShadow: isDark
                              ? '0 0 8px rgba(167, 139, 250, 0.4)'
                              : '0 1px 3px rgba(0, 0, 0, 0.15)',
                            animationDelay: `${index * 0.15}s`,
                            opacity: 0,
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
