/**
 * TU 공지사항 팝업 컴포넌트
 * 로그인 후 사용자에게 최신 공지사항을 팝업으로 표시
 */
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pin, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/common/Dialog';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Checkbox } from '@/components/common/Checkbox';
import { Label } from '@/components/common/Label';
import { useVisibleTenantNotices } from '@/hooks/ta/useTenantNoticeQueries';
import type { TenantNotice, TenantNoticeType } from '@/types/ta/tenantNotice.types';

const STORAGE_KEY = 'tenant-notice-dismissed';
const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24시간

const typeConfig: Record<TenantNoticeType, { label: string; color: string }> = {
  GENERAL: { label: '일반', color: 'bg-gray-100 text-gray-700' },
  IMPORTANT: { label: '중요', color: 'bg-blue-100 text-blue-700' },
  URGENT: { label: '긴급', color: 'bg-red-100 text-red-700' },
  EVENT: { label: '이벤트', color: 'bg-purple-100 text-purple-700' },
};

interface DismissedData {
  noticeIds: number[];
  dismissedUntil: number | null; // null means dismissed forever for those IDs
}

function getDismissedData(): DismissedData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as DismissedData;
      // 만료 시간 체크
      if (data.dismissedUntil && data.dismissedUntil < Date.now()) {
        // 시간 기반 dismiss가 만료됨
        return { noticeIds: [], dismissedUntil: null };
      }
      return data;
    }
  } catch {
    // 파싱 실패 시 초기값 반환
  }
  return { noticeIds: [], dismissedUntil: null };
}

function setDismissedData(data: DismissedData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function TenantNoticePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dontShowToday, setDontShowToday] = useState(false);
  const [visibleNotices, setVisibleNotices] = useState<TenantNotice[]>([]);

  const { data: noticesData, isLoading } = useVisibleTenantNotices({ size: 10 });

  // 공지사항 필터링 및 정렬
  useEffect(() => {
    if (!noticesData?.content || isLoading) return;

    const dismissedData = getDismissedData();

    // 사용자에게 보여줄 공지 필터링 (이미 본 공지 제외)
    // 백엔드에서 이미 사용자 역할에 맞는 공지만 반환하므로 별도 필터링 불필요
    const userNotices = noticesData.content
      .filter((notice) => !dismissedData.noticeIds.includes(notice.id));

    // 고정된 공지 먼저, 그 다음 최신순
    const sortedNotices = userNotices.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.publishedAt || b.createdAt).getTime() -
             new Date(a.publishedAt || a.createdAt).getTime();
    });

    setVisibleNotices(sortedNotices);

    // 보여줄 공지가 있으면 팝업 열기
    if (sortedNotices.length > 0) {
      setIsOpen(true);
    }
  }, [noticesData, isLoading]);

  const currentNotice = visibleNotices[currentIndex];
  const totalNotices = visibleNotices.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalNotices - 1 ? prev + 1 : prev));
  }, [totalNotices]);

  const handleClose = useCallback(() => {
    const dismissedData = getDismissedData();
    const currentNoticeIds = visibleNotices.map((n) => n.id);

    if (dontShowToday) {
      // 오늘 하루 보지 않기 - 24시간 동안 모든 현재 공지 숨김
      setDismissedData({
        noticeIds: [...new Set([...dismissedData.noticeIds, ...currentNoticeIds])],
        dismissedUntil: Date.now() + DISMISS_DURATION,
      });
    } else {
      // 현재 보고 있는 공지만 dismissed 처리
      if (currentNotice) {
        setDismissedData({
          ...dismissedData,
          noticeIds: [...new Set([...dismissedData.noticeIds, currentNotice.id])],
        });
      }
    }

    setIsOpen(false);
  }, [dontShowToday, visibleNotices, currentNotice]);

  if (isLoading || !currentNotice) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-brand-primary" />
              공지사항
            </DialogTitle>
            {totalNotices > 1 && (
              <span className="text-sm text-text-secondary">
                {currentIndex + 1} / {totalNotices}
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="py-4">
          {/* 공지 헤더 */}
          <div className="flex items-center gap-2 mb-3">
            {currentNotice.isPinned && (
              <Pin className="h-4 w-4 text-brand-primary" />
            )}
            <Badge className={typeConfig[currentNotice.type].color}>
              {typeConfig[currentNotice.type].label}
            </Badge>
            <span className="text-xs text-text-secondary">
              {new Date(currentNotice.publishedAt || currentNotice.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* 공지 제목 */}
          <h3 className="text-lg font-semibold mb-3">{currentNotice.title}</h3>

          {/* 공지 내용 */}
          <div className="prose prose-sm max-w-none text-text-secondary whitespace-pre-wrap max-h-60 overflow-y-auto">
            {currentNotice.content}
          </div>

          {/* 페이지 네비게이션 (공지가 여러 개일 때) */}
          {totalNotices > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
              <div className="flex gap-1">
                {visibleNotices.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex
                        ? 'bg-brand-primary'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === totalNotices - 1}
              >
                다음
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="dontShowToday"
              checked={dontShowToday}
              onCheckedChange={(checked) => setDontShowToday(checked === true)}
            />
            <Label htmlFor="dontShowToday" className="text-sm text-text-secondary cursor-pointer">
              오늘 하루 보지 않기
            </Label>
          </div>
          <Button onClick={handleClose}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
