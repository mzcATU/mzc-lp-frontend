import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download,
  Eye,
  Edit2,
  Save,
  X,
  Upload,
  Archive,
  RotateCcw,
  Trash2,
  Clock,
  FileText,
  Video,
  Music,
  Image,
  Link,
  HardDrive,
  Loader2,
  AlertCircle,
  Check,
  History,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge, BackButton } from '@/components/common';
import type { BadgeColor } from '@/components/common/Badge/Badge.types';
import {
  useContent,
  useUpdateContent,
  useReplaceFile,
  useArchiveContent,
  useRestoreContent,
  useDeleteContent,
  useContentVersions,
  useRestoreVersion,
} from '@/hooks/tu';
import { useSubdomainPath } from '@/hooks/common/useSubdomainPath';
import { contentService } from '@/services/tu';
import { ContentPreviewModal } from '@/components/domain/tu/content';
import type { ContentType, ContentVersionResponse } from '@/types/tu';

// 콘텐츠 타입별 아이콘
const contentTypeIcon: Record<ContentType, React.ElementType> = {
  VIDEO: Video,
  AUDIO: Music,
  DOCUMENT: FileText,
  IMAGE: Image,
  EXTERNAL_LINK: Link,
};

// 콘텐츠 타입별 아이콘 배경색
const contentTypeIconBg: Record<ContentType, string> = {
  VIDEO: 'bg-blue-50 text-blue-600',
  AUDIO: 'bg-purple-50 text-purple-600',
  DOCUMENT: 'bg-orange-50 text-orange-600',
  IMAGE: 'bg-green-50 text-green-600',
  EXTERNAL_LINK: 'bg-gray-100 text-gray-600',
};

// 콘텐츠 타입별 Badge 컬러
const contentTypeBadgeColor: Record<ContentType, BadgeColor> = {
  VIDEO: 'blue',
  AUDIO: 'purple',
  DOCUMENT: 'orange',
  IMAGE: 'green',
  EXTERNAL_LINK: 'gray',
};

