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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, FileText, Loader2, Send } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common';
import { courseService, categoryService } from '@/services/common';
import type { CourseFormData } from '@/types';
import type { CategoryResponse, CreateCourseRequest } from '@/types/common';
import type { CurriculumItem } from '@/types/tu';
import { isCurriculumFolder, isCurriculumContent, convertHierarchyToCurriculumItems } from '@/types/tu';
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

/**
 * 기존 회차/콘텐츠를 모두 삭제
 * 루트 레벨 항목만 삭제 (하위 항목은 cascade 삭제됨)
 */
async function deleteAllCurriculumItems(courseId: number): Promise<void> {
  const hierarchy = await courseService.getItemsHierarchy(courseId);
  for (const item of hierarchy) {
    await courseService.deleteItem(courseId, item.itemId);
  }
}

export function CourseCreatePage({ language = 'ko' }: Readonly<CourseCreatePageProps>) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseIdParam = searchParams.get('courseId');

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(
    courseIdParam ? Number(courseIdParam) : null
  );
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

  // 기존 강의 불러오기 (courseId가 있는 경우)
  useEffect(() => {
    const loadExistingCourse = async () => {
      if (!courseId) return;

      setIsLoading(true);
      try {
        // 기본 정보와 회차 계층구조를 병렬로 조회
        const [course, hierarchyData] = await Promise.all([
          courseService.getCourse(courseId),
          courseService.getItemsHierarchy(courseId),
        ]);

        // 회차 계층구조를 CurriculumItem 형태로 변환
        const curriculumItems = convertHierarchyToCurriculumItems(hierarchyData);

        setFormData((prev) => ({
          ...prev,
          title: course.title,
          description: course.description || '',
          thumbnailUrl: course.thumbnailUrl || undefined,
          level: course.level || '',
          type: course.type || '',
          categoryId: course.categoryId,
          startDate: course.startDate || '',
          endDate: course.endDate || '',
          tags: course.tags || [],
          curriculumItems,
          isDraft: !course.isComplete,
          lastSaved: course.updatedAt,
        }));
      } catch (error) {
        console.error('강의 불러오기 실패:', error);
        alert('강의를 불러오는데 실패했습니다.');
        navigate('/tu/teaching/courses');
      } finally {
        setIsLoading(false);
      }
    };
    loadExistingCourse();
  }, [courseId, navigate]);

  // 네비게이션 핸들러
  const handleNext = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const handlePrevious = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const handleGoToStep = (step: number) => setCurrentStep(step);
  const handleClose = () => navigate('/tu/teaching/courses');

  const handleSaveDraft = async () => {
    if (!formData.title) {
      alert('강의명을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const request: CreateCourseRequest = {
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

      let targetCourseId = courseId;

      if (courseId) {
        // 기존 강의 수정
        await courseService.update(courseId, request);

        // 기존 회차/콘텐츠 삭제 후 재생성
        if (formData.curriculumItems.length > 0) {
          await deleteAllCurriculumItems(courseId);
          await createCurriculumItemsRecursively(courseId, formData.curriculumItems, null);
        }
      } else {
        // 새 강의 생성
        const response = await courseService.create(request);
        targetCourseId = response.courseId;
        setCourseId(response.courseId);
        // URL 업데이트 (뒤로가기 시에도 courseId 유지)
        navigate(`/tu/teaching/courses/create?courseId=${response.courseId}`, { replace: true });

        // 회차/콘텐츠 생성
        if (formData.curriculumItems.length > 0) {
          await createCurriculumItemsRecursively(response.courseId, formData.curriculumItems, null);
        }
      }

      // 저장 후 최신 회차 계층구조 다시 로드하여 ID 동기화
      if (targetCourseId) {
        const hierarchyData = await courseService.getItemsHierarchy(targetCourseId);
        const curriculumItems = convertHierarchyToCurriculumItems(hierarchyData);
        setFormData((prev) => ({
          ...prev,
          curriculumItems,
          isDraft: true,
          lastSaved: new Date().toISOString(),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          isDraft: true,
          lastSaved: new Date().toISOString(),
        }));
      }

      alert('저장되었습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title) {
      alert('강의명을 입력해주세요.');
      return;
    }

    if (!confirm(getText('publishConfirm'))) return;

    setIsPublishing(true);
    try {
      const request: CreateCourseRequest = {
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

      let targetCourseId = courseId;

      if (courseId) {
        // 기존 강의 수정
        await courseService.update(courseId, request);

        // 커리큘럼 저장
        if (formData.curriculumItems.length > 0) {
          await deleteAllCurriculumItems(courseId);
          await createCurriculumItemsRecursively(courseId, formData.curriculumItems, null);
        }
      } else {
        // 새 강의 생성
        const response = await courseService.create(request);
        targetCourseId = response.courseId;

        // 커리큘럼 생성
        if (formData.curriculumItems.length > 0) {
          await createCurriculumItemsRecursively(response.courseId, formData.curriculumItems, null);
        }
      }

      // 발행 API 호출
      await courseService.publish(targetCourseId!);

      alert(getText('publishSuccess'));
      navigate('/tu/teaching/courses');
    } catch (error) {
      console.error('강의 발행 실패:', error);
      alert(getText('publishError'));
    } finally {
      setIsPublishing(false);
    }
  };

  // formData 업데이트 핸들러 (Step 컴포넌트들에서 사용)
  const handleFormDataChange = (updates: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const stepLabels = [getText('step1'), getText('step2'), getText('step3')];

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="bg-bg-app min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">강의 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-app min-h-screen">
      {/* Header */}
      <div className="bg-bg-app border-b border-border px-6 py-4">
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
      <div className="bg-bg-app border-b border-border px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm',
                    currentStep >= step ? 'bg-btn-brand text-white' : 'bg-border text-text-secondary'
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
                    className={cn('flex-1 h-0.5', currentStep > step ? 'bg-btn-brand' : 'bg-border')}
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
              <Button onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {getText('publishing')}
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {getText('publish')}
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
