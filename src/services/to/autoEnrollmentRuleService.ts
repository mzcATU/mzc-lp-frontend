/**
 * Auto Enrollment Rule API 서비스 (TO - Tenant Operator)
 */
import axiosInstance from '@/services/common/api/axiosInstance';
import { API_ENDPOINTS } from '@/services/common/api/endpoints';
import type {
  AutoEnrollmentRuleResponse,
  AutoEnrollmentTrigger,
  CreateAutoEnrollmentRuleRequest,
  UpdateAutoEnrollmentRuleRequest,
} from '@/types/to/autoEnrollmentRule.types';

export const autoEnrollmentRuleService = {
  // ============================================
  // Auto Enrollment Rule CRUD
  // ============================================

  /** 자동 입과 규칙 목록 조회 */
  async getAll(): Promise<AutoEnrollmentRuleResponse[]> {
    const { data } = await axiosInstance.get<AutoEnrollmentRuleResponse[]>(
      API_ENDPOINTS.AUTO_ENROLLMENT_RULES.BASE
    );
    return data;
  },

  /** 활성 자동 입과 규칙 조회 */
  async getActive(): Promise<AutoEnrollmentRuleResponse[]> {
    const { data } = await axiosInstance.get<AutoEnrollmentRuleResponse[]>(
      API_ENDPOINTS.AUTO_ENROLLMENT_RULES.ACTIVE
    );
    return data;
  },

  /** 트리거별 자동 입과 규칙 조회 */
  async getByTrigger(trigger: AutoEnrollmentTrigger): Promise<AutoEnrollmentRuleResponse[]> {
    const { data } = await axiosInstance.get<AutoEnrollmentRuleResponse[]>(
      API_ENDPOINTS.AUTO_ENROLLMENT_RULES.BY_TRIGGER(trigger)
    );
    return data;
  },

  /** 자동 입과 규칙 상세 조회 */
  async getById(id: number): Promise<AutoEnrollmentRuleResponse> {
    const { data } = await axiosInstance.get<AutoEnrollmentRuleResponse>(
      API_ENDPOINTS.AUTO_ENROLLMENT_RULES.BY_ID(id)
    );
    return data;
  },

  /** 자동 입과 규칙 생성 */
  async create(request: CreateAutoEnrollmentRuleRequest): Promise<AutoEnrollmentRuleResponse> {
    const { data } = await axiosInstance.post<AutoEnrollmentRuleResponse>(
      API_ENDPOINTS.AUTO_ENROLLMENT_RULES.BASE,
      request
    );
    return data;
  },

  /** 자동 입과 규칙 수정 */
  async update(id: number, request: UpdateAutoEnrollmentRuleRequest): Promise<AutoEnrollmentRuleResponse> {
    const { data } = await axiosInstance.put<AutoEnrollmentRuleResponse>(
      API_ENDPOINTS.AUTO_ENROLLMENT_RULES.BY_ID(id),
      request
    );
    return data;
  },

  /** 자동 입과 규칙 삭제 */
  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.AUTO_ENROLLMENT_RULES.BY_ID(id));
  },

  /** 자동 입과 규칙 활성화 */
  async activate(id: number): Promise<AutoEnrollmentRuleResponse> {
    const { data } = await axiosInstance.post<AutoEnrollmentRuleResponse>(
      API_ENDPOINTS.AUTO_ENROLLMENT_RULES.ACTIVATE(id)
    );
    return data;
  },

  /** 자동 입과 규칙 비활성화 */
  async deactivate(id: number): Promise<AutoEnrollmentRuleResponse> {
    const { data } = await axiosInstance.post<AutoEnrollmentRuleResponse>(
      API_ENDPOINTS.AUTO_ENROLLMENT_RULES.DEACTIVATE(id)
    );
    return data;
  },
};
