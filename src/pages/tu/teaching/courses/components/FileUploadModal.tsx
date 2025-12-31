/**
 * 파일 업로드 모달
 */
import { useState, useCallback } from 'react';
import { Loader2, Upload, X, File, Image, FileText, Film, Music } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Progress,
} from '@/components/common';
import { useUploadContent } from '@/hooks/tu';
import type { ContentAttachment } from '@/types';
import { cn } from '@/utils/cn';
import { translations, type TranslationKey } from './courseCreate.constants';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (content: ContentAttachment) => void;
  language: 'ko' | 'en';
}

export function FileUploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  language,
}: Readonly<FileUploadModalProps>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadContent = useUploadContent();

  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024, // 500MB
    disabled: isUploading,
  });

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (type.startsWith('video/')) return <Film className="h-6 w-6" />;
    if (type.startsWith('audio/')) return <Music className="h-6 w-6" />;
    if (type.includes('pdf') || type.includes('document'))
      return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // 진행률 시뮬레이션 (실제 API가 진행률을 지원하지 않는 경우)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await uploadContent.mutateAsync({
        file: selectedFile,
        originalFileName: selectedFile.name,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const newContent: ContentAttachment = {
        id: Date.now().toString(),
        type: 'upload',
        name: response.originalFileName || selectedFile.name,
        url: response.filePath || '',
        contentId: response.id,
        contentType: response.contentType,
        status: 'completed',
      };

      setTimeout(() => {
        onUploadComplete(newContent);
        handleClose();
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Failed to upload file:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    onClose();
  };

  const removeFile = () => {
    if (isUploading) return;
    setSelectedFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md sm:max-w-md bg-bg-default">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-text-primary">
            <Upload size={20} />
            {getText('fileUploadModalTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-text-secondary mb-4">
            {getText('fileUploadModalDesc')}
          </p>

          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer',
                isDragActive
                  ? 'border-action-primary bg-action-primary/5'
                  : 'border-border hover:border-text-secondary'
              )}
            >
              <input {...getInputProps()} />
              <Upload
                className={cn(
                  'h-10 w-10 mb-4',
                  isDragActive ? 'text-action-primary' : 'text-text-secondary'
                )}
              />
              <p className="text-sm text-text-secondary text-center">
                {getText('dragDropText')}
              </p>
              <p className="text-xs text-text-secondary mt-2">
                Max 500MB
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-md border border-border p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-bg-secondary text-text-secondary">
                  {getFileIcon(selectedFile)}
                </div>
                <div className="flex-1 min-w-0 w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                {!isUploading && (
                  <button
                    onClick={removeFile}
                    className="p-1 hover:bg-bg-secondary rounded"
                  >
                    <X className="h-4 w-4 text-text-secondary" />
                  </button>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{getText('uploading')}</span>
                    <span className="text-text-primary">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isUploading}
            className="border border-border"
          >
            {getText('cancel')}
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {getText('uploading')}
              </>
            ) : (
              getText('upload')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
