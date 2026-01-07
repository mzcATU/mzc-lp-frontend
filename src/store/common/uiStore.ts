import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useThemeStore } from './themeStore';

interface UIState {
  isSidebarExpanded: boolean;
  language: 'ko' | 'en';
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setLanguage: (lang: 'ko' | 'en') => void;
  // themeStore 동기화 함수들
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

// isDarkMode는 themeStore에서 직접 구독
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarExpanded: true,
      language: 'ko',
      toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
      setSidebarExpanded: (isSidebarExpanded) => set({ isSidebarExpanded }),
      setLanguage: (language) => set({ language }),
      // themeStore와 동기화
      toggleDarkMode: () => {
        useThemeStore.getState().toggleTheme();
      },
      setDarkMode: (isDark: boolean) => {
        useThemeStore.getState().setTheme(isDark ? 'dark' : 'light');
      },
    }),
    {
      name: 'ui-settings',
      partialize: (state) => ({
        isSidebarExpanded: state.isSidebarExpanded,
        language: state.language,
      }),
    }
  )
);

// isDarkMode를 themeStore에서 가져오는 selector hook
export const useIsDarkMode = () => useThemeStore((state) => state.theme === 'dark');
