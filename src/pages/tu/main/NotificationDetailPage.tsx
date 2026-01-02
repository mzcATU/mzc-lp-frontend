import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Heart,
  MessageSquare,
  BookOpen,
  Megaphone,
  FileText,
  AlertCircle,
  Trash2,
  CheckCheck,
  Clock,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Button } from '@/components/common';
import { useNotification, useMarkAsRead, useDeleteNotification } from '@/hooks/tu';
import type { NotificationType } from '@/types/tu';

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

// 알림 타입 레이블
const getTypeLabel = (type: NotificationType) => {
  switch (type) {
    case 'COMMENT': return '댓글';
    case 'LIKE': return '좋아요';
    case 'COURSE': return '강의';
    case 'SYSTEM': return '시스템';
    case 'ASSIGNMENT': return '과제';
    default: return '알림';
  }
};

// 날짜 포맷
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // React Query 훅
  const notificationId = Number(id);
  const { data: notification, isLoading } = useNotification(notificationId, !!id);
  const markAsReadMutation = useMarkAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const handleMarkAsRead = () => {
    if (notification && !notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const handleDelete = () => {
    if (!notification) return;
    deleteNotificationMutation.mutate(notification.id, {
      onSuccess: () => {
        navigate('/tu/b2c/notifications');
      },
    });
  };

  // 로딩 상태
  if (isLoading) {
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

  // 알림을 찾을 수 없는 경우
  if (!notification) {
    return (
      <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
        <LandingHeader />
        <main className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="text-center py-20">
            <Bell className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              알림을 찾을 수 없습니다
            </h2>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              해당 알림이 삭제되었거나 존재하지 않습니다.
            </p>
            <Button onClick={() => navigate('/tu/b2c/notifications')}>
              알림 목록으로 돌아가기
            </Button>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  const IconComponent = getNotificationIcon(notification.type);

  return (
    <div className={`min-h-screen ${isDark ? 'landing-dark bg-[#1e1e1e]' : 'landing-light bg-gray-50'}`}>
      <LandingHeader />

      <main className="w-full px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/tu/b2c/notifications')}
            className={`flex items-center gap-2 mb-6 transition-colors ${
              isDark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            알림 목록
          </button>

          {/* Notification Card */}
          <div className={`rounded-2xl p-6 md:p-8 border ${
            isDark
              ? 'glass border-white/10'
              : 'bg-white border-gray-200'
          }`}>
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
                <IconComponent className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    isDark
                      ? 'bg-white/10 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getTypeLabel(notification.type)}
                  </span>
                  {!notification.isRead && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#6778ff]/20 text-[#6778ff]">
                      새 알림
                    </span>
                  )}
                </div>
                <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {notification.title}
                </h1>
                <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Clock className="w-4 h-4" />
                  {formatDate(notification.createdAt)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="text-base leading-relaxed">{notification.message}</p>
            </div>

            {/* Action Button - 알림에 링크가 있는 경우 */}
            {notification.link && (
              <div className="mb-6">
                <Link
                  to={notification.link}
                  className="inline-flex items-center gap-2 landing-btn-primary px-6 py-3 rounded-xl text-white font-medium"
                >
                  자세히 보기
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Footer Actions */}
            <div className={`flex items-center justify-between pt-6 border-t ${
              isDark ? 'border-white/10' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                {!notification.isRead && (
                  <button
                    onClick={handleMarkAsRead}
                    disabled={markAsReadMutation.isPending}
                    className={`flex items-center gap-2 text-sm transition-colors disabled:opacity-50 ${
                      isDark
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {markAsReadMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCheck className="w-4 h-4" />
                    )}
                    읽음 처리
                  </button>
                )}
              </div>
              <button
                onClick={handleDelete}
                disabled={deleteNotificationMutation.isPending}
                className={`flex items-center gap-2 text-sm transition-colors disabled:opacity-50 ${
                  isDark
                    ? 'text-gray-400 hover:text-red-400'
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                {deleteNotificationMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                삭제
              </button>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
