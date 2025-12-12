import { useState, useRef } from 'react';
import { FileText, FileVideo, Link as LinkIcon, X, Tag, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Input, Textarea, Select } from '@/components/common';
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
              간략 설명 <span className="text-status-error">*</span>
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

      {/* 카테고리 및 태그 */}
      <div>
        <h2 className="text-text-primary mb-4">분류 및 태그</h2>

        <div className="flex flex-col gap-4">
          {/* 카테고리 드롭다운 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              카테고리 <span className="text-status-error">*</span>
            </label>
            <Select
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
                <Tag className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="태그 입력 후 Enter"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-bg-default text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-action-primary"
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

      {/* 미리보기 이미지 업로드 */}
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
    </div>
  );
}
