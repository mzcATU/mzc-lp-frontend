import { Route } from 'react-router-dom';
import { LandingPage } from '@/pages/b2b-social';

/**
 * B2B 소셜러닝 TU (학습자) 라우트
 *
 * 경로: /tu/b2b-social/*
 * - 랜딩, 콘텐츠 탐색, 학습 등
 */
export const b2bSocialTuRoutes = (
  <>
    {/* 랜딩 페이지 */}
    <Route path="/tu/b2b-social" element={<LandingPage />} />

    {/* 콘텐츠 카탈로그 (추후 구현) */}
    {/* <Route path="/tu/b2b-social/catalog" element={<CatalogPage />} /> */}
    {/* <Route path="/tu/b2b-social/catalog/:id" element={<ContentDetailPage />} /> */}

    {/* 학습 관련 (추후 구현) */}
    {/* <Route path="/tu/b2b-social/learning" element={<MyLearningPage />} /> */}
  </>
);
