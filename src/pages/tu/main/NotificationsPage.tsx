import { useState, ComponentType } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSubdomainPath } from '@/hooks/common';
import { Bell, CheckCheck, Trash2, Settings, Heart, MessageSquare, BookOpen, Megaphone, Loader2, FileText, AlertCircle, ChevronRight } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';

/** NotificationsPage props */
interface NotificationsPageProps {
  /** 커스텀 헤더 컴포넌트 (B2B 등에서 사용) */
  HeaderComponent?: ComponentType;
  /** 알림 상세 페이지 기본 경로 (B2B: /tu/b2b/notifications) */
  detailBasePath?: string;
}
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification, useDeleteReadNotifications } from '@/hooks/tu';
import type { NotificationType } from '@/types/tu';
import { getNotificationDeepLink } from '@/types/tu';
import { useAuthStore } from '@/store/common/authStore';

// 알림 타입별 필터 옵션
const notificationTypes: { id: NotificationType | 'all'; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'COMMENT', label: '댓글' },
  { id: 'LIKE', label: '좋아요' },
  { id: 'COURSE', label: '강의' },
  { id: 'SYSTEM', label: '공지사항' },
  { id: 'ASSIGNMENT', label: '과제' },
];

// 알림 타입별 아이콘 매핑
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'COMMENT': return MessageSquare;
    case 'LIKE': return Heart;
    case 'COURSE': return BookOpen;
    case 'SYSTEM': return Megaphone;
    case 'ASSIGNMENT': return FileText;
    default: return AlertCircle;
  }
};

// 알림 타입별 색상 매핑
const getIconColor = (type: NotificationType) => {
  switch (type) {
    case 'COMMENT': return 'text-[#10b981] bg-[#10b981]/20';
    case 'LIKE': return 'text-[#f43f5e] bg-[#f43f5e]/20';
    case 'COURSE': return 'text-[#6778ff] bg-[#6778ff]/20';
    case 'SYSTEM': return 'text-[#f59e0b] bg-[#f59e0b]/20';
    case 'ASSIGNMENT': return 'text-[#8b5cf6] bg-[#8b5cf6]/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
};

// 상대 시간 포맷
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  return date.toLocaleDateString('ko-KR');
};

export function NotificationsPage({
  HeaderComponent = LandingHeader,
  detailBasePath = '/tu/b2c/notifications'
}: NotificationsPageProps = {}) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [activeType, setActiveType] = useState<NotificationType | 'all'>('all');
  const { isAuthenticated } = useAuthStore();

  // React Query 훅
  const filter = activeType === 'all' ? undefined : { type: activeType };
  const { data: apiNotificationData, isLoading, error } = useNotifications(filter);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();
  const deleteReadNotificationsMutation = useDeleteReadNotifications();

  // 실제 사용할 데이터 결정
  const allNotifications = apiNotificationData?.notifications || [];

  // 필터링 적용
  const filteredNotifications = activeType === 'all'
    ? allNotifications
    : allNotifications.filter(n => n.type === activeType);

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const deleteNotification = (id: number) => {
    deleteNotificationMutation.mutate(id);
  };

  const handleDeleteAllRead = () => {
    deleteReadNotificationsMutation.mutate();
  };

  // 비로그인 상태
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <HeaderComponent />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="text-center py-20">
            <Bell className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              로그인이 필요합니다
            </h2>
            <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              알림을 보려면 로그인해주세요.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 landing-btn-primary px-6 py-3 rounded-full text-white font-medium"
            >
              로그인하기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <HeaderComponent />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#6778ff]" />
            <span className={`ml-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              알림을 불러오는 중...
            </span>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <HeaderComponent />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="text-center py-20">
            <p className={`text-lg ${isDark ? 'text-red-400' : 'text-red-500'}`}>
              알림을 불러오는데 실패했습니다.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 landing-btn-primary rounded-full text-white"
            >
              다시 시도
            </button>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <HeaderComponent />

      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              알림
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개` : '모든 알림을 확인했습니다'}
            </p>
          </div>
          <button className={`p-2 rounded-lg transition-colors ${
            isDark
              ? 'text-gray-400 hover:text-white hover:bg-white/10'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}>
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-6">
          {notificationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeType === type.id
                  ? 'bg-gradient-to-r from-[#6778ff] to-[#a855f7] text-white'
                  : isDark
                    ? 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
            className={`flex items-center gap-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {markAllAsReadMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4" />
            )}
            모두 읽음 처리
          </button>
          <button
            onClick={handleDeleteAllRead}
            disabled={allNotifications.every(n => !n.isRead) || deleteReadNotificationsMutation.isPending}
            className={`flex items-center gap-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? 'text-gray-400 hover:text-red-400'
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            {deleteReadNotificationsMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            읽은 알림 삭제
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              알림이 없습니다
            </h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              새로운 알림이 오면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const deepLink = getNotificationDeepLink(notification);
              return (
                <div
                  key={notification.id}
                  onClick={() => {
                    markAsRead(notification.id);
                    // 딥링크가 있으면 해당 페이지로, 없으면 알림 상세로
                    const targetPath = deepLink || `${detailBasePath}/${notification.id}`;
                    navigate(prefixPath(targetPath));
                  }}
                  className={`rounded-xl p-4 flex gap-4 cursor-pointer transition-all border ${
                    isDark
                      ? 'glass border-white/10 hover:bg-white/5'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  } ${!notification.isRead ? 'border-l-4 border-l-[#6778ff]' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-semibold mb-1 ${
                          !notification.isRead
                            ? isDark ? 'text-white' : 'text-gray-900'
                            : isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        disabled={deleteNotificationMutation.isPending}
                        className={`p-1 transition-colors disabled:opacity-50 ${
                          isDark
                            ? 'text-gray-500 hover:text-red-400'
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#6778ff] mt-2"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
