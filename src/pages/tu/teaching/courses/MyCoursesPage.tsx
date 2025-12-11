import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Users,
  TrendingUp,
  Award,
  Plus,
  Filter,
} from 'lucide-react';
import { designTokens } from '@/styles/design-tokens';

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  thumbnail: string;
  category: string;
  deadline?: string;
  lastAccessed?: string;
  students?: number;
  status?: 'active' | 'completed' | 'draft';
}

interface MyCoursesPageProps {
  language?: 'ko' | 'en';
}

// 카테고리별 뱃지 색상
const categoryColors: Record<string, { bg: string; text: string }> = {
  프로그래밍: { bg: '#E3F2FD', text: '#1565C0' },
  백엔드: { bg: '#E8F5E9', text: '#2E7D32' },
  '개발 도구': { bg: '#FFF3E0', text: '#E65100' },
  프론트엔드: { bg: '#F3E5F5', text: '#7B1FA2' },
  데이터베이스: { bg: '#FFEBEE', text: '#C62828' },
  default: { bg: '#F5F5F5', text: '#616161' },
};

const getCategoryColor = (category: string) => {
  return categoryColors[category] || categoryColors.default;
};

const TEACHING_COURSES: Course[] = [
  {
    id: '4',
    title: 'JavaScript 기초부터 심화까지',
    instructor: '나',
    progress: 100,
    totalLessons: 30,
    completedLessons: 30,
    thumbnail:
      'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=250&fit=crop',
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
    thumbnail:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop',
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
    thumbnail:
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=250&fit=crop',
    category: '개발 도구',
    students: 58,
    lastAccessed: '3시간 전',
    status: 'active',
  },
];

const t = {
  title: { ko: '내 강의', en: 'My Courses' },
  subtitle: {
    ko: '개설한 강의를 관리하고 수강생을 확인하세요',
    en: 'Manage your courses and track student progress',
  },
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
  noCoursesDesc: {
    ko: '새로운 과정을 개설하여 학생들과 지식을 공유하세요',
    en: 'Create a new course to share knowledge with students',
  },
  createNewCourse: { ko: '과정 개설하기', en: 'Create Course' },
};

