import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/common';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/common/Dialog/Dialog';
import { useUpdateCourse } from '@/hooks/tu';
import type {
  CourseDetailResponse,
  CourseLevel,
  CourseType,
  UpdateCourseRequest,
} from '@/types/common/course.types';

interface CourseEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseDetailResponse;
}

// 난이도 옵션
const levelOptions: { value: CourseLevel | ''; label: string }[] = [
  { value: '', label: '선택 안 함' },
  { value: 'BEGINNER', label: '초급' },
  { value: 'INTERMEDIATE', label: '중급' },
  { value: 'ADVANCED', label: '고급' },
];

// 유형 옵션
const typeOptions: { value: CourseType | ''; label: string }[] = [
  { value: '', label: '선택 안 함' },
  { value: 'ONLINE', label: '온라인' },
  { value: 'OFFLINE', label: '오프라인' },
  { value: 'BLENDED', label: '블렌디드' },
];

export function CourseEditModal({
  isOpen,
  onClose,
  course,
}: Readonly<CourseEditModalProps>) {
  const updateCourseMutation = useUpdateCourse();

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: '' as CourseLevel | '',
    type: '' as CourseType | '',
    estimatedHours: '',
    startDate: '',
    endDate: '',
    tags: '',
  });

  // 모달이 열릴 때 course 데이터로 폼 초기화
  useEffect(() => {
    if (isOpen && course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        level: course.level || '',
        type: course.type || '',
        estimatedHours: course.estimatedHours?.toString() || '',
        startDate: course.startDate || '',
        endDate: course.endDate || '',
        tags: course.tags?.join(', ') || '',
      });
    }
  }, [isOpen, course]);

  // 입력 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('강의명을 입력해주세요.');
      return;
    }

    const request: UpdateCourseRequest = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      level: formData.level || undefined,
      type: formData.type || undefined,
      estimatedHours: formData.estimatedHours
        ? parseInt(formData.estimatedHours, 10)
        : undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      tags: formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : undefined,
    };

    try {
      await updateCourseMutation.mutateAsync({ id: course.courseId, request });
      alert('수정되었습니다.');
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-bg-default">
        <DialogHeader>
          <DialogTitle>강의 정보 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-auto">
          {/* 강의명 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              강의명 <span className="text-status-error">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="강의명을 입력하세요"
              className="w-full px-3 py-2 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary bg-bg-default"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              설명
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="강의에 대한 설명을 입력하세요"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary bg-bg-default resize-none"
            />
          </div>

          {/* 난이도 & 유형 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                난이도
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary bg-bg-default"
              >
                {levelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                유형
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary bg-bg-default"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 예상 학습시간 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              예상 학습시간 (시간)
            </label>
            <input
              type="number"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              placeholder="예: 10"
              min="1"
              className="w-full px-3 py-2 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary bg-bg-default"
            />
          </div>

          {/* 기간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                시작일
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary bg-bg-default"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                종료일
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary bg-bg-default"
              />
            </div>
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              태그
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="쉼표로 구분하여 입력 (예: React, JavaScript, 웹개발)"
              className="w-full px-3 py-2 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary bg-bg-default"
            />
            <p className="mt-1 text-xs text-text-secondary">
              쉼표(,)로 구분하여 여러 개의 태그를 입력할 수 있습니다.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            className="border border-border"
            onClick={onClose}
            disabled={updateCourseMutation.isPending}
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateCourseMutation.isPending}
          >
            {updateCourseMutation.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                저장 중...
              </>
            ) : (
              '저장'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
