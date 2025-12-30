import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Building2, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  AdminPageHeader,
  StatusBadge,
  PlanBadge,
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
import { Skeleton } from '@/components/common/Skeleton';
import {
  useTenants,
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from '@/hooks/sa';
import type { Tenant, TenantStatus, PlanType, CreateTenantRequest, UpdateTenantDetailRequest } from '@/types/admin';

interface TenantFormData {
  code: string;
  name: string;
  type: 'B2C' | 'B2B';
  plan: PlanType;
  subdomain: string;
  adminEmail: string;
  adminName: string;
  status?: TenantStatus;
}

export function TenantsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tenant | null>(null);

  // API Hooks
  const { data: tenantsData, isLoading, isError } = useTenants({
    keyword: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    plan: planFilter !== 'all' ? planFilter : undefined,
    page,
    size: 10,
  });

  const createMutation = useCreateTenant();
  const updateMutation = useUpdateTenant();
  const deleteMutation = useDeleteTenant();

  const { register, handleSubmit, reset, setValue, watch } = useForm<TenantFormData>({
    defaultValues: {
      type: 'B2B',
      plan: 'BASIC',
    },
  });

  const tenants = tenantsData?.content || [];

  const columns: ColumnDef<Tenant>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="테넌트명" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-brand-primary" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-text-secondary">{row.original.code}</div>
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
      accessorKey: 'plan',
      header: '플랜',
      cell: ({ row }) => <PlanBadge plan={row.original.plan} />,
    },
    {
      accessorKey: 'userCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="사용자" />
      ),
      cell: ({ row }) => (
        <span className="text-text-secondary">{(row.original.userCount || 0).toLocaleString()}명</span>
      ),
    },
    {
      accessorKey: 'courseCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="강좌" />
      ),
      cell: ({ row }) => (
        <span className="text-text-secondary">{row.original.courseCount || 0}개</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="생성일" />
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

  const handleViewDetail = (tenant: Tenant) => {
    navigate(`/sa/tenants/${tenant.id}`);
  };

  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setValue('name', tenant.name);
    setValue('code', tenant.code);
    setValue('plan', tenant.plan);
    setValue('status', tenant.status);
    setValue('type', tenant.type);
    setValue('subdomain', tenant.subdomain);
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`'${deleteTarget.name}' 테넌트가 삭제되었습니다.`);
      setDeleteTarget(null);
    } catch {
      toast.error('테넌트 삭제에 실패했습니다.');
    }
  };

  const handleCreateTenant = () => {
    setSelectedTenant(null);
    reset({
      type: 'B2B',
      plan: 'BASIC',
      code: '',
      name: '',
      subdomain: '',
      adminEmail: '',
      adminName: '',
    });
    setIsCreateDialogOpen(true);
  };

  const onSubmit = async (data: TenantFormData) => {
    try {
      if (selectedTenant) {
        // 수정
        const updateData: UpdateTenantDetailRequest = {
          name: data.name,
          status: data.status,
          plan: data.plan,
        };
        await updateMutation.mutateAsync({ id: selectedTenant.id, request: updateData });
        toast.success('테넌트가 수정되었습니다.');
      } else {
        // 생성
        const createData: CreateTenantRequest = {
          code: data.code,
          name: data.name,
          type: data.type,
          plan: data.plan,
          subdomain: data.subdomain,
          adminEmail: data.adminEmail,
          adminName: data.adminName,
        };
        await createMutation.mutateAsync(createData);
        toast.success('테넌트가 생성되었습니다.');
      }
      setIsCreateDialogOpen(false);
      reset();
    } catch {
      toast.error(selectedTenant ? '테넌트 수정에 실패했습니다.' : '테넌트 생성에 실패했습니다.');
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-6">
        <AdminPageHeader
          title="테넌트 관리"
          description="시스템에 등록된 테넌트를 관리합니다"
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
          title="테넌트 관리"
          description="시스템에 등록된 테넌트를 관리합니다"
        />
        <div className="text-center py-12">
          <p className="text-text-secondary">테넌트 목록을 불러오는데 실패했습니다.</p>
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
        title="테넌트 관리"
        description="시스템에 등록된 테넌트를 관리합니다"
        actions={
          <Button onClick={handleCreateTenant}>
            <Plus className="mr-2 h-4 w-4" />
            테넌트 추가
          </Button>
        }
      />

      {/* 필터 영역 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            placeholder="테넌트명 또는 코드 검색..."
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
            <SelectItem value="SUSPENDED">정지</SelectItem>
            <SelectItem value="PENDING">대기</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="플랜" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 플랜</SelectItem>
            <SelectItem value="BASIC">Basic</SelectItem>
            <SelectItem value="PRO">Pro</SelectItem>
            <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 테넌트 목록 테이블 */}
      <DataTable
        columns={columns}
        data={tenants}
        showColumnToggle={false}
        labels={{
          noResults: '테넌트가 없습니다.',
          rowsSelected: '{selected}개 선택됨',
          rowsPerPage: '페이지당 행',
          pageOf: '{current} / {total} 페이지',
        }}
      />

      {/* 페이지네이션 */}
      {tenantsData && tenantsData.totalPages > 1 && (
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
            {page + 1} / {tenantsData.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= tenantsData.totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
        </div>
      )}

      {/* 테넌트 생성/수정 다이얼로그 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTenant ? '테넌트 수정' : '테넌트 추가'}</DialogTitle>
            <DialogDescription>
              {selectedTenant ? '테넌트 정보를 수정합니다.' : '새로운 테넌트를 생성합니다.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">테넌트명</Label>
                <Input
                  id="name"
                  placeholder="테넌트명을 입력하세요"
                  {...register('name', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">테넌트 코드</Label>
                <Input
                  id="code"
                  placeholder="영문 소문자, 숫자만 입력"
                  {...register('code', { required: !selectedTenant })}
                  disabled={!!selectedTenant}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">플랜</Label>
                <Select
                  value={watch('plan')}
                  onValueChange={(v) => setValue('plan', v as PlanType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="플랜 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BASIC">Basic</SelectItem>
                    <SelectItem value="PRO">Pro</SelectItem>
                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedTenant && (
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select
                    value={watch('status')}
                    onValueChange={(v) => setValue('status', v as TenantStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">활성</SelectItem>
                      <SelectItem value="INACTIVE">비활성</SelectItem>
                      <SelectItem value="SUSPENDED">정지</SelectItem>
                      <SelectItem value="PENDING">대기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {!selectedTenant && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subdomain">서브도메인</Label>
                    <Input
                      id="subdomain"
                      placeholder="example"
                      {...register('subdomain', { required: true })}
                    />
                    <p className="text-xs text-text-secondary">example.mzclearn.com</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">테넌트 유형</Label>
                    <Select
                      value={watch('type')}
                      onValueChange={(v) => setValue('type', v as 'B2C' | 'B2B')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="B2B">B2B (기업)</SelectItem>
                        <SelectItem value="B2C">B2C (개인)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">관리자 이메일</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@example.com"
                      {...register('adminEmail', { required: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminName">관리자명</Label>
                    <Input
                      id="adminName"
                      placeholder="관리자 이름"
                      {...register('adminName', { required: true })}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                취소
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {selectedTenant ? '수정' : '생성'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>테넌트 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              '{deleteTarget?.name}' 테넌트를 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없으며, 테넌트의 모든 데이터가 삭제됩니다.
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
    </div>
  );
}
