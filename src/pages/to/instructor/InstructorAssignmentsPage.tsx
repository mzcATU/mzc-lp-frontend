import { useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Search,
  Filter,
  ChevronDown,
  Loader2,
  Users,
  Eye,
  MoreHorizontal,
  User,
  UserCheck,
  Calendar,
  Mail,
  ExternalLink,
  Clock,
  CheckCircle2,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Button,
  DataTable,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  NativeSelect,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/common';
import { useInstructorAssignments, useAssignInstructor } from '@/hooks/to/useInstructorAssignmentQueries';
import { useTimesInfinite, useTime } from '@/hooks/to/useTimeQueries';
import { useUsersInfinite } from '@/hooks/to/useUserQueries';
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
  columnCourseTime: { ko: '차수명', en: 'Course Time' },
  columnProgram: { ko: '과정명', en: 'Course' },
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
  prev: { ko: '이전', en: 'Previous' },
  next: { ko: '다음', en: 'Next' },
  assignmentCount: { ko: '개의 배정', en: ' assignments' },
  // 사이드 패널
  panelTitle: { ko: '배정 상세 정보', en: 'Assignment Details' },
  instructorInfo: { ko: '강사 정보', en: 'Instructor Info' },
  courseTimeInfo: { ko: '차수 정보', en: 'Course Time Info' },
  email: { ko: '이메일', en: 'Email' },
  assignedAt: { ko: '배정일', en: 'Assigned At' },
  programName: { ko: '과정명', en: 'Course Name' },
  learningPeriod: { ko: '학습 기간', en: 'Learning Period' },
  goToCourseTime: { ko: '차수 상세 페이지로 이동', en: 'Go to Course Time' },
  // 배정 생성
  createAssignment: { ko: '배정 생성', en: 'Create Assignment' },
  createAssignmentTitle: { ko: '새 강사 배정', en: 'New Instructor Assignment' },
  selectCourseTime: { ko: '차수 선택', en: 'Select Course Time' },
  selectCourseTimePlaceholder: { ko: '차수를 선택하세요', en: 'Select a course time' },
  selectInstructor: { ko: '강사 선택', en: 'Select Instructor' },
  selectInstructorPlaceholder: { ko: '강사를 선택하세요', en: 'Select an instructor' },
  selectRole: { ko: '역할 선택', en: 'Select Role' },
  forceAssign: { ko: '일정 충돌 무시', en: 'Ignore schedule conflicts' },
  forceAssignDescription: { ko: '다른 차수와 일정이 겹치더라도 배정합니다.', en: 'Assign even if schedule conflicts with other course times.' },
  cancel: { ko: '취소', en: 'Cancel' },
  create: { ko: '배정', en: 'Assign' },
  creating: { ko: '배정 중...', en: 'Assigning...' },
  createSuccess: { ko: '강사가 성공적으로 배정되었습니다.', en: 'Instructor assigned successfully.' },
  createError: { ko: '강사 배정에 실패했습니다.', en: 'Failed to assign instructor.' },
  requiredField: { ko: '필수 항목입니다.', en: 'This field is required.' },
  searchInstructor: { ko: '강사 검색...', en: 'Search instructor...' },
  existingInstructors: { ko: '현재 배정된 강사', en: 'Currently Assigned' },
  alreadyAssigned: { ko: '이미 배정됨', en: 'Already assigned' },
  noInstructorsFound: { ko: '강사를 찾을 수 없습니다.', en: 'No instructors found.' },
};

// Badge 색상 스타일 (디자인 토큰 기반)
const roleBadgeStyles: Record<InstructorRole, string> = {
  MAIN: 'bg-badge-indigo-bg text-badge-indigo',
  SUB: 'bg-badge-blue-bg text-badge-blue',
  ASSISTANT: 'bg-badge-gray-bg text-badge-gray',
};

