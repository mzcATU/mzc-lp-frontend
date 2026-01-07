import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Camera, Save, Loader2, Lock, Mail, Calendar, AlertTriangle, CheckCircle, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useThemeStore } from '@/store/common/themeStore';
import { useTranslation, useLanguageStore } from '@/store/common/languageStore';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Label,
  Alert,
  AlertDescription,
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
import { userService } from '@/services/common/userService';

export function ProfilePage() {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  // 프로필 미완성 상태로 리다이렉트 된 경우 (단체 계정 생성 사용자)
  const profileIncomplete = location.state?.profileIncomplete === true;

  // API Hooks
  const { data: profile, isLoading: isLoadingProfile } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadImageMutation = useUploadProfileImage();
  const withdrawMutation = useWithdraw();

  // Local State
  const [profileData, setProfileData] = useState({ name: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [designAuthStatus, setDesignAuthStatus] = useState<'USER' | 'DESIGNER' | 'OWNER'>('USER');
  const [isRequestPending, setIsRequestPending] = useState(false);

  // API Base URL
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace('/api', '');

  // Sync profile data from API
  useEffect(() => {
    if (profile) {
      setProfileData({ name: profile.name });
      if (profile.profileImageUrl) {
        const imageUrl = profile.profileImageUrl.startsWith('http')
          ? profile.profileImageUrl
          : `${apiBaseUrl}${profile.profileImageUrl}`;
        setProfileImagePreview(imageUrl);
      }
    }
  }, [profile, apiBaseUrl]);

  // Fetch course roles on mount
  useEffect(() => {
    const fetchCourseRoles = async () => {
      try {
        const roles = await userService.getMyCourseRoles();
        console.log('CourseRoles API response:', roles);

        if (Array.isArray(roles) && roles.length > 0) {
          // OWNER > DESIGNER 우선순위로 체크
          const hasOwner = roles.some((r: { role: string }) => r.role === 'OWNER');
          const hasDesigner = roles.some((r: { role: string }) => r.role === 'DESIGNER');

          if (hasOwner) {
            setDesignAuthStatus('OWNER');
          } else if (hasDesigner) {
            setDesignAuthStatus('DESIGNER');
          }
        }
      } catch (error) {
        console.error('Failed to fetch course roles:', error);
      }
    };
    fetchCourseRoles();
  }, []);

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

  const handleRequestDesignAuth = async () => {
    setIsRequestPending(true);
    try {
      await userService.applyDesignerRole();
      setDesignAuthStatus('DESIGNER');
      toast.success('강의 개설 권한이 부여되었습니다.');
    } catch (error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 409) {
        // 이미 권한이 있음
        setDesignAuthStatus('DESIGNER');
        toast.info('이미 강의 개설 권한이 있습니다.');
      } else {
        console.error('Failed to apply designer role:', error);
        toast.error('권한 신청에 실패했습니다.');
      }
    } finally {
      setIsRequestPending(false);
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
      window.location.href = '/';
    } catch {
      toast.error('회원 탈퇴에 실패했습니다. 비밀번호를 확인해주세요.');
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

  const inputClass = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500'
    : 'bg-white border-gray-200 text-gray-900';

  const readonlyInputClass = isDark
    ? 'bg-white/5 border-white/10 text-gray-400'
    : 'bg-gray-50 border-gray-200 text-gray-500';

  if (isLoadingProfile) {
    return (
      <div className={`flex items-center justify-center min-h-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    );
  }

  return (
    <div className={`min-h-full p-6 sm:p-8 ${isDark ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto">
        {/* 프로필 미완성 안내 메시지 */}
        {profileIncomplete && (
          <Alert className={`mb-6 ${isDark ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
            <Info className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <AlertDescription className={isDark ? 'text-blue-400' : 'text-blue-700'}>
              <span className="font-medium">프로필 정보를 완성해주세요.</span>
              <br />
              <span className="text-sm">
                단체 계정으로 생성된 계정입니다. 원활한 서비스 이용을 위해 이름 등 프로필 정보를 입력해주세요.
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.profileSecurity.title}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {t.profileSecurity.description}
          </p>
        </div>

        {/* Profile Image Card */}
        <Card className={`mb-6 ${cardClass}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>{t.profileSecurity.profileInfo}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {/* Profile Image */}
            <div className="mb-6">
              <Label className={`mb-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.profileSecurity.profileImage}
              </Label>
              <div className="flex items-center gap-4 mt-3">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden ${
                    isDark ? 'bg-gradient-to-r from-[#6778ff] to-[#a855f7]' : 'bg-blue-100'
                  }`}>
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className={`w-10 h-10 ${isDark ? 'text-white' : 'text-blue-600'}`} />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadImageMutation.isPending}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    {uploadImageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 text-gray-600" />
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
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t.profileSecurity.imageGuide}
                  </p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {t.profileSecurity.imageClickGuide}
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="mb-5">
              <Label className={`mb-2 block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.profileSecurity.name}
              </Label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                className={inputClass}
              />
            </div>

            {/* Email (Read-only) */}
            <div className="mb-5">
              <Label className={`flex items-center gap-2 mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Mail className="w-4 h-4" />
                {t.profileSecurity.email}
              </Label>
              <input
                type="email"
                value={profile?.email || ''}
                readOnly
                className={`w-full px-3 py-2.5 rounded-md text-sm cursor-not-allowed border ${readonlyInputClass}`}
              />
            </div>

            {/* Join Date (Read-only) */}
            <div className="mb-6">
              <Label className={`flex items-center gap-2 mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <Calendar className="w-4 h-4" />
                {t.profileSecurity.joinDate}
              </Label>
              <input
                type="text"
                value={formatDate(profile?.createdAt)}
                readOnly
                className={`w-full px-3 py-2.5 rounded-md text-sm cursor-not-allowed border ${readonlyInputClass}`}
              />
            </div>

            <Button onClick={handleProfileSave} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.profileSecurity.processing}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t.common.save}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Password Change Card */}
        <Card className={`mb-6 ${cardClass}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>{t.profileSecurity.passwordChange}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-5">
              <Label className={`mb-2 block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.profileSecurity.currentPassword}
              </Label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="mb-5">
              <Label className={`mb-2 block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.profileSecurity.newPassword}
              </Label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                className={inputClass}
              />
              <p className={`text-xs mt-1.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {t.profileSecurity.passwordMinLength}
              </p>
            </div>

            <div className="mb-6">
              <Label className={`mb-2 block text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.profileSecurity.confirmPassword}
              </Label>
              <Input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className={inputClass}
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

        {/* Design Authority Card */}
        <Card className={`mb-6 ${cardClass}`}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>{t.profileSecurity.coursePermission}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-5">
              <Label className={`mb-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.profileSecurity.currentPermissionStatus}
              </Label>
              <div className="mt-3">
                <Badge
                  variant={designAuthStatus === 'USER' ? 'gray' : designAuthStatus === 'DESIGNER' ? 'indigo' : 'orange'}
                  className="px-4 py-2 text-sm"
                >
                  {designAuthStatus === 'USER' ? t.profileSecurity.generalUser : designAuthStatus === 'DESIGNER' ? t.profileSecurity.courseCreationEnabled : t.profileSecurity.fullAccess}
                </Badge>
              </div>
            </div>

            {designAuthStatus === 'USER' && (
              <div>
                <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.profileSecurity.permissionRequestDesc}
                </p>
                <Button onClick={handleRequestDesignAuth} disabled={isRequestPending}>
                  {isRequestPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t.profileSecurity.processing}
                    </>
                  ) : (
                    t.profileSecurity.requestPermission
                  )}
                </Button>
              </div>
            )}

            {(designAuthStatus === 'DESIGNER' || designAuthStatus === 'OWNER') && (
              <Alert className={`flex items-center gap-3 ${isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200'}`}>
                <CheckCircle className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                <AlertDescription className={isDark ? 'text-green-400' : 'text-green-700'}>
                  {t.profileSecurity.permissionEnabled}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Account Management Card */}
        <Card className={cardClass}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>{t.profileSecurity.accountManagement}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className={`mb-4 ${isDark ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
              <AlertDescription className={isDark ? 'text-orange-400' : 'text-orange-700'}>
                {t.profileSecurity.accountDeleteWarning}
              </AlertDescription>
            </Alert>

            <AlertDialog onOpenChange={(open) => !open && setWithdrawPassword('')}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className={isDark ? 'text-red-400 border-red-400/50 hover:bg-red-500/10' : 'text-red-600 border-red-300 hover:bg-red-50'}
                >
                  {t.profileSecurity.withdraw}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.profileSecurity.withdrawTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.profileSecurity.withdrawDesc}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Input
                    type="password"
                    value={withdrawPassword}
                    onChange={(e) => setWithdrawPassword(e.target.value)}
                    placeholder={t.profileSecurity.currentPassword}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleWithdraw}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={withdrawMutation.isPending || !withdrawPassword}
                  >
                    {withdrawMutation.isPending ? t.profileSecurity.processing : t.profileSecurity.withdrawConfirm}
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
