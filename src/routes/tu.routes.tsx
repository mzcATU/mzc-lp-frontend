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
 * - /tu/b2c/mypage/*  : B2C 마이페이지 (사이드바 있음, 로그인 필요)
 * - /tu/b2b/mypage/*  : B2B 마이페이지 (사이드바 있음, 로그인 필요)
 * - /tu/teaching/*    : 강의 관리 (사이드바 있음, 로그인 필요)
 *
 * 라우트 순서 규칙 (React Router v6):
 * 1. 강의 관리 (가장 구체적 - /tu/teaching/*)
 * 2. B2B 전체 (구체적 - /tu/b2b/* 및 /:subdomain/tu/b2b/*)
 * 3. B2C 마이페이지 (구체적 - /tu/b2c/mypage/*)
 * 4. B2C 메인 (일반적 - /tu/b2c/*)
 */
export const tuRoutes = (
  <>
    {/* 1. 강의 관리 (가장 구체적인 경로) */}
    {tuTeachingRoutes}

    {/* 2. B2B 전체 (B2B 마이페이지 포함 - B2C보다 먼저) */}
    {tuB2bRoutes}

    {/* 3. B2C 마이페이지 (플레이어 포함) */}
    {tuMyPageRoutes}

    {/* 4. B2C 메인 페이지 (가장 일반적인 경로는 마지막) */}
    {tuB2cRoutes}
  </>
);
