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
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Line,
  LineChart,
  CartesianGrid,
} from "recharts";

// New Admin Components
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table";
import { DateRangePicker, DatePicker } from "@/components/ui/date-range-picker";
import { Combobox, MultiCombobox } from "@/components/ui/combobox";
import { FileUpload, ImageUpload } from "@/components/ui/file-upload";
import { StatsCard, StatsGrid, MiniStats } from "@/components/ui/stats-card";
import { Timeline, TimelineItem, HorizontalTimeline, HorizontalTimelineItem } from "@/components/ui/timeline";
import { Stepper, StepperNavigation } from "@/components/ui/stepper";
import { EmptyState, NoResultsEmpty, NoDataEmpty } from "@/components/ui/empty-state";
import { KanbanBoard, type KanbanColumn as KanbanColumnType } from "@/components/ui/kanban";
import { Users, ShoppingCart, DollarSign, Activity, FileText, Clock, CheckCircle } from "lucide-react";

// Section wrapper component
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold border-b pb-2">{title}</h2>
      <div className="space-y-4">{children}</div>
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
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
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

export default function ComponentShowcase() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progress, setProgress] = useState(45);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [stepperStep, setStepperStep] = useState(1);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">UI Component Showcase</h1>
            <p className="text-gray-600">
              shadcn/ui 컴포넌트 미리보기 ({46}개 컴포넌트)
            </p>
          </div>

          {/* Buttons */}
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

          {/* Input */}
          <Section title="Input">
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
          </Section>

          {/* Badge */}
          <Section title="Badge">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </Section>

          {/* Avatar */}
          <Section title="Avatar">
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
          </Section>

          {/* Alert */}
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

          {/* Card */}
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

          {/* Accordion */}
          <Section title="Accordion">
            <Accordion type="single" collapsible className="max-w-xl">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other
                  components' aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                  Yes. It's animated by default, but you can disable it if you
                  prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          {/* Tabs */}
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

          {/* Dialog */}
          <Section title="Dialog">
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="Enter your email" />
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
                      This action cannot be undone. This will permanently delete
                      your account.
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

          {/* Dropdown Menu */}
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

          {/* Select */}
          <Section title="Select">
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
              </SelectContent>
            </Select>
          </Section>

          {/* Popover */}
          <Section title="Popover">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Dimensions</h4>
                  <p className="text-sm text-gray-500">
                    Set the dimensions for the layer.
                  </p>
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
          </Section>

          {/* Tooltip */}
          <Section title="Tooltip">
            <div className="flex gap-4">
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

          {/* Form Elements */}
          <Section title="Form Elements">
            <div className="space-y-6 max-w-md">
              {/* Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>

              {/* Radio Group */}
              <div className="space-y-2">
                <Label>Notification preference</Label>
                <RadioGroup defaultValue="email">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sms" id="sms" />
                    <Label htmlFor="sms">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="push" id="push" />
                    <Label htmlFor="push">Push Notification</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Switch */}
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea placeholder="Tell us about yourself" />
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <Label>Volume: {progress}%</Label>
                <Slider
                  value={[progress]}
                  onValueChange={(value) => setProgress(value[0])}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </Section>

          {/* Toggle */}
          <Section title="Toggle">
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

          {/* Progress */}
          <Section title="Progress">
            <div className="space-y-4 max-w-md">
              <Progress value={33} />
              <Progress value={66} />
              <Progress value={100} />
            </div>
          </Section>

          {/* Skeleton */}
          <Section title="Skeleton">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </Section>

          {/* Breadcrumb */}
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

          {/* Collapsible */}
          <Section title="Collapsible">
            <Collapsible
              open={isCollapsibleOpen}
              onOpenChange={setIsCollapsibleOpen}
              className="w-[350px] space-y-2"
            >
              <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">
                  @peduarte starred 3 repositories
                </h4>
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
              <div className="rounded-md border px-4 py-2 text-sm">
                @radix-ui/primitives
              </div>
              <CollapsibleContent className="space-y-2">
                <div className="rounded-md border px-4 py-2 text-sm">
                  @radix-ui/colors
                </div>
                <div className="rounded-md border px-4 py-2 text-sm">
                  @stitches/react
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Section>

          {/* Separator */}
          <Section title="Separator">
            <div className="max-w-md">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Radix Primitives</h4>
                <p className="text-sm text-gray-500">
                  An open-source UI component library.
                </p>
              </div>
              <Separator className="my-4" />
              <div className="flex h-5 items-center space-x-4 text-sm">
                <div>Blog</div>
                <Separator orientation="vertical" />
                <div>Docs</div>
                <Separator orientation="vertical" />
                <div>Source</div>
              </div>
            </div>
          </Section>

          {/* Table */}
          <Section title="Table">
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
                  <TableCell>
                    <Badge variant="secondary">Paid</Badge>
                  </TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV002</TableCell>
                  <TableCell>
                    <Badge variant="outline">Pending</Badge>
                  </TableCell>
                  <TableCell>PayPal</TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV003</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Unpaid</Badge>
                  </TableCell>
                  <TableCell>Bank Transfer</TableCell>
                  <TableCell className="text-right">$350.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          {/* Scroll Area */}
          <Section title="Scroll Area">
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

          {/* Calendar */}
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
                <p className="font-medium">
                  {date ? date.toLocaleDateString() : "None"}
                </p>
              </div>
            </div>
          </Section>

          {/* Chart */}
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
                      <Line
                        type="monotone"
                        dataKey="desktop"
                        stroke="#2563eb"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="mobile"
                        stroke="#60a5fa"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* ===== NEW ADMIN COMPONENTS ===== */}
          <div className="pt-8 border-t-4 border-primary">
            <h2 className="text-2xl font-bold text-center mb-8 text-primary">
              🆕 Admin Dashboard Components
            </h2>
          </div>

          {/* Stats Card */}
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

          {/* Date Pickers */}
          <Section title="Date Picker & Range Picker">
            <div className="flex flex-wrap gap-4">
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

          {/* Combobox */}
          <Section title="Combobox (Searchable Select)">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <Label>Single Select</Label>
                <Combobox
                  options={[
                    { value: "react", label: "React" },
                    { value: "vue", label: "Vue" },
                    { value: "angular", label: "Angular" },
                    { value: "svelte", label: "Svelte" },
                    { value: "solid", label: "SolidJS" },
                  ]}
                  placeholder="Select framework..."
                  className="w-[250px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Multi Select</Label>
                <MultiCombobox
                  options={[
                    { value: "typescript", label: "TypeScript" },
                    { value: "javascript", label: "JavaScript" },
                    { value: "python", label: "Python" },
                    { value: "rust", label: "Rust" },
                    { value: "go", label: "Go" },
                  ]}
                  placeholder="Select languages..."
                  className="w-[250px]"
                />
              </div>
            </div>
          </Section>

          {/* File Upload */}
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

          {/* Data Table */}
          <Section title="Data Table">
            <DataTable
              columns={[
                {
                  accessorKey: "id",
                  header: "ID",
                },
                {
                  accessorKey: "name",
                  header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Name" />
                  ),
                },
                {
                  accessorKey: "email",
                  header: "Email",
                },
                {
                  accessorKey: "status",
                  header: "Status",
                  cell: ({ row }) => {
                    const status = row.getValue("status") as string;
                    return (
                      <Badge variant={status === "active" ? "default" : "secondary"}>
                        {status}
                      </Badge>
                    );
                  },
                },
              ]}
              data={[
                { id: "1", name: "John Doe", email: "john@example.com", status: "active" },
                { id: "2", name: "Jane Smith", email: "jane@example.com", status: "inactive" },
                { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "active" },
                { id: "4", name: "Alice Brown", email: "alice@example.com", status: "active" },
                { id: "5", name: "Charlie Wilson", email: "charlie@example.com", status: "inactive" },
              ]}
              searchKey="name"
              searchPlaceholder="Search by name..."
            />
          </Section>

          {/* Timeline */}
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
                  <HorizontalTimelineItem
                    title="Draft"
                    description="Created"
                    isCompleted
                  />
                  <HorizontalTimelineItem
                    title="Review"
                    description="In progress"
                    isActive
                  />
                  <HorizontalTimelineItem
                    title="Approved"
                    description="Pending"
                  />
                  <HorizontalTimelineItem
                    title="Published"
                    description="Final"
                  />
                </HorizontalTimeline>
              </div>
            </div>
          </Section>

          {/* Stepper */}
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

          {/* Empty State */}
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

          {/* Kanban Board */}
          <Section title="Kanban Board">
            <KanbanBoard
              columns={kanbanColumns}
              onAddItem={(columnId) => console.log("Add to", columnId)}
              onEditItem={(item) => console.log("Edit", item)}
              onDeleteItem={(item) => console.log("Delete", item)}
            />
          </Section>
        </div>
      </div>
    </TooltipProvider>
  );
}
