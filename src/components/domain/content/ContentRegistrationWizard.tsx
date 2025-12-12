import { useState } from 'react';
import { ArrowLeft, ArrowRight, Save, FileText, Upload } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common';
import type { LOData } from '@/types';
import { Step1ContentDefinition } from './Step1ContentDefinition';
import { Step2ContentUpload } from './Step2ContentUpload';
import { Step3Settings } from './Step3Settings';

interface ContentRegistrationWizardProps {
  onBack: () => void;
  onSave: (data: LOData) => void;
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '콘텐츠 등록', en: 'Create Content' },
  loadTemplate: { ko: '템플릿 불러오기', en: 'Load Template' },
  close: { ko: '닫기', en: 'Close' },
  previous: { ko: '이전', en: 'Previous' },
  next: { ko: '다음', en: 'Next' },
  saveDraft: { ko: '임시저장', en: 'Save Draft' },
  submit: { ko: '발행하기', en: 'Publish' },
  step1: { ko: '콘텐츠 정의', en: 'Content Definition' },
  step2: { ko: '파일 업로드', en: 'File Upload' },
  step3: { ko: '설정 및 발행', en: 'Settings & Publish' },
};

const TOTAL_STEPS = 3;

export function ContentRegistrationWizard({
  onBack,
  onSave,
  language = 'ko',
}: Readonly<ContentRegistrationWizardProps>) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LOData>({
    title: '',
    description: '',
    loType: null,
    tags: [],
    allowDownload: false,
    applyWatermark: false,
    completionCriteria: 'button-click',
    accessControl: 'public',
    selectedTenants: [],
  });

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const stepLabels = [getText('step1'), getText('step2'), getText('step3')];

  const handleUpdateData = (updates: Partial<LOData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS && validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    alert('임시저장되었습니다.');
  };

  const handleLoadTemplate = () => {
    alert('템플릿 불러오기 기능은 추후 구현됩니다.');
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) {
      return;
    }
    console.log('Publishing content:', formData);
    onSave(formData);
  };

  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        alert('콘텐츠 제목을 입력해주세요.');
        return false;
      }
      if (!formData.description.trim()) {
        alert('간략 설명을 입력해주세요.');
        return false;
      }
      if (!formData.loType) {
        alert('콘텐츠 유형을 선택해주세요.');
        return false;
      }
      if (!formData.category) {
        alert('카테고리를 선택해주세요.');
        return false;
      }
    }

    if (currentStep === 2) {
      if (formData.loType === 'video' || formData.loType === 'document') {
        if (!formData.uploadedFile) {
          alert('파일을 업로드해주세요.');
          return false;
        }
      }
      if (formData.loType === 'external-link') {
        if (!formData.externalUrl || !formData.externalUrl.trim()) {
          alert('외부 링크 URL을 입력해주세요.');
          return false;
        }
        try {
          new URL(formData.externalUrl);
        } catch {
          alert('올바른 URL 형식을 입력해주세요. (예: https://example.com)');
          return false;
        }
      }
    }

    if (currentStep === 3) {
      if (formData.accessControl === 'specific-tenants' && formData.selectedTenants.length === 0) {
        alert('접근 가능한 테넌트를 최소 1개 이상 선택해주세요.');
        return false;
      }
    }

    return true;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ContentDefinition data={formData} onUpdate={handleUpdateData} />;
      case 2:
        return <Step2ContentUpload data={formData} onUpdate={handleUpdateData} />;
      case 3:
        return <Step3Settings data={formData} onUpdate={handleUpdateData} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-bg-app min-h-screen">
      {/* Header */}
      <div className="bg-bg-default border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-text-primary m-0">{getText('title')}</h1>
          <div className="flex gap-3 items-center">
            <Button variant="ghost" onClick={handleLoadTemplate} className="border border-border">
              <FileText size={16} />
              {getText('loadTemplate')}
            </Button>
            <Button variant="ghost" onClick={onBack} className="border border-border">
              {getText('close')}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-bg-default border-b border-border px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm',
                    currentStep >= step ? 'bg-btn-neutral text-white' : 'bg-border text-text-secondary'
                  )}
                >
                  {step}
                </div>
                <span
                  className={cn(
                    'text-sm',
                    currentStep >= step ? 'text-text-primary' : 'text-text-secondary',
                    currentStep === step && 'font-medium'
                  )}
                >
                  {stepLabels[step - 1]}
                </span>
                {step < TOTAL_STEPS && (
                  <div className={cn('flex-1 h-0.5', currentStep > step ? 'bg-btn-neutral' : 'bg-border')} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-bg-default rounded-xl p-8 border border-border">{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button onClick={handlePrevious}>
                <ArrowLeft size={18} />
                {getText('previous')}
              </Button>
            )}
            <Button variant="ghost" onClick={handleSaveDraft} className="border border-border">
              <Save size={18} />
              {getText('saveDraft')}
            </Button>
          </div>

          <div>
            {currentStep < TOTAL_STEPS ? (
              <Button onClick={handleNext}>
                {getText('next')}
                <ArrowRight size={18} />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Upload size={18} />
                {getText('submit')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
