/**
 * Step 1: 기본 정보 입력
 * 담당: 코스 테이블 관련 필드
 */
import { Globe, Plus, X, ImageIcon } from 'lucide-react';
import {
  Button,
  Input,
  Textarea,
  NativeSelect,
  TagInput,
  Label,
  Checkbox,
  Card,
  CardHeader,
  CardContent,
  Alert,
  AlertDescription,
} from '@/components/common';
import type { CourseFormData, LanguageVersion, CourseLevel, CourseType } from '@/types';
import type { CategoryResponse } from '@/types/common';
import { translations, levelOptions, typeOptions, type TranslationKey } from './courseCreate.constants';

interface Step1BasicInfoProps {
  language: 'ko' | 'en';
  formData: CourseFormData;
  categories: CategoryResponse[];
  onFormDataChange: (data: Partial<CourseFormData>) => void;
}

export function Step1BasicInfo({
  language,
  formData,
  categories,
  onFormDataChange,
}: Readonly<Step1BasicInfoProps>) {
  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  const handleAddLanguage = () => {
    const newLang: LanguageVersion = {
      code: 'en',
      name: 'English',
      courseName: '',
      courseDescription: '',
    };
    onFormDataChange({
      multiLanguage: {
        ...formData.multiLanguage,
        languages: [...formData.multiLanguage.languages, newLang],
      },
    });
  };

  const handleRemoveLanguage = (index: number) => {
    const updated = formData.multiLanguage.languages.filter((_, i) => i !== index);
    onFormDataChange({
      multiLanguage: { ...formData.multiLanguage, languages: updated },
    });
  };

  const handleUpdateLanguage = (index: number, updates: Partial<LanguageVersion>) => {
    const updated = [...formData.multiLanguage.languages];
    updated[index] = { ...updated[index], ...updates };
    onFormDataChange({
      multiLanguage: { ...formData.multiLanguage, languages: updated },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label htmlFor="title">
          {getText('courseName')} <span className="text-status-error">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onFormDataChange({ title: e.target.value })}
          placeholder={getText('courseNamePlaceholder')}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{getText('courseDescription')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFormDataChange({ description: e.target.value })}
          placeholder={getText('courseDescriptionPlaceholder')}
        />
      </div>

      {/* 카테고리, 난이도, 과정 유형 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="categoryId">
            {getText('category')} <span className="text-status-error">*</span>
          </Label>
          <NativeSelect
            id="categoryId"
            value={formData.categoryId?.toString() ?? ''}
            onChange={(e) =>
              onFormDataChange({ categoryId: e.target.value ? Number(e.target.value) : null })
            }
            options={[
              { value: '', label: getText('selectCategory') },
              ...categories.map((cat) => ({ value: cat.id.toString(), label: cat.name })),
            ]}
            required
          />
        </div>

        <NativeSelect
          id="level"
          label={getText('difficulty')}
          value={formData.level}
          onChange={(e) => onFormDataChange({ level: e.target.value as CourseLevel | '' })}
          options={levelOptions}
        />

        <NativeSelect
          id="type"
          label={getText('courseType')}
          value={formData.type}
          onChange={(e) => onFormDataChange({ type: e.target.value as CourseType | '' })}
          options={typeOptions}
        />
      </div>

      {/* 썸네일 URL */}
      <div className="space-y-2">
        <Label htmlFor="thumbnailUrl" className="flex items-center gap-2">
          <ImageIcon size={16} />
          썸네일 이미지
        </Label>
        <Input
          id="thumbnailUrl"
          value={formData.thumbnailUrl || ''}
          onChange={(e) => onFormDataChange({ thumbnailUrl: e.target.value })}
          placeholder="이미지 URL을 입력하세요 (예: https://example.com/image.jpg)"
        />
        {formData.thumbnailUrl && (
          <div className="mt-2 relative w-48 h-32 rounded-lg overflow-hidden border border-border">
            <img
              src={formData.thumbnailUrl}
              alt="썸네일 미리보기"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <p className="text-xs text-text-secondary">
          권장 크기: 400x250px, 지원 형식: JPG, PNG, WebP
        </p>
      </div>

      <TagInput
        label="태그"
        hint="강의와 관련된 키워드를 쉼표(,)로 구분하여 입력하세요. 예: React, TypeScript, 프론트엔드"
        value={formData.tags}
        onChange={(tags) => onFormDataChange({ tags })}
        placeholder="태그를 입력하세요 (쉼표로 구분)"
      />

      {/* 다국어 설정 */}
      <Card className="bg-bg-secondary">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-text-primary" />
            <h3 className="text-text-primary m-0 text-base font-medium">다국어 버전 설정</h3>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <Checkbox
              checked={formData.multiLanguage.enabled}
              onCheckedChange={(checked) =>
                onFormDataChange({
                  multiLanguage: { ...formData.multiLanguage, enabled: !!checked },
                })
              }
            />
            <span className="text-text-primary">다국어 버전 활성화</span>
          </label>

          {formData.multiLanguage.enabled && (
            <div className="p-4 bg-bg-default rounded-lg">
              <p className="text-text-secondary text-sm mb-3">
                지원할 언어를 추가하고 각 언어별 강의 정보를 입력하세요.
              </p>
              <Button type="button" size="sm" onClick={handleAddLanguage}>
                <Plus size={16} />
                언어 추가
              </Button>

              {formData.multiLanguage.languages.map((lang, index) => (
                <div key={index} className="mt-4 p-4 bg-bg-secondary rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(index)}
                    className="absolute top-3 right-3 p-1 bg-transparent border-none cursor-pointer text-text-secondary hover:text-text-primary"
                  >
                    <X size={18} />
                  </button>

                  <div className="mb-3">
                    <Label className="mb-1.5">언어 코드</Label>
                    <NativeSelect
                      value={lang.code}
                      onChange={(e) =>
                        handleUpdateLanguage(index, {
                          code: e.target.value,
                          name: e.target.selectedOptions[0].text,
                        })
                      }
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'ja', label: '日本語 (Japanese)' },
                        { value: 'zh', label: '中文 (Chinese)' },
                        { value: 'es', label: 'Español (Spanish)' },
                        { value: 'fr', label: 'Français (French)' },
                      ]}
                    />
                  </div>

                  <div className="mb-3">
                    <Input
                      label={`강의 이름 (${lang.name})`}
                      value={lang.courseName}
                      onChange={(e) => handleUpdateLanguage(index, { courseName: e.target.value })}
                      placeholder={`Enter course name in ${lang.name}`}
                    />
                  </div>

                  <Textarea
                    label={`강의 소개 (${lang.name})`}
                    value={lang.courseDescription}
                    onChange={(e) =>
                      handleUpdateLanguage(index, { courseDescription: e.target.value })
                    }
                    placeholder={`Enter course description in ${lang.name}`}
                    rows={3}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Alert variant="info" style={{ borderLeftColor: 'var(--color-btn-brand)' }} className="[&>svg]:text-[var(--color-btn-brand)]">
        <AlertDescription>
          <strong>Tip:</strong> 기본 정보는 나중에 수정할 수 있습니다. 다음 단계에서 차시를 구성하고
          콘텐츠를 추가할 수 있습니다.
        </AlertDescription>
      </Alert>
    </div>
  );
}
