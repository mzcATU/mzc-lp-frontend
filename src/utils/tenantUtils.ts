/**
 * 테넌트 식별 유틸리티
 *
 * 도메인 구조:
 * - Subdomain: {subdomain}.mzclearn.com
 * - Custom Domain: company.com
 * - Path-based (개발): localhost:3000/{subdomain}/tu/*
 */

export interface TenantIdentifier {
  type: 'subdomain' | 'customDomain';
  identifier: string;
}

/**
 * URL 경로에서 서브도메인 추출 (개발 환경용)
 * 경로 패턴: /{subdomain}/tu/* 또는 /{subdomain}/ta/*
 *
 * @example
 * /mzc/tu/b2c/courses → 'mzc'
 * /samsung/ta/dashboard → 'samsung'
 */
export function extractSubdomainFromPath(): string | null {
  const pathname = window.location.pathname;

  // 경로 기반 서브도메인 패턴: /{subdomain}/(tu|ta|co)/...
  const regex = /^\/([^/]+)\/(tu|ta|co)(\/|$)/;
  const match = regex.exec(pathname);
  const subdomain = match?.[1];

  if (subdomain) {
    // 시스템 경로는 제외
    if (['admin', 'sa', 'auth', 'public'].includes(subdomain)) {
      return null;
    }
    return subdomain;
  }

  return null;
}

/**
 * 현재 호스트네임 또는 경로에서 테넌트 식별자 추출
 *
 * 예시:
 * - samsung.mzclearn.com → { type: 'subdomain', identifier: 'samsung' }
 * - company.com → { type: 'customDomain', identifier: 'company.com' }
 * - localhost:3000/mzc/tu/b2c → { type: 'subdomain', identifier: 'mzc' } (경로 기반)
 * - localhost:3000 → null (개발 환경, 기본 테넌트)
 */
export function extractTenantIdentifier(): TenantIdentifier | null {
  const hostname = window.location.hostname;

  // 로컬 개발 환경 - 경로 기반 서브도메인 확인
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const pathSubdomain = extractSubdomainFromPath();
    if (pathSubdomain) {
      return { type: 'subdomain', identifier: pathSubdomain };
    }
    return null; // 기본 브랜딩 사용
  }

  // 메인 도메인 패턴 (예: mzclearn.com)
  const mainDomain = import.meta.env.VITE_MAIN_DOMAIN || 'mzclearn.com';

  // Subdomain 확인
  if (hostname.endsWith(`.${mainDomain}`)) {
    const subdomain = hostname.replace(`.${mainDomain}`, '');
    // www는 메인 도메인으로 처리
    if (subdomain === 'www' || subdomain === '') {
      return null;
    }
    return { type: 'subdomain', identifier: subdomain };
  }

  // 메인 도메인 자체 (mzclearn.com)
  if (hostname === mainDomain || hostname === `www.${mainDomain}`) {
    return null;
  }

  // Custom Domain
  return { type: 'customDomain', identifier: hostname };
}
