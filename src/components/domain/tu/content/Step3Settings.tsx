import { Settings, Globe, Lock, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { LOData, CompletionCriteria, AccessControl } from '@/types';
import { RadioOptionCard } from '@/components/common';

interface Step3Props {
  data: LOData;
  onUpdate: (data: Partial<LOData>) => void;
  isExternalLink?: boolean;
}

const completionOptions: { value: CompletionCriteria; label: string; description: string; disabled?: boolean; disabledMessage?: string }[] = [
  {
    value: 'button-click',
    label: '완료 버튼 클릭',
    description: '학습자가 직접 완료 버튼을 클릭해야 합니다',
  },
  {
    value: '90-percent',
    label: '90% 시청 완료',
    description: '콘텐츠의 90% 이상을 시청하면 자동으로 완료 처리됩니다',
    disabled: true,
    disabledMessage: '추후 개발 예정',
  },
  {
    value: '100-percent',
    label: '100% 시청 완료',
    description: '콘텐츠를 끝까지 시청해야 완료 처리됩니다',
    disabled: true,
    disabledMessage: '추후 개발 예정',
  },
];

const accessOptions: { value: AccessControl; icon: typeof Globe; label: string; description: string; disabled?: boolean; disabledMessage?: string }[] = [
  {
    value: 'public',
    icon: Globe,
    label: '전체 공개',
    description: '모든 테넌트와 사용자가 접근할 수 있습니다',
    disabled: true,
    disabledMessage: '추후 개발 예정',
  },
  {
    value: 'private',
    icon: Lock,
    label: '비공개',
    description: '관리자만 접근할 수 있으며, 직접 지정한 사용자에게만 공개됩니다',
  },
];

export function Step3Settings({ data, onUpdate, isExternalLink = false }: Readonly<Step3Props>) {
  return (
    <div className="space-y-8">
      {/* 학습 정책 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-text-secondary" />
          <h2 className="text-text-primary font-medium text-lg">학습 정책</h2>
        </div>

        {/* 다운로드 허용 - 외부 링크일 때는 비활성화 */}
        <div className={cn('mb-6 pb-6 border-b border-border', isExternalLink && 'opacity-50')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary mb-1">다운로드 허용</p>
              <p className="text-sm text-text-secondary">
                {isExternalLink
                  ? '외부 링크는 다운로드를 지원하지 않습니다'
                  : '학습자가 콘텐츠를 다운로드할 수 있도록 허용합니다'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.allowDownload}
              onClick={() => !isExternalLink && onUpdate({ allowDownload: !data.allowDownload })}
              disabled={isExternalLink}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                data.allowDownload && !isExternalLink ? 'bg-btn-neutral' : 'bg-border',
                isExternalLink && 'cursor-not-allowed'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  data.allowDownload && !isExternalLink ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>

        {/* 워터마크 적용 - 백엔드 미구현으로 비활성화 */}
        <div className="mb-6 pb-6 border-b border-border opacity-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary mb-1">워터마크 적용</p>
              <p className="text-sm text-text-secondary">현재 지원되지 않는 기능입니다</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={false}
              disabled
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-not-allowed',
                'bg-border'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>

        {/* 진도율 완료 기준 */}
        <div>
          <p className="text-text-primary mb-3">진도율 완료 기준</p>
          <p className="text-sm text-text-secondary mb-4">
            학습자가 이 콘텐츠를 완료한 것으로 간주하는 기준을 설정합니다
          </p>
          <div className="space-y-3">
            {completionOptions.map((option) => (
              <RadioOptionCard
                key={option.value}
                name="completionCriteria"
                value={option.value}
                label={option.label}
                description={option.description}
                isSelected={data.completionCriteria === option.value}
                onChange={(value) => onUpdate({ completionCriteria: value as CompletionCriteria })}
                disabled={option.disabled}
                disabledMessage={option.disabledMessage}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 접근 제어 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-text-secondary" />
          <h2 className="text-text-primary font-medium text-lg">접근 제어</h2>
        </div>

        <p className="text-sm text-text-secondary mb-4">이 콘텐츠에 접근할 수 있는 범위를 설정합니다</p>

        {/* 접근 제어 옵션 */}
        <div className="space-y-3">
          {accessOptions.map((option) => (
            <RadioOptionCard
              key={option.value}
              name="accessControl"
              value={option.value}
              label={option.label}
              description={option.description}
              icon={option.icon}
              isSelected={data.accessControl === option.value}
              onChange={(value) => onUpdate({ accessControl: value as AccessControl })}
              disabled={option.disabled}
              disabledMessage={option.disabledMessage}
            />
          ))}
        </div>
      </section>

      {/* 최종 검토 안내 */}
      <div className="bg-bg-secondary border border-border rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-btn-neutral flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-text-primary mb-2">발행 전 최종 검토</p>
            <p className="text-sm text-text-secondary">
              모든 설정을 확인하신 후 하단의 '발행하기' 버튼을 클릭하세요. 발행된 콘텐츠는 즉시 지정된
              대상에게 공개됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
