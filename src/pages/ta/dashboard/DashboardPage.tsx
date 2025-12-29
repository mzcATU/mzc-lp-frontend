import { Users, BookOpen, TrendingUp, Clock } from 'lucide-react';
import {
  AdminPageHeader,
  AdminStatsCard,
  AdminStatsGrid,
  StatusBadge,
  RoleBadge,
} from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Progress } from '@/components/common/Progress';
import type { UserStatus, SystemRole } from '@/components/domain/admin';

// Mock 데이터 (추후 API 연동)
const mockStats = {
  users: {
    total: 450,
    active: 380,
    inactive: 50,
    pending: 20,
  },
  courses: {
    total: 32,
    active: 28,
    draft: 4,
  },
  learning: {
    completionRate: 72,
    averageProgress: 65,
    activeLearnersToday: 124,
  },
  activity: {
    dailyActiveUsers: 156,
    weeklyActiveUsers: 342,
    monthlyActiveUsers: 410,
  },
};

const mockRecentUsers: {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  role: SystemRole;
  joinedAt: string;
}[] = [
  { id: 1, name: '김민수', email: 'minsu.kim@company.com', status: 'ACTIVE', role: 'USER', joinedAt: '2025-12-28' },
  { id: 2, name: '이영희', email: 'younghee.lee@company.com', status: 'ACTIVE', role: 'OPERATOR', joinedAt: '2025-12-27' },
  { id: 3, name: '박철수', email: 'cheolsu.park@company.com', status: 'PENDING', role: 'USER', joinedAt: '2025-12-26' },
  { id: 4, name: '정수진', email: 'sujin.jung@company.com', status: 'ACTIVE', role: 'USER', joinedAt: '2025-12-25' },
  { id: 5, name: '최동현', email: 'donghyun.choi@company.com', status: 'INACTIVE', role: 'USER', joinedAt: '2025-12-24' },
];

const mockPopularCourses = [
  { id: 1, title: 'AWS 기초 마스터', enrollments: 156, completionRate: 78 },
  { id: 2, title: 'React 실전 프로젝트', enrollments: 142, completionRate: 65 },
  { id: 3, title: 'Python 데이터 분석', enrollments: 128, completionRate: 82 },
  { id: 4, title: 'Docker & Kubernetes', enrollments: 98, completionRate: 54 },
  { id: 5, title: 'TypeScript 완벽 가이드', enrollments: 87, completionRate: 71 },
];

export function DashboardPage() {
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
          value={mockStats.users.total}
          subtitle={`활성 ${mockStats.users.active}명`}
          icon={Users}
          variant="primary"
          trend={{ value: 15, label: '지난 달 대비' }}
        />
        <AdminStatsCard
          title="전체 강좌"
          value={mockStats.courses.total}
          subtitle={`활성 ${mockStats.courses.active}개`}
          icon={BookOpen}
          variant="success"
          trend={{ value: 8, label: '지난 달 대비' }}
        />
        <AdminStatsCard
          title="평균 완료율"
          value={`${mockStats.learning.completionRate}%`}
          subtitle="전체 강좌 기준"
          icon={TrendingUp}
          variant="warning"
          trend={{ value: 5, label: '지난 달 대비' }}
        />
        <AdminStatsCard
          title="오늘 활성 학습자"
          value={mockStats.learning.activeLearnersToday}
          subtitle="현재 학습 중"
          icon={Clock}
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
                  <Progress value={(mockStats.users.active / mockStats.users.total) * 100} className="w-32" />
                  <span className="text-sm font-medium w-12">{mockStats.users.active}명</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">비활성</span>
                <div className="flex items-center gap-2">
                  <Progress value={(mockStats.users.inactive / mockStats.users.total) * 100} className="w-32" />
                  <span className="text-sm font-medium w-12">{mockStats.users.inactive}명</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">대기</span>
                <div className="flex items-center gap-2">
                  <Progress value={(mockStats.users.pending / mockStats.users.total) * 100} className="w-32" />
                  <span className="text-sm font-medium w-12">{mockStats.users.pending}명</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 학습 활동 */}
        <Card>
          <CardHeader>
            <CardTitle>학습 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">일간 활성 사용자</span>
                <div className="flex items-center gap-2">
                  <Progress value={(mockStats.activity.dailyActiveUsers / mockStats.users.total) * 100} className="w-32" />
                  <span className="text-sm font-medium w-12">{mockStats.activity.dailyActiveUsers}명</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">주간 활성 사용자</span>
                <div className="flex items-center gap-2">
                  <Progress value={(mockStats.activity.weeklyActiveUsers / mockStats.users.total) * 100} className="w-32" />
                  <span className="text-sm font-medium w-12">{mockStats.activity.weeklyActiveUsers}명</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">월간 활성 사용자</span>
                <div className="flex items-center gap-2">
                  <Progress value={(mockStats.activity.monthlyActiveUsers / mockStats.users.total) * 100} className="w-32" />
                  <span className="text-sm font-medium w-12">{mockStats.activity.monthlyActiveUsers}명</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 인기 강좌 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>인기 강좌</CardTitle>
            <a href="/ta/courses" className="text-sm text-brand-primary hover:underline">
              전체 보기
            </a>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPopularCourses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{course.title}</p>
                      <p className="text-xs text-text-secondary">수강생 {course.enrollments}명</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{course.completionRate}%</p>
                    <p className="text-xs text-text-secondary">완료율</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 최근 가입 사용자 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>최근 가입 사용자</CardTitle>
            <a href="/ta/users" className="text-sm text-brand-primary hover:underline">
              전체 보기
            </a>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 text-sm font-medium text-text-secondary">이름</th>
                    <th className="text-left py-2 px-2 text-sm font-medium text-text-secondary">상태</th>
                    <th className="text-left py-2 px-2 text-sm font-medium text-text-secondary">역할</th>
                    <th className="text-left py-2 px-2 text-sm font-medium text-text-secondary">가입일</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecentUsers.map((user) => (
                    <tr key={user.id} className="border-b last:border-b-0 hover:bg-bg-secondary">
                      <td className="py-2 px-2">
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-text-secondary">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="py-2 px-2">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-2 px-2 text-sm text-text-secondary">{user.joinedAt}</td>
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
