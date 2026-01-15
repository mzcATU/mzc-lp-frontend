import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import {
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  Clock,
  BookOpen,
  Layers,
  Plus,
} from 'lucide-react';
import { Button, Badge, Card, Label, Textarea, BackButton } from '@/components/common';
import {
  useCourseRegistration,
  useRegisterCourse,
  useUnreadyCourse,
} from '@/hooks/tu/useCourseQueries';
import type { CourseRegistrationStatus } from '@/types/common/course.types';
import {
  COURSE_REGISTRATION_STATUS_LABELS,
  COURSE_LEVEL_LABELS,
  COURSE_TYPE_LABELS,
} from '@/types/common/course.types';

interface CourseDetailPageProps {
  language?: 'ko' | 'en';
}

const t = {
  back: { ko: '목록으로', en: 'Back to List' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '과정을 불러오는데 실패했습니다.', en: 'Failed to load course.' },
  notFound: { ko: '과정을 찾을 수 없습니다.', en: 'Course not found.' },
  basicInfo: { ko: '기본 정보', en: 'Basic Information' },
  title: { ko: '과정명', en: 'Title' },
  description: { ko: '설명', en: 'Description' },
  status: { ko: '상태', en: 'Status' },
  level: { ko: '레벨', en: 'Level' },
  type: { ko: '타입', en: 'Type' },
  estimatedHours: { ko: '예상 시간', en: 'Estimated Hours' },
  createdAt: { ko: '생성일', en: 'Created At' },
  updatedAt: { ko: '수정일', en: 'Updated At' },
  submittedAt: { ko: '제출일', en: 'Submitted At' },
  approvalInfo: { ko: '승인 정보', en: 'Approval Info' },
  approvedBy: { ko: '승인자', en: 'Approved By' },
  approvedAt: { ko: '승인일', en: 'Approved At' },
  registerComment: { ko: '승인 코멘트', en: 'Registration Comment' },
  rejectionInfo: { ko: '반려 정보', en: 'Rejection Info' },
  rejectedAt: { ko: '반려일', en: 'Rejected At' },
  rejectionReason: { ko: '반려 사유', en: 'Rejection Reason' },
  snapshotInfo: { ko: '스냅샷 정보', en: 'Snapshot Info' },
  snapshotId: { ko: '스냅샷 ID', en: 'Snapshot ID' },
  snapshotName: { ko: '스냅샷명', en: 'Snapshot Name' },
  actions: { ko: '액션', en: 'Actions' },
  register: { ko: '승인', en: 'Register' },
  reject: { ko: '반려', en: 'Reject' },
  registering: { ko: '승인 중...', en: 'Registering...' },
  rejecting: { ko: '반려 중...', en: 'Rejecting...' },
  confirmRegister: { ko: '이 과정을 승인하시겠습니까?', en: 'Register this course?' },
  confirmReject: { ko: '반려 사유를 입력하세요.', en: 'Enter rejection reason.' },
  rejectReasonRequired: { ko: '반려 사유를 입력해주세요.', en: 'Rejection reason is required.' },
  rejectReasonPlaceholder: { ko: '반려 사유를 입력하세요...', en: 'Enter rejection reason...' },
  registerCommentPlaceholder: { ko: '승인 코멘트 (선택)', en: 'Registration comment (optional)' },
  cancel: { ko: '취소', en: 'Cancel' },
  confirm: { ko: '확인', en: 'Confirm' },
  notSet: { ko: '미설정', en: 'Not set' },
  hours: { ko: '시간', en: 'hours' },
  creator: { ko: '생성자', en: 'Creator' },
  noSnapshot: { ko: '연결된 스냅샷이 없습니다.', en: 'No snapshot linked.' },
  courseDetails: { ko: '과정 세부 정보', en: 'Course Details' },
  metadata: { ko: '메타데이터', en: 'Metadata' },
  createCourseTime: { ko: '차수 생성', en: 'Create Course Time' },
};

const statusBadgeVariant: Record<CourseRegistrationStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  DRAFT: 'secondary',
  READY: 'warning',
  REGISTERED: 'success',
  REJECTED: 'destructive',
};

