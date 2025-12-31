import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Search,
  Loader2,
  FileText,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  AlertCircle,
} from 'lucide-react';
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
import {
  usePendingPrograms,
  useApproveProgram,
  useRejectProgram,
} from '@/hooks/to/useProgramQueries';
import type { PendingProgramResponse } from '@/types/common';
import {
  PROGRAM_LEVEL_LABELS,
  PROGRAM_TYPE_LABELS,
} from '@/types/common';

interface ProgramPendingPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '과정 등록/수정', en: 'Course Registration & Edit' },
  subtitle: { ko: '개설 신청된 과정을 검토하고 승인/반려 처리합니다.', en: 'Review and approve/reject course applications.' },
  searchPlaceholder: { ko: '과정명 검색...', en: 'Search course...' },
  pendingCourses: { ko: '검토 대기 과정', en: 'Pending Courses' },
  noResults: { ko: '검색 결과가 없습니다.', en: 'No results found.' },
  noPending: { ko: '검토 대기 중인 과정이 없습니다.', en: 'No pending courses.' },
  noPendingDescription: { ko: 'TU가 개설 신청을 하면 여기에 표시됩니다.', en: 'Pending courses will appear here when TU submits them.' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  prev: { ko: '이전', en: 'Prev' },
  next: { ko: '다음', en: 'Next' },
  courseCount: { ko: '개의 과정', en: ' courses' },
  columnTitle: { ko: '과정명', en: 'Title' },
  columnLevel: { ko: '레벨', en: 'Level' },
  columnType: { ko: '타입', en: 'Type' },
  columnCreator: { ko: '생성자', en: 'Creator' },
  columnSubmittedAt: { ko: '신청일', en: 'Submitted' },
  columnActions: { ko: '액션', en: 'Actions' },
  view: { ko: '상세보기', en: 'View Details' },
  notSet: { ko: '미설정', en: 'Not set' },
  approve: { ko: '승인', en: 'Approve' },
  reject: { ko: '반려', en: 'Reject' },
  approving: { ko: '승인 중...', en: 'Approving...' },
  rejecting: { ko: '반려 중...', en: 'Rejecting...' },
  confirmApprove: { ko: '이 프로그램을 승인하시겠습니까?', en: 'Approve this program?' },
  confirmReject: { ko: '반려 사유를 입력하세요.', en: 'Enter rejection reason.' },
  rejectReasonRequired: { ko: '반려 사유를 입력해주세요.', en: 'Rejection reason is required.' },
  rejectReasonPlaceholder: { ko: '반려 사유를 입력하세요...', en: 'Enter rejection reason...' },
  approveCommentPlaceholder: { ko: '승인 코멘트 (선택)', en: 'Approval comment (optional)' },
  approvalComment: { ko: '승인 코멘트', en: 'Approval Comment' },
  rejectionReason: { ko: '반려 사유', en: 'Rejection Reason' },
  cancel: { ko: '취소', en: 'Cancel' },
  confirm: { ko: '확인', en: 'Confirm' },
};

export function ProgramPendingPage({ language = 'ko' }: Readonly<ProgramPendingPageProps>) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  // Modal states
  const [selectedProgram, setSelectedProgram] = useState<PendingProgramResponse | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approveComment, setApproveComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // React Query 훅 사용 - PENDING 상태만 조회
  const { data, isLoading, error } = usePendingPrograms({ page, size: 20 });
  const approveProgram = useApproveProgram();
  const rejectProgram = useRejectProgram();

  const programs = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  // 검색 필터링 (클라이언트 사이드)
  const filteredPrograms = useMemo(() => {
    if (!searchQuery) return programs;
    const query = searchQuery.toLowerCase();
    return programs.filter((program) => program.title.toLowerCase().includes(query));
  }, [programs, searchQuery]);

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

  // Action handlers
  const handleApproveClick = (program: PendingProgramResponse) => {
    setSelectedProgram(program);
    setShowApproveModal(true);
  };

  const handleRejectClick = (program: PendingProgramResponse) => {
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

  // Primary Action 렌더링 (승인 버튼)
  const renderPrimaryAction = (item: PendingProgramResponse) => {
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
  };

  // 더보기 메뉴 렌더링
  const renderMoreMenu = (item: PendingProgramResponse) => {
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
          <DropdownMenuItem onClick={() => navigate(`/to/courses/${item.id}`)}>
            <Eye size={14} />
            {getText('view')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleRejectClick(item)}
            variant="destructive"
          >
            <XCircle size={14} />
            {getText('reject')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // 리스트뷰 컬럼 정의
  const columns: ColumnDef<PendingProgramResponse>[] = useMemo(
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
        accessorKey: 'submittedAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnSubmittedAt')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {formatDate(row.original.submittedAt)}
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
    [language, navigate, approveProgram.isPending]
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

          {/* Search Bar */}
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
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 pt-0">
          {/* Statistics Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <IconStatCard
              icon={<Clock size={20} />}
              label={getText('pendingCourses')}
              value={totalElements}
            />
            <IconStatCard
              icon={<CheckCircle size={20} />}
              label="승인 처리"
              value="-"
            />
            <IconStatCard
              icon={<XCircle size={20} />}
              label="반려 처리"
              value="-"
            />
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              <Badge variant="warning" className="mr-2">검토 대기</Badge>
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
          {!isLoading && totalElements === 0 && !searchQuery && (
            <div className="text-center py-12 text-text-secondary">
              <CheckCircle size={48} className="mx-auto mb-3 text-status-success" />
              <p className="mb-1">{getText('noPending')}</p>
              <p className="text-sm">{getText('noPendingDescription')}</p>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && filteredPrograms.length === 0 && searchQuery && (
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
