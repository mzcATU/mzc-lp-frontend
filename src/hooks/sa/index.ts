export {
  tenantKeys,
  useTenants,
  useTenant,
  useTenantStats,
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from './useTenantQueries';

export {
  noticeKeys,
  useNotices,
  useNotice,
  useDistributedTenants,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
  usePublishNotice,
  useArchiveNotice,
  useDistributeNotice,
  useDistributeAllNotice,
} from './useNoticeQueries';

export {
  saAnalyticsKeys,
  useSaActivityLogs,
  useSaActivityStats,
  useSaRecentActivities,
} from './useAnalyticsQueries';

export { saDashboardKeys, useSaDashboard } from './useDashboardQueries';
