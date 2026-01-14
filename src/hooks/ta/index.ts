export {
  userKeys,
  useUsers,
  useUser,
  useUserRoles,
  useUserStats,
  useUpdateUser,
  useUpdateUserRole,
  useUpdateUserRoles,
  useAddUserRole,
  useRemoveUserRole,
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

export {
  bannerKeys,
  useBanners,
  useBanner,
  usePublicBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  useActivateBanner,
  useDeactivateBanner,
} from './useBannerQueries';

export {
  tenantFeaturesKeys,
  useTenantFeatures,
  usePublicTenantFeatures,
  useUpdateTenantFeatures,
} from './useTenantFeaturesQueries';

export {
  tenantCategoryKeys,
  useTenantCategories,
  usePublicTenantCategories,
  useCreateTenantCategory,
  useUpdateTenantCategory,
  useDeleteTenantCategory,
  useReorderTenantCategories,
} from './useTenantCategoryQueries';

export {
  employeeKeys,
  useEmployees,
  useEmployeeSearch,
  useEmployeesByDepartment,
  useEmployeeByNumber,
  useEmployee,
  useEmployeeLmsAccount,
  useHasLmsAccount,
  useCreateEmployee,
  useUpdateEmployee,
  useChangeEmployeeStatus,
  useDeleteEmployee,
  useCreateLmsAccount,
} from './useEmployeeQueries';

export {
  departmentKeys,
  useDepartments,
  useDepartmentTree,
  useActiveDepartments,
  useDepartmentSearch,
  useDepartment,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from './useDepartmentQueries';

export {
  autoEnrollmentRuleKeys,
  useAutoEnrollmentRules,
  useActiveAutoEnrollmentRules,
  useAutoEnrollmentRulesByTrigger,
  useAutoEnrollmentRule,
  useCreateAutoEnrollmentRule,
  useUpdateAutoEnrollmentRule,
  useDeleteAutoEnrollmentRule,
  useActivateAutoEnrollmentRule,
  useDeactivateAutoEnrollmentRule,
} from './useAutoEnrollmentRuleQueries';

export {
  tenantNoticeKeys,
  useTenantNotices,
  useSearchTenantNotices,
  useTenantNotice,
  useCreateTenantNotice,
  useUpdateTenantNotice,
  useDeleteTenantNotice,
  usePublishTenantNotice,
  useArchiveTenantNotice,
  useVisibleTenantNotices,
  useVisibleTenantNotice,
  useVisibleTenantNoticeCount,
} from './useTenantNoticeQueries';

export {
  memberPoolKeys,
  useMemberPools,
  useMemberPool,
  useMemberPoolMembers,
} from './useMemberPoolQueries';

export {
  systemNoticeKeys,
  useSystemNotices,
  useSystemNotice,
  useMarkSystemNoticeAsRead,
} from './useSystemNoticeQueries';
