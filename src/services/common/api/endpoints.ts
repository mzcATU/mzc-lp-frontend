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
  },

  // Users
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    ME_PASSWORD: '/users/me/password',
    ME_PROFILE_IMAGE: '/users/me/profile-image',
    ME_COURSE_ROLES: '/users/me/course-roles',
    ME_COURSE_ROLES_DESIGNER: '/users/me/course-roles/designer',
    BY_ID: (id: number) => `/users/${id}`,
    ROLE: (id: number) => `/users/${id}/role`,
    STATUS: (id: number) => `/users/${id}/status`,
    COURSE_ROLES: (id: number) => `/users/${id}/course-roles`,
    COURSE_ROLE_BY_ID: (userId: number, roleId: number) => `/users/${userId}/course-roles/${roleId}`,
    ENROLLMENTS: (id: number) => `/users/${id}/enrollments`,
    ENROLLMENT_STATS: (id: number) => `/users/${id}/enrollments/stats`,
    INSTRUCTOR_STATS: (id: number) => `/users/${id}/instructor-statistics`,
  },

  // Tenants (SA)
  TENANTS: {
    BASE: '/tenants',
    BY_ID: (id: number) => `/tenants/${id}`,
  },

  // SA Dashboard (SYSTEM_ADMIN)
  SA_DASHBOARD: {
    BASE: '/sa/dashboard',
  },

  // TA Dashboard (TENANT_ADMIN)
  TA_DASHBOARD: {
    KPI: '/admin/dashboard/kpi',
  },

  // TO Dashboard (OPERATOR)
  TO_DASHBOARD: {
    TASKS: '/operator/dashboard/tasks',
  },

  // Tenant Settings (TA)
  TENANT_SETTINGS: {
    BASE: '/tenant/settings',
    BRANDING: '/tenant/settings/branding',
    USER_MANAGEMENT: '/tenant/settings/user-management',
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

  // Programs (TO)
  PROGRAMS: {
    BASE: '/programs',
    BY_ID: (id: number) => `/programs/${id}`,
    SUBMIT: (id: number) => `/programs/${id}/submit`,
    PENDING: '/programs/pending',
    APPROVE: (id: number) => `/programs/${id}/approve`,
    REJECT: (id: number) => `/programs/${id}/reject`,
    CLOSE: (id: number) => `/programs/${id}/close`,
    SNAPSHOT: (id: number) => `/programs/${id}/snapshot`,
  },

  // Instructor Assignments (TU - 내 배정, TO - 전체 관리)
  INSTRUCTOR_ASSIGNMENTS: {
    BASE: '/instructor-assignments',
    BY_ID: (id: number) => `/instructor-assignments/${id}`,
    MY: '/users/me/instructor-assignments',
    MY_STATISTICS: '/users/me/instructor-statistics',
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
    MY: '/users/me/enrollments',
    BY_ID: (id: number) => `/enrollments/${id}`,
    CANCEL: (id: number) => `/enrollments/${id}/cancel`,
    PROGRESS: (id: number) => `/enrollments/${id}/progress`,
    ITEM_COMPLETE: (id: number, itemId: number) => `/enrollments/${id}/items/${itemId}/complete`,
    CURRICULUM: (id: number) => `/enrollments/${id}/curriculum`,
  },

  // Wishlist (찜) - TU
  WISHLIST: {
    BASE: '/wishlist',
    COUNT: '/wishlist/count',
    CHECK_BULK: '/wishlist/check',
    COURSE: (courseId: number) => `/wishlist/courses/${courseId}`,
    COURSE_CHECK: (courseId: number) => `/wishlist/courses/${courseId}/check`,
    COURSE_COUNT: (courseId: number) => `/wishlist/courses/${courseId}/count`,
  },

  // Cart (장바구니) - TU
  CART: {
    BASE: '/cart',
    ITEMS: '/cart/items',
    COUNT: '/cart/count',
    ITEM: (courseId: number) => `/cart/items/${courseId}`,
    ITEM_CHECK: (courseId: number) => `/cart/items/${courseId}/check`,
  },

  // Analytics
  ANALYTICS: {
    SA_LOGS: '/sa/analytics/logs',
    SA_STATS: '/sa/analytics/stats',
    SA_RECENT: '/sa/analytics/recent',
    TA_LOGS: '/tenant/analytics/logs',
    TA_STATS: '/tenant/analytics/stats',
    TA_RECENT: '/tenant/analytics/recent',
  },
} as const;
