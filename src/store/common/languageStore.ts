import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'ko' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'ko', // 기본값: 한국어
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => {
        const newLang = get().language === 'ko' ? 'en' : 'ko';
        set({ language: newLang });
      },
    }),
    {
      name: 'language-storage',
    }
  )
);

// 번역 타입
type TranslationKeys = {
  // 공통
  common: {
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    view: string;
    search: string;
    loading: string;
    noData: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    logout: string;
    login: string;
    signup: string;
    darkMode: string;
    lightMode: string;
    comingSoon: string;
  };
  // 마이페이지
  mypage: {
    title: string;
    profile: string;
    profileAndSecurity: string;
    profileDescription: string;
    learningStatus: string;
    inProgress: string;
    completed: string;
    completedDesc: string;
    completedCourses: string;
    completedComingSoon: string;
    pending: string;
    dropped: string;
    total: string;
    recentLearning: string;
    viewAll: string;
    quickMenu: string;
    myLearning: string;
    myLearningDesc: string;
    certificates: string;
    certificatesDesc: string;
    certificatesList: string;
    certificatesComingSoon: string;
    profileSecurityDesc: string;
    notifications: string;
    notificationsDesc: string;
    languageRegion: string;
    languageRegionDesc: string;
    learningProgress: string;
    learningProgressDesc: string;
    noEnrolledCourses: string;
    noEnrolledCoursesDesc: string;
    browseCourses: string;
    editProfile: string;
    hello: string;
    generalMember: string;
  };
  // 내 강의 관리
  teaching: {
    title: string;
    description: string;
    createCourse: string;
    newCourse: string;
    noCourses: string;
    noCoursesDesc: string;
    courseNotice: string;
    courseNoticeDesc: string;
    grantPermission: string;
    grantPermissionDesc: string;
    grantPermissionConfirm: string;
    grantPermissionWarning: string;
    granting: string;
    designer: string;
    draft: string;
    pendingApproval: string;
    approved: string;
    rejected: string;
    students: string;
    lastModified: string;
    stats: string;
    statsDesc: string;
    statsOverview: string;
    statsComingSoon: string;
    courseDesignTitle: string;
    navigateConfirm: string;
    proceed: string;
    // Owner Stats
    totalPrograms: string;
    totalCourseTimes: string;
    totalStudents: string;
    enrollmentStats: string;
    totalEnrollments: string;
    completed: string;
    inProgress: string;
    dropped: string;
    failed: string;
    averageCompletionRate: string;
    completionRate: string;
    programStats: string;
    noProgramStats: string;
    noProgramStatsDesc: string;
    courseTimes: string;
  };
  // 프로필 및 보안
  profileSecurity: {
    title: string;
    description: string;
    profileInfo: string;
    profileImage: string;
    imageGuide: string;
    imageClickGuide: string;
    name: string;
    email: string;
    joinDate: string;
    passwordChange: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    passwordMinLength: string;
    changePassword: string;
    coursePermission: string;
    currentPermissionStatus: string;
    generalUser: string;
    courseCreationEnabled: string;
    fullAccess: string;
    permissionRequestDesc: string;
    requestPermission: string;
    permissionEnabled: string;
    accountManagement: string;
    accountDeleteWarning: string;
    withdraw: string;
    withdrawTitle: string;
    withdrawDesc: string;
    withdrawConfirm: string;
    processing: string;
  };
  // 설정
  settings: {
    title: string;
    language: string;
    languageDesc: string;
    selectLanguage: string;
    korean: string;
    english: string;
    notificationsDesc: string;
    notificationSettings: string;
    notificationsComingSoon: string;
  };
  // 랜딩 페이지
  landing: {
    banner: string;
    closeBanner: string;
    searchPlaceholder: string;
    switchToDark: string;
    switchToLight: string;
    openMenu: string;
    mypage: string;
    createCourse: string;
    settings: string;
    profileSecurity: string;
    notifications: string;
    languageRegion: string;
    // 카테고리
    all: string;
    cloud: string;
    dev: string;
    ai: string;
    data: string;
    security: string;
    devops: string;
    // 섹션 타이틀
    featuredCourses: string;
    featuredCoursesDesc: string;
    newCourses: string;
    newCoursesDesc: string;
    beginnerCourses: string;
    beginnerCoursesDesc: string;
    viewAll: string;
    noCoursesInCategory: string;
    relatedCourses: string;
    // 태그
    tagNew: string;
    tagBest: string;
    tagSale: string;
  };
  // 히어로 섹션
  hero: {
    getStarted: string;
    explore: string;
    prevSlide: string;
    nextSlide: string;
    goToSlide: string;
    // 슬라이드 1
    slide1Subtitle: string;
    slide1Desc: string;
    // 슬라이드 2
    slide2Subtitle: string;
    slide2Desc: string;
    // 슬라이드 3
    slide3Subtitle: string;
    slide3Desc: string;
  };
  // 푸터
  footer: {
    company: string;
    ceo: string;
    businessNo: string;
    address: string;
    phone: string;
    privacyPolicy: string;
    terms: string;
    emailPolicy: string;
    copyright: string;
  };
  // 카탈로그
  catalog: {
    title: string;
    description: string;
    searchPlaceholder: string;
    filter: string;
    difficulty: string;
    beginner: string;
    intermediate: string;
    advanced: string;
    totalCourses: string;
    courses: string;
    loadError: string;
    noCourses: string;
    changeFilter: string;
    hours: string;
    minutes: string;
    students: string;
    enrolled: string;
    backToCatalog: string;
    courseNotFound: string;
    courseNotFoundDesc: string;
    courseIntro: string;
    availableSessions: string;
    closed: string;
    enrollmentPeriod: string;
    processing: string;
    closedStatus: string;
    notAvailable: string;
    enroll: string;
    noAvailableSessions: string;
    enrollSuccess: string;
    enrollFail: string;
  };
  // 학습
  learning: {
    title: string;
    enrolledCourses: string;
    description: string;
    searchPlaceholder: string;
    filter: string;
    enrollmentStatus: string;
    statusPending: string;
    statusApproved: string;
    statusRejected: string;
    statusCancelled: string;
    statusCompleted: string;
    progress: string;
    continueLearning: string;
    totalEnrollments: string;
    enrollments: string;
    loadError: string;
    noEnrollments: string;
    noEnrollmentsDesc: string;
    browseCourses: string;
    backToLearning: string;
    enrollmentNotFound: string;
    learningProgress: string;
    completed: string;
    curriculum: string;
    cancelEnrollment: string;
    cancelConfirmTitle: string;
    cancelConfirmDesc: string;
    minutes: string;
    enrollmentPeriod: string;
    enrolledDate: string;
  };
  // 학습 플레이어
  player: {
    backToCourse: string;
    previous: string;
    next: string;
    markComplete: string;
    autoSaved: string;
    saveFailed: string;
    loading: string;
    error: string;
    retry: string;
    skipToNext: string;
    completed: string;
    curriculum: string;
    selectContent: string;
    defaultTitle: string;
    demoModeBanner: string;
  };
};

