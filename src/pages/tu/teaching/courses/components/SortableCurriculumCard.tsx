/**
 * Sortable 커리큘럼 카드 컴포넌트
 * @dnd-kit을 사용한 드래그앤드롭 지원
 */
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Film,
  Music,
  Image as ImageIcon,
  ExternalLink,
  Trash2,
  Plus,
  Upload,
  Link as LinkIcon,
  Settings2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Input,
  Textarea,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common';
import type { CurriculumItem, CurriculumContentItem } from '@/types/tu';
import { isCurriculumFolder } from '@/types/tu';

interface SortableCurriculumCardProps {
  language: 'ko' | 'en';
  item: CurriculumItem;
  index: number;
  onUpdate: (itemId: string, updates: Partial<CurriculumItem>) => void;
  onDelete: (itemId: string) => void;
  onAddItem: (
    parentId: string | null,
    type: 'folder' | 'upload' | 'link' | 'existing'
  ) => void;
  onToggleExpand: (itemId: string) => void;
  onReorderChildren: (parentId: string, oldIndex: number, newIndex: number) => void;
}

export function SortableCurriculumCard({
  language,
  item,
  index,
  onUpdate,
  onDelete,
  onAddItem,
  onToggleExpand,
  onReorderChildren,
}: Readonly<SortableCurriculumCardProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isFolder = isCurriculumFolder(item);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'transition-shadow',
        isDragging && 'opacity-50 shadow-lg z-50'
      )}
    >
      {isFolder ? (
        <FolderCard
          language={language}
          item={item}
          index={index}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddItem={onAddItem}
          onToggleExpand={onToggleExpand}
          onReorderChildren={onReorderChildren}
          dragHandleProps={{ ...attributes, ...listeners }}
        />
      ) : (
        <ContentCard
          language={language}
          item={item as CurriculumContentItem}
          onUpdate={onUpdate}
          onDelete={onDelete}
          dragHandleProps={{ ...attributes, ...listeners }}
        />
      )}
    </div>
  );
}

/** 폴더(차시) 카드 */
interface FolderCardProps {
  language: 'ko' | 'en';
  item: CurriculumItem;
  index: number;
  onUpdate: (itemId: string, updates: Partial<CurriculumItem>) => void;
  onDelete: (itemId: string) => void;
  onAddItem: (
    parentId: string | null,
    type: 'folder' | 'upload' | 'link' | 'existing'
  ) => void;
  onToggleExpand: (itemId: string) => void;
  onReorderChildren: (parentId: string, oldIndex: number, newIndex: number) => void;
  dragHandleProps: Record<string, unknown>;
}

