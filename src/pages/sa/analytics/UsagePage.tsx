import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  HardDrive,
  Calendar,
  Loader2,
  Building2,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';
import { Progress } from '@/components/common/Progress';
import { useSaDashboard, useSaActivityStats } from '@/hooks/sa';

export function UsagePage() {
  const [period, setPeriod] = useState('30d');

  const { data: dashboard, isLoading: dashboardLoading } = useSaDashboard();
  const { data: activityStats, isLoading: activityLoading } = useSaActivityStats(
    period === '7d' ? 7 : period === '90d' ? 90 : period === '1y' ? 365 : 30
  );

  const isLoading = dashboardLoading || activityLoading;

  // 대시보드에서 통계 추출
  const totalUsers = dashboard?.userStats?.total || 0;
  const activeUsers = dashboard?.userStats?.active || 0;
  const totalTenants = dashboard?.tenantStats?.total || 0;
  const activeTenants = dashboard?.tenantStats?.active || 0;

  // 활동 통계
  const totalActivities = activityStats?.totalActivities || 0;

  return (
    <div className="p-6">
      <AdminPageHeader
        title="사용량 통계"
        description="플랫폼 전체 사용량을 분석합니다"
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">최근 7일</SelectItem>
              <SelectItem value="30d">최근 30일</SelectItem>
              <SelectItem value="90d">최근 90일</SelectItem>
              <SelectItem value="1y">최근 1년</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                    <p className="text-sm text-text-secondary">전체 사용자</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  활성: {activeUsers.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalTenants}</p>
                    <p className="text-sm text-text-secondary">전체 테넌트</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  활성: {activeTenants}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalActivities.toLocaleString()}</p>
                    <p className="text-sm text-text-secondary">총 활동</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-text-secondary">
                  오늘: {activityStats?.todayActivities || 0}건
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <HardDrive className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activityStats?.activeUsers || 0}</p>
                    <p className="text-sm text-text-secondary">활성 사용자</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-text-secondary">
                  최근 활동 기준
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tenant Stats by Plan */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>테넌트 상태별 현황</CardTitle>
                <CardDescription>테넌트 상태 분포</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">활성</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={totalTenants > 0 ? (activeTenants / totalTenants) * 100 : 0}
                        className="w-32 h-2"
                      />
                      <span className="text-sm font-medium w-8">{activeTenants}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">대기</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={totalTenants > 0 ? ((dashboard?.tenantStats?.pending || 0) / totalTenants) * 100 : 0}
                        className="w-32 h-2"
                      />
                      <span className="text-sm font-medium w-8">{dashboard?.tenantStats?.pending || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">정지</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={totalTenants > 0 ? ((dashboard?.tenantStats?.suspended || 0) / totalTenants) * 100 : 0}
                        className="w-32 h-2"
                      />
                      <span className="text-sm font-medium w-8">{dashboard?.tenantStats?.suspended || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">종료</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={totalTenants > 0 ? ((dashboard?.tenantStats?.terminated || 0) / totalTenants) * 100 : 0}
                        className="w-32 h-2"
                      />
                      <span className="text-sm font-medium w-8">{dashboard?.tenantStats?.terminated || 0}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>요금제별 테넌트</CardTitle>
                <CardDescription>요금제 분포 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard?.tenantStats?.byPlan && Object.entries(dashboard.tenantStats.byPlan).length > 0 ? (
                    Object.entries(dashboard.tenantStats.byPlan).map(([plan, count]) => (
                      <div key={plan} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{plan}</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={totalTenants > 0 ? (count / totalTenants) * 100 : 0}
                            className="w-32 h-2"
                          />
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-text-secondary">
                      요금제 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tenants */}
          <Card>
            <CardHeader>
              <CardTitle>최근 등록 테넌트</CardTitle>
              <CardDescription>최근에 등록된 테넌트 목록입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboard?.recentTenants && dashboard.recentTenants.length > 0 ? (
                  dashboard.recentTenants.map((tenant) => (
                    <div key={tenant.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{tenant.name}</h3>
                          <p className="text-xs text-text-secondary">{tenant.code}</p>
                        </div>
                        <Button variant="ghost" size="sm">상세 보기</Button>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                            상태
                          </div>
                          <p className="text-sm font-semibold capitalize">{tenant.status}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                            요금제
                          </div>
                          <p className="text-sm font-semibold capitalize">{tenant.plan}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                            등록일
                          </div>
                          <p className="text-sm font-semibold">
                            {new Date(tenant.createdAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-text-secondary">
                    최근 등록된 테넌트가 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
