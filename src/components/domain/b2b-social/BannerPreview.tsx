import { useState } from 'react';
import { Monitor, Smartphone, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common';
import { cn } from '@/utils/cn';

interface BannerData {
  id: string;
  title: string;
  pcImageUrl?: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
}

interface BannerPreviewProps {
  banners: BannerData[];
  initialIndex?: number;
  className?: string;
}

export function BannerPreview({
  banners,
  initialIndex = 0,
  className,
}: BannerPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [deviceType, setDeviceType] = useState<'pc' | 'mobile'>('pc');

  const activeBanners = banners.filter((b) => b.isActive);
  const currentBanner = activeBanners[currentIndex];

  const nextBanner = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  if (activeBanners.length === 0) {
    return (
      <div
        className={cn('flex items-center justify-center p-8 rounded-lg', className)}
        style={{ backgroundColor: designTokens.bg.secondary }}
      >
        <p style={{ color: designTokens.text.secondary }}>
          활성화된 배너가 없습니다.
        </p>
      </div>
    );
  }

  const currentImageUrl =
    deviceType === 'mobile' && currentBanner?.mobileImageUrl
      ? currentBanner.mobileImageUrl
      : currentBanner?.pcImageUrl;

  return (
    <div className={cn('space-y-4', className)}>
      {/* 디바이스 탭 */}
      <Tabs value={deviceType} onValueChange={(v) => setDeviceType(v as 'pc' | 'mobile')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pc" className="gap-2">
            <Monitor className="w-4 h-4" />
            PC 미리보기
          </TabsTrigger>
          <TabsTrigger value="mobile" className="gap-2">
            <Smartphone className="w-4 h-4" />
            Mobile 미리보기
          </TabsTrigger>
        </TabsList>

        {/* PC 미리보기 */}
        <TabsContent value="pc" className="mt-4">
          <div
            className="rounded-xl overflow-hidden border"
            style={{
              backgroundColor: '#1a1a1a',
              borderColor: designTokens.bg.border,
            }}
          >
            {/* 브라우저 바 */}
            <div
              className="flex items-center gap-2 px-4 py-2 border-b"
              style={{
                backgroundColor: '#2a2a2a',
                borderColor: '#3a3a3a',
              }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div
                className="flex-1 mx-4 px-3 py-1 rounded text-xs"
                style={{ backgroundColor: '#3a3a3a', color: '#888' }}
              >
                https://learning-hub.company.com
              </div>
            </div>

            {/* 배너 영역 */}
            <div className="relative p-4">
              <div className="relative aspect-[3/1] rounded-lg overflow-hidden">
                {currentImageUrl ? (
                  <img
                    src={currentImageUrl}
                    alt={currentBanner?.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: designTokens.bg.secondary }}
                  >
                    <p style={{ color: designTokens.text.placeholder }}>
                      이미지 없음
                    </p>
                  </div>
                )}

                {/* 내비게이션 */}
                {activeBanners.length > 1 && (
                  <>
                    <button
                      onClick={prevBanner}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={nextBanner}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}

                {/* 인디케이터 */}
                {activeBanners.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {activeBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          idx === currentIndex
                            ? 'w-6 bg-white'
                            : 'bg-white/50 hover:bg-white/70'
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Mobile 미리보기 */}
        <TabsContent value="mobile" className="mt-4">
          <div className="flex justify-center">
            <div
              className="w-[320px] rounded-[2.5rem] p-3 border-[8px]"
              style={{
                backgroundColor: '#1a1a1a',
                borderColor: '#2a2a2a',
              }}
            >
              {/* 노치 */}
              <div className="flex justify-center mb-2">
                <div
                  className="w-24 h-6 rounded-full"
                  style={{ backgroundColor: '#2a2a2a' }}
                />
              </div>

              {/* 스크린 */}
              <div
                className="rounded-[1.5rem] overflow-hidden"
                style={{ backgroundColor: designTokens.bg.default }}
              >
                {/* 상태바 */}
                <div
                  className="flex items-center justify-between px-4 py-2 text-xs"
                  style={{ color: designTokens.text.primary }}
                >
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* 배너 */}
                <div className="px-3 pb-4">
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                    {currentBanner?.mobileImageUrl || currentImageUrl ? (
                      <img
                        src={currentBanner?.mobileImageUrl || currentImageUrl}
                        alt={currentBanner?.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: designTokens.bg.secondary }}
                      >
                        <p
                          className="text-sm"
                          style={{ color: designTokens.text.placeholder }}
                        >
                          모바일 이미지 없음
                        </p>
                      </div>
                    )}

                    {/* 인디케이터 */}
                    {activeBanners.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {activeBanners.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={cn(
                              'w-1.5 h-1.5 rounded-full transition-all',
                              idx === currentIndex
                                ? 'w-4 bg-white'
                                : 'bg-white/50'
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 추가 컨텐츠 영역 (시뮬레이션) */}
                  <div className="mt-4 space-y-3">
                    <div
                      className="h-4 rounded"
                      style={{ backgroundColor: designTokens.bg.secondary, width: '60%' }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="aspect-square rounded-lg"
                        style={{ backgroundColor: designTokens.bg.secondary }}
                      />
                      <div
                        className="aspect-square rounded-lg"
                        style={{ backgroundColor: designTokens.bg.secondary }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 홈 인디케이터 */}
              <div className="flex justify-center mt-2">
                <div
                  className="w-32 h-1 rounded-full"
                  style={{ backgroundColor: '#3a3a3a' }}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 배너 정보 */}
      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: designTokens.bg.secondary }}
      >
        <div className="flex items-center justify-between mb-2">
          <p
            className="font-medium"
            style={{ color: designTokens.text.primary }}
          >
            {currentBanner?.title}
          </p>
          <Badge variant="gray" className="text-xs">
            {currentIndex + 1} / {activeBanners.length}
          </Badge>
        </div>
        {currentBanner?.linkUrl && (
          <div className="flex items-center gap-2">
            <ExternalLink
              className="w-4 h-4"
              style={{ color: designTokens.text.placeholder }}
            />
            <a
              href={currentBanner.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm truncate hover:underline"
              style={{ color: designTokens.button.brand_default }}
            >
              {currentBanner.linkUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
