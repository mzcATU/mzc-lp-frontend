import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation } from '@/store/common/languageStore';
import { useAuth } from '@/hooks/common/auth';
import { userService } from '@/services/common/userService';
import { authService } from '@/services/common/authService';
import { useAuthStore } from '@/store/common/authStore';
import { courseService } from '@/services/common/courseService';
import {
  Button,
  Card,
  CardContent,
  Badge,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/common';

const statusIcons = {
  DRAFT: Edit,
  PENDING: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
};

const statusVariants = {
  DRAFT: 'gray' as const,
  PENDING: 'orange' as const,
  APPROVED: 'green' as const,
  REJECTED: 'red' as const,
};

export function MyTeachingPage() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  // 상태 라벨 (다국어)
  const statusLabels = {
    DRAFT: t.teaching.draft,
    PENDING: t.teaching.pendingApproval,
    APPROVED: t.teaching.approved,
    REJECTED: t.teaching.rejected,
  };

  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [isGrantingRole, setIsGrantingRole] = useState(false);

  // 사용자가 DESIGNER 역할을 가지고 있는지 확인
  const isDesigner = user?.role === 'DESIGNER' || user?.role === 'OPERATOR' || user?.role === 'TENANT_ADMIN';

  // 내 강의 목록 조회
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['myCourses'],
    queryFn: () => courseService.getMyCourses(),
    enabled: isDesigner,
  });
  const courses = coursesData?.content || [];

  const handleCreateCourse = () => {
    // DESIGNER 역할 여부와 관계없이 항상 확인 다이얼로그 표시
    setShowRoleDialog(true);
  };

  const handleGrantDesignerRole = async () => {
    // 이미 DESIGNER인 경우 바로 이동
    if (isDesigner) {
      setShowRoleDialog(false);
      navigate('/tu/teaching/courses/create');
      return;
    }

    setIsGrantingRole(true);
    try {
      // DESIGNER 역할 부여 API 호출
      await userService.applyDesignerRole();

      // 토큰 갱신 (CourseRole이 반영된 새 토큰 발급)
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        const tokenResponse = await authService.refresh(refreshToken);
        useAuthStore.getState().setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
      }

      // 사용자 정보 다시 조회하여 역할 업데이트
      const updatedUser = await userService.getMe();
      useAuthStore.getState().updateUser({ role: updatedUser.role });

      toast.success('강의 개설 권한이 부여되었습니다.');
      setShowRoleDialog(false);

      // 권한 부여 후 강의 개설 페이지로 이동
      navigate('/tu/teaching/courses/create');
    } catch (error) {
      // 409 Conflict = 이미 DESIGNER 역할을 가지고 있음
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 409) {
        // 토큰 갱신 (이미 권한이 있어도 토큰에 반영 필요)
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const tokenResponse = await authService.refresh(refreshToken);
          useAuthStore.getState().setTokens(tokenResponse.accessToken, tokenResponse.refreshToken);
        }

        // 이미 권한이 있으므로 사용자 정보 업데이트 후 진행
        const updatedUser = await userService.getMe();
        useAuthStore.getState().updateUser({ role: updatedUser.role });

        toast.success('이미 강의 개설 권한이 있습니다.');
        setShowRoleDialog(false);
        navigate('/tu/teaching/courses/create');
      } else {
        toast.error('권한 부여에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsGrantingRole(false);
    }
  };

  // 다이얼로그 설명 텍스트
  const getDialogDescription = () => {
    if (isDesigner) {
      return t.teaching.navigateConfirm;
    }
    return t.teaching.grantPermissionDesc;
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/tu/teaching/courses/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/tu/teaching/courses/${courseId}/edit`);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    );
  }

  return (
    <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.teaching.title}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {t.teaching.description}
            </p>
          </div>
          {courses.length > 0 && (
            <Button onClick={handleCreateCourse} className="gap-2">
              <Plus className="w-4 h-4" />
              {t.teaching.newCourse}
            </Button>
          )}
        </div>

        {/* 안내 문구 */}
        <div
          className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${
            isDark
              ? 'bg-blue-500/10 border border-blue-500/20'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
              {t.teaching.courseNotice}
            </p>
            <p className={`text-sm ${isDark ? 'text-blue-400/80' : 'text-blue-700'}`}>
              {t.teaching.courseNoticeDesc}
            </p>
          </div>
        </div>

        {/* 강의 목록 또는 빈 상태 */}
        {courses.length === 0 ? (
          <Card
            className={`${
              isDark
                ? 'bg-white/5 border-white/10'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <CardContent className="py-16">
              <div className="text-center">
                <div
                  className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                    isDark
                      ? 'bg-gradient-to-r from-[#6778ff]/20 to-[#a855f7]/20'
                      : 'bg-blue-100'
                  }`}
                >
                  <BookOpen className={`w-10 h-10 ${isDark ? 'text-[#6778ff]' : 'text-blue-600'}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t.teaching.noCourses}
                </h3>
                <p className={`mb-8 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.teaching.noCoursesDesc}
                </p>
                <Button onClick={handleCreateCourse} size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  {t.teaching.createCourse}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => {
              // Course API에는 status가 없으므로 기본값 DRAFT 사용
              const courseStatus = 'DRAFT' as const;
              const StatusIcon = statusIcons[courseStatus];

              return (
                <Card
                  key={course.courseId}
                  className={`transition-all hover:scale-[1.01] ${
                    isDark
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* 강의 정보 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={statusVariants[courseStatus]} className="text-xs">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusLabels[courseStatus]}
                          </Badge>
                        </div>
                        <h3
                          className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
                        >
                          {course.title}
                        </h3>
                        <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span>
                            {t.teaching.lastModified}: {new Date(course.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCourse(String(course.courseId))}
                          className={isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {t.common.view}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCourse(String(course.courseId))}
                          className={isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          {t.common.edit}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={isDark ? 'text-gray-400 hover:text-white' : ''}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 강의 개설 확인 다이얼로그 */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent className={isDark ? 'bg-[#2a2a2a] border-white/10' : ''}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isDark ? 'text-white' : ''}>{t.teaching.courseDesignTitle}</AlertDialogTitle>
            <AlertDialogDescription className={isDark ? 'text-gray-300' : ''}>
              {getDialogDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isGrantingRole}
              className={isDark ? 'bg-transparent border-white/20 text-gray-200 hover:bg-white/10 hover:text-white' : ''}
            >
              {t.common.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleGrantDesignerRole}
              disabled={isGrantingRole}
            >
              {isGrantingRole ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.teaching.granting}
                </>
              ) : (
                t.teaching.proceed
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
