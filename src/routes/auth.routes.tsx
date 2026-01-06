import { Route } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { AdminLoginPage, AdminRegisterPage } from '@/pages/admin';

export const authRoutes = (
  <>
    {/* 일반 사용자 인증 */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* 어드민 인증 */}
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route path="/admin/register" element={<AdminRegisterPage />} />
  </>
);
