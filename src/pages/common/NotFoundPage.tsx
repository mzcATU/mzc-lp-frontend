import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';

/**
 * 404 Not Found 페이지
 * 존재하지 않는 경로에 접근했을 때 표시
 */
export function NotFoundPage() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDark ? 'bg-[#0a0a0a]' : 'bg-gray-50'
    }`}>
      <div className="text-center max-w-md">
        {/* 404 일러스트 */}
        <div className="mb-8 relative">
          <div className="text-[150px] font-bold leading-none bg-gradient-to-br from-[#6778ff] via-[#a855f7] to-[#6bc2f0] bg-clip-text text-transparent select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6778ff]/20 via-[#a855f7]/20 to-[#6bc2f0]/20 blur-2xl" />
          </div>
        </div>

        {/* 메시지 */}
        <h1 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          페이지를 찾을 수 없습니다
        </h1>
        <p className={`text-sm mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          요청하신 페이지가 존재하지 않거나, 이동되었거나, 삭제되었을 수 있습니다.
          <br />
          주소를 다시 확인해주세요.
        </p>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            이전 페이지
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-[#6778ff] to-[#a855f7] hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            홈으로 가기
          </Link>
        </div>

        {/* 검색 제안 */}
        <div className={`mt-10 pt-8 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <p className={`text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            찾고 계신 것이 있으신가요?
          </p>
          <Link
            to="/tu/b2c/courses"
            className={`inline-flex items-center gap-2 text-sm font-medium ${
              isDark ? 'text-[#a78bfa] hover:text-[#c4b5fd]' : 'text-[#6778ff] hover:text-[#8b99ff]'
            } transition-colors`}
          >
            <Search className="w-4 h-4" />
            강의 탐색하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
