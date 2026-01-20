import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, LogOut, User, Sun, Moon, BookOpen, Shield, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/common/auth';
import { useMyProfile, useSubdomainPath } from '@/hooks/common';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation } from '@/store/common/languageStore';
import { useUnreadNotificationCount, usePublicLayout } from '@/hooks/tu';
import { useTenantBranding } from '@/contexts/TenantBrandingContext';
import type { NavigationItemResponse } from '@/types/tu/branding.types';

// B2B 기본 네비게이션 (로드맵, 커뮤니티, 강의 탐색 제외)
const DEFAULT_NAV_ITEMS: NavigationItemResponse[] = [];

const BANNER_DISMISSED_KEY = 'tu_b2b_top_banner_dismissed';

/**
 * B2B 전용 랜딩 헤더
 * - 장바구니 없음
 * - 로드맵 메뉴 없음
 * - 커뮤니티 메뉴 없음
 * - 위시리스트(찜) 아이콘 표시
 */
export function B2BLandingHeader() {
  const [showBanner, setShowBanner] = useState(() => {
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    return dismissed !== 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
  const { data: layoutData } = usePublicLayout();

  // 네비게이션 메뉴 (B2B용 - 로드맵/커뮤니티 제외)
  const headerNavLinks = (layoutData?.headerSettings as { navLinks?: Array<{ label: string; url: string; visible: boolean }> })?.navLinks;

  const normalizeNavUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    // B2B 경로로 변환
    if (url.startsWith('/tu/b2c')) {
      return url.replace('/tu/b2c', '/tu/b2b');
    }
    if (url.startsWith('/tu/')) return url;
    return `/tu/b2b${url.startsWith('/') ? url : `/${url}`}`;
  };

  const navItems = headerNavLinks && headerNavLinks.length > 0
    ? headerNavLinks
        .filter(link => link.visible)
        // B2B에서 로드맵, 커뮤니티, 강의 탐색 링크 제외
        .filter(link => !link.url.includes('roadmap') && !link.url.includes('community') && !link.url.includes('courses'))
        .map((link, index) => ({
          id: index + 1,
          label: link.label,
          icon: 'BookOpen',
          path: normalizeNavUrl(link.url),
          enabled: true,
          displayOrder: index + 1,
          target: null,
          createdAt: '',
          updatedAt: '',
        }))
    : DEFAULT_NAV_ITEMS;

  const headerSettings = layoutData?.headerSettings;
  const headerEnabled = headerSettings?.enabled !== false;
  const showLogo = headerSettings?.showLogo !== false;
  const showSearch = headerSettings?.showSearch !== false;
  const showNotifications = headerSettings?.showNotifications !== false;
  const showThemeToggle = headerSettings?.showThemeToggle !== false;

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace('/api', '');

  const profileImageUrl = profile?.profileImageUrl
    ? profile.profileImageUrl.startsWith('http')
      ? profile.profileImageUrl
      : `${apiBaseUrl}${profile.profileImageUrl}`
    : null;

  const logoUrl = isDark
    ? (branding?.darkLogoUrl || branding?.logoUrl)
    : branding?.logoUrl;

  const fullLogoUrl = logoUrl
    ? (logoUrl.startsWith('http') ? logoUrl : `${apiBaseUrl}${logoUrl}`)
    : null;

  const tenantName = branding?.tenantName || 'MZC Learn';

  const topBannerSettings = (layoutData?.headerSettings as { topBanner?: { enabled?: boolean; text?: string; linkUrl?: string; linkText?: string } })?.topBanner;
  const topBannerEnabled = topBannerSettings?.enabled !== false;
  const topBannerText = topBannerSettings?.text || t.landing.banner;
  const topBannerLinkUrl = topBannerSettings?.linkUrl;
  const topBannerLinkText = topBannerSettings?.linkText;

  const handleCloseBanner = useCallback(() => {
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    setShowBanner(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(BANNER_DISMISSED_KEY);
    logout();
    setShowDropdown(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(prefixPath(`/tu/b2b/search?search=${encodeURIComponent(searchQuery.trim())}`));
    }
  };

  return (
    <header className="w-full flex flex-col">
      {/* Top Banner */}
      {showBanner && topBannerEnabled && (
        <div className="bg-gradient-to-r from-[#6778ff] via-[#a855f7] to-[#6bc2f0] text-white text-xs md:text-sm py-2.5 px-4 text-center font-medium flex justify-center items-center gap-2 relative">
          <span>{topBannerText}</span>
          {topBannerLinkUrl && topBannerLinkText && (
            <a
              href={topBannerLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline ml-1"
            >
              {topBannerLinkText}
            </a>
          )}
          <button
            onClick={handleCloseBanner}
            className="absolute right-4 text-white/70 hover:text-white text-lg transition-colors"
            aria-label={t.landing.closeBanner}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      {headerEnabled && (
        <div className={`w-full sticky top-0 z-50 border-b ${isDark ? 'glass-dark border-white/10' : 'border-gray-200'}`} style={{ backgroundColor: isDark ? undefined : '#fafafa' }}>
          <div className="w-full px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between gap-6">
            {/* Left: Logo & Menu */}
            <div className="flex items-center gap-8 ml-2 md:ml-4">
              {showLogo && (
                <Link to={prefixPath('/tu/b2b')} className={`flex items-center gap-2 font-bold text-xl tracking-tight ${isDark ? '' : 'text-gray-900'}`}>
                  {fullLogoUrl ? (
                    <img src={fullLogoUrl} alt={tenantName} className="h-8 object-contain" />
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6778ff] via-[#a855f7] to-[#6bc2f0] flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <span className="text-white font-bold text-lg">M</span>
                      </div>
                      <span className="gradient-text font-bold">{tenantName}</span>
                    </>
                  )}
                </Link>
              )}

              {/* Desktop Nav Links (로드맵, 커뮤니티 제외) */}
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
            {showSearch && (
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
            )}

            {/* Right: Actions (장바구니 제외, 위시리스트 포함) */}
            <div className="flex items-center gap-3 md:gap-5 mr-2 md:mr-4">
              <div className="flex items-center gap-2">
                {showThemeToggle && (
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
                )}
                {/* 위시리스트 (찜) - B2B에서도 표시 */}
                <Link
                  to={prefixPath('/tu/b2b/wishlist')}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? 'text-gray-400 hover:text-white hover:bg-white/10'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="찜 목록"
                >
                  <Heart className="h-5 w-5" />
                </Link>
                {showNotifications && (
                  <Link
                    to={prefixPath('/tu/b2b/notifications')}
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
                )}
                {isAuthenticated && user ? (
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

                    {showDropdown && (
                      <div className={`absolute right-0 top-12 w-64 rounded-xl p-4 shadow-xl border ${
                        isDark
                          ? 'bg-[#151515] border-white/10'
                          : 'bg-white border-gray-200'
                      }`}>
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

                        <div className="py-2 space-y-1">
                          <Link
                            to={prefixPath('/tu/b2b/mypage')}
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
                        </div>

                        <div className={`py-2 border-t space-y-1 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                          <p className={`px-3 py-1 text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>설정</p>
                          <Link
                            to={prefixPath('/tu/b2b/mypage/profile')}
                            onClick={() => setShowDropdown(false)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                              isDark
                                ? 'text-gray-300 hover:text-white hover:bg-white/10'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            <Shield className="w-4 h-4" />
                            프로필
                          </Link>
                          <Link
                            to={prefixPath('/tu/b2b/mypage/settings/preferences')}
                            onClick={() => setShowDropdown(false)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                              isDark
                                ? 'text-gray-300 hover:text-white hover:bg-white/10'
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            <Bell className="w-4 h-4" />
                            환경설정
                          </Link>
                        </div>

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

                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className={`p-2 md:hidden ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  aria-label={t.landing.openMenu}
                >
                  {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Drawer */}
          {showMobileMenu && (
            <div className={`md:hidden border-t ${isDark ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-200'}`}>
              <div className="px-4 py-3 space-y-1">
                {/* 네비게이션 링크 */}
                {navItems.map((item) => {
                  const isExternal = item.path.startsWith('http');
                  const linkPath = isExternal ? item.path : prefixPath(item.path);

                  return isExternal ? (
                    <a
                      key={item.id}
                      href={linkPath}
                      target={item.target || '_blank'}
                      rel="noopener noreferrer"
                      onClick={() => setShowMobileMenu(false)}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.id}
                      to={linkPath}
                      onClick={() => setShowMobileMenu(false)}
                      className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* 검색창 (모바일) */}
                {showSearch && (
                  <form onSubmit={(e) => { handleSearch(e); setShowMobileMenu(false); }} className="pt-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.landing.searchPlaceholder}
                        className={`w-full rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#6778ff] ${
                          isDark
                            ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                            : 'border border-gray-300 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-gradient-to-r from-[#6778ff] to-[#a855f7]"
                      >
                        <Search className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </form>
                )}

                {/* 로그인/회원가입 버튼 (모바일) */}
                {!isAuthenticated && (
                  <div className={`pt-3 mt-2 border-t space-y-2 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <Link
                      to="/login"
                      onClick={() => setShowMobileMenu(false)}
                      className={`block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isDark
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {t.common.login}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setShowMobileMenu(false)}
                      className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#6778ff] to-[#a855f7] hover:opacity-90"
                    >
                      {t.common.signup}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
