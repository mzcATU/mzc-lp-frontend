import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save, Loader2, Calendar, Clock, BookOpen, Info, UserPlus, X, Users } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@/components/common';
import { useCreateTime } from '@/hooks/co/useTimeQueries';
import { useApprovedPrograms } from '@/hooks/co/useProgramQueries';
import { useUsers } from '@/hooks/co/useUserQueries';
import { instructorAssignmentService } from '@/services/co/instructorAssignmentService';
import type {
  CreateCourseTimeRequest,
  DeliveryType,
  EnrollmentMethod,
} from '@/types/co/time.types';
import { DELIVERY_TYPE_LABELS, ENROLLMENT_METHOD_LABELS } from '@/types/co/time.types';
import { PROGRAM_LEVEL_LABELS, PROGRAM_TYPE_LABELS } from '@/types/common/program.types';
import type { ProgramResponse } from '@/types/common/program.types';
import type { InstructorRole } from '@/types/tu/instructorAssignment.types';
import { INSTRUCTOR_ROLE_LABELS } from '@/types/tu/instructorAssignment.types';

interface CourseTimeCreatePageProps {
  language?: 'ko' | 'en';
}

const t = {
  title: { ko: '차수 생성', en: 'Create Course Time' },
  close: { ko: '닫기', en: 'Close' },
  previous: { ko: '이전', en: 'Previous' },
  next: { ko: '다음', en: 'Next' },
  submit: { ko: '저장', en: 'Save' },
  saving: { ko: '저장 중...', en: 'Saving...' },
  // Steps
  step1: { ko: '기본 정보', en: 'Basic Info' },
  step2: { ko: '일정 및 모집', en: 'Schedule' },
  step3: { ko: '운영 설정', en: 'Settings' },
  // Step 1 - Basic Info
  selectProgram: { ko: '교육 과정 선택', en: 'Select Course' },
  selectProgramPlaceholder: { ko: '교육 과정을 선택하세요', en: 'Select a course' },
  loadingPrograms: { ko: '교육 과정 불러오는 중...', en: 'Loading courses...' },
  noApprovedPrograms: { ko: '승인된 교육 과정이 없습니다', en: 'No approved courses available' },
  selectedProgramInfo: { ko: '선택된 교육 과정 정보', en: 'Selected Course Info' },
  programLevel: { ko: '레벨', en: 'Level' },
  programType: { ko: '타입', en: 'Type' },
  estimatedHours: { ko: '예상 학습 시간', en: 'Estimated Hours' },
  hours: { ko: '시간', en: 'hours' },
  owner: { ko: '담당 강사', en: 'Owner' },
  noOwner: { ko: '미배정', en: 'Not assigned' },
  noThumbnail: { ko: '썸네일 없음', en: 'No thumbnail' },
  recommendedPeriod: { ko: '권장 운영기간', en: 'Recommended Period' },
  noRecommendedPeriod: { ko: '설정 안됨', en: 'Not set' },
  timeTitle: { ko: '차수명', en: 'Title' },
  timeTitlePlaceholder: { ko: '예: 2025년 1차', en: 'e.g., 2025 Session 1' },
  description: { ko: '설명', en: 'Description' },
  descriptionPlaceholder: { ko: '차수에 대한 설명을 입력하세요 (선택사항)', en: 'Enter course time description (optional)' },
  deliveryType: { ko: '진행 방식', en: 'Delivery Type' },
  enrollmentMethod: { ko: '수강 신청 방식', en: 'Enrollment Method' },
  location: { ko: '장소', en: 'Location' },
  locationPlaceholder: { ko: '오프라인/블렌디드 진행 시 장소 입력', en: 'Enter location for offline/blended' },
  // Step 2 - Period
  enrollmentPeriod: { ko: '모집 기간', en: 'Enrollment Period' },
  enrollStartDate: { ko: '모집 시작일', en: 'Enrollment Start' },
  enrollEndDate: { ko: '모집 종료일', en: 'Enrollment End' },
  learningPeriod: { ko: '학습 기간', en: 'Learning Period' },
  classStartDate: { ko: '학습 시작일', en: 'Start Date' },
  classEndDate: { ko: '학습 종료일', en: 'End Date' },
  alwaysOpen: { ko: '상시모집', en: 'Always Open' },
  alwaysOpenHint: { ko: '종료일 없이 언제든 수강 가능', en: 'No end date, always available' },
  // Step 3 - Capacity & Price
  capacity: { ko: '정원', en: 'Capacity' },
  capacityPlaceholder: { ko: '비워두면 무제한', en: 'Leave empty for unlimited' },
  capacityHint: { ko: '최대 수강 인원을 설정합니다.', en: 'Set maximum enrollment.' },
  price: { ko: '가격 (원)', en: 'Price (KRW)' },
  pricePlaceholder: { ko: '0', en: '0' },
  priceHint: { ko: '수강료를 설정합니다. 0이면 무료입니다.', en: 'Set course fee. 0 means free.' },
  minProgress: { ko: '수료 기준 (%)', en: 'Completion Criteria (%)' },
  minProgressPlaceholder: { ko: '80', en: '80' },
  minProgressHint: { ko: '수료를 위한 최소 진도율입니다.', en: 'Minimum progress for completion.' },
  allowLateEnrollment: { ko: '중간 합류 허용', en: 'Allow Late Enrollment' },
  allowLateEnrollmentHint: { ko: '학습 시작 후에도 수강 신청 허용', en: 'Allow enrollment after course starts' },
  // Validation
  required: { ko: '필수 항목입니다.', en: 'This field is required.' },
  enrollEndBeforeStart: { ko: '모집 종료일은 시작일 이후여야 합니다.', en: 'Enrollment end date must be after start date.' },
  classEndBeforeStart: { ko: '학습 종료일은 시작일 이후여야 합니다.', en: 'Class end date must be after start date.' },
  classStartBeforeEnrollEnd: { ko: '학습 시작일은 모집 종료일 이후여야 합니다.', en: 'Class start date must be after enrollment end date.' },
  createSuccess: { ko: '차수가 생성되었습니다.', en: 'Course time created successfully.' },
  createError: { ko: '차수 생성에 실패했습니다.', en: 'Failed to create course time.' },
  // Step 4 - Instructor Assignment
  step4: { ko: '강사 배정', en: 'Instructor' },
  instructorAssignment: { ko: '강사 배정', en: 'Instructor Assignment' },
  instructorAssignmentHint: { ko: '차수에 배정할 강사를 선택하세요.', en: 'Select instructors to assign to this course time.' },
  selectInstructor: { ko: '강사 선택', en: 'Select Instructor' },
  selectInstructorPlaceholder: { ko: '강사를 검색하세요', en: 'Search for instructor' },
  instructorRole: { ko: '역할', en: 'Role' },
  addInstructor: { ko: '강사 추가', en: 'Add Instructor' },
  assignedInstructors: { ko: '배정된 강사', en: 'Assigned Instructors' },
  noInstructorsAssigned: { ko: '배정된 강사가 없습니다.', en: 'No instructors assigned.' },
  mainInstructor: { ko: '주강사', en: 'Main Instructor' },
  subInstructor: { ko: '보조강사', en: 'Sub Instructor' },
  assistant: { ko: '조교', en: 'Assistant' },
  useOwnerAsInstructor: { ko: '프로그램 담당자를 주강사로 배정', en: 'Assign program owner as main instructor' },
  instructorAssignmentOptional: { ko: '(선택사항)', en: '(Optional)' },
  // Error messages
  errorInstructorConflict: { ko: '강사 일정 충돌', en: 'Instructor Schedule Conflict' },
  errorConflictingTimes: { ko: '충돌하는 차수', en: 'Conflicting course times' },
  errorEnrollEndBeforeClassStart: { ko: '모집 종료일은 학습 시작일 이전이어야 합니다.', en: 'Enrollment end date must be before class start date.' },
  errorValidation: { ko: '입력값을 확인해주세요.', en: 'Please check your input.' },
  errorInstructorAssignment: { ko: '강사 배정에 실패했습니다.', en: 'Failed to assign instructor.' },
};

