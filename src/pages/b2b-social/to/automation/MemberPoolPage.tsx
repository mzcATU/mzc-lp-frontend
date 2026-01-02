import { useState } from 'react';
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
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  FileDown,
  FileUp,
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
} from '@/components/common';
import { cn } from '@/utils/cn';

// 회원 타입
interface Member {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  rank: string;
  joinDate: Date;
}

// 그룹 타입
interface MemberPool {
  id: string;
  name: string;
  description: string;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

// 샘플 회원 데이터
const sampleMembers: Member[] = [
  { id: 'm1', name: '김철수', email: 'cskim@company.com', department: '개발팀', position: '팀원', rank: '대리', joinDate: new Date('2022-03-15') },
  { id: 'm2', name: '이영희', email: 'yhlee@company.com', department: '개발팀', position: '팀원', rank: '과장', joinDate: new Date('2020-08-01') },
  { id: 'm3', name: '박지민', email: 'jmpark@company.com', department: '마케팅팀', position: '팀장', rank: '차장', joinDate: new Date('2019-01-10') },
  { id: 'm4', name: '최수진', email: 'sjchoi@company.com', department: '인사팀', position: '팀원', rank: '사원', joinDate: new Date('2024-01-02') },
  { id: 'm5', name: '정민호', email: 'mhjung@company.com', department: '영업팀', position: '팀원', rank: '대리', joinDate: new Date('2021-06-15') },
  { id: 'm6', name: '강서연', email: 'sykang@company.com', department: '개발팀', position: '팀원', rank: '사원', joinDate: new Date('2023-09-01') },
  { id: 'm7', name: '윤태희', email: 'thyun@company.com', department: '디자인팀', position: '팀장', rank: '과장', joinDate: new Date('2020-02-01') },
  { id: 'm8', name: '임재현', email: 'jhlim@company.com', department: '경영지원팀', position: '팀원', rank: '대리', joinDate: new Date('2022-11-15') },
  { id: 'm9', name: '한소희', email: 'shhan@company.com', department: 'QA팀', position: '팀원', rank: '과장', joinDate: new Date('2021-01-05') },
  { id: 'm10', name: '오준영', email: 'jyoh@company.com', department: '개발팀', position: '팀원', rank: '부장', joinDate: new Date('2018-05-20') },
];

// 샘플 POOL 데이터
const samplePools: MemberPool[] = [
  {
    id: 'p1',
    name: '2025 신입사원',
    description: '2025년 입사한 신입사원 그룹',
    members: sampleMembers.filter((m) => m.rank === '사원'),
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
    usageCount: 3,
  },
  {
    id: 'p2',
    name: '개발팀 전체',
    description: '개발팀 소속 전체 인원',
    members: sampleMembers.filter((m) => m.department === '개발팀'),
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-12-20'),
    usageCount: 12,
  },
  {
    id: 'p3',
    name: '팀장급',
    description: '팀장 직책을 가진 직원 그룹',
    members: sampleMembers.filter((m) => m.position === '팀장'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-11-10'),
    usageCount: 8,
  },
];

// 샘플 교육 과정 목록
const sampleCourses = [
  { id: 'c1', name: '회사 소개 및 조직문화', duration: '2시간' },
  { id: 'c2', name: '정보보안 기초', duration: '1시간' },
  { id: 'c3', name: '업무 시스템 사용법', duration: '3시간' },
  { id: 'c4', name: '리더십 기본 과정', duration: '4시간' },
  { id: 'c5', name: '성과 관리 및 피드백', duration: '2시간' },
];

/**
 * 그룹 관리 페이지
 * - 빈번하게 학습군으로 묶이는 인원들을 그룹화하여 관리
 * - 일괄 입과 기능 제공
 */
export const MemberPoolPage = () => {
  const [pools, setPools] = useState<MemberPool[]>(samplePools);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPool, setSelectedPool] = useState<MemberPool | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showMemberSelectModal, setShowMemberSelectModal] = useState(false);
  const [editingPool, setEditingPool] = useState<MemberPool | null>(null);

