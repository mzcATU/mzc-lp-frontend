import { useState } from 'react';
import {
  Activity,
  Users,
  PlayCircle,
  Clock,
  Calendar,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';
import { useSaActivityStats, useSaRecentActivities, useTenants } from '@/hooks/sa';
import type { ActivityType } from '@/services/sa/analyticsService';

// 활동 타입별 설정
const activityTypeConfig: Record<string, { label: string; color: string }> = {
  LOGIN: { label: '로그인', color: 'bg-blue-100 text-blue-700' },
  LOGOUT: { label: '로그아웃', color: 'bg-gray-100 text-gray-700' },
  LOGIN_FAILED: { label: '로그인 실패', color: 'bg-red-100 text-red-700' },
  COURSE_VIEW: { label: '강좌 조회', color: 'bg-green-100 text-green-700' },
  COURSE_CREATE: { label: '강좌 생성', color: 'bg-purple-100 text-purple-700' },
  ENROLLMENT_CREATE: { label: '수강 신청', color: 'bg-orange-100 text-orange-700' },
  ENROLLMENT_COMPLETE: { label: '수강 완료', color: 'bg-emerald-100 text-emerald-700' },
  CONTENT_VIEW: { label: '콘텐츠 조회', color: 'bg-cyan-100 text-cyan-700' },
  CONTENT_COMPLETE: { label: '콘텐츠 완료', color: 'bg-teal-100 text-teal-700' },
  USER_CREATE: { label: '사용자 생성', color: 'bg-indigo-100 text-indigo-700' },
  SETTINGS_UPDATE: { label: '설정 변경', color: 'bg-amber-100 text-amber-700' },
  TENANT_CREATE: { label: '테넌트 생성', color: 'bg-pink-100 text-pink-700' },
};

const getActivityConfig = (type: ActivityType) => {
  return activityTypeConfig[type] || { label: type, color: 'bg-gray-100 text-gray-700' };
};

// 상대 시간 포맷
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
};

interface ActivityContentProps {
  tenantId: number | null;
}

export function ActivityContent({ tenantId }: ActivityContentProps) {
  const [days, setDays] = useState(7);

  const { data: stats, isLoading: statsLoading } = useSaActivityStats({
    days,
    tenantId: tenantId || undefined,
  });
  const { data: recentActivities, isLoading: recentLoading } = useSaRecentActivities(
    tenantId || undefined
  );
  const { data: tenantsData } = useTenants({ size: 100 });

  const isLoading = statsLoading || recentLoading;

  // 테넌트 ID -> 이름 매핑
  const tenants = tenantsData?.content || [];
  const getTenantName = (tenantIdValue: number | null) => {
    if (!tenantIdValue) return '시스템';
    const tenant = tenants.find((t) => t.tenantId === tenantIdValue);
    return tenant?.name || `테넌트 #${tenantIdValue}`;
  };

  // 선택한 테넌트의 활동만 필터링
  const filteredRecentActivities = tenantId
    ? recentActivities?.filter(activity => activity.tenantId === tenantId)
    : recentActivities;

  // 활동 유형별 카운트
  const loginCount = stats?.byActivityType?.LOGIN || 0;
  const courseCompleteCount = stats?.byActivityType?.ENROLLMENT_COMPLETE || 0;
  const contentViewCount = stats?.byActivityType?.CONTENT_VIEW || 0;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-36">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">오늘</SelectItem>
            <SelectItem value="7">최근 7일</SelectItem>
            <SelectItem value="30">최근 30일</SelectItem>
            <SelectItem value="90">최근 90일</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      ) : (
        <>
          {/* Activity Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.activeUsers || 0}</p>
                    <p className="text-sm text-text-secondary">활성 사용자</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  최근 {days}일 활동 기준
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats?.todayActivities || 0}</p>
                    <p className="text-sm text-text-secondary">오늘 활동</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-text-secondary flex items-center gap-1">
                  전체: {stats?.totalActivities?.toLocaleString() || 0}건
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{courseCompleteCount}</p>
                    <p className="text-sm text-text-secondary">수강 완료</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  최근 {days}일
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <PlayCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{loginCount}</p>
                    <p className="text-sm text-text-secondary">로그인 횟수</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-text-secondary">
                  콘텐츠 조회: {contentViewCount}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Activity by Type Chart */}
            <Card>
              <CardHeader>
                <CardTitle>활동 유형별 분포</CardTitle>
                <CardDescription>최근 {days}일간 활동 유형별 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.byActivityType && Object.entries(stats.byActivityType)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 8)
                    .map(([type, count]) => {
                      const config = getActivityConfig(type as ActivityType);
                      const maxCount = Math.max(...Object.values(stats.byActivityType));
                      const percent = maxCount > 0 ? (count / maxCount) * 100 : 0;

                      return (
                        <div key={type} className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${config.color}`}>
                            {config.label}
                          </span>
                          <div className="flex-1 h-2 bg-gray-100 rounded">
                            <div
                              className="h-full bg-brand-primary rounded"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-16 text-right">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  {(!stats?.byActivityType || Object.keys(stats.byActivityType).length === 0) && (
                    <div className="text-center py-8 text-text-secondary">
                      활동 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>실시간 활동</CardTitle>
                <CardDescription>최근 사용자 활동 로그</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredRecentActivities?.slice(0, 8).map((activity) => {
                    const config = getActivityConfig(activity.activityType);

                    return (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
                            {activity.activityTypeLabel || config.label}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{activity.userName || '알 수 없음'}</p>
                            <p className="text-xs text-text-secondary">
                              {getTenantName(activity.tenantId)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm truncate max-w-[150px]">{activity.description}</p>
                          <p className="text-xs text-text-secondary">{formatRelativeTime(activity.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                  {(!filteredRecentActivities || filteredRecentActivities.length === 0) && (
                    <div className="text-center py-8 text-text-secondary">
                      최근 활동이 없습니다.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