// 한국어 번역
const ko: TranslationKeys = {
  common: {
    save: '저장',
    cancel: '취소',
    confirm: '확인',
    delete: '삭제',
    edit: '수정',
    view: '보기',
    search: '검색',
    loading: '로딩 중...',
    noData: '데이터가 없습니다',
    error: '오류가 발생했습니다',
    success: '성공',
    warning: '경고',
    info: '정보',
    logout: '로그아웃',
    login: '로그인',
    signup: '회원가입',
    darkMode: '다크 모드',
    lightMode: '라이트 모드',
    comingSoon: '개발 예정',
  },
  mypage: {
    title: '마이페이지',
    profile: '프로필',
    profileAndSecurity: '프로필 및 보안',
    profileDescription: '프로필 정보를 수정하고 프로필 이미지를 변경하세요',
    learningStatus: '학습 현황',
    inProgress: '수강 중',
    completed: '완료한 강의',
    completedDesc: '완료한 강의 목록을 확인하세요',
    completedCourses: '완료한 강의',
    completedComingSoon: '완료한 강의 기능은 현재 개발 중입니다. 곧 완료한 강의 목록과 수료증을 확인할 수 있습니다.',
    pending: '승인 대기',
    dropped: '중도 포기',
    total: '전체',
    recentLearning: '최근 학습',
    viewAll: '전체보기',
    quickMenu: '빠른 메뉴',
    myLearning: '내 학습',
    myLearningDesc: '수강 중인 강의를 확인하세요',
    certificates: '수료증',
    certificatesDesc: '취득한 수료증을 확인하세요',
    certificatesList: '인증서 목록',
    certificatesComingSoon: '인증서 기능은 현재 개발 중입니다. 곧 취득한 인증서를 확인하고 다운로드할 수 있습니다.',
    profileSecurityDesc: '프로필 정보 및 보안 설정',
    notifications: '알림 설정',
    notificationsDesc: '알림 설정을 관리하세요',
    languageRegion: '언어 및 지역',
    languageRegionDesc: '언어 및 지역 설정을 변경하세요',
    learningProgress: '학습 진도',
    learningProgressDesc: '전체 학습 진도를 확인하세요',
    noEnrolledCourses: '수강 중인 강의가 없습니다',
    noEnrolledCoursesDesc: '새로운 강의를 찾아 학습을 시작해보세요',
    browseCourses: '강의 둘러보기',
    editProfile: '프로필 수정',
    hello: '님, 안녕하세요!',
    generalMember: '일반 회원',
  },
  teaching: {
    title: '내 강의 관리',
    description: '개설한 강의를 관리하고 새 강의를 만들어보세요',
    createCourse: '강의 개설하기',
    newCourse: '새 강의 개설',
    noCourses: '개설한 강의가 없습니다',
    noCoursesDesc: '아직 개설한 강의가 없습니다. 새로운 강의를 만들어 학습자들과 지식을 나눠보세요.',
    courseNotice: '강의 개설 안내',
    courseNoticeDesc: '강의 개설 정보와 강의 내용의 적합성은 운영진의 판단하에 강의 개설 승인이 이루어집니다. 승인까지 영업일 기준 3~5일이 소요될 수 있습니다.',
    grantPermission: '강의 개설 권한 부여',
    grantPermissionDesc: '강의를 개설하려면 강의 설계자(Designer) 권한이 필요합니다. 강의 설계 / 개설 페이지로 이동하시겠습니까?',
    grantPermissionConfirm: '"확인"을 누르시면 자동으로 권한이 부여되며, 강의 개설 페이지로 이동합니다.',
    grantPermissionWarning: '주의사항: 강의 개설 정보와 강의 내용의 적합성은 운영진의 판단하에 강의 개설 승인이 이루어집니다. 부적절한 내용의 강의는 승인이 거부될 수 있습니다.',
    granting: '권한 부여 중...',
    designer: '강의 설계자(Designer)',
    draft: '임시저장',
    pendingApproval: '승인 대기',
    approved: '승인됨',
    rejected: '반려됨',
    students: '수강생',
    lastModified: '최종 수정',
    stats: '내 강의 통계',
    statsDesc: '내 강의의 수강생 및 학습 통계를 확인하세요',
    statsOverview: '통계 개요',
    statsComingSoon: '강의 통계 기능은 현재 개발 중입니다. 곧 수강생 현황, 학습 완료율 등 다양한 통계를 확인할 수 있습니다.',
    courseDesignTitle: '강의 설계 / 개설',
    navigateConfirm: '강의 설계 / 개설 페이지로 이동하시겠습니까?',
    proceed: '이동',
    // Owner Stats
    totalPrograms: '총 프로그램',
    totalCourseTimes: '총 차수',
    totalStudents: '총 수강생',
    enrollmentStats: '수강 현황',
    totalEnrollments: '총 수강 신청',
    completed: '수료 완료',
    inProgress: '진행 중',
    dropped: '중도 포기',
    failed: '미수료',
    averageCompletionRate: '평균 수료율',
    completionRate: '수료율',
    programStats: '프로그램별 통계',
    noProgramStats: '프로그램 통계가 없습니다',
    noProgramStatsDesc: '담당 프로그램이 없습니다. 프로그램에 강사로 배정되면 통계를 확인할 수 있습니다.',
    courseTimes: '차수',
  },
  profileSecurity: {
    title: '프로필 및 보안',
    description: '프로필 정보와 보안 설정을 관리하세요',
    profileInfo: '프로필 정보',
    profileImage: '프로필 이미지',
    imageGuide: 'JPG, PNG, GIF (최대 5MB)',
    imageClickGuide: '이미지를 클릭하여 변경하세요',
    name: '이름',
    email: '이메일',
    joinDate: '가입일',
    passwordChange: '비밀번호 변경',
    currentPassword: '현재 비밀번호',
    newPassword: '새 비밀번호',
    confirmPassword: '새 비밀번호 확인',
    passwordMinLength: '최소 8자 이상 입력해주세요',
    changePassword: '비밀번호 변경',
    coursePermission: '강의 개설 권한',
    currentPermissionStatus: '현재 권한 상태',
    generalUser: '일반 사용자',
    courseCreationEnabled: '강의 개설 가능',
    fullAccess: '전체 권한',
    permissionRequestDesc: '강의를 개설하고 콘텐츠를 등록하려면 권한을 요청해주세요.',
    requestPermission: '강의 개설 권한 요청',
    permissionEnabled: '강의 개설 및 콘텐츠 등록 권한이 활성화되었습니다.',
    accountManagement: '계정 관리',
    accountDeleteWarning: '계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.',
    withdraw: '회원 탈퇴',
    withdrawTitle: '회원 탈퇴',
    withdrawDesc: '정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.',
    withdrawConfirm: '탈퇴하기',
    processing: '처리 중...',
  },
  settings: {
    title: '설정',
    language: '언어',
    languageDesc: '사용할 언어를 선택하세요',
    selectLanguage: '언어 선택',
    korean: '한국어',
    english: 'English',
    notificationsDesc: '알림 수신 방법을 설정하세요',
    notificationSettings: '알림 설정',
    notificationsComingSoon: '알림 설정 기능은 현재 개발 중입니다. 곧 다양한 알림 옵션을 제공할 예정입니다.',
  },
  landing: {
    banner: 'MZC Learn Platform - 클라우드 교육의 새로운 시작',
    closeBanner: '배너 닫기',
    searchPlaceholder: '배우고 싶은 지식을 입력해보세요.',
    switchToDark: '다크 모드로 전환',
    switchToLight: '라이트 모드로 전환',
    openMenu: '메뉴 열기',
    mypage: '마이페이지',
    createCourse: '강의 개설하기',
    settings: '설정',
    profileSecurity: '프로필 및 보안',
    notifications: '알림',
    languageRegion: '언어 및 지역',
    all: '전체',
    cloud: '클라우드',
    dev: '개발',
    ai: 'AI',
    data: '데이터',
    security: '보안',
    devops: 'DevOps',
    featuredCourses: '지금 주목해야 할 강의',
    featuredCoursesDesc: '성장을 위한 최고의 선택',
    newCourses: '따끈따끈 신규 강의',
    newCoursesDesc: '매일 업데이트되는 새로운 배움',
    beginnerCourses: '왕초보도 할 수 있어요',
    beginnerCoursesDesc: '시작이 반! 기초부터 탄탄하게',
    viewAll: '전체보기',
    noCoursesInCategory: '해당 카테고리에 강의가 없습니다.',
    relatedCourses: '관련 강의',
    tagNew: 'NEW',
    tagBest: '베스트',
    tagSale: '할인중',
  },
  hero: {
    getStarted: '시작하기',
    explore: '둘러보기',
    prevSlide: '이전 슬라이드',
    nextSlide: '다음 슬라이드',
    goToSlide: '슬라이드로 이동',
    slide1Subtitle: '클라우드 전문가로 성장하는\n가장 빠른 길',
    slide1Desc: 'MZC Learn과 함께 시작하세요.',
    slide2Subtitle: '나만의 커리어 로드맵\n지금 설계하세요',
    slide2Desc: '초보자부터 전문가까지, 단계별 학습 가이드',
    slide3Subtitle: 'AWS, Azure, GCP\n클라우드 완전 정복',
    slide3Desc: '현직자가 알려주는 실무 클라우드 노하우',
  },
  footer: {
    company: '메가존클라우드(주)',
    ceo: '대표이사: 이주완, 조원우',
    businessNo: '사업자등록번호: 232-88-00982',
    address: '서울시 강남구 논현로85길 46 메가존빌딩',
    phone: '대표전화: 1644-2243 | Email: cloud@megazone.com',
    privacyPolicy: '개인정보처리방침',
    terms: '이용약관',
    emailPolicy: '이메일무단수집거부',
    copyright: 'MEGAZONECLOUD Corp. All rights reserved.',
  },
  catalog: {
    title: '강의 카탈로그',
    description: '수강 가능한 강의를 탐색하고 수강신청하세요',
    searchPlaceholder: '강의 검색...',
    filter: '필터',
    difficulty: '난이도',
    beginner: '입문',
    intermediate: '중급',
    advanced: '고급',
    totalCourses: '총',
    courses: '개의 강의',
    loadError: '데이터를 불러오는 중 오류가 발생했습니다.',
    noCourses: '강의가 없습니다',
    changeFilter: '검색 조건을 변경해 보세요',
    hours: '시간',
    minutes: '분',
    students: '명',
    enrolled: '명 수강',
    backToCatalog: '카탈로그로 돌아가기',
    courseNotFound: '강의를 찾을 수 없습니다',
    courseNotFoundDesc: '요청하신 강의가 존재하지 않거나 접근할 수 없습니다.',
    courseIntro: '강의 소개',
    availableSessions: '수강 가능한 차수',
    closed: '마감',
    enrollmentPeriod: '신청기간',
    processing: '처리 중...',
    closedStatus: '마감됨',
    notAvailable: '신청 불가',
    enroll: '수강신청',
    noAvailableSessions: '현재 수강 가능한 차수가 없습니다.',
    enrollSuccess: '수강신청이 완료되었습니다.',
    enrollFail: '수강신청에 실패했습니다. 다시 시도해주세요.',
  },
  learning: {
    title: '내 학습',
    enrolledCourses: '수강 중인 강의',
    description: '수강 중인 강의를 관리하고 학습을 이어가세요',
    searchPlaceholder: '강의명 검색...',
    filter: '필터',
    enrollmentStatus: '수강 상태',
    statusPending: '승인 대기',
    statusApproved: '수강 중',
    statusRejected: '반려됨',
    statusCancelled: '취소됨',
    statusCompleted: '완료',
    progress: '진도율',
    continueLearning: '학습 이어하기',
    totalEnrollments: '총',
    enrollments: '개의 수강',
    loadError: '데이터를 불러오는 중 오류가 발생했습니다.',
    noEnrollments: '수강 중인 강의가 없습니다',
    noEnrollmentsDesc: '강의 카탈로그에서 원하는 강의를 찾아 수강신청하세요',
    browseCourses: '강의 둘러보기',
    backToLearning: '내 학습으로 돌아가기',
    enrollmentNotFound: '수강 정보를 찾을 수 없습니다',
    learningProgress: '학습 진도',
    completed: '완료',
    curriculum: '커리큘럼',
    cancelEnrollment: '수강 취소',
    cancelConfirmTitle: '수강을 취소하시겠습니까?',
    cancelConfirmDesc: '수강을 취소하면 학습 진도가 모두 초기화됩니다. 이 작업은 되돌릴 수 없습니다.',
    minutes: '분',
    enrollmentPeriod: '수강 기간',
    enrolledDate: '신청일',
  },
  player: {
    backToCourse: '강의로 돌아가기',
    previous: '이전',
    next: '다음',
    markComplete: '완료 표시',
    autoSaved: '자동 저장됨',
    saveFailed: '저장 실패',
    loading: '로딩 중...',
    error: '콘텐츠를 불러오는 중 오류가 발생했습니다',
    retry: '다시 시도',
    skipToNext: '다음으로 건너뛰기',
    completed: '완료됨',
    curriculum: '커리큘럼',
    selectContent: '학습할 콘텐츠를 선택하세요',
    defaultTitle: '학습 플레이어',
    demoModeBanner: '데모 모드 - 실제 데이터가 아닌 샘플 데이터로 표시됩니다',
  },
};

