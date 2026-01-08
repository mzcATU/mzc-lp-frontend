import { useState, useMemo } from 'react';
import {
  Search,
  Users,
  UserPlus,
  ChevronRight,
  GraduationCap,
  FileDown,
  Loader2,
  AlertCircle,
  Play,
  Pause,
} from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  EmptyState,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/common';
import { cn } from '@/utils/cn';
import {
  useMemberPools,
  useMemberPool,
  useMemberPoolMembers,
} from '@/hooks/ta';
import type {
  MemberPoolResponse,
  MemberPoolMemberDto,
  EmployeeStatus,
} from '@/types/to/memberPool.types';

// 직원 상태 라벨
const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  ACTIVE: '재직',
  ON_LEAVE: '휴직',
  RESIGNED: '퇴직',
};

/**
 * TA 회원 풀 페이지
 * - 회원 풀 조회 전용 (CRUD는 TO에서 담당)
 * - 조건 기반 직원 그룹 확인
 */
export const MemberPoolPage = () => {
  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);

  // 선택된 풀 상태
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(null);

  // 멤버 목록 페이징
  const [memberPage, setMemberPage] = useState(0);

  // API 훅
  const { data: memberPools, isLoading, error } = useMemberPools({
    search: searchTerm || undefined,
    isActive: filterActive,
  });

  const { data: selectedPool } = useMemberPool(selectedPoolId || 0);
  const { data: membersData, isLoading: isMembersLoading } = useMemberPoolMembers(
    selectedPoolId || 0,
    { page: memberPage, size: 10 }
  );

  // 통계 계산
  const stats = useMemo(() => ({
    total: memberPools?.length || 0,
    active: memberPools?.filter((p) => p.isActive).length || 0,
    inactive: memberPools?.filter((p) => !p.isActive).length || 0,
    totalMembers: memberPools?.reduce((sum, p) => sum + p.memberCount, 0) || 0,
  }), [memberPools]);

  // 필터링된 풀 목록
  const filteredPools = memberPools || [];

  // 풀 선택
  const handleSelectPool = (pool: MemberPoolResponse) => {
    setSelectedPoolId(pool.id);
    setMemberPage(0);
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
              회원 풀 조회
            </h1>
            <p className="text-sm" style={{ color: designTokens.text.secondary }}>
              조건 기반 직원 그룹을 조회합니다. 회원 풀 관리는 운영자(TO) 메뉴에서 가능합니다.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileDown className="w-4 h-4" />
              엑셀 내보내기
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
                    전체 풀
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
                  <Users className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    활성 풀
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
                    비활성 풀
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
                    총 회원 수
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.button.brand_default }}
                  >
                    {stats.totalMembers.toLocaleString()}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${designTokens.button.brand_default}15` }}
                >
                  <UserPlus
                    className="w-5 h-5"
                    style={{ color: designTokens.button.brand_default }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-12 gap-6">
          {/* 풀 목록 */}
          <div className="col-span-5">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>회원 풀 목록</CardTitle>
                  <Badge variant="gray">{filteredPools.length}개</Badge>
                </div>
                <div className="space-y-3 mt-3">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: designTokens.text.placeholder }}
                    />
                    <Input
                      placeholder="회원 풀 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterActive(undefined)}
                      className={cn(filterActive === undefined && 'bg-gray-100')}
                    >
                      전체
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterActive(true)}
                      className={cn(filterActive === true && 'bg-gray-100')}
                    >
                      활성
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFilterActive(false)}
                      className={cn(filterActive === false && 'bg-gray-100')}
                    >
                      비활성
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredPools.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="회원 풀이 없습니다"
                    description="운영자(TO) 메뉴에서 회원 풀을 생성할 수 있습니다."
                    className="py-12"
                  />
                ) : (
                  <div className="divide-y" style={{ borderColor: designTokens.bg.border }}>
                    {filteredPools.map((pool) => (
                      <button
                        key={pool.id}
                        type="button"
                        onClick={() => handleSelectPool(pool)}
                        className={cn(
                          'w-full p-4 text-left transition-colors',
                          selectedPoolId === pool.id && 'bg-opacity-50'
                        )}
                        style={{
                          backgroundColor:
                            selectedPoolId === pool.id
                              ? `${designTokens.button.brand_default}08`
                              : 'transparent',
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p
                              className="font-medium"
                              style={{
                                color:
                                  selectedPoolId === pool.id
                                    ? designTokens.button.brand_default
                                    : designTokens.text.primary,
                              }}
                            >
                              {pool.name}
                            </p>
                            <Badge
                              variant={pool.isActive ? 'green' : 'gray'}
                              className="text-xs"
                            >
                              {pool.isActive ? '활성' : '비활성'}
                            </Badge>
                          </div>
                          <ChevronRight
                            className="w-4 h-4"
                            style={{ color: designTokens.text.placeholder }}
                          />
                        </div>
                        {pool.description && (
                          <p
                            className="text-sm line-clamp-1"
                            style={{ color: designTokens.text.secondary }}
                          >
                            {pool.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="gray" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {pool.memberCount}명
                          </Badge>
                          <span
                            className="text-xs"
                            style={{ color: designTokens.text.placeholder }}
                          >
                            {formatDate(pool.updatedAt)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 풀 상세 */}
          <div className="col-span-7">
            <Card className="h-full min-h-[600px]">
              {selectedPool ? (
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle>{selectedPool.name}</CardTitle>
                          <Badge variant={selectedPool.isActive ? 'green' : 'gray'}>
                            {selectedPool.isActive ? '활성' : '비활성'}
                          </Badge>
                        </div>
                        {selectedPool.description && (
                          <p
                            className="text-sm mt-1"
                            style={{ color: designTokens.text.secondary }}
                          >
                            {selectedPool.description}
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileDown className="w-3 h-3" />
                        회원 목록 내보내기
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="members">
                      <TabsList className="mb-4">
                        <TabsTrigger value="members" className="gap-1">
                          <Users className="w-4 h-4" />
                          회원 목록 ({selectedPool.memberCount})
                        </TabsTrigger>
                        <TabsTrigger value="conditions" className="gap-1">
                          <GraduationCap className="w-4 h-4" />
                          조건 설정
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="members">
                        <div className="flex items-center justify-between mb-4">
                          <div className="relative flex-1 max-w-sm">
                            <Search
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                              style={{ color: designTokens.text.placeholder }}
                            />
                            <Input placeholder="회원 검색..." className="pl-10" />
                          </div>
                        </div>

                        {isMembersLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin" style={{ color: designTokens.text.secondary }} />
                          </div>
                        ) : membersData?.content && membersData.content.length > 0 ? (
                          <>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>이름</TableHead>
                                  <TableHead>이메일</TableHead>
                                  <TableHead>부서</TableHead>
                                  <TableHead>직책</TableHead>
                                  <TableHead>직무</TableHead>
                                  <TableHead>상태</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {membersData.content.map((member: MemberPoolMemberDto) => (
                                  <TableRow key={member.id}>
                                    <TableCell>
                                      <span style={{ color: designTokens.text.primary }}>
                                        {member.name}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <span style={{ color: designTokens.text.secondary }}>
                                        {member.email}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="gray">{member.departmentName}</Badge>
                                    </TableCell>
                                    <TableCell>
                                      <span style={{ color: designTokens.text.secondary }}>
                                        {member.position}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <span style={{ color: designTokens.text.secondary }}>
                                        {member.jobTitle}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={member.status === 'ACTIVE' ? 'green' : 'gray'}
                                      >
                                        {EMPLOYEE_STATUS_LABELS[member.status as EmployeeStatus] || member.status}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>

                            {/* 페이지네이션 */}
                            {membersData.totalPages > 1 && (
                              <div className="flex items-center justify-center gap-2 mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={membersData.first}
                                  onClick={() => setMemberPage((p) => Math.max(0, p - 1))}
                                >
                                  이전
                                </Button>
                                <span className="text-sm" style={{ color: designTokens.text.secondary }}>
                                  {membersData.number + 1} / {membersData.totalPages}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={membersData.last}
                                  onClick={() => setMemberPage((p) => p + 1)}
                                >
                                  다음
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            className="text-center py-12"
                            style={{ color: designTokens.text.secondary }}
                          >
                            <Users
                              className="w-12 h-12 mx-auto mb-3 opacity-30"
                              style={{ color: designTokens.text.placeholder }}
                            />
                            <p>조건에 매칭되는 회원이 없습니다.</p>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="conditions">
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg" style={{ backgroundColor: designTokens.bg.secondary }}>
                            <h4 className="font-medium mb-3" style={{ color: designTokens.text.primary }}>
                              현재 설정된 조건
                            </h4>
                            <div className="space-y-3">
                              {selectedPool.condition.departmentIds.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                                    부서
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedPool.condition.departmentIds.map((id) => (
                                      <Badge key={id} variant="blue">부서 ID: {id}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {selectedPool.condition.positions.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                                    직책
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedPool.condition.positions.map((pos) => (
                                      <Badge key={pos} variant="purple">{pos}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {selectedPool.condition.jobTitles.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                                    직무
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedPool.condition.jobTitles.map((job) => (
                                      <Badge key={job} variant="orange">{job}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {selectedPool.condition.employeeStatuses.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                                    직원 상태
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedPool.condition.employeeStatuses.map((status) => (
                                      <Badge key={status} variant="green">
                                        {EMPLOYEE_STATUS_LABELS[status]}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {selectedPool.condition.departmentIds.length === 0 &&
                                selectedPool.condition.positions.length === 0 &&
                                selectedPool.condition.jobTitles.length === 0 &&
                                selectedPool.condition.employeeStatuses.length === 0 && (
                                  <p className="text-sm" style={{ color: designTokens.text.placeholder }}>
                                    설정된 조건이 없습니다. (전체 대상)
                                  </p>
                                )}
                            </div>
                          </div>
                          <p className="text-sm" style={{ color: designTokens.text.placeholder }}>
                            조건 수정은 운영자(TO) 메뉴에서 가능합니다.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Users
                      className="w-16 h-16 mx-auto mb-4 opacity-20"
                      style={{ color: designTokens.text.placeholder }}
                    />
                    <p style={{ color: designTokens.text.secondary }}>
                      왼쪽에서 회원 풀을 선택하세요
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
