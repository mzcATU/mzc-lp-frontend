/**
 * 테넌트 식별 유틸리티
 *
 * 도메인 구조:
 * - Subdomain: {subdomain}.mzclearn.com
 * - Custom Domain: company.com
 */

export interface TenantIdentifier {
  type: 'subdomain' | 'customDomain';
  identifier: string;
}

/**
 * 현재 호스트네임에서 테넌트 식별자 추출
 *
 * 예시:
 * - samsung.mzclearn.com → { type: 'subdomain', identifier: 'samsung' }
 * - company.com → { type: 'customDomain', identifier: 'company.com' }
 * - localhost:3000 → null (개발 환경, 기본 테넌트)
 */
export function extractTenantIdentifier(): TenantIdentifier | null {
  const hostname = window.location.hostname;

  // 로컬 개발 환경
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
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
