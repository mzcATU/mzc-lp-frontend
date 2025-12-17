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

  // Content (TO, TU)
  CONTENT: {
    BASE: '/content',
    BY_ID: (id: number) => `/content/${id}`,
  },
} as const;
