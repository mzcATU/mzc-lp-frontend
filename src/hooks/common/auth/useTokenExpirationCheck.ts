import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/common/authStore';
import { authService } from '@/services/common/authService';
import { toast } from 'sonner';
import { getLoginPath } from '@/utils/tenantUtils';

const CHECK_INTERVAL = 60 * 1000; // 1분마다 체크

/**
 * 토큰 만료 자동 체크 훅
 * - 주기적으로 토큰 만료 여부 확인
 * - 만료 임박 시 자동 갱신 시도
 * - 갱신 실패 또는 완전 만료 시 로그아웃
 * - 탭 전환 시에도 체크
 */
export const useTokenExpirationCheck = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    isAuthenticated,
    refreshToken,
    tokenExpiresAt,
    isTokenExpired,
    setTokens,
    logout,
  } = useAuthStore();

  const isRefreshingRef = useRef(false);

  const handleLogout = useCallback((message: string) => {
    logout();
    queryClient.clear();
    toast.error(message);
    navigate(getLoginPath());
  }, [logout, queryClient, navigate]);

  const tryRefreshToken = useCallback(async () => {
    if (isRefreshingRef.current || !refreshToken) return false;

    isRefreshingRef.current = true;
    try {
      const response = await authService.refresh(refreshToken);
      setTokens(response.accessToken, response.refreshToken, response.expiresIn);
      return true;
    } catch {
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [refreshToken, setTokens]);

  const checkTokenExpiration = useCallback(async () => {
    if (!isAuthenticated || !tokenExpiresAt) return;

    if (isTokenExpired()) {
      // 토큰 만료됨 - 갱신 시도
      const refreshed = await tryRefreshToken();
      if (!refreshed) {
        handleLogout('로그인이 만료되었습니다. 다시 로그인해주세요.');
      }
    }
  }, [isAuthenticated, tokenExpiresAt, isTokenExpired, tryRefreshToken, handleLogout]);

  // 주기적 체크
  useEffect(() => {
    if (!isAuthenticated) return;

    // 초기 체크
    checkTokenExpiration();

    // 주기적 체크
    const intervalId = setInterval(checkTokenExpiration, CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, checkTokenExpiration]);

  // 탭 활성화 시 체크 (브라우저 탭을 다시 열었을 때)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkTokenExpiration();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, checkTokenExpiration]);

  // 윈도우 포커스 시 체크
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleFocus = () => {
      checkTokenExpiration();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, checkTokenExpiration]);
};
