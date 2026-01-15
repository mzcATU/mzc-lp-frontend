/**
 * TU용 공지사항 조회 React Query Hooks (TA/TO가 USER 대상으로 보낸 공지)
 */
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { TenantNotice } from '@/types/ta/tenantNotice.types';
import type { PageResponse } from '@/types/common';

export interface UserNoticeListParams {
  page?: number;
  size?: number;
}

// Query Keys
export const userNoticeKeys = {
  all: ['user-notices'] as const,
  lists: () => [...userNoticeKeys.all, 'list'] as const,
  list: (params?: UserNoticeListParams) => [...userNoticeKeys.lists(), params] as const,
  detail: (id: number) => [...userNoticeKeys.all, 'detail', id] as const,
  count: () => [...userNoticeKeys.all, 'count'] as const,
};

/**
 * TU가 받은 공지 목록 조회 (TA/TO가 USER 대상으로 발송한 공지)
 */
export const useUserNotices = (params?: UserNoticeListParams) => {
  return useQuery({
    queryKey: userNoticeKeys.list(params),
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageResponse<TenantNotice>>(
        API_ENDPOINTS.TENANT_NOTICES.TU_BASE,
        {
          params: {
            ...params,
            targetAudience: 'USER',
          },
        }
      );
      return data;
    },
  });
};

/**
 * TU가 받은 공지 상세 조회
 */
export const useUserNotice = (id: number) => {
  return useQuery({
    queryKey: userNoticeKeys.detail(id),
    queryFn: async () => {
      const { data } = await axiosInstance.get<TenantNotice>(
        API_ENDPOINTS.TENANT_NOTICES.TU_BY_ID(id)
      );
      return data;
    },
    enabled: !!id,
  });
};

/**
 * TU 읽지 않은 공지 수 조회
 */
export const useUnreadNoticeCount = () => {
  return useQuery({
    queryKey: userNoticeKeys.count(),
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ count: number }>(
        API_ENDPOINTS.TENANT_NOTICES.TU_COUNT
      );
      return data.count;
    },
  });
};

/**
 * 최신 공지사항 1개 조회 (배너용)
 */
export const useLatestUserNotice = (enabled = true) => {
  return useQuery({
    queryKey: [...userNoticeKeys.all, 'latest'] as const,
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageResponse<TenantNotice>>(
        API_ENDPOINTS.TENANT_NOTICES.TU_BASE,
        {
          params: {
            page: 0,
            size: 1,
            targetAudience: 'USER',
          },
        }
      );
      return data.content[0] || null;
    },
    enabled,
    staleTime: 1000 * 60, // 1분
    refetchInterval: 1000 * 60 * 5, // 5분마다 자동 갱신
  });
};
