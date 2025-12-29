import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Loader2, Calendar, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Input, Label, NativeSelect, Textarea } from '@/components/common';
import { useCreateTime } from '@/hooks/to/useTimeQueries';
import type {
  CreateCourseTimeRequest,
  DeliveryType,
  EnrollmentMethod,
} from '@/types/to/time.types';
import { DELIVERY_TYPE_LABELS, ENROLLMENT_METHOD_LABELS } from '@/types/to/time.types';

interface CourseTimeCreatePageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '차수 생성', en: 'Create Course Time' },
  close: { ko: '닫기', en: 'Close' },
  previous: { ko: '이전', en: 'Previous' },
  next: { ko: '다음', en: 'Next' },
  submit: { ko: '저장', en: 'Save' },
  saving: { ko: '저장 중...', en: 'Saving...' },
  // Steps
  step1: { ko: '기본 정보', en: 'Basic Info' },
  step2: { ko: '기간 설정', en: 'Period' },
  step3: { ko: '정원 및 가격', en: 'Capacity & Price' },
  // Step 1 - Basic Info
  programId: { ko: '프로그램 ID', en: 'Program ID' },
  programIdPlaceholder: { ko: '프로그램 ID를 입력하세요', en: 'Enter program ID' },
  cmCourseId: { ko: '강의 ID', en: 'Course ID' },
  cmCourseIdPlaceholder: { ko: '강의 ID를 입력하세요', en: 'Enter course ID' },
  timeTitle: { ko: '차수명', en: 'Title' },
  timeTitlePlaceholder: { ko: '예: 2025년 1차', en: 'e.g., 2025 Session 1' },
  description: { ko: '설명', en: 'Description' },
  descriptionPlaceholder: { ko: '차수에 대한 설명을 입력하세요 (선택)', en: 'Enter description (optional)' },
  deliveryType: { ko: '진행 방식', en: 'Delivery Type' },
  enrollmentMethod: { ko: '수강 신청 방식', en: 'Enrollment Method' },
  location: { ko: '장소', en: 'Location' },
  locationPlaceholder: { ko: '오프라인/블렌디드 진행 시 장소 입력', en: 'Enter location for offline/blended' },
  // Step 2 - Period
  enrollmentPeriod: { ko: '모집 기간', en: 'Enrollment Period' },
  enrollmentStartDate: { ko: '모집 시작일', en: 'Enrollment Start' },
  enrollmentEndDate: { ko: '모집 종료일', en: 'Enrollment End' },
  learningPeriod: { ko: '학습 기간', en: 'Learning Period' },
  startDate: { ko: '학습 시작일', en: 'Start Date' },
  endDate: { ko: '학습 종료일', en: 'End Date' },
  // Step 3 - Capacity & Price
  capacity: { ko: '정원', en: 'Capacity' },
  capacityPlaceholder: { ko: '0 입력 시 무제한', en: '0 for unlimited' },
  capacityHint: { ko: '최대 수강 인원을 설정합니다. 0을 입력하면 무제한입니다.', en: 'Set maximum enrollment. Enter 0 for unlimited.' },
  price: { ko: '가격', en: 'Price' },
  pricePlaceholder: { ko: '0 입력 시 무료', en: '0 for free' },
  priceHint: { ko: '수강료를 설정합니다. 0을 입력하면 무료입니다.', en: 'Set course fee. Enter 0 for free.' },
  // Validation
  required: { ko: '필수 항목입니다.', en: 'This field is required.' },
  createSuccess: { ko: '차수가 생성되었습니다.', en: 'Course time created successfully.' },
  createError: { ko: '차수 생성에 실패했습니다.', en: 'Failed to create course time.' },
};

