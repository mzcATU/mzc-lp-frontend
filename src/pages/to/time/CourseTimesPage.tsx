import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Loader2,
  Calendar,
  Users,
  Clock,
  LayoutGrid,
  Trash2,
  Copy,
  Eye,
  MoreHorizontal,
  Play,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Button,
  Badge,
  DataTable,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common';
import { useTimes, useDeleteTime, useOpenTime } from '@/hooks/to/useTimeQueries';
import type {
  CourseTimeResponse,
  CourseTimeStatus,
  CourseTimeFilterParams,
} from '@/types/to/time.types';
import {
  COURSE_TIME_STATUS_LABELS,
  DELIVERY_TYPE_LABELS,
} from '@/types/to/time.types';

interface CourseTimesPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '차수 관리', en: 'Course Time Management' },
  subtitle: { ko: '차수를 생성하고 관리하세요.', en: 'Create and manage course times.' },
  createTime: { ko: '차수 생성', en: 'Create Course Time' },
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
  noTimesDescription: { ko: '새 차수를 생성해 보세요.', en: 'Try creating a new course time.' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  confirmDelete: { ko: '정말 삭제하시겠습니까?', en: 'Are you sure you want to delete?' },
  prev: { ko: '이전', en: 'Previous' },
  next: { ko: '다음', en: 'Next' },
  timeCount: { ko: '개의 차수', en: ' course times' },
  columnTitle: { ko: '차수명', en: 'Title' },
  columnStatus: { ko: '상태', en: 'Status' },
  columnDelivery: { ko: '진행 방식', en: 'Delivery' },
  columnPeriod: { ko: '학습 기간', en: 'Period' },
  columnCapacity: { ko: '정원', en: 'Capacity' },
  columnActions: { ko: '액션', en: 'Actions' },
  unlimited: { ko: '무제한', en: 'Unlimited' },
  view: { ko: '상세보기', en: 'View' },
  clone: { ko: '복제', en: 'Clone' },
  delete: { ko: '삭제', en: 'Delete' },
  openRecruiting: { ko: '모집 시작', en: 'Start Recruiting' },
  openError: { ko: '모집 시작에 실패했습니다.', en: 'Failed to start recruiting.' },
};

// 백엔드 에러 코드 → 사용자 친화적 메시지 매핑
const ERROR_MESSAGES: Record<string, { ko: string; en: string }> = {
  TS001: { ko: '차수를 찾을 수 없습니다.', en: 'Course time not found.' },
  TS002: { ko: '유효하지 않은 상태 전환입니다.', en: 'Invalid status transition.' },
  TS003: { ko: '정원이 초과되었습니다.', en: 'Capacity exceeded.' },
  TS004: { ko: '유효하지 않은 기간입니다.', en: 'Invalid date range.' },
  TS005: { ko: '오프라인/블렌디드 과정은 장소 정보가 필요합니다.', en: 'Location info required for offline/blended courses.' },
  TS006: { ko: '현재 상태에서는 차수를 수정할 수 없습니다.', en: 'Course time is not modifiable in current status.' },
  TS007: { ko: '진행 중인 과정에서는 메인 강사를 삭제할 수 없습니다.', en: 'Cannot delete main instructor while course is ongoing.' },
  TS008: { ko: '모집을 시작하려면 메인 강사를 먼저 배정해야 합니다.', en: 'Main instructor must be assigned before starting recruitment.' },
  TS009: { ko: '이 차수에 접근할 권한이 없습니다.', en: 'Not authorized to access this course time.' },
};

const statusBadgeVariant: Record<CourseTimeStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  DRAFT: 'secondary',
  RECRUITING: 'default',
  ONGOING: 'success',
  CLOSED: 'warning',
  ARCHIVED: 'destructive',
};

