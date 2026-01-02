import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Gift,
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
import type { NotificationItem, NotificationType } from '@/types/tu';

// 환경 설정: true면 API 사용, false면 더미 데이터 사용
const USE_API = false;

// 더미 알림 상세 데이터
const MOCK_NOTIFICATIONS: Record<number, NotificationItem & { content?: string; actionUrl?: string; actionLabel?: string }> = {
  1: {
    id: 1,
    type: 'promotion',
    title: '블랙위크 특별 할인!',
    message: '모든 강의 25% 할인 + 100% 환급 이벤트가 시작되었습니다. 지금 바로 확인해보세요!',
    content: `
## 🎉 블랙위크 특별 할인 이벤트

안녕하세요, MZC Learn Platform입니다.

블랙위크를 맞아 **모든 강의 25% 할인** + **100% 환급 이벤트**를 진행합니다!

### 이벤트 기간
2024년 12월 1일 ~ 12월 31일

### 이벤트 내용
- **전 강의 25% 할인**: 모든 강의가 25% 할인된 가격으로 제공됩니다.
- **100% 환급 챌린지**: 수강 완료 시 결제 금액의 100%를 포인트로 환급해드립니다.
- **추가 쿠폰 증정**: 3개 이상 강의 구매 시 10% 추가 할인 쿠폰 증정

### 참여 방법
1. 원하는 강의를 선택하세요
2. 결제 시 자동으로 25% 할인이 적용됩니다
3. 수강 완료 후 환급 신청을 진행해주세요

놓치지 마세요! 🚀
    `,
    createdAt: '2024-12-30T09:50:00Z',
    isRead: false,
    actionUrl: '/tu/b2c/courses',
    actionLabel: '강의 둘러보기',
  },
  2: {
    id: 2,
    type: 'course',
    title: '새 강의가 업데이트되었습니다',
    message: '"실전! Next.js 15 완벽 마스터" 강의에 새로운 섹션이 추가되었습니다.',
    content: `
## 📚 강의 업데이트 알림

**"실전! Next.js 15 완벽 마스터"** 강의에 새로운 콘텐츠가 추가되었습니다.

### 추가된 섹션
- **섹션 12: Server Actions 심화**
  - 12-1. Server Actions의 동작 원리
  - 12-2. Form 처리와 Server Actions
  - 12-3. 에러 핸들링 패턴
  - 12-4. 실전 프로젝트: 댓글 시스템 구현

### 업데이트 내용
총 4개의 새로운 강의가 추가되었으며, 약 2시간 분량입니다.

지금 바로 확인해보세요!
    `,
    createdAt: '2024-12-30T09:00:00Z',
    isRead: false,
    actionUrl: '/tu/b2c/courses/1',
    actionLabel: '강의 바로가기',
  },
  3: {
    id: 3,
    type: 'comment',
    title: '질문에 답변이 달렸습니다',
    message: '김개발 강사님이 회원님의 질문에 답변을 남겼습니다.',
    content: `
## 💬 새로운 답변 알림

**김개발** 강사님이 회원님의 질문에 답변을 남겼습니다.

### 원본 질문
> useEffect에서 async/await를 직접 사용하면 안 되는 이유가 무엇인가요?

### 강사님 답변
좋은 질문이네요! useEffect의 콜백 함수는 cleanup 함수를 반환해야 하는데, async 함수는 항상 Promise를 반환하기 때문입니다.

대신 다음과 같이 내부에 async 함수를 정의해서 사용하세요:

\`\`\`javascript
useEffect(() => {
  const fetchData = async () => {
    const result = await api.getData();
    setData(result);
  };
  fetchData();
}, []);
\`\`\`

추가 질문 있으시면 편하게 남겨주세요!
    `,
    createdAt: '2024-12-30T07:00:00Z',
    isRead: false,
    actionUrl: '/tu/b2c/community/1',
    actionLabel: '답변 보러가기',
  },
  4: {
    id: 4,
    type: 'system',
    title: '서비스 점검 안내',
    message: '12월 5일 오전 2시~4시 서비스 점검이 예정되어 있습니다.',
    content: `
## 🔧 서비스 정기 점검 안내

안녕하세요, MZC Learn Platform입니다.

서비스 안정화 및 성능 개선을 위한 정기 점검을 진행합니다.

### 점검 일시
**2024년 12월 5일 (목) 오전 02:00 ~ 04:00** (약 2시간)

### 점검 내용
- 서버 인프라 업그레이드
- 데이터베이스 최적화
- 보안 패치 적용

### 주의사항
- 점검 시간 동안 서비스 이용이 불가합니다
- 강의 시청, 결제 등 모든 기능이 일시 중단됩니다
- 점검 종료 후 자동으로 정상화됩니다

이용에 불편을 드려 죄송합니다.
더 나은 서비스로 보답하겠습니다.
    `,
    createdAt: '2024-12-29T10:00:00Z',
    isRead: true,
  },
  5: {
    id: 5,
    type: 'course',
    title: '수강 완료를 축하합니다!',
    message: '"React 기초부터 실전까지" 강의를 완료하셨습니다. 수료증을 다운로드해보세요!',
    content: `
## 🎊 수강 완료를 축하합니다!

회원님께서 **"React 기초부터 실전까지"** 강의를 성공적으로 완료하셨습니다!

### 수강 정보
- **강의명**: React 기초부터 실전까지
- **수강 기간**: 2024.11.15 ~ 2024.12.28
- **총 학습 시간**: 24시간 32분
- **진도율**: 100%

### 수료증 안내
수료증이 발급되었습니다. 마이페이지에서 다운로드하실 수 있습니다.

앞으로도 MZC Learn Platform과 함께 성장해주세요! 🚀
    `,
    createdAt: '2024-12-28T10:00:00Z',
    isRead: true,
    actionUrl: '/mypage/certifications',
    actionLabel: '수료증 확인하기',
  },
  6: {
    id: 6,
    type: 'promotion',
    title: '첫 구매 할인 쿠폰 도착',
    message: '첫 강의 구매 시 사용할 수 있는 20% 할인 쿠폰이 발급되었습니다.',
    content: `
## 🎁 첫 구매 할인 쿠폰 발급

MZC Learn Platform에 가입해주셔서 감사합니다!

첫 강의 구매 시 사용하실 수 있는 **20% 할인 쿠폰**이 발급되었습니다.

### 쿠폰 정보
- **할인율**: 20%
- **최대 할인 금액**: 30,000원
- **사용 기한**: 2025년 1월 27일까지
- **적용 대상**: 모든 강의

### 사용 방법
1. 원하는 강의를 장바구니에 담으세요
2. 결제 페이지에서 쿠폰을 선택하세요
3. 할인된 금액으로 결제하세요

지금 바로 강의를 둘러보세요! 📚
    `,
    createdAt: '2024-12-27T10:00:00Z',
    isRead: true,
    actionUrl: '/tu/b2c/courses',
    actionLabel: '강의 둘러보기',
  },
};

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

