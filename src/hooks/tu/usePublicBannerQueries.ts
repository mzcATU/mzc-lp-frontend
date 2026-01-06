/**
 * TU 공개 배너 관련 React Query 훅
 */
import { useQuery } from '@tanstack/react-query';
import { publicBannerService } from '@/services/tu/publicBannerService';
import type { BannerPosition } from '@/types/ta/banner.types';

// Query Keys
export const publicBannerKeys = {
  all: ['tu-public-banners'] as const,
  displayable: (position?: BannerPosition) =>
    [...publicBannerKeys.all, 'displayable', position] as const,
};

/**
 * 노출 가능한 공개 배너 조회
 * @param position 배너 위치 필터 (선택)
 */
export const useDisplayableBanners = (position?: BannerPosition) => {
  return useQuery({
    queryKey: publicBannerKeys.displayable(position),
    queryFn: () => publicBannerService.getDisplayableBanners(position),
  });
};
