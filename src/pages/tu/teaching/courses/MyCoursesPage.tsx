import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, TrendingUp, Award, Plus, Filter } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, CategoryBadge } from '@/components/common';
import type { Course, CourseStatus } from '@/types';

interface MyCoursesPageProps {
  language?: 'ko' | 'en';
}

const TEACHING_COURSES: Course[] = [
  {
    id: '4',
    title: 'JavaScript 기초부터 심화까지',
    instructor: '나',
    progress: 100,
    totalLessons: 30,
    completedLessons: 30,
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop',
    category: '프로그래밍',
    students: 45,
    lastAccessed: '30분 전',
    status: 'active',
  },
  {
    id: '5',
    title: 'Node.js 백엔드 개발',
    instructor: '나',
    progress: 100,
    totalLessons: 22,
    completedLessons: 22,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
    category: '백엔드',
    students: 32,
    lastAccessed: '1시간 전',
    status: 'active',
  },
  {
    id: '6',
    title: 'Git & GitHub 협업 실전',
    instructor: '나',
    progress: 100,
    totalLessons: 15,
    completedLessons: 15,
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=250&fit=crop',
    category: '개발 도구',
    students: 58,
    lastAccessed: '3시간 전',
    status: 'active',
  },
];

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
  contentCompletion: { ko: '콘텐츠 완성도', en: 'Content Completion' },
  lessons: { ko: '차시', en: 'Lessons' },
  manageCourse: { ko: '과정 관리', en: 'Manage Course' },
  noCourses: { ko: '개설한 과정이 없습니다', en: 'No courses created yet' },
  noCoursesDesc: { ko: '새로운 과정을 개설하여 학생들과 지식을 공유하세요', en: 'Create a new course to share knowledge with students' },
  createNewCourse: { ko: '과정 개설하기', en: 'Create Course' },
};

export function MyCoursesPage({ language = 'ko' }: Readonly<MyCoursesPageProps>) {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | CourseStatus>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'students' | 'title'>('recent');

  const filteredCourses = TEACHING_COURSES.filter((course) => {
    if (filterStatus === 'all') return true;
    return course.status === filterStatus;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'students') return (b.students || 0) - (a.students || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const totalStudents = TEACHING_COURSES.reduce((acc, c) => acc + (c.students || 0), 0);
  const avgCompletion = Math.round(TEACHING_COURSES.reduce((acc, c) => acc + c.progress, 0) / TEACHING_COURSES.length);

  return (
    <div className="p-8 bg-bg-default min-h-screen">
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
        <StatCard icon={<BookOpen size={20} />} label={getText('coursesCreated')} value={TEACHING_COURSES.length} />
        <StatCard icon={<Users size={20} />} label={getText('totalStudents')} value={totalStudents} />
        <StatCard icon={<TrendingUp size={20} className="text-status-success" />} label={getText('avgCompletion')} value={`${avgCompletion}%`} />
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
          <CourseCard key={course.id} course={course} getText={getText} />
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

// 통계 카드 컴포넌트
function StatCard({ icon, label, value }: Readonly<{ icon: React.ReactNode; label: string; value: string | number }>) {
  return (
    <div className="p-5 bg-bg-secondary rounded-xl border border-border">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-bg-default rounded-lg text-btn-neutral">{icon}</div>
        <div>
          <div className="text-sm text-text-secondary">{label}</div>
          <div className="text-2xl text-text-primary font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
}

// 강의 카드 컴포넌트
function CourseCard({ course, getText }: Readonly<{ course: Course; getText: (key: keyof typeof t) => string }>) {
  const navigate = useNavigate();

  return (
    <div className="bg-bg-secondary rounded-xl overflow-hidden border border-border transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer">
      {/* Thumbnail */}
      <div className="relative w-full h-44 overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={course.category} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-text-primary mb-2 text-base">{course.title}</h3>
        <p className="text-text-secondary text-sm mb-4">
          {getText('students')}: {course.students}명
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">{getText('contentCompletion')}</span>
            <span className="text-sm text-text-primary font-medium">
              {course.completedLessons}/{course.totalLessons} {getText('lessons')}
            </span>
          </div>
          <div className="w-full h-2 bg-bg-default rounded overflow-hidden">
            <div
              className="h-full bg-btn-neutral transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-text-secondary text-sm">
            <Clock size={16} />
            {course.lastAccessed}
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full mt-4" onClick={() => navigate(`/tu/teaching/courses/${course.id}`)}>
          {getText('manageCourse')}
        </Button>
      </div>
    </div>
  );
}
