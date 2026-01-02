import {
  Users,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  StatsCard,
  StatsGrid,
} from '@/components/common';

// 최근 활동 데이터 타입
interface RecentActivity {
  id: string;
  type: 'enrollment' | 'completion' | 'alert';
  title: string;
  description: string;
  time: string;
}

// 샘플 최근 활동 데이터
const recentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'enrollment',
    title: '신규 수강 신청',
    description: '김철수 외 12명이 "리더십 기초" 과정을 신청했습니다.',
    time: '10분 전',
  },
  {
    id: '2',
    type: 'completion',
    title: '과정 이수 완료',
    description: '개발팀 8명이 "정보보안 교육"을 이수했습니다.',
    time: '1시간 전',
  },
  {
    id: '3',
    type: 'alert',
    title: '필수 교육 미이수 알림',
    description: '마케팅팀 3명의 필수 교육 이수 기한이 임박했습니다.',
    time: '2시간 전',
  },
  {
    id: '4',
    type: 'enrollment',
    title: '신규 수강 신청',
    description: '이영희 외 5명이 "AI 활용 실무" 과정을 신청했습니다.',
    time: '3시간 전',
  },
];

// 활동 타입별 아이콘 매핑
const activityIcons = {
  enrollment: Users,
  completion: CheckCircle2,
  alert: AlertCircle,
};

// 활동 타입별 색상 매핑
const activityColors = {
  enrollment: designTokens.badge.blue,
  completion: designTokens.badge.green,
  alert: designTokens.badge.orange,
};

export const SiteOperationDashboard = () => {
  return (
    <div
      className="h-full overflow-auto p-8"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
        <div className="max-w-[1200px] mx-auto">
          {/* 페이지 헤더 */}
          <header className="mb-8">
            <h1
              className="text-[28px] font-semibold mb-2"
              style={{ color: designTokens.text.primary }}
            >
              사이트 운영 현황
            </h1>
            <p
              className="text-sm"
              style={{ color: designTokens.text.secondary }}
            >
              사이트 전체 운영 현황을 한눈에 확인하세요.
            </p>
          </header>

          {/* 상단 요약 정보 카드 */}
          <StatsGrid columns={4} className="mb-8">
            <StatsCard
              title="전체 수강생"
              value="1,234"
              description="이번 달"
              icon={Users}
              trend={{ value: 12, label: '전월 대비' }}
            />
            <StatsCard
              title="진행 중 교육"
              value="45"
              description="개 과정"
              icon={BookOpen}
              trend={{ value: 5, label: '전월 대비' }}
            />
            <StatsCard
              title="금일 학습 시간"
              value="2,345"
              description="시간"
              icon={Clock}
              trend={{ value: 8, label: '전일 대비' }}
            />
            <StatsCard
              title="평균 이수율"
              value="78%"
              description="전체 과정"
              icon={TrendingUp}
              trend={{ value: 3, label: '전월 대비' }}
            />
          </StatsGrid>

          {/* 콘텐츠 그리드 */}
          <div className="grid grid-cols-3 gap-6">
            {/* 최근 활동 */}
            <div className="col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">최근 활동</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    전체 보기
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const Icon = activityIcons[activity.type];
                      const colors = activityColors[activity.type];
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-[#F5F5F5]"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: colors.bg }}
                          >
                            <Icon
                              className="w-5 h-5"
                              style={{ color: colors.text }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-medium text-sm"
                              style={{ color: designTokens.text.primary }}
                            >
                              {activity.title}
                            </p>
                            <p
                              className="text-sm mt-0.5 truncate"
                              style={{ color: designTokens.text.secondary }}
                            >
                              {activity.description}
                            </p>
                          </div>
                          <span
                            className="text-xs flex-shrink-0"
                            style={{ color: designTokens.text.placeholder }}
                          >
                            {activity.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 빠른 액션 */}
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">빠른 액션</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    style={{
                      borderColor: designTokens.bg.border,
                      color: designTokens.text.primary,
                    }}
                  >
                    수강 신청 관리
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    style={{
                      borderColor: designTokens.bg.border,
                      color: designTokens.text.primary,
                    }}
                  >
                    필수 교육 현황
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    style={{
                      borderColor: designTokens.bg.border,
                      color: designTokens.text.primary,
                    }}
                  >
                    학습 통계 리포트
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    style={{
                      borderColor: designTokens.bg.border,
                      color: designTokens.text.primary,
                    }}
                  >
                    콘텐츠 업로드
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* 알림 카드 */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle
                      className="w-5 h-5"
                      style={{ color: designTokens.status.warning_text }}
                    />
                    주의 필요
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: designTokens.status.warning_background }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: designTokens.status.warning_text }}
                    >
                      필수 교육 미이수자 15명
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: designTokens.text.secondary }}
                    >
                      이수 기한: 2025.01.31
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </div>
  );
}
