import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  Send,
} from 'lucide-react';
import { Button, Badge } from '@/components/common';
import type { BadgeColor } from '@/components/common/Badge/Badge.types';
import {
  useCourse,
  useCourseItemsHierarchy,
  useDeleteCourse,
} from '@/hooks/tu';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import { categoryService } from '@/services/common';
import { CourseInfoSection } from './components/CourseInfoSection';
import { CourseCurriculumSection } from './components/CourseCurriculumSection';
import type { CourseLevel, CourseType } from '@/types/common/course.types';
import type { CategoryResponse } from '@/types/common';

// 난이도별 Badge 컬러
const levelBadgeColor: Record<CourseLevel, BadgeColor> = {
  BEGINNER: 'green',
  INTERMEDIATE: 'blue',
  ADVANCED: 'purple',
};

// 유형별 Badge 컬러
const typeBadgeColor: Record<CourseType, BadgeColor> = {
  ONLINE: 'indigo',
  OFFLINE: 'orange',
  BLENDED: 'gray',
};

// 라벨 맵
const LEVEL_LABELS: Record<CourseLevel, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

const TYPE_LABELS: Record<CourseType, string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
  BLENDED: '블렌디드',
};

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const id = courseId ? parseInt(courseId, 10) : 0;

  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  // React Query hooks
  const { data: course, isLoading, error } = useCourse(id);
  const { data: curriculum } = useCourseItemsHierarchy(id);
  const deleteCourseMutation = useDeleteCourse();

  // 카테고리 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('카테고리 목록 조회 실패:', err);
      }
    };
    fetchCategories();
  }, []);

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      await deleteCourseMutation.mutateAsync(id);
      alert('삭제되었습니다.');
      navigate(prefixPath('/tu/teaching/courses'));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <Loader2 size={32} className="animate-spin text-text-secondary" />
        <span className="ml-2 text-text-secondary">로딩 중...</span>
      </div>
    );
  }

  // 에러 상태
  if (error || !course) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-3 text-status-error" />
          <p className="text-text-secondary">
            {error ? '오류가 발생했습니다.' : '강의를 찾을 수 없습니다.'}
          </p>
          <Button
            variant="ghost"
            className="mt-4 border border-border"
            onClick={() => navigate(prefixPath('/tu/teaching/courses'))}
          >
            <ArrowLeft size={16} />
            목록으로
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-bg-app">
      <div className="p-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="border border-border"
            onClick={() => navigate(prefixPath('/tu/teaching/courses'))}
          >
            <ArrowLeft size={16} />
            목록으로
          </Button>
        </div>

        {/* Header Section - 목록 페이지와 동일한 스타일 */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-text-primary mb-2">{course.title}</h1>
            <div className="flex items-center gap-2">
              {course.level && (
                <Badge variant={levelBadgeColor[course.level]}>
                  {LEVEL_LABELS[course.level]}
                </Badge>
              )}
              {course.type && (
                <Badge variant={typeBadgeColor[course.type]}>
                  {TYPE_LABELS[course.type]}
                </Badge>
              )}
              <span className="text-text-secondary text-sm">
                {course.itemCount}차시
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => navigate(prefixPath(`/tu/teaching/courses/${id}/apply`))}
            >
              <Send size={16} />
              과정 신청
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="border border-border"
              onClick={() => navigate(prefixPath(`/tu/teaching/courses/${id}/edit`))}
            >
              <Edit2 size={16} />
              수정
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleteCourseMutation.isPending}
            >
              <Trash2 size={16} />
              삭제
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* 기본 정보 섹션 */}
          <CourseInfoSection course={course} categories={categories} />

          {/* 커리큘럼 섹션 */}
          <CourseCurriculumSection
            itemCount={course.itemCount}
            curriculum={curriculum ?? []}
          />
        </div>
      </div>
    </div>
  );
}
