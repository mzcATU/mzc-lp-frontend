import { useState, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Search,
  Filter,
  ChevronDown,
  Loader2,
  Users,
  UserCheck,
  UserX,
  UserMinus,
  MoreHorizontal,
  Ban,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Button,
  Badge,
  DataTable,
  DataTableColumnHeader,
  IconStatCard,
  Label,
  Textarea,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/common';
import { useUsers, useChangeUserStatus } from '@/hooks/to/useUserQueries';
import type { UserListResponse, TenantRole, UserStatus, UserFilterParams } from '@/types/to';
import { TENANT_ROLE_LABELS, USER_STATUS_LABELS } from '@/types/to';

interface UserManagementPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '사용자 관리', en: 'User Management' },
  subtitle: { ko: '테넌트 내 사용자를 관리합니다.', en: 'Manage users in the tenant.' },
  searchPlaceholder: { ko: '이름, 이메일 검색...', en: 'Search name, email...' },
  filter: { ko: '필터', en: 'Filter' },
  status: { ko: '상태', en: 'Status' },
  role: { ko: '역할', en: 'Role' },
  all: { ko: '전체', en: 'All' },
  totalUsers: { ko: '전체 사용자', en: 'Total Users' },
  activeUsers: { ko: '활성', en: 'Active' },
  inactiveUsers: { ko: '비활성', en: 'Inactive' },
  suspendedUsers: { ko: '정지', en: 'Suspended' },
  noResults: { ko: '검색 결과가 없습니다.', en: 'No results found.' },
  noUsers: { ko: '등록된 사용자가 없습니다.', en: 'No users registered.' },
  noUsersDescription: { ko: '사용자가 등록되면 여기에 표시됩니다.', en: 'Users will appear here when registered.' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  prev: { ko: '이전', en: 'Prev' },
  next: { ko: '다음', en: 'Next' },
  userCount: { ko: '명의 사용자', en: ' users' },
  columnName: { ko: '이름', en: 'Name' },
  columnEmail: { ko: '이메일', en: 'Email' },
  columnRole: { ko: '역할', en: 'Role' },
  columnStatus: { ko: '상태', en: 'Status' },
  columnCreatedAt: { ko: '가입일', en: 'Joined' },
  columnActions: { ko: '액션', en: 'Actions' },
  activate: { ko: '활성화', en: 'Activate' },
  deactivate: { ko: '비활성화', en: 'Deactivate' },
  suspend: { ko: '정지', en: 'Suspend' },
  activating: { ko: '활성화 중...', en: 'Activating...' },
  deactivating: { ko: '비활성화 중...', en: 'Deactivating...' },
  suspending: { ko: '정지 중...', en: 'Suspending...' },
  confirmActivate: { ko: '이 사용자를 활성화하시겠습니까?', en: 'Activate this user?' },
  confirmDeactivate: { ko: '이 사용자를 비활성화하시겠습니까?', en: 'Deactivate this user?' },
  confirmSuspend: { ko: '정지 사유를 입력하세요.', en: 'Enter suspension reason.' },
  reasonRequired: { ko: '사유를 입력해주세요.', en: 'Reason is required.' },
  reasonPlaceholder: { ko: '사유를 입력하세요...', en: 'Enter reason...' },
  reason: { ko: '사유', en: 'Reason' },
  cancel: { ko: '취소', en: 'Cancel' },
  confirm: { ko: '확인', en: 'Confirm' },
};

const statusBadgeVariant: Record<UserStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  SUSPENDED: 'destructive',
  WITHDRAWN: 'default',
};

const roleBadgeVariant: Record<TenantRole, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  SYSTEM_ADMIN: 'destructive',
  TENANT_ADMIN: 'warning',
  OPERATOR: 'success',
  DESIGNER: 'secondary',
  USER: 'default',
};

