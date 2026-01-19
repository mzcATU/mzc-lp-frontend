import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Pencil } from 'lucide-react';
import { Button } from '@/components/common';
import { useSubdomainPath } from '@/hooks/common';
import type { Course } from '@/types';
import type { CourseStatus } from '@/types/common/course.types';
import { designTokens } from '@/styles/admin-design-tokens';

export interface CourseCardLabels {
  students: string;
  courseCompletion: string;
  lessons: string;
  manageCourse: string;
  editCourse?: string;
}

interface CourseCardProps {
  course: Course;
  labels: CourseCardLabels;
  onManage?: () => void;
  onEdit?: () => void;
  hideActions?: boolean;
  /** 커스텀 액션 버튼 영역 (hideActions와 함께 사용) */
  renderActions?: ReactNode;
  /** 강의 상태 (DRAFT, READY, REGISTERED) */
  courseStatus?: CourseStatus;
}

/**
 * 강의 카드 컴포넌트
 * - 썸네일, 카테고리 배지, 제목, 수강생 수
 * - 콘텐츠 완성도 진행 바
 * - 마지막 접근 시간, 관리/수정 버튼
 */
export const CourseCard = ({ course, labels, onManage, onEdit, hideActions = false, renderActions, courseStatus }: Readonly<CourseCardProps>) => {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();

  // 상태별 배지 설정
  const getStatusBadge = () => {
    if (!courseStatus) return null;

    const statusConfig = {
      DRAFT: {
        label: '작성중',
        style: {
          color: designTokens.badge.orange.text,
          backgroundColor: designTokens.badge.orange.bg
        }
      },
      READY: {
        label: '작성완료',
        style: {
          color: designTokens.badge.blue.text,
          backgroundColor: designTokens.badge.blue.bg
        }
      },
      REGISTERED: {
        label: '등록됨',
        style: {
          color: designTokens.badge.green.text,
          backgroundColor: designTokens.badge.green.bg
        }
      },
    };

    const config = statusConfig[courseStatus];
    return (
      <span
        className="px-2 py-1 text-xs rounded-md font-medium"
        style={config.style}
      >
        {config.label}
      </span>
    );
  };

  const handleManage = () => {
    if (onManage) {
      onManage();
    } else {
      navigate(prefixPath(`/tu/teaching/courses/${course.id}`));
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(prefixPath(`/tu/teaching/courses/${course.id}/edit`));
    }
  };

  return (
    <div className="bg-bg-secondary rounded-xl overflow-hidden border border-border">
      {/* Thumbnail */}
      <div className="relative w-full h-44 overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-text-primary mb-4 text-base">{course.title}</h3>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-text-secondary">{labels.courseCompletion}</span>
            <span className="text-sm text-text-primary font-medium">
              {course.completedLessons}/{course.totalLessons} {labels.lessons}
            </span>
          </div>
          <div className="w-full h-2 bg-bg-default rounded overflow-hidden">
            <div
              className="h-full bg-text-secondary transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-text-secondary text-sm">
            <Clock size={16} />
            {course.lastAccessed}
          </div>
        </div>

        {/* Action Buttons */}
        {renderActions ? (
          <div className="flex gap-2 mt-4">{renderActions}</div>
        ) : (
          !hideActions && (
            <div className="flex gap-2 mt-4">
              <Button className="flex-1" onClick={handleManage}>
                {labels.manageCourse}
              </Button>
              {labels.editCourse && (
                <Button variant="ghost" className="border border-border" onClick={handleEdit}>
                  <Pencil size={16} />
                </Button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
