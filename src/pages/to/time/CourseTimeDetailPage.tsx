import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import { toast } from 'sonner';
import {
  Edit,
  Copy,
  Trash2,
  Play,
  Square,
  Archive,
  Users,
  Calendar,
  MapPin,
  Clock,
  Loader2,
  Save,
  X,
  UserPlus,
  FileText,
  GraduationCap,
  BookOpen,
  User,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge, Input, Label, NativeSelect, Card, Textarea, BackButton } from '@/components/common';
import { EnrollmentTab } from '@/pages/to/enrollment';
import {
  useTime,
  useUpdateTime,
  useDeleteTime,
  useOpenTime,
  useStartTime,
  useCloseTime,
  useArchiveTime,
} from '@/hooks/to/useTimeQueries';
import type { CourseTimeStatus, UpdateCourseTimeRequest, DeliveryType, EnrollmentMethod } from '@/types/to/time.types';
import {
  COURSE_TIME_STATUS_LABELS,
  DELIVERY_TYPE_LABELS,
  ENROLLMENT_METHOD_LABELS,
  COURSE_TIME_STATUS_TRANSITIONS,
} from '@/types/to/time.types';

interface CourseTimeDetailPageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '차수 상세', en: 'Course Time Detail' },
  back: { ko: '목록으로', en: 'Back to List' },
  edit: { ko: '수정', en: 'Edit' },
  save: { ko: '저장', en: 'Save' },
  cancel: { ko: '취소', en: 'Cancel' },
  clone: { ko: '복제', en: 'Clone' },
  delete: { ko: '삭제', en: 'Delete' },
  // Status Actions
  openRecruiting: { ko: '모집 시작', en: 'Start Recruiting' },
  startLearning: { ko: '학습 시작', en: 'Start Learning' },
  closeCourse: { ko: '종료', en: 'Close' },
  archiveCourse: { ko: '보관', en: 'Archive' },
  // Sections
  basicInfo: { ko: '기본 정보', en: 'Basic Information' },
  timeTitle: { ko: '차수명', en: 'Title' },
  status: { ko: '상태', en: 'Status' },
  description: { ko: '설명', en: 'Description' },
  programInfo: { ko: '프로그램 정보', en: 'Program Information' },
  programId: { ko: '프로그램 ID', en: 'Program ID' },
  programTitle: { ko: '프로그램명', en: 'Program Title' },
  courseId: { ko: '강의 ID', en: 'Course ID' },
  courseTitle: { ko: '강의명', en: 'Course Title' },
  deliveryInfo: { ko: '진행 정보', en: 'Delivery Information' },
  deliveryType: { ko: '진행 방식', en: 'Delivery Type' },
  enrollmentMethod: { ko: '수강 신청 방식', en: 'Enrollment Method' },
  location: { ko: '장소', en: 'Location' },
  periodInfo: { ko: '기간 정보', en: 'Period Information' },
  enrollmentPeriod: { ko: '모집 기간', en: 'Enrollment Period' },
  learningPeriod: { ko: '학습 기간', en: 'Learning Period' },
  capacityInfo: { ko: '정원 및 수강', en: 'Capacity & Enrollment' },
  capacity: { ko: '정원', en: 'Capacity' },
  currentEnrollment: { ko: '현재 수강 인원', en: 'Current Enrollment' },
  availableSeats: { ko: '잔여 좌석', en: 'Available Seats' },
  price: { ko: '가격', en: 'Price' },
  unlimited: { ko: '무제한', en: 'Unlimited' },
  free: { ko: '무료', en: 'Free' },
  instructors: { ko: '강사 정보', en: 'Instructors' },
  noInstructors: { ko: '배정된 강사가 없습니다.', en: 'No instructors assigned.' },
  addInstructor: { ko: '강사 추가', en: 'Add Instructor' },
  // Instructor Roles
  MAIN: { ko: '메인 강사', en: 'Main Instructor' },
  SUB: { ko: '서브 강사', en: 'Sub Instructor' },
  ASSISTANT: { ko: '조교', en: 'Assistant' },
  // Messages
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  notFound: { ko: '차수를 찾을 수 없습니다.', en: 'Course time not found.' },
  confirmDelete: { ko: '정말 삭제하시겠습니까?', en: 'Are you sure you want to delete?' },
  confirmStatusChange: { ko: '상태를 변경하시겠습니까?', en: 'Are you sure you want to change status?' },
  updateSuccess: { ko: '수정되었습니다.', en: 'Updated successfully.' },
  updateError: { ko: '수정에 실패했습니다.', en: 'Failed to update.' },
  deleteSuccess: { ko: '삭제되었습니다.', en: 'Deleted successfully.' },
  statusChangeError: { ko: '상태 변경에 실패했습니다.', en: 'Failed to change status.' },
  noDescription: { ko: '설명 없음', en: 'No description' },
  noLocation: { ko: '장소 미지정', en: 'No location' },
  // Tabs
  tabBasicInfo: { ko: '기본 정보', en: 'Basic Info' },
  tabEnrollments: { ko: '수강생', en: 'Enrollments' },
  // Additional Info
  createdAt: { ko: '생성일', en: 'Created' },
  allowLateEnrollment: { ko: '중간 합류', en: 'Late Enrollment' },
  allowLateEnrollmentYes: { ko: '허용', en: 'Allowed' },
  allowLateEnrollmentNo: { ko: '비허용', en: 'Not Allowed' },
  minProgressForCompletion: { ko: '수료 기준', en: 'Completion Criteria' },
  alwaysOpen: { ko: '상시모집', en: 'Always Open' },
};

