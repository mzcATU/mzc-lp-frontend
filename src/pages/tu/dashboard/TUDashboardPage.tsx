import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  FileEdit,
  Plus,
  FolderPlus,
  Loader2,
  Clock,
  Package,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Button, IconStatCard, Card } from '@/components/common';
import { useMyCourses, useMyPrograms, useMyAssignments } from '@/hooks/tu';

interface TUDashboardPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '대시보드', en: 'Dashboard' },
  subtitle: { ko: '강의 관리와 운영 현황을 확인하세요', en: 'Manage and monitor your courses' },

  // 통계
  statDraft: { ko: '작성중 강의', en: 'Draft Courses' },
  statPending: { ko: '검토중', en: 'Pending Review' },
  statApproved: { ko: '승인됨', en: 'Approved' },
  statActive: { ko: '운영중 강의', en: 'Active Courses' },

  // 작성중인 강의
  draftSectionTitle: { ko: '작성중인 강의', en: 'Draft Courses' },
  draftSectionSubtitle: { ko: '완료되지 않은 강의를 이어서 작성하세요', en: 'Continue working on incomplete courses' },
  lastEdited: { ko: '마지막 수정', en: 'Last edited' },
  continueButton: { ko: '이어서 작성', en: 'Continue' },
  emptyDraft: { ko: '작성중인 강의가 없습니다', en: 'No draft courses' },
  viewAll: { ko: '전체 보기', en: 'View All' },

  // 개설 신청 현황
  programSectionTitle: { ko: '개설 신청 현황', en: 'Submission Status' },
  programSectionSubtitle: { ko: '프로그램 신청 및 승인 상태', en: 'Program submission and approval status' },
  emptyProgram: { ko: '신청한 프로그램이 없습니다', en: 'No program submissions' },
  statusPending: { ko: '검토중', en: 'Pending' },
  statusApproved: { ko: '승인됨', en: 'Approved' },
  statusRejected: { ko: '반려됨', en: 'Rejected' },

  // 운영중인 강의
  activeSectionTitle: { ko: '운영중인 강의', en: 'Active Courses' },
  activeSectionSubtitle: { ko: '현재 진행중인 강의와 수강생 현황', en: 'Current courses and student statistics' },
  students: { ko: '수강생', en: 'Students' },
  completion: { ko: '완료율', en: 'Completion' },
  emptyActive: { ko: '운영중인 강의가 없습니다', en: 'No active courses' },

  // 빠른 시작
  quickActionTitle: { ko: '빠른 시작', en: 'Quick Actions' },
  createCourse: { ko: '새 강의 만들기', en: 'Create New Course' },
  createContent: { ko: '콘텐츠 등록', en: 'Upload Content' },

  // 로딩
  loading: { ko: '데이터를 불러오는 중...', en: 'Loading data...' },
};

const STATUS_LABELS: Record<string, { ko: string; en: string }> = {
  PENDING: { ko: '검토중', en: 'Pending' },
  APPROVED: { ko: '승인됨', en: 'Approved' },
  REJECTED: { ko: '반려됨', en: 'Rejected' },
  DRAFT: { ko: '임시저장', en: 'Draft' },
  CLOSED: { ko: '종료', en: 'Closed' },
};

