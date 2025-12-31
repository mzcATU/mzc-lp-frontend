/**
 * 커리큘럼 항목 카드 컴포넌트
 * 폴더와 콘텐츠를 통합 처리하고 재귀적으로 트리를 렌더링
 */
import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Film,
  Music,
  Image,
  ExternalLink,
  Trash2,
  Settings2,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Input, Textarea } from '@/components/common';
import type { CurriculumItem, CurriculumContentItem } from '@/types/tu';
import { isCurriculumFolder, isCurriculumContent } from '@/types/tu';
import { translations, type TranslationKey } from './courseCreate.constants';
import { AddCurriculumItemButton } from './AddCurriculumItemButton';

/** 깊이당 들여쓰기 픽셀 */
const INDENT_PER_DEPTH = 24;
/** 최대 깊이 (백엔드 CourseItem 기준 0~9) */
const MAX_DEPTH = 9;

interface CurriculumItemCardProps {
  language: 'ko' | 'en';
  item: CurriculumItem;
  onUpdate: (itemId: string, updates: Partial<CurriculumItem>) => void;
  onDelete: (itemId: string) => void;
  onAddItem: (parentId: string | null, type: 'folder' | 'upload' | 'link' | 'existing') => void;
  onToggleExpand: (itemId: string) => void;
  /** 드래그 핸들러 (선택적) */
  onDragStart?: (itemId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (targetId: string) => void;
  draggedItemId?: string | null;
}

export function CurriculumItemCard({
  language,
  item,
  onUpdate,
  onDelete,
  onAddItem,
  onToggleExpand,
  onDragStart,
  onDragOver,
  onDrop,
  draggedItemId,
}: Readonly<CurriculumItemCardProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  const paddingLeft = item.depth * INDENT_PER_DEPTH;
  const canAddChild = item.depth < MAX_DEPTH;
  const isFolder = isCurriculumFolder(item);
  const isContent = isCurriculumContent(item);
  const isDragged = draggedItemId === item.id;

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'VIDEO':
        return <Film size={16} className="text-text-secondary" />;
      case 'AUDIO':
        return <Music size={16} className="text-text-secondary" />;
      case 'IMAGE':
        return <Image size={16} className="text-text-secondary" />;
      case 'EXTERNAL_LINK':
        return <ExternalLink size={16} className="text-text-secondary" />;
      default:
        return <FileText size={16} className="text-text-secondary" />;
    }
  };

  const handleNameChange = (newName: string) => {
    onUpdate(item.id, { name: newName });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = isFolder
      ? '이 폴더와 하위 항목을 모두 삭제하시겠습니까?'
      : '이 항목을 삭제하시겠습니까?';
    if (confirm(message)) {
      onDelete(item.id);
    }
  };

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={() => onDragStart?.(item.id)}
      onDragOver={onDragOver}
      onDrop={() => onDrop?.(item.id)}
      className={cn('transition-opacity', isDragged && 'opacity-50')}
    >
      {/* 항목 행 */}
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-md border border-transparent',
          'hover:bg-bg-secondary hover:border-border',
          isFolder && item.isExpanded && 'bg-bg-secondary border-border'
        )}
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
      >
        {/* 드래그 핸들 */}
        {onDragStart && (
          <GripVertical size={16} className="text-text-placeholder cursor-move flex-shrink-0" />
        )}

        {/* 토글/아이콘 */}
        {isFolder ? (
          <button
            onClick={() => onToggleExpand(item.id)}
            className="p-1 hover:bg-bg-tertiary rounded flex-shrink-0"
          >
            {item.isExpanded ? (
              <>
                <ChevronDown size={16} className="text-text-secondary" />
              </>
            ) : (
              <ChevronRight size={16} className="text-text-secondary" />
            )}
          </button>
        ) : (
          <div className="w-7 flex-shrink-0" /> // 콘텐츠는 토글 없음, 정렬용 spacer
        )}

        {/* 폴더/콘텐츠 아이콘 */}
        <div className="flex-shrink-0">
          {isFolder ? (
            item.isExpanded ? (
              <FolderOpen size={18} className="text-badge-indigo-text" />
            ) : (
              <Folder size={18} className="text-badge-indigo-text" />
            )
          ) : (
            isContent && getContentIcon(item.contentType)
          )}
        </div>

        {/* 이름 */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={item.name}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
              autoFocus
              className="h-7 text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-text-primary truncate text-left hover:underline bg-transparent border-none cursor-text p-0 w-full"
            >
              {isContent && item.displayName ? (
                <>
                  <span>{item.displayName}</span>
                  <span className="text-text-placeholder ml-2 text-xs">
                    ({item.originalFileName})
                  </span>
                </>
              ) : (
                item.name || (isFolder ? '새 폴더' : '새 항목')
              )}
            </button>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* 콘텐츠 설정 (displayName/description) */}
          {isContent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
              className={cn(
                'p-1.5 rounded hover:bg-bg-tertiary',
                showSettings && 'bg-bg-tertiary'
              )}
              title={getText('contentDisplayName')}
            >
              <Settings2 size={14} className="text-text-secondary" />
            </button>
          )}

          {/* 삭제 */}
          <button
            onClick={handleDelete}
            className="p-1.5 rounded hover:bg-status-error-bg"
            title="삭제"
          >
            <Trash2 size={14} className="text-action-delete" />
          </button>
        </div>
      </div>

      {/* 콘텐츠 설정 패널 (확장 시) */}
      {isContent && showSettings && (
        <div
          className="ml-4 mt-1 mb-2 p-3 bg-bg-default border border-border rounded-md flex flex-col gap-3"
          style={{ marginLeft: `${paddingLeft + 48}px` }}
        >
          <Input
            label={getText('contentDisplayName')}
            value={item.displayName || ''}
            onChange={(e) =>
              onUpdate(item.id, { displayName: e.target.value } as Partial<CurriculumContentItem>)
            }
            placeholder={getText('contentDisplayNamePlaceholder')}
          />
          <Textarea
            label={getText('contentDescription')}
            value={item.description || ''}
            onChange={(e) =>
              onUpdate(item.id, { description: e.target.value } as Partial<CurriculumContentItem>)
            }
            placeholder={getText('contentDescriptionPlaceholder')}
            rows={2}
          />
        </div>
      )}

      {/* 하위 항목 (폴더이고 확장된 경우) */}
      {isFolder && item.isExpanded && (
        <div className="ml-2">
          {item.children.map((child) => (
            <CurriculumItemCard
              key={child.id}
              language={language}
              item={child}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onAddItem={onAddItem}
              onToggleExpand={onToggleExpand}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              draggedItemId={draggedItemId}
            />
          ))}

          {/* 하위 항목 추가 버튼 (depth 제한 내) */}
          {canAddChild && (
            <div
              className="py-2"
              style={{ paddingLeft: `${paddingLeft + INDENT_PER_DEPTH + 12}px` }}
            >
              <AddCurriculumItemButton
                language={language}
                parentId={item.id}
                onAddFolder={(parentId) => onAddItem(parentId, 'folder')}
                onUpload={(parentId) => onAddItem(parentId, 'upload')}
                onLink={(parentId) => onAddItem(parentId, 'link')}
                onExisting={(parentId) => onAddItem(parentId, 'existing')}
                variant="dashed"
                className="text-sm"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
