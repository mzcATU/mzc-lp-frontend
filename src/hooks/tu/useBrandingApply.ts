import { useEffect } from 'react';
import type { PublicBrandingResponse } from '@/types/tu/branding.types';

/**
 * 브랜딩을 CSS 변수로 적용하는 Hook
 */
export function useBrandingApply(branding: PublicBrandingResponse | null | undefined) {
  useEffect(() => {
    if (!branding) return;

    const root = document.documentElement;

    // 색상 적용
    if (branding.primaryColor) {
      root.style.setProperty('--landing-primary-color', branding.primaryColor);
      // gradient-text 업데이트
      const gradientFrom = branding.primaryColor;
      const gradientTo = branding.secondaryColor || branding.primaryColor;
      root.style.setProperty('--landing-gradient-from', gradientFrom);
      root.style.setProperty('--landing-gradient-to', gradientTo);
    }

    if (branding.secondaryColor) {
      root.style.setProperty('--landing-secondary-color', branding.secondaryColor);
    }

    if (branding.accentColor) {
      root.style.setProperty('--landing-accent-color', branding.accentColor);
    }

    // 폰트 적용
    if (branding.headingFont) {
      root.style.setProperty('--landing-heading-font', branding.headingFont);
    }

    if (branding.bodyFont) {
      root.style.setProperty('--landing-body-font', branding.bodyFont);
    }

    // Favicon 적용
    if (branding.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = branding.faviconUrl;
    }

    // Document title 업데이트
    if (branding.tenantName) {
      document.title = branding.tenantName;
    }
  }, [branding]);
}
