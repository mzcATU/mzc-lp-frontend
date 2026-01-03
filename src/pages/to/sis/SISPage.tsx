/**
 * SIS(Student Information System) Page
 * 차수별 수강생 정보를 확인하는 페이지
 */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Search,
  Filter,
  ChevronDown,
  Loader2,
  Calendar,
  Users,
  BookOpen,
  LayoutGrid,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Button,
  Badge,
  DataTable,
  DataTableColumnHeader,
  IconStatCard,
} from '@/components/common';
import { useTimes } from '@/hooks/to/useTimeQueries';
import type {
  CourseTimeResponse,
  CourseTimeStatus,
  CourseTimeFilterParams,
} from '@/types/to/time.types';
import {
  COURSE_TIME_STATUS_LABELS,
  DELIVERY_TYPE_LABELS,
} from '@/types/to/time.types';

interface SISPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '학생 수강 정보 확인', en: 'Student Information System' },
  subtitle: { ko: '차수별 수강생 정보를 확인하고 관리하세요.', en: 'View and manage student enrollment by course time.' },
  searchPlaceholder: { ko: '차수명 검색...', en: 'Search course time...' },
  filter: { ko: '필터', en: 'Filter' },
  status: { ko: '상태', en: 'Status' },
  all: { ko: '전체', en: 'All' },
  DRAFT: { ko: '작성 중', en: 'Draft' },
  RECRUITING: { ko: '모집 중', en: 'Recruiting' },
  ONGOING: { ko: '진행 중', en: 'Ongoing' },
  CLOSED: { ko: '종료됨', en: 'Closed' },
  ARCHIVED: { ko: '보관됨', en: 'Archived' },
  totalTimes: { ko: '전체 차수', en: 'Total Times' },
  recruitingTimes: { ko: '모집 중', en: 'Recruiting' },
  ongoingTimes: { ko: '진행 중', en: 'Ongoing' },
  closedTimes: { ko: '종료됨', en: 'Closed' },
  noResults: { ko: '검색 결과가 없습니다.', en: 'No results found.' },
  noTimes: { ko: '차수가 없습니다.', en: 'No course times.' },
  noTimesDescription: { ko: '차수를 먼저 생성해 주세요.', en: 'Please create course times first.' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  prev: { ko: '이전', en: 'Prev' },
  next: { ko: '다음', en: 'Next' },
  timeCount: { ko: '개의 차수', en: ' course times' },
  columnTitle: { ko: '차수명', en: 'Title' },
  columnStatus: { ko: '상태', en: 'Status' },
  columnDelivery: { ko: '진행 방식', en: 'Delivery' },
  columnPeriod: { ko: '학습 기간', en: 'Period' },
  columnEnrollment: { ko: '수강 현황', en: 'Enrollment' },
  columnActions: { ko: '액션', en: 'Actions' },
  unlimited: { ko: '무제한', en: 'Unlimited' },
  viewEnrollments: { ko: '수강생 관리', en: 'Manage Enrollments' },
};

const statusBadgeVariant: Record<CourseTimeStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  DRAFT: 'secondary',
  RECRUITING: 'default',
  ONGOING: 'success',
  CLOSED: 'warning',
  ARCHIVED: 'destructive',
};

export function SISPage({ language = 'ko' }: Readonly<SISPageProps>) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseTimeStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API 파라미터 구성
  const params: CourseTimeFilterParams = {
    page,
    size: 20,
    sort: 'createdAt,desc',
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = useTimes(params);

  const times = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  // 최신 생성순 정렬 + 검색 필터링
  const filteredTimes = useMemo(() => {
    const sorted = [...times].sort((a, b) => b.id - a.id);

    if (!searchQuery) return sorted;
    const query = searchQuery.toLowerCase();
    return sorted.filter((time) => time.title.toLowerCase().includes(query));
  }, [times, searchQuery]);

  // 통계 계산
  const timeStats = useMemo(() => ({
    total: totalElements,
    recruiting: times.filter((t) => t.status === 'RECRUITING').length,
    ongoing: times.filter((t) => t.status === 'ONGOING').length,
    closed: times.filter((t) => t.status === 'CLOSED').length,
  }), [times, totalElements]);

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

  const formatEnrollment = (capacity: number | null, current: number) => {
    if (capacity === null) return `${current} / ${getText('unlimited')}`;
    return `${current} / ${capacity}`;
  };

  // 리스트뷰 컬럼 정의
  const columns: ColumnDef<CourseTimeResponse>[] = useMemo(
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
            {COURSE_TIME_STATUS_LABELS[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: 'deliveryType',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnDelivery')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {DELIVERY_TYPE_LABELS[row.original.deliveryType]}
          </span>
        ),
      },
      {
        id: 'period',
        header: getText('columnPeriod'),
        cell: ({ row }) => (
          <div className="text-sm text-text-secondary">
            <p>{formatDate(row.original.classStartDate)}</p>
            <p className="text-xs">~ {formatDate(row.original.classEndDate)}</p>
          </div>
        ),
      },
      {
        id: 'enrollment',
        header: getText('columnEnrollment'),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-text-secondary" />
            <span className="text-sm text-text-primary">
              {formatEnrollment(row.original.capacity, row.original.currentEnrollment)}
            </span>
          </div>
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
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate(`/to/times/${item.id}/enrollments`)}
                className="h-8"
              >
                <ExternalLink size={14} />
                {getText('viewEnrollments')}
              </Button>
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
          <BookOpen size={48} className="mx-auto mb-3 text-text-placeholder" />
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
                {(['all', 'DRAFT', 'RECRUITING', 'ONGOING', 'CLOSED', 'ARCHIVED'] as const).map(
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
              label={getText('totalTimes')}
              value={timeStats.total}
            />
            <IconStatCard
              icon={<Users size={20} />}
              label={getText('recruitingTimes')}
              value={timeStats.recruiting}
            />
            <IconStatCard
              icon={<Calendar size={20} />}
              label={getText('ongoingTimes')}
              value={timeStats.ongoing}
            />
            <IconStatCard
              icon={<BookOpen size={20} />}
              label={getText('closedTimes')}
              value={timeStats.closed}
            />
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              {filteredTimes.length}
              {getText('timeCount')}
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
              <BookOpen size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p className="mb-1">{getText('noTimes')}</p>
              <p className="text-sm">{getText('noTimesDescription')}</p>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && filteredTimes.length === 0 && (searchQuery || statusFilter !== 'all') && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && filteredTimes.length > 0 && (
            <DataTable
              columns={columns}
              data={filteredTimes}
              showColumnToggle={false}
              showPagination={true}
              onRowClick={(item) => navigate(`/to/times/${item.id}/enrollments`)}
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
