import { useState } from 'react';
import {
  Activity,
  Users,
  PlayCircle,
  Clock,
  Calendar,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';

// Mock 데이터
const mockActivityStats = {
  dailyActiveUsers: 2450,
  dailyActiveChange: 12.5,
  avgSessionTime: 45,
  sessionTimeChange: -3.2,
  courseCompletions: 156,
  completionChange: 8.7,
  videoPlays: 12500,
  videoPlayChange: 15.3,
};

const mockHourlyActivity = [
  { hour: '00', users: 120 },
  { hour: '06', users: 450 },
  { hour: '09', users: 1850 },
  { hour: '12', users: 1200 },
  { hour: '15', users: 1650 },
  { hour: '18', users: 980 },
  { hour: '21', users: 560 },
];

const mockRecentActivity: {
  id: number;
  type: 'LOGIN' | 'COURSE_START' | 'COURSE_COMPLETE' | 'VIDEO_PLAY';
  userName: string;
  tenantName: string;
  detail: string;
  timestamp: string;
}[] = [
  { id: 1, type: 'LOGIN', userName: '김학습', tenantName: '메가존클라우드', detail: '로그인', timestamp: '1분 전' },
  { id: 2, type: 'COURSE_COMPLETE', userName: '이수강', tenantName: '삼성전자', detail: 'AWS 기초 과정 완료', timestamp: '3분 전' },
  { id: 3, type: 'VIDEO_PLAY', userName: '박시청', tenantName: 'LG전자', detail: 'React 입문 1강 시청', timestamp: '5분 전' },
  { id: 4, type: 'COURSE_START', userName: '최학생', tenantName: '카카오', detail: 'Python 기초 시작', timestamp: '8분 전' },
  { id: 5, type: 'LOGIN', userName: '정사용', tenantName: '네이버', detail: '로그인', timestamp: '10분 전' },
];

const activityTypeConfig = {
  LOGIN: { label: '로그인', color: 'bg-blue-100 text-blue-700' },
  COURSE_START: { label: '강좌 시작', color: 'bg-green-100 text-green-700' },
  COURSE_COMPLETE: { label: '강좌 완료', color: 'bg-purple-100 text-purple-700' },
  VIDEO_PLAY: { label: '영상 시청', color: 'bg-orange-100 text-orange-700' },
};

export function ActivityPage() {
  const [period, setPeriod] = useState('today');

  return (
    <div className="p-6">
      <AdminPageHeader
        title="활동 분석"
        description="사용자 활동 현황을 실시간으로 분석합니다"
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">오늘</SelectItem>
              <SelectItem value="yesterday">어제</SelectItem>
              <SelectItem value="7d">최근 7일</SelectItem>
              <SelectItem value="30d">최근 30일</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Activity Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockActivityStats.dailyActiveUsers.toLocaleString()}</p>
                <p className="text-sm text-text-secondary">일일 활성 사용자</p>
              </div>
            </div>
            <div className={`mt-2 text-xs flex items-center gap-1 ${mockActivityStats.dailyActiveChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {mockActivityStats.dailyActiveChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(mockActivityStats.dailyActiveChange)}% vs 어제
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
                <p className="text-2xl font-bold">{mockActivityStats.avgSessionTime}분</p>
                <p className="text-sm text-text-secondary">평균 세션 시간</p>
              </div>
            </div>
            <div className={`mt-2 text-xs flex items-center gap-1 ${mockActivityStats.sessionTimeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {mockActivityStats.sessionTimeChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(mockActivityStats.sessionTimeChange)}% vs 어제
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
                <p className="text-2xl font-bold">{mockActivityStats.courseCompletions}</p>
                <p className="text-sm text-text-secondary">강좌 완료</p>
              </div>
            </div>
            <div className={`mt-2 text-xs flex items-center gap-1 ${mockActivityStats.completionChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {mockActivityStats.completionChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(mockActivityStats.completionChange)}% vs 어제
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
                <p className="text-2xl font-bold">{(mockActivityStats.videoPlays / 1000).toFixed(1)}K</p>
                <p className="text-sm text-text-secondary">영상 재생</p>
              </div>
            </div>
            <div className={`mt-2 text-xs flex items-center gap-1 ${mockActivityStats.videoPlayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {mockActivityStats.videoPlayChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(mockActivityStats.videoPlayChange)}% vs 어제
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Hourly Activity Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>시간대별 활성 사용자</CardTitle>
            <CardDescription>오늘의 시간대별 사용자 활동 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {mockHourlyActivity.map((item) => {
                const maxUsers = Math.max(...mockHourlyActivity.map(h => h.users));
                const height = (item.users / maxUsers) * 100;

                return (
                  <div key={item.hour} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-brand-primary/80 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-text-secondary mt-2">{item.hour}시</span>
                  </div>
                );
              })}
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
              {mockRecentActivity.map((activity) => {
                const config = activityTypeConfig[activity.type];

                return (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
                        {config.label}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{activity.userName}</p>
                        <p className="text-xs text-text-secondary">{activity.tenantName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{activity.detail}</p>
                      <p className="text-xs text-text-secondary">{activity.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