// 백엔드 에러 코드 → 사용자 친화적 메시지 매핑
const ERROR_MESSAGES: Record<string, { ko: string; en: string }> = {
  TS001: { ko: '차수를 찾을 수 없습니다.', en: 'Course time not found.' },
  TS002: { ko: '유효하지 않은 상태 전환입니다.', en: 'Invalid status transition.' },
  TS003: { ko: '정원이 초과되었습니다.', en: 'Capacity exceeded.' },
  TS004: { ko: '유효하지 않은 기간입니다.', en: 'Invalid date range.' },
  TS005: { ko: '오프라인/블렌디드 과정은 장소 정보가 필요합니다.', en: 'Location info required for offline/blended courses.' },
  TS006: { ko: '현재 상태에서는 차수를 수정할 수 없습니다.', en: 'Course time is not modifiable in current status.' },
  TS007: { ko: '진행 중인 과정에서는 메인 강사를 삭제할 수 없습니다.', en: 'Cannot delete main instructor while course is ongoing.' },
  TS008: { ko: '모집을 시작하려면 메인 강사를 먼저 배정해야 합니다.', en: 'Main instructor must be assigned before starting recruitment.' },
  TS009: { ko: '이 차수에 접근할 권한이 없습니다.', en: 'Not authorized to access this course time.' },
};

const statusBadgeVariant: Record<CourseTimeStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  DRAFT: 'secondary',
  RECRUITING: 'default',
  ONGOING: 'success',
  CLOSED: 'warning',
  ARCHIVED: 'destructive',
};

