import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import {
  CheckCircle,
  FileText,
  Calendar,
  User,
  Loader2,
  Clock,
  Layers,
  Plus,
  Tag,
  GraduationCap,
  Monitor,
  FolderOpen,
  Info,
  PlayCircle,
  ChevronRight,
} from 'lucide-react';
import { Button, Badge, Card, BackButton } from '@/components/common';
import {
  useCourseRegistration,
  useCourse,
  useCourseItemsHierarchy,
} from '@/hooks/tu/useCourseQueries';
import { useTimes } from '@/hooks/co/useTimeQueries';
import { COURSE_TIME_STATUS_LABELS } from '@/types/co/time.types';
import type { CourseTimeStatus } from '@/types/co/time.types';
import { categoryService } from '@/services/common';
import type { CourseRegistrationStatus } from '@/types/common/course.types';
import type { CategoryResponse } from '@/types/common';
import {
  COURSE_REGISTRATION_STATUS_LABELS,
  COURSE_LEVEL_LABELS,
  COURSE_TYPE_LABELS,
} from '@/types/common/course.types';
import { CourseCurriculumSection } from '@/pages/tu/teaching/courses/components/CourseCurriculumSection';

interface CourseDetailPageProps {
  language?: 'ko' | 'en';
}

const t = {
  back: { ko: '목록으로', en: 'Back to List' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '과정을 불러오는데 실패했습니다.', en: 'Failed to load course.' },
  notFound: { ko: '과정을 찾을 수 없습니다.', en: 'Course not found.' },
  description: { ko: '설명', en: 'Description' },
  createdAt: { ko: '생성일', en: 'Created At' },
  updatedAt: { ko: '수정일', en: 'Updated At' },
  submittedAt: { ko: '제출일', en: 'Submitted At' },
  approvalInfo: { ko: '승인 정보', en: 'Approval Info' },
  approvedBy: { ko: '승인자', en: 'Approved By' },
  approvedAt: { ko: '승인일', en: 'Approved At' },
  approvalComment: { ko: '승인 코멘트', en: 'Approval Comment' },
  snapshotInfo: { ko: '스냅샷 정보', en: 'Snapshot Info' },
  snapshotId: { ko: '스냅샷 ID', en: 'Snapshot ID' },
  snapshotName: { ko: '스냅샷명', en: 'Snapshot Name' },
  notSet: { ko: '-', en: '-' },
  hours: { ko: '시간', en: 'hours' },
  creator: { ko: '생성자', en: 'Creator' },
  metadata: { ko: '메타데이터', en: 'Metadata' },
  createCourseTime: { ko: '차수 생성', en: 'Create Session' },
  period: { ko: '운영 기간', en: 'Period' },
  noPeriod: { ko: '기간 미설정', en: 'Not set' },
  noDescription: { ko: '설명이 없습니다.', en: 'No description.' },
  courseOverview: { ko: '과정 개요', en: 'Overview' },
  operationStatus: { ko: '운영 현황', en: 'Sessions' },
  noSessions: { ko: '생성된 차수가 없습니다.', en: 'No sessions created yet.' },
  unit: { ko: '개', en: '' },
};

const statusBadgeVariant: Record<CourseRegistrationStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  DRAFT: 'secondary',
  READY: 'warning',
  REGISTERED: 'success',
  REJECTED: 'destructive',
};

const timeStatusBadgeVariant: Record<CourseTimeStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  DRAFT: 'secondary',
  RECRUITING: 'warning',
  ONGOING: 'success',
  CLOSED: 'default',
  ARCHIVED: 'secondary',
};

