/**
 * 커리큘럼 항목 추가 버튼
 * 폴더 또는 콘텐츠(업로드/외부링크/기존) 추가를 선택할 수 있는 드롭다운
 */
import { useState } from 'react';
import {
  Plus,
  Folder,
  Upload,
  Link as LinkIcon,
  FileText,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common';

interface AddCurriculumItemButtonProps {
  language: 'ko' | 'en';
  /** 항목을 추가할 부모 폴더 ID (null이면 루트) */
  parentId: string | null;
  /** 폴더 추가 핸들러 */
  onAddFolder: (parentId: string | null) => void;
  /** 파일 업로드 핸들러 */
  onUpload: (parentId: string | null) => void;
  /** 외부 링크 핸들러 */
  onLink: (parentId: string | null) => void;
  /** 기존 콘텐츠 불러오기 핸들러 */
  onExisting: (parentId: string | null) => void;
  /** 버튼 스타일 variant */
  variant?: 'default' | 'dashed';
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 클래스 */
  className?: string;
}

export function AddCurriculumItemButton({
  language,
  parentId,
  onAddFolder,
  onUpload,
  onLink,
  onExisting,
  variant = 'default',
  disabled = false,
  className,
}: Readonly<AddCurriculumItemButtonProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const texts = {
    addItem: language === 'ko' ? '항목 추가' : 'Add Item',
    addFolder: language === 'ko' ? '폴더 추가' : 'Add Folder',
    upload: language === 'ko' ? '파일 업로드' : 'Upload File',
    link: language === 'ko' ? '외부 링크' : 'External Link',
    existing: language === 'ko' ? '기존 콘텐츠 불러오기' : 'Load Existing',
  };

  const handleAddFolder = () => {
    setIsOpen(false);
    onAddFolder(parentId);
  };

  const handleUpload = () => {
    setIsOpen(false);
    onUpload(parentId);
  };

  const handleLink = () => {
    setIsOpen(false);
    onLink(parentId);
  };

  const handleExisting = () => {
    setIsOpen(false);
    onExisting(parentId);
  };

  const menuContent = (
    <>
      <DropdownMenuItem onClick={handleAddFolder}>
        <Folder size={16} className="mr-2 text-badge-indigo-text" />
        {texts.addFolder}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleUpload}>
        <Upload size={16} className="mr-2 text-text-secondary" />
        {texts.upload}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleLink}>
        <LinkIcon size={16} className="mr-2 text-text-secondary" />
        {texts.link}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleExisting}>
        <FileText size={16} className="mr-2 text-text-secondary" />
        {texts.existing}
      </DropdownMenuItem>
    </>
  );

  // Dashed 스타일 버튼 (빈 영역 추가용)
  if (variant === 'dashed') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            disabled={disabled}
            className={cn(
              'w-full p-3.5 bg-bg-default text-text-primary border-2 border-dashed border-border rounded-lg',
              'cursor-pointer flex items-center justify-center gap-2',
              'hover:bg-bg-secondary transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
          >
            <Plus size={18} />
            {texts.addItem}
            <ChevronDown size={16} className="ml-1" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-52">
          {menuContent}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 기본 버튼 스타일
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled} className={className}>
          <Plus size={18} />
          {texts.addItem}
          <ChevronDown size={16} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {menuContent}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
