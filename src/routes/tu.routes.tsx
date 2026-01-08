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
    {/* 마이페이지 (플레이어 포함 - 더 구체적인 경로 먼저) */}
    {tuMyPageRoutes}

    {/* 강의 관리 */}
    {tuTeachingRoutes}

    {/* B2C 메인 페이지 (가장 일반적인 경로 마지막) */}
    {tuB2cRoutes}
  </>
);
