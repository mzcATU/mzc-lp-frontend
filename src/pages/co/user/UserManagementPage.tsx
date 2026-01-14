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
  UserPlus,
  X,
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
  Combobox,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common';
import { useUsers, useUser, useChangeUserStatus, useUserEnrollmentStats, useUserInstructorStats } from '@/hooks/co/useUserQueries';
import { useApprovedPrograms } from '@/hooks/co/useProgramQueries';
import { useTimes } from '@/hooks/co/useTimeQueries';
import { useEnrollmentsByCourseTime, useForceEnroll } from '@/hooks/co/useEnrollmentQueries';
import type { UserListResponse, TenantRole, UserStatus, UserFilterParams } from '@/types/co';
import type { EnrollmentResponse, EnrollmentStatus } from '@/types/co/enrollment.types';
import { USER_STATUS_LABELS, TENANT_ROLE_LABELS } from '@/types/co';
import { ENROLLMENT_STATUS_LABELS } from '@/types/co/enrollment.types';

interface UserManagementPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '수강생 관리', en: 'Student Management' },
  subtitle: { ko: '수강생 정보를 조회하고 관리합니다.', en: 'View and manage student information.' },
  searchPlaceholder: { ko: '이름, 이메일 검색...', en: 'Search name, email...' },
  filter: { ko: '필터', en: 'Filter' },
  status: { ko: '상태', en: 'Status' },
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
  // Table columns for enrollment stats
  columnInProgress: { ko: '수강 중', en: 'In Progress' },
  columnCompleted: { ko: '수료', en: 'Completed' },
  columnAvgProgress: { ko: '평균 진도', en: 'Avg Progress' },
  noData: { ko: '-', en: '-' },
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
  // New filter labels
  selectCourse: { ko: '과정 선택', en: 'Select Course' },
  searchCourse: { ko: '과정 검색...', en: 'Search course...' },
  selectTime: { ko: '차수 선택', en: 'Select Time' },
  completionStatus: { ko: '수료여부', en: 'Completion Status' },
  notCompleted: { ko: '미수료', en: 'Not Completed' },
  clearFilters: { ko: '필터 초기화', en: 'Clear Filters' },
  // Force enroll
  forceEnroll: { ko: '강제 배정', en: 'Force Enroll' },
  forceEnrollTitle: { ko: '수강생 강제 배정', en: 'Force Enroll Students' },
  forceEnrollDescription: { ko: '선택한 사용자를 해당 차수에 강제 배정합니다.', en: 'Force enroll selected users to this course time.' },
  selectedUsers: { ko: '선택된 사용자', en: 'Selected Users' },
  selectCourseForEnroll: { ko: '배정할 과정 선택', en: 'Select course to enroll' },
  selectTimeForEnroll: { ko: '배정할 차수 선택', en: 'Select time to enroll' },
  enrolling: { ko: '배정 중...', en: 'Enrolling...' },
  enrollSuccess: { ko: '배정 완료', en: 'Enrollment Complete' },
  enrollFailed: { ko: '배정 실패', en: 'Enrollment Failed' },
  // Learning view columns
  columnEnrolledAt: { ko: '수강 시작일', en: 'Enrolled At' },
  columnProgress: { ko: '진도율', en: 'Progress' },
  columnScore: { ko: '점수', en: 'Score' },
  columnEnrollmentStatus: { ko: '수강 상태', en: 'Status' },
  // Learning detail modal
  learningDetail: { ko: '학습 상세 정보', en: 'Learning Details' },
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

const enrollmentStatusBadgeVariant: Record<EnrollmentStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  ENROLLED: 'default',
  COMPLETED: 'success',
  DROPPED: 'warning',
  FAILED: 'destructive',
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

