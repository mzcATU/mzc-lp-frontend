import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { designTokens } from '@/styles/design-tokens';
import { Button } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

export const CourseCreatePage = () => {
  const navigate = useNavigate();
  // TODO: useCreateCourse 훅 연동
  const [formData, setFormData] = useState({
    courseName: '',
    instructorId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: createMutation.mutate(formData)
    console.log('강의 생성:', formData);
    // 성공 시 상세 페이지로 이동
    // navigate(`/courses/${response.data.data.courseId}`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      <div
        className="max-w-2xl rounded-lg border p-6"
        style={{
          backgroundColor: designTokens.bg.default,
          borderColor: designTokens.bg.border,
        }}
      >
        <h1
          className="text-2xl font-semibold mb-6"
          style={{ color: designTokens.text.primary }}
        >
          새 강의 만들기
        </h1>

        {/* 개발 예정 안내 */}
        <div
          className="py-12 text-center"
          style={{ color: designTokens.text.placeholder }}
        >
          <p className="text-lg mb-2">🚧 개발 예정</p>
          <p className="text-sm">강의 생성 기능이 곧 추가될 예정입니다.</p>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};
