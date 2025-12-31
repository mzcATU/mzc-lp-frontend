/**
 * Step 2: 커리큘럼 구성 (트리 구조)
 * 폴더와 콘텐츠를 계층적으로 관리
 */
import { useState, useCallback } from 'react';
import type { CourseFormData, ContentAttachment } from '@/types';
import type { CurriculumItem, CurriculumFolderItem } from '@/types/tu';
import {
  isCurriculumFolder,
  createFolderItem,
  createContentItem,
} from '@/types/tu';
import { translations, type TranslationKey } from './courseCreate.constants';
import { CurriculumItemCard } from './CurriculumItemCard';
import { AddCurriculumItemButton } from './AddCurriculumItemButton';
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

  // 트리 업데이트 헬퍼
  const updateTree = useCallback(
    (newItems: CurriculumItem[]) => {
      onFormDataChange({ curriculumItems: newItems });
    },
    [onFormDataChange]
  );

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

  // 폴더 추가
  const handleAddFolder = useCallback(
    (parentId: string | null) => {
      const parentItem = parentId ? findItemById(items, parentId) : null;
      const depth =
        parentItem && isCurriculumFolder(parentItem) ? parentItem.depth + 1 : 0;
      const newFolder = createFolderItem(
        language === 'ko' ? '새 폴더' : 'New Folder',
        depth
      );
      updateTree(addItemToTree(items, parentId, newFolder));
    },
    [items, updateTree, addItemToTree, language]
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
        <div>
          <h2 className="text-text-primary mb-2">{getText('curriculumTitle')}</h2>
          <p className="text-text-secondary m-0">{getText('curriculumDesc')}</p>
        </div>

        {/* 커리큘럼 트리 */}
        <div className="border border-border rounded-lg bg-bg-default overflow-hidden">
          {items.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-text-secondary mb-4">
                {language === 'ko'
                  ? '커리큘럼 항목이 없습니다. 폴더 또는 콘텐츠를 추가해주세요.'
                  : 'No curriculum items. Add a folder or content.'}
              </p>
              <AddCurriculumItemButton
                language={language}
                parentId={null}
                onAddFolder={handleAddFolder}
                onUpload={handleOpenUploadModal}
                onLink={handleOpenLinkModal}
                onExisting={handleOpenExistingModal}
                variant="default"
              />
            </div>
          ) : (
            <div className="p-4">
              {/* 트리 렌더링 */}
              {items.map((item) => (
                <CurriculumItemCard
                  key={item.id}
                  language={language}
                  item={item}
                  onUpdate={handleUpdateItem}
                  onDelete={handleDeleteItem}
                  onAddItem={handleAddItem}
                  onToggleExpand={handleToggleExpand}
                />
              ))}

              {/* 루트에 항목 추가 버튼 */}
              <div className="mt-4">
                <AddCurriculumItemButton
                  language={language}
                  parentId={null}
                  onAddFolder={handleAddFolder}
                  onUpload={handleOpenUploadModal}
                  onLink={handleOpenLinkModal}
                  onExisting={handleOpenExistingModal}
                  variant="dashed"
                />
              </div>
            </div>
          )}
        </div>
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
