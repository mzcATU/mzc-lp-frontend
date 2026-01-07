/**
 * ExternalLinkViewer 컴포넌트
 * 외부 링크 콘텐츠를 표시 (YouTube, 외부 사이트 등)
 */
import { useState, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { Loader2, AlertCircle, RefreshCw, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/common';
import { useTranslation } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';

interface ExternalLinkViewerProps {
  url: string;
  title?: string;
  onProgress?: (progress: { played: number }) => void;
  onComplete?: () => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export function ExternalLinkViewer({
  url,
  title,
  onProgress,
  onReady,
  onError,
}: ExternalLinkViewerProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlayable, setIsPlayable] = useState(false);

  // URL이 ReactPlayer로 재생 가능한지 확인
  useEffect(() => {
    const canPlay = ReactPlayer.canPlay(url);
    setIsPlayable(canPlay);
    if (!canPlay) {
      setIsLoading(false);
    }
  }, [url]);

  const handleReady = useCallback(() => {
    setIsLoading(false);
    onReady?.();
  }, [onReady]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.(new Error('Failed to load external content'));
  }, [onError]);

  const handleProgress = useCallback(
    (state: { played: number }) => {
      onProgress?.({ played: state.played });
      // 자동 완료 처리 제거 - 사용자가 직접 "학습 완료" 버튼을 클릭해야 함
    },
    [onProgress]
  );

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
  }, []);

  const handleOpenExternal = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
    // 자동 완료 처리 제거 - 사용자가 직접 "학습 완료" 버튼을 클릭해야 함
  }, [url]);

  // 에러 상태
  if (hasError) {
    return (
      <div
        className={`relative w-full aspect-video rounded-lg flex flex-col items-center justify-center gap-4 ${
          isDark ? 'bg-white/5' : 'bg-gray-100'
        }`}
      >
        <AlertCircle className="w-12 h-12 text-red-500" />
        <span className={isDark ? 'text-white' : 'text-gray-900'}>{t.player.error}</span>
        <div className="flex gap-2">
          <Button onClick={handleRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {t.player.retry}
          </Button>
          <Button onClick={handleOpenExternal} className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  }

  // 재생 가능한 URL (YouTube, Vimeo 등)
  if (isPlayable) {
    return (
      <div className={`relative rounded-lg overflow-hidden ${isDark ? 'bg-black' : 'bg-gray-900'}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
          </div>
        )}
        <div className="aspect-video">
          <ReactPlayer
            url={url}
            width="100%"
            height="100%"
            controls
            onReady={handleReady}
            onError={handleError}
            onProgress={handleProgress}
            config={{
              youtube: {
                playerVars: { showinfo: 1 },
              },
            }}
          />
        </div>
      </div>
    );
  }

  // 일반 외부 링크 (iframe으로 표시하거나 외부 링크로 열기)
  return (
    <div
      className={`rounded-lg overflow-hidden ${isDark ? 'bg-[#1a1a2e]' : 'bg-white'} border ${
        isDark ? 'border-white/10' : 'border-gray-200'
      }`}
    >
      {/* 링크 정보 */}
      <div
        className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDark ? 'bg-white/10' : 'bg-gray-100'
            }`}
          >
            <LinkIcon className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title || 'External Content'}
            </h3>
            <p className={`text-sm truncate max-w-md ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {url}
            </p>
          </div>
        </div>
        <Button onClick={handleOpenExternal} className="gap-2">
          <ExternalLink className="w-4 h-4" />
          Open Link
        </Button>
      </div>

      {/* iframe 미리보기 (선택적) */}
      <div
        className={`aspect-video flex items-center justify-center ${
          isDark ? 'bg-white/5' : 'bg-gray-50'
        }`}
      >
        <div className="text-center">
          <LinkIcon className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Click the button above to open the external content
          </p>
          <Button onClick={handleOpenExternal} variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </Button>
        </div>
      </div>
    </div>
  );
}
