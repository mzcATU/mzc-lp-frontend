import { useState } from 'react';
import {
  Save,
  RotateCcw,
  Users,
  BookOpen,
  FileText,
  Settings,
  BarChart3,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/common/Switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';

// Mock 데이터
const mockRoles = [
  { id: 'TENANT_ADMIN', name: '테넌트 관리자' },
  { id: 'CONTENT_MANAGER', name: '콘텐츠 관리자' },
  { id: 'INSTRUCTOR', name: '강사' },
  { id: 'LEARNER', name: '학습자' },
];

const mockPermissions: {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  items: {
    id: string;
    name: string;
    description: string;
    roles: Record<string, boolean>;
  }[];
}[] = [
  {
    category: '사용자 관리',
    icon: Users,
    items: [
      { id: 'users.view', name: '사용자 조회', description: '사용자 목록 및 상세 정보 조회', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: true, INSTRUCTOR: false, LEARNER: false } },
      { id: 'users.create', name: '사용자 생성', description: '새 사용자 계정 생성', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: false, INSTRUCTOR: false, LEARNER: false } },
      { id: 'users.edit', name: '사용자 수정', description: '사용자 정보 수정', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: false, INSTRUCTOR: false, LEARNER: false } },
      { id: 'users.delete', name: '사용자 삭제', description: '사용자 계정 삭제', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: false, INSTRUCTOR: false, LEARNER: false } },
    ],
  },
  {
    category: '강좌 관리',
    icon: BookOpen,
    items: [
      { id: 'courses.view', name: '강좌 조회', description: '모든 강좌 목록 조회', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: true, INSTRUCTOR: true, LEARNER: false } },
      { id: 'courses.create', name: '강좌 생성', description: '새 강좌 생성', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: true, INSTRUCTOR: true, LEARNER: false } },
      { id: 'courses.edit', name: '강좌 수정', description: '강좌 정보 수정', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: true, INSTRUCTOR: true, LEARNER: false } },
      { id: 'courses.publish', name: '강좌 게시', description: '강좌 공개 및 게시', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: true, INSTRUCTOR: false, LEARNER: false } },
    ],
  },
  {
    category: '콘텐츠 관리',
    icon: FileText,
    items: [
      { id: 'content.upload', name: '콘텐츠 업로드', description: '영상, 문서 등 콘텐츠 업로드', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: true, INSTRUCTOR: true, LEARNER: false } },
      { id: 'content.delete', name: '콘텐츠 삭제', description: '업로드된 콘텐츠 삭제', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: true, INSTRUCTOR: false, LEARNER: false } },
    ],
  },
  {
    category: '분석 및 리포트',
    icon: BarChart3,
    items: [
      { id: 'analytics.view', name: '분석 조회', description: '학습 분석 및 통계 조회', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: true, INSTRUCTOR: true, LEARNER: false } },
      { id: 'analytics.export', name: '리포트 내보내기', description: '분석 리포트 다운로드', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: true, INSTRUCTOR: false, LEARNER: false } },
    ],
  },
  {
    category: '설정',
    icon: Settings,
    items: [
      { id: 'settings.view', name: '설정 조회', description: '테넌트 설정 조회', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: false, INSTRUCTOR: false, LEARNER: false } },
      { id: 'settings.edit', name: '설정 수정', description: '테넌트 설정 변경', roles: { TENANT_ADMIN: true, CONTENT_MANAGER: false, INSTRUCTOR: false, LEARNER: false } },
    ],
  },
];

export function PermissionsPage() {
  const [permissions, setPermissions] = useState(mockPermissions);
  const [selectedRole, setSelectedRole] = useState('TENANT_ADMIN');

  const handlePermissionChange = (categoryIndex: number, itemIndex: number, roleId: string, value: boolean) => {
    const newPermissions = [...permissions];
    newPermissions[categoryIndex].items[itemIndex].roles[roleId] = value;
    setPermissions(newPermissions);
  };

  const handleReset = () => {
    setPermissions(mockPermissions);
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="접근 권한 설정"
        description="역할별 기능 접근 권한을 설정합니다"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </div>
        }
      />

      {/* Role Selector */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <span className="font-medium">역할 선택:</span>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-text-secondary">선택한 역할의 권한을 확인하고 수정합니다</span>
          </div>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <div className="space-y-6">
        {permissions.map((category, categoryIndex) => {
          const IconComponent = category.icon;

          return (
            <Card key={category.category}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-brand-primary" />
                  <CardTitle>{category.category}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-text-secondary">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        {mockRoles.map((role) => (
                          <div key={role.id} className="flex flex-col items-center gap-1">
                            {selectedRole === role.id || selectedRole === 'all' ? (
                              <>
                                <Switch
                                  checked={item.roles[role.id]}
                                  onCheckedChange={(v) => handlePermissionChange(categoryIndex, itemIndex, role.id, v)}
                                  disabled={role.id === 'TENANT_ADMIN'}
                                />
                                <span className="text-xs text-text-secondary">{role.name}</span>
                              </>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Reference */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>권한 요약</CardTitle>
          <CardDescription>각 역할별 권한 요약입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">권한</th>
                  {mockRoles.map((role) => (
                    <th key={role.id} className="text-center p-2">{role.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.flatMap((category) =>
                  category.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.name}</td>
                      {mockRoles.map((role) => (
                        <td key={role.id} className="text-center p-2">
                          {item.roles[role.id] ? (
                            <span className="text-green-600">&#10003;</span>
                          ) : (
                            <span className="text-gray-300">&#8212;</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
