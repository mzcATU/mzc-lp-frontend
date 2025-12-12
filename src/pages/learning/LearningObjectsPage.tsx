import { designTokens } from '@/styles/design-tokens';

export const LearningObjectsPage = () => {
  return (
    <div
      className="p-8 min-h-full"
      style={{ backgroundColor: designTokens.bg.default }}
    >
      <header className="flex items-center justify-between mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ color: designTokens.text.primary }}
        >
          학습객체
        </h1>
      </header>

      {/* 개발 예정 안내 */}
      <div
        className="rounded-lg border-2 border-dashed p-12 text-center"
        style={{ borderColor: designTokens.bg.border }}
      >
        <p className="text-lg mb-2" style={{ color: designTokens.text.placeholder }}>
          🚧 개발 예정
        </p>
        <p
          className="text-sm"
          style={{ color: designTokens.text.placeholder }}
        >
          학습객체 관리 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
};
