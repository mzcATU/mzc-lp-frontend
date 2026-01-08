import { ArrowLeft } from 'lucide-react';
import { Button } from '../Button';

interface BackButtonProps {
  /** 뒤로가기 클릭 핸들러 */
  onClick: () => void;
  /** 버튼 레이블 (기본값: '목록으로') */
  label?: string;
  /** 추가 className */
  className?: string;
}

/**
 * 뒤로가기 버튼 공통 컴포넌트
 *
 * 상세 페이지에서 목록으로 돌아가는 용도로 사용
 *
 * @example
 * ```tsx
 * <BackButton onClick={() => navigate('/tu/content')} />
 * <BackButton onClick={() => navigate(-1)} label="Back" />
 * ```
 */
export function BackButton({ onClick, label = '목록으로', className }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={onClick}
    >
      <ArrowLeft size={16} />
      {label}
    </Button>
  );
}
