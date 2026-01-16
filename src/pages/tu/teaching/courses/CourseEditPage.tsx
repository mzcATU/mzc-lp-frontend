/**
 * 강의 수정 페이지 - 메인 컨테이너
 * 담당: 전체 레이아웃, 상태 관리, 네비게이션
 *
 * 기존 강의 데이터를 불러와 수정하는 페이지
 * CourseCreatePage와 동일한 Step 구조 사용
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common';
import { categoryService } from '@/services/common';
import { useCourse, useCourseItemsHierarchy, useUpdateCourse } from '@/hooks/tu/useCourseQueries';
import { courseService } from '@/services/common';
import type { CourseFormData } from '@/types';
import type { CategoryResponse, UpdateCourseRequest } from '@/types/common';
import type { CurriculumItem } from '@/types/tu';
import { convertHierarchyToCurriculumItems, isCurriculumFolder, isCurriculumContent } from '@/types/tu/curriculum.types';
import { Step1BasicInfo, Step3Review, translations } from './components';
import { Step2CurriculumTree } from './components/Step2CurriculumTree';
import type { TranslationKey } from './components';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';

interface CourseEditPageProps {
  language?: 'ko' | 'en';
}

/**
 * 커리큘럼 트리를 재귀적으로 순회하며 API 호출 (신규 항목만)
 * itemId가 있는 항목은 이미 저장된 항목이므로 건너뜀
 */