export function MyCoursesPage({ language = 'ko' }: MyCoursesPageProps) {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'completed' | 'draft'
  >('all');
  const [sortBy, setSortBy] = useState<'recent' | 'students' | 'title'>(
    'recent'
  );

  const filteredCourses = TEACHING_COURSES.filter((course) => {
    if (filterStatus === 'all') return true;
    return course.status === filterStatus;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'students') {
      return (b.students || 0) - (a.students || 0);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const getText = (key: keyof typeof t) => {
    return language === 'ko' ? t[key].ko : t[key].en;
  };

  return (
    <div
      style={{
        padding: '32px',
        backgroundColor: designTokens.bg.default,
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h1 style={{ color: designTokens.text.primary, marginBottom: '8px' }}>
            {getText('title')}
          </h1>
          <p style={{ color: designTokens.text.secondary, margin: 0 }}>
            {getText('subtitle')}
          </p>
        </div>
        <button
            onClick={() => navigate('/tu/teaching/courses/create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: designTokens.button.neutral_default,
              color: designTokens.button.neutral_text,
              border: 'none',
              borderRadius: '8px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                designTokens.button.neutral_hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                designTokens.button.neutral_default;
            }}
          >
            <Plus size={20} />
            <span>{getText('createCourse')}</span>
          </button>
      </div>

      {/* Statistics Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            padding: '20px',
            backgroundColor: designTokens.bg.secondary,
            borderRadius: '12px',
            border: `1px solid ${designTokens.bg.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                padding: '10px',
                backgroundColor: designTokens.bg.default,
                borderRadius: '8px',
              }}
            >
              <BookOpen
                size={20}
                style={{ color: designTokens.button.neutral_default }}
              />
            </div>
            <div>
              <div
                style={{ fontSize: '13px', color: designTokens.text.secondary }}
              >
                {getText('coursesCreated')}
              </div>
              <div
                style={{
                  fontSize: '24px',
                  color: designTokens.text.primary,
                  fontWeight: 600,
                }}
              >
                {TEACHING_COURSES.length}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            backgroundColor: designTokens.bg.secondary,
            borderRadius: '12px',
            border: `1px solid ${designTokens.bg.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                padding: '10px',
                backgroundColor: designTokens.bg.default,
                borderRadius: '8px',
              }}
            >
              <Users
                size={20}
                style={{ color: designTokens.action.primary_default }}
              />
            </div>
            <div>
              <div
                style={{ fontSize: '13px', color: designTokens.text.secondary }}
              >
                {getText('totalStudents')}
              </div>
              <div
                style={{
                  fontSize: '24px',
                  color: designTokens.text.primary,
                  fontWeight: 600,
                }}
              >
                {TEACHING_COURSES.reduce((acc, c) => acc + (c.students || 0), 0)}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            backgroundColor: designTokens.bg.secondary,
            borderRadius: '12px',
            border: `1px solid ${designTokens.bg.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                padding: '10px',
                backgroundColor: designTokens.bg.default,
                borderRadius: '8px',
              }}
            >
              <TrendingUp
                size={20}
                style={{ color: designTokens.status.success_text }}
              />
            </div>
            <div>
              <div
                style={{ fontSize: '13px', color: designTokens.text.secondary }}
              >
                {getText('avgCompletion')}
              </div>
              <div
                style={{
                  fontSize: '24px',
                  color: designTokens.text.primary,
                  fontWeight: 600,
                }}
              >
                {Math.round(
                  TEACHING_COURSES.reduce((acc, c) => acc + c.progress, 0) /
                    TEACHING_COURSES.length
                )}
                %
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Filter size={18} style={{ color: designTokens.text.secondary }} />
          <div
            style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: designTokens.bg.secondary,
              padding: '4px',
              borderRadius: '8px',
            }}
          >
            {(['all', 'active', 'completed', 'draft'] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '6px 16px',
                    backgroundColor:
                      filterStatus === status
                        ? designTokens.button.neutral_default
                        : 'transparent',
                    color:
                      filterStatus === status
                        ? designTokens.button.neutral_text
                        : designTokens.text.secondary,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: filterStatus === status ? 500 : 400,
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {getText(status)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            marginLeft: 'auto',
          }}
        >
          <span
            style={{ fontSize: '14px', color: designTokens.text.secondary }}
          >
            {getText('sortBy')}:
          </span>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as 'recent' | 'students' | 'title')
            }
            style={{
              padding: '8px 12px',
              backgroundColor: designTokens.bg.secondary,
              color: designTokens.text.primary,
              border: `1px solid ${designTokens.bg.border}`,
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="recent">{getText('recent')}</option>
            <option value="students">{getText('studentCount')}</option>
            <option value="title">{getText('titleSort')}</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {sortedCourses.map((course) => (
          <div
            key={course.id}
            style={{
              backgroundColor: designTokens.bg.secondary,
              borderRadius: '12px',
              overflow: 'hidden',
              border: `1px solid ${designTokens.bg.border}`,
              transition: 'all 150ms ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '180px',
                overflow: 'hidden',
              }}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: getCategoryColor(course.category).bg,
                  color: getCategoryColor(course.category).text,
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {course.category}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
              <h3
                style={{
                  color: designTokens.text.primary,
                  marginBottom: '8px',
                  fontSize: '16px',
                }}
              >
                {course.title}
              </h3>
              <p
                style={{
                  color: designTokens.text.secondary,
                  fontSize: '14px',
                  marginBottom: '16px',
                }}
              >
                {getText('students')}: {course.students}명
              </p>

              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      color: designTokens.text.secondary,
                    }}
                  >
                    {getText('contentCompletion')}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: designTokens.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {course.completedLessons}/{course.totalLessons}{' '}
                    {getText('lessons')}
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: designTokens.bg.default,
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${course.progress}%`,
                      height: '100%',
                      backgroundColor: designTokens.button.neutral_default,
                      transition: 'width 300ms ease',
                    }}
                  />
                </div>
              </div>

              {/* Footer Info */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  borderTop: `1px solid ${designTokens.bg.border}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: designTokens.text.secondary,
                    fontSize: '13px',
                  }}
                >
                  <Clock size={16} />
                  {course.lastAccessed}
                </div>
              </div>

              {/* Action Button */}
              <button
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: designTokens.button.neutral_default,
                  color: designTokens.button.neutral_text,
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    designTokens.button.neutral_hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    designTokens.button.neutral_default;
                }}
              >
                {getText('manageCourse')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedCourses.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: designTokens.bg.secondary,
            borderRadius: '12px',
            border: `1px solid ${designTokens.bg.border}`,
          }}
        >
          <Award
            size={64}
            style={{
              color: designTokens.text.secondary,
              marginBottom: '16px',
              opacity: 0.3,
            }}
          />
          <h3
            style={{ color: designTokens.text.primary, marginBottom: '8px' }}
          >
            {getText('noCourses')}
          </h3>
          <p
            style={{
              color: designTokens.text.secondary,
              marginBottom: '24px',
            }}
          >
            {getText('noCoursesDesc')}
          </p>
          <button
            style={{
              padding: '12px 24px',
              backgroundColor: designTokens.button.neutral_default,
              color: designTokens.button.neutral_text,
              border: 'none',
              borderRadius: '8px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                designTokens.button.neutral_hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                designTokens.button.neutral_default;
            }}
            onClick={() => navigate('/tu/teaching/courses/create')}
          >
            {getText('createNewCourse')}
          </button>
        </div>
      )}
    </div>
  );
}
