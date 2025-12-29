/**
 * 차수별 통계 카드 컴포넌트
 */
import { Users, CheckCircle, TrendingUp } from 'lucide-react';
import { InstructorRoleBadge } from './InstructorRoleBadge';
import type { CourseTimeStatResponse } from '@/types/tu';

interface CourseTimeStatCardProps {
  stat: CourseTimeStatResponse;
  language?: 'ko' | 'en';
}

const t = {
  totalStudents: { ko: '총 수강생', en: 'Total Students' },
  completedStudents: { ko: '수료', en: 'Completed' },
  completionRate: { ko: '수료율', en: 'Completion Rate' },
  noData: { ko: '데이터 없음', en: 'No data' },
};

export function CourseTimeStatCard({
  stat,
  language = 'ko',
}: Readonly<CourseTimeStatCardProps>) {
  const getText = (key: keyof typeof t) => t[key][language];

  return (
    <div className="p-4 bg-bg-default border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-1">
            {stat.courseName}
          </h4>
          <p className="text-xs text-text-secondary">{stat.timeName}</p>
        </div>
        <InstructorRoleBadge role={stat.role} language={language} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-text-secondary mb-1">
            <Users size={12} />
          </div>
          <p className="text-sm font-medium text-text-primary">
            {stat.totalStudents ?? getText('noData')}
          </p>
          <p className="text-xs text-text-secondary">{getText('totalStudents')}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-text-secondary mb-1">
            <CheckCircle size={12} />
          </div>
          <p className="text-sm font-medium text-text-primary">
            {stat.completedStudents ?? getText('noData')}
          </p>
          <p className="text-xs text-text-secondary">{getText('completedStudents')}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-text-secondary mb-1">
            <TrendingUp size={12} />
          </div>
          <p className="text-sm font-medium text-text-primary">
            {stat.completionRate != null ? `${stat.completionRate}%` : getText('noData')}
          </p>
          <p className="text-xs text-text-secondary">{getText('completionRate')}</p>
        </div>
      </div>
    </div>
  );
}
