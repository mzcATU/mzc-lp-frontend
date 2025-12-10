import { useParams, Link } from 'react-router-dom';
import { designTokens } from '@/styles/design-tokens';
import { Button } from '@/components/ui';
import { ArrowLeft, Plus, FolderPlus } from 'lucide-react';

export const CourseDetailPage = () => {
  const { id } = useParams();
  // TODO: useCourse, useCourseHierarchy 훅 연동
  const course = {
    courseId: Number(id),
    courseName: '샘플 강의',
    instructorName: '홍길동',
  };

  const hierarchy: Array<{
    id: number;
    type: 'folder' | 'item';
    name: string;
    children?: Array<{ id: number; type: 'item'; name: string }>;
  }> = [];

  const handleEditCourse = () => {
    console.log('강의 수정');
  };

  const handleAddFolder = () => {
    console.log('폴더 추가');
  };

  const handleAddItem = () => {
    console.log('차시 추가');
  };

  return (
    <div
      className="p-8 min-h-full"
      style={{ backgroundColor: designTokens.bg.default }}
    >
      {/* 뒤로가기 */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 mb-6 hover:underline"
        style={{ color: designTokens.text.secondary }}
      >
        <ArrowLeft className="w-4 h-4" />
        강의 목록으로
      </Link>

      {/* 강의 정보 */}
      <section
        className="rounded-lg border p-6 mb-6"
        style={{
          backgroundColor: designTokens.bg.default,
          borderColor: designTokens.bg.border,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-semibold mb-2"
              style={{ color: designTokens.text.primary }}
            >
              {course.courseName}
            </h1>
            <p style={{ color: designTokens.text.secondary }}>
              강사: {course.instructorName}
            </p>
          </div>
          <Button onClick={handleEditCourse}>수정</Button>
        </div>
      </section>

      {/* 차시/폴더 계층 구조 */}
      <section
        className="rounded-lg border p-6 mb-6"
        style={{
          backgroundColor: designTokens.bg.default,
          borderColor: designTokens.bg.border,
        }}
      >
        <header className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-semibold"
            style={{ color: designTokens.text.primary }}
          >
            커리큘럼 구성
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddFolder}>
              <FolderPlus className="w-4 h-4 mr-2" />
              폴더
            </Button>
            <Button size="sm" onClick={handleAddItem}>
              <Plus className="w-4 h-4 mr-2" />
              차시
            </Button>
          </div>
        </header>

        {/* TreeView 컴포넌트 연동 예정 */}
        {hierarchy.length === 0 ? (
          <div
            className="py-12 text-center"
            style={{ color: designTokens.text.placeholder }}
          >
            <p>커리큘럼이 비어있습니다.</p>
            <p className="text-sm mt-1">
              폴더나 차시를 추가하여 강의를 구성하세요.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* TODO: TreeView 컴포넌트 */}
            {hierarchy.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded border"
                style={{ borderColor: designTokens.bg.border }}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 학습 순서 설정 */}
      <section
        className="rounded-lg border p-6"
        style={{
          backgroundColor: designTokens.bg.default,
          borderColor: designTokens.bg.border,
        }}
      >
        <h2
          className="text-lg font-semibold mb-4"
          style={{ color: designTokens.text.primary }}
        >
          학습 순서
        </h2>
        <p style={{ color: designTokens.text.placeholder }}>
          학습 순서 설정 기능 개발 예정
        </p>
      </section>
    </div>
  );
};
