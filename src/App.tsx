import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { Toaster } from '@/components/common/Sonner/Sonner';
import { TenantBrandingProvider } from '@/contexts/TenantBrandingContext';
import { TenantFeaturesProvider } from '@/contexts/TenantFeaturesContext';
import { useTokenExpirationCheck } from '@/hooks/common/auth';

// 토큰 만료 체크를 위한 내부 컴포넌트 (라우터 내부에서 훅 사용)
function AppContent() {
  useTokenExpirationCheck();

  return (
    <TenantBrandingProvider>
      <TenantFeaturesProvider>
        <AppRoutes />
        <Toaster />
      </TenantFeaturesProvider>
    </TenantBrandingProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
