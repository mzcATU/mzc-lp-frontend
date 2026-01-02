import { useState } from 'react';
import {
  ImageIcon,
  Trash2,
  GripVertical,
  Plus,
  Eye,
  EyeOff,
  Users,
  Monitor,
  ChevronLeft,
  ChevronRight,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
} from '@/components/common';

// 노출 대상 타입
type TargetType = 'ALL' | 'DEPARTMENT' | 'POSITION' | 'INDIVIDUAL';

// 배너 타입 정의
interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  mobileImageUrl?: string;
  hiddenTags: string[];
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  targetType: TargetType;
  targetValues?: string[];
}

// 샘플 부서/직급 데이터
const sampleDepartments = ['개발팀', '마케팅팀', '인사팀', '영업팀', '경영지원팀'];
const samplePositions = ['사원', '대리', '과장', '차장', '부장', '팀장', '부서장', '임원'];

// 샘플 배너 데이터
const sampleBanners: Banner[] = [
  {
    id: '1',
    title: '2025 신입사원 필수교육',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop',
    hiddenTags: ['신입사원', '필수교육'],
    isActive: true,
    order: 1,
    targetType: 'ALL',
  },
  {
    id: '2',
    title: '리더십 캠프 2025',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
    hiddenTags: ['리더십', '캠프'],
    isActive: true,
    order: 2,
    targetType: 'POSITION',
    targetValues: ['부서장', '팀장'],
  },
  {
    id: '3',
    title: 'AI 활용 업무 효율화',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=400&fit=crop',
    hiddenTags: ['AI', '업무효율'],
    isActive: false,
    order: 3,
    targetType: 'DEPARTMENT',
    targetValues: ['개발팀'],
  },
];

// 노출 대상 라벨
const targetTypeLabels: Record<TargetType, string> = {
  ALL: '전체 임직원',
  DEPARTMENT: '특정 부서',
  POSITION: '특정 직급/직책',
  INDIVIDUAL: '개별 지정',
};