// 수강 통계 셀 컴포넌트 (개별 API 호출)
function EnrollmentStatsCell({ userId, field }: { userId: number; field: 'inProgress' | 'completed' | 'avgProgress' }) {
  const { data, isLoading } = useUserEnrollmentStats(userId);

  if (isLoading) {
    return <Loader2 size={14} className="animate-spin text-text-placeholder" />;
  }

  if (!data) {
    return <span className="text-text-placeholder">-</span>;
  }

  switch (field) {
    case 'inProgress':
      return <span className="text-sm font-medium text-badge-blue">{data.inProgressCount}</span>;
    case 'completed':
      return <span className="text-sm font-medium text-badge-green">{data.completedCount}</span>;
    case 'avgProgress':
      return <span className="text-sm font-medium text-text-primary">{data.averageProgress.toFixed(0)}%</span>;
    default:
      return <span className="text-text-placeholder">-</span>;
  }
}

// 수료여부 필터 타입
type CompletionFilter = 'all' | 'COMPLETED' | 'ENROLLED' | 'NOT_COMPLETED';

export function UserManagementPage({ language = 'ko' }: Readonly<UserManagementPageProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<UserListResponse | null>(null);

  // 새로운 필터 상태
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');

  // 행 선택 상태 (사용자 ID 기반)
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

  // 강제 배정 모달 상태
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollProgramId, setEnrollProgramId] = useState<number | null>(null);
  const [enrollTimeId, setEnrollTimeId] = useState<number | null>(null);

  // 학습 상세 모달용 선택된 enrollment
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentResponse | null>(null);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<UserStatus | null>(null);
  const [statusReason, setStatusReason] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const PAGE_SIZE = 10;

  // 뷰 모드 결정: 차수가 선택되면 학습 관리 뷰
  const isLearningView = selectedTimeId !== null;

  // API 파라미터 구성 - 전체 데이터를 가져와서 클라이언트에서 필터링
  const params: UserFilterParams = {
    page: 0,
    size: 1000, // 충분히 큰 값으로 전체 조회
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(searchQuery && { keyword: searchQuery }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = useUsers(params);
  const changeStatus = useChangeUserStatus();

  // 과정 목록 조회 (승인된 과정만)
  const { data: programsData } = useApprovedPrograms();

  // 전체 차수 목록 조회 (필터용 - 클라이언트에서 프로그램별 필터링)
  const { data: timesData } = useTimes({ page: 0, size: 500 });

  // 강제 배정 모달용 - 동일한 timesData 사용하고 클라이언트에서 필터링

  // 선택된 차수의 수강생 목록 조회
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useEnrollmentsByCourseTime(
    selectedTimeId ?? 0,
    { page: 0, size: 1000 }
  );

  // 강제 배정 mutation
  const forceEnroll = useForceEnroll();

  // 사용자 상세 정보 및 수강/강사 통계 조회
  const selectedUserId = selectedUserForDetail?.id ?? 0;
  const isDesigner = selectedUserForDetail?.systemRole === 'DESIGNER';
  const { data: userDetail, isLoading: isDetailLoading } = useUser(selectedUserId);
  const { data: enrollmentStats, isLoading: isStatsLoading } = useUserEnrollmentStats(selectedUserId);
  const { data: instructorStats, isLoading: isInstructorStatsLoading } = useUserInstructorStats(selectedUserId, isDesigner);

  // 수강 가능한 역할만 표시 (USER, INSTRUCTOR)
  const filteredUsers = useMemo(() => {
    const allUsers = data?.content ?? [];
    return allUsers.filter(
      (user) => user.systemRole === 'USER' || user.systemRole === 'INSTRUCTOR'
    );
  }, [data?.content]);

  // 학습 뷰에서의 필터링된 수강 데이터
  const filteredEnrollments = useMemo(() => {
    if (!isLearningView || !enrollmentsData?.content) return [];

    let result = enrollmentsData.content;

    // 수료여부 필터
    if (completionFilter !== 'all') {
      if (completionFilter === 'NOT_COMPLETED') {
        result = result.filter((e) => e.status !== 'COMPLETED');
      } else {
        result = result.filter((e) => e.status === completionFilter);
      }
    }

    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.userName?.toLowerCase().includes(query) ||
          e.userEmail?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [enrollmentsData?.content, completionFilter, searchQuery, isLearningView]);

  // 전체 필터링된 사용자 수
  const totalElements = isLearningView ? filteredEnrollments.length : filteredUsers.length;

  // 통계 계산 (전체 필터링된 데이터 기준)
  const userStats = useMemo(() => ({
    total: isLearningView ? (enrollmentsData?.content?.length ?? 0) : filteredUsers.length,
    active: isLearningView
      ? (enrollmentsData?.content?.filter((e) => e.status === 'ENROLLED').length ?? 0)
      : filteredUsers.filter((u) => u.status === 'ACTIVE').length,
    inactive: isLearningView
      ? (enrollmentsData?.content?.filter((e) => e.status === 'COMPLETED').length ?? 0)
      : filteredUsers.filter((u) => u.status === 'INACTIVE').length,
    suspended: isLearningView
      ? (enrollmentsData?.content?.filter((e) => e.status === 'DROPPED' || e.status === 'FAILED').length ?? 0)
      : filteredUsers.filter((u) => u.status === 'SUSPENDED').length,
  }), [filteredUsers, enrollmentsData?.content, isLearningView]);

  // 과정 옵션
  const programOptions = useMemo(() => {
    return (programsData?.content ?? []).map((p) => ({
      value: String(p.id),
      label: p.title,
    }));
  }, [programsData]);

  // 선택된 프로그램의 title 조회
  const selectedProgramTitle = useMemo(() => {
    if (!selectedProgramId) return null;
    const program = programsData?.content?.find((p) => p.id === selectedProgramId);
    return program?.title ?? null;
  }, [selectedProgramId, programsData]);

  // 차수 옵션 - 선택된 프로그램 title로 클라이언트 필터링
  const timeOptions = useMemo(() => {
    const allTimes = timesData?.content ?? [];
    // 선택된 프로그램이 있으면 해당 프로그램의 차수만 필터링
    const filteredTimes = selectedProgramTitle
      ? allTimes.filter((t) => t.courseTitle === selectedProgramTitle)
      : allTimes;
    return filteredTimes.map((t) => ({
      value: String(t.id),
      label: t.title,
    }));
  }, [timesData, selectedProgramTitle]);

  // 강제 배정 모달용 프로그램 title 조회
  const enrollProgramTitle = useMemo(() => {
    if (!enrollProgramId) return null;
    const program = programsData?.content?.find((p) => p.id === enrollProgramId);
    return program?.title ?? null;
  }, [enrollProgramId, programsData]);

  // 강제 배정 모달용 차수 옵션 - 클라이언트 필터링
  const enrollTimeOptions = useMemo(() => {
    const allTimes = timesData?.content ?? [];
    const filteredTimes = enrollProgramTitle
      ? allTimes.filter((t) => t.courseTitle === enrollProgramTitle)
      : [];
    return filteredTimes.map((t) => ({
      value: String(t.id),
      label: t.title,
    }));
  }, [timesData, enrollProgramTitle]);

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

  // 과정 선택 핸들러
  const handleProgramChange = (value: string) => {
    const programId = value ? Number(value) : null;
    setSelectedProgramId(programId);
    setSelectedTimeId(null); // 차수 초기화
    setCompletionFilter('all'); // 수료여부 필터 초기화
    setSelectedUserIds(new Set()); // 행 선택 초기화
  };

  // 차수 선택 핸들러
  const handleTimeChange = (value: string) => {
    const timeId = value ? Number(value) : null;
    setSelectedTimeId(timeId);
    setCompletionFilter('all'); // 수료여부 필터 초기화
    setSelectedUserIds(new Set()); // 행 선택 초기화
  };

  // 필터 초기화
  const handleClearFilters = () => {
    setSelectedProgramId(null);
    setSelectedTimeId(null);
    setCompletionFilter('all');
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedUserIds(new Set());
  };

  // 강제 배정 모달 열기
  const handleOpenEnrollModal = () => {
    setEnrollProgramId(null);
    setEnrollTimeId(null);
    setShowEnrollModal(true);
  };

  // 강제 배정 실행
  const handleForceEnroll = async () => {
    if (!enrollTimeId) return;

    const userIdsArray = Array.from(selectedUserIds);
    if (userIdsArray.length === 0) return;

    try {
      await forceEnroll.mutateAsync({
        courseTimeId: enrollTimeId,
        request: {
          userIds: userIdsArray,
          reason: '운영자 강제 배정',
        },
      });
      setShowEnrollModal(false);
      setSelectedUserIds(new Set());
    } catch (err) {
      console.error('Force enroll failed:', err);
    }
  };

  // 사용자 선택 토글
  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // 전체 선택/해제
  const toggleAllSelection = (users: UserListResponse[]) => {
    const allUserIds = users.map((u) => u.id);
    const allSelected = allUserIds.every((id) => selectedUserIds.has(id));

    if (allSelected) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(allUserIds));
    }
  };

  // 선택된 사용자 수
  const selectedCount = selectedUserIds.size;

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

  // 현재 페이지의 사용자들이 모두 선택되었는지 확인
  const allCurrentPageSelected = useMemo(() => {
    if (filteredUsers.length === 0) return false;
    return filteredUsers.every((u) => selectedUserIds.has(u.id));
  }, [filteredUsers, selectedUserIds]);

  // Case 1: 회원풀 뷰 컬럼 (과정/차수 미선택 시)
  const poolViewColumns: ColumnDef<UserListResponse>[] = useMemo(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={allCurrentPageSelected}
            onCheckedChange={() => toggleAllSelection(filteredUsers)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selectedUserIds.has(row.original.id)}
            onCheckedChange={() => toggleUserSelection(row.original.id)}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
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
        id: 'inProgress',
        header: () => <span className="text-xs font-medium">{getText('columnInProgress')}</span>,
        cell: ({ row }) => <EnrollmentStatsCell userId={row.original.id} field="inProgress" />,
        size: 80,
      },
      {
        id: 'completed',
        header: () => <span className="text-xs font-medium">{getText('columnCompleted')}</span>,
        cell: ({ row }) => <EnrollmentStatsCell userId={row.original.id} field="completed" />,
        size: 80,
      },
      {
        id: 'avgProgress',
        header: () => <span className="text-xs font-medium">{getText('columnAvgProgress')}</span>,
        cell: ({ row }) => <EnrollmentStatsCell userId={row.original.id} field="avgProgress" />,
        size: 90,
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
    [language, changeStatus.isPending, allCurrentPageSelected, filteredUsers, selectedUserIds, toggleAllSelection, toggleUserSelection]
  );

  // Case 2: 학습 관리 뷰 컬럼 (차수 선택 시)
  const learningViewColumns: ColumnDef<EnrollmentResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'userName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnName')} />
        ),
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {row.original.userName ?? '-'}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              {row.original.userEmail ?? '-'}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnEnrollmentStatus')} />
        ),
        cell: ({ row }) => (
          <Badge variant={enrollmentStatusBadgeVariant[row.original.status]}>
            {ENROLLMENT_STATUS_LABELS[row.original.status]}
          </Badge>
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
        accessorKey: 'progressPercent',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnProgress')} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-badge-blue rounded-full transition-all"
                style={{ width: `${row.original.progressPercent}%` }}
              />
            </div>
            <span className="text-sm font-medium text-text-primary">
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
          <span className="text-sm text-text-primary">
            {row.original.score ?? '-'}
          </span>
        ),
      },
      {
        accessorKey: 'completedAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnCompleted')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {row.original.completedAt ? formatDate(row.original.completedAt) : '-'}
          </span>
        ),
      },
    ],
    [language]
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

            {/* 강제 배정 버튼 (회원풀 뷰에서만 표시, 항상 보이고 선택 시 활성화) */}
            {!isLearningView && (
              <Button
                onClick={handleOpenEnrollModal}
                disabled={selectedCount === 0}
              >
                <UserPlus size={16} />
                {getText('forceEnroll')} {selectedCount > 0 && `(${selectedCount})`}
              </Button>
            )}
          </div>

          {/* 필터 영역 */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* 과정 선택 (Autocomplete) */}
            <div className="w-64">
              <Combobox
                options={programOptions}
                value={selectedProgramId ? String(selectedProgramId) : undefined}
                onValueChange={handleProgramChange}
                placeholder={getText('selectCourse')}
                searchPlaceholder={getText('searchCourse')}
                emptyMessage={getText('noResults')}
              />
            </div>

            {/* 차수 선택 (Dropdown) - 과정 선택 시 활성화 */}
            <div className="w-48">
              <Select
                value={selectedTimeId ? String(selectedTimeId) : ''}
                onValueChange={handleTimeChange}
                disabled={!selectedProgramId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={getText('selectTime')} />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 수료여부 필터 - 차수 선택 시 활성화 */}
            <div className="w-40">
              <Select
                value={completionFilter}
                onValueChange={(value) => setCompletionFilter(value as CompletionFilter)}
                disabled={!selectedTimeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={getText('completionStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{getText('all')}</SelectItem>
                  <SelectItem value="COMPLETED">{getText('completed')}</SelectItem>
                  <SelectItem value="ENROLLED">{getText('inProgress')}</SelectItem>
                  <SelectItem value="NOT_COMPLETED">{getText('notCompleted')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 필터 초기화 */}
            {(selectedProgramId || selectedTimeId || completionFilter !== 'all') && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                <X size={14} />
                {getText('clearFilters')}
              </Button>
            )}
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
            {!isLearningView && (
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
            )}
          </div>

          {/* Filter Options (회원풀 뷰에서만) */}
          {!isLearningView && showFilters && (
            <div className="mt-4 p-4 border border-border rounded-lg bg-bg-secondary">
              {/* Status Filter */}
              <div>
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
            </div>
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 pt-0">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {isLearningView ? (
              <>
                <StatCard
                  icon={<Users size={20} />}
                  label={getText('totalUsers')}
                  value={userStats.total}
                  iconColor="blue"
                />
                <StatCard
                  icon={<BookOpen size={20} />}
                  label={getText('inProgress')}
                  value={userStats.active}
                  iconColor="green"
                />
                <StatCard
                  icon={<CheckCircle size={20} />}
                  label={getText('completed')}
                  value={userStats.inactive}
                  iconColor="gray"
                />
                <StatCard
                  icon={<UserX size={20} />}
                  label={language === 'ko' ? '탈락/미이수' : 'Dropped/Failed'}
                  value={userStats.suspended}
                  iconColor="red"
                />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              {totalElements}
              {getText('userCount')}
            </p>
          </div>

          {/* Loading State */}
          {(isLoading || isEnrollmentsLoading) && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-text-secondary" />
              <span className="ml-2 text-text-secondary">{getText('loading')}</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isEnrollmentsLoading && totalElements === 0 && !searchQuery && statusFilter === 'all' && completionFilter === 'all' && (
            <div className="text-center py-12 text-text-secondary">
              <Users size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p className="mb-1">{getText('noUsers')}</p>
              <p className="text-sm">{getText('noUsersDescription')}</p>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && !isEnrollmentsLoading && totalElements === 0 && (searchQuery || statusFilter !== 'all' || completionFilter !== 'all') && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Data Table - 회원풀 뷰 */}
          {!isLoading && !isLearningView && filteredUsers.length > 0 && (
            <DataTable
              columns={poolViewColumns}
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

          {/* Data Table - 학습 관리 뷰 */}
          {!isEnrollmentsLoading && isLearningView && filteredEnrollments.length > 0 && (
            <DataTable
              columns={learningViewColumns}
              data={filteredEnrollments}
              showColumnToggle={false}
              showPagination={true}
              pageSize={PAGE_SIZE}
              onRowClick={(enrollment) => setSelectedEnrollment(enrollment)}
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

      {/* User Detail Modal (회원풀 뷰) */}
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

      {/* Learning Detail Modal (학습 관리 뷰) */}
      <Dialog open={!!selectedEnrollment} onOpenChange={(open: boolean) => !open && setSelectedEnrollment(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-border">
            <DialogTitle className="text-lg font-bold text-text-primary tracking-tight">
              {getText('learningDetail')}
            </DialogTitle>
          </DialogHeader>

          {selectedEnrollment && (
            <div className="px-6 py-6 space-y-6">
              {/* 사용자 정보 */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-badge-blue-bg text-badge-blue">
                    <User size={14} />
                  </span>
                  {getText('basicInfo')}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                      {getText('name')}
                    </dt>
                    <dd className="text-sm font-medium text-text-primary">
                      {selectedEnrollment.userName ?? '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                      {getText('email')}
                    </dt>
                    <dd className="text-sm font-medium text-text-primary">
                      {selectedEnrollment.userEmail ?? '-'}
                    </dd>
                  </div>
                </div>
              </section>

              {/* 수강 정보 */}
              <section className="border-t border-border pt-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-badge-green-bg text-badge-green">
                    <GraduationCap size={14} />
                  </span>
                  {getText('enrollmentStats')}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                      {getText('columnEnrollmentStatus')}
                    </dt>
                    <dd>
                      <Badge variant={enrollmentStatusBadgeVariant[selectedEnrollment.status]}>
                        {ENROLLMENT_STATUS_LABELS[selectedEnrollment.status]}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                      {getText('columnEnrolledAt')}
                    </dt>
                    <dd className="text-sm font-medium text-text-primary">
                      {formatDate(selectedEnrollment.enrolledAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                      {getText('columnProgress')}
                    </dt>
                    <dd className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-badge-blue rounded-full"
                          style={{ width: `${selectedEnrollment.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-text-primary">
                        {selectedEnrollment.progressPercent}%
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                      {getText('columnScore')}
                    </dt>
                    <dd className="text-sm font-medium text-text-primary">
                      {selectedEnrollment.score ?? '-'}
                    </dd>
                  </div>
                  {selectedEnrollment.completedAt && (
                    <div className="col-span-2">
                      <dt className="text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wide">
                        {getText('columnCompleted')}
                      </dt>
                      <dd className="text-sm font-medium text-text-primary">
                        {formatDate(selectedEnrollment.completedAt)}
                      </dd>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Force Enroll Modal */}
      <Dialog open={showEnrollModal} onOpenChange={setShowEnrollModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="px-6 py-5 border-b border-border">
            <DialogTitle className="text-lg font-bold text-text-primary tracking-tight">
              {getText('forceEnrollTitle')}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-6 space-y-4">
            <p className="text-sm text-text-secondary">
              {getText('forceEnrollDescription')}
            </p>

            {/* 선택된 사용자 수 */}
            <div className="p-3 bg-bg-secondary rounded-lg">
              <p className="text-sm text-text-primary">
                {getText('selectedUsers')}: <strong>{selectedCount}</strong>
              </p>
            </div>

            {/* 과정 선택 */}
            <div>
              <Label className="text-text-secondary mb-2">{getText('selectCourseForEnroll')}</Label>
              <Combobox
                options={programOptions}
                value={enrollProgramId ? String(enrollProgramId) : undefined}
                onValueChange={(value: string) => {
                  setEnrollProgramId(value ? Number(value) : null);
                  setEnrollTimeId(null);
                }}
                placeholder={getText('selectCourse')}
                searchPlaceholder={getText('searchCourse')}
                emptyMessage={getText('noResults')}
              />
            </div>

            {/* 차수 선택 */}
            <div>
              <Label className="text-text-secondary mb-2">{getText('selectTimeForEnroll')}</Label>
              <Select
                value={enrollTimeId ? String(enrollTimeId) : ''}
                onValueChange={(value) => setEnrollTimeId(value ? Number(value) : null)}
                disabled={!enrollProgramId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={getText('selectTime')} />
                </SelectTrigger>
                <SelectContent>
                  {enrollTimeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setShowEnrollModal(false)}>
                {getText('cancel')}
              </Button>
              <Button
                onClick={handleForceEnroll}
                disabled={!enrollTimeId || forceEnroll.isPending}
              >
                {forceEnroll.isPending ? getText('enrolling') : getText('forceEnroll')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
