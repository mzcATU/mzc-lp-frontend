import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/common/auth';
import { ROLE_REDIRECT_PATH } from '@/types/common/auth.types';
import { Eye, EyeOff, Loader2, Check, X, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  phone?: string;
}

/**
 * 회원가입 페이지
 * 다크/라이트 모드 지원
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
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

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

  const inputClassName = (hasError: boolean) => `
    w-full h-10 px-3 rounded-lg border text-sm transition-colors outline-none
    focus:ring-2 focus:ring-[#6778ff] disabled:opacity-50 disabled:cursor-not-allowed
    ${hasError
      ? 'border-red-500 focus:ring-red-500/20'
      : isDark
        ? 'bg-white/5 border-white/10 text-white placeholder-gray-500'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
    }
  `;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 py-8 ${
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
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-[#6778ff] via-[#a855f7] to-[#6bc2f0] shadow-lg shadow-purple-500/20">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            회원가입
          </h1>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            MZC Learn Platform에 가입하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 필드 */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isRegistering}
              className={inputClassName(!!errors.email)}
            />
            {errors.email && (
              <p className="text-sm mt-1 text-red-500">{errors.email}</p>
            )}
          </div>

          {/* 이름 필드 */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="홍길동"
              value={formData.name}
              onChange={handleChange}
              disabled={isRegistering}
              className={inputClassName(!!errors.name)}
            />
            {errors.name && (
              <p className="text-sm mt-1 text-red-500">{errors.name}</p>
            )}
          </div>

          {/* 전화번호 필드 */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              전화번호 <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>(선택)</span>
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="010-1234-5678"
              value={formData.phone}
              onChange={handleChange}
              disabled={isRegistering}
              className={inputClassName(!!errors.phone)}
            />
            {errors.phone && (
              <p className="text-sm mt-1 text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* 비밀번호 필드 */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                disabled={isRegistering}
                className={`${inputClassName(!!errors.password)} pr-10`}
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
            {/* 비밀번호 요구사항 */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                {passwordRequirements.map((req) => {
                  const passed = req.test(formData.password);
                  return (
                    <div
                      key={req.label}
                      className={`flex items-center gap-2 text-xs ${
                        passed ? 'text-green-500' : isDark ? 'text-gray-500' : 'text-gray-400'
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
              <p className="text-sm mt-1 text-red-500">{errors.password}</p>
            )}
          </div>

          {/* 비밀번호 확인 필드 */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isRegistering}
                className={`${inputClassName(!!errors.confirmPassword)} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 ${
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                }`}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm mt-1 text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={isRegistering}
            className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-[#6778ff] to-[#a855f7] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            이미 계정이 있으신가요?{' '}
            <Link
              to="/login"
              className="font-medium text-[#6778ff] hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
