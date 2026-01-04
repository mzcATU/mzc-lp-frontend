import { useState, useEffect } from 'react';
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
  Loader2,
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
import {
  useNavigationItems,
  useCreateNavigationItem,
  useUpdateNavigationItem,
  useDeleteNavigationItem,
  useResetNavigationItems,
} from '@/hooks/ta';
import type { NavigationItemRequest } from '@/services/ta/brandingService';

// 아이콘 매핑
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  BookOpen,
  Award,
  HelpCircle,
  Settings,
  ExternalLink,
};

// 로컬 편집용 타입
interface LocalNavItem {
  id: number;
  label: string;
  icon: string;
  path: string;
  enabled: boolean;
  displayOrder: number;
  target: string | null;
  isNew?: boolean; // 새로 추가된 항목 표시
  isDirty?: boolean; // 수정된 항목 표시
}

export function NavigationSettingsPage() {
  const [navItems, setNavItems] = useState<LocalNavItem[]>([]);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // API Hooks
  const { data: serverItems, isLoading } = useNavigationItems();
  const createItem = useCreateNavigationItem();
  const updateItem = useUpdateNavigationItem();
  const deleteItem = useDeleteNavigationItem();
  const resetItems = useResetNavigationItems();

  // 서버 데이터로 초기화
  useEffect(() => {
    if (serverItems) {
      setNavItems(serverItems.map(item => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        path: item.path,
        enabled: item.enabled,
        displayOrder: item.displayOrder,
        target: item.target,
      })));
      setHasUnsavedChanges(false);
    }
  }, [serverItems]);

  const handleToggle = (id: number) => {
    setNavItems(navItems.map(item =>
      item.id === id ? { ...item, enabled: !item.enabled, isDirty: true } : item
    ));
    setHasUnsavedChanges(true);
  };

  const handleDelete = async (id: number) => {
    const item = navItems.find(i => i.id === id);
    if (!item) return;

    if (item.isNew) {
      // 새로 추가된 항목은 로컬에서만 삭제
      setNavItems(navItems.filter(i => i.id !== id));
    } else {
      // 기존 항목은 서버에서 삭제
      await deleteItem.mutateAsync(id);
    }
  };

  const handleReset = async () => {
    await resetItems.mutateAsync();
    setEditingItem(null);
    setHasUnsavedChanges(false);
  };

  const handleAddItem = () => {
    const newId = Math.min(...navItems.map(i => i.id), 0) - 1; // 음수 ID로 새 항목 구분
    const newItem: LocalNavItem = {
      id: newId,
      label: '새 메뉴',
      icon: 'Home',
      path: '/',
      enabled: true,
      displayOrder: navItems.length + 1,
      target: null,
      isNew: true,
      isDirty: true,
    };
    setNavItems([...navItems, newItem]);
    setEditingItem(newId);
    setHasUnsavedChanges(true);
  };

  const handleUpdateLocalItem = (id: number, updates: Partial<LocalNavItem>) => {
    setNavItems(navItems.map(item =>
      item.id === id ? { ...item, ...updates, isDirty: true } : item
    ));
    setHasUnsavedChanges(true);
  };

  const handleSaveItem = async (id: number) => {
    const item = navItems.find(i => i.id === id);
    if (!item) return;

    const request: NavigationItemRequest = {
      label: item.label,
      icon: item.icon,
      path: item.path,
      enabled: item.enabled,
      displayOrder: item.displayOrder,
      target: item.target || undefined,
    };

    if (item.isNew) {
      // 새 항목 생성
      const created = await createItem.mutateAsync(request);
      // 로컬 상태 업데이트 (새 ID로 교체)
      setNavItems(navItems.map(i =>
        i.id === id ? { ...i, id: created.id, isNew: false, isDirty: false } : i
      ));
    } else {
      // 기존 항목 수정
      await updateItem.mutateAsync({ id, request });
      setNavItems(navItems.map(i =>
        i.id === id ? { ...i, isDirty: false } : i
      ));
    }
    setHasUnsavedChanges(navItems.some(i => i.id !== id && i.isDirty));
  };

  const handleSaveAll = async () => {
    const dirtyItems = navItems.filter(i => i.isDirty);

    for (const item of dirtyItems) {
      await handleSaveItem(item.id);
    }
    setHasUnsavedChanges(false);
  };

  const isSaving = createItem.isPending || updateItem.isPending || deleteItem.isPending || resetItems.isPending;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <AdminPageHeader
        title="네비게이션 구성 관리"
        description="사이드바 및 상단 네비게이션 메뉴를 설정합니다"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={resetItems.isPending}
            >
              {resetItems.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="mr-2 h-4 w-4" />
              )}
              초기화
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={!hasUnsavedChanges || isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              전체 저장
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
                <CardDescription>메뉴 항목을 추가하고 편집할 수 있습니다</CardDescription>
              </div>
              <Button onClick={handleAddItem}>
                <Plus className="mr-2 h-4 w-4" />
                메뉴 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {navItems.sort((a, b) => a.displayOrder - b.displayOrder).map((item) => {
                const IconComponent = iconMap[item.icon] || Home;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 border rounded-lg ${
                      item.enabled ? 'bg-white' : 'bg-gray-50 opacity-60'
                    } ${item.isDirty ? 'border-yellow-400' : ''} ${item.isNew ? 'border-green-400' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-text-secondary cursor-grab" />
                      <div className="p-2 bg-bg-secondary rounded">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.label}</p>
                          {item.isNew && (
                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">새 항목</span>
                          )}
                          {item.isDirty && !item.isNew && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">수정됨</span>
                          )}
                        </div>
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
                      {item.isDirty && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600"
                          onClick={() => handleSaveItem(item.id)}
                          disabled={isSaving}
                        >
                          {(createItem.isPending || updateItem.isPending) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteItem.isPending}
                      >
                        {deleteItem.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
              {navItems.length === 0 && (
                <div className="text-center py-8 text-text-secondary">
                  네비게이션 항목이 없습니다. 메뉴를 추가해 주세요.
                </div>
              )}
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
                          onChange={(e) => handleUpdateLocalItem(editingItem, { label: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>경로</Label>
                        <Input
                          value={item.path}
                          onChange={(e) => handleUpdateLocalItem(editingItem, { path: e.target.value })}
                          placeholder="/path 또는 https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>아이콘</Label>
                        <Select
                          value={item.icon}
                          onValueChange={(v) => handleUpdateLocalItem(editingItem, { icon: v })}
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
                      <div className="space-y-2">
                        <Label>링크 대상</Label>
                        <Select
                          value={item.target || '_self'}
                          onValueChange={(v) => handleUpdateLocalItem(editingItem, { target: v === '_self' ? null : v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_self">현재 창</SelectItem>
                            <SelectItem value="_blank">새 창</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="pt-4 border-t">
                        <Button
                          onClick={() => handleSaveItem(item.id)}
                          disabled={!item.isDirty || isSaving}
                          className="w-full"
                        >
                          {isSaving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          {item.isNew ? '항목 추가' : '변경사항 저장'}
                        </Button>
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
                      .sort((a, b) => a.displayOrder - b.displayOrder)
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
                    {navItems.filter(item => item.enabled).length === 0 && (
                      <div className="text-center py-4 text-text-secondary text-sm">
                        활성화된 메뉴가 없습니다
                      </div>
                    )}
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
