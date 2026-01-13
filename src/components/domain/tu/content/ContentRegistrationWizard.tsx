import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/common';
import type { LOData } from '@/types';
import { Step1ContentDefinition } from './Step1ContentDefinition';

interface ContentRegistrationWizardProps {
  onBack: () => void;
  onSave: (data: LOData) => void;
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '콘텐츠 등록', en: 'Create Content' },
  close: { ko: '닫기', en: 'Close' },
  submit: { ko: '발행하기', en: 'Publish' },
};

export function ContentRegistrationWizard({
  onBack,
  onSave,
  language = 'ko',
}: Readonly<ContentRegistrationWizardProps>) {
  const [formData, setFormData] = useState<LOData>({
    title: '',
    description: '',
    loType: null,
    tags: [],
    allowDownload: false,
    applyWatermark: false,
    completionCriteria: 'button-click',
    accessControl: 'private',
    selectedTenants: [],
  });

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const handleUpdateData = (updates: Partial<LOData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = () => {
    // 제목 검증
    if (!formData.title.trim()) {
      alert('콘텐츠 제목을 입력해주세요.');
      return;
    }

    // 콘텐츠 유형 검증
    if (!formData.loType) {
      alert('콘텐츠 유형을 선택해주세요.');
      return;
    }

    // 파일 업로드 검증
    if (formData.loType === 'video' || formData.loType === 'image' || formData.loType === 'document') {
      if (!formData.uploadedFile) {
        alert('파일을 업로드해주세요.');
        return;
      }
    }

    // 외부 링크 검증
    if (formData.loType === 'external-link') {
      if (!formData.externalUrl || !formData.externalUrl.trim()) {
        alert('외부 링크 URL을 입력해주세요.');
        return;
      }
      try {
        new URL(formData.externalUrl);
      } catch {
        alert('올바른 URL 형식을 입력해주세요. (예: https://example.com)');
        return;
      }
    }

    console.log('Publishing content:', formData);
    onSave(formData);
  };

  return (
    <div className="bg-bg-app min-h-screen">
      {/* Header */}
      <div className="bg-bg-app border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-text-primary m-0">{getText('title')}</h1>
          <div className="flex gap-3 items-center">
            <Button variant="ghost" onClick={onBack} className="border border-border">
              {getText('close')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-bg-default rounded-xl p-8 border border-border">
          <Step1ContentDefinition data={formData} onUpdate={handleUpdateData} />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <Button onClick={handleSubmit}>
            <Upload size={18} />
            {getText('submit')}
          </Button>
        </div>
      </div>
    </div>
  );
}
