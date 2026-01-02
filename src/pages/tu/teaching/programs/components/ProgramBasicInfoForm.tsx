import { Card, Label, Input, Textarea, NativeSelect } from '@/components/common';
import { Image } from 'lucide-react';
import type { ProgramLevel, ProgramType } from '@/types/common';

export interface ProgramFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  level: ProgramLevel | '';
  type: ProgramType | '';
  estimatedHours: number | null;
}

interface ProgramBasicInfoFormProps {
  formData: ProgramFormData;
  onFormDataChange: (data: Partial<ProgramFormData>) => void;
  language?: 'ko' | 'en';
}

const t = {
  basicInfo: { ko: '기본 정보', en: 'Basic Information' },
  title: { ko: '프로그램명', en: 'Program Title' },
  titlePlaceholder: { ko: '프로그램 제목을 입력하세요', en: 'Enter program title' },
  titleRequired: { ko: '* 필수', en: '* Required' },
  description: { ko: '설명', en: 'Description' },
  descriptionPlaceholder: {
    ko: '프로그램에 대한 설명을 입력하세요',
    en: 'Enter program description',
  },
  thumbnailUrl: { ko: '썸네일 URL', en: 'Thumbnail URL' },
  thumbnailPlaceholder: { ko: 'https://example.com/image.jpg', en: 'https://example.com/image.jpg' },
  level: { ko: '난이도', en: 'Level' },
  selectLevel: { ko: '난이도 선택', en: 'Select level' },
  beginner: { ko: '초급', en: 'Beginner' },
  intermediate: { ko: '중급', en: 'Intermediate' },
  advanced: { ko: '고급', en: 'Advanced' },
  type: { ko: '유형', en: 'Type' },
  selectType: { ko: '유형 선택', en: 'Select type' },
  online: { ko: '온라인', en: 'Online' },
  offline: { ko: '오프라인', en: 'Offline' },
  blended: { ko: '블렌디드', en: 'Blended' },
  estimatedHours: { ko: '예상 학습시간 (시간)', en: 'Estimated Hours' },
  estimatedHoursPlaceholder: { ko: '예: 10', en: 'e.g., 10' },
  preview: { ko: '미리보기', en: 'Preview' },
};

export function ProgramBasicInfoForm({
  formData,
  onFormDataChange,
  language = 'ko',
}: Readonly<ProgramBasicInfoFormProps>) {
  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const handleChange = (field: keyof ProgramFormData, value: string | number | null) => {
    onFormDataChange({ [field]: value });
  };

  return (
    <Card>
      <div className="p-5">
        <h2 className="text-base font-medium text-text-primary mb-6">{getText('basicInfo')}</h2>

        <div className="space-y-5">
          {/* 프로그램명 */}
          <div>
            <Label className="text-text-primary mb-2 flex items-center gap-2">
              {getText('title')}
              <span className="text-status-error text-xs">{getText('titleRequired')}</span>
            </Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={getText('titlePlaceholder')}
            />
          </div>

          {/* 설명 */}
          <div>
            <Label className="text-text-primary mb-2">{getText('description')}</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={getText('descriptionPlaceholder')}
              rows={4}
            />
          </div>

          {/* 썸네일 URL */}
          <div>
            <Label className="text-text-primary mb-2">{getText('thumbnailUrl')}</Label>
            <Input
              value={formData.thumbnailUrl}
              onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              placeholder={getText('thumbnailPlaceholder')}
            />
            {formData.thumbnailUrl && (
              <div className="mt-3">
                <Label className="text-text-secondary text-xs mb-1">{getText('preview')}</Label>
                <div className="w-48 aspect-video rounded-lg overflow-hidden bg-bg-secondary">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
            {!formData.thumbnailUrl && (
              <div className="mt-3 w-48 aspect-video rounded-lg bg-bg-secondary flex items-center justify-center">
                <Image size={24} className="text-text-placeholder" />
              </div>
            )}
          </div>

          {/* 난이도, 유형, 예상시간 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 난이도 */}
            <div>
              <Label className="text-text-primary mb-2">{getText('level')}</Label>
              <NativeSelect
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value as ProgramLevel | '')}
                options={[
                  { value: '', label: getText('selectLevel') },
                  { value: 'BEGINNER', label: getText('beginner') },
                  { value: 'INTERMEDIATE', label: getText('intermediate') },
                  { value: 'ADVANCED', label: getText('advanced') },
                ]}
              />
            </div>

            {/* 유형 */}
            <div>
              <Label className="text-text-primary mb-2">{getText('type')}</Label>
              <NativeSelect
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as ProgramType | '')}
                options={[
                  { value: '', label: getText('selectType') },
                  { value: 'ONLINE', label: getText('online') },
                  { value: 'OFFLINE', label: getText('offline') },
                  { value: 'BLENDED', label: getText('blended') },
                ]}
              />
            </div>

            {/* 예상 학습시간 */}
            <div>
              <Label className="text-text-primary mb-2">{getText('estimatedHours')}</Label>
              <Input
                type="number"
                min={0}
                value={formData.estimatedHours ?? ''}
                onChange={(e) =>
                  handleChange(
                    'estimatedHours',
                    e.target.value ? parseInt(e.target.value, 10) : null
                  )
                }
                placeholder={getText('estimatedHoursPlaceholder')}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
