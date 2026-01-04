import { BarChart3, Users, BookOpen, GraduationCap, TrendingUp, AlertCircle } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation } from '@/store/common/languageStore';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, EmptyState } from '@/components/common';
import { Progress } from '@/components/common/Progress';
import { useMyOwnerStats } from '@/hooks/tu';

export function TeachingStatsPage() {
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
                  <div className={isDark ? 'text-purple-400' : 'text-purple-600'}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.teaching.totalPrograms}
                  </span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats?.overview.totalPrograms ?? 0}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${statCardClass}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={isDark ? 'text-blue-400' : 'text-blue-600'}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.teaching.totalCourseTimes}
                  </span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats?.overview.totalCourseTimes ?? 0}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${statCardClass}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={isDark ? 'text-green-400' : 'text-green-600'}>
                    <Users className="w-5 h-5" />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.teaching.totalStudents}
                  </span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.teaching.totalEnrollments}
                  </span>
                  <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stats?.enrollmentStats.totalEnrollments ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.teaching.completed}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={
                        stats?.enrollmentStats.totalEnrollments
                          ? ((stats?.enrollmentStats.completed ?? 0) / stats.enrollmentStats.totalEnrollments) * 100
                          : 0
                      }
                      className="w-24"
                    />
                    <span className={`font-medium w-8 text-right ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stats?.enrollmentStats.completed ?? 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.teaching.inProgress}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={
                        stats?.enrollmentStats.totalEnrollments
                          ? ((stats?.enrollmentStats.inProgress ?? 0) / stats.enrollmentStats.totalEnrollments) * 100
                          : 0
                      }
                      className="w-24"
                    />
                    <span className={`font-medium w-8 text-right ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stats?.enrollmentStats.inProgress ?? 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t.teaching.dropped}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={
                        stats?.enrollmentStats.totalEnrollments
                          ? ((stats?.enrollmentStats.dropped ?? 0) / stats.enrollmentStats.totalEnrollments) * 100
                          : 0
                      }
                      className="w-24"
                    />
                    <span className={`font-medium w-8 text-right ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stats?.enrollmentStats.dropped ?? 0}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t.teaching.averageCompletionRate}
                    </span>
                    <span className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
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
                {stats.programStats.map((program) => (
                  <div
                    key={program.programId}
                    className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {program.programName}
                      </h4>
                      <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        {program.completionRate}%
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {t.teaching.courseTimes}: {program.courseTimeCount}
                      </span>
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {t.teaching.students}: {program.totalStudents}
                      </span>
                    </div>
                    <Progress value={program.completionRate} className="mt-2" />
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
