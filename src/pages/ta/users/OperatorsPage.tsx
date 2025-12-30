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
import { AdminPageHeader, StatusBadge } from '@/components/domain/admin';
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
import type { UserStatus } from '@/types/admin';

// Mock 데이터
const mockOperators: {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'TENANT_ADMIN' | 'CONTENT_MANAGER' | 'INSTRUCTOR';
  status: UserStatus;
  department: string;
  lastLogin: string;
  createdAt: string;
}[] = [
  { id: 1, name: '김관리', email: 'kim.admin@company.com', phone: '010-1234-5678', role: 'TENANT_ADMIN', status: 'ACTIVE', department: '교육운영팀', lastLogin: '2025-12-30 09:15', createdAt: '2024-01-15' },
  { id: 2, name: '이콘텐츠', email: 'lee.content@company.com', phone: '010-2345-6789', role: 'CONTENT_MANAGER', status: 'ACTIVE', department: '콘텐츠팀', lastLogin: '2025-12-30 10:22', createdAt: '2024-03-20' },
  { id: 3, name: '박강사', email: 'park.inst@company.com', phone: '010-3456-7890', role: 'INSTRUCTOR', status: 'ACTIVE', department: '기술교육팀', lastLogin: '2025-12-29 16:45', createdAt: '2024-06-10' },
  { id: 4, name: '최운영', email: 'choi.ops@company.com', phone: '010-4567-8901', role: 'CONTENT_MANAGER', status: 'INACTIVE', department: '교육운영팀', lastLogin: '2025-12-01 11:30', createdAt: '2024-02-28' },
];

const roleLabels = {
  TENANT_ADMIN: '테넌트 관리자',
  CONTENT_MANAGER: '콘텐츠 관리자',
  INSTRUCTOR: '강사',
};

export function OperatorsPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredOperators = mockOperators.filter((op) => {
    const matchesSearch = op.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      op.email.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesRole = roleFilter === 'all' || op.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6">
      <AdminPageHeader
        title="운영자 관리"
        description="테넌트 운영자를 관리합니다"
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockOperators.filter(o => o.role === 'TENANT_ADMIN').length}</p>
                <p className="text-sm text-text-secondary">테넌트 관리자</p>
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
                <p className="text-2xl font-bold">{mockOperators.filter(o => o.role === 'CONTENT_MANAGER').length}</p>
                <p className="text-sm text-text-secondary">콘텐츠 관리자</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCog className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockOperators.filter(o => o.role === 'INSTRUCTOR').length}</p>
                <p className="text-sm text-text-secondary">강사</p>
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
              <CardDescription>테넌트에 등록된 운영자를 관리합니다</CardDescription>
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
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="역할" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 역할</SelectItem>
                  <SelectItem value="TENANT_ADMIN">테넌트 관리자</SelectItem>
                  <SelectItem value="CONTENT_MANAGER">콘텐츠 관리자</SelectItem>
                  <SelectItem value="INSTRUCTOR">강사</SelectItem>
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
                      <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                        {roleLabels[operator.role]}
                      </span>
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
