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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 강의명 */}
          <div>
            <label
              htmlFor="courseName"
              className="block text-sm font-medium mb-2"
              style={{ color: designTokens.text.primary }}
            >
              강의명 <span style={{ color: designTokens.status.error_text }}>*</span>
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="강의 이름을 입력하세요"
              required
              className="w-full px-4 py-2 rounded-lg border outline-none transition-colors"
              style={{
                backgroundColor: designTokens.bg.default,
                borderColor: designTokens.bg.border,
                color: designTokens.text.primary,
              }}
            />
          </div>

          {/* 강사 선택 */}
          <div>
            <label
              htmlFor="instructorId"
              className="block text-sm font-medium mb-2"
              style={{ color: designTokens.text.primary }}
            >
              강사
            </label>
            <select
              id="instructorId"
              name="instructorId"
              value={formData.instructorId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border outline-none transition-colors"
              style={{
                backgroundColor: designTokens.bg.default,
                borderColor: designTokens.bg.border,
                color: designTokens.text.primary,
              }}
            >
              <option value="">강사를 선택하세요</option>
              {/* TODO: 강사 목록 API 연동 */}
            </select>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button type="submit">생성</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
