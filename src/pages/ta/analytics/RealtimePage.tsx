import { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  PlayCircle,
  Clock,
  TrendingUp,
  Monitor,
  RefreshCw,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

// Mock 데이터
const mockRealtimeStats = {
  activeUsers: 342,
  activeSessions: 389,
  currentViewers: 156,
  avgSessionTime: 28,
};

const mockActiveUsers: {
  id: number;
  name: string;
  activity: string;
  course?: string;
  duration: string;
  device: 'desktop' | 'mobile' | 'tablet';
}[] = [
  { id: 1, name: '김학습', activity: '영상 시청', course: 'AWS 기초 과정', duration: '15분', device: 'desktop' },
  { id: 2, name: '이수강', activity: '퀴즈 풀이', course: 'React 입문', duration: '8분', device: 'mobile' },
  { id: 3, name: '박사용', activity: '강좌 탐색', duration: '3분', device: 'desktop' },
  { id: 4, name: '최학생', activity: '영상 시청', course: 'Python 기초', duration: '22분', device: 'tablet' },
  { id: 5, name: '정배움', activity: '과제 제출', course: 'Java 심화', duration: '5분', device: 'desktop' },
];

const mockPopularCourses: {
  id: number;
  title: string;
  viewers: number;
  change: number;
}[] = [
  { id: 1, title: 'AWS 기초 과정', viewers: 45, change: 12 },
  { id: 2, title: 'React 입문', viewers: 38, change: -3 },
  { id: 3, title: 'Python 기초', viewers: 32, change: 8 },
  { id: 4, title: 'Java 심화', viewers: 24, change: 5 },
  { id: 5, title: 'Kubernetes 실전', viewers: 17, change: -2 },
];

const deviceIcons = {
  desktop: Monitor,
  mobile: Monitor,
  tablet: Monitor,
};

export function RealtimePage() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <AdminPageHeader
        title="실시간 데이터 현황"
        description="현재 플랫폼 사용 현황을 실시간으로 모니터링합니다"
        actions={
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        }
      />

      <p className="text-sm text-text-secondary mb-6">
        마지막 업데이트: {lastUpdate.toLocaleTimeString()}
      </p>

      {/* Realtime Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="relative">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold">{mockRealtimeStats.activeUsers}</p>
                <p className="text-sm text-text-secondary">현재 접속자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockRealtimeStats.activeSessions}</p>
                <p className="text-sm text-text-secondary">활성 세션</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PlayCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockRealtimeStats.currentViewers}</p>
                <p className="text-sm text-text-secondary">영상 시청중</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockRealtimeStats.avgSessionTime}분</p>
                <p className="text-sm text-text-secondary">평균 체류시간</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Active Users */}
        <Card>
          <CardHeader>
            <CardTitle>현재 활동 중인 사용자</CardTitle>
            <CardDescription>실시간 사용자 활동 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockActiveUsers.map((user) => {
                const DeviceIcon = deviceIcons[user.device];
                return (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-brand-primary">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-text-secondary">
                          {user.activity}
                          {user.course && ` - ${user.course}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {user.duration}
                      </Badge>
                      <DeviceIcon className="h-4 w-4 text-text-secondary" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Popular Courses */}
        <Card>
          <CardHeader>
            <CardTitle>인기 강좌 (실시간)</CardTitle>
            <CardDescription>현재 시청자 수 기준</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPopularCourses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="font-medium">{course.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      <PlayCircle className="h-4 w-4 inline mr-1 text-text-secondary" />
                      {course.viewers}명
                    </span>
                    <span className={`text-xs flex items-center ${
                      course.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 mr-0.5 ${course.change < 0 ? 'rotate-180' : ''}`} />
                      {Math.abs(course.change)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
