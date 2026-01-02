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
  useCancelEnrollment,
} from './useEnrollmentQueries';

// Learning Player Hooks
export {
  learningPlayerKeys,
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
  useCourseWishlistCount,
  useAddToWishlist,
  useRemoveFromWishlist,
  useToggleWishlist,
} from './useWishlistQueries';

// Notification Hooks
export {
  notificationKeys,
  useNotifications,
  useUnreadNotificationCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotifications,
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
