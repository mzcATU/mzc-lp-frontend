/**
 * 강사 배정 카드 컴포넌트
 */
import { Calendar, Clock } from 'lucide-react';
import { InstructorRoleBadge } from './InstructorRoleBadge';
import { AssignmentStatusBadge } from './AssignmentStatusBadge';
import type { InstructorAssignmentResponse } from '@/types/tu';

interface AssignmentCardProps {
  assignment: InstructorAssignmentResponse;
  language?: 'ko' | 'en';
  onClick?: () => void;
}

const t = {
  assignedAt: { ko: '배정일', en: 'Assigned' },
  courseTime: { ko: '차수', en: 'Session' },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function AssignmentCard({
  assignment,
  language = 'ko',
  onClick,
}: Readonly<AssignmentCardProps>) {
  const getText = (key: keyof typeof t) => t[key][language];

  return (
    <div
      onClick={onClick}
      className="p-4 bg-bg-default border border-border rounded-lg hover:border-border-hover hover:shadow-sm transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <InstructorRoleBadge role={assignment.role} language={language} />
          <AssignmentStatusBadge status={assignment.status} language={language} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Clock size={14} />
          <span>{getText('courseTime')} ID: {assignment.timeId}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Calendar size={14} />
          <span>{getText('assignedAt')}: {formatDate(assignment.assignedAt)}</span>
        </div>
      </div>
    </div>
  );
}
