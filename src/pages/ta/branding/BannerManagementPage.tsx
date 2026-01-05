import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
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
  arrayMove,
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

// 타겟팅 데이터 타입
interface TargetingData {
  departments: string[];
  jobRoles: string[];
  positions: string[];
  ranks: string[];
}

// 배너 타입 정의
interface Banner {
  id: string;
  title: string;
  pcImageUrl: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  hiddenTags: string[];
  isActive: boolean;
  order: number;
  startDate?: Date;
  endDate?: Date;
  isAllTarget: boolean;
  targeting: TargetingData;
}

// 샘플 배너 데이터
const sampleBanners: Banner[] = [
  {
    id: '1',
    title: '2025 신입사원 필수교육',
    pcImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
    linkUrl: 'https://learning.company.com/courses/new-employee-2025',
    hiddenTags: ['신입사원', '필수교육'],
    isActive: true,
    order: 1,
    isAllTarget: true,
    targeting: { departments: [], jobRoles: [], positions: [], ranks: [] },
  },
  {
    id: '2',
    title: '리더십 캠프 2025',
    pcImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
    linkUrl: 'https://learning.company.com/events/leadership-camp',
    hiddenTags: ['리더십', '캠프'],
    isActive: true,
    order: 2,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-31'),
    isAllTarget: false,
    targeting: {
      departments: [],
      jobRoles: [],
      positions: ['team_leader', 'dept_leader'],
      ranks: ['manager', 'deputy', 'general'],
    },
  },
  {
    id: '3',
    title: 'AI 활용 업무 효율화',
    pcImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=400&fit=crop',
    mobileImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    linkUrl: 'https://learning.company.com/courses/ai-productivity',
    hiddenTags: ['AI', '업무효율'],
    isActive: false,
    order: 3,
    isAllTarget: false,
    targeting: {
      departments: ['dev', 'marketing'],
      jobRoles: [],
      positions: [],
      ranks: [],
    },
  },
];

// 드래그 가능한 배너 아이템 컴포넌트
interface SortableBannerItemProps {
  banner: Banner;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

function SortableBannerItem({
  banner,
  onEdit,
  onToggleActive,
  onDelete,
}: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTargetLabel = () => {
    if (banner.isAllTarget) return '전체';
    const { targeting } = banner;
    const totalSelected =
      targeting.departments.length +
      targeting.jobRoles.length +
      targeting.positions.length +
      targeting.ranks.length;
    return totalSelected > 0 ? `${totalSelected}개 조건` : '미설정';
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
          backgroundImage: `url(${banner.pcImageUrl})`,
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
          {/* 태그 */}
          {banner.hiddenTags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="gray" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {banner.hiddenTags.length > 3 && (
            <Badge variant="gray" className="text-xs">
              +{banner.hiddenTags.length - 3}
            </Badge>
          )}
          {/* 구분선 */}
          <span style={{ color: designTokens.bg.border }}>|</span>
          {/* 대상 */}
          <Badge
            variant={banner.isAllTarget ? 'indigo' : 'blue'}
            className="text-xs"
          >
            <Users className="w-3 h-3 mr-1" />
            {getTargetLabel()}
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
                className="p-2.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: banner.isActive
                    ? designTokens.status.success_background
                    : designTokens.bg.secondary,
                }}
              >
                {banner.isActive ? (
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
                className="p-2.5 rounded-lg transition-colors"
                style={{ backgroundColor: designTokens.status.error_background }}
              >
                <Trash2
                  className="w-4 h-4"
                  style={{ color: designTokens.status.error_text }}
                />
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
  const [banners, setBanners] = useState<Banner[]>(sampleBanners);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('basic');

  // 새 배너 상태
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
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

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBanners((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
      });
    }
  };

  const toggleBannerActive = (id: string) => {
    setBanners(
      banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    if (selectedBanner?.id === id) {
      setSelectedBanner((prev) =>
        prev ? { ...prev, isActive: !prev.isActive } : null
      );
    }
  };

  const deleteBanner = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
    if (selectedBanner?.id === id) {
      setSelectedBanner(null);
      setIsPanelOpen(false);
    }
  };

  const openEditPanel = (banner: Banner) => {
    setSelectedBanner(banner);
    setEditingTags(banner.hiddenTags);
    setActiveTab('basic');
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => {
      setSelectedBanner(null);
    }, 300);
  };

