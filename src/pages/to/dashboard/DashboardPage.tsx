import {
  Clock,
  Users,
  GraduationCap,
  BookOpen,
  AlertCircle,
  UserX,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
import { useToDashboard } from '@/hooks/to';

export function DashboardPage() {
  const { data, isLoading, error } = useToDashboard();

  if (error) {
    return (
      <div className="p-6">
        <AdminPageHeader
          title="대시보드"
          description="운영 현황을 한눈에 확인합니다"
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

  const pendingTasks = data?.pendingTasks ?? { programsPendingApproval: 0, courseTimesNeedingInstructor: 0 };
  const courseTimeStats = data?.courseTimeStats ?? {
    byStatus: { draft: 0, recruiting: 0, ongoing: 0, closed: 0, archived: 0 },
    byDeliveryType: { online: 0, offline: 0, blended: 0, live: 0 },
    freeVsPaid: { free: 0, paid: 0 },
    total: 0,
  };
  const enrollmentStats = data?.enrollmentStats ?? {
    totalEnrollments: 0,
    byStatus: { enrolled: 0, completed: 0, dropped: 0, failed: 0 },
    byType: { voluntary: 0, mandatory: 0 },
    completionRate: 0,
    averageCapacityUtilization: 0,
  };
  const dailyTrend = data?.dailyTrend ?? [];

  return (
    <div className="p-6">
      <AdminPageHeader
        title="대시보드"
        description="운영 현황을 한눈에 확인합니다"
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
              title="검토 대기 프로그램"
              value={pendingTasks.programsPendingApproval}
              subtitle="승인 대기"
              icon={Clock}
              variant="warning"
            />
            <AdminStatsCard
              title="강사 미배정 차수"
              value={pendingTasks.courseTimesNeedingInstructor}
              subtitle="배정 필요"
              icon={UserX}
              variant="error"
            />
            <AdminStatsCard
              title="전체 차수"
              value={courseTimeStats.total}
              subtitle={`진행 중 ${courseTimeStats.byStatus.ongoing}개`}
              icon={BookOpen}
              variant="primary"
            />
            <AdminStatsCard
              title="수강 완료율"
              value={`${enrollmentStats.completionRate}%`}
              subtitle={`전체 ${enrollmentStats.totalEnrollments.toLocaleString()}건`}
              icon={GraduationCap}
              variant="success"
            />
          </>
        )}
      </AdminStatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 차수 상태별 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>차수 상태별 현황</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">작성 중</span>
                  <div className="flex items-center gap-2">
                    <Progress value={courseTimeStats.total > 0 ? (courseTimeStats.byStatus.draft / courseTimeStats.total) * 100 : 0} className="w-32" />
                    <span className="text-sm font-medium w-8">{courseTimeStats.byStatus.draft}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">모집 중</span>
                  <div className="flex items-center gap-2">
                    <Progress value={courseTimeStats.total > 0 ? (courseTimeStats.byStatus.recruiting / courseTimeStats.total) * 100 : 0} className="w-32" />
                    <span className="text-sm font-medium w-8">{courseTimeStats.byStatus.recruiting}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">진행 중</span>
                  <div className="flex items-center gap-2">
                    <Progress value={courseTimeStats.total > 0 ? (courseTimeStats.byStatus.ongoing / courseTimeStats.total) * 100 : 0} className="w-32" />
                    <span className="text-sm font-medium w-8">{courseTimeStats.byStatus.ongoing}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">종료됨</span>
                  <div className="flex items-center gap-2">
                    <Progress value={courseTimeStats.total > 0 ? (courseTimeStats.byStatus.closed / courseTimeStats.total) * 100 : 0} className="w-32" />
                    <span className="text-sm font-medium w-8">{courseTimeStats.byStatus.closed}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">보관됨</span>
                  <div className="flex items-center gap-2">
                    <Progress value={courseTimeStats.total > 0 ? (courseTimeStats.byStatus.archived / courseTimeStats.total) * 100 : 0} className="w-32" />
                    <span className="text-sm font-medium w-8">{courseTimeStats.byStatus.archived}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 차수 운영 방식 */}
        <Card>
          <CardHeader>
            <CardTitle>차수 운영 방식</CardTitle>
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
                    <TrendingUp className="h-4 w-4 text-brand-primary" />
                    <span className="text-sm">온라인</span>
                  </div>
                  <span className="text-sm font-medium">{courseTimeStats.byDeliveryType.online}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-success" />
                    <span className="text-sm">오프라인</span>
                  </div>
                  <span className="text-sm font-medium">{courseTimeStats.byDeliveryType.offline}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-warning" />
                    <span className="text-sm">블렌디드</span>
                  </div>
                  <span className="text-sm font-medium">{courseTimeStats.byDeliveryType.blended}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-destructive" />
                    <span className="text-sm">실시간</span>
                  </div>
                  <span className="text-sm font-medium">{courseTimeStats.byDeliveryType.live}개</span>
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">무료 / 유료</span>
                    <span className="text-sm font-medium">
                      {courseTimeStats.freeVsPaid.free}개 / {courseTimeStats.freeVsPaid.paid}개
                    </span>
                  </div>
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
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">자발적 / 필수</span>
                    <span className="font-medium">
                      {enrollmentStats.byType.voluntary.toLocaleString()}건 / {enrollmentStats.byType.mandatory.toLocaleString()}건
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-text-secondary">평균 정원 충족률</span>
                    <span className="font-medium">{enrollmentStats.averageCapacityUtilization}%</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 일별 수강신청 추이 차트 */}
        <Card>
          <CardHeader>
            <CardTitle>일별 수강신청 추이</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : dailyTrend.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-text-secondary">
                데이터가 없습니다
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="date"
                      className="text-xs fill-text-secondary"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
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
                        const date = new Date(value);
                        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
                      }}
                    />
                    <Bar
                      dataKey="enrollments"
                      name="수강 신청"
                      fill="hsl(var(--brand-primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
