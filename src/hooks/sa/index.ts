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
  dashboardKeys,
  useSaDashboard,
} from './useDashboardQueries';

export {
  saAnalyticsKeys,
  useSaActivityLogs,
  useSaActivityStats,
  useSaRecentActivities,
} from './useAnalyticsQueries';

export {
  systemSettingsKeys,
  useSystemSettings,
  useTenantDefaults,
  useUpdateSystemSettings,
  useUpdateTenantDefaults,
} from './useSystemSettingsQueries';
