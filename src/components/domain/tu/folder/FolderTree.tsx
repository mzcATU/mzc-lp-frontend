/**
 * 콘텐츠 폴더 트리 컴포넌트
 * 폴더 계층 구조를 트리 형태로 표시하고 CRUD 기능 제공
 */
import { useState } from 'react';
import {
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  MoreVertical,
  FolderPlus,
  Loader2,
  MoveRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu';
import type { ContentFolderTreeNode } from '@/types/tu';

interface FolderTreeProps {
  folders: ContentFolderTreeNode[];
  selectedFolderId: number | null;
  onSelectFolder: (folderId: number | null) => void;
  onCreateFolder: (parentId: number | null) => void;
  onRenameFolder: (folder: ContentFolderTreeNode) => void;
  onDeleteFolder: (folder: ContentFolderTreeNode) => void;
  onMoveFolder?: (folder: ContentFolderTreeNode) => void;
  isLoading?: boolean;
  language?: 'ko' | 'en';
}

interface FolderNodeProps {
  node: ContentFolderTreeNode;
  level: number;
  selectedFolderId: number | null;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  onSelect: (id: number) => void;
  onCreateFolder: (parentId: number) => void;
  onRenameFolder: (folder: ContentFolderTreeNode) => void;
  onDeleteFolder: (folder: ContentFolderTreeNode) => void;
  onMoveFolder?: (folder: ContentFolderTreeNode) => void;
  language: 'ko' | 'en';
}

const t = {
  allContent: { ko: '전체 콘텐츠', en: 'All Content' },
  createFolder: { ko: '폴더 생성', en: 'Create Folder' },
  createSubfolder: { ko: '하위 폴더 생성', en: 'Create Subfolder' },
  rename: { ko: '이름 변경', en: 'Rename' },
  move: { ko: '이동', en: 'Move' },
  delete: { ko: '삭제', en: 'Delete' },
  items: { ko: '개 항목', en: ' items' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  noFolders: { ko: '폴더가 없습니다', en: 'No folders' },
  maxDepthReached: { ko: '최대 3단계까지 생성 가능', en: 'Max 3 levels allowed' },
};

function FolderNode({
  node,
  level,
  selectedFolderId,
  expandedIds,
  onToggle,
  onSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  language,
}: FolderNodeProps) {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedFolderId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const canCreateSubfolder = node.depth < 2; // 최대 3단계 (depth 0~2)

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer transition-colors',
          isSelected
            ? 'bg-action-primary/10 text-action-primary'
            : 'hover:bg-bg-secondary text-text-primary'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
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
        <div
          className="flex-1 flex items-center gap-2 min-w-0"
          onClick={() => onSelect(node.id)}
        >
          {isExpanded ? (
            <FolderOpen size={16} className="shrink-0 text-amber-500" />
          ) : (
            <Folder size={16} className="shrink-0 text-amber-500" />
          )}
          <span className="text-sm truncate">{node.folderName}</span>
          <span className="text-xs text-text-tertiary">
            ({node.itemCount}{getText('items')})
          </span>
        </div>

        {/* 액션 메뉴 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-bg-tertiary transition-opacity"
            >
              <MoreVertical size={14} className="text-text-secondary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {canCreateSubfolder ? (
              <DropdownMenuItem onClick={() => onCreateFolder(node.id)}>
                <FolderPlus size={14} className="mr-2" />
                {getText('createSubfolder')}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled>
                <FolderPlus size={14} className="mr-2 text-text-tertiary" />
                <span className="text-text-tertiary">{getText('maxDepthReached')}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onRenameFolder(node)}>
              <Pencil size={14} className="mr-2" />
              {getText('rename')}
            </DropdownMenuItem>
            {onMoveFolder && (
              <DropdownMenuItem onClick={() => onMoveFolder(node)}>
                <MoveRight size={14} className="mr-2" />
                {getText('move')}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDeleteFolder(node)}
              className="text-status-error focus:text-status-error"
            >
              <Trash2 size={14} className="mr-2" />
              {getText('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              onCreateFolder={onCreateFolder}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
              onMoveFolder={onMoveFolder}
              language={language}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  isLoading = false,
  language = 'ko',
}: FolderTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={20} className="animate-spin text-text-secondary" />
        <span className="ml-2 text-sm text-text-secondary">{getText('loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* 전체 콘텐츠 (루트) */}
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-3 rounded-md cursor-pointer transition-colors',
          selectedFolderId === null
            ? 'bg-action-primary/10 text-action-primary'
            : 'hover:bg-bg-secondary text-text-primary'
        )}
        onClick={() => onSelectFolder(null)}
      >
        <Folder size={16} className="text-text-secondary" />
        <span className="text-sm font-medium">{getText('allContent')}</span>
      </div>

      {/* 루트 폴더 생성 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-text-secondary hover:text-text-primary"
        onClick={() => onCreateFolder(null)}
      >
        <Plus size={14} className="mr-2" />
        {getText('createFolder')}
      </Button>

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
            onSelect={onSelectFolder}
            onCreateFolder={onCreateFolder}
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
            onMoveFolder={onMoveFolder}
            language={language}
          />
        ))
      )}
    </div>
  );
}
