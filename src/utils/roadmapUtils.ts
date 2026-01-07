/**
 * 로드맵 관련 유틸리티 함수
 */

/**
 * 로드맵 업데이트가 파괴적인지 검사
 *
 * Safe 업데이트: 메타데이터 변경, 프로그램 추가 (기존 순서 유지)
 * Destructive 업데이트: 프로그램 삭제, 순서 변경
 *
 * @param currentProgramIds - 현재 프로그램 ID 배열
 * @param newProgramIds - 새로운 프로그램 ID 배열
 * @returns 파괴적 업데이트 여부
 *
 * @example
 * // 프로그램 추가 (Safe)
 * isDestructiveUpdate([1, 2], [1, 2, 3]) // false
 *
 * @example
 * // 프로그램 삭제 (Destructive)
 * isDestructiveUpdate([1, 2, 3], [1, 2]) // true
 *
 * @example
 * // 순서 변경 (Destructive)
 * isDestructiveUpdate([1, 2, 3], [2, 1, 3]) // true
 */
export function isDestructiveUpdate(
  currentProgramIds: number[],
  newProgramIds: number[]
): boolean {
  // 1. 프로그램 삭제 검사: 기존 프로그램이 새 목록에 없는 경우
  const hasDeletedProgram = currentProgramIds.some((id) => !newProgramIds.includes(id));
  if (hasDeletedProgram) {
    return true;
  }

  // 2. 순서 변경 검사: 기존 프로그램의 상대적 순서가 변경된 경우
  // 기존 프로그램들이 새 목록에서도 같은 상대적 순서를 유지하는지 확인
  const existingInNew = newProgramIds.filter((id) => currentProgramIds.includes(id));
  const existingInCurrent = currentProgramIds.filter((id) => newProgramIds.includes(id));

  // 배열 순서 비교
  const hasOrderChanged = JSON.stringify(existingInNew) !== JSON.stringify(existingInCurrent);

  return hasOrderChanged;
}

/**
 * 로드맵이 파괴적 수정 제한 대상인지 확인
 *
 * @param status - 로드맵 상태
 * @param enrolledStudents - 수강생 수
 * @returns 파괴적 수정 제한 여부
 *
 * @example
 * isDestructiveUpdateRestricted('PUBLISHED', 5) // true
 * isDestructiveUpdateRestricted('DRAFT', 5) // false
 * isDestructiveUpdateRestricted('PUBLISHED', 0) // false
 */
export function isDestructiveUpdateRestricted(
  status: string,
  enrolledStudents: number
): boolean {
  // 백엔드에서 status를 소문자로 반환 (published, draft)
  const normalizedStatus = status.toUpperCase();
  return normalizedStatus === 'PUBLISHED' && enrolledStudents > 0;
}

/**
 * 프로그램 ID 배열에서 변경 사항 분석
 *
 * @param currentIds - 현재 프로그램 ID 배열
 * @param newIds - 새로운 프로그램 ID 배열
 * @returns 변경 사항 분석 결과
 */
export interface ProgramChanges {
  added: number[];
  removed: number[];
  reordered: boolean;
}

export function analyzeProgramChanges(
  currentIds: number[],
  newIds: number[]
): ProgramChanges {
  // 추가된 프로그램
  const added = newIds.filter((id) => !currentIds.includes(id));

  // 삭제된 프로그램
  const removed = currentIds.filter((id) => !newIds.includes(id));

  // 순서 변경 여부
  const existingInNew = newIds.filter((id) => currentIds.includes(id));
  const existingInCurrent = currentIds.filter((id) => newIds.includes(id));
  const reordered = JSON.stringify(existingInNew) !== JSON.stringify(existingInCurrent);

  return {
    added,
    removed,
    reordered,
  };
}