// 알림 타입 레이블
const getTypeLabel = (type: NotificationType) => {
  switch (type) {
    case 'promotion': return '이벤트';
    case 'course': return '강의';
    case 'comment': return '댓글';
    case 'system': return '공지';
    case 'assignment': return '과제';
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

  const [notification, setNotification] = useState<(NotificationItem & { content?: string; actionUrl?: string; actionLabel?: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadNotification = async () => {
      setIsLoading(true);
      try {
        if (USE_API) {
          // API 호출 (구현 필요)
          // const data = await notificationService.getNotification(Number(id));
          // setNotification(data);
        } else {
          // Mock 데이터 사용
          await new Promise((resolve) => setTimeout(resolve, 300));
          const data = MOCK_NOTIFICATIONS[Number(id)];
          if (data) {
            setNotification(data);
          }
        }
      } catch (error) {
        console.error('Failed to load notification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadNotification();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!notification) return;

    setIsDeleting(true);
    try {
      if (USE_API) {
        // API 호출 (구현 필요)
        // await notificationService.deleteNotifications({ notificationIds: [notification.id] });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      navigate('/tu/notifications');
    } catch (error) {
      console.error('Failed to delete notification:', error);
    } finally {
      setIsDeleting(false);
    }
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
            <Button onClick={() => navigate('/tu/notifications')}>
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
            onClick={() => navigate('/tu/notifications')}
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
            <div className={`prose prose-sm max-w-none mb-8 ${
              isDark
                ? 'prose-invert prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-code:text-[#6778ff] prose-blockquote:border-l-[#6778ff] prose-blockquote:text-gray-400'
                : 'prose-gray'
            }`}>
              {notification.content ? (
                <div className="whitespace-pre-wrap">
                  {notification.content.split('\n').map((line, index) => {
                    // Heading 2
                    if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
                    }
                    // Heading 3
                    if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                    }
                    // List item
                    if (line.startsWith('- ')) {
                      return (
                        <li key={index} className={`ml-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {line.replace('- ', '')}
                        </li>
                      );
                    }
                    // Numbered list
                    if (/^\d+\. /.test(line)) {
                      return (
                        <li key={index} className={`ml-4 list-decimal ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {line.replace(/^\d+\. /, '')}
                        </li>
                      );
                    }
                    // Blockquote
                    if (line.startsWith('> ')) {
                      return (
                        <blockquote key={index} className={`border-l-4 pl-4 my-2 ${isDark ? 'border-[#6778ff] text-gray-400' : 'border-gray-300 text-gray-600'}`}>
                          {line.replace('> ', '')}
                        </blockquote>
                      );
                    }
                    // Bold text
                    if (line.includes('**')) {
                      const parts = line.split(/\*\*(.*?)\*\*/g);
                      return (
                        <p key={index} className={`my-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {parts.map((part, i) =>
                            i % 2 === 1 ? <strong key={i} className={isDark ? 'text-white' : 'text-gray-900'}>{part}</strong> : part
                          )}
                        </p>
                      );
                    }
                    // Code block start/end
                    if (line.startsWith('```')) {
                      return null;
                    }
                    // Empty line
                    if (line.trim() === '') {
                      return <br key={index} />;
                    }
                    // Regular paragraph
                    return (
                      <p key={index} className={`my-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {line}
                      </p>
                    );
                  })}
                </div>
              ) : (
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{notification.message}</p>
              )}
            </div>

            {/* Action Button */}
            {notification.actionUrl && (
              <div className="mb-6">
                <Link
                  to={notification.actionUrl}
                  className="inline-flex items-center gap-2 landing-btn-primary px-6 py-3 rounded-xl text-white font-medium"
                >
                  {notification.actionLabel || '자세히 보기'}
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
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      isDark
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <CheckCheck className="w-4 h-4" />
                    읽음 처리
                  </button>
                )}
              </div>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex items-center gap-2 text-sm transition-colors disabled:opacity-50 ${
                  isDark
                    ? 'text-gray-400 hover:text-red-400'
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                {isDeleting ? (
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