// 영어 번역
const en: TranslationKeys = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    loading: 'Loading...',
    noData: 'No data available',
    error: 'An error occurred',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign up',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    comingSoon: 'Coming Soon',
  },
  mypage: {
    title: 'My Page',
    profile: 'Profile',
    profileAndSecurity: 'Profile & Security',
    profileDescription: 'Edit your profile information and change your profile image',
    learningStatus: 'Learning Status',
    inProgress: 'In Progress',
    completed: 'Completed Courses',
    completedDesc: 'View your completed courses',
    completedCourses: 'Completed Courses',
    completedComingSoon: 'Completed courses feature is currently under development. You will soon be able to view your completed courses and certificates.',
    pending: 'Pending',
    dropped: 'Dropped',
    total: 'Total',
    recentLearning: 'Recent Learning',
    viewAll: 'View All',
    quickMenu: 'Quick Menu',
    myLearning: 'My Learning',
    myLearningDesc: 'Check your enrolled courses',
    certificates: 'Certificates',
    certificatesDesc: 'View your earned certificates',
    certificatesList: 'Certificates List',
    certificatesComingSoon: 'Certificates feature is currently under development. You will soon be able to view and download your earned certificates.',
    profileSecurityDesc: 'Profile and security settings',
    notifications: 'Notifications',
    notificationsDesc: 'Manage your notification settings',
    languageRegion: 'Language & Region',
    languageRegionDesc: 'Change language and region settings',
    learningProgress: 'Learning Progress',
    learningProgressDesc: 'Check your overall learning progress',
    noEnrolledCourses: 'No enrolled courses',
    noEnrolledCoursesDesc: 'Find new courses and start learning',
    browseCourses: 'Browse Courses',
    editProfile: 'Edit Profile',
    hello: ', Welcome!',
    generalMember: 'Member',
  },
  teaching: {
    title: 'My Courses',
    description: 'Manage your courses and create new ones',
    createCourse: 'Create Course',
    newCourse: 'New Course',
    noCourses: 'No courses created',
    noCoursesDesc: 'You haven\'t created any courses yet. Create a new course to share your knowledge with learners.',
    courseNotice: 'Course Creation Notice',
    courseNoticeDesc: 'Course creation approval is based on the appropriateness of course information and content as judged by the administrators. Approval may take 3-5 business days.',
    grantPermission: 'Grant Course Creation Permission',
    grantPermissionDesc: 'You need Designer permission to create courses. Would you like to go to the course design / creation page?',
    grantPermissionConfirm: 'Click "Confirm" to automatically grant permission and navigate to the course creation page.',
    grantPermissionWarning: 'Note: Course creation approval is based on the appropriateness of course information and content. Courses with inappropriate content may be rejected.',
    granting: 'Granting permission...',
    designer: 'Designer',
    draft: 'Draft',
    pendingApproval: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    students: 'Students',
    lastModified: 'Last Modified',
    stats: 'Course Statistics',
    statsDesc: 'View student and learning statistics for your courses',
    statsOverview: 'Statistics Overview',
    statsComingSoon: 'Course statistics feature is currently under development. You will soon be able to view student enrollment, completion rates, and other statistics.',
    courseDesignTitle: 'Course Design / Creation',
    navigateConfirm: 'Would you like to proceed to the course design / creation page?',
    proceed: 'Proceed',
    // Owner Stats
    totalPrograms: 'Total Programs',
    totalCourseTimes: 'Total Sessions',
    totalStudents: 'Total Students',
    enrollmentStats: 'Enrollment Stats',
    totalEnrollments: 'Total Enrollments',
    completed: 'Completed',
    inProgress: 'In Progress',
    dropped: 'Dropped',
    failed: 'Failed',
    averageCompletionRate: 'Avg. Completion Rate',
    completionRate: 'Completion Rate',
    programStats: 'Program Stats',
    noProgramStats: 'No program statistics',
    noProgramStatsDesc: 'No programs assigned. Statistics will be available once you are assigned as an instructor.',
    courseTimes: 'Sessions',
  },
  profileSecurity: {
    title: 'Profile & Security',
    description: 'Manage your profile and security settings',
    profileInfo: 'Profile Information',
    profileImage: 'Profile Image',
    imageGuide: 'JPG, PNG, GIF (max 5MB)',
    imageClickGuide: 'Click to change image',
    name: 'Name',
    email: 'Email',
    joinDate: 'Join Date',
    passwordChange: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    passwordMinLength: 'Minimum 8 characters required',
    changePassword: 'Change Password',
    coursePermission: 'Course Creation Permission',
    currentPermissionStatus: 'Current Permission Status',
    generalUser: 'General User',
    courseCreationEnabled: 'Course Creation Enabled',
    fullAccess: 'Full Access',
    permissionRequestDesc: 'Request permission to create courses and register content.',
    requestPermission: 'Request Permission',
    permissionEnabled: 'Course creation and content registration permission is enabled.',
    accountManagement: 'Account Management',
    accountDeleteWarning: 'Deleting your account will permanently remove all data and cannot be recovered.',
    withdraw: 'Delete Account',
    withdrawTitle: 'Delete Account',
    withdrawDesc: 'Are you sure you want to delete your account? This action cannot be undone and all data will be permanently deleted.',
    withdrawConfirm: 'Delete',
    processing: 'Processing...',
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    languageDesc: 'Select your preferred language',
    selectLanguage: 'Select Language',
    korean: '한국어',
    english: 'English',
    notificationsDesc: 'Configure how you receive notifications',
    notificationSettings: 'Notification Settings',
    notificationsComingSoon: 'Notification settings are currently under development. Various notification options will be available soon.',
  },
  landing: {
    banner: 'MZC Learn Platform - A New Beginning in Cloud Education',
    closeBanner: 'Close banner',
    searchPlaceholder: 'Search for knowledge you want to learn.',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    openMenu: 'Open menu',
    mypage: 'My Page',
    createCourse: 'Create Course',
    settings: 'Settings',
    profileSecurity: 'Profile & Security',
    notifications: 'Notifications',
    languageRegion: 'Language & Region',
    all: 'All',
    cloud: 'Cloud',
    dev: 'Development',
    ai: 'AI',
    data: 'Data',
    security: 'Security',
    devops: 'DevOps',
    featuredCourses: 'Featured Courses',
    featuredCoursesDesc: 'The best choice for your growth',
    newCourses: 'New Courses',
    newCoursesDesc: 'Fresh learning updated daily',
    beginnerCourses: 'Perfect for Beginners',
    beginnerCoursesDesc: 'Start strong with solid fundamentals',
    viewAll: 'View All',
    noCoursesInCategory: 'No courses in this category.',
    relatedCourses: 'Related Courses',
    tagNew: 'NEW',
    tagBest: 'BEST',
    tagSale: 'SALE',
  },
  hero: {
    getStarted: 'Get Started',
    explore: 'Explore',
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide',
    goToSlide: 'Go to slide',
    slide1Subtitle: 'The fastest path to becoming\na cloud expert',
    slide1Desc: 'Start with MZC Learn.',
    slide2Subtitle: 'Design your own\ncareer roadmap',
    slide2Desc: 'Step-by-step learning guide from beginner to expert',
    slide3Subtitle: 'AWS, Azure, GCP\nMaster the Cloud',
    slide3Desc: 'Real-world cloud expertise from industry professionals',
  },
  footer: {
    company: 'MEGAZONECLOUD Co., Ltd.',
    ceo: 'CEO: Lee Joo-wan, Cho Won-woo',
    businessNo: 'Business No: 232-88-00982',
    address: '46, Nonhyeon-ro 85-gil, Gangnam-gu, Seoul',
    phone: 'Tel: 1644-2243 | Email: cloud@megazone.com',
    privacyPolicy: 'Privacy Policy',
    terms: 'Terms of Service',
    emailPolicy: 'Email Collection Policy',
    copyright: 'MEGAZONECLOUD Corp. All rights reserved.',
  },
  catalog: {
    title: 'Course Catalog',
    description: 'Browse and enroll in available courses',
    searchPlaceholder: 'Search courses...',
    filter: 'Filter',
    difficulty: 'Difficulty',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    totalCourses: 'Total',
    courses: 'courses',
    loadError: 'An error occurred while loading data.',
    noCourses: 'No courses found',
    changeFilter: 'Try changing your search criteria',
    hours: 'hr',
    minutes: 'min',
    students: '',
    enrolled: 'enrolled',
    backToCatalog: 'Back to Catalog',
    courseNotFound: 'Course not found',
    courseNotFoundDesc: 'The requested course does not exist or is not accessible.',
    courseIntro: 'Course Overview',
    availableSessions: 'Available Sessions',
    closed: 'Closed',
    enrollmentPeriod: 'Enrollment Period',
    processing: 'Processing...',
    closedStatus: 'Closed',
    notAvailable: 'Not Available',
    enroll: 'Enroll',
    noAvailableSessions: 'No available sessions at this time.',
    enrollSuccess: 'Successfully enrolled!',
    enrollFail: 'Enrollment failed. Please try again.',
  },
  learning: {
    title: 'My Learning',
    enrolledCourses: 'Enrolled Courses',
    description: 'Manage your enrolled courses and continue learning',
    searchPlaceholder: 'Search courses...',
    filter: 'Filter',
    enrollmentStatus: 'Enrollment Status',
    statusPending: 'Pending',
    statusApproved: 'In Progress',
    statusRejected: 'Rejected',
    statusCancelled: 'Cancelled',
    statusCompleted: 'Completed',
    progress: 'Progress',
    continueLearning: 'Continue Learning',
    totalEnrollments: 'Total',
    enrollments: 'enrollments',
    loadError: 'An error occurred while loading data.',
    noEnrollments: 'No enrolled courses',
    noEnrollmentsDesc: 'Browse the course catalog to find courses you want to take',
    browseCourses: 'Browse Courses',
    backToLearning: 'Back to My Learning',
    enrollmentNotFound: 'Enrollment not found',
    learningProgress: 'Learning Progress',
    completed: 'completed',
    curriculum: 'Curriculum',
    cancelEnrollment: 'Cancel Enrollment',
    cancelConfirmTitle: 'Cancel this enrollment?',
    cancelConfirmDesc: 'Cancelling will reset all your progress. This action cannot be undone.',
    minutes: 'min',
    enrollmentPeriod: 'Enrollment Period',
    enrolledDate: 'Enrolled Date',
  },
  player: {
    backToCourse: 'Back to Course',
    previous: 'Previous',
    next: 'Next',
    markComplete: 'Mark Complete',
    autoSaved: 'Auto saved',
    saveFailed: 'Save failed',
    loading: 'Loading...',
    error: 'An error occurred while loading content',
    retry: 'Retry',
    skipToNext: 'Skip to Next',
    completed: 'Completed',
    curriculum: 'Curriculum',
    selectContent: 'Select content to learn',
    defaultTitle: 'Learning Player',
    demoModeBanner: 'Demo Mode - Displaying sample data, not real data',
  },
};

const translations: Record<Language, TranslationKeys> = { ko, en };

// 번역 함수
export function useTranslation() {
  const { language } = useLanguageStore();
  const t = translations[language];
  return { t, language };
}

// 직접 번역 가져오기 (컴포넌트 외부에서 사용)
export function getTranslation(language: Language) {
  return translations[language];
}
