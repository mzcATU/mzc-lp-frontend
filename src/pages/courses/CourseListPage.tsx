import { Link } from 'react-router-dom';
import { designTokens } from '@/styles/design-tokens';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';

export const CourseListPage = () => {
  // TODO: useCourses, useDeleteCourse 훅 연동
  const courses: Array<{
    courseId: number;
    courseName: string;
    itemCount: number;
    createdAt: string;
  }> = [];

  const handleDelete = (courseId: number) => {
    if (confirm('강의를 삭제하시겠습니까?')) {
      // TODO: deleteMutation.mutate(courseId);
      console.log('삭제:', courseId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div
      className="p-8 min-h-full"
      style={{ backgroundColor: designTokens.bg.default }}
    >
      <header className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ color: designTokens.text.primary }}
        >
          강의 관리
        </h1>
        <Link to="/courses/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />새 강의
          </Button>
        </Link>
      </header>

      <div
        className="rounded-lg border"
        style={{
          backgroundColor: designTokens.bg.default,
          borderColor: designTokens.bg.border,
        }}
      >
        <table className="w-full">
          <thead>
            <tr
              style={{
                borderBottomWidth: 1,
                borderColor: designTokens.bg.border,
              }}
            >
              <th
                className="text-left p-4 font-medium"
                style={{ color: designTokens.text.secondary }}
              >
                강의명
              </th>
              <th
                className="text-left p-4 font-medium"
                style={{ color: designTokens.text.secondary }}
              >
                차시 수
              </th>
              <th
                className="text-left p-4 font-medium"
                style={{ color: designTokens.text.secondary }}
              >
                생성일
              </th>
              <th
                className="text-left p-4 font-medium"
                style={{ color: designTokens.text.secondary }}
              >
                액션
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-12 text-center"
                  style={{ color: designTokens.text.placeholder }}
                >
                  <p className="text-lg mb-2">🚧 개발 예정</p>
                  <p className="text-sm">강의 관리 기능이 곧 추가될 예정입니다.</p>
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course.courseId}
                  style={{
                    borderBottomWidth: 1,
                    borderColor: designTokens.bg.border,
                  }}
                >
                  <td className="p-4">
                    <Link
                      to={`/courses/${course.courseId}`}
                      className="hover:underline"
                      style={{ color: designTokens.text.primary }}
                    >
                      {course.courseName}
                    </Link>
                  </td>
                  <td
                    className="p-4"
                    style={{ color: designTokens.text.secondary }}
                  >
                    {course.itemCount}개
                  </td>
                  <td
                    className="p-4"
                    style={{ color: designTokens.text.secondary }}
                  >
                    {formatDate(course.createdAt)}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course.courseId)}
                    >
                      삭제
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
