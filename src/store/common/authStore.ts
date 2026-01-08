import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, TenantRole } from '@/types/common/auth.types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  tokenExpiresAt: number | null; // 토큰 만료 시간 (timestamp)

  // Actions
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string, expiresIn?: number) => void;
  setTokens: (accessToken: string, refreshToken: string, expiresIn?: number) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;

  // Token expiration
  isTokenExpired: () => boolean;
  checkAndLogoutIfExpired: () => boolean;

  // Selectors
  hasRole: (role: TenantRole) => boolean;
  hasAnyRole: (roles: TenantRole[]) => boolean;
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

      setAuth: (user, accessToken, refreshToken, expiresIn) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          tokenExpiresAt: calculateExpiresAt(expiresIn),
        }),

      setTokens: (accessToken, refreshToken, expiresIn) =>
        set({
          accessToken,
          refreshToken,
          tokenExpiresAt: calculateExpiresAt(expiresIn),
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
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        tokenExpiresAt: state.tokenExpiresAt,
      }),
    }
  )
);
