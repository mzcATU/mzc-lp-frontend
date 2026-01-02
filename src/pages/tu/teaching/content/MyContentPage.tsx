import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
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
  FolderTree,
  X,
  Folder,
  FolderInput,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge, ViewToggle, DataTable, DataTableColumnHeader, IconStatCard, Checkbox } from '@/components/common';
import { useMyContents, useDeleteContent, useArchiveContent, useRestoreContent, useContentFolderTree } from '@/hooks/tu';
import { learningObjectService } from '@/services/tu';
import {
  ContentCard,
  ContentPreviewModal,
  contentTypeBadgeColor,
  formatFileSize,
  formatDate,
} from '@/components/domain/tu/content';
import { FolderManagementPanel, FolderSelectModal } from '@/components/domain/tu/folder';
import type { ContentType, ContentStatus, ContentListResponse, ContentFilterParams, ContentFolderTreeNode } from '@/types/tu';

// 폴더 트리에서 ID로 폴더 찾기
function findFolderById(folders: ContentFolderTreeNode[], id: number): ContentFolderTreeNode | null {
  for (const folder of folders) {
    if (folder.id === id) return folder;
    if (folder.children.length > 0) {
      const found = findFolderById(folder.children, id);
      if (found) return found;
    }
  }
  return null;
}

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
  deleteFailedInUse: { ko: '이 콘텐츠는 강의에 포함되어 있어 삭제할 수 없습니다.', en: 'This content cannot be deleted because it is included in a course.' },
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
  organizeManage: { ko: '분류 및 관리', en: 'Organize' },
  moveToFolder: { ko: '폴더로 이동', en: 'Move to Folder' },
  selectedCount: { ko: '{count}개 선택됨', en: '{count} selected' },
  selectAll: { ko: '전체 선택', en: 'Select All' },
  deselectAll: { ko: '선택 해제', en: 'Deselect All' },
  moveFailed: { ko: '일부 콘텐츠 이동에 실패했습니다.', en: 'Failed to move some contents.' },
  moveSuccess: { ko: '콘텐츠가 이동되었습니다.', en: 'Contents moved successfully.' },
};

