import { FileText, Calendar, Clock, Tag, ImageIcon } from 'lucide-react';
import type { CourseDetailResponse } from '@/types/common/course.types';
import type { CategoryResponse } from '@/types/common';

interface CourseInfoSectionProps {
  course: CourseDetailResponse;
  categories: CategoryResponse[];
}

// 날짜 포맷팅
function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// 난이도 라벨
const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

// 유형 라벨
const TYPE_LABELS: Record<string, string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
  BLENDED: '블렌디드',
};

export function CourseInfoSection({ course, categories }: Readonly<CourseInfoSectionProps>) {
  // categoryId로 카테고리 이름 찾기
  const getCategoryName = (categoryId: number | null): string => {
    if (!categoryId) return '-';
    const category = categories.find((c) => c.id === categoryId);
    return category?.name ?? '-';
  };
  return (
    <div className="bg-bg-default border border-border rounded-lg p-6">
      <h2 className="text-text-primary text-lg font-medium flex items-center gap-2 mb-4">
        <FileText size={20} />
        기본 정보
      </h2>

      <div className="space-y-6">
        {/* 썸네일 */}
        {course.thumbnailUrl && (
          <div>
            <label className="text-sm text-text-secondary mb-2 flex items-center gap-1">
              <ImageIcon size={14} />
              썸네일
            </label>
            <div className="w-64 h-40 rounded-lg overflow-hidden border border-border">
              <img
                src={course.thumbnailUrl}
                alt={`${course.title} 썸네일`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* 설명 */}
        <div>
          <label className="block text-sm text-text-secondary mb-1">설명</label>
          <p className="text-text-primary">
            {course.description || (
              <span className="text-text-placeholder">설명 없음</span>
            )}
          </p>
        </div>

        {/* 그리드 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 난이도 */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">난이도</label>
            <p className="text-text-primary">
              {course.level ? LEVEL_LABELS[course.level] : '-'}
            </p>
          </div>

          {/* 유형 */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">유형</label>
            <p className="text-text-primary">
              {course.type ? TYPE_LABELS[course.type] : '-'}
            </p>
          </div>

          {/* 예상 학습시간 */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">
              예상 학습시간
            </label>
            <p className="text-text-primary flex items-center gap-1">
              <Clock size={16} className="text-text-secondary" />
              {course.estimatedHours ? `${course.estimatedHours}시간` : '-'}
            </p>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm text-text-secondary mb-1">카테고리</label>
            <p className="text-text-primary">
              {getCategoryName(course.categoryId)}
            </p>
          </div>
        </div>

        {/* 기간 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">시작일</label>
            <p className="text-text-primary flex items-center gap-1">
              <Calendar size={16} className="text-text-secondary" />
              {formatDate(course.startDate)}
            </p>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">종료일</label>
            <p className="text-text-primary flex items-center gap-1">
              <Calendar size={16} className="text-text-secondary" />
              {formatDate(course.endDate)}
            </p>
          </div>
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-sm text-text-secondary mb-1 flex items-center gap-1">
            <Tag size={14} />
            태그
          </label>
          {course.tags && course.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-bg-secondary border border-border rounded-full text-sm text-text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-text-placeholder">태그 없음</p>
          )}
        </div>
      </div>
    </div>
  );
}
