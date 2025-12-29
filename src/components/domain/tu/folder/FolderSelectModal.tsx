/**
 * 폴더 선택 모달 컴포넌트
 * 콘텐츠를 이동할 폴더를 선택하는 모달
 */
import { useState } from 'react';
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/common/AlertDialog';
import { useContentFolderTree } from '@/hooks/tu';
import type { ContentFolderTreeNode } from '@/types/tu';

interface FolderSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (folderId: number | null) => void;
  selectedCount: number;
  isMoving?: boolean;
  language?: 'ko' | 'en';
}

interface FolderNodeProps {
  node: ContentFolderTreeNode;
  level: number;
  selectedFolderId: number | null;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
}

const t = {
  title: { ko: '폴더로 이동', en: 'Move to Folder' },
  description: { ko: '{count}개의 콘텐츠를 이동할 폴더를 선택하세요.', en: 'Select a folder to move {count} content(s) to.' },
  root: { ko: '루트 (분류 없음)', en: 'Root (No Folder)' },
  cancel: { ko: '취소', en: 'Cancel' },
  move: { ko: '이동', en: 'Move' },
  moving: { ko: '이동 중...', en: 'Moving...' },
  loading: { ko: '폴더 로딩 중...', en: 'Loading folders...' },
  noFolders: { ko: '생성된 폴더가 없습니다.', en: 'No folders created.' },
  items: { ko: '개 항목', en: ' items' },
};

function FolderNode({
  node,
  level,
  selectedFolderId,
  expandedIds,
  onToggle,
  onSelect,
}: FolderNodeProps) {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedFolderId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 py-2 px-2 rounded-md cursor-pointer transition-colors',
          isSelected
            ? 'bg-action-primary/10 text-action-primary border border-action-primary'
            : 'hover:bg-bg-secondary text-text-primary border border-transparent'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
      >
        {/* 토글 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggle(node.id);
          }}
          className={cn(
            'p-0.5 rounded hover:bg-bg-tertiary',
            !hasChildren && 'invisible'
          )}
        >
          {isExpanded ? (
            <ChevronDown size={14} className="text-text-secondary" />
          ) : (
            <ChevronRight size={14} className="text-text-secondary" />
          )}
        </button>

        {/* 폴더 아이콘 & 이름 */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {isExpanded ? (
            <FolderOpen size={16} className="shrink-0 text-amber-500" />
          ) : (
            <Folder size={16} className="shrink-0 text-amber-500" />
          )}
          <span className="text-sm truncate">{node.folderName}</span>
          <span className="text-xs text-text-tertiary">
            ({node.itemCount})
          </span>
        </div>
      </div>

      {/* 자식 노드 */}
      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <FolderNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderSelectModal({
  isOpen,
  onClose,
  onSelect,
  selectedCount,
  isMoving = false,
  language = 'ko',
}: FolderSelectModalProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const { data: folders = [], isLoading } = useContentFolderTree();

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const handleToggle = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onSelect(selectedFolderId);
  };

  const handleClose = () => {
    setSelectedFolderId(null);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{getText('title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {getText('description').replace('{count}', String(selectedCount))}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-text-secondary" />
              <span className="ml-2 text-sm text-text-secondary">{getText('loading')}</span>
            </div>
          ) : (
            <div className="space-y-1">
              {/* 루트 (분류 없음) 옵션 */}
              <div
                className={cn(
                  'flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer transition-colors',
                  selectedFolderId === null
                    ? 'bg-action-primary/10 text-action-primary border border-action-primary'
                    : 'hover:bg-bg-secondary text-text-primary border border-transparent'
                )}
                onClick={() => setSelectedFolderId(null)}
              >
                <Folder size={16} className="text-text-secondary" />
                <span className="text-sm">{getText('root')}</span>
              </div>

              {/* 폴더 트리 */}
              {folders.length === 0 ? (
                <div className="py-4 text-center text-sm text-text-tertiary">
                  {getText('noFolders')}
                </div>
              ) : (
                folders.map((folder) => (
                  <FolderNode
                    key={folder.id}
                    node={folder}
                    level={0}
                    selectedFolderId={selectedFolderId}
                    expandedIds={expandedIds}
                    onToggle={handleToggle}
                    onSelect={setSelectedFolderId}
                  />
                ))
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isMoving}>
            {getText('cancel')}
          </AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={isMoving}>
            {isMoving ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                {getText('moving')}
              </>
            ) : (
              getText('move')
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
