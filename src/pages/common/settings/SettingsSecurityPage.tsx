import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Lock,
  AlertTriangle,
  Shield,
  CheckCircle,
  Camera,
} from 'lucide-react';
import { designTokens } from '@/styles/design-tokens';

export function SettingsSecurityPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileData, setProfileData] = useState({
    name: '김교수',
    email: 'professor.kim@mzrun.edu',
    joinDate: '2024-01-15',
    profileImage: undefined as File | undefined,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [designAuthStatus, setDesignAuthStatus] = useState<'USER' | 'DESIGNER' | 'OWNER'>('USER');
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get base path from current location
  const basePath = location.pathname.split('/settings')[0];
  const isUserRole = basePath === '/tu';

  const handleBack = () => {
    navigate(`${basePath}/settings`);
  };

  const handleProfileSave = () => {
    alert('프로필 정보가 저장되었습니다.');
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    alert('비밀번호가 변경되었습니다.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleRequestDesignAuth = () => {
    if (confirm('강의 개설 권한을 요청하시겠습니까?')) {
      setIsRequestPending(true);
      setTimeout(() => {
        setDesignAuthStatus('DESIGNER');
        setIsRequestPending(false);
        alert('권한이 승인되었습니다.');
      }, 1500);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      setProfileData((prev) => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAuthBadgeColor = (status: 'USER' | 'DESIGNER' | 'OWNER') => {
    switch (status) {
      case 'USER':
        return '#999999';
      case 'DESIGNER':
        return '#4C2D9A';
      case 'OWNER':
        return '#FF7043';
      default:
        return '#999999';
    }
  };

  const getAuthLabel = (status: 'USER' | 'DESIGNER' | 'OWNER') => {
    switch (status) {
      case 'USER':
        return '일반 사용자';
      case 'DESIGNER':
        return '강의 개설 가능';
      case 'OWNER':
        return '전체 권한';
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        backgroundColor: designTokens.bg.app_default,
        minHeight: '100%',
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
          계정 및 보안
        </h1>
        <p style={{ color: designTokens.text.secondary, marginBottom: '32px' }}>
          계정 정보 및 보안 설정을 관리하세요
        </p>

        {/* Profile Information Section */}
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
            <Shield style={{ width: '20px', height: '20px', color: '#4C2D9A' }} />
            <h2 style={{ color: designTokens.text.primary, fontSize: '18px', fontWeight: 500 }}>
              프로필 정보
            </h2>
          </div>

          {/* Profile Image */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                color: designTokens.text.secondary,
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              프로필 이미지
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: profileImagePreview ? 'transparent' : '#F4F4F4',
                  border: `2px solid ${designTokens.bg.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <User style={{ width: '32px', height: '32px', color: '#999999' }} />
                )}
              </div>
              <div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: designTokens.bg.default,
                    border: `1px solid ${designTokens.bg.border}`,
                    borderRadius: '8px',
                    color: designTokens.text.primary,
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4C2D9A';
                    e.currentTarget.style.backgroundColor = '#F8F5FC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = designTokens.bg.border;
                    e.currentTarget.style.backgroundColor = designTokens.bg.default;
                  }}
                >
                  <Camera style={{ width: '16px', height: '16px' }} />
                  이미지 변경
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <p
                  style={{
                    fontSize: '12px',
                    color: designTokens.text.secondary,
                    marginTop: '8px',
                  }}
                >
                  JPG, PNG (최대 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: designTokens.text.secondary,
                fontSize: '14px',
                marginBottom: '8px',
              }}
            >
              <User style={{ width: '16px', height: '16px' }} />
              이름
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                color: designTokens.text.primary,
                backgroundColor: designTokens.bg.default,
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4C2D9A')}
              onBlur={(e) => (e.currentTarget.style.borderColor = designTokens.bg.border)}
            />
          </div>

          {/* Email (Read-only) */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: designTokens.text.secondary,
                fontSize: '14px',
                marginBottom: '8px',
              }}
            >
              <Mail style={{ width: '16px', height: '16px' }} />
              이메일
            </label>
            <input
              type="email"
              value={profileData.email}
              readOnly
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                color: designTokens.text.secondary,
                backgroundColor: '#F8F8F8',
                cursor: 'not-allowed',
              }}
            />
          </div>

          {/* Join Date (Read-only) */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: designTokens.text.secondary,
                fontSize: '14px',
                marginBottom: '8px',
              }}
            >
              <Calendar style={{ width: '16px', height: '16px' }} />
              가입일
            </label>
            <input
              type="text"
              value={profileData.joinDate}
              readOnly
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                color: designTokens.text.secondary,
                backgroundColor: '#F8F8F8',
                cursor: 'not-allowed',
              }}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleProfileSave}
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
        </section>

        {/* Password Change Section */}
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
            <Lock style={{ width: '20px', height: '20px', color: '#4C2D9A' }} />
            <h2 style={{ color: designTokens.text.primary, fontSize: '18px', fontWeight: 500 }}>
              비밀번호 변경
            </h2>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                color: designTokens.text.secondary,
                fontSize: '14px',
                marginBottom: '8px',
              }}
            >
              현재 비밀번호
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                color: designTokens.text.primary,
                backgroundColor: designTokens.bg.default,
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4C2D9A')}
              onBlur={(e) => (e.currentTarget.style.borderColor = designTokens.bg.border)}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                color: designTokens.text.secondary,
                fontSize: '14px',
                marginBottom: '8px',
              }}
            >
              새 비밀번호
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                color: designTokens.text.primary,
                backgroundColor: designTokens.bg.default,
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4C2D9A')}
              onBlur={(e) => (e.currentTarget.style.borderColor = designTokens.bg.border)}
            />
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
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${designTokens.bg.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                color: designTokens.text.primary,
                backgroundColor: designTokens.bg.default,
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4C2D9A')}
              onBlur={(e) => (e.currentTarget.style.borderColor = designTokens.bg.border)}
            />
          </div>

          <button
            onClick={handlePasswordChange}
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
            비밀번호 변경
          </button>
        </section>

        {/* Design Authority Section (User Role Only) */}
        {isUserRole && (
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
              <CheckCircle style={{ width: '20px', height: '20px', color: '#4C2D9A' }} />
              <h2 style={{ color: designTokens.text.primary, fontSize: '18px', fontWeight: 500 }}>
                강의 개설 권한
              </h2>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: designTokens.text.secondary,
                  fontSize: '14px',
                  marginBottom: '12px',
                }}
              >
                현재 권한 상태
              </label>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: `${getAuthBadgeColor(designAuthStatus)}15`,
                  border: `1px solid ${getAuthBadgeColor(designAuthStatus)}`,
                  borderRadius: '20px',
                  fontSize: '14px',
                  color: getAuthBadgeColor(designAuthStatus),
                  fontWeight: 500,
                }}
              >
                {getAuthLabel(designAuthStatus)}
              </div>
            </div>

            {designAuthStatus === 'USER' && (
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: designTokens.text.secondary,
                    marginBottom: '16px',
                    lineHeight: '1.6',
                  }}
                >
                  강의를 개설하고 콘텐츠를 등록하려면 권한을 요청해주세요.
                </p>
                <button
                  onClick={handleRequestDesignAuth}
                  disabled={isRequestPending}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: isRequestPending ? '#CCCCCC' : designTokens.button.brand_default,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isRequestPending ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) =>
                    !isRequestPending && (e.currentTarget.style.opacity = '0.9')
                  }
                  onMouseLeave={(e) =>
                    !isRequestPending && (e.currentTarget.style.opacity = '1')
                  }
                >
                  {isRequestPending ? '요청 중...' : '강의 개설 권한 요청'}
                </button>
              </div>
            )}

            {(designAuthStatus === 'DESIGNER' || designAuthStatus === 'OWNER') && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#E8F5E9',
                  border: '1px solid #4CAF50',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <CheckCircle style={{ width: '20px', height: '20px', color: '#4CAF50' }} />
                <p style={{ fontSize: '14px', color: '#2E7D32' }}>
                  강의 개설 및 콘텐츠 등록 권한이 활성화되었습니다.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Account Management Section */}
        <section
          style={{
            backgroundColor: designTokens.bg.default,
            border: `1px solid ${designTokens.bg.border}`,
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: `1px solid ${designTokens.bg.border}`,
            }}
          >
            <AlertTriangle style={{ width: '20px', height: '20px', color: '#FF7043' }} />
            <h2 style={{ color: designTokens.text.primary, fontSize: '18px', fontWeight: 500 }}>
              계정 관리
            </h2>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#FFF3E0',
              border: '1px solid #FFB74D',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            <p style={{ fontSize: '14px', color: '#E65100', lineHeight: '1.6' }}>
              계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
            </p>
          </div>

          <button
            onClick={() => {
              if (
                confirm(
                  '정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
                )
              ) {
                alert('계정 삭제가 요청되었습니다.');
              }
            }}
            style={{
              padding: '10px 24px',
              backgroundColor: 'transparent',
              color: '#D32F2F',
              border: '1px solid #D32F2F',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D32F2F';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#D32F2F';
            }}
          >
            회원 탈퇴
          </button>
        </section>
      </div>
    </div>
  );
}
