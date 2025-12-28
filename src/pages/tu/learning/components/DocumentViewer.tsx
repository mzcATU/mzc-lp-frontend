/**
 * DocumentViewer 컴포넌트
 * PDF 및 문서 콘텐츠를 표시하고 진도 추적 기능 제공
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, AlertCircle, RefreshCw, FileText, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common';
import { useTranslation } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';
import { contentService } from '@/services/tu/contentService';

interface DocumentViewerProps {
  contentId: number;
  externalUrl?: string;
  onProgress?: (progress: { viewed: number }) => void;
  onComplete?: () => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export function DocumentViewer({
  contentId,
  externalUrl,
  onProgress,
  onComplete,
  onReady,
  onError,
}: DocumentViewerProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  // TODO: setTotalPages will be used when implementing proper PDF page detection
  const [totalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [viewedPages, setViewedPages] = useState<Set<number>>(new Set([1]));

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 문서 URL 로드
  useEffect(() => {
    if (externalUrl) {
      setDocumentUrl(externalUrl);
      setIsLoading(false);
      onReady?.();
      return;
    }

    const loadDocument = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const url = await contentService.getStreamUrl(contentId);
        setDocumentUrl(url);
        onReady?.();
      } catch (error) {
        console.error('Failed to load document:', error);
        setHasError(true);
        onError?.(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [contentId, externalUrl, onReady, onError]);

  // 페이지 변경 시 진도 업데이트
  useEffect(() => {
    if (totalPages > 0) {
      const viewedPercent = viewedPages.size / totalPages;
      onProgress?.({ viewed: viewedPercent });

      // 80% 이상 봤으면 완료 처리
      if (viewedPercent >= 0.8) {
        onComplete?.();
      }
    }
  }, [viewedPages, totalPages, onProgress, onComplete]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setViewedPages((prev) => new Set([...prev, newPage]));
    }
  }, [totalPages]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 25, 50));
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setDocumentUrl(null);
    // Re-trigger useEffect
    const timer = setTimeout(() => {
      if (externalUrl) {
        setDocumentUrl(externalUrl);
        setIsLoading(false);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [externalUrl]);

  const handleDownload = useCallback(() => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  }, [documentUrl]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div
        className={`relative w-full aspect-[4/3] rounded-lg flex items-center justify-center ${
          isDark ? 'bg-white/5' : 'bg-gray-100'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{t.player.loading}</span>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (hasError) {
    return (
      <div
        className={`relative w-full aspect-[4/3] rounded-lg flex flex-col items-center justify-center gap-4 ${
          isDark ? 'bg-white/5' : 'bg-gray-100'
        }`}
      >
        <AlertCircle className="w-12 h-12 text-red-500" />
        <span className={isDark ? 'text-white' : 'text-gray-900'}>{t.player.error}</span>
        <Button onClick={handleRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {t.player.retry}
        </Button>
      </div>
    );
  }

  // PDF 뷰어 (Google Docs Viewer 또는 iframe 사용)
  const pdfViewerUrl = documentUrl
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`
    : null;

  return (
    <div className={`rounded-lg overflow-hidden ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'}`}>
      {/* 툴바 */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b ${
          isDark ? 'bg-[#12121a] border-white/10' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <FileText className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {t.player.curriculum}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 줌 컨트롤 */}
          <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className={`text-sm min-w-[3rem] text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {zoom}%
          </span>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
            <ZoomIn className="w-4 h-4" />
          </Button>

          <div className={`h-4 w-px mx-2 ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />

          {/* 다운로드 */}
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 문서 뷰어 */}
      <div
        className="relative overflow-auto"
        style={{
          height: 'calc(100vh - 300px)',
          minHeight: '400px',
        }}
      >
        {pdfViewerUrl ? (
          <iframe
            ref={iframeRef}
            src={pdfViewerUrl}
            className="w-full h-full border-0"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: `${10000 / zoom}%`,
              height: `${10000 / zoom}%`,
            }}
            title="Document Viewer"
            onLoad={() => {
              setIsLoading(false);
              onReady?.();
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {t.player.selectContent}
            </span>
          </div>
        )}
      </div>

      {/* 페이지 네비게이션 (여러 페이지가 있는 경우) */}
      {totalPages > 1 && (
        <div
          className={`flex items-center justify-center gap-4 px-4 py-2 border-t ${
            isDark ? 'bg-[#12121a] border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
