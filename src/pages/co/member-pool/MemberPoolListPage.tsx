import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  Download,
  X,
  Save,
  ChevronRight,
  GraduationCap,
  FileDown,
  FileUp,
  Filter,
  Play,
  Pause,
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
  Label,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  EmptyState,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/common';
import { cn } from '@/utils/cn';
import {
  useMemberPools,
  useMemberPool,
  useMemberPoolMembers,
  useCreateMemberPool,
  useUpdateMemberPool,
  useDeleteMemberPool,
  useActivateMemberPool,
  useDeactivateMemberPool,
} from '@/hooks/co';
import type {
  MemberPoolResponse,
  MemberPoolConditionDto,
  CreateMemberPoolRequest,
  UpdateMemberPoolRequest,
  MemberPoolMemberDto,
  EmployeeStatus,
} from '@/types/co/memberPool.types';

// 직원 상태 라벨
const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  ACTIVE: '재직',
  ON_LEAVE: '휴직',
  RESIGNED: '퇴직',
};

// 폼 데이터 타입
interface MemberPoolFormData {
  name: string;
  description: string;
  condition: MemberPoolConditionDto;
  isActive: boolean;
  sortOrder: number;
}

const initialFormData: MemberPoolFormData = {
  name: '',
  description: '',
  condition: {
    departmentIds: [],
    positions: [],
    jobTitles: [],
    employeeStatuses: [],
  },
  isActive: true,
  sortOrder: 0,
};

/**
 * CO 회원 풀 관리 페이지
 * - 조건 기반 직원 그룹 관리
 * - CRUD 및 활성화/비활성화 기능
 */
