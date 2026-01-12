import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Bell, Menu, X, LogOut, User, Sun, Moon, BookOpen, PlusCircle, Shield, Globe, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/common/auth';
import { useMyProfile, useSubdomainPath } from '@/hooks/common';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation } from '@/store/common/languageStore';
import { useUnreadNotificationCount, usePublicNavigation, usePublicLayout } from '@/hooks/tu';
import { useTenantBranding } from '@/contexts/TenantBrandingContext';
import type { NavigationItemResponse } from '@/types/tu/branding.types';

// 기본 네비게이션 메뉴 (fallback)
const DEFAULT_NAV_ITEMS: NavigationItemResponse[] = [
  { id: 1, label: '강의 탐색', icon: 'BookOpen', path: '/tu/b2c/courses', enabled: true, displayOrder: 1, target: null, createdAt: '', updatedAt: '' },
  { id: 2, label: '로드맵', icon: 'Map', path: '/tu/b2c/roadmaps', enabled: true, displayOrder: 2, target: null, createdAt: '', updatedAt: '' },
  { id: 3, label: '커뮤니티', icon: 'Users', path: '/tu/b2c/community', enabled: true, displayOrder: 3, target: null, createdAt: '', updatedAt: '' },
];

export function LandingHeader() {
  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: profile } = useMyProfile();
  const { theme, toggleTheme } = useThemeStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const { data: unreadCountData } = useUnreadNotificationCount(isAuthenticated);
  const unreadCount = unreadCountData?.count || 0;
  const { branding } = useTenantBranding();
  const { data: navigationItems } = usePublicNavigation();
  const { data: layoutData } = usePublicLayout();

  // 네비게이션 메뉴 (TA 설정 또는 기본값)
  const navItems = navigationItems && navigationItems.length > 0 ? navigationItems : DEFAULT_NAV_ITEMS;

  // 헤더 설정 (로고 표시 여부 등)
  const headerSettings = layoutData?.headerSettings;
  const showLogo = headerSettings?.showLogo !== false; // 기본값 true

  // API Base URL
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace('/api', '');

  // 프로필 이미지 URL 생성
  const profileImageUrl = profile?.profileImageUrl
    ? profile.profileImageUrl.startsWith('http')
      ? profile.profileImageUrl
      : `${apiBaseUrl}${profile.profileImageUrl}`
    : null;

  // 로고 URL 계산 (다크모드 우선)
  const logoUrl = isDark
    ? (branding?.darkLogoUrl || branding?.logoUrl)
    : branding?.logoUrl;

  const fullLogoUrl = logoUrl
    ? (logoUrl.startsWith('http') ? logoUrl : `${apiBaseUrl}${logoUrl}`)
    : null;

  const tenantName = branding?.tenantName || 'MZC Learn';

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(prefixPath(`/tu/b2c/search?search=${encodeURIComponent(searchQuery.trim())}`));
    }
  };

  return (
    <header className="w-full flex flex-col">
      {/* Top Notification Banner - Gradient */}
      {showBanner && (
        <div className="bg-gradient-to-r from-[#6778ff] via-[#a855f7] to-[#6bc2f0] text-white text-xs md:text-sm py-2.5 px-4 text-center font-medium flex justify-center items-center gap-2 relative">
          <span>{t.landing.banner}</span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 text-white/70 hover:text-white text-lg transition-colors"
            aria-label={t.landing.closeBanner}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <div className={`w-full sticky top-0 z-50 border-b ${isDark ? 'glass-dark border-white/10' : 'border-gray-200'}`} style={{ backgroundColor: isDark ? undefined : '#fafafa' }}>
        <div className="w-full px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between gap-6">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-8 ml-2 md:ml-4">
            {/* Logo - showLogo 설정에 따라 표시 */}
            {showLogo && (
              <Link to={prefixPath('/tu/b2c')} className={`flex items-center gap-2 font-bold text-xl tracking-tight ${isDark ? '' : 'text-gray-900'}`}>
                {fullLogoUrl ? (
                  <img src={fullLogoUrl} alt={tenantName} className="h-8 object-contain" />
                ) : (
                  <>
                    <span className="text-2xl">M</span>
                    <span className="gradient-text">{tenantName}</span>
                  </>
                )}
              </Link>
            )}

            {/* Desktop Nav Links */}
            <nav className={`hidden md:flex items-center gap-8 font-medium text-[15px] ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {navItems.map((item) => {
                const isExternal = item.path.startsWith('http');
                const linkPath = isExternal ? item.path : prefixPath(item.path);

                return isExternal ? (
                  <a
                    key={item.id}
                    href={linkPath}
                    target={item.target || '_blank'}
                    rel="noopener noreferrer"
                    className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={linkPath}
                    className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-gray-900'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center: Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.landing.searchPlaceholder}
              className={`w-full rounded-full pl-5 pr-12 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#6778ff] focus:border-[#6778ff] transition-all ${
                isDark
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'border border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              style={{ backgroundColor: isDark ? undefined : '#fafafa' }}
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#6778ff] to-[#a855f7] hover:from-[#8b99ff] hover:to-[#c084fc] w-9 h-9 flex items-center justify-center transition-colors"
            >
              <Search className="h-4 w-4 text-white" />
            </button>
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-5 mr-2 md:mr-4">
            <div className="flex items-center gap-2">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
                aria-label={isDark ? t.landing.switchToLight : t.landing.switchToDark}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link
                to={prefixPath('/tu/b2c/cart')}
                className={`p-2 rounded-lg transition-colors relative ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link
                to={prefixPath('/tu/b2c/wishlist')}
                className={`p-2 rounded-lg transition-colors relative ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Heart className="h-5 w-5" />
              </Link>
              <Link
                to={prefixPath('/tu/b2c/notifications')}
                className={`p-2 rounded-lg transition-colors relative ${
                  isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-gradient-to-r from-[#6778ff] to-[#a855f7] rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              {isAuthenticated && user ? (
                /* Logged in state */
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                      isDark
                        ? 'bg-white/5 hover:bg-white/10'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6778ff] to-[#a855f7] flex items-center justify-center overflow-hidden">
                      {profileImageUrl ? (
                        <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className={`text-sm font-medium max-w-[100px] truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className={`absolute right-0 top-12 w-64 rounded-xl p-4 shadow-xl border ${
                      isDark
                        ? 'bg-[#151515] border-white/10'
                        : 'bg-white border-gray-200'
                    }`}>
                      {/* 프로필 정보 */}
                      <div className={`flex items-center gap-3 pb-3 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6778ff] to-[#a855f7] flex items-center justify-center overflow-hidden">
                          {profileImageUrl ? (
                            <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                          <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                        </div>
                      </div>

                      {/* 메뉴 항목들 */}
                      <div className="py-2 space-y-1">
                        <Link
                          to={prefixPath('/tu/b2c/mypage')}
                          onClick={() => setShowDropdown(false)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                            isDark
                              ? 'text-gray-300 hover:text-white hover:bg-white/10'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <BookOpen className="w-4 h-4" />
                          {t.landing.mypage}
                        </Link>
                        <Link
                          to={prefixPath('/tu/b2c/mypage/teaching')}
                          onClick={() => setShowDropdown(false)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                            isDark
                              ? 'text-gray-300 hover:text-white hover:bg-white/10'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <PlusCircle className="w-4 h-4" />
                          {t.landing.createCourse}
                        </Link>
                      </div>

                      {/* 설정 메뉴 */}
                      <div className={`py-2 border-t space-y-1 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                        <p className={`px-3 py-1 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.landing.settings}</p>
                        <Link
                          to={prefixPath('/tu/b2c/mypage/profile')}
                          onClick={() => setShowDropdown(false)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            isDark
                              ? 'text-gray-300 hover:text-white hover:bg-white/10'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <Shield className="w-4 h-4" />
                          {t.landing.profileSecurity}
                        </Link>
                        <Link
                          to={prefixPath('/tu/b2c/mypage/notifications')}
                          onClick={() => setShowDropdown(false)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            isDark
                              ? 'text-gray-300 hover:text-white hover:bg-white/10'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <Bell className="w-4 h-4" />
                          {t.landing.notifications}
                        </Link>
                        <Link
                          to={prefixPath('/tu/b2c/mypage/language')}
                          onClick={() => setShowDropdown(false)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            isDark
                              ? 'text-gray-300 hover:text-white hover:bg-white/10'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <Globe className="w-4 h-4" />
                          {t.landing.languageRegion}
                        </Link>
                      </div>

                      {/* 로그아웃 */}
                      <div className={`pt-2 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                            isDark
                              ? 'text-red-400 hover:bg-red-500/10'
                              : 'text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <LogOut className="w-4 h-4" />
                          {t.common.logout}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Logged out state */
                <>
                  <Link
                    to="/login"
                    className={`hidden md:flex px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isDark
                        ? 'landing-btn-outline text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {t.common.login}
                  </Link>
                  <Link
                    to="/register"
                    className="hidden md:flex px-4 py-2 landing-btn-primary text-white font-bold rounded-full text-sm"
                  >
                    {t.common.signup}
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button className={`p-2 md:hidden ${isDark ? 'text-gray-400' : 'text-gray-500'}`} aria-label={t.landing.openMenu}>
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
