/**
 * API 엔드포인트 상수
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
  },

  // Tenants (SA)
  TENANTS: {
    BASE: '/tenants',
    BY_ID: (id: number) => `/tenants/${id}`,
  },

  // Courses (TO, TU)
  COURSES: {
    BASE: '/courses',
    BY_ID: (id: number) => `/courses/${id}`,
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
} as const;
