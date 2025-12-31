import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Search,
  Filter,
  ChevronDown,
  Loader2,
  Users,
  Eye,
  MoreHorizontal,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Button,
  Badge,
  DataTable,
  DataTableColumnHeader,
  IconStatCard,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  NativeSelect,
} from '@/components/common';
import { useInstructorAssignments } from '@/hooks/to/useInstructorAssignmentQueries';
import type {
  InstructorAssignmentListResponse,
  InstructorAssignmentFilterParams,
  InstructorRole,
  AssignmentStatus,
} from '@/types/to/instructorAssignment.types';
import {
  INSTRUCTOR_ROLE_LABELS,
  ASSIGNMENT_STATUS_LABELS,
} from '@/types/to/instructorAssignment.types';

interface InstructorAssignmentsPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '강사 배정 정보', en: 'Instructor Assignments' },
  subtitle: { ko: '전체 강사 배정 현황을 확인합니다.', en: 'View all instructor assignments.' },
  searchPlaceholder: { ko: '강사명, 차수명, 프로그램명 검색...', en: 'Search instructor, course time, program...' },
  filter: { ko: '필터', en: 'Filter' },
  role: { ko: '역할', en: 'Role' },
  status: { ko: '상태', en: 'Status' },
  all: { ko: '전체', en: 'All' },
  // 통계 라벨
  totalAssignments: { ko: '전체 배정', en: 'Total Assignments' },
  mainInstructors: { ko: '주강사', en: 'Main Instructors' },
  subInstructors: { ko: '보조강사', en: 'Sub Instructors' },
  activeAssignments: { ko: '활동 중', en: 'Active' },
  // 테이블 컬럼
  columnInstructor: { ko: '강사명', en: 'Instructor' },
  columnCourseTime: { ko: '차수', en: 'Course Time' },
  columnProgram: { ko: '프로그램', en: 'Program' },
  columnRole: { ko: '역할', en: 'Role' },
  columnStatus: { ko: '상태', en: 'Status' },
  columnPeriod: { ko: '학습 기간', en: 'Period' },
  columnAssignedAt: { ko: '배정일', en: 'Assigned At' },
  // 액션
  viewCourseTime: { ko: '차수 상세보기', en: 'View Course Time' },
  // 상태
  noResults: { ko: '검색 결과가 없습니다.', en: 'No results found.' },
  noAssignments: { ko: '강사 배정 정보가 없습니다.', en: 'No instructor assignments.' },
  noAssignmentsDescription: { ko: '차수에 강사를 배정하면 여기에 표시됩니다.', en: 'Assign instructors to course times to see them here.' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  prev: { ko: '이전', en: 'Prev' },
  next: { ko: '다음', en: 'Next' },
  assignmentCount: { ko: '개의 배정', en: ' assignments' },
};

const roleBadgeVariant: Record<InstructorRole, 'default' | 'secondary' | 'outline'> = {
  MAIN: 'default',
  SUB: 'secondary',
  ASSISTANT: 'outline',
};

const statusBadgeVariant: Record<AssignmentStatus, 'default' | 'secondary' | 'destructive'> = {
  ACTIVE: 'default',
  REPLACED: 'secondary',
  CANCELLED: 'destructive',
};

