import { useState } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  Building2,
  ChevronRight,
  Save,
  X,
  FolderTree,
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
  EmptyState,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common';

// 부서 타입
interface Department {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  description?: string;
  memberCount: number;
  managerId?: string;
  managerName?: string;
  createdAt: Date;
}

// 샘플 부서 데이터
const sampleDepartments: Department[] = [
  { id: 'd1', name: '개발팀', code: 'DEV', memberCount: 45, managerName: '김철수', createdAt: new Date('2023-01-15') },
  { id: 'd2', name: '프론트엔드팀', code: 'DEV-FE', parentId: 'd1', memberCount: 15, managerName: '이영희', createdAt: new Date('2023-02-01') },
  { id: 'd3', name: '백엔드팀', code: 'DEV-BE', parentId: 'd1', memberCount: 20, managerName: '박민수', createdAt: new Date('2023-02-01') },
  { id: 'd4', name: 'DevOps팀', code: 'DEV-OPS', parentId: 'd1', memberCount: 10, managerName: '최수진', createdAt: new Date('2023-02-01') },
  { id: 'd5', name: '마케팅팀', code: 'MKT', memberCount: 23, managerName: '정민호', createdAt: new Date('2023-01-20') },
  { id: 'd6', name: '인사팀', code: 'HR', memberCount: 15, managerName: '강서연', createdAt: new Date('2023-01-10') },
  { id: 'd7', name: '영업팀', code: 'SALES', memberCount: 32, managerName: '윤태희', createdAt: new Date('2023-01-25') },
  { id: 'd8', name: '디자인팀', code: 'DESIGN', memberCount: 8, managerName: '임재현', createdAt: new Date('2023-02-10') },
];

/**
 * TA 부서 관리 페이지
 * - 부서 생성/수정/삭제
 * - 계층 구조 관리
 * - 부서별 인원 현황
 */
