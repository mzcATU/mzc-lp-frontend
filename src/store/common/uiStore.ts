import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarExpanded: boolean;
  isDarkMode: boolean;
  language: 'ko' | 'en';
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  setLanguage: (lang: 'ko' | 'en') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarExpanded: true,
      isDarkMode: false,
      language: 'ko',
      toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
      setSidebarExpanded: (isSidebarExpanded) => set({ isSidebarExpanded }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (isDarkMode) => set({ isDarkMode }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'ui-settings',
    }
  )
);
