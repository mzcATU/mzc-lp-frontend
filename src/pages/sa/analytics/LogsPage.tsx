import { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  Loader2,
  Building2,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';
import { useSaActivityLogs, useSaActivityStats } from '@/hooks/sa';
import type { ActivityType } from '@/services/sa/analyticsService';

// 활동 타입별 레벨 매핑
const getLogLevel = (activityType: ActivityType): 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' => {
  const errorTypes: ActivityType[] = ['LOGIN_FAILED'];
  const warnTypes: ActivityType[] = ['USER_DELETE', 'COURSE_DELETE', 'ENROLLMENT_DROP', 'PROGRAM_REJECT'];

  if (errorTypes.includes(activityType)) return 'ERROR';
  if (warnTypes.includes(activityType)) return 'WARN';
  return 'INFO';
};

// 활동 타입별 카테고리 매핑
const getCategory = (activityType: ActivityType): string => {
  if (['LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGE'].includes(activityType)) return 'AUTH';
  if (['USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'ROLE_CHANGE'].includes(activityType)) return 'USER';
  if (['COURSE_VIEW', 'COURSE_CREATE', 'COURSE_UPDATE', 'COURSE_DELETE'].includes(activityType)) return 'COURSE';
  if (['PROGRAM_CREATE', 'PROGRAM_UPDATE', 'PROGRAM_APPROVE', 'PROGRAM_REJECT'].includes(activityType)) return 'PROGRAM';
  if (['ENROLLMENT_CREATE', 'ENROLLMENT_COMPLETE', 'ENROLLMENT_DROP'].includes(activityType)) return 'ENROLLMENT';
  if (['CONTENT_VIEW', 'CONTENT_COMPLETE'].includes(activityType)) return 'CONTENT';
  if (['SETTINGS_UPDATE'].includes(activityType)) return 'SETTINGS';
  if (['TENANT_CREATE', 'TENANT_UPDATE'].includes(activityType)) return 'TENANT';
  return 'SYSTEM';
};

const levelConfig = {
  INFO: { icon: Info, color: 'bg-blue-100 text-blue-700' },
  WARN: { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700' },
  ERROR: { icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  DEBUG: { icon: CheckCircle, color: 'bg-gray-100 text-gray-700' },
};

const activityTypeOptions: { value: ActivityType; label: string }[] = [
  { value: 'LOGIN', label: '로그인' },
  { value: 'LOGOUT', label: '로그아웃' },
  { value: 'LOGIN_FAILED', label: '로그인 실패' },
  { value: 'USER_CREATE', label: '사용자 생성' },
  { value: 'USER_DELETE', label: '사용자 삭제' },
  { value: 'COURSE_CREATE', label: '강좌 생성' },
  { value: 'TENANT_CREATE', label: '테넌트 생성' },
  { value: 'TENANT_UPDATE', label: '테넌트 수정' },
  { value: 'SETTINGS_UPDATE', label: '설정 변경' },
];

export function LogsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<ActivityType | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data: logsData, isLoading, error } = useSaActivityLogs({
    type: typeFilter,
    page,
    size: 50,
  });
  const { data: stats } = useSaActivityStats(30);

  const logs = logsData?.content || [];

  // 클라이언트 사이드 필터링 (검색어, 레벨)
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = !searchKeyword ||
      log.description?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.userName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.activityTypeLabel?.toLowerCase().includes(searchKeyword.toLowerCase());

    const logLevel = getLogLevel(log.activityType);
    const matchesLevel = levelFilter === 'all' || logLevel === levelFilter;

    return matchesSearch && matchesLevel;
  });

  // 레벨별 카운트
  const levelCounts = {
    INFO: logs.filter(l => getLogLevel(l.activityType) === 'INFO').length,
    WARN: logs.filter(l => getLogLevel(l.activityType) === 'WARN').length,
    ERROR: logs.filter(l => getLogLevel(l.activityType) === 'ERROR').length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 text-red-500">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      );
    }

    if (filteredLogs.length === 0) {
      return (
        <div className="text-center py-12 text-text-secondary">
          시스템 로그가 없습니다.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {filteredLogs.map((log) => {
          const level = getLogLevel(log.activityType);
          const category = getCategory(log.activityType);
          const config = levelConfig[level];
          const LevelIcon = config.icon;

          return (
            <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-bg-secondary font-mono text-sm">
              <Badge className={`${config.color} shrink-0`}>
                <LevelIcon className="h-3 w-3 mr-1" />
                {level}
              </Badge>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-text-secondary">{formatDate(log.createdAt)}</span>
                  <Badge variant="outline">{category}</Badge>
                  <span className="text-text-secondary">[{log.activityTypeLabel}]</span>
                </div>
                <p className="truncate">{log.description}</p>
                <div className="flex gap-2 mt-1 text-xs text-text-secondary">
                  {log.userName && <span>User: {log.userName}</span>}
                  {log.tenantId && (
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      Tenant: {log.tenantId}
                    </span>
                  )}
                  {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="시스템 로그"
        description="시스템 전체 로그를 조회하고 분석합니다"
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            로그 내보내기
          </Button>
        }
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalActivities || levelCounts.INFO}</p>
                <p className="text-sm text-text-secondary">INFO</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{levelCounts.WARN}</p>
                <p className="text-sm text-text-secondary">WARNING</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{levelCounts.ERROR}</p>
                <p className="text-sm text-text-secondary">ERROR</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalActivities || logs.length}</p>
                <p className="text-sm text-text-secondary">전체 로그</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>로그 목록</CardTitle>
              <CardDescription>최근 시스템 로그입니다</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="메시지 검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="레벨" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 레벨</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={typeFilter || 'all'}
                onValueChange={(v) => setTypeFilter(v === 'all' ? undefined : v as ActivityType)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="활동 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {activityTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}

          {/* Pagination */}
          {logsData && logsData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={logsData.first}
              >
                이전
              </Button>
              <span className="text-sm text-text-secondary">
                {logsData.number + 1} / {logsData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={logsData.last}
              >
                다음
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
