import { useState } from 'react';
import { Card, Button, Input } from '@/components/common';
import {
  Folder,
  FileText,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  FolderPlus,
  Loader2,
} from 'lucide-react';
import {
  useAddSnapshotItem,
  useUpdateSnapshotItem,
  useDeleteSnapshotItem,
} from '@/hooks/tu';
import type { SnapshotItemResponse } from '@/types/common';

interface SnapshotItemTreeProps {
  snapshotId: number;
  items: SnapshotItemResponse[];
  onItemsChange: () => void;
  language?: 'ko' | 'en';
}

const t = {
  curriculum: { ko: '커리큘럼 편집', en: 'Edit Curriculum' },
  addFolder: { ko: '폴더 추가', en: 'Add Folder' },
  addItem: { ko: '아이템 추가', en: 'Add Item' },
  noItems: { ko: '아이템이 없습니다. 폴더를 추가해주세요.', en: 'No items. Add a folder.' },
  newFolder: { ko: '새 폴더', en: 'New Folder' },
  confirmDelete: {
    ko: '이 아이템을 삭제하시겠습니까?',
    en: 'Delete this item?',
  },
  items: { ko: '개', en: 'items' },
};

interface TreeItemProps {
  item: SnapshotItemResponse;
  snapshotId: number;
  onItemsChange: () => void;
  language: 'ko' | 'en';
  depth?: number;
}

function TreeItem({
  item,
  snapshotId,
  onItemsChange,
  language,
  depth = 0,
}: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.itemName);

  const hasChildren = item.children && item.children.length > 0;

  const updateItemMutation = useUpdateSnapshotItem();
  const deleteItemMutation = useDeleteSnapshotItem();
  const addItemMutation = useAddSnapshotItem();

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const handleSaveName = async () => {
    if (!editName.trim() || editName === item.itemName) {
      setIsEditing(false);
      setEditName(item.itemName);
      return;
    }

    try {
      await updateItemMutation.mutateAsync({
        snapshotId,
        itemId: item.itemId,
        request: { itemName: editName.trim() },
      });
      onItemsChange();
      setIsEditing(false);
    } catch (err) {
      console.error('Update item failed:', err);
      setEditName(item.itemName);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(getText('confirmDelete'))) return;

    try {
      await deleteItemMutation.mutateAsync({
        snapshotId,
        itemId: item.itemId,
      });
      onItemsChange();
    } catch (err) {
      console.error('Delete item failed:', err);
    }
  };

  const handleAddSubFolder = async () => {
    try {
      await addItemMutation.mutateAsync({
        snapshotId,
        request: {
          itemName: getText('newFolder'),
          parentId: item.itemId,
          itemType: 'FOLDER',
        },
      });
      onItemsChange();
      setIsExpanded(true);
    } catch (err) {
      console.error('Add subfolder failed:', err);
    }
  };

  const isLoading =
    updateItemMutation.isPending ||
    deleteItemMutation.isPending ||
    addItemMutation.isPending;

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-bg-secondary rounded-md group"
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {/* 확장/축소 버튼 */}
        <button
          className="w-5 h-5 flex items-center justify-center"
          onClick={() => hasChildren && setIsExpanded(!isExpanded)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={16} className="text-text-secondary" />
            ) : (
              <ChevronRight size={16} className="text-text-secondary" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>

        {/* 아이콘 */}
        {item.isFolder ? (
          <Folder size={16} className="text-yellow-500 flex-shrink-0" />
        ) : (
          <FileText size={16} className="text-blue-500 flex-shrink-0" />
        )}

        {/* 이름 (편집 모드) */}
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-7 text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName();
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditName(item.itemName);
                }
              }}
            />
            <button
              onClick={handleSaveName}
              className="p-1 hover:bg-status-success-bg rounded text-status-success"
              disabled={isLoading}
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditName(item.itemName);
              }}
              className="p-1 hover:bg-status-error-bg rounded text-status-error"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            {/* 이름 (보기 모드) */}
            <span className="text-text-primary flex-1 truncate">{item.itemName}</span>

            {/* 액션 버튼 (호버 시 표시) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isLoading && <Loader2 size={14} className="animate-spin text-text-secondary" />}

              {/* 폴더인 경우 하위 폴더 추가 */}
              {item.isFolder && depth < 8 && (
                <button
                  onClick={handleAddSubFolder}
                  className="p-1 hover:bg-bg-secondary rounded text-text-secondary hover:text-text-primary"
                  title={getText('addFolder')}
                  disabled={isLoading}
                >
                  <FolderPlus size={14} />
                </button>
              )}

              {/* 이름 편집 */}
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-bg-secondary rounded text-text-secondary hover:text-text-primary"
                disabled={isLoading}
              >
                <Edit2 size={14} />
              </button>

              {/* 삭제 */}
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-status-error-bg rounded text-text-secondary hover:text-status-error"
                disabled={isLoading}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* 자식 아이템 */}
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child) => (
            <TreeItem
              key={child.itemId}
              item={child}
              snapshotId={snapshotId}
              onItemsChange={onItemsChange}
              language={language}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SnapshotItemTree({
  snapshotId,
  items,
  onItemsChange,
  language = 'ko',
}: Readonly<SnapshotItemTreeProps>) {
  const addItemMutation = useAddSnapshotItem();

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const handleAddRootFolder = async () => {
    try {
      await addItemMutation.mutateAsync({
        snapshotId,
        request: {
          itemName: getText('newFolder'),
          itemType: 'FOLDER',
        },
      });
      onItemsChange();
    } catch (err) {
      console.error('Add root folder failed:', err);
    }
  };

  const totalItems = items.length;

  return (
    <Card>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-text-primary">
            {getText('curriculum')} ({totalItems} {getText('items')})
          </h2>
          <Button
            size="sm"
            variant="ghost"
            className="border border-border"
            onClick={handleAddRootFolder}
            disabled={addItemMutation.isPending}
          >
            {addItemMutation.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
            {getText('addFolder')}
          </Button>
        </div>

        {items.length > 0 ? (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-auto">
              {items.map((item) => (
                <TreeItem
                  key={item.itemId}
                  item={item}
                  snapshotId={snapshotId}
                  onItemsChange={onItemsChange}
                  language={language}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <Folder size={48} className="mx-auto mb-3 text-text-placeholder opacity-30" />
            <p className="text-text-secondary mb-4">{getText('noItems')}</p>
            <Button
              size="sm"
              onClick={handleAddRootFolder}
              disabled={addItemMutation.isPending}
            >
              {addItemMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <FolderPlus size={14} />
              )}
              {getText('addFolder')}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
