import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
  Search,
  Loader2,
  FileText,
  Plus,
  Calendar,
  FolderOpen,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  Button,
  DataTable,
  DataTableColumnHeader,
  Combobox,
} from '@/components/common';
import {
  useRegisteredCourses,
} from '@/hooks/tu/useCourseQueries';
import type {
  CourseRegistrationResponse,
  CourseLevel,
  CourseType,
} from '@/types/common/course.types';
import {
  COURSE_LEVEL_LABELS,
  COURSE_TYPE_LABELS,
} from '@/types/common/course.types';
import type { CourseRegistrationFilterParams } from '@/services/common/courseService';
import { categoryService } from '@/services/common';
import type { CategoryResponse } from '@/types/common';

interface CourseListPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '과정 탐색', en: 'Courses' },
  subtitle: { ko: '교육 과정을 검색하고 조회합니다.', en: 'Search and view approved courses.' },
  searchPlaceholder: { ko: '과정명, 생성자 검색...', en: 'Search course, creator...' },
  noResults: { ko: '검색 결과가 없습니다.', en: 'No results found.' },
  noCourses: { ko: '승인된 과정이 없습니다.', en: 'No approved courses.' },
  noCoursesDescription: { ko: '과정이 승인되면 여기에 표시됩니다.', en: 'Approved courses will appear here.' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  courseCount: { ko: '개의 과정', en: ' courses' },
  columnTitle: { ko: '과정명', en: 'Title' },
  columnCategory: { ko: '카테고리', en: 'Category' },
  columnLevel: { ko: '레벨', en: 'Level' },
  columnType: { ko: '타입', en: 'Type' },
  columnTimeCount: { ko: '운영 현황', en: 'Sessions' },
  columnCreator: { ko: '생성자', en: 'Creator' },
  columnCreatedAt: { ko: '생성일', en: 'Created' },
  columnActions: { ko: '액션', en: 'Actions' },
  createTime: { ko: '차수 생성', en: 'Create Session' },
  notSet: { ko: '미설정', en: 'Not set' },
  timeCountUnit: { ko: '개', en: '' },
  allCategories: { ko: '전체 카테고리', en: 'All Categories' },
  allLevels: { ko: '전체 레벨', en: 'All Levels' },
  allTypes: { ko: '전체 타입', en: 'All Types' },
  clearFilters: { ko: '필터 초기화', en: 'Clear Filters' },
};

