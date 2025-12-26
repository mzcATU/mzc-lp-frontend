import { Route } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@/pages/auth';

export const authRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
  </>
);
