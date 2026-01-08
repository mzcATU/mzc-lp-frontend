import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreHorizontal, Eye, Edit, Trash2, Mail, UserPlus, Users, Loader2, Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, X, FileDown } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
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
import { Progress } from '@/components/common/Progress';
import { Badge } from '@/components/common/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  useUsers,
  useUpdateUser,
  useUpdateUserRole,
  useDeleteUser,
  useBulkCreateUsers,
} from '@/hooks/ta';
import type { AdminUser, UserStatus, SystemRole, UpdateUserDetailRequest, BulkCreateUsersRequest, BulkCreateUsersResponse } from '@/types/admin';
import { userService } from '@/services/ta/userService';

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

interface UploadResult {
  total: number;
  success: number;
  failed: number;
  autoLinked: number;              // 임직원 자동 연동 개수
  errors: { row: number; email: string; error: string }[];
  preview: AccountPreview[];
}

interface AccountPreview {
  email: string;
  name: string;
  department?: string;
  role?: string;
  status: 'valid' | 'duplicate' | 'error';
  errorMessage?: string;
  employeeLinked?: boolean;        // 임직원 연동 여부
  employeeInfo?: {                 // 연동된 임직원 정보
    employeeId: string;
    department: string;
    position: string;
    rank: string;
    jobRole: string;
  };
}