// 번역 텍스트
const t = {
  backToList: { ko: '목록으로 돌아가기', en: 'Back to List' },
  contentDetail: { ko: '콘텐츠 상세', en: 'Content Detail' },
  basicInfo: { ko: '기본 정보', en: 'Basic Information' },
  contentName: { ko: '콘텐츠 이름', en: 'Content Name' },
  actualFileName: { ko: '파일명', en: 'File Name' },
  fileName: { ko: '파일명', en: 'File Name' },
  contentType: { ko: '콘텐츠 유형', en: 'Content Type' },
  status: { ko: '상태', en: 'Status' },
  fileSize: { ko: '파일 크기', en: 'File Size' },
  duration: { ko: '재생 시간', en: 'Duration' },
  resolution: { ko: '해상도', en: 'Resolution' },
  pageCount: { ko: '페이지 수', en: 'Page Count' },
  currentVersion: { ko: '현재 버전', en: 'Current Version' },
  createdAt: { ko: '등록일', en: 'Created At' },
  updatedAt: { ko: '수정일', en: 'Updated At' },
  preview: { ko: '미리보기', en: 'Preview' },
  download: { ko: '다운로드', en: 'Download' },
  edit: { ko: '수정', en: 'Edit' },
  save: { ko: '저장', en: 'Save' },
  cancel: { ko: '취소', en: 'Cancel' },
  replaceFile: { ko: '파일 교체', en: 'Replace File' },
  archive: { ko: '보관', en: 'Archive' },
  restore: { ko: '복원', en: 'Restore' },
  delete: { ko: '삭제', en: 'Delete' },
  versionHistory: { ko: '버전 기록', en: 'Version History' },
  version: { ko: '버전', en: 'Version' },
  changeType: { ko: '변경 유형', en: 'Change Type' },
  changeSummary: { ko: '변경 내용', en: 'Change Summary' },
  restoreVersion: { ko: '복원', en: 'Restore' },
  VIDEO: { ko: '동영상', en: 'Video' },
  AUDIO: { ko: '오디오', en: 'Audio' },
  DOCUMENT: { ko: '문서', en: 'Document' },
  IMAGE: { ko: '이미지', en: 'Image' },
  EXTERNAL_LINK: { ko: '외부 링크', en: 'External Link' },
  ACTIVE: { ko: '활성', en: 'Active' },
  ARCHIVED: { ko: '보관됨', en: 'Archived' },
  FILE_UPLOAD: { ko: '파일 업로드', en: 'File Upload' },
  FILE_REPLACE: { ko: '파일 교체', en: 'File Replace' },
  METADATA_UPDATE: { ko: '메타데이터 수정', en: 'Metadata Update' },
  loading: { ko: '로딩 중...', en: 'Loading...' },
  error: { ko: '오류가 발생했습니다.', en: 'An error occurred.' },
  notFound: { ko: '콘텐츠를 찾을 수 없습니다.', en: 'Content not found.' },
  confirmDelete: { ko: '정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.', en: 'Are you sure you want to delete? This action cannot be undone.' },
  confirmArchive: { ko: '콘텐츠를 보관하시겠습니까?', en: 'Archive this content?' },
  confirmRestore: { ko: '콘텐츠를 복원하시겠습니까?', en: 'Restore this content?' },
  confirmVersionRestore: { ko: '이 버전으로 복원하시겠습니까?', en: 'Restore to this version?' },
  updateSuccess: { ko: '수정되었습니다.', en: 'Updated successfully.' },
  replaceSuccess: { ko: '파일이 교체되었습니다.', en: 'File replaced successfully.' },
  archiveSuccess: { ko: '보관되었습니다.', en: 'Archived successfully.' },
  restoreSuccess: { ko: '복원되었습니다.', en: 'Restored successfully.' },
  deleteSuccess: { ko: '삭제되었습니다.', en: 'Deleted successfully.' },
  deleteFailedInUse: { ko: '이 콘텐츠는 강의에 포함되어 있어 삭제할 수 없습니다.', en: 'This content cannot be deleted because it is included in a course.' },
  updateFailedInUse: { ko: '이 콘텐츠는 강의에 포함되어 있어 수정할 수 없습니다.', en: 'This content cannot be modified because it is included in a course.' },
  versionRestoreSuccess: { ko: '버전이 복원되었습니다.', en: 'Version restored successfully.' },
  externalUrl: { ko: '외부 URL', en: 'External URL' },
  inCourse: { ko: '과정에 포함됨', en: 'In Course' },
  yes: { ko: '예', en: 'Yes' },
  no: { ko: '아니오', en: 'No' },
  description: { ko: '설명', en: 'Description' },
  tags: { ko: '태그', en: 'Tags' },
  noDescription: { ko: '설명 없음', en: 'No description' },
  noTags: { ko: '태그 없음', en: 'No tags' },
  fileInfo: { ko: '파일 정보', en: 'File Information' },
};

