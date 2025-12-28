import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  XCircle,
  Loader2,
  BookOpen,
  ChevronRight,
  FileText,
  Video,
  Link as LinkIcon,
} from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/common';
import { useEnrollment, useCancelEnrollment } from '@/hooks/tu';
import { useTranslation } from '@/store/common/languageStore';
import type { EnrollmentStatus } from '@/services/tu/enrollmentService';

const statusColors: Record<EnrollmentStatus, 'blue' | 'green' | 'red' | 'gray' | 'orange'> = {
  PENDING: 'orange',
  APPROVED: 'blue',
  REJECTED: 'red',
  CANCELLED: 'gray',
  COMPLETED: 'green',
};

const statusIcons: Record<EnrollmentStatus, React.ReactNode> = {
  PENDING: <AlertCircle className="w-4 h-4" />,
  APPROVED: <PlayCircle className="w-4 h-4" />,
  REJECTED: <XCircle className="w-4 h-4" />,
  CANCELLED: <XCircle className="w-4 h-4" />,
  COMPLETED: <CheckCircle className="w-4 h-4" />,
};

// Mock 커리큘럼 데이터 (실제 API 연동 전)
interface CurriculumItem {
  id: number;
  title: string;
  type: 'video' | 'document' | 'link';
  duration?: number;
  completed: boolean;
}

const mockCurriculum: CurriculumItem[] = [
  { id: 1, title: '강의 소개', type: 'video', duration: 10, completed: true },
  { id: 2, title: '1장. 기본 개념 이해하기', type: 'video', duration: 45, completed: true },
  { id: 3, title: '1장. 실습 자료', type: 'document', completed: true },
  { id: 4, title: '2장. 심화 학습', type: 'video', duration: 60, completed: false },
  { id: 5, title: '2장. 참고 자료', type: 'link', completed: false },
  { id: 6, title: '3장. 실전 프로젝트', type: 'video', duration: 90, completed: false },
];

const typeIcons: Record<CurriculumItem['type'], React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  document: <FileText className="w-4 h-4" />,
  link: <LinkIcon className="w-4 h-4" />,
};

