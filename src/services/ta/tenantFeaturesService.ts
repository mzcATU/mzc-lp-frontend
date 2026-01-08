/**
 * TA 테넌트 기능 On/Off 관리 API 서비스
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';

// ============================================
// 타입 정의
// ============================================

export interface TenantFeaturesResponse {
  communityEnabled: boolean;
  userCourseCreationEnabled: boolean;
  cartEnabled: boolean;
  wishlistEnabled: boolean;
  instructorTabEnabled: boolean;
}

export interface UpdateTenantFeaturesRequest {
  communityEnabled?: boolean;
  userCourseCreationEnabled?: boolean;
  cartEnabled?: boolean;
  wishlistEnabled?: boolean;
  instructorTabEnabled?: boolean;
}

// ============================================
// API 서비스
// ============================================

export const tenantFeaturesService = {
  /** 테넌트 기능 설정 조회 */
  async getFeatures(): Promise<TenantFeaturesResponse> {
    const { data } = await axiosInstance.get<TenantFeaturesResponse>(
      API_ENDPOINTS.TENANT_FEATURES.BASE
    );
    return data;
  },

  /** 테넌트 기능 설정 수정 */
  async updateFeatures(request: UpdateTenantFeaturesRequest): Promise<TenantFeaturesResponse> {
    const { data } = await axiosInstance.put<TenantFeaturesResponse>(
      API_ENDPOINTS.TENANT_FEATURES.BASE,
      request
    );
    return data;
  },

  /** 공개 기능 설정 조회 (인증 불필요) */
  async getPublicFeatures(): Promise<TenantFeaturesResponse> {
    const { data } = await axiosInstance.get<TenantFeaturesResponse>(
      API_ENDPOINTS.TENANT_FEATURES.PUBLIC
    );
    return data;
  },
};