// 파일 크기 포맷팅
function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return '-';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// 날짜 포맷팅
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 재생 시간 포맷팅
function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return '-';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${String(s).padStart(2, '0')}s`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

// DetailItem 컴포넌트
interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

function DetailItem({ label, value, icon }: DetailItemProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
        {label}
      </label>
      <div className="text-sm text-[#2A2A2A] font-medium flex items-center gap-1.5">
        {icon && <span className="text-gray-400">{icon}</span>}
        {value}
      </div>
    </div>
  );
}

interface ContentDetailPageProps {
  language?: 'ko' | 'en';
}

export function ContentDetailPage({ language = 'ko' }: Readonly<ContentDetailPageProps>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prefixPath } = useSubdomainPath();
  const contentId = id ? parseInt(id, 10) : 0;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getText = (key: keyof typeof t | string) => {
    const translation = t[key as keyof typeof t];
    if (!translation) return key;
    return language === 'ko' ? translation.ko : translation.en;
  };

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editFileName, setEditFileName] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);

  // 미리보기 모달 상태
  const [previewModal, setPreviewModal] = useState(false);

  // React Query hooks
  const { data: content, isLoading, error } = useContent(contentId);
  const { data: versions, isLoading: versionsLoading } = useContentVersions(contentId);
  const updateContent = useUpdateContent();
  const replaceFile = useReplaceFile();
  const archiveContent = useArchiveContent();
  const restoreContent = useRestoreContent();
  const deleteContent = useDeleteContent();
  const restoreVersion = useRestoreVersion();

  // 편집 모드 시작
  const handleStartEdit = () => {
    if (content) {
      setEditFileName(content.originalFileName);
      setNewFile(null);
      setIsEditing(true);
    }
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFileName('');
    setNewFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 파일 선택 (편집 모드 내에서)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
    }
  };

  // 저장 (파일 교체 + 메타데이터 수정 통합)
  const handleSave = async () => {
    if (!content) return;

    const hasFileChange = newFile !== null;
    const hasNameChange = editFileName.trim() !== content.originalFileName;

    if (!hasFileChange && !hasNameChange) {
      alert('변경된 내용이 없습니다.');
      return;
    }

    try {
      if (hasFileChange && newFile) {
        await replaceFile.mutateAsync({ id: contentId, file: newFile });
      }

      if (hasNameChange && editFileName.trim()) {
        await updateContent.mutateAsync({
          id: contentId,
          request: { originalFileName: editFileName.trim() },
        });
      }

      alert(getText('updateSuccess'));
      setIsEditing(false);
      setNewFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      console.error('Update failed:', err);
      const error = err as { response?: { data?: { error?: { code?: string } } } };
      if (error.response?.data?.error?.code === 'CT010') {
        alert(getText('updateFailedInUse'));
      } else {
        alert(getText('error'));
      }
    }
  };

  // 보관
  const handleArchive = async () => {
    if (!confirm(getText('confirmArchive'))) return;
    try {
      await archiveContent.mutateAsync(contentId);
      alert(getText('archiveSuccess'));
    } catch (err) {
      console.error('Archive failed:', err);
    }
  };

  // 복원
  const handleRestore = async () => {
    if (!confirm(getText('confirmRestore'))) return;
    try {
      await restoreContent.mutateAsync(contentId);
      alert(getText('restoreSuccess'));
    } catch (err) {
      console.error('Restore failed:', err);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!confirm(getText('confirmDelete'))) return;
    try {
      await deleteContent.mutateAsync(contentId);
      alert(getText('deleteSuccess'));
      navigate(prefixPath('/tu/teaching/content'));
    } catch (err: unknown) {
      console.error('Delete failed:', err);
      const error = err as { response?: { data?: { error?: { code?: string } } } };
      if (error.response?.data?.error?.code === 'CT010') {
        alert(getText('deleteFailedInUse'));
      } else {
        alert(getText('error'));
      }
    }
  };

  // 다운로드
  const handleDownload = async () => {
    if (!content) return;
    try {
      await contentService.downloadFile(contentId, content.originalFileName);
    } catch (err) {
      console.error('Download failed:', err);
      alert('다운로드에 실패했습니다.');
    }
  };

  // 버전 복원
  const handleVersionRestore = async (versionNumber: number) => {
    if (!confirm(getText('confirmVersionRestore'))) return;
    try {
      await restoreVersion.mutateAsync({ id: contentId, versionNumber });
      alert(getText('versionRestoreSuccess'));
    } catch (err) {
      console.error('Version restore failed:', err);
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  // 에러 상태
  if (error || !content) {
    return (
      <div className="h-full flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-3 text-red-500" />
          <p className="text-gray-600 mb-4">{error ? getText('error') : getText('notFound')}</p>
          <Button variant="outline" onClick={() => navigate(prefixPath('/tu/teaching/content'))}>
            {getText('backToList')}
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = contentTypeIcon[content.contentType] || FileText;
  const isArchived = content.status === 'ARCHIVED';
  const isExternalLink = content.contentType === 'EXTERNAL_LINK';

  return (
    <div className="h-full flex flex-col bg-[#FAFAFA]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-4">
              <BackButton
                onClick={() => navigate(prefixPath('/tu/teaching/content'))}
                label={getText('backToList')}
              />
            </div>

            {/* Title & Actions */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', contentTypeIconBg[content.contentType])}>
                    <IconComponent size={24} />
                  </div>
                  <h1 className="text-2xl font-bold text-[#2A2A2A] tracking-tight">
                    {content.originalFileName}
                  </h1>
                </div>

                <div className="flex items-center gap-2 pl-[52px]">
                  <Badge variant={isArchived ? 'gray' : 'green'}>
                    {getText(content.status)}
                  </Badge>
                  <Badge variant={contentTypeBadgeColor[content.contentType]}>
                    {getText(content.contentType)}
                  </Badge>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-500">v{content.currentVersion}</span>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-500">{formatDate(content.updatedAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {!isExternalLink && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      onClick={() => setPreviewModal(true)}
                    >
                      <Eye size={16} className="mr-2" />
                      {getText('preview')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 border-gray-200 hover:bg-gray-50"
                      onClick={handleDownload}
                    >
                      <Download size={16} className="mr-2" />
                      {getText('download')}
                    </Button>
                  </>
                )}

                <div className="h-6 w-px bg-gray-200 mx-1" />

                {isArchived ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={handleRestore}
                    disabled={restoreContent.isPending}
                  >
                    <RotateCcw size={16} className="mr-2" />
                    {getText('restore')}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    onClick={handleArchive}
                    disabled={archiveContent.isPending}
                  >
                    <Archive size={16} className="mr-2" />
                    {getText('archive')}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleDelete}
                  disabled={deleteContent.isPending}
                >
                  <Trash2 size={16} className="mr-2" />
                  {getText('delete')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Metadata */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-semibold text-[#2A2A2A] flex items-center gap-2">
                    <FileText size={18} className="text-gray-400" />
                    {getText('basicInfo')}
                  </h3>
                  {!isEditing ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleStartEdit}
                      className="h-8 text-gray-500"
                    >
                      <Edit2 size={14} className="mr-1.5" />
                      {getText('edit')}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="h-8"
                        disabled={updateContent.isPending || replaceFile.isPending}
                      >
                        <Save size={14} className="mr-1.5" />
                        {getText('save')}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-8">
                        <X size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    {/* Content Name */}
                    <div className="col-span-full">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                        {getText('contentName')}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFileName}
                          onChange={(e) => setEditFileName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4C2D9A]/20 focus:border-[#4C2D9A]"
                        />
                      ) : (
                        <p className="text-[#2A2A2A] text-lg font-medium">
                          {content.originalFileName}
                        </p>
                      )}
                    </div>

                    {/* File Replace (Edit Mode) */}
                    {isEditing && !isExternalLink && (
                      <div className="col-span-full p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                          {getText('replaceFile')}
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload size={14} className="mr-2" />
                            파일 선택
                          </Button>
                          {newFile && (
                            <span className="text-sm text-[#4C2D9A] flex items-center gap-2">
                              <Check size={14} />
                              {newFile.name}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="col-span-full">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                        {getText('description')}
                      </label>
                      <p className="text-sm text-[#2A2A2A] leading-relaxed">
                        {content.description || (
                          <span className="text-gray-400 italic">{getText('noDescription')}</span>
                        )}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="col-span-full">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                        {getText('tags')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {content.tags ? (
                          content.tags.split(',').map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                            >
                              #{tag.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic text-sm">{getText('noTags')}</span>
                        )}
                      </div>
                    </div>

                    {/* External URL */}
                    {isExternalLink && content.externalUrl && (
                      <div className="col-span-full">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                          {getText('externalUrl')}
                        </label>
                        <a
                          href={content.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline break-all"
                        >
                          {content.externalUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Version History */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-semibold text-[#2A2A2A] flex items-center gap-2">
                    <History size={18} className="text-gray-400" />
                    {getText('versionHistory')}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {versionsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={24} className="animate-spin text-gray-400" />
                    </div>
                  ) : versions && versions.length > 0 ? (
                    versions.map((version) => (
                      <VersionCard
                        key={version.id}
                        version={version}
                        isCurrentVersion={version.versionNumber === content.currentVersion}
                        isExternalLink={isExternalLink}
                        getText={getText}
                        onRestore={() => handleVersionRestore(version.versionNumber)}
                        isRestoring={restoreVersion.isPending}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8 text-sm">
                      버전 기록이 없습니다.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - File Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-6">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-semibold text-[#2A2A2A] flex items-center gap-2">
                    <HardDrive size={18} className="text-gray-400" />
                    {getText('fileInfo')}
                  </h3>
                </div>
                <div className="p-6 space-y-5">
                  {!isExternalLink && (
                    <DetailItem label={getText('fileSize')} value={formatFileSize(content.fileSize)} />
                  )}
                  {content.duration !== null && content.duration !== undefined && (
                    <DetailItem
                      label={getText('duration')}
                      value={formatDuration(content.duration)}
                      icon={<Clock size={14} />}
                    />
                  )}
                  {content.resolution && (
                    <DetailItem label={getText('resolution')} value={content.resolution} />
                  )}
                  {content.pageCount !== null && content.pageCount !== undefined && (
                    <DetailItem label={getText('pageCount')} value={`${content.pageCount}p`} />
                  )}
                  <div className="pt-4 border-t border-gray-100">
                    <DetailItem label={getText('createdAt')} value={formatDate(content.createdAt)} />
                    <div className="mt-4">
                      <DetailItem label={getText('updatedAt')} value={formatDate(content.updatedAt)} />
                    </div>
                  </div>

                  {isExternalLink && content.externalUrl && (
                    <div className="pt-4 border-t border-gray-100">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
                        {getText('externalUrl')}
                      </label>
                      <a
                        href={content.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        {content.externalUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <ContentPreviewModal
        isOpen={previewModal}
        onClose={() => setPreviewModal(false)}
        contentId={contentId}
        contentType={content.contentType}
        fileName={content.originalFileName}
      />
    </div>
  );
}

// 버전 카드 컴포넌트
interface VersionCardProps {
  version: ContentVersionResponse;
  isCurrentVersion: boolean;
  isExternalLink: boolean;
  getText: (key: keyof typeof t) => string;
  onRestore: () => void;
  isRestoring: boolean;
}

function VersionCard({
  version,
  isCurrentVersion,
  getText,
  onRestore,
  isRestoring,
}: Readonly<VersionCardProps>) {
  const changeTypeText: Record<string, string> = {
    FILE_UPLOAD: '파일 업로드',
    FILE_REPLACE: '파일 교체',
    METADATA_UPDATE: '메타데이터 수정',
  };

  return (
    <div
      className={cn(
        'p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group',
        isCurrentVersion && 'bg-blue-50/30 hover:bg-blue-50/50'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <span
            className={cn(
              'inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold',
              isCurrentVersion ? 'bg-btn-brand text-white' : 'bg-gray-100 text-gray-500'
            )}
          >
            v{version.versionNumber}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">
              {changeTypeText[version.changeType] || version.changeType}
            </span>
            {isCurrentVersion && (
              <Badge variant="indigo">현재</Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{formatDate(version.createdAt)}</p>
          {version.changeSummary && (
            <p className="text-sm text-gray-600 mt-2">{version.changeSummary}</p>
          )}
        </div>
      </div>

      {!isCurrentVersion && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRestore}
          disabled={isRestoring}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-btn-brand"
        >
          <RotateCcw size={14} className="mr-1.5" />
          <span className="text-xs">{getText('restore')}</span>
        </Button>
      )}
    </div>
  );
}
