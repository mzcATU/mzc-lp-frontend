/**
 * 콘텐츠 폴더 관리 슬라이드 패널
 * 폴더 트리 표시 및 CRUD 기능 제공
 */
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/common/Sheet';
import { Input } from '@/components/common/Input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/common/AlertDialog';
import { FolderTree } from './FolderTree';
import {
  useContentFolderTree,
  useCreateContentFolder,
  useUpdateContentFolder,
  useDeleteContentFolder,
} from '@/hooks/tu';
import type { ContentFolderTreeNode } from '@/types/tu';

interface FolderManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFolderId: number | null;
  onSelectFolder: (folderId: number | null) => void;
  language?: 'ko' | 'en';
}

type ModalState =
  | { type: 'none' }
  | { type: 'create'; parentId: number | null }
  | { type: 'rename'; folder: ContentFolderTreeNode }
  | { type: 'delete'; folder: ContentFolderTreeNode };

const t = {
  title: { ko: '분류 및 관리', en: 'Organize & Manage' },
  description: { ko: '콘텐츠를 폴더로 정리하세요', en: 'Organize your content into folders' },
  createFolder: { ko: '폴더 생성', en: 'Create Folder' },
  renameFolder: { ko: '폴더 이름 변경', en: 'Rename Folder' },
  deleteFolder: { ko: '폴더 삭제', en: 'Delete Folder' },
  folderName: { ko: '폴더 이름', en: 'Folder Name' },
  folderNamePlaceholder: { ko: '폴더 이름을 입력하세요', en: 'Enter folder name' },
  cancel: { ko: '취소', en: 'Cancel' },
  create: { ko: '생성', en: 'Create' },
  rename: { ko: '변경', en: 'Rename' },
  delete: { ko: '삭제', en: 'Delete' },
  deleteConfirm: {
    ko: '이 폴더를 삭제하시겠습니까? 하위 폴더와 콘텐츠 분류가 해제됩니다.',
    en: 'Delete this folder? Subfolders and content will be uncategorized.',
  },
  creating: { ko: '생성 중...', en: 'Creating...' },
  renaming: { ko: '변경 중...', en: 'Renaming...' },
  deleting: { ko: '삭제 중...', en: 'Deleting...' },
};

export function FolderManagementPanel({
  isOpen,
  onClose,
  selectedFolderId,
  onSelectFolder,
  language = 'ko',
}: FolderManagementPanelProps) {
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [folderName, setFolderName] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // Queries & Mutations
  const { data: folders = [], isLoading } = useContentFolderTree();
  const createFolder = useCreateContentFolder();
  const updateFolder = useUpdateContentFolder();
  const deleteFolder = useDeleteContentFolder();

  const handleCreateFolder = (parentId: number | null) => {
    setFolderName('');
    setModalState({ type: 'create', parentId });
  };

  const handleRenameFolder = (folder: ContentFolderTreeNode) => {
    setFolderName(folder.folderName);
    setModalState({ type: 'rename', folder });
  };

  const handleDeleteFolder = (folder: ContentFolderTreeNode) => {
    setModalState({ type: 'delete', folder });
  };

  const handleConfirmCreate = async () => {
    if (modalState.type !== 'create' || !folderName.trim()) return;

    try {
      await createFolder.mutateAsync({
        folderName: folderName.trim(),
        parentId: modalState.parentId,
      });
      setModalState({ type: 'none' });
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleConfirmRename = async () => {
    if (modalState.type !== 'rename' || !folderName.trim()) return;

    try {
      await updateFolder.mutateAsync({
        id: modalState.folder.id,
        request: { folderName: folderName.trim() },
      });
      setModalState({ type: 'none' });
    } catch (error) {
      console.error('Failed to rename folder:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return;

    try {
      await deleteFolder.mutateAsync(modalState.folder.id);
      // 삭제된 폴더가 선택되어 있었다면 전체 콘텐츠로 이동
      if (selectedFolderId === modalState.folder.id) {
        onSelectFolder(null);
      }
      setModalState({ type: 'none' });
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const closeModal = () => {
    setModalState({ type: 'none' });
    setFolderName('');
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="right" className="w-[360px] sm:max-w-[360px]">
          <SheetHeader>
            <SheetTitle>{getText('title')}</SheetTitle>
            <SheetDescription>{getText('description')}</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-auto py-4">
            <FolderTree
              folders={folders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
              onCreateFolder={handleCreateFolder}
              onRenameFolder={handleRenameFolder}
              onDeleteFolder={handleDeleteFolder}
              isLoading={isLoading}
              language={language}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* 폴더 생성 다이얼로그 */}
      <AlertDialog
        open={modalState.type === 'create'}
        onOpenChange={(open) => !open && closeModal()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getText('createFolder')}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              label={getText('folderName')}
              placeholder={getText('folderNamePlaceholder')}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmCreate()}
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeModal}>
              {getText('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCreate}
              disabled={!folderName.trim() || createFolder.isPending}
            >
              {createFolder.isPending ? getText('creating') : getText('create')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 폴더 이름 변경 다이얼로그 */}
      <AlertDialog
        open={modalState.type === 'rename'}
        onOpenChange={(open) => !open && closeModal()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getText('renameFolder')}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              label={getText('folderName')}
              placeholder={getText('folderNamePlaceholder')}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmRename()}
              autoFocus
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeModal}>
              {getText('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRename}
              disabled={!folderName.trim() || updateFolder.isPending}
            >
              {updateFolder.isPending ? getText('renaming') : getText('rename')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 폴더 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={modalState.type === 'delete'}
        onOpenChange={(open) => !open && closeModal()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getText('deleteFolder')}</AlertDialogTitle>
            <AlertDialogDescription>
              {getText('deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeModal}>
              {getText('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteFolder.isPending}
              className="bg-status-error hover:bg-status-error/90"
            >
              {deleteFolder.isPending ? getText('deleting') : getText('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
