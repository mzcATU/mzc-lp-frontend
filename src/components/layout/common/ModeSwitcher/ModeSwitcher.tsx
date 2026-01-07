import { BookOpen, GraduationCap } from 'lucide-react';
import type { SidebarColors } from '@/types';
import { cn } from '@/utils/cn';

export type ViewMode = 'instructor' | 'learner';

interface ModeSwitcherProps {
  currentMode: ViewMode;
  isExpanded: boolean;
  language: 'ko' | 'en';
  colors: SidebarColors;
  onModeChange: (mode: ViewMode) => void;
  isDarkMode?: boolean;
}

export function ModeSwitcher({
  currentMode,
  isExpanded,
  language,
  colors,
  onModeChange,
  isDarkMode = true,
}: ModeSwitcherProps) {
  const modes: { id: ViewMode; label: { ko: string; en: string }; icon: typeof BookOpen }[] = [
    {
      id: 'instructor',
      label: { ko: '강사', en: 'Instructor' },
      icon: BookOpen,
    },
    {
      id: 'learner',
      label: { ko: '학습자', en: 'Learner' },
      icon: GraduationCap,
    },
  ];

  // 접힌 상태 - 아이콘만 표시 (세로 배치)
  if (!isExpanded) {
    return (
      <div
        className="flex flex-col gap-1 p-1 rounded-lg"
        style={{
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        }}
      >
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={cn(
                'w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200'
              )}
              style={{
                backgroundColor: isActive
                  ? (isDarkMode ? '#7C5CBF' : '#4C2D9A')
                  : 'transparent',
                color: isActive
                  ? '#FFFFFF'
                  : colors.textSecondary,
              }}
              title={mode.label[language]}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    );
  }

  // 펼친 상태 - iOS 스타일 토글 스위치
  return (
    <div
      className="relative rounded-lg p-1 transition-all duration-200"
      style={{
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
      }}
    >
      <div className="flex gap-1 relative">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md',
                'transition-all duration-200 text-sm font-medium whitespace-nowrap relative z-10'
              )}
              style={{
                backgroundColor: isActive
                  ? (isDarkMode ? '#7C5CBF' : '#D4CDEF')
                  : 'transparent',
                color: isActive
                  ? (isDarkMode ? '#FFFFFF' : '#4C2D9A')
                  : colors.textSecondary,
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{mode.label[language]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
