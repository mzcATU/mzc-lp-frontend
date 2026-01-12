import { useState } from 'react';
import {
  Bell,
  Pin,
  Eye,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Inbox,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/common/Dialog';
import { useUserNotices, useUserNotice } from '@/hooks/tu/useUserNoticeQueries';
import type { TenantNotice, TenantNoticeType } from '@/types/ta/tenantNotice.types';

// 공지 타입 설정
const typeConfig: Record<TenantNoticeType, { label: string; color: string }> = {
  GENERAL: { label: '일반', color: 'bg-gray-100 text-gray-700' },
  IMPORTANT: { label: '중요', color: 'bg-blue-100 text-blue-700' },
  URGENT: { label: '긴급', color: 'bg-red-100 text-red-700' },
  EVENT: { label: '이벤트', color: 'bg-purple-100 text-purple-700' },
};

export function UserNoticesPage() {
  const [page, setPage] = useState(0);
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);

  // API Hooks
  const { data: noticesData, isLoading } = useUserNotices({ page, size: 10 });
  const { data: selectedNotice } = useUserNotice(selectedNoticeId || 0);

  const notices = noticesData?.content || [];
  const totalPages = noticesData?.totalPages || 0;
  const totalElements = noticesData?.totalElements || 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewNotice = (notice: TenantNotice) => {
    setSelectedNoticeId(notice.id);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">공지사항</h1>
        <p className="text-sm text-text-secondary mt-1">
          관리자가 발송한 공지사항을 확인합니다
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-brand-primary" />
            <div>
              <CardTitle>공지사항</CardTitle>
              <CardDescription>전체 {totalElements}개의 공지사항</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {notices.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>공지사항이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((notice) => {
                const typeConf = typeConfig[notice.type] || typeConfig.GENERAL;

                return (
                  <div
                    key={notice.id}
                    role="button"
                    tabIndex={0}
                    className="p-4 border rounded-lg hover:bg-bg-secondary cursor-pointer transition-colors"
                    onClick={() => handleViewNotice(notice)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleViewNotice(notice);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {notice.isPinned && (
                            <Pin className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          )}
                          <h3 className="font-medium">{notice.title}</h3>
                          <Badge className={typeConf.color}>{typeConf.label}</Badge>
                        </div>
                        <p className="text-sm text-text-secondary line-clamp-2">
                          {notice.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(notice.publishedAt || notice.createdAt)}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          보기
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 상세 Dialog */}
      <Dialog open={selectedNoticeId !== null} onOpenChange={() => setSelectedNoticeId(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedNotice?.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
              <DialogTitle>{selectedNotice?.title}</DialogTitle>
            </div>
          </DialogHeader>

          {selectedNotice && (
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={typeConfig[selectedNotice.type]?.color || typeConfig.GENERAL.color}>
                  {typeConfig[selectedNotice.type]?.label || '일반'}
                </Badge>
                <span className="text-sm text-text-secondary">
                  {formatDate(selectedNotice.publishedAt || selectedNotice.createdAt)}
                </span>
              </div>

              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {selectedNotice.content}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
