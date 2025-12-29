/**
 * 외부 링크 추가 모달
 */
import { useState } from 'react';
import { Loader2, Link as LinkIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
} from '@/components/common';
import { useCreateExternalLink } from '@/hooks/tu';
import type { ContentAttachment } from '@/types';
import { translations, type TranslationKey } from './courseCreate.constants';

interface ExternalLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkCreated: (content: ContentAttachment) => void;
  language: 'ko' | 'en';
}

export function ExternalLinkModal({
  isOpen,
  onClose,
  onLinkCreated,
  language,
}: Readonly<ExternalLinkModalProps>) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const createExternalLink = useCreateExternalLink();

  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  const validateUrl = (value: string): boolean => {
    if (!value) return false;
    try {
      const urlObj = new URL(value);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value && !validateUrl(value)) {
      setUrlError(getText('invalidUrl'));
    } else {
      setUrlError('');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !validateUrl(url)) return;

    try {
      const response = await createExternalLink.mutateAsync({
        url: url.trim(),
        name: name.trim(),
      });

      const newContent: ContentAttachment = {
        id: Date.now().toString(),
        type: 'link',
        name: response.originalFileName || name.trim(),
        url: response.externalUrl || url.trim(),
        contentId: response.id,
        contentType: response.contentType,
        status: 'completed',
      };

      onLinkCreated(newContent);
      handleClose();
    } catch (error) {
      console.error('Failed to create external link:', error);
    }
  };

  const handleClose = () => {
    setName('');
    setUrl('');
    setUrlError('');
    onClose();
  };

  const isValid = name.trim() && validateUrl(url) && !createExternalLink.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md bg-bg-default">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-text-primary">
            <LinkIcon size={20} />
            {getText('externalLinkModalTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <Input
            label={
              <>
                {getText('contentName')} <span className="text-status-error">*</span>
              </>
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={getText('contentNamePlaceholder')}
            disabled={createExternalLink.isPending}
          />

          <div>
            <Input
              label={
                <>
                  {getText('urlInputLabel')} <span className="text-status-error">*</span>
                </>
              }
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder={getText('urlInputPlaceholder')}
              disabled={createExternalLink.isPending}
            />
            {urlError && (
              <p className="mt-1 text-sm text-status-error">{urlError}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={createExternalLink.isPending}
            className="border border-border"
          >
            {getText('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid}
          >
            {createExternalLink.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {getText('processing')}
              </>
            ) : (
              getText('add')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