export function InstructorAssignmentsPage({ language = 'ko' }: Readonly<InstructorAssignmentsPageProps>) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<InstructorRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);
  const getRoleLabel = (role: InstructorRole) =>
    language === 'ko' ? INSTRUCTOR_ROLE_LABELS[role].ko : INSTRUCTOR_ROLE_LABELS[role].en;
  const getStatusLabel = (status: AssignmentStatus) =>
    language === 'ko' ? ASSIGNMENT_STATUS_LABELS[status].ko : ASSIGNMENT_STATUS_LABELS[status].en;

  // API 파라미터 구성
  const params: InstructorAssignmentFilterParams = {
    page,
    size: 20,
    ...(roleFilter !== 'all' && { role: roleFilter }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = useInstructorAssignments(params);

  const assignments = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  // 클라이언트 사이드 검색 필터링
  const filteredAssignments = useMemo(() => {
    if (!searchQuery) return assignments;
    const query = searchQuery.toLowerCase();
    return assignments.filter(
      (item) =>
        item.instructor.name.toLowerCase().includes(query) ||
        item.courseTime.title.toLowerCase().includes(query) ||
        item.program.title.toLowerCase().includes(query)
    );
  }, [assignments, searchQuery]);

  // 통계 계산
  const stats = useMemo(() => ({
    total: totalElements,
    main: assignments.filter((a) => a.role === 'MAIN').length,
    sub: assignments.filter((a) => a.role === 'SUB').length,
    active: assignments.filter((a) => a.status === 'ACTIVE').length,
  }), [assignments, totalElements]);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatPeriod = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-';
    const format = (d: Date) =>
      d.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
        month: '2-digit',
        day: '2-digit',
      });
    return `${format(start)} ~ ${format(end)}`;
  };

  // 더보기 메뉴 렌더링
  const renderMoreMenu = (item: InstructorAssignmentListResponse) => {
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
          <DropdownMenuItem onClick={() => navigate(`/to/times/${item.courseTime.id}`)}>
            <Eye size={14} />
            {getText('viewCourseTime')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // 테이블 컬럼 정의
  const columns: ColumnDef<InstructorAssignmentListResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'instructor',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnInstructor')} />
        ),
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            <p className="text-sm font-medium text-text-primary truncate">
              {row.original.instructor.name}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {row.original.instructor.email}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'courseTime',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnCourseTime')} />
        ),
        cell: ({ row }) => (
          <div className="max-w-[150px]">
            <p className="text-sm text-text-primary truncate">
              {row.original.courseTime.title}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'program',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnProgram')} />
        ),
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            <p className="text-sm text-text-secondary truncate">
              {row.original.program.title}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnRole')} />
        ),
        cell: ({ row }) => (
          <Badge variant={roleBadgeVariant[row.original.role]}>
            {getRoleLabel(row.original.role)}
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
            {getStatusLabel(row.original.status)}
          </Badge>
        ),
      },
      {
        id: 'period',
        header: getText('columnPeriod'),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {formatPeriod(row.original.courseTime.startDate, row.original.courseTime.endDate)}
          </span>
        ),
      },
      {
        accessorKey: 'assignedAt',
        header: getText('columnAssignedAt'),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {formatDate(row.original.assignedAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <div
            className="flex items-center justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            {renderMoreMenu(row.original)}
          </div>
        ),
      },
    ],
    [language, navigate]
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-primary mb-2">
                    {getText('role')}
                  </label>
                  <NativeSelect
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value as InstructorRole | 'all');
                      setPage(0);
                    }}
                    options={[
                      { value: 'all', label: getText('all') },
                      { value: 'MAIN', label: getRoleLabel('MAIN') },
                      { value: 'SUB', label: getRoleLabel('SUB') },
                      { value: 'ASSISTANT', label: getRoleLabel('ASSISTANT') },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-primary mb-2">
                    {getText('status')}
                  </label>
                  <NativeSelect
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as AssignmentStatus | 'all');
                      setPage(0);
                    }}
                    options={[
                      { value: 'all', label: getText('all') },
                      { value: 'ACTIVE', label: getStatusLabel('ACTIVE') },
                      { value: 'REPLACED', label: getStatusLabel('REPLACED') },
                      { value: 'CANCELLED', label: getStatusLabel('CANCELLED') },
                    ]}
                  />
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
              label={getText('totalAssignments')}
              value={stats.total}
            />
            <IconStatCard
              icon={<UserCheck size={20} />}
              label={getText('mainInstructors')}
              value={stats.main}
            />
            <IconStatCard
              icon={<Users size={20} />}
              label={getText('subInstructors')}
              value={stats.sub}
            />
            <IconStatCard
              icon={<Calendar size={20} />}
              label={getText('activeAssignments')}
              value={stats.active}
            />
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              {filteredAssignments.length}
              {getText('assignmentCount')}
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
          {!isLoading && totalElements === 0 && !searchQuery && roleFilter === 'all' && statusFilter === 'all' && (
            <div className="text-center py-12 text-text-secondary">
              <Users size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p className="mb-1">{getText('noAssignments')}</p>
              <p className="text-sm">{getText('noAssignmentsDescription')}</p>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && filteredAssignments.length === 0 && (searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && filteredAssignments.length > 0 && (
            <DataTable
              columns={columns}
              data={filteredAssignments}
              showColumnToggle={false}
              showPagination={true}
              onRowClick={(item) => navigate(`/to/times/${item.courseTime.id}`)}
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
    </div>
  );
}
