import { useState } from 'react';
import { Megaphone, ChevronDown, Loader2 } from 'lucide-react';
import { useCourseTimeAnnouncements } from '@/hooks/tu/useCourseTimeAnnouncementQueries';
import type { CourseTimeAnnouncement } from '@/services/tu/courseTimeAnnouncementService';

interface B2BAnnouncementSectionProps {
  courseTimeId: number;
  isDark: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function getTypeLabel(type: CourseTimeAnnouncement['type']): string {
  return type === 'IMPORTANT' ? '중요' : '안내';
}

export function B2BAnnouncementSection({ courseTimeId, isDark }: B2BAnnouncementSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { data: announcements = [], isLoading, error } = useCourseTimeAnnouncements(courseTimeId);

  if (isLoading) {
    return (
      <div
        className={`rounded-xl border overflow-hidden mb-8 p-6 flex items-center justify-center ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}
      >
        <Loader2 className={`w-5 h-5 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    );
  }

  // API 에러 또는 데이터 없음 - 숨김 처리
  if (error || !announcements || !Array.isArray(announcements) || announcements.length === 0) {
    return null;
  }

  return (
    <div
      className={`rounded-xl border overflow-hidden mb-8 ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      {/* 아코디언 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
          isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-2">
          <Megaphone className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📢 공지사항
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
            }`}
          >
            {announcements.length}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-200 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          } ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 아코디언 콘텐츠 */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="max-h-80 overflow-y-auto">
            {announcements.map((announcement, index) => (
              <div
                key={announcement.id}
                className={`px-4 py-3 ${
                  index !== announcements.length - 1
                    ? isDark
                      ? 'border-b border-white/5'
                      : 'border-b border-gray-50'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                      announcement.type === 'IMPORTANT'
                        ? 'bg-orange-500'
                        : isDark
                          ? 'bg-blue-400'
                          : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          announcement.type === 'IMPORTANT'
                            ? isDark
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-orange-100 text-orange-600'
                            : isDark
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {getTypeLabel(announcement.type)}
                      </span>
                      <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {announcement.title}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {announcement.message}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatDate(announcement.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
