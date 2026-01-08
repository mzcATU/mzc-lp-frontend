import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Users, TrendingUp, Plus, Filter, MoreVertical, Edit, Trash2, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import { Button, IconStatCard, Card, CardContent, Badge } from '@/components/common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu';
import {
  useMyRoadmaps,
  useRoadmapStatistics,
  useDeleteRoadmap,
  useDuplicateRoadmap,
} from '@/hooks/tu';
import type { RoadmapStatus } from '@/types/tu/roadmap.types';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';

const t = {
  title: { ko: '로드맵', en: 'Roadmaps' },
  subtitle: { ko: '학습 경로를 설계하고 수강생의 성장을 이끌어주세요', en: 'Design learning paths and guide student growth' },
  createRoadmap: { ko: '로드맵 생성', en: 'Create Roadmap' },
  all: { ko: '전체', en: 'All' },
  published: { ko: '공개', en: 'Published' },
  draft: { ko: '임시 저장', en: 'Draft' },
  sortBy: { ko: '정렬', en: 'Sort By' },
  recent: { ko: '최신순', en: 'Recent' },
  studentCount: { ko: '수강생 순', en: 'Students' },
  titleSort: { ko: '제목순', en: 'Title' },
  totalRoadmaps: { ko: '전체 로드맵', en: 'Total Roadmaps' },
  totalStudents: { ko: '총 수강생', en: 'Total Students' },
  avgCourses: { ko: '평균 강의 수', en: 'Avg. Courses' },
  courses: { ko: '개 강의', en: ' courses' },
  students: { ko: '명 수강 중', en: ' students' },
  edit: { ko: '수정', en: 'Edit' },
  duplicate: { ko: '복제', en: 'Duplicate' },
  delete: { ko: '삭제', en: 'Delete' },
  noRoadmaps: { ko: '생성된 로드맵이 없습니다', en: 'No roadmaps created yet' },
  noRoadmapsDesc: { ko: '새로운 로드맵을 만들어 학습 경로를 설계하세요', en: 'Create a new roadmap to design learning paths' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  deleteConfirm: { ko: '정말 삭제하시겠습니까?', en: 'Are you sure you want to delete?' },
  deleteSuccess: { ko: '로드맵이 삭제되었습니다', en: 'Roadmap deleted successfully' },
  deleteError: { ko: '로드맵 삭제에 실패했습니다', en: 'Failed to delete roadmap' },
  duplicateSuccess: { ko: '로드맵이 복제되었습니다', en: 'Roadmap duplicated successfully' },
  duplicateError: { ko: '로드맵 복제에 실패했습니다', en: 'Failed to duplicate roadmap' },
};

export function RoadmapListPage({ language = 'ko' }: Readonly<{ language?: 'ko' | 'en' }>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const [filterStatus, setFilterStatus] = useState<'all' | RoadmapStatus>('all');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'title' | 'enrolledStudents'>('updatedAt');

  // API 호출
  const queryParams = {
    status: filterStatus === 'all' ? undefined : filterStatus,
    sortBy,
  };

  const { data: roadmapsData, isLoading: isLoadingRoadmaps } = useMyRoadmaps(queryParams);
  const { data: statistics, isLoading: isLoadingStats } = useRoadmapStatistics();
  const deleteMutation = useDeleteRoadmap();
  const duplicateMutation = useDuplicateRoadmap();

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const roadmaps = roadmapsData?.content || [];
  const isLoading = isLoadingRoadmaps || isLoadingStats;

  // 삭제 핸들러
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(getText('deleteConfirm'))) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success(getText('deleteSuccess'));
    } catch (error: any) {
      toast.error(getText('deleteError'));
      console.error('Failed to delete roadmap:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  // 복제 핸들러
  const handleDuplicate = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await duplicateMutation.mutateAsync(id);
      toast.success(getText('duplicateSuccess'));
    } catch (error) {
      toast.error(getText('duplicateError'));
      console.error('Failed to duplicate roadmap:', error);
    }
  };

  return (
    <div className="p-8 bg-bg-app min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-text-primary mb-2">{getText('title')}</h1>
          <p className="text-text-secondary m-0">{getText('subtitle')}</p>
        </div>
        <Button onClick={() => navigate(prefixPath('/tu/teaching/roadmaps/create'))}>
          <Plus size={20} />
          <span>{getText('createRoadmap')}</span>
        </Button>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <IconStatCard
          icon={<Map size={20} />}
          label={getText('totalRoadmaps')}
          value={isLoading ? 0 : statistics?.totalRoadmaps || 0}
        />
        <IconStatCard
          icon={<Users size={20} />}
          label={getText('totalStudents')}
          value={isLoading ? 0 : statistics?.totalEnrollments || 0}
        />
        <IconStatCard
          icon={<TrendingUp size={20} className="text-status-success" />}
          label={getText('avgCourses')}
          value={isLoading ? 0 : Math.round(statistics?.averageCourseCount || 0)}
        />
      </div>

      {/* Filters and Sort */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <Filter size={18} className="text-text-secondary" />
          <div className="flex gap-1 bg-bg-secondary p-1 rounded-lg">
            {(['all', 'PUBLISHED', 'DRAFT'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  'px-4 py-1.5 rounded-md text-sm transition-colors',
                  filterStatus === status
                    ? 'bg-btn-neutral text-white font-medium'
                    : 'bg-transparent text-text-secondary hover:bg-bg-secondary'
                )}
              >
                {status === 'all' ? getText('all') : status === 'PUBLISHED' ? getText('published') : getText('draft')}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center ml-auto">
          <span className="text-sm text-text-secondary">{getText('sortBy')}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'updatedAt' | 'title' | 'enrolledStudents')}
            className="px-3 py-2 bg-bg-secondary text-text-primary border border-border rounded-md text-sm cursor-pointer"
          >
            <option value="updatedAt">{getText('recent')}</option>
            <option value="enrolledStudents">{getText('studentCount')}</option>
            <option value="title">{getText('titleSort')}</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-text-secondary" size={32} />
          <span className="ml-2 text-text-secondary">{getText('loading')}</span>
        </div>
      )}

      {/* Roadmap List */}
      {!isLoading && roadmaps.length > 0 && (
        <div className="flex flex-col gap-4">
          {roadmaps.map((roadmap) => (
            <Card
              key={roadmap.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(prefixPath(`/tu/teaching/roadmaps/${roadmap.id}`))}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary m-0">{roadmap.title}</h3>
                      <Badge variant={roadmap.status.toUpperCase() === 'PUBLISHED' ? 'success' : 'warning'}>
                        {roadmap.status.toUpperCase() === 'PUBLISHED' ? getText('published') : getText('draft')}
                      </Badge>
                    </div>
                    <p className="text-text-secondary text-sm mb-3 m-0">{roadmap.description}</p>
                    <div className="flex gap-4 text-sm text-text-secondary">
                      <span>
                        {roadmap.courseCount}
                        {getText('courses')}
                      </span>
                      <span>
                        {roadmap.enrolledStudents}
                        {getText('students')}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(prefixPath(`/tu/teaching/roadmaps/${roadmap.id}/edit`));
                        }}
                      >
                        <Edit size={16} className="mr-2" />
                        {getText('edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDuplicate(roadmap.id, e)}
                        disabled={duplicateMutation.isPending}
                      >
                        {duplicateMutation.isPending ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <Copy size={16} className="mr-2" />
                        )}
                        {getText('duplicate')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDelete(roadmap.id, e)}
                        className="text-status-error"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 size={16} className="mr-2 animate-spin" />
                        ) : (
                          <Trash2 size={16} className="mr-2" />
                        )}
                        {getText('delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && roadmaps.length === 0 && (
        <div className="text-center py-20 px-5 bg-bg-secondary rounded-xl border border-border">
          <Map size={64} className="text-text-secondary mb-4 opacity-30 mx-auto" />
          <h3 className="text-text-primary mb-2">{getText('noRoadmaps')}</h3>
          <p className="text-text-secondary mb-6">{getText('noRoadmapsDesc')}</p>
          <Button onClick={() => navigate(prefixPath('/tu/teaching/roadmaps/create'))}>
            {getText('createRoadmap')}
          </Button>
        </div>
      )}
    </div>
  );
}
