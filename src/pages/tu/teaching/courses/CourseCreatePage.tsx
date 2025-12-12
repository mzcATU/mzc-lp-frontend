import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, FileText, Upload, Plus, GripVertical, ChevronDown, ChevronRight, Trash2, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Input, Textarea, Select } from '@/components/common';
import type { CourseFormData, LessonData, ContentAttachment, CourseDifficulty } from '@/types';

const t = {
  title: { ko: '강의 등록', en: 'Create Course' },
  loadTemplate: { ko: '템플릿 불러오기', en: 'Load Template' },
  close: { ko: '닫기', en: 'Close' },
  previous: { ko: '이전', en: 'Previous' },
  next: { ko: '다음', en: 'Next' },
  saveDraft: { ko: '임시저장', en: 'Save Draft' },
  submit: { ko: '강의 등록', en: 'Submit' },
  lastSaved: { ko: '마지막 저장', en: 'Last saved' },
  step1: { ko: '기본 정보', en: 'Basic Info' },
  step2: { ko: '회차 구성', en: 'Curriculum' },
  step3: { ko: '고급 설정', en: 'Advanced' },
  step4: { ko: '배포 및 접근 제어', en: 'Deployment' },
  step5: { ko: '검토 및 저장', en: 'Review' },
  courseName: { ko: '강의명', en: 'Course Name' },
  courseNamePlaceholder: { ko: '강의명을 입력하세요', en: 'Enter course name' },
  courseDescription: { ko: '강의 설명', en: 'Course Description' },
  courseDescriptionPlaceholder: { ko: '강의에 대한 설명을 입력하세요', en: 'Enter course description' },
  category: { ko: '카테고리', en: 'Category' },
  selectCategory: { ko: '카테고리 선택', en: 'Select category' },
  difficulty: { ko: '난이도', en: 'Difficulty' },
  selectDifficulty: { ko: '난이도 선택', en: 'Select difficulty' },
  beginner: { ko: '입문', en: 'Beginner' },
  elementary: { ko: '초급', en: 'Elementary' },
  intermediate: { ko: '중급', en: 'Intermediate' },
  advanced: { ko: '고급', en: 'Advanced' },
  startDate: { ko: '시작일', en: 'Start Date' },
  endDate: { ko: '종료일', en: 'End Date' },
  comingSoon: { ko: '준비 중입니다', en: 'Coming Soon' },
  curriculumTitle: { ko: '회차 구성', en: 'Curriculum' },
  curriculumDesc: { ko: '회차를 추가하고 콘텐츠를 등록하세요. 드래그앤드롭으로 순서를 변경할 수 있습니다.', en: 'Add lessons and register content. Drag and drop to reorder.' },
  noLessons: { ko: '아직 등록된 회차가 없습니다.', en: 'No lessons registered yet.' },
  addFirstLesson: { ko: '첫 번째 회차 추가', en: 'Add First Lesson' },
  addLesson: { ko: '회차 추가', en: 'Add Lesson' },
  lessonTitle: { ko: '회차 제목', en: 'Lesson Title' },
  lessonTitlePlaceholder: { ko: '회차 제목을 입력하세요', en: 'Enter lesson title' },
  lessonDescription: { ko: '회차 설명', en: 'Lesson Description' },
  lessonDescriptionPlaceholder: { ko: '회차에 대한 설명을 입력하세요', en: 'Enter lesson description' },
  contents: { ko: '콘텐츠', en: 'Contents' },
  noContents: { ko: '등록된 콘텐츠가 없습니다.', en: 'No content registered.' },
  fileUpload: { ko: '파일 업로드', en: 'File Upload' },
  externalLink: { ko: '외부 링크', en: 'External Link' },
  loadExisting: { ko: '기존 콘텐츠 불러오기', en: 'Load Existing Content' },
  deleteLesson: { ko: '회차 삭제', en: 'Delete Lesson' },
};

interface CourseCreatePageProps {
  language?: 'ko' | 'en';
}

const categoryOptions = [
  { value: '', label: '카테고리 선택' },
  { value: '프로그래밍', label: '프로그래밍' },
  { value: '백엔드', label: '백엔드' },
  { value: '프론트엔드', label: '프론트엔드' },
  { value: '개발 도구', label: '개발 도구' },
  { value: '데이터베이스', label: '데이터베이스' },
];

