// Content (CMS) Hooks
export {
  contentKeys,
  useContents,
  useMyContents,
  useContent,
  useContentVersions,
  useContentVersion,
  useUploadContent,
  useCreateExternalLink,
  useUpdateContent,
  useReplaceFile,
  useDeleteContent,
  useArchiveContent,
  useRestoreContent,
  useRestoreVersion,
  useContentPreview,
  useBulkUploadContent,
} from './useContentQueries';

// Learning Object (LO) Hooks
export {
  learningObjectKeys,
  useLearningObjects,
  useLearningObject,
  useLearningObjectByContentId,
  useCreateLearningObject,
  useUpdateLearningObject,
  useMoveLearningObjectFolder,
  useDeleteLearningObject,
} from './useLearningObjectQueries';

// Content Folder Hooks
export {
  contentFolderKeys,
  useContentFolderTree,
  useContentFolder,
  useContentFolderChildren,
  useCreateContentFolder,
  useUpdateContentFolder,
  useMoveContentFolder,
  useDeleteContentFolder,
} from './useContentFolderQueries';

// Catalog Hooks
export {
  catalogKeys,
  useCatalogPrograms,
  useCatalogProgram,
  useCatalogCourseTimes,
  useCatalogCourseTime,
} from './useCatalogQueries';

// Enrollment Hooks
export {
  enrollmentKeys,
  useMyEnrollments,
  useEnrollment,
  useEnroll,
  useEnrollBulk,
  useCancelEnrollment,
} from './useEnrollmentQueries';

// Learning Player Hooks
export {
  learningPlayerKeys,
  useEnrollmentForPlayer,
  useEnrollmentWithCurriculum,
  useUpdateProgress,
  useMarkItemComplete,
} from './useLearningPlayerQueries';

// My Assignment Hooks
export {
  myAssignmentKeys,
  useMyAssignments,
  useMyInstructorStatistics,
  useCourseTimeEnrollments,
} from './useMyAssignmentQueries';

// Course Hooks
export {
  courseKeys,
  useCourses,
  useMyCourses,
  useCourse,
  useCourseItemsHierarchy,
  useUpdateCourse,
  useDeleteCourse,
} from './useCourseQueries';

// Course Detail Hooks
export {
  courseDetailKeys,
  useCourseDetail,
  useCourseDetailCourses,
  usePopularCourses,
  useRecommendedCourses,
  useRelatedCourses,
} from './useCourseDetailQueries';

// Roadmap Detail Hooks
export {
  roadmapDetailKeys,
  useRoadmapDetail,
  useRoadmaps,
  usePopularRoadmaps,
  useRecommendedRoadmaps,
  useRoadmapReviews,
  useRoadmapProgress,
  useCreateReview,
  useMarkReviewHelpful,
  useEnrollRoadmap,
} from './useRoadmapDetailQueries';

// Cart Hooks
export {
  cartKeys,
  useCart,
  useCartCount,
  useCheckCartStatus,
  useAddToCart,
  useRemoveFromCart,
  useRemoveFromCartBulk,
  useToggleCart,
} from './useCartQueries';

// Wishlist Hooks
export {
  wishlistKeys,
  useMyWishlist,
  useMyWishlistCount,
  useCheckWishlistStatus,
  useCheckWishlistStatusBulk,
  useAddToWishlist,
  useRemoveFromWishlist,
  useToggleWishlist,
} from './useWishlistQueries';

// Notification Hooks
export {
  notificationKeys,
  useNotifications,
  useNotification,
  useUnreadNotificationCount,
  useLatestUnreadNotification,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useDeleteReadNotifications,
} from './useNotificationQueries';

// Course Explore Hooks
export {
  courseExploreKeys,
  useCourseExplore,
  useCourseCategories,
  usePopularCoursesExplore,
  useNewCourses,
  useRecommendedCoursesExplore,
} from './useCourseExploreQueries';

// Roadmap Explore Hooks
export {
  roadmapExploreKeys,
  useRoadmapExplore,
  useRoadmapCategories,
  usePopularRoadmapsExplore,
  useNewRoadmaps,
  useRecommendedRoadmapsExplore,
} from './useRoadmapExploreQueries';

// Community Hooks
export {
  communityKeys,
  useCommunityPosts,
  useCommunityPost,
  useCommunityCategories,
  usePopularPosts,
  useMyPosts,
  useCommentedPosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useLikePost,
  useUnlikePost,
} from './useCommunityQueries';

