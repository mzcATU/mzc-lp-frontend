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
  Mail,
  User,
  Calendar,
  Phone,
  GraduationCap,
  BookOpen,
  Clock,
  Presentation,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Button,
  Badge,
  DataTable,
  DataTableColumnHeader,
  Label,
  Textarea,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/common';
import { useUsers, useUser, useChangeUserStatus, useUserEnrollmentStats, useUserInstructorStats } from '@/hooks/co/useUserQueries';
import type { UserListResponse, TenantRole, UserStatus, UserFilterParams } from '@/types/co';
import { TENANT_ROLE_LABELS, USER_STATUS_LABELS } from '@/types/co';

interface UserManagementPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '수강생 관리', en: 'Student Management' },
  subtitle: { ko: '수강생 정보를 조회하고 관리합니다.', en: 'View and manage student information.' },
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
  prev: { ko: '이전', en: 'Previous' },
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
  // Detail Modal
  userDetail: { ko: '사용자 상세 정보', en: 'User Details' },
  basicInfo: { ko: '기본 정보', en: 'Basic Info' },
  name: { ko: '이름', en: 'Name' },
  email: { ko: '이메일', en: 'Email' },
  phone: { ko: '전화번호', en: 'Phone' },
  noPhone: { ko: '등록된 전화번호 없음', en: 'No phone number' },
  updatedAt: { ko: '수정일', en: 'Updated' },
  close: { ko: '닫기', en: 'Close' },
  // Enrollment Stats
  enrollmentStats: { ko: '수강 현황', en: 'Enrollment Stats' },
  totalEnrollments: { ko: '총 수강', en: 'Total' },
  inProgress: { ko: '수강 중', en: 'In Progress' },
  completed: { ko: '수료', en: 'Completed' },
  completionRate: { ko: '수료율', en: 'Completion Rate' },
  avgProgress: { ko: '평균 진도', en: 'Avg Progress' },
  avgScore: { ko: '평균 점수', en: 'Avg Score' },
  noEnrollments: { ko: '수강 이력이 없습니다.', en: 'No enrollment history.' },
  // Instructor Stats
  instructorStats: { ko: '강의 현황', en: 'Teaching Stats' },
  totalAssignments: { ko: '총 배정', en: 'Total' },
  mainInstructor: { ko: '주강사', en: 'Main' },
  subInstructor: { ko: '보조강사', en: 'Sub' },
  noAssignments: { ko: '강의 배정 이력이 없습니다.', en: 'No teaching assignments.' },
  // CourseRole
  courseRoles: { ko: '프로그램 역할', en: 'Program Roles' },
  ownedPrograms: { ko: '소유 프로그램', en: 'Owned Programs' },
  revenueShare: { ko: '수익 분배', en: 'Revenue Share' },
  noCourseRoles: { ko: '부여된 프로그램 역할이 없습니다.', en: 'No program roles assigned.' },
  courseRoleDesigner: { ko: 'Designer', en: 'Designer' },
  courseRoleOwner: { ko: 'Owner', en: 'Owner' },
  courseRoleInstructor: { ko: 'Instructor', en: 'Instructor' },
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
  INSTRUCTOR: 'secondary',
  USER: 'default',
};

// 아이콘 색상별 스타일 (디자인 토큰 기반)
const iconColorStyles = {
  blue: 'bg-badge-blue-bg text-badge-blue',
  green: 'bg-badge-green-bg text-badge-green',
  gray: 'bg-badge-gray-bg text-badge-gray',
  red: 'bg-badge-red-bg text-badge-red',
} as const;

type IconColor = keyof typeof iconColorStyles;