function CurriculumListItem({ item }: { item: CurriculumItem }) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-lg transition-colors cursor-pointer hover:bg-opacity-50"
      style={{
        backgroundColor: item.completed ? designTokens.status.success_background : designTokens.bg.default,
        border: `1px solid ${designTokens.bg.border}`,
      }}
    >
      {/* Type Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: item.completed ? designTokens.status.success_text : designTokens.bg.secondary,
          color: item.completed ? '#FFFFFF' : designTokens.text.secondary,
        }}
      >
        {typeIcons[item.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4
          className="font-medium text-sm truncate"
          style={{ color: designTokens.text.primary }}
        >
          {item.title}
        </h4>
        {item.duration && (
          <p className="text-xs mt-0.5" style={{ color: designTokens.text.secondary }}>
            {item.duration}분
          </p>
        )}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {item.completed ? (
          <CheckCircle className="w-5 h-5" style={{ color: designTokens.status.success_text }} />
        ) : (
          <ChevronRight className="w-5 h-5" style={{ color: designTokens.text.placeholder }} />
        )}
      </div>
    </div>
  );
}

export function LearningDetailPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const statusLabels: Record<EnrollmentStatus, string> = {
    PENDING: t.learning.statusPending,
    APPROVED: t.learning.statusApproved,
    REJECTED: t.learning.statusRejected,
    CANCELLED: t.learning.statusCancelled,
    COMPLETED: t.learning.statusCompleted,
  };

  const { data: enrollment, isLoading, isError } = useEnrollment(Number(enrollmentId));
  const cancelEnrollment = useCancelEnrollment();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleCancel = async () => {
    if (!enrollment) return;

    try {
      await cancelEnrollment.mutateAsync(enrollment.id);
      setCancelDialogOpen(false);
      navigate('/mypage/learning');
    } catch (error) {
      console.error('Failed to cancel enrollment:', error);
    }
  };

  const handleContinueLearning = () => {
    // 미완료 아이템 중 첫 번째 아이템으로 이동, 없으면 첫 아이템
    const nextItem = mockCurriculum.find((item) => !item.completed) || mockCurriculum[0];
    navigate(`/mypage/learning/${enrollmentId}/player/${nextItem?.id || ''}`);
  };

  // Loading State
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-full"
        style={{ backgroundColor: designTokens.bg.app_default }}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: designTokens.text.secondary }} />
      </div>
    );
  }

  // Error State
  if (isError || !enrollment) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-full"
        style={{ backgroundColor: designTokens.bg.app_default }}
      >
        <BookOpen className="w-16 h-16 mb-4" style={{ color: designTokens.text.placeholder }} />
        <h3 className="text-lg font-medium mb-2" style={{ color: designTokens.text.primary }}>
          {t.learning.enrollmentNotFound}
        </h3>
        <Button onClick={() => navigate('/mypage/learning')}>
          {t.learning.backToLearning}
        </Button>
      </div>
    );
  }

  const completedCount = mockCurriculum.filter((item) => item.completed).length;
  const progressPercent = Math.round((completedCount / mockCurriculum.length) * 100);

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: designTokens.bg.app_default,
        minHeight: '100%',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => navigate('/mypage/learning')}
        >
          <ArrowLeft className="w-4 h-4" />
          {t.learning.backToLearning}
        </Button>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Course Info Card */}
          <Card className="lg:col-span-2" style={{ backgroundColor: designTokens.bg.default }}>
            <CardContent className="p-6">
              {/* Status Badge */}
              <Badge variant={statusColors[enrollment.status]} className="mb-4 flex items-center gap-1 w-fit">
                {statusIcons[enrollment.status]}
                {statusLabels[enrollment.status]}
              </Badge>

              {/* Program Title */}
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: designTokens.text.primary }}
              >
                {enrollment.programTitle}
              </h1>

              {/* Course Time Name */}
              <p className="text-base mb-4" style={{ color: designTokens.text.secondary }}>
                {enrollment.courseTimeName}
              </p>

              {/* Date Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: designTokens.text.secondary }}>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t.learning.enrollmentPeriod}: {formatDate(enrollment.startDate)} ~ {formatDate(enrollment.endDate)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {t.learning.enrolledDate}: {formatDate(enrollment.enrolledAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card style={{ backgroundColor: designTokens.bg.default }}>
            <CardContent className="p-6">
              <h3
                className="text-sm font-medium mb-4"
                style={{ color: designTokens.text.secondary }}
              >
                {t.learning.learningProgress}
              </h3>

              {/* Progress Circle */}
              <div className="flex items-center justify-center mb-4">
                <div
                  className="relative w-32 h-32 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(${progressPercent === 100 ? designTokens.status.success_text : designTokens.button.brand_default} ${progressPercent * 3.6}deg, ${designTokens.bg.secondary} 0deg)`,
                  }}
                >
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: designTokens.bg.default }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{ color: designTokens.text.primary }}
                    >
                      {progressPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="text-center text-sm" style={{ color: designTokens.text.secondary }}>
                {completedCount} / {mockCurriculum.length} {t.learning.completed}
              </div>

              {/* Continue Button */}
              {enrollment.status === 'APPROVED' && (
                <Button
                  className="w-full mt-4"
                  onClick={handleContinueLearning}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {t.learning.continueLearning}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Curriculum Section */}
        <Card className="mb-8" style={{ backgroundColor: designTokens.bg.default }}>
          <CardHeader>
            <CardTitle style={{ color: designTokens.text.primary }}>
              {t.learning.curriculum}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-3">
              {mockCurriculum.map((item) => (
                <CurriculumListItem key={item.id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions Section */}
        {(enrollment.status === 'PENDING' || enrollment.status === 'APPROVED') && (
          <div className="flex justify-end gap-4">
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="w-4 h-4 mr-2" />
                  {t.learning.cancelEnrollment}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.learning.cancelConfirmTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.learning.cancelConfirmDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={cancelEnrollment.isPending}
                  >
                    {cancelEnrollment.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {t.learning.cancelEnrollment}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
