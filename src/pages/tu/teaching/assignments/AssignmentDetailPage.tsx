/**
 * 배정 상세 페이지 (TU - 강사용)
 * 배정된 차수의 수강생 목록과 통계를 조회합니다.
 */
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  BarChart3,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  TrendingUp,
  Mail,
  BookOpen,
} from 'lucide-react';
import { Button, Badge } from '@/components/common';
import type { BadgeColor } from '@/components/common/Badge/Badge.types';
import { useCourseTimeEnrollments, useMyAssignments } from '@/hooks/tu';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import type { StudentEnrollmentStatus, CourseTimeEnrollmentItem } from '@/types/tu';
import { STUDENT_ENROLLMENT_STATUS_LABELS } from '@/types/tu';
import { InstructorRoleBadge } from '@/components/domain/tu/assignment';

// 수강생 상태별 Badge 컬러
const statusBadgeColor: Record<StudentEnrollmentStatus, BadgeColor> = {
  PENDING: 'yellow',
  ENROLLED: 'blue',
  IN_PROGRESS: 'indigo',
  COMPLETED: 'green',
  DROPPED: 'gray',
};

// 수강생 상태별 아이콘
const statusIcon: Record<StudentEnrollmentStatus, React.ElementType> = {
  PENDING: Clock,
  ENROLLED: PauseCircle,
  IN_PROGRESS: PlayCircle,
  COMPLETED: CheckCircle,
  DROPPED: XCircle,
};

// 번역 텍스트
const t = {
  backToList: { ko: '목록으로', en: 'Back to List' },
  assignmentDetail: { ko: '배정 상세', en: 'Assignment Detail' },
  courseInfo: { ko: '차수 정보', en: 'Course Information' },
  programName: { ko: '과정', en: 'Program' },
  timeName: { ko: '차수명', en: 'Session Name' },
  period: { ko: '교육 기간', en: 'Period' },
  stats: { ko: '수강 현황', en: 'Enrollment Statistics' },
  totalStudents: { ko: '총 수강생', en: 'Total Students' },
  enrolled: { ko: '수강 대기', en: 'Enrolled' },
  inProgress: { ko: '수강 중', en: 'In Progress' },
  completed: { ko: '수료', en: 'Completed' },
  dropped: { ko: '중도 포기', en: 'Dropped' },
  avgProgress: { ko: '평균 진도율', en: 'Average Progress' },
  completionRate: { ko: '수료율', en: 'Completion Rate' },
  studentList: { ko: '수강생 목록', en: 'Student List' },
  studentName: { ko: '이름', en: 'Name' },
  email: { ko: '이메일', en: 'Email' },
  status: { ko: '상태', en: 'Status' },
  progress: { ko: '진도율', en: 'Progress' },
  enrolledAt: { ko: '수강 신청일', en: 'Enrolled At' },
  completedAt: { ko: '수료일', en: 'Completed At' },
  lastAccessedAt: { ko: '마지막 접속', en: 'Last Accessed' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  notFound: { ko: '배정 정보를 찾을 수 없습니다.', en: 'Assignment not found.' },
  noStudents: { ko: '수강생이 없습니다.', en: 'No students enrolled.' },
  people: { ko: '명', en: '' },
};

// 날짜 포맷팅
function formatDate(dateString: string | null | undefined, includeTime = false): string {
  if (!dateString) return '-';
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(includeTime && { hour: '2-digit', minute: '2-digit' }),
  };
  return new Date(dateString).toLocaleDateString('ko-KR', options);
}

interface AssignmentDetailPageProps {
  language?: 'ko' | 'en';
}

