import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  HardDrive,
  Calendar,
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

// Mock 데이터
const mockUsageStats = {
  totalUsers: 12450,
  activeUsers: 8920,
  totalCourses: 156,
  activeCourses: 134,
  storageUsed: 245.8,
  storageLimit: 500,
  apiCalls: 1250000,
  bandwidth: 2.4,
};

const mockTenantUsage: {
  id: number;
  name: string;
  users: number;
  courses: number;
  storage: number;
  storageLimit: number;
}[] = [
  { id: 1, name: '메가존클라우드', users: 2500, courses: 45, storage: 85.2, storageLimit: 100 },
  { id: 2, name: '삼성전자', users: 3200, courses: 38, storage: 62.4, storageLimit: 100 },
  { id: 3, name: 'LG전자', users: 1800, courses: 28, storage: 45.6, storageLimit: 100 },
  { id: 4, name: '카카오', users: 1500, courses: 22, storage: 32.8, storageLimit: 50 },
  { id: 5, name: '네이버', users: 1200, courses: 18, storage: 19.8, storageLimit: 50 },
];

export function UsagePage() {
  const [period, setPeriod] = useState('30d');

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

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUsageStats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-text-secondary">전체 사용자</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              활성: {mockUsageStats.activeUsers.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUsageStats.totalCourses}</p>
                <p className="text-sm text-text-secondary">전체 강좌</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              활성: {mockUsageStats.activeCourses}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <HardDrive className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUsageStats.storageUsed} GB</p>
                <p className="text-sm text-text-secondary">스토리지 사용</p>
              </div>
            </div>
            <div className="mt-2">
              <Progress value={(mockUsageStats.storageUsed / mockUsageStats.storageLimit) * 100} className="h-1" />
              <p className="text-xs text-text-secondary mt-1">{mockUsageStats.storageLimit} GB 중</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(mockUsageStats.apiCalls / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-text-secondary">API 호출</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-text-secondary">
              대역폭: {mockUsageStats.bandwidth} TB
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Usage */}
      <Card>
        <CardHeader>
          <CardTitle>테넌트별 사용량</CardTitle>
          <CardDescription>각 테넌트의 리소스 사용 현황입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTenantUsage.map((tenant) => {
              const storagePercent = (tenant.storage / tenant.storageLimit) * 100;

              return (
                <div key={tenant.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{tenant.name}</h3>
                    <Button variant="ghost" size="sm">상세 보기</Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                        <Users className="h-4 w-4" />
                        사용자
                      </div>
                      <p className="text-lg font-semibold">{tenant.users.toLocaleString()}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                        <BookOpen className="h-4 w-4" />
                        강좌
                      </div>
                      <p className="text-lg font-semibold">{tenant.courses}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                        <HardDrive className="h-4 w-4" />
                        스토리지
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={storagePercent} className="flex-1 h-2" />
                        <span className="text-sm">{tenant.storage} / {tenant.storageLimit} GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
