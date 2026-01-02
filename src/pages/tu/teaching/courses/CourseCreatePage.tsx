/**
 * 강의 등록 페이지 - 메인 컨테이너
 * 담당: 전체 레이아웃, 상태 관리, 네비게이션
 *
 * Step별 UI는 components/ 폴더의 개별 컴포넌트 참조:
 * - Step1BasicInfo: 기본 정보 (course 테이블)
 * - Step2CurriculumTree: 커리큘럼 트리 구성 (폴더/콘텐츠 계층)
 * - Step3Review: 검토 및 저장
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, FileText, Upload } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common';
import { courseService, categoryService } from '@/services/common';
import type { CourseFormData } from '@/types';
import type { CategoryResponse, CreateCourseRequest } from '@/types/common';
import type { CurriculumItem } from '@/types/tu';
import { isCurriculumFolder, isCurriculumContent } from '@/types/tu';
import { Step1BasicInfo, Step3Review, translations } from './components';
import { Step2CurriculumTree } from './components/Step2CurriculumTree';
import type { TranslationKey } from './components';

interface CourseCreatePageProps {
  language?: 'ko' | 'en';
}

/**
 * 커리큘럼 트리를 재귀적으로 순회하며 API 호출
 */
async function createCurriculumItemsRecursively(
  courseId: number,
  items: CurriculumItem[],
  parentId: number | null
): Promise<void> {
  for (const item of items) {
    if (isCurriculumFolder(item)) {
      // 폴더 생성
      const folderResponse = await courseService.createFolder(courseId, {
        folderName: item.name,
        parentId: parentId ?? undefined,
      });
      // 하위 항목 재귀 생성
      if (item.children.length > 0) {
        await createCurriculumItemsRecursively(
          courseId,
          item.children,
          folderResponse.itemId
        );
      }
    } else if (isCurriculumContent(item)) {
      // 콘텐츠(차시) 생성 - contentId로 백엔드에서 LO 자동 생성
      await courseService.createItem(courseId, {
        itemName: item.name,
        parentId: parentId ?? undefined,
        contentId: item.contentId,
        displayName: item.displayName || undefined,
        description: item.description || undefined,
      });
    }
  }
}

export function CourseCreatePage({ language = 'ko' }: Readonly<CourseCreatePageProps>) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    categoryId: null,
    tags: [],
    level: '',
    type: '',
    lessons: [], // deprecated
    curriculumItems: [],
    isDraft: false,
    multiLanguage: {
      enabled: false,
      languages: [],
    },
  });

  const totalSteps = 3;

  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  // 카테고리 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('카테고리 목록 조회 실패:', error);
      }
    };
    fetchCategories();
  }, []);

  // 네비게이션 핸들러
  const handleNext = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const handlePrevious = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const handleGoToStep = (step: number) => setCurrentStep(step);
  const handleClose = () => navigate('/tu/teaching/courses');

  const handleSaveDraft = () => {
    setFormData({ ...formData, isDraft: true, lastSaved: new Date().toISOString() });
    alert('임시저장되었습니다.');
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      alert('강의명을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const request: CreateCourseRequest = {
        title: formData.title,
        description: formData.description || undefined,
        level: formData.level || undefined,
        type: formData.type || undefined,
        categoryId: formData.categoryId ?? undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      // 1. 강의 생성
      const courseResponse = await courseService.create(request);
      const courseId = courseResponse.courseId;

      // 2. 커리큘럼 항목 생성 (트리 구조 재귀 처리)
      if (formData.curriculumItems.length > 0) {
        await createCurriculumItemsRecursively(
          courseId,
          formData.curriculumItems,
          null
        );
      }

      alert('강의가 등록되었습니다!');
      navigate('/tu/teaching/courses');
    } catch (error) {
      console.error('강의 등록 실패:', error);
      alert('강의 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // formData 업데이트 핸들러 (Step 컴포넌트들에서 사용)
  const handleFormDataChange = (updates: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const stepLabels = [getText('step1'), getText('step2'), getText('step3')];

  return (
    <div className="bg-bg-app min-h-screen">
      {/* Header */}
      <div className="bg-bg-default border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-text-primary m-0">{getText('title')}</h1>
          <div className="flex gap-3 items-center">
            {formData.lastSaved && (
              <span className="text-text-secondary text-sm">
                {getText('lastSaved')}: {new Date(formData.lastSaved).toLocaleString('ko-KR')}
              </span>
            )}
            <Button
              variant="ghost"
              onClick={() => alert('템플릿 불러오기 기능은 추후 구현됩니다.')}
              className="border border-border"
            >
              <FileText size={16} />
              {getText('loadTemplate')}
            </Button>
            <Button variant="ghost" onClick={handleClose} className="border border-border">
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
            <Step1BasicInfo
              language={language}
              formData={formData}
              categories={categories}
              onFormDataChange={handleFormDataChange}
            />
          )}

          {/* Step 2: 커리큘럼 구성 */}
          {currentStep === 2 && (
            <Step2CurriculumTree
              language={language}
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
          )}

          {/* Step 3: 검토 및 저장 */}
          {currentStep === 3 && (
            <Step3Review
              language={language}
              formData={formData}
              categories={categories}
              onGoToStep={handleGoToStep}
            />
          )}
        </div>

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
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                {getText('next')}
                <ArrowRight size={18} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                <Upload size={18} />
                {isSubmitting ? '등록 중...' : getText('submit')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
