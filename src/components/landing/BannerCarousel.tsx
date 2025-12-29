import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BannerItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  hiddenTags?: string[];
}

interface BannerCarouselProps {
  banners: BannerItem[];
  autoPlayInterval?: number;
  className?: string;
}

/**
 * B2B 소셜러닝용 이미지 배너 캐러셀
 * - TA에서 관리하는 배너를 표시
 * - 자동 슬라이드 + 수동 네비게이션
 */
export function BannerCarousel({
  banners,
  autoPlayInterval = 5000,
  className,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isAnimating || banners.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
      setIsAnimating(false);
    }, 300);
  };

  const nextSlide = () => {
    if (isAnimating || banners.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
      setIsAnimating(false);
    }, 300);
  };

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  const BannerContent = (
    <div
      className={cn(
        'relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-xl',
        className
      )}
    >
      {/* Banner Image */}
      <div
        className={cn(
          'absolute inset-0 bg-cover bg-center transition-all duration-500',
          isAnimating ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        )}
        style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Banner Title */}
      <div
        className={cn(
          'absolute bottom-8 left-8 right-8 transition-all duration-500',
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        )}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
          {currentBanner.title}
        </h2>
        {currentBanner.hiddenTags && currentBanner.hiddenTags.length > 0 && (
          <div className="flex gap-2 mt-3">
            {currentBanner.hiddenTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-all"
            aria-label="이전 배너"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-all"
            aria-label="다음 배너"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`배너 ${index + 1}로 이동`}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/70'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );

  // If banner has a link, wrap in anchor
  if (currentBanner.linkUrl) {
    return (
      <a href={currentBanner.linkUrl} className="block">
        {BannerContent}
      </a>
    );
  }

  return BannerContent;
}
