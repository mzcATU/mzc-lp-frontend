/**
 * Step 2: 회차 구성
 * 담당: 콘텐츠 테이블 관련
 */
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/common';
import type { CourseFormData, LessonData, ContentAttachment } from '@/types';
import { translations, type TranslationKey } from './courseCreate.constants';
import { LessonCard } from './LessonCard';

interface Step2CurriculumProps {
  language: 'ko' | 'en';
  formData: CourseFormData;
  onFormDataChange: (data: Partial<CourseFormData>) => void;
}

export function Step2Curriculum({
  language,
  formData,
  onFormDataChange,
}: Readonly<Step2CurriculumProps>) {
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const getText = (key: TranslationKey) =>
    language === 'ko' ? translations[key].ko : translations[key].en;

  const addLesson = () => {
    const newLesson: LessonData = {
      id: Date.now().toString(),
      title: '',
      description: '',
      order: formData.lessons.length + 1,
      contents: [],
    };
    onFormDataChange({ lessons: [...formData.lessons, newLesson] });
    setExpandedLessons(new Set([...expandedLessons, newLesson.id]));
  };

  const updateLesson = (lessonId: string, updates: Partial<LessonData>) => {
    const updatedLessons = formData.lessons.map((lesson) =>
      lesson.id === lessonId ? { ...lesson, ...updates } : lesson
    );
    onFormDataChange({ lessons: updatedLessons });
  };

  const deleteLesson = (lessonId: string) => {
    const updatedLessons = formData.lessons
      .filter((lesson) => lesson.id !== lessonId)
      .map((lesson, index) => ({ ...lesson, order: index + 1 }));
    onFormDataChange({ lessons: updatedLessons });
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
    onFormDataChange({ lessons: updatedLessons });
  };

  const deleteContent = (lessonId: string, contentId: string) => {
    const updatedLessons = formData.lessons.map((lesson) =>
      lesson.id === lessonId
        ? { ...lesson, contents: lesson.contents.filter((c) => c.id !== contentId) }
        : lesson
    );
    onFormDataChange({ lessons: updatedLessons });
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
    onFormDataChange({ lessons: reorderedLessons });
    setDraggedItem(null);
  };

  return (
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
                language={language}
                lesson={lesson}
                isExpanded={expandedLessons.has(lesson.id)}
                isDragged={draggedItem === lesson.id}
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
  );
}
