/**
 * Component Showcase
 *
 * 8개 카테고리로 구성된 공통 컴포넌트 라이브러리 데모 페이지
 *
 * 카테고리:
 * 1. PRIMITIVES - 기본 UI 요소 (Button, Input, Badge 등)
 * 2. FORM INPUTS - 폼 입력 요소 (Checkbox, Select, Radio 등)
 * 3. OVERLAY - 떠있는 UI (Dialog, Popover, Tooltip 등)
 * 4. LAYOUT - 레이아웃 컨테이너 (Card, Tabs, Accordion 등)
 * 5. DATA DISPLAY - 데이터 표시 (Table, Avatar, Chart 등)
 * 6. FEEDBACK - 피드백/상태 표시 (Alert, Toast, EmptyState)
 * 7. NAVIGATION - 네비게이션 (Breadcrumb, Stepper 등)
 * 8. DOMAIN SPECIFIC - 도메인 특화 컴포넌트 (StatCard, FileUpload 등)
 */

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Mail,
  Plus,
  Search,
  Settings,
  User,
  Bell,
  Home,
  CreditCard,
  Loader2,
  Check,
  X,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. PRIMITIVES - 기본 UI 요소
// ═══════════════════════════════════════════════════════════════════════════════
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Textarea } from "@/components/common";
import { Label } from "@/components/common/Label";
import { Badge } from "@/components/common/Badge";
import { Separator } from "@/components/common/Separator";
import { Skeleton } from "@/components/common/Skeleton";

// ═══════════════════════════════════════════════════════════════════════════════
// 2. FORM INPUTS - 폼 입력 요소
// ═══════════════════════════════════════════════════════════════════════════════
import { Checkbox } from "@/components/common/Checkbox";
import { Switch } from "@/components/common/Switch";
import { NativeSelect } from "@/components/common/NativeSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/Select";
import { Combobox, MultiCombobox } from "@/components/common/Combobox";
import { RadioOptionCard } from "@/components/common/RadioOptionCard";
import { TagInput } from "@/components/common/TagInput";
import { Slider } from "@/components/common/Slider";
import { DateRangePicker, DatePicker } from "@/components/common/DateRangePicker";

// ═══════════════════════════════════════════════════════════════════════════════
// 3. OVERLAY - 떠있는 UI (모달, 팝업)
// ═══════════════════════════════════════════════════════════════════════════════
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/common/AlertDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/common/Popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/common/Tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/common/Sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/common/HoverCard";

// ═══════════════════════════════════════════════════════════════════════════════
// 4. LAYOUT - 레이아웃 컨테이너
// ═══════════════════════════════════════════════════════════════════════════════
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/Tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/common/Accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/common/Collapsible";
import { ScrollArea } from "@/components/common/ScrollArea";

// ═══════════════════════════════════════════════════════════════════════════════
// 5. DATA DISPLAY - 데이터 표시
// ═══════════════════════════════════════════════════════════════════════════════
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import { DataTable, DataTableColumnHeader } from "@/components/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common/Avatar";
import { Progress } from "@/components/common/Progress";
import { Calendar } from "@/components/common/Calendar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/common/Chart";
import { Timeline, TimelineItem, HorizontalTimeline, HorizontalTimelineItem } from "@/components/common/Timeline";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Line,
  LineChart,
  CartesianGrid,
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════════
// 6. FEEDBACK - 피드백/상태 표시
// ═══════════════════════════════════════════════════════════════════════════════
import { Alert, AlertDescription, AlertTitle } from "@/components/common/Alert";
import { EmptyState, NoResultsEmpty, NoDataEmpty } from "@/components/common/EmptyState";

// ═══════════════════════════════════════════════════════════════════════════════
// 7. NAVIGATION - 네비게이션
// ═══════════════════════════════════════════════════════════════════════════════
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/common/Breadcrumb";
import { Stepper, StepperNavigation } from "@/components/common/Stepper";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/common/Pagination";
import { ViewToggle } from "@/components/common/ViewToggle";

