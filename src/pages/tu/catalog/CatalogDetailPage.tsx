import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  Calendar,
  GraduationCap,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
  Skeleton,
} from '@/components/common';
import { useCatalogProgram, useCatalogCourseTimes, useEnroll } from '@/hooks/tu';
import { useTranslation } from '@/store/common/languageStore';
import type { CatalogCourseTime } from '@/services/tu/catalogService';

const difficultyColors: Record<string, 'green' | 'blue' | 'orange'> = {
  BEGINNER: 'green',
  INTERMEDIATE: 'blue',
  ADVANCED: 'orange',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function CourseTimeCard({
  courseTime,
  onEnroll,
  isEnrolling,
  t,
}: {
  courseTime: CatalogCourseTime;
  onEnroll: (id: number) => void;
  isEnrolling: boolean;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  const isFull = courseTime.capacity && courseTime.currentEnrollment
    ? courseTime.currentEnrollment >= courseTime.capacity
    : false;
  const canEnroll = courseTime.isEnrollable && !isFull;

  return (
    <Card
      style={{
        backgroundColor: designTokens.bg.default,
        border: `1px solid ${designTokens.bg.border}`,
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* 차수명 */}
            <h4
              className="font-medium text-base mb-2"
              style={{ color: designTokens.text.primary }}
            >
              {courseTime.name}
            </h4>

            {/* 기간 */}
            <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: designTokens.text.secondary }}>
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(courseTime.startDate)} ~ {formatDate(courseTime.endDate)}
              </span>
            </div>

            {/* 정원 */}
            {courseTime.capacity && (
              <div className="flex items-center gap-2 text-sm" style={{ color: designTokens.text.secondary }}>
                <Users className="w-4 h-4" />
                <span>
                  {courseTime.currentEnrollment || 0} / {courseTime.capacity}
                </span>
                {isFull && (
                  <Badge variant="red" className="text-xs">{t.catalog.closed}</Badge>
                )}
              </div>
            )}

            {/* 수강 신청 기간 */}
            {courseTime.enrollmentStartDate && courseTime.enrollmentEndDate && (
              <p className="mt-2 text-xs" style={{ color: designTokens.text.placeholder }}>
                {t.catalog.enrollmentPeriod}: {formatDate(courseTime.enrollmentStartDate)} ~ {formatDate(courseTime.enrollmentEndDate)}
              </p>
            )}
          </div>

          {/* 신청 버튼 */}
          <div className="ml-4">
            <Button
              onClick={() => onEnroll(courseTime.id)}
              disabled={!canEnroll || isEnrolling}
              size="sm"
            >
              {isEnrolling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.catalog.processing}
                </>
              ) : isFull ? (
                t.catalog.closedStatus
              ) : !courseTime.isEnrollable ? (
                t.catalog.notAvailable
              ) : (
                t.catalog.enroll
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CatalogDetailPage() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const id = Number(programId);

  const difficultyLabels: Record<string, string> = {
    BEGINNER: t.catalog.beginner,
    INTERMEDIATE: t.catalog.intermediate,
    ADVANCED: t.catalog.advanced,
  };

  const { data: program, isLoading: isProgramLoading, isError: isProgramError } = useCatalogProgram(id);
  const { data: courseTimes, isLoading: isTimesLoading } = useCatalogCourseTimes(id);
  const enrollMutation = useEnroll();

  const handleBack = () => {
    navigate('/tu/catalog');
  };

  const handleEnroll = async (courseTimeId: number) => {
    try {
      await enrollMutation.mutateAsync(courseTimeId);
      alert(t.catalog.enrollSuccess);
    } catch {
      alert(t.catalog.enrollFail);
    }
  };

  // Loading
  if (isProgramLoading) {
    return (
      <div
        style={{
          padding: '40px',
          backgroundColor: designTokens.bg.app_default,
          minHeight: '100%',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full mb-6 rounded-lg" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  // Error
  if (isProgramError || !program) {
    return (
      <div
        style={{
          padding: '40px',
          backgroundColor: designTokens.bg.app_default,
          minHeight: '100%',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Button variant="ghost" onClick={handleBack} className="mb-6 gap-2">
            <ArrowLeft className="w-5 h-5" />
            {t.catalog.backToCatalog}
          </Button>

          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: designTokens.status.error_text }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: designTokens.text.primary }}>
              {t.catalog.courseNotFound}
            </h3>
            <p style={{ color: designTokens.text.secondary }}>
              {t.catalog.courseNotFoundDesc}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: designTokens.bg.app_default,
        minHeight: '100%',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBack} className="mb-6 gap-2">
          <ArrowLeft className="w-5 h-5" />
          {t.catalog.backToCatalog}
        </Button>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Thumbnail */}
          <div
            className="w-full md:w-80 h-48 md:h-52 rounded-lg bg-cover bg-center flex-shrink-0"
            style={{
              backgroundColor: designTokens.bg.secondary,
              backgroundImage: program.thumbnailUrl ? `url(${program.thumbnailUrl})` : undefined,
            }}
          >
            {!program.thumbnailUrl && (
              <div className="h-full flex items-center justify-center">
                <BookOpen className="w-16 h-16" style={{ color: designTokens.text.placeholder }} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            {/* Category & Difficulty */}
            <div className="flex items-center gap-2 mb-3">
              {program.categoryName && (
                <Badge variant="gray">{program.categoryName}</Badge>
              )}
              {program.difficulty && (
                <Badge variant={difficultyColors[program.difficulty]}>
                  {difficultyLabels[program.difficulty]}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-2xl font-bold mb-4"
              style={{ color: designTokens.text.primary }}
            >
              {program.title}
            </h1>

            {/* Instructor */}
            {program.instructorName && (
              <div className="flex items-center gap-2 mb-4" style={{ color: designTokens.text.secondary }}>
                <GraduationCap className="w-5 h-5" />
                <span className="font-medium">{program.instructorName}</span>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6" style={{ color: designTokens.text.secondary }}>
              {program.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{Math.floor(program.duration / 60)}{t.catalog.hours} {program.duration % 60}{t.catalog.minutes}</span>
                </div>
              )}
              {program.enrollmentCount !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{program.enrollmentCount.toLocaleString()} {t.catalog.enrolled}</span>
                </div>
              )}
              {program.rating !== undefined && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current text-yellow-500" />
                  <span>{program.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {program.description && (
          <Card className="mb-8" style={{ backgroundColor: designTokens.bg.default }}>
            <CardHeader>
              <CardTitle className="text-lg">{t.catalog.courseIntro}</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className="whitespace-pre-wrap leading-relaxed"
                style={{ color: designTokens.text.secondary }}
              >
                {program.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Course Times Section */}
        <Card style={{ backgroundColor: designTokens.bg.default }}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t.catalog.availableSessions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTimesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : courseTimes && courseTimes.length > 0 ? (
              <div className="space-y-4">
                {courseTimes.map((courseTime) => (
                  <CourseTimeCard
                    key={courseTime.id}
                    courseTime={courseTime}
                    onEnroll={handleEnroll}
                    isEnrolling={enrollMutation.isPending}
                    t={t}
                  />
                ))}
              </div>
            ) : (
              <Alert
                style={{
                  backgroundColor: designTokens.status.warning_background,
                  borderColor: designTokens.status.warning_text,
                }}
              >
                <AlertCircle className="w-5 h-5" style={{ color: designTokens.status.warning_text }} />
                <AlertDescription style={{ color: designTokens.status.warning_text }}>
                  {t.catalog.noAvailableSessions}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