export function UserManagementPage({ language = 'ko' }: Readonly<UserManagementPageProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<TenantRole | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<UserStatus | null>(null);
  const [statusReason, setStatusReason] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API 파라미터 구성
  const params: UserFilterParams = {
    page,
    size: 20,
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(roleFilter !== 'all' && { role: roleFilter }),
    ...(searchQuery && { keyword: searchQuery }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = useUsers(params);
  const changeStatus = useChangeUserStatus();

  const users = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  // 통계 계산
  const userStats = useMemo(() => ({
    total: totalElements,
    active: users.filter((u) => u.status === 'ACTIVE').length,
    inactive: users.filter((u) => u.status === 'INACTIVE').length,
    suspended: users.filter((u) => u.status === 'SUSPENDED').length,
  }), [users, totalElements]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Action handlers
  const handleStatusChange = (user: UserListResponse, status: UserStatus) => {
    setSelectedUser(user);
    setTargetStatus(status);
    setShowStatusModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser || !targetStatus) return;

    if (targetStatus === 'SUSPENDED' && !statusReason.trim()) {
      alert(getText('reasonRequired'));
      return;
    }

    try {
      await changeStatus.mutateAsync({
        id: selectedUser.userId,
        request: {
          status: targetStatus,
          ...(statusReason && { reason: statusReason }),
        },
      });
      setShowStatusModal(false);
      setSelectedUser(null);
      setTargetStatus(null);
      setStatusReason('');
    } catch (err) {
      console.error('Status change failed:', err);
    }
  };

  // 더보기 메뉴 렌더링
  const renderMoreMenu = (item: UserListResponse) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-bg-secondary transition-colors"
          >
            <MoreHorizontal size={16} className="text-text-secondary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {item.status !== 'ACTIVE' && (
            <DropdownMenuItem onClick={() => handleStatusChange(item, 'ACTIVE')}>
              <CheckCircle size={14} />
              {getText('activate')}
            </DropdownMenuItem>
          )}
          {item.status === 'ACTIVE' && (
            <DropdownMenuItem onClick={() => handleStatusChange(item, 'INACTIVE')}>
              <UserMinus size={14} />
              {getText('deactivate')}
            </DropdownMenuItem>
          )}
          {item.status !== 'SUSPENDED' && (
            <DropdownMenuItem
              onClick={() => handleStatusChange(item, 'SUSPENDED')}
              variant="destructive"
            >
              <Ban size={14} />
              {getText('suspend')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // 리스트뷰 컬럼 정의
  const columns: ColumnDef<UserListResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnName')} />
        ),
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {row.original.name}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              ID: {row.original.userId}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnEmail')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnRole')} />
        ),
        cell: ({ row }) => (
          <Badge variant={roleBadgeVariant[row.original.role]}>
            {TENANT_ROLE_LABELS[row.original.role]}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnStatus')} />
        ),
        cell: ({ row }) => (
          <Badge variant={statusBadgeVariant[row.original.status]}>
            {USER_STATUS_LABELS[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnCreatedAt')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">{getText('columnActions')}</span>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div
              className="flex items-center justify-end gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {renderMoreMenu(item)}
            </div>
          );
        },
        size: 60,
      },
    ],
    [language, changeStatus.isPending]
  );

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <Users size={48} className="mx-auto mb-3 text-text-placeholder" />
          <p className="text-text-secondary">{getText('error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-bg-app">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-bg-app">
        <div className="p-6 px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-text-primary mb-1">{getText('title')}</h1>
              <p className="text-text-secondary text-sm m-0">{getText('subtitle')}</p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                placeholder={getText('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-bg-default border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-btn-neutral"
              />
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="border border-border"
            >
              <Filter size={20} />
              <span>{getText('filter')}</span>
              <ChevronDown
                size={16}
                className={cn('transition-transform', showFilters && 'rotate-180')}
              />
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 border border-border rounded-lg bg-bg-secondary">
              {/* Status Filter */}
              <div className="mb-4">
                <label className="block text-sm text-text-primary mb-2">
                  {getText('status')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'ACTIVE', 'INACTIVE', 'SUSPENDED'] as const).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setPage(0);
                        }}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors',
                          statusFilter === status
                            ? 'bg-btn-neutral text-white'
                            : 'bg-bg-default text-text-primary border border-border hover:bg-bg-secondary'
                        )}
                      >
                        {status === 'all' ? getText('all') : USER_STATUS_LABELS[status]}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm text-text-primary mb-2">
                  {getText('role')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'USER', 'DESIGNER', 'OPERATOR'] as const).map(
                    (role) => (
                      <button
                        key={role}
                        onClick={() => {
                          setRoleFilter(role);
                          setPage(0);
                        }}
                        className={cn(
                          'px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors',
                          roleFilter === role
                            ? 'bg-btn-neutral text-white'
                            : 'bg-bg-default text-text-primary border border-border hover:bg-bg-secondary'
                        )}
                      >
                        {role === 'all' ? getText('all') : TENANT_ROLE_LABELS[role]}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 pt-0">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <IconStatCard
              icon={<Users size={20} />}
              label={getText('totalUsers')}
              value={userStats.total}
            />
            <IconStatCard
              icon={<UserCheck size={20} />}
              label={getText('activeUsers')}
              value={userStats.active}
            />
            <IconStatCard
              icon={<UserMinus size={20} />}
              label={getText('inactiveUsers')}
              value={userStats.inactive}
            />
            <IconStatCard
              icon={<UserX size={20} />}
              label={getText('suspendedUsers')}
              value={userStats.suspended}
            />
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              {totalElements}
              {getText('userCount')}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-text-secondary" />
              <span className="ml-2 text-text-secondary">{getText('loading')}</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && totalElements === 0 && !searchQuery && statusFilter === 'all' && roleFilter === 'all' && (
            <div className="text-center py-12 text-text-secondary">
              <Users size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p className="mb-1">{getText('noUsers')}</p>
              <p className="text-sm">{getText('noUsersDescription')}</p>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && users.length === 0 && (searchQuery || statusFilter !== 'all' || roleFilter !== 'all') && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && users.length > 0 && (
            <DataTable
              columns={columns}
              data={users}
              showColumnToggle={false}
              showPagination={false}
              labels={{
                noResults: getText('noResults'),
              }}
            />
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                {getText('prev')}
              </Button>
              <span className="px-4 py-2 text-sm text-text-secondary">
                {page + 1} / {data.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                {getText('next')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && selectedUser && targetStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-default rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2">
              {targetStatus === 'ACTIVE' && <CheckCircle size={20} className="text-status-success" />}
              {targetStatus === 'INACTIVE' && <UserMinus size={20} className="text-text-secondary" />}
              {targetStatus === 'SUSPENDED' && <AlertCircle size={20} className="text-status-error" />}
              {targetStatus === 'ACTIVE' && getText('confirmActivate')}
              {targetStatus === 'INACTIVE' && getText('confirmDeactivate')}
              {targetStatus === 'SUSPENDED' && getText('confirmSuspend')}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {selectedUser.name} ({selectedUser.email})
            </p>
            {targetStatus === 'SUSPENDED' && (
              <div className="mb-4">
                <Label className="text-text-secondary mb-2">{getText('reason')} *</Label>
                <Textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  placeholder={getText('reasonPlaceholder')}
                  rows={3}
                />
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedUser(null);
                  setTargetStatus(null);
                  setStatusReason('');
                }}
              >
                {getText('cancel')}
              </Button>
              <Button
                onClick={handleConfirmStatusChange}
                disabled={changeStatus.isPending || (targetStatus === 'SUSPENDED' && !statusReason.trim())}
                className={cn(
                  targetStatus === 'SUSPENDED' && 'bg-status-error hover:bg-status-error/90 text-white'
                )}
              >
                {changeStatus.isPending
                  ? (targetStatus === 'ACTIVE' ? getText('activating') : targetStatus === 'INACTIVE' ? getText('deactivating') : getText('suspending'))
                  : getText('confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
