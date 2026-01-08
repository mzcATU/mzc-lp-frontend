import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Search,
  Filter,
  ChevronDown,
  Loader2,
  Users,
  GraduationCap,
  UserPlus,
  UserX,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Button,
  Badge,
  DataTable,
  DataTableColumnHeader,
  Label,
  Textarea,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Progress,
} from '@/components/common';
import { useTime } from '@/hooks/to/useTimeQueries';
import {
  useEnrollmentsByCourseTime,
  useCourseTimeEnrollmentStats,
  useForceEnroll,
  useCompleteEnrollment,
  useUpdateEnrollmentStatus,
  useAdminCancelEnrollment,
} from '@/hooks/to/useEnrollmentQueries';
import { useUsers } from '@/hooks/to/useUserQueries';
import type {
  EnrollmentResponse,
  EnrollmentStatus,
  EnrollmentFilterParams,
} from '@/types/to/enrollment.types';
import { ENROLLMENT_STATUS_LABELS, ENROLLMENT_TYPE_LABELS } from '@/types/to/enrollment.types';

interface EnrollmentManagementPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '수강생 관리', en: 'Enrollment Management' },
  subtitle: { ko: '차수별 수강생을 관리하고 수료 처리합니다.', en: 'Manage enrollments and process completion.' },
  searchPlaceholder: { ko: '이름, 이메일 검색...', en: 'Search name, email...' },
  filter: { ko: '필터', en: 'Filter' },
  status: { ko: '상태', en: 'Status' },
  all: { ko: '전체', en: 'All' },
  totalEnrollments: { ko: '총 수강생', en: 'Total Enrollments' },
  inProgress: { ko: '수강 중', en: 'In Progress' },
  completed: { ko: '수료', en: 'Completed' },
  completionRate: { ko: '수료율', en: 'Completion Rate' },
  averageProgress: { ko: '평균 진도율', en: 'Average Progress' },
  noResults: { ko: '검색 결과가 없습니다.', en: 'No results found.' },
  noEnrollments: { ko: '등록된 수강생이 없습니다.', en: 'No enrollments registered.' },
  noEnrollmentsDescription: { ko: '수강생이 등록되면 여기에 표시됩니다.', en: 'Enrollments will appear here when registered.' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  prev: { ko: '이전', en: 'Prev' },
  next: { ko: '다음', en: 'Next' },
  enrollmentCount: { ko: '명의 수강생', en: ' enrollments' },
  columnName: { ko: '이름', en: 'Name' },
  columnEmail: { ko: '이메일', en: 'Email' },
  columnType: { ko: '타입', en: 'Type' },
  columnStatus: { ko: '상태', en: 'Status' },
  columnProgress: { ko: '진도율', en: 'Progress' },
  columnScore: { ko: '점수', en: 'Score' },
  columnEnrolledAt: { ko: '등록일', en: 'Enrolled' },
  columnActions: { ko: '액션', en: 'Actions' },
  complete: { ko: '수료 처리', en: 'Complete' },
  drop: { ko: '중도 탈락', en: 'Drop' },
  cancel: { ko: '취소', en: 'Cancel' },
  forceEnroll: { ko: '강제 배정', en: 'Force Enroll' },
  back: { ko: '돌아가기', en: 'Back' },
  confirm: { ko: '확인', en: 'Confirm' },
  completing: { ko: '처리 중...', en: 'Processing...' },
  confirmComplete: { ko: '수료 처리하시겠습니까?', en: 'Complete this enrollment?' },
  confirmDrop: { ko: '중도 탈락 처리 사유를 입력하세요.', en: 'Enter drop reason.' },
  confirmCancel: { ko: '수강을 취소하시겠습니까?', en: 'Cancel this enrollment?' },
  reasonRequired: { ko: '사유를 입력해주세요.', en: 'Reason is required.' },
  reasonPlaceholder: { ko: '사유를 입력하세요...', en: 'Enter reason...' },
  reason: { ko: '사유', en: 'Reason' },
  scoreLabel: { ko: '점수 (선택)', en: 'Score (optional)' },
  scorePlaceholder: { ko: '0-100', en: '0-100' },
  selectUsers: { ko: '배정할 사용자 선택', en: 'Select users to enroll' },
  selectedUsers: { ko: '명 선택됨', en: ' selected' },
  enrolling: { ko: '배정 중...', en: 'Enrolling...' },
  forceEnrollSuccess: { ko: '명 배정 완료', en: ' enrolled successfully' },
  forceEnrollFail: { ko: '명 배정 실패', en: ' failed to enroll' },
  courseTimeNotFound: { ko: '차수를 찾을 수 없습니다.', en: 'Course time not found.' },
};

