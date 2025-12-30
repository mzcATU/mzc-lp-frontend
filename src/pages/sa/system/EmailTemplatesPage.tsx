import { useState } from 'react';
import {
  Mail,
  Plus,
  Search,
  Edit,
  Copy,
  Eye,
  Send,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/common/Tabs';

// Mock 데이터
const mockTemplates: {
  id: number;
  name: string;
  code: string;
  category: 'AUTH' | 'NOTIFICATION' | 'MARKETING' | 'SYSTEM';
  subject: string;
  description: string;
  lastModified: string;
  isActive: boolean;
}[] = [
  { id: 1, name: '회원가입 환영', code: 'WELCOME', category: 'AUTH', subject: '[MZC Learn] 회원가입을 환영합니다!', description: '새 사용자 회원가입 시 발송', lastModified: '2025-12-28', isActive: true },
  { id: 2, name: '비밀번호 재설정', code: 'PASSWORD_RESET', category: 'AUTH', subject: '[MZC Learn] 비밀번호 재설정 안내', description: '비밀번호 재설정 요청 시 발송', lastModified: '2025-12-27', isActive: true },
  { id: 3, name: '이메일 인증', code: 'EMAIL_VERIFY', category: 'AUTH', subject: '[MZC Learn] 이메일 인증을 완료해주세요', description: '이메일 인증 요청 시 발송', lastModified: '2025-12-26', isActive: true },
  { id: 4, name: '수강신청 완료', code: 'ENROLLMENT_COMPLETE', category: 'NOTIFICATION', subject: '[MZC Learn] 수강신청이 완료되었습니다', description: '수강신청 완료 시 발송', lastModified: '2025-12-25', isActive: true },
  { id: 5, name: '과정 완료 축하', code: 'COURSE_COMPLETE', category: 'NOTIFICATION', subject: '[MZC Learn] 축하합니다!', description: '과정 완료 시 발송', lastModified: '2025-12-23', isActive: true },
  { id: 6, name: '뉴스레터', code: 'NEWSLETTER', category: 'MARKETING', subject: '[MZC Learn] 이번 주 추천 강좌', description: '정기 뉴스레터', lastModified: '2025-12-20', isActive: false },
  { id: 7, name: '시스템 점검 안내', code: 'MAINTENANCE', category: 'SYSTEM', subject: '[MZC Learn] 시스템 점검 안내', description: '시스템 점검 공지', lastModified: '2025-12-15', isActive: true },
];

const categoryConfig = {
  AUTH: { label: '인증', color: 'bg-blue-100 text-blue-700' },
  NOTIFICATION: { label: '알림', color: 'bg-green-100 text-green-700' },
  MARKETING: { label: '마케팅', color: 'bg-purple-100 text-purple-700' },
  SYSTEM: { label: '시스템', color: 'bg-gray-100 text-gray-700' },
};

export function EmailTemplatesPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      template.code.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <AdminPageHeader
        title="이메일 템플릿 관리"
        description="시스템에서 발송되는 이메일 템플릿을 관리합니다"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            템플릿 추가
          </Button>
        }
      />

      <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="AUTH">인증</TabsTrigger>
          <TabsTrigger value="NOTIFICATION">알림</TabsTrigger>
          <TabsTrigger value="MARKETING">마케팅</TabsTrigger>
          <TabsTrigger value="SYSTEM">시스템</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input
            placeholder="템플릿 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const category = categoryConfig[template.category];
          return (
            <Card key={template.id} className={!template.isActive ? 'opacity-60' : ''}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-bg-secondary rounded-lg">
                      <Mail className="h-4 w-4 text-text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <code className="text-xs text-text-secondary">{template.code}</code>
                    </div>
                  </div>
                  <Badge className={category.color}>{category.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">수정: {template.lastModified}</span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
