import { Shield, Settings, Globe, Lock, Users, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { LOData, CompletionCriteria, AccessControl, Tenant } from '@/types';

interface Step3Props {
  data: LOData;
  onUpdate: (data: Partial<LOData>) => void;
}

// Mock tenant data
const mockTenants: Tenant[] = [
  { id: '1', name: '삼성전자' },
  { id: '2', name: 'LG전자' },
  { id: '3', name: '현대자동차' },
  { id: '4', name: 'SK하이닉스' },
  { id: '5', name: '네이버' },
];

const completionOptions: { value: CompletionCriteria; title: string; description: string }[] = [
  {
    value: 'button-click',
    title: '완료 버튼 클릭',
    description: '학습자가 직접 완료 버튼을 클릭해야 합니다',
  },
  {
    value: '90-percent',
    title: '90% 시청 완료',
    description: '콘텐츠의 90% 이상을 시청하면 자동으로 완료 처리됩니다',
  },
  {
    value: '100-percent',
    title: '100% 시청 완료',
    description: '콘텐츠를 끝까지 시청해야 완료 처리됩니다',
  },
];

const accessOptions: { value: AccessControl; icon: typeof Globe; title: string; description: string }[] = [
  {
    value: 'public',
    icon: Globe,
    title: '전체 공개',
    description: '모든 테넌트와 사용자가 접근할 수 있습니다',
  },
  {
    value: 'private',
    icon: Lock,
    title: '비공개',
    description: '관리자만 접근할 수 있으며, 직접 지정한 사용자에게만 공개됩니다',
  },
  {
    value: 'specific-tenants',
    icon: Users,
    title: '특정 B2B 테넌트 지정',
    description: '선택한 테넌트의 사용자만 접근할 수 있습니다',
  },
];

export function Step3Settings({ data, onUpdate }: Readonly<Step3Props>) {
  const handleToggleTenant = (tenantId: string) => {
    const currentTenants = data.selectedTenants || [];
    if (currentTenants.includes(tenantId)) {
      onUpdate({
        selectedTenants: currentTenants.filter((id) => id !== tenantId),
      });
    } else {
      onUpdate({
        selectedTenants: [...currentTenants, tenantId],
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* 학습 정책 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-action-primary" />
          <h2 className="text-text-primary font-medium text-lg">학습 정책</h2>
        </div>

        {/* 다운로드 허용 */}
        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary mb-1">다운로드 허용</p>
              <p className="text-sm text-text-secondary">학습자가 콘텐츠를 다운로드할 수 있도록 허용합니다</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.allowDownload}
              onClick={() => onUpdate({ allowDownload: !data.allowDownload })}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                data.allowDownload ? 'bg-action-primary' : 'bg-border'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  data.allowDownload ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
        </div>

        {/* 워터마크 적용 */}
        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary mb-1">워터마크 적용</p>
              <p className="text-sm text-text-secondary">콘텐츠에 학습자 정보를 워터마크로 표시합니다</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={data.applyWatermark}
              onClick={() => onUpdate({ applyWatermark: !data.applyWatermark })}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                data.applyWatermark ? 'bg-action-primary' : 'bg-border'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  data.applyWatermark ? 'translate-x-6' : 'translate-x-1'
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
              <button
                key={option.value}
                type="button"
                onClick={() => onUpdate({ completionCriteria: option.value })}
                className={cn(
                  'w-full flex items-start gap-3 p-4 border rounded-lg text-left transition-colors',
                  data.completionCriteria === option.value
                    ? 'border-action-primary bg-action-primary/5'
                    : 'border-border hover:bg-bg-secondary/50'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    data.completionCriteria === option.value ? 'border-action-primary' : 'border-border'
                  )}
                >
                  {data.completionCriteria === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-action-primary" />
                  )}
                </div>
                <div>
                  <p className="text-text-primary">{option.title}</p>
                  <p className="text-sm text-text-secondary">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 접근 제어 (B2B) 섹션 */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-action-primary" />
          <h2 className="text-text-primary font-medium text-lg">접근 제어 (B2B 멀티테넌시)</h2>
        </div>

        <p className="text-sm text-text-secondary mb-4">이 콘텐츠에 접근할 수 있는 범위를 설정합니다</p>

        {/* 접근 제어 옵션 */}
        <div className="space-y-3 mb-6">
          {accessOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onUpdate({ accessControl: option.value })}
                className={cn(
                  'w-full flex items-start gap-3 p-4 border-2 rounded-lg text-left transition-colors',
                  data.accessControl === option.value
                    ? 'border-action-primary bg-action-primary/5'
                    : 'border-border hover:bg-bg-secondary/50'
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                    data.accessControl === option.value ? 'border-action-primary' : 'border-border'
                  )}
                >
                  {data.accessControl === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-action-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-action-primary" />
                    <p className="text-text-primary">{option.title}</p>
                  </div>
                  <p className="text-sm text-text-secondary">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tenant Selection - Conditional */}
        {data.accessControl === 'specific-tenants' && (
          <div className="p-4 bg-bg-secondary/50 rounded-lg border border-border">
            <p className="text-sm text-text-primary mb-3">
              접근 가능한 테넌트 선택 <span className="text-status-error">*</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {mockTenants.map((tenant) => {
                const isSelected = data.selectedTenants.includes(tenant.id);
                return (
                  <button
                    key={tenant.id}
                    type="button"
                    onClick={() => handleToggleTenant(tenant.id)}
                    className={cn(
                      'flex items-center gap-3 p-3 border rounded-lg text-left transition-all',
                      isSelected
                        ? 'bg-bg-default border-action-primary'
                        : 'bg-bg-default border-border hover:border-action-primary'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0',
                        isSelected ? 'border-action-primary bg-action-primary' : 'border-border'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-text-primary flex-1">{tenant.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-action-primary" />}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-text-secondary mt-3">
              선택된 테넌트: {data.selectedTenants.length}개
            </p>
          </div>
        )}
      </section>

      {/* 최종 검토 안내 */}
      <div className="bg-bg-secondary border border-border rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-action-primary flex items-center justify-center flex-shrink-0">
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
