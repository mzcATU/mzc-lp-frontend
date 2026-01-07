// Content (CMS)
export type {
  ContentType,
  ContentStatus,
  VersionChangeType,
  ContentResponse,
  ContentListResponse,
  ContentVersionResponse,
  CreateExternalLinkRequest,
  UpdateContentRequest,
  RestoreVersionRequest,
  ContentDownloadInfo,
  ContentFilterParams,
} from './content.types';

// Learning Object (LO)
export type {
  LearningObjectResponse,
  CreateLearningObjectRequest,
  UpdateLearningObjectRequest,
  MoveFolderRequest,
  LearningObjectFilterParams,
} from './learningObject.types';

// Content Folder
export type {
  ContentFolderResponse,
  ContentFolderTreeNode,
  CreateContentFolderRequest,
  UpdateContentFolderRequest,
  MoveContentFolderRequest,
} from './contentFolder.types';

// Instructor Assignment (IIS - 내 배정)
export type {
  InstructorRole,
  AssignmentStatus,
  InstructorAssignmentResponse,
  CourseTimeStatResponse,
  InstructorDetailStatResponse,
  StudentEnrollmentStatus,
  CourseTimeEnrollmentItem,
  EnrollmentStats,
  CourseTimeEnrollmentsResponse,
} from './instructorAssignment.types';

export {
  INSTRUCTOR_ROLE_LABELS,
  ASSIGNMENT_STATUS_LABELS,
  STUDENT_ENROLLMENT_STATUS_LABELS,
} from './instructorAssignment.types';

// Learning Player
export type {
  PlayerContentType,
  UpdateProgressRequest,
  MarkItemCompleteRequest,
  ProgressRecordResponse,
  EnrollmentWithCurriculumResponse,
  EnrollmentPlayerData,
  PlayerState,
  VideoPlayerProps,
  CurriculumSidebarProps,
} from './learningPlayer.types';

export {
  initialPlayerState,
  COMPLETION_THRESHOLD,
  AUTO_SAVE_INTERVAL,
} from './learningPlayer.types';

// Course Detail (강의 상세)
export type {
  CourseLecture,
  CurriculumSection,
  CourseInstructor,
  CourseTag,
  CourseCategory,
  CourseDetail,
  CourseDetailResponse,
  CourseFilterParams,
  CourseCard,
} from './courseDetail.types';

export {
  CATEGORY_LABELS,
  TAG_STYLES,
} from './courseDetail.types';

// Roadmap Detail (로드맵 상세)
export type {
  RoadmapCourse,
  RoadmapAuthor,
  RoadmapReview,
  RoadmapDetail,
  RoadmapDetailResponse,
  RoadmapFilterParams,
  RoadmapCard,
  RoadmapTab,
  CreateReviewRequest,
  ReviewPageResponse,
} from './roadmapDetail.types';

// Cart (장바구니)
export type {
  CartItemResponse,
  CartAddRequest,
  CartRemoveRequest,
  CartCountResponse,
  CartItem,
  CartSummary,
} from './cart.types';

// Wishlist (찜 목록)
export type {
  WishlistItemResponse,
  WishlistAddRequest,
  WishlistCheckRequest,
  WishlistCheckResponse,
  WishlistCountResponse,
} from './wishlist.types';

// Notification (알림)
export type {
  NotificationType,
  NotificationItem,
  NotificationListResponse,
  UnreadCountResponse,
  NotificationFilter,
} from './notification.types';

export { NOTIFICATION_TYPE_LABELS, NOTIFICATION_TYPE_COLORS } from './notification.types';

// Course Explore (강의 탐색)
export type {
  CourseExploreItem,
  CourseExploreResponse,
  ExploreCourseCategory,
  CourseCategoryResponse,
  CourseExploreFilter,
} from './courseExplore.types';

export {
  COURSE_LEVEL_LABELS,
  COURSE_SORT_OPTIONS,
} from './courseExplore.types';

// Roadmap Explore (로드맵 탐색)
export type {
  RoadmapExploreItem,
  RoadmapExploreResponse,
  RoadmapCategory,
  RoadmapCategoryResponse,
  RoadmapExploreFilter,
} from './roadmapExplore.types';

export {
  ROADMAP_LEVEL_LABELS,
  ROADMAP_SORT_OPTIONS,
} from './roadmapExplore.types';

// Community (커뮤니티)
export type {
  PostType,
  CommunityPost,
  CommunityPostListResponse,
  CommunityCategory,
  CommunityCategoryResponse,
  CommunityFilter,
  CreatePostRequest,
  UpdatePostRequest,
} from './community.types';

export {
  POST_TYPE_LABELS,
  COMMUNITY_SORT_OPTIONS,
} from './community.types';

// Instructor (강사)
export type {
  InstructorSummary,
  InstructorProfile,
  InstructorCourse,
  InstructorRoadmap,
  InstructorPost,
  InstructorReview,
  PopularInstructorsResponse,
  InstructorProfileResponse,
  InstructorCoursesResponse,
  InstructorRoadmapsResponse,
  InstructorPostsResponse,
  InstructorReviewsResponse,
  FollowStatusResponse,
} from './instructor.types';

// Curriculum (강의 커리큘럼 편집)
export type {
  CurriculumItemType,
  CurriculumFolderItem,
  CurriculumContentItem,
  CurriculumItem,
  CurriculumFormData,
} from './curriculum.types';

export {
  isCurriculumFolder,
  isCurriculumContent,
  createFolderItem,
  createContentItem,
  findItemInTree,
  findParentInTree,
  convertHierarchyToCurriculumItems,
} from './curriculum.types';

// CourseTime Catalog (학습자용 차수 카탈로그)
export type {
  CourseTimeStatus,
  DeliveryType,
  EnrollmentMethod,
  CatalogInstructorRole,
  ProgramLevel,
  ProgramType,
  ProgramSummaryResponse,
  InstructorSummaryResponse,
  CurriculumItemResponse,
  CourseTimeCatalogResponse,
  CourseTimePublicDetailResponse,
  CourseTimeCatalogParams,
} from './courseTimeCatalog.types';

export {
  COURSE_TIME_STATUS_LABELS,
  DELIVERY_TYPE_LABELS,
  ENROLLMENT_METHOD_LABELS,
  CATALOG_INSTRUCTOR_ROLE_LABELS,
  PROGRAM_LEVEL_LABELS,
  PROGRAM_TYPE_LABELS,
  COURSE_TIME_STATUS_COLORS,
} from './courseTimeCatalog.types';

// Learning Stats (내 학습 통계)
export type {
  LearningStatsByType,
  LearningStatsOverview,
  LearningStatsProgress,
  LearningStatsResponse,
} from './learningStats.types';

// Owner Stats (강사 통계)
export type {
  OwnerStatsOverview,
  OwnerEnrollmentStats,
  OwnerProgramStats,
  OwnerStatsResponse,
} from './ownerStats.types';

// Certificate (수료증)
export type {
  CertificateStatus,
  CertificateResponse,
  CertificateDetailResponse,
  CertificateVerifyResponse,
  CertificateReissueRequest,
  CertificateFilterParams,
  CertificatePageResponse,
} from './certificate.types';

export {
  CERTIFICATE_STATUS_LABELS,
  CERTIFICATE_STATUS_COLORS,
} from './certificate.types';
