/**
 * API 엔드포인트 상수
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    SWITCH_ROLE: '/auth/switch-role',
  },

  // Users
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    ME_PASSWORD: '/users/me/password',
    ME_PROFILE_IMAGE: '/users/me/profile-image',
    ME_COURSE_ROLES: '/users/me/course-roles',
    ME_COURSE_ROLES_DESIGNER: '/users/me/course-roles/designer',
    ME_LEARNING_STATS: '/users/me/learning-stats',
    BY_ID: (id: number) => `/users/${id}`,
    ROLE: (id: number) => `/users/${id}/role`,
    ROLES: (id: number) => `/users/${id}/roles`,
    ROLE_BY_NAME: (id: number, role: string) => `/users/${id}/roles/${role}`,
    STATUS: (id: number) => `/users/${id}/status`,
    COURSE_ROLES: (id: number) => `/users/${id}/course-roles`,
    COURSE_ROLE_BY_ID: (userId: number, roleId: number) => `/users/${userId}/course-roles/${roleId}`,
    BULK: '/users/bulk',
    BULK_FILE: '/users/bulk/file',
    ENROLLMENTS: (id: number) => `/users/${id}/enrollments`,
    ENROLLMENT_STATS: (id: number) => `/users/${id}/enrollments/stats`,
    INSTRUCTOR_STATS: (id: number) => `/users/${id}/instructor-statistics`,
  },

  // Owners (강사/콘텐츠 소유자)
  OWNERS: {
    ME_STATS: '/owners/me/stats',
  },

  // Tenants (SA)
  TENANTS: {
    BASE: '/tenants',
    BY_ID: (id: number) => `/tenants/${id}`,
    CUSTOM_DOMAIN: (id: number) => `/tenants/${id}/custom-domain`,
  },

  // SA Dashboard (SYSTEM_ADMIN)
  SA_DASHBOARD: {
    BASE: '/sa/dashboard',
  },

  // SA Users (SYSTEM_ADMIN)
  SA_USERS: {
    BASE: '/sa/users',
  },

  // TA Dashboard (TENANT_ADMIN)
  TA_DASHBOARD: {
    KPI: '/admin/dashboard/kpi',
  },

  // TA Domain Settings (TENANT_ADMIN)
  TA_DOMAIN_SETTINGS: {
    BASE: '/ta/domain-settings',
    CUSTOM: '/ta/domain-settings/custom',
  },

  // CO Dashboard (OPERATOR)
  CO_DASHBOARD: {
    TASKS: '/operator/dashboard/tasks',
  },

  // Tenant Settings (TA)
  TENANT_SETTINGS: {
    BASE: '/tenant/settings',
    DESIGN: '/tenant/settings/design',
    LAYOUT: '/tenant/settings/layout',
    BRANDING: '/tenant/settings/branding',
    BRANDING_EXTENDED: '/tenant/settings/branding/extended',
    USER_MANAGEMENT: '/tenant/settings/user-management',
    // Navigation
    NAVIGATION: '/tenant/settings/navigation',
    NAVIGATION_ITEM: (id: number) => `/tenant/settings/navigation/${id}`,
    NAVIGATION_REORDER: '/tenant/settings/navigation/reorder',
    NAVIGATION_RESET: '/tenant/settings/navigation/reset',
    // TU용 공개 API
    LAYOUT_PUBLIC: '/tenant/settings/layout/public',
    NAVIGATION_PUBLIC: '/tenant/settings/navigation/public',
  },

  // User Groups (TA)
  GROUPS: {
    BASE: '/groups',
    ACTIVE: '/groups/active',
    BY_ID: (id: number) => `/groups/${id}`,
    MEMBERS: (groupId: number, userId: number) => `/groups/${groupId}/members/${userId}`,
  },

  // Notices (SA)
  NOTICES: {
    BASE: '/sa/notices',
    BY_ID: (id: number) => `/sa/notices/${id}`,
    PUBLISH: (id: number) => `/sa/notices/${id}/publish`,
    ARCHIVE: (id: number) => `/sa/notices/${id}/archive`,
    DISTRIBUTE: (id: number) => `/sa/notices/${id}/distribute`,
    DISTRIBUTE_ALL: (id: number) => `/sa/notices/${id}/distribute-all`,
    TENANTS: (id: number) => `/sa/notices/${id}/tenants`,
    // 배포 통계
    DISTRIBUTIONS: '/sa/notices/distributions',
    DISTRIBUTIONS_SUMMARY: '/sa/notices/distributions/summary',
    DISTRIBUTION_BY_ID: (id: number) => `/sa/notices/${id}/distributions`,
  },

  // System Notices for TA (TA가 받은 SA 공지)
  SYSTEM_NOTICES_FOR_TA: {
    BASE: '/ta/notices',
    BY_ID: (id: number) => `/ta/notices/${id}`,
    MARK_READ: (id: number) => `/ta/notices/${id}/read`,
  },

  // Categories (TO)
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: number) => `/categories/${id}`,
  },

  // Courses (TO, TU)
  COURSES: {
    BASE: '/courses',
    MY: '/courses/my',
    BY_ID: (id: number) => `/courses/${id}`,
    // Course Items
    ITEMS: (courseId: number) => `/courses/${courseId}/items`,
    ITEMS_HIERARCHY: (courseId: number) => `/courses/${courseId}/items/hierarchy`,
    ITEMS_ORDERED: (courseId: number) => `/courses/${courseId}/items/ordered`,
    ITEMS_MOVE: (courseId: number) => `/courses/${courseId}/items/move`,
    ITEM_BY_ID: (courseId: number, itemId: number) =>
      `/courses/${courseId}/items/${itemId}`,
    ITEM_NAME: (courseId: number, itemId: number) =>
      `/courses/${courseId}/items/${itemId}/name`,
    ITEM_LEARNING_OBJECT: (courseId: number, itemId: number) =>
      `/courses/${courseId}/items/${itemId}/learning-object`,
    ITEM_DISPLAY_INFO: (courseId: number, itemId: number) =>
      `/courses/${courseId}/items/${itemId}/display-info`,
    // Course Folders
    FOLDERS: (courseId: number) => `/courses/${courseId}/folders`,
    // Phase 3: 승인 워크플로우 (Program에서 이관)
    READY: (id: number) => `/courses/${id}/ready`,
    UNREADY: (id: number) => `/courses/${id}/unready`,
    REGISTER: (id: number) => `/courses/${id}/register`,
  },

  // Content (TO, TU) - Legacy
  CONTENT: {
    BASE: '/content',
    BY_ID: (id: number) => `/content/${id}`,
  },

  // CMS - Contents (TU)
  CONTENTS: {
    BASE: '/contents',
    UPLOAD: '/contents/upload',
    BULK_UPLOAD: '/contents/bulk-upload',
    EXTERNAL_LINK: '/contents/external-link',
    MY: '/contents/my',
    BY_ID: (id: number) => `/contents/${id}`,
    STREAM: (id: number) => `/contents/${id}/stream`,
    DOWNLOAD: (id: number) => `/contents/${id}/download`,
    PREVIEW: (id: number) => `/contents/${id}/preview`,
    FILE: (id: number) => `/contents/${id}/file`,
    ARCHIVE: (id: number) => `/contents/${id}/archive`,
    RESTORE: (id: number) => `/contents/${id}/restore`,
    VERSIONS: (id: number) => `/contents/${id}/versions`,
    VERSION_BY_NUMBER: (id: number, versionNumber: number) =>
      `/contents/${id}/versions/${versionNumber}`,
    VERSION_RESTORE: (id: number, versionNumber: number) =>
      `/contents/${id}/versions/${versionNumber}/restore`,
  },

  // LO - Learning Objects (TU)
  LEARNING_OBJECTS: {
    BASE: '/learning-objects',
    BY_ID: (id: number) => `/learning-objects/${id}`,
    BY_CONTENT_ID: (contentId: number) => `/learning-objects/content/${contentId}`,
    FOLDER: (id: number) => `/learning-objects/${id}/folder`,
  },

  // Content Folders (TU)
  CONTENT_FOLDERS: {
    BASE: '/content-folders',
    TREE: '/content-folders/tree',
    BY_ID: (id: number) => `/content-folders/${id}`,
    CHILDREN: (id: number) => `/content-folders/${id}/children`,
    MOVE: (id: number) => `/content-folders/${id}/move`,
  },

  /**
   * @deprecated Phase 3: Program 엔티티 제거됨. COURSES 섹션 사용.
   * 점진적 전환을 위해 유지하되, 새 코드에서는 COURSES 사용 권장.
   */
  PROGRAMS: {
    BASE: '/courses', // /programs → /courses
    BY_ID: (id: number) => `/courses/${id}`,
    SUBMIT: (id: number) => `/courses/${id}/ready`, // submit → ready
    PENDING: '/courses', // 별도 pending 엔드포인트 없음
    APPROVE: (id: number) => `/courses/${id}/register`, // approve → register
    REJECT: (id: number) => `/courses/${id}/unready`, // reject → unready
    CLOSE: (id: number) => `/courses/${id}`, // close 개념 없음
    SNAPSHOT: (id: number) => `/courses/${id}/snapshots`,
  },

  // Instructor Assignments (TU - 내 배정, TO - 전체 관리)
  INSTRUCTOR_ASSIGNMENTS: {
    BASE: '/instructor-assignments',
    BY_ID: (id: number) => `/instructor-assignments/${id}`,
    MY: '/users/me/instructor-assignments',
    MY_STATISTICS: '/users/me/instructor-statistics',
  },

  // Instructors (강사 가용성 체크)
  INSTRUCTORS: {
    AVAILABILITY_CHECK: '/instructors/availability/check',
    USER_AVAILABILITY: (userId: number) => `/users/${userId}/availability`,
  },

  // Snapshots (TO)
  SNAPSHOTS: {
    BASE: '/snapshots',
    BY_ID: (id: number) => `/snapshots/${id}`,
    PUBLISH: (id: number) => `/snapshots/${id}/publish`,
    COMPLETE: (id: number) => `/snapshots/${id}/complete`,
    ARCHIVE: (id: number) => `/snapshots/${id}/archive`,
    // Course에서 스냅샷 생성/조회
    FROM_COURSE: (courseId: number) => `/courses/${courseId}/snapshots`,
    // Items
    ITEMS: (snapshotId: number) => `/snapshots/${snapshotId}/items`,
    ITEMS_FLAT: (snapshotId: number) => `/snapshots/${snapshotId}/items/flat`,
    ITEM_BY_ID: (snapshotId: number, itemId: number) =>
      `/snapshots/${snapshotId}/items/${itemId}`,
    ITEM_MOVE: (snapshotId: number, itemId: number) =>
      `/snapshots/${snapshotId}/items/${itemId}/move`,
    // Relations
    RELATIONS: (snapshotId: number) => `/snapshots/${snapshotId}/relations`,
    RELATIONS_ORDERED: (snapshotId: number) =>
      `/snapshots/${snapshotId}/relations/ordered`,
    RELATIONS_START: (snapshotId: number) =>
      `/snapshots/${snapshotId}/relations/start`,
    RELATION_BY_ID: (snapshotId: number, relationId: number) =>
      `/snapshots/${snapshotId}/relations/${relationId}`,
  },

  // Course Times (차수) - TO 관리 + TU Catalog
  TIMES: {
    BASE: '/times',
    BY_ID: (id: number) => `/times/${id}`,
    // CRUD
    CLONE: (id: number) => `/times/${id}/clone`,
    // 상태 전이
    OPEN: (id: number) => `/times/${id}/open`,
    START: (id: number) => `/times/${id}/start`,
    CLOSE: (id: number) => `/times/${id}/close`,
    ARCHIVE: (id: number) => `/times/${id}/archive`,
    // 조회
    CAPACITY: (id: number) => `/times/${id}/capacity`,
    PRICE: (id: number) => `/times/${id}/price`,
    // 수강신청 (TU)
    ENROLLMENTS: (id: number) => `/times/${id}/enrollments`,
    // 강사 배정 (TO)
    INSTRUCTORS: (timeId: number) => `/times/${timeId}/instructors`,
    INSTRUCTOR_BY_ID: (timeId: number, assignmentId: number) =>
      `/times/${timeId}/instructors/${assignmentId}`,
    INSTRUCTOR_REPLACE: (timeId: number, assignmentId: number) =>
      `/times/${timeId}/instructors/${assignmentId}/replace`,
  },

  // Enrollments (수강 신청) - TU
  ENROLLMENTS: {
    BASE: '/enrollments',
    BULK: '/enrollments/bulk',
    MY: '/users/me/enrollments',
    BY_ID: (id: number) => `/enrollments/${id}`,
    CANCEL: (id: number) => `/enrollments/${id}/cancel`,
    PROGRESS: (id: number) => `/enrollments/${id}/progress`,
    ITEMS_PROGRESS: (id: number) => `/enrollments/${id}/items/progress`,
    ITEM_PROGRESS: (id: number, itemId: number) => `/enrollments/${id}/items/${itemId}/progress`,
    ITEM_COMPLETE: (id: number, itemId: number) => `/enrollments/${id}/items/${itemId}/complete`,
    CURRICULUM: (id: number) => `/enrollments/${id}/curriculum`,
  },

  // Learning (학습자용 콘텐츠 접근) - TU
  LEARNING: {
    CONTENT_STREAM: (contentId: number) => `/learning/contents/${contentId}/stream`,
    CONTENT_DOWNLOAD: (contentId: number) => `/learning/contents/${contentId}/download`,
  },

  // Wishlist (찜) - TU (CourseTime 기반)
  WISHLIST: {
    BASE: '/wishlist',
    COUNT: '/wishlist/count',
    CHECK_BULK: '/wishlist/check',
    COURSE_TIME: (courseTimeId: number) => `/wishlist/course-times/${courseTimeId}`,
    COURSE_TIME_CHECK: (courseTimeId: number) => `/wishlist/course-times/${courseTimeId}/check`,
  },

  // Cart (장바구니) - TU (CourseTime 기반)
  CART: {
    BASE: '/cart',
    ITEMS: '/cart/items',
    COUNT: '/cart/count',
    ITEM: (courseTimeId: number) => `/cart/items/${courseTimeId}`,
    ITEM_CHECK: (courseTimeId: number) => `/cart/items/${courseTimeId}/check`,
  },

  // Roadmaps (로드맵) - TU Teaching
  ROADMAPS: {
    BASE: '/roadmaps',
    BY_ID: (id: number) => `/roadmaps/${id}`,
    DRAFT: (id: number) => `/roadmaps/${id}/draft`,
    DUPLICATE: (id: number) => `/roadmaps/${id}/duplicate`,
    STATISTICS: '/roadmaps/statistics',
  },

  // Dashboard (TA, SA)
  DASHBOARD: {
    TA_KPI: '/admin/dashboard/kpi',
    SA: '/sa/dashboard',
  },

  // Analytics (TA, SA)
  ANALYTICS: {
    // TA용 (테넌트 단위)
    TA_BASE: '/admin/analytics',
    TA_LOGS: '/admin/analytics/logs',
    TA_STATS: '/admin/analytics/stats',
    TA_RECENT: '/admin/analytics/recent',
    TA_TYPES: '/admin/analytics/types',
    // SA용 (전체 시스템)
    SA_LOGS: '/sa/analytics/logs',
    SA_STATS: '/sa/analytics/stats',
    SA_RECENT: '/sa/analytics/recent',
  },

  // System Settings (SA)
  SYSTEM_SETTINGS: {
    BASE: '/admin/system/settings',
    TENANT_DEFAULTS: '/admin/system/tenant-defaults',
  },

  // Banners (TA)
  BANNERS: {
    BASE: '/banners',
    BY_ID: (id: number) => `/banners/${id}`,
    ACTIVATE: (id: number) => `/banners/${id}/activate`,
    DEACTIVATE: (id: number) => `/banners/${id}/deactivate`,
    PUBLIC: '/banners/public/displayable',
  },

  // Tenant Features (TA)
  TENANT_FEATURES: {
    BASE: '/tenant/settings/features',
    PUBLIC: '/tenant/settings/features/public',
  },

  // Tenant Categories (TA)
  TENANT_CATEGORIES: {
    BASE: '/tenant/categories',
    PUBLIC: '/tenant/categories/public',
    BY_ID: (id: number) => `/tenant/categories/${id}`,
    REORDER: '/tenant/categories/reorder',
  },

  // Certificates (수료증) - TU
  CERTIFICATES: {
    BASE: '/certificates',
    MY: '/users/me/certificates',
    BY_ID: (id: number) => `/certificates/${id}`,
    DOWNLOAD: (id: number) => `/certificates/${id}/download`,
    VERIFY: (certificateNumber: string) => `/certificates/verify/${certificateNumber}`,
    ISSUE: (enrollmentId: number) => `/enrollments/${enrollmentId}/certificate`,
    BY_ENROLLMENT: (enrollmentId: number) => `/enrollments/${enrollmentId}/certificate`,
    REISSUE: (id: number) => `/certificates/${id}/reissue`,
  },

  // Employees (임직원 관리) - TA
  EMPLOYEES: {
    BASE: '/employees',
    SEARCH: '/employees/search',
    BY_ID: (id: number) => `/employees/${id}`,
    BY_DEPARTMENT: (departmentId: number) => `/employees/department/${departmentId}`,
    BY_NUMBER: (employeeNumber: string) => `/employees/number/${employeeNumber}`,
    STATUS: (id: number) => `/employees/${id}/status`,
    LMS_ACCOUNT: (id: number) => `/employees/${id}/lms-account`,
    HAS_LMS_ACCOUNT: (id: number) => `/employees/${id}/has-lms-account`,
  },

  // Departments (부서 관리) - TA
  DEPARTMENTS: {
    BASE: '/departments',
    TREE: '/departments/tree',
    ACTIVE: '/departments/active',
    SEARCH: '/departments/search',
    BY_ID: (id: number) => `/departments/${id}`,
    MEMBERS: (id: number) => `/departments/${id}/members`,
    AVAILABLE_MEMBERS: (id: number) => `/departments/${id}/available-members`,
    ADD_MEMBER: (departmentId: number, userId: number) => `/departments/${departmentId}/members/${userId}`,
  },

  // Member Pools (회원 풀) - TO 관리, TA 조회
  MEMBER_POOLS: {
    BASE: '/member-pools',
    BY_ID: (id: number) => `/member-pools/${id}`,
    ACTIVATE: (id: number) => `/member-pools/${id}/activate`,
    DEACTIVATE: (id: number) => `/member-pools/${id}/deactivate`,
    REORDER: '/member-pools/reorder',
    MATCH_COUNT: (id: number) => `/member-pools/${id}/match-count`,
  },

  // Auto Enrollment Rules (자동 입과 규칙) - TO 관리, TA 조회
  AUTO_ENROLLMENT_RULES: {
    BASE: '/auto-enrollment-rules',
    ACTIVE: '/auto-enrollment-rules/active',
    BY_TRIGGER: (trigger: string) => `/auto-enrollment-rules/trigger/${trigger}`,
    BY_ID: (id: number) => `/auto-enrollment-rules/${id}`,
    ACTIVATE: (id: number) => `/auto-enrollment-rules/${id}/activate`,
    DEACTIVATE: (id: number) => `/auto-enrollment-rules/${id}/deactivate`,
    REORDER: '/auto-enrollment-rules/reorder',
  },

  // Tenant Notices (테넌트 공지) - TA/TO 관리, TU/TO 조회
  TENANT_NOTICES: {
    BASE: '/tenant/notices',
    SEARCH: '/tenant/notices/search',
    BY_ID: (id: number) => `/tenant/notices/${id}`,
    PUBLISH: (id: number) => `/tenant/notices/${id}/publish`,
    ARCHIVE: (id: number) => `/tenant/notices/${id}/archive`,
    // 배포 통계
    DISTRIBUTION_STATS: '/tenant/notices/distribution/stats',
    DISTRIBUTION_SUMMARY: '/tenant/notices/distribution/summary',
    DISTRIBUTION_BY_ID: (id: number) => `/tenant/notices/${id}/distribution`,
    // TU/TO 조회용
    TU_BASE: '/tu/notices',
    TU_BY_ID: (id: number) => `/tu/notices/${id}`,
    TU_COUNT: '/tu/notices/count',
  },
  // Notification Templates (알림 템플릿) - TA 관리
  NOTIFICATION_TEMPLATES: {
    BASE: "/ta/notification-templates",
    BY_ID: (id: number) => `/ta/notification-templates/${id}`,
    INITIALIZE: "/ta/notification-templates/initialize",
    ACTIVATE: (id: number) => `/ta/notification-templates/${id}/activate`,
    DEACTIVATE: (id: number) => `/ta/notification-templates/${id}/deactivate`,
    TRIGGERS: "/ta/notification-templates/triggers",
    CATEGORIES: "/ta/notification-templates/categories",
  },
} as const;

