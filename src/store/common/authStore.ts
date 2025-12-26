import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, LoginResponse, UserRole } from '@/types/common/auth.types';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  // Legacy compatibility
  token: string | null;

  // Actions
  setAuth: (response: LoginResponse) => void;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  logout: () => void;

  // Helpers
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isTenantAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      token: null,

      setAuth: (response: LoginResponse) => set({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        token: response.accessToken, // Legacy compatibility
        isAuthenticated: true,
      }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token, accessToken: token }),

      setRefreshToken: (refreshToken) => set({ refreshToken }),

      logout: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
        token: null,
        isAuthenticated: false,
      }),

      hasRole: (role: UserRole) => {
        const user = get().user;
        return user?.role === role;
      },

      isAdmin: () => {
        const user = get().user;
        return user?.role === 'SUPER_ADMIN';
      },

      isTenantAdmin: () => {
        const user = get().user;
        return user?.role === 'TENANT_ADMIN' || user?.role === 'SUPER_ADMIN';
      },
    }),
    { name: 'auth-storage' }
  )
);
