import { Route } from 'react-router-dom';
import { LoginPage, RegisterPage, RoleSelectionPage } from '@/pages/auth';
import { AdminLoginPage, AdminRegisterPage } from '@/pages/admin';
import { ProfileSetupPage } from '@/pages/common';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export const authRoutes = (
  <>
    {/* 일반 사용자 인증 */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* 서브도메인 기반 인증 (테넌트별 회원가입/로그인) */}
    <Route path="/:subdomain/login" element={<LoginPage />} />
    <Route path="/:subdomain/register" element={<RegisterPage />} />

    {/* 어드민 인증 */}
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route path="/admin/register" element={<AdminRegisterPage />} />

    {/* 서브도메인 기반 어드민 인증 (테넌트별 어드민 로그인) */}
    <Route path="/:subdomain/admin/login" element={<AdminLoginPage />} />
    <Route path="/:subdomain/admin/register" element={<AdminRegisterPage />} />

    {/* 프로필 설정 (단체 계정 생성 후 필수 정보 입력) */}
    <Route
      path="/profile-setup"
      element={
        <ProtectedRoute>
          <ProfileSetupPage />
        </ProtectedRoute>
      }
    />

    {/* 프로필 설정 (서브도메인 포함) */}
    <Route
      path="/:subdomain/profile-setup"
      element={
        <ProtectedRoute>
          <ProfileSetupPage />
        </ProtectedRoute>
      }
    />

    {/* 역할 선택 페이지 (다중 역할 사용자용) */}
    <Route
      path="/select-role"
      element={
        <ProtectedRoute>
          <RoleSelectionPage />
        </ProtectedRoute>
      }
    />

    {/* 역할 선택 페이지 (서브도메인 포함) */}
    <Route
      path="/:subdomain/select-role"
      element={
        <ProtectedRoute>
          <RoleSelectionPage />
        </ProtectedRoute>
      }
    />
  </>
);