  const updateSelectedBanner = <K extends keyof Banner>(
    key: K,
    value: Banner[K]
  ) => {
    if (!selectedBanner) return;

    const updated = { ...selectedBanner, [key]: value };
    setSelectedBanner(updated);
    setBanners(banners.map((b) => (b.id === selectedBanner.id ? updated : b)));
  };

  const updateSelectedBannerTags = (tags: string[]) => {
    setEditingTags(tags);
    if (selectedBanner) {
      updateSelectedBanner('hiddenTags', tags);
    }
  };

  const handleAddBanner = () => {
    if (!newBanner.title || !newBanner.pcImageUrl) return;

    const banner: Banner = {
      id: Date.now().toString(),
      title: newBanner.title,
      pcImageUrl: newBanner.pcImageUrl,
      mobileImageUrl: newBanner.mobileImageUrl,
      linkUrl: newBanner.linkUrl,
      hiddenTags: newBannerTags,
      isActive: newBanner.isActive ?? true,
      order: banners.length + 1,
      startDate: newBannerDateRange?.from,
      endDate: newBannerDateRange?.to,
      isAllTarget: newBanner.isAllTarget ?? true,
      targeting: newBanner.targeting ?? {
        departments: [],
        jobRoles: [],
        positions: [],
        ranks: [],
      },
    };

    setBanners([...banners, banner]);
    setShowAddModal(false);
    resetNewBannerForm();
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
                  items={banners.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {banners.map((banner) => (
                      <SortableBannerItem
                        key={banner.id}
                        banner={banner}
                        onEdit={() => openEditPanel(banner)}
                        onToggleActive={() => toggleBannerActive(banner.id)}
                        onDelete={() => deleteBanner(banner.id)}
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
                  value={selectedBanner.title}
                  onChange={(e) => updateSelectedBanner('title', e.target.value)}
                  placeholder="배너를 식별할 수 있는 제목을 입력하세요"
                />
              </div>

              {/* 이미지 업로드 */}
              <div className="space-y-4">
                <BannerImageDropzone
                  value={selectedBanner.pcImageUrl}
                  onChange={(url) => updateSelectedBanner('pcImageUrl', url)}
                  label="PC 배너 이미지"
                  recommendedSize="1200x400px"
                  deviceType="pc"
                />
                <BannerImageDropzone
                  value={selectedBanner.mobileImageUrl}
                  onChange={(url) => updateSelectedBanner('mobileImageUrl', url)}
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
                  value={selectedBanner.linkUrl || ''}
                  onChange={(e) => updateSelectedBanner('linkUrl', e.target.value)}
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
                  onChange={updateSelectedBannerTags}
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
                    selectedBanner.startDate && selectedBanner.endDate
                      ? {
                          from: selectedBanner.startDate,
                          to: selectedBanner.endDate,
                        }
                      : undefined
                  }
                  onDateChange={(range) => {
                    updateSelectedBanner('startDate', range?.from);
                    updateSelectedBanner('endDate', range?.to);
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
                  checked={selectedBanner.isActive}
                  onCheckedChange={() => toggleBannerActive(selectedBanner.id)}
                />
              </div>
            </TabsContent>

            {/* 노출 대상 탭 */}
            <TabsContent value="targeting">
              <TargetingSelector
                value={selectedBanner.targeting}
                onChange={(targeting) => updateSelectedBanner('targeting', targeting)}
                isAllTarget={selectedBanner.isAllTarget}
                onAllTargetChange={(isAll) => updateSelectedBanner('isAllTarget', isAll)}
              />
            </TabsContent>

            {/* 미리보기 탭 */}
            <TabsContent value="preview">
              <BannerPreview
                banners={[
                  {
                    id: selectedBanner.id,
                    title: selectedBanner.title,
                    pcImageUrl: selectedBanner.pcImageUrl,
                    mobileImageUrl: selectedBanner.mobileImageUrl,
                    linkUrl: selectedBanner.linkUrl,
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
          </DialogHeader>
          <BannerPreview
            banners={banners
              .filter((b) => b.isActive)
              .map((b) => ({
                id: b.id,
                title: b.title,
                pcImageUrl: b.pcImageUrl,
                mobileImageUrl: b.mobileImageUrl,
                linkUrl: b.linkUrl,
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
              disabled={!newBanner.title || !newBanner.pcImageUrl}
              className="gap-1"
              style={{
                backgroundColor: designTokens.button.brand_default,
                color: designTokens.button.brand_text,
              }}
            >
              <Save className="w-4 h-4" />
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
