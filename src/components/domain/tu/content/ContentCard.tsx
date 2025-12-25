import {
  Eye,
  Trash2,
  Calendar,
  Video,
  Music,
  FileText,
  Image,
  Link,
  Archive,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge } from '@/components/common';
import type { BadgeColor } from '@/components/common/Badge/Badge.types';
import type { ContentType, ContentListResponse } from '@/types/tu';

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

// 파일 크기 포맷팅
function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return '-';
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

export interface ContentCardLabels {
  view: string;
  archive: string;
  restore: string;
  registrationDate: string;
  archived: string;
}

interface ContentCardProps {
  content: ContentListResponse;
  labels: ContentCardLabels;
  onPreview: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
  onNavigateDetail: () => void;
  isDeleting?: boolean;
  // 추후 썸네일 추가 예정
  // thumbnailUrl?: string;
}

export function ContentCard({
  content,
  labels,
  onPreview,
  onArchive,
  onRestore,
  onDelete,
  onNavigateDetail,
  isDeleting = false,
}: Readonly<ContentCardProps>) {
  const IconComponent = contentTypeIcon[content.contentType];
  const isArchived = content.status === 'ARCHIVED';

  return (
    <div
      className={cn(
        'bg-bg-default border border-border rounded-lg p-5 transition-shadow hover:shadow-md cursor-pointer',
        isArchived && 'opacity-60'
      )}
      onClick={onNavigateDetail}
    >
      {/* Content Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-text-primary text-base leading-snug flex-1 truncate">
            {content.originalFileName}
          </h3>
          {isArchived && (
            <Badge variant="gray" className="ml-2 shrink-0">
              {labels.archived}
            </Badge>
          )}
        </div>
        <Badge variant={contentTypeBadgeColor[content.contentType]}>
          {content.contentType}
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
        <span>{labels.registrationDate}: {formatDate(content.createdAt)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="sm" className="flex-1 border border-border" onClick={onPreview}>
          <Eye size={16} />
          <span>{labels.view}</span>
        </Button>
        {isArchived ? (
          <Button variant="ghost" size="sm" className="flex-1 border border-border" onClick={onRestore}>
            <RotateCcw size={16} />
            <span>{labels.restore}</span>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="flex-1 border border-border" onClick={onArchive}>
            <Archive size={16} />
            <span>{labels.archive}</span>
          </Button>
        )}
        <Button variant="destructive" size="sm" className="px-3" onClick={onDelete} disabled={isDeleting}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}

// 리스트뷰에서 사용할 컬럼 정의 헬퍼
export { contentTypeBadgeColor, contentTypeIcon, formatFileSize, formatDate };
