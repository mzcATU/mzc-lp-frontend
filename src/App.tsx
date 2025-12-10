import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CourseListPage, CourseDetailPage, CourseCreatePage } from '@/pages/courses';
import { ContentPoolPage, ContentUploadPage } from '@/pages/content';
import { LearningObjectsPage } from '@/pages/learning';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 강의 관리 */}
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/courses/create" element={<CourseCreatePage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        {/* 콘텐츠 관리 */}
        <Route path="/content" element={<ContentPoolPage />} />
        <Route path="/content/upload" element={<ContentUploadPage />} />

        {/* 학습객체 관리 */}
        <Route path="/learning-objects" element={<LearningObjectsPage />} />

        {/* 기본 경로 */}
        <Route path="/" element={<CourseListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
