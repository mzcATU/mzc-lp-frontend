/**
 * 강사 배정 카드 컴포넌트 (개선 버전)
 */
import { FileText, Users, Clock } from 'lucide-react';
import { InstructorRoleBadge } from './InstructorRoleBadge';
import { AssignmentStatusBadge } from './AssignmentStatusBadge';
import { designTokens } from '@/styles/admin-design-tokens';
import type { InstructorAssignmentResponse, CourseTimeStatResponse } from '@/types/tu';

interface AssignmentCardProps {
  assignment: InstructorAssignmentResponse;
  timeStats?: CourseTimeStatResponse; // 차수별 통계 정보 (선택)
  language?: 'ko' | 'en';
  onClick?: () => void;
}

const t = {
  assignedAt: { ko: '배정일', en: 'Assigned' },
  courseTime: { ko: '차수', en: 'Session' },
  students: { ko: '수강생', en: 'Students' },
  period: { ko: '기간', en: 'Period' },
  progress: { ko: '진행률', en: 'Progress' },
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
  timeStats,
  language = 'ko',
  onClick,
}: Readonly<AssignmentCardProps>) {
  const getText = (key: keyof typeof t) => t[key][language];

  // 통계 정보 활용 (있으면 실제 데이터, 없으면 기본값)
  // timeName이 있으면 사용, 없으면 courseName 사용, 둘 다 없으면 기본값
  const courseName = timeStats?.timeName || timeStats?.courseName || `차수 ${assignment.timeId}`;
  const studentCount = timeStats?.totalStudents ?? 0;
  const completionRate = timeStats?.completionRate ?? 0;

  // 기간 정보는 아직 API에서 제공하지 않으므로 배정일 사용
  const startDate = assignment.assignedAt;
  const endDate = assignment.assignedAt;

  return (
    <button
      type="button"
      onClick={onClick}
      className="p-5 rounded-lg border cursor-pointer transition-all w-full text-left"
      style={{
        backgroundColor: designTokens.bg.default,
        borderColor: designTokens.bg.border,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = designTokens.action.primary_default;
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = designTokens.bg.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-medium m-0 flex-1" style={{ color: designTokens.text.primary }}>
          {courseName}
        </h3>
        <div className="flex items-center gap-2 ml-2">
          <InstructorRoleBadge role={assignment.role} language={language} />
          <AssignmentStatusBadge status={assignment.status} language={language} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm" style={{ color: designTokens.text.secondary }}>
          <FileText size={14} />
          <span>{getText('courseTime')}:</span>
          <span className="font-medium" style={{ color: designTokens.text.primary }}>{assignment.timeId}</span>
        </div>

        <div className="flex items-center gap-2 text-sm" style={{ color: designTokens.text.secondary }}>
          <Users size={14} />
          <span>{getText('students')}:</span>
          <span className="font-medium" style={{ color: designTokens.text.primary }}>{studentCount}명</span>
        </div>

        <div className="flex items-center gap-2 text-sm" style={{ color: designTokens.text.secondary }}>
          <Clock size={14} />
          <span>{getText('period')}:</span>
          <span className="text-xs" style={{ color: designTokens.text.primary }}>
            {formatDate(startDate)} ~ {formatDate(endDate)}
          </span>
        </div>

        {/* 진행률 바 (수료율 표시) */}
        <div className="mt-2">
          <div className="flex justify-between mb-1">
            <span className="text-xs" style={{ color: designTokens.text.secondary }}>{getText('progress')}</span>
            <span className="text-xs font-medium" style={{ color: designTokens.text.primary }}>{completionRate}%</span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: designTokens.bg.secondary }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${completionRate}%`,
                backgroundColor: designTokens.status.success_text,
              }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
