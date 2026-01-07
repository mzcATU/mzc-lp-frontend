/**
 * VideoPlayer 컴포넌트
 * react-player를 래핑하여 진도 추적 기능 제공
 */
import { useRef, useState, useCallback, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Loader2, AlertCircle, RefreshCw, Volume2, VolumeX, Maximize, Pause, Play } from 'lucide-react';
import { contentService } from '@/services/tu/contentService';
import { Button } from '@/components/common';
import { useTranslation } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';
import { useAuthStore } from '@/store/common/authStore';
import type { VideoPlayerProps } from '@/types/tu';

// react-player 진도 상태 타입
interface OnProgressState {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

export function VideoPlayer({
  contentId,
  externalUrl,
  initialProgress = 0,
  onProgress,
  onDuration,
  onEnded,
  onReady,
  onError,
  autoPlay = false,
  isLearnerMode = false,
}: VideoPlayerProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { accessToken } = useAuthStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 URL (YouTube 등) 여부 확인
  const isExternalUrl = !!externalUrl;

  // HTML5 video ref (MP4용)
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastProgressUpdateRef = useRef<number>(0);

  const [isReady, setIsReady] = useState(isExternalUrl); // 외부 URL은 바로 ready
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
  const [isLoadingBlob, setIsLoadingBlob] = useState(false);

  // 외부 URL이 있으면 그대로 사용, 없으면 Blob URL 사용 (인증 필요)
  const videoUrl: string | undefined = externalUrl || blobUrl || undefined;

  // 내부 스트리밍 URL을 Blob으로 가져오기 (인증 토큰 포함)
  useEffect(() => {
    // 외부 URL이 있거나, contentId가 없으면 skip
    if (externalUrl || !contentId) return;

    let currentBlobUrl: string | undefined;
    let isCancelled = false;

    const fetchVideoBlob = async () => {
      setIsLoadingBlob(true);
      setHasError(false);

      try {
        const url = isLearnerMode
          ? contentService.getLearnerStreamUrl(contentId)
          : contentService.getStreamUrl(contentId);

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (isCancelled) return;

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        if (isCancelled) return;

        const blobObjectUrl = URL.createObjectURL(blob);
        currentBlobUrl = blobObjectUrl;
        setBlobUrl(blobObjectUrl);
      } catch (error) {
        if (isCancelled) return;
        console.error('[VideoPlayer] Failed to fetch video:', error);
        setHasError(true);
      } finally {
        if (!isCancelled) {
          setIsLoadingBlob(false);
        }
      }
    };

    fetchVideoBlob();

    // Cleanup: Blob URL 해제
    return () => {
      isCancelled = true;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [contentId, externalUrl, isLearnerMode, accessToken]);

  const handleReady = useCallback(() => {
    setIsReady(true);
    setHasError(false);

    // 초기 진도로 이동
    if (initialProgress > 0 && playerRef.current) {
      playerRef.current.seekTo(initialProgress, 'fraction');
    }

    onReady?.();
  }, [initialProgress, onReady]);

  const handleProgress = useCallback((state: OnProgressState) => {
    if (!seeking) {
      setPlayed(state.played);
      onProgress?.(state);
    }
  }, [seeking, onProgress]);

  const handleError = useCallback(() => {
    console.error('Video player error');
    setHasError(true);
    onError?.(new Error('Video playback error'));
  }, [onError]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleMuteToggle = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  }, []);

  const handleSeekChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  }, []);

  const handleSeekMouseDown = useCallback(() => {
    setSeeking(true);
  }, []);

  const handleSeekMouseUp = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    const target = e.target as HTMLInputElement;
    playerRef.current?.seekTo(parseFloat(target.value), 'fraction');
  }, []);

  const handleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsReady(false);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // HTML5 video 이벤트 핸들러 설정 (MP4용)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isExternalUrl || !videoUrl?.endsWith('.mp4')) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      onDuration?.(video.duration);
      onReady?.();
    };

    const handleTimeUpdate = () => {
      if (video.duration > 0) {
        const progress = video.currentTime / video.duration;
        setPlayed(progress);
        onProgress?.({ played: progress, playedSeconds: video.currentTime, loaded: 0, loadedSeconds: 0 });
      }
    };

    const handleVideoEnded = () => onEnded?.();

    const handleVideoError = () => {
      setHasError(true);
      onError?.(new Error('Video playback error'));
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleVideoEnded);
      video.removeEventListener('error', handleVideoError);
    };
  }, [videoUrl, isExternalUrl, onDuration, onProgress, onEnded, onError, onReady]);

  // 로딩 상태 (Blob 로딩 중이거나, videoUrl이 없는 경우)
  // Blob URL이 있으면 바로 플레이어 표시 (ReactPlayer의 onReady는 별도로 처리)
  const isLoading = isLoadingBlob || (!videoUrl && !externalUrl);

  if (isLoading && !hasError) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full flex items-center justify-center ${
          isDark ? 'bg-black' : 'bg-gray-900'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
          <span className="text-gray-400">{t.player.loading}</span>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full flex flex-col items-center justify-center gap-4 ${
          isDark ? 'bg-black' : 'bg-gray-900'
        }`}
      >
        <AlertCircle className="w-12 h-12 text-red-500" />
        <span className="text-white">{t.player.error}</span>
        <Button onClick={handleRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {t.player.retry}
        </Button>
      </div>
    );
  }

  // 외부 URL (MP4 파일)인 경우 HTML5 video 사용
  if (isExternalUrl && videoUrl?.endsWith('.mp4')) {
    return (
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  // 외부 URL (YouTube, Vimeo 등)인 경우 ReactPlayer 사용
  if (isExternalUrl) {
    return (
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden bg-black"
      >
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          controls
          onProgress={handleProgress}
          onDuration={(dur) => {
            setDuration(dur);
            onDuration?.(dur);
          }}
          onEnded={handleEnded}
          onError={handleError}
          onReady={handleReady}
          progressInterval={1000}
        />
      </div>
    );
  }

  // 내부 비디오 (Blob URL 사용)인 경우 HTML5 video 직접 사용
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          setDuration(video.duration);
          onDuration?.(video.duration);
          setIsReady(true);
          onReady?.();
        }}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (video.duration > 0) {
            const now = Date.now();
            // 1초에 한 번만 progress 업데이트 (무한 루프 방지)
            if (now - lastProgressUpdateRef.current >= 1000) {
              lastProgressUpdateRef.current = now;
              const progress = video.currentTime / video.duration;
              setPlayed(progress);
              onProgress?.({ played: progress, playedSeconds: video.currentTime, loaded: 0, loadedSeconds: 0 });
            }
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        onError={(e) => {
          console.error('[VideoPlayer] Video error:', e);
          setHasError(true);
          onError?.(new Error('Video playback error'));
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}
