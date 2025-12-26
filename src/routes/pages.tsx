import { designTokens } from '@/styles/admin-design-tokens';

/**
 * 임시 대시보드 컴포넌트 (개발 예정)
 */
export function DashboardPage() {
  return (
    <div className="p-8 min-h-full" style={{ backgroundColor: designTokens.bg.default }}>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: designTokens.text.primary }}>
          대시보드
        </h1>
      </header>
      <div
        className="rounded-lg border-2 border-dashed p-12 text-center"
        style={{ borderColor: designTokens.bg.border }}
      >
        <p className="text-lg mb-2" style={{ color: designTokens.text.placeholder }}>
          개발 예정
        </p>
        <p className="text-sm" style={{ color: designTokens.text.placeholder }}>
          대시보드 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}

/**
 * 공통 Placeholder 페이지 컴포넌트
 */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-8 min-h-full" style={{ backgroundColor: designTokens.bg.default }}>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: designTokens.text.primary }}>
          {title}
        </h1>
      </header>
      <div
        className="rounded-lg border-2 border-dashed p-12 text-center"
        style={{ borderColor: designTokens.bg.border }}
      >
        <p className="text-lg mb-2" style={{ color: designTokens.text.placeholder }}>
          개발 예정
        </p>
        <p className="text-sm" style={{ color: designTokens.text.placeholder }}>
          {title} 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}

/**
 * 권한 없음 페이지
 */
export function UnauthorizedPage() {
  return (
    <div
      className="p-8 min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: designTokens.bg.default }}
    >
      <div className="text-center">
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ color: designTokens.text.primary }}
        >
          접근 권한이 없습니다
        </h1>
        <p className="text-sm mb-6" style={{ color: designTokens.text.secondary }}>
          이 페이지에 접근할 수 있는 권한이 없습니다.
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: designTokens.button.brand_default }}
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
