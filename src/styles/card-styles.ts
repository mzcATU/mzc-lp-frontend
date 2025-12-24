import { designTokens } from './design-tokens';

/**
 * LMS Platform - Common Card Styles
 * 모든 페이지에서 일관된 카드 스타일을 사용하기 위한 공통 상수
 */
export const cardStyles = {
  // Base 카드 스타일
  base: {
    backgroundColor: designTokens.bg.default,
    border: `1px solid ${designTokens.bg.border}`,
    borderRadius: '12px',
    transition: 'all 0.2s ease',
  },

  // 그림자 레벨 (Material Design 기반)
  shadow: {
    none: 'none',                                     // 정적 카드 (통계, 설정)
    sm: '0 1px 3px rgba(0, 0, 0, 0.08)',              // 인터랙티브 카드 기본
    md: '0 4px 12px rgba(0, 0, 0, 0.12)',             // 인터랙티브 카드 호버
    lg: '0 8px 24px rgba(0, 0, 0, 0.08)',             // 모달/오버레이
  },

  // 패딩 크기
  padding: {
    sm: '16px',
    md: '24px',
    lg: '32px',
  },

  // 호버 효과 (인터랙티브 카드용)
  hover: {
    transform: 'translateY(-4px)',
    shadowTransition: 'box-shadow 0.2s ease, transform 0.2s ease',
  },

  // 클릭 가능한 카드용 스타일
  clickable: {
    cursor: 'pointer',
  },

  // 정적 카드 (클릭 불가, 정보 표시용)
  static: {
    backgroundColor: designTokens.bg.card_static,  // #F0F0F0 연한 회색
    boxShadow: 'none',  // 그림자 없음
  },

  // 인터랙티브 카드 (클릭 가능)
  interactive: {
    backgroundColor: designTokens.bg.default,  // #FFFFFF 순백
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
  },
};

export type CardStyles = typeof cardStyles;
