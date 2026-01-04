/**
 * 공개 브랜딩 정보 타입
 */
export interface PublicBrandingResponse {
  tenantName: string;
  logoUrl: string | null;
  darkLogoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string | null;
  headingFont: string | null;
  bodyFont: string | null;
}
