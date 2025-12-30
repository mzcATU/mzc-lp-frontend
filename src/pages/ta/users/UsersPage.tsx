import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Mail, UserPlus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import {
  AdminPageHeader,
  StatusBadge,
  RoleBadge,
} from '@/components/domain/admin';
import { DataTable, DataTableColumnHeader } from '@/components/common/DataTable';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';
import { Label } from '@/components/common/Label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/Avatar';
import type { UserStatus, SystemRole } from '@/components/domain/admin';

// Mock 데이터
interface UserRow {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  role: SystemRole;
  department?: string;
  coursesEnrolled: number;
  lastActiveAt: string;
  createdAt: string;
}

const mockUsers: UserRow[] = [
  { id: 1, name: '김민수', email: 'minsu.kim@company.com', status: 'ACTIVE', role: 'OPERATOR', department: '개발팀', coursesEnrolled: 8, lastActiveAt: '2025-12-29', createdAt: '2025-01-15' },
  { id: 2, name: '이영희', email: 'younghee.lee@company.com', status: 'ACTIVE', role: 'USER', department: '마케팅팀', coursesEnrolled: 5, lastActiveAt: '2025-12-29', createdAt: '2025-01-10' },
  { id: 3, name: '박철수', email: 'cheolsu.park@company.com', status: 'PENDING', role: 'USER', department: '영업팀', coursesEnrolled: 0, lastActiveAt: '-', createdAt: '2025-12-28' },
  { id: 4, name: '정수진', email: 'sujin.jung@company.com', status: 'ACTIVE', role: 'USER', department: '개발팀', coursesEnrolled: 12, lastActiveAt: '2025-12-28', createdAt: '2025-01-05' },
  { id: 5, name: '최동현', email: 'donghyun.choi@company.com', status: 'INACTIVE', role: 'USER', department: 'HR팀', coursesEnrolled: 3, lastActiveAt: '2025-11-15', createdAt: '2024-12-20' },
  { id: 6, name: '한지원', email: 'jiwon.han@company.com', status: 'ACTIVE', role: 'USER', department: '기획팀', coursesEnrolled: 7, lastActiveAt: '2025-12-29', createdAt: '2025-01-02' },
  { id: 7, name: '오세훈', email: 'sehun.oh@company.com', status: 'ACTIVE', role: 'OPERATOR', department: '개발팀', coursesEnrolled: 15, lastActiveAt: '2025-12-29', createdAt: '2024-12-15' },
  { id: 8, name: '윤서연', email: 'seoyeon.yoon@company.com', status: 'BLOCKED', role: 'USER', department: '디자인팀', coursesEnrolled: 4, lastActiveAt: '2025-10-30', createdAt: '2024-11-30' },
  { id: 9, name: '장현우', email: 'hyunwoo.jang@company.com', status: 'ACTIVE', role: 'USER', department: 'QA팀', coursesEnrolled: 9, lastActiveAt: '2025-12-27', createdAt: '2024-12-01' },
  { id: 10, name: '임수빈', email: 'subin.lim@company.com', status: 'ACTIVE', role: 'USER', department: '개발팀', coursesEnrolled: 6, lastActiveAt: '2025-12-29', createdAt: '2024-11-20' },
];

export function UsersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  // 필터링된 데이터
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const columns: ColumnDef<UserRow>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="사용자" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.original.name}`} />
            <AvatarFallback>{row.original.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-text-secondary">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'role',
      header: '역할',
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: 'department',
      header: '부서',
      cell: ({ row }) => (
        <span className="text-text-secondary">{row.original.department || '-'}</span>
      ),
    },
    {
      accessorKey: 'coursesEnrolled',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="수강 강좌" />
      ),
      cell: ({ row }) => (
        <span className="text-text-secondary">{row.original.coursesEnrolled}개</span>
      ),
    },
    {
      accessorKey: 'lastActiveAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="최근 활동" />
      ),
      cell: ({ row }) => (
        <span className="text-text-secondary">{row.original.lastActiveAt}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewDetail(row.original)}>
              <Eye className="mr-2 h-4 w-4" />
              상세 보기
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" />
              수정
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(row.original)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleViewDetail = (user: UserRow) => {
    navigate(`/ta/users/${user.id}`);
  };

  const handleEdit = (user: UserRow) => {
    setSelectedUser(user);
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (user: UserRow) => {
    if (confirm(`'${user.name}' 사용자를 삭제하시겠습니까?`)) {
      console.log('Delete user:', user.id);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="사용자 관리"
        description="테넌트 내 사용자를 관리합니다"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(true)}>
              <Mail className="mr-2 h-4 w-4" />
              초대하기
            </Button>
            <Button onClick={handleCreateUser}>
              <Plus className="mr-2 h-4 w-4" />
              사용자 추가
            </Button>
          </div>
        }
      />

      {/* 필터 영역 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            placeholder="이름 또는 이메일 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="ACTIVE">활성</SelectItem>
            <SelectItem value="INACTIVE">비활성</SelectItem>
            <SelectItem value="PENDING">대기</SelectItem>
            <SelectItem value="BLOCKED">차단</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="역할" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 역할</SelectItem>
            <SelectItem value="TENANT_ADMIN">테넌트 관리자</SelectItem>
            <SelectItem value="OPERATOR">운영자</SelectItem>
            <SelectItem value="USER">일반 사용자</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 사용자 목록 테이블 */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        showColumnToggle={false}
        labels={{
          noResults: '사용자가 없습니다.',
          rowsSelected: '{selected}개 선택됨',
          rowsPerPage: '페이지당 행',
          pageOf: '{current} / {total} 페이지',
        }}
      />

      {/* 사용자 생성/수정 다이얼로그 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedUser ? '사용자 수정' : '사용자 추가'}</DialogTitle>
            <DialogDescription>
              {selectedUser ? '사용자 정보를 수정합니다.' : '새로운 사용자를 생성합니다.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                placeholder="이름을 입력하세요"
                defaultValue={selectedUser?.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                defaultValue={selectedUser?.email}
                disabled={!!selectedUser}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Input
                id="department"
                placeholder="부서를 입력하세요"
                defaultValue={selectedUser?.department}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">역할</Label>
              <Select defaultValue={selectedUser?.role || 'USER'}>
                <SelectTrigger>
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">일반 사용자</SelectItem>
                  <SelectItem value="OPERATOR">운영자</SelectItem>
                  <SelectItem value="TENANT_ADMIN">테넌트 관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedUser && (
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select defaultValue={selectedUser.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">활성</SelectItem>
                    <SelectItem value="INACTIVE">비활성</SelectItem>
                    <SelectItem value="PENDING">대기</SelectItem>
                    <SelectItem value="BLOCKED">차단</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>
              {selectedUser ? '수정' : '생성'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 초대 다이얼로그 */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>사용자 초대</DialogTitle>
            <DialogDescription>
              이메일로 새로운 사용자를 초대합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-emails">이메일 주소</Label>
              <Input
                id="invite-emails"
                placeholder="여러 이메일은 쉼표로 구분"
              />
              <p className="text-xs text-text-secondary">
                여러 명을 초대하려면 이메일을 쉼표(,)로 구분하세요.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">역할</Label>
              <Select defaultValue="USER">
                <SelectTrigger>
                  <SelectValue placeholder="역할 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">일반 사용자</SelectItem>
                  <SelectItem value="OPERATOR">운영자</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-message">초대 메시지 (선택)</Label>
              <Input
                id="invite-message"
                placeholder="환영 메시지를 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsInviteDialogOpen(false)}>
              <UserPlus className="mr-2 h-4 w-4" />
              초대 보내기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