export const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState<Department[]>(sampleDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    parentId: '',
    description: '',
  });

  // 필터링된 부서 목록
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 최상위 부서만 (parentId가 없는 것)
  const topLevelDepartments = filteredDepartments.filter((d) => !d.parentId);

  // 하위 부서 가져오기
  const getSubDepartments = (parentId: string) => {
    return filteredDepartments.filter((d) => d.parentId === parentId);
  };

  // 부서 생성
  const handleCreate = () => {
    const newDept: Department = {
      id: `d${departments.length + 1}`,
      name: formData.name,
      code: formData.code,
      parentId: formData.parentId || undefined,
      description: formData.description,
      memberCount: 0,
      createdAt: new Date(),
    };
    setDepartments([...departments, newDept]);
    setShowCreateModal(false);
    resetForm();
  };

  // 부서 수정
  const handleEdit = () => {
    if (!selectedDepartment) return;
    setDepartments(
      departments.map((d) =>
        d.id === selectedDepartment.id
          ? { ...d, name: formData.name, code: formData.code, description: formData.description }
          : d
      )
    );
    setShowEditModal(false);
    resetForm();
  };

  // 부서 삭제
  const handleDelete = (id: string) => {
    // 하위 부서가 있는지 확인
    const hasChildren = departments.some((d) => d.parentId === id);
    if (hasChildren) {
      alert('하위 부서가 있는 부서는 삭제할 수 없습니다.');
      return;
    }
    setDepartments(departments.filter((d) => d.id !== id));
  };

  // 수정 모달 열기
  const openEditModal = (dept: Department) => {
    setSelectedDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      parentId: dept.parentId || '',
      description: dept.description || '',
    });
    setShowEditModal(true);
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({ name: '', code: '', parentId: '', description: '' });
    setSelectedDepartment(null);
  };

  // 통계
  const stats = {
    total: departments.length,
    topLevel: topLevelDepartments.length,
    totalMembers: departments.reduce((sum, d) => sum + d.memberCount, 0),
  };

  // 부서 렌더링 (재귀적)
  const renderDepartment = (dept: Department, level: number = 0) => {
    const subDepts = getSubDepartments(dept.id);
    const hasChildren = subDepts.length > 0;

    return (
      <div key={dept.id}>
        <div
          className="flex items-center justify-between p-4 rounded-lg transition-colors"
          style={{
            backgroundColor: level === 0 ? designTokens.bg.secondary : designTokens.bg.default,
            marginLeft: `${level * 24}px`,
            borderLeft: level > 0 ? `2px solid ${designTokens.bg.border}` : 'none',
          }}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasChildren && (
              <ChevronRight className="w-4 h-4" style={{ color: designTokens.text.secondary }} />
            )}
            <Building2
              className="w-5 h-5"
              style={{ color: level === 0 ? designTokens.button.brand_default : designTokens.text.secondary }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-medium"
                  style={{ color: designTokens.text.primary }}
                >
                  {dept.name}
                </span>
                <Badge variant="gray" className="text-xs">
                  {dept.code}
                </Badge>
              </div>
              {dept.managerName && (
                <p className="text-xs mt-0.5" style={{ color: designTokens.text.secondary }}>
                  담당자: {dept.managerName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" style={{ color: designTokens.text.placeholder }} />
              <span className="text-sm" style={{ color: designTokens.text.secondary }}>
                {dept.memberCount}명
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg transition-colors hover:bg-black/5">
                  <MoreHorizontal className="w-4 h-4" style={{ color: designTokens.text.secondary }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditModal(dept)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  수정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDelete(dept.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 하위 부서 */}
        {hasChildren && (
          <div className="mt-2">
            {subDepts.map((subDept) => renderDepartment(subDept, level + 1))}
          </div>
        )}
      </div>
    );
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
              부서 관리
            </h1>
            <p className="text-sm" style={{ color: designTokens.text.secondary }}>
              조직의 부서 구조를 관리합니다.
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() => setShowCreateModal(true)}
            style={{
              backgroundColor: designTokens.button.brand_default,
              color: designTokens.button.brand_text,
            }}
          >
            <Plus className="w-4 h-4" />
            부서 추가
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    전체 부서
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.text.primary }}
                  >
                    {stats.total}
                  </p>
                </div>
                <FolderTree className="w-8 h-8" style={{ color: designTokens.text.placeholder }} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    최상위 부서
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.text.primary }}
                  >
                    {stats.topLevel}
                  </p>
                </div>
                <Building2 className="w-8 h-8" style={{ color: designTokens.text.placeholder }} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    전체 인원
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.text.primary }}
                  >
                    {stats.totalMembers}
                  </p>
                </div>
                <Users className="w-8 h-8" style={{ color: designTokens.text.placeholder }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 검색 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: designTokens.text.placeholder }}
              />
              <Input
                placeholder="부서명 또는 코드로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* 부서 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>부서 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDepartments.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="부서가 없습니다"
                description="새 부서를 추가하세요."
                className="py-12"
              />
            ) : (
              <div className="space-y-2">
                {topLevelDepartments.map((dept) => renderDepartment(dept))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 부서 생성 모달 */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>부서 추가</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <Label className="mb-2 block">부서명 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 개발팀"
              />
            </div>
            <div>
              <Label className="mb-2 block">부서 코드 *</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="예: DEV"
              />
            </div>
            <div>
              <Label className="mb-2 block">상위 부서</Label>
              <Select value={formData.parentId} onValueChange={(v) => setFormData({ ...formData, parentId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="없음 (최상위 부서)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">없음 (최상위 부서)</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">설명</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="부서 설명 (선택사항)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
              취소
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.name || !formData.code}
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              <Save className="w-4 h-4 mr-1" />
              생성
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 부서 수정 모달 */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>부서 수정</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <Label className="mb-2 block">부서명 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-2 block">부서 코드 *</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-2 block">설명</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
              취소
            </Button>
            <Button
              onClick={handleEdit}
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              <Save className="w-4 h-4 mr-1" />
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