export function CourseDetailPage({ language = 'ko' }: Readonly<CourseDetailPageProps>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const courseId = Number(id);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const { data: course, isLoading, error } = useCourseRegistration(courseId);
  const { data: courseDetail } = useCourse(courseId);
  const { data: curriculum } = useCourseItemsHierarchy(courseId);
  const { data: timesData } = useTimes({ courseId, size: 100 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('카테고리 목록 조회 실패:', err);
      }
    };
    fetchCategories();
  }, []);

  const getCategoryName = (categoryId: number | null): string => {
    if (!categoryId) return getText('notSet');
    const category = categories.find((c) => c.id === categoryId);
    return category?.name ?? getText('notSet');
  };

  const formatDate = (dateStr: string | null, includeTime = false) => {
    if (!dateStr) return getText('notSet');
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    if (!includeTime) return `${year}-${month}-${day}`;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatPeriod = () => {
    const start = course?.courseStartDate || courseDetail?.startDate;
    const end = course?.courseEndDate || courseDetail?.endDate;
    if (!start && !end) return getText('noPeriod');
    return `${formatDate(start || null)} ~ ${formatDate(end || null)}`;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <Loader2 size={32} className="animate-spin text-text-secondary" />
        <span className="ml-2 text-text-secondary">{getText('loading')}</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-3 text-text-placeholder" />
          <p className="text-text-secondary">{error ? getText('error') : getText('notFound')}</p>
          <BackButton
            onClick={() => navigate(prefixPath('/co/courses'))}
            label={getText('back')}
            className="mt-4"
          />
        </div>
      </div>
    );
  }

  const actualCourseId = (course as { courseId?: number }).courseId || course.id;

  return (
    <div className="h-full overflow-auto bg-bg-app">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* 뒤로가기 */}
        <div className="mb-6">
          <BackButton
            onClick={() => navigate(prefixPath('/co/courses'))}
            label={getText('back')}
          />
        </div>

        {/* Hero Section */}
        <div className="bg-bg-default border border-border rounded-xl overflow-hidden mb-6">
          <div className="flex flex-col lg:flex-row">
            {/* 썸네일 영역 */}
            <div className="lg:w-80 flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5">
              {(course.thumbnailUrl || courseDetail?.thumbnailUrl) ? (
                <img
                  src={course.thumbnailUrl || courseDetail?.thumbnailUrl || ''}
                  alt={course.title}
                  className="w-full h-48 lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-48 lg:h-full flex items-center justify-center p-6">
                  <p className="text-xl font-bold text-primary text-center line-clamp-3 leading-relaxed">
                    {course.title}
                  </p>
                </div>
              )}
            </div>

            {/* 정보 영역 */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* 상태 뱃지 */}
                  <div className="mb-3">
                    <Badge variant={statusBadgeVariant[course.status]} className="text-sm">
                      {COURSE_REGISTRATION_STATUS_LABELS[course.status]}
                    </Badge>
                  </div>

                  {/* 제목 */}
                  <h1 className="text-2xl font-bold text-text-primary mb-2 line-clamp-2">
                    {course.title}
                  </h1>

                  {/* 카테고리 */}
                  <p className="text-sm text-text-secondary mb-4">
                    {getCategoryName(courseDetail?.categoryId ?? null)}
                  </p>

                  {/* 핵심 정보 뱃지들 - Subtle Style */}
                  <div className="flex flex-wrap items-center gap-2">
                    {course.level && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
                        <GraduationCap size={14} />
                        {COURSE_LEVEL_LABELS[course.level]}
                      </span>
                    )}
                    {course.type && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                        <Monitor size={14} />
                        {COURSE_TYPE_LABELS[course.type]}
                      </span>
                    )}
                    {course.estimatedHours && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                        <Clock size={14} />
                        {course.estimatedHours}{getText('hours')}
                      </span>
                    )}
                    {(courseDetail?.itemCount ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-sm font-medium">
                        <FolderOpen size={14} />
                        {courseDetail?.itemCount}차시
                      </span>
                    )}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(prefixPath(`/co/times/create?courseId=${actualCourseId}`))}
                    className="whitespace-nowrap"
                  >
                    <Plus size={16} />
                    {getText('createCourseTime')}
                  </Button>
                </div>
              </div>

              {/* 태그 */}
              {courseDetail?.tags && courseDetail.tags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {courseDetail.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2컬럼 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 설명 */}
            <Card>
              <div className="p-5">
                <h2 className="text-base font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Info size={18} className="text-text-secondary" />
                  {getText('description')}
                </h2>
                <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
                  {course.description || (
                    <span className="text-text-placeholder italic">{getText('noDescription')}</span>
                  )}
                </p>
              </div>
            </Card>

            {/* 커리큘럼 */}
            <CourseCurriculumSection
              itemCount={courseDetail?.itemCount ?? 0}
              curriculum={curriculum ?? []}
            />

            {/* 운영 현황 - 섹션 구분을 위한 추가 간격 */}
            <Card className="mt-4">
              <div className="p-5">
                <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <PlayCircle size={18} className="text-text-secondary" />
                  {getText('operationStatus')}
                  {timesData && timesData.content.length > 0 && (
                    <span className="text-sm font-normal text-text-secondary">
                      ({timesData.totalElements}{getText('unit')})
                    </span>
                  )}
                </h2>

                {/* 차수 목록 */}
                {timesData && timesData.content.length > 0 ? (
                  <div className="space-y-2">
                    {timesData.content.map((time) => (
                      <div
                        key={time.id}
                        className="flex items-center justify-between gap-3 p-3 bg-bg-secondary rounded-lg hover:bg-bg-hover cursor-pointer transition-colors"
                        onClick={() => navigate(prefixPath(`/co/times/${time.id}`))}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Badge variant={timeStatusBadgeVariant[time.status]} className="text-xs flex-shrink-0">
                            {COURSE_TIME_STATUS_LABELS[time.status]}
                          </Badge>
                          <span className="text-sm text-text-primary truncate">
                            {time.title}
                          </span>
                        </div>
                        <ChevronRight size={16} className="text-text-placeholder flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <PlayCircle size={32} className="mx-auto mb-2 text-text-placeholder" />
                    <p className="text-sm text-text-secondary">{getText('noSessions')}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 우측: 사이드바 */}
          <div className="space-y-4">
            {/* 과정 개요 */}
            <Card>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-text-secondary" />
                  {getText('courseOverview')}
                </h3>
                <div className="space-y-4">
                  {/* 생성자 */}
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-text-secondary mb-0.5">{getText('creator')}</p>
                      <p className="text-sm text-text-primary truncate">
                        {course.creatorName || (course.creatorId ? `ID: ${course.creatorId}` : getText('notSet'))}
                      </p>
                    </div>
                  </div>

                  {/* 운영 기간 */}
                  <div className="flex items-start gap-3">
                    <Calendar size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-text-secondary mb-0.5">{getText('period')}</p>
                      <p className="text-sm text-text-primary">{formatPeriod()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 메타데이터 */}
            <Card>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Info size={16} className="text-text-secondary" />
                  {getText('metadata')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">ID</span>
                    <span className="text-text-placeholder font-mono text-xs">{actualCourseId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{getText('createdAt')}</span>
                    <span className="text-text-primary">{formatDate(course.createdAt, true)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">{getText('updatedAt')}</span>
                    <span className="text-text-primary">{formatDate(course.updatedAt, true)}</span>
                  </div>
                  {course.submittedAt && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">{getText('submittedAt')}</span>
                      <span className="text-text-primary">{formatDate(course.submittedAt, true)}</span>
                    </div>
                  )}
                  {course.approvedAt && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">{getText('approvedAt')}</span>
                      <span className="text-text-primary">{formatDate(course.approvedAt, true)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* 스냅샷 정보 */}
            {(course as { snapshotId?: number }).snapshotId && (
              <Card>
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Layers size={16} className="text-text-secondary" />
                    {getText('snapshotInfo')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">{getText('snapshotId')}</span>
                      <span className="text-text-primary font-mono">
                        {(course as { snapshotId?: number }).snapshotId}
                      </span>
                    </div>
                    {(course as { snapshotName?: string }).snapshotName && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">{getText('snapshotName')}</span>
                        <span className="text-text-primary truncate ml-2">
                          {(course as { snapshotName?: string }).snapshotName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* 승인 정보 */}
            {course.approvedAt && (
              <Card className="border-l-4 border-l-status-success">
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <CheckCircle size={16} className="text-status-success" />
                    {getText('approvalInfo')}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">{getText('approvedBy')}</span>
                      <span className="text-text-primary">
                        {course.approvedByName || (course.approvedBy ? `ID: ${course.approvedBy}` : getText('notSet'))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">{getText('approvedAt')}</span>
                      <span className="text-text-primary">{formatDate(course.approvedAt, true)}</span>
                    </div>
                  </div>
                  {course.approvalComment && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-text-secondary mb-1">{getText('approvalComment')}</p>
                      <p className="text-sm text-text-primary whitespace-pre-wrap bg-bg-secondary rounded-lg p-3">
                        {course.approvalComment}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
