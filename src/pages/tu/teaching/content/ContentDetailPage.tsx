import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
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
  Calendar,
  HardDrive,
  Loader2,
  AlertCircle,
  Check,
  History,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button, Badge } from '@/components/common';
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
import { contentService } from '@/services/tu';
import { ContentPreviewModal } from '@/components/domain/tu/content';
import type { ContentType, ContentVersionResponse } from '@/types/tu';

// 콘텐츠 타입별 Badge 컬러 매핑
const contentTypeBadgeColor: Record<ContentType, BadgeColor> = {
  VIDEO: 'blue',
  AUDIO: 'purple',
  DOCUMENT: 'orange',
  IMAGE: 'green',
  EXTERNAL_LINK: 'gray',
};

// 콘텐츠 타입별 아이콘
const contentTypeIcon: Record<ContentType, React.ElementType> = {
  VIDEO: Video,
  AUDIO: Music,
  DOCUMENT: FileText,
  IMAGE: Image,
  EXTERNAL_LINK: Link,
};

// 번역 텍스트
const t = {
  backToList: { ko: '목록으로', en: 'Back to List' },
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
  restoreVersion: { ko: '이 버전으로 복원', en: 'Restore to this version' },
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
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

interface ContentDetailPageProps {
  language?: 'ko' | 'en';
}

export function ContentDetailPage({ language = 'ko' }: Readonly<ContentDetailPageProps>) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      // 1. 파일 교체가 있으면 먼저 실행
      if (hasFileChange && newFile) {
        await replaceFile.mutateAsync({ id: contentId, file: newFile });
      }

      // 2. 파일명 변경이 있으면 실행
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
      navigate('/tu/teaching/content');
    } catch (err: unknown) {
      console.error('Delete failed:', err);
      // 강의에 포함된 콘텐츠 삭제 시도 시 에러 처리
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
      <div className="h-full flex items-center justify-center bg-bg-app">
        <Loader2 size={32} className="animate-spin text-text-secondary" />
        <span className="ml-2 text-text-secondary">{getText('loading')}</span>
      </div>
    );
  }

  // 에러 상태
  if (error || !content) {
    return (
      <div className="h-full flex items-center justify-center bg-bg-app">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-3 text-status-error" />
          <p className="text-text-secondary">{error ? getText('error') : getText('notFound')}</p>
          <Button
            variant="ghost"
            className="mt-4 border border-border"
            onClick={() => navigate('/tu/teaching/content')}
          >
            <ArrowLeft size={16} />
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
    <div className="h-full flex flex-col bg-bg-app">
      {/* Header */}
      <div className="border-b border-border bg-bg-default sticky top-0 z-10">
        <div className="p-6 px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="border border-border"
                onClick={() => navigate('/tu/teaching/content')}
              >
                <ArrowLeft size={16} />
                {getText('backToList')}
              </Button>
              <div>
                <h1 className="text-text-primary text-xl mb-1">{getText('contentDetail')}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant={contentTypeBadgeColor[content.contentType]}>
                    {getText(content.contentType)}
                  </Badge>
                  {isArchived && (
                    <Badge variant="gray">{getText('ARCHIVED')}</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {!isExternalLink && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-border"
                    onClick={() => setPreviewModal(true)}
                  >
                    <Eye size={16} />
                    {getText('preview')}
                  </Button>
                  {content.downloadable !== false && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="border border-border"
                      onClick={handleDownload}
                    >
                      <Download size={16} />
                      {getText('download')}
                    </Button>
                  )}
                </>
              )}
              {isArchived ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="border border-border"
                  onClick={handleRestore}
                  disabled={restoreContent.isPending}
                >
                  <RotateCcw size={16} />
                  {getText('restore')}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="border border-border"
                  onClick={handleArchive}
                  disabled={archiveContent.isPending}
                >
                  <Archive size={16} />
                  {getText('archive')}
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteContent.isPending}
              >
                <Trash2 size={16} />
                {getText('delete')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 px-8 max-w-5xl">
          {/* Basic Info Section */}
          <div className="bg-bg-default border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-primary text-lg font-medium flex items-center gap-2">
                <FileText size={20} />
                {getText('basicInfo')}
              </h2>
              {!isEditing ? (
                <Button variant="ghost" size="sm" className="border border-border" onClick={handleStartEdit}>
                  <Edit2 size={16} />
                  {getText('edit')}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={updateContent.isPending}>
                    <Save size={16} />
                    {getText('save')}
                  </Button>
                  <Button variant="ghost" size="sm" className="border border-border" onClick={handleCancelEdit}>
                    <X size={16} />
                    {getText('cancel')}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Content Name (수정 가능) */}
              <div>
                <label className="block text-sm text-text-secondary mb-1">{getText('contentName')}</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-text-primary text-sm outline-none focus:ring-2 focus:ring-action-primary"
                  />
                ) : (
                  <p className="text-text-primary flex items-center gap-2">
                    <IconComponent size={16} className="text-text-secondary" />
                    {content.originalFileName}
                  </p>
                )}
              </div>

              {/* Actual File Name (읽기 전용) */}
              {!isExternalLink && content.uploadedFileName && (
                <div>
                  <label className="block text-sm text-text-secondary mb-1">{getText('actualFileName')}</label>
                  <p className="text-text-primary text-sm truncate" title={content.uploadedFileName}>
                    {content.uploadedFileName}
                  </p>
                </div>
              )}

              {/* File Replace (편집 모드에서만 표시) */}
              {isEditing && !isExternalLink && (
                <div>
                  <label className="block text-sm text-text-secondary mb-1">{getText('replaceFile')}</label>
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="border border-border"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={16} />
                      파일 선택
                    </Button>
                    {newFile && (
                      <span className="text-sm text-text-primary flex items-center gap-2">
                        <Check size={14} className="text-status-success" />
                        {newFile.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Content Type */}
              <div>
                <label className="block text-sm text-text-secondary mb-1">{getText('contentType')}</label>
                <p className="text-text-primary">
                  <Badge variant={contentTypeBadgeColor[content.contentType]}>
                    {getText(content.contentType)}
                  </Badge>
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-text-secondary mb-1">{getText('status')}</label>
                <p className="text-text-primary">
                  <Badge variant={isArchived ? 'gray' : 'green'}>
                    {getText(content.status)}
                  </Badge>
                </p>
              </div>

              {/* File Size */}
              {!isExternalLink && (
                <div>
                  <label className="block text-sm text-text-secondary mb-1">{getText('fileSize')}</label>
                  <p className="text-text-primary flex items-center gap-2">
                    <HardDrive size={16} className="text-text-secondary" />
                    {formatFileSize(content.fileSize)}
                  </p>
                </div>
              )}

              {/* Duration (Video/Audio) */}
              {content.duration !== null && (
                <div>
                  <label className="block text-sm text-text-secondary mb-1">{getText('duration')}</label>
                  <p className="text-text-primary flex items-center gap-2">
                    <Clock size={16} className="text-text-secondary" />
                    {formatDuration(content.duration)}
                  </p>
                </div>
              )}

              {/* Resolution (Video/Image) */}
              {content.resolution && (
                <div>
                  <label className="block text-sm text-text-secondary mb-1">{getText('resolution')}</label>
                  <p className="text-text-primary">{content.resolution}</p>
                </div>
              )}

              {/* Page Count (Document) */}
              {content.pageCount !== null && (
                <div>
                  <label className="block text-sm text-text-secondary mb-1">{getText('pageCount')}</label>
                  <p className="text-text-primary">{content.pageCount}p</p>
                </div>
              )}

              {/* External URL */}
              {isExternalLink && content.externalUrl && (
                <div className="md:col-span-2">
                  <label className="block text-sm text-text-secondary mb-1">{getText('externalUrl')}</label>
                  <a
                    href={content.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-action-primary hover:underline flex items-center gap-2"
                  >
                    <Link size={16} />
                    {content.externalUrl}
                  </a>
                </div>
              )}

              {/* Current Version */}
              <div>
                <label className="block text-sm text-text-secondary mb-1">{getText('currentVersion')}</label>
                <p className="text-text-primary">v{content.currentVersion}</p>
              </div>

              {/* In Course */}
              <div>
                <label className="block text-sm text-text-secondary mb-1">{getText('inCourse')}</label>
                <p className="text-text-primary flex items-center gap-2">
                  {content.inCourse ? (
                    <>
                      <Check size={16} className="text-status-success" />
                      {getText('yes')}
                    </>
                  ) : (
                    getText('no')
                  )}
                </p>
              </div>

              {/* Created At */}
              <div>
                <label className="block text-sm text-text-secondary mb-1">{getText('createdAt')}</label>
                <p className="text-text-primary flex items-center gap-2">
                  <Calendar size={16} className="text-text-secondary" />
                  {formatDate(content.createdAt)}
                </p>
              </div>

              {/* Updated At */}
              <div>
                <label className="block text-sm text-text-secondary mb-1">{getText('updatedAt')}</label>
                <p className="text-text-primary flex items-center gap-2">
                  <Calendar size={16} className="text-text-secondary" />
                  {formatDate(content.updatedAt)}
                </p>
              </div>

              {/* Description (설명) */}
              <div className="md:col-span-2">
                <label className="block text-sm text-text-secondary mb-1">{getText('description')}</label>
                <p className="text-text-primary">
                  {content.description || <span className="text-text-placeholder">{getText('noDescription')}</span>}
                </p>
              </div>

              {/* Tags (태그) */}
              <div className="md:col-span-2">
                <label className="block text-sm text-text-secondary mb-1">{getText('tags')}</label>
                {content.tags ? (
                  <div className="flex flex-wrap gap-2">
                    {content.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-bg-secondary border border-border rounded-full text-sm text-text-primary"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-placeholder">{getText('noTags')}</p>
                )}
              </div>

            </div>
          </div>

          {/* Version History Section */}
          <div className="bg-bg-default border border-border rounded-lg p-6">
            <h2 className="text-text-primary text-lg font-medium flex items-center gap-2 mb-4">
              <History size={20} />
              {getText('versionHistory')}
            </h2>

            {versionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-text-secondary" />
              </div>
            ) : versions && versions.length > 0 ? (
              <div className="space-y-3">
                {versions.map((version) => (
                  <VersionCard
                    key={version.id}
                    version={version}
                    isCurrentVersion={version.versionNumber === content.currentVersion}
                    isExternalLink={isExternalLink}
                    getText={getText}
                    onRestore={() => handleVersionRestore(version.versionNumber)}
                    isRestoring={restoreVersion.isPending}
                  />
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-center py-8">버전 기록이 없습니다.</p>
            )}
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
  isExternalLink,
  getText,
  onRestore,
  isRestoring,
}: Readonly<VersionCardProps>) {
  const changeTypeText: Record<string, { ko: string; en: string }> = {
    FILE_UPLOAD: { ko: '파일 업로드', en: 'File Upload' },
    FILE_REPLACE: { ko: '파일 교체', en: 'File Replace' },
    METADATA_UPDATE: { ko: '메타데이터 수정', en: 'Metadata Update' },
  };

  return (
    <div
      className={cn(
        'p-4 border rounded-lg',
        isCurrentVersion
          ? 'border-action-primary bg-bg-brand-active'
          : 'border-border bg-bg-secondary'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-text-primary font-medium">
              v{version.versionNumber}
            </span>
            {isCurrentVersion && (
              <Badge variant="indigo">현재 버전</Badge>
            )}
            <Badge variant="gray">
              {changeTypeText[version.changeType]?.ko || version.changeType}
            </Badge>
          </div>
          <p className="text-sm text-text-primary mb-1">
            {version.originalFileName}
          </p>
          {!isExternalLink && version.uploadedFileName && (
            <p className="text-xs text-text-secondary mb-1">
              {version.uploadedFileName}
            </p>
          )}
          {!isExternalLink && version.fileSize && (
            <p className="text-xs text-text-secondary mb-1">
              {formatFileSize(version.fileSize)}
            </p>
          )}
          {version.changeSummary && (
            <p className="text-sm text-text-secondary">{version.changeSummary}</p>
          )}
          <p className="text-xs text-text-placeholder mt-2">
            {formatDate(version.createdAt)}
          </p>
        </div>
        {!isCurrentVersion && (
          <Button
            variant="ghost"
            size="sm"
            className="border border-border shrink-0"
            onClick={onRestore}
            disabled={isRestoring}
          >
            <RotateCcw size={14} />
            {getText('restoreVersion')}
          </Button>
        )}
      </div>
    </div>
  );
}
