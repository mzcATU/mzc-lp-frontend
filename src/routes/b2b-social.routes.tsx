import { b2bSocialTuRoutes } from './b2b-social.tu.routes';
import { b2bSocialToRoutes } from './b2b-social.to.routes';
import { b2bSocialTaRoutes } from './b2b-social.ta.routes';

/**
 * B2B 소셜러닝 라우트 통합
 *
 * 구조:
 * - /b2b-social           : 랜딩 페이지
 * - /b2b-social/tu/*      : 학습자 페이지 (TU)
 * - /b2b-social/to/*      : 운영자 페이지 (TO)
 * - /b2b-social/ta/*      : 관리자 페이지 (TA)
 */
export const b2bSocialRoutes = (
  <>
    {/* 학습자 (TU) */}
    {b2bSocialTuRoutes}

    {/* 운영자 (TO) */}
    {b2bSocialToRoutes}

    {/* 관리자 (TA) */}
    {b2bSocialTaRoutes}
  </>
);