export function AssignmentDetailPage({ language = 'ko' }: Readonly<AssignmentDetailPageProps>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const assignmentId = id ? parseInt(id, 10) : 0;

  const getText = (key: keyof typeof t) => t[key][language];

  // 배정 목록에서 현재 배정 찾기
  const { data: assignments } = useMyAssignments();
  const currentAssignment = assignments?.find((a) => a.id === assignmentId);
  const timeId = currentAssignment?.timeId ?? 0;

  // 차수 수강생 목록 조회
  const { data: enrollmentData, isLoading, error } = useCourseTimeEnrollments(timeId);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <Loader2 size={32} className="animate-spin text-text-secondary" />
        <span className="ml-2 text-text-secondary">{getText('loading')}</span>
      </div>
    );
  }

  // 에러 상태
  if (error || !enrollmentData) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-3 text-status-error" />
          <p className="text-text-secondary">{error ? getText('error') : getText('notFound')}</p>
          <Button
            variant="ghost"
            className="mt-4 border border-border"
            onClick={() => navigate(prefixPath('/tu/teaching/assignments'))}
          >
            <ArrowLeft size={16} />
            {getText('backToList')}
          </Button>
        </div>
      </div>
    );
  }

  const { stats, enrollments } = enrollmentData;

  return (
    <div className="h-full flex flex-col bg-bg-app">
      {/* Header */}
      <div className="border-b border-border bg-bg-default sticky top-0 z-10">
        <div className="p-6 px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="border border-border"
                onClick={() => navigate(prefixPath('/tu/teaching/assignments'))}
              >
                <ArrowLeft size={16} />
                {getText('backToList')}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              {currentAssignment && (
                <InstructorRoleBadge role={currentAssignment.role} language={language} />
              )}
              <Button
                onClick={() => navigate(prefixPath(`/tu/b2b/times/${timeId}`))}
              >
                <BookOpen size={16} />
                강의실 입장
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-text-primary text-xl mb-1">{enrollmentData.timeName}</h1>
            <p className="text-text-secondary text-sm">{enrollmentData.programName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8">
          {/* Course Info Section */}
          <div className="bg-bg-default border border-border rounded-lg p-6 mb-6">
            <h2 className="text-text-primary text-lg font-medium flex items-center gap-2 mb-4">
              <Calendar size={20} />
              {getText('courseInfo')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">{getText('programName')}</label>
                <p className="text-text-primary font-medium">{enrollmentData.programName}</p>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">{getText('timeName')}</label>
                <p className="text-text-primary">{enrollmentData.timeName}</p>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">{getText('period')}</label>
                <p className="text-text-primary flex items-center gap-2">
                  <Clock size={14} className="text-text-secondary" />
                  {formatDate(enrollmentData.startDate)} ~ {formatDate(enrollmentData.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-bg-default border border-border rounded-lg p-6 mb-6">
            <h2 className="text-text-primary text-lg font-medium flex items-center gap-2 mb-4">
              <BarChart3 size={20} />
              {getText('stats')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <StatCard
                label={getText('totalStudents')}
                value={stats.totalCount}
                suffix={getText('people')}
                icon={Users}
                color="text-text-primary"
              />
              <StatCard
                label={getText('enrolled')}
                value={stats.enrolledCount}
                suffix={getText('people')}
                icon={PauseCircle}
                color="text-action-primary"
              />
              <StatCard
                label={getText('inProgress')}
                value={stats.inProgressCount}
                suffix={getText('people')}
                icon={PlayCircle}
                color="text-action-secondary"
              />
              <StatCard
                label={getText('completed')}
                value={stats.completedCount}
                suffix={getText('people')}
                icon={CheckCircle}
                color="text-status-success"
              />
              <StatCard
                label={getText('dropped')}
                value={stats.droppedCount}
                suffix={getText('people')}
                icon={XCircle}
                color="text-text-placeholder"
              />
              <StatCard
                label={getText('avgProgress')}
                value={stats.averageProgress}
                suffix="%"
                icon={TrendingUp}
                color="text-action-primary"
              />
              <StatCard
                label={getText('completionRate')}
                value={stats.completionRate}
                suffix="%"
                icon={CheckCircle}
                color="text-status-success"
              />
            </div>
          </div>

          {/* Student List Section */}
          <div className="bg-bg-default border border-border rounded-lg p-6">
            <h2 className="text-text-primary text-lg font-medium flex items-center gap-2 mb-4">
              <Users size={20} />
              {getText('studentList')}
              <span className="text-text-secondary text-sm font-normal">
                ({enrollments.length}{getText('people')})
              </span>
            </h2>

            {enrollments.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto mb-3 text-text-placeholder" />
                <p className="text-text-secondary">{getText('noStudents')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                        {getText('studentName')}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                        {getText('email')}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                        {getText('progress')}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">
                        {getText('status')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((student) => (
                      <StudentRow
                        key={student.enrollmentId}
                        student={student}
                        language={language}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 통계 카드 컴포넌트
interface StatCardProps {
  label: string;
  value: number;
  suffix: string;
  icon: React.ElementType;
  color: string;
}

function StatCard({ label, value, suffix, icon: Icon, color }: Readonly<StatCardProps>) {
  return (
    <div className="p-4 bg-bg-secondary rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={color} />
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
        <span className="text-sm font-normal text-text-secondary">{suffix}</span>
      </p>
    </div>
  );
}

// 수강생 행 컴포넌트
interface StudentRowProps {
  student: CourseTimeEnrollmentItem;
  language: 'ko' | 'en';
}

function StudentRow({ student, language }: Readonly<StudentRowProps>) {
  const StatusIcon = statusIcon[student.status];

  return (
    <tr className="border-b border-border hover:bg-bg-secondary transition-colors">
      <td className="py-3 px-4">
        <span className="text-text-primary font-medium">{student.userName}</span>
      </td>
      <td className="py-3 px-4">
        <span className="text-text-secondary text-sm flex items-center gap-1">
          <Mail size={14} />
          {student.userEmail}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-action-primary rounded-full transition-all"
              style={{ width: `${student.progress}%` }}
            />
          </div>
          <span className="text-sm text-text-secondary">{student.progress}%</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge variant={statusBadgeColor[student.status]}>
          <StatusIcon size={12} className="mr-1" />
          {STUDENT_ENROLLMENT_STATUS_LABELS[student.status][language]}
        </Badge>
      </td>
    </tr>
  );
}
