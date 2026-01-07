import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Play,
  Pause,
  Copy,
  Zap,
  Users,
  Calendar,
  ChevronRight,
  X,
  Save,
  FileDown,
  Upload,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/common';
import { TargetingSelector } from '@/components/domain/ta';

// 타겟팅 데이터 타입
interface TargetingData {
  departments: string[];
  jobRoles: string[];
  positions: string[];
  ranks: string[];
}

// 자동 입과 타입
interface AutoEnrollmentRule {
  id: string;
  name: string;
  description: string;
  triggerType: 'new_hire' | 'promotion' | 'department_change' | 'manual' | 'schedule';
  triggerConditions: {
    departments?: string[];
    positions?: string[];
    ranks?: string[];
    jobRoles?: string[];
  };
  targetCourses: { id: string; name: string }[];
  isActive: boolean;
  createdAt: Date;
  lastTriggeredAt?: Date;
  enrolledCount: number;
  priority: number;
}

// 샘플 데이터
const sampleRules: AutoEnrollmentRule[] = [
  {
    id: '1',
    name: '신규 입사자 필수 교육',
    description: '신규 입사자에게 필수 교육 과정을 자동으로 배정합니다.',
    triggerType: 'new_hire',
    triggerConditions: {},
    targetCourses: [
      { id: 'c1', name: '회사 소개 및 조직문화' },
      { id: 'c2', name: '정보보안 기초' },
      { id: 'c3', name: '업무 시스템 사용법' },
    ],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastTriggeredAt: new Date('2025-01-02'),
    enrolledCount: 156,
    priority: 1,
  },
  {
    id: '2',
    name: '팀장 승진자 리더십 교육',
    description: '팀장으로 승진한 직원에게 리더십 교육을 자동 배정합니다.',
    triggerType: 'promotion',
    triggerConditions: {
      positions: ['team_leader'],
    },
    targetCourses: [
      { id: 'c4', name: '리더십 기본 과정' },
      { id: 'c5', name: '성과 관리 및 피드백' },
    ],
    isActive: true,
    createdAt: new Date('2024-03-01'),
    lastTriggeredAt: new Date('2024-12-15'),
    enrolledCount: 32,
    priority: 2,
  },
  {
    id: '3',
    name: '개발팀 전환자 기술 교육',
    description: '개발팀으로 부서 이동한 직원에게 기술 교육을 배정합니다.',
    triggerType: 'department_change',
    triggerConditions: {
      departments: ['dev'],
    },
    targetCourses: [
      { id: 'c6', name: '개발 환경 설정 가이드' },
      { id: 'c7', name: '코드 리뷰 문화' },
    ],
    isActive: false,
    createdAt: new Date('2024-06-01'),
    enrolledCount: 8,
    priority: 3,
  },
];

const triggerTypeLabels: Record<AutoEnrollmentRule['triggerType'], string> = {
  new_hire: '신규 입사',
  promotion: '직급 승진',
  department_change: '부서 이동',
  manual: '수동 실행',
  schedule: '정기 실행',
};

const triggerTypeColors: Record<AutoEnrollmentRule['triggerType'], string> = {
  new_hire: 'green',
  promotion: 'blue',
  department_change: 'orange',
  manual: 'gray',
  schedule: 'indigo',
};

// 규칙 생성/수정 폼
interface RuleFormData {
  name: string;
  description: string;
  triggerType: AutoEnrollmentRule['triggerType'];
  isAllTarget: boolean;
  targeting: TargetingData;
  targetCourses: { id: string; name: string }[];
  priority: number;
}

const initialFormData: RuleFormData = {
  name: '',
  description: '',
  triggerType: 'new_hire',
  isAllTarget: true,
  targeting: { departments: [], jobRoles: [], positions: [], ranks: [] },
  targetCourses: [],
  priority: 1,
};

