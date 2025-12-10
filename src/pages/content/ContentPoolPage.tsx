import { useState } from 'react';
import { designTokens } from '@/styles/design-tokens';
import { Button } from '@/components/ui';
import { Upload, Link as LinkIcon, FolderPlus } from 'lucide-react';

export const ContentPoolPage = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  // TODO: useContents, useFolderTree 훅 연동
  const folders: Array<{
    folderId: number;
    folderName: string;
    children?: Array<{ folderId: number; folderName: string }>;
  }> = [];

  const contents: Array<{
    contentId: number;
    fileName: string;
    contentType: string;
    fileSize: number;
    createdAt: string;
  }> = [];

  const handleCreateFolder = () => {
    console.log('새 폴더 생성');
  };

  const handleUpload = () => {
    console.log('파일 업로드');
  };

  const handleAddExternalLink = () => {
    console.log('외부 링크 추가');
  };

  return (
    <div
      className="flex h-full"
      style={{ backgroundColor: designTokens.bg.default }}
    >
      {/* 좌측: 폴더 트리 */}
      <aside
        className="w-64 border-r p-4 flex flex-col"
        style={{
          backgroundColor: designTokens.bg.secondary,
          borderColor: designTokens.bg.border,
        }}
      >
        <header className="flex items-center justify-between mb-4">
          <h2
            className="font-semibold"
            style={{ color: designTokens.text.primary }}
          >
            폴더
          </h2>
          <Button variant="ghost" size="sm" onClick={handleCreateFolder}>
            <FolderPlus className="w-4 h-4" />
          </Button>
        </header>

        {/* FolderTree 컴포넌트 연동 예정 */}
        <div className="flex-1 overflow-auto">
          <div
            className={`p-2 rounded cursor-pointer ${
              selectedFolderId === null ? 'bg-neutral-100' : ''
            }`}
            onClick={() => setSelectedFolderId(null)}
            style={{ color: designTokens.text.primary }}
          >
            📁 전체
          </div>
          {folders.map((folder) => (
            <div
              key={folder.folderId}
              className={`p-2 rounded cursor-pointer ml-2 ${
                selectedFolderId === folder.folderId ? 'bg-neutral-100' : ''
              }`}
              onClick={() => setSelectedFolderId(folder.folderId)}
              style={{ color: designTokens.text.primary }}
            >
              📁 {folder.folderName}
            </div>
          ))}
        </div>
      </aside>

      {/* 우측: 콘텐츠 목록 */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-semibold"
            style={{ color: designTokens.text.primary }}
          >
            콘텐츠 풀
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleAddExternalLink}>
              <LinkIcon className="w-4 h-4 mr-2" />
              외부 링크
            </Button>
            <Button onClick={handleUpload}>
              <Upload className="w-4 h-4 mr-2" />
              파일 업로드
            </Button>
          </div>
        </header>

        {/* ContentGrid 컴포넌트 연동 예정 */}
        {contents.length === 0 ? (
          <div
            className="rounded-lg border-2 border-dashed p-12 text-center"
            style={{ borderColor: designTokens.bg.border }}
          >
            <p style={{ color: designTokens.text.placeholder }}>
              콘텐츠가 없습니다.
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: designTokens.text.placeholder }}
            >
              파일을 업로드하거나 외부 링크를 추가하세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {contents.map((content) => (
              <div
                key={content.contentId}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: designTokens.bg.secondary,
                  borderColor: designTokens.bg.border,
                }}
              >
                <p style={{ color: designTokens.text.primary }}>
                  {content.fileName}
                </p>
                <p
                  className="text-sm"
                  style={{ color: designTokens.text.secondary }}
                >
                  {content.contentType}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