export function MyContentPage({ language = 'ko' }: Readonly<MyContentPageProps>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    downloadable: boolean;
  }>({ isOpen: false, contentId: null, contentType: null, fileName: null, downloadable: true });

  // 폴더 관리 패널 상태
  const [isFolderPanelOpen, setIsFolderPanelOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  // 콘텐츠 선택 상태
  const [selectedContentIds, setSelectedContentIds] = useState<Set<number>>(new Set());
  const [isFolderSelectModalOpen, setIsFolderSelectModalOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API 파라미터 구성
  const params: ContentFilterParams = {
    page,
    size: 12,
    ...(typeFilter !== 'all' && { contentType: typeFilter }),
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(searchQuery && { keyword: searchQuery }),
    ...(selectedFolderId && { folderId: selectedFolderId }),
  };

  // React Query 훅 사용
  const { data, isLoading, error } = useMyContents(params);
  const { data: folderTree = [] } = useContentFolderTree();
  const deleteContent = useDeleteContent();
  const archiveContent = useArchiveContent();
  const restoreContent = useRestoreContent();

  // 선택된 폴더 정보
  const selectedFolder = selectedFolderId ? findFolderById(folderTree, selectedFolderId) : null;

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
    } catch (err: unknown) {
      console.error('Delete failed:', err);
      // 강의에 포함된 콘텐츠 삭제 시도 시 에러 처리
      const error = err as { response?: { data?: { error?: { code?: string } } } };
      if (error.response?.data?.error?.code === 'CT010') {
        alert(getText('deleteFailedInUse'));
      } else {
        alert(getText('error'));
      }
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
      downloadable: content.downloadable ?? true,
    });
  };

  const handleClosePreview = () => {
    setPreviewModal({ isOpen: false, contentId: null, contentType: null, fileName: null, downloadable: true });
  };

  // 콘텐츠 선택 핸들러
  const handleSelectContent = (contentId: number, checked: boolean) => {
    setSelectedContentIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(contentId);
      } else {
        next.delete(contentId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedContentIds.size === contents.length) {
      setSelectedContentIds(new Set());
    } else {
      setSelectedContentIds(new Set(contents.map((c) => c.id)));
    }
  };

  // 폴더 이동 핸들러
  const handleMoveToFolder = async (folderId: number | null) => {
    if (selectedContentIds.size === 0) return;

    setIsMoving(true);
    const contentIds = Array.from(selectedContentIds);
    const errors: number[] = [];

    try {
      // 각 콘텐츠에 대해 LO를 조회하고 폴더 이동
      for (const contentId of contentIds) {
        try {
          // Content ID로 LO 조회
          const lo = await learningObjectService.getLearningObjectByContentId(contentId);
          // LO 폴더 이동
          await learningObjectService.moveToFolder(lo.learningObjectId, { folderId });
        } catch {
          errors.push(contentId);
        }
      }

      if (errors.length > 0) {
        console.error('Failed to move contents:', errors);
        alert(getText('moveFailed'));
      }

      // 성공적으로 이동된 항목이 있으면 목록 새로고침
      await queryClient.invalidateQueries({ queryKey: ['contents'] });
      await queryClient.invalidateQueries({ queryKey: ['contentFolders'] });
      setSelectedContentIds(new Set());
      setIsFolderSelectModalOpen(false);
    } finally {
      setIsMoving(false);
    }
  };

  // 리스트뷰 컬럼 정의 (TanStack Table ColumnDef)
  const columns: ColumnDef<ContentListResponse>[] = useMemo(() => [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={contents.length > 0 && selectedContentIds.size === contents.length}
          onCheckedChange={handleSelectAll}
          aria-label={getText('selectAll')}
        />
      ),
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedContentIds.has(row.original.id)}
            onCheckedChange={(checked) => handleSelectContent(row.original.id, !!checked)}
            aria-label={`Select ${row.original.originalFileName}`}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
  ], [language, deleteContent.isPending, contents, selectedContentIds]);

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

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-text-primary mb-1">{getText('title')}</h1>
              <p className="text-text-secondary text-sm m-0">{getText('subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="border border-border"
                onClick={() => setIsFolderPanelOpen(true)}
              >
                <FolderTree size={20} />
                <span>{getText('organizeManage')}</span>
              </Button>
              <Button onClick={() => navigate('/tu/teaching/content/create')}>
                <Plus size={20} />
                <span>{getText('createContent')}</span>
              </Button>
            </div>
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

          {/* 선택된 폴더 표시 */}
          {selectedFolder && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-text-secondary">
                {language === 'ko' ? '폴더:' : 'Folder:'}
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-btn-neutral/10 border border-btn-neutral/30 rounded-full">
                <Folder size={14} className="text-btn-neutral" />
                <span className="text-sm text-text-primary">{selectedFolder.folderName}</span>
                <button
                  onClick={() => {
                    setSelectedFolderId(null);
                    setPage(0);
                  }}
                  className="ml-1 p-0.5 hover:bg-btn-neutral/20 rounded-full transition-colors"
                >
                  <X size={14} className="text-text-secondary" />
                </button>
              </div>
            </div>
          )}

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

          {/* View Toggle & Count / Selection Actions */}
          <div className="flex items-center justify-between mb-4">
            {selectedContentIds.size > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-action-primary">
                  {getText('selectedCount').replace('{count}', String(selectedContentIds.size))}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFolderSelectModalOpen(true)}
                >
                  <FolderInput size={16} />
                  <span>{getText('moveToFolder')}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedContentIds(new Set())}
                >
                  {getText('deselectAll')}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-text-secondary">
                {contents.length}{getText('contentCount')}
              </p>
            )}
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
          {!isLoading && totalElements === 0 && !searchQuery && typeFilter === 'all' && statusFilter === 'all' && !selectedFolderId && (
            <div className="text-center py-12 text-text-secondary">
              <FileText size={48} className="mx-auto mb-3 text-text-placeholder" />
              <p className="mb-1">{getText('noContent')}</p>
              <p className="text-sm">{getText('noContentDescription')}</p>
            </div>
          )}

          {/* Empty State - 검색/필터 결과가 없는 경우 */}
          {!isLoading && contents.length === 0 && (searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || selectedFolderId) && (
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
        downloadable={previewModal.downloadable}
      />

      {/* 폴더 관리 슬라이드 패널 */}
      <FolderManagementPanel
        isOpen={isFolderPanelOpen}
        onClose={() => setIsFolderPanelOpen(false)}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        language={language}
      />

      {/* 폴더 이동 모달 */}
      <FolderSelectModal
        isOpen={isFolderSelectModalOpen}
        onClose={() => setIsFolderSelectModalOpen(false)}
        onSelect={handleMoveToFolder}
        selectedCount={selectedContentIds.size}
        isMoving={isMoving}
        language={language}
      />
    </div>
  );
}

