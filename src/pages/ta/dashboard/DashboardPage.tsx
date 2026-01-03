import { Users, BookOpen, TrendingUp, GraduationCap, Loader2 } from 'lucide-react';
import {
  AdminPageHeader,
  AdminStatsCard,
  AdminStatsGrid,
} from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Progress } from '@/components/common/Progress';
import { useTaDashboardKpi } from '@/hooks/ta';

export function DashboardPage() {
  const { data: kpi, isLoading, error } = useTaDashboardKpi();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <AdminPageHeader
          title="대시보드"
          description="테넌트 현황을 한눈에 확인합니다"
        />
        <div className="text-center py-12 text-text-secondary">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  const userStats = kpi?.userStats ?? { active: 0, inactive: 0, suspended: 0, withdrawn: 0, total: 0, newThisMonth: 0 };
  const programStats = kpi?.programStats ?? { draft: 0, pending: 0, approved: 0, rejected: 0, closed: 0, total: 0 };
  const enrollmentStats = kpi?.enrollmentStats ?? { totalEnrollments: 0, byStatus: { enrolled: 0, completed: 0, dropped: 0, failed: 0 }, completionRate: 0 };
  const monthlyTrend = kpi?.monthlyTrend ?? [];

  const safePercentage = (value: number, total: number) =>
    total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="p-6">
      <AdminPageHeader
        title="대시보드"
        description="테넌트 현황을 한눈에 확인합니다"
      />

      {/* Stats Grid */}
      <AdminStatsGrid columns={4} className="mb-6">
        <AdminStatsCard
          title="전체 사용자"
          value={userStats.total}
          subtitle={`활성 ${userStats.active}명`}
          icon={Users}
          variant="primary"
          trend={userStats.newThisMonth > 0 ? { value: userStats.newThisMonth, label: '이번 달 신규' } : undefined}
        />
        <AdminStatsCard
          title="전체 프로그램"
          value={programStats.total}
          subtitle={`승인됨 ${programStats.approved}개`}
          icon={BookOpen}
          variant="success"
        />
        <AdminStatsCard
          title="평균 완료율"
          value={`${enrollmentStats.completionRate}%`}
          subtitle="전체 수강 기준"
          icon={TrendingUp}
          variant="warning"
        />
        <AdminStatsCard
          title="총 수강 신청"
          value={enrollmentStats.totalEnrollments}
          subtitle={`완료 ${enrollmentStats.byStatus.completed}건`}
          icon={GraduationCap}
          variant="default"
        />
      </AdminStatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 사용자 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>사용자 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">활성</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(userStats.active, userStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-12">{userStats.active}명</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">비활성</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(userStats.inactive, userStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-12">{userStats.inactive}명</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">정지</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(userStats.suspended, userStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-12">{userStats.suspended}명</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">탈퇴</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(userStats.withdrawn, userStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-12">{userStats.withdrawn}명</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 프로그램 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>프로그램 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">승인됨</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(programStats.approved, programStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-12">{programStats.approved}개</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">대기중</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(programStats.pending, programStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-12">{programStats.pending}개</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">초안</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(programStats.draft, programStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-12">{programStats.draft}개</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">종료</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(programStats.closed, programStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-12">{programStats.closed}개</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 수강 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>수강 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">수강중</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(enrollmentStats.byStatus.enrolled, enrollmentStats.totalEnrollments)} className="w-32" />
                  <span className="text-sm font-medium w-12">{enrollmentStats.byStatus.enrolled}건</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">완료</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(enrollmentStats.byStatus.completed, enrollmentStats.totalEnrollments)} className="w-32" />
                  <span className="text-sm font-medium w-12">{enrollmentStats.byStatus.completed}건</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">중도포기</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(enrollmentStats.byStatus.dropped, enrollmentStats.totalEnrollments)} className="w-32" />
                  <span className="text-sm font-medium w-12">{enrollmentStats.byStatus.dropped}건</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">미이수</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(enrollmentStats.byStatus.failed, enrollmentStats.totalEnrollments)} className="w-32" />
                  <span className="text-sm font-medium w-12">{enrollmentStats.byStatus.failed}건</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 월별 추이 */}
        <Card>
          <CardHeader>
            <CardTitle>월별 수강 추이</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyTrend.length > 0 ? (
              <div className="space-y-3">
                {monthlyTrend.slice(-6).map((trend) => (
                  <div key={trend.month} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <span className="text-sm font-medium">{trend.month}</span>
                    <div className="flex gap-6 text-sm">
                      <span className="text-text-secondary">
                        수강 <span className="font-medium text-text-primary">{trend.enrollments}</span>건
                      </span>
                      <span className="text-text-secondary">
                        완료 <span className="font-medium text-brand-primary">{trend.completions}</span>건
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary text-sm">
                데이터가 없습니다
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
