import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Pin,
  Calendar,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';

// Mock 데이터
const mockNotices: {
  id: number;
  title: string;
  content: string;
  category: 'GENERAL' | 'UPDATE' | 'MAINTENANCE' | 'EVENT';
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
  isPinned: boolean;
  views: number;
  publishedAt: string | null;
  createdAt: string;
}[] = [
  { id: 1, title: '2025년 1월 시스템 업데이트 안내', content: '새로운 기능이 추가됩니다...', category: 'UPDATE', status: 'PUBLISHED', isPinned: true, views: 1250, publishedAt: '2025-12-28', createdAt: '2025-12-27' },
  { id: 2, title: '연말 시스템 점검 안내', content: '12월 31일 시스템 점검...', category: 'MAINTENANCE', status: 'PUBLISHED', isPinned: true, views: 890, publishedAt: '2025-12-25', createdAt: '2025-12-24' },
  { id: 3, title: '신규 강좌 오픈 이벤트', content: '신규 강좌 50% 할인...', category: 'EVENT', status: 'PUBLISHED', isPinned: false, views: 2340, publishedAt: '2025-12-20', createdAt: '2025-12-19' },
  { id: 4, title: '이용약관 변경 안내', content: '이용약관이 변경됩니다...', category: 'GENERAL', status: 'SCHEDULED', isPinned: false, views: 0, publishedAt: null, createdAt: '2025-12-29' },
  { id: 5, title: '새해 맞이 특별 프로모션 (초안)', content: '2026년을 맞아...', category: 'EVENT', status: 'DRAFT', isPinned: false, views: 0, publishedAt: null, createdAt: '2025-12-30' },
];

const categoryConfig = {
  GENERAL: { label: '일반', color: 'bg-gray-100 text-gray-700' },
  UPDATE: { label: '업데이트', color: 'bg-blue-100 text-blue-700' },
  MAINTENANCE: { label: '점검', color: 'bg-yellow-100 text-yellow-700' },
  EVENT: { label: '이벤트', color: 'bg-purple-100 text-purple-700' },
};

const statusConfig = {
  DRAFT: { label: '초안', color: 'bg-gray-100 text-gray-600' },
  PUBLISHED: { label: '게시됨', color: 'bg-green-100 text-green-700' },
  SCHEDULED: { label: '예약됨', color: 'bg-blue-100 text-blue-700' },
};

export function NoticesPage() {
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredNotices = mockNotices.filter((notice) =>
    notice.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="p-6">
      <AdminPageHeader
        title="공지사항 관리"
        description="전체 테넌트에 공지사항을 관리합니다"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            공지 작성
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>공지사항 목록</CardTitle>
              <CardDescription>전체 {mockNotices.length}개의 공지사항</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="공지 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredNotices.map((notice) => (
              <div key={notice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-bg-secondary">
                <div className="flex items-start gap-3">
                  {notice.isPinned && <Pin className="h-4 w-4 text-brand-primary mt-1" />}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{notice.title}</h3>
                      <Badge className={categoryConfig[notice.category].color}>
                        {categoryConfig[notice.category].label}
                      </Badge>
                      <Badge className={statusConfig[notice.status].color}>
                        {statusConfig[notice.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {notice.publishedAt || notice.createdAt}
                      </span>
                      {notice.status === 'PUBLISHED' && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {notice.views.toLocaleString()} 조회
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
