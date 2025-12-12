import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Languages,
  Moon,
  Sun,
  GraduationCap,
} from 'lucide-react';
import type { AdminSidebarProps, SidebarColors } from '@/types/sidebar.types';
import { designTokens } from '@/styles/design-tokens';
import { cn } from '@/utils/cn';

export function AdminSidebar({
  isExpanded,
  onToggle,
  onMenuItemClick,
  isDarkMode = true,
  onThemeToggle,
  language = 'ko',
  onLanguageChange,
  menuData,
  roleLabel,
}: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string>('dashboard');

  const toggleLanguage = () => {
    const newLanguage = language === 'ko' ? 'en' : 'ko';
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
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
    <div
      style={{
        width: isExpanded ? '280px' : '72px',
        height: '100vh',
        backgroundColor: colors.bg,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: isExpanded ? '20px 16px' : '20px 12px',
          borderBottom: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minHeight: '64px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <GraduationCap size={24} color="#FFFFFF" />
        </div>
        {isExpanded && (
          <div style={{ overflow: 'hidden' }}>
            <h1
              style={{
                color: colors.textPrimary,
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Learning Hub
            </h1>
            <p
              style={{
                color: colors.textSecondary,
                margin: 0,
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              {roleLabel[language]}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden p-3',
          'scrollbar-thin scrollbar-thumb-rounded'
        )}
        style={{
          scrollbarColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.15) transparent'
            : 'rgba(0, 0, 0, 0.15) transparent',
        }}
      >
        <ul className="space-y-1">
          {menuData.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpandedItem = expandedItems.includes(item.id);
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                {/* Level 1 Menu Item */}
                <button
                  onClick={() => handleItemClick(item.id, !!hasSubItems)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    !isExpanded && 'justify-center'
                  )}
                  style={{
                    backgroundColor:
                      isActive && !hasSubItems ? colors.activeBg : 'transparent',
                    color:
                      isActive && !hasSubItems
                        ? colors.activeText
                        : colors.textPrimary,
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
                      <span className="flex-1 text-left text-sm">
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
                  <ul
                    className="mt-1 ml-4 pl-4 border-l-2 space-y-1"
                    style={{ borderColor: colors.border }}
                  >
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeItem === subItem.id;

                      return (
                        <li key={subItem.id}>
                          <button
                            onClick={() =>
                              handleSubItemClick(subItem.id, item.id)
                            }
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
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
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* Collapsed State - Tooltip */}
                {hasSubItems && !isExpanded && (
                  <div className="relative group">
                    <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
                      <div
                        className="border rounded-lg shadow-lg py-2 px-1 min-w-[200px]"
                        style={{
                          backgroundColor: colors.tooltipBg,
                          borderColor: colors.border,
                        }}
                      >
                        <div
                          className="px-3 py-1.5 text-xs border-b mb-1"
                          style={{
                            color: colors.textSecondary,
                            borderColor: colors.border,
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
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
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
              </li>
            );
          })}
        </ul>
      </div>

      {/* Divider */}
      <div className="border-t" style={{ borderColor: colors.border }} />

      {/* Language Toggle */}
      <div className="p-3 border-b" style={{ borderColor: colors.border }}>
        <button
          onClick={toggleLanguage}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
            !isExpanded && 'justify-center'
          )}
          style={{ color: colors.textPrimary }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.hover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title={language === 'ko' ? '한국어 / English' : 'Korean / English'}
        >
          <Languages
            className="w-5 h-5"
            style={{ color: colors.textSecondary }}
          />
          {isExpanded && (
            <span className="flex-1 text-left text-sm">
              {language === 'ko' ? '한국어' : 'English'}
            </span>
          )}
        </button>
      </div>

      {/* Theme Toggle */}
      {onThemeToggle && (
        <div className="p-3 border-b" style={{ borderColor: colors.border }}>
          <button
            onClick={onThemeToggle}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
              !isExpanded && 'justify-center'
            )}
            style={{ color: colors.textPrimary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={
              isDarkMode
                ? language === 'ko'
                  ? '라이트 모드'
                  : 'Light Mode'
                : language === 'ko'
                  ? '다크 모드'
                  : 'Dark Mode'
            }
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" style={{ color: colors.textSecondary }} />
            ) : (
              <Moon className="w-5 h-5" style={{ color: colors.textSecondary }} />
            )}
            {isExpanded && (
              <span className="flex-1 text-left text-sm">
                {isDarkMode
                  ? language === 'ko'
                    ? '라이트 모드'
                    : 'Light Mode'
                  : language === 'ko'
                    ? '다크 모드'
                    : 'Dark Mode'}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-3">
        <button
          onClick={onToggle}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
            !isExpanded && 'justify-center'
          )}
          style={{ color: colors.textPrimary }}
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
              className="w-5 h-5"
              style={{ color: colors.textSecondary }}
            />
          ) : (
            <PanelLeft
              className="w-5 h-5"
              style={{ color: colors.textSecondary }}
            />
          )}
          {isExpanded && (
            <span className="flex-1 text-left text-sm">
              {language === 'ko' ? '접기' : 'Collapse'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
