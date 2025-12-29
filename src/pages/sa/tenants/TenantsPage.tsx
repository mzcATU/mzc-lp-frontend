import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Building2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
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
import { Label } from '@/components/common/Label';
import type { TenantStatus, PlanType } from '@/types/admin';

// Mock 데이터
interface TenantRow {
  id: number;
  code: string;
  name: string;
  status: TenantStatus;
  plan: PlanType;
  userCount: number;
  courseCount: number;
  createdAt: string;
}

const mockTenants: TenantRow[] = [
  { id: 1, code: 'mzc', name: '메가존클라우드', status: 'ACTIVE', plan: 'ENTERPRISE', userCount: 250, courseCount: 45, createdAt: '2025-01-15' },
  { id: 2, code: 'samsung', name: '삼성전자', status: 'ACTIVE', plan: 'ENTERPRISE', userCount: 1200, courseCount: 120, createdAt: '2025-01-10' },
  { id: 3, code: 'naver', name: '네이버', status: 'PENDING', plan: 'PRO', userCount: 0, courseCount: 0, createdAt: '2025-01-28' },
  { id: 4, code: 'kakao', name: '카카오', status: 'ACTIVE', plan: 'PRO', userCount: 450, courseCount: 32, createdAt: '2025-01-05' },
  { id: 5, code: 'line', name: '라인', status: 'INACTIVE', plan: 'BASIC', userCount: 50, courseCount: 5, createdAt: '2024-12-20' },
  { id: 6, code: 'coupang', name: '쿠팡', status: 'ACTIVE', plan: 'PRO', userCount: 380, courseCount: 28, createdAt: '2025-01-02' },
  { id: 7, code: 'woowa', name: '우아한형제들', status: 'ACTIVE', plan: 'BASIC', userCount: 120, courseCount: 15, createdAt: '2024-12-15' },
  { id: 8, code: 'toss', name: '토스', status: 'SUSPENDED', plan: 'PRO', userCount: 200, courseCount: 22, createdAt: '2024-11-30' },
  { id: 9, code: 'krafton', name: '크래프톤', status: 'ACTIVE', plan: 'ENTERPRISE', userCount: 180, courseCount: 40, createdAt: '2024-12-01' },
  { id: 10, code: 'ncsoft', name: '엔씨소프트', status: 'ACTIVE', plan: 'PRO', userCount: 320, courseCount: 35, createdAt: '2024-11-20' },
];

export function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantRow | null>(null);

  // 필터링된 데이터
  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    const matchesPlan = planFilter === 'all' || tenant.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const columns: ColumnDef<TenantRow>[] = [
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
        <span className="text-text-secondary">{row.original.userCount.toLocaleString()}명</span>
      ),
    },
    {
      accessorKey: 'courseCount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="강좌" />
      ),
      cell: ({ row }) => (
        <span className="text-text-secondary">{row.original.courseCount}개</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="생성일" />
      ),
      cell: ({ row }) => (
        <span className="text-text-secondary">{row.original.createdAt}</span>
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

  const handleViewDetail = (tenant: TenantRow) => {
    setSelectedTenant(tenant);
    setIsDetailDialogOpen(true);
  };

  const handleEdit = (tenant: TenantRow) => {
    setSelectedTenant(tenant);
    setIsCreateDialogOpen(true);
  };

  const handleDelete = (tenant: TenantRow) => {
    if (confirm(`'${tenant.name}' 테넌트를 삭제하시겠습니까?`)) {
      console.log('Delete tenant:', tenant.id);
    }
  };

  const handleCreateTenant = () => {
    setSelectedTenant(null);
    setIsCreateDialogOpen(true);
  };

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
        data={filteredTenants}
        showColumnToggle={false}
        labels={{
          noResults: '테넌트가 없습니다.',
          rowsSelected: '{selected}개 선택됨',
          rowsPerPage: '페이지당 행',
          pageOf: '{current} / {total} 페이지',
        }}
      />

      {/* 테넌트 생성/수정 다이얼로그 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTenant ? '테넌트 수정' : '테넌트 추가'}</DialogTitle>
            <DialogDescription>
              {selectedTenant ? '테넌트 정보를 수정합니다.' : '새로운 테넌트를 생성합니다.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">테넌트명</Label>
              <Input
                id="name"
                placeholder="테넌트명을 입력하세요"
                defaultValue={selectedTenant?.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">테넌트 코드</Label>
              <Input
                id="code"
                placeholder="영문 소문자, 숫자만 입력"
                defaultValue={selectedTenant?.code}
                disabled={!!selectedTenant}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">플랜</Label>
              <Select defaultValue={selectedTenant?.plan || 'BASIC'}>
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
                <Select defaultValue={selectedTenant.status}>
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
                  <Label htmlFor="adminEmail">관리자 이메일</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminName">관리자명</Label>
                  <Input
                    id="adminName"
                    placeholder="관리자 이름"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>
              {selectedTenant ? '수정' : '생성'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 테넌트 상세 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>테넌트 상세 정보</DialogTitle>
          </DialogHeader>
          {selectedTenant && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedTenant.name}</h3>
                  <p className="text-sm text-text-secondary">{selectedTenant.code}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary">상태</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedTenant.status} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">플랜</p>
                  <div className="mt-1">
                    <PlanBadge plan={selectedTenant.plan} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">사용자 수</p>
                  <p className="font-medium">{selectedTenant.userCount.toLocaleString()}명</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">강좌 수</p>
                  <p className="font-medium">{selectedTenant.courseCount}개</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-text-secondary">생성일</p>
                  <p className="font-medium">{selectedTenant.createdAt}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              닫기
            </Button>
            <Button onClick={() => {
              setIsDetailDialogOpen(false);
              if (selectedTenant) handleEdit(selectedTenant);
            }}>
              수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
