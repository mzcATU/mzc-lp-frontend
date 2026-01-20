/**
 * 도메인 설정 관련 타입 정의
 */

export interface DnsInstructions {
  recordType: string;
  recordName: string;
  recordValue: string;
}

export interface TenantDomainSettings {
  subdomain: string;
  fullSubdomainUrl: string;
  customDomain: string | null;
  customDomainEnabled: boolean;
  dnsInstructions: DnsInstructions | null;
}

export interface UpdateCustomDomainRequest {
  customDomain: string;
}
