/**
 * Employee API 서비스 (TA - Tenant Admin)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  EmployeeResponse,
  EmployeeListResponse,
  EmployeeSearchParams,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  ChangeEmployeeStatusRequest,
  EmployeeLmsAccountResponse,
  CreateLmsAccountRequest,
  CreateLmsAccountResponse,
} from '@/types/ta/employee.types';

export const employeeService = {
  // ============================================
  // Employee CRUD
  // ============================================

  /** 임직원 목록 조회 */
  async getAll(params?: { page?: number; size?: number }): Promise<EmployeeListResponse> {
    const { data } = await axiosInstance.get<EmployeeListResponse>(
      API_ENDPOINTS.EMPLOYEES.BASE,
      { params }
    );
    return data;
  },

  /** 임직원 검색 */
  async search(params: EmployeeSearchParams): Promise<EmployeeListResponse> {
    const { data } = await axiosInstance.get<EmployeeListResponse>(
      API_ENDPOINTS.EMPLOYEES.SEARCH,
      { params }
    );
    return data;
  },

  /** 부서별 임직원 조회 */
  async getByDepartment(departmentId: number): Promise<EmployeeResponse[]> {
    const { data } = await axiosInstance.get<EmployeeResponse[]>(
      API_ENDPOINTS.EMPLOYEES.BY_DEPARTMENT(departmentId)
    );
    return data;
  },

  /** 사번으로 임직원 조회 */
  async getByEmployeeNumber(employeeNumber: string): Promise<EmployeeResponse> {
    const { data } = await axiosInstance.get<EmployeeResponse>(
      API_ENDPOINTS.EMPLOYEES.BY_NUMBER(employeeNumber)
    );
    return data;
  },

  /** 임직원 상세 조회 */
  async getById(id: number): Promise<EmployeeResponse> {
    const { data } = await axiosInstance.get<EmployeeResponse>(
      API_ENDPOINTS.EMPLOYEES.BY_ID(id)
    );
    return data;
  },

  /** 임직원 생성 */
  async create(request: CreateEmployeeRequest): Promise<EmployeeResponse> {
    const { data } = await axiosInstance.post<EmployeeResponse>(
      API_ENDPOINTS.EMPLOYEES.BASE,
      request
    );
    return data;
  },

  /** 임직원 수정 */
  async update(id: number, request: UpdateEmployeeRequest): Promise<EmployeeResponse> {
    const { data } = await axiosInstance.put<EmployeeResponse>(
      API_ENDPOINTS.EMPLOYEES.BY_ID(id),
      request
    );
    return data;
  },

  /** 임직원 상태 변경 */
  async changeStatus(id: number, request: ChangeEmployeeStatusRequest): Promise<EmployeeResponse> {
    const { data } = await axiosInstance.put<EmployeeResponse>(
      API_ENDPOINTS.EMPLOYEES.STATUS(id),
      request
    );
    return data;
  },

  /** 임직원 삭제 */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
  },

  // ============================================
  // LMS Account
  // ============================================

  /** LMS 계정 조회 */
  async getLmsAccount(employeeId: number): Promise<EmployeeLmsAccountResponse> {
    const { data } = await axiosInstance.get<EmployeeLmsAccountResponse>(
      API_ENDPOINTS.EMPLOYEES.LMS_ACCOUNT(employeeId)
    );
    return data;
  },

  /** LMS 계정 생성 */
  async createLmsAccount(
    employeeId: number,
    request: CreateLmsAccountRequest
  ): Promise<CreateLmsAccountResponse> {
    const { data } = await axiosInstance.post<CreateLmsAccountResponse>(
      API_ENDPOINTS.EMPLOYEES.LMS_ACCOUNT(employeeId),
      request
    );
    return data;
  },

  /** LMS 계정 존재 여부 확인 */
  async hasLmsAccount(employeeId: number): Promise<boolean> {
    const { data } = await axiosInstance.get<boolean>(
      API_ENDPOINTS.EMPLOYEES.HAS_LMS_ACCOUNT(employeeId)
    );
    return data;
  },
};
