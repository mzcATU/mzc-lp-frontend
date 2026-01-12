/**
 * CO용 공지사항 조회 React Query Hooks (TA가 OPERATOR 대상으로 보낸 공지)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type { TenantNotice } from '@/types/ta/tenantNotice.types';
import type { PageResponse } from '@/types/common';

export interface ReceivedNoticeListParams {
  page?: number;
  size?: number;
}

// Query Keys
export const operatorNoticeKeys = {
  all: ['operator-notices'] as const,
  received: () => [...operatorNoticeKeys.all, 'received'] as const,
  receivedList: (params?: ReceivedNoticeListParams) => [...operatorNoticeKeys.received(), params] as const,
  receivedDetail: (id: number) => [...operatorNoticeKeys.received(), 'detail', id] as const,
};

/**
 * TO가 받은 공지 목록 조회 (TA가 OPERATOR 대상으로 발송한 공지)
 */
export const useReceivedNotices = (params?: ReceivedNoticeListParams) => {
  return useQuery({
    queryKey: operatorNoticeKeys.receivedList(params),
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageResponse<TenantNotice>>(
        API_ENDPOINTS.TENANT_NOTICES.TU_BASE,
        {
          params: {
            ...params,
            targetAudience: 'OPERATOR',
          },
        }
      );
      return data;
    },
  });
};

/**
 * TO가 받은 공지 상세 조회
 */
export const useReceivedNotice = (id: number) => {
  return useQuery({
    queryKey: operatorNoticeKeys.receivedDetail(id),
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
 * 공지 읽음 처리 (조회수 증가)
 */
export const useMarkNoticeAsViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noticeId: number) => {
      // 상세 조회 시 자동으로 조회수 증가
      const { data } = await axiosInstance.get<TenantNotice>(
        API_ENDPOINTS.TENANT_NOTICES.TU_BY_ID(noticeId)
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: operatorNoticeKeys.received() });
    },
  });
};
