import { createContext, useContext, ReactNode } from 'react';
import { usePublicBranding } from '@/hooks/tu/usePublicBranding';
import { extractTenantIdentifier } from '@/utils/tenantUtils';
import type { PublicBrandingResponse } from '@/types/tu/branding.types';

interface TenantBrandingContextValue {
  branding: PublicBrandingResponse | null | undefined;
  isLoading: boolean;
  error: Error | null;
}

const TenantBrandingContext = createContext<TenantBrandingContextValue | undefined>(undefined);

export function TenantBrandingProvider({ children }: { children: ReactNode }) {
  const tenantIdentifier = extractTenantIdentifier();

  const { data: branding, isLoading, error } = usePublicBranding(
    tenantIdentifier?.identifier,
    tenantIdentifier?.type
  );

  return (
    <TenantBrandingContext.Provider value={{ branding, isLoading, error }}>
      {children}
    </TenantBrandingContext.Provider>
  );
}

export function useTenantBranding() {
  const context = useContext(TenantBrandingContext);
  if (context === undefined) {
    throw new Error('useTenantBranding must be used within TenantBrandingProvider');
  }
  return context;
}
