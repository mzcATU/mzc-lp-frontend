import { useState } from 'react';
import { designTokens } from '@/styles/design-tokens';
import { Button } from '@/components/ui';
import { Search, Edit, FolderInput, Trash2 } from 'lucide-react';

export const LearningObjectsPage = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  // TODO: useLearningObjects, useFolderTree 훅 연동
  const folders: Array<{
    folderId: number;
    folderName: string;
    children?: Array<{ folderId: number; folderName: string }>;
  }> = [];

  const learningObjects: Array<{
    learningObjectId: number;
    name: string;
    content?: {
      contentType: string;
      duration?: number;
    };
    folder?: {
      folderName: string;
    };
  }> = [];

  const handleEdit = (lo: (typeof learningObjects)[0]) => {
    console.log('수정:', lo);
  };

  const handleMove = (lo: (typeof learningObjects)[0]) => {
    console.log('이동:', lo);
  };

  const handleDelete = (lo: (typeof learningObjects)[0]) => {
    if (confirm('학습객체를 삭제하시겠습니까?')) {
      console.log('삭제:', lo);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getContentTypeIcon = (type?: string) => {
    switch (type) {
      case 'VIDEO':
        return '🎬';
      case 'PDF':
        return '📄';
      case 'IMAGE':
        return '🖼️';
      case 'AUDIO':
        return '🎵';
      default:
        return '📁';
    }
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
        <h2
          className="font-semibold mb-4"
          style={{ color: designTokens.text.primary }}
        >
          폴더
        </h2>

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

      {/* 우측: 학습객체 목록 */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-semibold"
            style={{ color: designTokens.text.primary }}
          >
            학습객체
          </h1>

          {/* 검색 */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: designTokens.text.placeholder }}
            />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="학습객체 검색..."
              className="pl-10 pr-4 py-2 rounded-lg border outline-none"
              style={{
                backgroundColor: designTokens.bg.secondary,
                borderColor: designTokens.bg.border,
                color: designTokens.text.primary,
              }}
            />
          </div>
        </header>

        {/* 테이블 */}
        <div
          className="rounded-lg border"
          style={{
            backgroundColor: designTokens.bg.default,
            borderColor: designTokens.bg.border,
          }}
        >
          <table className="w-full">
            <thead>
              <tr
                style={{
                  borderBottomWidth: 1,
                  borderColor: designTokens.bg.border,
                }}
              >
                <th
                  className="text-left p-4 font-medium"
                  style={{ color: designTokens.text.secondary }}
                >
                  이름
                </th>
                <th
                  className="text-left p-4 font-medium"
                  style={{ color: designTokens.text.secondary }}
                >
                  타입
                </th>
                <th
                  className="text-left p-4 font-medium"
                  style={{ color: designTokens.text.secondary }}
                >
                  재생시간/페이지
                </th>
                <th
                  className="text-left p-4 font-medium"
                  style={{ color: designTokens.text.secondary }}
                >
                  폴더
                </th>
                <th
                  className="text-left p-4 font-medium"
                  style={{ color: designTokens.text.secondary }}
                >
                  액션
                </th>
              </tr>
            </thead>
            <tbody>
              {learningObjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center"
                    style={{ color: designTokens.text.placeholder }}
                  >
                    학습객체가 없습니다.
                  </td>
                </tr>
              ) : (
                learningObjects.map((lo) => (
                  <tr
                    key={lo.learningObjectId}
                    style={{
                      borderBottomWidth: 1,
                      borderColor: designTokens.bg.border,
                    }}
                  >
                    <td
                      className="p-4"
                      style={{ color: designTokens.text.primary }}
                    >
                      {lo.name}
                    </td>
                    <td className="p-4">
                      <span className="text-lg">
                        {getContentTypeIcon(lo.content?.contentType)}
                      </span>
                    </td>
                    <td
                      className="p-4"
                      style={{ color: designTokens.text.secondary }}
                    >
                      {formatDuration(lo.content?.duration)}
                    </td>
                    <td
                      className="p-4"
                      style={{ color: designTokens.text.secondary }}
                    >
                      {lo.folder?.folderName || '최상위'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(lo)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMove(lo)}
                        >
                          <FolderInput className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(lo)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