// Instructor Hooks
export {
  instructorKeys,
  usePopularInstructors,
  useInstructorProfile,
  useInstructorCourses,
  useInstructorRoadmaps,
  useInstructorPosts,
  useInstructorReviews,
  useFollowStatus,
  useFollowInstructor,
  useUnfollowInstructor,
} from './useInstructorQueries';

// Program Application Hooks
export {
  programApplicationKeys,
  useApplyProgram,
  useApplyProgramsBulk,
  toCourseForApplication,
  type CourseForApplication,
  type ApplicationResult,
} from './useProgramApplicationQueries';

// My Program Hooks - DEPRECATED Phase 3: Program 엔티티 제거됨 (TU 내 프로그램 관리)
// export {
//   myProgramKeys,
//   useMyPrograms,
//   useMyProgram,
//   useMyProgramSnapshot,
//   useSnapshotItems,
//   useUpdateMyProgram,
//   useDeleteMyProgram,
//   useSubmitMyProgram,
//   useUpdateSnapshot,
//   useAddSnapshotItem,
//   useUpdateSnapshotItem,
//   useMoveSnapshotItem,
//   useDeleteSnapshotItem,
//   type MyProgramFilterParams,
// } from './useMyProgramQueries';

// CourseTime Catalog Hooks (학습자용 차수 카탈로그)
export {
  courseTimeCatalogKeys,
  useCourseTimeCatalog,
  useCourseTimeDetail,
} from './useCourseTimeCatalogQueries';

// Public Branding Hooks
export {
  publicBrandingKeys,
  usePublicBranding,
} from './usePublicBranding';

// Roadmap Hooks (TU Teaching)
export {
  roadmapKeys,
  useMyRoadmaps,
  useRoadmapStatistics,
  useRoadmap,
  useCreateRoadmap,
  useUpdateRoadmap,
  useSaveDraft,
  useDeleteRoadmap,
  useDuplicateRoadmap,
} from './useRoadmapQueries';

export { useBrandingApply } from './useBrandingApply';

// Learning Stats Hooks (내 학습 통계)
export {
  learningStatsKeys,
  useMyLearningStats,
} from './useLearningStatsQueries';

// Owner Stats Hooks (강사 통계)
export {
  ownerStatsKeys,
  useMyOwnerStats,
} from './useOwnerStatsQueries';

// Certificate Hooks (수료증)
export {
  certificateKeys,
  useMyCertificates,
  useCertificate,
  useCertificateByEnrollment,
  useVerifyCertificate,
  useDownloadCertificate,
  useIssueCertificate,
  useReissueCertificate,
} from './useCertificateQueries';

// Public Banner Hooks (공개 배너)
export {
  publicBannerKeys,
  useDisplayableBanners,
} from './usePublicBannerQueries';

// Public Layout Hooks (공개 레이아웃)
export {
  usePublicLayout,
  usePublicNavigation,
} from './usePublicLayout';

// Course Review Hooks (코스 리뷰)
export {
  courseReviewKeys,
  useCourseReviews,
  useCourseReviewStats,
  useMyCourseReview,
  useCreateCourseReview,
  useUpdateCourseReview,
  useDeleteCourseReview,
} from './useCourseReviewQueries';

// User Notice Hooks (TU 공지)
export {
  userNoticeKeys,
  useUserNotices,
  useUserNotice,
  useUnreadNoticeCount,
  useLatestUserNotice,
} from './useUserNoticeQueries';

// Course Community Hooks (코스 커뮤니티)
export {
  courseCommunityKeys,
  useCourseCommunityPosts,
  useCourseCommunityPost,
  useCreateCourseCommunityPost,
  useUpdateCourseCommunityPost,
  useDeleteCourseCommunityPost,
  useLikeCourseCommunityPost,
  useUnlikeCourseCommunityPost,
  useCourseCommunityComments,
  useCreateCourseCommunityComment,
  useUpdateCourseCommunityComment,
  useDeleteCourseCommunityComment,
  useLikeCourseCommunityComment,
  useUnlikeCourseCommunityComment,
} from './useCourseCommunityQueries';

// Question Section Hook (질문 섹션 공통 로직)
export { useQuestionSection } from './useQuestionSection';
export type { TabType, SortType } from './useQuestionSection';
