import { useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Pin,
  Calendar,
  Send,
  Archive,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Label } from '@/components/common/Label';
import { Textarea } from '@/components/common/Textarea';
import { Checkbox } from '@/components/common/Checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/common/Dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/common/Select';
import { Switch } from '@/components/common/Switch';
import {
  useNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
  usePublishNotice,
  useArchiveNotice,
  useDistributeNotice,
  useDistributeAllNotice,
  useTenants,
} from '@/hooks/sa';
import type {
  Notice,
  NoticeType,
  NoticeStatus,
  CreateNoticeRequest,
  UpdateNoticeRequest,
} from '@/types/admin';

const typeConfig: Record<NoticeType, { label: string; color: string }> = {
  GENERAL: { label: '일반', color: 'bg-gray-100 text-gray-700' },
  UPDATE: { label: '업데이트', color: 'bg-blue-100 text-blue-700' },
  SYSTEM: { label: '시스템', color: 'bg-yellow-100 text-yellow-700' },
  EVENT: { label: '이벤트', color: 'bg-purple-100 text-purple-700' },
};

const statusConfig: Record<NoticeStatus, { label: string; color: string }> = {
  DRAFT: { label: '초안', color: 'bg-gray-100 text-gray-600' },
  PUBLISHED: { label: '게시됨', color: 'bg-green-100 text-green-700' },
  ARCHIVED: { label: '보관됨', color: 'bg-orange-100 text-orange-700' },
};

