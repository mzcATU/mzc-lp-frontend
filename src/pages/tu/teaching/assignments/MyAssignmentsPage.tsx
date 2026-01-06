/**
 * 강의 관리 페이지 (TU - 강사 본인용)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CalendarDays, FileText } from 'lucide-react';
import { Button } from '@/components/common';
import { useMyAssignments, useMyInstructorStatistics } from '@/hooks/tu';
import {
  AssignmentStatsCard,
  AssignmentCard,
  CourseTimeStatCard,
} from '@/components/domain/tu/assignment';
import type { AssignmentStatus } from '@/types/tu';

interface MyAssignmentsPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '강의 운영', en: 'Course Operations' },
  subtitle: { ko: '주강사·보조강사로 진행 중인 강의와 수강생 현황을 확인하세요', en: 'View courses you are teaching and student progress' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  noAssignments: { ko: '진행 중인 강의가 없습니다', en: 'No active courses found' },
  noAssignmentsDesc: { ko: '승인된 프로그램에 강사로 배정되면 여기에 표시됩니다', en: 'Courses will appear here when you are assigned as an instructor' },
  myAssignments: { ko: '진행 중인 강의', en: 'Active Courses' },
  courseStats: { ko: '차수별 통계', en: 'Course Statistics' },
  filterAll: { ko: '전체', en: 'All' },
  filterActive: { ko: '활동 중', en: 'Active' },
  filterReplaced: { ko: '교체됨', en: 'Replaced' },
  filterCancelled: { ko: '취소됨', en: 'Cancelled' },
  assignmentCount: { ko: '건', en: ' items' },
};

type StatusFilter = AssignmentStatus | 'all';

export function MyAssignmentsPage({ language = 'ko' }: Readonly<MyAssignmentsPageProps>) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const getText = (key: keyof typeof t) => t[key][language];

  // React Query hooks
  const { data: assignments, isLoading: assignmentsLoading, error: assignmentsError } = useMyAssignments();
  const { data: statistics, isLoading: statsLoading } = useMyInstructorStatistics();

  const isLoading = assignmentsLoading || statsLoading;
  const error = assignmentsError;

  // 필터링된 배정 목록
  const filteredAssignments = assignments?.filter((assignment) => {
    if (statusFilter === 'all') return true;
    return assignment.status === statusFilter;
  }) ?? [];

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
    <div className="h-full flex flex-col bg-bg-app">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-app">
        <div className="p-6 px-8">
          <div className="mb-6">
            <h1 className="text-text-primary mb-1">{getText('title')}</h1>
            <p className="text-text-secondary text-sm m-0">{getText('subtitle')}</p>
          </div>

          {/* 통계 카드 */}
          {!isLoading && statistics && (
            <AssignmentStatsCard
              totalCount={statistics.totalCount}
              mainCount={statistics.mainCount}
              subCount={statistics.subCount}
              language={language}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 pt-0">
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
              {/* 필터 */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-text-primary">
                  {getText('myAssignments')}
                </h2>
                <div className="flex gap-2">
                  {(['all', 'ACTIVE', 'REPLACED', 'CANCELLED'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'neutral' : 'ghost'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status === 'all' ? getText('filterAll') : getText(`filter${status.charAt(0) + status.slice(1).toLowerCase()}` as keyof typeof t)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 배정 개수 */}
              <p className="text-sm text-text-secondary mb-4">
                {filteredAssignments.length}{getText('assignmentCount')}
              </p>

              {/* 빈 상태 */}
              {filteredAssignments.length === 0 && (
                <div className="text-center py-12">
                  <CalendarDays size={48} className="mx-auto mb-3 text-text-placeholder" />
                  <p className="text-text-secondary mb-1">{getText('noAssignments')}</p>
                  <p className="text-sm text-text-placeholder">{getText('noAssignmentsDesc')}</p>
                </div>
              )}

              {/* 배정 카드 그리드 */}
              {filteredAssignments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {filteredAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      language={language}
                      onClick={() => navigate(`/tu/teaching/assignments/${assignment.id}`)}
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
    </div>
  );
}