// 통계 카드 컴포넌트 (White Surface + Colored Icon)
function StatCard({
  icon,
  label,
  value,
  iconColor
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconColor: IconColor;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-bg-default p-5 shadow-sm transition-all hover:shadow-md">
      <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', iconColorStyles[iconColor])}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
}

export function UserManagementPage({ language = 'ko' }: Readonly<UserManagementPageProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [roleFilter, setRoleFilter] = useState<TenantRole | 'all'>('all'); // 기본값: 전체 (SA/TA 제외)
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserListResponse | null>(null);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<UserStatus | null>(null);
  const [statusReason, setStatusReason] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const PAGE_SIZE = 10;

  // API 파라미터 구성 - 전체 데이터를 가져와서 클라이언트에서 필터링
  const params: UserFilterParams = {
    page: 0,
    size: 1000, // 충분히 큰 값으로 전체 조회
    ...(statusFilter !== 'all' && { status: statusFilter }),
    // roleFilter가 'all'이면 서버에서 전체 조회 후 클라이언트 필터링
    ...(roleFilter !== 'all' && { role: roleFilter }),
    ...(searchQuery && { keyword: searchQuery }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = useUsers(params);
  const changeStatus = useChangeUserStatus();

  // 사용자 상세 정보 및 수강/강사 통계 조회
  const selectedUserId = selectedUserForDetail?.id ?? 0;
  const isDesigner = selectedUserForDetail?.systemRole === 'DESIGNER';
  const { data: userDetail, isLoading: isDetailLoading } = useUser(selectedUserId);
  const { data: enrollmentStats, isLoading: isStatsLoading } = useUserEnrollmentStats(selectedUserId);
  const { data: instructorStats, isLoading: isInstructorStatsLoading } = useUserInstructorStats(selectedUserId, isDesigner);

  // SA, TA, OPERATOR 제외 (운영자 입장에서 관리할 필요 없음)
  const filteredUsers = useMemo(() => {
    const allUsers = data?.content ?? [];
    return allUsers.filter(
      (user) => user.systemRole !== 'SYSTEM_ADMIN' && user.systemRole !== 'TENANT_ADMIN' && user.systemRole !== 'OPERATOR'
    );
  }, [data?.content]);

  // 전체 필터링된 사용자 수
  const totalElements = filteredUsers.length;

  // 통계 계산 (전체 필터링된 데이터 기준)
  const userStats = useMemo(() => ({
    total: totalElements,
    active: filteredUsers.filter((u) => u.status === 'ACTIVE').length,
    inactive: filteredUsers.filter((u) => u.status === 'INACTIVE').length,
    suspended: filteredUsers.filter((u) => u.status === 'SUSPENDED').length,
  }), [filteredUsers, totalElements]);

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
        id: selectedUser.id,
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
              ID: {row.original.id}
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
        accessorKey: 'systemRole',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnRole')} />
        ),
        cell: ({ row }) => (
          <Badge variant={roleBadgeVariant[row.original.systemRole]}>
            {TENANT_ROLE_LABELS[row.original.systemRole]}
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
                        onClick={() => setStatusFilter(status)}
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
                  {(['all', 'USER', 'DESIGNER'] as const).map(
                    (role) => (
                      <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
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
            <StatCard
              icon={<Users size={20} />}
              label={getText('totalUsers')}
              value={userStats.total}
              iconColor="blue"
            />
            <StatCard
              icon={<UserCheck size={20} />}
              label={getText('activeUsers')}
              value={userStats.active}
              iconColor="green"
            />
            <StatCard
              icon={<UserMinus size={20} />}
              label={getText('inactiveUsers')}
              value={userStats.inactive}
              iconColor="gray"
            />
            <StatCard
              icon={<UserX size={20} />}
              label={getText('suspendedUsers')}
              value={userStats.suspended}
              iconColor="red"
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
          {!isLoading && filteredUsers.length === 0 && (searchQuery || statusFilter !== 'all' || roleFilter !== 'all') && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && filteredUsers.length > 0 && (
            <DataTable
              columns={columns}
              data={filteredUsers}
              showColumnToggle={false}
              showPagination={true}
              pageSize={PAGE_SIZE}
              onRowClick={(user) => setSelectedUserForDetail(user)}
              labels={{
                noResults: getText('noResults'),
                rowsPerPage: language === 'ko' ? '페이지당 행 수' : 'Rows per page',
                pageOf: language === 'ko' ? '페이지 {current} / {total}' : 'Page {current} of {total}',
                rowsSelected: '',
              }}
            />
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

      {/* User Detail Modal */}
      <Dialog open={!!selectedUserForDetail} onOpenChange={(open: boolean) => !open && setSelectedUserForDetail(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="px-6 py-5 border-b border-border">
            <DialogTitle className="text-lg font-bold text-text-primary tracking-tight">
              {getText('userDetail')}
            </DialogTitle>
          </DialogHeader>

          {selectedUserForDetail && (
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* 로딩 상태 */}
              {(isDetailLoading || isStatsLoading || (isDesigner && isInstructorStatsLoading)) && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-text-secondary" />
                </div>
              )}

              {/* 기본 정보 섹션 */}
              {!isDetailLoading && (
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-badge-blue-bg text-badge-blue">
                      <User size={14} />
                    </span>
                    {getText('basicInfo')}
                  </h3>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    {/* 프로필 이미지 */}
                    {userDetail?.profileImageUrl && (
                      <div className="col-span-2 flex justify-center mb-2">
                        <img
                          src={userDetail.profileImageUrl}
                          alt={userDetail.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-border"
                        />
                      </div>
                    )}

                    {/* 이름 */}
                    <div>
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('name')}
                      </dt>
                      <dd className="text-sm font-medium text-text-primary">
                        {userDetail?.name ?? selectedUserForDetail.name}
                      </dd>
                    </div>

                    {/* ID */}
                    <div>
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        ID
                      </dt>
                      <dd className="text-sm font-medium text-text-primary">
                        {selectedUserForDetail.id}
                      </dd>
                    </div>

                    {/* 이메일 */}
                    <div className="col-span-2">
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('email')}
                      </dt>
                      <dd className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                        <Mail size={14} className="text-text-placeholder" />
                        {userDetail?.email ?? selectedUserForDetail.email}
                      </dd>
                    </div>

                    {/* 전화번호 */}
                    <div className="col-span-2">
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('phone')}
                      </dt>
                      <dd className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                        <Phone size={14} className="text-text-placeholder" />
                        {userDetail?.phone ?? getText('noPhone')}
                      </dd>
                    </div>

                    {/* 역할 */}
                    <div>
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('columnRole')}
                      </dt>
                      <dd>
                        <Badge variant={roleBadgeVariant[userDetail?.role ?? selectedUserForDetail.systemRole]}>
                          {TENANT_ROLE_LABELS[userDetail?.role ?? selectedUserForDetail.systemRole]}
                        </Badge>
                      </dd>
                    </div>

                    {/* 상태 */}
                    <div>
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('columnStatus')}
                      </dt>
                      <dd>
                        <Badge variant={statusBadgeVariant[userDetail?.status ?? selectedUserForDetail.status]}>
                          {USER_STATUS_LABELS[userDetail?.status ?? selectedUserForDetail.status]}
                        </Badge>
                      </dd>
                    </div>

                    {/* 가입일 */}
                    <div>
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('columnCreatedAt')}
                      </dt>
                      <dd className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                        <Calendar size={14} className="text-text-placeholder" />
                        {formatDate(userDetail?.createdAt ?? selectedUserForDetail.createdAt)}
                      </dd>
                    </div>

                    {/* 수정일 */}
                    {userDetail?.updatedAt && (
                      <div>
                        <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                          {getText('updatedAt')}
                        </dt>
                        <dd className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                          <Clock size={14} className="text-text-placeholder" />
                          {formatDate(userDetail.updatedAt)}
                        </dd>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* 프로그램 역할 섹션 (CourseRole) */}
              {!isDetailLoading && userDetail?.courseRoles && userDetail.courseRoles.length > 0 && (
                <section className="border-t border-border pt-6">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-badge-purple-bg text-badge-purple">
                      <Briefcase size={14} />
                    </span>
                    {getText('courseRoles')}
                  </h3>

                  <div className="space-y-3">
                    {userDetail.courseRoles.map((courseRole) => (
                      <div
                        key={courseRole.courseRoleId}
                        className="bg-bg-secondary rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                courseRole.role.toUpperCase() === 'OWNER'
                                  ? 'warning'
                                  : courseRole.role.toUpperCase() === 'INSTRUCTOR'
                                    ? 'success'
                                    : 'secondary'
                              }
                            >
                              {getText(`courseRole${courseRole.role.charAt(0).toUpperCase()}${courseRole.role.slice(1).toLowerCase()}` as keyof typeof t)}
                            </Badge>
                            <span className="text-sm font-medium text-text-primary">
                              {courseRole.courseName ?? '-'}
                            </span>
                          </div>
                          {courseRole.revenueSharePercent !== null && (
                            <span className="text-xs text-text-secondary">
                              {getText('revenueShare')}: {courseRole.revenueSharePercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 수강 현황 섹션 */}
              {!isStatsLoading && enrollmentStats && (
                <section className="border-t border-border pt-6">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-badge-green-bg text-badge-green">
                      <GraduationCap size={14} />
                    </span>
                    {getText('enrollmentStats')}
                  </h3>

                  {enrollmentStats.totalEnrollments === 0 ? (
                    <div className="text-center py-4 text-text-secondary text-sm">
                      <BookOpen size={32} className="mx-auto mb-2 text-text-placeholder" />
                      {getText('noEnrollments')}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {/* 총 수강 */}
                      <div className="bg-bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-text-secondary mb-1">{getText('totalEnrollments')}</p>
                        <p className="text-lg font-bold text-text-primary">{enrollmentStats.totalEnrollments}</p>
                      </div>

                      {/* 수강 중 */}
                      <div className="bg-bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-text-secondary mb-1">{getText('inProgress')}</p>
                        <p className="text-lg font-bold text-badge-blue">{enrollmentStats.inProgressCount}</p>
                      </div>

                      {/* 수료 */}
                      <div className="bg-bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-text-secondary mb-1">{getText('completed')}</p>
                        <p className="text-lg font-bold text-badge-green">{enrollmentStats.completedCount}</p>
                      </div>

                      {/* 수료율 */}
                      <div className="bg-bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-text-secondary mb-1">{getText('completionRate')}</p>
                        <p className="text-lg font-bold text-text-primary">{enrollmentStats.completionRate.toFixed(1)}%</p>
                      </div>

                      {/* 평균 진도 */}
                      <div className="bg-bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-text-secondary mb-1">{getText('avgProgress')}</p>
                        <p className="text-lg font-bold text-text-primary">{enrollmentStats.averageProgress.toFixed(1)}%</p>
                      </div>

                      {/* 평균 점수 */}
                      <div className="bg-bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-text-secondary mb-1">{getText('avgScore')}</p>
                        <p className="text-lg font-bold text-text-primary">
                          {enrollmentStats.averageScore > 0 ? enrollmentStats.averageScore.toFixed(1) : '-'}
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* 강의 현황 섹션 (DESIGNER만) */}
              {isDesigner && !isInstructorStatsLoading && instructorStats && (
                <section className="border-t border-border pt-6">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-badge-purple-bg text-badge-purple">
                      <Presentation size={14} />
                    </span>
                    {getText('instructorStats')}
                  </h3>

                  {instructorStats.totalCount === 0 ? (
                    <div className="text-center py-4 text-text-secondary text-sm">
                      <Presentation size={32} className="mx-auto mb-2 text-text-placeholder" />
                      {getText('noAssignments')}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {/* 총 배정 */}
                      <div className="bg-bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-text-secondary mb-1">{getText('totalAssignments')}</p>
                        <p className="text-lg font-bold text-text-primary">{instructorStats.totalCount}</p>
                      </div>

                      {/* 주강사 */}
                      <div className="bg-bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-text-secondary mb-1">{getText('mainInstructor')}</p>
                        <p className="text-lg font-bold text-badge-purple">{instructorStats.mainCount}</p>
                      </div>

                      {/* 보조강사 */}
                      <div className="bg-bg-secondary rounded-lg p-3 text-center">
                        <p className="text-xs text-text-secondary mb-1">{getText('subInstructor')}</p>
                        <p className="text-lg font-bold text-badge-blue">{instructorStats.subCount}</p>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
