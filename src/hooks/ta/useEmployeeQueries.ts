/**
 * 임직원 관리 React Query 훅
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/ta/employeeService';
import type {
  EmployeeSearchParams,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  ChangeEmployeeStatusRequest,
  CreateLmsAccountRequest,
} from '@/types/ta/employee.types';

// Query Keys
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (params?: { page?: number; size?: number }) => [...employeeKeys.lists(), params] as const,
  search: (params: EmployeeSearchParams) => [...employeeKeys.all, 'search', params] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
  byDepartment: (departmentId: number) => [...employeeKeys.all, 'department', departmentId] as const,
  byNumber: (employeeNumber: string) => [...employeeKeys.all, 'number', employeeNumber] as const,
  lmsAccount: (employeeId: number) => [...employeeKeys.all, 'lms-account', employeeId] as const,
  hasLmsAccount: (employeeId: number) => [...employeeKeys.all, 'has-lms-account', employeeId] as const,
};

// ============================================
// Queries
// ============================================

/** 임직원 목록 조회 */
export function useEmployees(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeeService.getAll(params),
  });
}

/** 임직원 검색 */
export function useEmployeeSearch(params: EmployeeSearchParams, enabled = true) {
  return useQuery({
    queryKey: employeeKeys.search(params),
    queryFn: () => employeeService.search(params),
    enabled,
  });
}

/** 부서별 임직원 조회 */
export function useEmployeesByDepartment(departmentId: number, enabled = true) {
  return useQuery({
    queryKey: employeeKeys.byDepartment(departmentId),
    queryFn: () => employeeService.getByDepartment(departmentId),
    enabled: enabled && departmentId > 0,
  });
}

/** 사번으로 임직원 조회 */
export function useEmployeeByNumber(employeeNumber: string, enabled = true) {
  return useQuery({
    queryKey: employeeKeys.byNumber(employeeNumber),
    queryFn: () => employeeService.getByEmployeeNumber(employeeNumber),
    enabled: enabled && !!employeeNumber,
  });
}

/** 임직원 상세 조회 */
export function useEmployee(id: number, enabled = true) {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeeService.getById(id),
    enabled: enabled && id > 0,
  });
}

/** LMS 계정 조회 */
export function useEmployeeLmsAccount(employeeId: number, enabled = true) {
  return useQuery({
    queryKey: employeeKeys.lmsAccount(employeeId),
    queryFn: () => employeeService.getLmsAccount(employeeId),
    enabled: enabled && employeeId > 0,
  });
}

/** LMS 계정 존재 여부 */
export function useHasLmsAccount(employeeId: number, enabled = true) {
  return useQuery({
    queryKey: employeeKeys.hasLmsAccount(employeeId),
    queryFn: () => employeeService.hasLmsAccount(employeeId),
    enabled: enabled && employeeId > 0,
  });
}

// ============================================
// Mutations
// ============================================

/** 임직원 생성 */
export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateEmployeeRequest) => employeeService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}

/** 임직원 수정 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateEmployeeRequest }) =>
      employeeService.update(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
    },
  });
}

/** 임직원 상태 변경 */
export function useChangeEmployeeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: ChangeEmployeeStatusRequest }) =>
      employeeService.changeStatus(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) });
    },
  });
}

/** 임직원 삭제 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => employeeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
}

/** LMS 계정 생성 */
export function useCreateLmsAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, request }: { employeeId: number; request: CreateLmsAccountRequest }) =>
      employeeService.createLmsAccount(employeeId, request),
    onSuccess: (_, { employeeId }) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lmsAccount(employeeId) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.hasLmsAccount(employeeId) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeId) });
    },
  });
}
