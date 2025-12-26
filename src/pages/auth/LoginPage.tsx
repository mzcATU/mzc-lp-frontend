import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Checkbox } from '@/components/common/Checkbox';
import { designTokens } from '@/styles/admin-design-tokens';
import { useLogin } from '@/hooks/common';
import { ROLE_REDIRECT_PATH } from '@/types/common/auth.types';

/**
 * 로그인 페이지
 * 디자인 토큰 준수: admin-design-tokens.ts, 01-DESIGN-TOKENS-COMMON.md
 */
export const LoginPage = () => {
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

      // Role에 따른 리다이렉트
      const redirectPath = ROLE_REDIRECT_PATH[user.role] || '/';
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
        className="w-full max-w-[400px] rounded-lg p-8"
        style={{
          backgroundColor: designTokens.bg.default,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: designTokens.button.brand_default }}
          >
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: designTokens.text.primary }}
          >
            로그인
          </h1>
          <p
            className="text-sm mt-2"
            style={{ color: designTokens.text.secondary }}
          >
            계정에 로그인하여 학습을 시작하세요
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
            <Input
              type="email"
              label="이메일"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={loginMutation.isPending}
            />
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
                className={`w-full h-9 px-3 py-1 pr-10 rounded-md border text-sm transition-colors outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.password
                    ? 'border-status-error ring-status-error/20'
                    : 'border-border focus:ring-action-primary'
                }`}
                style={{
                  backgroundColor: designTokens.bg.default,
                  color: designTokens.text.primary,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                style={{ color: designTokens.text.secondary }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p
                className="text-sm mt-1"
                style={{ color: designTokens.status.error_text }}
              >
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
          <Button
            type="submit"
            className="w-full"
            size="md"
            disabled={loginMutation.isPending}
            style={{
              backgroundColor: designTokens.button.neutral_default,
              color: designTokens.button.neutral_text,
            }}
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        {/* 회원가입 링크 */}
        <div className="mt-6 text-center">
          <p
            className="text-sm"
            style={{ color: designTokens.text.secondary }}
          >
            계정이 없으신가요?{' '}
            <Link
              to="/register"
              className="font-medium hover:underline"
              style={{ color: designTokens.button.brand_default }}
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
