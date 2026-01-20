import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/store/common/languageStore';
import { useDisplayableBanners, usePublicLayout } from '@/hooks/tu';
import type { BannerResponse } from '@/types/ta/banner.types';
import type { BannerItem } from '@/types/tu/branding.types';

interface BannerSlide {
  type: 'banner';
  banner: BannerResponse;
}

interface BrandingBannerSlide {
  type: 'branding-banner';
  bannerItem: BannerItem;
}

type Slide = BannerSlide | BrandingBannerSlide;

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const { t } = useTranslation();

  // TA 배너 가져오기 (기존 배너 API)
  const { data: banners = [] } = useDisplayableBanners('MAIN_TOP');

  // 브랜딩 설정에서 배너 가져오기 (기본값 포함)
  const { data: layoutData } = usePublicLayout();
  const bannerSettings = layoutData?.bannerSettings;
  const brandingBannerItems = bannerSettings?.enabled !== false ? (bannerSettings?.items || []) : [];

  // 배너 슬라이드 합치기 (브랜딩 배너 먼저, 그다음 기존 배너 API)
  const allSlides: Slide[] = [
    // 브랜딩 설정 배너 (TA 브랜딩 페이지에서 설정, 기본값 포함)
    ...brandingBannerItems
      .filter((item) => item.imageUrl || item.code)
      .sort((a, b) => a.order - b.order)
      .map((item): BrandingBannerSlide => ({ type: 'branding-banner', bannerItem: item })),
    // 기존 배너 API
    ...banners.map((banner): BannerSlide => ({ type: 'banner', banner })),
  ];

  const totalSlides = allSlides.length;

  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = setInterval(() => {
      setDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return;
    setDirection(index > currentSlide ? 'right' : 'left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      setIsAnimating(false);
    }, 300);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
      setIsAnimating(false);
    }, 300);
  };

  const currentSlideData = allSlides[currentSlide];
  const isBannerSlide = currentSlideData?.type === 'banner';
  const isBrandingBannerSlide = currentSlideData?.type === 'branding-banner';
  const bannerSlide = isBannerSlide ? currentSlideData : null;
  const brandingBannerSlide = isBrandingBannerSlide ? currentSlideData : null;

  // 슬라이드가 없으면 렌더링하지 않음
  if (totalSlides === 0) {
    return null;
  }

  // 브랜딩 배너 중 이미지 타입이 있는지 확인 (코드 타입만 있으면 배경 표시)
  const hasImageBanner = brandingBannerItems.some(item => item.type === 'image' && item.imageUrl);

  return (
    <div className="w-full overflow-hidden relative">
      {/* 이미지 배너가 없을 때 기본 배경 표시 (코드 타입이거나 배너가 없는 경우) */}
      {!hasImageBanner && (
        <>
          <div className="absolute inset-0 animated-bg" />
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#6778ff]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-40 w-48 h-48 bg-[#6bc2f0]/10 rounded-full blur-3xl"></div>
          </div>
        </>
      )}

      <div className="w-full h-[400px] md:h-[500px] flex items-center justify-between relative">
        {/* 브랜딩 배너 슬라이드 (TA 브랜딩 설정에서 추가) */}
        {brandingBannerSlide && (
          <div
            className={`absolute inset-0 z-10 transition-all duration-500 ease-out ${
              isAnimating
                ? `opacity-0 ${direction === 'right' ? '-translate-x-8' : 'translate-x-8'}`
                : 'opacity-100 translate-x-0'
            }`}
          >
            {brandingBannerSlide.bannerItem.type === 'image' && brandingBannerSlide.bannerItem.imageUrl ? (
              <div className="block w-full h-full">
                <img
                  src={brandingBannerSlide.bannerItem.imageUrl}
                  alt={brandingBannerSlide.bannerItem.title || '배너'}
                  className="w-full h-full object-contain"
                />
                {/* 그라디언트 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            ) : brandingBannerSlide.bannerItem.type === 'code' && brandingBannerSlide.bannerItem.code ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: brandingBannerSlide.bannerItem.code }}
              />
            ) : null}
          </div>
        )}

        {/* 기존 배너 API 슬라이드 */}
        {bannerSlide && (
          <div
            className={`absolute inset-0 z-10 transition-all duration-500 ease-out ${
              isAnimating
                ? `opacity-0 ${direction === 'right' ? '-translate-x-8' : 'translate-x-8'}`
                : 'opacity-100 translate-x-0'
            }`}
          >
            <a
              href={bannerSlide.banner.linkUrl || undefined}
              target={bannerSlide.banner.linkTarget || '_self'}
              className={`block w-full h-full ${bannerSlide.banner.linkUrl ? 'cursor-pointer' : ''}`}
              onClick={(e) => !bannerSlide.banner.linkUrl && e.preventDefault()}
            >
              <img
                src={bannerSlide.banner.imageUrl}
                alt={bannerSlide.banner.title}
                className="w-full h-full object-contain"
              />
              {/* 그라디언트 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </a>
          </div>
        )}

        {/* Navigation Arrows - 텍스트와 겹치지 않도록 배경 강화 */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2.5 md:p-3 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all z-20 shadow-lg border border-white/20"
              aria-label={t.hero.prevSlide}
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2.5 md:p-3 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all z-20 shadow-lg border border-white/20"
              aria-label={t.hero.nextSlide}
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {totalSlides > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {allSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`${t.hero.goToSlide} ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-gradient-to-r from-[#6778ff] to-[#a855f7]'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
