import { useState } from 'react';
import {
  Search,
  Download,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
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
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  category: string;
  action: string;
  user?: string;
  details: string;
  ip?: string;
}[] = [
  { id: 1, timestamp: '2025-12-30 10:45:23', level: 'INFO', category: '인증', action: '로그인', user: '김학습', details: '로그인 성공', ip: '192.168.1.100' },
  { id: 2, timestamp: '2025-12-30 10:44:18', level: 'SUCCESS', category: '학습', action: '강좌 완료', user: '이수강', details: 'AWS 기초 과정 수료', ip: '192.168.1.101' },
  { id: 3, timestamp: '2025-12-30 10:43:55', level: 'WARN', category: '시스템', action: '파일 업로드', user: '박강사', details: '파일 크기 제한 초과 (500MB)', ip: '192.168.1.102' },
  { id: 4, timestamp: '2025-12-30 10:42:30', level: 'INFO', category: '관리', action: '사용자 생성', user: '관리자', details: '신규 사용자 10명 일괄 등록', ip: '192.168.1.1' },
  { id: 5, timestamp: '2025-12-30 10:41:12', level: 'ERROR', category: '인증', action: '로그인', user: '최사용', details: '비밀번호 5회 오류, 계정 잠금', ip: '192.168.1.103' },
  { id: 6, timestamp: '2025-12-30 10:40:45', level: 'INFO', category: '학습', action: '영상 시청', user: '정학생', details: 'React 입문 3강 시청 완료', ip: '192.168.1.104' },
  { id: 7, timestamp: '2025-12-30 10:39:20', level: 'SUCCESS', category: '관리', action: '강좌 게시', user: '관리자', details: 'Python 고급 과정 게시됨', ip: '192.168.1.1' },
  { id: 8, timestamp: '2025-12-30 10:38:05', level: 'INFO', category: '인증', action: '로그아웃', user: '김학습', details: '정상 로그아웃', ip: '192.168.1.100' },
];

const levelConfig = {
  INFO: { icon: Info, color: 'bg-blue-100 text-blue-700' },
  WARN: { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-700' },
  ERROR: { icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  SUCCESS: { icon: CheckCircle, color: 'bg-green-100 text-green-700' },
};

export function LogsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [...new Set(mockLogs.map(log => log.category))];

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch = log.details.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      log.action.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="p-6">
      <AdminPageHeader
        title="이력 분석 및 로그 관리"
        description="테넌트 활동 로그를 조회하고 분석합니다"
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
                <p className="text-sm text-text-secondary">정보</p>
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
                <p className="text-2xl font-bold">{mockLogs.filter(l => l.level === 'SUCCESS').length}</p>
                <p className="text-sm text-text-secondary">성공</p>
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
                <p className="text-sm text-text-secondary">경고</p>
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
                <p className="text-sm text-text-secondary">오류</p>
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
              <CardTitle>활동 로그</CardTitle>
              <CardDescription>테넌트 내 모든 활동 기록입니다</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="레벨" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="INFO">정보</SelectItem>
                  <SelectItem value="SUCCESS">성공</SelectItem>
                  <SelectItem value="WARN">경고</SelectItem>
                  <SelectItem value="ERROR">오류</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-28">
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
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-bg-secondary">
                  <Badge className={`${config.color} shrink-0`}>
                    <LevelIcon className="h-3 w-3 mr-1" />
                    {log.level}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{log.category}</Badge>
                      <span className="font-medium">{log.action}</span>
                      {log.user && (
                        <span className="text-sm text-text-secondary flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.user}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1">{log.details}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {log.timestamp}
                      </span>
                      {log.ip && <span>IP: {log.ip}</span>}
                    </div>
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
