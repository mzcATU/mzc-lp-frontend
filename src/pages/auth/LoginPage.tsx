import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/common/auth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card';
import { ROLE_REDIRECT_PATH } from '@/types/common/auth.types';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

/**
 * 로그인 페이지
 * 디자인 토큰 및 UX 패턴 준수:
 * - 배경: bg-bg-app (--color-bg-app: #FAFAFA)
 * - 카드: Card 컴포넌트 (bg-card, rounded-lg, shadow)
 * - 텍스트: text-text-primary (#333333), text-text-secondary (#666666)
 * - 에러: text-status-error (#D32F2F)
 * - 버튼: Button variant="brand" (--color-btn-brand: #4C2D9A)
 * - 링크: text-btn-brand with hover:underline
 * - 간격: space-y-4 (16px), space-y-2 (8px)
 * - 반응형: 모바일 우선 (px-4 → 패딩)
 */
export function LoginPage() {
  const { isAuthenticated, user, login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // 이미 로그인된 경우 역할별 페이지로 리다이렉트
  if (isAuthenticated && user) {
    return <Navigate to={ROLE_REDIRECT_PATH[user.role]} replace />;
  }

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      login({ email, password });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-app px-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl font-semibold text-text-primary">
            로그인
          </CardTitle>
          <CardDescription className="text-text-secondary">
            MZC Learn Platform에 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 필드 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary font-medium">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoggingIn}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={errors.email ? 'border-status-error focus-visible:ring-status-error' : ''}
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-sm text-status-error"
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* 비밀번호 필드 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-primary font-medium">
                비밀번호
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoggingIn}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`pr-10 ${errors.password ? 'border-status-error focus-visible:ring-status-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  tabIndex={-1}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-sm text-status-error"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              variant="brand"
              className="w-full"
              disabled={isLoggingIn}
              aria-busy={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </Button>
          </form>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center text-sm text-text-secondary">
            계정이 없으신가요?{' '}
            <Link
              to="/register"
              className="text-btn-brand hover:underline font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              회원가입
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
