import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import {
  ImageIcon,
  Trash2,
  GripVertical,
  Plus,
  Eye,
  EyeOff,
  Users,
  Monitor,
  Link as LinkIcon,
  Calendar,
  Pencil,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Switch,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  TagInput,
  EmptyState,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  DateRangePicker,
} from '@/components/common';
import {
  BannerImageDropzone,
  TargetingSelector,
  BannerPreview,
} from '@/components/domain/ta';
import {
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  useActivateBanner,
  useDeactivateBanner,
} from '@/hooks/ta';
import type {
  BannerResponse,
  CreateBannerRequest,
} from '@/types/ta/banner.types';

// 타겟팅 데이터 타입 (UI용)
interface TargetingData {
  departments: string[];
  jobRoles: string[];
  positions: string[];
  ranks: string[];
}

// 확장된 배너 타입 (UI용 필드 포함)
interface BannerFormData {
  title: string;
  pcImageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  hiddenTags: string[];
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  isAllTarget: boolean;
  targeting: TargetingData;
}

// 드래그 가능한 배너 아이템 컴포넌트
interface SortableBannerItemProps {
  banner: BannerResponse;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
  isToggling: boolean;
  isDeleting: boolean;
}

function SortableBannerItem({
  banner,
  onEdit,
  onToggleActive,
  onDelete,
  isToggling,
  isDeleting,
}: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
        isDragging ? 'shadow-lg' : 'hover:shadow-md'
      }`}
      {...attributes}
    >
      {/* 드래그 핸들 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              {...listeners}
              className="p-2 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = designTokens.bg.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <GripVertical
                className="w-5 h-5"
                style={{ color: designTokens.text.placeholder }}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>드래그하여 순서 변경</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* 썸네일 */}
      <div
        className="w-32 h-20 rounded-lg bg-cover bg-center flex-shrink-0 border"
        style={{
          backgroundImage: `url(${banner.imageUrl})`,
          borderColor: designTokens.bg.border,
        }}
      />

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <p
            className="font-semibold text-base truncate"
            style={{ color: designTokens.text.primary }}
          >
            {banner.title}
          </p>
          <Badge
            variant={banner.isActive ? 'green' : 'gray'}
            className="text-xs flex-shrink-0"
          >
            {banner.isActive ? '활성' : '비활성'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* 대상 */}
          <Badge variant="indigo" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            전체
          </Badge>
          {/* 기간 */}
          {banner.startDate && banner.endDate && (
            <Badge variant="orange" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              기간 제한
            </Badge>
          )}
          {/* 링크 */}
          {banner.linkUrl && (
            <Badge variant="gray" className="text-xs">
              <LinkIcon className="w-3 h-3 mr-1" />
              링크
            </Badge>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-2">
        {/* 수정 버튼 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onEdit}
                className="p-2.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: designTokens.bg.secondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = designTokens.bg.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = designTokens.bg.secondary;
                }}
              >
                <Pencil
                  className="w-4 h-4"
                  style={{ color: designTokens.text.secondary }}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>수정</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 활성화 토글 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleActive}
                disabled={isToggling}
                className="p-2.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: banner.isActive
                    ? designTokens.status.success_background
                    : designTokens.bg.secondary,
                }}
              >
                {isToggling ? (
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{ color: designTokens.text.secondary }}
                  />
                ) : banner.isActive ? (
                  <Eye
                    className="w-4 h-4"
                    style={{ color: designTokens.status.success_text }}
                  />
                ) : (
                  <EyeOff
                    className="w-4 h-4"
                    style={{ color: designTokens.text.placeholder }}
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {banner.isActive ? '비활성화' : '활성화'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 삭제 버튼 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDelete}
                disabled={isDeleting}
                className="p-2.5 rounded-lg transition-colors"
                style={{ backgroundColor: designTokens.status.error_background }}
              >
                {isDeleting ? (
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{ color: designTokens.status.error_text }}
                  />
                ) : (
                  <Trash2
                    className="w-4 h-4"
                    style={{ color: designTokens.status.error_text }}
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>삭제</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

// 슬라이드 패널 컴포넌트
interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function SlidePanel({ isOpen, onClose, title, children }: SlidePanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-40 transition-opacity"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      />

      {/* 패널 */}
      <div
        className="fixed right-0 top-0 h-full z-50 shadow-2xl flex flex-col transition-transform duration-300"
        style={{
          width: '600px',
          backgroundColor: designTokens.bg.default,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* 헤더 */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: designTokens.bg.border }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: designTokens.text.primary }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = designTokens.bg.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </>
  );
}

/**
 * TA 배너 관리 페이지
 * - 홈 배너 관리 (드래그 앤 드롭)
 * - 타겟팅 노출 설정 (직무, 직급, 직책, 부서)
 * - PC/Mobile 미리보기
 */
export const BannerManagementPage = () => {
  // API Hooks
  const { data: banners = [], isLoading, refetch } = useBanners();
  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();
  const activateBannerMutation = useActivateBanner();
  const deactivateBannerMutation = useDeactivateBanner();

  // Local State
  const [selectedBanner, setSelectedBanner] = useState<BannerResponse | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 편집 폼 상태
  const [editForm, setEditForm] = useState<BannerFormData>({
    title: '',
    pcImageUrl: '',
    mobileImageUrl: '',
    linkUrl: '',
    hiddenTags: [],
    isActive: true,
    isAllTarget: true,
    targeting: { departments: [], jobRoles: [], positions: [], ranks: [] },
  });

  // 새 배너 상태
  const [newBanner, setNewBanner] = useState<Partial<BannerFormData>>({
    title: '',
    pcImageUrl: '',
    mobileImageUrl: '',
    linkUrl: '',
    hiddenTags: [],
    isActive: true,
    isAllTarget: true,
    targeting: { departments: [], jobRoles: [], positions: [], ranks: [] },
  });
  const [newBannerTags, setNewBannerTags] = useState<string[]>([]);
  const [newBannerDateRange, setNewBannerDateRange] = useState<DateRange | undefined>();

  // 드래그 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 종료 핸들러 (순서 변경은 현재 지원하지 않음)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // 순서 변경 API가 없어 로컬에서만 순서 변경 UI를 보여줌
      toast.info('배너 순서 변경 기능은 준비 중입니다.');
    }
  };

  const toggleBannerActive = (banner: BannerResponse) => {
    setTogglingId(banner.id);

    const mutation = banner.isActive ? deactivateBannerMutation : activateBannerMutation;
    const successMessage = banner.isActive ? '배너가 비활성화되었습니다.' : '배너가 활성화되었습니다.';

    mutation.mutate(banner.id, {
      onSuccess: () => {
        toast.success(successMessage);
        refetch();
      },
      onError: () => {
        toast.error('배너 상태 변경에 실패했습니다.');
      },
      onSettled: () => {
        setTogglingId(null);
      },
    });
  };

  const deleteBanner = (id: number) => {
    if (!confirm('정말로 이 배너를 삭제하시겠습니까?')) return;

    setDeletingId(id);
    deleteBannerMutation.mutate(id, {
      onSuccess: () => {
        toast.success('배너가 삭제되었습니다.');
        if (selectedBanner?.id === id) {
          setSelectedBanner(null);
          setIsPanelOpen(false);
        }
        refetch();
      },
      onError: () => {
        toast.error('배너 삭제에 실패했습니다.');
      },
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  const openEditPanel = (banner: BannerResponse) => {
    setSelectedBanner(banner);
    setEditForm({
      title: banner.title,
      pcImageUrl: banner.imageUrl,
      mobileImageUrl: banner.mobileImageUrl || '',
      linkUrl: banner.linkUrl || '',
      hiddenTags: [],
      isActive: banner.isActive,
      startDate: banner.startDate ? new Date(banner.startDate) : undefined,
      endDate: banner.endDate ? new Date(banner.endDate) : undefined,
      isAllTarget: true,
      targeting: { departments: [], jobRoles: [], positions: [], ranks: [] },
    });
    setEditingTags([]);
    setActiveTab('basic');
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setSelectedBanner(null);
    }, 300);
  };

  const updateEditForm = <K extends keyof BannerFormData>(
    key: K,
    value: BannerFormData[K]
  ) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateEditFormTags = (tags: string[]) => {
    setEditingTags(tags);
    updateEditForm('hiddenTags', tags);
  };

  const handleSaveEdit = () => {
    if (!selectedBanner) return;

    // LocalDate 형식 (YYYY-MM-DD)으로 변환
    const formatDate = (date: Date | undefined) => {
      if (!date) return undefined;
      return date.toISOString().split('T')[0];
    };

    updateBannerMutation.mutate(
      {
        id: selectedBanner.id,
        request: {
          title: editForm.title,
          imageUrl: editForm.pcImageUrl,
          linkUrl: editForm.linkUrl || undefined,
          isActive: editForm.isActive,
          startDate: formatDate(editForm.startDate),
          endDate: formatDate(editForm.endDate),
        },
      },
      {
        onSuccess: () => {
          toast.success('배너가 수정되었습니다.');
          closePanel();
          refetch();
        },
        onError: () => {
          toast.error('배너 수정에 실패했습니다.');
        },
      }
    );
  };

  const handleAddBanner = () => {
    if (!newBanner.title || !newBanner.pcImageUrl) {
      toast.error('필수 항목을 입력해주세요.');
      return;
    }

    // LocalDate 형식 (YYYY-MM-DD)으로 변환
    const formatDate = (date: Date | undefined): string | null => {
      if (!date) return null;
      return date.toISOString().split('T')[0];
    };

    const request: CreateBannerRequest = {
      title: newBanner.title,
      imageUrl: newBanner.pcImageUrl,
      position: 'MAIN_TOP',
      linkUrl: newBanner.linkUrl || null,
      linkTarget: newBanner.linkUrl ? '_self' : null,
      sortOrder: null,
      startDate: formatDate(newBannerDateRange?.from),
      endDate: formatDate(newBannerDateRange?.to),
      description: null,
    };

    console.log('Creating banner with request:', request);

    createBannerMutation.mutate(request, {
      onSuccess: () => {
        toast.success('배너가 추가되었습니다.');
        setShowAddModal(false);
        resetNewBannerForm();
        refetch();
      },
      onError: (error: unknown) => {
        console.error('Banner creation error:', error);
        const axiosError = error as { response?: { data?: { message?: string } } };
        const message = axiosError?.response?.data?.message || '배너 추가에 실패했습니다.';
        toast.error(message);
      },
    });
  };

  const resetNewBannerForm = () => {
    setNewBanner({
      title: '',
      pcImageUrl: '',
      mobileImageUrl: '',
      linkUrl: '',
      hiddenTags: [],
      isActive: true,
      isAllTarget: true,
      targeting: { departments: [], jobRoles: [], positions: [], ranks: [] },
    });
    setNewBannerTags([]);
    setNewBannerDateRange(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: designTokens.text.secondary }} />
      </div>
    );
  }

  return (
    <div
      className="p-10 min-h-full"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-[28px] font-semibold mb-2"
              style={{ color: designTokens.text.primary }}
            >
              배너 관리
            </h1>
            <p className="text-sm" style={{ color: designTokens.text.secondary }}>
              홈 화면에 표시될 배너를 관리합니다. 드래그하여 순서를 변경할 수 있습니다.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowPreview(true)}
              disabled={banners.filter((b) => b.isActive).length === 0}
            >
              <Monitor className="w-4 h-4" />
              미리보기
            </Button>
            <Button
              className="gap-2"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" />
              배너 추가
            </Button>
          </div>
        </div>

        {/* 배너 목록 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>배너 목록</CardTitle>
              <p
                className="text-sm"
                style={{ color: designTokens.text.secondary }}
              >
                총 {banners.length}개 · 활성 {banners.filter((b) => b.isActive).length}개
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {banners.length === 0 ? (
              <EmptyState
                icon={ImageIcon}
                title="등록된 배너가 없습니다"
                description="새 배너를 추가하여 홈 화면을 꾸며보세요."
                className="py-12"
              />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={banners.map((b) => b.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {banners.map((banner) => (
                      <SortableBannerItem
                        key={banner.id}
                        banner={banner}
                        onEdit={() => openEditPanel(banner)}
                        onToggleActive={() => toggleBannerActive(banner)}
                        onDelete={() => deleteBanner(banner.id)}
                        isToggling={togglingId === banner.id}
                        isDeleting={deletingId === banner.id}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 수정 슬라이드 패널 */}
      <SlidePanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        title="배너 설정"
      >
        {selectedBanner && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="basic" className="gap-2 text-sm">
                <ImageIcon className="w-4 h-4" />
                기본 정보
              </TabsTrigger>
              <TabsTrigger value="targeting" className="gap-2 text-sm">
                <Users className="w-4 h-4" />
                노출 대상
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2 text-sm">
                <Monitor className="w-4 h-4" />
                미리보기
              </TabsTrigger>
            </TabsList>

            {/* 기본 정보 탭 */}
            <TabsContent value="basic" className="space-y-5">
              {/* 배너 제목 */}
              <div>
                <Label className="mb-2 block text-sm">배너 제목 (관리용)</Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => updateEditForm('title', e.target.value)}
                  placeholder="배너를 식별할 수 있는 제목을 입력하세요"
                />
              </div>

              {/* 이미지 업로드 */}
              <div className="space-y-4">
                <BannerImageDropzone
                  value={editForm.pcImageUrl}
                  onChange={(url) => updateEditForm('pcImageUrl', url)}
                  label="PC 배너 이미지"
                  recommendedSize="1200x400px"
                  deviceType="pc"
                />
                <BannerImageDropzone
                  value={editForm.mobileImageUrl}
                  onChange={(url) => updateEditForm('mobileImageUrl', url)}
                  label="Mobile 배너 이미지 (선택)"
                  recommendedSize="600x400px"
                  aspectRatio="aspect-[3/2]"
                  deviceType="mobile"
                />
              </div>

              {/* 연결 URL */}
              <div>
                <Label className="mb-2 block text-sm flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  연결 URL
                </Label>
                <Input
                  value={editForm.linkUrl || ''}
                  onChange={(e) => updateEditForm('linkUrl', e.target.value)}
                  placeholder="https://example.com/course/123"
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: designTokens.text.placeholder }}
                >
                  배너 클릭 시 이동할 URL을 입력하세요 (선택사항)
                </p>
              </div>

              {/* 연결 태그 */}
              <div>
                <Label className="mb-2 block text-sm">연결 태그</Label>
                <p
                  className="text-xs mb-2"
                  style={{ color: designTokens.text.secondary }}
                >
                  배너 클릭 시 이 태그들로 콘텐츠가 필터링됩니다.
                </p>
                <TagInput
                  value={editingTags}
                  onChange={updateEditFormTags}
                  placeholder="태그 입력 후 Enter"
                />
              </div>

              {/* 노출 기간 */}
              <div>
                <Label className="mb-2 block text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  노출 기간 (선택)
                </Label>
                <DateRangePicker
                  date={
                    editForm.startDate && editForm.endDate
                      ? {
                          from: editForm.startDate,
                          to: editForm.endDate,
                        }
                      : undefined
                  }
                  onDateChange={(range) => {
                    updateEditForm('startDate', range?.from);
                    updateEditForm('endDate', range?.to);
                  }}
                  placeholder="기간을 선택하세요"
                  className="w-full"
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: designTokens.text.placeholder }}
                >
                  설정하지 않으면 항상 노출됩니다
                </p>
              </div>

              {/* 활성화 */}
              <div
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: designTokens.bg.secondary }}
              >
                <div>
                  <Label className="text-sm">배너 활성화</Label>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: designTokens.text.secondary }}
                  >
                    활성화된 배너만 홈 화면에 표시됩니다
                  </p>
                </div>
                <Switch
                  checked={editForm.isActive}
                  onCheckedChange={(checked) => updateEditForm('isActive', checked)}
                />
              </div>

              {/* 저장 버튼 */}
              <Button
                onClick={handleSaveEdit}
                disabled={updateBannerMutation.isPending}
                className="w-full gap-2"
                style={{
                  backgroundColor: designTokens.button.brand_default,
                  color: designTokens.button.brand_text,
                }}
              >
                {updateBannerMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                저장
              </Button>
            </TabsContent>

            {/* 노출 대상 탭 */}
            <TabsContent value="targeting">
              <TargetingSelector
                value={editForm.targeting}
                onChange={(targeting) => updateEditForm('targeting', targeting)}
                isAllTarget={editForm.isAllTarget}
                onAllTargetChange={(isAll) => updateEditForm('isAllTarget', isAll)}
              />
            </TabsContent>

            {/* 미리보기 탭 */}
            <TabsContent value="preview">
              <BannerPreview
                banners={[
                  {
                    id: selectedBanner.id.toString(),
                    title: editForm.title,
                    pcImageUrl: editForm.pcImageUrl,
                    mobileImageUrl: editForm.mobileImageUrl,
                    linkUrl: editForm.linkUrl,
                    isActive: true,
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        )}
      </SlidePanel>

      {/* 전체 미리보기 모달 */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              배너 미리보기
            </DialogTitle>
            <DialogDescription>
              활성화된 배너가 홈 화면에 어떻게 표시되는지 미리 확인합니다.
            </DialogDescription>
          </DialogHeader>
          <BannerPreview
            banners={banners
              .filter((b) => b.isActive)
              .map((b) => ({
                id: b.id.toString(),
                title: b.title,
                pcImageUrl: b.imageUrl,
                mobileImageUrl: b.mobileImageUrl ?? undefined,
                linkUrl: b.linkUrl ?? undefined,
                isActive: b.isActive,
              }))}
          />
        </DialogContent>
      </Dialog>

      {/* 배너 추가 모달 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              새 배너 추가
            </DialogTitle>
            <DialogDescription>
              홈 화면에 표시할 새 배너를 등록합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 배너 제목 */}
            <div>
              <Label className="mb-2 block">
                배너 제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newBanner.title || ''}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, title: e.target.value })
                }
                placeholder="배너를 식별할 수 있는 제목을 입력하세요"
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="grid grid-cols-2 gap-4">
              <BannerImageDropzone
                value={newBanner.pcImageUrl}
                onChange={(url) =>
                  setNewBanner({ ...newBanner, pcImageUrl: url })
                }
                label="PC 배너 이미지 *"
                recommendedSize="1200x400px"
                deviceType="pc"
              />
              <BannerImageDropzone
                value={newBanner.mobileImageUrl}
                onChange={(url) =>
                  setNewBanner({ ...newBanner, mobileImageUrl: url })
                }
                label="Mobile 배너 이미지 (선택)"
                recommendedSize="600x400px"
                aspectRatio="aspect-[3/2]"
                deviceType="mobile"
              />
            </div>

            {/* 연결 URL */}
            <div>
              <Label className="mb-2 block flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                연결 URL
              </Label>
              <Input
                value={newBanner.linkUrl || ''}
                onChange={(e) =>
                  setNewBanner({ ...newBanner, linkUrl: e.target.value })
                }
                placeholder="https://example.com/course/123"
              />
            </div>

            {/* 연결 태그 */}
            <div>
              <Label className="mb-2 block">연결 태그</Label>
              <TagInput
                value={newBannerTags}
                onChange={setNewBannerTags}
                placeholder="태그 입력 후 Enter"
              />
            </div>

            {/* 노출 기간 */}
            <div>
              <Label className="mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                노출 기간 (선택)
              </Label>
              <DateRangePicker
                date={newBannerDateRange}
                onDateChange={setNewBannerDateRange}
                placeholder="기간을 선택하세요"
                className="w-full"
              />
            </div>

            {/* 노출 대상 */}
            <div>
              <Label className="mb-2 block flex items-center gap-2">
                <Users className="w-4 h-4" />
                노출 대상
              </Label>
              <TargetingSelector
                value={
                  newBanner.targeting ?? {
                    departments: [],
                    jobRoles: [],
                    positions: [],
                    ranks: [],
                  }
                }
                onChange={(targeting) =>
                  setNewBanner({ ...newBanner, targeting })
                }
                isAllTarget={newBanner.isAllTarget ?? true}
                onAllTargetChange={(isAll) =>
                  setNewBanner({ ...newBanner, isAllTarget: isAll })
                }
              />
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                resetNewBannerForm();
              }}
              className="gap-1"
            >
              <X className="w-4 h-4" />
              취소
            </Button>
            <Button
              onClick={handleAddBanner}
              disabled={!newBanner.title || !newBanner.pcImageUrl || createBannerMutation.isPending}
              className="gap-1"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              {createBannerMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
