import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, AlertCircle } from 'lucide-react';
import { Button, Card } from '@/components/common';
import { useCourse } from '@/hooks/tu';
import { snapshotService } from '@/services/to/snapshotService';
import { programService } from '@/services/to/programService';
import { ProgramBasicInfoForm, type ProgramFormData } from '../programs/components/ProgramBasicInfoForm';
import type { ProgramLevel, ProgramType } from '@/types/common';

interface CourseApplyPageProps {
  language?: 'ko' | 'en';
}

const t = {
  pageTitle: { ko: '프로그램 신청', en: 'Apply for Program' },
  pageSubtitle: { ko: '강의를 프로그램으로 신청합니다. 정보를 확인하고 수정할 수 있습니다.', en: 'Apply this course as a program. Review and edit information.' },
  back: { ko: '취소', en: 'Cancel' },
  loading: { ko: '강의 정보를 불러오는 중...', en: 'Loading course information...' },
  error: { ko: '강의를 불러오는데 실패했습니다.', en: 'Failed to load course.' },
  notFound: { ko: '강의를 찾을 수 없습니다.', en: 'Course not found.' },
  apply: { ko: '프로그램 신청', en: 'Apply for Program' },
  applying: { ko: '신청 중...', en: 'Applying...' },
  applySuccess: { ko: '프로그램 신청이 완료되었습니다. 관리자 검토 후 승인됩니다.', en: 'Program submitted for review. It will be approved after admin review.' },
  applyFailed: { ko: '프로그램 신청에 실패했습니다.', en: 'Failed to apply for program.' },
  titleRequired: { ko: '프로그램명을 입력해주세요.', en: 'Please enter a program title.' },
  confirmApply: {
    ko: '이 강의를 프로그램으로 신청하시겠습니까?\n신청 후 관리자 검토를 거쳐 승인됩니다.',
    en: 'Apply this course as a program?\nIt will be reviewed and approved by an administrator.'
  },
  courseInfo: { ko: '원본 강의 정보', en: 'Original Course Information' },
  courseName: { ko: '강의명', en: 'Course Name' },
};

export function CourseApplyPage({ language = 'ko' }: Readonly<CourseApplyPageProps>) {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const id = courseId ? parseInt(courseId, 10) : 0;

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // Form state
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    description: '',
    thumbnailUrl: '',
    level: '',
    type: '',
    estimatedHours: null,
  });
  const [isApplying, setIsApplying] = useState(false);

  // API hooks
  const { data: course, isLoading, error } = useCourse(id);

  // Course 데이터로 폼 초기화 (prefill)
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        thumbnailUrl: course.thumbnailUrl || '',
        level: (course.level as ProgramLevel) || '',
        type: (course.type as ProgramType) || '',
        estimatedHours: course.estimatedHours || null,
      });
    }
  }, [course]);

  // 폼 데이터 변경 핸들러
  const handleFormDataChange = (data: Partial<ProgramFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // 프로그램 신청 핸들러 (생성 후 바로 PENDING 상태로 제출)
  const handleApply = async () => {
    // 유효성 검사
    if (!formData.title.trim()) {
      alert(getText('titleRequired'));
      return;
    }

    // 확인
    if (!window.confirm(getText('confirmApply'))) {
      return;
    }

    setIsApplying(true);

    try {
      // 1. Snapshot 생성
      const snapshot = await snapshotService.createFromCourse(id, {
        snapshotName: formData.title.trim(),
        description: formData.description.trim() || undefined,
      });

      // 2. Program 생성
      const program = await programService.createProgram({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        thumbnailUrl: formData.thumbnailUrl.trim() || undefined,
        level: formData.level || undefined,
        type: formData.type || undefined,
        estimatedHours: formData.estimatedHours || undefined,
        snapshotId: snapshot.snapshotId,
      });

      // 3. Program 제출 (PENDING 상태로)
      await programService.submitProgram(program.id);

      alert(getText('applySuccess'));
      // 프로그램 목록 페이지로 이동
      navigate('/tu/teaching/programs');
    } catch (err) {
      console.error('Apply failed:', err);
      alert(getText('applyFailed'));
    } finally {
      setIsApplying(false);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <Loader2 size={32} className="animate-spin text-text-secondary" />
        <span className="ml-2 text-text-secondary">{getText('loading')}</span>
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
            {error ? getText('error') : getText('notFound')}
          </p>
          <Button
            variant="ghost"
            className="mt-4 border border-border"
            onClick={() => navigate('/tu/teaching/courses')}
          >
            <ArrowLeft size={16} />
            목록으로
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-bg-app">
      {/* Header */}
      <div className="border-b border-border bg-bg-default sticky top-0 z-10">
        <div className="p-6 px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="border border-border"
                onClick={() => navigate(`/tu/teaching/courses/${id}`)}
              >
                <ArrowLeft size={16} />
                {getText('back')}
              </Button>
              <div>
                <h1 className="text-text-primary text-xl mb-0">{getText('pageTitle')}</h1>
                <p className="text-text-secondary text-sm mt-1">{getText('pageSubtitle')}</p>
              </div>
            </div>

            {/* Action Button */}
            <Button onClick={handleApply} disabled={isApplying}>
              {isApplying ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isApplying ? getText('applying') : getText('apply')}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 max-w-3xl space-y-6">
          {/* 원본 강의 정보 안내 */}
          <Card className="bg-bg-subtle border-border">
            <div className="p-4">
              <p className="text-sm text-text-secondary mb-2">
                {getText('courseInfo')}
              </p>
              <p className="text-text-primary font-medium">
                {getText('courseName')}: {course.title}
              </p>
              <p className="text-xs text-text-tertiary mt-2">
                {language === 'ko'
                  ? '아래 정보는 강의에서 가져온 기본값입니다. 필요에 따라 수정할 수 있습니다.'
                  : 'The information below is pre-filled from the course. You can modify it as needed.'}
              </p>
            </div>
          </Card>

          {/* 기본 정보 폼 */}
          <ProgramBasicInfoForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            language={language}
          />

          {/* 하단 신청 버튼 (모바일 대응) */}
          <div className="pt-4 pb-8">
            <Button
              onClick={handleApply}
              disabled={isApplying}
              className="w-full"
              size="lg"
            >
              {isApplying ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isApplying ? getText('applying') : getText('apply')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
