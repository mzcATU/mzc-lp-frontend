/**
 * Step 2: 커리큘럼 구성 (트리 구조)
 * 폴더와 콘텐츠를 계층적으로 관리
 * @dnd-kit을 사용한 드래그앤드롭 지원
 */
import { useState, useCallback } from 'react';
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { List, Plus, Info } from 'lucide-react';
import { Button, Alert, AlertDescription } from '@/components/common';
import type { CourseFormData, ContentAttachment } from '@/types';
import type { CurriculumItem, CurriculumFolderItem } from '@/types/tu';
import {
  isCurriculumFolder,
  createFolderItem,
  createContentItem,
} from '@/types/tu';
import { translations, type TranslationKey } from './courseCreate.constants';
import { SortableCurriculumCard } from './SortableCurriculumCard';
import { ExistingContentModal } from './ExistingContentModal';
import { FileUploadModal } from './FileUploadModal';
import { ExternalLinkModal } from './ExternalLinkModal';

/** 모달 타입 */
type ModalType = 'upload' | 'link' | 'existing' | null;

interface Step2CurriculumTreeProps {
  language: 'ko' | 'en';
  formData: CourseFormData;
  onFormDataChange: (data: Partial<CourseFormData>) => void;
}

export function Step2CurriculumTree({
  language,
  formData,
  onFormDataChange,
}: Readonly<Step2CurriculumTreeProps>) {
  const [addingToParentId, setAddingToParentId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  const items = formData.curriculumItems || [];

  // 드래그 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 트리 업데이트 헬퍼
  const updateTree = useCallback(
    (newItems: CurriculumItem[]) => {
      onFormDataChange({ curriculumItems: newItems });
    },
    [onFormDataChange]
  );

  // 드래그 종료 핸들러 (루트 레벨만)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        updateTree(newItems.map((item, idx) => ({ ...item, order: idx })));
      }
    }
  };

  // 재귀적으로 트리에서 항목 업데이트
  const updateItemInTree = useCallback(
    (
      items: CurriculumItem[],
      itemId: string,
      updates: Partial<CurriculumItem>
    ): CurriculumItem[] => {
      return items.map((item) => {
        if (item.id === itemId) {
          return { ...item, ...updates } as CurriculumItem;
        }
        if (isCurriculumFolder(item)) {
          return {
            ...item,
            children: updateItemInTree(item.children, itemId, updates),
          };
        }
        return item;
      });
    },
    []
  );

  // 재귀적으로 트리에서 항목 삭제
  const deleteItemFromTree = useCallback(
    (items: CurriculumItem[], itemId: string): CurriculumItem[] => {
      return items
        .filter((item) => item.id !== itemId)
        .map((item) => {
          if (isCurriculumFolder(item)) {
            return {
              ...item,
              children: deleteItemFromTree(item.children, itemId),
            };
          }
          return item;
        });
    },
    []
  );

  // 재귀적으로 트리에 항목 추가
  const addItemToTree = useCallback(
    (
      items: CurriculumItem[],
      parentId: string | null,
      newItem: CurriculumItem
    ): CurriculumItem[] => {
      if (parentId === null) {
        // 루트에 추가
        return [...items, { ...newItem, order: items.length }];
      }

      return items.map((item) => {
        if (item.id === parentId && isCurriculumFolder(item)) {
          const newDepth = item.depth + 1;
          return {
            ...item,
            children: [
              ...item.children,
              { ...newItem, depth: newDepth, order: item.children.length },
            ],
          };
        }
        if (isCurriculumFolder(item)) {
          return {
            ...item,
            children: addItemToTree(item.children, parentId, newItem),
          };
        }
        return item;
      });
    },
    []
  );

  // 폴더 내 항목 순서 변경
  const reorderChildrenInTree = useCallback(
    (
      items: CurriculumItem[],
      parentId: string,
      oldIndex: number,
      newIndex: number
    ): CurriculumItem[] => {
      return items.map((item) => {
        if (item.id === parentId && isCurriculumFolder(item)) {
          const newChildren = arrayMove(item.children, oldIndex, newIndex);
          return {
            ...item,
            children: newChildren.map((child, idx) => ({ ...child, order: idx })),
          };
        }
        if (isCurriculumFolder(item)) {
          return {
            ...item,
            children: reorderChildrenInTree(item.children, parentId, oldIndex, newIndex),
          };
        }
        return item;
      });
    },
    []
  );

  // 항목 업데이트 핸들러
  const handleUpdateItem = useCallback(
    (itemId: string, updates: Partial<CurriculumItem>) => {
      updateTree(updateItemInTree(items, itemId, updates));
    },
    [items, updateTree, updateItemInTree]
  );

  // 항목 삭제 핸들러
  const handleDeleteItem = useCallback(
    (itemId: string) => {
      updateTree(deleteItemFromTree(items, itemId));
    },
    [items, updateTree, deleteItemFromTree]
  );

  // 폴더 확장/축소 토글
  const handleToggleExpand = useCallback(
    (itemId: string) => {
      updateTree(
        updateItemInTree(items, itemId, {
          isExpanded: !items.find((i) => i.id === itemId)?.isExpanded,
        } as Partial<CurriculumFolderItem>)
      );
    },
    [items, updateTree, updateItemInTree]
  );

  // 폴더 추가 (회차 추가)
  const handleAddFolder = useCallback(
    (parentId: string | null) => {
      const parentItem = parentId ? findItemById(items, parentId) : null;
      const depth =
        parentItem && isCurriculumFolder(parentItem) ? parentItem.depth + 1 : 0;

      // 루트 레벨이면 "N차시", 하위면 "새 폴더"
      const folderCount = parentId === null
        ? items.filter(i => isCurriculumFolder(i)).length + 1
        : null;
      const folderName = folderCount
        ? (language === 'ko' ? `${folderCount}차시` : `Lesson ${folderCount}`)
        : (language === 'ko' ? '새 폴더' : 'New Folder');

      const newFolder = createFolderItem(folderName, depth);
      updateTree(addItemToTree(items, parentId, newFolder));
    },
    [items, updateTree, addItemToTree, language]
  );

  // 자식 항목 순서 변경 핸들러
  const handleReorderChildren = useCallback(
    (parentId: string, oldIndex: number, newIndex: number) => {
      updateTree(reorderChildrenInTree(items, parentId, oldIndex, newIndex));
    },
    [items, updateTree, reorderChildrenInTree]
  );

  // 모달 열기 핸들러들
  const handleOpenUploadModal = useCallback((parentId: string | null) => {
    setAddingToParentId(parentId);
    setActiveModal('upload');
  }, []);

  const handleOpenLinkModal = useCallback((parentId: string | null) => {
    setAddingToParentId(parentId);
    setActiveModal('link');
  }, []);

  const handleOpenExistingModal = useCallback((parentId: string | null) => {
    setAddingToParentId(parentId);
    setActiveModal('existing');
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
    setAddingToParentId(null);
  }, []);

  // 콘텐츠 추가 완료 (모든 모달에서 공통)
  const handleContentAdded = useCallback(
    (content: ContentAttachment) => {
      if (!content.contentId) return;

      const parentItem = addingToParentId
        ? findItemById(items, addingToParentId)
        : null;
      const depth =
        parentItem && isCurriculumFolder(parentItem) ? parentItem.depth + 1 : 0;

      const newContent = createContentItem(
        content.contentId,
        content.name,
        content.contentType || 'DOCUMENT',
        depth
      );

      updateTree(addItemToTree(items, addingToParentId, newContent));
      handleCloseModal();
    },
    [items, addingToParentId, updateTree, addItemToTree, handleCloseModal]
  );

  // 항목 추가 핸들러 (CurriculumItemCard에서 호출)
  const handleAddItem = useCallback(
    (
      parentId: string | null,
      type: 'folder' | 'upload' | 'link' | 'existing'
    ) => {
      switch (type) {
        case 'folder':
          handleAddFolder(parentId);
          break;
        case 'upload':
          handleOpenUploadModal(parentId);
          break;
        case 'link':
          handleOpenLinkModal(parentId);
          break;
        case 'existing':
          handleOpenExistingModal(parentId);
          break;
      }
    },
    [handleAddFolder, handleOpenUploadModal, handleOpenLinkModal, handleOpenExistingModal]
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List size={20} className="text-btn-brand" />
            <h2 className="text-text-primary m-0">{getText('curriculumTitle')}</h2>
          </div>
          <Button onClick={() => handleAddFolder(null)}>
            <Plus size={18} />
            {language === 'ko' ? '차시 추가' : 'Add Lesson'}
          </Button>
        </div>

        {/* 커리큘럼 트리 */}
        <div className="border border-border rounded-lg bg-bg-default overflow-hidden">
          {items.length === 0 ? (
            <div className="p-12 text-center">
              <List size={48} className="text-text-placeholder mx-auto mb-4" />
              <p className="text-text-secondary mb-4">
                {language === 'ko'
                  ? '차시를 추가하여 강의를 구성하세요.'
                  : 'Add lessons to structure your course.'}
              </p>
              <Button onClick={() => handleAddFolder(null)}>
                <Plus size={18} />
                {language === 'ko' ? '첫 번째 차시 추가' : 'Add First Lesson'}
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="p-4 space-y-3">
                  {items.map((item, index) => (
                    <SortableCurriculumCard
                      key={item.id}
                      language={language}
                      item={item}
                      index={index}
                      onUpdate={handleUpdateItem}
                      onDelete={handleDeleteItem}
                      onAddItem={handleAddItem}
                      onToggleExpand={handleToggleExpand}
                      onReorderChildren={handleReorderChildren}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* 도움말 */}
        <Alert variant="info">
          <Info size={16} />
          <AlertDescription>
            {language === 'ko'
              ? '차시를 드래그하여 순서를 변경할 수 있습니다. 각 차시에 콘텐츠를 연결하여 학습 경로를 구성하세요.'
              : 'Drag lessons to reorder. Connect content to each lesson to build your learning path.'}
          </AlertDescription>
        </Alert>
      </div>

      {/* 파일 업로드 모달 */}
      <FileUploadModal
        isOpen={activeModal === 'upload'}
        onClose={handleCloseModal}
        onUploadComplete={handleContentAdded}
        language={language}
      />

      {/* 외부 링크 모달 */}
      <ExternalLinkModal
        isOpen={activeModal === 'link'}
        onClose={handleCloseModal}
        onLinkCreated={handleContentAdded}
        language={language}
      />

      {/* 기존 콘텐츠 선택 모달 */}
      <ExistingContentModal
        isOpen={activeModal === 'existing'}
        onClose={handleCloseModal}
        onContentSelected={handleContentAdded}
        language={language}
      />
    </>
  );
}

// 헬퍼 함수: ID로 항목 찾기
function findItemById(
  items: CurriculumItem[],
  itemId: string
): CurriculumItem | null {
  for (const item of items) {
    if (item.id === itemId) {
      return item;
    }
    if (isCurriculumFolder(item)) {
      const found = findItemById(item.children, itemId);
      if (found) return found;
    }
  }
  return null;
}