// ═══════════════════════════════════════════════════════════════════════════════
// 8. DOMAIN SPECIFIC - 도메인 특화 컴포넌트
// ═══════════════════════════════════════════════════════════════════════════════
import { StatsCard, StatsGrid, MiniStats } from "@/components/common/StatsCard";
import { IconStatCard } from "@/components/common/IconStatCard";
import { SettingsCard } from "@/components/common/SettingsCard";
import { FileUpload, ImageUpload } from "@/components/common/FileUpload";
import { KanbanBoard, type KanbanColumn as KanbanColumnType } from "@/components/common/Kanban";
import { Toggle } from "@/components/common/Toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/common/ToggleGroup";

// ═══════════════════════════════════════════════════════════════════════════════
// Helper Components & Data
// ═══════════════════════════════════════════════════════════════════════════════

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function CategoryHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="pt-8 border-t-4 border-primary">
      <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
    </div>
  );
}

// Chart data
const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const chartConfig: ChartConfig = {
  desktop: { label: "Desktop", color: "#2563eb" },
  mobile: { label: "Mobile", color: "#60a5fa" },
};

// Kanban data
const kanbanColumns: KanbanColumnType[] = [
  {
    id: "todo",
    title: "To Do",
    color: "#6366f1",
    items: [
      { id: "1", title: "Design system review", description: "Review and update design tokens", priority: "high", tags: ["design"] },
      { id: "2", title: "API documentation", priority: "medium", tags: ["docs"] },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#f59e0b",
    items: [
      { id: "3", title: "User authentication", description: "Implement OAuth2 flow", priority: "high", tags: ["feature"], assignee: { name: "John Doe" } },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#22c55e",
    items: [
      { id: "4", title: "Setup project", priority: "low", tags: ["setup"] },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function ComponentShowcase() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progress, setProgress] = useState(45);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [stepperStep, setStepperStep] = useState(1);
  const [notificationPref, setNotificationPref] = useState("email");
  const [tags, setTags] = useState<string[]>(["React", "TypeScript"]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">UI Component Showcase</h1>
            <p className="text-gray-600">
              8개 카테고리로 구성된 공통 컴포넌트 라이브러리 (59개 컴포넌트)
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════════════
              1. PRIMITIVES - 기본 UI 요소
              ═══════════════════════════════════════════════════════════════════════════════ */}
          <CategoryHeader
            title="1. Primitives"
            description="기본 UI 요소 - Button, Input, Badge, Separator, Skeleton 등"
          />

          <Section title="Button">
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button disabled>Disabled</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button>
                <Mail className="mr-2 h-4 w-4" /> With Icon
              </Button>
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </Button>
            </div>
          </Section>

          <Section title="Input & Textarea">
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <Input placeholder="Default input" />
              <Input type="email" placeholder="Email" />
              <Input type="password" placeholder="Password" />
              <Input disabled placeholder="Disabled" />
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="flex-1" />
              </div>
            </div>
            <div className="max-w-md mt-4">
              <Label>Bio</Label>
              <Textarea placeholder="Tell us about yourself" className="mt-1" />
            </div>
          </Section>

          <Section title="Badge">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </Section>

          <Section title="Separator & Skeleton">
            <div className="max-w-md space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Radix Primitives</h4>
                <p className="text-sm text-gray-500">An open-source UI component library.</p>
              </div>
              <Separator />
              <div className="flex h-5 items-center space-x-4 text-sm">
                <div>Blog</div>
                <Separator orientation="vertical" />
                <div>Docs</div>
                <Separator orientation="vertical" />
                <div>Source</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-6">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════════════════════════
              2. FORM INPUTS - 폼 입력 요소
              ═══════════════════════════════════════════════════════════════════════════════ */}
          <CategoryHeader
            title="2. Form Inputs"
            description="폼 입력 요소 - Checkbox, Switch, Select, Combobox, Radio, Slider 등"
          />

          <Section title="Checkbox & Switch">
            <div className="space-y-4 max-w-md">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>
            </div>
          </Section>

          <Section title="Select & Combobox">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <Label>Select</Label>
                <Select>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Combobox (검색 가능)</Label>
                <Combobox
                  options={[
                    { value: "react", label: "React" },
                    { value: "vue", label: "Vue" },
                    { value: "angular", label: "Angular" },
                    { value: "svelte", label: "Svelte" },
                  ]}
                  placeholder="Select framework..."
                  className="w-[200px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Multi Combobox</Label>
                <MultiCombobox
                  options={[
                    { value: "typescript", label: "TypeScript" },
                    { value: "javascript", label: "JavaScript" },
                    { value: "python", label: "Python" },
                  ]}
                  placeholder="Select languages..."
                  className="w-[200px]"
                />
              </div>
            </div>
          </Section>

          <Section title="RadioOptionCard">
            <div className="grid grid-cols-2 gap-8 max-w-2xl">
              <div className="space-y-2">
                <Label>Simple variant (기본 라디오)</Label>
                <div className="grid gap-2">
                  <RadioOptionCard
                    variant="simple"
                    name="notification"
                    value="email"
                    label="Email"
                    isSelected={notificationPref === "email"}
                    onChange={setNotificationPref}
                  />
                  <RadioOptionCard
                    variant="simple"
                    name="notification"
                    value="sms"
                    label="SMS"
                    isSelected={notificationPref === "sms"}
                    onChange={setNotificationPref}
                  />
                  <RadioOptionCard
                    variant="simple"
                    name="notification"
                    value="push"
                    label="Push Notification"
                    isSelected={notificationPref === "push"}
                    onChange={setNotificationPref}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Card variant (카드형 라디오)</Label>
                <div className="grid gap-2">
                  <RadioOptionCard
                    name="theme"
                    value="light"
                    label="라이트 모드"
                    description="밝은 테마를 사용합니다"
                    isSelected={true}
                    onChange={() => {}}
                  />
                  <RadioOptionCard
                    name="theme"
                    value="dark"
                    label="다크 모드"
                    description="어두운 테마를 사용합니다"
                    isSelected={false}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          </Section>

          <Section title="Slider & Date Picker">
            <div className="flex flex-wrap gap-8">
              <div className="space-y-2 w-64">
                <Label>Volume: {progress}%</Label>
                <Slider
                  value={[progress]}
                  onValueChange={(value) => setProgress(value[0])}
                  max={100}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Single Date</Label>
                <DatePicker placeholder="Pick a date" />
              </div>
              <div className="space-y-2">
                <Label>Date Range</Label>
                <DateRangePicker placeholder="Select date range" />
              </div>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════════════════════════
              3. OVERLAY - 떠있는 UI
              ═══════════════════════════════════════════════════════════════════════════════ */}
          <CategoryHeader
            title="3. Overlay"
            description="떠있는 UI - Dialog, AlertDialog, Popover, Tooltip, DropdownMenu 등"
          />

          <Section title="Dialog & AlertDialog">
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="Enter your name" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Section>

          <Section title="Popover & Tooltip">
            <div className="flex gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Dimensions</h4>
                    <p className="text-sm text-gray-500">Set the dimensions for the layer.</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label>Width</Label>
                        <Input placeholder="100%" />
                      </div>
                      <div className="space-y-1">
                        <Label>Height</Label>
                        <Input placeholder="25px" />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new item</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </Section>

          <Section title="Dropdown Menu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Open Menu <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Section>

          {/* ═══════════════════════════════════════════════════════════════════════════════
              4. LAYOUT - 레이아웃 컨테이너
              ═══════════════════════════════════════════════════════════════════════════════ */}
          <CategoryHeader
            title="4. Layout"
            description="레이아웃 컨테이너 - Card, Tabs, Accordion, Collapsible, ScrollArea 등"
          />

          <Section title="Card">
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
                <CardFooter>
                  <Button>Action</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Push Notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Email Notifications</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section title="Tabs">
            <Tabs defaultValue="account" className="max-w-xl">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="p-4">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="password" className="p-4">
                Change your password here.
              </TabsContent>
              <TabsContent value="settings" className="p-4">
                Adjust your settings here.
              </TabsContent>
            </Tabs>
          </Section>

          <Section title="Accordion & Collapsible">
            <div className="grid grid-cols-2 gap-8">
              <Accordion type="single" collapsible className="max-w-md">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Collapsible
                open={isCollapsibleOpen}
                onOpenChange={setIsCollapsibleOpen}
                className="w-[300px] space-y-2"
              >
                <div className="flex items-center justify-between space-x-4 px-4">
                  <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {isCollapsibleOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/primitives</div>
                <CollapsibleContent className="space-y-2">
                  <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/colors</div>
                  <div className="rounded-md border px-4 py-2 text-sm">@stitches/react</div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </Section>

          <Section title="ScrollArea">
            <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
              <div className="space-y-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="text-sm">
                    Item {i + 1} - Lorem ipsum dolor sit amet
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Section>

          {/* ═══════════════════════════════════════════════════════════════════════════════
              5. DATA DISPLAY - 데이터 표시
              ═══════════════════════════════════════════════════════════════════════════════ */}
          <CategoryHeader
            title="5. Data Display"
            description="데이터 표시 - Table, DataTable, Avatar, Progress, Calendar, Chart, Timeline 등"
          />

          <Section title="Table & DataTable">
            <div className="space-y-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>INV001</TableCell>
                    <TableCell><Badge variant="secondary">Paid</Badge></TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>INV002</TableCell>
                    <TableCell><Badge variant="outline">Pending</Badge></TableCell>
                    <TableCell>PayPal</TableCell>
                    <TableCell className="text-right">$150.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <DataTable
                columns={[
                  { accessorKey: "id", header: "ID" },
                  {
                    accessorKey: "name",
                    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
                  },
                  { accessorKey: "email", header: "Email" },
                  {
                    accessorKey: "status",
                    header: "Status",
                    cell: ({ row }) => {
                      const status = row.getValue("status") as string;
                      return <Badge variant={status === "active" ? "default" : "secondary"}>{status}</Badge>;
                    },
                  },
                ]}
                data={[
                  { id: "1", name: "John Doe", email: "john@example.com", status: "active" },
                  { id: "2", name: "Jane Smith", email: "jane@example.com", status: "inactive" },
                  { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "active" },
                ]}
                searchKey="name"
                searchPlaceholder="Search by name..."
              />
            </div>
          </Section>

          <Section title="Avatar & Progress">
            <div className="flex gap-8 items-start">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-4 w-64">
                <Progress value={33} />
                <Progress value={66} />
                <Progress value={100} />
              </div>
            </div>
          </Section>

          <Section title="Calendar">
            <div className="flex gap-8">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Selected date:</p>
                <p className="font-medium">{date ? date.toLocaleDateString() : "None"}</p>
              </div>
            </div>
          </Section>

          <Section title="Chart">
            <div className="grid grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Bar Chart</CardTitle>
                  <CardDescription>Desktop vs Mobile visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px]">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="desktop" fill="#2563eb" radius={4} />
                      <Bar dataKey="mobile" fill="#60a5fa" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Line Chart</CardTitle>
                  <CardDescription>Trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[200px]">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="desktop" stroke="#2563eb" strokeWidth={2} />
                      <Line type="monotone" dataKey="mobile" stroke="#60a5fa" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section title="Timeline">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>Vertical Timeline</Label>
                <Timeline>
                  <TimelineItem
                    title="Course Created"
                    description="New course 'React Fundamentals' was created"
                    time="2 hours ago"
                    icon={FileText}
                    iconClassName="border-blue-500 text-blue-500"
                  />
                  <TimelineItem
                    title="Under Review"
                    description="Course submitted for review by admin"
                    time="1 hour ago"
                    icon={Clock}
                    iconClassName="border-yellow-500 text-yellow-500"
                  />
                  <TimelineItem
                    title="Approved"
                    description="Course has been approved and published"
                    time="30 mins ago"
                    icon={CheckCircle}
                    iconClassName="border-green-500 text-green-500"
                  />
                </Timeline>
              </div>
              <div className="space-y-2">
                <Label>Horizontal Timeline</Label>
                <HorizontalTimeline>
                  <HorizontalTimelineItem title="Draft" description="Created" isCompleted />
                  <HorizontalTimelineItem title="Review" description="In progress" isActive />
                  <HorizontalTimelineItem title="Approved" description="Pending" />
                  <HorizontalTimelineItem title="Published" description="Final" />
                </HorizontalTimeline>
              </div>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════════════════════════
              6. FEEDBACK - 피드백/상태 표시
              ═══════════════════════════════════════════════════════════════════════════════ */}
          <CategoryHeader
            title="6. Feedback"
            description="피드백/상태 표시 - Alert, EmptyState 등"
          />

          <Section title="Alert">
            <div className="space-y-4 max-w-xl">
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the cli.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </Alert>
            </div>
          </Section>

          <Section title="Empty State">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-0">
                  <EmptyState
                    title="No courses yet"
                    description="Get started by creating your first course"
                    action={{ label: "Create Course", onClick: () => {} }}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-0">
                  <NoResultsEmpty searchTerm="advanced react" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-0">
                  <NoDataEmpty
                    title="No students enrolled"
                    description="Share your course to get students"
                    actionLabel="Share Course"
                  />
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════════════════════════
              7. NAVIGATION - 네비게이션
              ═══════════════════════════════════════════════════════════════════════════════ */}
          <CategoryHeader
            title="7. Navigation"
            description="네비게이션 - Breadcrumb, Stepper 등"
          />

          <Section title="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <Home className="h-4 w-4" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Section>

          <Section title="Stepper">
            <div className="space-y-8">
              <Stepper
                steps={[
                  { id: "1", title: "Basic Info", description: "Course details" },
                  { id: "2", title: "Content", description: "Add materials" },
                  { id: "3", title: "Settings", description: "Configure options" },
                  { id: "4", title: "Review", description: "Final check" },
                ]}
                currentStep={stepperStep}
              />
              <StepperNavigation
                currentStep={stepperStep}
                totalSteps={4}
                onPrevious={() => setStepperStep(Math.max(0, stepperStep - 1))}
                onNext={() => setStepperStep(Math.min(3, stepperStep + 1))}
                onComplete={() => alert("Completed!")}
              />
            </div>
          </Section>

          {/* ═══════════════════════════════════════════════════════════════════════════════
              8. DOMAIN SPECIFIC - 도메인 특화 컴포넌트
              ═══════════════════════════════════════════════════════════════════════════════ */}
          <CategoryHeader
            title="8. Domain Specific"
            description="도메인 특화 컴포넌트 - StatsCard, FileUpload, Kanban, Toggle 등"
          />

          <Section title="Stats Card">
            <StatsGrid columns={4}>
              <StatsCard
                title="Total Users"
                value="12,345"
                description="from last month"
                icon={Users}
                trend={{ value: 12.5 }}
              />
              <StatsCard
                title="Total Revenue"
                value="$45,678"
                description="from last month"
                icon={DollarSign}
                trend={{ value: -3.2 }}
              />
              <StatsCard
                title="Active Courses"
                value="89"
                icon={ShoppingCart}
                trend={{ value: 8.1 }}
              />
              <StatsCard
                title="Completion Rate"
                value="94.2%"
                icon={Activity}
                trend={{ value: 0 }}
              />
            </StatsGrid>
            <div className="flex gap-8 mt-4">
              <MiniStats label="New signups" value="234" trend={15} />
              <MiniStats label="Bounce rate" value="32%" trend={-5} />
              <MiniStats label="Avg. session" value="4m 32s" />
            </div>
          </Section>

          <Section title="File Upload">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>File Dropzone</Label>
                <FileUpload
                  multiple
                  maxFiles={5}
                  accept={{ "application/pdf": [".pdf"], "image/*": [".png", ".jpg"] }}
                />
              </div>
              <div className="space-y-2">
                <Label>Image Upload with Preview</Label>
                <ImageUpload />
              </div>
            </div>
          </Section>

          <Section title="Toggle & ToggleGroup">
            <div className="flex gap-4">
              <Toggle aria-label="Toggle italic">
                <Settings className="h-4 w-4" />
              </Toggle>
              <Toggle variant="outline" aria-label="Toggle bold">
                Bold
              </Toggle>
              <ToggleGroup type="multiple">
                <ToggleGroupItem value="bold">B</ToggleGroupItem>
                <ToggleGroupItem value="italic">I</ToggleGroupItem>
                <ToggleGroupItem value="underline">U</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </Section>

          <Section title="Kanban Board">
            <KanbanBoard
              columns={kanbanColumns}
              onAddItem={(columnId) => console.log("Add to", columnId)}
              onEditItem={(item) => console.log("Edit", item)}
              onDeleteItem={(item) => console.log("Delete", item)}
            />
          </Section>

          <Section title="IconStatCard & SettingsCard">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <IconStatCard icon={<Users className="w-5 h-5" />} label="Total Users" value="1,234" />
              <IconStatCard icon={<ShoppingCart className="w-5 h-5" />} label="Orders" value="56" />
              <IconStatCard icon={<DollarSign className="w-5 h-5" />} label="Revenue" value="$12,345" />
              <IconStatCard icon={<Activity className="w-5 h-5" />} label="Active" value="89%" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <SettingsCard
                icon={User}
                title="Profile"
                description="Manage your profile settings"
                onClick={() => console.log("Profile clicked")}
                index={0}
              />
              <SettingsCard
                icon={Bell}
                title="Notifications"
                description="Configure notification preferences"
                onClick={() => console.log("Notifications clicked")}
                index={1}
              />
              <SettingsCard
                icon={Settings}
                title="Security"
                description="Update security settings"
                onClick={() => console.log("Security clicked")}
                index={2}
              />
            </div>
          </Section>

          <Section title="NativeSelect & TagInput">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>Native Select</Label>
                <NativeSelect
                  options={[
                    { value: "", label: "Select an option" },
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" },
                    { value: "3", label: "Option 3" },
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label>Tag Input</Label>
                <TagInput
                  value={tags}
                  onChange={setTags}
                  placeholder="Add tags (comma separated)"
                />
              </div>
            </div>
          </Section>

          <Section title="Sheet & HoverCard">
            <div className="flex gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Sheet Title</SheetTitle>
                    <SheetDescription>
                      This is a side panel that slides in from the edge.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <p>Sheet content goes here.</p>
                  </div>
                </SheetContent>
              </Sheet>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">Hover me</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">@shadcn</h4>
                      <p className="text-sm text-muted-foreground">
                        The creator of shadcn/ui components.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </Section>

          <Section title="Pagination & ViewToggle">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">View Mode: {viewMode}</p>
                <ViewToggle
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  gridLabel="Grid"
                  listLabel="List"
                />
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
                  </PaginationItem>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={() => setCurrentPage(Math.min(5, currentPage + 1))} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </Section>
        </div>
      </div>
    </TooltipProvider>
  );
}
