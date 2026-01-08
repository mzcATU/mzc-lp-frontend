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
  MoreHorizontal,
  Archive,
  AlertCircle,
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
} from '@/components/common';
import {
  usePrograms,
  useApproveProgram,
  useRejectProgram,
  useCloseProgram,
} from '@/hooks/to/useProgramQueries';
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
  columnCreator: { ko: '생성자', en: 'Creator' },
  columnCreatedAt: { ko: '생성일', en: 'Created' },
  columnActions: { ko: '액션', en: 'Actions' },
  view: { ko: '상세보기', en: 'View Details' },
  notSet: { ko: '미설정', en: 'Not set' },
  approve: { ko: '승인', en: 'Approve' },
  reject: { ko: '반려', en: 'Reject' },
  close: { ko: '종료', en: 'Close' },
  approving: { ko: '승인 중...', en: 'Approving...' },
  rejecting: { ko: '반려 중...', en: 'Rejecting...' },
  closing: { ko: '종료 중...', en: 'Closing...' },
  confirmApprove: { ko: '이 프로그램을 승인하시겠습니까?', en: 'Approve this program?' },
  confirmReject: { ko: '반려 사유를 입력하세요.', en: 'Enter rejection reason.' },
  confirmClose: { ko: '이 프로그램을 종료하시겠습니까?', en: 'Close this program?' },
  rejectReasonRequired: { ko: '반려 사유를 입력해주세요.', en: 'Rejection reason is required.' },
  rejectReasonPlaceholder: { ko: '반려 사유를 입력하세요...', en: 'Enter rejection reason...' },
  approveCommentPlaceholder: { ko: '승인 코멘트 (선택)', en: 'Approval comment (optional)' },
  approvalComment: { ko: '승인 코멘트', en: 'Approval Comment' },
  rejectionReason: { ko: '반려 사유', en: 'Rejection Reason' },
  cancel: { ko: '취소', en: 'Cancel' },
  confirm: { ko: '확인', en: 'Confirm' },
};

const statusBadgeVariant: Record<ProgramStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  DRAFT: 'secondary',
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
  CLOSED: 'default',
};