export function NoticesContent() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<NoticeStatus | 'ALL'>('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);

  // Publish & Distribute state
  const [publishTarget, setPublishTarget] = useState<Notice | null>(null);
  const [distributeToAll, setDistributeToAll] = useState(true);
  const [selectedTenantIds, setSelectedTenantIds] = useState<number[]>([]);

  // Form state
  const [formData, setFormData] = useState<CreateNoticeRequest>({
    title: '',
    content: '',
    type: 'GENERAL',
    isPinned: false,
  });

  // API Hooks
  const { data: noticesData, isLoading } = useNotices({
    keyword: searchKeyword || undefined,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
  });
  const { data: tenantsData } = useTenants({});
  const createMutation = useCreateNotice();
  const updateMutation = useUpdateNotice();
  const deleteMutation = useDeleteNotice();
  const publishMutation = usePublishNotice();
  const archiveMutation = useArchiveNotice();
  const distributeMutation = useDistributeNotice();
  const distributeAllMutation = useDistributeAllNotice();

  const notices = noticesData?.content || [];
  const totalNotices = noticesData?.totalElements || 0;
  const tenants = tenantsData?.content || [];

  const handleCreateOpen = () => {
    setFormData({
      title: '',
      content: '',
      type: 'GENERAL',
      isPinned: false,
    });
    setIsCreateOpen(true);
  };

  const handleEditOpen = (notice: Notice) => {
    setFormData({
      title: notice.title,
      content: notice.content,
      type: notice.type,
      isPinned: notice.isPinned,
    });
    setEditingNotice(notice);
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    await createMutation.mutateAsync(formData);
    setIsCreateOpen(false);
  };

  const handleUpdate = async () => {
    if (!editingNotice || !formData.title.trim() || !formData.content.trim()) return;
    const request: UpdateNoticeRequest = {
      title: formData.title,
      content: formData.content,
      type: formData.type,
      isPinned: formData.isPinned,
    };
    await updateMutation.mutateAsync({ id: editingNotice.id, request });
    setEditingNotice(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handlePublishOpen = (notice: Notice) => {
    setPublishTarget(notice);
    setDistributeToAll(true);
    setSelectedTenantIds([]);
  };

  const handlePublishAndDistribute = async () => {
    if (!publishTarget) return;

    try {
      // 1. 먼저 발행
      await publishMutation.mutateAsync(publishTarget.id);

      // 2. 배포
      if (distributeToAll) {
        await distributeAllMutation.mutateAsync(publishTarget.id);
        toast.success('공지사항이 모든 테넌트에 발행되었습니다.');
      } else if (selectedTenantIds.length > 0) {
        await distributeMutation.mutateAsync({
          id: publishTarget.id,
          request: { tenantIds: selectedTenantIds },
        });
        toast.success(`공지사항이 ${selectedTenantIds.length}개 테넌트에 발행되었습니다.`);
      } else {
        toast.success('공지사항이 발행되었습니다. (배포 대상 없음)');
      }

      setPublishTarget(null);
    } catch {
      toast.error('공지사항 발행에 실패했습니다.');
    }
  };

  const handleTenantSelect = (tenantId: number, checked: boolean) => {
    if (checked) {
      setSelectedTenantIds((prev) => [...prev, tenantId]);
    } else {
      setSelectedTenantIds((prev) => prev.filter((id) => id !== tenantId));
    }
  };

  const handleArchive = async (id: number) => {
    await archiveMutation.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreateOpen}>
          <Plus className="mr-2 h-4 w-4" />
          공지 작성
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>공지사항 목록</CardTitle>
              <CardDescription>전체 {totalNotices}개의 공지사항</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as NoticeStatus | 'ALL')}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="DRAFT">초안</SelectItem>
                  <SelectItem value="PUBLISHED">게시됨</SelectItem>
                  <SelectItem value="ARCHIVED">보관됨</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notices.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                {searchKeyword ? '검색 결과가 없습니다' : '등록된 공지사항이 없습니다'}
              </div>
            ) : (
              notices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-bg-secondary"
                >
                  <div className="flex items-start gap-3">
                    {notice.isPinned && <Pin className="h-4 w-4 text-brand-primary mt-1" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notice.title}</h3>
                        <Badge className={typeConfig[notice.type].color}>
                          {typeConfig[notice.type].label}
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
                            배포: {notice.distributionCount}개 테넌트
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {notice.status === 'DRAFT' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePublishOpen(notice)}
                        disabled={publishMutation.isPending}
                        title="발행 및 배포"
                      >
                        <Send className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    {notice.status === 'PUBLISHED' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchive(notice.id)}
                        disabled={archiveMutation.isPending}
                        title="보관"
                      >
                        <Archive className="h-4 w-4 text-orange-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditOpen(notice)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => setDeleteTarget(notice)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>새 공지사항 작성</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>제목 *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>유형</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v as NoticeType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">일반</SelectItem>
                    <SelectItem value="UPDATE">업데이트</SelectItem>
                    <SelectItem value="SYSTEM">시스템</SelectItem>
                    <SelectItem value="EVENT">이벤트</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="isPinned"
                  checked={formData.isPinned}
                  onCheckedChange={(v) => setFormData({ ...formData, isPinned: v })}
                />
                <Label htmlFor="isPinned">상단 고정</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>내용 *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="공지사항 내용을 입력하세요"
                rows={8}
              />
            </div>
            <div className="space-y-2">
              <Label>만료일 (선택)</Label>
              <Input
                type="datetime-local"
                value={formData.expiredAt ? formData.expiredAt.slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, expiredAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
              />
              <p className="text-xs text-text-secondary">설정하지 않으면 무기한 게시됩니다.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              취소
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.title.trim() || !formData.content.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? '생성 중...' : '생성'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingNotice} onOpenChange={() => setEditingNotice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>공지사항 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>제목 *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>유형</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: v as NoticeType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">일반</SelectItem>
                    <SelectItem value="UPDATE">업데이트</SelectItem>
                    <SelectItem value="SYSTEM">시스템</SelectItem>
                    <SelectItem value="EVENT">이벤트</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="isPinnedEdit"
                  checked={formData.isPinned}
                  onCheckedChange={(v) => setFormData({ ...formData, isPinned: v })}
                />
                <Label htmlFor="isPinnedEdit">상단 고정</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>내용 *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="공지사항 내용을 입력하세요"
                rows={8}
              />
            </div>
            <div className="space-y-2">
              <Label>만료일 (선택)</Label>
              <Input
                type="datetime-local"
                value={formData.expiredAt ? formData.expiredAt.slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, expiredAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
              />
              <p className="text-xs text-text-secondary">설정하지 않으면 무기한 게시됩니다.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNotice(null)}>
              취소
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!formData.title.trim() || !formData.content.trim() || updateMutation.isPending}
            >
              {updateMutation.isPending ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공지사항 삭제</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            "{deleteTarget?.title}" 공지사항을 삭제하시겠습니까?
            <br />
            <span className="text-sm text-text-secondary">
              이 작업은 되돌릴 수 없습니다.
            </span>
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish & Distribute Dialog */}
      <Dialog open={!!publishTarget} onOpenChange={() => setPublishTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>공지사항 발행 및 배포</DialogTitle>
            <DialogDescription>
              "{publishTarget?.title}" 공지를 발행하고 배포할 테넌트를 선택하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">배포 대상</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant={distributeToAll ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDistributeToAll(true)}
                >
                  모든 테넌트
                </Button>
                <Button
                  variant={!distributeToAll ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDistributeToAll(false)}
                >
                  선택한 테넌트
                </Button>
              </div>
            </div>

            {!distributeToAll && (
              <div className="space-y-3">
                <Label className="text-sm text-text-secondary">
                  배포할 테넌트를 선택하세요 ({selectedTenantIds.length}개 선택됨)
                </Label>
                <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {tenants.length === 0 ? (
                    <p className="text-sm text-text-secondary text-center py-4">
                      등록된 테넌트가 없습니다.
                    </p>
                  ) : (
                    tenants.map((tenant) => (
                      <div
                        key={tenant.tenantId}
                        className="flex items-center gap-3 p-2 hover:bg-bg-secondary rounded"
                      >
                        <Checkbox
                          id={`tenant-${tenant.tenantId}`}
                          checked={selectedTenantIds.includes(tenant.tenantId)}
                          onCheckedChange={(checked) =>
                            handleTenantSelect(tenant.tenantId, checked === true)
                          }
                        />
                        <label
                          htmlFor={`tenant-${tenant.tenantId}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-xs text-text-secondary">{tenant.code}</div>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPublishTarget(null)}>
              취소
            </Button>
            <Button
              onClick={handlePublishAndDistribute}
              disabled={
                publishMutation.isPending ||
                distributeMutation.isPending ||
                distributeAllMutation.isPending ||
                (!distributeToAll && selectedTenantIds.length === 0)
              }
            >
              {(publishMutation.isPending ||
                distributeMutation.isPending ||
                distributeAllMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              발행 및 배포
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
