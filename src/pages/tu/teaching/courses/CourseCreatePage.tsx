import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  FileText,
  Upload,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react';
import { designTokens } from '@/styles/design-tokens';

interface ContentAttachment {
  id: string;
  type: 'upload' | 'link';
  name: string;
  url: string;
}

interface LessonData {
  id: string;
  order: number;
  title: string;
  description: string;
  contents: ContentAttachment[];
}

interface CourseFormData {
  courseName: string;
  courseDescription: string;
  startDate: string;
  endDate: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'elementary' | 'intermediate' | 'advanced' | '';
  lessons: LessonData[];
  isDraft: boolean;
  lastSaved?: string;
}

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
  courseDescriptionPlaceholder: {
    ko: '강의에 대한 설명을 입력하세요',
    en: 'Enter course description',
  },
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
  // Step 2
  curriculumTitle: { ko: '회차 구성', en: 'Curriculum' },
  curriculumDesc: {
    ko: '회차를 추가하고 콘텐츠를 등록하세요. 드래그앤드롭으로 순서를 변경할 수 있습니다.',
    en: 'Add lessons and register content. Drag and drop to reorder.',
  },
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

export function CourseCreatePage({ language = 'ko' }: CourseCreatePageProps) {
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

  // Step 2 state
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const totalSteps = 5;

  const getText = (key: keyof typeof t) => {
    return language === 'ko' ? t[key].ko : t[key].en;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    const now = new Date().toISOString();
    setFormData({ ...formData, isDraft: true, lastSaved: now });
    alert('임시저장되었습니다.');
  };

  const handleClose = () => {
    navigate('/tu/teaching/courses');
  };

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
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const addContentToLesson = (lessonId: string, type: 'upload' | 'link') => {
    const newContent: ContentAttachment = {
      id: Date.now().toString(),
      type,
      name: type === 'upload' ? '업로드할 파일' : '링크 URL',
      url: '',
    };
    const updatedLessons = formData.lessons.map((lesson) => {
      if (lesson.id === lessonId) {
        return { ...lesson, contents: [...lesson.contents, newContent] };
      }
      return lesson;
    });
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const deleteContent = (lessonId: string, contentId: string) => {
    const updatedLessons = formData.lessons.map((lesson) => {
      if (lesson.id === lessonId) {
        return { ...lesson, contents: lesson.contents.filter((c) => c.id !== contentId) };
      }
      return lesson;
    });
    setFormData({ ...formData, lessons: updatedLessons });
  };

  const handleDragStart = (lessonId: string) => {
    setDraggedItem(lessonId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetLessonId: string) => {
    if (!draggedItem || draggedItem === targetLessonId) return;

    const draggedIndex = formData.lessons.findIndex((l) => l.id === draggedItem);
    const targetIndex = formData.lessons.findIndex((l) => l.id === targetLessonId);

    const newLessons = [...formData.lessons];
    const [draggedLesson] = newLessons.splice(draggedIndex, 1);
    newLessons.splice(targetIndex, 0, draggedLesson);

    const reorderedLessons = newLessons.map((lesson, index) => ({
      ...lesson,
      order: index + 1,
    }));
    setFormData({ ...formData, lessons: reorderedLessons });
    setDraggedItem(null);
  };

  const stepLabels = [
    getText('step1'),
    getText('step2'),
    getText('step3'),
    getText('step4'),
    getText('step5'),
  ];

  return (
    <div style={{ backgroundColor: designTokens.bg.app_default, minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: designTokens.bg.default,
          borderBottom: `1px solid ${designTokens.bg.border}`,
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <h1 style={{ color: designTokens.text.primary, margin: 0 }}>{getText('title')}</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {formData.lastSaved && (
              <span style={{ color: designTokens.text.secondary, fontSize: '14px' }}>
                {getText('lastSaved')}: {new Date(formData.lastSaved).toLocaleString('ko-KR')}
              </span>
            )}
            <button
              onClick={() => alert('템플릿 불러오기 기능은 추후 구현됩니다.')}
              style={{
                padding: '8px 16px',
                backgroundColor: designTokens.bg.default,
                color: designTokens.text.primary,
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FileText size={16} />
              {getText('loadTemplate')}
            </button>
            <button
              onClick={handleClose}
              style={{
                padding: '8px 16px',
                backgroundColor: designTokens.bg.default,
                color: designTokens.text.secondary,
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              {getText('close')}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div
        style={{
          backgroundColor: designTokens.bg.default,
          borderBottom: `1px solid ${designTokens.bg.border}`,
          padding: '24px 24px 0',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor:
                      currentStep >= step ? designTokens.button.neutral_default : designTokens.bg.border,
                    color:
                      currentStep >= step ? designTokens.button.neutral_text : designTokens.text.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 500,
                  }}
                >
                  {step}
                </div>
                <span
                  style={{
                    color: currentStep >= step ? designTokens.text.primary : designTokens.text.secondary,
                    fontWeight: currentStep === step ? 500 : 400,
                    fontSize: '14px',
                  }}
                >
                  {stepLabels[step - 1]}
                </span>
                {step < 5 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      backgroundColor:
                        currentStep > step ? designTokens.button.neutral_default : designTokens.bg.border,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div
          style={{
            backgroundColor: designTokens.bg.default,
            borderRadius: '12px',
            padding: '32px',
            border: `1px solid ${designTokens.bg.border}`,
          }}
        >
          {/* Step 1: 기본 정보 */}
          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: designTokens.text.primary, fontWeight: 500 }}>
                  {getText('courseName')}
                </label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  placeholder={getText('courseNamePlaceholder')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${designTokens.bg.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: designTokens.text.primary,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: designTokens.text.primary, fontWeight: 500 }}>
                  {getText('courseDescription')}
                </label>
                <textarea
                  value={formData.courseDescription}
                  onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
                  placeholder={getText('courseDescriptionPlaceholder')}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: `1px solid ${designTokens.bg.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: designTokens.text.primary,
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: designTokens.text.primary, fontWeight: 500 }}>
                    {getText('category')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${designTokens.bg.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: designTokens.text.primary,
                      outline: 'none',
                      backgroundColor: designTokens.bg.default,
                    }}
                  >
                    <option value="">{getText('selectCategory')}</option>
                    <option value="프로그래밍">프로그래밍</option>
                    <option value="백엔드">백엔드</option>
                    <option value="프론트엔드">프론트엔드</option>
                    <option value="개발 도구">개발 도구</option>
                    <option value="데이터베이스">데이터베이스</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: designTokens.text.primary, fontWeight: 500 }}>
                    {getText('difficulty')}
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value as CourseFormData['difficulty'] })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${designTokens.bg.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: designTokens.text.primary,
                      outline: 'none',
                      backgroundColor: designTokens.bg.default,
                    }}
                  >
                    <option value="">{getText('selectDifficulty')}</option>
                    <option value="beginner">{getText('beginner')}</option>
                    <option value="elementary">{getText('elementary')}</option>
                    <option value="intermediate">{getText('intermediate')}</option>
                    <option value="advanced">{getText('advanced')}</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: designTokens.text.primary, fontWeight: 500 }}>
                    {getText('startDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${designTokens.bg.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: designTokens.text.primary,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: designTokens.text.primary, fontWeight: 500 }}>
                    {getText('endDate')}
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: `1px solid ${designTokens.bg.border}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      color: designTokens.text.primary,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 회차 구성 */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ color: designTokens.text.primary, marginBottom: '8px' }}>
                  {getText('curriculumTitle')}
                </h2>
                <p style={{ color: designTokens.text.secondary, margin: 0 }}>{getText('curriculumDesc')}</p>
              </div>

              {/* 회차 목록 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {formData.lessons.length === 0 ? (
                  <div
                    style={{
                      padding: '48px',
                      textAlign: 'center',
                      backgroundColor: designTokens.bg.app_default,
                      border: `2px dashed ${designTokens.bg.border}`,
                      borderRadius: '12px',
                    }}
                  >
                    <p style={{ color: designTokens.text.secondary, margin: 0, marginBottom: '16px' }}>
                      {getText('noLessons')}
                    </p>
                    <button
                      onClick={addLesson}
                      style={{
                        padding: '12px 24px',
                        backgroundColor: designTokens.button.neutral_default,
                        color: designTokens.button.neutral_text,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Plus size={18} />
                      {getText('addFirstLesson')}
                    </button>
                  </div>
                ) : (
                  <>
                    {formData.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        draggable
                        onDragStart={() => handleDragStart(lesson.id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(lesson.id)}
                        style={{
                          border: `1px solid ${designTokens.bg.border}`,
                          borderRadius: '8px',
                          backgroundColor: designTokens.bg.default,
                          overflow: 'hidden',
                          cursor: 'move',
                          opacity: draggedItem === lesson.id ? 0.5 : 1,
                        }}
                      >
                        {/* 회차 헤더 */}
                        <div
                          onClick={() => toggleLessonExpand(lesson.id)}
                          style={{
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            backgroundColor: expandedLessons.has(lesson.id)
                              ? designTokens.bg.secondary
                              : 'transparent',
                            cursor: 'pointer',
                          }}
                        >
                          <GripVertical size={20} color={designTokens.text.secondary} />
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              backgroundColor: designTokens.button.neutral_default,
                              color: designTokens.button.neutral_text,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 500,
                              fontSize: '14px',
                            }}
                          >
                            {lesson.order}
                          </div>
                          <div style={{ flex: 1 }}>
                            <span style={{ color: designTokens.text.primary, fontWeight: 500 }}>
                              {lesson.title || `회차 ${lesson.order}`}
                            </span>
                            {lesson.contents.length > 0 && (
                              <span
                                style={{ color: designTokens.text.secondary, marginLeft: '8px', fontSize: '14px' }}
                              >
                                ({lesson.contents.length}개 콘텐츠)
                              </span>
                            )}
                          </div>
                          {expandedLessons.has(lesson.id) ? (
                            <ChevronDown size={20} color={designTokens.text.secondary} />
                          ) : (
                            <ChevronRight size={20} color={designTokens.text.secondary} />
                          )}
                        </div>

                        {/* 회차 내용 (펼쳐진 경우) */}
                        {expandedLessons.has(lesson.id) && (
                          <div
                            style={{ padding: '16px', paddingTop: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}
                          >
                            {/* 회차 제목 */}
                            <div>
                              <label
                                style={{
                                  display: 'block',
                                  color: designTokens.text.primary,
                                  marginBottom: '6px',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                }}
                              >
                                {getText('lessonTitle')} <span style={{ color: '#FF7043' }}>*</span>
                              </label>
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => updateLesson(lesson.id, { title: e.target.value })}
                                placeholder={`${lesson.order}${getText('lessonTitlePlaceholder')}`}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  borderRadius: '6px',
                                  border: `1px solid ${designTokens.bg.border}`,
                                  backgroundColor: designTokens.bg.default,
                                  color: designTokens.text.primary,
                                  fontSize: '14px',
                                  outline: 'none',
                                }}
                              />
                            </div>

                            {/* 회차 설명 */}
                            <div>
                              <label
                                style={{
                                  display: 'block',
                                  color: designTokens.text.primary,
                                  marginBottom: '6px',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                }}
                              >
                                {getText('lessonDescription')}
                              </label>
                              <textarea
                                value={lesson.description}
                                onChange={(e) => updateLesson(lesson.id, { description: e.target.value })}
                                placeholder={getText('lessonDescriptionPlaceholder')}
                                onClick={(e) => e.stopPropagation()}
                                rows={3}
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  borderRadius: '6px',
                                  border: `1px solid ${designTokens.bg.border}`,
                                  backgroundColor: designTokens.bg.default,
                                  color: designTokens.text.primary,
                                  fontSize: '14px',
                                  outline: 'none',
                                  resize: 'vertical',
                                  fontFamily: 'inherit',
                                }}
                              />
                            </div>

                            {/* 콘텐츠 목록 */}
                            <div>
                              <label
                                style={{
                                  display: 'block',
                                  color: designTokens.text.primary,
                                  marginBottom: '8px',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                }}
                              >
                                {getText('contents')}
                              </label>
                              {lesson.contents.length > 0 ? (
                                <div
                                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}
                                >
                                  {lesson.contents.map((content) => (
                                    <div
                                      key={content.id}
                                      style={{
                                        padding: '12px',
                                        backgroundColor: designTokens.bg.secondary,
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                      }}
                                    >
                                      {content.type === 'upload' ? (
                                        <Upload size={18} color={designTokens.text.secondary} />
                                      ) : (
                                        <LinkIcon size={18} color={designTokens.text.secondary} />
                                      )}
                                      <div style={{ flex: 1 }}>
                                        <span style={{ color: designTokens.text.primary, fontSize: '14px' }}>
                                          {content.name}
                                        </span>
                                        <span
                                          style={{
                                            color: designTokens.text.secondary,
                                            fontSize: '12px',
                                            marginLeft: '8px',
                                          }}
                                        >
                                          ({content.type === 'upload' ? '파일 업로드' : '외부 링크'})
                                        </span>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteContent(lesson.id, content.id);
                                        }}
                                        style={{
                                          padding: '6px',
                                          backgroundColor: 'transparent',
                                          border: 'none',
                                          cursor: 'pointer',
                                          borderRadius: '4px',
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Trash2 size={16} color={designTokens.action.delete_text} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p style={{ color: designTokens.text.secondary, fontSize: '14px', margin: '0 0 12px 0' }}>
                                  {getText('noContents')}
                                </p>
                              )}

                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addContentToLesson(lesson.id, 'upload');
                                  }}
                                  style={{
                                    padding: '8px 14px',
                                    backgroundColor: designTokens.bg.default,
                                    color: designTokens.text.primary,
                                    border: `1px solid ${designTokens.bg.border}`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <Upload size={16} />
                                  {getText('fileUpload')}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addContentToLesson(lesson.id, 'link');
                                  }}
                                  style={{
                                    padding: '8px 14px',
                                    backgroundColor: designTokens.bg.default,
                                    color: designTokens.text.primary,
                                    border: `1px solid ${designTokens.bg.border}`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <LinkIcon size={16} />
                                  {getText('externalLink')}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert('기존 콘텐츠 불러오기 기능은 추후 구현됩니다.');
                                  }}
                                  style={{
                                    padding: '8px 14px',
                                    backgroundColor: designTokens.bg.default,
                                    color: designTokens.text.primary,
                                    border: `1px solid ${designTokens.bg.border}`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <FileText size={16} />
                                  {getText('loadExisting')}
                                </button>
                              </div>
                            </div>

                            {/* 회차 삭제 버튼 */}
                            <div style={{ paddingTop: '8px', borderTop: `1px solid ${designTokens.bg.border}` }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`${lesson.order}회차를 삭제하시겠습니까?`)) {
                                    deleteLesson(lesson.id);
                                  }
                                }}
                                style={{
                                  padding: '8px 14px',
                                  backgroundColor: 'transparent',
                                  color: designTokens.action.delete_text,
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <Trash2 size={16} />
                                {getText('deleteLesson')}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* 회차 추가 버튼 */}
                    <button
                      onClick={addLesson}
                      style={{
                        padding: '14px',
                        backgroundColor: designTokens.bg.default,
                        color: designTokens.text.primary,
                        border: `2px dashed ${designTokens.bg.border}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                      }}
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
            <div style={{ textAlign: 'center', padding: '60px 20px', color: designTokens.text.secondary }}>
              <p style={{ fontSize: '18px' }}>{getText('comingSoon')}</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>{stepLabels[currentStep - 1]}</p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                style={{
                  padding: '12px 24px',
                  backgroundColor: designTokens.button.neutral_default,
                  color: designTokens.button.neutral_text,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ArrowLeft size={18} />
                {getText('previous')}
              </button>
            )}
            <button
              onClick={handleSaveDraft}
              style={{
                padding: '12px 24px',
                backgroundColor: designTokens.bg.default,
                color: designTokens.text.primary,
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Save size={18} />
              {getText('saveDraft')}
            </button>
          </div>

          <div>
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                style={{
                  padding: '12px 24px',
                  backgroundColor: designTokens.button.neutral_default,
                  color: designTokens.button.neutral_text,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {getText('next')}
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  padding: '12px 24px',
                  backgroundColor: designTokens.button.neutral_default,
                  color: designTokens.button.neutral_text,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Upload size={18} />
                {getText('submit')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
