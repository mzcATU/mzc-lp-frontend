import { useState } from 'react';
import {
  Send,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Search,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Progress } from '@/components/common/Progress';

// Mock 데이터
const mockDistributions: {
  id: number;
  noticeTitle: string;
  totalTenants: number;
  sentCount: number;
  readCount: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED' | 'FAILED';
  distributedAt: string;
}[] = [
  { id: 1, noticeTitle: '2025년 1월 시스템 업데이트 안내', totalTenants: 45, sentCount: 45, readCount: 38, status: 'COMPLETED', distributedAt: '2025-12-28 10:00' },
  { id: 2, noticeTitle: '연말 시스템 점검 안내', totalTenants: 45, sentCount: 45, readCount: 42, status: 'COMPLETED', distributedAt: '2025-12-25 09:00' },
  { id: 3, noticeTitle: '신규 강좌 오픈 이벤트', totalTenants: 45, sentCount: 30, readCount: 15, status: 'IN_PROGRESS', distributedAt: '2025-12-20 14:00' },
  { id: 4, noticeTitle: '이용약관 변경 안내', totalTenants: 45, sentCount: 0, readCount: 0, status: 'SCHEDULED', distributedAt: '2026-01-01 00:00' },
];

const statusConfig = {
  COMPLETED: { label: '완료', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  IN_PROGRESS: { label: '진행중', icon: Clock, color: 'bg-blue-100 text-blue-700' },
  SCHEDULED: { label: '예약됨', icon: Clock, color: 'bg-yellow-100 text-yellow-700' },
  FAILED: { label: '실패', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
};

export function NoticeDistributionPage() {
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredDistributions = mockDistributions.filter((dist) =>
    dist.noticeTitle.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="p-6">
      <AdminPageHeader
        title="공지사항 배포 관리"
        description="공지사항의 테넌트별 배포 현황을 관리합니다"
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Send className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockDistributions.length}</p>
                <p className="text-sm text-text-secondary">전체 배포</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockDistributions.filter(d => d.status === 'COMPLETED').length}</p>
                <p className="text-sm text-text-secondary">완료</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockDistributions.filter(d => d.status === 'IN_PROGRESS').length}</p>
                <p className="text-sm text-text-secondary">진행중</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Building2 className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-text-secondary">대상 테넌트</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>배포 현황</CardTitle>
              <CardDescription>공지사항별 배포 및 열람 현황입니다</CardDescription>
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
          <div className="space-y-4">
            {filteredDistributions.map((dist) => {
              const config = statusConfig[dist.status];
              const StatusIcon = config.icon;
              const sentPercent = (dist.sentCount / dist.totalTenants) * 100;
              const readPercent = dist.sentCount > 0 ? (dist.readCount / dist.sentCount) * 100 : 0;

              return (
                <div key={dist.id} className="p-4 border rounded-lg hover:bg-bg-secondary">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{dist.noticeTitle}</h3>
                      <Badge className={config.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                    <span className="text-sm text-text-secondary">{dist.distributedAt}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">발송 현황</span>
                        <span>{dist.sentCount} / {dist.totalTenants} 테넌트</span>
                      </div>
                      <Progress value={sentPercent} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">열람율</span>
                        <span>{dist.readCount} / {dist.sentCount} ({readPercent.toFixed(0)}%)</span>
                      </div>
                      <Progress value={readPercent} className="h-2" />
                    </div>
                  </div>

                  <div className="flex justify-end mt-3">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      상세 보기
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
