/**
 * 회차 카드 컴포넌트
 * 담당: 콘텐츠 테이블 관련
 */
import { useState } from 'react';
import {
  GripVertical,
  ChevronDown,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  FileText,
  Trash2,
  Settings2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Input, Textarea } from '@/components/common';
import type { LessonData, ContentAttachment } from '@/types';
import { translations, type TranslationKey } from './courseCreate.constants';

interface LessonCardProps {
  language: 'ko' | 'en';
  lesson: LessonData;
  isExpanded: boolean;
  isDragged: boolean;
  onToggle: () => void;
  onUpdate: (updates: Partial<LessonData>) => void;
  onDelete: () => void;
  onAddContent: (type: 'upload' | 'link' | 'existing') => void;
  onDeleteContent: (contentId: string) => void;
  onUpdateContent: (contentId: string, updates: Partial<ContentAttachment>) => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
}

export function LessonCard({
  language,
  lesson,
  isExpanded,
  isDragged,
  onToggle,
  onUpdate,
  onDelete,
  onAddContent,
  onDeleteContent,
  onUpdateContent,
  onDragStart,
  onDragOver,
  onDrop,
}: Readonly<LessonCardProps>) {
  const [expandedContentId, setExpandedContentId] = useState<string | null>(null);

  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  const toggleContentExpand = (contentId: string) => {
    setExpandedContentId(prev => prev === contentId ? null : contentId);
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        'border border-border rounded-lg bg-bg-default overflow-hidden cursor-move transition-opacity',
        isDragged && 'opacity-50'
      )}
    >
      {/* 회차 헤더 */}
      <div
        onClick={onToggle}
        className={cn('p-4 flex items-center gap-3 cursor-pointer', isExpanded && 'bg-bg-secondary')}
      >
        <GripVertical size={20} className="text-text-secondary" />
        <div className="w-7 h-7 rounded-md bg-btn-neutral text-white flex items-center justify-center font-medium text-sm">
          {lesson.order}
        </div>
        <div className="flex-1">
          <span className="text-text-primary font-medium">
            {lesson.title || `회차 ${lesson.order}`}
          </span>
          {lesson.contents.length > 0 && (
            <span className="text-text-secondary ml-2 text-sm">
              ({lesson.contents.length}개 콘텐츠)
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown size={20} className="text-text-secondary" />
        ) : (
          <ChevronRight size={20} className="text-text-secondary" />
        )}
      </div>

      {/* 회차 내용 */}
      {isExpanded && (
        <div className="p-4 pt-0 flex flex-col gap-4">
          {/* 회차 제목 */}
          <Input
            label={
              <>
                {getText('lessonTitle')} <span className="text-status-error">*</span>
              </>
            }
            value={lesson.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder={`${lesson.order}${getText('lessonTitlePlaceholder')}`}
            onClick={(e) => e.stopPropagation()}
          />

          {/* 회차 설명 */}
          <Textarea
            label={getText('lessonDescription')}
            value={lesson.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder={getText('lessonDescriptionPlaceholder')}
            onClick={(e) => e.stopPropagation()}
            rows={3}
          />

          {/* 콘텐츠 목록 */}
          <div>
            <label className="block text-text-primary mb-2 text-sm font-medium">
              {getText('contents')}
            </label>
            {lesson.contents.length > 0 ? (
              <div className="flex flex-col gap-2 mb-3">
                {lesson.contents.map((content) => {
                  const isContentExpanded = expandedContentId === content.id;
                  return (
                    <div key={content.id} className="bg-bg-secondary rounded-md overflow-hidden">
                      {/* 콘텐츠 헤더 */}
                      <div className="p-3 flex items-center gap-3">
                        {content.type === 'upload' ? (
                          <Upload size={18} className="text-text-secondary flex-shrink-0" />
                        ) : content.type === 'existing' ? (
                          <FileText size={18} className="text-text-secondary flex-shrink-0" />
                        ) : (
                          <LinkIcon size={18} className="text-text-secondary flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-text-primary text-sm block truncate">
                            {content.displayName || content.name}
                          </span>
                          {content.displayName && content.displayName !== content.name && (
                            <span className="text-text-tertiary text-xs truncate block">
                              원본: {content.name}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleContentExpand(content.id);
                          }}
                          className={cn(
                            "p-1.5 bg-transparent border-none cursor-pointer rounded transition-colors",
                            isContentExpanded ? "bg-bg-tertiary" : "hover:bg-bg-tertiary"
                          )}
                          title={getText('contentDisplayName')}
                        >
                          <Settings2 size={16} className="text-text-secondary" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteContent(content.id);
                          }}
                          className="p-1.5 bg-transparent border-none cursor-pointer rounded hover:bg-status-error-bg"
                        >
                          <Trash2 size={16} className="text-action-delete" />
                        </button>
                      </div>
                      {/* 콘텐츠 표시 정보 입력 (확장 시) */}
                      {isContentExpanded && (
                        <div className="px-3 pb-3 pt-1 border-t border-border bg-bg-default flex flex-col gap-3">
                          <Input
                            label={getText('contentDisplayName')}
                            value={content.displayName || ''}
                            onChange={(e) => onUpdateContent(content.id, { displayName: e.target.value })}
                            placeholder={getText('contentDisplayNamePlaceholder')}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Textarea
                            label={getText('contentDescription')}
                            value={content.description || ''}
                            onChange={(e) => onUpdateContent(content.id, { description: e.target.value })}
                            placeholder={getText('contentDescriptionPlaceholder')}
                            onClick={(e) => e.stopPropagation()}
                            rows={2}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-text-secondary text-sm mb-3">{getText('noContents')}</p>
            )}

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddContent('upload');
                }}
                className="border border-border"
              >
                <Upload size={16} />
                {getText('fileUpload')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddContent('link');
                }}
                className="border border-border"
              >
                <LinkIcon size={16} />
                {getText('externalLink')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddContent('existing');
                }}
                className="border border-border"
              >
                <FileText size={16} />
                {getText('loadExisting')}
              </Button>
            </div>
          </div>

          {/* 회차 삭제 버튼 */}
          <div className="pt-2 border-t border-border">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`${lesson.order}회차를 삭제하시겠습니까?`)) {
                  onDelete();
                }
              }}
              className="py-2 px-3.5 bg-transparent text-action-delete border-none rounded-md cursor-pointer text-sm flex items-center gap-1.5 hover:bg-status-error-bg"
            >
              <Trash2 size={16} />
              {getText('deleteLesson')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
