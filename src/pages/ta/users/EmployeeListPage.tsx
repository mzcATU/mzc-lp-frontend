import { useState } from 'react';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  FileDown,
  FileUp,
  Save,
  CheckCircle2,
  Building2,
  Calendar,
  AlertCircle,
  Download,
  Eye,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common';

// 임직원 타입
interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  rank: string;
  jobRole: string;
  joinDate: Date;
  status: 'active' | 'inactive' | 'leave';
  hasLmsAccount?: boolean; // LMS 계정 연동 여부
  lmsUserId?: number; // 연동된 LMS 사용자 ID
}

// 샘플 임직원 데이터
const sampleEmployees: Employee[] = [
  { id: 'e1', name: '김철수', email: 'cskim@company.com', department: '개발팀', position: '팀원', rank: '대리', jobRole: '백엔드 개발', joinDate: new Date('2022-03-15'), status: 'active', hasLmsAccount: true, lmsUserId: 101 },
  { id: 'e2', name: '이영희', email: 'yhlee@company.com', department: '개발팀', position: '팀원', rank: '과장', jobRole: '프론트엔드 개발', joinDate: new Date('2020-08-01'), status: 'active', hasLmsAccount: true, lmsUserId: 102 },
  { id: 'e3', name: '박지민', email: 'jmpark@company.com', department: '마케팅팀', position: '팀장', rank: '차장', jobRole: '마케팅 기획', joinDate: new Date('2019-01-10'), status: 'active', hasLmsAccount: false },
  { id: 'e4', name: '최수진', email: 'sjchoi@company.com', department: '인사팀', position: '팀원', rank: '사원', jobRole: '인사 관리', joinDate: new Date('2024-01-02'), status: 'active' },
  { id: 'e5', name: '정민호', email: 'mhjung@company.com', department: '영업팀', position: '팀원', rank: '대리', jobRole: '영업 관리', joinDate: new Date('2021-06-15'), status: 'active' },
  { id: 'e6', name: '강서연', email: 'sykang@company.com', department: '개발팀', position: '팀원', rank: '사원', jobRole: '프론트엔드 개발', joinDate: new Date('2023-09-01'), status: 'active' },
  { id: 'e7', name: '윤태희', email: 'thyun@company.com', department: '디자인팀', position: '팀장', rank: '과장', jobRole: 'UI/UX 디자인', joinDate: new Date('2020-02-01'), status: 'leave' },
  { id: 'e8', name: '임재현', email: 'jhlim@company.com', department: '경영지원팀', position: '팀원', rank: '대리', jobRole: '총무', joinDate: new Date('2022-11-15'), status: 'active' },
  { id: 'e9', name: '한소희', email: 'shhan@company.com', department: 'QA팀', position: '팀원', rank: '과장', jobRole: 'QA 엔지니어', joinDate: new Date('2021-01-05'), status: 'active' },
  { id: 'e10', name: '오준영', email: 'jyoh@company.com', department: '개발팀', position: '팀원', rank: '부장', jobRole: 'DevOps', joinDate: new Date('2018-05-20'), status: 'active' },
  { id: 'e11', name: '송민지', email: 'mjsong@company.com', department: '마케팅팀', position: '팀원', rank: '대리', jobRole: '콘텐츠 마케팅', joinDate: new Date('2021-09-01'), status: 'active' },
  { id: 'e12', name: '조현우', email: 'hwjo@company.com', department: '영업팀', position: '팀장', rank: '차장', jobRole: '영업 관리', joinDate: new Date('2017-03-15'), status: 'active' },
  { id: 'e13', name: '배수현', email: 'shbae@company.com', department: '인사팀', position: '팀장', rank: '과장', jobRole: '채용 담당', joinDate: new Date('2019-06-01'), status: 'active' },
  { id: 'e14', name: '권도윤', email: 'dykwon@company.com', department: '개발팀', position: '팀원', rank: '사원', jobRole: '백엔드 개발', joinDate: new Date('2024-03-01'), status: 'active' },
  { id: 'e15', name: '신유진', email: 'yjshin@company.com', department: '디자인팀', position: '팀원', rank: '대리', jobRole: '그래픽 디자인', joinDate: new Date('2022-01-15'), status: 'inactive' },
];

