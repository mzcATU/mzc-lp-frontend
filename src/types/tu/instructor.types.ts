/**
 * 강사(Instructor) 관련 타입 정의
 */

// 강사 요약 정보 (목록용)
export interface InstructorSummary {
  id: number;
  name: string;
  slug: string;
  profileImage: string;
  specialty: string;
  studentCount: number;
  courseCount: number;
  rating: number;
  description?: string;
}

// 강사 상세 정보
export interface InstructorProfile {
  id: number;
  name: string;
  slug: string;
  profileImage: string;
  coverImage?: string;
  title: string;
  specialty: string;
  bio: string;
  description: string;
  studentCount: number;
  courseCount: number;
  reviewCount: number;
  rating: number;
  totalStudents: number;
  experience: string[];
  certifications: string[];
  socialLinks: {
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    youtube?: string;
  };
  isFollowing?: boolean;
  followerCount: number;
  createdAt: string;
}

// 강사 강의 목록
export interface InstructorCourse {
  id: number;
  title: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  discount: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  image: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  isNew: boolean;
  isBestseller: boolean;
  tags: string[];
}

// 강사 로드맵 목록
export interface InstructorRoadmap {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  courseCount: number;
  totalDuration: string;
  level: string;
  category: string;
  enrolledCount: number;
}

// 강사 게시글
export interface InstructorPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  thumbnail?: string;
  category: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  tags: string[];
}

// 강사 리뷰
export interface InstructorReview {
  id: number;
  courseId: number;
  courseTitle: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  createdAt: string;
  helpful: number;
  isVerified: boolean;
}

// API 응답 타입
export interface PopularInstructorsResponse {
  instructors: InstructorSummary[];
  total: number;
}

export interface InstructorProfileResponse {
  instructor: InstructorProfile;
}

export interface InstructorCoursesResponse {
  courses: InstructorCourse[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InstructorRoadmapsResponse {
  roadmaps: InstructorRoadmap[];
  total: number;
}

export interface InstructorPostsResponse {
  posts: InstructorPost[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InstructorReviewsResponse {
  reviews: InstructorReview[];
  total: number;
  page: number;
  pageSize: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// 팔로우 관련
export interface FollowStatusResponse {
  isFollowing: boolean;
  followerCount: number;
}
