import { tuB2cRoutes } from './tu.b2c.routes';
import { tuB2bRoutes } from './tu.b2b.routes';
import { tuMyPageRoutes } from './tu.mypage.routes';
import { tuTeachingRoutes } from './tu.teaching.routes';

/**
 * TU (Tenant User) 라우트 통합
 *
 * 구조:
 * - /tu/b2c/*         : B2C 메인 페이지 (사이드바 없음, 개인 고객용)
 * - /tu/b2b/*         : B2B 메인 페이지 (사이드바 없음, 기업 고객용 - 장바구니/가격/로드맵/커뮤니티 없음)
 * - /tu/b2c/mypage/*  : 마이페이지 (사이드바 있음, 로그인 필요)
 * - /tu/teaching/*    : 강의 관리 (사이드바 있음, 로그인 필요)
 */
export const tuRoutes = (
  <>
    {/* 마이페이지 (플레이어 포함 - 더 구체적인 경로 먼저) */}
    {tuMyPageRoutes}

    {/* 강의 관리 */}
    {tuTeachingRoutes}

    {/* B2B 메인 페이지 (기업용 - 기능 축소) */}
    {tuB2bRoutes}

    {/* B2C 메인 페이지 (개인용 - 가장 일반적인 경로 마지막) */}
    {tuB2cRoutes}
  </>
);
