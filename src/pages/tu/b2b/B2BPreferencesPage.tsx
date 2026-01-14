import { Sun, Moon, Globe, Bell } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useLanguageStore, useTranslation } from '@/store/common/languageStore';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
  isDark: boolean;
}

function SettingItem({ icon, title, description, action, isDark }: SettingItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl ${
        isDark ? 'bg-white/5' : 'bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2.5 rounded-lg ${
            isDark ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-600'
          }`}
        >
          {icon}
        </div>
        <div>
          <h3
            className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </h3>
          <p
            className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {description}
          </p>
        </div>
      </div>
      {action}
    </div>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  isDark: boolean;
}

function ToggleSwitch({ checked, onChange, isDark }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full p-1 transition-colors ${
        checked ? 'bg-[#6778ff]' : isDark ? 'bg-white/20' : 'bg-gray-300'
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function B2BPreferencesPage() {
  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

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
            {language === 'ko' ? '환경설정' : 'Preferences'}
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {language === 'ko'
              ? '앱 사용 환경을 설정하세요.'
              : 'Configure your app experience.'}
          </p>
        </div>

        {/* Settings Card */}
        <div
          className={`rounded-2xl p-6 ${
            isDark
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-gray-200 shadow-sm'
          }`}
        >
          <div className="space-y-4">
            {/* Theme */}
            <SettingItem
              icon={isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              title={language === 'ko' ? '다크 모드' : 'Dark Mode'}
              description={
                language === 'ko'
                  ? '어두운 테마를 사용합니다.'
                  : 'Use dark theme for the app.'
              }
              action={
                <ToggleSwitch
                  checked={isDark}
                  onChange={toggleTheme}
                  isDark={isDark}
                />
              }
              isDark={isDark}
            />

            {/* Divider */}
            <div
              className={`border-t ${
                isDark ? 'border-white/10' : 'border-gray-100'
              }`}
            />

            {/* Language */}
            <SettingItem
              icon={<Globe className="w-5 h-5" />}
              title={language === 'ko' ? '언어' : 'Language'}
              description={
                language === 'ko'
                  ? '앱에서 사용할 언어를 선택합니다.'
                  : 'Select your preferred language.'
              }
              action={
                <button
                  onClick={toggleLanguage}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark
                      ? 'bg-[#6778ff]/20 text-[#6778ff] hover:bg-[#6778ff]/30'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {language === 'ko' ? '한국어' : 'English'}
                </button>
              }
              isDark={isDark}
            />

            {/* Divider */}
            <div
              className={`border-t ${
                isDark ? 'border-white/10' : 'border-gray-100'
              }`}
            />

            {/* Notifications */}
            <SettingItem
              icon={<Bell className="w-5 h-5" />}
              title={language === 'ko' ? '알림' : 'Notifications'}
              description={
                language === 'ko'
                  ? '푸시 알림을 받습니다.'
                  : 'Receive push notifications.'
              }
              action={
                <ToggleSwitch
                  checked={true}
                  onChange={() => {}}
                  isDark={isDark}
                />
              }
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
