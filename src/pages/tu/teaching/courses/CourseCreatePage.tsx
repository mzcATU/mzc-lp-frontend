import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, FileText, Upload, Plus, GripVertical, ChevronDown, ChevronRight, Trash2, Link as LinkIcon, Globe, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Input, Textarea, NativeSelect, TagInput, Label, Checkbox, Card, CardHeader, CardContent, Alert, AlertDescription } from '@/components/common';
import type { CourseFormData, LessonData, ContentAttachment, CourseDifficulty, LanguageVersion } from '@/types';

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
  step3: { ko: '검토 및 저장', en: 'Review' },
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
    multiLanguage: {
      enabled: false,
      languages: [],
    },
  });

  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const totalSteps = 3;

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
              <div className="space-y-2">
                <Label htmlFor="courseName">{getText('courseName')}</Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  placeholder={getText('courseNamePlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseDescription">{getText('courseDescription')}</Label>
                <Textarea
                  id="courseDescription"
                  value={formData.courseDescription}
                  onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
                  placeholder={getText('courseDescriptionPlaceholder')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NativeSelect
                  id="category"
                  label={getText('category')}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={categoryOptions}
                />

                <NativeSelect
                  id="difficulty"
                  label={getText('difficulty')}
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as CourseDifficulty })}
                  options={difficultyOptions}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">{getText('startDate')}</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">{getText('endDate')}</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* 태그 */}
              <TagInput
                label="태그"
                hint="강의와 관련된 키워드를 쉼표(,)로 구분하여 입력하세요. 예: React, TypeScript, 프론트엔드"
                value={formData.tags}
                onChange={(tags) => setFormData({ ...formData, tags })}
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
                        setFormData({
                          ...formData,
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
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          const newLang: LanguageVersion = {
                            code: 'en',
                            name: 'English',
                            courseName: '',
                            courseDescription: '',
                          };
                          setFormData({
                            ...formData,
                            multiLanguage: {
                              ...formData.multiLanguage,
                              languages: [...formData.multiLanguage.languages, newLang],
                            },
                          });
                        }}
                      >
                        <Plus size={16} />
                        언어 추가
                      </Button>

                      {formData.multiLanguage.languages.map((lang, index) => (
                        <div key={index} className="mt-4 p-4 bg-bg-secondary rounded-lg relative">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.multiLanguage.languages.filter((_, i) => i !== index);
                              setFormData({
                                ...formData,
                                multiLanguage: { ...formData.multiLanguage, languages: updated },
                              });
                            }}
                            className="absolute top-3 right-3 p-1 bg-transparent border-none cursor-pointer text-text-secondary hover:text-text-primary"
                          >
                            <X size={18} />
                          </button>

                          <div className="mb-3">
                            <Label className="mb-1.5">언어 코드</Label>
                            <NativeSelect
                              value={lang.code}
                              onChange={(e) => {
                                const updated = [...formData.multiLanguage.languages];
                                updated[index] = {
                                  ...lang,
                                  code: e.target.value,
                                  name: e.target.selectedOptions[0].text,
                                };
                                setFormData({
                                  ...formData,
                                  multiLanguage: { ...formData.multiLanguage, languages: updated },
                                });
                              }}
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
                              onChange={(e) => {
                                const updated = [...formData.multiLanguage.languages];
                                updated[index] = { ...lang, courseName: e.target.value };
                                setFormData({
                                  ...formData,
                                  multiLanguage: { ...formData.multiLanguage, languages: updated },
                                });
                              }}
                              placeholder={`Enter course name in ${lang.name}`}
                            />
                          </div>

                          <Textarea
                            label={`강의 소개 (${lang.name})`}
                            value={lang.courseDescription}
                            onChange={(e) => {
                              const updated = [...formData.multiLanguage.languages];
                              updated[index] = { ...lang, courseDescription: e.target.value };
                              setFormData({
                                ...formData,
                                multiLanguage: { ...formData.multiLanguage, languages: updated },
                              });
                            }}
                            placeholder={`Enter course description in ${lang.name}`}
                            rows={3}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 안내 메시지 */}
              <Alert variant="info">
                <AlertDescription>
                  💡 <strong>Tip:</strong> 기본 정보는 나중에 수정할 수 있습니다. 다음 단계에서 차시를 구성하고 콘텐츠를 추가할 수 있습니다.
                </AlertDescription>
              </Alert>
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

          {/* Step 3: 검토 및 저장 */}
          {currentStep === 3 && (
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
          <Input
            label={<>{getText('lessonTitle')} <span className="text-status-error">*</span></>}
            value={lesson.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder={`${lesson.order}${getText('lessonTitlePlaceholder')}`}
            onClick={(e) => e.stopPropagation()}
          />

          {/* 회차 설명 */}
          <Textarea
            label={getText('lessonDescription')}
            value={lesson.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder={getText('lessonDescriptionPlaceholder')}
            onClick={(e) => e.stopPropagation()}
            rows={3}
          />

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
