import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Checkbox } from '@/components/common/Checkbox';
import { designTokens } from '@/styles/admin-design-tokens';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  general?: string;
}

/**
 * 회원가입 페이지
 * 디자인 토큰 준수: admin-design-tokens.ts, 01-DESIGN-TOKENS-COMMON.md
 */
export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // 입력 시 해당 필드 에러 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.';
    }

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다.';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 약관 동의 검증
    if (!agreeTerms) {
      newErrors.terms = '서비스 이용약관에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: API 연동
      // await authService.register({
      //   name: formData.name,
      //   email: formData.email,
      //   password: formData.password,
      // });

      // 임시: 성공 시 로그인 페이지로 이동
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/auth/login', { state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' } });
    } catch {
      setErrors({ general: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordInput = (
    field: 'password' | 'confirmPassword',
    label: string,
    placeholder: string,
    show: boolean,
    setShow: (v: boolean) => void
  ) => (
    <div>
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: designTokens.text.primary }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={formData[field]}
          onChange={handleChange(field)}
          disabled={isLoading}
          className={`w-full h-9 px-3 py-1 pr-10 rounded-md border text-sm transition-colors outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors[field]
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
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
          style={{ color: designTokens.text.secondary }}
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {errors[field] && (
        <p className="text-sm mt-1" style={{ color: designTokens.status.error_text }}>
          {errors[field]}
        </p>
      )}
    </div>
  );

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
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: designTokens.text.primary }}
          >
            회원가입
          </h1>
          <p
            className="text-sm mt-2"
            style={{ color: designTokens.text.secondary }}
          >
            계정을 만들고 학습을 시작하세요
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

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 입력 */}
          <Input
            type="text"
            label="이름"
            placeholder="홍길동"
            value={formData.name}
            onChange={handleChange('name')}
            error={errors.name}
            disabled={isLoading}
          />

          {/* 이메일 입력 */}
          <Input
            type="email"
            label="이메일"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            disabled={isLoading}
          />

          {/* 비밀번호 입력 */}
          {renderPasswordInput('password', '비밀번호', '8자 이상, 영문+숫자', showPassword, setShowPassword)}

          {/* 비밀번호 확인 */}
          {renderPasswordInput(
            'confirmPassword',
            '비밀번호 확인',
            '비밀번호를 다시 입력하세요',
            showConfirmPassword,
            setShowConfirmPassword
          )}

          {/* 약관 동의 */}
          <div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => {
                  setAgreeTerms(checked === true);
                  if (errors.terms) {
                    setErrors((prev) => ({ ...prev, terms: undefined }));
                  }
                }}
                disabled={isLoading}
                className="mt-0.5"
              />
              <label
                htmlFor="terms"
                className="text-sm cursor-pointer"
                style={{ color: designTokens.text.secondary }}
              >
                <Link
                  to="/terms"
                  className="hover:underline"
                  style={{ color: designTokens.button.brand_default }}
                  onClick={(e) => e.stopPropagation()}
                >
                  서비스 이용약관
                </Link>
                {' 및 '}
                <Link
                  to="/privacy"
                  className="hover:underline"
                  style={{ color: designTokens.button.brand_default }}
                  onClick={(e) => e.stopPropagation()}
                >
                  개인정보 처리방침
                </Link>
                에 동의합니다.
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm mt-1" style={{ color: designTokens.status.error_text }}>
                {errors.terms}
              </p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            className="w-full"
            size="md"
            disabled={isLoading}
            style={{
              backgroundColor: designTokens.button.neutral_default,
              color: designTokens.button.neutral_text,
            }}
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </Button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: designTokens.text.secondary }}>
            이미 계정이 있으신가요?{' '}
            <Link
              to="/auth/login"
              className="font-medium hover:underline"
              style={{ color: designTokens.button.brand_default }}
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
