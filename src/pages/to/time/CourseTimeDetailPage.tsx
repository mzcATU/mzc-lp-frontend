import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
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
} from 'lucide-react';
import { Button, Badge, Input, Label, NativeSelect, Card } from '@/components/common';
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
  noDescription: { ko: '설명 없음', en: 'No description' },
  noLocation: { ko: '장소 미지정', en: 'No location' },
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
  const timeId = parseInt(id || '0');

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateCourseTimeRequest>({});

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // React Query Hooks
  const { data: courseTime, isLoading, error } = useTime(timeId);
  const updateTime = useUpdateTime();
  const deleteTime = useDeleteTime();
  const openTime = useOpenTime();
  const startTime = useStartTime();
  const closeTime = useCloseTime();
  const archiveTime = useArchiveTime();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return getText('free');
    return language === 'ko' ? `${price.toLocaleString()}원` : `$${price.toLocaleString()}`;
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
        price: courseTime.price,
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
      alert(getText('updateSuccess'));
    } catch (err) {
      console.error('Update failed:', err);
      alert(getText('updateError'));
    }
  };

  const handleDelete = async () => {
    if (!confirm(getText('confirmDelete'))) return;
    try {
      await deleteTime.mutateAsync(timeId);
      alert(getText('deleteSuccess'));
      navigate('/to/times');
    } catch (err) {
      console.error('Delete failed:', err);
    }
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
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/to/times')}>
            {getText('back')}
          </Button>
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/to/times')}>
                <ArrowLeft size={20} />
                <span>{getText('back')}</span>
              </Button>
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
                  <Button variant="ghost" onClick={() => navigate(`/to/times/${timeId}/clone`)}>
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

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 기본 정보 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
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
                    <Input
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                  ) : (
                    <p className="text-text-primary">
                      {courseTime.description || getText('noDescription')}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* 프로그램 정보 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {getText('programInfo')}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-text-secondary">{getText('programId')}</Label>
                    <p className="text-text-primary">{courseTime.programId}</p>
                  </div>
                  <div>
                    <Label className="text-text-secondary">{getText('programTitle')}</Label>
                    <p className="text-text-primary">{courseTime.programTitle || '-'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-text-secondary">{getText('courseId')}</Label>
                    <p className="text-text-primary">{courseTime.cmCourseId}</p>
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
              <h2 className="text-lg font-semibold text-text-primary mb-4">
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
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {getText('periodInfo')}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-text-secondary flex items-center gap-1">
                    <Calendar size={14} />
                    {getText('enrollmentPeriod')}
                  </Label>
                  <p className="text-text-primary">
                    {formatDate(courseTime.enrollmentStartDate)} ~{' '}
                    {formatDate(courseTime.enrollmentEndDate)}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary flex items-center gap-1">
                    <Clock size={14} />
                    {getText('learningPeriod')}
                  </Label>
                  <p className="text-text-primary">
                    {formatDate(courseTime.startDate)} ~ {formatDate(courseTime.endDate)}
                  </p>
                </div>
              </div>
            </Card>

            {/* 정원 및 수강 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {getText('capacityInfo')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-text-secondary flex items-center gap-1">
                    <Users size={14} />
                    {getText('capacity')}
                  </Label>
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
                  <Label className="text-text-secondary">{getText('price')}</Label>
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
                      {formatPrice(courseTime.price)}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* 강사 정보 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">
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
      </div>
    </div>
  );
}
