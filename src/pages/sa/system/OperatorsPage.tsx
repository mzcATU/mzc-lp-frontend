import { useState } from 'react';
import {
  UserCog,
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Shield,
} from 'lucide-react';
import { AdminPageHeader, StatusBadge, RoleBadge } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/Avatar';
import type { UserStatus, SystemRole } from '@/types/admin';

// Mock 데이터
const mockOperators: {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: SystemRole;
  status: UserStatus;
  department: string;
  lastLogin: string;
  createdAt: string;
}[] = [
  { id: 1, name: '김시스템', email: 'kim.system@mzc.com', phone: '010-1234-5678', role: 'SYSTEM_ADMIN', status: 'ACTIVE', department: '시스템운영팀', lastLogin: '2025-12-30 09:15', createdAt: '2024-01-15' },
  { id: 2, name: '이운영', email: 'lee.ops@mzc.com', phone: '010-2345-6789', role: 'OPERATOR', status: 'ACTIVE', department: '고객지원팀', lastLogin: '2025-12-30 10:22', createdAt: '2024-03-20' },
  { id: 3, name: '박관리', email: 'park.admin@mzc.com', phone: '010-3456-7890', role: 'OPERATOR', status: 'ACTIVE', department: '기술지원팀', lastLogin: '2025-12-29 16:45', createdAt: '2024-06-10' },
  { id: 4, name: '최보안', email: 'choi.sec@mzc.com', phone: '010-4567-8901', role: 'SYSTEM_ADMIN', status: 'INACTIVE', department: '보안팀', lastLogin: '2025-12-01 11:30', createdAt: '2024-02-28' },
  { id: 5, name: '정모니터', email: 'jung.mon@mzc.com', phone: '010-5678-9012', role: 'OPERATOR', status: 'ACTIVE', department: '모니터링팀', lastLogin: '2025-12-30 08:00', createdAt: '2024-08-15' },
];

export function OperatorsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOperators = mockOperators.filter((op) => {
    const matchesSearch = op.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      op.email.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesRole = roleFilter === 'all' || op.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6">
      <AdminPageHeader
        title="운영자 관리"
        description="시스템 운영자를 관리합니다"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            운영자 추가
          </Button>
        }
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <UserCog className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockOperators.length}</p>
                <p className="text-sm text-text-secondary">전체 운영자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockOperators.filter(o => o.role === 'SYSTEM_ADMIN').length}</p>
                <p className="text-sm text-text-secondary">시스템 관리자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserCog className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockOperators.filter(o => o.role === 'OPERATOR').length}</p>
                <p className="text-sm text-text-secondary">일반 운영자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <UserCog className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockOperators.filter(o => o.status === 'ACTIVE').length}</p>
                <p className="text-sm text-text-secondary">활성 운영자</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operators List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>운영자 목록</CardTitle>
              <CardDescription>시스템에 등록된 운영자를 관리합니다</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="이름, 이메일 검색..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="역할" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 역할</SelectItem>
                  <SelectItem value="SYSTEM_ADMIN">시스템 관리자</SelectItem>
                  <SelectItem value="OPERATOR">운영자</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="ACTIVE">활성</SelectItem>
                  <SelectItem value="INACTIVE">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredOperators.map((operator) => (
              <div key={operator.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-bg-secondary transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${operator.name}`} />
                    <AvatarFallback>{operator.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{operator.name}</p>
                      <RoleBadge role={operator.role} />
                      <StatusBadge status={operator.status} />
                    </div>
                    <p className="text-sm text-text-secondary">{operator.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-text-secondary">
                      <Mail className="h-3 w-3" />
                      {operator.email}
                    </div>
                    <div className="flex items-center gap-1 text-text-secondary mt-1">
                      <Phone className="h-3 w-3" />
                      {operator.phone}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-text-secondary">최근 로그인</p>
                    <p>{operator.lastLogin}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
