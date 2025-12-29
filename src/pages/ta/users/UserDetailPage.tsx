import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  BookOpen,
  Clock,
  Award,
  User,
  Mail,
  Building,
  Calendar,
  Activity,
} from 'lucide-react';
import {
  AdminPageHeader,
  StatusBadge,
  RoleBadge,
} from '@/components/domain/admin';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/Avatar';
import { Progress } from '@/components/common/Progress';
import type { UserStatus, SystemRole } from '@/components/domain/admin';

// Mock 데이터
interface CourseEnrollment {
  id: number;
  title: string;
  progress: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';
  enrolledAt: string;
  completedAt?: string;
}

interface ActivityLog {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  type: 'login' | 'course' | 'assessment' | 'profile';
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  role: SystemRole;
  department?: string;
  phone?: string;
  position?: string;
  createdAt: string;
  lastActiveAt: string;
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalLearningTime: number; // hours
    averageScore: number;
  };
  enrollments: CourseEnrollment[];
  activityLogs: ActivityLog[];
}

const mockUserDetail: UserDetail = {
  id: 1,
  name: '김민수',
  email: 'minsu.kim@company.com',
  status: 'ACTIVE',
  role: 'OPERATOR',
  department: '개발팀',
  phone: '010-1234-5678',
  position: '시니어 개발자',
  createdAt: '2025-01-15',
  lastActiveAt: '2025-12-29',
  stats: {
    totalCourses: 12,
    completedCourses: 8,
    inProgressCourses: 3,
    totalLearningTime: 45,
    averageScore: 87,
  },
  enrollments: [
    { id: 1, title: 'AWS 기초 마스터', progress: 100, status: 'COMPLETED', enrolledAt: '2025-01-20', completedAt: '2025-02-15' },
    { id: 2, title: 'React 실전 프로젝트', progress: 75, status: 'IN_PROGRESS', enrolledAt: '2025-02-01' },
    { id: 3, title: 'TypeScript 완벽 가이드', progress: 60, status: 'IN_PROGRESS', enrolledAt: '2025-02-10' },
    { id: 4, title: 'Docker & Kubernetes', progress: 100, status: 'COMPLETED', enrolledAt: '2025-01-10', completedAt: '2025-01-25' },
    { id: 5, title: 'Python 데이터 분석', progress: 0, status: 'NOT_STARTED', enrolledAt: '2025-12-20' },
  ],
  activityLogs: [
    { id: 1, action: '로그인', description: '시스템에 로그인했습니다.', timestamp: '2025-12-29 09:15:00', type: 'login' },
    { id: 2, action: '강의 수강', description: 'React 실전 프로젝트 - 챕터 5 완료', timestamp: '2025-12-29 10:30:00', type: 'course' },
    { id: 3, action: '평가 완료', description: 'TypeScript 중간 테스트 완료 (85점)', timestamp: '2025-12-28 14:20:00', type: 'assessment' },
    { id: 4, action: '프로필 수정', description: '프로필 정보를 업데이트했습니다.', timestamp: '2025-12-27 16:45:00', type: 'profile' },
    { id: 5, action: '강의 수강', description: 'AWS 기초 마스터 - 수료', timestamp: '2025-12-25 11:00:00', type: 'course' },
  ],
};

const courseStatusLabels = {
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
  NOT_STARTED: '미시작',
};

const courseStatusColors = {
  IN_PROGRESS: 'text-blue-600 bg-blue-50',
  COMPLETED: 'text-green-600 bg-green-50',
  NOT_STARTED: 'text-gray-600 bg-gray-50',
};

const activityIcons = {
  login: Clock,
  course: BookOpen,
  assessment: Award,
  profile: User,
};

