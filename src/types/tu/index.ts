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
} from './instructorAssignment.types';

export {
  INSTRUCTOR_ROLE_LABELS,
  ASSIGNMENT_STATUS_LABELS,
} from './instructorAssignment.types';
