import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, GripVertical, X, Search } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Badge } from '@/components/common';

interface CourseItem {
  id: string;
  title: string;
  category: string;
  duration: string;
}

const AVAILABLE_COURSES: CourseItem[] = [
  { id: '1', title: 'HTML/CSS 기초', category: '프론트엔드', duration: '4시간' },
  { id: '2', title: 'JavaScript 기초', category: '프론트엔드', duration: '8시간' },
  { id: '3', title: 'React 입문', category: '프론트엔드', duration: '10시간' },
  { id: '4', title: 'React 심화', category: '프론트엔드', duration: '12시간' },
  { id: '5', title: 'TypeScript 기초', category: '프론트엔드', duration: '6시간' },
  { id: '6', title: 'Node.js 기초', category: '백엔드', duration: '8시간' },
  { id: '7', title: 'Express.js 실전', category: '백엔드', duration: '10시간' },
  { id: '8', title: 'MongoDB 기초', category: '데이터베이스', duration: '6시간' },
];

const t = {
  createRoadmap: { ko: '로드맵 생성', en: 'Create Roadmap' },
  editRoadmap: { ko: '로드맵 수정', en: 'Edit Roadmap' },
  back: { ko: '뒤로', en: 'Back' },
  basicInfo: { ko: '기본 정보', en: 'Basic Information' },
  title: { ko: '로드맵 제목', en: 'Roadmap Title' },
  titlePlaceholder: { ko: '예: 프론트엔드 개발자 로드맵', en: 'e.g., Frontend Developer Roadmap' },
  description: { ko: '설명', en: 'Description' },
  descriptionPlaceholder: { ko: '로드맵에 대한 설명을 입력하세요', en: 'Enter a description for this roadmap' },
  courseList: { ko: '강의 구성', en: 'Course List' },
  courseListDesc: { ko: '학습 순서대로 강의를 추가하세요. 드래그하여 순서를 변경할 수 있습니다.', en: 'Add courses in learning order. Drag to reorder.' },
  addCourse: { ko: '강의 추가', en: 'Add Course' },
  searchCourse: { ko: '강의 검색', en: 'Search courses' },
  noCourses: { ko: '추가된 강의가 없습니다', en: 'No courses added' },
  noCoursesDesc: { ko: '아래에서 강의를 검색하여 추가하세요', en: 'Search and add courses below' },
  availableCourses: { ko: '추가 가능한 강의', en: 'Available Courses' },
  save: { ko: '저장', en: 'Save' },
  saveDraft: { ko: '임시 저장', en: 'Save as Draft' },
  publish: { ko: '공개', en: 'Publish' },
  cancel: { ko: '취소', en: 'Cancel' },
  step: { ko: '단계', en: 'Step' },
};

export function RoadmapCreatePage({ language = 'ko' }: Readonly<{ language?: 'ko' | 'en' }>) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<CourseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const filteredCourses = AVAILABLE_COURSES.filter(
    (course) =>
      !selectedCourses.find((c) => c.id === course.id) &&
      (course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addCourse = (course: CourseItem) => {
    setSelectedCourses([...selectedCourses, course]);
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId));
  };

  const handleSave = (isDraft: boolean) => {
    // TODO: API 호출
    console.log({ title, description, courses: selectedCourses, isDraft });
    navigate('/tu/teaching/roadmaps');
  };

  return (
    <div className="p-8 bg-bg-app min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/tu/teaching/roadmaps')} className="mb-4">
          <ArrowLeft size={20} />
          <span>{getText('back')}</span>
        </Button>
        <h1 className="text-text-primary mb-2">{getText('createRoadmap')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Info & Course List */}
        <div className="flex flex-col gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>{getText('basicInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {getText('title')} <span className="text-status-error">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={getText('titlePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {getText('description')}
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={getText('descriptionPlaceholder')}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Selected Courses */}
          <Card>
            <CardHeader>
              <CardTitle>{getText('courseList')}</CardTitle>
              <p className="text-sm text-text-secondary m-0">{getText('courseListDesc')}</p>
            </CardHeader>
            <CardContent>
              {selectedCourses.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  <p className="mb-1">{getText('noCourses')}</p>
                  <p className="text-sm">{getText('noCoursesDesc')}</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {selectedCourses.map((course, index) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg border border-border"
                    >
                      <GripVertical size={18} className="text-text-secondary cursor-grab" />
                      <Badge variant="outline" className="shrink-0">
                        {getText('step')} {index + 1}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary m-0 truncate">{course.title}</p>
                        <p className="text-sm text-text-secondary m-0">{course.category} · {course.duration}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)}>
                        <X size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Available Courses */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>{getText('availableCourses')}</CardTitle>
            <div className="relative mt-3">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getText('searchCourse')}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-border hover:border-border-hover transition-colors"
                >
                  <div>
                    <p className="font-medium text-text-primary m-0">{course.title}</p>
                    <p className="text-sm text-text-secondary m-0">{course.category} · {course.duration}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => addCourse(course)}>
                    <Plus size={16} />
                    {getText('addCourse')}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        <Button variant="outline" onClick={() => navigate('/tu/teaching/roadmaps')}>
          {getText('cancel')}
        </Button>
        <Button variant="secondary" onClick={() => handleSave(true)}>
          {getText('saveDraft')}
        </Button>
        <Button onClick={() => handleSave(false)} disabled={!title || selectedCourses.length === 0}>
          {getText('publish')}
        </Button>
      </div>
    </div>
  );
}
