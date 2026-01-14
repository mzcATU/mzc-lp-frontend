import { useState, useRef, DragEvent } from 'react';
import { FileText, FileVideo, Link as LinkIcon, X, Tag, Image as ImageIcon, Upload, File, ExternalLink, Music } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Input, Textarea, NativeSelect } from '@/components/common';
import { inputVariants } from '@/styles/form';
import type { LOData, LOType, ContentCategory } from '@/types';

interface Step1Props {
  data: LOData;
  onUpdate: (data: Partial<LOData>) => void;
}

const loTypeCards = [
  {
    type: 'video' as LOType,
    icon: FileVideo,
    title: '비디오',
    description: '동영상 콘텐츠를 업로드합니다',
  },
  {
    type: 'audio' as LOType,
    icon: Music,
    title: '오디오',
    description: 'MP3, WAV 등 오디오를 업로드합니다',
  },
  {
    type: 'image' as LOType,
    icon: ImageIcon,
    title: '이미지',
    description: 'JPG, PNG 등 이미지를 업로드합니다',
  },
  {
    type: 'document' as LOType,
    icon: FileText,
    title: '문서',
    description: 'PDF, TXT 등 문서를 업로드합니다',
  },
  {
    type: 'external-link' as LOType,
    icon: LinkIcon,
    title: '외부 링크',
    description: '외부 웹사이트 URL을 연결합니다',
  },
];

// Mock categories
const categories: ContentCategory[] = [
  { id: 'programming', name: '프로그래밍' },
  { id: 'design', name: '디자인' },
  { id: 'business', name: '비즈니스' },
  { id: 'marketing', name: '마케팅' },
  { id: 'language', name: '외국어' },
  { id: 'etc', name: '기타' },
];

const categoryOptions = [
  { value: '', label: '카테고리 선택' },
  ...categories.map((c) => ({ value: c.id, label: c.name })),
];

