import { Globe, Check } from 'lucide-react';
import { useThemeStore } from '@/store/common/themeStore';
import { useLanguageStore, useTranslation, type Language } from '@/store/common/languageStore';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/common';

const languages: { value: Language; label: string; flag: string }[] = [
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'en', label: 'English', flag: '🇺🇸' },
];

export function SettingsLanguagePage() {
  const { theme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const cardClass = isDark
    ? 'bg-white/5 border-white/10'
    : 'bg-white border-gray-200 shadow-sm';

  return (
    <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.mypage.languageRegion}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t.settings.languageDesc}
          </p>
        </div>

        {/* Language Selection Card */}
        <Card className={cardClass}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Globe className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                {t.settings.selectLanguage}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                    language === lang.value
                      ? isDark
                        ? 'bg-gradient-to-r from-[#6778ff]/20 to-[#a855f7]/20 border border-[#6778ff]/50'
                        : 'bg-blue-50 border border-blue-300'
                      : isDark
                      ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{lang.flag}</span>
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {lang.label}
                    </span>
                  </div>
                  {language === lang.value && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-[#6778ff]' : 'bg-blue-600'
                    }`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm mt-4 text-gray-500">
              {language === 'ko'
                ? '언어 변경 시 모든 페이지에 즉시 적용됩니다.'
                : 'Language changes will be applied immediately to all pages.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
