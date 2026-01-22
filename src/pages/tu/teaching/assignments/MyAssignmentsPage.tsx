/**
 * 나의 교수 관리 페이지 (TU - 강사 본인용)
 * 리스트형/카드형 뷰 전환 가능
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CalendarDays, FileText, BookOpen, Users, Filter } from 'lucide-react';
import { Button } from '@/components/common';
import { ViewToggle } from '@/components/common/ViewToggle/ViewToggle';
import { useMyAssignments, useMyInstructorStatistics } from '@/hooks/tu';
import {
  AssignmentCard,
} from '@/components/domain/tu/assignment';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import { designTokens } from '@/styles/admin-design-tokens';
import { cn } from '@/utils/cn';
import type { InstructorAssignmentResponse } from '@/types/tu';

interface MyAssignmentsPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '내 교수 관리', en: 'My Teaching' },
  subtitle: { ko: '주강사·보조강사로 진행 중인 과정과 수강생 현황을 확인하세요', en: 'View courses you are teaching and student progress' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  noAssignments: { ko: '진행 중인 과정이 없습니다', en: 'No active courses found' },
  noAssignmentsDesc: { ko: '승인된 과정에 강사로 배정되면 여기에 표시됩니다', en: 'Courses will appear here when you are assigned as an instructor' },
  goToCourseDesign: { ko: '과정 설계로 이동', en: 'Go to Course Design' },
  myAssignments: { ko: '나의 강의', en: 'My Courses' },
  assignmentCount: { ko: '건', en: ' items' },
  activeCourses: { ko: '진행 중인 과정', en: 'Active Courses' },
  totalStudents: { ko: '총 수강생', en: 'Total Students' },
  mainInstructor: { ko: '주강사', en: 'Main Instructor' },
  subInstructor: { ko: '보조강사', en: 'Sub Instructor' },
  cardView: { ko: '카드형', en: 'Card View' },
  listView: { ko: '리스트형', en: 'List View' },
  courseName: { ko: '과정명', en: 'Course Name' },
  timeNumber: { ko: '차수', en: 'Session' },
  role: { ko: '역할', en: 'Role' },
  students: { ko: '수강생', en: 'Students' },
  period: { ko: '기간', en: 'Period' },
  progress: { ko: '진행률', en: 'Progress' },
  all: { ko: '전체', en: 'All' },
  active: { ko: '진행 중', en: 'Active' },
  ended: { ko: '종료', en: 'Ended' },
  latest: { ko: '최신순', en: 'Latest' },
  oldest: { ko: '오래된순', en: 'Oldest' },
};

export function MyAssignmentsPage({ language = 'ko' }: Readonly<MyAssignmentsPageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'ended'>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  const getText = (key: keyof typeof t) => t[key][language];

  // React Query hooks
  const { data: assignments, isLoading: assignmentsLoading, error: assignmentsError } = useMyAssignments();
  const { data: statistics, isLoading: statsLoading } = useMyInstructorStatistics();

  const isLoading = assignmentsLoading || statsLoading;
  const error = assignmentsError;

  // 모든 배정 표시 (필터링 전)
  const allAssignments = assignments ?? [];

  // 차수별 통계 데이터를 맵으로 저장 (빠른 조회를 위해)
  // NOTE: Statistics API가 실패하면(500 에러) 빈 맵이 되며, 차수 번호만 표시됩니다.
  // 향후 백엔드에서 InstructorAssignmentResponse에 차수 제목(timeName)을 포함하면 개선 가능
  const timeStatsMap = new Map(
    statistics?.courseTimeStats.map(stat => [stat.timeKey, stat]) ?? []
  );

  // 오늘 날짜
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 강의가 종료되었는지 확인하는 함수
  const isEnded = (assignment: InstructorAssignmentResponse): boolean => {
    // REPLACED나 CANCELLED 상태면 종료된 것으로 간주
    if (assignment.status === 'REPLACED' || assignment.status === 'CANCELLED') {
      return true;
    }

    // TODO: 향후 백엔드 API에서 차수의 실제 종료일(classEndDate)을 제공하면
    // 해당 날짜와 현재 날짜를 비교하여 종료 여부 판단
    // 현재는 ACTIVE 상태이면 진행 중으로 간주
    return false;
  };

  // 탭에 따라 필터링
  const filteredAssignments = allAssignments.filter((assignment) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'active') return assignment.status === 'ACTIVE' && !isEnded(assignment);
    if (selectedTab === 'ended') return isEnded(assignment);
    return true;
  });

  // 정렬
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    const dateA = new Date(a.assignedAt).getTime();
    const dateB = new Date(b.assignedAt).getTime();
    return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
  });

  // 각 상태별 카운트
  const statusCounts = {
    all: allAssignments.length,
    active: allAssignments.filter(a => a.status === 'ACTIVE' && !isEnded(a)).length,
    ended: allAssignments.filter(a => isEnded(a)).length,
  };

  // 진행 중인 강의 수 (ACTIVE이면서 종료되지 않은 강의)
  const activeAssignmentCount = statusCounts.active;

  // 통계에서 총 수강생 수 계산 (실제 API 데이터 활용)
  const totalStudents = statistics?.courseTimeStats.reduce((sum, stat) => {
    return sum + (stat.totalStudents ?? 0);
  }, 0) ?? 0;

  // 에러 상태
  if (error) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: designTokens.bg.app_default }}>
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-3" style={{ color: designTokens.text.placeholder }} />
          <p style={{ color: designTokens.text.secondary }}>{getText('error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen" style={{ backgroundColor: designTokens.bg.app_default }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2" style={{ color: designTokens.text.primary }}>{getText('title')}</h1>
        <p className="m-0" style={{ color: designTokens.text.secondary }}>{getText('subtitle')}</p>
      </div>

      {/* 통계 카드 - 상단 */}
      {!isLoading && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 진행 중인 강의 */}
            <div
              className="p-5 rounded-lg border"
              style={{
                backgroundColor: designTokens.bg.default,
                borderColor: designTokens.bg.border,
              }}
            >
              <div className="flex items-start gap-3">
                <BookOpen size={20} style={{ color: '#5E35B1', marginTop: '2px' }} />
                <div className="flex-1">
                  <p className="text-sm m-0 mb-2" style={{ color: designTokens.text.secondary }}>
                    {getText('activeCourses')}
                  </p>
                  <p className="text-3xl font-semibold m-0" style={{ color: designTokens.text.primary }}>
                    {activeAssignmentCount}
                  </p>
                </div>
              </div>
            </div>

            {/* 총 수강생 (진행 중인 강의 기준) */}
            <div
              className="p-5 rounded-lg border"
              style={{
                backgroundColor: designTokens.bg.default,
                borderColor: designTokens.bg.border,
              }}
            >
              <div className="flex items-start gap-3">
                <Users size={20} style={{ color: '#43A047', marginTop: '2px' }} />
                <div className="flex-1">
                  <p className="text-sm m-0 mb-2" style={{ color: designTokens.text.secondary }}>
                    {getText('totalStudents')}
                  </p>
                  <p className="text-3xl font-semibold m-0" style={{ color: designTokens.text.primary }}>
                    {totalStudents}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin" style={{ color: designTokens.text.secondary }} />
            <span className="ml-2" style={{ color: designTokens.text.secondary }}>{getText('loading')}</span>
          </div>
        )}

        {/* 배정 목록 섹션 */}
        {!isLoading && (
          <>
            {/* 필터 + 탭 버튼 + 정렬 */}
            <div className="mb-6 flex gap-4 items-center flex-wrap">
              {/* 필터 아이콘 + 탭 버튼들 */}
              <div className="flex gap-2 items-center">
                <Filter size={18} className="text-text-secondary" />
                <div className="flex gap-1 bg-bg-secondary p-1 rounded-lg">
                  {(['all', 'active', 'ended'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={cn(
                        'px-4 py-1.5 rounded-md text-sm transition-colors',
                        selectedTab === tab
                          ? 'bg-btn-neutral text-white font-medium'
                          : 'bg-transparent text-text-secondary hover:bg-bg-secondary'
                      )}
                    >
                      {getText(tab)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 정렬 드롭다운 */}
              <div className="flex gap-2 items-center ml-auto">
                <span className="text-sm text-text-secondary">{getText('latest').includes('최신') ? '정렬:' : 'Sort by:'}</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'latest' | 'oldest')}
                  className="px-3 py-2 bg-bg-secondary text-text-primary border border-border rounded-md text-sm cursor-pointer"
                >
                  <option value="latest">{getText('latest')}</option>
                  <option value="oldest">{getText('oldest')}</option>
                </select>
              </div>
            </div>

            {/* 뷰 전환 & 카운트 */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-text-secondary">
                {filteredAssignments.length}{getText('assignmentCount')}
              </p>
              <ViewToggle
                viewMode={viewType}
                onViewModeChange={setViewType}
                gridLabel={getText('cardView')}
                listLabel={getText('listView')}
              />
            </div>

            {/* 빈 상태 */}
            {filteredAssignments.length === 0 && (
              <div className="text-center py-12">
                <CalendarDays size={48} className="mx-auto mb-3" style={{ color: designTokens.text.placeholder }} />
                <p className="mb-1" style={{ color: designTokens.text.secondary }}>{getText('noAssignments')}</p>
                <p className="text-sm mb-4" style={{ color: designTokens.text.placeholder }}>{getText('noAssignmentsDesc')}</p>
                <Button
                  variant="outline"
                  onClick={() => navigate(prefixPath('/tu/teaching/courses'))}
                >
                  <BookOpen size={16} />
                  {getText('goToCourseDesign')}
                </Button>
              </div>
            )}

            {/* 카드형 뷰 */}
            {filteredAssignments.length > 0 && viewType === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {sortedAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    timeStats={timeStatsMap.get(assignment.timeId)}
                    language={language}
                    onClick={() => navigate(prefixPath(`/tu/teaching/assignments/${assignment.id}`))}
                  />
                ))}
              </div>
            )}

            {/* 리스트형 뷰 */}
            {filteredAssignments.length > 0 && viewType === 'list' && (
              <div
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: designTokens.bg.default,
                  borderColor: designTokens.bg.border,
                }}
              >
                <table className="w-full border-collapse">
                  <thead>
                    <tr
                      className="border-b"
                      style={{
                        backgroundColor: designTokens.bg.secondary,
                        borderBottomColor: designTokens.bg.border,
                      }}
                    >
                      <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                        {getText('courseName')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                        {getText('role')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                        {getText('students')}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium" style={{ color: designTokens.text.secondary }}>
                        배정일
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAssignments.map((assignment: InstructorAssignmentResponse) => {
                      const stats = timeStatsMap.get(assignment.timeId);
                      return (
                        <tr
                          key={assignment.id}
                          onClick={() => navigate(prefixPath(`/tu/teaching/assignments/${assignment.id}`))}
                          className="border-b cursor-pointer transition-colors"
                          style={{ borderBottomColor: designTokens.bg.border }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = designTokens.bg.secondary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <td className="px-4 py-4 font-medium" style={{ color: designTokens.text.primary }}>
                            {stats?.courseName || String(assignment.timeId)}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium whitespace-nowrap"
                              style={{
                                backgroundColor: assignment.role === 'MAIN' ? '#FFF3E0' : '#E8F5E9',
                                color: assignment.role === 'MAIN' ? '#F57C00' : '#43A047',
                              }}
                            >
                              {assignment.role === 'MAIN' ? getText('mainInstructor') : getText('subInstructor')}
                            </span>
                          </td>
                          <td className="px-4 py-4" style={{ color: designTokens.text.primary }}>
                            {stats?.totalStudents ?? 0}명
                          </td>
                          <td className="px-4 py-4 text-sm" style={{ color: designTokens.text.secondary }}>
                            {new Date(assignment.assignedAt).toLocaleDateString('ko-KR')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
