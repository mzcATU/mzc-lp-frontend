import { tuB2cRoutes } from './tu.b2c.routes';
import { tuMyPageRoutes } from './tu.mypage.routes';
import { tuTeachingRoutes } from './tu.teaching.routes';

/**
 * TU (Tenant User) 라우트 통합
 *
 * 구조:
 * - /                 : 랜딩 페이지
 * - /tu/b2c/*         : B2C 메인 페이지 (사이드바 없음)
 * - /tu/b2c/mypage/*  : 마이페이지 (사이드바 있음, 로그인 필요)
 * - /tu/teaching/*    : 강의 관리 (사이드바 있음, 로그인 필요)
 */
export const tuRoutes = (
  <>
    {/* B2C 메인 페이지 */}
    {tuB2cRoutes}

    {/* 마이페이지 */}
    {tuMyPageRoutes}

    {/* 강의 관리 */}
    {tuTeachingRoutes}
  </>
);
