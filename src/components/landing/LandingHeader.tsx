import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Bell, Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/hooks/common/auth';
import { useThemeStore } from '@/store/common/themeStore';

export function LandingHeader() {
  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tu/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full flex flex-col">
      {/* Top Notification Banner - Gradient */}
      {showBanner && (
        <div className="bg-gradient-to-r from-[#6778ff] via-[#a855f7] to-[#6bc2f0] text-white text-xs md:text-sm py-2.5 px-4 text-center font-medium flex justify-center items-center gap-2 relative">
          <span>MZC Learn Platform - 클라우드 교육의 새로운 시작</span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-4 text-white/70 hover:text-white text-lg transition-colors"
            aria-label="배너 닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navigation - Dark Glass Effect */}
      <div className="w-full glass-dark sticky top-0 z-50">
        <div className="w-full px-6 md:px-12 lg:px-16 h-16 flex items-center justify-between gap-6">
          {/* Left: Logo & Menu */}
          <div className="flex items-center gap-8 ml-2 md:ml-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <span className="text-2xl">M</span>
              <span className="gradient-text">MZC Learn</span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-gray-300 font-medium text-[15px]">
              <Link to="/tu/main/page1" className="hover:text-white transition-colors">
                1페이지
              </Link>
              <Link to="/tu/main/page2" className="hover:text-white transition-colors">
                2페이지
              </Link>
              <Link to="/tu/main/page3" className="hover:text-white transition-colors">
                3페이지
              </Link>
            </nav>
          </div>

          {/* Center: Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="배우고 싶은 지식을 입력해보세요."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#6778ff] focus:border-[#6778ff] transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full landing-btn-primary w-9 h-9 flex items-center justify-center"
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
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link
                to="/tu/cart"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link
                to="/tu/notifications"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors relative"
              >
                <Bell className="h-5 w-5" />
              </Link>
              {isAuthenticated && user ? (
                /* Logged in state */
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6778ff] to-[#a855f7] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-white font-medium max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 top-12 w-64 glass rounded-xl p-4 shadow-xl border border-white/10">
                      <Link
                        to="/tu/settings"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 pb-3 border-b border-white/10 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6778ff] to-[#a855f7] flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{user.name}</p>
                          <p className="text-gray-400 text-xs truncate">{user.email}</p>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full mt-3 flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Logged out state */
                <>
                  <Link
                    to="/login"
                    className="hidden md:flex px-4 py-2 landing-btn-outline text-white rounded-full text-sm font-medium"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="hidden md:flex px-4 py-2 landing-btn-primary text-white font-bold rounded-full text-sm"
                  >
                    회원가입
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button className="p-2 md:hidden text-gray-400" aria-label="메뉴 열기">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
