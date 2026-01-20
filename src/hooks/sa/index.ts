export {
  tenantKeys,
  useTenants,
  useTenant,
  useTenantStats,
  useTenantUserStats,
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
  useDeleteCustomDomain,
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
  // 배포 통계
  useDistributionStats,
  useDistributionSummary,
  useDistributionStatsForNotice,
} from './useNoticeQueries';

export {
  saAnalyticsKeys,
  useSaActivityLogs,
  useSaActivityStats,
  useSaRecentActivities,
} from './useAnalyticsQueries';

export { saDashboardKeys, useSaDashboard } from './useDashboardQueries';

export {
  systemSettingsKeys,
  useSystemSettings,
  useTenantDefaults,
  useUpdateSystemSettings,
  useUpdateTenantDefaults,
} from './useSystemSettingsQueries';

export {
  systemAdminKeys,
  useSystemAdmins,
  useCreateSystemAdmin,
} from './useSystemAdminQueries';
