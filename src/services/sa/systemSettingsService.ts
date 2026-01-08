/**
 * SA 시스템 설정 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';

// ============================================
// 타입 정의
// ============================================

export interface GeneralSettings {
  platformName: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
}

export interface SecuritySettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordExpiry: number;
  mfaRequired: boolean;
  ipWhitelist: string | null;
  loginLockoutMinutes: number;
}

export interface StorageSettings {
  maxUploadSize: number;
  allowedFormats: string;
  autoCleanup: boolean;
  cleanupDays: number;
  totalStorageLimitGB: number;
}

export interface EmailSettings {
  smtpHost: string | null;
  smtpPort: number;
  smtpUser: string | null;
  useTls: boolean;
  senderEmail: string | null;
  senderName: string | null;
}

export interface SystemSettingsResponse {
  id: number;
  general: GeneralSettings;
  security: SecuritySettings;
  storage: StorageSettings;
  email: EmailSettings;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSystemSettingsRequest {
  // 일반 설정
  platformName?: string;
  timezone?: string;
  language?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string | null;
  // 보안 설정
  sessionTimeout?: number;
  maxLoginAttempts?: number;
  passwordExpiry?: number;
  mfaRequired?: boolean;
  ipWhitelist?: string | null;
  loginLockoutMinutes?: number;
  // 스토리지 설정
  maxUploadSize?: number;
  allowedFormats?: string;
  autoCleanup?: boolean;
  cleanupDays?: number;
  totalStorageLimitGB?: number;
  // 이메일 설정
  smtpHost?: string | null;
  smtpPort?: number;
  smtpUser?: string | null;
  smtpPassword?: string | null;
  useTls?: boolean;
  senderEmail?: string | null;
  senderName?: string | null;
}

// ============================================
// 테넌트 기본값 타입
// ============================================

export interface LimitsDefaults {
  maxUsers: number;
  maxCourses: number;
  maxStorage: number;
  maxAdmins: number;
}

export interface FeaturesDefaults {
  customDomain: boolean;
  ssoIntegration: boolean;
  apiAccess: boolean;
  whiteLabeling: boolean;
  advancedAnalytics: boolean;
}

export interface BrandingDefaults {
  allowCustomLogo: boolean;
  allowCustomColors: boolean;
  allowCustomFonts: boolean;
}

export interface NotificationsDefaults {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

export interface TenantDefaultsResponse {
  id: number;
  limits: LimitsDefaults;
  features: FeaturesDefaults;
  branding: BrandingDefaults;
  notifications: NotificationsDefaults;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTenantDefaultsRequest {
  // 리소스 제한
  maxUsers?: number;
  maxCourses?: number;
  maxStorage?: number;
  maxAdmins?: number;
  // 기능 활성화
  customDomain?: boolean;
  ssoIntegration?: boolean;
  apiAccess?: boolean;
  whiteLabeling?: boolean;
  advancedAnalytics?: boolean;
  // 브랜딩 권한
  allowCustomLogo?: boolean;
  allowCustomColors?: boolean;
  allowCustomFonts?: boolean;
  // 알림 설정
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
}

// ============================================
// API 서비스
// ============================================

export const systemSettingsService = {
  // ============================================
  // 시스템 설정
  // ============================================

  /** 시스템 설정 조회 */
  async getSystemSettings(): Promise<SystemSettingsResponse> {
    const { data } = await axiosInstance.get<SystemSettingsResponse>(
      API_ENDPOINTS.SYSTEM_SETTINGS.BASE
    );
    return data;
  },

  /** 시스템 설정 업데이트 */
  async updateSystemSettings(request: UpdateSystemSettingsRequest): Promise<SystemSettingsResponse> {
    const { data } = await axiosInstance.put<SystemSettingsResponse>(
      API_ENDPOINTS.SYSTEM_SETTINGS.BASE,
      request
    );
    return data;
  },

  // ============================================
  // 테넌트 기본값
  // ============================================

  /** 테넌트 기본값 조회 */
  async getTenantDefaults(): Promise<TenantDefaultsResponse> {
    const { data } = await axiosInstance.get<TenantDefaultsResponse>(
      API_ENDPOINTS.SYSTEM_SETTINGS.TENANT_DEFAULTS
    );
    return data;
  },

  /** 테넌트 기본값 업데이트 */
  async updateTenantDefaults(request: UpdateTenantDefaultsRequest): Promise<TenantDefaultsResponse> {
    const { data } = await axiosInstance.put<TenantDefaultsResponse>(
      API_ENDPOINTS.SYSTEM_SETTINGS.TENANT_DEFAULTS,
      request
    );
    return data;
  },
};
