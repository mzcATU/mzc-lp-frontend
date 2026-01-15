/**
 * 강의 미리보기 페이지
 * 수강생이 보게 될 강의 모습을 미리보기
 * sessionStorage에서 formData를 읽어와 표시
 */
import { useState, useEffect } from 'react';
import {
  X,
  Eye,
  BookOpen,
  Tag,
  Calendar,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { Button, Card, CardHeader, CardContent } from '@/components/common';
import type { CourseFormData } from '@/types';
import type { CategoryResponse } from '@/types/common';
import type { CurriculumItem } from '@/types/tu';
import { isCurriculumFolder, isCurriculumContent } from '@/types/tu';
import { translations, levelOptions, type TranslationKey } from './components/courseCreate.constants';

interface PreviewData {
  formData: CourseFormData;
  categories: CategoryResponse[];
  language: 'ko' | 'en';
}

/** 커리큘럼 트리 아이템 렌더링 */
function PreviewTreeItem({
  item,
  depth = 0,
  expandedIds,
  onToggle,
}: {
  item: CurriculumItem;
  depth?: number;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const isFolder = isCurriculumFolder(item);
  const isContent = isCurriculumContent(item);
  const isExpanded = expandedIds.has(item.id);

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 rounded hover:bg-bg-secondary"
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        {isFolder ? (
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className="p-0.5 hover:bg-bg-tertiary rounded"
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-text-secondary" />
            ) : (
              <ChevronRight size={16} className="text-text-secondary" />
            )}
          </button>
        ) : (
          <span className="w-6" />
        )}
        {isFolder ? (
          <Folder size={18} className="text-yellow-500 shrink-0" />
        ) : (
          <File size={18} className="text-blue-500 shrink-0" />
        )}
        <span className="text-text-primary">
          {isContent && item.displayName ? item.displayName : item.name}
        </span>
      </div>
      {isFolder && isExpanded && item.children.length > 0 && (
        <div>
          {item.children.map((child) => (
            <PreviewTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CoursePreviewPage() {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // sessionStorage에서 미리보기 데이터 로드
  useEffect(() => {
    const stored = sessionStorage.getItem('course-preview-data');
    if (stored) {
      try {
        const data: PreviewData = JSON.parse(stored);
        setPreviewData(data);

        // 모든 폴더 기본 확장
        const ids = new Set<string>();
        const collectFolderIds = (items: CurriculumItem[]) => {
          for (const item of items) {
            if (isCurriculumFolder(item)) {
              ids.add(item.id);
              collectFolderIds(item.children);
            }
          }
        };
        collectFolderIds(data.formData.curriculumItems);
        setExpandedIds(ids);
      } catch {
        console.error('미리보기 데이터 파싱 실패');
      }
    }
  }, []);

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClose = () => {
    window.close();
  };

  if (!previewData) {
    return (
      <div className="bg-bg-app min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-text-tertiary mx-auto mb-4" />
          <p className="text-text-secondary">미리보기 데이터가 없습니다.</p>
          <Button variant="ghost" onClick={handleClose} className="mt-4 border border-border">
            창 닫기
          </Button>
        </div>
      </div>
    );
  }

  const { formData, categories, language } = previewData;

  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  const categoryName = categories.find((cat) => cat.id === formData.categoryId)?.name;
  const levelLabel = levelOptions.find((opt) => opt.value === formData.level)?.label;

  return (
    <div className="bg-bg-app min-h-screen">
      {/* 미리보기 모드 배너 */}
      <div className="bg-action-primary text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye size={18} />
          <span className="font-medium">{getText('previewMode')}</span>
          <span className="text-white/80 text-sm ml-2">- {getText('previewDesc')}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="text-white hover:bg-white/20 border-white/30"
        >
          <X size={16} />
          {getText('closePreview')}
        </Button>
      </div>

      {/* 강의 헤더 영역 */}
      <div className="bg-bg-default border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* 썸네일이 있으면 표시 */}
          {formData.thumbnailUrl && (
            <div className="mb-6">
              <img
                src={formData.thumbnailUrl}
                alt={formData.title || '강의 썸네일'}
                className="w-full max-h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* 강의 제목 */}
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            {formData.title || <span className="text-text-tertiary italic">{getText('notEntered')}</span>}
          </h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap gap-4 mb-4">
            {categoryName && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-bg-secondary rounded-full text-sm text-text-secondary">
                <BookOpen size={14} />
                {categoryName}
              </span>
            )}
            {levelLabel && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-bg-secondary rounded-full text-sm text-text-secondary">
                {levelLabel}
              </span>
            )}
            {(formData.startDate || formData.endDate) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-bg-secondary rounded-full text-sm text-text-secondary">
                <Calendar size={14} />
                {formData.startDate && formData.endDate
                  ? `${formData.startDate} ~ ${formData.endDate}`
                  : formData.startDate
                    ? `${formData.startDate} ~`
                    : `~ ${formData.endDate}`}
              </span>
            )}
          </div>

          {/* 태그 */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-action-primary/10 text-action-primary text-sm rounded-md"
                >
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 강의 설명 */}
        {formData.description && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-medium text-text-primary m-0">{getText('courseDescription')}</h2>
            </CardHeader>
            <CardContent>
              <p className="text-text-primary whitespace-pre-wrap m-0">{formData.description}</p>
            </CardContent>
          </Card>
        )}

        {/* 커리큘럼 */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-text-primary m-0">{getText('curriculum')}</h2>
          </CardHeader>
          <CardContent>
            {formData.curriculumItems.length > 0 ? (
              <div className="border border-border rounded-lg overflow-hidden">
                {formData.curriculumItems.map((item) => (
                  <PreviewTreeItem
                    key={item.id}
                    item={item}
                    expandedIds={expandedIds}
                    onToggle={handleToggleExpand}
                  />
                ))}
              </div>
            ) : (
              <p className="text-text-tertiary text-center py-8 m-0">{getText('noCurriculum')}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
