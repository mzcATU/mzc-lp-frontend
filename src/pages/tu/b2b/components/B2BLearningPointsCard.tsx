import { CheckCircle } from 'lucide-react';

interface B2BLearningPointsCardProps {
  points: string[];
  isDark: boolean;
}

export function B2BLearningPointsCard({ points, isDark }: B2BLearningPointsCardProps) {
  if (points.length === 0) return null;

  return (
    <div
      className={`rounded-2xl overflow-hidden border ${
        isDark ? 'glass border-white/10' : 'bg-white border-gray-200 shadow-lg'
      }`}
    >
      <div className="p-6">
        <h3 className={`text-base font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ✨ 이런 걸 배워요
        </h3>
        <div className="space-y-3">
          {points.map((point, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <CheckCircle
                className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-[#6778ff]' : 'text-purple-600'}`}
              />
              <span className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {point}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
