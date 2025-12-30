import { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';

// Mock 데이터
const mockLogs: {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: string;
  message: string;
  source: string;
  userId?: string;
  tenantId?: string;
}[] = [
  { id: 1, timestamp: '2025-12-30 10:45:23', level: 'INFO', category: 'AUTH', message: '사용자 로그인 성공', source: 'auth-service', userId: 'user-123', tenantId: 'tenant-1' },
  { id: 2, timestamp: '2025-12-30 10:44:18', level: 'WARN', category: 'API', message: 'Rate limit 임계치 도달 (80%)', source: 'api-gateway', tenantId: 'tenant-2' },
  { id: 3, timestamp: '2025-12-30 10:43:55', level: 'ERROR', category: 'VIDEO', message: '비디오 트랜스코딩 실패', source: 'video-service', tenantId: 'tenant-1' },
  { id: 4, timestamp: '2025-12-30 10:42:30', level: 'INFO', category: 'COURSE', message: '강좌 생성 완료', source: 'course-service', userId: 'admin-1', tenantId: 'tenant-3' },
  { id: 5, timestamp: '2025-12-30 10:41:12', level: 'DEBUG', category: 'SYSTEM', message: '캐시 갱신 완료', source: 'cache-service' },
  { id: 6, timestamp: '2025-12-30 10:40:45', level: 'INFO', category: 'BILLING', message: '결제 처리 완료', source: 'billing-service', tenantId: 'tenant-1' },
  { id: 7, timestamp: '2025-12-30 10:39:20', level: 'WARN', category: 'STORAGE', message: '스토리지 사용량 90% 초과', source: 'storage-service', tenantId: 'tenant-2' },
  { id: 8, timestamp: '2025-12-30 10:38:05', level: 'ERROR', category: 'AUTH', message: '비밀번호 5회 오류로 계정 잠금', source: 'auth-service', userId: 'user-456', tenantId: 'tenant-1' },
];

const levelConfig = {
  INFO: { icon: Info, color: 'bg-blue-100 text-blue-700' },
  WARN: { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700' },
  ERROR: { icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  DEBUG: { icon: CheckCircle, color: 'bg-gray-100 text-gray-700' },
};

export function LogsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [...new Set(mockLogs.map(log => log.category))];

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.source.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="p-6">
      <AdminPageHeader
        title="시스템 로그"
        description="시스템 전체 로그를 조회하고 분석합니다"
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            로그 내보내기
          </Button>
        }
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockLogs.filter(l => l.level === 'INFO').length}</p>
                <p className="text-sm text-text-secondary">INFO</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockLogs.filter(l => l.level === 'WARN').length}</p>
                <p className="text-sm text-text-secondary">WARNING</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockLogs.filter(l => l.level === 'ERROR').length}</p>
                <p className="text-sm text-text-secondary">ERROR</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockLogs.length}</p>
                <p className="text-sm text-text-secondary">전체 로그</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>로그 목록</CardTitle>
              <CardDescription>최근 시스템 로그입니다</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="메시지 검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="레벨" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 레벨</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                  <SelectItem value="DEBUG">DEBUG</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredLogs.map((log) => {
              const config = levelConfig[log.level];
              const LevelIcon = config.icon;

              return (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-bg-secondary font-mono text-sm">
                  <Badge className={`${config.color} shrink-0`}>
                    <LevelIcon className="h-3 w-3 mr-1" />
                    {log.level}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-text-secondary">{log.timestamp}</span>
                      <Badge variant="outline">{log.category}</Badge>
                      <span className="text-text-secondary">[{log.source}]</span>
                    </div>
                    <p className="truncate">{log.message}</p>
                    {(log.userId || log.tenantId) && (
                      <div className="flex gap-2 mt-1 text-xs text-text-secondary">
                        {log.userId && <span>User: {log.userId}</span>}
                        {log.tenantId && <span>Tenant: {log.tenantId}</span>}
                      </div>
                    )}
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
