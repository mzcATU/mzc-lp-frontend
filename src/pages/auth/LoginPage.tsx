import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Sun, Moon } from 'lucide-react';
import { Checkbox } from '@/components/common/Checkbox';
import { useLogin } from '@/hooks/common';
import { ROLE_REDIRECT_PATH } from '@/types/common/auth.types';
import { useThemeStore } from '@/store/common/themeStore';

/**
 * 로그인 페이지
 * 다크/라이트 모드 지원
 */
export const LoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setErrors({});

    try {
      const user = await loginMutation.mutateAsync({ email, password });

      // Role에 따른 기본 경로
      const basePath = ROLE_REDIRECT_PATH[user.role] || '/';

      // 테넌트 서브도메인이 있으면 prefix로 추가 (SA 제외)
      let redirectPath = basePath;
      if (user.tenantSubdomain && user.role !== 'SYSTEM_ADMIN') {
        redirectPath = `/${user.tenantSubdomain}${basePath}`;
      }

      navigate(redirectPath);
    } catch {
      setErrors({ general: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'
    }`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
          isDark
            ? 'text-gray-400 hover:text-white hover:bg-white/10'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
        }`}
        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className={`w-full max-w-[400px] rounded-xl p-8 border ${
        isDark
          ? 'bg-[#1a1a1a] border-white/10'
          : 'bg-white border-gray-200 shadow-lg'
      }`}>
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center bg-gradient-to-r from-[#6778ff] to-[#a855f7]">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            로그인
          </h1>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            계정에 로그인하여 학습을 시작하세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {errors.general && (
          <div className="mb-4 p-3 rounded-md text-sm bg-red-500/10 text-red-500 border border-red-500/20">
            {errors.general}
          </div>
        )}

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 입력 */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              이메일
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              className={`w-full h-10 px-3 rounded-lg border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#6778ff] disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500/20'
                  : isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
            {errors.email && (
              <p className="text-sm mt-1 text-red-500">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                className={`w-full h-10 px-3 pr-10 rounded-lg border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#6778ff] disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500/20'
                    : isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 ${
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm mt-1 text-red-500">{errors.password}</p>
            )}
          </div>

          {/* 로그인 유지 & 비밀번호 찾기 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={loginMutation.isPending}
              />
              <label
                htmlFor="remember"
                className={`text-sm cursor-pointer ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              >
                로그인 유지
              </label>
            </div>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-[#6778ff] hover:underline"
            >
              비밀번호 찾기
            </Link>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#6778ff] to-[#a855f7] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            계정이 없으신가요?{' '}
            <Link
              to="/register"
              className="font-medium text-[#6778ff] hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>

        {/* 관리자 로그인 링크 */}
        <div className={`mt-4 pt-4 text-center border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            관리자이신가요?{' '}
            <Link
              to="/admin/login"
              className={`font-medium hover:underline ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              관리자 로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
