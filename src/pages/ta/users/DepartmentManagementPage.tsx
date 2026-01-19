import { useState, useEffect } from 'react';
import { toast } from 'sonner';
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
  FolderTree,
  Loader2,
  UserPlus,
  Check,
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
import { departmentService } from '@/services/ta/departmentService';
import type { DepartmentResponse, DepartmentMemberResponse } from '@/types/ta/department.types';

/**
 * TA 부서 관리 페이지
 * - 부서 생성/수정/삭제
 * - 계층 구조 관리
 * - 부서별 인원 현황 (회원가입 시 선택한 부서 기준)
 */
export const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentResponse | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    parentId: '',
    description: '',
  });

  // 부서 멤버 목록 상태
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [members, setMembers] = useState<DepartmentMemberResponse[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [viewingDepartment, setViewingDepartment] = useState<DepartmentResponse | null>(null);

  // 인원 추가 모달 상태
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<DepartmentMemberResponse[]>([]);
  const [availableMembersLoading, setAvailableMembersLoading] = useState(false);
  const [addingMemberId, setAddingMemberId] = useState<number | null>(null);
  const [searchAvailable, setSearchAvailable] = useState('');

  // 부서 목록 조회
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getTree();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      toast.error('부서 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 모든 부서를 flat 리스트로 변환 (검색/통계용)
  const flattenDepartments = (depts: DepartmentResponse[]): DepartmentResponse[] => {
    const result: DepartmentResponse[] = [];
    const flatten = (list: DepartmentResponse[]) => {
      for (const dept of list) {
        result.push(dept);
        if (dept.children && dept.children.length > 0) {
          flatten(dept.children);
        }
      }
    };
    flatten(depts);
    return result;
  };

  const allDepartments = flattenDepartments(departments);

  // 필터링된 부서 목록
  const filteredDepartments = searchTerm
    ? allDepartments.filter((dept) =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : departments;

  // 부서 생성
  const handleCreate = async () => {
    try {
      await departmentService.create({
        name: formData.name,
        code: formData.code,
        parentId: formData.parentId ? Number(formData.parentId) : undefined,
        description: formData.description || undefined,
      });
      toast.success('부서가 생성되었습니다.');
      setShowCreateModal(false);
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Failed to create department:', error);
      toast.error('부서 생성에 실패했습니다.');
    }
  };

  // 부서 수정
  const handleEdit = async () => {
    if (!selectedDepartment) return;
    try {
      await departmentService.update(selectedDepartment.id, {
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
      });
      toast.success('부서가 수정되었습니다.');
      setShowEditModal(false);
      resetForm();
      fetchDepartments();
    } catch (error) {
      console.error('Failed to update department:', error);
      toast.error('부서 수정에 실패했습니다.');
    }
  };

  // 부서 삭제
  const handleDelete = async (id: number) => {
    try {
      await departmentService.delete(id);
      toast.success('부서가 삭제되었습니다.');
      fetchDepartments();
    } catch (error: any) {
      console.error('Failed to delete department:', error);
      if (error.response?.data?.message?.includes('하위 부서')) {
        toast.error('하위 부서가 있는 부서는 삭제할 수 없습니다.');
      } else {
        toast.error('부서 삭제에 실패했습니다.');
      }
    }
  };

  // 수정 모달 열기
  const openEditModal = (dept: DepartmentResponse) => {
    setSelectedDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      parentId: dept.parentId?.toString() || '',
      description: dept.description || '',
    });
    setShowEditModal(true);
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({ name: '', code: '', parentId: '', description: '' });
    setSelectedDepartment(null);
  };

  // 부서 멤버 조회
  const handleViewMembers = async (dept: DepartmentResponse) => {
    setViewingDepartment(dept);
    setShowMembersModal(true);
    setMembersLoading(true);
    try {
      const data = await departmentService.getMembers(dept.id);
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch department members:', error);
      toast.error('부서 인원 목록을 불러오는데 실패했습니다.');
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  // 인원 추가 모달 열기
  const handleOpenAddMember = async () => {
    if (!viewingDepartment) return;
    setShowAddMemberModal(true);
    setAvailableMembersLoading(true);
    setSearchAvailable('');
    try {
      const data = await departmentService.getAvailableMembers(viewingDepartment.id);
      setAvailableMembers(data);
    } catch (error) {
      console.error('Failed to fetch available members:', error);
      toast.error('추가 가능한 인원 목록을 불러오는데 실패했습니다.');
      setAvailableMembers([]);
    } finally {
      setAvailableMembersLoading(false);
    }
  };

  // 부서에 인원 추가
  const handleAddMember = async (userId: number) => {
    if (!viewingDepartment) return;
    setAddingMemberId(userId);
    try {
      await departmentService.addMember(viewingDepartment.id, userId);
      toast.success('인원이 부서에 추가되었습니다.');
      // 목록 갱신
      const [newMembers, newAvailable] = await Promise.all([
        departmentService.getMembers(viewingDepartment.id),
        departmentService.getAvailableMembers(viewingDepartment.id),
      ]);
      setMembers(newMembers);
      setAvailableMembers(newAvailable);
      // 부서 목록도 갱신 (인원수 변경)
      fetchDepartments();
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error('인원 추가에 실패했습니다.');
    } finally {
      setAddingMemberId(null);
    }
  };

  // 필터링된 추가 가능 인원
  const filteredAvailableMembers = searchAvailable
    ? availableMembers.filter(
        (m) =>
          m.name.toLowerCase().includes(searchAvailable.toLowerCase()) ||
          m.email.toLowerCase().includes(searchAvailable.toLowerCase())
      )
    : availableMembers;

  // 통계 (최상위 부서는 트리 구조의 departments 기준)
  const stats = {
    total: allDepartments.length,
    topLevel: departments.length,
    totalMembers: allDepartments.reduce((sum, d) => sum + d.memberCount, 0),
  };

  // 부서 렌더링 (재귀적)
  const renderDepartment = (dept: DepartmentResponse, level: number = 0) => {
    const hasChildren = dept.children && dept.children.length > 0;

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
            <button
              onClick={() => handleViewMembers(dept)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-black/5 transition-colors"
              title="인원 목록 보기"
            >
              <Users className="w-4 h-4" style={{ color: designTokens.text.placeholder }} />
              <span className="text-sm" style={{ color: designTokens.text.secondary }}>
                {dept.memberCount}명
              </span>
            </button>

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
            {dept.children.map((child) => renderDepartment(child, level + 1))}
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: designTokens.text.placeholder }} />
              </div>
            ) : filteredDepartments.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="부서가 없습니다"
                description="새 부서를 추가하세요."
                className="py-12"
              />
            ) : (
              <div className="space-y-2">
                {(searchTerm ? filteredDepartments : departments).map((dept) => renderDepartment(dept))}
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
              <Select
                value={formData.parentId || 'none'}
                onValueChange={(v) => setFormData({ ...formData, parentId: v === 'none' ? '' : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="없음 (최상위 부서)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">없음 (최상위 부서)</SelectItem>
                  {allDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
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

      {/* 부서 멤버 목록 모달 */}
      <Dialog open={showMembersModal} onOpenChange={setShowMembersModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {viewingDepartment?.name} 소속 인원
              <Badge variant="gray" className="ml-2">
                {members.length}명
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto py-4">
            {membersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: designTokens.text.placeholder }} />
              </div>
            ) : members.length === 0 ? (
              <EmptyState
                icon={Users}
                title="소속 인원이 없습니다"
                description="이 부서에 등록된 인원이 없습니다."
                className="py-12"
              />
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: designTokens.bg.secondary }}>
                      <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                        이름
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                        직급
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                        이메일
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                        연락처
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => (
                      <tr
                        key={member.id}
                        className="border-t"
                        style={{
                          backgroundColor: index % 2 === 0 ? designTokens.bg.default : designTokens.bg.secondary,
                        }}
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium" style={{ color: designTokens.text.primary }}>
                            {member.name}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm" style={{ color: designTokens.text.secondary }}>
                            {member.position || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm" style={{ color: designTokens.text.secondary }}>
                            {member.email}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm" style={{ color: designTokens.text.secondary }}>
                            {member.phone || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex justify-between pt-4 border-t">
            <Button
              onClick={handleOpenAddMember}
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              <UserPlus className="w-4 h-4 mr-1" />
              인원 추가
            </Button>
            <Button variant="outline" onClick={() => setShowMembersModal(false)}>
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 인원 추가 모달 */}
      <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              {viewingDepartment?.name}에 인원 추가
            </DialogTitle>
          </DialogHeader>

          <div className="flex-shrink-0 py-4 border-b">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: designTokens.text.placeholder }}
              />
              <Input
                placeholder="이름 또는 이메일로 검색..."
                value={searchAvailable}
                onChange={(e) => setSearchAvailable(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto py-4">
            {availableMembersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: designTokens.text.placeholder }} />
              </div>
            ) : filteredAvailableMembers.length === 0 ? (
              <EmptyState
                icon={Users}
                title="추가 가능한 인원이 없습니다"
                description={searchAvailable ? "검색 결과가 없습니다." : "모든 인원이 이미 이 부서에 소속되어 있습니다."}
                className="py-12"
              />
            ) : (
              <div className="space-y-2">
                {filteredAvailableMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium" style={{ color: designTokens.text.primary }}>
                          {member.name}
                        </span>
                        {member.position && (
                          <Badge variant="gray" className="text-xs">
                            {member.position}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm mt-0.5" style={{ color: designTokens.text.secondary }}>
                        {member.email}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddMember(member.id)}
                      disabled={addingMemberId === member.id}
                      style={{
                        backgroundColor: designTokens.button.brand_default,
                        color: designTokens.button.brand_text,
                      }}
                    >
                      {addingMemberId === member.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          추가
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-shrink-0 flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddMemberModal(false)}>
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
