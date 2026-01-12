import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Play,
  Pause,
  Zap,
  Calendar,
  FileDown,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Switch,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  EmptyState,
} from '@/components/common';
import {
  useAutoEnrollmentRules,
  useActivateAutoEnrollmentRule,
  useDeactivateAutoEnrollmentRule,
} from '@/hooks/ta';
import type {
  AutoEnrollmentRuleResponse,
  AutoEnrollmentTrigger,
} from '@/types/ta/autoEnrollmentRule.types';

// 트리거 라벨
const TRIGGER_LABELS: Record<AutoEnrollmentTrigger, string> = {
  USER_JOIN: '신규 입사',
  DEPARTMENT_ASSIGN: '부서 배정',
  ROLE_CHANGE: '역할 변경',
};

// 트리거 배지 색상
const triggerBadgeVariants: Record<AutoEnrollmentTrigger, 'green' | 'blue' | 'orange'> = {
  USER_JOIN: 'green',
  DEPARTMENT_ASSIGN: 'blue',
  ROLE_CHANGE: 'orange',
};

/**
 * TA 자동 입과 규칙 페이지
 * - 자동 입과 규칙 조회 전용 (CRUD는 TO에서 담당)
 * - 활성화/비활성화만 가능
 */
export const AutoEnrollmentRulesPage = () => {
  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrigger, setFilterTrigger] = useState<AutoEnrollmentTrigger | 'all'>('all');

  // API 훅
  const { data: rules, isLoading, error } = useAutoEnrollmentRules();
  const activateRule = useActivateAutoEnrollmentRule();
  const deactivateRule = useDeactivateAutoEnrollmentRule();

  // 필터링된 규칙 목록
  const filteredRules = useMemo(() => {
    if (!rules) return [];

    return rules.filter((rule) => {
      const matchesSearch =
        searchTerm === '' ||
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rule.description && rule.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTrigger = filterTrigger === 'all' || rule.trigger === filterTrigger;

      return matchesSearch && matchesTrigger;
    });
  }, [rules, searchTerm, filterTrigger]);

  // 통계 계산
  const stats = useMemo(() => ({
    total: rules?.length || 0,
    active: rules?.filter((r) => r.isActive).length || 0,
    inactive: rules?.filter((r) => !r.isActive).length || 0,
  }), [rules]);

  // 규칙 활성화/비활성화 토글
  const toggleRuleActive = async (rule: AutoEnrollmentRuleResponse) => {
    try {
      if (rule.isActive) {
        await deactivateRule.mutateAsync(rule.id);
      } else {
        await activateRule.mutateAsync(rule.id);
      }
    } catch {
      // 에러는 mutation의 onError에서 처리됨
    }
  };

  // 날짜 포맷
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: designTokens.text.secondary }} />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: designTokens.status.error_text }} />
          <p style={{ color: designTokens.text.secondary }}>데이터를 불러오는데 실패했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-10 min-h-full"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-[28px] font-semibold mb-2"
              style={{ color: designTokens.text.primary }}
            >
              자동 입과 규칙 조회
            </h1>
            <p className="text-sm" style={{ color: designTokens.text.secondary }}>
              자동 입과 규칙을 조회하고 활성화/비활성화할 수 있습니다. 규칙 생성/수정/삭제는 운영자(TO) 메뉴에서 가능합니다.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileDown className="w-4 h-4" />
              규칙 내보내기
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    전체 규칙
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.text.primary }}
                  >
                    {stats.total}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: designTokens.bg.secondary }}
                >
                  <Zap className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    활성 규칙
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.status.success_text }}
                  >
                    {stats.active}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: designTokens.status.success_background }}
                >
                  <Play className="w-5 h-5" style={{ color: designTokens.status.success_text }} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    비활성 규칙
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.text.secondary }}
                  >
                    {stats.inactive}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: designTokens.bg.secondary }}
                >
                  <Pause className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    트리거 유형
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.button.brand_default }}
                  >
                    3
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${designTokens.button.brand_default}15` }}
                >
                  <Calendar className="w-5 h-5" style={{ color: designTokens.button.brand_default }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 및 필터 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: designTokens.text.placeholder }}
                />
                <Input
                  placeholder="규칙명, 설명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={filterTrigger}
                onValueChange={(v) => setFilterTrigger(v as AutoEnrollmentTrigger | 'all')}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="트리거 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 유형</SelectItem>
                  <SelectItem value="USER_JOIN">신규 입사</SelectItem>
                  <SelectItem value="DEPARTMENT_ASSIGN">부서 배정</SelectItem>
                  <SelectItem value="ROLE_CHANGE">역할 변경</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 규칙 목록 테이블 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>규칙 목록</CardTitle>
              <Badge variant="gray">{filteredRules.length}개</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRules.length === 0 ? (
              <EmptyState
                icon={Zap}
                title="등록된 규칙이 없습니다"
                description="운영자(TO) 메뉴에서 자동 입과 규칙을 생성할 수 있습니다."
                className="py-12"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>규칙명</TableHead>
                    <TableHead>트리거</TableHead>
                    <TableHead>대상 부서</TableHead>
                    <TableHead>대상 차수</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: designTokens.text.primary }}
                          >
                            {rule.name}
                          </p>
                          {rule.description && (
                            <p
                              className="text-xs mt-0.5 line-clamp-1"
                              style={{ color: designTokens.text.secondary }}
                            >
                              {rule.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={triggerBadgeVariants[rule.trigger]}>
                          {TRIGGER_LABELS[rule.trigger]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: designTokens.text.secondary }}>
                          {rule.departmentName || '전체'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: designTokens.text.primary }}>
                          {rule.courseTimeTitle || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: designTokens.text.secondary }}>
                          {formatDate(rule.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRuleActive(rule)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
