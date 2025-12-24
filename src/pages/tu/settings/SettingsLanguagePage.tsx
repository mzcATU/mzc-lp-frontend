import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Globe, Clock } from 'lucide-react';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
  NativeSelect,
} from '@/components/common';

export function SettingsLanguagePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [timezone, setTimezone] = useState('Asia/Seoul');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');

  const basePath = location.pathname.split('/settings')[0];

  const handleBack = () => {
    navigate(`${basePath}/settings`);
  };

  const timezones = [
    { value: 'Asia/Seoul', label: '서울 (UTC+9)' },
    { value: 'America/New_York', label: '뉴욕 (UTC-5)' },
    { value: 'America/Los_Angeles', label: '로스앤젤레스 (UTC-8)' },
    { value: 'Europe/London', label: '런던 (UTC+0)' },
    { value: 'Europe/Paris', label: '파리 (UTC+1)' },
    { value: 'Asia/Tokyo', label: '도쿄 (UTC+9)' },
    { value: 'Asia/Shanghai', label: '상하이 (UTC+8)' },
    { value: 'Australia/Sydney', label: '시드니 (UTC+10)' },
  ];

  const dateFormats = [
    { value: 'YYYY-MM-DD', label: '2024-12-23', description: '연-월-일' },
    { value: 'MM/DD/YYYY', label: '12/23/2024', description: '월/일/연' },
    { value: 'DD/MM/YYYY', label: '23/12/2024', description: '일/월/연' },
    { value: 'YYYY년 MM월 DD일', label: '2024년 12월 23일', description: '한국어 형식' },
  ];

  const handleSave = () => {
    alert('언어 및 지역 설정이 저장되었습니다.');
  };

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: designTokens.bg.app_default,
        minHeight: '100%',
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header with Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>설정으로 돌아가기</span>
        </Button>

        <h1
          style={{
            color: designTokens.text.primary,
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '8px',
          }}
        >
          언어 및 지역
        </h1>
        <p style={{ color: designTokens.text.secondary, marginBottom: '32px' }}>
          언어, 시간대 및 날짜 형식을 설정하세요
        </p>

        {/* Language Section */}
        <Card className="mb-6">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
              <CardTitle className="text-lg font-medium">언어 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6">
            <div>
              <Label className="mb-3 text-muted-foreground text-sm">표시 언어</Label>
              <div className="flex gap-3 mt-3 flex-wrap">
                <Button
                  variant={language === 'ko' ? 'default' : 'outline'}
                  onClick={() => setLanguage('ko')}
                  className="min-w-[120px]"
                >
                  한국어
                </Button>
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  onClick={() => setLanguage('en')}
                  className="min-w-[120px]"
                >
                  English
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                인터페이스 언어가 즉시 변경됩니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timezone Section */}
        <Card className="mb-6">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
              <CardTitle className="text-lg font-medium">시간대 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6">
            <div className="mb-6">
              <NativeSelect
                label="시간대"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                options={timezones}
              />
              <p className="text-xs text-muted-foreground mt-2">
                강의 일정과 알림 시간에 적용됩니다.
              </p>
            </div>

            <div>
              <Label className="mb-3 text-muted-foreground text-sm">날짜 형식</Label>
              <div className="flex flex-col gap-2 mt-3">
                {dateFormats.map((format) => {
                  const isSelected = dateFormat === format.value;
                  return (
                    <label
                      key={format.value}
                      className="flex items-center p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50"
                      style={{
                        border: `1px solid ${isSelected ? designTokens.action.primary_default : designTokens.bg.border}`,
                        backgroundColor: isSelected ? designTokens.bg.secondary : 'transparent',
                      }}
                    >
                      <input
                        type="radio"
                        name="dateFormat"
                        value={format.value}
                        checked={isSelected}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="mr-3 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div style={{ color: designTokens.text.primary, fontSize: '14px', marginBottom: '4px' }}>
                          {format.label}
                        </div>
                        <div style={{ color: designTokens.text.secondary, fontSize: '12px' }}>
                          {format.description}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
