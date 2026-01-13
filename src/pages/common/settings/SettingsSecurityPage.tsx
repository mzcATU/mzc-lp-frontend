import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Lock,
  AlertTriangle,
  Shield,
  CheckCircle,
  Camera,
  Loader2,
  Building2,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation, useLanguageStore } from '@/store/common/languageStore';
import { useThemeStore } from '@/store/common/themeStore';
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
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { theme } = useThemeStore();
  // TU 경로에서만 다크모드 적용
  const isTuPage = location.pathname.includes('/tu/');
  const isDark = isTuPage && theme === 'dark';

  // API Hooks
  const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadImageMutation = useUploadProfileImage();
  const withdrawMutation = useWithdraw();

  // Local State
  const [profileData, setProfileData] = useState({
    name: '',
    department: '',
    position: '',
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
      setProfileData({
        name: profile.name,
        department: profile.department || '',
        position: profile.position || '',
      });
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
  // 어드민 역할 여부 (SA, TA, CO) - 부서/직급 입력 필드 표시용
  const isAdminRole = basePath.endsWith('/sa') || basePath.endsWith('/ta') || basePath.endsWith('/co');

  const handleProfileSave = async () => {
    if (!profileData.name.trim()) {
      toast.error('이름을 입력해주세요.');
      return;
    }

    try {
      // 현재 프로필 이미지 URL도 함께 전송하여 이미지가 사라지지 않도록 함
      await updateProfileMutation.mutateAsync({
        name: profileData.name,
        profileImageUrl: profile?.profileImageUrl,
        department: profileData.department || undefined,
        position: profileData.position || undefined,
      });
      toast.success(language === 'ko' ? '프로필 정보가 저장되었습니다.' : 'Profile saved successfully.');
    } catch {
      toast.error(language === 'ko' ? '프로필 저장에 실패했습니다.' : 'Failed to save profile.');
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
    return new Date(dateString).toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const cardClass = isDark
    ? 'bg-white/5 border-white/10'
    : 'bg-white border-gray-200 shadow-sm';

  if (isLoadingProfile) {
    return (
      <div className={`flex items-center justify-center min-h-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      </div>
    );
  }

  return (
    <div className={`min-h-full p-6 sm:p-10 overflow-y-auto ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {t.profileSecurity.title}
        </h1>
        <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t.profileSecurity.description}
        </p>

        {/* Profile Information Section */}
        <Card className={`mb-6 ${cardClass}`}>
          <CardHeader className={`border-b px-6 py-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <Shield className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <CardTitle className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t.profileSecurity.profileInfo}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-6">
            {/* Profile Image */}
            <div className="mb-6">
              <Label className={`mb-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t.profileSecurity.profileImage}
              </Label>
              <div className="flex items-center gap-4 mt-3">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden ${isDark ? 'bg-[#6778ff]/20' : 'bg-blue-100'}`}>
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className={`w-10 h-10 ${isDark ? 'text-[#6778ff]' : 'text-blue-600'}`} />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadImageMutation.isPending}
                    className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform ${isDark ? 'bg-gray-700' : 'bg-white'}`}
                  >
                    {uploadImageMutation.isPending ? (
                      <Loader2 className={`w-4 h-4 animate-spin ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                    ) : (
                      <Camera className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {t.profileSecurity.imageGuide}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t.profileSecurity.imageClickGuide}
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="mb-5">
              <Label className={`mb-2 block text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t.profileSecurity.name}
              </Label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                className={isDark ? 'bg-white/5 border-white/10 text-white' : ''}
              />
            </div>

            {/* Email (Read-only) */}
            <div className="mb-5">
              <Label className={`flex items-center gap-2 mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Mail className="w-4 h-4" />
                {t.profileSecurity.email}
              </Label>
              <input
                type="email"
                value={profile?.email || ''}
                readOnly
                className={`w-full px-3 py-2.5 rounded-md text-sm cursor-not-allowed border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              />
            </div>

            {/* Join Date (Read-only) */}
            <div className="mb-5">
              <Label className={`flex items-center gap-2 mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Calendar className="w-4 h-4" />
                {t.profileSecurity.joinDate}
              </Label>
              <input
                type="text"
                value={formatDate(profile?.createdAt)}
                readOnly
                className={`w-full px-3 py-2.5 rounded-md text-sm cursor-not-allowed border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              />
            </div>

            {/* Department & Position (Admin Only) */}
            {isAdminRole && (
              <>
                {/* Department */}
                <div className="mb-5">
                  <Label className={`flex items-center gap-2 mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Building2 className="w-4 h-4" />
                    {language === 'ko' ? '부서' : 'Department'}
                  </Label>
                  <Input
                    value={profileData.department}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, department: e.target.value }))}
                    placeholder={language === 'ko' ? '예: 개발팀, 기획팀, 인사팀' : 'e.g., Engineering, Planning, HR'}
                    className={isDark ? 'bg-white/5 border-white/10 text-white' : ''}
                  />
                </div>

                {/* Position */}
                <div className="mb-6">
                  <Label className={`flex items-center gap-2 mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Briefcase className="w-4 h-4" />
                    {language === 'ko' ? '직급' : 'Position'}
                  </Label>
                  <Input
                    value={profileData.position}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, position: e.target.value }))}
                    placeholder={language === 'ko' ? '예: 사원, 대리, 과장, 팀장' : 'e.g., Staff, Manager, Director'}
                    className={isDark ? 'bg-white/5 border-white/10 text-white' : ''}
                  />
                </div>
              </>
            )}

            {/* Save Button */}
            <Button onClick={handleProfileSave} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.profileSecurity.processing}
                </>
              ) : (
                t.common.save
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card className={`mb-6 ${cardClass}`}>
          <CardHeader className={`border-b px-6 py-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <Lock className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <CardTitle className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t.profileSecurity.passwordChange}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="mb-5">
              <Label className={`mb-2 block text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t.profileSecurity.currentPassword}
              </Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                className={isDark ? 'bg-white/5 border-white/10 text-white' : ''}
              />
            </div>

            <div className="mb-5">
              <Label className={`mb-2 block text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t.profileSecurity.newPassword}
              </Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                className={isDark ? 'bg-white/5 border-white/10 text-white' : ''}
              />
              <p className={`text-xs mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t.profileSecurity.passwordMinLength}
              </p>
            </div>

            <div className="mb-6">
              <Label className={`mb-2 block text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t.profileSecurity.confirmPassword}
              </Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                className={isDark ? 'bg-white/5 border-white/10 text-white' : ''}
              />
            </div>

            <Button onClick={handlePasswordChange} disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.profileSecurity.processing}
                </>
              ) : (
                t.profileSecurity.changePassword
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Design Authority Section (User Role Only) */}
        {isUserRole && (
          <Card className={`mb-6 ${cardClass}`}>
            <CardHeader className={`border-b px-6 py-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <CheckCircle className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <CardTitle className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {t.profileSecurity.coursePermission}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-6">
              <div className="mb-5">
                <Label className={`mb-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t.profileSecurity.currentPermissionStatus}
                </Label>
                <div className="mt-3">
                  <Badge variant={getAuthBadgeVariant(designAuthStatus)} className="px-4 py-2 text-sm">
                    {getAuthLabel(designAuthStatus)}
                  </Badge>
                </div>
              </div>

              {designAuthStatus === 'USER' && (
                <div>
                  <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t.profileSecurity.permissionRequestDesc}
                  </p>
                  <Button onClick={handleRequestDesignAuth} disabled={isRequestPending}>
                    {isRequestPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {language === 'ko' ? '요청 중...' : 'Requesting...'}
                      </>
                    ) : (
                      t.profileSecurity.requestPermission
                    )}
                  </Button>
                </div>
              )}

              {(designAuthStatus === 'DESIGNER' || designAuthStatus === 'OWNER') && (
                <Alert className="flex items-center gap-3 bg-green-50 border-green-500">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <AlertDescription className="text-green-700">
                    {t.profileSecurity.permissionEnabled}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Account Management Section */}
        <Card className={cardClass}>
          <CardHeader className={`border-b px-6 py-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <CardTitle className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {t.profileSecurity.accountManagement}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <Alert className="mb-4 bg-orange-50 border-orange-500">
              <AlertDescription className="text-orange-700">
                {t.profileSecurity.accountDeleteWarning}
              </AlertDescription>
            </Alert>

            <AlertDialog onOpenChange={(open) => !open && setWithdrawPassword('')}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                >
                  {t.profileSecurity.withdraw}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.profileSecurity.withdraw}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.profileSecurity.withdrawDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Input
                    label={t.profileSecurity.currentPassword}
                    type="password"
                    value={withdrawPassword}
                    onChange={(e) => setWithdrawPassword(e.target.value)}
                    placeholder={language === 'ko' ? '현재 비밀번호를 입력하세요' : 'Enter current password'}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleWithdraw}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={withdrawMutation.isPending || !withdrawPassword}
                  >
                    {withdrawMutation.isPending ? t.profileSecurity.processing : t.profileSecurity.withdraw}
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
