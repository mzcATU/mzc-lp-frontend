import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation } from '@/store/common/languageStore';
import { useAuth } from '@/hooks/common/auth';
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

// TODO: 실제 API hook으로 교체
// import { useMyCreatedCourses, useRequestDesignerRole } from '@/hooks/tu';

// 임시 데이터 타입
interface CreatedCourse {
  id: string;
  title: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  enrollmentCount: number;
}

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

  // TODO: 실제 API 연동
  // const { data: courses, isLoading } = useMyCreatedCourses();
  const isLoading = false;
  const courses: CreatedCourse[] = []; // 빈 배열로 시작 (개설한 강의 없음 상태)

  const handleCreateCourse = () => {
    if (isDesigner) {
      // 이미 DESIGNER 역할이 있으면 바로 강의 개설 페이지로 이동
      navigate('/tu/teaching/courses/create');
    } else {
      // DESIGNER 역할이 없으면 권한 부여 다이얼로그 표시
      setShowRoleDialog(true);
    }
  };

  const handleGrantDesignerRole = async () => {
    setIsGrantingRole(true);
    try {
      // TODO: 실제 API 연동 - DESIGNER 역할 부여 요청
      // await requestDesignerRole();

      // 시뮬레이션: 1초 후 역할 부여 완료
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('강의 개설 권한이 부여되었습니다.');
      setShowRoleDialog(false);

      // 권한 부여 후 강의 개설 페이지로 이동
      navigate('/tu/teaching/courses/create');
    } catch {
      toast.error('권한 부여에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGrantingRole(false);
    }
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/tu/teaching/courses/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    navigate(`/tu/teaching/courses/${courseId}/edit`);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-full ${isDark ? 'bg-[#0a0a14]' : 'bg-gray-50'}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    );
  }

  return (
    <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#0a0a14]' : 'bg-gray-50'}`}>
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
              const StatusIcon = statusIcons[course.status];

              return (
                <Card
                  key={course.id}
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
                          <Badge variant={statusVariants[course.status]} className="text-xs">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusLabels[course.status]}
                          </Badge>
                        </div>
                        <h3
                          className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
                        >
                          {course.title}
                        </h3>
                        <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span>
                            {t.teaching.students} {course.enrollmentCount}
                          </span>
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
                          onClick={() => handleViewCourse(course.id)}
                          className={isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {t.common.view}
                        </Button>
                        {(course.status === 'DRAFT' || course.status === 'REJECTED') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCourse(course.id)}
                            className={isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            {t.common.edit}
                          </Button>
                        )}
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

      {/* DESIGNER 역할 부여 다이얼로그 */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <AlertDialogTitle>{t.teaching.grantPermission}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-3">
              <p>
                {t.teaching.grantPermissionDesc.split('Designer')[0]}
                <strong>{t.teaching.designer}</strong>
                {t.teaching.grantPermissionDesc.split('Designer')[1] || ''}
              </p>
              <p>
                {t.teaching.grantPermissionConfirm}
              </p>
              <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <p className="text-sm text-orange-800">
                  {t.teaching.grantPermissionWarning}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isGrantingRole}>{t.common.cancel}</AlertDialogCancel>
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
                t.common.confirm
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