const difficultyOptions = [
  { value: '', label: '난이도 선택' },
  { value: 'beginner', label: '입문' },
  { value: 'elementary', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
];

export function CourseCreatePage({ language = 'ko' }: Readonly<CourseCreatePageProps>) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CourseFormData>({
    courseName: '',
    courseDescription: '',
    startDate: '',
    endDate: '',
    category: '',
    tags: [],
    difficulty: '',
    lessons: [],
    isDraft: false,
  });

  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const totalSteps = 5;

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const handleNext = () => currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const handlePrevious = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSaveDraft = () => {
    setFormData({ ...formData, isDraft: true, lastSaved: new Date().toISOString() });
    alert('임시저장되었습니다.');
  };

  const handleClose = () => navigate('/tu/teaching/courses');
  const handleSubmit = () => {
    alert('강의가 등록되었습니다!');
    navigate('/tu/teaching/courses');
  };

  // Step 2 functions
  const addLesson = () => {
    const newLesson: LessonData = {
      id: Date.now().toString(),
      title: '',
      description: '',
      order: formData.lessons.length + 1,
      contents: [],
    };
    setFormData({ ...formData, lessons: [...formData.lessons, newLesson] });
    setExpandedLessons(new Set([...expandedLessons, newLesson.id]));
  };

  const updateLesson = (lessonId: string, updates: Partial<LessonData>) => {
    const updatedLessons = formData.lessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, ...updates } : lesson
    );
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const deleteLesson = (lessonId: string) => {
    const updatedLessons = formData.lessons
      .filter((lesson) => lesson.id !== lessonId)
      .map((lesson, index) => ({ ...lesson, order: index + 1 }));
    setFormData({ ...formData, lessons: updatedLessons });
    const newExpanded = new Set(expandedLessons);
    newExpanded.delete(lessonId);
    setExpandedLessons(newExpanded);
  };

  const toggleLessonExpand = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    newExpanded.has(lessonId) ? newExpanded.delete(lessonId) : newExpanded.add(lessonId);
    setExpandedLessons(newExpanded);
  };

  const addContentToLesson = (lessonId: string, type: 'upload' | 'link') => {
    const newContent: ContentAttachment = {
      id: Date.now().toString(),
      type,
      name: type === 'upload' ? '업로드할 파일' : '링크 URL',
      url: '',
    };
    const updatedLessons = formData.lessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, contents: [...lesson.contents, newContent] } : lesson
    );
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const deleteContent = (lessonId: string, contentId: string) => {
    const updatedLessons = formData.lessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, contents: lesson.contents.filter((c) => c.id !== contentId) } : lesson
    );
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const handleDragStart = (lessonId: string) => setDraggedItem(lessonId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (targetLessonId: string) => {
    if (!draggedItem || draggedItem === targetLessonId) return;
    const draggedIndex = formData.lessons.findIndex((l) => l.id === draggedItem);
    const targetIndex = formData.lessons.findIndex((l) => l.id === targetLessonId);
    const newLessons = [...formData.lessons];
    const [draggedLesson] = newLessons.splice(draggedIndex, 1);
    newLessons.splice(targetIndex, 0, draggedLesson);
    const reorderedLessons = newLessons.map((lesson, index) => ({ ...lesson, order: index + 1 }));
    setFormData({ ...formData, lessons: reorderedLessons });
    setDraggedItem(null);
  };

  const stepLabels = [getText('step1'), getText('step2'), getText('step3'), getText('step4'), getText('step5')];

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
            <Button variant="ghost" onClick={() => alert('템플릿 불러오기 기능은 추후 구현됩니다.')} className="border border-border">
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
            {[1, 2, 3, 4, 5].map((step) => (
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
                {step < 5 && (
                  <div className={cn('flex-1 h-0.5', currentStep > step ? 'bg-btn-neutral' : 'bg-border')} />
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
              <Input
                label={getText('courseName')}
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                placeholder={getText('courseNamePlaceholder')}
              />

              <Textarea
                label={getText('courseDescription')}
                value={formData.courseDescription}
                onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
                placeholder={getText('courseDescriptionPlaceholder')}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label={getText('category')}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={categoryOptions}
                />

                <Select
                  label={getText('difficulty')}
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as CourseDifficulty })}
                  options={difficultyOptions}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={getText('startDate')}
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />

                <Input
                  label={getText('endDate')}
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 2: 회차 구성 */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-text-primary mb-2">{getText('curriculumTitle')}</h2>
                <p className="text-text-secondary m-0">{getText('curriculumDesc')}</p>
              </div>

              <div className="flex flex-col gap-3">
                {formData.lessons.length === 0 ? (
                  <div className="p-12 text-center bg-bg-app border-2 border-dashed border-border rounded-xl">
                    <p className="text-text-secondary mb-4">{getText('noLessons')}</p>
                    <Button onClick={addLesson}>
                      <Plus size={18} />
                      {getText('addFirstLesson')}
                    </Button>
                  </div>
                ) : (
                  <>
                    {formData.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        isExpanded={expandedLessons.has(lesson.id)}
                        isDragged={draggedItem === lesson.id}
                        getText={getText}
                        onToggle={() => toggleLessonExpand(lesson.id)}
                        onUpdate={(updates) => updateLesson(lesson.id, updates)}
                        onDelete={() => deleteLesson(lesson.id)}
                        onAddContent={(type) => addContentToLesson(lesson.id, type)}
                        onDeleteContent={(contentId) => deleteContent(lesson.id, contentId)}
                        onDragStart={() => handleDragStart(lesson.id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(lesson.id)}
                      />
                    ))}

                    <button
                      onClick={addLesson}
                      className="p-3.5 bg-bg-default text-text-primary border-2 border-dashed border-border rounded-lg cursor-pointer flex items-center justify-center gap-2 hover:bg-bg-secondary transition-colors"
                    >
                      <Plus size={18} />
                      {getText('addLesson')}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Steps 3-5: Coming Soon */}
          {currentStep > 2 && (
            <div className="text-center py-16 text-text-secondary">
              <p className="text-lg">{getText('comingSoon')}</p>
              <p className="text-sm mt-2">{stepLabels[currentStep - 1]}</p>
            </div>
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

// 회차 카드 컴포넌트
interface LessonCardProps {
  lesson: LessonData;
  isExpanded: boolean;
  isDragged: boolean;
  getText: (key: keyof typeof t) => string;
  onToggle: () => void;
  onUpdate: (updates: Partial<LessonData>) => void;
  onDelete: () => void;
  onAddContent: (type: 'upload' | 'link') => void;
  onDeleteContent: (contentId: string) => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
}

function LessonCard({
  lesson,
  isExpanded,
  isDragged,
  getText,
  onToggle,
  onUpdate,
  onDelete,
  onAddContent,
  onDeleteContent,
  onDragStart,
  onDragOver,
  onDrop,
}: Readonly<LessonCardProps>) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        'border border-border rounded-lg bg-bg-default overflow-hidden cursor-move transition-opacity',
        isDragged && 'opacity-50'
      )}
    >
      {/* 회차 헤더 */}
      <div
        onClick={onToggle}
        className={cn(
          'p-4 flex items-center gap-3 cursor-pointer',
          isExpanded && 'bg-bg-secondary'
        )}
      >
        <GripVertical size={20} className="text-text-secondary" />
        <div className="w-7 h-7 rounded-md bg-btn-neutral text-white flex items-center justify-center font-medium text-sm">
          {lesson.order}
        </div>
        <div className="flex-1">
          <span className="text-text-primary font-medium">{lesson.title || `회차 ${lesson.order}`}</span>
          {lesson.contents.length > 0 && (
            <span className="text-text-secondary ml-2 text-sm">({lesson.contents.length}개 콘텐츠)</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown size={20} className="text-text-secondary" />
        ) : (
          <ChevronRight size={20} className="text-text-secondary" />
        )}
      </div>

      {/* 회차 내용 */}
      {isExpanded && (
        <div className="p-4 pt-0 flex flex-col gap-4">
          {/* 회차 제목 */}
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-medium">
              {getText('lessonTitle')} <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder={`${lesson.order}${getText('lessonTitlePlaceholder')}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-3 py-2.5 rounded-md border border-border bg-bg-default text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary"
            />
          </div>

          {/* 회차 설명 */}
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-medium">
              {getText('lessonDescription')}
            </label>
            <textarea
              value={lesson.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder={getText('lessonDescriptionPlaceholder')}
              onClick={(e) => e.stopPropagation()}
              rows={3}
              className="w-full px-3 py-2.5 rounded-md border border-border bg-bg-default text-text-primary text-sm outline-none resize-y font-inherit focus:ring-2 focus:ring-action-primary"
            />
          </div>

          {/* 콘텐츠 목록 */}
          <div>
            <label className="block text-text-primary mb-2 text-sm font-medium">{getText('contents')}</label>
            {lesson.contents.length > 0 ? (
              <div className="flex flex-col gap-2 mb-3">
                {lesson.contents.map((content) => (
                  <div key={content.id} className="p-3 bg-bg-secondary rounded-md flex items-center gap-3">
                    {content.type === 'upload' ? (
                      <Upload size={18} className="text-text-secondary" />
                    ) : (
                      <LinkIcon size={18} className="text-text-secondary" />
                    )}
                    <div className="flex-1">
                      <span className="text-text-primary text-sm">{content.name}</span>
                      <span className="text-text-secondary text-xs ml-2">
                        ({content.type === 'upload' ? '파일 업로드' : '외부 링크'})
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteContent(content.id);
                      }}
                      className="p-1.5 bg-transparent border-none cursor-pointer rounded hover:bg-bg-secondary"
                    >
                      <Trash2 size={16} className="text-action-delete" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-sm mb-3">{getText('noContents')}</p>
            )}

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddContent('upload');
                }}
                className="border border-border"
              >
                <Upload size={16} />
                {getText('fileUpload')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddContent('link');
                }}
                className="border border-border"
              >
                <LinkIcon size={16} />
                {getText('externalLink')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('기존 콘텐츠 불러오기 기능은 추후 구현됩니다.');
                }}
                className="border border-border"
              >
                <FileText size={16} />
                {getText('loadExisting')}
              </Button>
            </div>
          </div>

          {/* 회차 삭제 버튼 */}
          <div className="pt-2 border-t border-border">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`${lesson.order}회차를 삭제하시겠습니까?`)) {
                  onDelete();
                }
              }}
              className="py-2 px-3.5 bg-transparent text-action-delete border-none rounded-md cursor-pointer text-sm flex items-center gap-1.5 hover:bg-status-error-bg"
            >
              <Trash2 size={16} />
              {getText('deleteLesson')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
