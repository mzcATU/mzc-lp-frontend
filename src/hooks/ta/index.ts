export {
  userKeys,
  useUsers,
  useUser,
  useUserStats,
  useUpdateUser,
  useUpdateUserRole,
  useUpdateUserStatus,
  useDeleteUser,
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
