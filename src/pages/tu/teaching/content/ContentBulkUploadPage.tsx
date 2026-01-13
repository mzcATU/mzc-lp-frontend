import { useState, useRef, DragEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  FolderUp,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common';
import { useBulkUploadContent } from '@/hooks/tu';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';

interface ContentBulkUploadPageProps {
  language?: 'ko' | 'en';
}

type UploadMode = 'files' | 'folder';

interface FileItem {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

const t = {
  title: { ko: '콘텐츠 일괄 등록', en: 'Bulk Content Upload' },
  subtitle: { ko: '여러 파일을 한번에 업로드하세요. 최대 10개까지 가능합니다.', en: 'Upload multiple files at once. Maximum 10 files allowed.' },
  back: { ko: '돌아가기', en: 'Back' },
  uploadMode: { ko: '업로드 방식', en: 'Upload Mode' },
  multipleFiles: { ko: '파일 선택', en: 'Select Files' },
  multipleFilesDesc: { ko: '여러 개의 파일을 직접 선택', en: 'Select multiple files directly' },
  folderUpload: { ko: '폴더 업로드', en: 'Folder Upload' },
  folderUploadDesc: { ko: '폴더 전체를 업로드', en: 'Upload an entire folder' },
  dragAndDrop: { ko: '파일을 드래그하여 업로드하거나', en: 'Drag and drop files here or' },
  selectFiles: { ko: '파일 선택', en: 'Select Files' },
  selectFolder: { ko: '폴더 선택', en: 'Select Folder' },
  supportedFormats: { ko: '지원 형식: MP4, MOV, JPG, PNG, PDF, DOC, DOCX, PPT, PPTX', en: 'Supported: MP4, MOV, JPG, PNG, PDF, DOC, DOCX, PPT, PPTX' },
  maxFiles: { ko: '최대 10개, 총 2GB까지', en: 'Max 10 files, up to 2GB total' },
  selectedFiles: { ko: '선택된 파일', en: 'Selected Files' },
  removeFile: { ko: '파일 삭제', en: 'Remove File' },
  clearAll: { ko: '전체 삭제', en: 'Clear All' },
  upload: { ko: '업로드', en: 'Upload' },
  uploading: { ko: '업로드 중...', en: 'Uploading...' },
  uploadComplete: { ko: '업로드 완료', en: 'Upload Complete' },
  uploadResult: { ko: '업로드 결과', en: 'Upload Result' },
  success: { ko: '성공', en: 'Success' },
  failed: { ko: '실패', en: 'Failed' },
  total: { ko: '전체', en: 'Total' },
  goToList: { ko: '목록으로', en: 'Go to List' },
  uploadMore: { ko: '추가 업로드', en: 'Upload More' },
  tooManyFiles: { ko: '최대 10개까지 선택할 수 있습니다.', en: 'You can select up to 10 files.' },
  noFilesSelected: { ko: '파일을 선택해주세요.', en: 'Please select files.' },
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export function ContentBulkUploadPage({ language = 'ko' }: Readonly<ContentBulkUploadPageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [uploadMode, setUploadMode] = useState<UploadMode>('files');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: number;
    failed: number;
    total: number;
    failedItems: { fileName: string; errorMessage: string }[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const bulkUpload = useBulkUploadContent();

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

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

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const addFiles = (newFiles: File[]) => {
    // 최대 10개 제한
    const currentCount = files.length;
    const allowedCount = 10 - currentCount;

    if (allowedCount <= 0) {
      alert(getText('tooManyFiles'));
      return;
    }

    const filesToAdd = newFiles.slice(0, allowedCount);
    const newFileItems: FileItem[] = filesToAdd.map(f => ({
      file: f,
      status: 'pending' as const,
    }));

    setFiles(prev => [...prev, ...newFileItems]);

    if (newFiles.length > allowedCount) {
      alert(getText('tooManyFiles'));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      addFiles(Array.from(selectedFiles));
    }
    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setFiles([]);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert(getText('noFilesSelected'));
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      // 다중 파일 업로드
      const result = await bulkUpload.mutateAsync({
        files: files.map(f => f.file),
        completionCriteria: 'BUTTON_CLICK',
        downloadable: false,
      });
      setUploadResult({
        success: result.successCount,
        failed: result.failCount,
        total: result.totalCount,
        failedItems: result.failedItems,
      });
    } catch (error) {
      console.error('Bulk upload failed:', error);
      setUploadResult({
        success: 0,
        failed: files.length,
        total: files.length,
        failedItems: files.map(f => ({
          fileName: f.file.name,
          errorMessage: 'Upload failed',
        })),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleGoToList = () => {
    navigate(prefixPath('/tu/teaching/content'));
  };

  const handleUploadMore = () => {
    setFiles([]);
    setUploadResult(null);
  };

  return (
    <div className="min-h-screen bg-bg-app">
      {/* Header */}
      <div className="bg-bg-app border-b border-border px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              {getText('back')}
            </Button>
          </div>
          <h1 className="text-text-primary m-0">{getText('title')}</h1>
          <p className="text-text-secondary text-sm m-0 mt-1">{getText('subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* 업로드 결과 표시 */}
        {uploadResult && (
          <div className="bg-bg-default rounded-xl p-6 border border-border mb-6">
            <h2 className="text-text-primary mb-4">{getText('uploadResult')}</h2>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 bg-status-success/10 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-status-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-status-success">{uploadResult.success}</p>
                <p className="text-sm text-text-secondary">{getText('success')}</p>
              </div>
              <div className="flex-1 bg-status-error/10 rounded-lg p-4 text-center">
                <AlertCircle className="w-8 h-8 text-status-error mx-auto mb-2" />
                <p className="text-2xl font-bold text-status-error">{uploadResult.failed}</p>
                <p className="text-sm text-text-secondary">{getText('failed')}</p>
              </div>
            </div>

            {uploadResult.failedItems.length > 0 && (
              <div className="bg-status-error/5 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-status-error mb-2">
                  {getText('failed')} ({uploadResult.failedItems.length})
                </p>
                <ul className="text-sm text-text-secondary space-y-1">
                  {uploadResult.failedItems.map((item, i) => (
                    <li key={i}>
                      <span className="font-medium">{item.fileName}</span>: {item.errorMessage}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" className="border border-border" onClick={handleUploadMore}>
                {getText('uploadMore')}
              </Button>
              <Button onClick={handleGoToList}>
                {getText('goToList')}
              </Button>
            </div>
          </div>
        )}

        {/* 업로드 모드 선택 */}
        {!uploadResult && (
          <>
            <div className="bg-bg-default rounded-xl p-6 border border-border mb-6">
              <h2 className="text-text-primary mb-4">{getText('uploadMode')}</h2>
              <div className="grid grid-cols-2 gap-4">
                {([
                  { mode: 'files' as const, icon: File, title: getText('multipleFiles'), desc: getText('multipleFilesDesc') },
                  { mode: 'folder' as const, icon: FolderUp, title: getText('folderUpload'), desc: getText('folderUploadDesc') },
                ]).map(({ mode, icon: Icon, title, desc }) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setUploadMode(mode);
                      setFiles([]);
                    }}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      uploadMode === mode
                        ? 'border-action-primary bg-action-primary/5'
                        : 'border-border hover:border-action-primary/50'
                    )}
                  >
                    <Icon className={cn(
                      'w-8 h-8 mb-2',
                      uploadMode === mode ? 'text-action-primary' : 'text-text-secondary'
                    )} />
                    <p className="font-medium text-text-primary">{title}</p>
                    <p className="text-xs text-text-secondary mt-1">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 파일 드롭존 */}
            <div className="bg-bg-default rounded-xl p-6 border border-border mb-6">
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
                onClick={() => {
                  if (uploadMode === 'folder') {
                    folderInputRef.current?.click();
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-4 rounded-full bg-bg-secondary flex items-center justify-center">
                    <Upload className="w-10 h-10 text-action-primary" />
                  </div>
                  <p className="text-text-primary mb-2">{getText('dragAndDrop')}</p>
                  <Button type="button">
                    {uploadMode === 'folder' ? getText('selectFolder') : getText('selectFiles')}
                  </Button>
                  <p className="text-xs text-text-secondary mt-4">{getText('supportedFormats')}</p>
                  <p className="text-xs text-text-secondary">{getText('maxFiles')}</p>
                </div>

                {/* Hidden file inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".mp4,.mov,.avi,.mkv,.jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.doc,.docx,.ppt,.pptx"
                />
                <input
                  ref={folderInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  {...{ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>}
                />
              </div>
            </div>

            {/* 선택된 파일 목록 */}
            {files.length > 0 && (
              <div className="bg-bg-default rounded-xl p-6 border border-border mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-text-primary">
                    {getText('selectedFiles')} ({files.length}/10)
                  </h2>
                  <Button variant="ghost" size="sm" onClick={handleClearAll}>
                    {getText('clearAll')}
                  </Button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {files.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg"
                    >
                      <File className="w-5 h-5 text-action-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary truncate">{item.file.name}</p>
                        <p className="text-xs text-text-secondary">{formatFileSize(item.file.size)}</p>
                      </div>
                      {item.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-status-success flex-shrink-0" />
                      )}
                      {item.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-status-error flex-shrink-0" />
                      )}
                      {item.status === 'pending' && (
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="p-1 hover:bg-bg-default rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-text-secondary" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 업로드 버튼 */}
            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading}
                className="min-w-32"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {getText('uploading')}
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {getText('upload')}
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
