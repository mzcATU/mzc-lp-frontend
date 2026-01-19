import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
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
  useReadyCourses,
  useRegisterCourse,
  useUnreadyCourse,
} from '@/hooks/tu/useCourseQueries';
import type { ReadyCourseResponse } from '@/types/common/course.types';
import {
  COURSE_LEVEL_LABELS,
  COURSE_TYPE_LABELS,
} from '@/types/common/course.types';

interface CoursePendingPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '과정 등록/수정', en: 'Course Registration & Edit' },
  subtitle: { ko: '개설 신청된 과정을 검토하고 승인/반려 처리합니다.', en: 'Review and approve/reject course applications.' },
  searchPlaceholder: { ko: '과정명 검색...', en: 'Search course...' },
  readyCourses: { ko: '검토 대기 과정', en: 'Ready Courses' },
  noResults: { ko: '검색 결과가 없습니다.', en: 'No results found.' },
  noReady: { ko: '검토 대기 중인 과정이 없습니다.', en: 'No courses waiting for review.' },
  noReadyDescription: { ko: 'TU가 개설 신청을 하면 여기에 표시됩니다.', en: 'Courses will appear here when TU submits them for review.' },
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
  register: { ko: '승인', en: 'Register' },
  reject: { ko: '반려', en: 'Reject' },
  registering: { ko: '승인 중...', en: 'Registering...' },
  rejecting: { ko: '반려 중...', en: 'Rejecting...' },
  confirmRegister: { ko: '이 과정을 승인하시겠습니까?', en: 'Register this course?' },
  confirmReject: { ko: '반려 사유를 입력하세요.', en: 'Enter rejection reason.' },
  rejectReasonRequired: { ko: '반려 사유를 입력해주세요.', en: 'Rejection reason is required.' },
  rejectReasonPlaceholder: { ko: '반려 사유를 입력하세요...', en: 'Enter rejection reason...' },
  registerCommentPlaceholder: { ko: '승인 코멘트 (선택)', en: 'Registration comment (optional)' },
  registerComment: { ko: '승인 코멘트', en: 'Registration Comment' },
  rejectionReason: { ko: '반려 사유', en: 'Rejection Reason' },
  cancel: { ko: '취소', en: 'Cancel' },
  confirm: { ko: '확인', en: 'Confirm' },
};

// 아이콘 색상별 스타일 (디자인 토큰 기반)
const iconColorStyles = {
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

export function CoursePendingPage({ language = 'ko' }: Readonly<CoursePendingPageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  // Modal states
  const [selectedCourse, setSelectedCourse] = useState<ReadyCourseResponse | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [registerComment, setRegisterComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // React Query 훅 사용 - READY 상태만 조회
  const { data, isLoading, error } = useReadyCourses({ page, size: 10 });
  const registerCourse = useRegisterCourse();
  const unreadyCourse = useUnreadyCourse();

  const courses = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  // 검색 필터링 (클라이언트 사이드)
  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    const query = searchQuery.toLowerCase();
    return courses.filter((course) => course.title.toLowerCase().includes(query));
  }, [courses, searchQuery]);

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
  const handleRegisterClick = (course: ReadyCourseResponse) => {
    setSelectedCourse(course);
    setShowRegisterModal(true);
  };

  const handleRejectClick = (course: ReadyCourseResponse) => {
    setSelectedCourse(course);
    setShowRejectModal(true);
  };

  const handleRegister = async () => {
    if (!selectedCourse) return;
    try {
      await registerCourse.mutateAsync({
        id: selectedCourse.id,
        request: registerComment ? { comment: registerComment } : undefined,
      });
      setShowRegisterModal(false);
      setSelectedCourse(null);
      setRegisterComment('');
    } catch (err) {
      console.error('Register failed:', err);
    }
  };

  const handleReject = async () => {
    if (!selectedCourse) return;
    if (!rejectReason.trim()) {
      alert(getText('rejectReasonRequired'));
      return;
    }
    try {
      // TODO: 백엔드에서 반려 사유 저장 기능 추가 시 reason 전달
      await unreadyCourse.mutateAsync(selectedCourse.id);
      setShowRejectModal(false);
      setSelectedCourse(null);
      setRejectReason('');
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  // Primary Action 렌더링 (승인 버튼)
  const renderPrimaryAction = (item: ReadyCourseResponse) => {
    return (
      <Button
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          handleRegisterClick(item);
        }}
        disabled={registerCourse.isPending}
        className="h-8"
      >
        <CheckCircle size={14} />
        {getText('register')}
      </Button>
    );
  };

  // 더보기 메뉴 렌더링
  const renderMoreMenu = (item: ReadyCourseResponse) => {
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
          <DropdownMenuItem onClick={() => navigate(prefixPath(`/co/courses/${item.id}`))}>
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
  const columns: ColumnDef<ReadyCourseResponse>[] = useMemo(
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
            {row.original.level ? COURSE_LEVEL_LABELS[row.original.level] : getText('notSet')}
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
            {row.original.type ? COURSE_TYPE_LABELS[row.original.type] : getText('notSet')}
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
    [language, navigate, registerCourse.isPending]
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
            <StatCard
              icon={<Clock size={20} />}
              label={getText('readyCourses')}
              value={totalElements}
              iconColor="yellow"
            />
            <StatCard
              icon={<CheckCircle size={20} />}
              label="승인 처리"
              value="-"
              iconColor="green"
            />
            <StatCard
              icon={<XCircle size={20} />}
              label="반려 처리"
              value="-"
              iconColor="red"
            />
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              <Badge variant="warning" className="mr-2">검토 대기</Badge>
              {filteredCourses.length}
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
              <p className="mb-1">{getText('noReady')}</p>
              <p className="text-sm">{getText('noReadyDescription')}</p>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && filteredCourses.length === 0 && searchQuery && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && filteredCourses.length > 0 && (
            <DataTable
              columns={columns}
              data={filteredCourses}
              showColumnToggle={false}
              showPagination={true}
              manualPagination={true}
              pageCount={data?.totalPages ?? 0}
              pageIndex={page}
              pageSize={10}
              onPageChange={setPage}
              onRowClick={(item) => navigate(prefixPath(`/co/courses/${item.id}`))}
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

      {/* Register Modal */}
      {showRegisterModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-default rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2">
              <CheckCircle size={20} className="text-status-success" />
              {getText('confirmRegister')}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {selectedCourse.title}
            </p>
            <div className="mb-4">
              <Label className="text-text-secondary mb-2">{getText('registerComment')}</Label>
              <Textarea
                value={registerComment}
                onChange={(e) => setRegisterComment(e.target.value)}
                placeholder={getText('registerCommentPlaceholder')}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRegisterModal(false);
                  setSelectedCourse(null);
                  setRegisterComment('');
                }}
              >
                {getText('cancel')}
              </Button>
              <Button onClick={handleRegister} disabled={registerCourse.isPending}>
                {registerCourse.isPending ? getText('registering') : getText('confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-default rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2">
              <AlertCircle size={20} className="text-status-error" />
              {getText('confirmReject')}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {selectedCourse.title}
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
                  setSelectedCourse(null);
                  setRejectReason('');
                }}
              >
                {getText('cancel')}
              </Button>
              <Button
                onClick={handleReject}
                disabled={unreadyCourse.isPending || !rejectReason.trim()}
                className="bg-status-error hover:bg-status-error/90 text-white"
              >
                {unreadyCourse.isPending ? getText('rejecting') : getText('reject')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