const statusBadgeStyles: Record<AssignmentStatus, string> = {
  ACTIVE: 'bg-badge-green-bg text-badge-green',
  REPLACED: 'bg-badge-yellow-bg text-badge-yellow',
  CANCELLED: 'bg-badge-red-bg text-badge-red',
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

export function InstructorAssignmentsPage({ language = 'ko' }: Readonly<InstructorAssignmentsPageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<InstructorRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedAssignment, setSelectedAssignment] = useState<InstructorAssignmentListResponse | null>(null);

  // 생성 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    timeId: '',
    userId: '',
    role: 'MAIN' as InstructorRole,
    forceAssign: false,
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [instructorSearch, setInstructorSearch] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);
  const getRoleLabel = (role: InstructorRole) =>
    language === 'ko' ? INSTRUCTOR_ROLE_LABELS[role].ko : INSTRUCTOR_ROLE_LABELS[role].en;
  const getStatusLabel = (status: AssignmentStatus) =>
    language === 'ko' ? ASSIGNMENT_STATUS_LABELS[status].ko : ASSIGNMENT_STATUS_LABELS[status].en;

  // API 파라미터 구성
  const params: InstructorAssignmentFilterParams = {
    page,
    size: 10,
    ...(roleFilter !== 'all' && { role: roleFilter }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = useInstructorAssignments(params);

  // 생성용 데이터 조회
  const {
    data: timesData,
    fetchNextPage: fetchNextTimesPage,
    hasNextPage: hasNextTimesPage,
    isFetchingNextPage: isFetchingNextTimesPage,
  } = useTimesInfinite({ size: 20 });
  const {
    data: usersData,
    fetchNextPage: fetchNextUsersPage,
    hasNextPage: hasNextUsersPage,
    isFetchingNextPage: isFetchingNextUsersPage,
  } = useUsersInfinite({ size: 20, role: 'DESIGNER' }); // DESIGNER 권한만 조회

  // 선택된 차수의 상세 정보 (기존 강사 확인용)
  const selectedTimeId = createForm.timeId ? Number(createForm.timeId) : 0;
  const { data: selectedTimeData } = useTime(selectedTimeId);

  // 생성 mutation
  const assignInstructor = useAssignInstructor();

  const assignments = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  // 클라이언트 사이드 검색 필터링
  const filteredAssignments = useMemo(() => {
    if (!searchQuery) return assignments;
    const query = searchQuery.toLowerCase();
    return assignments.filter(
      (item) =>
        (item.instructor?.name?.toLowerCase().includes(query) ?? false) ||
        (item.courseTime?.title?.toLowerCase().includes(query) ?? false) ||
        (item.program?.title?.toLowerCase().includes(query) ?? false)
    );
  }, [assignments, searchQuery]);

  // 통계 계산
  const stats = useMemo(() => ({
    total: totalElements,
    main: assignments.filter((a) => a.role === 'MAIN').length,
    sub: assignments.filter((a) => a.role === 'SUB').length,
    active: assignments.filter((a) => a.status === 'ACTIVE').length,
  }), [assignments, totalElements]);

  // 무한 스크롤 데이터에서 모든 차수 추출
  const allTimes = useMemo(() => {
    if (!timesData?.pages) return [];
    return timesData.pages.flatMap((page) => page.content);
  }, [timesData]);

  // 선택된 차수에 이미 배정된 강사 ID 목록
  const assignedInstructorIds = useMemo(() => {
    if (!selectedTimeData?.instructors) return new Set<number>();
    return new Set(
      selectedTimeData.instructors
        .filter((i) => i.status === 'ACTIVE')
        .map((i) => i.userId)
    );
  }, [selectedTimeData]);

  // 무한 스크롤 데이터에서 모든 사용자 추출
  const allUsers = useMemo(() => {
    if (!usersData?.pages) return [];
    return usersData.pages.flatMap((page) => page.content);
  }, [usersData]);

  // 검색 필터링된 강사 목록
  const filteredUserOptions = useMemo(() => {
    const query = instructorSearch.toLowerCase().trim();

    return allUsers
      .filter((user) => {
        if (!query) return true;
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      })
      .map((user) => ({
        value: String(user.id),
        label: user.name,
        email: user.email,
        isAssigned: assignedInstructorIds.has(user.id),
      }));
  }, [allUsers, instructorSearch, assignedInstructorIds]);

  // 검색 필터링된 차수 목록
  const [timeSearch, setTimeSearch] = useState('');
  const filteredTimeOptions = useMemo(() => {
    const query = timeSearch.toLowerCase().trim();

    return allTimes
      .filter((time) => {
        if (!query) return true;
        return time.title.toLowerCase().includes(query);
      })
      .map((time) => ({
        value: String(time.id),
        label: time.title,
        status: time.status,
      }));
  }, [allTimes, timeSearch]);

  // 무한 스크롤용 ref
  const instructorListRef = useRef<HTMLDivElement>(null);
  const timeListRef = useRef<HTMLDivElement>(null);

  // 강사 목록 스크롤 이벤트 핸들러
  const handleInstructorListScroll = useCallback(() => {
    const listElement = instructorListRef.current;
    if (!listElement || isFetchingNextUsersPage || !hasNextUsersPage) return;

    const { scrollTop, scrollHeight, clientHeight } = listElement;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      fetchNextUsersPage();
    }
  }, [fetchNextUsersPage, hasNextUsersPage, isFetchingNextUsersPage]);

  // 차수 목록 스크롤 이벤트 핸들러
  const handleTimeListScroll = useCallback(() => {
    const listElement = timeListRef.current;
    if (!listElement || isFetchingNextTimesPage || !hasNextTimesPage) return;

    const { scrollTop, scrollHeight, clientHeight } = listElement;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      fetchNextTimesPage();
    }
  }, [fetchNextTimesPage, hasNextTimesPage, isFetchingNextTimesPage]);

  // 생성 모달 핸들러
  const handleOpenCreateModal = () => {
    setCreateForm({
      timeId: '',
      userId: '',
      role: 'MAIN',
      forceAssign: false,
    });
    setCreateError(null);
    setTimeSearch('');
    setInstructorSearch('');
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateError(null);
    setTimeSearch('');
    setInstructorSearch('');
  };

  const handleCreateAssignment = async () => {
    if (!createForm.timeId || !createForm.userId) {
      setCreateError(getText('requiredField'));
      return;
    }

    try {
      await assignInstructor.mutateAsync({
        timeId: Number(createForm.timeId),
        request: {
          userId: Number(createForm.userId),
          role: createForm.role,
          forceAssign: createForm.forceAssign,
        },
      });
      handleCloseCreateModal();
    } catch {
      setCreateError(getText('createError'));
    }
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
          <DropdownMenuItem
            onClick={() => item.courseTime?.id && navigate(prefixPath(`/to/times/${item.courseTime.id}`))}
            disabled={!item.courseTime?.id}
          >
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
              {row.original.instructor?.name ?? '-'}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {row.original.instructor?.email ?? '-'}
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
              {row.original.courseTime?.title ?? '-'}
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
              {row.original.program?.title ?? '-'}
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
          <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', roleBadgeStyles[row.original.role])}>
            {getRoleLabel(row.original.role)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnStatus')} />
        ),
        cell: ({ row }) => (
          <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusBadgeStyles[row.original.status])}>
            {getStatusLabel(row.original.status)}
          </span>
        ),
      },
      {
        id: 'period',
        header: getText('columnPeriod'),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary">
            {row.original.courseTime?.startDate && row.original.courseTime?.endDate
              ? formatPeriod(row.original.courseTime.startDate, row.original.courseTime.endDate)
              : '-'}
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
            <Button onClick={handleOpenCreateModal}>
              <Plus size={16} />
              {getText('createAssignment')}
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
          {/* Statistics Cards - White Surface + Colored Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<Users size={20} />}
              label={getText('totalAssignments')}
              value={stats.total}
              iconColor="blue"
            />
            <StatCard
              icon={<UserCheck size={20} />}
              label={getText('mainInstructors')}
              value={stats.main}
              iconColor="indigo"
            />
            <StatCard
              icon={<Users size={20} />}
              label={getText('subInstructors')}
              value={stats.sub}
              iconColor="gray"
            />
            <StatCard
              icon={<Calendar size={20} />}
              label={getText('activeAssignments')}
              value={stats.active}
              iconColor="green"
            />
          </div>

          {/* Count */}
          <p className="text-sm text-text-secondary mb-4">
            {filteredAssignments.length}
            {getText('assignmentCount')}
          </p>

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
              manualPagination={true}
              pageCount={data?.totalPages ?? 0}
              pageIndex={page}
              pageSize={10}
              onPageChange={setPage}
              onRowClick={(item) => setSelectedAssignment(item)}
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

      {/* Detail Modal */}
      <Dialog open={!!selectedAssignment} onOpenChange={(open: boolean) => !open && setSelectedAssignment(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="px-6 py-5 border-b border-border">
            <DialogTitle className="text-lg font-bold text-text-primary tracking-tight">
              {getText('panelTitle')}
            </DialogTitle>
          </DialogHeader>

          {selectedAssignment && (
            <>
              {/* Body */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                {/* Section 1: 강사 정보 */}
                <section className="mb-8">
                  {/* Section Title with Icon Badge */}
                  <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-badge-indigo-bg text-badge-indigo">
                      <User size={14} />
                    </span>
                    {getText('instructorInfo')}
                  </h3>

                  {/* Grid Layout */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    {/* 강사명 */}
                    <div>
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('columnInstructor')}
                      </dt>
                      <dd className="text-sm font-medium text-text-primary">
                        {selectedAssignment.instructor?.name ?? '-'}
                      </dd>
                    </div>

                    {/* 이메일 */}
                    <div className="col-span-2 sm:col-span-1">
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('email')}
                      </dt>
                      <dd className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
                        <Mail size={14} className="text-text-placeholder" />
                        {selectedAssignment.instructor?.email ?? '-'}
                      </dd>
                    </div>

                    {/* 역할 */}
                    <div>
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('columnRole')}
                      </dt>
                      <dd>
                        <span className={cn('inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold', roleBadgeStyles[selectedAssignment.role])}>
                          {getRoleLabel(selectedAssignment.role)}
                        </span>
                      </dd>
                    </div>

                    {/* 상태 */}
                    <div>
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('columnStatus')}
                      </dt>
                      <dd>
                        <span className={cn('inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold', statusBadgeStyles[selectedAssignment.status])}>
                          {selectedAssignment.status === 'ACTIVE' && <CheckCircle2 size={12} />}
                          {getStatusLabel(selectedAssignment.status)}
                        </span>
                      </dd>
                    </div>

                    {/* 배정일 */}
                    <div>
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('assignedAt')}
                      </dt>
                      <dd className="text-sm font-medium text-text-primary">
                        {formatDate(selectedAssignment.assignedAt)}
                      </dd>
                    </div>
                  </div>
                </section>

                {/* Divider */}
                <div className="my-6 border-t border-dashed border-border" />

                {/* Section 2: 차수 정보 */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-badge-indigo-bg text-badge-indigo">
                      <Calendar size={14} />
                    </span>
                    {getText('courseTimeInfo')}
                  </h3>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      {/* 차수명 */}
                      <div>
                        <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                          {getText('columnCourseTime')}
                        </dt>
                        <dd className="text-sm font-medium text-text-primary">
                          {selectedAssignment.courseTime?.title ?? '-'}
                        </dd>
                      </div>

                      {/* 과정명 */}
                      <div>
                        <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                          {getText('programName')}
                        </dt>
                        <dd className="text-sm font-medium text-text-primary">
                          {selectedAssignment.program?.title ?? '-'}
                        </dd>
                      </div>
                    </div>

                    {/* 학습 기간 */}
                    <div>
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('learningPeriod')}
                      </dt>
                      <dd className="flex items-center gap-2 text-sm font-medium text-text-primary">
                        <Clock size={14} className="text-text-placeholder" />
                        {selectedAssignment.courseTime?.startDate && selectedAssignment.courseTime?.endDate
                          ? `${formatDate(selectedAssignment.courseTime.startDate)} ~ ${formatDate(selectedAssignment.courseTime.endDate)}`
                          : '-'}
                      </dd>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="bg-bg-secondary px-6 py-4 flex justify-end border-t border-border">
                <button
                  onClick={() => {
                    if (selectedAssignment.courseTime?.id) {
                      navigate(prefixPath(`/to/times/${selectedAssignment.courseTime.id}`));
                    }
                  }}
                  disabled={!selectedAssignment.courseTime?.id}
                  className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-text-secondary hover:text-badge-indigo hover:bg-badge-indigo-bg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-text-secondary"
                >
                  {getText('goToCourseTime')}
                  <ExternalLink size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Assignment Modal */}
      <Dialog open={showCreateModal} onOpenChange={(open: boolean) => !open && handleCloseCreateModal()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{getText('createAssignmentTitle')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 차수 선택 */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {getText('selectCourseTime')} <span className="text-red-500">*</span>
              </label>

              {/* 검색 입력 */}
              <div className="relative mb-2">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  type="text"
                  placeholder={language === 'ko' ? '차수 검색...' : 'Search course time...'}
                  value={timeSearch}
                  onChange={(e) => setTimeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-bg-default border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-btn-neutral"
                />
              </div>

              {/* 차수 목록 */}
              <div
                ref={timeListRef}
                onScroll={handleTimeListScroll}
                className="border border-border rounded-lg max-h-[200px] overflow-auto"
              >
                {filteredTimeOptions.length === 0 && !isFetchingNextTimesPage ? (
                  <div className="p-4 text-center text-sm text-text-secondary">
                    {language === 'ko' ? '차수를 찾을 수 없습니다.' : 'No course times found.'}
                  </div>
                ) : (
                  <>
                    {filteredTimeOptions.map((time) => (
                      <label
                        key={time.value}
                        className={cn(
                          'flex items-center gap-3 p-3 cursor-pointer border-b border-border last:border-0 transition-colors',
                          createForm.timeId === time.value
                            ? 'bg-badge-indigo-bg'
                            : 'hover:bg-bg-secondary'
                        )}
                      >
                        <input
                          type="radio"
                          name="courseTime"
                          value={time.value}
                          checked={createForm.timeId === time.value}
                          onChange={(e) => setCreateForm((prev) => ({ ...prev, timeId: e.target.value }))}
                          className="w-4 h-4"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {time.label}
                          </p>
                          <p className="text-xs text-text-secondary truncate">
                            {time.status}
                          </p>
                        </div>
                      </label>
                    ))}
                    {/* 로딩 인디케이터 */}
                    {isFetchingNextTimesPage && (
                      <div className="flex items-center justify-center p-3 border-t border-border">
                        <Loader2 size={16} className="animate-spin text-text-secondary" />
                        <span className="ml-2 text-xs text-text-secondary">{getText('loading')}</span>
                      </div>
                    )}
                    {/* 더 불러올 데이터 있음 표시 */}
                    {hasNextTimesPage && !isFetchingNextTimesPage && (
                      <div className="p-2 text-center text-xs text-text-placeholder border-t border-border">
                        ↓ {language === 'ko' ? '스크롤하여 더 보기' : 'Scroll for more'}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 강사 선택 */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {getText('selectInstructor')} <span className="text-red-500">*</span>
              </label>

              {/* 검색 입력 */}
              <div className="relative mb-2">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
                />
                <input
                  type="text"
                  placeholder={getText('searchInstructor')}
                  value={instructorSearch}
                  onChange={(e) => setInstructorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-bg-default border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-btn-neutral"
                />
              </div>

              {/* 선택된 차수에 배정된 강사 표시 */}
              {selectedTimeData?.instructors && selectedTimeData.instructors.filter((i) => i.status === 'ACTIVE').length > 0 && (
                <div className="mb-2 p-2 bg-badge-blue-bg rounded-lg">
                  <p className="text-xs font-medium text-badge-blue mb-1">{getText('existingInstructors')}</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTimeData.instructors
                      .filter((i) => i.status === 'ACTIVE')
                      .map((instructor) => (
                        <span
                          key={instructor.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-bg-default text-text-primary"
                        >
                          {instructor.userName} ({getRoleLabel(instructor.role)})
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* 강사 목록 */}
              <div
                ref={instructorListRef}
                onScroll={handleInstructorListScroll}
                className="border border-border rounded-lg max-h-[200px] overflow-auto"
              >
                {filteredUserOptions.length === 0 && !isFetchingNextUsersPage ? (
                  <div className="p-4 text-center text-sm text-text-secondary">
                    {getText('noInstructorsFound')}
                  </div>
                ) : (
                  <>
                    {filteredUserOptions.map((user) => (
                      <label
                        key={user.value}
                        className={cn(
                          'flex items-center gap-3 p-3 cursor-pointer border-b border-border last:border-0 transition-colors',
                          createForm.userId === user.value
                            ? 'bg-badge-indigo-bg'
                            : 'hover:bg-bg-secondary',
                          user.isAssigned && 'opacity-50'
                        )}
                      >
                        <input
                          type="radio"
                          name="instructor"
                          value={user.value}
                          checked={createForm.userId === user.value}
                          onChange={(e) => setCreateForm((prev) => ({ ...prev, userId: e.target.value }))}
                          disabled={user.isAssigned}
                          className="w-4 h-4"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {user.label}
                            {user.isAssigned && (
                              <span className="ml-2 text-xs text-text-secondary">
                                ({getText('alreadyAssigned')})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-text-secondary truncate">{user.email}</p>
                        </div>
                      </label>
                    ))}
                    {/* 로딩 인디케이터 */}
                    {isFetchingNextUsersPage && (
                      <div className="flex items-center justify-center p-3 border-t border-border">
                        <Loader2 size={16} className="animate-spin text-text-secondary" />
                        <span className="ml-2 text-xs text-text-secondary">{getText('loading')}</span>
                      </div>
                    )}
                    {/* 더 불러올 데이터 있음 표시 */}
                    {hasNextUsersPage && !isFetchingNextUsersPage && (
                      <div className="p-2 text-center text-xs text-text-placeholder border-t border-border">
                        ↓ {language === 'ko' ? '스크롤하여 더 보기' : 'Scroll for more'}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 역할 선택 */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {getText('selectRole')}
              </label>
              <NativeSelect
                value={createForm.role}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, role: e.target.value as InstructorRole }))}
                options={[
                  { value: 'MAIN', label: getRoleLabel('MAIN') },
                  { value: 'SUB', label: getRoleLabel('SUB') },
                  { value: 'ASSISTANT', label: getRoleLabel('ASSISTANT') },
                ]}
              />
            </div>

            {/* 일정 충돌 무시 */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="forceAssign"
                checked={createForm.forceAssign}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, forceAssign: e.target.checked }))}
                className="mt-1 h-4 w-4 rounded border-border text-btn-primary focus:ring-btn-primary"
              />
              <div>
                <label htmlFor="forceAssign" className="text-sm font-medium text-text-primary cursor-pointer">
                  {getText('forceAssign')}
                </label>
                <p className="text-xs text-text-secondary mt-0.5">
                  {getText('forceAssignDescription')}
                </p>
              </div>
            </div>

            {/* 에러 메시지 */}
            {createError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle size={16} />
                {createError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="ghost" onClick={handleCloseCreateModal}>
              {getText('cancel')}
            </Button>
            <Button
              onClick={handleCreateAssignment}
              disabled={assignInstructor.isPending}
            >
              {assignInstructor.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {getText('creating')}
                </>
              ) : (
                getText('create')
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
