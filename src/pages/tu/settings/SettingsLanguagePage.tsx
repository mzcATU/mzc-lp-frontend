import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Globe, Clock } from 'lucide-react';
import { designTokens } from '@/styles/design-tokens';

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
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            marginBottom: '24px',
            backgroundColor: 'transparent',
            border: 'none',
            color: designTokens.text.secondary,
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = designTokens.text.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = designTokens.text.secondary)}
        >
          <ArrowLeft style={{ width: '20px', height: '20px' }} />
          <span>설정으로 돌아가기</span>
        </button>

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
        <section
          style={{
            backgroundColor: designTokens.bg.default,
            border: `1px solid ${designTokens.bg.border}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: `1px solid ${designTokens.bg.border}`,
            }}
          >
            <Globe style={{ width: '20px', height: '20px', color: '#4C2D9A' }} />
            <h2 style={{ color: designTokens.text.primary, fontSize: '18px', fontWeight: 500 }}>
              언어 설정
            </h2>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: designTokens.text.secondary,
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              표시 언어
            </label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setLanguage('ko')}
                style={{
                  padding: '12px 24px',
                  backgroundColor:
                    language === 'ko' ? designTokens.button.brand_default : designTokens.bg.default,
                  color: language === 'ko' ? 'white' : designTokens.text.primary,
                  border: `1px solid ${language === 'ko' ? designTokens.button.brand_default : designTokens.bg.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  minWidth: '120px',
                }}
                onMouseEnter={(e) => {
                  if (language !== 'ko') {
                    e.currentTarget.style.borderColor = '#4C2D9A';
                    e.currentTarget.style.backgroundColor = '#F8F5FC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (language !== 'ko') {
                    e.currentTarget.style.borderColor = designTokens.bg.border;
                    e.currentTarget.style.backgroundColor = designTokens.bg.default;
                  }
                }}
              >
                한국어
              </button>
              <button
                onClick={() => setLanguage('en')}
                style={{
                  padding: '12px 24px',
                  backgroundColor:
                    language === 'en' ? designTokens.button.brand_default : designTokens.bg.default,
                  color: language === 'en' ? 'white' : designTokens.text.primary,
                  border: `1px solid ${language === 'en' ? designTokens.button.brand_default : designTokens.bg.border}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  minWidth: '120px',
                }}
                onMouseEnter={(e) => {
                  if (language !== 'en') {
                    e.currentTarget.style.borderColor = '#4C2D9A';
                    e.currentTarget.style.backgroundColor = '#F8F5FC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (language !== 'en') {
                    e.currentTarget.style.borderColor = designTokens.bg.border;
                    e.currentTarget.style.backgroundColor = designTokens.bg.default;
                  }
                }}
              >
                English
              </button>
            </div>
            <p
              style={{
                fontSize: '12px',
                color: designTokens.text.secondary,
                marginTop: '12px',
              }}
            >
              인터페이스 언어가 즉시 변경됩니다.
            </p>
          </div>
        </section>

        {/* Timezone Section */}
        <section
          style={{
            backgroundColor: designTokens.bg.default,
            border: `1px solid ${designTokens.bg.border}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: `1px solid ${designTokens.bg.border}`,
            }}
          >
            <Clock style={{ width: '20px', height: '20px', color: '#4C2D9A' }} />
            <h2 style={{ color: designTokens.text.primary, fontSize: '18px', fontWeight: 500 }}>
              시간대 설정
            </h2>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                color: designTokens.text.secondary,
                fontSize: '14px',
                marginBottom: '8px',
              }}
            >
              시간대
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                color: designTokens.text.primary,
                backgroundColor: designTokens.bg.default,
                cursor: 'pointer',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4C2D9A')}
              onBlur={(e) => (e.currentTarget.style.borderColor = designTokens.bg.border)}
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <p
              style={{
                fontSize: '12px',
                color: designTokens.text.secondary,
                marginTop: '8px',
              }}
            >
              강의 일정과 알림 시간에 적용됩니다.
            </p>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                color: designTokens.text.secondary,
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              날짜 형식
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dateFormats.map((format) => (
                <label
                  key={format.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    border: `1px solid ${dateFormat === format.value ? '#4C2D9A' : designTokens.bg.border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: dateFormat === format.value ? '#F8F5FC' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (dateFormat !== format.value) {
                      e.currentTarget.style.backgroundColor = '#FAFAFA';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (dateFormat !== format.value) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="dateFormat"
                    value={format.value}
                    checked={dateFormat === format.value}
                    onChange={(e) => setDateFormat(e.target.value)}
                    style={{
                      marginRight: '12px',
                      cursor: 'pointer',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: designTokens.text.primary,
                        fontSize: '14px',
                        marginBottom: '4px',
                      }}
                    >
                      {format.label}
                    </div>
                    <div
                      style={{
                        color: designTokens.text.secondary,
                        fontSize: '12px',
                      }}
                    >
                      {format.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingTop: '16px',
          }}
        >
          <button
            onClick={handleSave}
            style={{
              padding: '10px 24px',
              backgroundColor: designTokens.button.brand_default,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
