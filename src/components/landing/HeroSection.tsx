import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Rocket, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/store/common/languageStore';

const slideData = [
  {
    id: 1,
    title: 'Empower Your',
    highlight: 'Future',
    subtitleKey: 'slide1Subtitle' as const,
    descKey: 'slide1Desc' as const,
    badge: 'MZC LEARN',
    icon: Sparkles,
    gradientClass: 'gradient-text',
  },
  {
    id: 2,
    title: 'Build Your',
    highlight: 'Career',
    subtitleKey: 'slide2Subtitle' as const,
    descKey: 'slide2Desc' as const,
    badge: 'ROADMAP',
    icon: Rocket,
    gradientClass: 'gradient-text-purple',
  },
  {
    id: 3,
    title: 'Master',
    highlight: 'Cloud',
    subtitleKey: 'slide3Subtitle' as const,
    descKey: 'slide3Desc' as const,
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

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slideData.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      setCurrentSlide((prev) => (prev - 1 + slideData.length) % slideData.length);
      setIsAnimating(false);
    }, 300);
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slideData.length);
      setIsAnimating(false);
    }, 300);
  };

  const slide = slideData[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div className="w-full overflow-hidden relative animated-bg py-8 md:py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#6778ff]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-40 w-48 h-48 bg-[#6bc2f0]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full px-4 md:px-8 lg:px-16 h-[400px] md:h-[500px] flex items-center justify-between relative">
        {/* Text Content */}
        <div
          className={`z-10 max-w-2xl space-y-6 transition-all duration-500 ease-out ${
            isAnimating
              ? `opacity-0 ${direction === 'right' ? '-translate-x-8' : 'translate-x-8'}`
              : 'opacity-100 translate-x-0'
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
            <IconComponent className="w-4 h-4" />
            {slide.badge}
          </span>

          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
              {slide.title}
            </h2>
            <h2
              className={`text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight ${slide.gradientClass}`}
            >
              {slide.highlight}
            </h2>
          </div>

          <p className="text-xl md:text-2xl font-medium text-gray-300 whitespace-pre-line leading-relaxed">
            {t.hero[slide.subtitleKey]}
          </p>

          <p className="text-base md:text-lg text-gray-500">{t.hero[slide.descKey]}</p>

          <div className="flex gap-4 pt-4">
            <Link
              to="/tu/catalog"
              className="landing-btn-primary px-8 py-4 rounded-full text-white font-bold text-base flex items-center gap-2"
            >
              {t.hero.getStarted}
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/mypage/learning"
              className="landing-btn-outline px-8 py-4 rounded-full text-white font-medium text-base"
            >
              {t.hero.explore}
            </Link>
          </div>
        </div>

        {/* Right Side - Abstract Shape */}
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

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/20 transition-all"
          aria-label={t.hero.prevSlide}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 lg:right-[380px] top-1/2 -translate-y-1/2 p-3 rounded-full glass hover:bg-white/20 transition-all"
          aria-label={t.hero.nextSlide}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slideData.map((_, index) => (
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