// 샘플 교육 과정 목록
const sampleCourses = [
  { id: 'c1', name: '회사 소개 및 조직문화' },
  { id: 'c2', name: '정보보안 기초' },
  { id: 'c3', name: '업무 시스템 사용법' },
  { id: 'c4', name: '리더십 기본 과정' },
  { id: 'c5', name: '성과 관리 및 피드백' },
  { id: 'c6', name: '개발 환경 설정 가이드' },
  { id: 'c7', name: '코드 리뷰 문화' },
  { id: 'c8', name: 'AI 활용 업무 효율화' },
  { id: 'c9', name: '커뮤니케이션 스킬' },
  { id: 'c10', name: '프로젝트 관리 기초' },
];

/**
 * 자동 입과 페이지
 * - 특정 조건 충족 시 자동으로 교육 과정에 배정되는 규칙 설정
 */
export const AutoEnrollmentRulesPage = () => {
  const [rules, setRules] = useState<AutoEnrollmentRule[]>(sampleRules);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoEnrollmentRule | null>(null);
  const [formData, setFormData] = useState<RuleFormData>(initialFormData);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);

  // 필터링된 규칙 목록
  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || rule.triggerType === filterType;
    return matchesSearch && matchesType;
  });

  // 규칙 활성화/비활성화 토글
  const toggleRuleActive = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));
  };

  // 규칙 삭제
  const deleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  // 규칙 복제
  const duplicateRule = (rule: AutoEnrollmentRule) => {
    const newRule: AutoEnrollmentRule = {
      ...rule,
      id: Date.now().toString(),
      name: `${rule.name} (복사본)`,
      isActive: false,
      createdAt: new Date(),
      lastTriggeredAt: undefined,
      enrolledCount: 0,
    };
    setRules([...rules, newRule]);
  };

  // 수정 모달 열기
  const openEditModal = (rule: AutoEnrollmentRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      triggerType: rule.triggerType,
      isAllTarget: Object.values(rule.triggerConditions).every((v) => !v || v.length === 0),
      targeting: {
        departments: rule.triggerConditions.departments || [],
        jobRoles: rule.triggerConditions.jobRoles || [],
        positions: rule.triggerConditions.positions || [],
        ranks: rule.triggerConditions.ranks || [],
      },
      targetCourses: rule.targetCourses,
      priority: rule.priority,
    });
    setShowCreateModal(true);
  };

  // 새 규칙 생성 모달 열기
  const openCreateModal = () => {
    setEditingRule(null);
    setFormData(initialFormData);
    setShowCreateModal(true);
  };

  // 규칙 저장
  const handleSaveRule = () => {
    if (!formData.name || formData.targetCourses.length === 0) return;

    if (editingRule) {
      // 수정
      setRules(
        rules.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                name: formData.name,
                description: formData.description,
                triggerType: formData.triggerType,
                triggerConditions: formData.isAllTarget
                  ? {}
                  : {
                      departments: formData.targeting.departments,
                      jobRoles: formData.targeting.jobRoles,
                      positions: formData.targeting.positions,
                      ranks: formData.targeting.ranks,
                    },
                targetCourses: formData.targetCourses,
                priority: formData.priority,
              }
            : r
        )
      );
    } else {
      // 생성
      const newRule: AutoEnrollmentRule = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        triggerType: formData.triggerType,
        triggerConditions: formData.isAllTarget
          ? {}
          : {
              departments: formData.targeting.departments,
              jobRoles: formData.targeting.jobRoles,
              positions: formData.targeting.positions,
              ranks: formData.targeting.ranks,
            },
        targetCourses: formData.targetCourses,
        isActive: true,
        createdAt: new Date(),
        enrolledCount: 0,
        priority: formData.priority,
      };
      setRules([...rules, newRule]);
    }

    setShowCreateModal(false);
    setFormData(initialFormData);
    setEditingRule(null);
  };

  // 전체 선택 토글
  const toggleSelectAll = () => {
    if (selectedRules.length === filteredRules.length) {
      setSelectedRules([]);
    } else {
      setSelectedRules(filteredRules.map((r) => r.id));
    }
  };

  // 개별 선택 토글
  const toggleSelectRule = (id: string) => {
    setSelectedRules((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // 교육 과정 선택 토글
  const toggleCourse = (course: { id: string; name: string }) => {
    setFormData((prev) => ({
      ...prev,
      targetCourses: prev.targetCourses.some((c) => c.id === course.id)
        ? prev.targetCourses.filter((c) => c.id !== course.id)
        : [...prev.targetCourses, course],
    }));
  };

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
              자동 입과
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
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-sm"
                    style={{ color: designTokens.text.secondary }}
                  >
                    전체 규칙
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.text.primary }}
                  >
                    {rules.length}
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
                  <p
                    className="text-sm"
                    style={{ color: designTokens.text.secondary }}
                  >
                    활성 규칙
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.status.success_text }}
                  >
                    {rules.filter((r) => r.isActive).length}
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
                  <p
                    className="text-sm"
                    style={{ color: designTokens.text.secondary }}
                  >
                    총 입과 인원
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.text.primary }}
                  >
                    {rules.reduce((sum, r) => sum + r.enrolledCount, 0).toLocaleString()}
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
                  <p
                    className="text-sm"
                    style={{ color: designTokens.text.secondary }}
                  >
                    이번 달 입과
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.button.brand_default }}
                  >
                    24
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
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="트리거 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 유형</SelectItem>
                  <SelectItem value="new_hire">신규 입사</SelectItem>
                  <SelectItem value="promotion">직급 승진</SelectItem>
                  <SelectItem value="department_change">부서 이동</SelectItem>
                  <SelectItem value="manual">수동 실행</SelectItem>
                  <SelectItem value="schedule">정기 실행</SelectItem>
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
              {selectedRules.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="gray">{selectedRules.length}개 선택</Badge>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Play className="w-3 h-3" />
                    일괄 활성화
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Pause className="w-3 h-3" />
                    일괄 비활성화
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    style={{ color: designTokens.status.error_text }}
                  >
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </Button>
                </div>
              )}
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
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedRules.length === filteredRules.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>규칙명</TableHead>
                    <TableHead>트리거</TableHead>
                    <TableHead>대상 과정</TableHead>
                    <TableHead className="text-right">입과 인원</TableHead>
                    <TableHead>마지막 실행</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRules.includes(rule.id)}
                          onCheckedChange={() => toggleSelectRule(rule.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: designTokens.text.primary }}
                          >
                            {rule.name}
                          </p>
                          <p
                            className="text-xs mt-0.5 line-clamp-1"
                            style={{ color: designTokens.text.secondary }}
                          >
                            {rule.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={triggerTypeColors[rule.triggerType] as 'green' | 'blue' | 'orange' | 'gray' | 'indigo'}
                        >
                          {triggerTypeLabels[rule.triggerType]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span style={{ color: designTokens.text.primary }}>
                            {rule.targetCourses.length}개 과정
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <ChevronRight
                                  className="w-4 h-4"
                                  style={{ color: designTokens.text.placeholder }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="space-y-1">
                                  {rule.targetCourses.map((c) => (
                                    <p key={c.id}>{c.name}</p>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span style={{ color: designTokens.text.primary }}>
                          {rule.enrolledCount.toLocaleString()}명
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: designTokens.text.secondary }}>
                          {rule.lastTriggeredAt
                            ? rule.lastTriggeredAt.toLocaleDateString('ko-KR')
                            : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRuleActive(rule.id)}
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
                            <DropdownMenuItem onClick={() => duplicateRule(rule)}>
                              <Copy className="w-4 h-4 mr-2" />
                              복제
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteRule(rule.id)}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              {editingRule ? '규칙 수정' : '새 규칙 추가'}
            </DialogTitle>
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
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="규칙을 식별할 수 있는 이름"
                />
              </div>
              <div>
                <Label className="mb-2 block">설명</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="규칙에 대한 간단한 설명"
                />
              </div>
            </div>

            {/* 트리거 유형 */}
            <div>
              <Label className="mb-2 block">트리거 유형</Label>
              <Select
                value={formData.triggerType}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    triggerType: v as AutoEnrollmentRule['triggerType'],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_hire">신규 입사 - 새로운 직원 입사 시</SelectItem>
                  <SelectItem value="promotion">직급 승진 - 직급 변경 시</SelectItem>
                  <SelectItem value="department_change">부서 이동 - 부서 변경 시</SelectItem>
                  <SelectItem value="manual">수동 실행 - 운영자가 직접 실행</SelectItem>
                  <SelectItem value="schedule">정기 실행 - 특정 주기로 실행</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 대상 조건 (타겟팅) */}
            <div>
              <Label className="mb-2 block">대상 조건</Label>
              <p
                className="text-xs mb-3"
                style={{ color: designTokens.text.secondary }}
              >
                특정 조건에 해당하는 직원에게만 규칙을 적용합니다.
              </p>
              <TargetingSelector
                value={formData.targeting}
                onChange={(targeting) => setFormData({ ...formData, targeting })}
                isAllTarget={formData.isAllTarget}
                onAllTargetChange={(isAll) =>
                  setFormData({ ...formData, isAllTarget: isAll })
                }
              />
            </div>

            {/* 대상 교육 과정 */}
            <div>
              <Label className="mb-2 block">
                대상 교육 과정 <span className="text-red-500">*</span>
              </Label>
              <p
                className="text-xs mb-3"
                style={{ color: designTokens.text.secondary }}
              >
                조건 충족 시 자동으로 배정할 교육 과정을 선택하세요.
              </p>

              {/* 선택된 과정 */}
              {formData.targetCourses.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.targetCourses.map((course) => (
                    <Badge key={course.id} variant="blue" className="gap-1 pr-1">
                      {course.name}
                      <button
                        type="button"
                        onClick={() => toggleCourse(course)}
                        className="ml-1 p-0.5 rounded hover:bg-black/10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* 과정 선택 목록 */}
              <div
                className="border rounded-lg max-h-[200px] overflow-y-auto"
                style={{ borderColor: designTokens.bg.border }}
              >
                {sampleCourses.map((course) => {
                  const isSelected = formData.targetCourses.some(
                    (c) => c.id === course.id
                  );
                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => toggleCourse(course)}
                      className="w-full flex items-center justify-between p-3 text-left border-b last:border-b-0 transition-colors"
                      style={{
                        borderColor: designTokens.bg.border,
                        backgroundColor: isSelected
                          ? `${designTokens.button.brand_default}08`
                          : 'transparent',
                      }}
                    >
                      <span
                        style={{
                          color: isSelected
                            ? designTokens.button.brand_default
                            : designTokens.text.primary,
                        }}
                      >
                        {course.name}
                      </span>
                      {isSelected && (
                        <Badge variant="blue" className="text-xs">
                          선택됨
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 우선순위 */}
            <div>
              <Label className="mb-2 block">우선순위</Label>
              <Select
                value={formData.priority.toString()}
                onValueChange={(v) =>
                  setFormData({ ...formData, priority: parseInt(v) })
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - 가장 높음</SelectItem>
                  <SelectItem value="2">2 - 높음</SelectItem>
                  <SelectItem value="3">3 - 보통</SelectItem>
                  <SelectItem value="4">4 - 낮음</SelectItem>
                  <SelectItem value="5">5 - 가장 낮음</SelectItem>
                </SelectContent>
              </Select>
              <p
                className="text-xs mt-1"
                style={{ color: designTokens.text.placeholder }}
              >
                같은 조건에 여러 규칙이 해당될 경우 우선순위가 높은 규칙이 먼저 적용됩니다.
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
              disabled={!formData.name || formData.targetCourses.length === 0}
              className="gap-1"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              <Save className="w-4 h-4" />
              {editingRule ? '수정' : '저장'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
