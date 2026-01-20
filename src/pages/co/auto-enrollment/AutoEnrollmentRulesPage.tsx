import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Play,
  Pause,
  Zap,
  Calendar,
  X,
  Save,
  FileDown,
  Upload,
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
  Switch,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import {
  useAutoEnrollmentRules,
  useCreateAutoEnrollmentRule,
  useUpdateAutoEnrollmentRule,
  useDeleteAutoEnrollmentRule,
  useActivateAutoEnrollmentRule,
  useDeactivateAutoEnrollmentRule,
} from '@/hooks/co';
import type {
  AutoEnrollmentRuleResponse,
  AutoEnrollmentTrigger,
  CreateAutoEnrollmentRuleRequest,
  UpdateAutoEnrollmentRuleRequest,
} from '@/types/co/autoEnrollmentRule.types';
import { AUTO_ENROLLMENT_TRIGGER_LABELS } from '@/types/co/autoEnrollmentRule.types';

// 트리거 배지 색상
const triggerBadgeVariants: Record<AutoEnrollmentTrigger, 'green' | 'blue' | 'orange'> = {
  USER_JOIN: 'green',
  DEPARTMENT_ASSIGN: 'blue',
  ROLE_CHANGE: 'orange',
};

// 폼 데이터 타입
interface RuleFormData {
  name: string;
  description: string;
  trigger: AutoEnrollmentTrigger;
  departmentId: number | null;
  courseTimeId: number | null;
  sortOrder: number;
}

const initialFormData: RuleFormData = {
  name: '',
  description: '',
  trigger: 'USER_JOIN',
  departmentId: null,
  courseTimeId: null,
  sortOrder: 0,
};

/**
 * CO 자동 입과 규칙 관리 페이지
 * - 조건 충족 시 자동으로 교육 과정에 배정되는 규칙 관리
 * - CRUD 및 활성화/비활성화 기능
 */
