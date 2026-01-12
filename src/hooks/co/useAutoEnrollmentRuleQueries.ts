/**
 * TO(Tenant Operator) 자동 입과 규칙 React Query Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { autoEnrollmentRuleService } from '@/services/co/autoEnrollmentRuleService';
import type {
  AutoEnrollmentTrigger,
  CreateAutoEnrollmentRuleRequest,
  UpdateAutoEnrollmentRuleRequest,
} from '@/types/co/autoEnrollmentRule.types';

// ============================================
// Query Keys
// ============================================

export const autoEnrollmentRuleKeys = {
  all: ['autoEnrollmentRules'] as const,
  lists: () => [...autoEnrollmentRuleKeys.all, 'list'] as const,
  list: () => [...autoEnrollmentRuleKeys.lists()] as const,
  active: () => [...autoEnrollmentRuleKeys.all, 'active'] as const,
  byTrigger: (trigger: AutoEnrollmentTrigger) =>
    [...autoEnrollmentRuleKeys.all, 'trigger', trigger] as const,
  details: () => [...autoEnrollmentRuleKeys.all, 'detail'] as const,
  detail: (id: number) => [...autoEnrollmentRuleKeys.details(), id] as const,
};

// ============================================
// Query Hooks
// ============================================

/**
 * 자동 입과 규칙 목록 조회
 */
export const useAutoEnrollmentRules = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: autoEnrollmentRuleKeys.list(),
    queryFn: () => autoEnrollmentRuleService.getAll(),
    enabled: isAuthenticated,
  });
};

/**
 * 활성 자동 입과 규칙 조회
 */
export const useActiveAutoEnrollmentRules = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: autoEnrollmentRuleKeys.active(),
    queryFn: () => autoEnrollmentRuleService.getActive(),
    enabled: isAuthenticated,
  });
};

/**
 * 트리거별 자동 입과 규칙 조회
 */
export const useAutoEnrollmentRulesByTrigger = (trigger: AutoEnrollmentTrigger) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: autoEnrollmentRuleKeys.byTrigger(trigger),
    queryFn: () => autoEnrollmentRuleService.getByTrigger(trigger),
    enabled: isAuthenticated && !!trigger,
  });
};

/**
 * 자동 입과 규칙 상세 조회
 */
export const useAutoEnrollmentRule = (id: number) => {
  return useQuery({
    queryKey: autoEnrollmentRuleKeys.detail(id),
    queryFn: () => autoEnrollmentRuleService.getById(id),
    enabled: !!id,
  });
};

// ============================================
// Mutation Hooks
// ============================================

/**
 * 자동 입과 규칙 생성
 */
export const useCreateAutoEnrollmentRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateAutoEnrollmentRuleRequest) =>
      autoEnrollmentRuleService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.active() });
    },
  });
};

/**
 * 자동 입과 규칙 수정
 */
export const useUpdateAutoEnrollmentRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...request }: { id: number } & UpdateAutoEnrollmentRuleRequest) =>
      autoEnrollmentRuleService.update(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.active() });
    },
  });
};

/**
 * 자동 입과 규칙 삭제
 */
export const useDeleteAutoEnrollmentRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => autoEnrollmentRuleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.active() });
    },
  });
};

/**
 * 자동 입과 규칙 활성화
 */
export const useActivateAutoEnrollmentRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => autoEnrollmentRuleService.activate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.active() });
    },
  });
};

/**
 * 자동 입과 규칙 비활성화
 */
export const useDeactivateAutoEnrollmentRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => autoEnrollmentRuleService.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: autoEnrollmentRuleKeys.active() });
    },
  });
};
