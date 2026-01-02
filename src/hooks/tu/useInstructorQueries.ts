/**
 * 강사(Instructor) React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorService } from '@/services/tu/instructorService';
import type {
  PopularInstructorsResponse,
  InstructorProfileResponse,
  InstructorCoursesResponse,
  InstructorRoadmapsResponse,
  InstructorPostsResponse,
  InstructorReviewsResponse,
  FollowStatusResponse,
} from '@/types/tu/instructor.types';

// Query Keys
export const instructorKeys = {
  all: ['instructors'] as const,
  popular: (limit: number) => [...instructorKeys.all, 'popular', limit] as const,
  profile: (id: number) => [...instructorKeys.all, 'profile', id] as const,
  courses: (id: number, page: number) => [...instructorKeys.all, 'courses', id, page] as const,
  roadmaps: (id: number) => [...instructorKeys.all, 'roadmaps', id] as const,
  posts: (id: number, page: number) => [...instructorKeys.all, 'posts', id, page] as const,
  reviews: (id: number, page: number) => [...instructorKeys.all, 'reviews', id, page] as const,
  followStatus: (id: number) => [...instructorKeys.all, 'followStatus', id] as const,
};

/**
 * 인기 강사 목록 조회
 */
export function usePopularInstructors(limit: number = 4, enabled: boolean = true) {
  return useQuery<PopularInstructorsResponse>({
    queryKey: instructorKeys.popular(limit),
    queryFn: () => instructorService.getPopularInstructors(limit),
    enabled,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

/**
 * 강사 프로필 조회
 */
export function useInstructorProfile(instructorId: number, enabled: boolean = true) {
  return useQuery<InstructorProfileResponse>({
    queryKey: instructorKeys.profile(instructorId),
    queryFn: () => instructorService.getInstructorProfile(instructorId),
    enabled: enabled && instructorId > 0,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 강사 강의 목록 조회
 */
export function useInstructorCourses(
  instructorId: number,
  page: number = 1,
  enabled: boolean = true
) {
  return useQuery<InstructorCoursesResponse>({
    queryKey: instructorKeys.courses(instructorId, page),
    queryFn: () => instructorService.getInstructorCourses(instructorId, page),
    enabled: enabled && instructorId > 0,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 강사 로드맵 목록 조회
 */
export function useInstructorRoadmaps(instructorId: number, enabled: boolean = true) {
  return useQuery<InstructorRoadmapsResponse>({
    queryKey: instructorKeys.roadmaps(instructorId),
    queryFn: () => instructorService.getInstructorRoadmaps(instructorId),
    enabled: enabled && instructorId > 0,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 강사 게시글 목록 조회
 */
export function useInstructorPosts(
  instructorId: number,
  page: number = 1,
  enabled: boolean = true
) {
  return useQuery<InstructorPostsResponse>({
    queryKey: instructorKeys.posts(instructorId, page),
    queryFn: () => instructorService.getInstructorPosts(instructorId, page),
    enabled: enabled && instructorId > 0,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 강사 리뷰 목록 조회
 */
export function useInstructorReviews(
  instructorId: number,
  page: number = 1,
  enabled: boolean = true
) {
  return useQuery<InstructorReviewsResponse>({
    queryKey: instructorKeys.reviews(instructorId, page),
    queryFn: () => instructorService.getInstructorReviews(instructorId, page),
    enabled: enabled && instructorId > 0,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 팔로우 상태 조회
 */
export function useFollowStatus(instructorId: number, enabled: boolean = true) {
  return useQuery<FollowStatusResponse>({
    queryKey: instructorKeys.followStatus(instructorId),
    queryFn: () => instructorService.getFollowStatus(instructorId),
    enabled: enabled && instructorId > 0,
  });
}

/**
 * 강사 팔로우
 */
export function useFollowInstructor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (instructorId: number) => instructorService.followInstructor(instructorId),
    onSuccess: (_, instructorId) => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.followStatus(instructorId) });
      queryClient.invalidateQueries({ queryKey: instructorKeys.profile(instructorId) });
    },
  });
}

/**
 * 강사 언팔로우
 */
export function useUnfollowInstructor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (instructorId: number) => instructorService.unfollowInstructor(instructorId),
    onSuccess: (_, instructorId) => {
      queryClient.invalidateQueries({ queryKey: instructorKeys.followStatus(instructorId) });
      queryClient.invalidateQueries({ queryKey: instructorKeys.profile(instructorId) });
    },
  });
}