export function CourseListPage({ language = 'ko' }: Readonly<CourseListPageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);

  // 필터 상태
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | ''>('');
  const [selectedType, setSelectedType] = useState<CourseType | ''>('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // 카테고리 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('카테고리 목록 조회 실패:', err);
      }
    };
    fetchCategories();
  }, []);

  // 카테고리 옵션 (Combobox용)
  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    }));
  }, [categories]);

  // 레벨 옵션 (Combobox용)
  const levelOptions = useMemo(() => {
    return Object.entries(COURSE_LEVEL_LABELS).map(([key, label]) => ({
      value: key,
      label,
    }));
  }, []);

  // 타입 옵션 (Combobox용)
  const typeOptions = useMemo(() => {
    return Object.entries(COURSE_TYPE_LABELS).map(([key, label]) => ({
      value: key,
      label,
    }));
  }, []);

  // 필터 활성화 여부
  const hasActiveFilters = selectedCategoryId || selectedLevel || selectedType;

  // 필터 초기화
  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedLevel('');
    setSelectedType('');
    setPage(0);
  };

  // 검색어 또는 필터 변경 시 페이지 리셋
  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedCategoryId, selectedLevel, selectedType]);

  // 정렬 변경 시 페이지 리셋
  useEffect(() => {
    setPage(0);
  }, [sorting]);

  // SortingState를 Spring sort 파라미터로 변환
  const sortParam = useMemo(() => {
    if (sorting.length === 0) return undefined;
    return sorting.map((s) => `${s.id},${s.desc ? 'desc' : 'asc'}`).join(',');
  }, [sorting]);

  // API 파라미터 구성 (REGISTERED 상태만 조회, 서버 사이드 필터링)
  const params: Omit<CourseRegistrationFilterParams, 'status'> = {
    page,
    size: 10,
    keyword: searchQuery || undefined,
    categoryId: selectedCategoryId || undefined,
    level: selectedLevel || undefined,
    type: selectedType || undefined,
    sort: sortParam,
  };

  // React Query 훅 사용 (승인된 과정만 조회)
  const { data, isLoading, error } = useRegisteredCourses(params);

  // 서버에서 필터링된 데이터 직접 사용
  const courses = data?.content ?? [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 리스트뷰 컬럼 정의
  const columns: ColumnDef<CourseRegistrationResponse>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnTitle')} />
        ),
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {row.original.title}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              ID: {row.original.courseId}
            </p>
          </div>
        ),
      },
      {
        id: 'category',
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnCategory')} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <FolderOpen size={14} className="text-text-secondary flex-shrink-0" />
            <span className="text-sm text-text-secondary whitespace-nowrap">
              {row.original.categoryName || getText('notSet')}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'level',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnLevel')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {row.original.level ? COURSE_LEVEL_LABELS[row.original.level] : getText('notSet')}
          </span>
        ),
      },
      {
        accessorKey: 'type',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnType')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {row.original.type ? COURSE_TYPE_LABELS[row.original.type] : getText('notSet')}
          </span>
        ),
      },
      {
        accessorKey: 'creatorName',
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnCreator')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {row.original.creatorName || '-'}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnCreatedAt')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-text-secondary whitespace-nowrap">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: 'timeCount',
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={getText('columnTimeCount')} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-text-secondary flex-shrink-0" />
            <span className="text-sm text-text-secondary whitespace-nowrap">
              {row.original.timeCount ?? 0}{getText('timeCountUnit')}
            </span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">{getText('columnActions')}</span>,
        cell: ({ row }) => (
          <div
            className="flex items-center justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              onClick={() => navigate(prefixPath(`/co/times/create?courseId=${row.original.courseId}`))}
              className="h-8"
            >
              <Plus size={14} />
              {getText('createTime')}
            </Button>
          </div>
        ),
        size: 130,
      },
    ],
    [language, navigate]
  );

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
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-bg-app">
        <div className="p-6 px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-text-primary mb-1">{getText('title')}</h1>
              <p className="text-text-secondary text-sm m-0">{getText('subtitle')}</p>
            </div>
          </div>

          {/* Control Bar - 검색과 필터를 통합한 툴바 */}
          <div className="flex items-center gap-4 p-3 bg-bg-secondary/50 rounded-lg flex-wrap">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder"
              />
              <input
                type="text"
                placeholder={getText('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-10 bg-bg-default border border-border rounded-md text-text-primary text-sm outline-none focus:ring-2 focus:ring-btn-neutral focus:border-transparent placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-placeholder hover:text-text-secondary"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-border/70 hidden sm:block" />

            {/* Filters */}
            <div className="flex items-center gap-2">
              {/* 카테고리 필터 (Combobox) */}
              <Combobox
                options={categoryOptions}
                value={selectedCategoryId ? String(selectedCategoryId) : ''}
                onValueChange={(value) => setSelectedCategoryId(value ? Number(value) : null)}
                placeholder={getText('allCategories')}
                emptyMessage={language === 'ko' ? '카테고리 없음' : 'No category found'}
                hideSearch
                className={`h-10 min-w-[140px] ${
                  selectedCategoryId
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-bg-default border-border text-text-primary'
                }`}
              />

              {/* 레벨 필터 (Combobox) */}
              <Combobox
                options={levelOptions}
                value={selectedLevel}
                onValueChange={(value) => setSelectedLevel(value as CourseLevel | '')}
                placeholder={getText('allLevels')}
                emptyMessage={language === 'ko' ? '레벨 없음' : 'No level found'}
                hideSearch
                className={`h-10 min-w-[120px] ${
                  selectedLevel
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-bg-default border-border text-text-primary'
                }`}
              />

              {/* 타입 필터 (Combobox) */}
              <Combobox
                options={typeOptions}
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as CourseType | '')}
                placeholder={getText('allTypes')}
                emptyMessage={language === 'ko' ? '타입 없음' : 'No type found'}
                hideSearch
                className={`h-10 min-w-[120px] ${
                  selectedType
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-bg-default border-border text-text-primary'
                }`}
              />

              {/* 필터 초기화 버튼 */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 h-10 px-3 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-default rounded-md transition-colors"
                  title={getText('clearFilters')}
                >
                  <RotateCcw size={14} />
                  <span className="hidden sm:inline">{getText('clearFilters')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 pt-0">
          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              {data?.totalElements ?? 0}
              {getText('courseCount')}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-text-secondary" />
              <span className="ml-2 text-text-secondary">{getText('loading')}</span>
            </div>
          )}

          {/* Empty State - 데이터 자체가 없을 때 */}
          {!isLoading && courses.length === 0 && !searchQuery && !hasActiveFilters && (
            <div className="text-center py-12 text-text-secondary">
              <FileText size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p className="mb-1">{getText('noCourses')}</p>
              <p className="text-sm">{getText('noCoursesDescription')}</p>
            </div>
          )}

          {/* Empty Search/Filter Results - 검색 또는 필터 결과가 없을 때 */}
          {!isLoading && courses.length === 0 && (searchQuery || hasActiveFilters) && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && courses.length > 0 && (
            <DataTable
              columns={columns}
              data={courses}
              showColumnToggle={false}
              showPagination={true}
              manualPagination={true}
              pageCount={data?.totalPages ?? 0}
              pageIndex={page}
              pageSize={10}
              onPageChange={setPage}
              manualSorting={true}
              sorting={sorting}
              onSortingChange={setSorting}
              onRowClick={(item) => navigate(prefixPath(`/co/courses/${item.courseId}`))}
              labels={{
                noResults: getText('noResults'),
                rowsPerPage: language === 'ko' ? '페이지당 행 수' : 'Rows per page',
                pageOf: language === 'ko' ? '페이지 {current} / {total}' : 'Page {current} of {total}',
                rowsSelected: '',
              }}
            />
          )}
        </div>
      </div>

    </div>
  );
}
