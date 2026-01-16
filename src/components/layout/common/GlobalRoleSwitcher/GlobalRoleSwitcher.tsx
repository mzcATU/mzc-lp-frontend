import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Shield, Briefcase, BookOpen, GraduationCap } from 'lucide-react';
import type { SidebarColors } from '@/types';
import { cn } from '@/utils/cn';
import { useSubdomainPath } from '@/hooks/common';
import { useAuthStore } from '@/store/common/authStore';

// 글로벌 역할 타입 (TA, CO, TU, USER)
export type GlobalRole = 'TA' | 'CO' | 'TU' | 'USER';

interface GlobalRoleSwitcherProps {
  currentRole: GlobalRole;
  isExpanded: boolean;
  language: 'ko' | 'en';
  colors: SidebarColors;
  isDarkMode?: boolean;
}

// 역할별 아이콘
const roleIcons: Record<GlobalRole, typeof Shield> = {
  TA: Shield,
  CO: Briefcase,
  TU: BookOpen,
  USER: GraduationCap,
};

// 역할별 라벨
const roleLabels: Record<GlobalRole, { ko: string; en: string }> = {
  TA: { ko: '관리자', en: 'Admin' },
  CO: { ko: '교육 운영자', en: 'Course Operator' },
  TU: { ko: '강사', en: 'Instructor' },
  USER: { ko: '학습자', en: 'Learner' },
};

// 역할별 기본 경로
const roleDefaultPaths: Record<Exclude<GlobalRole, 'USER'>, string> = {
  TA: '/ta/dashboard',
  CO: '/co/dashboard',
  TU: '/tu/dashboard',
};

export function GlobalRoleSwitcher({
  currentRole,
  isExpanded,
  language,
  colors,
  isDarkMode = true,
}: GlobalRoleSwitcherProps) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 사용자의 역할 가져오기 (roles 배열 우선 사용)
  const userRole = useAuthStore((state) => state.user?.role);
  const userRoles = useAuthStore((state) => state.user?.roles) as string[] | undefined;

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 사용자가 가진 역할만 표시 (순서: 학습자 → 강사 → 교육 운영자 → 관리자)
  const availableRoles: GlobalRole[] = (() => {
    const roles: GlobalRole[] = [];

    // roles 배열이 있으면 사용 (1:N 관계 지원)
    const rolesToCheck = userRoles && userRoles.length > 0 ? userRoles : (userRole ? [userRole] : []);

    // 부여받은 역할만 표시 (USER 역할도 부여받은 경우에만)
    if (rolesToCheck.includes('USER')) {
      roles.push('USER');
    }
    if (rolesToCheck.includes('INSTRUCTOR') || rolesToCheck.includes('DESIGNER')) {
      roles.push('TU');
    }
    if (rolesToCheck.includes('OPERATOR')) {
      roles.push('CO');
    }
    if (rolesToCheck.includes('TENANT_ADMIN')) {
      roles.push('TA');
    }

    return roles;
  })();

  const CurrentIcon = roleIcons[currentRole];

  // 역할이 1개 이하면 스위처를 표시하지 않음
  if (availableRoles.length <= 1) {
    return null;
  }

  const handleRoleChange = (role: GlobalRole) => {
    if (role !== currentRole) {
      if (role === 'USER') {
        // TODO: 테넌트 설정(siteMode)에 따라 B2B/B2C 경로 결정 (현재는 B2C 기본)
        navigate(prefixPath('/tu/b2c/mypage'));
      } else {
        navigate(prefixPath(roleDefaultPaths[role]));
      }
    }
    setIsOpen(false);
  };

  // 접힌 상태 - 아이콘만 표시
  if (!isExpanded) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            color: colors.textPrimary,
          }}
          title={roleLabels[currentRole][language]}
        >
          <CurrentIcon className="w-5 h-5" />
        </button>

        {/* 드롭다운 메뉴 (접힌 상태) */}
        {isOpen && (
          <div
            className="absolute left-full top-0 ml-2 z-50 min-w-[180px] py-2 rounded-xl shadow-lg border"
            style={{
              backgroundColor: colors.tooltipBg,
              borderColor: colors.border,
            }}
          >
            <div
              className="px-3 py-1.5 text-xs border-b mb-1"
              style={{
                color: colors.textSecondary,
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : colors.border,
              }}
            >
              {language === 'ko' ? '역할 전환' : 'Switch Role'}
            </div>
            {availableRoles.map((role) => {
              const Icon = roleIcons[role];
              const isActive = currentRole === role;

              return (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 transition-all text-sm"
                  style={{
                    backgroundColor: isActive ? colors.activeBg : 'transparent',
                    color: isActive ? colors.activeText : colors.textPrimary,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: isActive ? colors.activeText : colors.textSecondary }} />
                  <span>{roleLabels[role][language]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 펼친 상태 - 드롭다운 버튼
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
          'border'
        )}
        style={{
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
          color: colors.textPrimary,
        }}
      >
        <CurrentIcon className="w-5 h-5" style={{ color: colors.textSecondary }} />
        <span className="flex-1 text-left text-sm font-medium">
          {roleLabels[currentRole][language]}
        </span>
        <ChevronDown
          className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')}
          style={{ color: colors.textSecondary }}
        />
      </button>

      {/* 드롭다운 메뉴 (펼친 상태) */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 z-50 py-1 rounded-xl shadow-lg border"
          style={{
            backgroundColor: colors.tooltipBg,
            borderColor: colors.border,
          }}
        >
          {availableRoles.map((role) => {
            const Icon = roleIcons[role];
            const isActive = currentRole === role;

            return (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className="w-full flex items-center gap-3 px-4 py-3 transition-all text-sm"
                style={{
                  backgroundColor: isActive ? colors.activeBg : 'transparent',
                  color: isActive ? colors.activeText : colors.textPrimary,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = colors.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isActive ? colors.activeText : colors.textSecondary }}
                />
                <span className="flex-1 text-left font-medium">
                  {roleLabels[role][language]}
                </span>
                {isActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    backgroundColor: isDarkMode ? 'rgba(124, 92, 191, 0.3)' : 'rgba(76, 45, 154, 0.1)',
                    color: isDarkMode ? '#C4B5FD' : '#4C2D9A',
                  }}>
                    {language === 'ko' ? '현재' : 'Current'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