function FolderCard({
  language,
  item,
  index,
  onUpdate,
  onDelete,
  onAddItem,
  onToggleExpand,
  onReorderChildren,
  dragHandleProps,
}: Readonly<FolderCardProps>) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const isFolder = isCurriculumFolder(item);
  if (!isFolder) return null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleChildDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = item.children.findIndex((child) => child.id === active.id);
      const newIndex = item.children.findIndex((child) => child.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderChildren(item.id, oldIndex, newIndex);
      }
    }
  };

  const handleDelete = () => {
    const message =
      language === 'ko'
        ? '이 차시와 모든 하위 항목을 삭제하시겠습니까?'
        : 'Delete this lesson and all its contents?';
    if (confirm(message)) {
      onDelete(item.id);
    }
  };

  const texts = {
    lessonNumber: language === 'ko' ? `${index + 1}차시` : `Lesson ${index + 1}`,
    lessonName: language === 'ko' ? '차시명' : 'Lesson Name',
    lessonNamePlaceholder:
      language === 'ko' ? '차시 제목을 입력하세요' : 'Enter lesson title',
    lessonDescription: language === 'ko' ? '차시 설명' : 'Lesson Description',
    lessonDescriptionPlaceholder:
      language === 'ko'
        ? '차시에 대한 간단한 설명을 입력하세요'
        : 'Enter a brief description',
    addContent: language === 'ko' ? '콘텐츠 추가' : 'Add Content',
    addFolder: language === 'ko' ? '하위 폴더' : 'Sub Folder',
    uploadFile: language === 'ko' ? '파일 업로드' : 'Upload File',
    externalLink: language === 'ko' ? '외부 링크' : 'External Link',
    existingContent: language === 'ko' ? '기존 콘텐츠' : 'Existing Content',
    delete: language === 'ko' ? '삭제' : 'Delete',
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
      {/* 차시 헤더 */}
      <div className="flex items-start gap-3 p-4">
        {/* 드래그 핸들 */}
        <button
          {...dragHandleProps}
          className="mt-1 p-1 cursor-grab active:cursor-grabbing hover:bg-bg-tertiary rounded"
        >
          <GripVertical size={18} className="text-text-placeholder" />
        </button>

        {/* 차시 번호 뱃지 */}
        <div className="flex-shrink-0 mt-1">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-btn-brand text-white text-sm font-medium">
            {texts.lessonNumber}
          </span>
        </div>

        {/* 폼 필드들 */}
        <div className="flex-1 space-y-3">
          <Input
            value={item.name}
            onChange={(e) => onUpdate(item.id, { name: e.target.value })}
            placeholder={texts.lessonNamePlaceholder}
            className="bg-bg-default"
          />
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* 확장/축소 토글 */}
          <button
            onClick={() => onToggleExpand(item.id)}
            className="p-1.5 hover:bg-bg-tertiary rounded"
          >
            {item.isExpanded ? (
              <ChevronDown size={18} className="text-text-secondary" />
            ) : (
              <ChevronRight size={18} className="text-text-secondary" />
            )}
          </button>

          {/* 삭제 */}
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-status-error-bg rounded"
            title={texts.delete}
          >
            <Trash2 size={18} className="text-action-delete" />
          </button>
        </div>
      </div>

      {/* 하위 콘텐츠 영역 (확장 시) */}
      {item.isExpanded && (
        <div className="border-t border-border bg-bg-default p-4">
          {/* 하위 항목 목록 */}
          {item.children.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleChildDragEnd}
            >
              <SortableContext
                items={item.children.map((child) => child.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 mb-4">
                  {item.children.map((child) => (
                    <SortableChildItem
                      key={child.id}
                      language={language}
                      item={child}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onAddItem={onAddItem}
                      onToggleExpand={onToggleExpand}
                      onReorderChildren={onReorderChildren}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          {/* 콘텐츠 추가 버튼 영역 */}
          <DropdownMenu open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="w-full p-3 border-2 border-dashed border-border rounded-lg hover:bg-bg-secondary hover:border-border-active transition-colors flex items-center justify-center gap-2 text-text-secondary">
                <Plus size={18} />
                <span>{texts.addContent}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-52">
              <DropdownMenuItem
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onAddItem(item.id, 'folder');
                }}
              >
                <Folder size={16} className="mr-2 text-badge-indigo-text" />
                {texts.addFolder}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onAddItem(item.id, 'upload');
                }}
              >
                <Upload size={16} className="mr-2 text-text-secondary" />
                {texts.uploadFile}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onAddItem(item.id, 'link');
                }}
              >
                <LinkIcon size={16} className="mr-2 text-text-secondary" />
                {texts.externalLink}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onAddItem(item.id, 'existing');
                }}
              >
                <FileText size={16} className="mr-2 text-text-secondary" />
                {texts.existingContent}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

/** 정렬 가능한 하위 항목 */
interface SortableChildItemProps {
  language: 'ko' | 'en';
  item: CurriculumItem;
  onUpdate: (itemId: string, updates: Partial<CurriculumItem>) => void;
  onDelete: (itemId: string) => void;
  onAddItem: (
    parentId: string | null,
    type: 'folder' | 'upload' | 'link' | 'existing'
  ) => void;
  onToggleExpand: (itemId: string) => void;
  onReorderChildren: (parentId: string, oldIndex: number, newIndex: number) => void;
}

function SortableChildItem({
  language,
  item,
  onUpdate,
  onDelete,
  onAddItem,
  onToggleExpand,
  onReorderChildren,
}: Readonly<SortableChildItemProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isFolder = isCurriculumFolder(item);

  if (isFolder) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(isDragging && 'opacity-50')}
      >
        <NestedFolderCard
          language={language}
          item={item}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddItem={onAddItem}
          onToggleExpand={onToggleExpand}
          onReorderChildren={onReorderChildren}
          dragHandleProps={{ ...attributes, ...listeners }}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && 'opacity-50')}
    >
      <ContentCard
        language={language}
        item={item as CurriculumContentItem}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