export function CourseTimeDetailPage({ language = 'ko' }: Readonly<CourseTimeDetailPageProps>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const timeId = parseInt(id || '0');

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateCourseTimeRequest>({});
  const [activeTab, setActiveTab] = useState<'info' | 'enrollments'>('info');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // React Query Hooks
  const { data: courseTime, isLoading, error } = useTime(timeId);
  const updateTime = useUpdateTime();
  const deleteTime = useDeleteTime();
  const openTime = useOpenTime();
  const startTime = useStartTime();
  const closeTime = useCloseTime();
  const archiveTime = useArchiveTime();

  // 날짜만 표시 (시간 제외)
  const formatDate = (dateStr: string) => {
    // 상시모집 날짜인 경우
    if (dateStr === '9999-12-31') {
      return getText('alwaysOpen');
    }
    return new Date(dateStr).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 날짜+시간 표시 (생성일 등에 사용)
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string | null, isFree: boolean) => {
    if (isFree || price === null || price === '0') return getText('free');
    const numPrice = parseFloat(price);
    return language === 'ko' ? `${numPrice.toLocaleString()}원` : `$${numPrice.toLocaleString()}`;
  };

  const handleEdit = () => {
    if (courseTime) {
      setEditData({
        title: courseTime.title,
        description: courseTime.description || '',
        deliveryType: courseTime.deliveryType,
        enrollmentMethod: courseTime.enrollmentMethod,
        location: courseTime.location || '',
        capacity: courseTime.capacity,
        price: courseTime.price ? parseFloat(courseTime.price) : null,
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleSave = async () => {
    try {
      await updateTime.mutateAsync({ id: timeId, request: editData });
      setIsEditing(false);
      toast.success(getText('updateSuccess'));
    } catch (err) {
      console.error('Update failed:', err);
      toast.error(getText('updateError'));
    }
  };

  const handleDelete = async () => {
    if (!confirm(getText('confirmDelete'))) return;
    try {
      await deleteTime.mutateAsync(timeId);
      toast.success(getText('deleteSuccess'));
      navigate(prefixPath('/to/times'));
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(getText('statusChangeError'));
    }
  };

  const getErrorMessage = (err: unknown): string => {
    // Axios 에러 응답에서 에러 코드 추출
    const errorResponse = (err as { response?: { data?: { error?: { code?: string; message?: string } } } })?.response?.data?.error;
    const errorCode = errorResponse?.code;

    if (errorCode && ERROR_MESSAGES[errorCode]) {
      return language === 'ko' ? ERROR_MESSAGES[errorCode].ko : ERROR_MESSAGES[errorCode].en;
    }

    // 백엔드 메시지가 있으면 사용
    if (errorResponse?.message) {
      return errorResponse.message;
    }

    return getText('statusChangeError');
  };

  const handleStatusTransition = async () => {
    if (!courseTime || !confirm(getText('confirmStatusChange'))) return;

    try {
      switch (courseTime.status) {
        case 'DRAFT':
          await openTime.mutateAsync(timeId);
          break;
        case 'RECRUITING':
          await startTime.mutateAsync(timeId);
          break;
        case 'ONGOING':
          await closeTime.mutateAsync(timeId);
          break;
        case 'CLOSED':
          await archiveTime.mutateAsync(timeId);
          break;
      }
    } catch (err) {
      console.error('Status transition failed:', err);
      toast.error(getErrorMessage(err));
    }
  };

  const getStatusActionButton = () => {
    if (!courseTime) return null;
    const nextStatus = COURSE_TIME_STATUS_TRANSITIONS[courseTime.status];
    if (!nextStatus) return null;

    const actionMap: Record<CourseTimeStatus, { label: keyof typeof t; icon: React.ReactNode }> = {
      DRAFT: { label: 'openRecruiting', icon: <Play size={16} /> },
      RECRUITING: { label: 'startLearning', icon: <Clock size={16} /> },
      ONGOING: { label: 'closeCourse', icon: <Square size={16} /> },
      CLOSED: { label: 'archiveCourse', icon: <Archive size={16} /> },
      ARCHIVED: { label: 'archiveCourse', icon: <Archive size={16} /> },
    };

    const action = actionMap[courseTime.status];
    const isLoading = openTime.isPending || startTime.isPending || closeTime.isPending || archiveTime.isPending;

    return (
      <Button onClick={handleStatusTransition} disabled={isLoading} variant="brand">
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : action.icon}
        <span>{getText(action.label)}</span>
      </Button>
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <Loader2 size={32} className="animate-spin text-text-secondary" />
        <span className="ml-2 text-text-secondary">{getText('loading')}</span>
      </div>
    );
  }

  if (error || !courseTime) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <Calendar size={48} className="mx-auto mb-3 text-text-placeholder" />
          <p className="text-text-secondary">{error ? getText('error') : getText('notFound')}</p>
          <BackButton
            onClick={() => navigate(prefixPath('/to/times'))}
            label={getText('back')}
            className="mt-4"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-bg-app">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg-app border-b border-border">
        <div className="p-6 px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BackButton
                onClick={() => navigate(prefixPath('/to/times'))}
                label={getText('back')}
              />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-text-primary mb-0">{courseTime.title}</h1>
                  <Badge variant={statusBadgeVariant[courseTime.status]}>
                    {COURSE_TIME_STATUS_LABELS[courseTime.status]}
                  </Badge>
                </div>
                <p className="text-text-secondary text-sm m-0">ID: {courseTime.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="ghost" onClick={handleCancelEdit}>
                    <X size={20} />
                    <span>{getText('cancel')}</span>
                  </Button>
                  <Button onClick={handleSave} disabled={updateTime.isPending}>
                    {updateTime.isPending ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Save size={20} />
                    )}
                    <span>{getText('save')}</span>
                  </Button>
                </>
              ) : (
                <>
                  {courseTime.status === 'DRAFT' && (
                    <Button variant="ghost" onClick={handleEdit}>
                      <Edit size={20} />
                      <span>{getText('edit')}</span>
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => navigate(prefixPath(`/to/times/${timeId}/clone`))}>
                    <Copy size={20} />
                    <span>{getText('clone')}</span>
                  </Button>
                  {courseTime.status === 'DRAFT' && (
                    <Button variant="ghost" onClick={handleDelete} disabled={deleteTime.isPending}>
                      <Trash2 size={20} className="text-status-error" />
                      <span className="text-status-error">{getText('delete')}</span>
                    </Button>
                  )}
                  {getStatusActionButton()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-bg-app sticky top-[89px] z-10">
        <div className="px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('info')}
              className={cn(
                'px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2',
                activeTab === 'info'
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <FileText size={16} />
              {getText('tabBasicInfo')}
              {activeTab === 'info' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-btn-neutral" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('enrollments')}
              className={cn(
                'px-4 py-3 text-sm font-medium transition-colors relative flex items-center gap-2',
                activeTab === 'enrollments'
                  ? 'text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <GraduationCap size={16} />
              {getText('tabEnrollments')}
              <Badge variant="secondary" className="ml-1">
                {courseTime.currentEnrollment}
              </Badge>
              {activeTab === 'enrollments' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-btn-neutral" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* 기본 정보 탭 */}
        {activeTab === 'info' && (
          <div className="p-6 px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 기본 정보 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <FileText size={18} className="text-text-secondary" />
                {getText('basicInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-text-secondary">{getText('timeTitle')}</Label>
                  {isEditing ? (
                    <Input
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    />
                  ) : (
                    <p className="text-text-primary font-medium">{courseTime.title}</p>
                  )}
                </div>
                <div>
                  <Label className="text-text-secondary">{getText('description')}</Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="text-text-primary whitespace-pre-wrap">
                      {courseTime.description || getText('noDescription')}
                    </p>
                  )}
                </div>
                <div className="pt-2 border-t border-border">
                  <Label className="text-text-secondary">{getText('createdAt')}</Label>
                  <p className="text-text-primary text-sm">{formatDateTime(courseTime.createdAt)}</p>
                </div>
              </div>
            </Card>

            {/* 프로그램 정보 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-text-secondary" />
                {getText('programInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-text-secondary">{getText('programTitle')}</Label>
                  <p className="text-text-primary font-medium">{courseTime.programTitle || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-text-secondary">{getText('courseId')}</Label>
                    <p className="text-text-primary">{courseTime.cmCourseId || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-text-secondary">{getText('courseTitle')}</Label>
                    <p className="text-text-primary">{courseTime.cmCourseTitle || '-'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 진행 정보 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Play size={18} className="text-text-secondary" />
                {getText('deliveryInfo')}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-text-secondary">{getText('deliveryType')}</Label>
                    {isEditing ? (
                      <NativeSelect
                        value={editData.deliveryType || courseTime.deliveryType}
                        onChange={(e) =>
                          setEditData({ ...editData, deliveryType: e.target.value as DeliveryType })
                        }
                        options={Object.entries(DELIVERY_TYPE_LABELS).map(([value, label]) => ({
                          value,
                          label,
                        }))}
                      />
                    ) : (
                      <p className="text-text-primary">
                        {DELIVERY_TYPE_LABELS[courseTime.deliveryType]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-text-secondary">{getText('enrollmentMethod')}</Label>
                    {isEditing ? (
                      <NativeSelect
                        value={editData.enrollmentMethod || courseTime.enrollmentMethod}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            enrollmentMethod: e.target.value as EnrollmentMethod,
                          })
                        }
                        options={Object.entries(ENROLLMENT_METHOD_LABELS).map(([value, label]) => ({
                          value,
                          label,
                        }))}
                      />
                    ) : (
                      <p className="text-text-primary">
                        {ENROLLMENT_METHOD_LABELS[courseTime.enrollmentMethod]}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-text-secondary flex items-center gap-1">
                    <MapPin size={14} />
                    {getText('location')}
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.location || ''}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    />
                  ) : (
                    <p className="text-text-primary">
                      {courseTime.location || getText('noLocation')}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* 기간 정보 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-text-secondary" />
                {getText('periodInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-text-secondary">{getText('enrollmentPeriod')}</Label>
                  <p className="text-text-primary">
                    {formatDate(courseTime.enrollStartDate)} ~ {formatDate(courseTime.enrollEndDate)}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary">{getText('learningPeriod')}</Label>
                  <p className="text-text-primary">
                    {formatDate(courseTime.classStartDate)} ~ {formatDate(courseTime.classEndDate)}
                  </p>
                </div>
                <div className="pt-2 border-t border-border">
                  <Label className="text-text-secondary">{getText('allowLateEnrollment')}</Label>
                  <p className="text-text-primary">
                    <Badge variant={courseTime.allowLateEnrollment ? 'success' : 'secondary'}>
                      {courseTime.allowLateEnrollment ? getText('allowLateEnrollmentYes') : getText('allowLateEnrollmentNo')}
                    </Badge>
                  </p>
                </div>
              </div>
            </Card>

            {/* 정원 및 수강 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Users size={18} className="text-text-secondary" />
                {getText('capacityInfo')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-text-secondary">{getText('capacity')}</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.capacity ?? ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          capacity: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      placeholder="0 = 무제한"
                    />
                  ) : (
                    <p className="text-text-primary text-xl font-semibold">
                      {courseTime.capacity || getText('unlimited')}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-text-secondary">{getText('currentEnrollment')}</Label>
                  <p className="text-text-primary text-xl font-semibold">
                    {courseTime.currentEnrollment}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary">{getText('availableSeats')}</Label>
                  <p className="text-text-primary text-xl font-semibold">
                    {courseTime.availableSeats ?? getText('unlimited')}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary flex items-center gap-1">
                    <DollarSign size={14} />
                    {getText('price')}
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editData.price ?? ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          price: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      placeholder="0 = 무료"
                    />
                  ) : (
                    <p className="text-text-primary text-xl font-semibold">
                      {formatPrice(courseTime.price, courseTime.isFree)}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* 강사 정보 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <User size={18} className="text-text-secondary" />
                  {getText('instructors')}
                </h2>
                {courseTime.status === 'DRAFT' && (
                  <Button variant="ghost" size="sm">
                    <UserPlus size={16} />
                    <span>{getText('addInstructor')}</span>
                  </Button>
                )}
              </div>
              {courseTime.instructors && courseTime.instructors.length > 0 ? (
                <div className="space-y-3">
                  {courseTime.instructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg"
                    >
                      <div>
                        <p className="text-text-primary font-medium">{instructor.userName}</p>
                        <p className="text-text-secondary text-sm">{instructor.userEmail}</p>
                      </div>
                      <Badge variant={instructor.role === 'MAIN' ? 'default' : 'secondary'}>
                        {getText(instructor.role)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary text-center py-4">{getText('noInstructors')}</p>
              )}
            </Card>
            </div>
          </div>
        )}

        {/* 수강생 탭 */}
        {activeTab === 'enrollments' && (
          <div className="p-6 px-8">
            <EnrollmentTab
              courseTimeId={timeId}
              courseTimeTitle={courseTime.title}
              language={language}
            />
          </div>
        )}
      </div>
    </div>
  );
}
