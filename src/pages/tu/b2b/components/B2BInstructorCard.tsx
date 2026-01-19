import { MessageCircle } from 'lucide-react';

interface B2BInstructorCardProps {
  instructorName: string;
  instructorImage?: string | null;
  isDark: boolean;
  onQuestionClick?: () => void;
}

export function B2BInstructorCard({
  instructorName,
  instructorImage,
  isDark,
  onQuestionClick,
}: B2BInstructorCardProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden border ${
        isDark ? 'glass border-white/10' : 'bg-white border-gray-200 shadow-lg'
      }`}
    >
      <div className="p-6">
        <h3 className={`text-base font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          👨‍🏫 강사 소개
        </h3>

        <div className="flex items-center gap-3 mb-4">
          {instructorImage ? (
            <img
              src={instructorImage}
              alt={instructorName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2]`}
            >
              <span className="text-white text-xl">👨‍🏫</span>
            </div>
          )}
          <div className="flex-1">
            <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {instructorName}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              강사
            </p>
          </div>
        </div>

        {onQuestionClick && (
          <button
            onClick={onQuestionClick}
            className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border ${
              isDark
                ? 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">강사에게 질문하기</span>
          </button>
        )}
      </div>
    </div>
  );
}