// 아이콘 색상별 스타일 (디자인 토큰 기반)
const iconColorStyles = {
  blue: 'bg-badge-blue-bg text-badge-blue',
  indigo: 'bg-badge-indigo-bg text-badge-indigo',
  green: 'bg-badge-green-bg text-badge-green',
  gray: 'bg-badge-gray-bg text-badge-gray',
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

export function CourseTimesPage({ language = 'ko' }: Readonly<CourseTimesPageProps>) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseTimeStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API 파라미터 구성
  const params: CourseTimeFilterParams = {
    page,
    size: 10,
    sort: 'createdAt,desc', // 최신 생성순 정렬
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = useTimes(params);
  const deleteTime = useDeleteTime();
  const openTime = useOpenTime();

  const times = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  // 최신 생성순 정렬 (ID 기준 내림차순) + 검색 필터링 (클라이언트 사이드)
  const filteredTimes = useMemo(() => {
    // ID 기준 내림차순 정렬 (ID가 높을수록 최신)
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

  const handleDelete = async (id: number) => {
    if (!confirm(getText('confirmDelete'))) return;
    try {
      await deleteTime.mutateAsync(id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const getErrorMessage = (err: unknown): string => {
    // Axios 에러 응답에서 에러 코드 추출
    const errorResponse = (err as { response?: { data?: { error?: { code?: string; message?: string } } } })?.response?.data?.error;
    const errorCode = errorResponse?.code;

    if (errorCode && ERROR_MESSAGES[errorCode]) {
      return language === 'ko' ? ERROR_MESSAGES[errorCode].ko : ERROR_MESSAGES[errorCode].en;
    }

    // 백엔드 메시지가 있으면 사용
    if (errorResponse?.message) {
      return errorResponse.message;
    }

    return getText('openError');
  };

  const handleOpen = async (id: number) => {
    try {
      await openTime.mutateAsync(id);
    } catch (err) {
      console.error('Open failed:', err);
      alert(getErrorMessage(err));
    }
  };

  // Primary Action 렌더링
  const renderPrimaryAction = (item: CourseTimeResponse) => {
    if (item.status === 'DRAFT') {
      return (
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen(item.id);
          }}
          disabled={openTime.isPending}
          className="h-8"
        >
          <Play size={14} />
          {getText('openRecruiting')}
        </Button>
      );
    }
    return null;
  };

  // 더보기 메뉴 렌더링
  const renderMoreMenu = (item: CourseTimeResponse) => {
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
          <DropdownMenuItem onClick={() => navigate(`/to/times/${item.id}`)}>
            <Eye size={14} />
            {getText('view')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/to/times/${item.id}/clone`)}>
            <Copy size={14} />
            {getText('clone')}
          </DropdownMenuItem>
          {item.status === 'DRAFT' && (
            <DropdownMenuItem
              onClick={() => handleDelete(item.id)}
              variant="destructive"
            >
              <Trash2 size={14} />
              {getText('delete')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

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

  const formatCapacity = (capacity: number | null, current: number) => {
    if (capacity === null) return getText('unlimited');
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
        id: 'capacity',
        header: getText('columnCapacity'),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-text-secondary" />
            <span className="text-sm text-text-primary">
              {formatCapacity(row.original.capacity, row.original.currentEnrollment)}
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
              {renderPrimaryAction(item)}
              {renderMoreMenu(item)}
            </div>
          );
        },
      },
    ],
    [language, deleteTime.isPending, openTime.isPending, navigate]
  );

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <Calendar size={48} className="mx-auto mb-3 text-text-placeholder" />
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
            <Button onClick={() => navigate('/to/times/create')}>
              <Plus size={20} />
              <span>{getText('createTime')}</span>
            </Button>
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
            <StatCard
              icon={<LayoutGrid size={20} />}
              label={getText('totalTimes')}
              value={timeStats.total}
              iconColor="blue"
            />
            <StatCard
              icon={<Users size={20} />}
              label={getText('recruitingTimes')}
              value={timeStats.recruiting}
              iconColor="indigo"
            />
            <StatCard
              icon={<Clock size={20} />}
              label={getText('ongoingTimes')}
              value={timeStats.ongoing}
              iconColor="green"
            />
            <StatCard
              icon={<Calendar size={20} />}
              label={getText('closedTimes')}
              value={timeStats.closed}
              iconColor="gray"
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
              <Calendar size={48} className="mx-auto mb-3 text-text-placeholder" />
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
              manualPagination={true}
              pageCount={data?.totalPages ?? 0}
              pageIndex={page}
              pageSize={10}
              onPageChange={setPage}
              onRowClick={(item) => navigate(`/to/times/${item.id}`)}
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
    </div>
  );
}