export function UserDetailPage() {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 실제로는 API에서 id를 사용해 데이터를 가져옴
  const [user, setUser] = useState<UserDetail>(mockUserDetail);

  const handleSave = () => {
    console.log('Save user:', user);
  };

  const handleStatusChange = (status: UserStatus) => {
    setUser({ ...user, status });
  };

  const handleRoleChange = (role: SystemRole) => {
    setUser({ ...user, role });
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title={user.name}
        description={user.email}
        breadcrumb={[
          { label: '사용자 관리', href: '/ta/users' },
          { label: user.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/ta/users')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </div>
        }
      />

      {/* 사용자 프로필 카드 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
              <AvatarFallback className="text-2xl">{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold">{user.name}</h2>
                <StatusBadge status={user.status} />
                <RoleBadge role={user.role} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Building className="h-4 w-4" />
                  {user.department || '-'} {user.position && `/ ${user.position}`}
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="h-4 w-4" />
                  가입일: {user.createdAt}
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Activity className="h-4 w-4" />
                  최근 활동: {user.lastActiveAt}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 학습 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-brand-primary">{user.stats.totalCourses}</p>
            <p className="text-sm text-text-secondary">전체 강좌</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{user.stats.completedCourses}</p>
            <p className="text-sm text-text-secondary">완료</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{user.stats.inProgressCourses}</p>
            <p className="text-sm text-text-secondary">진행 중</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{user.stats.totalLearningTime}h</p>
            <p className="text-sm text-text-secondary">총 학습 시간</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-yellow-600">{user.stats.averageScore}점</p>
            <p className="text-sm text-text-secondary">평균 점수</p>
          </CardContent>
        </Card>
      </div>

      {/* 탭 컨텐츠 */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">
            <User className="w-4 h-4 mr-2" />
            기본 정보
          </TabsTrigger>
          <TabsTrigger value="courses">
            <BookOpen className="w-4 h-4 mr-2" />
            수강 현황
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="w-4 h-4 mr-2" />
            활동 이력
          </TabsTrigger>
        </TabsList>

        {/* 기본 정보 탭 */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>사용자의 기본 정보를 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-bg-secondary"
                  />
                  <p className="text-xs text-text-secondary">이메일은 변경할 수 없습니다.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    value={user.phone || ''}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    placeholder="010-0000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">부서</Label>
                  <Input
                    id="department"
                    value={user.department || ''}
                    onChange={(e) => setUser({ ...user, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">직책</Label>
                  <Input
                    id="position"
                    value={user.position || ''}
                    onChange={(e) => setUser({ ...user, position: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select value={user.status} onValueChange={(v) => handleStatusChange(v as UserStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">활성</SelectItem>
                      <SelectItem value="INACTIVE">비활성</SelectItem>
                      <SelectItem value="PENDING">대기</SelectItem>
                      <SelectItem value="BLOCKED">차단</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">권한 설정</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="role">시스템 역할</Label>
                    <Select value={user.role} onValueChange={(v) => handleRoleChange(v as SystemRole)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">일반 사용자</SelectItem>
                        <SelectItem value="OPERATOR">운영자</SelectItem>
                        <SelectItem value="TENANT_ADMIN">테넌트 관리자</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-text-secondary">
                      역할에 따라 접근 가능한 기능이 달라집니다.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 수강 현황 탭 */}
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>수강 현황</CardTitle>
              <CardDescription>사용자가 등록한 강좌와 진도율을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-bg-secondary transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{enrollment.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${courseStatusColors[enrollment.status]}`}>
                          {courseStatusLabels[enrollment.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span>등록일: {enrollment.enrolledAt}</span>
                        {enrollment.completedAt && <span>완료일: {enrollment.completedAt}</span>}
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 활동 이력 탭 */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>활동 이력</CardTitle>
              <CardDescription>사용자의 최근 활동 내역을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                <div className="space-y-6">
                  {user.activityLogs.map((log) => {
                    const Icon = activityIcons[log.type];
                    return (
                      <div key={log.id} className="relative flex gap-4 pl-10">
                        {/* Timeline dot */}
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-bg-secondary border-2 border-border flex items-center justify-center">
                          <Icon className="w-4 h-4 text-text-secondary" />
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{log.action}</h4>
                            <span className="text-sm text-text-secondary">{log.timestamp}</span>
                          </div>
                          <p className="text-sm text-text-secondary mt-1">{log.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
