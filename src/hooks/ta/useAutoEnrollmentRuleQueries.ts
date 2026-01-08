/**
 * 자동 등록 규칙 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { autoEnrollmentRuleService } from '@/services/ta/autoEnrollmentRuleService';
import type {
  AutoEnrollmentTrigger,
  CreateAutoEnrollmentRuleRequest,
  UpdateAutoEnrollmentRuleRequest,
} from '@/types/ta/autoEnrollmentRule.types';

// Query Keys
export const autoEnrollmentRuleKeys = {
  all: ['auto-enrollment-rules'] as const,
  lists: () => [...autoEnrollmentRuleKeys.all, 'list'] as const,
  list: () => [...autoEnrollmentRuleKeys.lists()] as const,
  active: () => [...autoEnrollmentRuleKeys.all, 'active'] as const,
  byTrigger: (trigger: AutoEnrollmentTrigger) => [...autoEnrollmentRuleKeys.all, 'trigger', trigger] as const,
  details: () => [...autoEnrollmentRuleKeys.all, 'detail'] as const,
  detail: (id: number) => [...autoEnrollmentRuleKeys.details(), id] as const,
};

// ============================================
// Queries
// ============================================

/** 자동 등록 규칙 목록 조회 */
export function useAutoEnrollmentRules() {
  return useQuery({
    queryKey: autoEnrollmentRuleKeys.list(),
    queryFn: () => autoEnrollmentRuleService.getAll(),
  });
}

/** 활성 자동 등록 규칙 조회 */
export function useActiveAutoEnrollmentRules() {
  return useQuery({
    queryKey: autoEnrollmentRuleKeys.active(),
    queryFn: () => autoEnrollmentRuleService.getActive(),
  });
}

/** 트리거별 자동 등록 규칙 조회 */
export function useAutoEnrollmentRulesByTrigger(trigger: AutoEnrollmentTrigger, enabled = true) {
  return useQuery({
    queryKey: autoEnrollmentRuleKeys.byTrigger(trigger),
    queryFn: () => autoEnrollmentRuleService.getByTrigger(trigger),
    enabled,
  });
}

/** 자동 등록 규칙 상세 조회 */
export function useAutoEnrollmentRule(id: number, enabled = true) {
  return useQuery({
    queryKey: autoEnrollmentRuleKeys.detail(id),
    queryFn: () => autoEnrollmentRuleService.getById(id),
    enabled: enabled && id > 0,
  });
}

// ============================================
// Mutations
// ============================================

/** 자동 등록 규칙 생성 */
export function useCreateAutoEnrollmentRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAutoEnrollmentRuleRequest) =>
      autoEnrollmentRuleService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.all });
    },
  });
}

/** 자동 등록 규칙 수정 */
export function useUpdateAutoEnrollmentRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateAutoEnrollmentRuleRequest }) =>
      autoEnrollmentRuleService.update(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.all });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.detail(id) });
    },
  });
}

/** 자동 등록 규칙 삭제 */
export function useDeleteAutoEnrollmentRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => autoEnrollmentRuleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.all });
    },
  });
}

/** 자동 등록 규칙 활성화 */
export function useActivateAutoEnrollmentRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => autoEnrollmentRuleService.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.all });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.detail(id) });
    },
  });
}

/** 자동 등록 규칙 비활성화 */
export function useDeactivateAutoEnrollmentRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => autoEnrollmentRuleService.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.all });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.detail(id) });
    },
  });
}
