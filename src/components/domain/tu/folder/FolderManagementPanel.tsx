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
    ko: '이 폴더를 삭제하시겠습니까?',
    en: 'Delete this folder?',
  },
  deleteConfirmDetail: {
    ko: '하위 폴더도 함께 삭제되고, 폴더 내 콘텐츠는 미분류로 이동됩니다.',
    en: 'Subfolders will be deleted and contents will be moved to uncategorized.',
  },
  creating: { ko: '생성 중...', en: 'Creating...' },
  renaming: { ko: '변경 중...', en: 'Renaming...' },
  deleting: { ko: '삭제 중...', en: 'Deleting...' },
  folderNotEmpty: {
    ko: '폴더에 콘텐츠가 있어 삭제할 수 없습니다. 먼저 콘텐츠를 이동하거나 삭제해주세요.',
    en: 'Cannot delete folder with contents. Please move or delete contents first.',
  },
  duplicateName: {
    ko: '같은 위치에 동일한 이름의 폴더가 있습니다.',
    en: 'A folder with this name already exists in this location.',
  },
  unknownError: {
    ko: '오류가 발생했습니다. 다시 시도해주세요.',
    en: 'An error occurred. Please try again.',
  },
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { data?: { code?: string } } }).response;
      const code = response?.data?.code;
      if (code === 'LO004') return getText('folderNotEmpty');
      if (code === 'LO003') return getText('duplicateName');
    }
    return getText('unknownError');
  };

  // Queries & Mutations
  const { data: folders = [], isLoading } = useContentFolderTree();
  const createFolder = useCreateContentFolder();
  const updateFolder = useUpdateContentFolder();
  const deleteFolder = useDeleteContentFolder();

  const handleCreateFolder = (parentId: number | null) => {
    setFolderName('');
    setErrorMessage(null);
    setModalState({ type: 'create', parentId });
  };

  const handleRenameFolder = (folder: ContentFolderTreeNode) => {
    setFolderName(folder.folderName);
    setErrorMessage(null);
    setModalState({ type: 'rename', folder });
  };

  const handleDeleteFolder = (folder: ContentFolderTreeNode) => {
    setErrorMessage(null);
    setModalState({ type: 'delete', folder });
  };

  const handleConfirmCreate = async () => {
    if (modalState.type !== 'create' || !folderName.trim()) return;

    try {
      setErrorMessage(null);
      await createFolder.mutateAsync({
        folderName: folderName.trim(),
        parentId: modalState.parentId,
      });
      setModalState({ type: 'none' });
    } catch (error) {
      console.error('Failed to create folder:', error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleConfirmRename = async () => {
    if (modalState.type !== 'rename' || !folderName.trim()) return;

    try {
      setErrorMessage(null);
      await updateFolder.mutateAsync({
        id: modalState.folder.id,
        request: { folderName: folderName.trim() },
      });
      setModalState({ type: 'none' });
    } catch (error) {
      console.error('Failed to rename folder:', error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleConfirmDelete = async () => {
    if (modalState.type !== 'delete') return;

    try {
      setErrorMessage(null);
      await deleteFolder.mutateAsync(modalState.folder.id);
      // 삭제된 폴더가 선택되어 있었다면 전체 콘텐츠로 이동
      if (selectedFolderId === modalState.folder.id) {
        onSelectFolder(null);
      }
      setModalState({ type: 'none' });
    } catch (error) {
      console.error('Failed to delete folder:', error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  const closeModal = () => {
    setModalState({ type: 'none' });
    setFolderName('');
    setErrorMessage(null);
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
          <div className="py-4 space-y-3">
            <Input
              label={getText('folderName')}
              placeholder={getText('folderNamePlaceholder')}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmCreate()}
              autoFocus
            />
            {errorMessage && (
              <p className="text-sm text-status-error">{errorMessage}</p>
            )}
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
          <div className="py-4 space-y-3">
            <Input
              label={getText('folderName')}
              placeholder={getText('folderNamePlaceholder')}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmRename()}
              autoFocus
            />
            {errorMessage && (
              <p className="text-sm text-status-error">{errorMessage}</p>
            )}
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
              {getText('deleteConfirm')} {getText('deleteConfirmDetail')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {errorMessage && (
            <p className="text-sm text-status-error px-1">{errorMessage}</p>
          )}
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
