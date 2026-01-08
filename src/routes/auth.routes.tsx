import { Route } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { AdminLoginPage, AdminRegisterPage } from '@/pages/admin';
import { ProfileSetupPage } from '@/pages/common';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

export const authRoutes = (
  <>
    {/* 일반 사용자 인증 */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* 어드민 인증 */}
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route path="/admin/register" element={<AdminRegisterPage />} />

    {/* 프로필 설정 (단체 계정 생성 후 필수 정보 입력) */}
    <Route
      path="/profile-setup"
      element={
        <ProtectedRoute>
          <ProfileSetupPage />
        </ProtectedRoute>
      }
    />
  </>
);
