import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Rocket, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/store/common/languageStore';
import { useDisplayableBanners } from '@/hooks/tu';
import type { BannerResponse } from '@/types/ta/banner.types';

interface DefaultSlide {
  type: 'default';
  id: number;
  title: string;
  highlight: string;
  subtitleKey: 'slide1Subtitle' | 'slide2Subtitle' | 'slide3Subtitle';
  descKey: 'slide1Desc' | 'slide2Desc' | 'slide3Desc';
  badge: string;
  icon: typeof Sparkles;
  gradientClass: string;
}

interface BannerSlide {
  type: 'banner';
  banner: BannerResponse;
}

type Slide = DefaultSlide | BannerSlide;

const defaultSlides: DefaultSlide[] = [
  {
    type: 'default',
    id: 1,
    title: 'Empower Your',
    highlight: 'Future',
    subtitleKey: 'slide1Subtitle',
    descKey: 'slide1Desc',
    badge: 'MZC LEARN',
    icon: Sparkles,
    gradientClass: 'gradient-text',
  },
  {
    type: 'default',
    id: 2,
    title: 'Build Your',
    highlight: 'Career',
    subtitleKey: 'slide2Subtitle',
    descKey: 'slide2Desc',
    badge: 'ROADMAP',
    icon: Rocket,
    gradientClass: 'gradient-text-purple',
  },
  {
    type: 'default',
    id: 3,
    title: 'Master',
    highlight: 'Cloud',
    subtitleKey: 'slide3Subtitle',
    descKey: 'slide3Desc',
    badge: 'CLOUD',
    icon: Zap,
    gradientClass: 'gradient-text',
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const { t } = useTranslation();

  // TA 배너 가져오기
  const { data: banners = [] } = useDisplayableBanners('MAIN_TOP');

  // 배너 슬라이드 + 기본 슬라이드 합치기 (배너 먼저)
  const allSlides: Slide[] = [
    ...banners.map((banner): BannerSlide => ({ type: 'banner', banner })),
    ...defaultSlides,
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
  const isDefaultSlide = currentSlideData?.type === 'default';
  const defaultSlide = isDefaultSlide ? currentSlideData : null;
  const bannerSlide = !isDefaultSlide ? currentSlideData : null;
  const IconComponent = defaultSlide?.icon ?? Sparkles;

  return (
    <div className="w-full overflow-hidden relative animated-bg py-8 md:py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#6778ff]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-40 w-48 h-48 bg-[#6bc2f0]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-16 h-[400px] md:h-[500px] flex items-center justify-between relative">
        {/* 배너 슬라이드일 때 - 이미지 표시 */}
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

        {/* 기본 슬라이드일 때 - 텍스트 콘텐츠 */}
        {defaultSlide && (
          <>
            <div
              className={`z-10 max-w-2xl space-y-6 transition-all duration-500 ease-out ${
                isAnimating
                  ? `opacity-0 ${direction === 'right' ? '-translate-x-8' : 'translate-x-8'}`
                  : 'opacity-100 translate-x-0'
              }`}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                <IconComponent className="w-4 h-4" />
                {defaultSlide.badge}
              </span>

              <div className="space-y-2">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                  {defaultSlide.title}
                </h2>
                <h2
                  className={`text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight ${defaultSlide.gradientClass}`}
                >
                  {defaultSlide.highlight}
                </h2>
              </div>

              <p className="text-xl md:text-2xl font-medium text-gray-300 whitespace-pre-line leading-relaxed">
                {t.hero[defaultSlide.subtitleKey]}
              </p>

              <p className="text-base md:text-lg text-gray-500">{t.hero[defaultSlide.descKey]}</p>

              <div className="flex gap-4 pt-4">
                <Link
                  to="/tu/b2c/courses"
                  className="landing-btn-primary px-8 py-4 rounded-full text-white font-bold text-base flex items-center gap-2"
                >
                  {t.hero.getStarted}
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/tu/b2c/mypage/learning"
                  className="landing-btn-outline px-8 py-4 rounded-full text-white font-medium text-base"
                >
                  {t.hero.explore}
                </Link>
              </div>
            </div>

            {/* Right Side - Abstract Shape (기본 슬라이드에서만) */}
            <div
              className={`hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center justify-center transition-all duration-500 ease-out ${
                isAnimating ? `opacity-0 scale-95` : 'opacity-100 scale-100'
              }`}
            >
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6778ff]/30 to-[#a855f7]/30 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-[#70f2a0]/20 to-[#6bc2f0]/20 rounded-full blur-xl"></div>
                <div className="absolute inset-16 glass rounded-full flex items-center justify-center">
                  <IconComponent className="w-16 h-16 text-white/80" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/20 transition-all z-20"
          aria-label={t.hero.prevSlide}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/20 transition-all z-20"
          aria-label={t.hero.nextSlide}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Dots */}
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
    </div>
  );
}
