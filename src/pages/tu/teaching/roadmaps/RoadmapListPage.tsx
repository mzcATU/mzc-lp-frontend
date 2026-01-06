import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Users, TrendingUp, Plus, Filter, MoreVertical, Edit, Trash2, Copy } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, IconStatCard, Card, CardContent, Badge } from '@/components/common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/DropdownMenu';

interface Roadmap {
  id: string;
  title: string;
  description: string;
  courseCount: number;
  enrolledStudents: number;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

const MOCK_ROADMAPS: Roadmap[] = [
  {
    id: '1',
    title: '프론트엔드 개발자 로드맵',
    description: 'HTML, CSS, JavaScript부터 React까지 프론트엔드 개발의 전체 과정',
    courseCount: 8,
    enrolledStudents: 124,
    status: 'published',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
  },
  {
    id: '2',
    title: '백엔드 개발자 로드맵',
    description: 'Node.js와 데이터베이스를 활용한 서버 개발 학습 경로',
    courseCount: 6,
    enrolledStudents: 89,
    status: 'published',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-18',
  },
  {
    id: '3',
    title: 'DevOps 엔지니어 로드맵',
    description: 'CI/CD, Docker, Kubernetes 등 DevOps 핵심 기술 학습',
    courseCount: 5,
    enrolledStudents: 0,
    status: 'draft',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-22',
  },
];

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
};

export function RoadmapListPage({ language = 'ko' }: Readonly<{ language?: 'ko' | 'en' }>) {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'students' | 'title'>('recent');

  const filteredRoadmaps = MOCK_ROADMAPS.filter((roadmap) => {
    if (filterStatus === 'all') return true;
    return roadmap.status === filterStatus;
  });

  const sortedRoadmaps = [...filteredRoadmaps].sort((a, b) => {
    if (sortBy === 'students') return b.enrolledStudents - a.enrolledStudents;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  const totalStudents = MOCK_ROADMAPS.reduce((acc, r) => acc + r.enrolledStudents, 0);
  const avgCourses = Math.round(MOCK_ROADMAPS.reduce((acc, r) => acc + r.courseCount, 0) / MOCK_ROADMAPS.length);

  return (
    <div className="p-8 bg-bg-default min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-text-primary mb-2">{getText('title')}</h1>
          <p className="text-text-secondary m-0">{getText('subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/tu/teaching/roadmaps/create')}>
          <Plus size={20} />
          <span>{getText('createRoadmap')}</span>
        </Button>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <IconStatCard icon={<Map size={20} />} label={getText('totalRoadmaps')} value={MOCK_ROADMAPS.length} />
        <IconStatCard icon={<Users size={20} />} label={getText('totalStudents')} value={totalStudents} />
        <IconStatCard icon={<TrendingUp size={20} className="text-status-success" />} label={getText('avgCourses')} value={avgCourses} />
      </div>

      {/* Filters and Sort */}
      <div className="mb-6 flex gap-4 items-center flex-wrap">
        <div className="flex gap-2 items-center">
          <Filter size={18} className="text-text-secondary" />
          <div className="flex gap-1 bg-bg-secondary p-1 rounded-lg">
            {(['all', 'published', 'draft'] as const).map((status) => (
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
                {getText(status)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 items-center ml-auto">
          <span className="text-sm text-text-secondary">{getText('sortBy')}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'students' | 'title')}
            className="px-3 py-2 bg-bg-secondary text-text-primary border border-border rounded-md text-sm cursor-pointer"
          >
            <option value="recent">{getText('recent')}</option>
            <option value="students">{getText('studentCount')}</option>
            <option value="title">{getText('titleSort')}</option>
          </select>
        </div>
      </div>

      {/* Roadmap List */}
      <div className="flex flex-col gap-4">
        {sortedRoadmaps.map((roadmap) => (
          <Card key={roadmap.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/tu/teaching/roadmaps/${roadmap.id}`)}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary m-0">{roadmap.title}</h3>
                    <Badge variant={roadmap.status === 'published' ? 'default' : 'secondary'}>
                      {getText(roadmap.status)}
                    </Badge>
                  </div>
                  <p className="text-text-secondary text-sm mb-3 m-0">{roadmap.description}</p>
                  <div className="flex gap-4 text-sm text-text-secondary">
                    <span>{roadmap.courseCount}{getText('courses')}</span>
                    <span>{roadmap.enrolledStudents}{getText('students')}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/tu/teaching/roadmaps/${roadmap.id}/edit`); }}>
                      <Edit size={16} className="mr-2" />
                      {getText('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Copy size={16} className="mr-2" />
                      {getText('duplicate')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-status-error">
                      <Trash2 size={16} className="mr-2" />
                      {getText('delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sortedRoadmaps.length === 0 && (
        <div className="text-center py-20 px-5 bg-bg-secondary rounded-xl border border-border">
          <Map size={64} className="text-text-secondary mb-4 opacity-30 mx-auto" />
          <h3 className="text-text-primary mb-2">{getText('noRoadmaps')}</h3>
          <p className="text-text-secondary mb-6">{getText('noRoadmapsDesc')}</p>
          <Button onClick={() => navigate('/tu/teaching/roadmaps/create')}>
            {getText('createRoadmap')}
          </Button>
        </div>
      )}
    </div>
  );
}
