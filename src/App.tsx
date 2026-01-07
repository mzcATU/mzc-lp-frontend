import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { Toaster } from '@/components/common/Sonner/Sonner';
import { TenantBrandingProvider } from '@/contexts/TenantBrandingContext';
import { TenantFeaturesProvider } from '@/contexts/TenantFeaturesContext';

function App() {
  return (
    <BrowserRouter>
      <TenantBrandingProvider>
        <TenantFeaturesProvider>
          <AppRoutes />
          <Toaster />
        </TenantFeaturesProvider>
      </TenantBrandingProvider>
    </BrowserRouter>
  );
}

export default App;