export function CourseTimeCreatePage({ language = 'ko' }: Readonly<CourseTimeCreatePageProps>) {
  const navigate = useNavigate();
  const createTime = useCreateTime();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // Form State
  const [formData, setFormData] = useState<CreateCourseTimeRequest>({
    programId: 0,
    cmCourseId: 0,
    title: '',
    deliveryType: 'ONLINE',
    enrollmentMethod: 'FIRST_COME',
    enrollmentStartDate: '',
    enrollmentEndDate: '',
    startDate: '',
    endDate: '',
    capacity: null,
    price: null,
    description: '',
    location: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateCourseTimeRequest, string>>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof CreateCourseTimeRequest, string>> = {};

    if (step === 1) {
      if (!formData.programId) newErrors.programId = getText('required');
      if (!formData.cmCourseId) newErrors.cmCourseId = getText('required');
      if (!formData.title.trim()) newErrors.title = getText('required');
    } else if (step === 2) {
      if (!formData.enrollmentStartDate) newErrors.enrollmentStartDate = getText('required');
      if (!formData.enrollmentEndDate) newErrors.enrollmentEndDate = getText('required');
      if (!formData.startDate) newErrors.startDate = getText('required');
      if (!formData.endDate) newErrors.endDate = getText('required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      const request: CreateCourseTimeRequest = {
        ...formData,
        capacity: formData.capacity === 0 ? null : formData.capacity,
        price: formData.price === 0 ? null : formData.price,
      };

      await createTime.mutateAsync(request);
      alert(getText('createSuccess'));
      navigate('/to/times');
    } catch (err) {
      console.error('Create failed:', err);
      alert(getText('createError'));
    }
  };

  const handleInputChange = (
    field: keyof CreateCourseTimeRequest,
    value: string | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const stepLabels = [getText('step1'), getText('step2'), getText('step3')];

  return (
    <div className="bg-bg-app min-h-screen">
      {/* Header */}
      <div className="bg-bg-default border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-text-primary m-0">{getText('title')}</h1>
          <Button variant="ghost" onClick={() => navigate('/to/times')} className="border border-border">
            {getText('close')}
          </Button>
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
                {step < 3 && (
                  <div
                    className={cn('flex-1 h-0.5', currentStep > step ? 'bg-btn-neutral' : 'bg-border')}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-bg-default rounded-xl p-8 border border-border">
          {/* Step 1: 기본 정보 */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="programId">{getText('programId')} *</Label>
                  <Input
                    id="programId"
                    type="number"
                    placeholder={getText('programIdPlaceholder')}
                    value={formData.programId || ''}
                    onChange={(e) => handleInputChange('programId', parseInt(e.target.value) || 0)}
                    className={errors.programId ? 'border-status-error' : ''}
                  />
                  {errors.programId && (
                    <p className="text-sm text-status-error">{errors.programId}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cmCourseId">{getText('cmCourseId')} *</Label>
                  <Input
                    id="cmCourseId"
                    type="number"
                    placeholder={getText('cmCourseIdPlaceholder')}
                    value={formData.cmCourseId || ''}
                    onChange={(e) => handleInputChange('cmCourseId', parseInt(e.target.value) || 0)}
                    className={errors.cmCourseId ? 'border-status-error' : ''}
                  />
                  {errors.cmCourseId && (
                    <p className="text-sm text-status-error">{errors.cmCourseId}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">{getText('timeTitle')} *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder={getText('timeTitlePlaceholder')}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-status-error' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-status-error">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{getText('description')}</Label>
                <Textarea
                  id="description"
                  placeholder={getText('descriptionPlaceholder')}
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NativeSelect
                  id="deliveryType"
                  label={getText('deliveryType')}
                  value={formData.deliveryType}
                  onChange={(e) => handleInputChange('deliveryType', e.target.value as DeliveryType)}
                  options={Object.entries(DELIVERY_TYPE_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
                <NativeSelect
                  id="enrollmentMethod"
                  label={getText('enrollmentMethod')}
                  value={formData.enrollmentMethod}
                  onChange={(e) => handleInputChange('enrollmentMethod', e.target.value as EnrollmentMethod)}
                  options={Object.entries(ENROLLMENT_METHOD_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </div>

              {(formData.deliveryType === 'OFFLINE' || formData.deliveryType === 'BLENDED') && (
                <div className="space-y-2">
                  <Label htmlFor="location">{getText('location')}</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder={getText('locationPlaceholder')}
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: 기간 설정 */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-8">
              {/* 모집 기간 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-primary">
                  <Calendar size={20} />
                  <h3 className="font-medium m-0">{getText('enrollmentPeriod')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentStartDate">{getText('enrollmentStartDate')} *</Label>
                    <Input
                      id="enrollmentStartDate"
                      type="datetime-local"
                      value={formData.enrollmentStartDate}
                      onChange={(e) => handleInputChange('enrollmentStartDate', e.target.value)}
                      className={errors.enrollmentStartDate ? 'border-status-error' : ''}
                    />
                    {errors.enrollmentStartDate && (
                      <p className="text-sm text-status-error">{errors.enrollmentStartDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentEndDate">{getText('enrollmentEndDate')} *</Label>
                    <Input
                      id="enrollmentEndDate"
                      type="datetime-local"
                      value={formData.enrollmentEndDate}
                      onChange={(e) => handleInputChange('enrollmentEndDate', e.target.value)}
                      className={errors.enrollmentEndDate ? 'border-status-error' : ''}
                    />
                    {errors.enrollmentEndDate && (
                      <p className="text-sm text-status-error">{errors.enrollmentEndDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 학습 기간 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-primary">
                  <Clock size={20} />
                  <h3 className="font-medium m-0">{getText('learningPeriod')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">{getText('startDate')} *</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={errors.startDate ? 'border-status-error' : ''}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-status-error">{errors.startDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">{getText('endDate')} *</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className={errors.endDate ? 'border-status-error' : ''}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-status-error">{errors.endDate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 정원 및 가격 */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="capacity">{getText('capacity')}</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="0"
                    placeholder={getText('capacityPlaceholder')}
                    value={formData.capacity ?? ''}
                    onChange={(e) =>
                      handleInputChange('capacity', e.target.value ? parseInt(e.target.value) : null)
                    }
                  />
                  <p className="text-sm text-text-secondary">{getText('capacityHint')}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">{getText('price')}</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder={getText('pricePlaceholder')}
                    value={formData.price ?? ''}
                    onChange={(e) =>
                      handleInputChange('price', e.target.value ? parseInt(e.target.value) : null)
                    }
                  />
                  <p className="text-sm text-text-secondary">{getText('priceHint')}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <div>
            {currentStep > 1 && (
              <Button variant="ghost" onClick={handlePrevious} className="border border-border">
                <ArrowLeft size={18} />
                {getText('previous')}
              </Button>
            )}
          </div>

          <div>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                {getText('next')}
                <ArrowRight size={18} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={createTime.isPending}>
                {createTime.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {getText('saving')}
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {getText('submit')}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
