/**
 * 기존 콘텐츠 불러오기 모달
 */
import { useState, useMemo } from 'react';
import { Search, FileText, Film, Music, Image, ExternalLink, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common';
import { useMyContents } from '@/hooks/tu';
import type { ContentAttachment } from '@/types';
import type { ContentType, ContentListResponse } from '@/types/tu';
import { cn } from '@/utils/cn';
import { translations, type TranslationKey } from './courseCreate.constants';

interface ExistingContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContentSelected: (content: ContentAttachment) => void;
  language: 'ko' | 'en';
}

const CONTENT_TYPE_OPTIONS: { value: ContentType | 'ALL'; labelKey: TranslationKey }[] = [
  { value: 'ALL', labelKey: 'allTypes' },
  { value: 'VIDEO', labelKey: 'video' },
  { value: 'AUDIO', labelKey: 'audio' },
  { value: 'DOCUMENT', labelKey: 'document' },
  { value: 'IMAGE', labelKey: 'image' },
];

export function ExistingContentModal({
  isOpen,
  onClose,
  onContentSelected,
  language,
}: Readonly<ExistingContentModalProps>) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType | 'ALL'>('ALL');
  const [selectedContent, setSelectedContent] = useState<ContentListResponse | null>(null);

  const { data: contentsData, isLoading } = useMyContents({
    keyword: searchKeyword || undefined,
    contentType: selectedType === 'ALL' ? undefined : selectedType,
    status: 'ACTIVE',
    size: 50,
  });

  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  const contents = useMemo(() => contentsData?.content || [], [contentsData]);

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case 'VIDEO':
        return <Film className="h-5 w-5" />;
      case 'AUDIO':
        return <Music className="h-5 w-5" />;
      case 'IMAGE':
        return <Image className="h-5 w-5" />;
      case 'EXTERNAL_LINK':
        return <ExternalLink className="h-5 w-5" />;
      case 'DOCUMENT':
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case 'VIDEO':
        return getText('video');
      case 'AUDIO':
        return getText('audio');
      case 'IMAGE':
        return getText('image');
      case 'EXTERNAL_LINK':
        return getText('externalLink');
      case 'DOCUMENT':
      default:
        return getText('document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSelect = () => {
    if (!selectedContent) return;

    const newContent: ContentAttachment = {
      id: Date.now().toString(),
      type: 'existing',
      name: selectedContent.originalFileName,
      url: '',
      contentId: selectedContent.id,
      contentType: selectedContent.contentType,
      status: 'completed',
    };

    onContentSelected(newContent);
    handleClose();
  };

  const handleClose = () => {
    setSearchKeyword('');
    setSelectedType('ALL');
    setSelectedContent(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-bg-default flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2 text-text-primary">
            <FileText size={20} />
            {getText('existingContentModalTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 flex-1 min-h-0 overflow-hidden">
          {/* 검색 및 필터 */}
          <div className="flex gap-3 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={getText('searchContentPlaceholder')}
                className="pl-9"
              />
            </div>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as ContentType | 'ALL')}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={getText('filterByType')} />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {getText(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 콘텐츠 목록 */}
          <div className="border border-border rounded-lg overflow-hidden flex-1 min-h-0">
            <div className="h-full overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-text-secondary">
                  {getText('processing')}
                </div>
              ) : contents.length === 0 ? (
                <div className="p-8 text-center text-text-secondary">
                  {getText('noContentFound')}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {contents.map((content) => (
                    <button
                      key={content.id}
                      onClick={() => setSelectedContent(content)}
                      className={cn(
                        'w-full p-3 flex items-center gap-3 text-left hover:bg-bg-secondary transition-colors',
                        selectedContent?.id === content.id && 'bg-action-primary/10'
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-bg-secondary text-text-secondary shrink-0">
                        {getContentIcon(content.contentType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {content.originalFileName}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {getContentTypeLabel(content.contentType)}
                          {content.fileSize > 0 && ` · ${formatFileSize(content.fileSize)}`}
                        </p>
                      </div>
                      {selectedContent?.id === content.id && (
                        <Check className="h-5 w-5 text-action-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="border border-border"
          >
            {getText('cancel')}
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedContent}
          >
            {getText('select')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