export function Step1ContentDefinition({ data, onUpdate }: Readonly<Step1Props>) {
  const [tagInput, setTagInput] = useState('');
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // 파일 업로드 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      onUpdate({ tags: [...data.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ tags: data.tags.filter((tag) => tag !== tagToRemove) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpdate({ thumbnailImage: files[0] });
    }
  };

  const handleRemoveThumbnail = () => {
    onUpdate({ thumbnailImage: undefined });
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  };

  // 파일 업로드 관련 핸들러
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

  const handleFileUpload = (file: globalThis.File) => {
    setIsUploading(true);
    setUploadProgress(0);

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

  // 파일 업로드 UI 렌더링
  const renderFileUpload = () => {
    if (!data.loType || data.loType === 'external-link') return null;

    const acceptedFormats =
      data.loType === 'video'
        ? '.mp4,.mov,.avi,.mkv'
        : data.loType === 'audio'
          ? '.mp3,.wav,.m4a,.flac'
          : data.loType === 'image'
            ? '.jpg,.jpeg,.png,.gif,.webp'
            : '.pdf,.txt,.doc,.docx,.ppt,.pptx';
    const formatText =
      data.loType === 'video'
        ? 'MP4, MOV, AVI, MKV (최대 500MB)'
        : data.loType === 'audio'
          ? 'MP3, WAV, M4A, FLAC (최대 100MB)'
          : data.loType === 'image'
            ? 'JPG, PNG, GIF, WEBP (최대 20MB)'
            : 'PDF, TXT, DOC, DOCX, PPT, PPTX (최대 100MB)';
    const uploadTitle =
      data.loType === 'video' ? '비디오 파일 업로드' : data.loType === 'audio' ? '오디오 파일 업로드' : data.loType === 'image' ? '이미지 파일 업로드' : '문서 파일 업로드';

    return (
      <div>
        <h2 className="text-text-primary mb-4">
          {uploadTitle} <span className="text-status-error">*</span>
        </h2>

        {!data.uploadedFile && !isUploading && (
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
        )}

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
  };

  // 외부 링크 입력 UI 렌더링
  const renderExternalLinkInput = () => {
    if (data.loType !== 'external-link') return null;

    return (
      <div>
        <h2 className="text-text-primary mb-4">
          외부 링크 URL <span className="text-status-error">*</span>
        </h2>

        <div className="space-y-4">
          <div>
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
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 기본 정보 섹션 */}
      <div>
        <h2 className="text-text-primary mb-4">기본 정보</h2>
        <div className="flex flex-col gap-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              콘텐츠 제목 <span className="text-status-error">*</span>
            </label>
            <Input
              value={data.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="콘텐츠 제목을 입력하세요 (최대 50자)"
              maxLength={50}
            />
            <p className="text-xs text-text-secondary mt-1">{data.title.length}/50</p>
          </div>

          {/* 간략 설명 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              간략 설명
            </label>
            <Textarea
              value={data.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="콘텐츠에 대한 간략한 설명을 입력하세요 (최대 200자)"
              maxLength={200}
              rows={4}
            />
            <p className="text-xs text-text-secondary mt-1">{data.description.length}/200</p>
          </div>
        </div>
      </div>

      {/* LO 유형 선택 카드 */}
      <div>
        <h2 className="text-text-primary mb-4">
          콘텐츠 유형 <span className="text-orange-500">*</span>
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {loTypeCards.map((card) => {
            const Icon = card.icon;
            const isSelected = data.loType === card.type;
            return (
              <button
                key={card.type}
                type="button"
                onClick={() => onUpdate({ loType: card.type })}
                className={cn(
                  'p-6 border-2 rounded-lg transition-all hover:border-action-primary cursor-pointer bg-bg-default',
                  isSelected ? 'border-action-primary bg-bg-secondary' : 'border-border'
                )}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center mb-3',
                      isSelected ? 'bg-btn-neutral' : 'bg-bg-secondary'
                    )}
                  >
                    <Icon className={cn('w-8 h-8', isSelected ? 'text-white' : 'text-text-secondary')} />
                  </div>
                  <p className={cn('font-medium mb-1', isSelected ? 'text-action-primary' : 'text-text-primary')}>
                    {card.title}
                  </p>
                  <p className="text-xs text-text-secondary">{card.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 파일 업로드 (유형 선택 후 표시) */}
      {renderFileUpload()}

      {/* 외부 링크 입력 (external-link 선택 시) */}
      {renderExternalLinkInput()}

      {/* 카테고리 및 태그 */}
      <div>
        <h2 className="text-text-primary mb-4">분류 및 태그</h2>

        <div className="flex flex-col gap-4">
          {/* 카테고리 드롭다운 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              카테고리
            </label>
            <NativeSelect
              value={data.category || ''}
              onChange={(e) => onUpdate({ category: e.target.value })}
              options={categoryOptions}
            />
          </div>

          {/* 태그 입력 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">태그</label>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Tag className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary z-10" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="태그 입력 후 Enter"
                  className={cn(inputVariants({ state: 'default' }), 'pl-10')}
                />
              </div>
              <Button type="button" onClick={handleAddTag}>
                추가
              </Button>
            </div>

            {/* 태그 목록 */}
            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-bg-secondary border border-border rounded-full text-sm text-text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-bg-app rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 미리보기 이미지 업로드 - 동영상만 표시 */}
      {data.loType === 'video' && (
        <div>
          <h2 className="text-text-primary mb-4">미리보기 이미지 (썸네일)</h2>

          {!data.thumbnailImage ? (
            <div
              onClick={() => thumbnailInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-action-primary hover:bg-bg-secondary transition-all"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center mb-3">
                  <ImageIcon className="w-8 h-8 text-text-secondary" />
                </div>
                <p className="text-text-primary mb-1">이미지를 선택하세요</p>
                <p className="text-xs text-text-secondary">권장 크기: 1200x630px | JPG, PNG (최대 5MB)</p>
              </div>
              <input
                ref={thumbnailInputRef}
                type="file"
                onChange={handleThumbnailUpload}
                accept="image/jpeg,image/png"
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-border rounded-lg p-4 bg-bg-secondary">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-bg-default border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={URL.createObjectURL(data.thumbnailImage)}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary mb-1 truncate">{data.thumbnailImage.name}</p>
                  <p className="text-sm text-text-secondary">
                    {(data.thumbnailImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button type="button" variant="ghost" onClick={handleRemoveThumbnail} className="border border-border">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