async function createCurriculumItemsRecursively(
  courseId: number,
  items: CurriculumItem[],
  parentId: number | null
): Promise<void> {
  for (const item of items) {
    if (isCurriculumFolder(item)) {
      let currentFolderId: number;

      // itemId가 있으면 이미 저장된 폴더
      if (item.itemId) {
        currentFolderId = item.itemId;
      } else {
        // 새 폴더 생성
        const folderResponse = await courseService.createFolder(courseId, {
          folderName: item.name,
          parentId: parentId ?? undefined,
        });
        currentFolderId = folderResponse.itemId;
      }

      // 하위 항목 재귀 생성
      if (item.children.length > 0) {
        await createCurriculumItemsRecursively(
          courseId,
          item.children,
          currentFolderId
        );
      }
    } else if (isCurriculumContent(item)) {
      // itemId가 있으면 이미 저장된 콘텐츠, 건너뜀
      if (item.itemId) {
        continue;
      }

      // contentId가 없으면 에러 (신규 항목인데 contentId가 없음)
      if (!item.contentId) {
        console.error('신규 콘텐츠 항목에 contentId가 없습니다:', item);
        continue;
      }

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

/**
 * 기존 회차/콘텐츠를 모두 삭제
 */
async function deleteAllCurriculumItems(courseId: number): Promise<void> {
  const hierarchy = await courseService.getItemsHierarchy(courseId);
  for (const item of hierarchy) {
    await courseService.deleteItem(courseId, item.itemId);
  }
}

export function CourseEditPage({ language = 'ko' }: Readonly<CourseEditPageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const { courseId } = useParams<{ courseId: string }>();
  const courseIdNum = Number(courseId);

  const { data: courseData, isLoading, isError } = useCourse(courseIdNum);
  const { data: hierarchyData } = useCourseItemsHierarchy(courseIdNum);
  const updateCourseMutation = useUpdateCourse();

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
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

  // 기존 강의 데이터 로드
  useEffect(() => {
    if (courseData && hierarchyData && !isInitialized) {
      setFormData({
        title: courseData.title,
        description: courseData.description || '',
        thumbnailUrl: courseData.thumbnailUrl || '',
        startDate: courseData.startDate || '',
        endDate: courseData.endDate || '',
        categoryId: courseData.categoryId,
        tags: courseData.tags || [],
        level: courseData.level || '',
        type: courseData.type || '',
        lessons: [], // deprecated
        curriculumItems: convertHierarchyToCurriculumItems(hierarchyData),
        isDraft: false,
        multiLanguage: {
          enabled: false,
          languages: [],
        },
      });
      setIsInitialized(true);
    }
  }, [courseData, hierarchyData, isInitialized]);

  // 네비게이션 핸들러
  const handleNext = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const handlePrevious = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const handleGoToStep = (step: number) => setCurrentStep(step);
  const handleClose = () => navigate(prefixPath('/tu/teaching/courses'));

  /**
   * 미리보기 - 새 탭에서 수강생 뷰로 강의 정보 표시
   */
  const handlePreview = () => {
    const previewData = {
      formData,
      categories,
      language,
    };
    sessionStorage.setItem('course-preview-data', JSON.stringify(previewData));
    window.open(prefixPath('/tu/teaching/courses/preview'), '_blank');
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDraft = async () => {
    if (!formData.title) {
      alert('강의명을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const request: UpdateCourseRequest = {
        title: formData.title,
        description: formData.description || undefined,
        thumbnailUrl: formData.thumbnailUrl || undefined,
        level: formData.level || undefined,
        type: formData.type || undefined,
        categoryId: formData.categoryId ?? undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      // 기본 정보 업데이트
      await courseService.update(courseIdNum, request);

      // 기존 회차/콘텐츠 삭제 후 재생성
      if (formData.curriculumItems.length > 0) {
        await deleteAllCurriculumItems(courseIdNum);
        await createCurriculumItemsRecursively(courseIdNum, formData.curriculumItems, null);
      }

      // 저장 후 최신 회차 계층구조 다시 로드하여 ID 동기화
      const hierarchyData = await courseService.getItemsHierarchy(courseIdNum);
      const curriculumItems = convertHierarchyToCurriculumItems(hierarchyData);

      setFormData((prev) => ({
        ...prev,
        curriculumItems,
        isDraft: true,
        lastSaved: new Date().toISOString(),
      }));

      alert('임시저장되었습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      alert('강의명을 입력해주세요.');
      return;
    }

    try {
      const request: UpdateCourseRequest = {
        title: formData.title,
        description: formData.description || undefined,
        thumbnailUrl: formData.thumbnailUrl || undefined,
        level: formData.level || undefined,
        type: formData.type || undefined,
        categoryId: formData.categoryId ?? undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
      };

      await updateCourseMutation.mutateAsync({ id: courseIdNum, request });

      alert('강의가 수정되었습니다!');
      navigate(prefixPath(`/tu/teaching/courses/${courseIdNum}`));
    } catch (error) {
      console.error('강의 수정 실패:', error);
      alert('강의 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // formData 업데이트 핸들러 (Step 컴포넌트들에서 사용)
  const handleFormDataChange = (updates: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const stepLabels = [getText('step1'), getText('step2'), getText('step3')];

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-bg-app min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-text-secondary">
          <Loader2 className="animate-spin" size={24} />
          <span>강의 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError || !courseData) {
    return (
      <div className="bg-bg-app min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">강의 정보를 불러올 수 없습니다.</p>
          <Button onClick={handleClose}>목록으로 돌아가기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-app min-h-screen">
      {/* Header */}
      <div className="bg-bg-default border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-text-primary m-0">{getText('editTitle')}</h1>
          <div className="flex gap-3 items-center">
            {formData.lastSaved && (
              <span className="text-text-secondary text-sm">
                {getText('lastSaved')}: {new Date(formData.lastSaved).toLocaleString('ko-KR')}
              </span>
            )}
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
              onPreview={handlePreview}
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
            <Button
              variant="ghost"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="border border-border"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? '저장 중...' : getText('saveDraft')}
            </Button>
          </div>

          <div>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                {getText('next')}
                <ArrowRight size={18} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={updateCourseMutation.isPending}>
                <Upload size={18} />
                {updateCourseMutation.isPending ? '수정 중...' : getText('editSubmit')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