export default function AutoEnrollmentRulesPage() {
  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrigger, setFilterTrigger] = useState<AutoEnrollmentTrigger | 'all'>('all');

  // 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoEnrollmentRuleResponse | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<AutoEnrollmentRuleResponse | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState<RuleFormData>(initialFormData);

  // API 훅
  const { data: rules, isLoading, error } = useAutoEnrollmentRules();
  const createRule = useCreateAutoEnrollmentRule();
  const updateRule = useUpdateAutoEnrollmentRule();
  const deleteRule = useDeleteAutoEnrollmentRule();
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

  // 새 규칙 생성 모달 열기
  const openCreateModal = () => {
    setEditingRule(null);
    setFormData(initialFormData);
    setShowCreateModal(true);
  };

  // 규칙 수정 모달 열기
  const openEditModal = (rule: AutoEnrollmentRuleResponse) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description || '',
      trigger: rule.trigger,
      departmentId: rule.departmentId,
      courseTimeId: rule.courseTimeId,
      sortOrder: rule.sortOrder || 0,
    });
    setShowCreateModal(true);
  };

  // 규칙 저장
  const handleSaveRule = async () => {
    if (!formData.name.trim() || !formData.courseTimeId) return;

    try {
      if (editingRule) {
        // 수정
        const request: UpdateAutoEnrollmentRuleRequest = {
          name: formData.name,
          description: formData.description || undefined,
          trigger: formData.trigger,
          departmentId: formData.departmentId || undefined,
          courseTimeId: formData.courseTimeId,
          sortOrder: formData.sortOrder,
        };
        await updateRule.mutateAsync({ id: editingRule.id, ...request });
      } else {
        // 생성
        const request: CreateAutoEnrollmentRuleRequest = {
          name: formData.name,
          description: formData.description || undefined,
          trigger: formData.trigger,
          departmentId: formData.departmentId || undefined,
          courseTimeId: formData.courseTimeId,
          sortOrder: formData.sortOrder,
        };
        await createRule.mutateAsync(request);
      }

      setShowCreateModal(false);
      setFormData(initialFormData);
      setEditingRule(null);
    } catch (err) {
      console.error('Failed to save rule:', err);
    }
  };

  // 규칙 삭제 확인
  const confirmDeleteRule = (rule: AutoEnrollmentRuleResponse) => {
    setRuleToDelete(rule);
    setShowDeleteDialog(true);
  };

  // 규칙 삭제 실행
  const handleDeleteRule = async () => {
    if (!ruleToDelete) return;

    try {
      await deleteRule.mutateAsync(ruleToDelete.id);
      setShowDeleteDialog(false);
      setRuleToDelete(null);
    } catch (err) {
      console.error('Failed to delete rule:', err);
    }
  };

  // 규칙 활성화/비활성화 토글
  const toggleRuleActive = async (rule: AutoEnrollmentRuleResponse) => {
    try {
      if (rule.isActive) {
        await deactivateRule.mutateAsync(rule.id);
      } else {
        await activateRule.mutateAsync(rule.id);
      }
    } catch (err) {
      console.error('Failed to toggle rule active status:', err);
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
              자동 입과 규칙
            </h1>
            <p className="text-sm" style={{ color: designTokens.text.secondary }}>
              특정 조건 충족 시 교육 과정에 자동으로 배정되는 규칙을 관리합니다.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              규칙 가져오기
            </Button>
            <Button variant="outline" className="gap-2">
              <FileDown className="w-4 h-4" />
              규칙 내보내기
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
              규칙 추가
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
                description="새 규칙을 추가하여 자동 입과를 설정해보세요."
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
                    <TableHead className="w-[80px]"></TableHead>
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
                          {AUTO_ENROLLMENT_TRIGGER_LABELS[rule.trigger]}
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
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-2 rounded-lg transition-colors"
                              style={{ backgroundColor: 'transparent' }}
                            >
                              <MoreHorizontal
                                className="w-4 h-4"
                                style={{ color: designTokens.text.secondary }}
                              />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(rule)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              수정
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => confirmDeleteRule(rule)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 규칙 생성/수정 모달 */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              {editingRule ? '규칙 수정' : '새 규칙 추가'}
            </DialogTitle>
            <DialogDescription>
              특정 조건 충족 시 자동으로 교육 과정에 배정되는 규칙을 설정합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">
                  규칙명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="규칙을 식별할 수 있는 이름"
                  maxLength={200}
                />
              </div>
              <div>
                <Label className="mb-2 block">설명</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="규칙에 대한 간단한 설명"
                  maxLength={500}
                  rows={3}
                />
              </div>
            </div>

            {/* 트리거 유형 */}
            <div>
              <Label className="mb-2 block">트리거 유형 <span className="text-red-500">*</span></Label>
              <Select
                value={formData.trigger}
                onValueChange={(v) => setFormData({ ...formData, trigger: v as AutoEnrollmentTrigger })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER_JOIN">신규 입사 - 새로운 직원 입사 시</SelectItem>
                  <SelectItem value="DEPARTMENT_ASSIGN">부서 배정 - 부서 배정/변경 시</SelectItem>
                  <SelectItem value="ROLE_CHANGE">역할 변경 - 역할 변경 시</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 대상 차수 ID */}
            <div>
              <Label className="mb-2 block">
                대상 차수 ID <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={formData.courseTimeId || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseTimeId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="배정할 차수 ID를 입력하세요"
              />
              <p className="text-xs mt-1" style={{ color: designTokens.text.placeholder }}>
                조건 충족 시 자동으로 배정할 교육 차수의 ID를 입력합니다.
              </p>
            </div>

            {/* 대상 부서 ID (선택) */}
            <div>
              <Label className="mb-2 block">대상 부서 ID (선택)</Label>
              <Input
                type="number"
                value={formData.departmentId || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    departmentId: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="특정 부서만 대상으로 하려면 입력"
              />
              <p className="text-xs mt-1" style={{ color: designTokens.text.placeholder }}>
                비워두면 전체 직원이 대상이 됩니다.
              </p>
            </div>

            {/* 정렬 순서 */}
            <div>
              <Label className="mb-2 block">우선순위</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
                min={0}
              />
              <p className="text-xs mt-1" style={{ color: designTokens.text.placeholder }}>
                숫자가 낮을수록 우선순위가 높습니다.
              </p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setFormData(initialFormData);
                setEditingRule(null);
              }}
              className="gap-1"
            >
              <X className="w-4 h-4" />
              취소
            </Button>
            <Button
              onClick={handleSaveRule}
              disabled={
                !formData.name.trim() ||
                !formData.courseTimeId ||
                createRule.isPending ||
                updateRule.isPending
              }
              className="gap-1"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              {(createRule.isPending || updateRule.isPending) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {editingRule ? '수정' : '저장'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>규칙 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              '{ruleToDelete?.name}' 규칙을 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRule}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteRule.isPending}
            >
              {deleteRule.isPending ? (
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
