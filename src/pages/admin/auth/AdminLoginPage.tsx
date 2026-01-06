import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { Checkbox } from '@/components/common/Checkbox';
import { useLogin } from '@/hooks/common';
import { ROLE_REDIRECT_PATH } from '@/types/common/auth.types';
import { designTokens } from '@/styles/admin-design-tokens';

/**
 * 어드민 로그인 페이지
 * 어드민 디자인 토큰 사용
 */
export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

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
      console.log('[AdminLoginPage] user:', user);
      console.log('[AdminLoginPage] tenantSubdomain:', user.tenantSubdomain);
      console.log('[AdminLoginPage] role:', user.role);

      // Role에 따른 기본 경로
      const basePath = ROLE_REDIRECT_PATH[user.role] || '/';
      console.log('[AdminLoginPage] basePath:', basePath);

      // 테넌트 서브도메인이 있으면 prefix로 추가 (SA 제외)
      let redirectPath = basePath;
      if (user.tenantSubdomain && user.role !== 'SYSTEM_ADMIN') {
        redirectPath = `/${user.tenantSubdomain}${basePath}`;
      }
      console.log('[AdminLoginPage] redirectPath:', redirectPath);

      navigate(redirectPath);
    } catch {
      setErrors({ general: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <div
        className="w-full max-w-[400px] rounded-xl p-8 border shadow-lg"
        style={{
          backgroundColor: designTokens.bg.default,
          borderColor: designTokens.bg.border,
        }}
      >
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: designTokens.button.brand_default }}
          >
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: designTokens.text.primary }}
          >
            관리자 로그인
          </h1>
          <p
            className="text-sm mt-2"
            style={{ color: designTokens.text.secondary }}
          >
            Super Admin / Tenant Admin 전용 로그인
          </p>
        </div>

        {/* 에러 메시지 */}
        {errors.general && (
          <div
            className="mb-4 p-3 rounded-md text-sm"
            style={{
              backgroundColor: designTokens.status.error_background,
              color: designTokens.status.error_text,
            }}
          >
            {errors.general}
          </div>
        )}

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 입력 */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: designTokens.text.primary }}
            >
              이메일
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loginMutation.isPending}
              className="w-full h-10 px-3 rounded-lg border text-sm transition-colors outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: designTokens.bg.default,
                borderColor: errors.email ? designTokens.status.error_text : designTokens.bg.border,
                color: designTokens.text.primary,
              }}
            />
            {errors.email && (
              <p className="text-sm mt-1" style={{ color: designTokens.status.error_text }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: designTokens.text.primary }}
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                className="w-full h-10 px-3 pr-10 rounded-lg border text-sm transition-colors outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: designTokens.bg.default,
                  borderColor: errors.password ? designTokens.status.error_text : designTokens.bg.border,
                  color: designTokens.text.primary,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                style={{ color: designTokens.text.placeholder }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm mt-1" style={{ color: designTokens.status.error_text }}>
                {errors.password}
              </p>
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
                className="text-sm cursor-pointer"
                style={{ color: designTokens.text.secondary }}
              >
                로그인 유지
              </label>
            </div>
            <Link
              to="/auth/forgot-password"
              className="text-sm hover:underline"
              style={{ color: designTokens.button.brand_default }}
            >
              비밀번호 찾기
            </Link>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              backgroundColor: designTokens.button.neutral_default,
              color: designTokens.button.neutral_text,
            }}
            onMouseEnter={(e) => {
              if (!loginMutation.isPending) {
                e.currentTarget.style.backgroundColor = designTokens.button.neutral_hover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = designTokens.button.neutral_default;
            }}
          >
            {loginMutation.isPending ? (
              '로그인 중...'
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                관리자 로그인
              </>
            )}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: designTokens.text.secondary }}>
            계정이 없으신가요?{' '}
            <Link
              to="/admin/register"
              className="font-medium hover:underline"
              style={{ color: designTokens.button.brand_default }}
            >
              관리자 가입 신청
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
