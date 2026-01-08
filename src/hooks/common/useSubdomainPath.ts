import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

/**
 * 서브도메인 기반 경로 프리픽스 훅
 * URL에서 subdomain 파라미터를 추출하여 경로 앞에 추가
 *
 * @example
 * const { prefixPath } = useSubdomainPath();
 * // URL이 /mzc/ta/dashboard 일 때
 * prefixPath('/ta/settings') // => '/mzc/ta/settings'
 * // URL이 /ta/dashboard 일 때 (서브도메인 없음)
 * prefixPath('/ta/settings') // => '/ta/settings'
 */
export function useSubdomainPath() {
  const { subdomain } = useParams<{ subdomain: string }>();

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
