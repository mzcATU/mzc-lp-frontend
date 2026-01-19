import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import { BookOpen, Award, Plus, Filter, Loader2, AlertCircle, Send, CheckSquare, Square, Edit } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/utils/cn';
import { Button, IconStatCard, ViewToggle, DataTable, DataTableColumnHeader, Checkbox } from '@/components/common';
import { CourseCard } from '@/components/domain/tu/course';
import { useMyCourses, useApplyProgramsBulk, toCourseForApplication } from '@/hooks/tu';
import { courseService, categoryService } from '@/services/common';
import type { Course } from '@/types';
import type { CourseResponse, CourseStatus } from '@/types/common/course.types';
import type { CategoryResponse } from '@/types/common';

/** 과정 상태 필터 타입 */
type StatusFilter = 'all' | 'draft' | 'ready' | 'registered';

interface MyCoursesPageProps {
  language?: 'ko' | 'en';
}

type ViewMode = 'grid' | 'list';

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop';

/** CourseResponse를 UI용 Course 타입으로 변환 */
function mapCourseResponseToCourse(
  response: CourseResponse,
  categories: CategoryResponse[]
): Course & { isComplete: boolean; courseStatus: CourseStatus } {
  // categoryId로 카테고리 이름 찾기
  const categoryName = response.categoryId
    ? categories.find((cat) => cat.id === response.categoryId)?.name || '미분류'
    : '미분류';

  return {
    id: String(response.courseId),
    title: response.title,
    instructor: '나',
    progress: response.isComplete ? 100 : 0,
    totalLessons: response.itemCount,
    completedLessons: response.itemCount,
    thumbnail: response.thumbnailUrl || DEFAULT_THUMBNAIL,
    category: categoryName,
    students: 0,
    lastAccessed: new Date(response.updatedAt).toLocaleDateString('ko-KR'),
    status: response.status === 'REGISTERED' ? 'active' : 'draft',
    isComplete: response.isComplete,
    courseStatus: response.status,
  };
}

const t = {
  title: { ko: '과정 설계', en: 'Course Design' },
  subtitle: { ko: '과정을 설계하고 관리하세요', en: 'Design and manage your courses' },
  createCourse: { ko: '과정 생성', en: 'Create Course' },
  all: { ko: '전체', en: 'All' },
  draft: { ko: '작성중', en: 'Draft' },
  ready: { ko: '작성완료', en: 'Ready' },
  registered: { ko: '등록', en: 'Registered' },
  published: { ko: '발행됨', en: 'Published' },
  sortBy: { ko: '정렬', en: 'Sort By' },
  recent: { ko: '최신순', en: 'Recent' },
  studentCount: { ko: '수강생 순', en: 'Students' },
  titleSort: { ko: '제목순', en: 'Title' },
  coursesCreated: { ko: '전체 과정', en: 'All Courses' },
  totalStudents: { ko: '총 수강생', en: 'Total Students' },
  avgCompletion: { ko: '평균 완료율', en: 'Avg. Completion' },
  students: { ko: '수강생', en: 'Students' },
  courseCompletion: { ko: '콘텐츠 완성도', en: 'Course Completion' },
  lessons: { ko: '차시', en: 'Lessons' },
  manageCourse: { ko: '과정 설계', en: 'Course Design' },
  editCourse: { ko: '수정', en: 'Edit' },
  noCourses: { ko: '작성한 강의 계획서가 없습니다', en: 'No course plans yet' },
  noCoursesDesc: { ko: '새로운 강의 계획서를 설계하여 학습 여정을 구성하세요', en: 'Design a new course plan to structure the learning journey' },
  createNewCourse: { ko: '강의 계획서 만들기', en: 'Create Course Plan' },
  loading: { ko: '강의 목록을 불러오는 중...', en: 'Loading courses...' },
  error: { ko: '강의 목록을 불러오는데 실패했습니다', en: 'Failed to load courses' },
  retry: { ko: '다시 시도', en: 'Retry' },
  applyProgram: { ko: '과정 신청', en: 'Apply Program' },
  applySelected: { ko: '선택 항목 일괄 신청', en: 'Apply Selected' },
  selected: { ko: '개 선택됨', en: ' selected' },
  selectAll: { ko: '전체 선택', en: 'Select All' },
  deselectAll: { ko: '선택 해제', en: 'Deselect All' },
  incompleteWarning: { ko: '작성을 완료해야 신청할 수 있습니다', en: 'Complete the course to apply' },
  continueEditing: { ko: '이어서 작성', en: 'Continue Editing' },
  viewDetails: { ko: '상세보기', en: 'View Details' },
  register: { ko: '과정 등록', en: 'Register Course' },
  gridView: { ko: '카드', en: 'Card' },
  listView: { ko: '리스트', en: 'List' },
  columnTitle: { ko: '과정명', en: 'Course Title' },
  columnCategory: { ko: '카테고리', en: 'Category' },
  columnStatus: { ko: '상태', en: 'Status' },
  columnLessons: { ko: '차시', en: 'Lessons' },
  columnUpdated: { ko: '수정일', en: 'Updated' },
  columnActions: { ko: '액션', en: 'Actions' },
  courseCount: { ko: '개의 과정', en: ' courses' },
};

