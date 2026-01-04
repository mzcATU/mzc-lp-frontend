import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreHorizontal, Eye, Edit, Trash2, Mail, UserPlus, Users, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/common/AlertDialog';
import { Label } from '@/components/common/Label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/Avatar';
import { Skeleton } from '@/components/common/Skeleton';
import {
  useUsers,
  useUpdateUser,
  useUpdateUserRole,
  useDeleteUser,
  useBulkCreateUsers,
} from '@/hooks/ta';
import type { AdminUser, UserStatus, SystemRole, UpdateUserDetailRequest, BulkCreateUsersRequest } from '@/types/admin';

interface UserFormData {
  name: string;
  email: string;
  department?: string;
  position?: string;
  systemRole: SystemRole;
  status?: UserStatus;
}

interface BulkCreateFormData {
  emailPrefix: string;
  emailDomain: string;
  count: number;
  password: string;
  startNumber: number;
}

export function UsersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isBulkCreateDialogOpen, setIsBulkCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  // API Hooks
  const { data: usersData, isLoading, isError } = useUsers({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter as UserStatus : undefined,
    systemRole: roleFilter !== 'all' ? roleFilter as SystemRole : undefined,
    page,
    size: 10,
  });

  const updateMutation = useUpdateUser();
  const updateRoleMutation = useUpdateUserRole();
  const deleteMutation = useDeleteUser();
  const bulkCreateMutation = useBulkCreateUsers();

  const { register, handleSubmit, reset, setValue, watch } = useForm<UserFormData>({
    defaultValues: {
      systemRole: 'USER',
    },
  });

  const {
    register: registerBulk,
    handleSubmit: handleSubmitBulk,
    reset: resetBulk,
    watch: watchBulk,
    formState: { errors: bulkErrors },
  } = useForm<BulkCreateFormData>({
    defaultValues: {
      emailPrefix: '',
      emailDomain: '@company.com',
      count: 10,
      password: '',
      startNumber: 1,
    },
  });

  const users = usersData?.content || [];

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="사용자" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.profileImageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${row.original.name}`} />
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
      accessorKey: 'systemRole',
      header: '역할',
      cell: ({ row }) => <RoleBadge role={row.original.systemRole} />,
    },
    {
      accessorKey: 'organizationName',
      header: '부서',
      cell: ({ row }) => (
        <span className="text-text-secondary">{row.original.organizationName || '-'}</span>
      ),
    },
    {
      accessorKey: 'lastLoginAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="최근 로그인" />
      ),
      cell: ({ row }) => (
        <span className="text-text-secondary">
          {row.original.lastLoginAt
            ? new Date(row.original.lastLoginAt).toLocaleDateString('ko-KR')
            : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="가입일" />
      ),
      cell: ({ row }) => (
        <span className="text-text-secondary">
          {new Date(row.original.createdAt).toLocaleDateString('ko-KR')}
        </span>
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
              onClick={() => setDeleteTarget(row.original)}
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

  const handleViewDetail = (user: AdminUser) => {
    navigate(`/ta/users/${user.id}`);
  };

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('systemRole', user.systemRole);
    setValue('status', user.status);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`'${deleteTarget.name}' 사용자가 삭제되었습니다.`);
      setDeleteTarget(null);
    } catch {
      toast.error('사용자 삭제에 실패했습니다.');
    }
  };

  const onSubmit = async (data: UserFormData) => {
    if (!selectedUser) return;

    try {
      // 기본 정보 수정
      const updateData: UpdateUserDetailRequest = {
        name: data.name,
        department: data.department,
        position: data.position,
        status: data.status,
      };
      await updateMutation.mutateAsync({ id: selectedUser.id, request: updateData });

      // 역할이 변경된 경우
      if (data.systemRole !== selectedUser.systemRole) {
        await updateRoleMutation.mutateAsync({
          id: selectedUser.id,
          request: { systemRole: data.systemRole },
        });
      }

      toast.success('사용자 정보가 수정되었습니다.');
      setIsEditDialogOpen(false);
      reset();
    } catch {
      toast.error('사용자 수정에 실패했습니다.');
    }
  };

  const onBulkCreateSubmit = async (data: BulkCreateFormData) => {
    try {
      const request: BulkCreateUsersRequest = {
        emailPrefix: data.emailPrefix,
        emailDomain: data.emailDomain,
        count: data.count,
        password: data.password,
        startNumber: data.startNumber,
      };
      const result = await bulkCreateMutation.mutateAsync(request);

      if (result.failedCount > 0) {
        toast.warning(
          `${result.successCount}개 계정 생성 완료, ${result.failedCount}개 실패`
        );
      } else {
        toast.success(`${result.successCount}개 계정이 생성되었습니다.`);
      }

      setIsBulkCreateDialogOpen(false);
      resetBulk();
    } catch {
      toast.error('단체 계정 생성에 실패했습니다.');
    }
  };

  // 미리보기용 이메일 생성
  const previewEmails = () => {
    const prefix = watchBulk('emailPrefix');
    const domain = watchBulk('emailDomain');
    const start = watchBulk('startNumber') || 1;
    const count = watchBulk('count') || 0;

    if (!prefix || !domain || count === 0) return [];

    const emails: string[] = [];
    const showCount = Math.min(count, 3);
    for (let i = 0; i < showCount; i++) {
      emails.push(`${prefix}${start + i}${domain}`);
    }
    if (count > 3) {
      emails.push('...');
      emails.push(`${prefix}${start + count - 1}${domain}`);
    }
    return emails;
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-6">
        <AdminPageHeader
          title="사용자 관리"
          description="테넌트 내 사용자를 관리합니다"
        />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-6">
        <AdminPageHeader
          title="사용자 관리"
          description="테넌트 내 사용자를 관리합니다"
        />
        <div className="text-center py-12">
          <p className="text-text-secondary">사용자 목록을 불러오는데 실패했습니다.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminPageHeader
        title="사용자 관리"
        description="테넌트 내 사용자를 관리합니다"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsBulkCreateDialogOpen(true)}>
              <Users className="mr-2 h-4 w-4" />
              단체 계정 생성
            </Button>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(true)}>
              <Mail className="mr-2 h-4 w-4" />
              초대하기
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
        data={users}
        showColumnToggle={false}
        labels={{
          noResults: '사용자가 없습니다.',
          rowsSelected: '{selected}개 선택됨',
          rowsPerPage: '페이지당 행',
          pageOf: '{current} / {total} 페이지',
        }}
      />

      {/* 페이지네이션 */}
      {usersData && usersData.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            이전
          </Button>
          <span className="flex items-center px-4 text-sm text-text-secondary">
            {page + 1} / {usersData.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= usersData.totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
        </div>
      )}

      {/* 사용자 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>사용자 수정</DialogTitle>
            <DialogDescription>
              사용자 정보를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  placeholder="이름을 입력하세요"
                  {...register('name', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register('email')}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">부서</Label>
                <Input
                  id="department"
                  placeholder="부서를 입력하세요"
                  {...register('department')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">직급</Label>
                <Input
                  id="position"
                  placeholder="직급을 입력하세요"
                  {...register('position')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">역할</Label>
                <Select
                  value={watch('systemRole')}
                  onValueChange={(v) => setValue('systemRole', v as SystemRole)}
                >
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
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(v) => setValue('status', v as UserStatus)}
                >
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                취소
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending || updateRoleMutation.isPending}
              >
                {(updateMutation.isPending || updateRoleMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                수정
              </Button>
            </DialogFooter>
          </form>
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
            <Button onClick={() => {
              toast.info('초대 기능은 아직 구현되지 않았습니다.');
              setIsInviteDialogOpen(false);
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              초대 보내기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              '{deleteTarget?.name}' 사용자를 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 단체 계정 생성 다이얼로그 */}
      <Dialog open={isBulkCreateDialogOpen} onOpenChange={setIsBulkCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>단체 계정 생성</DialogTitle>
            <DialogDescription>
              동일한 패턴의 이메일로 여러 계정을 한 번에 생성합니다.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitBulk(onBulkCreateSubmit)}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailPrefix">이메일 접두사</Label>
                  <Input
                    id="emailPrefix"
                    placeholder="예: sam_user"
                    {...registerBulk('emailPrefix', { required: '이메일 접두사를 입력하세요' })}
                  />
                  {bulkErrors.emailPrefix && (
                    <p className="text-xs text-red-500">{bulkErrors.emailPrefix.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailDomain">이메일 도메인</Label>
                  <Input
                    id="emailDomain"
                    placeholder="예: @company.com"
                    {...registerBulk('emailDomain', { required: '이메일 도메인을 입력하세요' })}
                  />
                  {bulkErrors.emailDomain && (
                    <p className="text-xs text-red-500">{bulkErrors.emailDomain.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startNumber">시작 번호</Label>
                  <Input
                    id="startNumber"
                    type="number"
                    min={1}
                    {...registerBulk('startNumber', { valueAsNumber: true, min: 1 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="count">생성 개수</Label>
                  <Input
                    id="count"
                    type="number"
                    min={1}
                    max={100}
                    {...registerBulk('count', {
                      valueAsNumber: true,
                      required: '생성 개수를 입력하세요',
                      min: { value: 1, message: '최소 1개 이상' },
                      max: { value: 100, message: '최대 100개까지' },
                    })}
                  />
                  {bulkErrors.count && (
                    <p className="text-xs text-red-500">{bulkErrors.count.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">초기 비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="8자 이상 입력하세요"
                  {...registerBulk('password', {
                    required: '비밀번호를 입력하세요',
                    minLength: { value: 8, message: '8자 이상 입력하세요' },
                  })}
                />
                {bulkErrors.password && (
                  <p className="text-xs text-red-500">{bulkErrors.password.message}</p>
                )}
                <p className="text-xs text-text-secondary">
                  모든 계정에 동일한 초기 비밀번호가 설정됩니다.
                </p>
              </div>

              {/* 미리보기 */}
              {previewEmails().length > 0 && (
                <div className="rounded-lg border bg-muted/50 p-3">
                  <p className="text-sm font-medium mb-2">생성될 계정 미리보기</p>
                  <div className="space-y-1">
                    {previewEmails().map((email, index) => (
                      <p key={index} className="text-sm text-text-secondary font-mono">
                        {email}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsBulkCreateDialogOpen(false);
                  resetBulk();
                }}
              >
                취소
              </Button>
              <Button type="submit" disabled={bulkCreateMutation.isPending}>
                {bulkCreateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Users className="mr-2 h-4 w-4" />
                {watchBulk('count') || 0}개 계정 생성
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
