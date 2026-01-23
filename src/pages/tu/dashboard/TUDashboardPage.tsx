import { useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import {
  BookOpen,
  Users,
  FileEdit,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { Button, IconStatCard, Card } from '@/components/common';
import { useMyCourses, useMyInstructorStatistics } from '@/hooks/tu';

interface TUDashboardPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '대시보드', en: 'Dashboard' },
  subtitle: { ko: '과정 관리와 운영 현황을 확인하세요', en: 'Manage and monitor your courses' },

  // 통계
  statDraft: { ko: '작성중 과정', en: 'Draft Courses' },
  statActive: { ko: '운영중 과정', en: 'Active Courses' },

  // 작성중인 과정
  draftSectionTitle: { ko: '작성중인 과정', en: 'Draft Courses' },
  draftSectionSubtitle: { ko: '완료되지 않은 과정을 이어서 작성하세요', en: 'Continue working on incomplete courses' },
  lastEdited: { ko: '마지막 수정', en: 'Last edited' },
  continueButton: { ko: '이어서 작성', en: 'Continue' },
  emptyDraft: { ko: '작성중인 과정이 없습니다', en: 'No draft courses' },
  viewAll: { ko: '전체 보기', en: 'View All' },


  // 운영중인 과정
  activeSectionTitle: { ko: '운영중인 과정', en: 'Active Courses' },
  activeSectionSubtitle: { ko: '현재 진행중인 과정과 수강생 현황', en: 'Current courses and student statistics' },
  students: { ko: '수강생', en: 'Students' },
  completion: { ko: '완료율', en: 'Completion' },
  emptyActive: { ko: '운영중인 과정이 없습니다', en: 'No active courses' },

  // 로딩
  loading: { ko: '데이터를 불러오는 중...', en: 'Loading data...' },
};


export function TUDashboardPage({ language = 'ko' }: Readonly<TUDashboardPageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();

  // API 훅
  const { data: coursesData, isLoading: isLoadingCourses } = useMyCourses();
  const { data: statistics, isLoading: isLoadingStats } = useMyInstructorStatistics();

  const getText = (key: keyof typeof t) => t[key][language];

  const isLoading = isLoadingCourses || isLoadingStats;

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
  const courseTimeStats = statistics?.courseTimeStats || [];

  // 통계 계산
  const draftCourses = courses.filter((c) => !c.isComplete);
  const totalStudents = courseTimeStats.reduce((sum: number, stat) => sum + (stat.totalStudents || 0), 0);

  return (
    <div className="p-8 bg-bg-app_default min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-text-primary mb-2">{getText('title')}</h1>
        <p className="text-text-secondary m-0">{getText('subtitle')}</p>
      </div>

      {/* 요약 통계 (4개) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <IconStatCard
          icon={<FileEdit size={20} className="text-status-warning" />}
          label={getText('statDraft')}
          value={draftCourses.length}
        />
        <IconStatCard
          icon={<Users size={20} className="text-btn-brand" />}
          label={getText('statActive')}
          value={`${courseTimeStats.length}개 / ${totalStudents}명`}
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
              onClick={() => navigate(prefixPath('/tu/teaching/courses'))}
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
                  onClick={() => navigate(prefixPath(`/tu/teaching/courses/create?courseId=${course.courseId}`))}
                >
                  {getText('continueButton')}
                </Button>
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
          {courseTimeStats.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-text-secondary"
              onClick={() => navigate(prefixPath('/tu/teaching/assignments'))}
            >
              {getText('viewAll')}
              <ArrowRight size={14} />
            </Button>
          )}
        </div>

        {courseTimeStats.length === 0 ? (
          <div className="py-8 text-center text-text-secondary text-sm">
            {getText('emptyActive')}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {courseTimeStats.slice(0, 5).map((stat) => (
              <div
                key={stat.timeKey}
                className="p-4 bg-bg-app_default rounded-lg flex justify-between items-center gap-4 cursor-pointer hover:bg-bg-secondary transition-colors"
                onClick={() => navigate(prefixPath(`/tu/teaching/assignments/${stat.timeKey}`))}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-text-primary font-medium truncate mb-1">
                    {stat.courseName} - {stat.timeName}
                  </div>
                </div>
                <div className="flex gap-6 items-center text-sm">
                  <div className="text-center">
                    <div className="text-text-secondary text-xs mb-1">{getText('students')}</div>
                    <div className="text-text-primary font-semibold">
                      {stat.totalStudents || 0}명
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-text-secondary text-xs mb-1">{getText('completion')}</div>
                    <div
                      className={`font-semibold ${
                        (stat.completionRate || 0) >= 80
                          ? 'text-status-success_text'
                          : (stat.completionRate || 0) >= 50
                          ? 'text-status-warning_text'
                          : 'text-text-primary'
                      }`}
                    >
                      {stat.completionRate || 0}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

    </div>
  );
}
