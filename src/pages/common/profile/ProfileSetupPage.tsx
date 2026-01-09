import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Building2, Briefcase, User, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguageStore } from '@/store/common/languageStore';
import { designTokens } from '@/styles/admin-design-tokens';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
} from '@/components/common';
import { useMyProfile, useUpdateProfile } from '@/hooks/common';
import { useAuthStore } from '@/store/common/authStore';

/**
 * 프로필 설정 페이지 (단체 계정 생성 후 직급/부서 입력용)
 * 필수 정보가 없는 사용자가 리다이렉트되는 페이지
 */
// 역할별 기본 경로
const ROLE_BASE_PATH: Record<string, string> = {
  SYSTEM_ADMIN: '/sa',
  TENANT_ADMIN: '/ta',
  TENANT_OPERATOR: '/to',
  DESIGNER: '/tu/teaching',
  USER: '/tu/b2c',
};

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subdomain } = useParams<{ subdomain?: string }>();
  const { language } = useLanguageStore();
  const user = useAuthStore((state) => state.user);

  // API Hooks
  const { data: profile, isLoading: isLoadingProfile, refetch } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();

  // Local State
  const [formData, setFormData] = useState({
    department: '',
    position: '',
  });

  // 프로필 데이터 로드 시 기존 값 설정
  useEffect(() => {
    if (profile) {
      setFormData({
        department: profile.department || '',
        position: profile.position || '',
      });
    }
  }, [profile]);

  // 서브도메인 prefix 계산
  const getSubdomainPrefix = () => {
    if (subdomain && subdomain !== 'default' && subdomain !== 'www') {
      return `/${subdomain}`;
    }
    return '';
  };

  // 역할에 맞는 리다이렉트 경로 계산 (USER는 마이페이지 프로필로 이동)
  const getRedirectPath = () => {
    const subdomainPrefix = getSubdomainPrefix();
    // USER 역할은 프로필 설정 후 마이페이지 프로필로 이동
    if (user?.role === 'USER') {
      return `${subdomainPrefix}/tu/b2c/mypage/profile`;
    }
    const basePath = user?.role ? (ROLE_BASE_PATH[user.role] || '/tu/b2c') : '/tu/b2c';
    return `${subdomainPrefix}${basePath}`;
  };

  // 이미 프로필이 완료된 경우 원래 페이지로 리다이렉트
  useEffect(() => {
    if (profile?.profileCompleted && profile.department && profile.position) {
      const returnTo = location.state?.returnTo;
      if (returnTo) {
        navigate(returnTo, { replace: true });
      } else {
        navigate(getRedirectPath(), { replace: true });
      }
    }
  }, [profile, navigate, location.state, user, subdomain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.department.trim()) {
      toast.error(language === 'ko' ? '부서를 입력해주세요.' : 'Please enter your department.');
      return;
    }

    if (!formData.position.trim()) {
      toast.error(language === 'ko' ? '직급을 입력해주세요.' : 'Please enter your position.');
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        department: formData.department.trim(),
        position: formData.position.trim(),
      });

      // 캐시 갱신 후 리다이렉트 (ProfileRequiredRoute가 업데이트된 프로필을 인식하도록)
      await refetch();

      toast.success(
        language === 'ko'
          ? '프로필 정보가 저장되었습니다.'
          : 'Profile information has been saved.'
      );

      // 저장 완료 후 원래 페이지 또는 역할에 맞는 페이지로 이동
      const returnTo = location.state?.returnTo;
      if (returnTo) {
        navigate(returnTo, { replace: true });
      } else {
        navigate(getRedirectPath(), { replace: true });
      }
    } catch {
      toast.error(
        language === 'ko'
          ? '프로필 저장에 실패했습니다. 다시 시도해주세요.'
          : 'Failed to save profile. Please try again.'
      );
    }
  };

  if (isLoadingProfile) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: designTokens.bg.app_default }}
      >
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: designTokens.text.secondary }} />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: designTokens.bg.app_default }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: designTokens.badge.blue.bg }}
          >
            <User className="w-8 h-8" style={{ color: designTokens.badge.blue.text }} />
          </div>
          <CardTitle className="text-xl font-semibold">
            {language === 'ko' ? '프로필 정보 입력' : 'Complete Your Profile'}
          </CardTitle>
          <p className="text-sm mt-2" style={{ color: designTokens.text.secondary }}>
            {language === 'ko'
              ? '원활한 서비스 이용을 위해 추가 정보를 입력해주세요.'
              : 'Please provide additional information to use the service.'}
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 (읽기 전용) */}
            <div>
              <Label className="mb-2 block text-sm" style={{ color: designTokens.text.secondary }}>
                <User className="w-4 h-4 inline mr-2" />
                {language === 'ko' ? '이름' : 'Name'}
              </Label>
              <input
                type="text"
                value={profile?.name || ''}
                readOnly
                className="w-full px-3 py-2.5 rounded-md text-sm cursor-not-allowed border"
                style={{
                  backgroundColor: designTokens.bg.app_default,
                  borderColor: designTokens.bg.border,
                  color: designTokens.text.secondary,
                }}
              />
            </div>

            {/* 부서 */}
            <div>
              <Label className="mb-2 block text-sm" style={{ color: designTokens.text.secondary }}>
                <Building2 className="w-4 h-4 inline mr-2" />
                {language === 'ko' ? '부서' : 'Department'} *
              </Label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                placeholder={language === 'ko' ? '예: 개발팀, 기획팀, 인사팀' : 'e.g., Engineering, Planning, HR'}
              />
            </div>

            {/* 직급 */}
            <div>
              <Label className="mb-2 block text-sm" style={{ color: designTokens.text.secondary }}>
                <Briefcase className="w-4 h-4 inline mr-2" />
                {language === 'ko' ? '직급' : 'Position'} *
              </Label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
                placeholder={language === 'ko' ? '예: 사원, 대리, 과장, 팀장' : 'e.g., Staff, Manager, Director'}
              />
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              className="w-full"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'ko' ? '저장 중...' : 'Saving...'}
                </>
              ) : (
                <>
                  {language === 'ko' ? '저장하고 계속하기' : 'Save and Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
