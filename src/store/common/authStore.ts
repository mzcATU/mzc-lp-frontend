import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, TenantRole } from '@/types/common/auth.types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  tokenExpiresAt: number | null; // 토큰 만료 시간 (timestamp)
  currentRole: TenantRole | null; // 현재 선택된 역할

  // Actions
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string, expiresIn?: number, currentRole?: TenantRole) => void;
  setTokens: (accessToken: string, refreshToken: string, expiresIn?: number) => void;
  setCurrentRole: (role: TenantRole) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;

  // Token expiration
  isTokenExpired: () => boolean;
  checkAndLogoutIfExpired: () => boolean;

  // Selectors
  hasRole: (role: TenantRole) => boolean;
  hasAnyRole: (roles: TenantRole[]) => boolean;
  getCurrentRole: () => TenantRole | null;
}

// 토큰 만료 시간 계산 (expiresIn: 초 단위)
const calculateExpiresAt = (expiresIn?: number): number | null => {
  if (!expiresIn) return null;
  // 만료 1분 전에 갱신 유도를 위해 60초 버퍼
  return Date.now() + (expiresIn - 60) * 1000;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      tokenExpiresAt: null,
      currentRole: null,

      setAuth: (user, accessToken, refreshToken, expiresIn, currentRole) => {
        // SA가 테넌트 경로에서 setAuth를 호출하면 sessionStorage에 토큰 백업
        const pathname = window.location.pathname;
        const isSystemAdmin = !user.tenantId;
        const isTenantPath = !pathname.startsWith('/sa') && !pathname.startsWith('/auth');

        if (isSystemAdmin && isTenantPath && pathname !== '/') {
          console.log('[AuthStore] SA attempting to access tenant path, backing up token:', pathname);
          sessionStorage.setItem('sa_backup_token', JSON.stringify({
            accessToken,
            refreshToken,
            user,
          }));
          // 토큰을 설정하지 않고 리턴
          return;
        }

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          tokenExpiresAt: calculateExpiresAt(expiresIn),
          currentRole: currentRole || user.role,
        });
      },

      setTokens: (accessToken, refreshToken, expiresIn) =>
        set({
          accessToken,
          refreshToken,
          tokenExpiresAt: calculateExpiresAt(expiresIn),
        }),

      setCurrentRole: (role) =>
        set({
          currentRole: role,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          tokenExpiresAt: null,
          currentRole: null,
        }),

      isTokenExpired: () => {
        const { tokenExpiresAt, isAuthenticated } = get();
        if (!isAuthenticated || !tokenExpiresAt) return false;
        return Date.now() >= tokenExpiresAt;
      },

      checkAndLogoutIfExpired: () => {
        const { isTokenExpired, logout } = get();
        if (isTokenExpired()) {
          logout();
          return true;
        }
        return false;
      },

      hasRole: (role) => get().user?.role === role,

      hasAnyRole: (roles) => {
        const userRole = get().user?.role;
        return userRole ? roles.includes(userRole) : false;
      },

      getCurrentRole: () => {
        const { currentRole, user } = get();
        return currentRole || user?.role || null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        tokenExpiresAt: state.tokenExpiresAt,
        currentRole: state.currentRole,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // localStorage에서 복원된 후 SA가 테넌트 경로에 있으면 자동 로그아웃
        const pathname = window.location.pathname;
        const isSystemAdmin = state.isAuthenticated && !state.user?.tenantId;
        const isTenantPath = !pathname.startsWith('/sa') && !pathname.startsWith('/auth') && pathname !== '/';

        if (isSystemAdmin && isTenantPath) {
          console.log('[AuthStore] Rehydrated: SA on tenant path, backing up and logging out:', pathname);

          // sessionStorage에 토큰 백업
          if (state.accessToken && state.refreshToken && state.user) {
            sessionStorage.setItem('sa_backup_token', JSON.stringify({
              accessToken: state.accessToken,
              refreshToken: state.refreshToken,
              user: state.user,
            }));
            console.log('[AuthStore] Token backed up to sessionStorage');
          }

          // 로그아웃
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          state.tokenExpiresAt = null;
          state.currentRole = null;
          console.log('[AuthStore] Logged out');
        }
      },
    }
  )
);
