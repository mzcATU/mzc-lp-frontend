export {
  userKeys,
  useUsers,
  useUser,
  useUserStats,
  useUpdateUser,
  useUpdateUserRole,
  useUpdateUserStatus,
  useDeleteUser,
  useBulkCreateUsers,
} from './useUserQueries';

export {
  groupKeys,
  useGroups,
  useActiveGroups,
  useGroup,
  useCreateGroup,
  useUpdateGroup,
  useDeleteGroup,
  useAddGroupMember,
  useRemoveGroupMember,
} from './useGroupQueries';

export {
  tenantSettingsKeys,
  useTenantSettings,
  useUpdateTenantSettings,
  useUpdateBranding,
  useUpdateUserManagement,
  // Design & Layout
  useUpdateDesignSettings,
  useUpdateLayoutSettings,
  // Navigation
  useNavigationItems,
  useCreateNavigationItem,
  useUpdateNavigationItem,
  useDeleteNavigationItem,
  useReorderNavigationItems,
  useResetNavigationItems,
} from './useTenantSettingsQueries';

export { taDashboardKeys, useTaKpiDashboard } from './useDashboardQueries';

export {
  analyticsKeys,
  useActivityLogs,
  useActivityStats,
  useRecentActivities,
} from './useAnalyticsQueries';
