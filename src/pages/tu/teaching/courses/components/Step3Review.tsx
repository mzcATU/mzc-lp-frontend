/**
 * Step 3: 검토 및 저장
 * 담당: 최종 검토 화면
 */
import {
  Plus,
  Pencil,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calendar,
  Tag,
  Globe,
  FileText,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import { Button, Label, Card, CardHeader, CardContent, Alert, AlertDescription } from '@/components/common';
import type { CourseFormData } from '@/types';
import type { CategoryResponse } from '@/types/common';
import type { CurriculumItem } from '@/types/tu';
import { isCurriculumFolder, isCurriculumContent } from '@/types/tu';
import { translations, levelOptions, type TranslationKey } from './courseCreate.constants';

/** 커리큘럼 아이템 수 계산 (폴더/콘텐츠 분리) */
function countCurriculumItems(items: CurriculumItem[]): { folders: number; contents: number } {
  let folders = 0;
  let contents = 0;
  for (const item of items) {
    if (isCurriculumFolder(item)) {
      folders++;
      const childCounts = countCurriculumItems(item.children);
      folders += childCounts.folders;
      contents += childCounts.contents;
    } else {
      contents++;
    }
  }
  return { folders, contents };
}

/** 트리 아이템 렌더링 컴포넌트 */
function CurriculumTreeItem({
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
        className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-bg-secondary"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          <button
            type="button"
            onClick={() => onToggle(item.id)}
            className="p-0.5 hover:bg-bg-secondary rounded"
          >
            {isExpanded ? (
              <ChevronDown size={14} className="text-text-secondary" />
            ) : (
              <ChevronRight size={14} className="text-text-secondary" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        {isFolder ? (
          <Folder size={16} className="text-yellow-500 shrink-0" />
        ) : (
          <File size={16} className="text-blue-500 shrink-0" />
        )}
        <span className="text-text-primary text-sm truncate">
          {isContent && item.displayName ? (
            <>
              {item.displayName}
              <span className="text-text-placeholder ml-1 text-xs">({item.originalFileName})</span>
            </>
          ) : (
            item.name
          )}
        </span>
      </div>
      {isFolder && isExpanded && item.children.length > 0 && (
        <div>
          {item.children.map((child) => (
            <CurriculumTreeItem
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

interface Step3ReviewProps {
  language: 'ko' | 'en';
  formData: CourseFormData;
  categories: CategoryResponse[];
  onGoToStep: (step: number) => void;
  onPreview: () => void;
}

export function Step3Review({
  language,
  formData,
  categories,
  onGoToStep,
  onPreview,
}: Readonly<Step3ReviewProps>) {
  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  // 폴더 확장 상태 관리 (기본: 모두 확장)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    const collectFolderIds = (items: CurriculumItem[]) => {
      for (const item of items) {
        if (isCurriculumFolder(item)) {
          ids.add(item.id);
          collectFolderIds(item.children);
        }
      }
    };
    collectFolderIds(formData.curriculumItems);
    return ids;
  });

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

  // 커리큘럼 아이템 수
  const itemCounts = countCurriculumItems(formData.curriculumItems);

  // 경고 메시지 계산
  const warnings: string[] = [];
  if (!formData.title) warnings.push(getText('warningCourse'));
  if (!formData.categoryId) warnings.push(getText('warningCategory'));
  if (formData.curriculumItems.length === 0) warnings.push(getText('warningLesson'));

  return (
    <div className="flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-text-primary mb-2">{getText('reviewTitle')}</h2>
          <p className="text-text-secondary m-0">{getText('reviewDesc')}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onPreview} className="shrink-0">
          <Eye size={14} />
          {getText('preview')}
        </Button>
      </div>

      {/* 경고 메시지 또는 완료 메시지 */}
      {warnings.length > 0 ? (
        <Alert variant="destructive" style={{ backgroundColor: '#fd9a9a' }}>
          <AlertTriangle size={16} />
          <AlertDescription>
            <strong>{getText('warningTitle')}</strong>
            <ul className="mt-2 mb-0 pl-4">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="info">
          <CheckCircle2 size={16} />
          <AlertDescription>
            <strong>{getText('readyToPublish')}</strong>
            <p className="mt-1 mb-0">{getText('readyToPublishDesc')}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* 기본 정보 섹션 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-action-primary" />
              <h3 className="text-text-primary m-0 text-base font-medium">{getText('basicInfo')}</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onGoToStep(1)} className="border border-border">
              <Pencil size={14} />
              {getText('edit')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 강의명 */}
            <div className="md:col-span-2">
              <Label className="text-text-secondary text-sm">{getText('courseName')}</Label>
              <p className="text-text-primary mt-1 mb-0">
                {formData.title || <span className="text-text-tertiary italic">{getText('notEntered')}</span>}
              </p>
            </div>

            {/* 강의 설명 */}
            <div className="md:col-span-2">
              <Label className="text-text-secondary text-sm">{getText('courseDescription')}</Label>
              <p className="text-text-primary mt-1 mb-0 whitespace-pre-wrap">
                {formData.description || (
                  <span className="text-text-tertiary italic">{getText('notEntered')}</span>
                )}
              </p>
            </div>

            {/* 카테고리 */}
            <div>
              <Label className="text-text-secondary text-sm">{getText('category')}</Label>
              <p className="text-text-primary mt-1 mb-0">
                {formData.categoryId ? (
                  categories.find((cat) => cat.id === formData.categoryId)?.name
                ) : (
                  <span className="text-text-tertiary italic">{getText('notEntered')}</span>
                )}
              </p>
            </div>

            {/* 난이도 */}
            <div>
              <Label className="text-text-secondary text-sm">{getText('difficulty')}</Label>
              <p className="text-text-primary mt-1 mb-0">
                {formData.level ? (
                  levelOptions.find((opt) => opt.value === formData.level)?.label
                ) : (
                  <span className="text-text-tertiary italic">{getText('notEntered')}</span>
                )}
              </p>
            </div>

            {/* 수강 기간 */}
            <div className="md:col-span-2">
              <Label className="text-text-secondary text-sm flex items-center gap-1">
                <Calendar size={14} />
                {getText('period')}
              </Label>
              <p className="text-text-primary mt-1 mb-0">
                {formData.startDate && formData.endDate ? (
                  `${formData.startDate} ~ ${formData.endDate}`
                ) : formData.startDate ? (
                  `${formData.startDate} ~`
                ) : formData.endDate ? (
                  `~ ${formData.endDate}`
                ) : (
                  <span className="text-text-tertiary italic">{getText('noPeriod')}</span>
                )}
              </p>
            </div>

            {/* 태그 */}
            <div className="md:col-span-2">
              <Label className="text-text-secondary text-sm flex items-center gap-1">
                <Tag size={14} />
                {getText('tags')}
              </Label>
              <div className="mt-2">
                {formData.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-bg-secondary text-text-primary text-sm rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-text-tertiary italic">{getText('noTags')}</span>
                )}
              </div>
            </div>

            {/* 다국어 설정 */}
            <div className="md:col-span-2">
              <Label className="text-text-secondary text-sm flex items-center gap-1">
                <Globe size={14} />
                {getText('multiLanguage')}
              </Label>
              <p className="text-text-primary mt-1 mb-0">
                {formData.multiLanguage.enabled ? (
                  <>
                    <span className="text-status-success">{getText('enabled')}</span>
                    {formData.multiLanguage.languages.length > 0 && (
                      <span className="text-text-secondary ml-2">
                        ({formData.multiLanguage.languages.length}
                        {getText('languageCount')}: {formData.multiLanguage.languages.map((l) => l.name).join(', ')})
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-text-tertiary">{getText('disabled')}</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 커리큘럼 섹션 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-action-primary" />
              <h3 className="text-text-primary m-0 text-base font-medium">{getText('curriculum')}</h3>
              {formData.curriculumItems.length > 0 && (
                <span className="text-text-secondary text-sm">
                  ({language === 'ko' ? '폴더' : 'Folders'}: {itemCounts.folders}, {getText('totalContents')}: {itemCounts.contents})
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => onGoToStep(2)} className="border border-border">
              <Pencil size={14} />
              {getText('edit')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {formData.curriculumItems.length > 0 ? (
            <div className="border border-border rounded-lg p-2 max-h-80 overflow-auto">
              {formData.curriculumItems.map((item) => (
                <CurriculumTreeItem
                  key={item.id}
                  item={item}
                  expandedIds={expandedIds}
                  onToggle={handleToggleExpand}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-secondary m-0">{getText('noCurriculum')}</p>
              <Button variant="ghost" size="sm" onClick={() => onGoToStep(2)} className="mt-3 border border-border">
                <Plus size={14} />
                {getText('addLesson')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
