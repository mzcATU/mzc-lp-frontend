import { Building2, Users, Activity, Server } from 'lucide-react';
import {
  AdminPageHeader,
  AdminStatsCard,
  AdminStatsGrid,
  StatusBadge,
  PlanBadge,
  
} from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Progress } from '@/components/common/Progress';
import type { TenantStatus, PlanType } from '@/types/admin';

// Mock 데이터 (추후 API 연동)
const mockStats = {
  tenants: {
    total: 24,
    active: 20,
    inactive: 3,
    suspended: 1,
  },
  users: {
    total: 1250,
    activeToday: 342,
  },
  systemHealth: {
    status: 'healthy' as const,
    uptime: '99.9%',
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
  },
};

const mockRecentTenants: {
  id: number;
  name: string;
  code: string;
  status: TenantStatus;
  plan: PlanType;
  createdAt: string;
}[] = [
  { id: 1, name: '메가존클라우드', code: 'mzc', status: 'ACTIVE', plan: 'ENTERPRISE', createdAt: '2025-12-28' },
  { id: 2, name: '삼성전자', code: 'samsung', status: 'ACTIVE', plan: 'ENTERPRISE', createdAt: '2025-12-27' },
  { id: 3, name: '네이버', code: 'naver', status: 'PENDING', plan: 'PRO', createdAt: '2025-12-26' },
  { id: 4, name: '카카오', code: 'kakao', status: 'ACTIVE', plan: 'PRO', createdAt: '2025-12-25' },
  { id: 5, name: '라인', code: 'line', status: 'INACTIVE', plan: 'BASIC', createdAt: '2025-12-24' },
];

export function DashboardPage() {
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
          value={mockStats.tenants.total}
          subtitle={`활성 ${mockStats.tenants.active}개`}
          icon={Building2}
          variant="primary"
          trend={{ value: 12, label: '지난 달 대비' }}
        />
        <AdminStatsCard
          title="전체 사용자"
          value={mockStats.users.total.toLocaleString()}
          subtitle={`오늘 활성 ${mockStats.users.activeToday}명`}
          icon={Users}
          variant="success"
          trend={{ value: 8, label: '지난 달 대비' }}
        />
        <AdminStatsCard
          title="시스템 상태"
          value={mockStats.systemHealth.status === 'healthy' ? '정상' : '점검 필요'}
          subtitle={`가동률 ${mockStats.systemHealth.uptime}`}
          icon={Activity}
          variant={mockStats.systemHealth.status === 'healthy' ? 'success' : 'warning'}
        />
        <AdminStatsCard
          title="서버 리소스"
          value={`${mockStats.systemHealth.cpuUsage}%`}
          subtitle="CPU 사용률"
          icon={Server}
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
                  <Progress value={(mockStats.tenants.active / mockStats.tenants.total) * 100} className="w-32" />
                  <span className="text-sm font-medium w-8">{mockStats.tenants.active}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">비활성</span>
                <div className="flex items-center gap-2">
                  <Progress value={(mockStats.tenants.inactive / mockStats.tenants.total) * 100} className="w-32" />
                  <span className="text-sm font-medium w-8">{mockStats.tenants.inactive}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">정지</span>
                <div className="flex items-center gap-2">
                  <Progress value={(mockStats.tenants.suspended / mockStats.tenants.total) * 100} className="w-32" />
                  <span className="text-sm font-medium w-8">{mockStats.tenants.suspended}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 시스템 리소스 */}
        <Card>
          <CardHeader>
            <CardTitle>시스템 리소스</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">CPU</span>
                <div className="flex items-center gap-2">
                  <Progress value={mockStats.systemHealth.cpuUsage} className="w-32" />
                  <span className="text-sm font-medium w-12">{mockStats.systemHealth.cpuUsage}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">메모리</span>
                <div className="flex items-center gap-2">
                  <Progress value={mockStats.systemHealth.memoryUsage} className="w-32" />
                  <span className="text-sm font-medium w-12">{mockStats.systemHealth.memoryUsage}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">디스크</span>
                <div className="flex items-center gap-2">
                  <Progress value={mockStats.systemHealth.diskUsage} className="w-32" />
                  <span className="text-sm font-medium w-12">{mockStats.systemHealth.diskUsage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 최근 생성된 테넌트 */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>최근 생성된 테넌트</CardTitle>
            <a href="/sa/tenants" className="text-sm text-brand-primary hover:underline">
              전체 보기
            </a>
          </CardHeader>
          <CardContent>
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
                  {mockRecentTenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b last:border-b-0 hover:bg-bg-secondary">
                      <td className="py-3 px-4 font-medium">{tenant.name}</td>
                      <td className="py-3 px-4 text-text-secondary">{tenant.code}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={tenant.status} />
                      </td>
                      <td className="py-3 px-4">
                        <PlanBadge plan={tenant.plan} />
                      </td>
                      <td className="py-3 px-4 text-text-secondary">{tenant.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