export function TUDashboardPage({ language = 'ko' }: Readonly<TUDashboardPageProps>) {
  const navigate = useNavigate();

  // API 훅
  const { data: coursesData, isLoading: isLoadingCourses } = useMyCourses();
  const { data: programsData, isLoading: isLoadingPrograms } = useMyPrograms();
  const { data: assignmentsData, isLoading: isLoadingAssignments } = useMyAssignments();

  const getText = (key: keyof typeof t) => t[key][language];

  const isLoading = isLoadingCourses || isLoadingPrograms || isLoadingAssignments;

  if (isLoading) {
    return (
      <div className="p-8 bg-bg-app_default min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">{getText('loading')}</p>
        </div>
      </div>
    );
  }

  // 데이터 가공
  const courses = coursesData?.content || [];
  const programs = programsData?.content || [];
  const assignments = assignmentsData?.content || [];

  // 통계 계산
  const draftCourses = courses.filter((c) => !c.isComplete);
  const pendingPrograms = programs.filter((p) => p.status === 'PENDING');
  const approvedPrograms = programs.filter((p) => p.status === 'APPROVED');
  const totalStudents = assignments.reduce((sum, a) => sum + (a.enrollmentCount || 0), 0);

  return (
    <div className="p-8 bg-bg-app_default min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-text-primary mb-2">{getText('title')}</h1>
        <p className="text-text-secondary m-0">{getText('subtitle')}</p>
      </div>

      {/* 요약 통계 (4개) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <IconStatCard
          icon={<FileEdit size={20} className="text-status-warning" />}
          label={getText('statDraft')}
          value={draftCourses.length}
        />
        <IconStatCard
          icon={<Clock size={20} className="text-status-warning" />}
          label={getText('statPending')}
          value={pendingPrograms.length}
        />
        <IconStatCard
          icon={<CheckCircle size={20} className="text-status-success" />}
          label={getText('statApproved')}
          value={approvedPrograms.length}
        />
        <IconStatCard
          icon={<Users size={20} className="text-btn-brand" />}
          label={getText('statActive')}
          value={`${assignments.length}개 / ${totalStudents}명`}
        />
      </div>

      {/* 작성중인 강의 */}
      <Card className="mb-6 p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-text-primary mb-1 flex items-center gap-2">
              <FileEdit size={18} className="text-status-warning" />
              {getText('draftSectionTitle')}
            </h3>
            <p className="text-sm text-text-secondary m-0">{getText('draftSectionSubtitle')}</p>
          </div>
          {draftCourses.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-text-secondary"
              onClick={() => navigate('/tu/teaching/courses')}
            >
              {getText('viewAll')}
              <ArrowRight size={14} />
            </Button>
          )}
        </div>

        {draftCourses.length === 0 ? (
          <div className="py-8 text-center text-text-secondary text-sm">
            {getText('emptyDraft')}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {draftCourses.slice(0, 3).map((course) => (
              <div
                key={course.courseId}
                className="p-4 bg-bg-app_default rounded-lg flex justify-between items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-text-primary font-medium truncate mb-1">
                    {course.title}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {getText('lastEdited')}: {new Date(course.updatedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate(`/tu/teaching/courses/create?courseId=${course.courseId}`)}
                >
                  {getText('continueButton')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 개설 신청 현황 */}
      <Card className="mb-6 p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-text-primary mb-1 flex items-center gap-2">
              <Package size={18} className="text-btn-brand" />
              {getText('programSectionTitle')}
            </h3>
            <p className="text-sm text-text-secondary m-0">{getText('programSectionSubtitle')}</p>
          </div>
          {programs.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-text-secondary"
              onClick={() => navigate('/tu/teaching/programs')}
            >
              {getText('viewAll')}
              <ArrowRight size={14} />
            </Button>
          )}
        </div>

        {programs.length === 0 ? (
          <div className="py-8 text-center text-text-secondary text-sm">
            {getText('emptyProgram')}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {programs.slice(0, 5).map((program) => (
              <div
                key={program.id}
                className="p-4 bg-bg-app_default rounded-lg flex justify-between items-center gap-4 cursor-pointer hover:bg-bg-secondary transition-colors"
                onClick={() => navigate(`/tu/teaching/programs/${program.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-text-primary font-medium truncate">
                    {program.title}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    program.status === 'APPROVED'
                      ? 'bg-status-success_background text-status-success_text'
                      : program.status === 'PENDING'
                      ? 'bg-status-warning_background text-status-warning_text'
                      : program.status === 'REJECTED'
                      ? 'bg-status-error_background text-status-error_text'
                      : 'bg-bg-secondary text-text-secondary'
                  }`}
                >
                  {STATUS_LABELS[program.status]?.[language] || program.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 운영중인 강의 */}
      <Card className="mb-6 p-6">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h3 className="text-text-primary mb-1 flex items-center gap-2">
              <BookOpen size={18} className="text-status-success" />
              {getText('activeSectionTitle')}
            </h3>
            <p className="text-sm text-text-secondary m-0">{getText('activeSectionSubtitle')}</p>
          </div>
          {assignments.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-text-secondary"
              onClick={() => navigate('/tu/teaching/assignments')}
            >
              {getText('viewAll')}
              <ArrowRight size={14} />
            </Button>
          )}
        </div>

        {assignments.length === 0 ? (
          <div className="py-8 text-center text-text-secondary text-sm">
            {getText('emptyActive')}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {assignments.slice(0, 5).map((assignment) => (
              <div
                key={assignment.courseTimeId}
                className="p-4 bg-bg-app_default rounded-lg flex justify-between items-center gap-4 cursor-pointer hover:bg-bg-secondary transition-colors"
                onClick={() => navigate(`/tu/teaching/assignments/${assignment.courseTimeId}`)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-text-primary font-medium truncate mb-1">
                    {assignment.courseTimeTitle || assignment.programTitle}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {assignment.startDate} ~ {assignment.endDate}
                  </div>
                </div>
                <div className="flex gap-6 items-center text-sm">
                  <div className="text-center">
                    <div className="text-text-secondary text-xs mb-1">{getText('students')}</div>
                    <div className="text-text-primary font-semibold">
                      {assignment.enrollmentCount || 0}명
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-text-secondary text-xs mb-1">{getText('completion')}</div>
                    <div
                      className={`font-semibold ${
                        (assignment.completionRate || 0) >= 80
                          ? 'text-status-success_text'
                          : (assignment.completionRate || 0) >= 50
                          ? 'text-status-warning_text'
                          : 'text-text-primary'
                      }`}
                    >
                      {assignment.completionRate || 0}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 빠른 시작 */}
      <Card className="p-6">
        <h3 className="text-text-primary mb-4 flex items-center gap-2">
          {getText('quickActionTitle')}
        </h3>
        <div className="flex gap-3 flex-wrap">
          <Button onClick={() => navigate('/tu/teaching/courses/create')}>
            <Plus size={18} />
            {getText('createCourse')}
          </Button>
          <Button
            variant="ghost"
            className="border border-border"
            onClick={() => navigate('/tu/teaching/content/create')}
          >
            <FolderPlus size={18} />
            {getText('createContent')}
          </Button>
        </div>
      </Card>
    </div>
  );
}