  // POOL 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: [] as Member[],
  });

  // 일괄 입과 상태
  const [enrollData, setEnrollData] = useState({
    poolId: '',
    courseIds: [] as string[],
  });

  // 회원 선택 상태
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  // 필터링된 POOL 목록
  const filteredPools = pools.filter(
    (pool) =>
      pool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 필터링된 회원 목록
  const filteredMembers = sampleMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );

  // POOL 삭제
  const deletePool = (id: string) => {
    setPools(pools.filter((p) => p.id !== id));
    if (selectedPool?.id === id) {
      setSelectedPool(null);
    }
  };

  // POOL 선택
  const selectPool = (pool: MemberPool) => {
    setSelectedPool(pool);
  };

  // 새 POOL 생성 모달 열기
  const openCreateModal = () => {
    setEditingPool(null);
    setFormData({ name: '', description: '', members: [] });
    setShowCreateModal(true);
  };

  // POOL 수정 모달 열기
  const openEditModal = (pool: MemberPool) => {
    setEditingPool(pool);
    setFormData({
      name: pool.name,
      description: pool.description,
      members: pool.members,
    });
    setShowCreateModal(true);
  };

  // POOL 저장
  const handleSavePool = () => {
    if (!formData.name || formData.members.length === 0) return;

    if (editingPool) {
      // 수정
      const updated = pools.map((p) =>
        p.id === editingPool.id
          ? {
              ...p,
              name: formData.name,
              description: formData.description,
              members: formData.members,
              updatedAt: new Date(),
            }
          : p
      );
      setPools(updated);
      if (selectedPool?.id === editingPool.id) {
        setSelectedPool({
          ...editingPool,
          name: formData.name,
          description: formData.description,
          members: formData.members,
          updatedAt: new Date(),
        });
      }
    } else {
      // 생성
      const newPool: MemberPool = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        members: formData.members,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
      };
      setPools([...pools, newPool]);
    }

    setShowCreateModal(false);
    setFormData({ name: '', description: '', members: [] });
    setEditingPool(null);
  };

  // 일괄 입과 모달 열기
  const openEnrollModal = (pool: MemberPool) => {
    setEnrollData({ poolId: pool.id, courseIds: [] });
    setShowEnrollModal(true);
  };

  // 일괄 입과 실행
  const handleEnroll = () => {
    // 실제 구현에서는 API 호출
    console.log('Enrolling pool:', enrollData);
    setShowEnrollModal(false);
    setEnrollData({ poolId: '', courseIds: [] });
  };

  // 회원 선택 모달 열기
  const openMemberSelectModal = () => {
    setSelectedMembers(formData.members);
    setMemberSearchTerm('');
    setShowMemberSelectModal(true);
  };

  // 회원 선택 확인
  const confirmMemberSelection = () => {
    setFormData({ ...formData, members: selectedMembers });
    setShowMemberSelectModal(false);
  };

  // 회원 선택 토글
  const toggleMemberSelection = (member: Member) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.id === member.id)
        ? prev.filter((m) => m.id !== member.id)
        : [...prev, member]
    );
  };

  // 교육 과정 선택 토글
  const toggleCourseSelection = (courseId: string) => {
    setEnrollData((prev) => ({
      ...prev,
      courseIds: prev.courseIds.includes(courseId)
        ? prev.courseIds.filter((id) => id !== courseId)
        : [...prev.courseIds, courseId],
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
              그룹 관리
            </h1>
            <p className="text-sm" style={{ color: designTokens.text.secondary }}>
              임직원을 그룹화하여 효율적으로 관리하고 일괄 입과할 수 있습니다.
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
              POOL 생성
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    전체 POOL
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.text.primary }}
                  >
                    {pools.length}
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
                    총 회원 수
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.text.primary }}
                  >
                    {pools.reduce((sum, p) => sum + p.members.length, 0)}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: designTokens.bg.secondary }}
                >
                  <UserPlus className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    총 입과 횟수
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.button.brand_default }}
                  >
                    {pools.reduce((sum, p) => sum + p.usageCount, 0)}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${designTokens.button.brand_default}15` }}
                >
                  <GraduationCap
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
          {/* POOL 목록 */}
          <div className="col-span-5">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>POOL 목록</CardTitle>
                  <Badge variant="gray">{filteredPools.length}개</Badge>
                </div>
                <div className="relative mt-3">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: designTokens.text.placeholder }}
                  />
                  <Input
                    placeholder="POOL 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredPools.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="POOL이 없습니다"
                    description="새 POOL을 생성해보세요."
                    className="py-12"
                  />
                ) : (
                  <div className="divide-y" style={{ borderColor: designTokens.bg.border }}>
                    {filteredPools.map((pool) => (
                      <button
                        key={pool.id}
                        type="button"
                        onClick={() => selectPool(pool)}
                        className={cn(
                          'w-full p-4 text-left transition-colors',
                          selectedPool?.id === pool.id && 'bg-opacity-50'
                        )}
                        style={{
                          backgroundColor:
                            selectedPool?.id === pool.id
                              ? `${designTokens.button.brand_default}08`
                              : 'transparent',
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className="font-medium"
                            style={{
                              color:
                                selectedPool?.id === pool.id
                                  ? designTokens.button.brand_default
                                  : designTokens.text.primary,
                            }}
                          >
                            {pool.name}
                          </p>
                          <ChevronRight
                            className="w-4 h-4"
                            style={{ color: designTokens.text.placeholder }}
                          />
                        </div>
                        <p
                          className="text-sm line-clamp-1"
                          style={{ color: designTokens.text.secondary }}
                        >
                          {pool.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="gray" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {pool.members.length}명
                          </Badge>
                          <span
                            className="text-xs"
                            style={{ color: designTokens.text.placeholder }}
                          >
                            {pool.usageCount}회 사용
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* POOL 상세 */}
          <div className="col-span-7">
            <Card className="h-full">
              {selectedPool ? (
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedPool.name}</CardTitle>
                        <p
                          className="text-sm mt-1"
                          style={{ color: designTokens.text.secondary }}
                        >
                          {selectedPool.description}
                        </p>
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
                          size="sm"
                          className="gap-1"
                          style={{
                            backgroundColor: designTokens.button.brand_default,
                            color: designTokens.button.brand_text,
                          }}
                          onClick={() => openEnrollModal(selectedPool)}
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
                              onClick={() => deletePool(selectedPool.id)}
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
                          회원 목록 ({selectedPool.members.length})
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-1">
                          <GraduationCap className="w-4 h-4" />
                          입과 이력
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

                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>이름</TableHead>
                              <TableHead>이메일</TableHead>
                              <TableHead>부서</TableHead>
                              <TableHead>직책</TableHead>
                              <TableHead>직급</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedPool.members.map((member) => (
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
                                  <Badge variant="gray">{member.department}</Badge>
                                </TableCell>
                                <TableCell>
                                  <span style={{ color: designTokens.text.secondary }}>
                                    {member.position}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span style={{ color: designTokens.text.secondary }}>
                                    {member.rank}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TabsContent>

                      <TabsContent value="history">
                        <div
                          className="text-center py-12"
                          style={{ color: designTokens.text.secondary }}
                        >
                          <GraduationCap
                            className="w-12 h-12 mx-auto mb-3 opacity-30"
                            style={{ color: designTokens.text.placeholder }}
                          />
                          <p>입과 이력이 없습니다.</p>
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
                      왼쪽에서 POOL을 선택하세요
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* POOL 생성/수정 모달 */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {editingPool ? 'POOL 수정' : '새 POOL 생성'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">
                  POOL명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="POOL 이름"
                />
              </div>
              <div>
                <Label className="mb-2 block">설명</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="POOL에 대한 간단한 설명"
                />
              </div>
            </div>

            {/* 회원 선택 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>
                  회원 <span className="text-red-500">*</span>
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openMemberSelectModal}
                  className="gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  회원 선택
                </Button>
              </div>

              {formData.members.length === 0 ? (
                <div
                  className="border rounded-lg p-8 text-center"
                  style={{ borderColor: designTokens.bg.border }}
                >
                  <Users
                    className="w-10 h-10 mx-auto mb-2 opacity-30"
                    style={{ color: designTokens.text.placeholder }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: designTokens.text.secondary }}
                  >
                    회원을 선택해주세요
                  </p>
                </div>
              ) : (
                <div
                  className="border rounded-lg max-h-[300px] overflow-y-auto"
                  style={{ borderColor: designTokens.bg.border }}
                >
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>부서</TableHead>
                        <TableHead>직급</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>{member.rank}</TableCell>
                          <TableCell>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  members: formData.members.filter(
                                    (m) => m.id !== member.id
                                  ),
                                })
                              }
                              className="p-1 rounded transition-colors hover:bg-red-50"
                            >
                              <X
                                className="w-4 h-4"
                                style={{ color: designTokens.status.error_text }}
                              />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <p
                className="text-xs mt-2"
                style={{ color: designTokens.text.placeholder }}
              >
                {formData.members.length}명 선택됨
              </p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                setFormData({ name: '', description: '', members: [] });
                setEditingPool(null);
              }}
              className="gap-1"
            >
              <X className="w-4 h-4" />
              취소
            </Button>
            <Button
              onClick={handleSavePool}
              disabled={!formData.name || formData.members.length === 0}
              className="gap-1"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              <Save className="w-4 h-4" />
              {editingPool ? '수정' : '저장'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 회원 선택 모달 */}
      <Dialog open={showMemberSelectModal} onOpenChange={setShowMemberSelectModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              회원 선택
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {/* 검색 */}
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: designTokens.text.placeholder }}
              />
              <Input
                placeholder="이름, 이메일, 부서 검색..."
                value={memberSearchTerm}
                onChange={(e) => setMemberSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 선택된 회원 표시 */}
            {selectedMembers.length > 0 && (
              <div className="mb-4">
                <p
                  className="text-xs font-medium mb-2"
                  style={{ color: designTokens.text.secondary }}
                >
                  선택됨 ({selectedMembers.length}명)
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedMembers.map((member) => (
                    <Badge key={member.id} variant="blue" className="gap-1 pr-1">
                      {member.name}
                      <button
                        type="button"
                        onClick={() => toggleMemberSelection(member)}
                        className="ml-1 p-0.5 rounded hover:bg-black/10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 회원 목록 */}
            <div
              className="border rounded-lg max-h-[400px] overflow-y-auto"
              style={{ borderColor: designTokens.bg.border }}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedMembers.length === sampleMembers.length}
                        onCheckedChange={() => {
                          if (selectedMembers.length === sampleMembers.length) {
                            setSelectedMembers([]);
                          } else {
                            setSelectedMembers(sampleMembers);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>직책</TableHead>
                    <TableHead>직급</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedMembers.some((m) => m.id === member.id)}
                          onCheckedChange={() => toggleMemberSelection(member)}
                        />
                      </TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>
                        <span style={{ color: designTokens.text.secondary }}>
                          {member.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="gray">{member.department}</Badge>
                      </TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.rank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowMemberSelectModal(false)}
            >
              취소
            </Button>
            <Button
              onClick={confirmMemberSelection}
              className="gap-1"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              <CheckCircle2 className="w-4 h-4" />
              선택 완료 ({selectedMembers.length}명)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 일괄 입과 모달 */}
      <Dialog open={showEnrollModal} onOpenChange={setShowEnrollModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              일괄 입과
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm mb-4" style={{ color: designTokens.text.secondary }}>
              선택한 POOL의 모든 회원을 아래 교육 과정에 일괄 입과합니다.
            </p>

            {/* POOL 정보 */}
            <div
              className="p-3 rounded-lg mb-4"
              style={{ backgroundColor: designTokens.bg.secondary }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: designTokens.text.secondary }} />
                <span style={{ color: designTokens.text.primary }}>
                  {pools.find((p) => p.id === enrollData.poolId)?.name}
                </span>
                <Badge variant="gray">
                  {pools.find((p) => p.id === enrollData.poolId)?.members.length}명
                </Badge>
              </div>
            </div>

            {/* 교육 과정 선택 */}
            <Label className="mb-2 block">교육 과정 선택</Label>
            <div
              className="border rounded-lg max-h-[300px] overflow-y-auto"
              style={{ borderColor: designTokens.bg.border }}
            >
              {sampleCourses.map((course) => {
                const isSelected = enrollData.courseIds.includes(course.id);
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => toggleCourseSelection(course.id)}
                    className="w-full flex items-center justify-between p-3 text-left border-b last:border-b-0 transition-colors"
                    style={{
                      borderColor: designTokens.bg.border,
                      backgroundColor: isSelected
                        ? `${designTokens.button.brand_default}08`
                        : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isSelected} />
                      <div>
                        <span
                          style={{
                            color: isSelected
                              ? designTokens.button.brand_default
                              : designTokens.text.primary,
                          }}
                        >
                          {course.name}
                        </span>
                        <p
                          className="text-xs"
                          style={{ color: designTokens.text.placeholder }}
                        >
                          {course.duration}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <p
              className="text-xs mt-2"
              style={{ color: designTokens.text.placeholder }}
            >
              {enrollData.courseIds.length}개 과정 선택됨
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEnrollModal(false)}>
              취소
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={enrollData.courseIds.length === 0}
              className="gap-1"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              <GraduationCap className="w-4 h-4" />
              일괄 입과 실행
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