const statusBadgeVariant: Record<EnrollmentStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  ENROLLED: 'warning',
  COMPLETED: 'success',
  DROPPED: 'destructive',
  FAILED: 'default',
};

// 아이콘 색상별 스타일 (디자인 토큰 기반)
const iconColorStyles = {
  blue: 'bg-badge-blue-bg text-badge-blue',
  green: 'bg-badge-green-bg text-badge-green',
  yellow: 'bg-badge-yellow-bg text-badge-yellow',
  indigo: 'bg-badge-indigo-bg text-badge-indigo',
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

export function EnrollmentManagementPage({ language = 'ko' }: Readonly<EnrollmentManagementPageProps>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const courseTimeId = Number(id);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  // Modal states
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentResponse | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDropModal, setShowDropModal] = useState(false);
  const [showForceEnrollModal, setShowForceEnrollModal] = useState(false);
  const [completeScore, setCompleteScore] = useState('');
  const [dropReason, setDropReason] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [forceEnrollReason, setForceEnrollReason] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // 차수 정보 조회
  const { data: courseTime, isLoading: isTimeLoading } = useTime(courseTimeId);

  // API 파라미터 구성
  const params: EnrollmentFilterParams = {
    page,
    size: 10,
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = useEnrollmentsByCourseTime(courseTimeId, params);
  const { data: stats } = useCourseTimeEnrollmentStats(courseTimeId);
  const { data: usersData } = useUsers({ size: 100 });
  const forceEnroll = useForceEnroll();
  const completeEnrollment = useCompleteEnrollment();
  const updateStatus = useUpdateEnrollmentStatus();
  const cancelEnrollment = useAdminCancelEnrollment();

  const enrollments = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const users = usersData?.content ?? [];

  // 검색 필터링 (클라이언트 사이드)
  const filteredEnrollments = useMemo(() => {
    if (!searchQuery) return enrollments;
    const query = searchQuery.toLowerCase();
    return enrollments.filter(
      (e) =>
        e.userName?.toLowerCase().includes(query) ||
        e.userEmail?.toLowerCase().includes(query)
    );
  }, [enrollments, searchQuery]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // Action handlers
  const handleComplete = async () => {
    if (!selectedEnrollment) return;
    try {
      await completeEnrollment.mutateAsync({
        id: selectedEnrollment.id,
        request: {
          ...(completeScore && { score: Number(completeScore) }),
        },
      });
      setShowCompleteModal(false);
      setSelectedEnrollment(null);
      setCompleteScore('');
    } catch (err) {
      console.error('Complete failed:', err);
    }
  };

  const handleDrop = async () => {
    if (!selectedEnrollment) return;
    if (!dropReason.trim()) {
      alert(getText('reasonRequired'));
      return;
    }
    try {
      await updateStatus.mutateAsync({
        id: selectedEnrollment.id,
        request: { status: 'DROPPED', reason: dropReason },
      });
      setShowDropModal(false);
      setSelectedEnrollment(null);
      setDropReason('');
    } catch (err) {
      console.error('Drop failed:', err);
    }
  };

  const handleCancel = async (enrollment: EnrollmentResponse) => {
    if (!confirm(getText('confirmCancel'))) return;
    try {
      await cancelEnrollment.mutateAsync(enrollment.id);
    } catch (err) {
      console.error('Cancel failed:', err);
    }
  };

  const handleForceEnroll = async () => {
    if (selectedUserIds.length === 0) return;
    try {
      const result = await forceEnroll.mutateAsync({
        courseTimeId,
        request: {
          userIds: selectedUserIds,
          ...(forceEnrollReason && { reason: forceEnrollReason }),
        },
      });
      alert(`${result.successCount}${getText('forceEnrollSuccess')}${result.failCount > 0 ? `, ${result.failCount}${getText('forceEnrollFail')}` : ''}`);
      setShowForceEnrollModal(false);
      setSelectedUserIds([]);
      setForceEnrollReason('');
    } catch (err) {
      console.error('Force enroll failed:', err);
    }
  };

  // 더보기 메뉴 렌더링
  const renderMoreMenu = (item: EnrollmentResponse) => {
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
          {item.status === 'ENROLLED' && (
            <>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedEnrollment(item);
                  setShowCompleteModal(true);
                }}
              >
                <CheckCircle size={14} />
                {getText('complete')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedEnrollment(item);
                  setShowDropModal(true);
                }}
                variant="destructive"
              >
                <XCircle size={14} />
                {getText('drop')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleCancel(item)}
                variant="destructive"
              >
                <UserX size={14} />
                {getText('cancel')}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // 리스트뷰 컬럼 정의
  const columns: ColumnDef<EnrollmentResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'userName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnName')} />
        ),
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {row.original.userName || `User ${row.original.userId}`}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {row.original.userEmail || `ID: ${row.original.userId}`}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnType')} />
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.type === 'MANDATORY' ? 'warning' : 'default'}>
            {ENROLLMENT_TYPE_LABELS[row.original.type]}
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
            {ENROLLMENT_STATUS_LABELS[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: 'progressPercent',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnProgress')} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2 min-w-[120px]">
            <Progress value={row.original.progressPercent} className="h-2 flex-1" />
            <span className="text-xs text-text-secondary whitespace-nowrap">
              {row.original.progressPercent}%
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'score',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnScore')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {row.original.score ?? '-'}
          </span>
        ),
      },
      {
        accessorKey: 'enrolledAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnEnrolledAt')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {formatDate(row.original.enrolledAt)}
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
              {item.status === 'ENROLLED' && (
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEnrollment(item);
                    setShowCompleteModal(true);
                  }}
                  className="h-8"
                >
                  <CheckCircle size={14} />
                  {getText('complete')}
                </Button>
              )}
              {renderMoreMenu(item)}
            </div>
          );
        },
        size: 160,
      },
    ],
    [language]
  );

  if (isTimeLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <Loader2 size={32} className="animate-spin text-text-secondary" />
      </div>
    );
  }

  if (!courseTime) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-3 text-text-placeholder" />
          <p className="text-text-secondary">{getText('courseTimeNotFound')}</p>
        </div>
      </div>
    );
  }

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
          {/* Back Button and Title */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/to/times')}
              className="border border-border"
            >
              <ArrowLeft size={16} />
              {getText('back')}
            </Button>
            <div className="flex-1">
              <h1 className="text-text-primary mb-1">{getText('title')}</h1>
              <p className="text-text-secondary text-sm m-0">
                {courseTime.title} - {getText('subtitle')}
              </p>
            </div>
            <Button onClick={() => setShowForceEnrollModal(true)}>
              <UserPlus size={16} />
              {getText('forceEnroll')}
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
                {(['all', 'ENROLLED', 'COMPLETED', 'DROPPED', 'FAILED'] as const).map(
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
                      {status === 'all' ? getText('all') : ENROLLMENT_STATUS_LABELS[status]}
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
              icon={<Users size={20} />}
              label={getText('totalEnrollments')}
              value={stats?.totalEnrollments ?? totalElements}
              iconColor="blue"
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label={getText('inProgress')}
              value={stats?.enrolledCount ?? 0}
              iconColor="yellow"
            />
            <StatCard
              icon={<GraduationCap size={20} />}
              label={getText('completed')}
              value={stats?.completedCount ?? 0}
              iconColor="green"
            />
            <StatCard
              icon={<Percent size={20} />}
              label={getText('completionRate')}
              value={`${stats?.completionRate?.toFixed(1) ?? 0}%`}
              iconColor="indigo"
            />
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              {filteredEnrollments.length}
              {getText('enrollmentCount')}
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
              <Users size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p className="mb-1">{getText('noEnrollments')}</p>
              <p className="text-sm">{getText('noEnrollmentsDescription')}</p>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && filteredEnrollments.length === 0 && (searchQuery || statusFilter !== 'all') && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && filteredEnrollments.length > 0 && (
            <DataTable
              columns={columns}
              data={filteredEnrollments}
              showColumnToggle={false}
              showPagination={true}
              manualPagination={true}
              pageCount={data?.totalPages ?? 0}
              pageIndex={page}
              pageSize={10}
              onPageChange={setPage}
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

      {/* Complete Modal */}
      {showCompleteModal && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-default rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2">
              <GraduationCap size={20} className="text-status-success" />
              {getText('confirmComplete')}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {selectedEnrollment.userName || `User ${selectedEnrollment.userId}`}
            </p>
            <div className="mb-4">
              <Label className="text-text-secondary mb-2">{getText('scoreLabel')}</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={completeScore}
                onChange={(e) => setCompleteScore(e.target.value)}
                placeholder={getText('scorePlaceholder')}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowCompleteModal(false);
                  setSelectedEnrollment(null);
                  setCompleteScore('');
                }}
              >
                {getText('cancel')}
              </Button>
              <Button
                onClick={handleComplete}
                disabled={completeEnrollment.isPending}
              >
                {completeEnrollment.isPending ? getText('completing') : getText('confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drop Modal */}
      {showDropModal && selectedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-default rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2">
              <AlertCircle size={20} className="text-status-error" />
              {getText('confirmDrop')}
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {selectedEnrollment.userName || `User ${selectedEnrollment.userId}`}
            </p>
            <div className="mb-4">
              <Label className="text-text-secondary mb-2">{getText('reason')} *</Label>
              <Textarea
                value={dropReason}
                onChange={(e) => setDropReason(e.target.value)}
                placeholder={getText('reasonPlaceholder')}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDropModal(false);
                  setSelectedEnrollment(null);
                  setDropReason('');
                }}
              >
                {getText('cancel')}
              </Button>
              <Button
                onClick={handleDrop}
                disabled={updateStatus.isPending || !dropReason.trim()}
                className="bg-status-error hover:bg-status-error/90 text-white"
              >
                {updateStatus.isPending ? getText('completing') : getText('confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Force Enroll Modal */}
      {showForceEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-default rounded-xl p-6 w-full max-w-lg mx-4 shadow-lg max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-text-secondary" />
              {getText('forceEnroll')}
            </h3>
            <div className="mb-4">
              <Label className="text-text-secondary mb-2">{getText('selectUsers')}</Label>
              <div className="border border-border rounded-lg max-h-[300px] overflow-auto">
                {users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-3 hover:bg-bg-secondary cursor-pointer border-b border-border last:border-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUserIds([...selectedUserIds, user.id]);
                        } else {
                          setSelectedUserIds(selectedUserIds.filter((id) => id !== user.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                      <p className="text-xs text-text-secondary truncate">{user.email}</p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-sm text-text-secondary mt-2">
                {selectedUserIds.length}{getText('selectedUsers')}
              </p>
            </div>
            <div className="mb-4">
              <Label className="text-text-secondary mb-2">{getText('reason')}</Label>
              <Textarea
                value={forceEnrollReason}
                onChange={(e) => setForceEnrollReason(e.target.value)}
                placeholder={getText('reasonPlaceholder')}
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForceEnrollModal(false);
                  setSelectedUserIds([]);
                  setForceEnrollReason('');
                }}
              >
                {getText('cancel')}
              </Button>
              <Button
                onClick={handleForceEnroll}
                disabled={forceEnroll.isPending || selectedUserIds.length === 0}
              >
                {forceEnroll.isPending ? getText('enrolling') : getText('confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
