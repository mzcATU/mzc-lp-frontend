/**
 * ExternalLinkViewer 컴포넌트
 * 외부 링크 콘텐츠를 표시 (YouTube, 외부 사이트 등)
 */
import { useCallback } from 'react';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/common';
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
}: ExternalLinkViewerProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleOpenExternal = useCallback(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [url]);

  // 모든 외부 링크를 동일하게 처리
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

      {/* 링크 열기 안내 */}
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
