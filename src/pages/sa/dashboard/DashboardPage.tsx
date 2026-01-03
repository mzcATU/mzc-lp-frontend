import { Building2, Users, Activity, Loader2 } from 'lucide-react';
import {
  AdminPageHeader,
  AdminStatsCard,
  AdminStatsGrid,
  StatusBadge,
  PlanBadge,
} from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Progress } from '@/components/common/Progress';
import { useSaDashboard } from '@/hooks/sa';
import type { TenantStatus, PlanType } from '@/types/admin';

export function DashboardPage() {
  const { data: dashboard, isLoading, error } = useSaDashboard();

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
          description="시스템 전체 현황을 확인합니다"
        />
        <div className="text-center py-12 text-text-secondary">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  const tenantStats = dashboard?.tenantStats ?? { total: 0, active: 0, pending: 0, suspended: 0, terminated: 0, byPlan: {} };
  const userStats = dashboard?.userStats ?? { total: 0, active: 0, suspended: 0, withdrawn: 0 };
  const recentTenants = dashboard?.recentTenants ?? [];

  const safePercentage = (value: number, total: number) =>
    total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="p-6">
      <AdminPageHeader
        title="대시보드"
        description="시스템 전체 현황을 확인합니다"
      />

      {/* Stats Grid */}
      <AdminStatsGrid columns={4} className="mb-6">
        <AdminStatsCard
          title="전체 테넌트"
          value={tenantStats.total}
          subtitle={`활성 ${tenantStats.active}개`}
          icon={Building2}
          variant="primary"
        />
        <AdminStatsCard
          title="전체 사용자"
          value={userStats.total.toLocaleString()}
          subtitle={`활성 ${userStats.active.toLocaleString()}명`}
          icon={Users}
          variant="success"
        />
        <AdminStatsCard
          title="대기 테넌트"
          value={tenantStats.pending}
          subtitle="승인 대기"
          icon={Activity}
          variant="warning"
        />
        <AdminStatsCard
          title="정지 사용자"
          value={userStats.suspended}
          subtitle="정지 상태"
          icon={Users}
          variant="default"
        />
      </AdminStatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 테넌트 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>테넌트 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">활성</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(tenantStats.active, tenantStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-8">{tenantStats.active}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">대기</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(tenantStats.pending, tenantStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-8">{tenantStats.pending}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">정지</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(tenantStats.suspended, tenantStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-8">{tenantStats.suspended}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">해지</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(tenantStats.terminated, tenantStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-8">{tenantStats.terminated}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                  <span className="text-sm font-medium w-12">{userStats.active.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">정지</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(userStats.suspended, userStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-12">{userStats.suspended.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">탈퇴</span>
                <div className="flex items-center gap-2">
                  <Progress value={safePercentage(userStats.withdrawn, userStats.total)} className="w-32" />
                  <span className="text-sm font-medium w-12">{userStats.withdrawn.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 플랜별 테넌트 */}
        {Object.keys(tenantStats.byPlan).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>플랜별 테넌트</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(tenantStats.byPlan).map(([plan, count]) => (
                  <div key={plan} className="flex items-center justify-between">
                    <span className="text-sm">{plan}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={safePercentage(count, tenantStats.total)} className="w-32" />
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 최근 생성된 테넌트 */}
        <Card className={Object.keys(tenantStats.byPlan).length > 0 ? '' : 'lg:col-span-2'}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>최근 생성된 테넌트</CardTitle>
            <a href="/sa/tenants" className="text-sm text-brand-primary hover:underline">
              전체 보기
            </a>
          </CardHeader>
          <CardContent>
            {recentTenants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">테넌트명</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">코드</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">상태</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">플랜</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">생성일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTenants.map((tenant) => (
                      <tr key={tenant.id} className="border-b last:border-b-0 hover:bg-bg-secondary">
                        <td className="py-3 px-4 font-medium">{tenant.name}</td>
                        <td className="py-3 px-4 text-text-secondary">{tenant.code}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={tenant.status as TenantStatus} />
                        </td>
                        <td className="py-3 px-4">
                          <PlanBadge plan={tenant.plan as PlanType} />
                        </td>
                        <td className="py-3 px-4 text-text-secondary">{tenant.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary text-sm">
                등록된 테넌트가 없습니다
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
