/**
 * 차수 복제 다이얼로그
 * Pre-fill & Override 패턴 적용
 * - 기본 정보: 차수명, 설명
 * - 기간 설정: 모집/학습 기간
 * - 운영 설정: 정원, 가격, 장소
 * - 정기 일정: 복사 여부 토글 + 미리보기
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import {
  Copy,
  Loader2,
  Calendar,
  FileText,
  Settings,
  Users,
  MapPin,
  DollarSign,
  CalendarClock,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Input,
  Label,
  Textarea,
  Badge,
  Checkbox,
  DatePicker,
} from '@/components/common';
import { useCloneTime } from '@/hooks/co/useTimeQueries';
import { useSubdomainPath } from '@/hooks/common';
import type {
  CourseTimeDetailResponse,
  CloneCourseTimeRequest,
  DurationType,
  RecurringSchedule,
} from '@/types/co/time.types';
import { DURATION_TYPE_LABELS } from '@/types/co/time.types';

// 날짜 문자열 -> Date 객체 변환
const parseDate = (dateStr: string | null | undefined): Date | undefined => {
  if (!dateStr) return undefined;
  try {
    return parseISO(dateStr);
  } catch {
    return undefined;
  }
};

// Date 객체 -> 날짜 문자열 변환 (YYYY-MM-DD)
const formatDate = (date: Date | undefined): string => {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
};

interface CloneCourseTimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTime: CourseTimeDetailResponse | null;
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '차수 복제', en: 'Clone Course Time' },
  description: {
    ko: '기존 차수를 복제하여 새로운 차수를 생성합니다.',
    en: 'Create a new course time by cloning an existing one.',
  },
  originalInfo: { ko: '원본 차수', en: 'Original' },
  basicInfo: { ko: '기본 정보', en: 'Basic Info' },
  periodSettings: { ko: '기간 설정', en: 'Period' },
  operationSettings: { ko: '운영 설정', en: 'Operations' },
  scheduleSettings: { ko: '정기 수업 일정', en: 'Schedule' },
  timeTitle: { ko: '차수명', en: 'Title' },
  timeTitlePlaceholder: { ko: '새 차수명을 입력하세요', en: 'Enter new title' },
  timeDescription: { ko: '설명', en: 'Description' },
  timeDescriptionPlaceholder: { ko: '차수 설명을 입력하세요', en: 'Enter description' },
  enrollmentPeriod: { ko: '모집 기간', en: 'Enrollment' },
  learningPeriod: { ko: '학습 기간', en: 'Learning' },
  durationDaysUnit: { ko: '일', en: 'days' },
  noEndDate: { ko: '종료일 없음', en: 'No end date' },
  capacity: { ko: '정원', en: 'Capacity' },
  capacityPlaceholder: { ko: '무제한', en: 'Unlimited' },
  capacityUnit: { ko: '명', en: '' },
  price: { ko: '가격', en: 'Price' },
  pricePlaceholder: { ko: '0', en: '0' },
  isFree: { ko: '무료', en: 'Free' },
  location: { ko: '장소', en: 'Location' },
  locationPlaceholder: { ko: '예: 본사 3층 대회의실', en: 'e.g. Room 301' },
  copySchedule: { ko: '기존 일정 사용', en: 'Copy schedule' },
  noSchedule: { ko: '일정 없이 생성', en: 'Create without schedule' },
  noScheduleSet: { ko: '설정된 정기 일정 없음', en: 'No schedule set' },
  cancel: { ko: '취소', en: 'Cancel' },
  clone: { ko: '복제하기', en: 'Clone' },
  cloning: { ko: '복제 중...', en: 'Cloning...' },
  cloneSuccess: { ko: '차수가 복제되었습니다.', en: 'Course time cloned.' },
  cloneError: { ko: '복제에 실패했습니다.', en: 'Clone failed.' },
  validationError: { ko: '필수 항목을 입력해주세요.', en: 'Fill required fields.' },
  dateValidationError: { ko: '종료일은 시작일 이후여야 합니다.', en: 'End must be after start.' },
  keepOriginal: { ko: '원본 유지', en: 'Keep original' },
};

const DAY_NAMES_KO = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function formatSchedulePreview(schedule: RecurringSchedule | null, lang: 'ko' | 'en'): string {
  if (!schedule) return '';
  const dayNames = lang === 'ko' ? DAY_NAMES_KO : DAY_NAMES_EN;
  const days = schedule.daysOfWeek.map((d) => dayNames[d]).join(', ');
  return `${lang === 'ko' ? '매주' : 'Every'} ${days} ${schedule.startTime} ~ ${schedule.endTime}`;
}

export function CloneCourseTimeDialog({
  open,
  onOpenChange,
  courseTime,
  language = 'ko',
}: Readonly<CloneCourseTimeDialogProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const cloneTime = useCloneTime();

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // 폼 상태
  const [formData, setFormData] = useState<CloneCourseTimeRequest>({
    title: '',
    description: '',
    enrollStartDate: '',
    enrollEndDate: '',
    classStartDate: '',
    classEndDate: null,
    capacity: null,
    price: null,
    isFree: false,
    locationInfo: null,
    copyRecurringSchedule: true,
  });

  // durationType 확인
  const durationType = courseTime?.durationType as DurationType | undefined;
  const isFixed = durationType === 'FIXED';
  const isRelative = durationType === 'RELATIVE';
  const isUnlimited = durationType === 'UNLIMITED';

  // 다이얼로그 열릴 때 초기값 설정 (Pre-fill)
  useEffect(() => {
    if (open && courseTime) {
      const today = getToday();
      const nextWeek = addDays(today, 7);
      const nextMonth = addDays(today, 30);

      const originalEnrollDays =
        courseTime.enrollEndDate && courseTime.enrollStartDate
          ? Math.ceil(
              (new Date(courseTime.enrollEndDate).getTime() -
                new Date(courseTime.enrollStartDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 14;

      const originalClassDays =
        courseTime.classEndDate && courseTime.classStartDate
          ? Math.ceil(
              (new Date(courseTime.classEndDate).getTime() -
                new Date(courseTime.classStartDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 30;

      let classEndDate: string | null = null;
      if (isFixed) {
        classEndDate = addDays(nextMonth, originalClassDays);
      }

      setFormData({
        title: `${courseTime.title} (복사본)`,
        description: courseTime.description || '',
        enrollStartDate: nextWeek,
        enrollEndDate: addDays(nextWeek, originalEnrollDays),
        classStartDate: nextMonth,
        classEndDate,
        // 운영 설정 Pre-fill
        capacity: courseTime.capacity,
        price: courseTime.price,
        isFree: courseTime.isFree,
        locationInfo: courseTime.locationInfo,
        // 정기 일정
        copyRecurringSchedule: !!courseTime.recurringSchedule,
      });
    }
  }, [open, courseTime, isFixed]);

  const handleChange = <K extends keyof CloneCourseTimeRequest>(
    field: K,
    value: CloneCourseTimeRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.title.trim() ||
      !formData.enrollStartDate ||
      !formData.enrollEndDate ||
      !formData.classStartDate
    ) {
      toast.error(getText('validationError'));
      return false;
    }

    if (isFixed && !formData.classEndDate) {
      toast.error(getText('validationError'));
      return false;
    }

    if (new Date(formData.enrollEndDate) < new Date(formData.enrollStartDate)) {
      toast.error(getText('dateValidationError'));
      return false;
    }
    if (
      isFixed &&
      formData.classEndDate &&
      new Date(formData.classEndDate) < new Date(formData.classStartDate)
    ) {
      toast.error(getText('dateValidationError'));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!courseTime || !validateForm()) return;

    try {
      const result = await cloneTime.mutateAsync({
        id: courseTime.id,
        request: formData,
      });
      toast.success(getText('cloneSuccess'));
      onOpenChange(false);
      navigate(prefixPath(`/co/times/${result.id}`));
    } catch (error) {
      console.error('Clone failed:', error);
      toast.error(getText('cloneError'));
    }
  };

  if (!courseTime) return null;

  const hasSchedule = !!courseTime.recurringSchedule;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy size={20} className="text-action-primary" />
            {getText('title')}
          </DialogTitle>
          <DialogDescription>{getText('description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* 원본 정보 */}
          <div className="bg-bg-secondary rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{getText('originalInfo')}</span>
              {durationType && (
                <Badge variant="secondary" className="text-xs">
                  {DURATION_TYPE_LABELS[durationType]}
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium text-text-primary mt-1">{courseTime.title}</p>
            <p className="text-xs text-text-secondary">{courseTime.courseTitle}</p>
          </div>

          {/* 기본 정보 */}
          <section className="space-y-3">
            <h4 className="text-sm font-medium text-text-primary flex items-center gap-2">
              <FileText size={14} className="text-text-secondary" />
              {getText('basicInfo')}
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="title" className="text-xs">
                  {getText('timeTitle')} *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder={getText('timeTitlePlaceholder')}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-xs">
                  {getText('timeDescription')}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder={getText('timeDescriptionPlaceholder')}
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </section>

          {/* 기간 설정 */}
          <section className="space-y-3">
            <h4 className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Calendar size={14} className="text-text-secondary" />
              {getText('periodSettings')}
            </h4>

            {/* 모집 기간 */}
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary">{getText('enrollmentPeriod')}</Label>
              <div className="grid grid-cols-2 gap-2">
                <DatePicker
                  date={parseDate(formData.enrollStartDate)}
                  onDateChange={(date) => handleChange('enrollStartDate', formatDate(date))}
                  placeholder={language === 'ko' ? '시작일 선택' : 'Select start'}
                />
                <DatePicker
                  date={parseDate(formData.enrollEndDate)}
                  onDateChange={(date) => handleChange('enrollEndDate', formatDate(date))}
                  placeholder={language === 'ko' ? '종료일 선택' : 'Select end'}
                />
              </div>
            </div>

            {/* 학습 기간 */}
            <div className="space-y-1.5">
              <Label className="text-xs text-text-secondary flex items-center gap-2">
                {getText('learningPeriod')}
                {durationType && (
                  <Badge variant="outline" className="text-[10px]">
                    {DURATION_TYPE_LABELS[durationType]}
                  </Badge>
                )}
              </Label>

              {isFixed && (
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    date={parseDate(formData.classStartDate)}
                    onDateChange={(date) => handleChange('classStartDate', formatDate(date))}
                    placeholder={language === 'ko' ? '시작일 선택' : 'Select start'}
                  />
                  <DatePicker
                    date={parseDate(formData.classEndDate)}
                    onDateChange={(date) => handleChange('classEndDate', formatDate(date))}
                    placeholder={language === 'ko' ? '종료일 선택' : 'Select end'}
                  />
                </div>
              )}

              {isRelative && (
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    date={parseDate(formData.classStartDate)}
                    onDateChange={(date) => handleChange('classStartDate', formatDate(date))}
                    placeholder={language === 'ko' ? '시작일 선택' : 'Select start'}
                  />
                  <div className="bg-bg-secondary rounded-md px-3 py-2 flex items-center">
                    <span className="text-sm text-text-primary">
                      {courseTime.durationDays}
                      {getText('durationDaysUnit')}
                    </span>
                    <span className="text-xs text-text-placeholder ml-1">
                      ({getText('keepOriginal')})
                    </span>
                  </div>
                </div>
              )}

              {isUnlimited && (
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    date={parseDate(formData.classStartDate)}
                    onDateChange={(date) => handleChange('classStartDate', formatDate(date))}
                    placeholder={language === 'ko' ? '시작일 선택' : 'Select start'}
                  />
                  <div className="bg-bg-secondary rounded-md px-3 py-2 flex items-center">
                    <span className="text-sm text-text-placeholder">{getText('noEndDate')}</span>
                  </div>
                </div>
              )}

              {!durationType && (
                <div className="grid grid-cols-2 gap-2">
                  <DatePicker
                    date={parseDate(formData.classStartDate)}
                    onDateChange={(date) => handleChange('classStartDate', formatDate(date))}
                    placeholder={language === 'ko' ? '시작일 선택' : 'Select start'}
                  />
                  <DatePicker
                    date={parseDate(formData.classEndDate)}
                    onDateChange={(date) => handleChange('classEndDate', formatDate(date) || null)}
                    placeholder={language === 'ko' ? '종료일 선택' : 'Select end'}
                  />
                </div>
              )}
            </div>
          </section>

          {/* 운영 설정 */}
          <section className="space-y-3">
            <h4 className="text-sm font-medium text-text-primary flex items-center gap-2">
              <Settings size={14} className="text-text-secondary" />
              {getText('operationSettings')}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {/* 정원 */}
              <div>
                <Label className="text-xs flex items-center gap-1.5">
                  <Users size={12} className="text-text-placeholder" />
                  {getText('capacity')}
                </Label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    min={0}
                    value={formData.capacity ?? ''}
                    onChange={(e) =>
                      handleChange('capacity', e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder={getText('capacityPlaceholder')}
                  />
                  {formData.capacity && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                      {getText('capacityUnit')}
                    </span>
                  )}
                </div>
              </div>

              {/* 가격 */}
              <div>
                <Label className="text-xs flex items-center gap-1.5">
                  <DollarSign size={12} className="text-text-placeholder" />
                  {getText('price')}
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min={0}
                    value={formData.isFree ? '' : formData.price ?? ''}
                    onChange={(e) => handleChange('price', e.target.value || null)}
                    placeholder={getText('pricePlaceholder')}
                    disabled={formData.isFree}
                    className="flex-1"
                  />
                  <label className="flex items-center gap-1.5 text-xs whitespace-nowrap cursor-pointer">
                    <Checkbox
                      checked={formData.isFree}
                      onCheckedChange={(checked) => {
                        handleChange('isFree', !!checked);
                        if (checked) handleChange('price', '0');
                      }}
                    />
                    {getText('isFree')}
                  </label>
                </div>
              </div>
            </div>

            {/* 장소 */}
            <div>
              <Label className="text-xs flex items-center gap-1.5">
                <MapPin size={12} className="text-text-placeholder" />
                {getText('location')}
              </Label>
              <Input
                value={formData.locationInfo ?? ''}
                onChange={(e) => handleChange('locationInfo', e.target.value || null)}
                placeholder={getText('locationPlaceholder')}
                className="mt-1"
              />
            </div>
          </section>

          {/* 정기 수업 일정 */}
          <section className="space-y-3">
            <h4 className="text-sm font-medium text-text-primary flex items-center gap-2">
              <CalendarClock size={14} className="text-text-secondary" />
              {getText('scheduleSettings')}
            </h4>

            {hasSchedule ? (
              <div className="bg-bg-secondary rounded-lg p-3 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.copyRecurringSchedule}
                    onCheckedChange={(checked) => handleChange('copyRecurringSchedule', !!checked)}
                  />
                  <span className="text-sm">{getText('copySchedule')}</span>
                </label>
                {formData.copyRecurringSchedule && (
                  <div className="text-xs text-text-secondary pl-6">
                    📅 {formatSchedulePreview(courseTime.recurringSchedule, language)}
                  </div>
                )}
                {!formData.copyRecurringSchedule && (
                  <p className="text-xs text-text-placeholder pl-6">{getText('noSchedule')}</p>
                )}
              </div>
            ) : (
              <div className="bg-bg-secondary rounded-lg p-3">
                <p className="text-xs text-text-placeholder">{getText('noScheduleSet')}</p>
              </div>
            )}
          </section>

        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {getText('cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={cloneTime.isPending}>
            {cloneTime.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {getText('cloning')}
              </>
            ) : (
              <>
                <Copy size={16} />
                {getText('clone')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
