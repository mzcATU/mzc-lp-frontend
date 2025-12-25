import { cn } from '@/utils/cn';

interface IconStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

/**
 * 아이콘이 좌측에 박스 형태로 배치되는 통계 카드
 * - 콘텐츠/강의 목록 페이지의 요약 통계에 사용
 * - 아이콘 + 라벨 + 값 구조
 */
export const IconStatCard = ({ icon, label, value, className }: Readonly<IconStatCardProps>) => {
  return (
    <div className={cn('p-5 bg-bg-secondary rounded-xl border border-border', className)}>
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-bg-default rounded-lg text-btn-neutral">{icon}</div>
        <div>
          <div className="text-sm text-text-secondary">{label}</div>
          <div className="text-2xl text-text-primary font-semibold">{value}</div>
        </div>
      </div>
    </div>
  );
};