// 아이콘 색상별 스타일 (디자인 토큰 기반)
const iconColorStyles = {
  blue: 'bg-badge-blue-bg text-badge-blue',
  yellow: 'bg-badge-yellow-bg text-badge-yellow',
  green: 'bg-badge-green-bg text-badge-green',
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

export function ProgramListPage({ language = 'ko' }: Readonly<ProgramListPageProps>) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProgramStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  // Modal states
  const [selectedProgram, setSelectedProgram] = useState<ProgramResponse | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API 파라미터 구성
  const params: ProgramFilterParams = {
    page,
    size: 10,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = usePrograms(params);
  const approveProgram = useApproveProgram();
  const rejectProgram = useRejectProgram();
  const closeProgram = useCloseProgram();

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

  // Action handlers
  const handleApproveClick = (program: ProgramResponse) => {
    setSelectedProgram(program);
    setShowApproveModal(true);
  };

  const handleRejectClick = (program: ProgramResponse) => {
    setSelectedProgram(program);
    setShowRejectModal(true);
  };

  const handleApprove = async () => {
    if (!selectedProgram) return;
    try {
      await approveProgram.mutateAsync({
        id: selectedProgram.id,
        request: approveComment ? { comment: approveComment } : undefined,
      });
      setShowApproveModal(false);
      setSelectedProgram(null);
      setApproveComment('');
    } catch (err) {
      console.error('Approve failed:', err);
    }
  };

  const handleReject = async () => {
    if (!selectedProgram) return;
    if (!rejectReason.trim()) {
      alert(getText('rejectReasonRequired'));
      return;
    }
    try {
      await rejectProgram.mutateAsync({
        id: selectedProgram.id,
        request: { reason: rejectReason },
      });
      setShowRejectModal(false);
      setSelectedProgram(null);
      setRejectReason('');
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  const handleClose = async (program: ProgramResponse) => {
    if (!confirm(getText('confirmClose'))) return;
    try {
      await closeProgram.mutateAsync(program.id);
    } catch (err) {
      console.error('Close failed:', err);
    }
  };

  // 상태별 Primary Action 렌더링
  // - PENDING: 승인 버튼 (운영자 주요 액션)
  // - APPROVED: 종료 버튼
  // - DRAFT, REJECTED, CLOSED: Primary Action 없음 (Row Click으로 상세보기)
  const renderPrimaryAction = (item: ProgramResponse) => {
    switch (item.status) {
      case 'PENDING':
        return (
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleApproveClick(item);
            }}
            disabled={approveProgram.isPending}
            className="h-8"
          >
            <CheckCircle size={14} />
            {getText('approve')}
          </Button>
        );
      case 'APPROVED':
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClose(item);
            }}
            disabled={closeProgram.isPending}
            className="h-8 border border-border"
          >
            <Archive size={14} />
            {getText('close')}
          </Button>
        );
      default:
        // DRAFT, REJECTED, CLOSED: Primary Action 없음
        return null;
    }
  };

  // 더보기 메뉴 렌더링
  // 모든 상태에 ... 메뉴 표시 (시각적 일관성)
  // 상태별 메뉴 아이템:
  // - PENDING: 반려, 상세보기
  // - APPROVED: 상세보기
  // - DRAFT, REJECTED, CLOSED: 상세보기
  const renderMoreMenu = (item: ProgramResponse) => {
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
          {/* 상세보기 - 모든 상태 */}
          <DropdownMenuItem onClick={() => navigate(`/to/courses/${item.id}`)}>
            <Eye size={14} />
            {getText('view')}
          </DropdownMenuItem>

          {/* 반려 - PENDING 상태만 */}
          {item.status === 'PENDING' && (
            <DropdownMenuItem
              onClick={() => handleRejectClick(item)}
              variant="destructive"
            >
              <XCircle size={14} />
              {getText('reject')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
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
          <div className="min-w-0">
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
          <span className="text-sm text-text-secondary whitespace-nowrap">
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
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {row.original.type ? PROGRAM_TYPE_LABELS[row.original.type] : getText('notSet')}
          </span>
        ),
      },
      {
        accessorKey: 'creatorName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnCreator')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {row.original.creatorName || (row.original.creatorId ? `ID: ${row.original.creatorId}` : '-')}
          </span>
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
              {renderPrimaryAction(item)}
              {renderMoreMenu(item)}
            </div>
          );
        },
        size: 130,
      },
    ],
    [language, navigate, approveProgram.isPending, closeProgram.isPending]
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
            <StatCard
              icon={<LayoutGrid size={20} />}
              label={getText('totalCourses')}
              value={programStats.total}
              iconColor="blue"
            />
            <StatCard
              icon={<Clock size={20} />}
              label={getText('pendingCourses')}
              value={programStats.pending}
              iconColor="yellow"
            />
            <StatCard
              icon={<CheckCircle size={20} />}
              label={getText('approvedCourses')}
              value={programStats.approved}
              iconColor="green"
            />
            <StatCard
              icon={<XCircle size={20} />}
              label={getText('rejectedCourses')}
              value={programStats.rejected}
              iconColor="red"
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
              showPagination={true}
              manualPagination={true}
              pageCount={data?.totalPages ?? 0}
              pageIndex={page}
              pageSize={10}
              onPageChange={setPage}
              onRowClick={(item) => navigate(`/to/courses/${item.id}`)}
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

      {/* Approve Modal */}
      {showApproveModal && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-default rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2">
              <CheckCircle size={20} className="text-status-success" />
              {getText('confirmApprove')}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {selectedProgram.title}
            </p>
            <div className="mb-4">
              <Label className="text-text-secondary mb-2">{getText('approvalComment')}</Label>
              <Textarea
                value={approveComment}
                onChange={(e) => setApproveComment(e.target.value)}
                placeholder={getText('approveCommentPlaceholder')}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedProgram(null);
                  setApproveComment('');
                }}
              >
                {getText('cancel')}
              </Button>
              <Button onClick={handleApprove} disabled={approveProgram.isPending}>
                {approveProgram.isPending ? getText('approving') : getText('confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-default rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2">
              <AlertCircle size={20} className="text-status-error" />
              {getText('confirmReject')}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {selectedProgram.title}
            </p>
            <div className="mb-4">
              <Label className="text-text-secondary mb-2">{getText('rejectionReason')} *</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={getText('rejectReasonPlaceholder')}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedProgram(null);
                  setRejectReason('');
                }}
              >
                {getText('cancel')}
              </Button>
              <Button
                onClick={handleReject}
                disabled={rejectProgram.isPending || !rejectReason.trim()}
                className="bg-status-error hover:bg-status-error/90 text-white"
              >
                {rejectProgram.isPending ? getText('rejecting') : getText('reject')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