// 부서 목록
const departments = ['전체', '개발팀', '마케팅팀', '인사팀', '영업팀', '디자인팀', '경영지원팀', 'QA팀'];
// 직급 목록
const ranks = ['전체', '사원', '대리', '과장', '차장', '부장'];
// 상태 목록
const statuses = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '재직' },
  { value: 'inactive', label: '퇴직' },
  { value: 'leave', label: '휴직' },
];

const statusLabels: Record<Employee['status'], string> = {
  active: '재직',
  inactive: '퇴직',
  leave: '휴직',
};

const statusColors: Record<Employee['status'], 'green' | 'gray' | 'orange'> = {
  active: 'green',
  inactive: 'gray',
  leave: 'orange',
};

// 엑셀 업로드 미리보기 타입
interface UploadPreview {
  total: number;
  new: number;
  update: number;
  errors: { row: number; message: string }[];
  data: Partial<Employee>[];
}

/**
 * 임직원 목록 페이지
 * - HR 시스템 연동 임직원 마스터 데이터 관리
 * - 엑셀 일괄 등록/내보내기
 * - 검색, 필터링
 */
export const EmployeeListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('전체');
  const [filterRank, setFilterRank] = useState('전체');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [uploadPreview, setUploadPreview] = useState<UploadPreview | null>(null);
  const [showLmsAccountModal, setShowLmsAccountModal] = useState(false);
  const [lmsAccountEmployee, setLmsAccountEmployee] = useState<Employee | null>(null);

  // 필터링된 임직원 목록
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === '전체' || emp.department === filterDepartment;
    const matchesRank = filterRank === '전체' || emp.rank === filterRank;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesRank && matchesStatus;
  });

  // 전체 선택 토글
  const toggleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((e) => e.id));
    }
  };

  // 개별 선택 토글
  const toggleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // 임직원 삭제
  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((e) => e.id !== id));
    setSelectedEmployees(selectedEmployees.filter((e) => e !== id));
  };

  // 선택 삭제
  const deleteSelectedEmployees = () => {
    setEmployees(employees.filter((e) => !selectedEmployees.includes(e.id)));
    setSelectedEmployees([]);
  };

  // 상세 보기
  const openDetailModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  // 수정 모달
  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  // LMS 계정 생성 모달 열기
  const openLmsAccountModal = (employee: Employee) => {
    setLmsAccountEmployee(employee);
    setShowLmsAccountModal(true);
  };

  // LMS 계정 생성
  const createLmsAccount = () => {
    if (!lmsAccountEmployee) return;

    // 시뮬레이션: 실제로는 API 호출
    const newLmsUserId = Math.floor(Math.random() * 1000) + 100;
    setEmployees(employees.map(emp =>
      emp.id === lmsAccountEmployee.id
        ? { ...emp, hasLmsAccount: true, lmsUserId: newLmsUserId }
        : emp
    ));

    setShowLmsAccountModal(false);
    setLmsAccountEmployee(null);
    toast.success(`${lmsAccountEmployee.name}님의 LMS 계정이 생성되었습니다.`);
  };

  // 엑셀 파일 처리 (시뮬레이션)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 실제 구현에서는 파일 파싱 로직
    // 여기서는 시뮬레이션 데이터
    setUploadPreview({
      total: 25,
      new: 18,
      update: 5,
      errors: [
        { row: 12, message: '이메일 형식이 올바르지 않습니다.' },
        { row: 23, message: '필수 항목(부서)이 누락되었습니다.' },
      ],
      data: [
        { name: '신규입사자1', email: 'new1@company.com', department: '개발팀', rank: '사원' },
        { name: '신규입사자2', email: 'new2@company.com', department: '마케팅팀', rank: '대리' },
      ],
    });
  };

  // 업로드 확정
  const confirmUpload = () => {
    // TODO: 실제 구현에서는 API 호출
    setShowUploadModal(false);
    setUploadPreview(null);
  };

  // 통계 계산
  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === 'active').length,
    inactive: employees.filter((e) => e.status === 'inactive').length,
    leave: employees.filter((e) => e.status === 'leave').length,
    withLmsAccount: employees.filter(e => e.hasLmsAccount).length,
    withoutLmsAccount: employees.filter(e => e.status === 'active' && !e.hasLmsAccount).length,
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
              임직원 목록
            </h1>
            <p className="text-sm" style={{ color: designTokens.text.secondary }}>
              HR 시스템과 연동된 임직원 정보를 관리합니다.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setShowUploadModal(true)}>
              <FileUp className="w-4 h-4" />
              엑셀 업로드
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
            >
              <UserPlus className="w-4 h-4" />
              임직원 추가
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    전체 임직원
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
                    재직
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
                  <CheckCircle2 className="w-5 h-5" style={{ color: designTokens.status.success_text }} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    휴직
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.status.warning_text }}
                  >
                    {stats.leave}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: designTokens.status.warning_background }}
                >
                  <Calendar className="w-5 h-5" style={{ color: designTokens.status.warning_text }} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    퇴직
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.text.placeholder }}
                  >
                    {stats.inactive}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: designTokens.bg.secondary }}
                >
                  <Users className="w-5 h-5" style={{ color: designTokens.text.placeholder }} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                    LMS 계정 연동
                  </p>
                  <p
                    className="text-2xl font-semibold mt-1"
                    style={{ color: designTokens.badge.blue.text }}
                  >
                    {stats.withLmsAccount}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: designTokens.badge.blue.bg }}
                >
                  <CheckCircle2 className="w-5 h-5" style={{ color: designTokens.badge.blue.text }} />
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
                  placeholder="이름, 이메일, 부서 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[150px]">
                  <Building2 className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="부서" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterRank} onValueChange={setFilterRank}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="직급" />
                </SelectTrigger>
                <SelectContent>
                  {ranks.map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 임직원 목록 테이블 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                임직원 목록
                <span
                  className="text-sm font-normal ml-2"
                  style={{ color: designTokens.text.secondary }}
                >
                  ({filteredEmployees.length}명)
                </span>
              </CardTitle>
              {selectedEmployees.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="gray">{selectedEmployees.length}명 선택</Badge>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Users className="w-3 h-3" />
                    그룹에 추가
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    style={{ color: designTokens.status.error_text }}
                    onClick={deleteSelectedEmployees}
                  >
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {filteredEmployees.length === 0 ? (
              <EmptyState
                icon={Users}
                title="임직원이 없습니다"
                description="새 임직원을 추가하거나 엑셀 파일을 업로드하세요."
                className="py-12"
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedEmployees.length === filteredEmployees.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>직책</TableHead>
                    <TableHead>직급</TableHead>
                    <TableHead>직무</TableHead>
                    <TableHead>입사일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>LMS 계정</TableHead>
                    <TableHead className="w-[120px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={() => toggleSelectEmployee(employee.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => openDetailModal(employee)}
                          className="font-medium hover:underline"
                          style={{ color: designTokens.text.primary }}
                        >
                          {employee.name}
                        </button>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: designTokens.text.secondary }}>
                          {employee.email}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="gray">{employee.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: designTokens.text.secondary }}>
                          {employee.position}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: designTokens.text.primary }}>
                          {employee.rank}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: designTokens.text.secondary }}>
                          {employee.jobRole}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: designTokens.text.secondary }}>
                          {employee.joinDate.toLocaleDateString('ko-KR')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusColors[employee.status]}>
                          {statusLabels[employee.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {employee.hasLmsAccount ? (
                          <Badge variant="blue">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            연동됨
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openLmsAccountModal(employee)}
                            className="text-xs gap-1"
                            disabled={employee.status !== 'active'}
                          >
                            <UserPlus className="w-3 h-3" />
                            계정 생성
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
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
                            <DropdownMenuItem onClick={() => openDetailModal(employee)}>
                              <Eye className="w-4 h-4 mr-2" />
                              상세 보기
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(employee)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              수정
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteEmployee(employee.id)}
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

      {/* 엑셀 업로드 모달 */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileUp className="w-5 h-5" />
              엑셀 파일 업로드
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {!uploadPreview ? (
              <>
                {/* 파일 업로드 영역 */}
                <div
                  className="border-2 border-dashed rounded-xl p-8 text-center"
                  style={{ borderColor: designTokens.bg.border }}
                >
                  <FileUp
                    className="w-12 h-12 mx-auto mb-4"
                    style={{ color: designTokens.text.placeholder }}
                  />
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: designTokens.text.primary }}
                  >
                    엑셀 파일을 드래그하거나 클릭하여 선택하세요
                  </p>
                  <p
                    className="text-xs mb-4"
                    style={{ color: designTokens.text.placeholder }}
                  >
                    .xlsx, .xls 파일 지원
                  </p>
                  <label>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button variant="outline" className="gap-2" asChild>
                      <span>
                        <FileUp className="w-4 h-4" />
                        파일 선택
                      </span>
                    </Button>
                  </label>
                </div>

                {/* 양식 다운로드 */}
                <div
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: designTokens.bg.secondary }}
                >
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: designTokens.text.primary }}
                    >
                      양식 파일 다운로드
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: designTokens.text.secondary }}
                    >
                      업로드 전 양식에 맞춰 데이터를 준비하세요
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="w-4 h-4" />
                    양식 다운로드
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* 업로드 미리보기 */}
                <div className="space-y-4">
                  {/* 요약 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className="p-4 rounded-lg text-center"
                      style={{ backgroundColor: designTokens.bg.secondary }}
                    >
                      <p
                        className="text-2xl font-semibold"
                        style={{ color: designTokens.text.primary }}
                      >
                        {uploadPreview.total}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: designTokens.text.secondary }}
                      >
                        전체 행
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-lg text-center"
                      style={{ backgroundColor: designTokens.status.success_background }}
                    >
                      <p
                        className="text-2xl font-semibold"
                        style={{ color: designTokens.status.success_text }}
                      >
                        {uploadPreview.new}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: designTokens.status.success_text }}
                      >
                        신규 추가
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-lg text-center"
                      style={{ backgroundColor: `${designTokens.button.brand_default}15` }}
                    >
                      <p
                        className="text-2xl font-semibold"
                        style={{ color: designTokens.button.brand_default }}
                      >
                        {uploadPreview.update}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: designTokens.button.brand_default }}
                      >
                        업데이트
                      </p>
                    </div>
                  </div>

                  {/* 오류 목록 */}
                  {uploadPreview.errors.length > 0 && (
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: designTokens.status.error_background }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle
                          className="w-4 h-4"
                          style={{ color: designTokens.status.error_text }}
                        />
                        <p
                          className="text-sm font-medium"
                          style={{ color: designTokens.status.error_text }}
                        >
                          {uploadPreview.errors.length}개 오류 발견
                        </p>
                      </div>
                      <ul className="space-y-1">
                        {uploadPreview.errors.map((error, idx) => (
                          <li
                            key={idx}
                            className="text-xs"
                            style={{ color: designTokens.status.error_text }}
                          >
                            행 {error.row}: {error.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 미리보기 테이블 */}
                  <div>
                    <p
                      className="text-sm font-medium mb-2"
                      style={{ color: designTokens.text.primary }}
                    >
                      데이터 미리보기 (상위 2건)
                    </p>
                    <div
                      className="border rounded-lg overflow-hidden"
                      style={{ borderColor: designTokens.bg.border }}
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>이름</TableHead>
                            <TableHead>이메일</TableHead>
                            <TableHead>부서</TableHead>
                            <TableHead>직급</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uploadPreview.data.map((emp, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{emp.name}</TableCell>
                              <TableCell>{emp.email}</TableCell>
                              <TableCell>{emp.department}</TableCell>
                              <TableCell>{emp.rank}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowUploadModal(false);
                setUploadPreview(null);
              }}
            >
              취소
            </Button>
            {uploadPreview && (
              <Button
                onClick={confirmUpload}
                disabled={uploadPreview.errors.length > 0}
                className="gap-1"
                style={{
                  backgroundColor: designTokens.button.brand_default,
                  color: designTokens.button.brand_text,
                }}
              >
                <CheckCircle2 className="w-4 h-4" />
                업로드 확정
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 상세 보기 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              임직원 상세 정보
            </DialogTitle>
          </DialogHeader>

          {selectedEmployee && (
            <div className="py-4 space-y-4">
              {/* 기본 정보 */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold"
                  style={{
                    backgroundColor: designTokens.button.brand_default,
                    color: '#fff',
                  }}
                >
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: designTokens.text.primary }}
                  >
                    {selectedEmployee.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={statusColors[selectedEmployee.status]}>
                      {statusLabels[selectedEmployee.status]}
                    </Badge>
                    <Badge variant="gray">{selectedEmployee.department}</Badge>
                  </div>
                </div>
              </div>

              {/* 상세 정보 */}
              <div
                className="grid grid-cols-2 gap-4 p-4 rounded-lg"
                style={{ backgroundColor: designTokens.bg.secondary }}
              >
                <div>
                  <p className="text-xs" style={{ color: designTokens.text.placeholder }}>
                    이메일
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: designTokens.text.primary }}>
                    {selectedEmployee.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: designTokens.text.placeholder }}>
                    부서
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: designTokens.text.primary }}>
                    {selectedEmployee.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: designTokens.text.placeholder }}>
                    직책
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: designTokens.text.primary }}>
                    {selectedEmployee.position}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: designTokens.text.placeholder }}>
                    직급
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: designTokens.text.primary }}>
                    {selectedEmployee.rank}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: designTokens.text.placeholder }}>
                    직무
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: designTokens.text.primary }}>
                    {selectedEmployee.jobRole}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: designTokens.text.placeholder }}>
                    입사일
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: designTokens.text.primary }}>
                    {selectedEmployee.joinDate.toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              닫기
            </Button>
            <Button
              onClick={() => {
                setShowDetailModal(false);
                if (selectedEmployee) openEditModal(selectedEmployee);
              }}
              className="gap-1"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              <Pencil className="w-4 h-4" />
              수정
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 수정 모달 */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              임직원 정보 수정
            </DialogTitle>
          </DialogHeader>

          {selectedEmployee && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">이름</Label>
                  <Input defaultValue={selectedEmployee.name} />
                </div>
                <div>
                  <Label className="mb-2 block">이메일</Label>
                  <Input defaultValue={selectedEmployee.email} />
                </div>
                <div>
                  <Label className="mb-2 block">부서</Label>
                  <Select defaultValue={selectedEmployee.department}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.filter((d) => d !== '전체').map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">직급</Label>
                  <Select defaultValue={selectedEmployee.rank}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ranks.filter((r) => r !== '전체').map((rank) => (
                        <SelectItem key={rank} value={rank}>
                          {rank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block">직책</Label>
                  <Input defaultValue={selectedEmployee.position} />
                </div>
                <div>
                  <Label className="mb-2 block">직무</Label>
                  <Input defaultValue={selectedEmployee.jobRole} />
                </div>
                <div>
                  <Label className="mb-2 block">상태</Label>
                  <Select defaultValue={selectedEmployee.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.filter((s) => s.value !== 'all').map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              취소
            </Button>
            <Button
              onClick={() => setShowEditModal(false)}
              className="gap-1"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              <Save className="w-4 h-4" />
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* LMS 계정 생성 다이얼로그 */}
      <Dialog open={showLmsAccountModal} onOpenChange={setShowLmsAccountModal}>
        <DialogContent className="max-w-md" aria-describedby="lms-account-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              LMS 계정 생성
            </DialogTitle>
            <DialogDescription id="lms-account-description">
              선택한 임직원의 LMS 계정을 생성합니다.
            </DialogDescription>
          </DialogHeader>
          {lmsAccountEmployee && (
            <div className="space-y-4 py-4">
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: designTokens.bg.secondary }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold"
                    style={{
                      backgroundColor: designTokens.button.brand_default,
                      color: '#fff',
                    }}
                  >
                    {lmsAccountEmployee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: designTokens.text.primary }}>
                      {lmsAccountEmployee.name}
                    </p>
                    <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                      {lmsAccountEmployee.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span style={{ color: designTokens.text.placeholder }}>부서: </span>
                    <span style={{ color: designTokens.text.primary }}>
                      {lmsAccountEmployee.department}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: designTokens.text.placeholder }}>직급: </span>
                    <span style={{ color: designTokens.text.primary }}>
                      {lmsAccountEmployee.rank}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="p-3 rounded-lg border"
                style={{ borderColor: designTokens.badge.blue.text, backgroundColor: designTokens.badge.blue.bg }}
              >
                <p className="text-sm" style={{ color: designTokens.badge.blue.text }}>
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  이메일 주소로 LMS 계정이 생성되며, 초기 비밀번호는 이메일로 발송됩니다.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowLmsAccountModal(false)}>
              취소
            </Button>
            <Button
              onClick={createLmsAccount}
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              계정 생성
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
