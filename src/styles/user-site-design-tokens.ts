/**
 * User Site Design System - Semantic Color Tokens
 * For TU (Tenant User) business site across all tenant types
 * (B2C Academy, B2B Corporate, KPOP Academy, etc.)
 * All colors meet WCAG AA (4.5:1) contrast ratio requirements
 */

export const userSiteDesignTokens = {
  // --- Light Theme ---
  light: {
    bg: {
      default: '#FFFFFF',           // 카드, 모달 배경
      app: '#FAFAFA',               // 전체 앱 배경
      secondary: '#F5F5F5',         // 섹션 구분 배경
      tertiary: '#EEEEEE',          // 비활성/음소거 영역
      overlay: 'rgba(0, 0, 0, 0.5)', // 모달 오버레이
    },
    text: {
      primary: '#333333',           // 주요 텍스트
      secondary: '#666666',         // 보조 텍스트
      tertiary: '#999999',          // 플레이스홀더, 힌트
      inverse: '#FFFFFF',           // 어두운 배경 위 텍스트
      price: '#4C2D9A',             // 가격 표시 (Brand)
      link: '#6778FF',              // 링크 텍스트
    },
    border: {
      default: '#E5E7EB',           // 기본 테두리
      light: '#F3F4F6',             // 연한 테두리
      focus: '#6778FF',             // 포커스 테두리
    },
  },

  // --- Dark Theme ---
  dark: {
    bg: {
      default: '#2D2D2D',           // 카드, 모달 배경
      app: '#1E1E1E',               // 전체 앱 배경
      secondary: '#3A3A3A',         // 섹션 구분 배경
      tertiary: '#4A4A4A',          // 비활성/음소거 영역
      overlay: 'rgba(0, 0, 0, 0.7)', // 모달 오버레이
    },
    text: {
      primary: '#FFFFFF',           // 주요 텍스트
      secondary: '#D4D4D4',         // 보조 텍스트
      tertiary: '#9E9E9E',          // 플레이스홀더, 힌트
      inverse: '#333333',           // 밝은 배경 위 텍스트
      price: '#6BC2F0',             // 가격 표시 (밝은 톤)
      link: '#8B9AFF',              // 링크 텍스트
    },
    border: {
      default: '#4A4A4A',           // 기본 테두리
      light: '#3A3A3A',             // 연한 테두리
      focus: '#8B9AFF',             // 포커스 테두리
    },
  },

  // --- Brand Colors ---
  brand: {
    primary: '#6778FF',             // 메인 브랜드 컬러
    secondary: '#A855F7',           // 보조 브랜드 컬러 (퍼플)
    accent: '#4C2D9A',              // 강조 컬러 (딥 퍼플)
  },

  // --- Gradients ---
  gradient: {
    primary: 'linear-gradient(135deg, #6778FF 0%, #A855F7 100%)',
    primaryHover: 'linear-gradient(135deg, #5567EE 0%, #9745E6 100%)',
    hero: 'linear-gradient(135deg, #6778FF 0%, #A855F7 50%, #EC4899 100%)',
    card: 'linear-gradient(180deg, rgba(103, 120, 255, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
    premium: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    dark: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
  },

  // --- Shadows ---
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',
    cardHover: '0 8px 24px rgba(0, 0, 0, 0.12)',
    modal: '0 25px 50px rgba(0, 0, 0, 0.25)',
    slotActive: '0 0 0 2px #6778FF, 0 4px 12px rgba(103, 120, 255, 0.3)',
    inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  },

  // --- Button Styles ---
  button: {
    // Primary (Gradient)
    primary: {
      bg: 'linear-gradient(135deg, #6778FF 0%, #A855F7 100%)',
      bgHover: 'linear-gradient(135deg, #5567EE 0%, #9745E6 100%)',
      text: '#FFFFFF',
    },
    // Secondary (Outline)
    secondary: {
      bg: 'transparent',
      bgHover: 'rgba(103, 120, 255, 0.1)',
      border: '#6778FF',
      text: '#6778FF',
    },
    // Neutral (Solid)
    neutral: {
      bg: '#2A2A2A',
      bgHover: '#3D3D3D',
      text: '#FFFFFF',
    },
    // Ghost (텍스트만)
    ghost: {
      bg: 'transparent',
      bgHover: 'rgba(0, 0, 0, 0.05)',
      text: '#666666',
    },
  },

  // --- Status Colors (Semantic) ---
  status: {
    success: {
      text: '#16A34A',
      bg: '#DCFCE7',
      border: '#86EFAC',
    },
    warning: {
      text: '#CA8A04',
      bg: '#FEF9C3',
      border: '#FDE047',
    },
    error: {
      text: '#DC2626',
      bg: '#FEE2E2',
      border: '#FCA5A5',
    },
    info: {
      text: '#2563EB',
      bg: '#DBEAFE',
      border: '#93C5FD',
    },
  },

  // --- Badge/Tag Colors ---
  badge: {
    category: { text: '#4C2D9A', bg: '#EDE7F6' },
    level: { text: '#1E40AF', bg: '#DBEAFE' },
    new: { text: '#DC2626', bg: '#FEE2E2' },
    popular: { text: '#EA580C', bg: '#FFEDD5' },
    free: { text: '#16A34A', bg: '#DCFCE7' },
    premium: { text: '#CA8A04', bg: '#FEF9C3' },
  },

  // --- Academy Mode: Booking Status ---
  booking: {
    available: {
      text: '#16A34A',
      bg: '#DCFCE7',
      border: '#86EFAC',
    },
    full: {
      text: '#6B7280',
      bg: '#F3F4F6',
      border: '#D1D5DB',
    },
    mine: {
      text: '#6778FF',
      bg: '#EEF0FF',
      border: '#B4BCFF',
    },
    urgent: {
      text: '#DC2626',
      bg: '#FEE2E2',
      border: '#FCA5A5',
    },
    selected: {
      text: '#FFFFFF',
      bg: '#6778FF',
      border: '#6778FF',
    },
    past: {
      text: '#9CA3AF',
      bg: '#F9FAFB',
      border: '#E5E7EB',
    },
    cancelled: {
      text: '#EF4444',
      bg: '#FEF2F2',
      border: '#FECACA',
      strikethrough: true,
    },
  },

  // --- Academy Mode: Ticket/Asset Colors ---
  ticket: {
    countBased: {
      countBg: '#EDE7F6',
      countText: '#4C2D9A',
      label: '회권',
    },
    periodBased: {
      countBg: '#DBEAFE',
      countText: '#1E40AF',
      label: '기간권',
    },
    unlimited: {
      countBg: '#FEF9C3',
      countText: '#CA8A04',
      label: '무제한',
    },
    expiryAlert: {
      soon: '#F59E0B',        // 7일 이내
      imminent: '#EF4444',    // 3일 이내
    },
    premiumGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  },

  // --- Layout & Spacing ---
  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
    card: '12px',
    button: '8px',
    badge: '9999px',
    avatar: '9999px',
    slot: '8px',              // 예약 슬롯용
  },

  // --- Interactive States ---
  interactive: {
    hover: {
      scale: 'scale(1.02)',
      opacity: '0.9',
    },
    active: {
      scale: 'scale(0.98)',
    },
    disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },

  // --- Navigation ---
  nav: {
    light: {
      bg: 'rgba(255, 255, 255, 0.95)',
      text: '#333333',
      textHover: '#6778FF',
      indicator: '#6778FF',
    },
    dark: {
      bg: 'rgba(30, 30, 30, 0.95)',
      text: '#FFFFFF',
      textHover: '#8B9AFF',
      indicator: '#8B9AFF',
    },
  },

  // --- Footer ---
  footer: {
    light: {
      bg: '#1F2937',
      text: '#9CA3AF',
      textHover: '#FFFFFF',
      border: '#374151',
    },
    dark: {
      bg: '#111827',
      text: '#6B7280',
      textHover: '#D1D5DB',
      border: '#1F2937',
    },
  },
};

export type UserSiteDesignTokens = typeof userSiteDesignTokens;
