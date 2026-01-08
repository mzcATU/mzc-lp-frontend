import {
  Eye,
  Trash2,
  Calendar,
  Video,
  Music,
  FileText,
  Image,
  Link,
  Pencil,
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
  edit: string;
  registrationDate: string;
  archived: string;
}

interface ContentCardProps {
  content: ContentListResponse;
  labels: ContentCardLabels;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onNavigateDetail: () => void;
  isDeleting?: boolean;
  thumbnailUrl?: string;
}

export const ContentCard = ({
  content,
  labels,
  onPreview,
  onEdit,
  onDelete,
  onNavigateDetail,
  isDeleting = false,
  thumbnailUrl,
}: Readonly<ContentCardProps>) => {
  const IconComponent = contentTypeIcon[content.contentType];
  const isArchived = content.status === 'ARCHIVED';

  // 썸네일 URL 결정: prop > customThumbnailPath > thumbnailPath
  const staticBaseUrl = import.meta.env.VITE_STATIC_BASE_URL || '';
  const resolvedThumbnailUrl = thumbnailUrl
    || (content.customThumbnailPath ? `${staticBaseUrl}${content.customThumbnailPath}` : null)
    || (content.thumbnailPath ? `${staticBaseUrl}${content.thumbnailPath}` : null);

  return (
    <div
      className={cn(
        'bg-bg-default border border-border rounded-lg overflow-hidden cursor-pointer',
        isArchived && 'opacity-60'
      )}
      onClick={onNavigateDetail}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-bg-secondary">
        {resolvedThumbnailUrl ? (
          <img
            src={resolvedThumbnailUrl}
            alt={content.originalFileName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconComponent size={48} className="text-text-placeholder" />
          </div>
        )}
        {/* Content Type badge - 좌상단 */}
        <div className="absolute top-2 left-2">
          <Badge variant={contentTypeBadgeColor[content.contentType]}>
            {content.contentType}
          </Badge>
        </div>
        {/* Duration badge for video/audio - 우하단 */}
        {content.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
            {Math.floor(content.duration / 60)}:{String(content.duration % 60).padStart(2, '0')}
          </div>
        )}
        {/* Archived badge overlay - 우상단 */}
        {isArchived && (
          <div className="absolute top-2 right-2">
            <Badge variant="gray">{labels.archived}</Badge>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4">
        {/* File Name */}
        <h3 className="text-text-primary text-base font-medium leading-snug truncate mb-3">
          {content.originalFileName}
        </h3>

        {/* File Info - 파일 관리 도구 느낌 */}
        <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
          <IconComponent size={14} />
          <span>{formatFileSize(content.fileSize)}</span>
          <span>•</span>
          <span>v{content.currentVersion}</span>
        </div>

        {/* Registration Date */}
        <div className="flex items-center gap-2 mb-4 text-xs text-text-secondary">
          <Calendar size={14} />
          <span>{labels.registrationDate}: {formatDate(content.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="flex-1 border border-border" onClick={onPreview}>
            <Eye size={16} />
            <span>{labels.view}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 border border-border" onClick={onEdit}>
            <Pencil size={16} />
            <span>{labels.edit}</span>
          </Button>
          <Button variant="destructive" size="sm" className="px-3" onClick={onDelete} disabled={isDeleting}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

// 리스트뷰에서 사용할 컬럼 정의 헬퍼
export { contentTypeBadgeColor, contentTypeIcon, formatFileSize, formatDate };
