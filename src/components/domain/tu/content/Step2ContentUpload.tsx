import { useState, useRef, DragEvent } from 'react';
import { Upload, File, X, Link as LinkIcon, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Input, Button } from '@/components/common';
import type { LOData } from '@/types';

interface Step2Props {
  data: LOData;
  onUpdate: (data: Partial<LOData>) => void;
}

export function Step2ContentUpload({ data, onUpdate }: Readonly<Step2Props>) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onUpdate({ uploadedFile: file });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemoveFile = () => {
    onUpdate({ uploadedFile: undefined });
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Render based on LO Type
  if (!data.loType) {
    return (
      <div className="rounded-lg border border-border bg-bg-secondary p-12 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-text-secondary" />
        <p className="text-text-secondary">Step 1에서 콘텐츠 유형을 먼저 선택해주세요.</p>
      </div>
    );
  }

  // Video/Document Upload UI
  if (data.loType === 'video' || data.loType === 'document') {
    const acceptedFormats = data.loType === 'video' ? '.mp4,.mov,.avi,.mkv' : '.pdf,.txt,.doc,.docx,.ppt,.pptx';
    const formatText =
      data.loType === 'video'
        ? 'MP4, MOV, AVI, MKV (최대 500MB)'
        : 'PDF, TXT, DOC, DOCX, PPT, PPTX (최대 100MB)';

    return (
      <div className="space-y-6">
        <h2 className="text-text-primary font-medium text-lg">
          {data.loType === 'video' ? '비디오 파일 업로드' : '문서 파일 업로드'}
        </h2>

        {!data.uploadedFile && !isUploading && (
          <div>
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer',
                isDragging
                  ? 'border-action-primary bg-action-primary/5'
                  : 'border-border hover:border-action-primary hover:bg-bg-secondary/50'
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 mb-4 rounded-full bg-bg-secondary flex items-center justify-center">
                  <Upload className="w-10 h-10 text-action-primary" />
                </div>
                <p className="text-text-primary mb-2">파일을 드래그하여 업로드하거나</p>
                <Button type="button">파일 선택</Button>
                <p className="text-xs text-text-secondary mt-4">지원 형식: {formatText}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept={acceptedFormats}
                />
              </div>
            </div>

            {/* 업로드 안내 */}
            <div className="mt-4 p-4 bg-bg-secondary rounded-lg border border-border">
              <p className="text-sm text-text-secondary">
                <strong className="text-text-primary">백그라운드 처리 안내:</strong> 업로드 완료 후
                {data.loType === 'video' ? ' 비디오 인코딩' : ' 문서 변환'} 작업이 자동으로 진행됩니다.
                처리 상태는 콘텐츠 목록에서 확인하실 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-primary">업로드 중...</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">{uploadProgress}%</span>
                <Button type="button" variant="ghost" size="sm" onClick={handleCancelUpload}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="w-full bg-bg-secondary rounded-full h-2">
              <div
                className="bg-action-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Uploaded File Display */}
        {data.uploadedFile && (
          <div className="border border-border rounded-lg p-6 bg-bg-secondary/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-bg-default border border-border flex items-center justify-center flex-shrink-0">
                <File className="w-7 h-7 text-action-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary mb-1 truncate">{data.uploadedFile.name}</p>
                <p className="text-sm text-text-secondary">{formatFileSize(data.uploadedFile.size)}</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile} className="border border-border">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // External Link UI
  if (data.loType === 'external-link') {
    return (
      <div className="space-y-6">
        <h2 className="text-text-primary font-medium text-lg">외부 링크 URL 입력</h2>

        <div className="space-y-4">
          {/* URL 입력 */}
          <div>
            <label className="block text-sm text-text-primary mb-2">
              외부 웹사이트 URL <span className="text-status-error">*</span>
            </label>
            <div className="relative">
              <LinkIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <Input
                type="url"
                value={data.externalUrl || ''}
                onChange={(e) => onUpdate({ externalUrl: e.target.value })}
                placeholder="https://example.com"
                className="pl-10"
              />
            </div>
          </div>

          {/* URL 미리보기 */}
          {data.externalUrl && (
            <div className="border border-border rounded-lg p-4 bg-bg-secondary/50">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-bg-default border border-border flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-6 h-6 text-action-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-secondary mb-1">연결된 URL</p>
                  <a
                    href={data.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-action-primary hover:underline break-all"
                  >
                    {data.externalUrl}
                  </a>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpdate({ externalUrl: undefined })}
                  className="border border-border"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="p-4 bg-bg-secondary rounded-lg border border-border">
            <p className="text-sm text-text-secondary">
              <strong className="text-text-primary">외부 링크 안내:</strong> 학습자는 이 링크를 클릭하여 외부
              웹사이트로 이동합니다. 외부 사이트의 콘텐츠는 MZ run 플랫폼에서 관리되지 않으며, 링크가
              유효한지 정기적으로 확인하시기 바랍니다.
            </p>
          </div>

          {/* URL 형식 예시 */}
          <div className="border-l-4 border-action-primary pl-4 py-2">
            <p className="text-xs text-text-secondary mb-1">URL 형식 예시:</p>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• https://www.youtube.com/watch?v=...</li>
              <li>• https://docs.google.com/document/...</li>
              <li>• https://github.com/username/repository</li>
              <li>• https://www.coursera.org/learn/...</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