// 강사 배정 정보 타입
interface InstructorAssignment {
  userId: number;
  userName: string;
  userEmail: string;
  role: InstructorRole;
}

export function CourseTimeCreatePage({ language = 'ko' }: Readonly<CourseTimeCreatePageProps>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const createTime = useCreateTime();
  const { data: approvedProgramsData, isLoading: isLoadingPrograms } = useApprovedPrograms();
  const { data: usersData, isLoading: isLoadingUsers } = useUsers({ role: 'DESIGNER', size: 100 });
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // 승인된 프로그램 목록
  const approvedPrograms = useMemo(() => {
    return approvedProgramsData?.content ?? [];
  }, [approvedProgramsData]);

  // DESIGNER 역할 사용자 목록 (강사 후보)
  const availableInstructors = useMemo(() => {
    return usersData?.content ?? [];
  }, [usersData]);

  // 선택된 프로그램 정보
  const [selectedProgram, setSelectedProgram] = useState<ProgramResponse | null>(null);

  // 상시모집 상태
  const [isAlwaysOpen, setIsAlwaysOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateCourseTimeRequest>({
    programId: 0,
    title: '',
    description: '',
    deliveryType: 'ONLINE',
    enrollmentMethod: 'FIRST_COME',
    enrollStartDate: '',
    enrollEndDate: '',
    classStartDate: '',
    classEndDate: '',
    capacity: null,
    price: '0',
    isFree: true,
    minProgressForCompletion: 80,
    locationInfo: '',
    allowLateEnrollment: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateCourseTimeRequest, string>>>({});

  // 강사 일정 충돌 정보
  const [conflictInfo, setConflictInfo] = useState<{
    conflicts: Array<{ conflictingTimeTitle: string; classStartDate: string; classEndDate: string }>;
  } | null>(null);

  // 강사 배정 상태
  const [assignedInstructors, setAssignedInstructors] = useState<InstructorAssignment[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('');
  const [selectedInstructorRole, setSelectedInstructorRole] = useState<InstructorRole>('MAIN');
  const [useOwnerAsInstructor, setUseOwnerAsInstructor] = useState(true);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof CreateCourseTimeRequest, string>> = {};

    if (step === 1) {
      if (!formData.programId) newErrors.programId = getText('required');
      if (!formData.title.trim()) newErrors.title = getText('required');
    } else if (step === 2) {
      if (!formData.enrollStartDate) newErrors.enrollStartDate = getText('required');
      if (!isAlwaysOpen && !formData.enrollEndDate) newErrors.enrollEndDate = getText('required');
      if (!formData.classStartDate) newErrors.classStartDate = getText('required');
      if (!isAlwaysOpen && !formData.classEndDate) newErrors.classEndDate = getText('required');

      // 날짜 유효성 검사 (상시모집이 아닌 경우에만)
      if (!isAlwaysOpen && formData.enrollStartDate && formData.enrollEndDate) {
        if (new Date(formData.enrollEndDate) < new Date(formData.enrollStartDate)) {
          newErrors.enrollEndDate = getText('enrollEndBeforeStart');
        }
      }
      if (!isAlwaysOpen && formData.classStartDate && formData.classEndDate) {
        if (new Date(formData.classEndDate) < new Date(formData.classStartDate)) {
          newErrors.classEndDate = getText('classEndBeforeStart');
        }
      }
      // 학습 시작일이 모집 종료일 이후인지 검사
      if (formData.enrollEndDate && formData.classStartDate && !isAlwaysOpen) {
        if (new Date(formData.classStartDate) < new Date(formData.enrollEndDate)) {
          newErrors.classStartDate = getText('classStartBeforeEnrollEnd');
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 상시모집 토글 핸들러
  const handleAlwaysOpenToggle = (checked: boolean) => {
    setIsAlwaysOpen(checked);
    if (checked) {
      // 상시모집 선택 시 종료일을 9999-12-31로 설정
      setFormData((prev) => ({
        ...prev,
        enrollEndDate: '9999-12-31',
        classEndDate: '9999-12-31',
      }));
    } else {
      // 상시모집 해제 시 종료일 초기화
      setFormData((prev) => ({
        ...prev,
        enrollEndDate: '',
        classEndDate: '',
      }));
    }
  };

  // 프로그램 선택 핸들러
  const handleProgramSelect = (programIdStr: string) => {
    const programId = parseInt(programIdStr);
    if (!programId) {
      setSelectedProgram(null);
      setFormData((prev) => ({ ...prev, programId: 0 }));
      return;
    }

    const program = approvedPrograms.find((p) => p.id === programId);
    if (program) {
      setSelectedProgram(program);
      setFormData((prev) => ({
        ...prev,
        programId: program.id,
        // 차수명이 비어있으면 교육 과정명으로 자동 설정
        title: prev.title || program.title,
      }));
      // 에러 클리어
      if (errors.programId) {
        setErrors((prev) => ({ ...prev, programId: undefined }));
      }
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      const priceNum = parseFloat(formData.price) || 0;

      // 상시모집일 때 모집 종료일을 학습 시작일 하루 전으로 계산
      let enrollEndDate = formData.enrollEndDate;
      if (isAlwaysOpen && formData.classStartDate) {
        const classStart = new Date(formData.classStartDate);
        classStart.setDate(classStart.getDate() - 1);
        enrollEndDate = classStart.toISOString().split('T')[0];
      }

      const request: CreateCourseTimeRequest = {
        ...formData,
        enrollEndDate,
        capacity: formData.capacity === 0 ? null : formData.capacity,
        price: priceNum.toString(),
        isFree: priceNum === 0,
        locationInfo: formData.locationInfo?.trim() || undefined,
        description: formData.description?.trim() || undefined,
      };

      console.log('[CourseTimeCreatePage] request:', request);
      const createdTime = await createTime.mutateAsync(request);

      // 강사 배정 처리
      if (assignedInstructors.length > 0 && createdTime?.id) {
        const assignmentPromises = assignedInstructors.map((instructor) =>
          instructorAssignmentService.assignInstructor(createdTime.id, {
            userId: instructor.userId,
            role: instructor.role,
          })
        );

        try {
          await Promise.all(assignmentPromises);
        } catch (assignErr) {
          console.error('Instructor assignment failed:', assignErr);
          // 차수는 생성됐지만 강사 배정 실패
          toast.warning(
            language === 'ko'
              ? '차수가 생성되었으나 일부 강사 배정에 실패했습니다.'
              : 'Course time created but some instructor assignments failed.'
          );
          navigate(prefixPath('/co/times'));
          return;
        }
      }

      toast.success(getText('createSuccess'));
      navigate(prefixPath('/co/times'));
    } catch (err: unknown) {
      console.error('Create failed:', err);

      // 에러 응답 파싱
      const axiosErr = err as { response?: { data?: { error?: { code?: string; message?: string }; data?: Array<{ conflictingTimeTitle?: string; classStartDate?: string; classEndDate?: string }> } } };
      const errorData = axiosErr?.response?.data;
      const errorCode = errorData?.error?.code;

      if (errorCode === 'IIS006' && errorData?.data) {
        // 강사 일정 충돌 에러 - Step 2로 이동하여 페이지에 표시
        const conflicts = errorData.data.map((c) => ({
          conflictingTimeTitle: c.conflictingTimeTitle || '',
          classStartDate: c.classStartDate || '',
          classEndDate: c.classEndDate || '',
        }));
        setConflictInfo({ conflicts });
        setCurrentStep(2); // Step 2로 자동 이동
        toast.error(getText('errorInstructorConflict'));
      } else if (errorCode === 'TS004') {
        // 모집 종료일 validation 에러
        toast.error(getText('errorEnrollEndBeforeClassStart'));
      } else if (errorCode === 'C001') {
        // 일반 validation 에러
        toast.error(errorData?.error?.message || getText('errorValidation'));
      } else {
        // 기타 에러
        toast.error(errorData?.error?.message || getText('createError'));
      }
    }
  };

  const handleInputChange = (
    field: keyof CreateCourseTimeRequest,
    value: string | number | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // 날짜 변경 시 충돌 정보 클리어
    if (['classStartDate', 'classEndDate'].includes(field) && conflictInfo) {
      setConflictInfo(null);
    }
  };

  // 강사 추가 핸들러
  const handleAddInstructor = () => {
    if (!selectedInstructorId) return;

    const instructor = availableInstructors.find((u) => u.id === parseInt(selectedInstructorId));
    if (!instructor) return;

    // 이미 추가된 강사인지 확인
    if (assignedInstructors.some((i) => i.userId === instructor.id)) {
      toast.error(language === 'ko' ? '이미 추가된 강사입니다.' : 'Instructor already added.');
      return;
    }

    // MAIN 역할은 1명만 가능
    if (selectedInstructorRole === 'MAIN' && assignedInstructors.some((i) => i.role === 'MAIN')) {
      toast.error(language === 'ko' ? '주강사는 1명만 배정할 수 있습니다.' : 'Only one main instructor allowed.');
      return;
    }

    setAssignedInstructors((prev) => [
      ...prev,
      {
        userId: instructor.id,
        userName: instructor.name,
        userEmail: instructor.email,
        role: selectedInstructorRole,
      },
    ]);
    setSelectedInstructorId('');
    // MAIN이 추가되면 다음 추가는 SUB로 기본 설정
    if (selectedInstructorRole === 'MAIN') {
      setSelectedInstructorRole('SUB');
    }
  };

  // 강사 제거 핸들러
  const handleRemoveInstructor = (userId: number) => {
    setAssignedInstructors((prev) => prev.filter((i) => i.userId !== userId));
  };

  // Owner를 주강사로 자동 추가
  const handleUseOwnerToggle = (checked: boolean) => {
    setUseOwnerAsInstructor(checked);
    if (checked && selectedProgram?.ownerId) {
      // Owner가 이미 목록에 있는지 확인
      const ownerExists = assignedInstructors.some((i) => i.userId === selectedProgram.ownerId);
      if (!ownerExists) {
        // MAIN이 이미 있으면 제거
        const withoutMain = assignedInstructors.filter((i) => i.role !== 'MAIN');
        setAssignedInstructors([
          ...withoutMain,
          {
            userId: selectedProgram.ownerId,
            userName: selectedProgram.ownerName || '',
            userEmail: selectedProgram.ownerEmail || '',
            role: 'MAIN',
          },
        ]);
      }
    } else if (!checked && selectedProgram?.ownerId) {
      // Owner 제거
      setAssignedInstructors((prev) => prev.filter((i) => i.userId !== selectedProgram.ownerId));
    }
  };

  const stepLabels = [getText('step1'), getText('step2'), getText('step3'), getText('step4')];

  return (
    <div className="bg-bg-app min-h-screen">
      {/* Header */}
      <div className="bg-bg-default border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-text-primary m-0">{getText('title')}</h1>
          <Button variant="ghost" onClick={() => navigate(prefixPath('/co/times'))} className="border border-border">
            {getText('close')}
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-bg-default border-b border-border px-6 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex-1 flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm',
                    currentStep >= step ? 'bg-btn-neutral text-white' : 'bg-border text-text-secondary'
                  )}
                >
                  {step}
                </div>
                <span
                  className={cn(
                    'text-sm',
                    currentStep >= step ? 'text-text-primary' : 'text-text-secondary',
                    currentStep === step && 'font-medium'
                  )}
                >
                  {stepLabels[step - 1]}
                </span>
                {step < 4 && (
                  <div
                    className={cn('flex-1 h-0.5', currentStep > step ? 'bg-btn-neutral' : 'bg-border')}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-bg-default rounded-xl p-8 border border-border">
          {/* Step 1: 기본 정보 */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-6">
              {/* 교육 과정 선택 */}
              <div className="space-y-2">
                <Label htmlFor="programSelect">{getText('selectProgram')} *</Label>
                {isLoadingPrograms ? (
                  <div className="flex items-center gap-2 text-text-secondary py-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">{getText('loadingPrograms')}</span>
                  </div>
                ) : approvedPrograms.length === 0 ? (
                  <div className="flex items-center gap-2 text-text-secondary py-2">
                    <Info size={16} />
                    <span className="text-sm">{getText('noApprovedPrograms')}</span>
                  </div>
                ) : (
                  <Select
                    value={formData.programId ? formData.programId.toString() : ''}
                    onValueChange={handleProgramSelect}
                  >
                    <SelectTrigger
                      id="programSelect"
                      className={errors.programId ? 'border-status-error' : ''}
                    >
                      <SelectValue placeholder={getText('selectProgramPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {approvedPrograms.map((program) => (
                        <SelectItem key={program.id} value={program.id.toString()}>
                          {program.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.programId && (
                  <p className="text-sm text-status-error">{errors.programId}</p>
                )}
              </div>

              {/* 선택된 프로그램 정보 표시 */}
              {selectedProgram && (
                <div className="bg-bg-subtle rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={18} className="text-text-secondary" />
                    <span className="font-medium text-text-primary">
                      {getText('selectedProgramInfo')}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    {/* 썸네일 이미지 */}
                    <div className="flex-shrink-0">
                      {selectedProgram.thumbnailUrl ? (
                        <img
                          src={selectedProgram.thumbnailUrl}
                          alt={selectedProgram.title}
                          className="w-24 h-16 object-cover rounded-lg border border-border"
                        />
                      ) : (
                        <div className="w-24 h-16 bg-bg-secondary rounded-lg border border-border flex items-center justify-center">
                          <span className="text-xs text-text-placeholder">{getText('noThumbnail')}</span>
                        </div>
                      )}
                    </div>
                    {/* 프로그램 정보 */}
                    <div className="flex-1">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {selectedProgram.level && (
                          <div>
                            <span className="text-text-secondary">{getText('programLevel')}: </span>
                            <span className="text-text-primary">
                              {PROGRAM_LEVEL_LABELS[selectedProgram.level]}
                            </span>
                          </div>
                        )}
                        {selectedProgram.type && (
                          <div>
                            <span className="text-text-secondary">{getText('programType')}: </span>
                            <span className="text-text-primary">
                              {PROGRAM_TYPE_LABELS[selectedProgram.type]}
                            </span>
                          </div>
                        )}
                        {selectedProgram.estimatedHours && (
                          <div>
                            <span className="text-text-secondary">{getText('estimatedHours')}: </span>
                            <span className="text-text-primary">
                              {selectedProgram.estimatedHours} {getText('hours')}
                            </span>
                          </div>
                        )}
                        {/* Owner 정보 */}
                        <div>
                          <span className="text-text-secondary">{getText('owner')}: </span>
                          <span className="text-text-primary">
                            {selectedProgram.ownerName || getText('noOwner')}
                          </span>
                        </div>
                      </div>
                      {/* 권장 운영기간 */}
                      {(selectedProgram.courseStartDate || selectedProgram.courseEndDate) && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <span className="text-text-secondary">{getText('recommendedPeriod')}: </span>
                          <span className="text-text-primary font-medium">
                            {selectedProgram.courseStartDate && selectedProgram.courseEndDate
                              ? `${selectedProgram.courseStartDate} ~ ${selectedProgram.courseEndDate}`
                              : selectedProgram.courseStartDate || selectedProgram.courseEndDate || getText('noRecommendedPeriod')}
                          </span>
                        </div>
                      )}
                      {selectedProgram.description && (
                        <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                          {selectedProgram.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">{getText('timeTitle')} *</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder={getText('timeTitlePlaceholder')}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-status-error' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-status-error">{errors.title}</p>
                )}
              </div>

              {/* 설명 필드 추가 */}
              <div className="space-y-2">
                <Label htmlFor="description">{getText('description')}</Label>
                <Textarea
                  id="description"
                  placeholder={getText('descriptionPlaceholder')}
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: 일정 및 모집 */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-8">
              {/* 수강 신청 방식 */}
              <div className="space-y-2">
                <Label htmlFor="enrollmentMethod">{getText('enrollmentMethod')}</Label>
                <Select
                  value={formData.enrollmentMethod}
                  onValueChange={(value) => handleInputChange('enrollmentMethod', value as EnrollmentMethod)}
                >
                  <SelectTrigger id="enrollmentMethod" className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ENROLLMENT_METHOD_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 상시모집 & 중간합류 옵션 */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-bg-subtle rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={isAlwaysOpen}
                      onCheckedChange={handleAlwaysOpenToggle}
                    />
                    <div>
                      <span className="font-medium text-text-primary">{getText('alwaysOpen')}</span>
                      <p className="text-sm text-text-secondary mt-0.5">{getText('alwaysOpenHint')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-bg-subtle rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.allowLateEnrollment ?? false}
                      onCheckedChange={(checked) => handleInputChange('allowLateEnrollment', checked)}
                    />
                    <div>
                      <span className="font-medium text-text-primary">{getText('allowLateEnrollment')}</span>
                      <p className="text-sm text-text-secondary mt-0.5">{getText('allowLateEnrollmentHint')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 모집 기간 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-primary">
                  <Calendar size={20} />
                  <h3 className="font-medium m-0">{getText('enrollmentPeriod')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                  <div className="space-y-2">
                    <Label htmlFor="enrollStartDate">{getText('enrollStartDate')} *</Label>
                    <Input
                      id="enrollStartDate"
                      type="date"
                      value={formData.enrollStartDate}
                      onChange={(e) => handleInputChange('enrollStartDate', e.target.value)}
                      className={errors.enrollStartDate ? 'border-status-error' : ''}
                    />
                    {errors.enrollStartDate && (
                      <p className="text-sm text-status-error">{errors.enrollStartDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrollEndDate">
                      {getText('enrollEndDate')} {!isAlwaysOpen && '*'}
                    </Label>
                    <Input
                      id="enrollEndDate"
                      type="date"
                      value={isAlwaysOpen ? '' : formData.enrollEndDate}
                      onChange={(e) => handleInputChange('enrollEndDate', e.target.value)}
                      className={errors.enrollEndDate ? 'border-status-error' : ''}
                      disabled={isAlwaysOpen}
                      placeholder={isAlwaysOpen ? '9999-12-31' : ''}
                    />
                    {errors.enrollEndDate && (
                      <p className="text-sm text-status-error">{errors.enrollEndDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 학습 기간 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-text-primary">
                  <Clock size={20} />
                  <h3 className="font-medium m-0">{getText('learningPeriod')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                  <div className="space-y-2">
                    <Label htmlFor="classStartDate">{getText('classStartDate')} *</Label>
                    <Input
                      id="classStartDate"
                      type="date"
                      value={formData.classStartDate}
                      onChange={(e) => handleInputChange('classStartDate', e.target.value)}
                      className={errors.classStartDate ? 'border-status-error' : ''}
                    />
                    {errors.classStartDate && (
                      <p className="text-sm text-status-error">{errors.classStartDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classEndDate">
                      {getText('classEndDate')} {!isAlwaysOpen && '*'}
                    </Label>
                    <Input
                      id="classEndDate"
                      type="date"
                      value={isAlwaysOpen ? '' : formData.classEndDate}
                      onChange={(e) => handleInputChange('classEndDate', e.target.value)}
                      className={errors.classEndDate ? 'border-status-error' : ''}
                      disabled={isAlwaysOpen}
                      placeholder={isAlwaysOpen ? '9999-12-31' : ''}
                    />
                    {errors.classEndDate && (
                      <p className="text-sm text-status-error">{errors.classEndDate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 강사 일정 충돌 경고 */}
              {conflictInfo && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <span className="text-red-600 text-xs font-bold">!</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-red-800">{getText('errorInstructorConflict')}</p>
                      <p className="text-sm text-red-600 mt-1">{getText('errorConflictingTimes')}:</p>
                      <ul className="mt-2 space-y-1">
                        {conflictInfo.conflicts.map((c, i) => (
                          <li key={i} className="text-sm text-red-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            <span className="font-medium">{c.conflictingTimeTitle}</span>
                            <span className="text-red-500">({c.classStartDate} ~ {c.classEndDate})</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-red-600 mt-3">
                        {language === 'ko'
                          ? '위 기간과 겹치지 않도록 학습 기간을 조정해주세요.'
                          : 'Please adjust the learning period to avoid conflicts.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConflictInfo(null)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: 운영 설정 */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-6">
              {/* 진행 방식 & 장소 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deliveryType">{getText('deliveryType')}</Label>
                  <Select
                    value={formData.deliveryType}
                    onValueChange={(value) => handleInputChange('deliveryType', value as DeliveryType)}
                  >
                    <SelectTrigger id="deliveryType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DELIVERY_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(formData.deliveryType === 'OFFLINE' || formData.deliveryType === 'BLENDED') && (
                  <div className="space-y-2">
                    <Label htmlFor="locationInfo">{getText('location')}</Label>
                    <Input
                      id="locationInfo"
                      type="text"
                      placeholder={getText('locationPlaceholder')}
                      value={formData.locationInfo || ''}
                      onChange={(e) => handleInputChange('locationInfo', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* 정원 & 가격 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="capacity">{getText('capacity')}</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    placeholder={getText('capacityPlaceholder')}
                    value={formData.capacity ?? ''}
                    onChange={(e) =>
                      handleInputChange('capacity', e.target.value ? parseInt(e.target.value) : null)
                    }
                  />
                  <p className="text-sm text-text-secondary">{getText('capacityHint')}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">{getText('price')} *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder={getText('pricePlaceholder')}
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value || '0')}
                  />
                  <p className="text-sm text-text-secondary">{getText('priceHint')}</p>
                </div>
              </div>

              {/* 수료 기준 */}
              <div className="space-y-2 md:w-1/2">
                <Label htmlFor="minProgressForCompletion">{getText('minProgress')} *</Label>
                <Input
                  id="minProgressForCompletion"
                  type="number"
                  min="0"
                  max="100"
                  placeholder={getText('minProgressPlaceholder')}
                  value={formData.minProgressForCompletion}
                  onChange={(e) =>
                    handleInputChange('minProgressForCompletion', parseInt(e.target.value) || 0)
                  }
                />
                <p className="text-sm text-text-secondary">{getText('minProgressHint')}</p>
              </div>
            </div>
          )}

          {/* Step 4: 강사 배정 */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-6">
              {/* 헤더 */}
              <div className="flex items-center gap-2">
                <Users size={20} className="text-text-secondary" />
                <h3 className="font-medium text-text-primary m-0">
                  {getText('instructorAssignment')} {getText('instructorAssignmentOptional')}
                </h3>
              </div>
              <p className="text-sm text-text-secondary -mt-4 ml-7">
                {getText('instructorAssignmentHint')}
              </p>

              {/* Owner를 주강사로 배정 옵션 */}
              {selectedProgram?.ownerId && (
                <div className="bg-bg-subtle rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={useOwnerAsInstructor}
                        onCheckedChange={handleUseOwnerToggle}
                      />
                      <div>
                        <span className="font-medium text-text-primary">{getText('useOwnerAsInstructor')}</span>
                        <p className="text-sm text-text-secondary mt-0.5">
                          {selectedProgram.ownerName} ({selectedProgram.ownerEmail})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 강사 추가 섹션 */}
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1 space-y-2">
                    <Label>{getText('selectInstructor')}</Label>
                    <div className="flex gap-2">
                      <Select
                        value={selectedInstructorId}
                        onValueChange={setSelectedInstructorId}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder={getText('selectInstructorPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingUsers ? (
                            <div className="flex items-center gap-2 p-2 text-text-secondary">
                              <Loader2 size={16} className="animate-spin" />
                              <span className="text-sm">Loading...</span>
                            </div>
                          ) : (
                            availableInstructors
                              .filter((u) => !assignedInstructors.some((i) => i.userId === u.id))
                              .map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  {user.name} ({user.email})
                                </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                      {selectedInstructorId && (
                        <button
                          type="button"
                          onClick={() => setSelectedInstructorId('')}
                          className="px-2 text-text-placeholder hover:text-text-secondary transition-colors"
                          title={language === 'ko' ? '선택 취소' : 'Clear selection'}
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="w-40 space-y-2">
                    <Label>{getText('instructorRole')}</Label>
                    <Select
                      value={selectedInstructorRole}
                      onValueChange={(v) => setSelectedInstructorRole(v as InstructorRole)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(['MAIN', 'SUB', 'ASSISTANT'] as InstructorRole[]).map((role) => (
                          <SelectItem
                            key={role}
                            value={role}
                            disabled={role === 'MAIN' && assignedInstructors.some((i) => i.role === 'MAIN')}
                          >
                            {INSTRUCTOR_ROLE_LABELS[role][language]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddInstructor}
                    disabled={!selectedInstructorId}
                  >
                    <UserPlus size={18} />
                    {getText('addInstructor')}
                  </Button>
                </div>
              </div>

              {/* 배정된 강사 목록 */}
              <div className="space-y-3">
                <Label>{getText('assignedInstructors')}</Label>
                {assignedInstructors.length === 0 ? (
                  <div className="bg-bg-subtle rounded-lg p-6 border border-border text-center">
                    <Users size={32} className="mx-auto text-text-placeholder mb-2" />
                    <p className="text-sm text-text-secondary">{getText('noInstructorsAssigned')}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assignedInstructors.map((instructor) => (
                      <div
                        key={instructor.userId}
                        className="flex items-center justify-between bg-bg-subtle rounded-lg px-4 py-3 border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center">
                            <span className="text-sm font-medium text-text-secondary">
                              {instructor.userName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{instructor.userName}</p>
                            <p className="text-sm text-text-secondary">{instructor.userEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'px-2 py-1 rounded text-xs font-medium',
                              instructor.role === 'MAIN'
                                ? 'bg-blue-100 text-blue-700'
                                : instructor.role === 'SUB'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                            )}
                          >
                            {INSTRUCTOR_ROLE_LABELS[instructor.role][language]}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInstructor(instructor.userId)}
                            className="text-text-placeholder hover:text-status-error transition-colors"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <div>
            {currentStep > 1 && (
              <Button variant="ghost" onClick={handlePrevious} className="border border-border">
                <ArrowLeft size={18} />
                {getText('previous')}
              </Button>
            )}
          </div>

          <div>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                {getText('next')}
                <ArrowRight size={18} />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={createTime.isPending}>
                {createTime.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {getText('saving')}
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {getText('submit')}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