export function CourseDetailPage({ language = 'ko' }: Readonly<CourseDetailPageProps>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const courseId = Number(id);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [registerComment, setRegisterComment] = useState('');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const { data: course, isLoading, error } = useCourseRegistration(courseId);
  const registerCourse = useRegisterCourse();
  const unreadyCourse = useUnreadyCourse();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return getText('notSet');
    return new Date(dateStr).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRegister = async () => {
    try {
      await registerCourse.mutateAsync({
        id: courseId,
        request: registerComment ? { comment: registerComment } : undefined,
      });
      setShowRegisterModal(false);
      setRegisterComment('');
    } catch (err) {
      console.error('Register failed:', err);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert(getText('rejectReasonRequired'));
      return;
    }
    try {
      // TODO: 백엔드에서 반려 사유 저장 기능 추가 시 reason 전달
      await unreadyCourse.mutateAsync(courseId);
      setShowRejectModal(false);
      setRejectReason('');
    } catch (err) {
      console.error('Reject failed:', err);
    }
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

  return (
    <div className="h-full overflow-auto bg-bg-app">
      <div className="p-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-4">
          <BackButton
            onClick={() => navigate(prefixPath('/co/courses'))}
            label={getText('back')}
          />
        </div>

        {/* Header Section - 목록 페이지와 동일한 스타일 */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-text-primary mb-0">{course.title}</h1>
              <Badge variant={statusBadgeVariant[course.status]} className="text-sm">
                {COURSE_REGISTRATION_STATUS_LABELS[course.status]}
              </Badge>
            </div>
            <p className="text-text-secondary m-0">ID: {course.id}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {course.status === 'READY' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRejectModal(true)}
                  disabled={unreadyCourse.isPending}
                  className="border border-status-error text-status-error hover:bg-status-error-bg"
                >
                  <XCircle size={16} />
                  {unreadyCourse.isPending ? getText('rejecting') : getText('reject')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowRegisterModal(true)}
                  disabled={registerCourse.isPending}
                >
                  <CheckCircle size={16} />
                  {registerCourse.isPending ? getText('registering') : getText('register')}
                </Button>
              </>
            )}
            {course.status === 'REGISTERED' && (
              <Button
                size="sm"
                onClick={() => navigate(prefixPath(`/co/times/create?courseId=${course.id}`))}
              >
                <Plus size={16} />
                {getText('createCourseTime')}
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">

          {/* Description */}
          {course.description && (
            <Card>
              <div className="p-5">
                <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
                  {course.description}
                </p>
              </div>
            </Card>
          )}

          {/* Course Details Grid */}
          <Card>
            <div className="p-5">
              <h2 className="text-base font-medium text-text-primary mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-text-secondary" />
                {getText('courseDetails')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('level')}
                  </Label>
                  <p className="text-text-primary mt-1 font-medium">
                    {course.level ? COURSE_LEVEL_LABELS[course.level] : getText('notSet')}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('type')}
                  </Label>
                  <p className="text-text-primary mt-1 font-medium">
                    {course.type ? COURSE_TYPE_LABELS[course.type] : getText('notSet')}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('estimatedHours')}
                  </Label>
                  <p className="text-text-primary mt-1 font-medium flex items-center gap-1">
                    <Clock size={14} className="text-text-secondary" />
                    {course.estimatedHours
                      ? `${course.estimatedHours} ${getText('hours')}`
                      : getText('notSet')}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('creator')}
                  </Label>
                  <p className="text-text-primary mt-1 font-medium flex items-center gap-1">
                    <User size={14} className="text-text-secondary" />
                    {course.creatorName || (course.creatorId ? `ID: ${course.creatorId}` : '-')}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Metadata */}
          <Card>
            <div className="p-5">
              <h2 className="text-base font-medium text-text-primary mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-text-secondary" />
                {getText('metadata')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('createdAt')}
                  </Label>
                  <p className="text-text-primary mt-1 text-sm">
                    {formatDate(course.createdAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('updatedAt')}
                  </Label>
                  <p className="text-text-primary mt-1 text-sm">
                    {formatDate(course.updatedAt)}
                  </p>
                </div>
                {course.submittedAt && (
                  <div>
                    <Label className="text-text-secondary text-xs uppercase tracking-wide">
                      {getText('submittedAt')}
                    </Label>
                    <p className="text-text-primary mt-1 text-sm">
                      {formatDate(course.submittedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Snapshot Info */}
          <Card>
            <div className="p-5">
              <h2 className="text-base font-medium text-text-primary mb-4 flex items-center gap-2">
                <Layers size={18} className="text-text-secondary" />
                {getText('snapshotInfo')}
              </h2>
              {course.snapshotId ? (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-text-secondary text-xs uppercase tracking-wide">
                      {getText('snapshotId')}
                    </Label>
                    <p className="text-text-primary mt-1 font-medium">{course.snapshotId}</p>
                  </div>
                  {course.snapshotName && (
                    <div>
                      <Label className="text-text-secondary text-xs uppercase tracking-wide">
                        {getText('snapshotName')}
                      </Label>
                      <p className="text-text-primary mt-1 font-medium">{course.snapshotName}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-text-secondary text-sm">{getText('noSnapshot')}</p>
              )}
            </div>
          </Card>

          {/* Approval Info */}
          {course.status === 'REGISTERED' && course.approvedAt && (
            <Card className="border-l-4 border-l-status-success">
              <div className="p-5">
                <h2 className="text-base font-medium text-text-primary mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-status-success" />
                  {getText('approvalInfo')}
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-text-secondary text-xs uppercase tracking-wide">
                      {getText('approvedBy')}
                    </Label>
                    <p className="text-text-primary mt-1">
                      {course.approvedByName || (course.approvedBy ? `ID: ${course.approvedBy}` : getText('notSet'))}
                    </p>
                  </div>
                  <div>
                    <Label className="text-text-secondary text-xs uppercase tracking-wide">
                      {getText('approvedAt')}
                    </Label>
                    <p className="text-text-primary mt-1 text-sm">
                      {formatDate(course.approvedAt)}
                    </p>
                  </div>
                </div>
                {course.approvalComment && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Label className="text-text-secondary text-xs uppercase tracking-wide">
                      {getText('registerComment')}
                    </Label>
                    <p className="text-text-primary mt-1 whitespace-pre-wrap">
                      {course.approvalComment}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Rejection Info */}
          {course.status === 'REJECTED' && course.rejectedAt && (
            <Card className="border-l-4 border-l-status-error">
              <div className="p-5">
                <h2 className="text-base font-medium text-text-primary mb-4 flex items-center gap-2">
                  <XCircle size={18} className="text-status-error" />
                  {getText('rejectionInfo')}
                </h2>
                <div className="mb-4">
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('rejectedAt')}
                  </Label>
                  <p className="text-text-primary mt-1 text-sm">
                    {formatDate(course.rejectedAt)}
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('rejectionReason')}
                  </Label>
                  <p className="text-text-primary mt-1 whitespace-pre-wrap">
                    {course.rejectionReason || getText('notSet')}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-default rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-status-success" />
              {getText('confirmRegister')}
            </h3>
            <div className="mb-4">
              <Label className="text-text-secondary mb-2">{getText('registerComment')}</Label>
              <Textarea
                value={registerComment}
                onChange={(e) => setRegisterComment(e.target.value)}
                placeholder={getText('registerCommentPlaceholder')}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRegisterModal(false);
                  setRegisterComment('');
                }}
              >
                {getText('cancel')}
              </Button>
              <Button onClick={handleRegister} disabled={registerCourse.isPending}>
                {registerCourse.isPending ? getText('registering') : getText('confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-bg-default rounded-xl p-6 w-full max-w-md mx-4 shadow-lg">
            <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-status-error" />
              {getText('confirmReject')}
            </h3>
            <div className="mb-4">
              <Label className="text-text-secondary mb-2">{getText('rejectionReason')} *</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={getText('rejectReasonPlaceholder')}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
              >
                {getText('cancel')}
              </Button>
              <Button
                onClick={handleReject}
                disabled={unreadyCourse.isPending || !rejectReason.trim()}
                className="bg-status-error hover:bg-status-error/90 text-white"
              >
                {unreadyCourse.isPending ? getText('rejecting') : getText('reject')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
