import axiosInstance from '@/services/common/api/axiosInstance';

/**
 * 차수별 공지사항 타입
 */
export interface CourseTimeAnnouncement {
  id: number;
  courseTimeId: number;
  type: 'IMPORTANT' | 'INFO';
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 공지사항 생성 요청
 */
export interface CreateAnnouncementRequest {
  type: 'IMPORTANT' | 'INFO';
  title: string;
  message: string;
}

/**
 * 공지사항 수정 요청
 */
export interface UpdateAnnouncementRequest {
  type?: 'IMPORTANT' | 'INFO';
  title?: string;
  message?: string;
}

/**
 * CourseTime 공지사항 API 서비스
 */
export const courseTimeAnnouncementService = {
  /**
   * 차수별 공지사항 목록 조회
   */
  getAnnouncements: async (timeId: number): Promise<CourseTimeAnnouncement[]> => {
    const response = await axiosInstance.get<CourseTimeAnnouncement[]>(
      `/times/${timeId}/announcements`
    );
    return response.data;
  },

  /**
   * 공지사항 상세 조회
   */
  getAnnouncementById: async (timeId: number, announcementId: number): Promise<CourseTimeAnnouncement> => {
    const response = await axiosInstance.get<CourseTimeAnnouncement>(
      `/times/${timeId}/announcements/${announcementId}`
    );
    return response.data;
  },

  /**
   * 공지사항 생성 (강사/관리자 전용)
   */
  createAnnouncement: async (
    timeId: number,
    request: CreateAnnouncementRequest
  ): Promise<CourseTimeAnnouncement> => {
    const response = await axiosInstance.post<CourseTimeAnnouncement>(
      `/times/${timeId}/announcements`,
      request
    );
    return response.data;
  },

  /**
   * 공지사항 수정 (강사/관리자 전용)
   */
  updateAnnouncement: async (
    timeId: number,
    announcementId: number,
    request: UpdateAnnouncementRequest
  ): Promise<CourseTimeAnnouncement> => {
    const response = await axiosInstance.put<CourseTimeAnnouncement>(
      `/times/${timeId}/announcements/${announcementId}`,
      request
    );
    return response.data;
  },

  /**
   * 공지사항 삭제 (강사/관리자 전용)
   */
  deleteAnnouncement: async (timeId: number, announcementId: number): Promise<void> => {
    await axiosInstance.delete(`/times/${timeId}/announcements/${announcementId}`);
  },
};
