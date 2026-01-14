/**
 * 강의 관리 페이지 (TU - 강사 본인용)
 */
import { useNavigate } from 'react-router-dom';
import { Loader2, CalendarDays, FileText, BookOpen } from 'lucide-react';
import { Button } from '@/components/common';
import { useMyAssignments, useMyInstructorStatistics } from '@/hooks/tu';
import {
  AssignmentStatsCard,
  AssignmentCard,
  CourseTimeStatCard,
} from '@/components/domain/tu/assignment';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';

interface MyAssignmentsPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '강의 운영', en: 'Course Operations' },
  subtitle: { ko: '주강사·보조강사로 진행 중인 강의와 수강생 현황을 확인하세요', en: 'View courses you are teaching and student progress' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  noAssignments: { ko: '진행 중인 강의가 없습니다', en: 'No active courses found' },
  noAssignmentsDesc: { ko: '승인된 과정에 강사로 배정되면 여기에 표시됩니다', en: 'Courses will appear here when you are assigned as an instructor' },
  goToCourseDesign: { ko: '강의 디자인으로 이동', en: 'Go to Course Design' },
  myAssignments: { ko: '진행 중인 강의', en: 'Active Courses' },
  courseStats: { ko: '차수별 통계', en: 'Course Statistics' },
  assignmentCount: { ko: '건', en: ' items' },
};

export function MyAssignmentsPage({ language = 'ko' }: Readonly<MyAssignmentsPageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();

  const getText = (key: keyof typeof t) => t[key][language];

  // React Query hooks
  const { data: assignments, isLoading: assignmentsLoading, error: assignmentsError } = useMyAssignments();
  const { data: statistics, isLoading: statsLoading } = useMyInstructorStatistics();

  const isLoading = assignmentsLoading || statsLoading;
  const error = assignmentsError;

  // 활성 상태의 배정만 표시 (ACTIVE만)
  const activeAssignments = assignments?.filter((assignment) => assignment.status === 'ACTIVE') ?? [];

  // 에러 상태
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
    <div className="p-8 bg-bg-app min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-text-primary mb-2">{getText('title')}</h1>
          <p className="text-text-secondary m-0">{getText('subtitle')}</p>
        </div>
      </div>

      {/* 통계 카드 */}
      {!isLoading && statistics && (
        <div className="mb-8">
          <AssignmentStatsCard
            totalCount={statistics.totalCount}
            mainCount={statistics.mainCount}
            subCount={statistics.subCount}
            language={language}
          />
        </div>
      )}

      {/* Content */}
      <div>
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-text-secondary" />
              <span className="ml-2 text-text-secondary">{getText('loading')}</span>
            </div>
          )}

          {/* 배정 목록 섹션 */}
          {!isLoading && (
            <>
              {/* 섹션 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-text-primary">
                  {getText('myAssignments')}
                </h2>
                <p className="text-sm text-text-secondary">
                  {activeAssignments.length}{getText('assignmentCount')}
                </p>
              </div>

              {/* 빈 상태 */}
              {activeAssignments.length === 0 && (
                <div className="text-center py-12">
                  <CalendarDays size={48} className="mx-auto mb-3 text-text-placeholder" />
                  <p className="text-text-secondary mb-1">{getText('noAssignments')}</p>
                  <p className="text-sm text-text-placeholder mb-4">{getText('noAssignmentsDesc')}</p>
                  <Button
                    variant="outline"
                    onClick={() => navigate(prefixPath('/tu/teaching/courses'))}
                  >
                    <BookOpen size={16} />
                    {getText('goToCourseDesign')}
                  </Button>
                </div>
              )}

              {/* 배정 카드 그리드 */}
              {activeAssignments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {activeAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      language={language}
                      onClick={() => navigate(prefixPath(`/tu/teaching/assignments/${assignment.id}`))}
                    />
                  ))}
                </div>
              )}

              {/* 차수별 통계 섹션 */}
              {statistics && statistics.courseTimeStats.length > 0 && (
                <>
                  <h2 className="text-lg font-medium text-text-primary mb-4">
                    {getText('courseStats')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statistics.courseTimeStats.map((stat) => (
                      <CourseTimeStatCard
                        key={stat.timeKey}
                        stat={stat}
                        language={language}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
    </div>
  );
}
