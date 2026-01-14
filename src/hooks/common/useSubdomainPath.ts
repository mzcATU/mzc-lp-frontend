import { useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';

/**
 * 경로에서 서브도메인 추출
 * 경로 패턴: /{subdomain}/(tu|ta|co)/...
 */
function extractSubdomainFromPath(pathname: string): string | null {
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
 * 서브도메인 기반 경로 프리픽스 훅
 * URL에서 subdomain 파라미터를 추출하여 경로 앞에 추가
 *
 * 두 가지 방법으로 서브도메인 추출:
 * 1. useParams() - React Router 라우트 파라미터
 * 2. pathname 파싱 - 폴백 방식
 *
 * @example
 * const { prefixPath } = useSubdomainPath();
 * // URL이 /mzc/ta/dashboard 일 때
 * prefixPath('/ta/settings') // => '/mzc/ta/settings'
 * // URL이 /ta/dashboard 일 때 (서브도메인 없음)
 * prefixPath('/ta/settings') // => '/ta/settings'
 */
export function useSubdomainPath() {
  const { subdomain: routeSubdomain } = useParams<{ subdomain: string }>();
  const location = useLocation();

  // useParams에서 가져온 subdomain이 없으면 pathname에서 추출 (폴백)
  const extractedSubdomain = extractSubdomainFromPath(location.pathname);
  const subdomain = routeSubdomain || extractedSubdomain;

  const prefixPath = useCallback(
    (path: string) => {
      if (subdomain) {
        return `/${subdomain}${path}`;
      }
      return path;
    },
    [subdomain]
  );

  return { subdomain, prefixPath };
}