export default function MemberPoolListPage() {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined);

  // 선택된 풀 상태
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(null);

  // 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingPool, setEditingPool] = useState<MemberPoolResponse | null>(null);
  const [poolToDelete, setPoolToDelete] = useState<MemberPoolResponse | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState<MemberPoolFormData>(initialFormData);

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

  const createMemberPool = useCreateMemberPool();
  const updateMemberPool = useUpdateMemberPool();
  const deleteMemberPool = useDeleteMemberPool();
  const activateMemberPool = useActivateMemberPool();
  const deactivateMemberPool = useDeactivateMemberPool();

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

  // 새 풀 생성 모달 열기
  const openCreateModal = () => {
    setEditingPool(null);
    setFormData(initialFormData);
    setShowCreateModal(true);
  };

  // 풀 수정 모달 열기
  const openEditModal = (pool: MemberPoolResponse) => {
    setEditingPool(pool);
    setFormData({
      name: pool.name,
      description: pool.description || '',
      condition: pool.condition,
      isActive: pool.isActive,
      sortOrder: pool.sortOrder,
    });
    setShowCreateModal(true);
  };

  // 풀 저장
  const handleSavePool = async () => {
    if (!formData.name.trim()) return;

    try {
      if (editingPool) {
        // 수정
        const request: UpdateMemberPoolRequest = {
          name: formData.name,
          description: formData.description || undefined,
          condition: formData.condition,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder,
        };
        await updateMemberPool.mutateAsync({ id: editingPool.id, ...request });
      } else {
        // 생성
        const request: CreateMemberPoolRequest = {
          name: formData.name,
          description: formData.description || undefined,
          condition: formData.condition,
          isActive: formData.isActive,
          sortOrder: formData.sortOrder,
        };
        await createMemberPool.mutateAsync(request);
      }

      setShowCreateModal(false);
      setFormData(initialFormData);
      setEditingPool(null);
    } catch (err) {
      console.error('Failed to save member pool:', err);
    }
  };

  // 풀 삭제 확인
  const confirmDeletePool = (pool: MemberPoolResponse) => {
    setPoolToDelete(pool);
    setShowDeleteDialog(true);
  };

  // 풀 삭제 실행
  const handleDeletePool = async () => {
    if (!poolToDelete) return;

    try {
      await deleteMemberPool.mutateAsync(poolToDelete.id);
      if (selectedPoolId === poolToDelete.id) {
        setSelectedPoolId(null);
      }
      setShowDeleteDialog(false);
      setPoolToDelete(null);
    } catch (err) {
      console.error('Failed to delete member pool:', err);
    }
  };

  // 풀 활성화/비활성화 토글
  const togglePoolActive = async (pool: MemberPoolResponse) => {
    try {
      if (pool.isActive) {
        await deactivateMemberPool.mutateAsync(pool.id);
      } else {
        await activateMemberPool.mutateAsync(pool.id);
      }
    } catch (err) {
      console.error('Failed to toggle pool active status:', err);
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
              회원 풀 관리
            </h1>
            <p className="text-sm" style={{ color: designTokens.text.secondary }}>
              조건 기반 직원 그룹을 관리하고 일괄 입과에 활용할 수 있습니다.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <FileUp className="w-4 h-4" />
              대량 업로드
            </Button>
            <Button variant="outline" className="gap-2">
              <FileDown className="w-4 h-4" />
              엑셀 내보내기
            </Button>
            <Button
              className="gap-2"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
              onClick={openCreateModal}
            >
              <Plus className="w-4 h-4" />
              회원 풀 생성
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                    description="새 회원 풀을 생성해보세요."
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => openEditModal(selectedPool)}
                        >
                          <Pencil className="w-3 h-3" />
                          수정
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => togglePoolActive(selectedPool)}
                        >
                          {selectedPool.isActive ? (
                            <>
                              <Pause className="w-3 h-3" />
                              비활성화
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3" />
                              활성화
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          className="gap-1"
                          style={{
                            backgroundColor: designTokens.button.brand_default,
                            color: designTokens.button.brand_text,
                          }}
                          onClick={() => navigate(prefixPath(`/co/enrollments/batch?poolId=${selectedPool.id}`))}
                        >
                          <GraduationCap className="w-3 h-3" />
                          일괄 입과
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-lg transition-colors">
                              <MoreHorizontal
                                className="w-4 h-4"
                                style={{ color: designTokens.text.secondary }}
                              />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              회원 목록 내보내기
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => confirmDeletePool(selectedPool)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
                          <Filter className="w-4 h-4" />
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
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <FileDown className="w-3 h-3" />
                              엑셀 내보내기
                            </Button>
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
                          <Button
                            variant="outline"
                            className="gap-1"
                            onClick={() => openEditModal(selectedPool)}
                          >
                            <Pencil className="w-4 h-4" />
                            조건 수정
                          </Button>
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

      {/* 회원 풀 생성/수정 모달 */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {editingPool ? '회원 풀 수정' : '새 회원 풀 생성'}
            </DialogTitle>
            <DialogDescription>
              조건을 설정하여 자동으로 매칭되는 회원 그룹을 생성합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">
                  회원 풀 이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="회원 풀 이름을 입력하세요"
                  maxLength={200}
                />
              </div>
              <div>
                <Label className="mb-2 block">설명</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="회원 풀에 대한 설명을 입력하세요"
                  maxLength={500}
                  rows={3}
                />
              </div>
            </div>

            {/* 조건 설정 */}
            <div>
              <Label className="mb-2 block">대상 조건</Label>
              <p className="text-xs mb-3" style={{ color: designTokens.text.secondary }}>
                아래 조건에 해당하는 직원이 자동으로 이 풀에 포함됩니다.
              </p>

              <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: designTokens.bg.secondary }}>
                {/* 직원 상태 */}
                <div>
                  <Label className="text-sm mb-2 block">직원 상태</Label>
                  <div className="flex flex-wrap gap-2">
                    {(['ACTIVE', 'ON_LEAVE', 'RESIGNED'] as EmployeeStatus[]).map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.condition.employeeStatuses.includes(status)}
                          onCheckedChange={(checked) => {
                            setFormData({
                              ...formData,
                              condition: {
                                ...formData.condition,
                                employeeStatuses: checked
                                  ? [...formData.condition.employeeStatuses, status]
                                  : formData.condition.employeeStatuses.filter((s) => s !== status),
                              },
                            });
                          }}
                        />
                        <span className="text-sm">{EMPLOYEE_STATUS_LABELS[status]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 직책 입력 */}
                <div>
                  <Label className="text-sm mb-2 block">직책</Label>
                  <Input
                    placeholder="직책을 쉼표로 구분하여 입력 (예: 팀장, 파트장)"
                    value={formData.condition.positions.join(', ')}
                    onChange={(e) => {
                      const positions = e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setFormData({
                        ...formData,
                        condition: { ...formData.condition, positions },
                      });
                    }}
                  />
                </div>

                {/* 직무 입력 */}
                <div>
                  <Label className="text-sm mb-2 block">직무</Label>
                  <Input
                    placeholder="직무를 쉼표로 구분하여 입력 (예: 개발자, 디자이너)"
                    value={formData.condition.jobTitles.join(', ')}
                    onChange={(e) => {
                      const jobTitles = e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setFormData({
                        ...formData,
                        condition: { ...formData.condition, jobTitles },
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 활성화 상태 */}
            <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: designTokens.bg.secondary }}>
              <div>
                <p className="font-medium" style={{ color: designTokens.text.primary }}>
                  활성화 상태
                </p>
                <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                  비활성화하면 일괄 입과 등에서 사용할 수 없습니다.
                </p>
              </div>
              <Checkbox
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked as boolean })
                }
              />
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setFormData(initialFormData);
                setEditingPool(null);
              }}
              className="gap-1"
            >
              <X className="w-4 h-4" />
              취소
            </Button>
            <Button
              onClick={handleSavePool}
              disabled={!formData.name.trim() || createMemberPool.isPending || updateMemberPool.isPending}
              className="gap-1"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              {(createMemberPool.isPending || updateMemberPool.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editingPool ? '수정' : '저장'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>회원 풀 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              '{poolToDelete?.name}' 회원 풀을 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePool}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMemberPool.isPending}
            >
              {deleteMemberPool.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
