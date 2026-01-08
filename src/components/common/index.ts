/**
 * Common Components Index
 *
 * 8개 카테고리로 구성된 공통 컴포넌트 라이브러리
 * - 바이브코딩 디자인 유지보수를 위한 체계적 분류
 *
 * 카테고리:
 * 1. PRIMITIVES - 기본 UI 요소 (Button, Input, Badge 등)
 * 2. FORM INPUTS - 폼 입력 요소 (Checkbox, Select, Radio 등)
 * 3. OVERLAY - 떠있는 UI (Dialog, Popover, Tooltip 등)
 * 4. LAYOUT - 레이아웃 컨테이너 (Card, Tabs, Accordion 등)
 * 5. DATA DISPLAY - 데이터 표시 (Table, Avatar, Chart 등)
 * 6. FEEDBACK - 피드백/상태 표시 (Alert, Toast, EmptyState)
 * 7. NAVIGATION - 네비게이션 (Breadcrumb, Pagination, Stepper 등)
 * 8. DOMAIN SPECIFIC - 도메인 특화 컴포넌트 (StatCard, FileUpload 등)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PRIMITIVES - 기본 UI 요소
// ═══════════════════════════════════════════════════════════════════════════════
// 가장 기본적인 UI 빌딩 블록. 다른 컴포넌트의 기반이 됨.

export { Button, buttonVariants } from './Button';
export { Input } from './Input';
export { Textarea } from './Textarea';
export { Label } from './Label';
export { Badge, badgeVariants, CategoryBadge } from './Badge';
export { Separator } from './Separator';
export { Skeleton } from './Skeleton';

// ═══════════════════════════════════════════════════════════════════════════════
// 2. FORM INPUTS - 폼 입력 요소
// ═══════════════════════════════════════════════════════════════════════════════
// 사용자 입력을 받는 컴포넌트들.
// - NativeSelect: 간단한 HTML select (빠른 구현)
// - Select: Radix 기반 커스텀 드롭다운 (스타일 커스텀 필요시)
// - Combobox: 검색 가능한 선택 (옵션이 많을 때)
// - RadioOptionCard: 카드형 라디오 (설명이 필요한 옵션)

export { Checkbox } from './Checkbox';
export { Switch } from './Switch';
export { NativeSelect } from './NativeSelect';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './Select';
export { Combobox, MultiCombobox } from './Combobox';
export { RadioGroup, RadioGroupItem } from './RadioGroup';
export { RadioOptionCard } from './RadioOptionCard';
export { TagInput } from './TagInput';
export { Slider } from './Slider';
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from './Form';
export { DateRangePicker, DatePicker } from './DateRangePicker';

// ═══════════════════════════════════════════════════════════════════════════════
// 3. OVERLAY - 떠있는 UI (모달, 팝업)
// ═══════════════════════════════════════════════════════════════════════════════
// 화면 위에 떠서 표시되는 컴포넌트들.
// - Dialog: 일반 모달 (폼, 상세정보)
// - AlertDialog: 확인/취소 모달 (삭제 확인 등)
// - Sheet: 사이드 슬라이드 패널
// - Popover: 클릭시 나타나는 작은 패널
// - Tooltip: 호버시 나타나는 힌트

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './Dialog';

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog';

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from './Sheet';

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from './Drawer';

export { Popover, PopoverTrigger, PopoverContent } from './Popover';
export { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard';
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './Tooltip';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './DropdownMenu';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from './ContextMenu';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './Command';

// ═══════════════════════════════════════════════════════════════════════════════
// 4. LAYOUT - 레이아웃 컨테이너
// ═══════════════════════════════════════════════════════════════════════════════
// 콘텐츠를 담는 컨테이너 컴포넌트들.
// - Card: 기본 카드 컨테이너
// - Tabs: 탭 레이아웃
// - Accordion: 접기/펼치기 리스트
// - Collapsible: 단일 접기/펼치기

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from './Card';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './Collapsible';

export { ScrollArea, ScrollBar } from './ScrollArea';
export { AspectRatio } from './AspectRatio';

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './Resizable';

// ═══════════════════════════════════════════════════════════════════════════════
// 5. DATA DISPLAY - 데이터 표시
// ═══════════════════════════════════════════════════════════════════════════════
// 데이터를 시각적으로 표시하는 컴포넌트들.
// - DataTable: TanStack Table 기반 고급 테이블 (정렬, 필터, 검색, 페이지네이션, 행 클릭)
// - Table: 기본 테이블 요소 (DataTable 내부용)

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './Table';

export { DataTable, DataTableColumnHeader } from './DataTable';

export { Avatar, AvatarImage, AvatarFallback } from './Avatar';
export { Progress } from './Progress';
export { Calendar } from './Calendar';

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
} from './Chart';

export { Timeline, TimelineItem, HorizontalTimeline, HorizontalTimelineItem } from './Timeline';

// ═══════════════════════════════════════════════════════════════════════════════
// 6. FEEDBACK - 피드백/상태 표시
// ═══════════════════════════════════════════════════════════════════════════════
// 사용자에게 상태나 결과를 알려주는 컴포넌트들.
// - Alert: 인라인 알림 메시지
// - Toaster (Sonner): 토스트 알림
// - EmptyState: 데이터 없음 상태

export { Alert, AlertTitle, AlertDescription } from './Alert';
export { Toaster } from './Sonner';
export { EmptyState, NoResultsEmpty, NoDataEmpty } from './EmptyState';

// ═══════════════════════════════════════════════════════════════════════════════
// 7. NAVIGATION - 네비게이션
// ═══════════════════════════════════════════════════════════════════════════════
// 페이지/섹션 간 이동을 위한 컴포넌트들.

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './Breadcrumb';

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
} from './NavigationMenu';

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
} from './Menubar';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination';

export { Stepper, StepperNavigation } from './Stepper';
export type { Step } from './Stepper';

export { ViewToggle } from './ViewToggle';

// ═══════════════════════════════════════════════════════════════════════════════
// 8. DOMAIN SPECIFIC - 도메인 특화 컴포넌트
// ═══════════════════════════════════════════════════════════════════════════════
// LMS 도메인에 특화된 컴포넌트들.
// - IconStatCard: 아이콘이 있는 통계 카드
// - StatsCard: 대시보드 통계 카드
// - SettingsCard: 설정 페이지용 카드
// - FileUpload: 파일/이미지 업로드
// - Kanban: 칸반 보드

export { IconStatCard } from './IconStatCard';
export { StatsCard, StatsGrid, MiniStats } from './StatsCard';
export { SettingsCard } from './SettingsCard';
export { FileUpload, ImageUpload } from './FileUpload';
export { KanbanBoard, KanbanColumnComponent, KanbanCard } from './Kanban';
export type { KanbanColumn } from './Kanban';

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './Carousel';

export { Toggle, toggleVariants } from './Toggle';
export { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

// ═══════════════════════════════════════════════════════════════════════════════
// 9. AUTH - 인증 관련
// ═══════════════════════════════════════════════════════════════════════════════
export { ProtectedRoute } from './ProtectedRoute';
export { ProfileRequiredRoute } from './ProfileRequiredRoute';

// ═══════════════════════════════════════════════════════════════════════════════
// 10. WISHLIST - 찜 기능
// ═══════════════════════════════════════════════════════════════════════════════
export { WishlistButton } from './WishlistButton';
