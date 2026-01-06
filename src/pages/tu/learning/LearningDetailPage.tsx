import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
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
import { useThemeStore } from '@/store/common/themeStore';
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

interface CurriculumListItemProps {
  item: CurriculumItem;
  isDark: boolean;
}

function CurriculumListItem({ item, isDark }: CurriculumListItemProps) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
        item.completed
          ? isDark
            ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20'
            : 'bg-green-50 border border-green-200 hover:bg-green-100'
          : isDark
          ? 'bg-white/5 border border-white/10 hover:bg-white/10'
          : 'bg-white border border-gray-200 hover:bg-gray-50'
      }`}
    >
      {/* Type Icon */}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          item.completed
            ? 'bg-green-500 text-white'
            : isDark
            ? 'bg-white/10 text-gray-400'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {typeIcons[item.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {item.title}
        </h4>
        {item.duration && (
          <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {item.duration}분
          </p>
        )}
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {item.completed ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
        )}
      </div>
    </div>
  );
}

export function LearningDetailPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
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
      navigate(prefixPath('/tu/b2c/mypage/learning'));
    } catch (error) {
      console.error('Failed to cancel enrollment:', error);
    }
  };

  const handleContinueLearning = () => {
    // 미완료 아이템 중 첫 번째 아이템으로 이동, 없으면 첫 아이템
    const nextItem = mockCurriculum.find((item) => !item.completed) || mockCurriculum[0];
    navigate(prefixPath(`/tu/b2c/mypage/learning/${enrollmentId}/player/${nextItem?.id || ''}`));
  };

  // Loading State
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    );
  }

  // Error State
  if (isError || !enrollment) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <BookOpen className={`w-16 h-16 mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
        <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.learning.enrollmentNotFound}
        </h3>
        <Button onClick={() => navigate(prefixPath('/tu/b2c/mypage/learning'))}>
          {t.learning.backToLearning}
        </Button>
      </div>
    );
  }

  // 실제 enrollment 데이터에서 진도율 가져오기 (API 데이터 우선)
  const progressPercent = enrollment.progress ?? 0;

  return (
    <div className={`min-h-full p-6 sm:p-10 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-[1200px] mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          className={`mb-6 gap-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : ''}`}
          onClick={() => navigate(prefixPath('/tu/b2c/mypage/learning'))}
        >
          <ArrowLeft className="w-4 h-4" />
          {t.learning.backToLearning}
        </Button>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Course Info Card */}
          <Card
            className={`lg:col-span-2 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <CardContent className="p-6">
              {/* Status Badge */}
              <Badge variant={statusColors[enrollment.status]} className="mb-4 flex items-center gap-1 w-fit">
                {statusIcons[enrollment.status]}
                {statusLabels[enrollment.status]}
              </Badge>

              {/* Program Title */}
              <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {enrollment.programTitle}
              </h1>

              {/* Course Time Name */}
              <p className={`text-base mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {enrollment.courseTimeName}
              </p>

              {/* Date Info */}
              <div className={`flex flex-wrap items-center gap-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
          <Card className={isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}>
            <CardContent className="p-6">
              <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.learning.learningProgress}
              </h3>

              {/* Progress Circle */}
              <div className="flex items-center justify-center mb-4">
                <div
                  className="relative w-32 h-32 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(${progressPercent === 100 ? '#22c55e' : '#6778ff'} ${progressPercent * 3.6}deg, ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'} 0deg)`,
                  }}
                >
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-[#1e1e1e]' : 'bg-white'
                    }`}
                  >
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {progressPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {progressPercent === 100 ? t.learning.statusCompleted : `${progressPercent}% ${t.learning.completed}`}
              </div>

              {/* Continue Button */}
              {enrollment.status === 'APPROVED' && (
                <Button
                  variant="brand"
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
        <Card className={`mb-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
              {t.learning.curriculum}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-3">
              {mockCurriculum.map((item) => (
                <CurriculumListItem key={item.id} item={item} isDark={isDark} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions Section */}
        {(enrollment.status === 'PENDING' || enrollment.status === 'APPROVED') && (
          <div className="flex justify-end gap-4">
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className={
                    isDark
                      ? 'text-red-400 border-red-400/30 hover:bg-red-400/10'
                      : 'text-red-600 border-red-200 hover:bg-red-50'
                  }
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {t.learning.cancelEnrollment}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={isDark ? 'bg-[#2a2a2a] border-white/10' : ''}>
                <AlertDialogHeader>
                  <AlertDialogTitle className={isDark ? 'text-white' : ''}>
                    {t.learning.cancelConfirmTitle}
                  </AlertDialogTitle>
                  <AlertDialogDescription className={isDark ? 'text-gray-400' : ''}>
                    {t.learning.cancelConfirmDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className={isDark ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' : ''}>
                    {t.common.cancel}
                  </AlertDialogCancel>
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
