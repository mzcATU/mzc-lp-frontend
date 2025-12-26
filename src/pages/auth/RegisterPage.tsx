import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/common/auth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card';
import { ROLE_REDIRECT_PATH } from '@/types/common/auth.types';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
}

/**
 * 회원가입 페이지
 * 디자인 토큰 및 UX 패턴 준수:
 * - 배경: bg-bg-app (--color-bg-app: #FAFAFA)
 * - 카드: Card 컴포넌트 (bg-card, rounded-lg, shadow)
 * - 텍스트: text-text-primary (#333333), text-text-secondary (#666666)
 * - 에러: text-status-error (#D32F2F)
 * - 성공: text-status-success (#388E3C)
 * - 버튼: Button variant="brand" (--color-btn-brand: #4C2D9A)
 * - 링크: text-btn-brand with hover:underline
 * - 간격: space-y-4 (16px), space-y-2 (8px)
 * - 반응형: 모바일 우선 (px-4 → 패딩)
 * - 접근성: aria-invalid, aria-describedby, role="alert"
 */
export function RegisterPage() {
  const { isAuthenticated, user, register, isRegistering } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // 이미 로그인된 경우 역할별 페이지로 리다이렉트
  if (isAuthenticated && user) {
    return <Navigate to={ROLE_REDIRECT_PATH[user.role]} replace />;
  }

  const passwordRequirements = [
    { label: '8자 이상', test: (p: string) => p.length >= 8 },
    { label: '영문 포함', test: (p: string) => /[A-Za-z]/.test(p) },
    { label: '숫자 포함', test: (p: string) => /\d/.test(p) },
    { label: '특수문자 포함', test: (p: string) => /[@$!%*#?&]/.test(p) },
  ];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(formData.password)
    ) {
      newErrors.password = '비밀번호 요구사항을 모두 충족해야 합니다.';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.length > 50) {
      newErrors.name = '이름은 50자 이하여야 합니다.';
    }

    // 전화번호 검증 (선택)
    if (formData.phone && !/^01[0-9]-\d{3,4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone || undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-app px-4 py-8">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-xl font-semibold text-text-primary">
            회원가입
          </CardTitle>
          <CardDescription className="text-text-secondary">
            MZC Learn Platform에 가입하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이메일 필드 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary font-medium">
                이메일 <span className="text-status-error">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isRegistering}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={errors.email ? 'border-status-error focus-visible:ring-status-error' : ''}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="text-sm text-status-error">
                  {errors.email}
                </p>
              )}
            </div>

            {/* 이름 필드 */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-text-primary font-medium">
                이름 <span className="text-status-error">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="홍길동"
                value={formData.name}
                onChange={handleChange}
                disabled={isRegistering}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={errors.name ? 'border-status-error focus-visible:ring-status-error' : ''}
              />
              {errors.name && (
                <p id="name-error" role="alert" className="text-sm text-status-error">
                  {errors.name}
                </p>
              )}
            </div>

            {/* 전화번호 필드 */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-text-primary font-medium">
                전화번호 <span className="text-text-secondary">(선택)</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={handleChange}
                disabled={isRegistering}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                className={errors.phone ? 'border-status-error focus-visible:ring-status-error' : ''}
              />
              {errors.phone && (
                <p id="phone-error" role="alert" className="text-sm text-status-error">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* 비밀번호 필드 */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-primary font-medium">
                비밀번호 <span className="text-status-error">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isRegistering}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : 'password-requirements'}
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
              {/* 비밀번호 요구사항 */}
              {formData.password && (
                <div id="password-requirements" className="mt-2 space-y-1">
                  {passwordRequirements.map((req) => {
                    const passed = req.test(formData.password);
                    return (
                      <div
                        key={req.label}
                        className={`flex items-center gap-2 text-xs ${
                          passed ? 'text-status-success' : 'text-text-secondary'
                        }`}
                      >
                        {passed ? <Check size={12} /> : <X size={12} />}
                        {req.label}
                      </div>
                    );
                  })}
                </div>
              )}
              {errors.password && (
                <p id="password-error" role="alert" className="text-sm text-status-error">
                  {errors.password}
                </p>
              )}
            </div>

            {/* 비밀번호 확인 필드 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-text-primary font-medium">
                비밀번호 확인 <span className="text-status-error">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isRegistering}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  className={`pr-10 ${errors.confirmPassword ? 'border-status-error focus-visible:ring-status-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" role="alert" className="text-sm text-status-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <Button
              type="submit"
              variant="brand"
              className="w-full"
              disabled={isRegistering}
              aria-busy={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  가입 중...
                </>
              ) : (
                '회원가입'
              )}
            </Button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center text-sm text-text-secondary">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/login"
              className="text-btn-brand hover:underline font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
