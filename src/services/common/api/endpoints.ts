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
} as const;
