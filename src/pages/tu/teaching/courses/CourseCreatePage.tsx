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
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import { ArrowLeft, ArrowRight, Save, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Checkbox } from '@/components/common';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/Dialog';
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
 * 루트 레벨 항목만 삭제 (하위 항목은 cascade 삭제됨)
 * @deprecated 더 이상 사용하지 않음. 신규 항목만 추가하는 방식으로 변경됨.
 */
// async function deleteAllCurriculumItems(courseId: number): Promise<void> {
//   const hierarchy = await courseService.getItemsHierarchy(courseId);
//   for (const item of hierarchy) {
//     await courseService.deleteItem(courseId, item.itemId);
//   }
// }

export function CourseCreatePage({ language = 'ko' }: Readonly<CourseCreatePageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [searchParams] = useSearchParams();
  const courseIdParam = searchParams.get('courseId');

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(
    courseIdParam ? Number(courseIdParam) : null
  );
  const [courseStatus, setCourseStatus] = useState<'DRAFT' | 'READY' | 'REGISTERED'>('DRAFT');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
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

        // Course 상태 설정
        setCourseStatus(course.status);

        // REGISTERED 상태이면 편집 불가 안내
        if (course.status === 'REGISTERED') {
          alert('이미 등록된 강의는 수정할 수 없습니다.');
          navigate(prefixPath('/tu/teaching/courses'));
          return;
        }

        setFormData((prev) => ({
          ...prev,
          title: course.title,
          description: course.description || '',
          thumbnailUrl: course.thumbnailUrl || undefined,
          level: course.level || '',
          type: course.type || '',
          categoryId: course.categoryId,
          tags: course.tags || [],
          curriculumItems,
          isDraft: !course.isComplete,
          lastSaved: course.updatedAt,
        }));
      } catch (error) {
        console.error('강의 불러오기 실패:', error);
        alert('강의를 불러오는데 실패했습니다.');
        navigate(prefixPath('/tu/teaching/courses'));
      } finally {
        setIsLoading(false);
      }
    };
    loadExistingCourse();
  }, [courseId, navigate, prefixPath]);

  // 네비게이션 핸들러
  const handleNext = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const handlePrevious = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const handleGoToStep = (step: number) => setCurrentStep(step);
  const handleClose = () => navigate(prefixPath('/tu/teaching/courses'));

  // 저장 버튼 클릭 시 모달 열기
  const handleSaveClick = () => {
    if (!formData.title) {
      alert('강의명을 입력해주세요.');
      return;
    }
    setSaveAsDraft(false); // 기본값: 작성완료
    setSaveDialogOpen(true);
  };

  // 실제 저장 처리
  const handleSaveConfirm = async () => {
    setIsSaving(true);
    setSaveDialogOpen(false);

    try {
      const targetCourseId = await saveCourse();
      if (!targetCourseId) throw new Error('저장 실패');

      // 저장 성공 후 최신 데이터 재조회하여 동기화
      const hierarchyData = await courseService.getItemsHierarchy(targetCourseId);
      const curriculumItems = convertHierarchyToCurriculumItems(hierarchyData);
      setFormData((prev) => ({
        ...prev,
        curriculumItems,
        lastSaved: new Date().toISOString(),
      }));

      if (saveAsDraft) {
        // 임시저장 (DRAFT 상태 유지)
        setCourseStatus('DRAFT');
        alert('임시저장되었습니다.');
        navigate(prefixPath('/tu/teaching/courses'));
      } else {
        // 작성완료 (DRAFT → READY)
        await courseService.ready(targetCourseId);
        setCourseStatus('READY');
        alert('저장되었습니다.');
        navigate(prefixPath('/tu/teaching/courses'));
      }
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * 강의 저장 공통 로직
   * @returns 저장된 courseId 또는 null (실패 시)
   */
  const saveCourse = async (): Promise<number | null> => {
    const request: CreateCourseRequest = {
      title: formData.title,
      description: formData.description || undefined,
      thumbnailUrl: formData.thumbnailUrl || undefined,
      level: formData.level || undefined,
      type: formData.type || undefined,
      categoryId: formData.categoryId ?? undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
    };

    let targetCourseId = courseId;

    if (courseId) {
      // 기존 강의 수정
      await courseService.update(courseId, request);

      // 신규 항목만 추가 (기존 항목은 유지)
      if (formData.curriculumItems.length > 0) {
        await createCurriculumItemsRecursively(courseId, formData.curriculumItems, null);
      }
    } else {
      // 새 강의 생성
      const response = await courseService.create(request);
      targetCourseId = response.courseId;
      setCourseId(response.courseId);
      navigate(prefixPath(`/tu/teaching/courses/create?courseId=${response.courseId}`), { replace: true });

      // 커리큘럼 생성 (모두 신규)
      if (formData.curriculumItems.length > 0) {
        await createCurriculumItemsRecursively(response.courseId, formData.curriculumItems, null);
      }
    }

    return targetCourseId;
  };


  /**
   * 등록 (DRAFT → READY → REGISTERED 또는 READY → REGISTERED)
   * 저장과 동시에 CO가 볼 수 있는 상태로 전환
   */
  const handleRegister = async () => {
    if (!formData.title) {
      alert('강의명을 입력해주세요.');
      return;
    }

    if (!confirm(getText('registerConfirm'))) return;

    setIsRegistering(true);
    try {
      let targetCourseId = courseId;

      // DRAFT 상태이면 먼저 저장
      if (courseStatus === 'DRAFT') {
        try {
          targetCourseId = await saveCourse();
          if (!targetCourseId) throw new Error('저장 실패');

          // 저장 성공 후 최신 데이터 재조회하여 동기화
          const hierarchyData = await courseService.getItemsHierarchy(targetCourseId);
          const curriculumItems = convertHierarchyToCurriculumItems(hierarchyData);
          setFormData((prev) => ({
            ...prev,
            curriculumItems,
            lastSaved: new Date().toISOString(),
          }));

          // DRAFT → READY
          await courseService.ready(targetCourseId);
          setCourseStatus('READY');
        } catch (error) {
          console.error('저장 또는 작성완료 실패:', error);
          // 어느 단계에서 실패했는지에 따라 다른 메시지
          if (!targetCourseId) {
            alert('저장에 실패했습니다. 다시 시도해주세요.');
          } else {
            alert('작성완료 처리에 실패했습니다. 저장은 완료되었습니다.');
          }
          setIsRegistering(false);
          return; // 등록 단계로 진행하지 않음
        }
      }

      // READY → REGISTERED (DRAFT였어도 이제 READY 상태)
      if (targetCourseId) {
        try {
          await courseService.register(targetCourseId);
          alert(getText('registerSuccess'));
          navigate(prefixPath('/tu/teaching/courses'));
        } catch (error: any) {
          console.error('등록 실패:', error);
          // 403 에러는 권한 부족으로 명확히 표시
          if (error.response?.status === 403) {
            alert('등록 권한이 없습니다. OPERATOR 역할이 필요합니다.\n\n저장 및 작성완료는 성공했으므로 과정 목록에서 확인할 수 있습니다.');
          } else {
            alert('등록에 실패했습니다. 저장은 완료되었으므로 나중에 다시 시도해주세요.');
          }
        }
      }
    } finally {
      setIsRegistering(false);
    }
  };

  // formData 업데이트 핸들러 (Step 컴포넌트들에서 사용)
  const handleFormDataChange = (updates: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  /**
   * 미리보기 - 새 탭에서 수강생 뷰로 강의 정보 표시
   * sessionStorage에 formData를 저장하고 미리보기 페이지를 새 탭으로 열기
   */
  const handlePreview = () => {
    // formData와 categories 정보를 sessionStorage에 저장
    const previewData = {
      formData,
      categories,
      language,
    };
    sessionStorage.setItem('course-preview-data', JSON.stringify(previewData));

    // 새 탭에서 미리보기 페이지 열기
    window.open(prefixPath('/tu/teaching/courses/preview'), '_blank');
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
        <div className="max-w-5xl mx-auto flex justify-center">
          <div className="flex items-center gap-2 max-w-2xl w-full">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGoToStep(step)}
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm cursor-pointer transition-colors',
                    currentStep >= step ? 'bg-btn-brand text-white hover:opacity-90' : 'bg-border text-text-secondary hover:bg-border-hover'
                  )}
                >
                  {step}
                </button>
                <button
                  type="button"
                  onClick={() => handleGoToStep(step)}
                  className={cn(
                    'text-sm cursor-pointer hover:underline',
                    currentStep >= step ? 'text-text-primary' : 'text-text-secondary',
                    currentStep === step && 'font-medium'
                  )}
                >
                  {stepLabels[step - 1]}
                </button>
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
          </div>

          <div className="flex gap-3">
            {/* 저장 버튼 - 모든 스텝에서 표시 */}
            {(courseStatus === 'DRAFT' || courseStatus === 'READY') && (
              <Button
                variant="ghost"
                onClick={handleSaveClick}
                disabled={isSaving || isRegistering || !formData.title || !formData.categoryId}
                className="border border-border"
                title={
                  !formData.title
                    ? '강의명을 입력해주세요'
                    : !formData.categoryId
                      ? '카테고리를 선택해주세요'
                      : undefined
                }
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    저장
                  </>
                )}
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                {getText('next')}
                <ArrowRight size={18} />
              </Button>
            ) : (
              <>
                {/* 등록 버튼 (DRAFT → REGISTERED 또는 READY → REGISTERED) */}
                <Button
                  onClick={handleRegister}
                  disabled={
                    isSaving ||
                    isRegistering ||
                    !formData.title ||
                    !formData.categoryId ||
                    formData.curriculumItems.length === 0
                  }
                  title={
                    !formData.title
                      ? '강의명을 입력해주세요'
                      : !formData.categoryId
                        ? '카테고리를 선택해주세요'
                        : formData.curriculumItems.length === 0
                          ? '최소 1개의 차시가 필요합니다'
                          : undefined
                  }
                >
                  {isRegistering ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      {getText('registering')}
                    </>
                  ) : (
                    <>
                      <FileText size={18} />
                      {getText('register')}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 저장 모달 */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>저장</DialogTitle>
              <DialogDescription>
                과정을 어떤 상태로 저장하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              {/* 임시저장 옵션 */}
              <label
                className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors"
                style={{
                  borderColor: saveAsDraft ? designTokens.badge.orange.text : designTokens.bg.border,
                  backgroundColor: saveAsDraft ? `${designTokens.badge.orange.bg}40` : 'transparent'
                }}
              >
                <Checkbox
                  checked={saveAsDraft}
                  onCheckedChange={(checked) => setSaveAsDraft(!!checked)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">임시저장</p>
                    <span
                      className="px-2 py-0.5 text-xs rounded-md font-medium"
                      style={{
                        color: designTokens.badge.orange.text,
                        backgroundColor: designTokens.badge.orange.bg
                      }}
                    >
                      작성중
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    나중에 계속 수정할 수 있으며, 목록에 "작성중" 상태로 표시됩니다.
                  </p>
                </div>
              </label>

              {/* 작성완료 옵션 */}
              <label
                className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors"
                style={{
                  borderColor: !saveAsDraft ? designTokens.badge.blue.text : designTokens.bg.border,
                  backgroundColor: !saveAsDraft ? `${designTokens.badge.blue.bg}40` : 'transparent'
                }}
                onClick={() => setSaveAsDraft(false)}
              >
                <Checkbox
                  checked={!saveAsDraft}
                  onCheckedChange={(checked) => setSaveAsDraft(!checked)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">작성완료</p>
                    <span
                      className="px-2 py-0.5 text-xs rounded-md font-medium"
                      style={{
                        color: designTokens.badge.blue.text,
                        backgroundColor: designTokens.badge.blue.bg
                      }}
                    >
                      작성완료
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    작성을 완료하고 목록에 "작성완료" 상태로 표시됩니다.
                  </p>
                </div>
              </label>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setSaveDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSaveConfirm}>
                저장
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
