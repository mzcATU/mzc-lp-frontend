import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Check,
  Users,
  Building2,
  Briefcase,
  Award,
  UserCheck,
  Search,
  X,
} from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Badge,
  Input,
  Checkbox,
  Label,
} from '@/components/common';
import { cn } from '@/utils/cn';

// 타겟팅 카테고리 타입
type TargetCategory = 'department' | 'jobRole' | 'position' | 'rank';

// 타겟팅 데이터 타입
interface TargetingData {
  departments: string[];
  jobRoles: string[];
  positions: string[];
  ranks: string[];
}

interface TargetingSelectorProps {
  value: TargetingData;
  onChange: (value: TargetingData) => void;
  isAllTarget?: boolean;
  onAllTargetChange?: (value: boolean) => void;
}

// 샘플 데이터
const sampleData = {
  departments: [
    { id: 'dev', name: '개발팀', count: 45 },
    { id: 'marketing', name: '마케팅팀', count: 23 },
    { id: 'hr', name: '인사팀', count: 15 },
    { id: 'sales', name: '영업팀', count: 32 },
    { id: 'finance', name: '재무팀', count: 18 },
    { id: 'support', name: '경영지원팀', count: 12 },
    { id: 'design', name: '디자인팀', count: 8 },
    { id: 'qa', name: 'QA팀', count: 10 },
  ],
  jobRoles: [
    { id: 'frontend', name: '프론트엔드 개발', count: 15 },
    { id: 'backend', name: '백엔드 개발', count: 20 },
    { id: 'devops', name: 'DevOps', count: 5 },
    { id: 'pm', name: '프로젝트 관리', count: 8 },
    { id: 'design', name: 'UI/UX 디자인', count: 10 },
    { id: 'marketing', name: '마케팅 기획', count: 12 },
    { id: 'sales', name: '영업 관리', count: 18 },
    { id: 'cs', name: '고객 서비스', count: 15 },
  ],
  positions: [
    { id: 'team_leader', name: '팀장', count: 12 },
    { id: 'dept_leader', name: '부서장', count: 6 },
    { id: 'division_leader', name: '본부장', count: 3 },
    { id: 'ceo', name: '임원', count: 2 },
  ],
  ranks: [
    { id: 'intern', name: '인턴', count: 10 },
    { id: 'staff', name: '사원', count: 45 },
    { id: 'senior', name: '대리', count: 38 },
    { id: 'manager', name: '과장', count: 25 },
    { id: 'deputy', name: '차장', count: 18 },
    { id: 'general', name: '부장', count: 12 },
  ],
};

const categoryConfig: Record<
  TargetCategory,
  { label: string; icon: typeof Users; dataKey: keyof typeof sampleData }
> = {
  department: { label: '부서', icon: Building2, dataKey: 'departments' },
  jobRole: { label: '직무', icon: Briefcase, dataKey: 'jobRoles' },
  position: { label: '직책', icon: Award, dataKey: 'positions' },
  rank: { label: '직급', icon: UserCheck, dataKey: 'ranks' },
};

