import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Search,
  Filter,
  ChevronDown,
  Loader2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  LayoutGrid,
  Eye,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Button,
  Badge,
  DataTable,
  DataTableColumnHeader,
  IconStatCard,
} from '@/components/common';
import { usePrograms } from '@/hooks/to/useProgramQueries';
import type { ProgramResponse, ProgramStatus } from '@/types/common';
import {
  PROGRAM_STATUS_LABELS,
  PROGRAM_LEVEL_LABELS,
  PROGRAM_TYPE_LABELS,
} from '@/types/common';
import type { ProgramFilterParams } from '@/services/to/programService';

interface ProgramListPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '과정 검색 및 상세 조회', en: 'Course Search & Details' },
  subtitle: { ko: '등록된 교육 과정을 검색하고 조회합니다.', en: 'Search and view registered courses.' },
  searchPlaceholder: { ko: '과정명 검색...', en: 'Search course...' },
  filter: { ko: '필터', en: 'Filter' },
  status: { ko: '상태', en: 'Status' },
  all: { ko: '전체', en: 'All' },
  DRAFT: { ko: '작성 중', en: 'Draft' },
  PENDING: { ko: '검토 대기', en: 'Pending' },
  APPROVED: { ko: '승인됨', en: 'Approved' },
  REJECTED: { ko: '반려됨', en: 'Rejected' },
  CLOSED: { ko: '종료됨', en: 'Closed' },
  totalCourses: { ko: '전체 과정', en: 'Total Courses' },
  pendingCourses: { ko: '검토 대기', en: 'Pending' },
  approvedCourses: { ko: '승인됨', en: 'Approved' },
  rejectedCourses: { ko: '반려됨', en: 'Rejected' },
  noResults: { ko: '검색 결과가 없습니다.', en: 'No results found.' },
  noCourses: { ko: '등록된 과정이 없습니다.', en: 'No courses registered.' },
  noCoursesDescription: { ko: 'TU가 과정을 생성하면 여기에 표시됩니다.', en: 'Courses will appear here when TU creates them.' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  prev: { ko: '이전', en: 'Prev' },
  next: { ko: '다음', en: 'Next' },
  courseCount: { ko: '개의 과정', en: ' courses' },
  columnTitle: { ko: '과정명', en: 'Title' },
  columnStatus: { ko: '상태', en: 'Status' },
  columnLevel: { ko: '레벨', en: 'Level' },
  columnType: { ko: '타입', en: 'Type' },
  columnCreatedAt: { ko: '생성일', en: 'Created' },
  columnActions: { ko: '액션', en: 'Actions' },
  view: { ko: '상세', en: 'View' },
  notSet: { ko: '미설정', en: 'Not set' },
};

const statusBadgeVariant: Record<ProgramStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  DRAFT: 'secondary',
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
  CLOSED: 'default',
};

export function ProgramListPage({ language = 'ko' }: Readonly<ProgramListPageProps>) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProgramStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API 파라미터 구성
  const params: ProgramFilterParams = {
    page,
    size: 20,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = usePrograms(params);

  const programs = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  // 검색 필터링 (클라이언트 사이드)
  const filteredPrograms = useMemo(() => {
    if (!searchQuery) return programs;
    const query = searchQuery.toLowerCase();
    return programs.filter((program) => program.title.toLowerCase().includes(query));
  }, [programs, searchQuery]);

  // 통계 계산
  const programStats = useMemo(() => ({
    total: totalElements,
    pending: programs.filter((p) => p.status === 'PENDING').length,
    approved: programs.filter((p) => p.status === 'APPROVED').length,
    rejected: programs.filter((p) => p.status === 'REJECTED').length,
  }), [programs, totalElements]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 리스트뷰 컬럼 정의
  const columns: ColumnDef<ProgramResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnTitle')} />
        ),
        cell: ({ row }) => (
          <div className="max-w-md">
            <p className="text-sm font-medium text-text-primary truncate">
              {row.original.title}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              ID: {row.original.id}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnStatus')} />
        ),
        cell: ({ row }) => (
          <Badge variant={statusBadgeVariant[row.original.status]}>
            {PROGRAM_STATUS_LABELS[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: 'level',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnLevel')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {row.original.level ? PROGRAM_LEVEL_LABELS[row.original.level] : getText('notSet')}
          </span>
        ),
      },
      {
        accessorKey: 'type',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnType')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {row.original.type ? PROGRAM_TYPE_LABELS[row.original.type] : getText('notSet')}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnCreatedAt')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-right">{getText('columnActions')}</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div
              className="flex items-center justify-end gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => navigate(`/to/courses/${item.id}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm text-text-primary hover:bg-bg-secondary transition-colors"
                title={getText('view')}
              >
                <Eye size={16} />
              </button>
            </div>
          );
        },
      },
    ],
    [language, navigate]
  );

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-3 text-text-placeholder" />
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
              <label className="block text-sm text-text-primary mb-2">
                {getText('status')}
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'CLOSED'] as const).map(
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
                      {getText(status)}
                    </button>
                  )
                )}
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
              icon={<LayoutGrid size={20} />}
              label={getText('totalCourses')}
              value={programStats.total}
            />
            <IconStatCard
              icon={<Clock size={20} />}
              label={getText('pendingCourses')}
              value={programStats.pending}
            />
            <IconStatCard
              icon={<CheckCircle size={20} />}
              label={getText('approvedCourses')}
              value={programStats.approved}
            />
            <IconStatCard
              icon={<XCircle size={20} />}
              label={getText('rejectedCourses')}
              value={programStats.rejected}
            />
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              {filteredPrograms.length}
              {getText('courseCount')}
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
          {!isLoading && totalElements === 0 && !searchQuery && statusFilter === 'all' && (
            <div className="text-center py-12 text-text-secondary">
              <FileText size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p className="mb-1">{getText('noCourses')}</p>
              <p className="text-sm">{getText('noCoursesDescription')}</p>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && filteredPrograms.length === 0 && (searchQuery || statusFilter !== 'all') && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && filteredPrograms.length > 0 && (
            <DataTable
              columns={columns}
              data={filteredPrograms}
              showColumnToggle={false}
              showPagination={false}
              onRowClick={(item) => navigate(`/to/courses/${item.id}`)}
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
