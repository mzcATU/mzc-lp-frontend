/**
 * 시스템 공지 팝업 컴포넌트
 * SA가 TA/TO에게 배포한 공지사항을 팝업으로 표시
 */
import { useState, useEffect } from 'react';
import { Pin, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/common/Dialog';
import { useSystemNotices, useMarkSystemNoticeAsRead } from '@/hooks/ta';

const DISMISSED_NOTICES_KEY = 'dismissed_system_notices';

interface SystemNoticePopupProps {
  /** 팝업 활성화 여부 (기본: true) */
  enabled?: boolean;
}

export function SystemNoticePopup({ enabled = true }: SystemNoticePopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  const { data: noticesData, isLoading } = useSystemNotices({ size: 10 });
  const markAsReadMutation = useMarkSystemNoticeAsRead();

  const notices = noticesData?.content || [];

  // 로컬 스토리지에서 이미 닫은 공지 ID 목록 로드
  useEffect(() => {
    const stored = localStorage.getItem(DISMISSED_NOTICES_KEY);
    if (stored) {
      try {
        setDismissedIds(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  // 표시할 공지 필터링 (이미 닫은 공지 제외)
  const displayNotices = notices.filter(
    (notice) => !dismissedIds.includes(notice.id)
  );

  // 새 공지가 있으면 팝업 자동 표시
  useEffect(() => {
    if (enabled && !isLoading && displayNotices.length > 0) {
      setIsOpen(true);
      setCurrentIndex(0);
    }
  }, [enabled, isLoading, displayNotices.length]);

  const currentNotice = displayNotices[currentIndex];

  const handleDismiss = (noticeId: number) => {
    // 읽음 처리
    markAsReadMutation.mutate(noticeId);

    // 로컬 스토리지에 저장
    const newDismissedIds = [...dismissedIds, noticeId];
    setDismissedIds(newDismissedIds);
    localStorage.setItem(DISMISSED_NOTICES_KEY, JSON.stringify(newDismissedIds));

    // 다음 공지로 이동 또는 팝업 닫기
    if (currentIndex >= displayNotices.length - 1) {
      setIsOpen(false);
    }
  };

  const handleDismissAll = () => {
    // 모든 공지 읽음 처리
    displayNotices.forEach((notice) => {
      markAsReadMutation.mutate(notice.id);
    });

    // 로컬 스토리지에 저장
    const allIds = [...dismissedIds, ...displayNotices.map((n) => n.id)];
    setDismissedIds(allIds);
    localStorage.setItem(DISMISSED_NOTICES_KEY, JSON.stringify(allIds));

    setIsOpen(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(displayNotices.length - 1, prev + 1));
  };

  if (!enabled || isLoading || displayNotices.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-primary" />
              시스템 공지
              {displayNotices.length > 1 && (
                <Badge variant="outline" className="ml-2">
                  {currentIndex + 1} / {displayNotices.length}
                </Badge>
              )}
            </DialogTitle>
          </div>
        </DialogHeader>

        {currentNotice && (
          <div className="py-4">
            <div className="flex items-center gap-2 mb-3">
              {currentNotice.isPinned && (
                <Pin className="h-4 w-4 text-brand-primary" />
              )}
              <h3 className="font-semibold text-lg">{currentNotice.title}</h3>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-text-secondary">
              <span>
                {currentNotice.publishedAt
                  ? new Date(currentNotice.publishedAt).toLocaleDateString('ko-KR')
                  : new Date(currentNotice.createdAt).toLocaleDateString('ko-KR')}
              </span>
            </div>

            <div className="prose prose-sm max-w-none whitespace-pre-wrap bg-bg-secondary p-4 rounded-lg max-h-60 overflow-y-auto">
              {currentNotice.content}
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="flex items-center gap-2">
            {displayNotices.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentIndex === displayNotices.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {displayNotices.length > 1 && (
              <Button variant="ghost" size="sm" onClick={handleDismissAll}>
                모두 닫기
              </Button>
            )}
            <Button onClick={() => currentNotice && handleDismiss(currentNotice.id)}>
              확인
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
