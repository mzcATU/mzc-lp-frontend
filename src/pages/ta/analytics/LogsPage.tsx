import { useState } from 'react';
import {
  Search,
  Download,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  Loader2,
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
import { useActivityLogs, useActivityStats } from '@/hooks/ta';
import type { ActivityType } from '@/services/ta/analyticsService';
import { designTokens } from '@/styles/admin-design-tokens';

// 활동 타입별 레벨 매핑
const getLogLevel = (activityType: ActivityType): 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' => {
  const errorTypes: ActivityType[] = ['LOGIN_FAILED'];
  const successTypes: ActivityType[] = ['ENROLLMENT_COMPLETE', 'CONTENT_COMPLETE', 'PROGRAM_APPROVE'];
  const warnTypes: ActivityType[] = ['USER_DELETE', 'COURSE_DELETE', 'ENROLLMENT_DROP', 'PROGRAM_REJECT'];

  if (errorTypes.includes(activityType)) return 'ERROR';
  if (successTypes.includes(activityType)) return 'SUCCESS';
  if (warnTypes.includes(activityType)) return 'WARN';
  return 'INFO';
};

// 활동 타입별 카테고리 매핑
const getCategory = (activityType: ActivityType): string => {
  if (['LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGE'].includes(activityType)) return '인증';
  if (['USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'ROLE_CHANGE'].includes(activityType)) return '사용자';
  if (['COURSE_VIEW', 'COURSE_CREATE', 'COURSE_UPDATE', 'COURSE_DELETE'].includes(activityType)) return '강좌';
  if (['PROGRAM_CREATE', 'PROGRAM_UPDATE', 'PROGRAM_APPROVE', 'PROGRAM_REJECT'].includes(activityType)) return '과정';
  if (['ENROLLMENT_CREATE', 'ENROLLMENT_COMPLETE', 'ENROLLMENT_DROP'].includes(activityType)) return '수강';
  if (['CONTENT_VIEW', 'CONTENT_COMPLETE'].includes(activityType)) return '콘텐츠';
  if (['SETTINGS_UPDATE', 'TENANT_CREATE', 'TENANT_UPDATE'].includes(activityType)) return '설정';
  return '기타';
};

const levelConfig = {
  INFO: {
    icon: Info,
    badgeStyle: { backgroundColor: designTokens.badge.blue.bg, color: designTokens.badge.blue.text },
    iconContainerStyle: { backgroundColor: designTokens.badge.blue.bg },
    iconStyle: { color: designTokens.badge.blue.text },
  },
  WARN: {
    icon: AlertTriangle,
    badgeStyle: { backgroundColor: designTokens.status.warning_background, color: designTokens.status.warning_text },
    iconContainerStyle: { backgroundColor: designTokens.badge.yellow.bg },
    iconStyle: { color: designTokens.badge.yellow.text },
  },
  ERROR: {
    icon: AlertCircle,
    badgeStyle: { backgroundColor: designTokens.status.error_background, color: designTokens.status.error_text },
    iconContainerStyle: { backgroundColor: designTokens.badge.red.bg },
    iconStyle: { color: designTokens.badge.red.text },
  },
  SUCCESS: {
    icon: CheckCircle,
    badgeStyle: { backgroundColor: designTokens.status.success_background, color: designTokens.status.success_text },
    iconContainerStyle: { backgroundColor: designTokens.badge.green.bg },
    iconStyle: { color: designTokens.badge.green.text },
  },
};

const activityTypeOptions: { value: ActivityType; label: string }[] = [
  { value: 'LOGIN', label: '로그인' },
  { value: 'LOGOUT', label: '로그아웃' },
  { value: 'LOGIN_FAILED', label: '로그인 실패' },
  { value: 'USER_CREATE', label: '사용자 생성' },
  { value: 'USER_UPDATE', label: '사용자 수정' },
  { value: 'USER_DELETE', label: '사용자 삭제' },
  { value: 'COURSE_VIEW', label: '강좌 조회' },
  { value: 'COURSE_CREATE', label: '강좌 생성' },
  { value: 'ENROLLMENT_CREATE', label: '수강 신청' },
  { value: 'ENROLLMENT_COMPLETE', label: '수강 완료' },
];

export function LogsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<ActivityType | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data: logsData, isLoading, error } = useActivityLogs({
    type: typeFilter,
    page,
    size: 50,
  });
  const { data: stats } = useActivityStats(30);

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
    SUCCESS: logs.filter(l => getLogLevel(l.activityType) === 'SUCCESS').length,
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

  return (
    <div className="p-6">
      <AdminPageHeader
        title="이력 분석 및 로그 관리"
        description="테넌트 활동 로그를 조회하고 분석합니다"
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
              <div className="p-2 rounded-lg" style={{ backgroundColor: designTokens.badge.blue.bg }}>
                <Info className="h-5 w-5" style={{ color: designTokens.badge.blue.text }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: designTokens.text.primary }}>
                  {stats?.totalActivities || levelCounts.INFO}
                </p>
                <p className="text-sm" style={{ color: designTokens.text.secondary }}>전체 활동</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: designTokens.badge.green.bg }}>
                <CheckCircle className="h-5 w-5" style={{ color: designTokens.badge.green.text }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: designTokens.text.primary }}>
                  {stats?.todayActivities || levelCounts.SUCCESS}
                </p>
                <p className="text-sm" style={{ color: designTokens.text.secondary }}>오늘 활동</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: designTokens.badge.yellow.bg }}>
                <AlertTriangle className="h-5 w-5" style={{ color: designTokens.badge.yellow.text }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: designTokens.text.primary }}>
                  {levelCounts.WARN}
                </p>
                <p className="text-sm" style={{ color: designTokens.text.secondary }}>경고</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: designTokens.badge.red.bg }}>
                <AlertCircle className="h-5 w-5" style={{ color: designTokens.badge.red.text }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: designTokens.text.primary }}>
                  {levelCounts.ERROR}
                </p>
                <p className="text-sm" style={{ color: designTokens.text.secondary }}>오류</p>
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
              <CardTitle>활동 로그</CardTitle>
              <CardDescription>테넌트 내 모든 활동 기록입니다</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: designTokens.text.secondary }}
                />
                <Input
                  placeholder="검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="레벨" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="INFO">정보</SelectItem>
                  <SelectItem value="SUCCESS">성공</SelectItem>
                  <SelectItem value="WARN">경고</SelectItem>
                  <SelectItem value="ERROR">오류</SelectItem>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: designTokens.button.brand_default }} />
            </div>
          ) : error ? (
            <div className="text-center py-12" style={{ color: designTokens.status.error_text }}>
              데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12" style={{ color: designTokens.text.secondary }}>
              활동 로그가 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => {
                const level = getLogLevel(log.activityType);
                const category = getCategory(log.activityType);
                const config = levelConfig[level];
                const LevelIcon = config.icon;

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                    style={{
                      border: `1px solid ${designTokens.bg.border}`,
                      backgroundColor: designTokens.bg.default,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = designTokens.bg.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = designTokens.bg.default;
                    }}
                  >
                    <div
                      className="shrink-0 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                      style={config.badgeStyle}
                    >
                      <LevelIcon className="h-3 w-3" />
                      {level}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{category}</Badge>
                        <span className="font-medium" style={{ color: designTokens.text.primary }}>
                          {log.activityTypeLabel}
                        </span>
                        {log.userName && (
                          <span className="text-sm flex items-center gap-1" style={{ color: designTokens.text.secondary }}>
                            <User className="h-3 w-3" />
                            {log.userName}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1" style={{ color: designTokens.text.primary }}>
                        {log.description}
                      </p>
                      {log.targetName && (
                        <p className="text-xs mt-1" style={{ color: designTokens.text.secondary }}>
                          대상: {log.targetType} - {log.targetName}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: designTokens.text.secondary }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(log.createdAt)}
                        </span>
                        {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {logsData && logsData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={logsData.first}
                style={logsData.first ? {
                  backgroundColor: designTokens.status.neutral_disabled_bg,
                  color: designTokens.status.neutral_disabled_text,
                  cursor: 'not-allowed',
                  opacity: 0.6,
                } : undefined}
              >
                이전
              </Button>
              <span className="text-sm" style={{ color: designTokens.text.secondary }}>
                {logsData.number + 1} / {logsData.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={logsData.last}
                style={logsData.last ? {
                  backgroundColor: designTokens.status.neutral_disabled_bg,
                  color: designTokens.status.neutral_disabled_text,
                  cursor: 'not-allowed',
                  opacity: 0.6,
                } : undefined}
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
