import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, Settings, Gift, MessageSquare, BookOpen, Megaphone, Loader2, FileText, AlertCircle } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotifications, useDeleteReadNotifications } from '@/hooks/tu';
import type { NotificationItem, NotificationType } from '@/types/tu';

// 환경 설정: true면 API 사용, false면 더미 데이터 사용
const USE_API = false;

// 더미 알림 데이터
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'promotion',
    title: '블랙위크 특별 할인!',
    message: '모든 강의 25% 할인 + 100% 환급 이벤트가 시작되었습니다. 지금 바로 확인해보세요!',
    createdAt: '2024-12-30T09:50:00Z',
    isRead: false,
  },
  {
    id: 2,
    type: 'course',
    title: '새 강의가 업데이트되었습니다',
    message: '"실전! Next.js 15 완벽 마스터" 강의에 새로운 섹션이 추가되었습니다.',
    createdAt: '2024-12-30T09:00:00Z',
    isRead: false,
  },
  {
    id: 3,
    type: 'comment',
    title: '질문에 답변이 달렸습니다',
    message: '김개발 강사님이 회원님의 질문에 답변을 남겼습니다.',
    createdAt: '2024-12-30T07:00:00Z',
    isRead: false,
  },
  {
    id: 4,
    type: 'system',
    title: '서비스 점검 안내',
    message: '12월 5일 오전 2시~4시 서비스 점검이 예정되어 있습니다.',
    createdAt: '2024-12-29T10:00:00Z',
    isRead: true,
  },
  {
    id: 5,
    type: 'course',
    title: '수강 완료를 축하합니다!',
    message: '"React 기초부터 실전까지" 강의를 완료하셨습니다. 수료증을 다운로드해보세요!',
    createdAt: '2024-12-28T10:00:00Z',
    isRead: true,
  },
  {
    id: 6,
    type: 'promotion',
    title: '첫 구매 할인 쿠폰 도착',
    message: '첫 강의 구매 시 사용할 수 있는 20% 할인 쿠폰이 발급되었습니다.',
    createdAt: '2024-12-27T10:00:00Z',
    isRead: true,
  },
];

// 알림 타입별 필터 옵션
const notificationTypes: { id: NotificationType | 'all'; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'promotion', label: '이벤트' },
  { id: 'course', label: '강의' },
  { id: 'comment', label: '댓글' },
  { id: 'system', label: '공지' },
  { id: 'assignment', label: '과제' },
];

// 알림 타입별 아이콘 매핑
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'promotion': return Gift;
    case 'course': return BookOpen;
    case 'comment': return MessageSquare;
    case 'system': return Megaphone;
    case 'assignment': return FileText;
    default: return AlertCircle;
  }
};

// 알림 타입별 색상 매핑
const getIconColor = (type: NotificationType) => {
  switch (type) {
    case 'promotion': return 'text-[#f59e0b] bg-[#f59e0b]/20';
    case 'course': return 'text-[#6778ff] bg-[#6778ff]/20';
    case 'comment': return 'text-[#10b981] bg-[#10b981]/20';
    case 'system': return 'text-[#ec4899] bg-[#ec4899]/20';
    case 'assignment': return 'text-[#8b5cf6] bg-[#8b5cf6]/20';
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

export function NotificationsPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState<NotificationType | 'all'>('all');

  // React Query 훅 (API 모드일 때만 활성화)
  const filter = activeType === 'all' ? undefined : { type: activeType };
  const { data: apiNotificationData, isLoading, error } = useNotifications(filter, USE_API);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationsMutation = useDeleteNotifications();
  const deleteReadNotificationsMutation = useDeleteReadNotifications();

  // 로컬 상태 (Mock 모드에서 사용)
  const [mockNotifications, setMockNotifications] = useState(MOCK_NOTIFICATIONS);

  // 실제 사용할 데이터 결정
  const allNotifications = USE_API ? (apiNotificationData?.notifications || []) : mockNotifications;

  // 필터링 적용
  const filteredNotifications = activeType === 'all'
    ? allNotifications
    : allNotifications.filter(n => n.type === activeType);

  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    if (USE_API) {
      markAsReadMutation.mutate({ notificationIds: [id] });
    } else {
      setMockNotifications(mockNotifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
    }
  };

  const handleMarkAllAsRead = () => {
    if (USE_API) {
      markAllAsReadMutation.mutate();
    } else {
      setMockNotifications(mockNotifications.map(n => ({ ...n, isRead: true })));
    }
  };

  const deleteNotification = (id: number) => {
    if (USE_API) {
      deleteNotificationsMutation.mutate({ notificationIds: [id] });
    } else {
      setMockNotifications(mockNotifications.filter(n => n.id !== id));
    }
  };

  const handleDeleteAllRead = () => {
    if (USE_API) {
      deleteReadNotificationsMutation.mutate();
    } else {
      setMockNotifications(mockNotifications.filter(n => !n.isRead));
    }
  };

  // 로딩 상태
  if (USE_API && isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
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
  if (USE_API && error) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
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
      <LandingHeader />

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
              return (
                <div
                  key={notification.id}
                  onClick={() => {
                    markAsRead(notification.id);
                    navigate(`/tu/notifications/${notification.id}`);
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
                        disabled={deleteNotificationsMutation.isPending}
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
