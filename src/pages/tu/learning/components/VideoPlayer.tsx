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
}: VideoPlayerProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 URL (YouTube 등) 여부 확인
  const isExternalUrl = !!externalUrl;

  // HTML5 video ref (MP4용)
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isReady, setIsReady] = useState(isExternalUrl); // 외부 URL은 바로 ready
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);

  // 비디오 URL 결정
  const videoUrl = externalUrl || contentService.getStreamUrl(contentId);

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
    if (!video || !isExternalUrl || !videoUrl.endsWith('.mp4')) return;

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

  // 로딩 상태
  if (!isReady && !hasError) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full aspect-video flex items-center justify-center ${
          isDark ? 'bg-white/5' : 'bg-gray-100'
        }`}
      >
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={false}
          onReady={handleReady}
          onError={handleError}
          style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }}
        />
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
        ref={containerRef}
        className={`relative w-full aspect-video flex flex-col items-center justify-center gap-4 ${
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

  // 외부 URL (MP4 파일)인 경우 HTML5 video 사용
  if (isExternalUrl && videoUrl.endsWith('.mp4')) {
    return (
      <div
        ref={containerRef}
        className="relative w-full aspect-video overflow-hidden"
        style={{ backgroundColor: '#000' }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full h-full"
          style={{ display: 'block' }}
        />
      </div>
    );
  }

  // 외부 URL (YouTube, Vimeo 등)인 경우 ReactPlayer 사용
  if (isExternalUrl) {
    return (
      <div
        ref={containerRef}
        className="relative w-full aspect-video overflow-hidden"
        style={{ backgroundColor: '#000' }}
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

  // 내부 비디오 (스트리밍 서버)인 경우 커스텀 컨트롤 사용
  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video overflow-hidden group"
      style={{ backgroundColor: '#000' }}
    >
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width="100%"
        height="100%"
        playing={isPlaying}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={(dur) => {
          setDuration(dur);
          onDuration?.(dur);
        }}
        onEnded={handleEnded}
        onError={handleError}
        onReady={handleReady}
        progressInterval={1000}
        config={{
          file: {
            attributes: {
              crossOrigin: 'anonymous',
            },
          },
        }}
      />

      {/* 커스텀 컨트롤 오버레이 */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {/* 진행 바 */}
        <div className="mb-3">
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 ${played * 100}%, rgba(255,255,255,0.3) ${played * 100}%)`,
            }}
          />
        </div>

        {/* 컨트롤 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 재생/일시정지 */}
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* 음소거/볼륨 */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleMuteToggle}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, white ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.3) ${(muted ? 0 : volume) * 100}%)`,
                }}
              />
            </div>

            {/* 시간 표시 */}
            <span className="text-white text-sm">
              {formatTime(played * duration)} / {formatTime(duration)}
            </span>
          </div>

          {/* 전체 화면 */}
          <button
            onClick={handleFullscreen}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 중앙 재생 버튼 (일시정지 상태) */}
      {!isPlaying && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="w-8 h-8 ml-1 text-gray-900" />
          </div>
        </button>
      )}
    </div>
  );
}
