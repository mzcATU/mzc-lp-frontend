import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, TrendingUp, Award, Plus, Filter, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, IconStatCard } from '@/components/common';
import { CourseCard } from '@/components/domain/tu/course';
import { useMyCourses } from '@/hooks/tu';
import type { Course, CourseStatus } from '@/types';
import type { CourseResponse } from '@/types/common/course.types';

interface MyCoursesPageProps {
  language?: 'ko' | 'en';
}

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop';

/** CourseResponse를 UI용 Course 타입으로 변환 */
function mapCourseResponseToCourse(response: CourseResponse): Course {
  return {
    id: String(response.courseId),
    title: response.title,
    instructor: '나',
    progress: 100,
    totalLessons: 0,
    completedLessons: 0,
    thumbnail: response.thumbnailUrl || DEFAULT_THUMBNAIL,
    category: response.tags?.[0] || '미분류',
    students: 0,
    lastAccessed: new Date(response.updatedAt).toLocaleDateString('ko-KR'),
    status: 'active' as CourseStatus,
  };
}

const t = {
  title: { ko: '내 강의', en: 'My Courses' },
  subtitle: { ko: '개설한 강의를 관리하고 수강생을 확인하세요', en: 'Manage your courses and track student progress' },
  createCourse: { ko: '강의 생성', en: 'Create Course' },
  all: { ko: '전체', en: 'All' },
  active: { ko: '진행 중', en: 'Active' },
  completed: { ko: '완료', en: 'Completed' },
  draft: { ko: '임시 저장', en: 'Draft' },
  sortBy: { ko: '정렬', en: 'Sort By' },
  recent: { ko: '최신순', en: 'Recent' },
  studentCount: { ko: '수강생 순', en: 'Students' },
  titleSort: { ko: '제목순', en: 'Title' },
  coursesCreated: { ko: '개설한 과정', en: 'Courses Created' },
  totalStudents: { ko: '총 수강생', en: 'Total Students' },
  avgCompletion: { ko: '평균 완료율', en: 'Avg. Completion' },
  students: { ko: '수강생', en: 'Students' },
  courseCompletion: { ko: '콘텐츠 완성도', en: 'Course Completion' },
  lessons: { ko: '차시', en: 'Lessons' },
  manageCourse: { ko: '과정 관리', en: 'Manage Course' },
  editCourse: { ko: '수정', en: 'Edit' },
  noCourses: { ko: '개설한 과정이 없습니다', en: 'No courses created yet' },
  noCoursesDesc: { ko: '새로운 과정을 개설하여 학생들과 지식을 공유하세요', en: 'Create a new course to share knowledge with students' },
  createNewCourse: { ko: '과정 개설하기', en: 'Create Course' },
  loading: { ko: '강의 목록을 불러오는 중...', en: 'Loading courses...' },
  error: { ko: '강의 목록을 불러오는데 실패했습니다', en: 'Failed to load courses' },
  retry: { ko: '다시 시도', en: 'Retry' },
};

export function MyCoursesPage({ language = 'ko' }: Readonly<MyCoursesPageProps>) {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | CourseStatus>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'students' | 'title'>('recent');

  // API 연동
  const { data: coursesData, isLoading, error, refetch } = useMyCourses();

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // 로딩 상태
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

  // 에러 상태
  if (error) {
    return (
      <div className="p-8 bg-bg-app_default min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-status-error mx-auto mb-4" />
          <p className="text-text-secondary mb-4">{getText('error')}</p>
          <Button onClick={() => refetch()}>{getText('retry')}</Button>
        </div>
      </div>
    );
  }

  // API 응답을 UI용 Course 타입으로 변환
  const courses: Course[] = (coursesData?.content || []).map(mapCourseResponseToCourse);

  const filteredCourses = courses.filter((course) => {
    if (filterStatus === 'all') return true;
    return course.status === filterStatus;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'students') return (b.students || 0) - (a.students || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const totalStudents = courses.reduce((acc, c) => acc + (c.students || 0), 0);
  const avgCompletion = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
    : 0;

  return (
    <div className="p-8 bg-bg-app_default min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-text-primary mb-2">{getText('title')}</h1>
          <p className="text-text-secondary m-0">{getText('subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/tu/teaching/courses/create')}>
          <Plus size={20} />
          <span>{getText('createCourse')}</span>
        </Button>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <IconStatCard icon={<BookOpen size={20} />} label={getText('coursesCreated')} value={courses.length} />
        <IconStatCard icon={<Users size={20} />} label={getText('totalStudents')} value={totalStudents} />
        <IconStatCard icon={<TrendingUp size={20} className="text-status-success" />} label={getText('avgCompletion')} value={`${avgCompletion}%`} />
      </div>

      {/* Filters and Sort */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <Filter size={18} className="text-text-secondary" />
          <div className="flex gap-1 bg-bg-secondary p-1 rounded-lg">
            {(['all', 'active', 'completed', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'px-4 py-1.5 rounded-md text-sm transition-colors',
                  filterStatus === status
                    ? 'bg-btn-neutral text-white font-medium'
                    : 'bg-transparent text-text-secondary hover:bg-bg-secondary'
                )}
              >
                {getText(status)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center ml-auto">
          <span className="text-sm text-text-secondary">{getText('sortBy')}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'students' | 'title')}
            className="px-3 py-2 bg-bg-secondary text-text-primary border border-border rounded-md text-sm cursor-pointer"
          >
            <option value="recent">{getText('recent')}</option>
            <option value="students">{getText('studentCount')}</option>
            <option value="title">{getText('titleSort')}</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            labels={{
              students: getText('students'),
              courseCompletion: getText('courseCompletion'),
              lessons: getText('lessons'),
              manageCourse: getText('manageCourse'),
              editCourse: getText('editCourse'),
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {sortedCourses.length === 0 && (
        <div className="text-center py-20 px-5 bg-bg-secondary rounded-xl border border-border">
          <Award size={64} className="text-text-secondary mb-4 opacity-30 mx-auto" />
          <h3 className="text-text-primary mb-2">{getText('noCourses')}</h3>
          <p className="text-text-secondary mb-6">{getText('noCoursesDesc')}</p>
          <Button onClick={() => navigate('/tu/teaching/courses/create')}>
            {getText('createNewCourse')}
          </Button>
        </div>
      )}
    </div>
  );
}

