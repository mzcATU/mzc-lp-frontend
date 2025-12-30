import { useState } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  RotateCcw,
  Home,
  BookOpen,
  Award,
  HelpCircle,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/domain/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Switch } from '@/components/common/Switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';

// Mock 데이터
const mockNavItems: {
  id: number;
  label: string;
  icon: string;
  path: string;
  enabled: boolean;
  order: number;
}[] = [
  { id: 1, label: '홈', icon: 'Home', path: '/', enabled: true, order: 1 },
  { id: 2, label: '강좌', icon: 'BookOpen', path: '/courses', enabled: true, order: 2 },
  { id: 3, label: '내 학습', icon: 'Award', path: '/my-learning', enabled: true, order: 3 },
  { id: 4, label: '도움말', icon: 'HelpCircle', path: '/help', enabled: true, order: 4 },
  { id: 5, label: '외부 링크', icon: 'ExternalLink', path: 'https://example.com', enabled: false, order: 5 },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  BookOpen,
  Award,
  HelpCircle,
  Settings,
  ExternalLink,
};

export function NavigationSettingsPage() {
  const [navItems, setNavItems] = useState(mockNavItems);
  const [editingItem, setEditingItem] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setNavItems(navItems.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const handleDelete = (id: number) => {
    setNavItems(navItems.filter(item => item.id !== id));
  };

  const handleReset = () => {
    setNavItems(mockNavItems);
  };

  const handleAddItem = () => {
    const newId = Math.max(...navItems.map(i => i.id)) + 1;
    setNavItems([...navItems, {
      id: newId,
      label: '새 메뉴',
      icon: 'Home',
      path: '/',
      enabled: true,
      order: navItems.length + 1,
    }]);
    setEditingItem(newId);
  };

  return (
    <div className="p-6">
      <AdminPageHeader
        title="네비게이션 구성 관리"
        description="사이드바 및 상단 네비게이션 메뉴를 설정합니다"
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

      <div className="grid grid-cols-2 gap-6">
        {/* Navigation Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>네비게이션 메뉴</CardTitle>
                <CardDescription>메뉴 항목을 드래그하여 순서를 변경할 수 있습니다</CardDescription>
              </div>
              <Button onClick={handleAddItem}>
                <Plus className="mr-2 h-4 w-4" />
                메뉴 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {navItems.sort((a, b) => a.order - b.order).map((item) => {
                const IconComponent = iconMap[item.icon] || Home;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      item.enabled ? 'bg-white' : 'bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-text-secondary cursor-grab" />
                      <div className="p-2 bg-bg-secondary rounded">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-text-secondary">{item.path}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.enabled}
                        onCheckedChange={() => handleToggle(item.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Edit Panel / Preview */}
        <div className="space-y-6">
          {/* Edit Panel */}
          {editingItem && (
            <Card>
              <CardHeader>
                <CardTitle>메뉴 편집</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const item = navItems.find(i => i.id === editingItem);
                  if (!item) return null;

                  return (
                    <>
                      <div className="space-y-2">
                        <Label>메뉴 이름</Label>
                        <Input
                          value={item.label}
                          onChange={(e) => setNavItems(navItems.map(i =>
                            i.id === editingItem ? { ...i, label: e.target.value } : i
                          ))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>경로</Label>
                        <Input
                          value={item.path}
                          onChange={(e) => setNavItems(navItems.map(i =>
                            i.id === editingItem ? { ...i, path: e.target.value } : i
                          ))}
                          placeholder="/path 또는 https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>아이콘</Label>
                        <Select
                          value={item.icon}
                          onValueChange={(v) => setNavItems(navItems.map(i =>
                            i.id === editingItem ? { ...i, icon: v } : i
                          ))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Home">홈</SelectItem>
                            <SelectItem value="BookOpen">강좌</SelectItem>
                            <SelectItem value="Award">학습</SelectItem>
                            <SelectItem value="HelpCircle">도움말</SelectItem>
                            <SelectItem value="Settings">설정</SelectItem>
                            <SelectItem value="ExternalLink">외부 링크</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>미리보기</CardTitle>
              <CardDescription>실제 네비게이션 모습입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                {/* Mock Sidebar */}
                <div className="w-56 bg-gray-50 p-3">
                  <div className="space-y-1">
                    {navItems
                      .filter(item => item.enabled)
                      .sort((a, b) => a.order - b.order)
                      .map((item) => {
                        const IconComponent = iconMap[item.icon] || Home;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                          >
                            <IconComponent className="h-4 w-4 text-text-secondary" />
                            <span className="text-sm">{item.label}</span>
                            {item.path.startsWith('http') && (
                              <ExternalLink className="h-3 w-3 ml-auto text-text-secondary" />
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
