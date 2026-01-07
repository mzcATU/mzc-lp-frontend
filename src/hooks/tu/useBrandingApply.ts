import { useEffect } from 'react';
import type { PublicBrandingResponse } from '@/types/tu/branding.types';

/**
 * 색상을 어둡게 만드는 유틸리티 (hover 상태용)
 */
function darkenColor(hex: string, percent: number = 15): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - Math.round(255 * percent / 100));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * percent / 100));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * percent / 100));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * 색상을 밝게 만드는 유틸리티 (hover 상태용)
 */
function lightenColor(hex: string, percent: number = 15): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 0xff) + Math.round(255 * percent / 100));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * 브랜딩을 CSS 변수로 적용하는 Hook
 * - Landing 페이지용 변수 (--landing-*)
 * - 전역 애플리케이션 변수 (--primary, --color-tenant-primary, --color-btn-brand)
 */
export function useBrandingApply(branding: PublicBrandingResponse | null | undefined) {
  useEffect(() => {
    if (!branding) return;

    const root = document.documentElement;

    // ===== Landing 페이지용 CSS 변수 =====
    if (branding.primaryColor) {
      const primaryHover = lightenColor(branding.primaryColor, 12);
      root.style.setProperty('--landing-primary-color', branding.primaryColor);
      root.style.setProperty('--landing-primary-hover', primaryHover);

      // gradient-text 업데이트
      const gradientFrom = branding.primaryColor;
      const gradientTo = branding.secondaryColor || branding.primaryColor;
      root.style.setProperty('--landing-gradient-from', gradientFrom);
      root.style.setProperty('--landing-gradient-to', gradientTo);
    }

    if (branding.secondaryColor) {
      const secondaryHover = lightenColor(branding.secondaryColor, 12);
      root.style.setProperty('--landing-secondary-color', branding.secondaryColor);
      root.style.setProperty('--landing-secondary-hover', secondaryHover);
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

    // ===== 전역 애플리케이션 CSS 변수 =====
    if (branding.primaryColor) {
      const primaryHover = darkenColor(branding.primaryColor, 15);

      // shadcn/ui 기본 변수
      root.style.setProperty('--primary', branding.primaryColor);
      root.style.setProperty('--primary-hover', primaryHover);

      // 테넌트 전용 변수
      root.style.setProperty('--color-tenant-primary', branding.primaryColor);
      root.style.setProperty('--color-tenant-primary-hover', primaryHover);

      // 브랜드 버튼 변수
      root.style.setProperty('--color-btn-brand', branding.primaryColor);
      root.style.setProperty('--color-btn-brand-hover', primaryHover);

      // Badge indigo (primary 색상과 연동)
      root.style.setProperty('--color-badge-indigo', branding.primaryColor);
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

    // Cleanup: 컴포넌트 언마운트 시 기본값 복원
    return () => {
      // 기본값으로 복원 (필요시)
      // 현재는 SPA이므로 페이지 새로고침 시 자동 복원됨
    };
  }, [branding]);
}
