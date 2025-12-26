/**
 * 개발용 임시 로그인 버튼
 * TODO: 실제 로그인 페이지 구현 후 삭제
 */
import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/common/authStore';
import { UserRole } from '@/types/common/auth.types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

interface DevLoginButtonProps {
  className?: string;
}

export function DevLoginButton({ className }: DevLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { setToken, setUser, logout, isAuthenticated } = useAuthStore();

  const testUser = {
    email: 'test1222@test.test',
    password: 'Test1234#',
    name: '테스트유저',
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
      // 1. 먼저 로그인 시도
      try {
        const loginRes = await axios.post(`${API_BASE}/auth/login`, {
          email: testUser.email,
          password: testUser.password,
        });

        const { accessToken } = loginRes.data.data;
        setToken(accessToken);
        setUser({ id: 1, name: testUser.name, email: testUser.email, role: UserRole.TenantUser });
        setMessage('로그인 성공!');
        return;
      } catch (loginError: any) {
        // 로그인 실패하면 회원가입 후 재시도
        if (loginError.response?.status === 401) {
          // 2. 회원가입
          await axios.post(`${API_BASE}/auth/register`, {
            email: testUser.email,
            password: testUser.password,
            name: testUser.name,
          });

          // 3. 다시 로그인
          const loginRes = await axios.post(`${API_BASE}/auth/login`, {
            email: testUser.email,
            password: testUser.password,
          });

          const { accessToken } = loginRes.data.data;
          setToken(accessToken);
          setUser({ id: 1, name: testUser.name, email: testUser.email, role: UserRole.TenantUser });
          setMessage('회원가입 + 로그인 성공!');
          return;
        }
        throw loginError;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setMessage(`실패: ${error.response?.data?.error?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setMessage('로그아웃 완료');
  };

  return (
    <div className={className} style={{ padding: '12px', background: '#fff3cd', borderRadius: '8px', marginBottom: '16px' }}>
      <div style={{ fontSize: '12px', color: '#856404', marginBottom: '8px' }}>
        [DEV] 테스트용 로그인 ({testUser.email})
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {!isAuthenticated ? (
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '로그인 중...' : '테스트 로그인'}
          </button>
        ) : (
          <>
            <span style={{ fontSize: '12px', color: '#28a745' }}>로그인됨</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              로그아웃
            </button>
          </>
        )}
        {message && <span style={{ fontSize: '12px', marginLeft: '8px' }}>{message}</span>}
      </div>
    </div>
  );
}
