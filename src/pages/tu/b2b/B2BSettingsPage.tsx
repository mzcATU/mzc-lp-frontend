import { useNavigate, useParams } from 'react-router-dom';
import { User, Settings, ChevronRight } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useLanguageStore } from '@/store/common/languageStore';

interface SettingsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  isDark: boolean;
}

function SettingsCard({ icon, title, description, onClick, isDark }: SettingsCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-2xl text-left transition-all group ${
        isDark
          ? 'bg-white/5 hover:bg-white/10 border border-white/10'
          : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-xl ${
            isDark ? 'bg-[#6778ff]/20 text-[#6778ff]' : 'bg-blue-100 text-blue-600'
          }`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </h3>
          <p
            className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {description}
          </p>
        </div>
        <ChevronRight
          className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}
        />
      </div>
    </button>
  );
}

export function B2BSettingsPage() {
  const navigate = useNavigate();
  const { subdomain } = useParams<{ subdomain: string }>();
  const { theme } = useThemeStore();
  const { language } = useLanguageStore();
  const isDark = theme === 'dark';

  const prefixPath = (path: string) => {
    if (subdomain) {
      return `/${subdomain}${path}`;
    }
    return path;
  };

  const settingsCards = [
    {
      id: 'profile',
      icon: <User className="w-6 h-6" />,
      title: language === 'ko' ? '프로필' : 'Profile',
      description:
        language === 'ko'
          ? '이름, 이메일, 프로필 사진 등 개인 정보를 관리합니다.'
          : 'Manage your personal information like name, email, and profile picture.',
      path: '/tu/b2b/mypage/profile',
    },
    {
      id: 'preferences',
      icon: <Settings className="w-6 h-6" />,
      title: language === 'ko' ? '환경설정' : 'Preferences',
      description:
        language === 'ko'
          ? '언어, 알림, 테마 등 앱 환경을 설정합니다.'
          : 'Configure app settings like language, notifications, and theme.',
      path: '/tu/b2b/mypage/settings/preferences',
    },
  ];

  return (
    <div className={`min-h-full p-6 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {language === 'ko' ? '설정' : 'Settings'}
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {language === 'ko'
              ? '계정 및 앱 환경을 관리하세요.'
              : 'Manage your account and app preferences.'}
          </p>
        </div>

        {/* Settings Cards */}
        <div className="space-y-4">
          {settingsCards.map((card) => (
            <SettingsCard
              key={card.id}
              icon={card.icon}
              title={card.title}
              description={card.description}
              onClick={() => navigate(prefixPath(card.path))}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
