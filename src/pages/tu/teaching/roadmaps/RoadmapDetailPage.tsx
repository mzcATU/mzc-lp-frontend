import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Users,
  BookOpen,
  Calendar,
  Clock,
  Loader2,
  Map,
  MoreVertical,
  GripVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Button,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  IconStatCard,
  Skeleton,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common';
import { useRoadmap, useDeleteRoadmap, useDuplicateRoadmap } from '@/hooks/tu';

const t = {
  backToList: { ko: '목록으로', en: 'Back to List' },
  edit: { ko: '수정', en: 'Edit' },
  duplicate: { ko: '복제', en: 'Duplicate' },
  delete: { ko: '삭제', en: 'Delete' },
  published: { ko: '공개', en: 'Published' },
  draft: { ko: '임시 저장', en: 'Draft' },
  enrolledStudents: { ko: '수강생', en: 'Students' },
  programCount: { ko: '프로그램 수', en: 'Programs' },
  createdAt: { ko: '생성일', en: 'Created' },
  updatedAt: { ko: '최근 수정', en: 'Last Updated' },
  programList: { ko: '프로그램 목록', en: 'Program List' },
  noPrograms: { ko: '등록된 프로그램이 없습니다', en: 'No programs added' },
  noProgramsDesc: { ko: '로드맵을 수정하여 프로그램을 추가하세요', en: 'Edit the roadmap to add programs' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  notFound: { ko: '로드맵을 찾을 수 없습니다', en: 'Roadmap not found' },
  deleteConfirmTitle: { ko: '로드맵 삭제', en: 'Delete Roadmap' },
  deleteConfirmDesc: { ko: '정말 이 로드맵을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.', en: 'Are you sure you want to delete this roadmap? This action cannot be undone.' },
  cancel: { ko: '취소', en: 'Cancel' },
  deleteSuccess: { ko: '로드맵이 삭제되었습니다', en: 'Roadmap deleted successfully' },
  deleteError: { ko: '로드맵 삭제에 실패했습니다', en: 'Failed to delete roadmap' },
  duplicateSuccess: { ko: '로드맵이 복제되었습니다', en: 'Roadmap duplicated successfully' },
  duplicateError: { ko: '로드맵 복제에 실패했습니다', en: 'Failed to duplicate roadmap' },
  order: { ko: '순서', en: 'Order' },
  category: { ko: '카테고리', en: 'Category' },
  duration: { ko: '시간', en: 'Duration' },
};

/**
 * 날짜 포맷팅 함수
 */
function formatDate(dateString: string, language: 'ko' | 'en'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Teaching 로드맵 상세 페이지
 * 콘텐츠 제작자가 자신의 로드맵 상세 정보를 확인하고 관리하는 페이지
 */
export function RoadmapDetailPage({ language = 'ko' }: Readonly<{ language?: 'ko' | 'en' }>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roadmapId = id ? parseInt(id, 10) : 0;

  // API 호출
  const { data: roadmap, isLoading, error } = useRoadmap(roadmapId);
  const deleteMutation = useDeleteRoadmap();
  const duplicateMutation = useDuplicateRoadmap();

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // 삭제 핸들러
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(roadmapId);
      toast.success(getText('deleteSuccess'));
      navigate('/tu/teaching/roadmaps');
    } catch (error) {
      toast.error(getText('deleteError'));
      console.error('Failed to delete roadmap:', error);
    }
  };

  // 복제 핸들러
  const handleDuplicate = async () => {
    try {
      const newRoadmap = await duplicateMutation.mutateAsync(roadmapId);
      toast.success(getText('duplicateSuccess'));
      navigate(`/tu/teaching/roadmaps/${newRoadmap.id}`);
    } catch (error) {
      toast.error(getText('duplicateError'));
      console.error('Failed to duplicate roadmap:', error);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="p-8 bg-bg-app min-h-screen">
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-10 w-96 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  // 에러 또는 데이터 없음
  if (error || !roadmap) {
    return (
      <div className="p-8 bg-bg-app min-h-screen">
        <div className="text-center py-20">
          <Map size={64} className="text-text-secondary mb-4 opacity-30 mx-auto" />
          <h3 className="text-text-primary text-xl font-semibold mb-2">{getText('notFound')}</h3>
          <Button variant="outline" onClick={() => navigate('/tu/teaching/roadmaps')}>
            <ArrowLeft size={16} className="mr-2" />
            {getText('backToList')}
          </Button>
        </div>
      </div>
    );
  }

  const normalizedStatus = roadmap.status.toUpperCase();

  return (
    <div className="p-8 bg-bg-app min-h-screen">
      {/* Header */}
      <div className="mb-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/tu/teaching/roadmaps')}
          className="mb-4 -ml-2 text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft size={16} className="mr-1" />
          {getText('backToList')}
        </Button>

        {/* Title & Actions */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text-primary">{roadmap.title}</h1>
              <Badge variant={normalizedStatus === 'PUBLISHED' ? 'success' : 'warning'}>
                {normalizedStatus === 'PUBLISHED' ? getText('published') : getText('draft')}
              </Badge>
            </div>
            {roadmap.description && (
              <p className="text-text-secondary">{roadmap.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/tu/teaching/roadmaps/${roadmapId}/edit`)}
            >
              <Edit size={16} className="mr-2" />
              {getText('edit')}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDuplicate}
                  disabled={duplicateMutation.isPending}
                >
                  {duplicateMutation.isPending ? (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  ) : (
                    <Copy size={16} className="mr-2" />
                  )}
                  {getText('duplicate')}
                </DropdownMenuItem>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-status-error"
                    >
                      <Trash2 size={16} className="mr-2" />
                      {getText('delete')}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{getText('deleteConfirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {getText('deleteConfirmDesc')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{getText('cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="bg-status-error hover:bg-status-error/90"
                      >
                        {deleteMutation.isPending && (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        )}
                        {getText('delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <IconStatCard
          icon={<Users size={20} />}
          label={getText('enrolledStudents')}
          value={roadmap.enrolledStudents}
        />
        <IconStatCard
          icon={<BookOpen size={20} />}
          label={getText('programCount')}
          value={roadmap.courseCount}
        />
        <IconStatCard
          icon={<Calendar size={20} />}
          label={getText('createdAt')}
          value={formatDate(roadmap.createdAt, language)}
        />
        <IconStatCard
          icon={<Clock size={20} />}
          label={getText('updatedAt')}
          value={formatDate(roadmap.updatedAt, language)}
        />
      </div>

      {/* Program List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            {getText('programList')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {roadmap.programs && roadmap.programs.length > 0 ? (
            <div className="space-y-3">
              {roadmap.programs.map((program, index) => (
                <div
                  key={program.id}
                  className="flex items-center gap-4 p-4 bg-bg-secondary rounded-lg border border-border"
                >
                  {/* Order Number */}
                  <div className="flex items-center gap-2 text-text-secondary">
                    <GripVertical size={16} className="opacity-30" />
                    <span className="w-6 h-6 flex items-center justify-center bg-bg-app rounded text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>

                  {/* Program Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text-primary truncate">{program.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                      <span>{program.category}</span>
                      <span>•</span>
                      <span>{program.duration}</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <Badge variant="gray">{program.category}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen size={48} className="text-text-secondary opacity-30 mx-auto mb-4" />
              <h4 className="text-text-primary font-medium mb-2">{getText('noPrograms')}</h4>
              <p className="text-text-secondary text-sm mb-4">{getText('noProgramsDesc')}</p>
              <Button
                variant="outline"
                onClick={() => navigate(`/tu/teaching/roadmaps/${roadmapId}/edit`)}
              >
                <Edit size={16} className="mr-2" />
                {getText('edit')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