/** 중첩 폴더 카드 */
interface NestedFolderCardProps {
  language: 'ko' | 'en';
  item: CurriculumItem;
  onUpdate: (itemId: string, updates: Partial<CurriculumItem>) => void;
  onDelete: (itemId: string) => void;
  onAddItem: (
    parentId: string | null,
    type: 'folder' | 'upload' | 'link' | 'existing'
  ) => void;
  onToggleExpand: (itemId: string) => void;
  onReorderChildren: (parentId: string, oldIndex: number, newIndex: number) => void;
  dragHandleProps: Record<string, unknown>;
}

function NestedFolderCard({
  language,
  item,
  onUpdate,
  onDelete,
  onAddItem,
  onToggleExpand,
  onReorderChildren,
  dragHandleProps,
}: Readonly<NestedFolderCardProps>) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const isFolder = isCurriculumFolder(item);
  if (!isFolder) return null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleChildDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = item.children.findIndex((child) => child.id === active.id);
      const newIndex = item.children.findIndex((child) => child.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderChildren(item.id, oldIndex, newIndex);
      }
    }
  };

  const handleDelete = () => {
    const message =
      language === 'ko'
        ? '이 폴더와 모든 하위 항목을 삭제하시겠습니까?'
        : 'Delete this folder and all its contents?';
    if (confirm(message)) {
      onDelete(item.id);
    }
  };

  const texts = {
    addContent: language === 'ko' ? '콘텐츠 추가' : 'Add Content',
    addFolder: language === 'ko' ? '하위 폴더' : 'Sub Folder',
    uploadFile: language === 'ko' ? '파일 업로드' : 'Upload File',
    externalLink: language === 'ko' ? '외부 링크' : 'External Link',
    existingContent: language === 'ko' ? '기존 콘텐츠' : 'Existing Content',
  };

  return (
    <div className="border border-border rounded-lg bg-bg-secondary/50">
      {/* 폴더 헤더 */}
      <div className="flex items-center gap-2 p-3">
        <button
          {...dragHandleProps}
          className="p-1 cursor-grab active:cursor-grabbing hover:bg-bg-tertiary rounded"
        >
          <GripVertical size={16} className="text-text-placeholder" />
        </button>

        <button
          onClick={() => onToggleExpand(item.id)}
          className="p-1 hover:bg-bg-tertiary rounded"
        >
          {item.isExpanded ? (
            <ChevronDown size={16} className="text-text-secondary" />
          ) : (
            <ChevronRight size={16} className="text-text-secondary" />
          )}
        </button>

        {item.isExpanded ? (
          <FolderOpen size={18} className="text-badge-indigo-text" />
        ) : (
          <Folder size={18} className="text-badge-indigo-text" />
        )}

        <Input
          value={item.name}
          onChange={(e) => onUpdate(item.id, { name: e.target.value })}
          className="flex-1 h-8 text-sm bg-bg-default"
          placeholder={language === 'ko' ? '폴더명' : 'Folder name'}
        />

        <button
          onClick={handleDelete}
          className="p-1.5 hover:bg-status-error-bg rounded"
        >
          <Trash2 size={16} className="text-action-delete" />
        </button>
      </div>

      {/* 하위 콘텐츠 */}
      {item.isExpanded && (
        <div className="border-t border-border p-3 bg-bg-default/50">
          {item.children.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleChildDragEnd}
            >
              <SortableContext
                items={item.children.map((child) => child.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 mb-3">
                  {item.children.map((child) => (
                    <SortableChildItem
                      key={child.id}
                      language={language}
                      item={child}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onAddItem={onAddItem}
                      onToggleExpand={onToggleExpand}
                      onReorderChildren={onReorderChildren}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <DropdownMenu open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
            <DropdownMenuTrigger asChild>
              <button className="w-full p-2 border border-dashed border-border rounded hover:bg-bg-secondary transition-colors flex items-center justify-center gap-2 text-text-secondary text-sm">
                <Plus size={16} />
                <span>{texts.addContent}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onAddItem(item.id, 'folder');
                }}
              >
                <Folder size={14} className="mr-2 text-badge-indigo-text" />
                {texts.addFolder}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onAddItem(item.id, 'upload');
                }}
              >
                <Upload size={14} className="mr-2 text-text-secondary" />
                {texts.uploadFile}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onAddItem(item.id, 'link');
                }}
              >
                <LinkIcon size={14} className="mr-2 text-text-secondary" />
                {texts.externalLink}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsAddMenuOpen(false);
                  onAddItem(item.id, 'existing');
                }}
              >
                <FileText size={14} className="mr-2 text-text-secondary" />
                {texts.existingContent}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

