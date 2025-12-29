import { useState } from 'react';
import { Upload, Image, Trash2, GripVertical, Plus, Eye, EyeOff, Users, Monitor, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
  // 노출 대상
  targetType: TargetType;
  targetValues?: string[]; // 부서명, 직급명, 또는 사용자 ID
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

/**
 * TA 브랜딩 관리 페이지
 * - 로고 & 컬러
 * - 홈 배너 관리
 * - 푸터 설정
 */
export function BrandingPage() {
  const [banners, setBanners] = useState<Banner[]>(sampleBanners);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const toggleBannerActive = (id: string) => {
    setBanners(banners.map(b =>
      b.id === id ? { ...b, isActive: !b.isActive } : b
    ));
  };

  const deleteBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
    if (selectedBanner?.id === id) {
      setSelectedBanner(null);
    }
  };

  const activeBanners = banners.filter(b => b.isActive);

  // 미리보기에서 배너 이동
  const nextPreviewBanner = () => {
    setPreviewIndex((prev) => (prev + 1) % activeBanners.length);
  };
  const prevPreviewBanner = () => {
    setPreviewIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  return (
    <div style={{ padding: '40px', backgroundColor: designTokens.bg.app_default, minHeight: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ color: designTokens.text.primary, fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
            브랜딩 관리
          </h1>
          <p style={{ color: designTokens.text.secondary, fontSize: '14px' }}>
            테넌트의 브랜드 아이덴티티와 홈 화면을 설정합니다.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="banner" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="logo">로고 & 컬러</TabsTrigger>
            <TabsTrigger value="banner">홈 배너 관리</TabsTrigger>
            <TabsTrigger value="footer">푸터 설정</TabsTrigger>
          </TabsList>

          {/* 로고 & 컬러 탭 */}
          <TabsContent value="logo">
            <Card>
              <CardHeader>
                <CardTitle>로고 & 컬러 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* 로고 업로드 */}
                  <div>
                    <Label className="mb-2 block">로고 (라이트 모드)</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-[#6778ff] transition-colors"
                      style={{ borderColor: designTokens.bg.border }}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: designTokens.text.placeholder }} />
                      <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                        클릭하여 업로드 또는 드래그 앤 드롭
                      </p>
                      <p className="text-xs mt-1" style={{ color: designTokens.text.placeholder }}>
                        PNG, SVG (권장: 200x60px)
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">로고 (다크 모드)</Label>
                    <div
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-[#6778ff] transition-colors"
                      style={{ borderColor: designTokens.bg.border }}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: designTokens.text.placeholder }} />
                      <p className="text-sm" style={{ color: designTokens.text.secondary }}>
                        클릭하여 업로드 또는 드래그 앤 드롭
                      </p>
                    </div>
                  </div>
                </div>

                {/* 컬러 설정 */}
                <div>
                  <Label className="mb-2 block">브랜드 컬러</Label>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs mb-1" style={{ color: designTokens.text.secondary }}>Primary</p>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-[#6778ff]" />
                        <Input defaultValue="#6778ff" className="w-28" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: designTokens.text.secondary }}>Secondary</p>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-[#a855f7]" />
                        <Input defaultValue="#a855f7" className="w-28" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 홈 배너 관리 탭 */}
          <TabsContent value="banner">
            <div className="grid grid-cols-3 gap-6">
              {/* 배너 목록 */}
              <div className="col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>배너 목록</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => setShowPreview(true)}
                        disabled={activeBanners.length === 0}
                      >
                        <Monitor className="w-4 h-4" />
                        미리보기
                      </Button>
                      <Button size="sm" className="gap-1">
                        <Plus className="w-4 h-4" />
                        배너 추가
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {banners.map((banner) => (
                        <div
                          key={banner.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedBanner?.id === banner.id ? 'border-[#6778ff] bg-[#6778ff]/5' : ''
                          }`}
                          style={{ borderColor: selectedBanner?.id === banner.id ? '#6778ff' : designTokens.bg.border }}
                          onClick={() => setSelectedBanner(banner)}
                        >
                          {/* 드래그 핸들 */}
                          <GripVertical className="w-4 h-4 cursor-grab" style={{ color: designTokens.text.placeholder }} />

                          {/* 썸네일 */}
                          <div
                            className="w-24 h-14 rounded bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: `url(${banner.imageUrl})` }}
                          />

                          {/* 정보 */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate" style={{ color: designTokens.text.primary }}>
                              {banner.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex gap-1">
                                {banner.hiddenTags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="gray" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                              <Badge
                                variant={banner.targetType === 'ALL' ? 'green' : 'blue'}
                                className="text-xs"
                              >
                                <Users className="w-3 h-3 mr-1" />
                                {banner.targetType === 'ALL'
                                  ? '전체'
                                  : banner.targetValues?.join(', ')}
                              </Badge>
                            </div>
                          </div>

                          {/* 액션 */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBannerActive(banner.id);
                              }}
                              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              {banner.isActive ? (
                                <Eye className="w-4 h-4 text-green-500" />
                              ) : (
                                <EyeOff className="w-4 h-4" style={{ color: designTokens.text.placeholder }} />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBanner(banner.id);
                              }}
                              className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs mt-4" style={{ color: designTokens.text.placeholder }}>
                      드래그하여 순서를 변경할 수 있습니다.
                    </p>
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
                            className="aspect-[3/1] rounded-lg bg-cover bg-center border relative group"
                            style={{
                              backgroundImage: `url(${selectedBanner.imageUrl})`,
                              borderColor: designTokens.bg.border
                            }}
                          >
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                              <Button variant="outline" size="sm" className="gap-1">
                                <Image className="w-4 h-4" />
                                변경
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs mt-1" style={{ color: designTokens.text.placeholder }}>
                            권장: 1200x400px
                          </p>
                        </div>

                        {/* 숨겨진 태그 */}
                        <div>
                          <Label className="mb-1 block">연결 태그</Label>
                          <p className="text-xs mb-2" style={{ color: designTokens.text.secondary }}>
                            배너 클릭 시 이 태그들로 필터링됩니다.
                          </p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {selectedBanner.hiddenTags.map(tag => (
                              <Badge key={tag} variant="blue" className="text-xs">
                                #{tag}
                                <button className="ml-1 hover:text-red-500">×</button>
                              </Badge>
                            ))}
                          </div>
                          <Input placeholder="태그 입력 후 Enter" />
                        </div>

                        {/* 노출 대상 */}
                        <div>
                          <Label className="mb-1 block">노출 대상</Label>
                          <Select defaultValue={selectedBanner.targetType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(targetTypeLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* 부서 선택 */}
                          {selectedBanner.targetType === 'DEPARTMENT' && (
                            <div className="mt-2">
                              <p className="text-xs mb-1" style={{ color: designTokens.text.secondary }}>부서 선택</p>
                              <div className="flex flex-wrap gap-1">
                                {sampleDepartments.map(dept => (
                                  <Badge
                                    key={dept}
                                    variant={selectedBanner.targetValues?.includes(dept) ? 'blue' : 'gray'}
                                    className="text-xs cursor-pointer"
                                  >
                                    {dept}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 직급 선택 */}
                          {selectedBanner.targetType === 'POSITION' && (
                            <div className="mt-2">
                              <p className="text-xs mb-1" style={{ color: designTokens.text.secondary }}>직급/직책 선택</p>
                              <div className="flex flex-wrap gap-1">
                                {samplePositions.map(pos => (
                                  <Badge
                                    key={pos}
                                    variant={selectedBanner.targetValues?.includes(pos) ? 'blue' : 'gray'}
                                    className="text-xs cursor-pointer"
                                  >
                                    {pos}
                                  </Badge>
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
                        <div className="flex items-center justify-between pt-2">
                          <Label>배너 활성화</Label>
                          <Switch checked={selectedBanner.isActive} />
                        </div>

                        <Button className="w-full mt-4">저장</Button>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Image className="w-12 h-12 mx-auto mb-2" style={{ color: designTokens.text.placeholder }} />
                        <p style={{ color: designTokens.text.secondary }}>
                          배너를 선택하여 편집하세요.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 푸터 설정 탭 */}
          <TabsContent value="footer">
            <Card>
              <CardHeader>
                <CardTitle>푸터 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-1 block">회사명</Label>
                  <Input defaultValue="MZC Learn Platform" />
                </div>
                <div>
                  <Label className="mb-1 block">저작권 문구</Label>
                  <Input defaultValue="© 2025 MZC. All rights reserved." />
                </div>
                <div>
                  <Label className="mb-1 block">링크</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="링크 텍스트" defaultValue="이용약관" className="flex-1" />
                      <Input placeholder="URL" defaultValue="/terms" className="flex-1" />
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="링크 텍스트" defaultValue="개인정보처리방침" className="flex-1" />
                      <Input placeholder="URL" defaultValue="/privacy" className="flex-1" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 gap-1">
                    <Plus className="w-3 h-3" />
                    링크 추가
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 미리보기 모달 */}
      {showPreview && activeBanners.length > 0 && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
          <div className="w-full max-w-5xl">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-white" />
                <span className="text-white font-medium">배너 미리보기</span>
                <Badge variant="gray" className="text-xs">
                  {previewIndex + 1} / {activeBanners.length}
                </Badge>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* 배너 이미지 */}
            <div className="relative">
              <div
                className="w-full aspect-[3/1] rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${activeBanners[previewIndex].imageUrl})` }}
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
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === previewIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 배너 정보 */}
            <div className="mt-4 p-4 rounded-lg bg-white/10">
              <p className="text-white font-medium mb-2">{activeBanners[previewIndex].title}</p>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {activeBanners[previewIndex].hiddenTags.map(tag => (
                    <Badge key={tag} variant="gray" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <Badge variant="blue" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {activeBanners[previewIndex].targetType === 'ALL'
                    ? '전체 임직원'
                    : activeBanners[previewIndex].targetValues?.join(', ')}
                </Badge>
              </div>
              <p className="text-white/60 text-xs mt-2">
                클릭 시 연결 태그로 콘텐츠가 필터링됩니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
