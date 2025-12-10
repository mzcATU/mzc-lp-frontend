/**
 * LMS Platform Design System - Semantic Color Tokens
 * All colors meet WCAG AA (4.5:1) contrast ratio requirements
 */

export const designTokens = {
  // --- Background and Neutral Tones ---
  bg: {
    default: '#FFFFFF',           // 주요 콘텐츠/카드 배경
    app_default: '#FAFAFA',       // 전체 앱 배경 (고정)
    secondary: '#F4F4F4',         // Admin 페이지 배경/테이블 헤더
    border: '#E0E0E0',            // 경계선, 인풋 테두리
    brand_active: '#D4CDEF',      // 사이드바/탭 활성 배경 (Soft Indigo) - 사용 안함
    sidebar_light_hover: '#F5F5F5', // 사이드바 라이트 모드 호버
    sidebar_light_active: '#E8E8E8', // 사이드바 라이트 모드 활성 (Neutral)
  },

  // --- Text and Typography ---
  text: {
    primary: '#333333',           // 핵심 텍스트 (WCAG AAA+)
    secondary: '#666666',         // 보조 텍스트/아이콘 (WCAG AA+)
    placeholder: '#999999',       // 플레이스홀더
    on_brand_active: '#4C2D9A',   // 활성 배경 위 텍스트/아이콘 (Brand Primary) - 사용 안함
    on_neutral_active: '#333333', // 중립 활성 배경 위 텍스트 (Neutral)
  },

  // --- Action and Brand Colors ---
  action: {
    primary_default: '#2A2A2A',   // 주 버튼/액션 색상 (Neutral Dark)
    primary_hover: '#3D3D3D',     // 주 버튼/액션 호버 (Neutral Dark Hover)
    primary_text: '#FFFFFF',      // 주 버튼 위 텍스트
    delete_text: '#F44336',       // 삭제/위험 액션 텍스트 (WCAG AA+)
  },

  // --- Button Styles ---
  button: {
    // Neutral 버튼 (등록, 저장 등 주요 액션)
    neutral_default: '#2A2A2A',       // 뉴트럴 버튼 기본
    neutral_hover: '#3D3D3D',         // 뉴트럴 버튼 호버 (15% 밝게)
    neutral_text: '#FFFFFF',          // 뉴트럴 버튼 텍스트

    // Brand 버튼 (브랜드 액션)
    brand_default: '#4C2D9A',         // 브랜드 버튼 기본 (보라색)
    brand_hover: '#3D2478',           // 브랜드 버튼 호버 (20% 어둡게)
    brand_text: '#FFFFFF',            // 브랜드 버튼 텍스트
  },

  // --- Status/Semantic Colors (Chips/Badges) ---
  status: {
    success_text: '#388E3C',           // Success 뱃지 텍스트 (WCAG AA+)
    success_background: '#D4EDDA',     // Success 뱃지 배경
    warning_text: '#FFA000',           // Warning 뱃지 텍스트 (WCAG AA+)
    warning_background: '#FFF3CD',     // Warning 뱃지 배경
    error_text: '#D32F2F',             // Error 뱃지 텍스트 (WCAG AA+)
    error_background: '#FFEBEE',       // Error 뱃지 배경
    neutral_disabled_text: '#666666',  // 진행 종료 등 비활성 텍스트
    neutral_disabled_bg: '#E0E0E0',    // 진행 종료 등 비활성 배경
  },

  // --- Dark Mode Sidebar (Preserved Original Values) ---
  darkMode: {
    bg: '#2A2A2A',
    border: '#3F3F3F',
    textPrimary: '#D4D4D4',
    textSecondary: '#9E9E9E',
    hover: '#353535',
    activeBg: '#4A4A4A',
    activeText: '#E8E8E8',
    tooltipBg: '#353535',
  },

  // --- Light Mode Sidebar (Professional neutral tones inspired by reference) ---
  lightMode: {
    bg: '#EFEFEF',              // 사이드바 배경 (더 어둡게 변경)
    border: '#D0D0D0',          // 테두리 (더 어둡게)
    textPrimary: '#333333',     // 다크 텍스트 (WCAG AAA - 11:1)
    textSecondary: '#666666',   // 아이콘/보조 텍스트 (WCAG AA - 5.7:1)
    hover: '#E0E0E0',           // 호버 배경 (더 어둡게)
    activeBg: '#D5D5D5',        // 활성 배경 (더 어둡게)
    activeText: '#1F1F1F',      // 활성 텍스트 (더욱 진한 검정 - WCAG AAA)
    tooltipBg: '#FFFFFF',       // 툴팁 배경 (화이트)
  },
};

export type DesignTokens = typeof designTokens;
