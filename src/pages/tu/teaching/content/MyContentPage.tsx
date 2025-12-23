import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  FileText,
  Calendar,
  ChevronDown,
  Video,
  Music,
  Image,
  Link,
  Archive,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge } from '@/components/common';
import type { BadgeColor } from '@/components/common/Badge/Badge.types';
import { useMyContents, useDeleteContent, useArchiveContent, useRestoreContent } from '@/hooks/tu';
import { contentService } from '@/services/tu';
import type { ContentType, ContentStatus, ContentListResponse, ContentFilterParams } from '@/types/tu';

// 콘텐츠 타입별 Badge 컬러 매핑
const contentTypeBadgeColor: Record<ContentType, BadgeColor> = {
  VIDEO: 'blue',
  AUDIO: 'purple',
  DOCUMENT: 'orange',
  IMAGE: 'green',
  EXTERNAL_LINK: 'gray',
};

// 콘텐츠 타입별 아이콘
const contentTypeIcon: Record<ContentType, React.ElementType> = {
  VIDEO: Video,
  AUDIO: Music,
  DOCUMENT: FileText,
  IMAGE: Image,
  EXTERNAL_LINK: Link,
};

interface MyContentPageProps {
  language?: 'ko' | 'en';
}

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
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  confirmDelete: { ko: '정말 삭제하시겠습니까?', en: 'Are you sure you want to delete?' },
  prev: { ko: '이전', en: 'Prev' },
  next: { ko: '다음', en: 'Next' },
};

// 파일 크기 포맷팅
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// 날짜 포맷팅
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function MyContentPage({ language = 'ko' }: Readonly<MyContentPageProps>) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

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

  const handlePreview = (id: number) => {
    window.open(contentService.getPreviewUrl(id), '_blank');
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
      {/* Top Bar */}
      <div className="border-b border-border bg-bg-default sticky top-0 z-10">
        <div className="p-6 px-8">
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
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary"
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
        <div className="p-6 px-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label={getText('totalContent')} value={contentStats.total} />
            <StatCard label={getText('VIDEO')} value={contentStats.VIDEO} />
            <StatCard label={getText('DOCUMENT')} value={contentStats.DOCUMENT} />
            <StatCard label={getText('IMAGE')} value={contentStats.IMAGE} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-text-secondary" />
              <span className="ml-2 text-text-secondary">{getText('loading')}</span>
            </div>
          )}

          {/* Content Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contents.length === 0 ? (
                <div className="col-span-full text-center py-12 text-text-secondary">
                  <FileText size={48} className="mx-auto mb-3 text-text-placeholder" />
                  <p>{getText('noResults')}</p>
                </div>
              ) : (
                contents.map((content) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    getText={getText}
                    onPreview={() => handlePreview(content.id)}
                    onArchive={() => handleArchive(content.id)}
                    onRestore={() => handleRestore(content.id)}
                    onDelete={() => handleDelete(content.id)}
                    isDeleting={deleteContent.isPending}
                  />
                ))
              )}
            </div>
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
    </div>
  );
}

// 통계 카드 컴포넌트
function StatCard({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="bg-bg-default border border-border rounded-lg p-4">
      <p className="text-sm text-text-secondary mb-1">{label}</p>
      <p className="text-2xl text-text-primary font-semibold m-0">{value}</p>
    </div>
  );
}

// 콘텐츠 카드 컴포넌트
interface ContentCardProps {
  content: ContentListResponse;
  getText: (key: keyof typeof t) => string;
  onPreview: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function ContentCard({
  content,
  getText,
  onPreview,
  onArchive,
  onRestore,
  onDelete,
  isDeleting,
}: Readonly<ContentCardProps>) {
  const IconComponent = contentTypeIcon[content.contentType];
  const isArchived = content.status === 'ARCHIVED';

  return (
    <div
      className={cn(
        'bg-bg-default border border-border rounded-lg p-5 transition-shadow hover:shadow-md',
        isArchived && 'opacity-60'
      )}
    >
      {/* Content Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-text-primary text-base leading-snug flex-1 truncate">
            {content.originalFileName}
          </h3>
          {isArchived && (
            <Badge variant="gray" className="ml-2 shrink-0">
              {getText('ARCHIVED')}
            </Badge>
          )}
        </div>
        <Badge variant={contentTypeBadgeColor[content.contentType]}>
          {getText(content.contentType)}
        </Badge>
      </div>

      {/* File Info */}
      <div className="mb-4 p-3 rounded-lg bg-bg-app">
        <div className="flex items-center gap-2 mb-2">
          <IconComponent size={16} className="text-text-secondary" />
          <span className="text-sm text-text-primary truncate">{content.originalFileName}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span>{formatFileSize(content.fileSize)}</span>
          {content.duration && (
            <>
              <span>•</span>
              <span>{Math.floor(content.duration / 60)}:{String(content.duration % 60).padStart(2, '0')}</span>
            </>
          )}
          <span>•</span>
          <span>v{content.currentVersion}</span>
        </div>
      </div>

      {/* Registration Date */}
      <div className="flex items-center gap-2 mb-4 text-sm text-text-secondary">
        <Calendar size={16} />
        <span>{getText('registrationDate')}: {formatDate(content.createdAt)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="flex-1 border border-border" onClick={onPreview}>
          <Eye size={16} />
          <span>{getText('view')}</span>
        </Button>
        {isArchived ? (
          <Button variant="ghost" size="sm" className="flex-1 border border-border" onClick={onRestore}>
            <RotateCcw size={16} />
            <span>{getText('restore')}</span>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="flex-1 border border-border" onClick={onArchive}>
            <Archive size={16} />
            <span>{getText('archive')}</span>
          </Button>
        )}
        <Button variant="destructive" size="sm" className="px-3" onClick={onDelete} disabled={isDeleting}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