export function UsersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isBulkCreateDialogOpen, setIsBulkCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [bulkCreateMethod, setBulkCreateMethod] = useState<'pattern' | 'file'>('pattern');
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // API Hooks - 정렬 파라미터 추가
  const { data: usersData, isLoading, isError } = useUsers({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter as UserStatus : undefined,
    systemRole: roleFilter !== 'all' ? roleFilter as SystemRole : undefined,
    page,
    size: 10,
    sortBy,
    sortDirection,
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

  // API 응답을 UploadResult 형식으로 변환
  const convertApiResponse = (response: BulkCreateUsersResponse): UploadResult => {
    const preview: AccountPreview[] = response.createdUsers.slice(0, 5).map((user) => {
      const linkedInfo = response.autoLinkedUsers?.find((linked) => linked.userId === user.id);
      return {
        email: user.email,
        name: user.name,
        status: 'valid' as const,
        employeeLinked: user.employeeLinked || false,
        employeeInfo: linkedInfo
          ? {
              employeeId: linkedInfo.employeeNumber || String(linkedInfo.employeeId),
              department: linkedInfo.department || '',
              position: linkedInfo.position || '',
              rank: linkedInfo.jobTitle || '',
              jobRole: linkedInfo.jobTitle || '',
            }
          : undefined,
      };
    });

    // 실패 항목도 preview에 추가
    response.failedUsers.slice(0, Math.max(0, 5 - preview.length)).forEach((failed) => {
      preview.push({
        email: failed.email,
        name: '',
        status: 'error' as const,
        errorMessage: failed.reason,
        employeeLinked: false,
      });
    });

    return {
      total: response.totalRequested,
      success: response.successCount,
      failed: response.failedCount,
      autoLinked: response.autoLinkedCount || 0,
      errors: response.failedUsers.map((failed, index) => ({
        row: index + 1,
        email: failed.email,
        error: failed.reason,
      })),
      preview,
    };
  };

  // 파일 드롭존
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      setProcessingProgress(30);

      // 실제 API 호출
      const response = await userService.fileBulkCreateUsers(file, {
        autoLinkEmployees: true,
      });

      setProcessingProgress(100);
      setUploadResult(convertApiResponse(response));
    } catch (err) {
      console.error('파일 업로드 실패:', err);
      toast.error(err instanceof Error ? err.message : '파일 업로드에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // 파일 업로드 계정 생성 확인 (이미 API 호출로 생성됨)
  const handleFileUploadConfirm = () => {
    if (!uploadResult) return;
    toast.success(`${uploadResult.success}개의 계정이 생성되었습니다.`);
    setUploadResult(null);
    setIsBulkCreateDialogOpen(false);
    setBulkCreateMethod('pattern');
  };

  // 파일 업로드 리셋
  const handleFileUploadReset = () => {
    setUploadResult(null);
    setProcessingProgress(0);
  };

  // 템플릿 다운로드
  const handleDownloadTemplate = () => {
    // CSV 템플릿 생성
    const headers = ['email', 'name', 'department', 'role'];
    const exampleRows = [
      ['user1@company.com', '홍길동', '개발팀', 'USER'],
      ['user2@company.com', '김영희', '마케팅팀', 'USER'],
      ['user3@company.com', '이철수', '인사팀', 'OPERATOR'],
    ];

    // CSV 콘텐츠 생성
    const csvContent = [
      headers.join(','),
      ...exampleRows.map(row => row.join(','))
    ].join('\n');

    // BOM 추가 (Excel에서 한글이 깨지지 않도록)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // 다운로드 링크 생성
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bulk_account_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('템플릿 파일이 다운로드되었습니다.');
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

      {/* 역할별 탭 필터 */}
      <Tabs value={roleFilter} onValueChange={setRoleFilter} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">
            전체 사용자
            {usersData && roleFilter === 'all' && (
              <Badge variant="gray" className="ml-2">{usersData.totalElements}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="USER">
            일반 사용자
            {usersData && roleFilter === 'USER' && (
              <Badge variant="gray" className="ml-2">{usersData.totalElements}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="INSTRUCTOR">
            강사
            {usersData && roleFilter === 'INSTRUCTOR' && (
              <Badge variant="gray" className="ml-2">{usersData.totalElements}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="DESIGNER">
            강의 개설자
            {usersData && roleFilter === 'DESIGNER' && (
              <Badge variant="gray" className="ml-2">{usersData.totalElements}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="OPERATOR">
            운영자
            {usersData && roleFilter === 'OPERATOR' && (
              <Badge variant="gray" className="ml-2">{usersData.totalElements}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="TENANT_ADMIN">
            테넌트 관리자
            {usersData && roleFilter === 'TENANT_ADMIN' && (
              <Badge variant="gray" className="ml-2">{usersData.totalElements}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 검색 및 상태 필터 영역 */}
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
      </div>

      {/* 사용자 목록 테이블 */}
      <DataTable
        columns={columns}
        data={users}
        showColumnToggle={false}
        manualSorting={true}
        sorting={sortBy ? [{ id: sortBy, desc: sortDirection === 'desc' }] : []}
        onSortingChange={(updaterOrValue) => {
          const sorting = typeof updaterOrValue === 'function'
            ? updaterOrValue(sortBy ? [{ id: sortBy, desc: sortDirection === 'desc' }] : [])
            : updaterOrValue;

          if (sorting.length > 0) {
            setSortBy(sorting[0].id);
            setSortDirection(sorting[0].desc ? 'desc' : 'asc');
          } else {
            setSortBy(undefined);
            setSortDirection('desc');
          }
          setPage(0); // 정렬 변경 시 첫 페이지로 이동
        }}
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
                    <SelectItem value="INSTRUCTOR">강사</SelectItem>
                    <SelectItem value="DESIGNER">강의 개설자</SelectItem>
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
                  <SelectItem value="INSTRUCTOR">강사</SelectItem>
                  <SelectItem value="DESIGNER">강의 개설자</SelectItem>
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
      <Dialog open={isBulkCreateDialogOpen} onOpenChange={(open) => {
        setIsBulkCreateDialogOpen(open);
        if (!open) {
          setBulkCreateMethod('pattern');
          setUploadResult(null);
          resetBulk();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>단체 계정 생성</DialogTitle>
            <DialogDescription>
              패턴 입력 또는 Excel/CSV 파일 업로드로 여러 계정을 한 번에 생성합니다.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={bulkCreateMethod} onValueChange={(v) => setBulkCreateMethod(v as 'pattern' | 'file')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pattern">패턴 입력</TabsTrigger>
              <TabsTrigger value="file">파일 업로드</TabsTrigger>
            </TabsList>

            {/* 패턴 입력 탭 */}
            <TabsContent value="pattern" className="mt-4">
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
                          <p key={`${email}-${index}`} className="text-sm text-text-secondary font-mono">
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
            </TabsContent>

            {/* 파일 업로드 탭 */}
            <TabsContent value="file" className="mt-4">
              {!uploadResult ? (
                <div className="space-y-6">
                  {/* 업로드 영역 */}
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all"
                    style={{
                      borderColor: isDragActive ? designTokens.button.brand_default : designTokens.bg.border,
                      backgroundColor: isDragActive
                        ? `${designTokens.button.brand_default}08`
                        : designTokens.bg.secondary,
                    }}
                  >
                    <input {...getInputProps()} />
                    {isProcessing ? (
                      <div className="space-y-4">
                        <FileSpreadsheet
                          className="w-16 h-16 mx-auto animate-pulse"
                          style={{ color: designTokens.button.brand_default }}
                        />
                        <p className="text-lg font-medium" style={{ color: designTokens.text.primary }}>
                          파일 처리 중...
                        </p>
                        <div className="max-w-md mx-auto">
                          <Progress value={processingProgress} />
                          <p className="text-sm mt-2" style={{ color: designTokens.text.secondary }}>
                            {processingProgress}%
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload
                          className="w-16 h-16 mx-auto mb-4"
                          style={{ color: designTokens.text.placeholder }}
                        />
                        <p className="text-lg font-medium mb-2" style={{ color: designTokens.text.primary }}>
                          {isDragActive
                            ? '여기에 파일을 놓으세요'
                            : 'Excel 또는 CSV 파일을 드래그하거나 클릭하여 업로드'}
                        </p>
                        <p className="text-sm mb-4" style={{ color: designTokens.text.placeholder }}>
                          .xlsx, .xls, .csv (최대 10MB)
                        </p>
                        <Button type="button" variant="outline">파일 선택</Button>
                      </>
                    )}
                  </div>

                  {/* 템플릿 다운로드 */}
                  <div className="rounded-lg border p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: designTokens.bg.secondary }}
                        >
                          <FileDown
                            className="w-6 h-6"
                            style={{ color: designTokens.button.brand_default }}
                          />
                        </div>
                        <div>
                          <p className="font-medium mb-1" style={{ color: designTokens.text.primary }}>
                            템플릿 다운로드
                          </p>
                          <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                            계정 생성에 필요한 양식을 다운로드하세요
                          </p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" onClick={handleDownloadTemplate} className="gap-2">
                        <Download className="w-4 h-4" />
                        템플릿 다운로드
                      </Button>
                    </div>

                    {/* 필수 컬럼 안내 */}
                    <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: designTokens.bg.secondary }}>
                      <p className="text-sm font-medium mb-2" style={{ color: designTokens.text.primary }}>
                        필수 컬럼
                      </p>
                      <ul className="space-y-1">
                        <li className="text-sm" style={{ color: designTokens.text.secondary }}>
                          • <strong>email</strong>: 이메일 주소 (중복 불가)
                        </li>
                        <li className="text-sm" style={{ color: designTokens.text.secondary }}>
                          • <strong>name</strong>: 사용자 이름
                        </li>
                        <li className="text-sm" style={{ color: designTokens.text.secondary }}>
                          • department: 부서 (선택사항)
                        </li>
                        <li className="text-sm" style={{ color: designTokens.text.secondary }}>
                          • role: 역할 (USER, OPERATOR) (선택사항, 기본값: USER)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* 업로드 결과 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                            전체
                          </p>
                          <p className="text-2xl font-semibold mt-1" style={{ color: designTokens.text.primary }}>
                            {uploadResult.total}
                          </p>
                        </div>
                        <Users className="w-8 h-8" style={{ color: designTokens.text.placeholder }} />
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                            성공
                          </p>
                          <p className="text-2xl font-semibold mt-1" style={{ color: designTokens.status.success_text }}>
                            {uploadResult.success}
                          </p>
                        </div>
                        <CheckCircle2 className="w-8 h-8" style={{ color: designTokens.status.success_text }} />
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                            실패
                          </p>
                          <p
                            className="text-2xl font-semibold mt-1"
                            style={{
                              color: uploadResult.failed > 0 ? designTokens.status.error_text : designTokens.text.primary
                            }}
                          >
                            {uploadResult.failed}
                          </p>
                        </div>
                        <AlertCircle
                          className="w-8 h-8"
                          style={{
                            color: uploadResult.failed > 0 ? designTokens.status.error_text : designTokens.text.placeholder
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 오류 목록 */}
                  {uploadResult.errors.length > 0 && (
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5" style={{ color: designTokens.status.error_text }} />
                        <h3 className="font-medium" style={{ color: designTokens.status.error_text }}>
                          {uploadResult.errors.length}개의 오류 발견
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {uploadResult.errors.map((error, idx) => (
                          <div
                            key={`error-${idx}`}
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: designTokens.status.error_background }}
                          >
                            <p className="text-sm font-medium" style={{ color: designTokens.status.error_text }}>
                              행 {error.row}: {error.email}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: designTokens.status.error_text }}>
                              {error.error}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 미리보기 테이블 */}
                  <div className="rounded-lg border">
                    <div className="p-4 border-b">
                      <h3 className="font-medium" style={{ color: designTokens.text.primary }}>
                        데이터 미리보기 (상위 5건)
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {uploadResult.preview.map((account, idx) => (
                          <div
                            key={`preview-${idx}`}
                            className="flex items-center justify-between p-3 rounded-lg border"
                            style={{
                              backgroundColor: account.status !== 'valid' ? designTokens.status.error_background : 'transparent'
                            }}
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium" style={{ color: designTokens.text.primary }}>
                                {account.name}
                              </p>
                              <p className="text-xs" style={{ color: designTokens.text.secondary }}>
                                {account.email}
                              </p>
                              {account.errorMessage && (
                                <p className="text-xs mt-1" style={{ color: designTokens.status.error_text }}>
                                  {account.errorMessage}
                                </p>
                              )}
                            </div>
                            {account.department && (
                              <Badge variant="gray">{account.department}</Badge>
                            )}
                            <Badge variant={account.status === 'valid' ? 'green' : 'red'}>
                              {account.status === 'valid' ? '정상' : account.status === 'duplicate' ? '중복' : '오류'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={handleFileUploadReset} className="gap-2">
                      <X className="w-4 h-4" />
                      취소
                    </Button>
                    <Button
                      type="button"
                      onClick={handleFileUploadConfirm}
                      disabled={uploadResult.failed > 0}
                      className="gap-2"
                      style={{
                        backgroundColor: uploadResult.failed > 0 ? designTokens.bg.border : designTokens.button.brand_default,
                        color: designTokens.button.brand_text,
                      }}
                    >
                      <UserPlus className="w-4 h-4" />
                      {uploadResult.success}개 계정 생성
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
