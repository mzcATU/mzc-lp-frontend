import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  FileText,
  ChevronDown,
  Archive,
  RotateCcw,
  Loader2,
  Video,
  FileIcon,
  Image,
  Link,
  LayoutGrid,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge, ViewToggle, DataTable, DataTableColumnHeader, IconStatCard } from '@/components/common';
import { useMyContents, useDeleteContent, useArchiveContent, useRestoreContent } from '@/hooks/tu';
import {
  ContentCard,
  ContentPreviewModal,
  contentTypeBadgeColor,
  formatFileSize,
  formatDate,
} from '@/components/domain/tu/content';
import type { ContentType, ContentStatus, ContentListResponse, ContentFilterParams } from '@/types/tu';

// [DEV] 임시 로그인 버튼 - TODO: 실제 로그인 구현 후 삭제
import { DevLoginButton } from '@/components/dev/DevLoginButton';

interface MyContentPageProps {
  language?: 'ko' | 'en';
}

type ViewMode = 'grid' | 'list';

const t = {
  title: { ko: '내 콘텐츠', en: 'My Content' },
  subtitle: { ko: '등록한 콘텐츠를 관리하고 새로운 콘텐츠를 업로드하세요.', en: 'Manage your content and upload new materials.' },
  createContent: { ko: '콘텐츠 등록', en: 'Add Content' },
  searchPlaceholder: { ko: '콘텐츠 검색...', en: 'Search content...' },
  filter: { ko: '필터', en: 'Filter' },
  contentType: { ko: '콘텐츠 유형', en: 'Content Type' },
  contentStatus: { ko: '상태', en: 'Status' },
  all: { ko: '전체', en: 'All' },
  VIDEO: { ko: '동영상', en: 'Video' },
  AUDIO: { ko: '오디오', en: 'Audio' },
  DOCUMENT: { ko: '문서', en: 'Document' },
  IMAGE: { ko: '이미지', en: 'Image' },
  EXTERNAL_LINK: { ko: '외부 링크', en: 'External Link' },
  ACTIVE: { ko: '활성', en: 'Active' },
  ARCHIVED: { ko: '보관됨', en: 'Archived' },
  totalContent: { ko: '전체 콘텐츠', en: 'Total Content' },
  registrationDate: { ko: '등록일', en: 'Registered' },
  view: { ko: '미리보기', en: 'Preview' },
  archive: { ko: '보관', en: 'Archive' },
  restore: { ko: '복원', en: 'Restore' },
  noResults: { ko: '검색 결과가 없습니다.', en: 'No results found.' },
  noContent: { ko: '콘텐츠가 없습니다.', en: 'No content.' },
  noContentDescription: { ko: '새 콘텐츠를 등록해 보세요.', en: 'Try adding new content.' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  confirmDelete: { ko: '정말 삭제하시겠습니까?', en: 'Are you sure you want to delete?' },
  prev: { ko: '이전', en: 'Prev' },
  next: { ko: '다음', en: 'Next' },
  contentCount: { ko: '개의 콘텐츠', en: ' contents' },
  gridView: { ko: '카드', en: 'Card' },
  listView: { ko: '리스트', en: 'List' },
  columnTitle: { ko: '제목', en: 'Title' },
  columnType: { ko: '유형', en: 'Type' },
  columnDate: { ko: '등록일', en: 'Date' },
  columnFile: { ko: '파일', en: 'File' },
  columnActions: { ko: '액션', en: 'Actions' },
};

export function MyContentPage({ language = 'ko' }: Readonly<MyContentPageProps>) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // 미리보기 모달 상태
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    contentId: number | null;
    contentType: ContentType | null;
    fileName: string | null;
  }>({ isOpen: false, contentId: null, contentType: null, fileName: null });

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API 파라미터 구성
  const params: ContentFilterParams = {
    page,
    size: 12,
    ...(typeFilter !== 'all' && { contentType: typeFilter }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(searchQuery && { keyword: searchQuery }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = useMyContents(params);
  const deleteContent = useDeleteContent();
  const archiveContent = useArchiveContent();
  const restoreContent = useRestoreContent();

  const contents = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  // 통계 계산
  const contentStats = {
    total: totalElements,
    VIDEO: contents.filter((c) => c.contentType === 'VIDEO').length,
    DOCUMENT: contents.filter((c) => c.contentType === 'DOCUMENT').length,
    IMAGE: contents.filter((c) => c.contentType === 'IMAGE').length,
    EXTERNAL_LINK: contents.filter((c) => c.contentType === 'EXTERNAL_LINK').length,
  };


  const handleDelete = async (id: number) => {
    if (!confirm(getText('confirmDelete'))) return;
    try {
      await deleteContent.mutateAsync(id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await archiveContent.mutateAsync(id);
    } catch (err) {
      console.error('Archive failed:', err);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreContent.mutateAsync(id);
    } catch (err) {
      console.error('Restore failed:', err);
    }
  };

  const handlePreview = (content: ContentListResponse) => {
    setPreviewModal({
      isOpen: true,
      contentId: content.id,
      contentType: content.contentType,
      fileName: content.originalFileName,
    });
  };

  const handleClosePreview = () => {
    setPreviewModal({ isOpen: false, contentId: null, contentType: null, fileName: null });
  };

  // 리스트뷰 컬럼 정의 (TanStack Table ColumnDef)
  const columns: ColumnDef<ContentListResponse>[] = useMemo(() => [
    {
      accessorKey: 'originalFileName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getText('columnTitle')} />
      ),
      cell: ({ row }) => (
        <p className="text-sm text-text-primary max-w-md truncate">
          {row.original.originalFileName}
        </p>
      ),
    },
    {
      accessorKey: 'contentType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getText('columnType')} />
      ),
      cell: ({ row }) => (
        <Badge variant={contentTypeBadgeColor[row.original.contentType]}>
          {getText(row.original.contentType)}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={getText('columnDate')} />
      ),
      cell: ({ row }) => (
        <p className="text-sm text-text-secondary">{formatDate(row.original.createdAt)}</p>
      ),
    },
    {
      id: 'file',
      header: getText('columnFile'),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-text-primary truncate max-w-xs">
            {row.original.originalFileName}
          </p>
          <p className="text-xs text-text-secondary">
            {formatFileSize(row.original.fileSize)} • v{row.original.currentVersion}
          </p>
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">{getText('columnActions')}</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handlePreview(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm text-text-primary hover:bg-bg-secondary transition-colors"
            >
              <Eye size={16} />
            </button>
            {item.status === 'ARCHIVED' ? (
              <button
                onClick={() => handleRestore(item.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm text-text-primary hover:bg-bg-secondary transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            ) : (
              <button
                onClick={() => handleArchive(item.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm text-text-primary hover:bg-bg-secondary transition-colors"
              >
                <Archive size={16} />
              </button>
            )}
            <button
              onClick={() => handleDelete(item.id)}
              disabled={deleteContent.isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-status-error/10 transition-colors"
            >
              <Trash2 size={16} className="text-status-error" />
            </button>
          </div>
        );
      },
    },
  ], [language, deleteContent.isPending]);

  const cardLabels = {
    view: getText('view'),
    edit: language === 'ko' ? '수정' : 'Edit',
    registrationDate: getText('registrationDate'),
    archived: getText('ARCHIVED'),
  };

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
      {/* Top Bar - 배경 통일, border 제거 */}
      <div className="sticky top-0 z-10 bg-bg-app">
        <div className="p-6 px-8">
          {/* [DEV] 임시 로그인 버튼 - TODO: 실제 로그인 구현 후 삭제 */}
          <DevLoginButton />

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-text-primary mb-1">{getText('title')}</h1>
              <p className="text-text-secondary text-sm m-0">{getText('subtitle')}</p>
            </div>
            <Button onClick={() => navigate('/tu/teaching/content/create')}>
              <Plus size={20} />
              <span>{getText('createContent')}</span>
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder={getText('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-bg-default border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-btn-neutral"
              />
            </div>
            <Button variant="ghost" onClick={() => setShowFilters(!showFilters)} className="border border-border">
              <Filter size={20} />
              <span>{getText('filter')}</span>
              <ChevronDown size={16} className={cn('transition-transform', showFilters && 'rotate-180')} />
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 border border-border rounded-lg bg-bg-secondary">
              {/* Content Type Filter */}
              <label className="block text-sm text-text-primary mb-2">{getText('contentType')}</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {(['all', 'VIDEO', 'AUDIO', 'DOCUMENT', 'IMAGE', 'EXTERNAL_LINK'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setTypeFilter(type);
                      setPage(0);
                    }}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors',
                      typeFilter === type
                        ? 'bg-btn-neutral text-white'
                        : 'bg-bg-default text-text-primary border border-border hover:bg-bg-secondary'
                    )}
                  >
                    {getText(type)}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <label className="block text-sm text-text-primary mb-2">{getText('contentStatus')}</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'ACTIVE', 'ARCHIVED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setPage(0);
                    }}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors',
                      statusFilter === status
                        ? 'bg-btn-neutral text-white'
                        : 'bg-bg-default text-text-primary border border-border hover:bg-bg-secondary'
                    )}
                  >
                    {getText(status)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 pt-0">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <IconStatCard icon={<LayoutGrid size={20} />} label={getText('totalContent')} value={contentStats.total} />
            <IconStatCard icon={<Video size={20} />} label={getText('VIDEO')} value={contentStats.VIDEO} />
            <IconStatCard icon={<FileIcon size={20} />} label={getText('DOCUMENT')} value={contentStats.DOCUMENT} />
            <IconStatCard icon={<Image size={20} />} label={getText('IMAGE')} value={contentStats.IMAGE} />
            <IconStatCard icon={<Link size={20} />} label={getText('EXTERNAL_LINK')} value={contentStats.EXTERNAL_LINK} />
          </div>

          {/* View Toggle & Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-secondary">
              {contents.length}{getText('contentCount')}
            </p>
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              gridLabel={getText('gridView')}
              listLabel={getText('listView')}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-text-secondary" />
              <span className="ml-2 text-text-secondary">{getText('loading')}</span>
            </div>
          )}

          {/* Empty State - 콘텐츠 자체가 없는 경우 */}
          {!isLoading && totalElements === 0 && !searchQuery && typeFilter === 'all' && statusFilter === 'all' && (
            <div className="text-center py-12 text-text-secondary">
              <FileText size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p className="mb-1">{getText('noContent')}</p>
              <p className="text-sm">{getText('noContentDescription')}</p>
            </div>
          )}

          {/* Empty State - 검색/필터 결과가 없는 경우 */}
          {!isLoading && contents.length === 0 && (searchQuery || typeFilter !== 'all' || statusFilter !== 'all') && (
            <div className="text-center py-12 text-text-secondary">
              <Search size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p>{getText('noResults')}</p>
            </div>
          )}

          {/* Content Grid View */}
          {!isLoading && viewMode === 'grid' && contents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contents.map((content) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  labels={cardLabels}
                  onPreview={() => handlePreview(content)}
                  onEdit={() => navigate(`/tu/teaching/content/${content.id}/edit`)}
                  onDelete={() => handleDelete(content.id)}
                  onNavigateDetail={() => navigate(`/tu/teaching/content/${content.id}`)}
                  isDeleting={deleteContent.isPending}
                />
              ))}
            </div>
          )}

          {/* Content List View */}
          {!isLoading && viewMode === 'list' && contents.length > 0 && (
            <DataTable
              columns={columns}
              data={contents}
              showColumnToggle={false}
              showPagination={false}
              onRowClick={(item) => navigate(`/tu/teaching/content/${item.id}`)}
              labels={{
                noResults: getText('noResults'),
              }}
            />
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                {getText('prev')}
              </Button>
              <span className="px-4 py-2 text-sm text-text-secondary">
                {page + 1} / {data.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= data.totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                {getText('next')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 미리보기 모달 */}
      <ContentPreviewModal
        isOpen={previewModal.isOpen}
        onClose={handleClosePreview}
        contentId={previewModal.contentId}
        contentType={previewModal.contentType}
        fileName={previewModal.fileName ?? undefined}
      />
    </div>
  );
}

