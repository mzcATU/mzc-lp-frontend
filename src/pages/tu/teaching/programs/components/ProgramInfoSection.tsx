import { Card, Label } from '@/components/common';
import { Image, Clock, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { ProgramDetailResponse } from '@/types/common';
import { PROGRAM_LEVEL_LABELS, PROGRAM_TYPE_LABELS } from '@/types/common';

interface ProgramInfoSectionProps {
  program: ProgramDetailResponse;
  language?: 'ko' | 'en';
}

const t = {
  basicInfo: { ko: '기본 정보', en: 'Basic Information' },
  thumbnail: { ko: '썸네일', en: 'Thumbnail' },
  description: { ko: '설명', en: 'Description' },
  level: { ko: '난이도', en: 'Level' },
  type: { ko: '유형', en: 'Type' },
  estimatedHours: { ko: '예상 학습시간', en: 'Estimated Hours' },
  creator: { ko: '생성자', en: 'Creator' },
  createdAt: { ko: '생성일', en: 'Created At' },
  updatedAt: { ko: '수정일', en: 'Updated At' },
  submittedAt: { ko: '제출일', en: 'Submitted At' },
  approvalInfo: { ko: '승인 정보', en: 'Approval Info' },
  approvedBy: { ko: '승인자', en: 'Approved By' },
  approvedAt: { ko: '승인일', en: 'Approved At' },
  approvalComment: { ko: '승인 코멘트', en: 'Approval Comment' },
  rejectionInfo: { ko: '반려 정보', en: 'Rejection Info' },
  rejectedAt: { ko: '반려일', en: 'Rejected At' },
  rejectionReason: { ko: '반려 사유', en: 'Rejection Reason' },
  notSet: { ko: '미설정', en: 'Not set' },
  noDescription: { ko: '설명이 없습니다.', en: 'No description.' },
  hours: { ko: '시간', en: 'hours' },
};

export function ProgramInfoSection({
  program,
  language = 'ko',
}: Readonly<ProgramInfoSectionProps>) {
  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return getText('notSet');
    return new Date(dateStr).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <Card>
        <div className="p-5">
          <h2 className="text-base font-medium text-text-primary mb-4">
            {getText('basicInfo')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 썸네일 */}
            <div className="md:col-span-1">
              <Label className="text-text-secondary text-xs uppercase tracking-wide mb-2 block">
                {getText('thumbnail')}
              </Label>
              {program.thumbnailUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-bg-secondary">
                  <img
                    src={program.thumbnailUrl}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-bg-secondary flex items-center justify-center">
                  <Image size={32} className="text-text-placeholder" />
                </div>
              )}
            </div>

            {/* 상세 정보 */}
            <div className="md:col-span-2 space-y-4">
              {/* 설명 */}
              <div>
                <Label className="text-text-secondary text-xs uppercase tracking-wide">
                  {getText('description')}
                </Label>
                <p className="text-text-primary mt-1 whitespace-pre-wrap">
                  {program.description || getText('noDescription')}
                </p>
              </div>

              {/* 그리드 정보 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('level')}
                  </Label>
                  <p className="text-text-primary mt-1 font-medium">
                    {program.level ? PROGRAM_LEVEL_LABELS[program.level] : getText('notSet')}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('type')}
                  </Label>
                  <p className="text-text-primary mt-1 font-medium">
                    {program.type ? PROGRAM_TYPE_LABELS[program.type] : getText('notSet')}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('estimatedHours')}
                  </Label>
                  <p className="text-text-primary mt-1 font-medium flex items-center gap-1">
                    <Clock size={14} className="text-text-secondary" />
                    {program.estimatedHours
                      ? `${program.estimatedHours} ${getText('hours')}`
                      : getText('notSet')}
                  </p>
                </div>
                <div>
                  <Label className="text-text-secondary text-xs uppercase tracking-wide">
                    {getText('creator')}
                  </Label>
                  <p className="text-text-primary mt-1 font-medium flex items-center gap-1">
                    <User size={14} className="text-text-secondary" />
                    {program.creatorName || getText('notSet')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 일시 정보 */}
      <Card>
        <div className="p-5">
          <h2 className="text-base font-medium text-text-primary mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-text-secondary" />
            일시 정보
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-text-secondary text-xs uppercase tracking-wide">
                {getText('createdAt')}
              </Label>
              <p className="text-text-primary mt-1 text-sm">{formatDate(program.createdAt)}</p>
            </div>
            <div>
              <Label className="text-text-secondary text-xs uppercase tracking-wide">
                {getText('updatedAt')}
              </Label>
              <p className="text-text-primary mt-1 text-sm">{formatDate(program.updatedAt)}</p>
            </div>
            {program.submittedAt && (
              <div>
                <Label className="text-text-secondary text-xs uppercase tracking-wide">
                  {getText('submittedAt')}
                </Label>
                <p className="text-text-primary mt-1 text-sm">
                  {formatDate(program.submittedAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 승인 정보 */}
      {program.status === 'APPROVED' && program.approvedAt && (
        <Card className="border-l-4 border-l-status-success">
          <div className="p-5">
            <h2 className="text-base font-medium text-text-primary mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-status-success" />
              {getText('approvalInfo')}
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-text-secondary text-xs uppercase tracking-wide">
                  {getText('approvedBy')}
                </Label>
                <p className="text-text-primary mt-1">
                  {program.approvedByName || getText('notSet')}
                </p>
              </div>
              <div>
                <Label className="text-text-secondary text-xs uppercase tracking-wide">
                  {getText('approvedAt')}
                </Label>
                <p className="text-text-primary mt-1 text-sm">
                  {formatDate(program.approvedAt)}
                </p>
              </div>
            </div>
            {program.approvalComment && (
              <div className="mt-4 pt-4 border-t border-border">
                <Label className="text-text-secondary text-xs uppercase tracking-wide">
                  {getText('approvalComment')}
                </Label>
                <p className="text-text-primary mt-1 whitespace-pre-wrap">
                  {program.approvalComment}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 반려 정보 */}
      {program.status === 'REJECTED' && program.rejectedAt && (
        <Card className="border-l-4 border-l-status-error">
          <div className="p-5">
            <h2 className="text-base font-medium text-text-primary mb-4 flex items-center gap-2">
              <XCircle size={18} className="text-status-error" />
              {getText('rejectionInfo')}
            </h2>
            <div className="mb-4">
              <Label className="text-text-secondary text-xs uppercase tracking-wide">
                {getText('rejectedAt')}
              </Label>
              <p className="text-text-primary mt-1 text-sm">
                {formatDate(program.rejectedAt)}
              </p>
            </div>
            {program.rejectionReason && (
              <div className="pt-4 border-t border-border">
                <Label className="text-text-secondary text-xs uppercase tracking-wide">
                  {getText('rejectionReason')}
                </Label>
                <p className="text-text-primary mt-1 whitespace-pre-wrap">
                  {program.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
