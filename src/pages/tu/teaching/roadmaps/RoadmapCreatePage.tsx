import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, GripVertical, X, Search, Loader2, AlertTriangle, Info, Lock } from 'lucide-react';
import { toast } from 'sonner';
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
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
  Badge,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/common';
import {
  useCreateRoadmap,
  useUpdateRoadmap,
  useSaveDraft,
  useRoadmap,
  useMyPrograms,
} from '@/hooks/tu';
import {
  isDestructiveUpdate,
  isDestructiveUpdateRestricted,
  analyzeProgramChanges,
} from '@/utils/roadmapUtils';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';

const t = {
  createRoadmap: { ko: '로드맵 생성', en: 'Create Roadmap' },
  editRoadmap: { ko: '로드맵 수정', en: 'Edit Roadmap' },
  back: { ko: '뒤로', en: 'Back' },
  basicInfo: { ko: '기본 정보', en: 'Basic Information' },
  title: { ko: '로드맵 제목', en: 'Roadmap Title' },
  titlePlaceholder: { ko: '예: 프론트엔드 개발자 로드맵', en: 'e.g., Frontend Developer Roadmap' },
  description: { ko: '설명', en: 'Description' },
  descriptionPlaceholder: { ko: '로드맵에 대한 설명을 입력하세요', en: 'Enter a description for this roadmap' },
  courseList: { ko: '강의 구성', en: 'Course List' },
  courseListDesc: {
    ko: '학습 순서대로 강의를 추가하세요. 드래그하여 순서를 변경할 수 있습니다.',
    en: 'Add courses in learning order. Drag to reorder.',
  },
  addCourse: { ko: '강의 추가', en: 'Add Course' },
  searchCourse: { ko: '강의 검색', en: 'Search courses' },
  noCourses: { ko: '추가된 강의가 없습니다', en: 'No courses added' },
  noCoursesDesc: { ko: '아래에서 강의를 검색하여 추가하세요', en: 'Search and add courses below' },
  availableCourses: { ko: '추가 가능한 강의', en: 'Available Courses' },
  save: { ko: '저장', en: 'Save' },
  saveDraft: { ko: '임시 저장', en: 'Save as Draft' },
  publish: { ko: '공개', en: 'Publish' },
  cancel: { ko: '취소', en: 'Cancel' },
  step: { ko: '단계', en: 'Step' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  createSuccess: { ko: '로드맵이 생성되었습니다', en: 'Roadmap created successfully' },
  updateSuccess: { ko: '로드맵이 수정되었습니다', en: 'Roadmap updated successfully' },
  draftSuccess: { ko: '임시 저장되었습니다', en: 'Saved as draft' },
  createError: { ko: '로드맵 생성에 실패했습니다', en: 'Failed to create roadmap' },
  updateError: { ko: '로드맵 수정에 실패했습니다', en: 'Failed to update roadmap' },
  draftError: { ko: '임시 저장에 실패했습니다', en: 'Failed to save draft' },
  titleRequired: { ko: '제목을 입력해주세요', en: 'Please enter a title' },
  coursesRequired: { ko: '최소 1개 이상의 강의를 추가해주세요', en: 'Please add at least one course' },
  noAvailableCourses: { ko: '추가 가능한 강의가 없습니다', en: 'No available courses' },
  destructiveUpdateWarning: {
    ko: '수강생이 있는 공개된 로드맵은 과정 삭제 또는 순서 변경이 불가능합니다',
    en: 'Cannot delete or reorder programs in published roadmap with enrollments',
  },
  cannotDeleteRestricted: {
    ko: '수강생이 있어 삭제할 수 없습니다',
    en: 'Cannot delete (has enrollments)',
  },
  cannotReorderRestricted: {
    ko: '수강생이 있어 순서 변경이 불가능합니다',
    en: 'Cannot reorder (has enrollments)',
  },
  restrictedModeInfo: {
    ko: '수강생이 있는 공개된 로드맵입니다. 기존 과정의 삭제 및 순서 변경이 제한됩니다.',
    en: 'This is a published roadmap with enrollments. Deletion and reordering of existing programs is restricted.',
  },
  newProgramsAllowed: {
    ko: '새로운 과정 추가는 가능합니다.',
    en: 'Adding new programs is allowed.',
  },
};

interface SelectedProgram {
  id: number;
  title: string;
  category: string;
  duration: string;
}

export function RoadmapCreatePage({ language = 'ko' }: Readonly<{ language?: 'ko' | 'en' }>) {
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<SelectedProgram[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalStatus, setOriginalStatus] = useState<'PUBLISHED' | 'DRAFT' | null>(null);
  const [originalProgramIds, setOriginalProgramIds] = useState<number[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState(0);

  const getText = (key: keyof typeof t) => (language === 'ko' ? t[key].ko : t[key].en);

  // API 호출
  const { data: roadmapData, isLoading: isLoadingRoadmap } = useRoadmap(
    isEditMode ? parseInt(id) : 0
  );
  const { data: programsData, isLoading: isLoadingPrograms } = useMyPrograms({
    status: 'APPROVED'
  });
  const createMutation = useCreateRoadmap();
  const updateMutation = useUpdateRoadmap();
  const draftMutation = useSaveDraft();

  // 수정 모드일 때 데이터 로드
  useEffect(() => {
    if (roadmapData && isEditMode) {
      setTitle(roadmapData.title);
      setDescription(roadmapData.description || '');
      // 백엔드에서 소문자로 응답하므로 대문자로 정규화
      setOriginalStatus(roadmapData.status.toUpperCase() as 'PUBLISHED' | 'DRAFT');
      setEnrolledStudents(roadmapData.enrolledStudents);

      const programIds = roadmapData.programs.map((p) => p.id);
      setOriginalProgramIds(programIds);
      setSelectedPrograms(
        roadmapData.programs.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          duration: p.duration,
        }))
      );
    }
  }, [roadmapData, isEditMode]);

  // 클라이언트 사이드 검색 필터링
  const availablePrograms = (programsData?.content || [])
    .filter((program) => !selectedPrograms.find((p) => p.id === program.id))
    .filter((program) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        program.title.toLowerCase().includes(query) ||
        (program.type && program.type.toLowerCase().includes(query))
      );
    })
    .map((program) => ({
      id: program.id,
      title: program.title,
      category: program.type || '',
      duration: program.estimatedHours ? `${program.estimatedHours}시간` : '',
    }));

  const addProgram = (program: SelectedProgram) => {
    setSelectedPrograms([...selectedPrograms, program]);
  };

  const removeProgram = (programId: number) => {
    setSelectedPrograms(selectedPrograms.filter((p) => p.id !== programId));
  };

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 종료 핸들러
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedPrograms((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // 파괴적 업데이트 검증
  const destructiveValidation = useMemo(() => {
    if (!isEditMode || !originalStatus) {
      return {
        isRestricted: false,
        isDestructive: false,
        changes: { added: [], removed: [], reordered: false },
      };
    }

    const currentIds = selectedPrograms.map((p) => p.id);
    const isRestricted = isDestructiveUpdateRestricted(originalStatus, enrolledStudents);
    const isDestructive = isDestructiveUpdate(originalProgramIds, currentIds);
    const changes = analyzeProgramChanges(originalProgramIds, currentIds);

    return {
      isRestricted,
      isDestructive,
      changes,
      shouldBlock: isRestricted && isDestructive,
    };
  }, [isEditMode, originalStatus, enrolledStudents, originalProgramIds, selectedPrograms]);

  const handleSave = async (isDraft: boolean) => {
    // 유효성 검사
    if (!title.trim()) {
      toast.error(getText('titleRequired'));
      return;
    }

    if (!isDraft && selectedPrograms.length === 0) {
      toast.error(getText('coursesRequired'));
      return;
    }

    // 파괴적 업데이트 사전 검증 (PUBLISHED 상태로 저장 시도 시만 검증)
    if (!isDraft && destructiveValidation.shouldBlock) {
      toast.error(getText('destructiveUpdateWarning'));
      return;
    }

    const programIds = selectedPrograms.map((p) => p.id);
    const status = isDraft ? 'DRAFT' : 'PUBLISHED';

    try {
      if (isEditMode) {
        // 수정 모드에서는 항상 updateMutation 사용
        // 현재 상태와 관계없이 status를 포함한 전체 업데이트
        await updateMutation.mutateAsync({
          id: parseInt(id),
          title,
          description,
          programIds: programIds.length > 0 ? programIds : undefined,
          status,
        });
        toast.success(isDraft ? getText('draftSuccess') : getText('updateSuccess'));
      } else {
        // 생성 모드: 임시저장이든 공개든 모두 createRoadmap 사용
        // 백엔드 CreateRoadmapRequest는 @NotEmpty 검증이 있으므로 최소 1개 필요
        if (programIds.length === 0) {
          toast.error(getText('coursesRequired'));
          return;
        }

        await createMutation.mutateAsync({
          title,
          description,
          programIds,
          status,
        });
        toast.success(isDraft ? getText('draftSuccess') : getText('createSuccess'));
      }

      // mutation의 onSuccess가 완료된 후 페이지 이동
      navigate(prefixPath('/tu/teaching/roadmaps'));
    } catch (error: any) {
      // RM007 에러 처리 (파괴적 업데이트 차단)
      if (error?.response?.data?.code === 'RM007') {
        toast.error(getText('destructiveUpdateWarning'));
        return;
      }

      // 일반 에러 처리
      if (isDraft) {
        toast.error(getText('draftError'));
      } else if (isEditMode) {
        toast.error(getText('updateError'));
      } else {
        toast.error(getText('createError'));
      }
    }
  };

  const isLoading = isLoadingRoadmap || isLoadingPrograms;
  const isSaving = createMutation.isPending || updateMutation.isPending || draftMutation.isPending;

  if (isEditMode && isLoadingRoadmap) {
    return (
      <div className="p-8 bg-bg-app min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-text-secondary" size={32} />
        <span className="ml-2 text-text-secondary">{getText('loading')}</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-bg-app min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate(prefixPath('/tu/teaching/roadmaps'))} className="mb-4">
          <ArrowLeft size={20} />
          <span>{getText('back')}</span>
        </Button>
        <h1 className="text-text-primary mb-2">
          {isEditMode ? getText('editRoadmap') : getText('createRoadmap')}
        </h1>
      </div>

      {/* 제한 상태 안내 배너 */}
      {destructiveValidation.isRestricted && (
        <Card className="mb-6 border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="text-primary shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-text-primary m-0 mb-1">
                  {getText('restrictedModeInfo')}
                </p>
                <p className="text-sm text-text-secondary m-0">
                  • 현재 수강생: {enrolledStudents}명
                </p>
                <p className="text-sm text-text-secondary m-0">
                  • {getText('newProgramsAllowed')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Info & Course List */}
        <div className="flex flex-col gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>{getText('basicInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {getText('title')} <span className="text-status-error">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={getText('titlePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {getText('description')}
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={getText('descriptionPlaceholder')}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Selected Programs */}
          <Card>
            <CardHeader>
              <CardTitle>{getText('courseList')}</CardTitle>
              <p className="text-sm text-text-secondary m-0">{getText('courseListDesc')}</p>
            </CardHeader>
            <CardContent>
              {selectedPrograms.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  <p className="mb-1">{getText('noCourses')}</p>
                  <p className="text-sm">{getText('noCoursesDesc')}</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={selectedPrograms.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-2">
                      {selectedPrograms.map((program, index) => {
                        const isOriginalProgram = originalProgramIds.includes(program.id);
                        const isActionRestricted = destructiveValidation.isRestricted && isOriginalProgram;

                        return (
                          <SortableProgramItem
                            key={program.id}
                            program={program}
                            index={index}
                            isActionRestricted={isActionRestricted}
                            getText={getText}
                            onRemove={removeProgram}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Available Programs */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>{getText('availableCourses')}</CardTitle>
            <div className="relative mt-3">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getText('searchCourse')}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-text-secondary" size={24} />
              </div>
            ) : availablePrograms.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                <p>{getText('noAvailableCourses')}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto">
                {availablePrograms.map((program) => (
                  <div
                    key={program.id}
                    className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg border border-border hover:border-border-hover transition-colors"
                  >
                    <div>
                      <p className="font-medium text-text-primary m-0">{program.title}</p>
                      <p className="text-sm text-text-secondary m-0">
                        {program.category} · {program.duration}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => addProgram(program)}>
                      <Plus size={16} />
                      {getText('addCourse')}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Destructive Update Warning */}
      {destructiveValidation.shouldBlock && (
        <Card className="mt-6 border-status-error bg-status-error/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-status-error shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-text-primary m-0 mb-1">
                  {getText('destructiveUpdateWarning')}
                </p>
                <p className="text-sm text-text-secondary m-0">
                  현재 수강생: {enrolledStudents}명
                </p>
                {destructiveValidation.changes.removed.length > 0 && (
                  <p className="text-sm text-text-secondary m-0 mt-1">
                    • {destructiveValidation.changes.removed.length}개 과정 삭제 감지
                  </p>
                )}
                {destructiveValidation.changes.reordered && (
                  <p className="text-sm text-text-secondary m-0 mt-1">
                    • 과정 순서 변경 감지
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8">
        <Button variant="outline" onClick={() => navigate(prefixPath('/tu/teaching/roadmaps'))} disabled={isSaving}>
          {getText('cancel')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleSave(true)}
          disabled={
            !title ||
            isSaving ||
            (!isEditMode && selectedPrograms.length === 0) ||
            (isEditMode && originalStatus === 'PUBLISHED')
          }
        >
          {isSaving && draftMutation.isPending && <Loader2 size={16} className="animate-spin mr-2" />}
          {getText('saveDraft')}
        </Button>
        <Button
          onClick={() => handleSave(false)}
          disabled={!title || selectedPrograms.length === 0 || isSaving || destructiveValidation.shouldBlock}
        >
          {isSaving && (createMutation.isPending || updateMutation.isPending) && (
            <Loader2 size={16} className="animate-spin mr-2" />
          )}
          {getText('publish')}
        </Button>
      </div>
    </div>
  );
}

/** 정렬 가능한 과정 아이템 컴포넌트 */
interface SortableProgramItemProps {
  program: SelectedProgram;
  index: number;
  isActionRestricted: boolean;
  getText: (key: keyof typeof t) => string;
  onRemove: (id: number) => void;
}

function SortableProgramItem({
  program,
  index,
  isActionRestricted,
  getText,
  onRemove,
}: Readonly<SortableProgramItemProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: program.id,
    disabled: isActionRestricted,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 bg-bg-secondary rounded-lg border ${
        isActionRestricted ? 'border-border bg-bg-secondary/50' : 'border-border'
      } ${isDragging ? 'opacity-50 shadow-lg z-50' : ''}`}
    >
      {/* 드래그 핸들 - 제한 상태에서 비활성화 */}
      {isActionRestricted ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="cursor-not-allowed"
              aria-disabled="true"
              aria-label={getText('cannotReorderRestricted')}
              role="button"
            >
              <Lock size={18} className="text-text-disabled" aria-hidden="true" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getText('cannotReorderRestricted')}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
          aria-label="드래그하여 순서 변경"
        >
          <GripVertical size={18} className="text-text-secondary" />
        </button>
      )}
      <Badge variant="outline" className="shrink-0">
        {getText('step')} {index + 1}
      </Badge>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text-primary m-0 truncate">{program.title}</p>
        <p className="text-sm text-text-secondary m-0">
          {program.category} · {program.duration}
        </p>
      </div>
      {/* 삭제 버튼 - 제한 상태에서 비활성화 */}
      {isActionRestricted ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="ghost"
                size="icon"
                disabled
                aria-disabled="true"
                aria-label={getText('cannotDeleteRestricted')}
              >
                <X size={18} className="text-text-disabled" aria-hidden="true" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getText('cannotDeleteRestricted')}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(program.id)}
          aria-label={`${program.title} 삭제`}
        >
          <X size={18} aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
