import { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  FolderTree,
  ChevronRight,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';

// Mock 데이터
const mockGroups: {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  parentId: number | null;
  children?: number[];
  createdAt: string;
}[] = [
  { id: 1, name: '전체 사용자', description: '모든 테넌트 사용자', memberCount: 2500, parentId: null, children: [2, 3, 4], createdAt: '2024-01-01' },
  { id: 2, name: '개발팀', description: '개발 부서 소속 사용자', memberCount: 450, parentId: 1, children: [5, 6], createdAt: '2024-01-15' },
  { id: 3, name: '마케팅팀', description: '마케팅 부서 소속 사용자', memberCount: 120, parentId: 1, createdAt: '2024-01-15' },
  { id: 4, name: '영업팀', description: '영업 부서 소속 사용자', memberCount: 280, parentId: 1, createdAt: '2024-01-15' },
  { id: 5, name: '프론트엔드팀', description: '프론트엔드 개발자', memberCount: 150, parentId: 2, createdAt: '2024-02-01' },
  { id: 6, name: '백엔드팀', description: '백엔드 개발자', memberCount: 200, parentId: 2, createdAt: '2024-02-01' },
];

export function GroupsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<number[]>([1]);

  const toggleExpand = (id: number) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
    );
  };

  const rootGroups = mockGroups.filter(g => g.parentId === null);

  const renderGroupTree = (groups: typeof mockGroups, level = 0) => {
    return groups.map((group) => {
      const children = mockGroups.filter(g => g.parentId === group.id);
      const hasChildren = children.length > 0;
      const isExpanded = expandedGroups.includes(group.id);

      if (searchKeyword && !group.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return null;
      }

      return (
        <div key={group.id}>
          <div
            className={`flex items-center justify-between p-3 border rounded-lg hover:bg-bg-secondary ${
              level > 0 ? 'ml-' + (level * 6) : ''
            }`}
            style={{ marginLeft: level * 24 }}
          >
            <div className="flex items-center gap-3">
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(group.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              ) : (
                <div className="w-6" />
              )}
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <FolderTree className="h-4 w-4 text-brand-primary" />
              </div>
              <div>
                <p className="font-medium">{group.name}</p>
                <p className="text-xs text-text-secondary">{group.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">{group.memberCount}명</Badge>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                {group.parentId !== null && (
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div className="mt-2 space-y-2">
              {renderGroupTree(children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="사용자 그룹 및 역할 관리"
        description="사용자 그룹을 계층 구조로 관리합니다"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            그룹 추가
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <FolderTree className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockGroups.length}</p>
                <p className="text-sm text-text-secondary">전체 그룹</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockGroups.find(g => g.parentId === null)?.memberCount.toLocaleString() || 0}
                </p>
                <p className="text-sm text-text-secondary">전체 사용자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FolderTree className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockGroups.filter(g => g.parentId !== null).length}</p>
                <p className="text-sm text-text-secondary">하위 그룹</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Group Tree */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>그룹 구조</CardTitle>
              <CardDescription>그룹을 클릭하여 하위 그룹을 확인하세요</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="그룹 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {renderGroupTree(rootGroups)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
