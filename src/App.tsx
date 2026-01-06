import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { Toaster } from '@/components/common/Sonner/Sonner';
import { TenantBrandingProvider } from '@/contexts/TenantBrandingContext';

function App() {
  return (
    <BrowserRouter>
      <TenantBrandingProvider>
        <AppRoutes />
        <Toaster />
      </TenantBrandingProvider>
    </BrowserRouter>
  );
}

export default App;
