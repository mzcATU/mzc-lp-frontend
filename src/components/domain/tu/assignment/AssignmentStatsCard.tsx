/**
 * 강사 배정 통계 카드 컴포넌트
 */
import { Users, UserCheck, UserMinus } from 'lucide-react';
import { IconStatCard } from '@/components/common';

interface AssignmentStatsCardProps {
  totalCount: number;
  mainCount: number;
  subCount: number;
  language?: 'ko' | 'en';
}

const t = {
  totalAssignments: { ko: '총 배정', en: 'Total Assignments' },
  mainInstructor: { ko: '주강사', en: 'Main Instructor' },
  subInstructor: { ko: '보조강사', en: 'Sub Instructor' },
};

export function AssignmentStatsCard({
  totalCount,
  mainCount,
  subCount,
  language = 'ko',
}: Readonly<AssignmentStatsCardProps>) {
  const getText = (key: keyof typeof t) => t[key][language];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <IconStatCard
        icon={<Users size={20} />}
        label={getText('totalAssignments')}
        value={totalCount}
      />
      <IconStatCard
        icon={<UserCheck size={20} />}
        label={getText('mainInstructor')}
        value={mainCount}
      />
      <IconStatCard
        icon={<UserMinus size={20} />}
        label={getText('subInstructor')}
        value={subCount}
      />
    </div>
  );
}
