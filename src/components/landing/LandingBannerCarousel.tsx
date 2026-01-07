import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDisplayableBanners } from '@/hooks/tu';
import type { BannerPosition } from '@/types/ta/banner.types';

interface LandingBannerCarouselProps {
  position?: BannerPosition;
  autoPlayInterval?: number;
  className?: string;
}

/**
 * 랜딩 페이지 배너 캐러셀
 * - 테넌트 관리자가 등록한 배너를 자동 슬라이드로 표시
 * - 위치별 필터링 지원
 */
export function LandingBannerCarousel({
  position = 'MAIN_TOP',
  autoPlayInterval = 5000,
  className = '',
}: LandingBannerCarouselProps) {
  const { data: banners = [], isLoading } = useDisplayableBanners(position);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 자동 슬라이드
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
        setIsAnimating(false);
      }, 300);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlayInterval]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentIndex) return;
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsAnimating(false);
      }, 300);
    },
    [isAnimating, currentIndex]
  );

  const prevSlide = useCallback(() => {
    if (isAnimating || banners.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, banners.length]);

  const nextSlide = useCallback(() => {
    if (isAnimating || banners.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, banners.length]);

  // 로딩 중이거나 배너가 없으면 렌더링하지 않음
  if (isLoading || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const handleBannerClick = () => {
    if (currentBanner.linkUrl) {
      window.open(currentBanner.linkUrl, currentBanner.linkTarget || '_self');
    }
  };

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* 배너 이미지 */}
      <div
        className={`relative w-full aspect-[3/1] md:aspect-[4/1] transition-all duration-500 ease-out ${
          isAnimating ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'
        } ${currentBanner.linkUrl ? 'cursor-pointer' : ''}`}
        onClick={handleBannerClick}
      >
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          className="w-full h-full object-cover"
        />
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>

      {/* 네비게이션 화살표 (배너가 2개 이상일 때만) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all backdrop-blur-sm"
            aria-label="이전 배너"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 hover:bg-black/50 transition-all backdrop-blur-sm"
            aria-label="다음 배너"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* 인디케이터 도트 (배너가 2개 이상일 때만) */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              aria-label={`${index + 1}번 배너로 이동`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
