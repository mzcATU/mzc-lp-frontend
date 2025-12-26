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
import type { CatalogCourseTime } from '@/services/tu/catalogService';

const difficultyLabels: Record<string, string> = {
  BEGINNER: '입문',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

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
}: {
  courseTime: CatalogCourseTime;
  onEnroll: (id: number) => void;
  isEnrolling: boolean;
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
                  {courseTime.currentEnrollment || 0} / {courseTime.capacity}명
                </span>
                {isFull && (
                  <Badge variant="red" className="text-xs">마감</Badge>
                )}
              </div>
            )}

            {/* 수강 신청 기간 */}
            {courseTime.enrollmentStartDate && courseTime.enrollmentEndDate && (
              <p className="mt-2 text-xs" style={{ color: designTokens.text.placeholder }}>
                신청기간: {formatDate(courseTime.enrollmentStartDate)} ~ {formatDate(courseTime.enrollmentEndDate)}
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
                  처리 중...
                </>
              ) : isFull ? (
                '마감됨'
              ) : !courseTime.isEnrollable ? (
                '신청 불가'
              ) : (
                '수강신청'
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
  const id = Number(programId);

  const { data: program, isLoading: isProgramLoading, isError: isProgramError } = useCatalogProgram(id);
  const { data: courseTimes, isLoading: isTimesLoading } = useCatalogCourseTimes(id);
  const enrollMutation = useEnroll();

  const handleBack = () => {
    navigate('/tu/catalog');
  };

  const handleEnroll = async (courseTimeId: number) => {
    try {
      await enrollMutation.mutateAsync(courseTimeId);
      alert('수강신청이 완료되었습니다.');
    } catch {
      alert('수강신청에 실패했습니다. 다시 시도해주세요.');
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
            카탈로그로 돌아가기
          </Button>

          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: designTokens.status.error_text }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: designTokens.text.primary }}>
              강의를 찾을 수 없습니다
            </h3>
            <p style={{ color: designTokens.text.secondary }}>
              요청하신 강의가 존재하지 않거나 접근할 수 없습니다.
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
          카탈로그로 돌아가기
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
                  <span>{Math.floor(program.duration / 60)}시간 {program.duration % 60}분</span>
                </div>
              )}
              {program.enrollmentCount !== undefined && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{program.enrollmentCount.toLocaleString()}명 수강</span>
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
              <CardTitle className="text-lg">강의 소개</CardTitle>
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
              수강 가능한 차수
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
                  현재 수강 가능한 차수가 없습니다.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