export function MyCoursesPage({ language = 'ko' }: Readonly<MyCoursesPageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'students' | 'title'>('recent');
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // API 연동
  const { data: coursesData, isLoading, error, refetch } = useMyCourses();
  const applyProgramsBulkMutation = useApplyProgramsBulk();

  // 카테고리 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // 원본 CourseResponse 보관 (신청 시 필요)
  const courseResponses = coursesData?.content || [];

  // API 응답을 UI용 Course 타입으로 변환
  const courses = useMemo(() =>
    courseResponses.map((response) => mapCourseResponseToCourse(response, categories)),
    [courseResponses, categories]
  );

  const filteredCourses = useMemo(() => courses.filter((course) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'draft') return course.courseStatus === 'DRAFT';
    if (filterStatus === 'ready') return course.courseStatus === 'READY';
    if (filterStatus === 'registered') return course.courseStatus === 'REGISTERED';
    return true;
  }), [courses, filterStatus]);

  const sortedCourses = useMemo(() => [...filteredCourses].sort((a, b) => {
    if (sortBy === 'students') return (b.students || 0) - (a.students || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  }), [filteredCourses, sortBy]);

  const registeredCount = useMemo(() =>
    courses.filter((c) => c.courseStatus === 'REGISTERED').length,
    [courses]
  );

  // 상태별 뱃지 스타일 (designTokens.badge 기반)
  const getStatusBadgeStyle = (status: CourseStatus): React.CSSProperties => {
    switch (status) {
      case 'DRAFT':
        // orange: 작성중
        return { backgroundColor: '#FDF3EC', color: '#B5663A' };
      case 'READY':
        // blue: 작성완료
        return { backgroundColor: '#ECF3FA', color: '#3A6B9E' };
      case 'REGISTERED':
        // green: 등록
        return { backgroundColor: '#EDF5EF', color: '#3D7A4A' };
      default:
        // gray
        return { backgroundColor: '#F5F5F5', color: '#616161' };
    }
  };

  const getStatusLabel = (status: CourseStatus) => {
    switch (status) {
      case 'DRAFT': return getText('draft');
      case 'READY': return getText('ready');
      case 'REGISTERED': return getText('registered');
      default: return status;
    }
  };

  // 리스트뷰 컬럼 정의 - Hook은 조건부 리턴 전에 호출되어야 함
  const columns: ColumnDef<Course & { courseStatus: CourseStatus }>[] = useMemo(() => [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={sortedCourses.length > 0 && selectedCourseIds.size === sortedCourses.length}
          onCheckedChange={() => toggleSelectAll(sortedCourses)}
          aria-label={getText('selectAll')}
        />
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedCourseIds.has(row.original.id)}
            onCheckedChange={() => toggleSelect(row.original.id)}
            aria-label={`Select ${row.original.title}`}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getText('columnTitle')} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.thumbnail}
            alt={row.original.title}
            className="w-12 h-8 rounded object-cover"
          />
          <p className="text-sm text-text-primary font-medium max-w-[300px] truncate">
            {row.original.title}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'courseStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getText('columnStatus')} />
      ),
      cell: ({ row }) => (
        <span
          className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full"
          style={getStatusBadgeStyle(row.original.courseStatus)}
        >
          {getStatusLabel(row.original.courseStatus)}
        </span>
      ),
    },
    {
      accessorKey: 'lastAccessed',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getText('columnUpdated')} />
      ),
      cell: ({ row }) => (
        <p className="text-sm text-text-secondary">{row.original.lastAccessed}</p>
      ),
    },
    {
      id: 'actions',
      header: () => null,
      cell: ({ row }) => {
        const course = row.original;
        return (
          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            {course.courseStatus === 'DRAFT' ? (
              <Button
                size="sm"
                variant="ghost"
                className="border border-border"
                onClick={() => navigate(prefixPath(`/tu/teaching/courses/create?courseId=${course.id}`))}
              >
                <Edit size={14} />
                {getText('continueEditing')}
              </Button>
            ) : course.courseStatus === 'READY' ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(prefixPath(`/tu/teaching/courses/${course.id}`))}
                >
                  {getText('viewDetails')}
                </Button>
                <Button
                  size="sm"
                  variant="brand"
                  onClick={() => handleRegister(course.id)}
                >
                  {getText('register')}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(prefixPath(`/tu/teaching/courses/${course.id}`))}
              >
                {getText('viewDetails')}
              </Button>
            )}
          </div>
        );
      },
    },
  ], [language, sortedCourses, selectedCourseIds, navigate, prefixPath]);

  // 체크박스 토글
  const toggleSelect = (courseId: string) => {
    setSelectedCourseIds((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  };

  // 전체 선택/해제
  const toggleSelectAll = (coursesToSelect: (Course & { courseStatus: CourseStatus })[]) => {
    if (selectedCourseIds.size === coursesToSelect.length) {
      setSelectedCourseIds(new Set());
    } else {
      setSelectedCourseIds(new Set(coursesToSelect.map((c) => c.id)));
    }
  };

  // 일괄 신청
  const handleApplyBulk = async () => {
    if (selectedCourseIds.size === 0) {
      alert('신청할 강의를 선택해주세요.');
      return;
    }

    if (!confirm(`${selectedCourseIds.size}개의 강의를 과정으로 일괄 신청하시겠습니까?`)) return;

    const selectedResponses = (coursesData?.content || []).filter((c) =>
      selectedCourseIds.has(String(c.courseId))
    );

    try {
      const results = await applyProgramsBulkMutation.mutateAsync(
        selectedResponses.map(toCourseForApplication)
      );

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      if (failCount === 0) {
        alert(`${successCount}개의 과정 신청이 완료되었습니다.`);
      } else {
        const failedTitles = results
          .filter((r) => !r.success)
          .map((r) => r.courseTitle)
          .join(', ');
        alert(
          `${successCount}개 성공, ${failCount}개 실패\n실패한 강의: ${failedTitles}`
        );
      }

      setSelectedCourseIds(new Set());
    } catch (err) {
      console.error('Bulk apply failed:', err);
      alert('일괄 신청에 실패했습니다.');
    }
  };

  // 과정 등록 (READY -> REGISTERED)
  const handleRegister = async (courseId: string) => {
    if (!confirm('과정을 등록하시겠습니까?')) return;

    try {
      await courseService.register(Number(courseId));
      alert('과정이 성공적으로 등록되었습니다.');
      refetch();
    } catch (err) {
      console.error('Course registration failed:', err);
      alert('과정 등록에 실패했습니다.');
    }
  };

  const isApplying = applyProgramsBulkMutation.isPending;

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

  return (
    <div className="p-8 bg-bg-app_default min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-text-primary mb-2">{getText('title')}</h1>
          <p className="text-text-secondary m-0">{getText('subtitle')}</p>
        </div>
        <Button onClick={() => navigate(prefixPath('/tu/teaching/courses/create'))}>
          <Plus size={20} />
          <span>{getText('createCourse')}</span>
        </Button>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <IconStatCard icon={<BookOpen size={20} />} label={getText('coursesCreated')} value={courses.length} />
        <IconStatCard icon={<Award size={20} />} label="등록된 과정" value={registeredCount} />
      </div>

      {/* Filters, Sort, and Bulk Actions */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <Filter size={18} className="text-text-secondary" />
          <div className="flex gap-1 bg-bg-secondary p-1 rounded-lg">
            {(['all', 'draft', 'ready', 'registered'] as const).map((status) => (
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

        {/* Bulk Selection Actions */}
        {sortedCourses.length > 0 && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => toggleSelectAll(sortedCourses)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {selectedCourseIds.size === sortedCourses.length ? (
                <CheckSquare size={16} />
              ) : (
                <Square size={16} />
              )}
              {selectedCourseIds.size === sortedCourses.length
                ? getText('deselectAll')
                : getText('selectAll')}
            </button>
            {selectedCourseIds.size > 0 && (
              <>
                <span className="text-sm text-text-secondary">
                  {selectedCourseIds.size}{getText('selected')}
                </span>
                <Button
                  size="sm"
                  onClick={handleApplyBulk}
                  disabled={isApplying}
                >
                  {isApplying ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {getText('applySelected')}
                </Button>
              </>
            )}
          </div>
        )}

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

      {/* View Toggle & Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-secondary">
          {sortedCourses.length}{getText('courseCount')}
        </p>
        <ViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          gridLabel={getText('gridView')}
          listLabel={getText('listView')}
        />
      </div>

      {/* Course List View */}
      {viewMode === 'list' && sortedCourses.length > 0 && (
        <DataTable
          columns={columns}
          data={sortedCourses}
          showColumnToggle={false}
          showPagination={false}
          onRowClick={(course) => navigate(prefixPath(`/tu/teaching/courses/${course.id}`))}
          labels={{
            noResults: getText('noCourses'),
          }}
        />
      )}

      {/* Course Grid View */}
      {viewMode === 'grid' && sortedCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCourses.map((course) => {
            const isSelected = selectedCourseIds.has(course.id);

            return (
              <div key={course.id} className="relative">
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(course.id)}
                  className={cn(
                    'absolute top-3 right-3 z-10 p-1.5 rounded-md transition-colors',
                    isSelected
                      ? 'bg-btn-primary text-white'
                      : 'bg-bg-secondary/80 text-text-secondary hover:bg-bg-secondary'
                  )}
                >
                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>

                {/* Course Card */}
                <div className={cn(
                  'transition-all',
                  isSelected && 'ring-2 ring-btn-primary rounded-xl'
                )}>
                  <CourseCard
                    course={course}
                    courseStatus={course.courseStatus}
                    labels={{
                      students: getText('students'),
                      courseCompletion: getText('courseCompletion'),
                      lessons: getText('lessons'),
                      manageCourse: getText('manageCourse'),
                    }}
                    renderActions={
                      course.courseStatus === 'DRAFT' ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 border border-border"
                          onClick={() => navigate(prefixPath(`/tu/teaching/courses/create?courseId=${course.id}`))}
                        >
                          <Edit size={14} />
                          {getText('continueEditing')}
                        </Button>
                      ) : course.courseStatus === 'READY' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => navigate(prefixPath(`/tu/teaching/courses/${course.id}`))}
                          >
                            {getText('viewDetails')}
                          </Button>
                          <Button
                            size="sm"
                            variant="brand"
                            className="flex-1"
                            onClick={() => handleRegister(course.id)}
                          >
                            {getText('register')}
                          </Button>
                        </>
                      ) : course.courseStatus === 'REGISTERED' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => navigate(prefixPath(`/tu/teaching/courses/${course.id}`))}
                        >
                          {getText('viewDetails')}
                        </Button>
                      ) : null
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {sortedCourses.length === 0 && (
        <div className="text-center py-20 px-5 bg-bg-secondary rounded-xl border border-border">
          <Award size={64} className="text-text-secondary mb-4 opacity-30 mx-auto" />
          <h3 className="text-text-primary mb-2">{getText('noCourses')}</h3>
          <p className="text-text-secondary mb-6">{getText('noCoursesDesc')}</p>
          <Button onClick={() => navigate(prefixPath('/tu/teaching/courses/create'))}>
            {getText('createNewCourse')}
          </Button>
        </div>
      )}
    </div>
  );
}