/** 콘텐츠 카드 */
interface ContentCardProps {
  language: 'ko' | 'en';
  item: CurriculumContentItem;
  onUpdate: (itemId: string, updates: Partial<CurriculumItem>) => void;
  onDelete: (itemId: string) => void;
  dragHandleProps: Record<string, unknown>;
}

function ContentCard({
  language,
  item,
  onUpdate,
  onDelete,
  dragHandleProps,
}: Readonly<ContentCardProps>) {
  const [showSettings, setShowSettings] = useState(false);

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'VIDEO':
        return <Film size={16} className="text-status-info" />;
      case 'AUDIO':
        return <Music size={16} className="text-badge-purple-text" />;
      case 'IMAGE':
        return <ImageIcon size={16} className="text-badge-green-text" />;
      case 'EXTERNAL_LINK':
        return <ExternalLink size={16} className="text-badge-blue-text" />;
      default:
        return <FileText size={16} className="text-text-secondary" />;
    }
  };

  const handleDelete = () => {
    const message =
      language === 'ko'
        ? '이 콘텐츠를 삭제하시겠습니까?'
        : 'Delete this content?';
    if (confirm(message)) {
      onDelete(item.id);
    }
  };

  const texts = {
    displayName: language === 'ko' ? '표시명' : 'Display Name',
    displayNamePlaceholder:
      language === 'ko'
        ? '강의 내 표시될 이름 (선택)'
        : 'Name shown in course (optional)',
    description: language === 'ko' ? '설명' : 'Description',
    descriptionPlaceholder:
      language === 'ko'
        ? '콘텐츠 설명 (선택)'
        : 'Content description (optional)',
  };

  return (
    <div className="border border-border rounded-lg bg-bg-default">
      {/* 콘텐츠 행 */}
      <div className="flex items-center gap-2 p-3">
        <button
          {...dragHandleProps}
          className="p-1 cursor-grab active:cursor-grabbing hover:bg-bg-secondary rounded"
        >
          <GripVertical size={16} className="text-text-placeholder" />
        </button>

        {getContentIcon(item.contentType)}

        <div className="flex-1 min-w-0">
          <span className="text-sm text-text-primary truncate block">
            {item.displayName || item.originalFileName || item.name}
          </span>
          {item.displayName && item.originalFileName && (
            <span className="text-xs text-text-placeholder">
              ({item.originalFileName})
            </span>
          )}
        </div>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            'p-1.5 rounded hover:bg-bg-secondary',
            showSettings && 'bg-bg-secondary'
          )}
        >
          <Settings2 size={16} className="text-text-secondary" />
        </button>

        <button
          onClick={handleDelete}
          className="p-1.5 hover:bg-status-error-bg rounded"
        >
          <Trash2 size={16} className="text-action-delete" />
        </button>
      </div>

      {/* 설정 패널 */}
      {showSettings && (
        <div className="border-t border-border p-3 bg-bg-secondary/30 space-y-3">
          <Input
            label={texts.displayName}
            value={item.displayName || ''}
            onChange={(e) =>
              onUpdate(item.id, {
                displayName: e.target.value,
              } as Partial<CurriculumContentItem>)
            }
            placeholder={texts.displayNamePlaceholder}
            className="bg-bg-default"
          />
          <Textarea
            label={texts.description}
            value={item.description || ''}
            onChange={(e) =>
              onUpdate(item.id, {
                description: e.target.value,
              } as Partial<CurriculumContentItem>)
            }
            placeholder={texts.descriptionPlaceholder}
            rows={2}
            className="bg-bg-default resize-none"
          />
        </div>
      )}
    </div>
  );
}