export function TargetingSelector({
  value,
  onChange,
  isAllTarget = true,
  onAllTargetChange,
}: TargetingSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<TargetCategory[]>([]);
  const [searchTerms, setSearchTerms] = useState<Record<TargetCategory, string>>({
    department: '',
    jobRole: '',
    position: '',
    rank: '',
  });

  const toggleCategory = (category: TargetCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleItem = (category: TargetCategory, itemId: string) => {
    const keyMap: Record<TargetCategory, keyof TargetingData> = {
      department: 'departments',
      jobRole: 'jobRoles',
      position: 'positions',
      rank: 'ranks',
    };
    const key = keyMap[category];
    const currentValues = value[key];
    const newValues = currentValues.includes(itemId)
      ? currentValues.filter((v) => v !== itemId)
      : [...currentValues, itemId];

    onChange({ ...value, [key]: newValues });
  };

  const selectAllInCategory = (category: TargetCategory) => {
    const config = categoryConfig[category];
    const allIds = sampleData[config.dataKey].map((item) => item.id);
    const keyMap: Record<TargetCategory, keyof TargetingData> = {
      department: 'departments',
      jobRole: 'jobRoles',
      position: 'positions',
      rank: 'ranks',
    };
    onChange({ ...value, [keyMap[category]]: allIds });
  };

  const clearCategory = (category: TargetCategory) => {
    const keyMap: Record<TargetCategory, keyof TargetingData> = {
      department: 'departments',
      jobRole: 'jobRoles',
      position: 'positions',
      rank: 'ranks',
    };
    onChange({ ...value, [keyMap[category]]: [] });
  };

  const getSelectedCount = (category: TargetCategory) => {
    const keyMap: Record<TargetCategory, keyof TargetingData> = {
      department: 'departments',
      jobRole: 'jobRoles',
      position: 'positions',
      rank: 'ranks',
    };
    return value[keyMap[category]].length;
  };

  const getTotalSelectedPeople = () => {
    if (isAllTarget) return '전체';

    let total = 0;
    Object.entries(categoryConfig).forEach(([category, config]) => {
      const selectedIds = value[
        category === 'department'
          ? 'departments'
          : category === 'jobRole'
            ? 'jobRoles'
            : category === 'position'
              ? 'positions'
              : 'ranks'
      ];
      selectedIds.forEach((id) => {
        const item = sampleData[config.dataKey].find((i) => i.id === id);
        if (item) total += item.count;
      });
    });

    return total > 0 ? `약 ${total}명` : '선택 없음';
  };

  const removeSelected = (category: TargetCategory, itemId: string) => {
    const keyMap: Record<TargetCategory, keyof TargetingData> = {
      department: 'departments',
      jobRole: 'jobRoles',
      position: 'positions',
      rank: 'ranks',
    };
    const key = keyMap[category];
    onChange({
      ...value,
      [key]: value[key].filter((v) => v !== itemId),
    });
  };


  const getAllSelectedItems = () => {
    const items: { category: TargetCategory; id: string; name: string }[] = [];

    value.departments.forEach((id) => {
      const item = sampleData.departments.find((i) => i.id === id);
      if (item) items.push({ category: 'department', id, name: item.name });
    });
    value.jobRoles.forEach((id) => {
      const item = sampleData.jobRoles.find((i) => i.id === id);
      if (item) items.push({ category: 'jobRole', id, name: item.name });
    });
    value.positions.forEach((id) => {
      const item = sampleData.positions.find((i) => i.id === id);
      if (item) items.push({ category: 'position', id, name: item.name });
    });
    value.ranks.forEach((id) => {
      const item = sampleData.ranks.find((i) => i.id === id);
      if (item) items.push({ category: 'rank', id, name: item.name });
    });

    return items;
  };

  return (
    <div className="space-y-4">
      {/* 전체 대상 토글 */}
      <div
        className="flex items-center justify-between p-3 rounded-lg"
        style={{ backgroundColor: designTokens.bg.secondary }}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            id="all-target"
            checked={isAllTarget}
            onCheckedChange={(checked) => onAllTargetChange?.(checked as boolean)}
          />
          <Label htmlFor="all-target" className="cursor-pointer">
            <span style={{ color: designTokens.text.primary }}>전체 임직원</span>
            <span
              className="text-xs ml-2"
              style={{ color: designTokens.text.secondary }}
            >
              모든 사용자에게 노출됩니다
            </span>
          </Label>
        </div>
        <Badge variant={isAllTarget ? 'green' : 'gray'}>
          <Users className="w-3 h-3 mr-1" />
          {getTotalSelectedPeople()}
        </Badge>
      </div>

      {/* 세부 타겟팅 섹션 */}
      {!isAllTarget && (
        <>
          {/* 선택된 항목 표시 */}
          {getAllSelectedItems().length > 0 && (
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: designTokens.bg.secondary }}
            >
              <p
                className="text-xs font-medium mb-2"
                style={{ color: designTokens.text.secondary }}
              >
                선택된 대상 ({getAllSelectedItems().length}개)
              </p>
              <div className="flex flex-wrap gap-1">
                {getAllSelectedItems().map((item) => (
                  <Badge
                    key={`${item.category}-${item.id}`}
                    variant="blue"
                    className="text-xs pl-2 pr-1 py-1 gap-1"
                  >
                    {item.name}
                    <button
                      type="button"
                      onClick={() => removeSelected(item.category, item.id)}
                      className="ml-1 p-0.5 rounded hover:bg-black/10 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 카테고리별 선택 */}
          <div
            className="border rounded-lg overflow-hidden"
            style={{ borderColor: designTokens.bg.border }}
          >
            {(Object.keys(categoryConfig) as TargetCategory[]).map((category, idx) => {
              const config = categoryConfig[category];
              const Icon = config.icon;
              const isExpanded = expandedCategories.includes(category);
              const selectedCount = getSelectedCount(category);
              const searchTerm = searchTerms[category];
              const filteredItems = sampleData[config.dataKey].filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              );

              return (
                <div
                  key={category}
                  className={cn(idx > 0 && 'border-t')}
                  style={{ borderColor: designTokens.bg.border }}
                >
                  {/* 카테고리 헤더 */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between p-3 transition-colors"
                    style={{ backgroundColor: designTokens.bg.default }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = designTokens.bg.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = designTokens.bg.default;
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className="w-4 h-4"
                        style={{ color: designTokens.text.secondary }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: designTokens.text.primary }}
                      >
                        {config.label}
                      </span>
                      {selectedCount > 0 && (
                        <Badge variant="indigo" className="text-xs">
                          {selectedCount}개 선택
                        </Badge>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronDown
                        className="w-4 h-4"
                        style={{ color: designTokens.text.placeholder }}
                      />
                    ) : (
                      <ChevronRight
                        className="w-4 h-4"
                        style={{ color: designTokens.text.placeholder }}
                      />
                    )}
                  </button>

                  {/* 카테고리 내용 */}
                  {isExpanded && (
                    <div
                      className="p-3 border-t"
                      style={{
                        backgroundColor: designTokens.bg.secondary,
                        borderColor: designTokens.bg.border,
                      }}
                    >
                      {/* 검색 및 액션 */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 relative">
                          <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: designTokens.text.placeholder }}
                          />
                          <Input
                            placeholder={`${config.label} 검색...`}
                            value={searchTerm}
                            onChange={(e) =>
                              setSearchTerms((prev) => ({
                                ...prev,
                                [category]: e.target.value,
                              }))
                            }
                            className="pl-9 h-8 text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => selectAllInCategory(category)}
                          className="px-2 py-1 text-xs font-medium rounded transition-colors"
                          style={{
                            color: designTokens.button.brand_default,
                            backgroundColor: 'transparent',
                          }}
                        >
                          전체 선택
                        </button>
                        <button
                          type="button"
                          onClick={() => clearCategory(category)}
                          className="px-2 py-1 text-xs font-medium rounded transition-colors"
                          style={{
                            color: designTokens.text.secondary,
                            backgroundColor: 'transparent',
                          }}
                        >
                          초기화
                        </button>
                      </div>

                      {/* 항목 목록 */}
                      <div className="grid grid-cols-2 gap-1 max-h-[200px] overflow-y-auto">
                        {filteredItems.map((item) => {
                          const keyMap: Record<TargetCategory, keyof TargetingData> = {
                            department: 'departments',
                            jobRole: 'jobRoles',
                            position: 'positions',
                            rank: 'ranks',
                          };
                          const isSelected = value[keyMap[category]].includes(item.id);

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleItem(category, item.id)}
                              className={cn(
                                'flex items-center justify-between p-2 rounded-lg text-sm transition-colors text-left'
                              )}
                              style={{
                                backgroundColor: isSelected
                                  ? designTokens.button.brand_default + '15'
                                  : designTokens.bg.default,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderColor: isSelected
                                  ? designTokens.button.brand_default
                                  : 'transparent',
                              }}
                            >
                              <span
                                style={{
                                  color: isSelected
                                    ? designTokens.button.brand_default
                                    : designTokens.text.primary,
                                }}
                              >
                                {item.name}
                              </span>
                              <div className="flex items-center gap-1">
                                <span
                                  className="text-xs"
                                  style={{ color: designTokens.text.placeholder }}
                                >
                                  {item.count}명
                                </span>
                                {isSelected && (
                                  <Check
                                    className="w-4 h-4"
                                    style={{ color: designTokens.button.brand_default }}
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
