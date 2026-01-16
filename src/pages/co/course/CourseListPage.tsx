import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Search,
  Loader2,
  FileText,
  Plus,
  Calendar,
  FolderOpen,
} from 'lucide-react';
import {
  Button,
  DataTable,
  DataTableColumnHeader,
} from '@/components/common';
import {
  useRegisteredCourses,
} from '@/hooks/tu/useCourseQueries';
import type {
  CourseRegistrationResponse,
} from '@/types/common/course.types';
import {
  COURSE_LEVEL_LABELS,
  COURSE_TYPE_LABELS,
} from '@/types/common/course.types';
import type { CourseRegistrationFilterParams } from '@/services/common/courseService';

interface CourseListPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '과정 탐색', en: 'Courses' },
  subtitle: { ko: '교육 과정을 검색하고 조회합니다.', en: 'Search and view approved courses.' },
  searchPlaceholder: { ko: '과정명 검색...', en: 'Search course...' },
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
};

export function CourseListPage({ language = 'ko' }: Readonly<CourseListPageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API 파라미터 구성 (REGISTERED 상태만 조회)
  const params: Omit<CourseRegistrationFilterParams, 'status'> = {
    page,
    size: 10,
  };

  // React Query 훅 사용 (승인된 과정만 조회)
  const { data, isLoading, error } = useRegisteredCourses(params);

  // REGISTERED 상태의 과정만 필터링 (안전장치)
  const registeredCourses = useMemo(() => {
    return (data?.content ?? []).filter((course) => course.status === 'REGISTERED');
  }, [data?.content]);

  // 검색 필터링 (클라이언트 사이드)
  const filteredCourses = useMemo(() => {
    if (!searchQuery) return registeredCourses;
    const query = searchQuery.toLowerCase();
    return registeredCourses.filter((course) => course.title.toLowerCase().includes(query));
  }, [registeredCourses, searchQuery]);

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

          {/* Search Bar */}
          <div className="flex-1 relative max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              placeholder={getText('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-default border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-btn-neutral"
            />
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 pt-0">
          {/* Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              {filteredCourses.length}
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

          {/* Empty State */}
          {!isLoading && registeredCourses.length === 0 && !searchQuery && (
            <div className="text-center py-12 text-text-secondary">
              <FileText size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p className="mb-1">{getText('noCourses')}</p>
              <p className="text-sm">{getText('noCoursesDescription')}</p>
            </div>
          )}

          {/* Empty Search Results */}
          {!isLoading && filteredCourses.length === 0 && searchQuery && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Data Table */}
          {!isLoading && filteredCourses.length > 0 && (
            <DataTable
              columns={columns}
              data={filteredCourses}
              showColumnToggle={false}
              showPagination={true}
              manualPagination={true}
              pageCount={data?.totalPages ?? 0}
              pageIndex={page}
              pageSize={10}
              onPageChange={setPage}
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