// 드래그 가능한 배너 아이템 컴포넌트
interface SortableBannerItemProps {
  banner: Banner;
  isSelected: boolean;
  onSelect: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

function SortableBannerItem({
  banner,
  isSelected,
  onSelect,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'border-2 shadow-sm'
          : 'hover:shadow-sm'
      } ${isDragging ? 'shadow-lg' : ''}`}
      onClick={onSelect}
      {...attributes}
    >
      {/* 드래그 핸들 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              {...listeners}
              className="p-1 rounded cursor-grab active:cursor-grabbing transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = designTokens.bg.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical
                className="w-4 h-4"
                style={{ color: designTokens.text.placeholder }}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>드래그하여 순서 변경</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* 썸네일 */}
      <div
        className="w-24 h-14 rounded bg-cover bg-center flex-shrink-0 border"
        style={{
          backgroundImage: `url(${banner.imageUrl})`,
          borderColor: designTokens.bg.border,
        }}
      />

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className="font-medium truncate"
            style={{ color: designTokens.text.primary }}
          >
            {banner.title}
          </p>
          {/* 상태 뱃지 */}
          <Badge
            variant={banner.isActive ? 'green' : 'gray'}
            className="text-xs flex-shrink-0"
          >
            {banner.isActive ? '활성' : '비활성'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          {/* 태그 */}
          <div className="flex gap-1">
            {banner.hiddenTags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="gray" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {banner.hiddenTags.length > 2 && (
              <Badge variant="gray" className="text-xs">
                +{banner.hiddenTags.length - 2}
              </Badge>
            )}
          </div>
          {/* 대상 */}
          <Badge
            variant={banner.targetType === 'ALL' ? 'indigo' : 'blue'}
            className="text-xs"
          >
            <Users className="w-3 h-3 mr-1" />
            {banner.targetType === 'ALL'
              ? '전체'
              : banner.targetValues?.slice(0, 2).join(', ')}
            {banner.targetValues && banner.targetValues.length > 2 && (
              <span> 외 {banner.targetValues.length - 2}</span>
            )}
          </Badge>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleActive();
                }}
                className="p-2 rounded-lg transition-colors"
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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 rounded-lg transition-colors"
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

/**
 * TO 배너 관리 페이지
 * - 홈 배너 관리 (드래그 앤 드롭)
 */
export function BrandingPage() {
  const [banners, setBanners] = useState<Banner[]>(sampleBanners);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [editingTags, setEditingTags] = useState<string[]>([]);

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
        // order 업데이트
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
    }
  };

  const selectBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setEditingTags(banner.hiddenTags);
  };

  const updateSelectedBannerTags = (tags: string[]) => {
    setEditingTags(tags);
    if (selectedBanner) {
      setSelectedBanner({ ...selectedBanner, hiddenTags: tags });
      setBanners(
        banners.map((b) =>
          b.id === selectedBanner.id ? { ...b, hiddenTags: tags } : b
        )
      );
    }
  };

  const toggleTargetValue = (value: string) => {
    if (!selectedBanner) return;

    const currentValues = selectedBanner.targetValues || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    setSelectedBanner({ ...selectedBanner, targetValues: newValues });
    setBanners(
      banners.map((b) =>
        b.id === selectedBanner.id ? { ...b, targetValues: newValues } : b
      )
    );
  };

  const activeBanners = banners.filter((b) => b.isActive);

  // 미리보기에서 배너 이동
  const nextPreviewBanner = () => {
    setPreviewIndex((prev) => (prev + 1) % activeBanners.length);
  };
  const prevPreviewBanner = () => {
    setPreviewIndex(
      (prev) => (prev - 1 + activeBanners.length) % activeBanners.length
    );
  };

  return (
    <div
      className="p-10 min-h-full"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-[28px] font-semibold mb-2"
            style={{ color: designTokens.text.primary }}
          >
            배너 관리
          </h1>
          <p
            className="text-sm"
            style={{ color: designTokens.text.secondary }}
          >
            홈 화면에 표시될 배너를 관리합니다.
          </p>
        </div>

        {/* 홈 배너 관리 */}
        <div className="grid grid-cols-3 gap-6">
          {/* 배너 목록 */}
          <div className="col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>배너 목록</CardTitle>
                  <p
                    className="text-sm mt-1"
                    style={{ color: designTokens.text.secondary }}
                  >
                    드래그하여 순서를 변경할 수 있습니다
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    style={{
                      borderColor: designTokens.bg.border,
                      color: designTokens.text.primary,
                      backgroundColor: designTokens.bg.default,
                    }}
                    onClick={() => {
                      setPreviewIndex(0);
                      setShowPreview(true);
                    }}
                    disabled={activeBanners.length === 0}
                  >
                    <Monitor className="w-4 h-4" />
                    미리보기
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1"
                    style={{
                      backgroundColor: designTokens.button.brand_default,
                      color: designTokens.button.brand_text,
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    배너 추가
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {banners.length === 0 ? (
                  <EmptyState
                    icon={ImageIcon}
                    title="등록된 배너가 없습니다"
                    description="새 배너를 추가하여 홈 화면을 꾸며보세요."
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
                      <div className="space-y-2">
                        {banners.map((banner) => (
                          <SortableBannerItem
                            key={banner.id}
                            banner={banner}
                            isSelected={selectedBanner?.id === banner.id}
                            onSelect={() => selectBanner(banner)}
                            onToggleActive={() =>
                              toggleBannerActive(banner.id)
                            }
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

          {/* 배너 상세 편집 */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>배너 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedBanner ? (
                  <>
                    {/* 배너 제목 */}
                    <div>
                      <Label className="mb-1 block">배너 제목 (관리용)</Label>
                      <Input defaultValue={selectedBanner.title} />
                    </div>

                    {/* 이미지 업로드 */}
                    <div>
                      <Label className="mb-1 block">배너 이미지</Label>
                      <div
                        className="aspect-[3/1] rounded-lg bg-cover bg-center border relative group overflow-hidden"
                        style={{
                          backgroundImage: `url(${selectedBanner.imageUrl})`,
                          borderColor: designTokens.bg.border,
                        }}
                      >
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            style={{
                              borderColor: designTokens.bg.border,
                              color: designTokens.bg.default,
                              backgroundColor: 'transparent',
                            }}
                          >
                            <ImageIcon className="w-4 h-4" />
                            변경
                          </Button>
                        </div>
                      </div>
                      <p
                        className="text-xs mt-1"
                        style={{ color: designTokens.text.placeholder }}
                      >
                        권장: 1200x400px
                      </p>
                    </div>

                    {/* 연결 태그 */}
                    <div>
                      <Label className="mb-1 block">연결 태그</Label>
                      <p
                        className="text-xs mb-2"
                        style={{ color: designTokens.text.secondary }}
                      >
                        배너 클릭 시 이 태그들로 필터링됩니다.
                      </p>
                      <TagInput
                        value={editingTags}
                        onChange={updateSelectedBannerTags}
                        placeholder="태그 입력 후 Enter"
                      />
                    </div>

                    {/* 노출 대상 */}
                    <div>
                      <Label className="mb-1 block">노출 대상</Label>
                      <Select
                        value={selectedBanner.targetType}
                        onValueChange={(value: TargetType) => {
                          setSelectedBanner({
                            ...selectedBanner,
                            targetType: value,
                            targetValues: value === 'ALL' ? undefined : [],
                          });
                          setBanners(
                            banners.map((b) =>
                              b.id === selectedBanner.id
                                ? {
                                    ...b,
                                    targetType: value,
                                    targetValues:
                                      value === 'ALL' ? undefined : [],
                                  }
                                : b
                            )
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(targetTypeLabels).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>

                      {/* 부서 선택 */}
                      {selectedBanner.targetType === 'DEPARTMENT' && (
                        <div className="mt-2">
                          <p
                            className="text-xs mb-1"
                            style={{ color: designTokens.text.secondary }}
                          >
                            부서 선택 (클릭하여 토글)
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {sampleDepartments.map((dept) => (
                              <button
                                key={dept}
                                type="button"
                                onClick={() => toggleTargetValue(dept)}
                              >
                                <Badge
                                  variant={
                                    selectedBanner.targetValues?.includes(dept)
                                      ? 'blue'
                                      : 'gray'
                                  }
                                  className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                  {dept}
                                </Badge>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 직급 선택 */}
                      {selectedBanner.targetType === 'POSITION' && (
                        <div className="mt-2">
                          <p
                            className="text-xs mb-1"
                            style={{ color: designTokens.text.secondary }}
                          >
                            직급/직책 선택 (클릭하여 토글)
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {samplePositions.map((pos) => (
                              <button
                                key={pos}
                                type="button"
                                onClick={() => toggleTargetValue(pos)}
                              >
                                <Badge
                                  variant={
                                    selectedBanner.targetValues?.includes(pos)
                                      ? 'blue'
                                      : 'gray'
                                  }
                                  className="text-xs cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                  {pos}
                                </Badge>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 개별 지정 */}
                      {selectedBanner.targetType === 'INDIVIDUAL' && (
                        <div className="mt-2">
                          <Input placeholder="사용자 이름 또는 사번 검색" />
                        </div>
                      )}
                    </div>

                    {/* 노출 기간 */}
                    <div>
                      <Label className="mb-1 block">노출 기간 (선택)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="date" placeholder="시작일" />
                        <Input type="date" placeholder="종료일" />
                      </div>
                    </div>

                    {/* 활성화 */}
                    <div
                      className="flex items-center justify-between pt-2 p-3 rounded-lg"
                      style={{ backgroundColor: designTokens.bg.secondary }}
                    >
                      <div>
                        <Label>배너 활성화</Label>
                        <p
                          className="text-xs"
                          style={{ color: designTokens.text.secondary }}
                        >
                          활성화된 배너만 홈 화면에 표시됩니다
                        </p>
                      </div>
                      <Switch
                        checked={selectedBanner.isActive}
                        onCheckedChange={() =>
                          toggleBannerActive(selectedBanner.id)
                        }
                      />
                    </div>

                    <Button
                      className="w-full mt-4"
                      style={{
                        backgroundColor: designTokens.button.brand_default,
                        color: designTokens.button.brand_text,
                      }}
                    >
                      저장
                    </Button>
                  </>
                ) : (
                  <EmptyState
                    icon={ImageIcon}
                    title="배너를 선택하세요"
                    description="왼쪽 목록에서 배너를 선택하여 설정을 편집할 수 있습니다."
                    className="py-8"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 미리보기 모달 */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black/95">
          <DialogHeader className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-white" />
                <DialogTitle className="text-white">배너 미리보기</DialogTitle>
                <Badge variant="gray" className="text-xs">
                  {previewIndex + 1} / {activeBanners.length}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          {activeBanners.length > 0 && (
            <div className="p-6">
              {/* 배너 이미지 */}
              <div className="relative">
                <div
                  className="w-full aspect-[3/1] rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${activeBanners[previewIndex]?.imageUrl})`,
                  }}
                />

                {/* 네비게이션 */}
                {activeBanners.length > 1 && (
                  <>
                    <button
                      onClick={prevPreviewBanner}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={nextPreviewBanner}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </>
                )}

                {/* 인디케이터 */}
                {activeBanners.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {activeBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPreviewIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === previewIndex
                            ? 'w-6 bg-white'
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 배너 정보 */}
              <div className="mt-4 p-4 rounded-lg bg-white/10">
                <p className="text-white font-medium mb-2">
                  {activeBanners[previewIndex]?.title}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {activeBanners[previewIndex]?.hiddenTags.map((tag) => (
                      <Badge key={tag} variant="gray" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant="blue" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {activeBanners[previewIndex]?.targetType === 'ALL'
                      ? '전체 임직원'
                      : activeBanners[previewIndex]?.targetValues?.join(', ')}
                  </Badge>
                </div>
                <p className="text-white/60 text-xs mt-2">
                  클릭 시 연결 태그로 콘텐츠가 필터링됩니다.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
