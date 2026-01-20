import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  Calendar,
  CalendarDays,
  Clock,
  BookOpen,
  Info,
  UserPlus,
  X,
  Users,
  Video,
  MapPin,
  Layers,
  Radio,
  CheckCircle,
  Mail,
  Infinity,
  Search,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { designTokens } from '@/styles/admin-design-tokens';
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
  RadioOptionCard,
  DatePicker,
  TimePicker,
  ToggleGroup,
  ToggleGroupItem,
  Combobox,
} from '@/components/common';
import { useCreateTime } from '@/hooks/co/useTimeQueries';
import { useRegisteredCourses } from '@/hooks/tu/useCourseQueries';
import { useUsers } from '@/hooks/co/useUserQueries';
import { instructorAssignmentService } from '@/services/co/instructorAssignmentService';
import { useForceEnroll } from '@/hooks/co/useEnrollmentQueries';
import type {
  CreateCourseTimeRequest,
  DeliveryType,
  EnrollmentMethod,
  DurationType,
  DayOfWeek,
} from '@/types/co/time.types';
import {
  DELIVERY_TYPE_LABELS,
  DELIVERY_TYPE_DESCRIPTIONS,
  ENROLLMENT_METHOD_LABELS,
  ENROLLMENT_METHOD_DESCRIPTIONS,
  DURATION_TYPE_LABELS,
  DURATION_TYPE_DESCRIPTIONS,
  DAY_OF_WEEK_LABELS,
} from '@/types/co/time.types';
import { ValidationResultDisplay } from '@/components/co/time/ValidationResultDisplay';
import { validateCourseTimeClient, getDefaultDurationType, calculateDurationDays } from '@/utils/co/courseTimeValidation';
import { COURSE_LEVEL_LABELS, COURSE_TYPE_LABELS } from '@/types/common/course.types';
import type { CourseRegistrationResponse } from '@/types/common/course.types';
import type { InstructorRole } from '@/types/tu/instructorAssignment.types';
import { INSTRUCTOR_ROLE_LABELS } from '@/types/tu/instructorAssignment.types';
import { format, parseISO, isToday, isBefore, startOfDay, addDays } from 'date-fns';

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
  step3: { ko: '평가 기준', en: 'Evaluation' },
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
  alwaysOpen: { ko: '수시 모집', en: 'Rolling Admission' },
  alwaysOpenHint: { ko: '모집 종료일 없이 수시로 모집', en: 'No enrollment end date' },
  noLearningPeriod: { ko: '학습 기간 없음', en: 'No Learning Period' },
  noLearningPeriodHint: { ko: '모집 종료 후 바로 학습 시작', en: 'Start learning immediately after enrollment' },
  // Step 3 - Capacity & Price
  capacity: { ko: '정원', en: 'Capacity' },
  capacityPlaceholder: { ko: '비워두면 무제한', en: 'Leave empty for unlimited' },
  capacityHint: { ko: '최대 수강 인원을 설정합니다.', en: 'Set maximum enrollment.' },
  price: { ko: '가격 (원)', en: 'Price (KRW)' },
  pricePlaceholder: { ko: '0', en: '0' },
  priceHint: { ko: '수강료를 설정합니다. 0이면 무료입니다.', en: 'Set course fee. 0 means free.' },
  minProgress: { ko: '수료 기준', en: 'Completion Criteria' },
  minProgressPlaceholder: { ko: '80', en: '80' },
  minProgressHint: { ko: '수료를 위한 최소 진도율을 설정합니다.', en: 'Set minimum progress rate for completion.' },
  completionRate: { ko: '진도율', en: 'Progress Rate' },
  // Price section
  priceType: { ko: '수강료 설정', en: 'Course Fee' },
  free: { ko: '무료', en: 'Free' },
  paid: { ko: '유료', en: 'Paid' },
  freeHint: { ko: '수강료 없이 무료로 제공', en: 'Offer for free without any fee' },
  paidHint: { ko: '수강료를 설정하여 유료로 제공', en: 'Set a fee for paid access' },
  priceAmount: { ko: '수강료 (원)', en: 'Course Fee (KRW)' },
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
  useOwnerAsInstructor: { ko: '과정 담당자를 주강사로 배정', en: 'Assign program owner as main instructor' },
  instructorAssignmentOptional: { ko: '(선택사항)', en: '(Optional)' },
  // Step 5 - User Assignment (INVITE_ONLY)
  step5: { ko: '수강생 선발', en: 'Select Users' },
  userAssignment: { ko: '수강생 선발', en: 'Select Users' },
  userAssignmentHint: { ko: '"선발" 방식으로 설정되었습니다. 지금 수강생을 등록하시겠습니까?', en: 'INVITE_ONLY mode selected. Would you like to enroll users now?' },
  userAssignmentLater: { ko: '나중에 관리 페이지에서도 추가할 수 있습니다.', en: 'You can also add users later from the management page.' },
  selectUsersToEnroll: { ko: '배정할 사용자 선택', en: 'Select users to enroll' },
  searchUserPlaceholder: { ko: '이름, 이메일로 검색...', en: 'Search by name, email...' },
  selectedUsersCount: { ko: '명 선택됨', en: ' selected' },
  noUsersSelected: { ko: '선택된 사용자가 없습니다', en: 'No users selected' },
  skip: { ko: '건너뛰기', en: 'Skip' },
  userAssignmentOptional: { ko: '(선택사항)', en: '(Optional)' },
  enrollReason: { ko: '배정 사유 (선택)', en: 'Enrollment Reason (Optional)' },
  enrollReasonPlaceholder: { ko: '사유를 입력하세요...', en: 'Enter reason...' },
  departmentFilter: { ko: '부서', en: 'Department' },
  positionFilter: { ko: '직급', en: 'Position' },
  allDepartments: { ko: '전체 부서', en: 'All Departments' },
  allPositions: { ko: '전체 직급', en: 'All Positions' },
  noDepartment: { ko: '부서 없음', en: 'No Department' },
  noPosition: { ko: '직급 없음', en: 'No Position' },
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
  const [searchParams] = useSearchParams();
  const { prefixPath } = useSubdomainPath();
  const createTime = useCreateTime();
  const forceEnroll = useForceEnroll();
  const { data: registeredCoursesData, isLoading: isLoadingCourses } = useRegisteredCourses({ size: 100 });
  const { data: usersData, isLoading: isLoadingUsers } = useUsers({ role: 'DESIGNER', size: 100 });
  // 수강생 선발용 전체 사용자 목록
  const { data: allUsersData, isLoading: isLoadingAllUsers } = useUsers({ size: 200 });
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(4);

  // 수강생 선발 상태 (INVITE_ONLY 선택 시 Step 5)
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [enrollReason, setEnrollReason] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');

  // URL에서 courseId 쿼리 파라미터 읽기
  const initialCourseId = searchParams.get('courseId');

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // 승인된(REGISTERED) 과정 목록 (백엔드 courseId를 id로 매핑)
  const registeredCourses = useMemo(() => {
    const content = registeredCoursesData?.content ?? [];
    // 백엔드에서 courseId로 반환되므로, id 필드가 없으면 courseId를 id로 매핑
    return content.map((item) => ({
      ...item,
      id: item.id ?? (item as unknown as { courseId?: number }).courseId,
    }));
  }, [registeredCoursesData]);

  // DESIGNER 역할 사용자 목록 (강사 후보)
  const availableInstructors = useMemo(() => {
    return usersData?.content ?? [];
  }, [usersData]);

  // 부서/직급 목록 추출 (필터 옵션용)
  const { departments, positions } = useMemo(() => {
    const users = allUsersData?.content ?? [];
    const deptSet = new Set<string>();
    const posSet = new Set<string>();
    users.forEach((u) => {
      if (u.department) deptSet.add(u.department);
      if (u.position) posSet.add(u.position);
    });
    return {
      departments: Array.from(deptSet).sort(),
      positions: Array.from(posSet).sort(),
    };
  }, [allUsersData]);

  // 수강생 선발용 전체 사용자 목록 (검색 + 부서/직급 필터링 적용)
  const availableUsers = useMemo(() => {
    const users = allUsersData?.content ?? [];
    return users.filter((u) => {
      // 텍스트 검색 (이름, 이메일, 부서, 직급)
      if (userSearchQuery.trim()) {
        const query = userSearchQuery.toLowerCase();
        const matchesSearch =
          u.name?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query) ||
          u.department?.toLowerCase().includes(query) ||
          u.position?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      // 부서 필터
      if (departmentFilter !== 'all' && u.department !== departmentFilter) {
        return false;
      }
      // 직급 필터
      if (positionFilter !== 'all' && u.position !== positionFilter) {
        return false;
      }
      return true;
    });
  }, [allUsersData, userSearchQuery, departmentFilter, positionFilter]);

  // 선택된 과정 정보
  const [selectedCourse, setSelectedCourse] = useState<CourseRegistrationResponse | null>(null);

  // 수시 모집 상태 (모집 종료일 없음)
  const [isAlwaysOpen, setIsAlwaysOpen] = useState(false);

  // 정기 수업 일정 상태
  const [hasSchedule, setHasSchedule] = useState(false);
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [scheduleStartTime, setScheduleStartTime] = useState('');
  const [scheduleEndTime, setScheduleEndTime] = useState('');
  const [excludeHolidays, setExcludeHolidays] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateCourseTimeRequest>({
    courseId: 0, // Phase 3: programId → courseId
    title: '',
    description: '',
    deliveryType: 'ONLINE',
    durationType: 'RELATIVE', // ONLINE 기본값
    enrollmentMethod: 'FIRST_COME',
    enrollStartDate: '',
    enrollEndDate: '',
    classStartDate: '',
    classEndDate: null,
    durationDays: null,
    capacity: null,
    price: '0',
    isFree: true,
    minProgressForCompletion: 80,
    locationInfo: '',
    allowLateEnrollment: false,
    recurringSchedule: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateCourseTimeRequest, string>>>({});

  // INVITE_ONLY 선택 시 Step 5 활성화
  useEffect(() => {
    if (formData.enrollmentMethod === 'INVITE_ONLY') {
      setTotalSteps(5);
    } else {
      setTotalSteps(4);
      // 선발 방식이 아닌 경우 선택된 사용자 초기화
      setSelectedUserIds([]);
      setEnrollReason('');
    }
  }, [formData.enrollmentMethod]);

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
      // Phase 3: programId → courseId
      if (!formData.courseId) newErrors.courseId = getText('required');
      if (!formData.title.trim()) newErrors.title = getText('required');
    } else if (step === 2) {
      if (!formData.enrollStartDate) newErrors.enrollStartDate = getText('required');
      if (!isAlwaysOpen && !formData.enrollEndDate) newErrors.enrollEndDate = getText('required');

      // 학습 시작일 필수
      if (!formData.classStartDate) newErrors.classStartDate = getText('required');

      // DurationType별 필수 필드 검증
      if (formData.durationType === 'FIXED' && !formData.classEndDate) {
        newErrors.classEndDate = getText('required');
      }
      if (formData.durationType === 'RELATIVE' && (!formData.durationDays || formData.durationDays <= 0)) {
        newErrors.durationDays = getText('required');
      }

      // 날짜 유효성 검사
      if (!isAlwaysOpen && formData.enrollStartDate && formData.enrollEndDate) {
        if (new Date(formData.enrollEndDate) < new Date(formData.enrollStartDate)) {
          newErrors.enrollEndDate = getText('enrollEndBeforeStart');
        }
      }
      if (formData.durationType === 'FIXED' && formData.classStartDate && formData.classEndDate) {
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

      // 정기 일정 검증
      if (hasSchedule) {
        if (selectedDays.length === 0) {
          toast.error('정기 수업 일정을 설정한 경우 최소 1개 이상의 요일을 선택해야 합니다.');
          return false;
        }
        if (!scheduleStartTime) {
          toast.error('정기 수업 일정의 시작 시간을 입력해주세요.');
          return false;
        }
        if (!scheduleEndTime) {
          toast.error('정기 수업 일정의 종료 시간을 입력해주세요.');
          return false;
        }
        if (scheduleStartTime >= scheduleEndTime) {
          toast.error('종료 시간은 시작 시간 이후여야 합니다.');
          return false;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // DurationType 비활성화 여부 계산
  // 모든 DeliveryType에서 모든 DurationType 선택 가능 (B2B 유연성 확보)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getDurationTypeDisabled = (_type: DurationType): { disabled: boolean; reason?: string } => {
    // 현재 모든 조합 허용 - 향후 제약 필요 시 여기에 추가
    return { disabled: false };
  };

  // DeliveryType 변경 시 DurationType 기본값 설정
  const handleDeliveryTypeChange = (type: DeliveryType) => {
    const defaultDurationType = getDefaultDurationType(type);
    setFormData((prev) => ({
      ...prev,
      deliveryType: type,
      durationType: defaultDurationType,
      // FIXED가 아니면 classEndDate 초기화
      classEndDate: defaultDurationType === 'FIXED' ? prev.classEndDate : null,
      // R22 제거: LIVE에서도 중도등록 허용 가능 (B2B 유연성 확보)
    }));
  };

  // 클라이언트 사이드 검증 (실시간)
  const clientValidationResult = useMemo(() => {
    if (!formData.deliveryType || !formData.enrollmentMethod || !formData.durationType) {
      return { valid: true, errors: [], warnings: [], qualityRating: null };
    }

    const errors = validateCourseTimeClient({
      deliveryType: formData.deliveryType,
      enrollmentMethod: formData.enrollmentMethod,
      durationType: formData.durationType,
      capacity: formData.capacity || null,
      locationInfo: formData.locationInfo || null,
      allowLateEnrollment: formData.allowLateEnrollment || false,
      durationDays: formData.durationDays || null,
      classStartDate: formData.classStartDate || null,
      classEndDate: formData.classEndDate || null,
      enrollStartDate: formData.enrollStartDate || null,
      enrollEndDate: formData.enrollEndDate || null,
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
      qualityRating: null,
    };
  }, [formData]);

  // FIXED 타입일 때 durationDays 자동 계산
  useEffect(() => {
    if (
      formData.durationType === 'FIXED' &&
      formData.classStartDate &&
      formData.classEndDate
    ) {
      const days = calculateDurationDays(formData.classStartDate, formData.classEndDate);
      setFormData((prev) => ({ ...prev, durationDays: days }));
    } else if (formData.durationType === 'UNLIMITED') {
      setFormData((prev) => ({ ...prev, durationDays: null }));
    }
  }, [formData.durationType, formData.classStartDate, formData.classEndDate]);


  // 정기 일정 업데이트 (formData에 반영)
  useEffect(() => {
    if (hasSchedule && selectedDays.length > 0 && scheduleStartTime && scheduleEndTime) {
      setFormData((prev) => ({
        ...prev,
        recurringSchedule: {
          daysOfWeek: selectedDays,
          startTime: scheduleStartTime,
          endTime: scheduleEndTime,
          locationInfo: prev.locationInfo || undefined,
          excludeHolidays,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        recurringSchedule: null,
      }));
    }
  }, [hasSchedule, selectedDays, scheduleStartTime, scheduleEndTime, excludeHolidays]);

  // 수시 모집 토글 핸들러 (모집 종료일 없음)
  const handleAlwaysOpenToggle = (checked: boolean) => {
    setIsAlwaysOpen(checked);
    if (checked) {
      // 수시 모집 선택 시 모집 종료일을 9999-12-31로 설정
      setFormData((prev) => ({
        ...prev,
        enrollEndDate: '9999-12-31',
      }));
    } else {
      // 수시 모집 해제 시 모집 종료일 초기화
      setFormData((prev) => ({
        ...prev,
        enrollEndDate: '',
      }));
    }
  };


  // 과정 선택 핸들러
  const handleCourseSelect = (courseIdStr: string) => {
    const courseId = parseInt(courseIdStr);
    if (!courseId) {
      setSelectedCourse(null);
      setFormData((prev) => ({ ...prev, courseId: 0 }));
      return;
    }

    const course = registeredCourses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setFormData((prev) => ({
        ...prev,
        courseId: course.id,
        // 차수명이 비어있으면 교육 과정명으로 자동 설정
        title: prev.title || course.title,
      }));
      // 에러 클리어
      if (errors.courseId) {
        setErrors((prev) => ({ ...prev, courseId: undefined }));
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

      // UNLIMITED + 정원 무제한인 경우 중간 합류 허용을 true로 설정
      const isUnlimitedWithNoCapacity = formData.durationType === 'UNLIMITED' && !formData.capacity;
      const allowLateEnrollment = isUnlimitedWithNoCapacity ? true : (formData.allowLateEnrollment ?? false);

      // durationType에 따라 불필요한 필드 정리
      let classEndDate = formData.classEndDate;
      let durationDays = formData.durationDays;

      if (formData.durationType === 'FIXED') {
        // FIXED: classEndDate 필수, durationDays 불필요
        durationDays = null;
      } else if (formData.durationType === 'RELATIVE') {
        // RELATIVE: durationDays 필수, classEndDate 불필요
        classEndDate = null;
      } else if (formData.durationType === 'UNLIMITED') {
        // UNLIMITED: 둘 다 불필요
        classEndDate = null;
        durationDays = null;
      }

      const request: CreateCourseTimeRequest = {
        ...formData,
        enrollEndDate,
        classEndDate,
        durationDays,
        capacity: formData.capacity === 0 ? null : formData.capacity,
        price: priceNum.toString(),
        isFree: priceNum === 0,
        locationInfo: formData.locationInfo?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        allowLateEnrollment,
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

      // 수강생 강제 배정 처리 (INVITE_ONLY 선택 시)
      if (selectedUserIds.length > 0 && createdTime?.id) {
        try {
          const result = await forceEnroll.mutateAsync({
            courseTimeId: createdTime.id,
            request: {
              userIds: selectedUserIds,
              ...(enrollReason && { reason: enrollReason }),
            },
          });
          if (result.failCount > 0) {
            toast.warning(
              language === 'ko'
                ? `${result.successCount}명 배정 완료, ${result.failCount}명 배정 실패`
                : `${result.successCount} enrolled, ${result.failCount} failed`
            );
          }
        } catch (enrollErr) {
          console.error('User enrollment failed:', enrollErr);
          toast.warning(
            language === 'ko'
              ? '차수가 생성되었으나 일부 수강생 배정에 실패했습니다.'
              : 'Course time created but some user enrollments failed.'
          );
          navigate(prefixPath('/co/times'));
          return;
        }
      }

      toast.success(getText('createSuccess'));
      navigate(prefixPath('/co/times'));
    } catch (err: unknown) {
      console.error('Create failed:', err);
      // 상세 에러 응답 출력
      const axiosError = err as { response?: { data?: unknown } };
      console.error('Error response data:', axiosError?.response?.data);

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
        // 일반 validation 에러 - 제약 조건 메시지 매핑
        const errorMessage = errorData?.error?.message || '';

        // 제약 조건 키 추출 (예: "R10: constraint.deliveryType.locationRequired" → "constraint.deliveryType.locationRequired")
        const constraintMatch = errorMessage.match(/constraint\.[\w.]+/);
        const constraintKey = constraintMatch?.[0];

        // 제약 조건별 사용자 친화적 메시지 매핑
        const constraintMessages: Record<string, { ko: string; en: string }> = {
          'constraint.deliveryType.locationRequired': {
            ko: '오프라인/블렌디드/실시간 온라인 진행 방식에서는 장소 정보가 필수입니다.',
            en: 'Location is required for offline, blended, or live online delivery types.',
          },
          'constraint.enrollment.capacityRequired': {
            ko: '모집 인원은 필수 입력 항목입니다.',
            en: 'Enrollment capacity is required.',
          },
          'constraint.enrollment.endDateRequired': {
            ko: '모집 마감일은 필수 입력 항목입니다.',
            en: 'Enrollment end date is required.',
          },
          'constraint.date.startBeforeEnd': {
            ko: '시작일은 종료일보다 이전이어야 합니다.',
            en: 'Start date must be before end date.',
          },
          'constraint.date.classStartRequired': {
            ko: '교육 시작일은 필수 입력 항목입니다.',
            en: 'Class start date is required.',
          },
          'constraint.date.classEndRequired': {
            ko: '교육 종료일은 필수 입력 항목입니다.',
            en: 'Class end date is required.',
          },
          'constraint.duration.daysRequired': {
            ko: '수강 기간(일수)은 필수 입력 항목입니다.',
            en: 'Duration days is required.',
          },
          'constraint.title.required': {
            ko: '차수 제목은 필수 입력 항목입니다.',
            en: 'Course time title is required.',
          },
        };

        const friendlyMessage = constraintKey && constraintMessages[constraintKey]
          ? constraintMessages[constraintKey][language]
          : errorMessage || getText('errorValidation');

        toast.error(friendlyMessage);
      } else if (errorCode === 'C002') {
        // 서버 내부 에러
        toast.error(
          language === 'ko'
            ? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            : 'A server error occurred. Please try again later.'
        );
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

  // URL에서 전달된 courseId로 초기 선택
  useEffect(() => {
    if (initialCourseId && registeredCourses.length > 0 && !selectedCourse) {
      const courseId = parseInt(initialCourseId);
      const course = registeredCourses.find((c) => c.id === courseId);
      if (course) {
        setSelectedCourse(course);
        setFormData((prev) => ({
          ...prev,
          courseId: course.id,
          title: prev.title || course.title,
        }));
      }
    }
  }, [initialCourseId, registeredCourses, selectedCourse]);

  // Owner를 주강사로 자동 추가
  const handleUseOwnerToggle = (checked: boolean) => {
    setUseOwnerAsInstructor(checked);
    if (checked && selectedCourse?.ownerId) {
      // Owner가 이미 목록에 있는지 확인
      const ownerExists = assignedInstructors.some((i) => i.userId === selectedCourse.ownerId);
      if (!ownerExists) {
        // MAIN이 이미 있으면 제거
        const withoutMain = assignedInstructors.filter((i) => i.role !== 'MAIN');
        setAssignedInstructors([
          ...withoutMain,
          {
            userId: selectedCourse.ownerId,
            userName: selectedCourse.ownerName || '',
            userEmail: selectedCourse.ownerEmail || '',
            role: 'MAIN',
          },
        ]);
      }
    } else if (!checked && selectedCourse?.ownerId) {
      // Owner 제거
      setAssignedInstructors((prev) => prev.filter((i) => i.userId !== selectedCourse.ownerId));
    }
  };

  const stepLabels = useMemo(() => {
    const labels = [getText('step1'), getText('step2'), getText('step3'), getText('step4')];
    if (totalSteps === 5) {
      labels.push(getText('step5'));
    }
    return labels;
  }, [totalSteps, language]);

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
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
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
                {step < totalSteps && (
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
                <Label htmlFor="courseSelect">{getText('selectProgram')} *</Label>
                {isLoadingCourses ? (
                  <div className="flex items-center gap-2 text-text-secondary py-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">{getText('loadingPrograms')}</span>
                  </div>
                ) : registeredCourses.length === 0 ? (
                  <div className="flex items-center gap-2 text-text-secondary py-2">
                    <Info size={16} />
                    <span className="text-sm">{getText('noApprovedPrograms')}</span>
                  </div>
                ) : (
                  <Combobox
                    options={registeredCourses.map((course) => ({
                      value: course.id.toString(),
                      label: course.title,
                    }))}
                    value={formData.courseId ? formData.courseId.toString() : ''}
                    onValueChange={handleCourseSelect}
                    placeholder={getText('selectProgramPlaceholder')}
                    searchPlaceholder="과정명 검색..."
                    emptyMessage="검색 결과가 없습니다"
                    className={cn(
                      'w-full',
                      errors.courseId && 'border-status-error'
                    )}
                  />
                )}
                {errors.courseId && (
                  <p className="text-sm text-status-error">{errors.courseId}</p>
                )}
              </div>

              {/* 선택된 과정 정보 표시 */}
              {selectedCourse && (
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
                      {selectedCourse.thumbnailUrl ? (
                        <img
                          src={selectedCourse.thumbnailUrl}
                          alt={selectedCourse.title}
                          className="w-24 h-16 object-cover rounded-lg border border-border"
                        />
                      ) : (
                        <div className="w-24 h-16 bg-bg-secondary rounded-lg border border-border flex items-center justify-center">
                          <span className="text-xs text-text-placeholder">{getText('noThumbnail')}</span>
                        </div>
                      )}
                    </div>
                    {/* 과정 정보 */}
                    <div className="flex-1">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        {selectedCourse.level && (
                          <div>
                            <span className="text-text-secondary">{getText('programLevel')}: </span>
                            <span className="text-text-primary">
                              {COURSE_LEVEL_LABELS[selectedCourse.level]}
                            </span>
                          </div>
                        )}
                        {selectedCourse.type && (
                          <div>
                            <span className="text-text-secondary">{getText('programType')}: </span>
                            <span className="text-text-primary">
                              {COURSE_TYPE_LABELS[selectedCourse.type]}
                            </span>
                          </div>
                        )}
                        {selectedCourse.estimatedHours && (
                          <div>
                            <span className="text-text-secondary">{getText('estimatedHours')}: </span>
                            <span className="text-text-primary">
                              {selectedCourse.estimatedHours} {getText('hours')}
                            </span>
                          </div>
                        )}
                        {/* Owner 정보 */}
                        <div>
                          <span className="text-text-secondary">{getText('owner')}: </span>
                          <span className="text-text-primary">
                            {selectedCourse.ownerName || getText('noOwner')}
                          </span>
                        </div>
                      </div>
                      {/* 권장 운영기간 */}
                      {(selectedCourse.courseStartDate || selectedCourse.courseEndDate) && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <span className="text-text-secondary">{getText('recommendedPeriod')}: </span>
                          <span className="text-text-primary font-medium">
                            {selectedCourse.courseStartDate && selectedCourse.courseEndDate
                              ? `${selectedCourse.courseStartDate} ~ ${selectedCourse.courseEndDate}`
                              : selectedCourse.courseStartDate || selectedCourse.courseEndDate || getText('noRecommendedPeriod')}
                          </span>
                        </div>
                      )}
                      {selectedCourse.description && (
                        <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                          {selectedCourse.description}
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
              {/* 진행 방식 - RadioOptionCard */}
              <div className="space-y-3">
                <Label>{getText('deliveryType')}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {([
                    { value: 'ONLINE' as DeliveryType, icon: Video, iconBg: designTokens.badge.blue.bg, iconColor: designTokens.badge.blue.text },
                    { value: 'OFFLINE' as DeliveryType, icon: MapPin, iconBg: designTokens.badge.orange.bg, iconColor: designTokens.badge.orange.text },
                    { value: 'BLENDED' as DeliveryType, icon: Layers, iconBg: designTokens.badge.indigo.bg, iconColor: designTokens.badge.indigo.text },
                    { value: 'LIVE' as DeliveryType, icon: Radio, iconBg: designTokens.badge.red.bg, iconColor: designTokens.badge.red.text },
                  ]).map(({ value, icon, iconBg, iconColor }) => (
                    <RadioOptionCard
                      key={value}
                      name="deliveryType"
                      value={value}
                      label={DELIVERY_TYPE_LABELS[value]}
                      description={DELIVERY_TYPE_DESCRIPTIONS[value]}
                      isSelected={formData.deliveryType === value}
                      onChange={(v) => handleDeliveryTypeChange(v as DeliveryType)}
                      icon={icon}
                      iconBg={iconBg}
                      iconColor={iconColor}
                    />
                  ))}
                </div>
              </div>

              {/* 운영 정보: 정원 + 장소 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">{getText('capacity')}</Label>
                    <div className="relative">
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        placeholder={getText('capacityPlaceholder')}
                        value={formData.capacity ?? ''}
                        onChange={(e) =>
                          handleInputChange('capacity', e.target.value ? parseInt(e.target.value) : null)
                        }
                        className={cn(
                          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                          formData.capacity && 'pr-8 text-right'
                        )}
                      />
                      {formData.capacity && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary pointer-events-none">
                          명
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">{getText('capacityHint')}</p>
                  </div>

                  {/* 장소 (오프라인/블렌디드인 경우) */}
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
              </div>

              {/* 수강 신청 방식 - RadioOptionCard */}
              <div className="space-y-3">
                <Label>{getText('enrollmentMethod')}</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {([
                    { value: 'FIRST_COME' as EnrollmentMethod, icon: Users, iconBg: designTokens.badge.green.bg, iconColor: designTokens.badge.green.text },
                    { value: 'APPROVAL' as EnrollmentMethod, icon: CheckCircle, iconBg: designTokens.badge.blue.bg, iconColor: designTokens.badge.blue.text },
                    { value: 'INVITE_ONLY' as EnrollmentMethod, icon: Mail, iconBg: designTokens.badge.purple.bg, iconColor: designTokens.badge.purple.text },
                  ]).map(({ value, icon, iconBg, iconColor }) => (
                    <RadioOptionCard
                      key={value}
                      name="enrollmentMethod"
                      value={value}
                      label={ENROLLMENT_METHOD_LABELS[value]}
                      description={ENROLLMENT_METHOD_DESCRIPTIONS[value]}
                      isSelected={formData.enrollmentMethod === value}
                      onChange={(v) => handleInputChange('enrollmentMethod', v as EnrollmentMethod)}
                      icon={icon}
                      iconBg={iconBg}
                      iconColor={iconColor}
                    />
                  ))}
                </div>
              </div>

              {/* 학습 기간 유형 - RadioOptionCard (비활성화 옵션 포함) */}
              <div className="space-y-3">
                <Label>학습 기간 유형</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {([
                    { value: 'FIXED' as DurationType, icon: CalendarDays, iconBg: designTokens.badge.indigo.bg, iconColor: designTokens.badge.indigo.text },
                    { value: 'RELATIVE' as DurationType, icon: Clock, iconBg: designTokens.badge.blue.bg, iconColor: designTokens.badge.blue.text },
                    { value: 'UNLIMITED' as DurationType, icon: Infinity, iconBg: designTokens.badge.green.bg, iconColor: designTokens.badge.green.text },
                  ]).map(({ value, icon, iconBg, iconColor }) => {
                    const { disabled, reason } = getDurationTypeDisabled(value);
                    return (
                      <RadioOptionCard
                        key={value}
                        name="durationType"
                        value={value}
                        label={DURATION_TYPE_LABELS[value]}
                        description={DURATION_TYPE_DESCRIPTIONS[value]}
                        isSelected={formData.durationType === value}
                        onChange={(v) => handleInputChange('durationType', v as DurationType)}
                        icon={icon}
                        iconBg={iconBg}
                        iconColor={iconColor}
                        disabled={disabled}
                        disabledMessage={reason}
                      />
                    );
                  })}
                </div>

                {/* 클라이언트 검증 결과 표시 - 학습 기간 유형 바로 아래에 배치 */}
                {!clientValidationResult.valid && (
                  <ValidationResultDisplay validationResult={clientValidationResult} variant="alert" />
                )}
              </div>

              {/* 모집 기간 - Card로 그룹화 */}
              <div className="bg-bg-secondary rounded-lg p-5 border border-border">
                <div className="flex items-center gap-2 text-text-primary mb-4">
                  <Calendar size={20} />
                  <h3 className="font-medium m-0">{getText('enrollmentPeriod')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between h-5">
                      <Label>{getText('enrollStartDate')} *</Label>
                    </div>
                    <DatePicker
                      date={parseDate(formData.enrollStartDate)}
                      onDateChange={(date) => handleInputChange('enrollStartDate', formatDate(date))}
                      placeholder="모집 시작일 선택"
                      className={cn('w-full', errors.enrollStartDate && 'border-status-error')}
                    />
                    {errors.enrollStartDate && (
                      <p className="text-sm text-status-error">{errors.enrollStartDate}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <Label>
                        {getText('enrollEndDate')} {!isAlwaysOpen && '*'}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={isAlwaysOpen}
                          onCheckedChange={handleAlwaysOpenToggle}
                        />
                        <span className="text-sm text-text-secondary">{getText('alwaysOpen')}</span>
                      </div>
                    </div>
                    {isAlwaysOpen ? (
                      <div className="flex items-center h-9 px-3 rounded-md border border-border bg-bg-subtle text-text-secondary text-sm">
                        수시 모집 (종료일 없음)
                      </div>
                    ) : (
                      <DatePicker
                        date={parseDate(formData.enrollEndDate)}
                        onDateChange={(date) => handleInputChange('enrollEndDate', formatDate(date))}
                        placeholder="모집 종료일 선택"
                        className={cn('w-full', errors.enrollEndDate && 'border-status-error')}
                      />
                    )}
                    {errors.enrollEndDate && (
                      <p className="text-sm text-status-error">{errors.enrollEndDate}</p>
                    )}
                  </div>
                </div>

                {/* 모집 시작일이 오늘이거나 이미 지났으면 안내 메시지 표시 */}
                {formData.enrollStartDate && (
                  isToday(parseISO(formData.enrollStartDate)) ? (
                    <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-md bg-status-info_background text-status-info_text text-sm">
                      <Info size={16} className="flex-shrink-0" />
                      <span>모집 시작일이 오늘입니다. 생성 즉시 <strong>모집중</strong> 상태로 시작됩니다.</span>
                    </div>
                  ) : isBefore(parseISO(formData.enrollStartDate), startOfDay(new Date())) ? (
                    <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-md bg-status-warning_background text-status-warning_text text-sm">
                      <Info size={16} className="flex-shrink-0" />
                      <span>모집 시작일이 이미 지났습니다. 생성 즉시 <strong>모집중</strong> 상태로 시작됩니다.</span>
                    </div>
                  ) : null
                )}
              </div>

              {/* 학습 기간 - Card로 그룹화, DurationType별 조건부 렌더링 */}
              <div className="bg-bg-secondary rounded-lg p-5 border border-border">
                <div className="flex items-center gap-2 text-text-primary mb-4">
                  <Clock size={20} />
                  <h3 className="font-medium m-0">{getText('learningPeriod')}</h3>
                </div>

                {/* FIXED: 시작일 + 종료일 (총 일수 자동 계산) */}
                {formData.durationType === 'FIXED' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{getText('classStartDate')} *</Label>
                      <DatePicker
                        date={parseDate(formData.classStartDate)}
                        onDateChange={(date) => handleInputChange('classStartDate', formatDate(date))}
                        placeholder="학습 시작일 선택"
                        fromDate={addDays(new Date(), 1)}
                        className={cn('w-full', errors.classStartDate && 'border-status-error')}
                      />
                      {errors.classStartDate && (
                        <p className="text-sm text-status-error">{errors.classStartDate}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>{getText('classEndDate')} *</Label>
                      <DatePicker
                        date={parseDate(formData.classEndDate)}
                        onDateChange={(date) => handleInputChange('classEndDate', formatDate(date))}
                        placeholder="학습 종료일 선택"
                        className={cn('w-full', errors.classEndDate && 'border-status-error')}
                      />
                      {errors.classEndDate && (
                        <p className="text-sm text-status-error">{errors.classEndDate}</p>
                      )}
                    </div>
                    {/* 총 수강 일수 표시 */}
                    {formData.classStartDate && formData.classEndDate && formData.durationDays && (
                      <div className="col-span-full">
                        <div className="bg-bg-brand-active/10 rounded-lg px-4 py-2 border border-action-primary/30">
                          <span className="text-sm text-text-secondary">
                            총 수강 일수:{' '}
                          </span>
                          <span className="text-sm font-medium text-action-primary">
                            {formData.durationDays}일
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* RELATIVE: 차수 오픈일 + 수강 일수 입력 */}
                {formData.durationType === 'RELATIVE' && (
                  <div className="space-y-4">
                    {/* 안내 메시지 - 시각적 강조 */}
                    <div className="flex gap-3 p-4 rounded-lg bg-badge-blue-bg border border-badge-blue/30">
                      <Info size={20} className="flex-shrink-0 text-badge-blue mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-medium text-text-primary">수강 신청일 기준 개별 적용</p>
                        <p className="text-sm text-text-secondary">
                          수강생마다 본인의 <strong className="text-badge-blue">수강 신청일</strong>로부터 지정된 수강 일수 동안 학습할 수 있습니다.
                        </p>
                        <p className="text-xs text-text-placeholder">
                          예: 30일 설정 시, 1월 10일 신청자는 2월 9일까지 / 1월 20일 신청자는 2월 19일까지
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>{getText('classStartDate')} *</Label>
                        <DatePicker
                          date={parseDate(formData.classStartDate)}
                          onDateChange={(date) => handleInputChange('classStartDate', formatDate(date))}
                          placeholder="차수 오픈일 선택"
                          fromDate={addDays(new Date(), 1)}
                          className={cn('w-full', errors.classStartDate && 'border-status-error')}
                        />
                        <p className="text-xs text-text-secondary">이 날짜부터 수강 신청이 가능합니다</p>
                        {errors.classStartDate && (
                          <p className="text-sm text-status-error">{errors.classStartDate}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="durationDays">수강 일수 *</Label>
                        <div className="relative">
                          <Input
                            id="durationDays"
                            type="number"
                            min="1"
                            placeholder="30"
                            value={formData.durationDays || ''}
                            onChange={(e) => handleInputChange('durationDays', e.target.value ? parseInt(e.target.value) : null)}
                            className={cn(
                              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
                              formData.durationDays && 'pr-8 text-right',
                              errors.durationDays && 'border-status-error'
                            )}
                          />
                          {formData.durationDays && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary pointer-events-none">
                              일
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary">수강 신청일로부터 학습 가능한 기간</p>
                        {errors.durationDays && (
                          <p className="text-sm text-status-error">{errors.durationDays}</p>
                        )}
                        {selectedCourse?.estimatedHours && (
                          <p className="text-sm text-text-secondary">
                            예상 학습 시간({selectedCourse.estimatedHours}시간) 기준 권장: {Math.ceil(selectedCourse.estimatedHours / 8)}일
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* UNLIMITED: 시작일만 */}
                {formData.durationType === 'UNLIMITED' && (
                  <div className="space-y-4">
                    <div className="space-y-2 md:w-1/2">
                      <Label>{getText('classStartDate')} *</Label>
                      <DatePicker
                        date={parseDate(formData.classStartDate)}
                        onDateChange={(date) => handleInputChange('classStartDate', formatDate(date))}
                        placeholder="학습 시작일 선택"
                        fromDate={addDays(new Date(), 1)}
                        className={cn('w-full', errors.classStartDate && 'border-status-error')}
                      />
                      {errors.classStartDate && (
                        <p className="text-sm text-status-error">{errors.classStartDate}</p>
                      )}
                    </div>
                    <div className="bg-bg-subtle rounded-lg p-4 border border-border">
                      <p className="text-sm text-text-secondary">
                        무제한 학습 방식은 종료일 없이 수강생이 원하는 기간 동안 학습할 수 있습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 정기 수업 일정 (FIXED + OFFLINE/BLENDED/LIVE만) */}
              {formData.durationType === 'FIXED' &&
               ['OFFLINE', 'BLENDED', 'LIVE'].includes(formData.deliveryType) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={hasSchedule}
                      onCheckedChange={setHasSchedule}
                    />
                    <div>
                      <span className="font-medium text-text-primary">정기 수업 일정 설정</span>
                      <p className="text-sm text-text-secondary mt-0.5">
                        반복되는 수업 일정이 있는 경우 요일과 시간을 지정하세요
                      </p>
                    </div>
                  </div>

                  {hasSchedule && (
                    <div className="pl-7 space-y-4">
                      {/* 요일 선택 - ToggleGroup으로 접근성 확보 */}
                      <div className="space-y-2">
                        <Label>수업 요일 *</Label>
                        <ToggleGroup
                          type="multiple"
                          value={selectedDays.map(String)}
                          onValueChange={(values) => setSelectedDays(values.map(Number) as DayOfWeek[])}
                          className="justify-start gap-1"
                        >
                          {([1, 2, 3, 4, 5, 6, 0] as DayOfWeek[]).map((day) => (
                            <ToggleGroupItem
                              key={day}
                              value={String(day)}
                              className={cn(
                                'w-11 h-11 font-medium text-sm',
                                '!rounded-lg', // 기본 first/last rounded 오버라이드
                                'data-[state=on]:bg-action-primary data-[state=on]:text-white data-[state=on]:border-action-primary',
                                'data-[state=off]:bg-bg-default data-[state=off]:text-text-primary data-[state=off]:border-border',
                                'hover:bg-bg-secondary hover:border-action-primary/50',
                                'border transition-colors'
                              )}
                            >
                              {DAY_OF_WEEK_LABELS[day]}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                        {selectedDays.length === 0 && (
                          <p className="text-sm text-text-secondary">최소 1개 이상의 요일을 선택하세요</p>
                        )}
                      </div>

                      {/* 시간 입력 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>시작 시간 *</Label>
                          <TimePicker
                            value={scheduleStartTime}
                            onChange={setScheduleStartTime}
                            placeholder="시작 시간 선택"
                            interval={30}
                            minTime="06:00"
                            maxTime="22:00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>종료 시간 *</Label>
                          <TimePicker
                            value={scheduleEndTime}
                            onChange={setScheduleEndTime}
                            placeholder="종료 시간 선택"
                            interval={30}
                            minTime="06:00"
                            maxTime="23:00"
                          />
                        </div>
                      </div>

                      {/* 공휴일 제외 옵션 */}
                      <div className="flex items-center gap-3 p-3 bg-bg-subtle rounded-lg border border-border">
                        <Switch
                          checked={excludeHolidays}
                          onCheckedChange={setExcludeHolidays}
                        />
                        <div>
                          <span className="font-medium text-text-primary">공휴일 제외</span>
                          <p className="text-sm text-text-secondary mt-0.5">
                            공휴일에는 수업을 진행하지 않습니다
                          </p>
                        </div>
                      </div>

                      {/* 미리보기 */}
                      {selectedDays.length > 0 && scheduleStartTime && scheduleEndTime && (
                        <div className="bg-bg-brand-active/10 rounded-lg px-4 py-3 border border-action-primary/30">
                          <p className="text-sm text-text-secondary mb-1">수업 일정 미리보기</p>
                          <p className="text-sm font-medium text-action-primary">
                            매주 {[...selectedDays].sort((a, b) => ((a || 7) - (b || 7))).map((d) => DAY_OF_WEEK_LABELS[d]).join(', ')} {scheduleStartTime} ~ {scheduleEndTime}
                            {excludeHolidays && ' (공휴일 제외)'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 중간 합류 허용 - 모든 DeliveryType에서 선택 가능 (B2B 유연성 확보) */}
              {/* UNLIMITED + 정원 무제한인 경우에만 비활성화 (항상 합류 가능하므로) */}
              {(() => {
                const isUnlimitedWithNoCapacity = formData.durationType === 'UNLIMITED' && !formData.capacity;
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 rounded-lg border bg-bg-subtle border-border">
                      <Switch
                        checked={isUnlimitedWithNoCapacity ? true : (formData.allowLateEnrollment ?? false)}
                        onCheckedChange={(checked) => handleInputChange('allowLateEnrollment', checked)}
                        disabled={isUnlimitedWithNoCapacity}
                        className={isUnlimitedWithNoCapacity ? "opacity-50" : ""}
                      />
                      <div>
                        <span className="font-medium text-text-primary">
                          {isUnlimitedWithNoCapacity ? '중간 합류 항상 가능' : getText('allowLateEnrollment')}
                        </span>
                        <p className="text-sm mt-0.5 text-text-primary">
                          {isUnlimitedWithNoCapacity
                            ? '학습 종료일과 정원 제한이 없어 언제든 합류 가능합니다'
                            : getText('allowLateEnrollmentHint')
                          }
                        </p>
                      </div>
                    </div>

                    {/* 중간 합류 허용 시 안내 메시지 */}
                    {formData.allowLateEnrollment && !isUnlimitedWithNoCapacity && (
                      <div className="flex gap-3 p-4 rounded-lg bg-badge-blue-bg border border-badge-blue/30">
                        <Info size={20} className="flex-shrink-0 text-badge-blue mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-medium text-text-primary">학습 진행 중에도 신규 수강생 등록 가능</p>
                          <p className="text-sm text-text-secondary">
                            학습 기간이 시작된 후에도 새로운 수강생이 <strong className="text-badge-blue">중도 등록</strong>하여 학습에 참여할 수 있습니다.
                            단, <strong className="text-text-primary">정원이 꽉 찬 경우 중간 합류가 불가능</strong>합니다.
                          </p>
                          <p className="text-xs text-text-placeholder">
                            {formData.durationType === 'UNLIMITED'
                              ? '예: 정원 30명 중 빈 자리가 있으면 언제든 등록 가능'
                              : '예: 1월 1일~31일 차수에 1월 15일 신청자도 등록 가능 (정원 여유 시, 남은 기간 동안 학습)'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

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

          {/* Step 3: 평가 기준 */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-8">
              {/* 수료 기준 */}
              <div className="space-y-4">
                <div>
                  <Label>{getText('minProgress')} *</Label>
                  <p className="text-sm text-text-secondary mt-1">{getText('minProgressHint')}</p>
                </div>

                {/* 프리셋 버튼 */}
                <div className="flex gap-2">
                  {[80, 90, 100].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleInputChange('minProgressForCompletion', value)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
                        formData.minProgressForCompletion === value
                          ? 'border-action-primary bg-bg-brand-active/10 text-action-primary'
                          : 'border-border text-text-secondary hover:border-action-primary/50'
                      )}
                    >
                      {value}%
                    </button>
                  ))}
                </div>

                {/* 슬라이더 + 숫자 입력 */}
                <div className="bg-bg-subtle rounded-lg p-4 border border-border">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-text-secondary">{getText('completionRate')}</span>
                    <div className="flex items-center gap-1">
                      <Input
                        id="minProgressForCompletion"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.minProgressForCompletion}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          handleInputChange('minProgressForCompletion', Math.min(100, Math.max(0, val)));
                        }}
                        className="w-16 h-8 text-center text-sm"
                      />
                      <span className="text-text-secondary">%</span>
                    </div>
                  </div>
                  {/* 커스텀 슬라이더 */}
                  <div className="relative h-5 flex items-center">
                    {/* 트랙 배경 */}
                    <div className="absolute inset-x-0 h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-btn-brand rounded-full"
                        style={{ width: `${formData.minProgressForCompletion}%` }}
                      />
                    </div>
                    {/* 슬라이더 핸들 */}
                    <div
                      className="absolute w-5 h-5 bg-btn-brand rounded-full shadow-md border-2 border-white pointer-events-none"
                      style={{ left: `calc(${formData.minProgressForCompletion}% - 10px)` }}
                    />
                    {/* 투명 range input - 전체 영역 커버 */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.minProgressForCompletion}
                      onChange={(e) => handleInputChange('minProgressForCompletion', parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 가격 설정 - TODO: 테넌트 옵션으로 ON/OFF */}
              <div className="space-y-4">
                <div>
                  <Label>{getText('priceType')}</Label>
                </div>

                {/* 무료/유료 라디오 버튼 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
                      formData.isFree
                        ? 'border-action-primary bg-bg-brand-active/10'
                        : 'border-border hover:border-action-primary/50'
                    )}
                  >
                    <input
                      type="radio"
                      name="priceType"
                      checked={formData.isFree}
                      onChange={() => {
                        handleInputChange('isFree', true);
                        handleInputChange('price', '0');
                      }}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-text-primary">{getText('free')}</span>
                      <p className="text-sm text-text-secondary mt-0.5">{getText('freeHint')}</p>
                    </div>
                  </label>
                  <label
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
                      !formData.isFree
                        ? 'border-action-primary bg-bg-brand-active/10'
                        : 'border-border hover:border-action-primary/50'
                    )}
                  >
                    <input
                      type="radio"
                      name="priceType"
                      checked={!formData.isFree}
                      onChange={() => handleInputChange('isFree', false)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-text-primary">{getText('paid')}</span>
                      <p className="text-sm text-text-secondary mt-0.5">{getText('paidHint')}</p>
                    </div>
                  </label>
                </div>

                {/* 유료 선택 시 금액 입력 */}
                {!formData.isFree && (
                  <div className="space-y-2 md:w-1/2 pl-7">
                    <Label htmlFor="price">{getText('priceAmount')} *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="1"
                      placeholder="10000"
                      value={formData.price === '0' ? '' : formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value || '0')}
                    />
                  </div>
                )}
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
              {selectedCourse?.ownerId && (
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
                          {selectedCourse.ownerName} ({selectedCourse.ownerEmail})
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

          {/* Step 5: 수강생 선발 (INVITE_ONLY 선택 시만) */}
          {currentStep === 5 && formData.enrollmentMethod === 'INVITE_ONLY' && (
            <div className="flex flex-col gap-6">
              {/* 헤더 */}
              <div className="flex items-center gap-2">
                <Users size={20} className="text-text-secondary" />
                <h3 className="font-medium text-text-primary m-0">
                  {getText('userAssignment')} {getText('userAssignmentOptional')}
                </h3>
              </div>

              {/* 안내 메시지 + 건너뛰기 버튼 */}
              <div className="bg-badge-purple-bg border border-badge-purple/30 rounded-lg p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Info size={20} className="flex-shrink-0 text-badge-purple mt-0.5" />
                    <div>
                      <p className="font-medium text-text-primary">{getText('userAssignmentHint')}</p>
                      <p className="text-sm text-text-secondary mt-1">{getText('userAssignmentLater')}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSelectedUserIds([]);
                      setEnrollReason('');
                      handleSubmit();
                    }}
                    disabled={createTime.isPending || forceEnroll.isPending}
                    className="flex-shrink-0 bg-white border border-border text-text-primary hover:bg-bg-secondary"
                  >
                    {getText('skip')}
                  </Button>
                </div>
              </div>

              {/* 사용자 검색 및 필터 */}
              <div className="space-y-3">
                <Label>{getText('selectUsersToEnroll')}</Label>
                <div className="flex gap-3">
                  {/* 검색 */}
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder"
                    />
                    <Input
                      type="text"
                      placeholder={getText('searchUserPlaceholder')}
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {/* 부서 필터 - 데이터 있을 때만 표시 */}
                  {departments.length > 0 && (
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger size="sm" className="w-[120px]">
                        <SelectValue placeholder={getText('allDepartments')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{getText('allDepartments')}</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {/* 직급 필터 - 데이터 있을 때만 표시 */}
                  {positions.length > 0 && (
                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                      <SelectTrigger size="sm" className="w-[100px]">
                        <SelectValue placeholder={getText('allPositions')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{getText('allPositions')}</SelectItem>
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* 사용자 목록 (체크박스) */}
              <div className="border border-border rounded-lg max-h-[300px] overflow-auto">
                {isLoadingAllUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-text-secondary" />
                  </div>
                ) : availableUsers.length === 0 ? (
                  <div className="text-center py-8 text-text-secondary">
                    <Users size={32} className="mx-auto mb-2 text-text-placeholder" />
                    <p className="text-sm">검색 결과가 없습니다</p>
                  </div>
                ) : (
                  availableUsers.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-bg-secondary cursor-pointer border-b border-border last:border-0 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUserIds([...selectedUserIds, user.id]);
                          } else {
                            setSelectedUserIds(selectedUserIds.filter((id) => id !== user.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-border accent-btn-brand"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                          {(user.department || user.position) && (
                            <span className="text-xs text-text-placeholder">
                              {[user.department, user.position].filter(Boolean).join(' · ')}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary truncate">{user.email}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>

              {/* 선택된 사용자 수 표시 */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {selectedUserIds.length > 0 ? (
                    <>
                      <span className="font-medium text-text-primary">{selectedUserIds.length}</span>
                      {getText('selectedUsersCount')}
                    </>
                  ) : (
                    getText('noUsersSelected')
                  )}
                </span>
                {selectedUserIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedUserIds([])}
                    className="text-text-secondary hover:text-status-error transition-colors"
                  >
                    전체 해제
                  </button>
                )}
              </div>

              {/* 배정 사유 (선택) */}
              <div className="space-y-2">
                <Label>{getText('enrollReason')}</Label>
                <Textarea
                  value={enrollReason}
                  onChange={(e) => setEnrollReason(e.target.value)}
                  placeholder={getText('enrollReasonPlaceholder')}
                  rows={2}
                />
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
              <Button
                onClick={handleSubmit}
                disabled={createTime.isPending || forceEnroll.isPending || !clientValidationResult.valid}
              >
                {(createTime.isPending || forceEnroll.isPending) ? (
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
