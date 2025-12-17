import { create } from 'zustand';

interface UIState {
  isSidebarExpanded: boolean;
  isDarkMode: boolean;
  language: 'ko' | 'en';
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: 'ko' | 'en') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarExpanded: true,
  isDarkMode: true,
  language: 'ko',
  toggleSidebar: () => set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLanguage: (language) => set({ language }),
}));
