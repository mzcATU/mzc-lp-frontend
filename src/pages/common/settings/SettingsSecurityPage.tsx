import { useState, useRef, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Alert,
  AlertDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Label,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/common';
import {
  useMyProfile,
  useUpdateProfile,
  useChangePassword,
  useUploadProfileImage,
  useWithdraw,
} from '@/hooks/common';

export function SettingsSecurityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API Hooks
  const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadImageMutation = useUploadProfileImage();
  const withdrawMutation = useWithdraw();

  // Local State
  const [profileData, setProfileData] = useState({
    name: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [designAuthStatus, setDesignAuthStatus] = useState<'USER' | 'DESIGNER' | 'OWNER'>('USER');
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [withdrawPassword, setWithdrawPassword] = useState('');

  // API 베이스 URL (uploads는 /api 없이 직접 접근)
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace('/api', '');

  // Sync profile data from API
  useEffect(() => {
    if (profile) {
      setProfileData({ name: profile.name });
      if (profile.profileImageUrl) {
        // 상대 경로면 백엔드 URL 붙이기
        const imageUrl = profile.profileImageUrl.startsWith('http')
          ? profile.profileImageUrl
          : `${apiBaseUrl}${profile.profileImageUrl}`;
        setProfileImagePreview(imageUrl);
      }
    }
  }, [profile, apiBaseUrl]);

  // Get base path from current location
  const basePath = location.pathname.split('/settings')[0];
  const isUserRole = basePath === '/tu';

  const handleBack = () => {
    navigate(`${basePath}/settings`);
  };

  const handleProfileSave = async () => {
    if (!profileData.name.trim()) {
      toast.error('이름을 입력해주세요.');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({ name: profileData.name });
      toast.success('프로필 정보가 저장되었습니다.');
    } catch {
      toast.error('프로필 저장에 실패했습니다.');
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('비밀번호가 변경되었습니다.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
    }
  };

  const handleRequestDesignAuth = () => {
    setIsRequestPending(true);
    // TODO: 실제 API 연동 시 구현
    setTimeout(() => {
      setDesignAuthStatus('DESIGNER');
      setIsRequestPending(false);
      toast.success('권한이 승인되었습니다.');
    }, 1500);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      await uploadImageMutation.mutateAsync(file);
      toast.success('프로필 이미지가 업로드되었습니다.');
    } catch {
      toast.error('이미지 업로드에 실패했습니다.');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawPassword) {
      toast.error('비밀번호를 입력해주세요.');
      return;
    }
    try {
      await withdrawMutation.mutateAsync(withdrawPassword);
      toast.success('회원 탈퇴가 완료되었습니다.');
      navigate('/');
    } catch {
      toast.error('회원 탈퇴에 실패했습니다. 비밀번호를 확인해주세요.');
    }
  };

  const getAuthBadgeVariant = (status: 'USER' | 'DESIGNER' | 'OWNER') => {
    switch (status) {
      case 'USER':
        return 'gray' as const;
      case 'DESIGNER':
        return 'indigo' as const;
      case 'OWNER':
        return 'orange' as const;
      default:
        return 'gray' as const;
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoadingProfile) {
    return (
      <div
        className="flex items-center justify-center min-h-full"
        style={{ backgroundColor: designTokens.bg.app_default }}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: designTokens.text.secondary }} />
      </div>
    );
  }

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
          계정 및 보안
        </h1>
        <p style={{ color: designTokens.text.secondary, marginBottom: '32px' }}>
          계정 정보 및 보안 설정을 관리하세요
        </p>

        {/* Profile Information Section */}
        <Card className="mb-6">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
              <CardTitle className="text-lg font-medium">프로필 정보</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {/* Profile Image */}
            <div className="mb-5">
              <Label className="mb-3 text-muted-foreground text-sm">프로필 이미지</Label>
              <div className="flex items-center gap-4 mt-3">
                <Avatar className="w-20 h-20">
                  {profileImagePreview ? (
                    <AvatarImage src={profileImagePreview} alt="Profile" />
                  ) : (
                    <AvatarFallback>
                      <User className="w-8 h-8" style={{ color: designTokens.text.placeholder }} />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                    disabled={uploadImageMutation.isPending}
                  >
                    {uploadImageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    이미지 변경
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG (최대 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="mb-5">
              <Input
                label="이름"
                value={profileData.name}
                onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Email (Read-only) */}
            <div className="mb-5">
              <Label className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4" />
                이메일
              </Label>
              <input
                type="email"
                value={profile?.email || ''}
                readOnly
                className="w-full px-3 py-2.5 rounded-md text-sm cursor-not-allowed"
                style={{
                  backgroundColor: designTokens.bg.secondary,
                  color: designTokens.text.secondary,
                  border: `1px solid ${designTokens.bg.border}`,
                }}
              />
            </div>

            {/* Join Date (Read-only) */}
            <div className="mb-6">
              <Label className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
                <Calendar className="w-4 h-4" />
                가입일
              </Label>
              <input
                type="text"
                value={formatDate(profile?.createdAt)}
                readOnly
                className="w-full px-3 py-2.5 rounded-md text-sm cursor-not-allowed"
                style={{
                  backgroundColor: designTokens.bg.secondary,
                  color: designTokens.text.secondary,
                  border: `1px solid ${designTokens.bg.border}`,
                }}
              />
            </div>

            {/* Save Button */}
            <Button
              onClick={handleProfileSave}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                '저장'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card className="mb-6">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
              <CardTitle className="text-lg font-medium">비밀번호 변경</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="mb-5">
              <Input
                label="현재 비밀번호"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
              />
            </div>

            <div className="mb-5">
              <Input
                label="새 비밀번호"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                }
              />
              <p className="text-xs text-muted-foreground mt-1.5">최소 8자 이상 입력해주세요</p>
            </div>

            <div className="mb-6">
              <Input
                label="새 비밀번호 확인"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
              />
            </div>

            <Button
              onClick={handlePasswordChange}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  변경 중...
                </>
              ) : (
                '비밀번호 변경'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Design Authority Section (User Role Only) */}
        {isUserRole && (
          <Card className="mb-6">
            <CardHeader className="border-b px-6 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5" style={{ color: designTokens.text.secondary }} />
                <CardTitle className="text-lg font-medium">강의 개설 권한</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="mb-5">
                <Label className="mb-3 text-muted-foreground text-sm">현재 권한 상태</Label>
                <div className="mt-3">
                  <Badge variant={getAuthBadgeVariant(designAuthStatus)} className="px-4 py-2 text-sm">
                    {getAuthLabel(designAuthStatus)}
                  </Badge>
                </div>
              </div>

              {designAuthStatus === 'USER' && (
                <div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    강의를 개설하고 콘텐츠를 등록하려면 권한을 요청해주세요.
                  </p>
                  <Button
                    onClick={handleRequestDesignAuth}
                    disabled={isRequestPending}
                  >
                    {isRequestPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        요청 중...
                      </>
                    ) : (
                      '강의 개설 권한 요청'
                    )}
                  </Button>
                </div>
              )}

              {(designAuthStatus === 'DESIGNER' || designAuthStatus === 'OWNER') && (
                <Alert
                  className="flex items-center gap-3"
                  style={{
                    backgroundColor: designTokens.status.success_background,
                    borderColor: designTokens.status.success_text,
                  }}
                >
                  <CheckCircle className="w-5 h-5" style={{ color: designTokens.status.success_text }} />
                  <AlertDescription style={{ color: designTokens.status.success_text }}>
                    강의 개설 및 콘텐츠 등록 권한이 활성화되었습니다.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Account Management Section */}
        <Card>
          <CardHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5" style={{ color: designTokens.badge.orange.text }} />
              <CardTitle className="text-lg font-medium">계정 관리</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Alert
              className="mb-4"
              style={{
                backgroundColor: designTokens.status.warning_background,
                borderColor: designTokens.status.warning_text,
              }}
            >
              <AlertDescription style={{ color: designTokens.status.warning_text }}>
                계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
              </AlertDescription>
            </Alert>

            <AlertDialog onOpenChange={(open) => !open && setWithdrawPassword('')}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  style={{
                    color: designTokens.status.error_text,
                    borderColor: designTokens.status.error_text,
                  }}
                  className="hover:bg-red-50"
                >
                  회원 탈퇴
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>회원 탈퇴</AlertDialogTitle>
                  <AlertDialogDescription>
                    정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며,
                    모든 데이터가 영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Input
                    label="비밀번호 확인"
                    type="password"
                    value={withdrawPassword}
                    onChange={(e) => setWithdrawPassword(e.target.value)}
                    placeholder="현재 비밀번호를 입력하세요"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleWithdraw}
                    style={{
                      backgroundColor: designTokens.status.error_text,
                      color: 'white',
                    }}
                    disabled={withdrawMutation.isPending || !withdrawPassword}
                  >
                    {withdrawMutation.isPending ? '처리 중...' : '탈퇴하기'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
