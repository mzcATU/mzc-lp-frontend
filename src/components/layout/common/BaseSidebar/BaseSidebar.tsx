import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  GraduationCap,
  Briefcase,
  BookOpen,
  Check,
} from 'lucide-react';
import type { BaseSidebarProps, SidebarColors } from '@/types';
import { designTokens } from '@/styles/admin-design-tokens';
import { cn } from '@/utils/cn';

// 역할 전환 모드 타입
type ViewMode = 'instructor' | 'learner';

interface ModeSwitcherProps {
  currentMode: ViewMode;
  isExpanded: boolean;
  language: 'ko' | 'en';
  colors: SidebarColors;
  onModeChange: (mode: ViewMode) => void;
}

function ModeSwitcher({ currentMode, isExpanded, language, colors, onModeChange }: ModeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const modes = [
    {
      id: 'instructor' as ViewMode,
      label: { ko: '강사 모드', en: 'Instructor Mode' },
      icon: Briefcase,
    },
    {
      id: 'learner' as ViewMode,
      label: { ko: '학습자 모드', en: 'Learner Mode' },
      icon: BookOpen,
    },
  ];

  const currentModeData = modes.find(m => m.id === currentMode)!;
  const CurrentIcon = currentModeData.icon;

  if (!isExpanded) {
    return (
      <button
        onClick={() => onModeChange(currentMode === 'instructor' ? 'learner' : 'instructor')}
        className="w-[44px] h-[44px] rounded-xl flex items-center justify-center transition-all mx-auto"
        style={{ backgroundColor: colors.hover }}
        title={currentModeData.label[language]}
      >
        <CurrentIcon className="w-5 h-5" style={{ color: colors.textPrimary }} />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
        style={{
          backgroundColor: colors.hover,
          color: colors.textPrimary,
        }}
      >
        <CurrentIcon className="w-5 h-5" style={{ color: colors.textSecondary }} />
        <span className="flex-1 text-left text-sm font-medium">
          {currentModeData.label[language]}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
          style={{ color: colors.textSecondary }}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown */}
          <div
            className="absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-lg z-50 py-1"
            style={{
              backgroundColor: colors.tooltipBg,
              borderColor: colors.border,
            }}
          >
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = mode.id === currentMode;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    onModeChange(mode.id);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 transition-all"
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
                  <Icon className="w-5 h-5" style={{ color: isActive ? colors.activeText : colors.textSecondary }} />
                  <span className="flex-1 text-left text-sm">{mode.label[language]}</span>
                  {isActive && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function BaseSidebar({
  isExpanded,
  onToggle,
  onMenuItemClick,
  isDarkMode = true,
  language = 'ko',
  menuData,
  roleLabel,
  showModeSwitcher = false,
  currentMode = 'instructor',
}: BaseSidebarProps & { showModeSwitcher?: boolean; currentMode?: ViewMode }) {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string>('dashboard');

  const handleModeChange = (mode: ViewMode) => {
    if (mode === 'learner') {
      navigate('/tu/b2c/mypage');
    } else {
      navigate('/tu/dashboard');
    }
  };

  // Color tokens - Dynamic based on theme
  const colors: SidebarColors = isDarkMode
    ? {
        bg: designTokens.darkMode.bg,
        border: designTokens.darkMode.border,
        textPrimary: designTokens.darkMode.textPrimary,
        textSecondary: designTokens.darkMode.textSecondary,
        hover: designTokens.darkMode.hover,
        activeBg: designTokens.darkMode.activeBg,
        activeText: designTokens.darkMode.activeText,
        tooltipBg: designTokens.darkMode.tooltipBg,
      }
    : {
        bg: designTokens.lightMode.bg,
        border: designTokens.lightMode.border,
        textPrimary: designTokens.lightMode.textPrimary,
        textSecondary: designTokens.lightMode.textSecondary,
        hover: designTokens.lightMode.hover,
        activeBg: designTokens.lightMode.activeBg,
        activeText: designTokens.lightMode.activeText,
        tooltipBg: designTokens.lightMode.tooltipBg,
      };

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      toggleExpand(itemId);
    } else {
      setActiveItem(itemId);
      if (onMenuItemClick) {
        onMenuItemClick(itemId);
      }
    }
  };

  const handleSubItemClick = (subItemId: string, parentId: string) => {
    setActiveItem(subItemId);
    if (!expandedItems.includes(parentId)) {
      setExpandedItems([...expandedItems, parentId]);
    }
    if (onMenuItemClick) {
      onMenuItemClick(subItemId);
    }
  };

  return (
    <aside
      className="flex-shrink-0 transition-all duration-300"
      style={{
        width: isExpanded ? '280px' : '84px',
        padding: isExpanded ? '16px' : '8px',
        backgroundColor: isDarkMode ? '#1e1e1e' : designTokens.bg.app_default,
      }}
    >
      {/* 카드형 사이드바 */}
      <div
        className={cn(
          'rounded-2xl h-full flex flex-col',
          isExpanded ? 'p-4' : 'py-3 px-2',
          isDarkMode
            ? 'bg-white/5 border border-white/10 backdrop-blur-sm'
            : 'bg-white border border-gray-200 shadow-sm'
        )}
      >
        {/* Logo Section */}
        <div
          className={cn(
            'flex items-center gap-3 mb-4',
            !isExpanded && 'justify-center'
          )}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
            }}
          >
            <GraduationCap size={22} color="#FFFFFF" />
          </div>
          {isExpanded && (
            <div className="overflow-hidden">
              <h1
                className="text-lg font-semibold whitespace-nowrap"
                style={{ color: colors.textPrimary }}
              >
                Learning Hub
              </h1>
              {!showModeSwitcher && (
                <p
                  className="text-xs whitespace-nowrap"
                  style={{ color: colors.textSecondary }}
                >
                  {roleLabel[language]}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mode Switcher (TU only) */}
        {showModeSwitcher && (
          <div className={cn('mb-4', !isExpanded && 'flex justify-center')}>
            <ModeSwitcher
              currentMode={currentMode}
              isExpanded={isExpanded}
              language={language}
              colors={colors}
              onModeChange={handleModeChange}
            />
          </div>
        )}

        {/* Divider after header */}
        <div
          className="mb-4"
          style={{
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : colors.border}`,
          }}
        />

        {/* Navigation Menu */}
        <nav
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden space-y-1',
            'sidebar-scrollbar',
            !isDarkMode && 'sidebar-scrollbar-light'
          )}
        >
          {menuData.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpandedItem = expandedItems.includes(item.id);
            const isActive = activeItem === item.id;

            return (
              <div key={item.id} className="mb-1">
                {/* Level 1 Menu Item */}
                <button
                  onClick={() => handleItemClick(item.id, !!hasSubItems)}
                  className="flex items-center rounded-xl transition-all duration-300 overflow-hidden"
                  style={{
                    width: isExpanded ? '100%' : '44px',
                    height: '44px',
                    padding: isExpanded ? '0 16px' : '0',
                    justifyContent: 'center',
                    backgroundColor:
                      isActive && !hasSubItems ? colors.activeBg : 'transparent',
                    color:
                      isActive && !hasSubItems
                        ? colors.activeText
                        : colors.textPrimary,
                    margin: isExpanded ? '0' : '0 auto',
                  }}
                  onMouseEnter={(e) => {
                    if (!(isActive && !hasSubItems)) {
                      e.currentTarget.style.backgroundColor = colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!(isActive && !hasSubItems)) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  title={!isExpanded ? item.label[language] : ''}
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{
                      color:
                        isActive && !hasSubItems
                          ? colors.activeText
                          : colors.textSecondary,
                    }}
                  />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium whitespace-nowrap ml-3">
                        {item.label[language]}
                      </span>
                      {hasSubItems && (
                        <span style={{ color: colors.textSecondary }}>
                          {isExpandedItem ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </>
                  )}
                </button>

                {/* Level 2 Sub-Menu Items */}
                {hasSubItems && isExpanded && isExpandedItem && (
                  <div
                    className="mt-1 ml-4 pl-4 border-l-2 space-y-1"
                    style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}
                  >
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeItem === subItem.id;

                      return (
                        <button
                          key={subItem.id}
                          onClick={() =>
                            handleSubItemClick(subItem.id, item.id)
                          }
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm"
                          style={{
                            backgroundColor: isSubActive
                              ? colors.activeBg
                              : 'transparent',
                            color: isSubActive
                              ? colors.activeText
                              : colors.textPrimary,
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor =
                                colors.hover;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor =
                                'transparent';
                            }
                          }}
                        >
                          <SubIcon
                            className="w-4 h-4 flex-shrink-0"
                            style={{
                              color: isSubActive
                                ? colors.activeText
                                : colors.textSecondary,
                            }}
                          />
                          <span className="flex-1 text-left">
                            {subItem.label[language]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Collapsed State - Tooltip */}
                {hasSubItems && !isExpanded && (
                  <div className="relative group">
                    <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
                      <div
                        className="border rounded-xl shadow-lg py-2 px-1 min-w-[200px]"
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
                          {item.label[language]}
                        </div>
                        {item.subItems!.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = activeItem === subItem.id;

                          return (
                            <button
                              key={subItem.id}
                              onClick={() =>
                                handleSubItemClick(subItem.id, item.id)
                              }
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm"
                              style={{
                                backgroundColor: isSubActive
                                  ? colors.activeBg
                                  : 'transparent',
                                color: isSubActive
                                  ? colors.activeText
                                  : colors.textPrimary,
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.backgroundColor =
                                    colors.hover;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive) {
                                  e.currentTarget.style.backgroundColor =
                                    'transparent';
                                }
                              }}
                            >
                              <SubIcon
                                className="w-4 h-4 flex-shrink-0"
                                style={{
                                  color: isSubActive
                                    ? colors.activeText
                                    : colors.textSecondary,
                                }}
                              />
                              <span className="flex-1 text-left">
                                {subItem.label[language]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Divider before footer */}
        <div
          className="mt-4 pt-4"
          style={{
            borderTop: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : colors.border}`,
          }}
        >
          {/* Collapse Toggle */}
          <button
            onClick={onToggle}
            className="flex items-center rounded-xl transition-all duration-300 overflow-hidden"
            style={{
              width: isExpanded ? '100%' : '44px',
              height: '44px',
              padding: isExpanded ? '0 16px' : '0',
              justifyContent: 'center',
              color: colors.textPrimary,
              margin: isExpanded ? '0' : '0 auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={
              isExpanded
                ? language === 'ko'
                  ? '사이드바 접기'
                  : 'Collapse Sidebar'
                : language === 'ko'
                  ? '사이드바 펼치기'
                  : 'Expand Sidebar'
            }
          >
            {isExpanded ? (
              <PanelLeftClose
                className="w-5 h-5 flex-shrink-0"
                style={{ color: colors.textSecondary }}
              />
            ) : (
              <PanelLeft
                className="w-5 h-5 flex-shrink-0"
                style={{ color: colors.textSecondary }}
              />
            )}
            {isExpanded && (
              <span className="flex-1 text-left text-sm font-medium whitespace-nowrap ml-3">
                {language === 'ko' ? '접기' : 'Collapse'}
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
