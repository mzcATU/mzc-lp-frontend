/**
 * Program Application React Query Hooks
 * TU가 Course를 Program으로 신청하는 기능
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { snapshotService } from '@/services/to/snapshotService';
import { programService } from '@/services/to/programService';
import type { CourseDetailResponse, CourseResponse } from '@/types/common/course.types';
import type { ProgramLevel, ProgramType } from '@/types/common/program.types';

// Query Keys
export const programApplicationKeys = {
  all: ['programApplication'] as const,
};

/** 신청에 필요한 Course 정보 */
export interface CourseForApplication {
  courseId: number;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  level: ProgramLevel | null;
  type: ProgramType | null;
  estimatedHours: number | null;
}

/** CourseResponse를 CourseForApplication으로 변환 */
export function toCourseForApplication(
  course: CourseResponse | CourseDetailResponse
): CourseForApplication {
  return {
    courseId: course.courseId,
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    level: course.level as ProgramLevel | null,
    type: course.type as ProgramType | null,
    estimatedHours: course.estimatedHours,
  };
}

/** 신청 결과 */
export interface ApplicationResult {
  courseId: number;
  courseTitle: string;
  programId: number;
  success: boolean;
  error?: string;
}

/**
 * 단일 Course를 Program으로 신청
 * 플로우: Snapshot 생성 → Program 생성 → Program 제출
 */
export const useApplyProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (course: CourseForApplication): Promise<ApplicationResult> => {
      try {
        // 1. Snapshot 생성
        const snapshot = await snapshotService.createFromCourse(course.courseId, {
          snapshotName: course.title,
          description: course.description ?? undefined,
        });

        // 2. Program 생성
        const program = await programService.createProgram({
          title: course.title,
          description: course.description ?? undefined,
          thumbnailUrl: course.thumbnailUrl ?? undefined,
          level: course.level ?? undefined,
          type: course.type ?? undefined,
          estimatedHours: course.estimatedHours ?? undefined,
          snapshotId: snapshot.snapshotId,
        });

        // 3. Program 제출 (PENDING 상태로)
        await programService.submitProgram(program.id);

        return {
          courseId: course.courseId,
          courseTitle: course.title,
          programId: program.id,
          success: true,
        };
      } catch (error) {
        return {
          courseId: course.courseId,
          courseTitle: course.title,
          programId: 0,
          success: false,
          error: error instanceof Error ? error.message : '신청 중 오류가 발생했습니다.',
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programApplicationKeys.all });
    },
  });
};

/**
 * 여러 Course를 한번에 Program으로 신청
 */
export const useApplyProgramsBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courses: CourseForApplication[]): Promise<ApplicationResult[]> => {
      const results: ApplicationResult[] = [];

      for (const course of courses) {
        try {
          // 1. Snapshot 생성
          const snapshot = await snapshotService.createFromCourse(course.courseId, {
            snapshotName: course.title,
            description: course.description ?? undefined,
          });

          // 2. Program 생성
          const program = await programService.createProgram({
            title: course.title,
            description: course.description ?? undefined,
            thumbnailUrl: course.thumbnailUrl ?? undefined,
            level: course.level ?? undefined,
            type: course.type ?? undefined,
            estimatedHours: course.estimatedHours ?? undefined,
            snapshotId: snapshot.snapshotId,
          });

          // 3. Program 제출
          await programService.submitProgram(program.id);

          results.push({
            courseId: course.courseId,
            courseTitle: course.title,
            programId: program.id,
            success: true,
          });
        } catch (error) {
          results.push({
            courseId: course.courseId,
            courseTitle: course.title,
            programId: 0,
            success: false,
            error: error instanceof Error ? error.message : '신청 중 오류가 발생했습니다.',
          });
        }
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programApplicationKeys.all });
    },
  });
};
