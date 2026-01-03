import { Users, BookOpen, TrendingUp, GraduationCap, AlertCircle, UserPlus, FileText, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  AdminPageHeader,
  AdminStatsCard,
  AdminStatsGrid,
} from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Progress } from '@/components/common/Progress';
import { Skeleton } from '@/components/common/Skeleton';
import { useTaKpiDashboard } from '@/hooks/ta';

export function DashboardPage() {
  const { data, isLoading, error } = useTaKpiDashboard();

  if (error) {
    return (
      <div className="p-6">
        <AdminPageHeader
          title="대시보드"
          description="테넌트 현황을 한눈에 확인합니다"
        />
        <Card className="mt-6">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-lg font-medium text-text-primary">데이터를 불러올 수 없습니다</p>
              <p className="text-sm text-text-secondary mt-1">잠시 후 다시 시도해주세요</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userStats = data?.userStats ?? { total: 0, active: 0, inactive: 0, suspended: 0, withdrawn: 0, newThisMonth: 0 };
  const programStats = data?.programStats ?? { total: 0, draft: 0, pending: 0, approved: 0, rejected: 0, closed: 0 };
  const enrollmentStats = data?.enrollmentStats ?? { totalEnrollments: 0, byStatus: { enrolled: 0, completed: 0, dropped: 0, failed: 0 }, completionRate: 0 };
  const monthlyTrend = data?.monthlyTrend ?? [];

  return (
    <div className="p-6">
      <AdminPageHeader
        title="대시보드"
        description="테넌트 현황을 한눈에 확인합니다"
      />

      {/* Stats Grid */}
      <AdminStatsGrid columns={4} className="mb-6">
        {isLoading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <AdminStatsCard
              title="전체 사용자"
              value={userStats.total.toLocaleString()}
              subtitle={`활성 ${userStats.active.toLocaleString()}명`}
              icon={Users}
              variant="primary"
            />
            <AdminStatsCard
              title="이번 달 신규"
              value={userStats.newThisMonth.toLocaleString()}
              subtitle="신규 가입자"
              icon={UserPlus}
              variant="success"
            />
            <AdminStatsCard
              title="전체 프로그램"
              value={programStats.total.toLocaleString()}
              subtitle={`승인 ${programStats.approved}개`}
              icon={BookOpen}
              variant="warning"
            />
            <AdminStatsCard
              title="수강 완료율"
              value={`${enrollmentStats.completionRate}%`}
              subtitle={`전체 ${enrollmentStats.totalEnrollments.toLocaleString()}건`}
              icon={GraduationCap}
              variant="default"
            />
          </>
        )}
      </AdminStatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 사용자 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>사용자 현황</CardTitle>
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
                  <span className="text-sm">활성</span>
                  <div className="flex items-center gap-2">
                    <Progress value={userStats.total > 0 ? (userStats.active / userStats.total) * 100 : 0} className="w-32" />
                    <span className="text-sm font-medium w-16">{userStats.active.toLocaleString()}명</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">비활성</span>
                  <div className="flex items-center gap-2">
                    <Progress value={userStats.total > 0 ? (userStats.inactive / userStats.total) * 100 : 0} className="w-32" />
                    <span className="text-sm font-medium w-16">{userStats.inactive.toLocaleString()}명</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">정지</span>
                  <div className="flex items-center gap-2">
                    <Progress value={userStats.total > 0 ? (userStats.suspended / userStats.total) * 100 : 0} className="w-32" />
                    <span className="text-sm font-medium w-16">{userStats.suspended.toLocaleString()}명</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">탈퇴</span>
                  <div className="flex items-center gap-2">
                    <Progress value={userStats.total > 0 ? (userStats.withdrawn / userStats.total) * 100 : 0} className="w-32" />
                    <span className="text-sm font-medium w-16">{userStats.withdrawn.toLocaleString()}명</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 프로그램 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>프로그램 현황</CardTitle>
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
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-text-secondary" />
                    <span className="text-sm">작성중</span>
                  </div>
                  <span className="text-sm font-medium">{programStats.draft}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-warning" />
                    <span className="text-sm">검토 대기</span>
                  </div>
                  <span className="text-sm font-medium">{programStats.pending}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">승인됨</span>
                  </div>
                  <span className="text-sm font-medium">{programStats.approved}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm">반려됨</span>
                  </div>
                  <span className="text-sm font-medium">{programStats.rejected}개</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 수강 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>수강 현황</CardTitle>
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
                  <span className="text-sm">수강 중</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={enrollmentStats.totalEnrollments > 0 ? (enrollmentStats.byStatus.enrolled / enrollmentStats.totalEnrollments) * 100 : 0}
                      className="w-32"
                    />
                    <span className="text-sm font-medium w-16">{enrollmentStats.byStatus.enrolled.toLocaleString()}건</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">수료</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={enrollmentStats.totalEnrollments > 0 ? (enrollmentStats.byStatus.completed / enrollmentStats.totalEnrollments) * 100 : 0}
                      className="w-32"
                    />
                    <span className="text-sm font-medium w-16">{enrollmentStats.byStatus.completed.toLocaleString()}건</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">중도 포기</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={enrollmentStats.totalEnrollments > 0 ? (enrollmentStats.byStatus.dropped / enrollmentStats.totalEnrollments) * 100 : 0}
                      className="w-32"
                    />
                    <span className="text-sm font-medium w-16">{enrollmentStats.byStatus.dropped.toLocaleString()}건</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">미수료</span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={enrollmentStats.totalEnrollments > 0 ? (enrollmentStats.byStatus.failed / enrollmentStats.totalEnrollments) * 100 : 0}
                      className="w-32"
                    />
                    <span className="text-sm font-medium w-16">{enrollmentStats.byStatus.failed.toLocaleString()}건</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 월별 수강 추이 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>월별 수강 추이</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : monthlyTrend.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-text-secondary">
                데이터가 없습니다
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="month"
                      className="text-xs fill-text-secondary"
                      tickFormatter={(value) => {
                        const [, month] = value.split('-');
                        return `${month}월`;
                      }}
                    />
                    <YAxis className="text-xs fill-text-secondary" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--bg-default))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(value) => {
                        const [year, month] = value.split('-');
                        return `${year}년 ${month}월`;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="enrollments"
                      name="수강 신청"
                      stroke="hsl(var(--brand-primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--brand-primary))' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completions"
                      name="수료"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--success))' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
