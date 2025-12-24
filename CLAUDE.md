# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

MZC Learn Platform - 멀티 테넌트 기업 교육 LMS 프론트엔드

## 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드 (tsc -b && vite build)
npm run lint         # ESLint 실행
```

## 기술 스택

- **Framework**: React 19 + TypeScript 5.x + Vite
- **Styling**: TailwindCSS + CVA (class-variance-authority)
- **State**: Zustand (클라이언트) + React Query (서버)
- **UI**: Radix UI primitives + lucide-react icons
- **Routing**: react-router-dom v7

---

## 아키텍처

### 역할 기반 라우팅 구조

4개의 사용자 역할에 따른 독립적인 라우트 및 레이아웃:

| 경로 | 역할 | 설명 |
|------|------|------|
| `/sa/*` | Super Admin | 플랫폼 전체 관리 (테넌트 생성/관리) |
| `/ta/*` | Tenant Admin | 테넌트 최고 관리자 (브랜딩, 통계) |
| `/to/*` | Tenant Operator | 운영자 (강의 승인, 차수 관리, 역할 부여) |
| `/tu/*` | Tenant User | 일반 사용자 (수강 + 강의 등록) |

각 역할은 `src/config/sidebar-menus.ts`에서 고유한 메뉴 구조를 가짐.

### 디렉토리 구조

```
src/
├── assets/                  # 정적 리소스 (fonts, icons, images)
├── components/
│   ├── common/              # 재사용 가능한 공통 컴포넌트 (Radix UI 기반)
│   ├── domain/              # 도메인별 컴포넌트
│   └── layout/              # 레이아웃 컴포넌트
│       ├── BaseSidebar/     # 공통 사이드바
│       ├── SuperAdminSidebar/
│       ├── TenantAdminSidebar/
│       ├── TenantOperatorSidebar/
│       └── TenantUserSidebar/
├── config/                  # 설정 파일 (sidebar-menus.ts)
├── hooks/
│   └── common/              # 공통 훅 (useDebounce, useLocalStorage)
├── pages/
│   ├── sa/                  # Super Admin 페이지
│   ├── ta/                  # Tenant Admin 페이지
│   ├── to/                  # Tenant Operator 페이지
│   └── tu/                  # Tenant User 페이지
├── routes/                  # 라우팅 설정
├── services/
│   └── common/api/          # Axios 인스턴스, API endpoints
├── store/
│   └── common/              # Zustand 스토어 (authStore, uiStore)
├── styles/                  # 디자인 토큰, 글로벌 스타일
└── types/
    ├── common/              # 공통 타입 (api, auth, sidebar)
    └── to/                  # TO 역할 전용 타입
```

### 레이아웃 시스템

- `AdminLayout`: 공통 어드민 레이아웃 (사이드바 + 메인 콘텐츠)
- `BaseSidebar`: 모든 역할에서 공유하는 사이드바 베이스 컴포넌트
- 역할별 Sidebar 컴포넌트들이 BaseSidebar를 래핑하여 메뉴 데이터 주입
- 사이드바는 다크/라이트 모드, 접기/펼치기, 한/영 언어 전환 지원

---

## 디자인 시스템

### 핵심 원칙

```
✅ 디자인 토큰 사용 → 하드코딩 금지
✅ CSS 변수 + TypeScript 토큰 동기화
✅ CVA로 컴포넌트 Variant 관리
✅ Radix UI 기반 접근성 확보
✅ WCAG AA 대비율 준수 (4.5:1)
✅ 테넌시별 브랜딩 지원
```

### 디자인 토큰

> 디자인 토큰 상세 명세는 다음 문서 참조:
> - [01-DESIGN-TOKENS-COMMON.md](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/01-DESIGN-TOKENS-COMMON.md) - 공통 토큰
> - [02-DESIGN-TOKENS-TENANT-TEMPLATE.md](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/02-DESIGN-TOKENS-TENANT-TEMPLATE.md) - 테넌트별 커스텀 토큰 템플릿

**파일 위치:**
- `src/styles/design-tokens.ts` - TypeScript 토큰 정의
- `src/index.css` - CSS 변수 정의
- `tailwind.config.js` - Tailwind 연동

### 컴포넌트 스타일링 (CVA 패턴)

```typescript
// src/components/common/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors rounded-md',
  {
    variants: {
      variant: {
        neutral: 'bg-btn-neutral text-white hover:bg-btn-neutral-hover',
        brand: 'bg-btn-brand text-white hover:bg-btn-brand-hover',
        ghost: 'bg-transparent text-text-secondary hover:bg-bg-secondary',
        danger: 'bg-status-error-bg text-status-error hover:bg-red-100',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'brand',
      size: 'md',
    },
  }
);

export const Button = ({
  className,
  variant,
  size,
  ...props
}: ButtonProps & VariantProps<typeof buttonVariants>) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
);
```

### cn 유틸리티

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

### Radix UI 컴포넌트

| 컴포넌트 | 패키지 | 용도 |
|----------|--------|------|
| Dialog | `@radix-ui/react-dialog` | 모달 |
| DropdownMenu | `@radix-ui/react-dropdown-menu` | 드롭다운 메뉴 |
| Select | `@radix-ui/react-select` | 셀렉트 박스 |
| Tabs | `@radix-ui/react-tabs` | 탭 |
| Tooltip | `@radix-ui/react-tooltip` | 툴팁 |
| Checkbox | `@radix-ui/react-checkbox` | 체크박스 |
| Switch | `@radix-ui/react-switch` | 토글 스위치 |

### 반응형 디자인 (Mobile First)

| 브레이크포인트 | 크기 | 대상 |
|--------------|------|------|
| sm | 640px | 모바일 |
| md | 768px | 태블릿 |
| lg | 1024px | 데스크톱 |
| xl | 1280px | 대형 화면 |

```typescript
// ✅ 모바일 우선 (권장)
<div className="px-4 md:px-6 lg:px-8">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ 데스크톱 우선 (지양)
<div className="px-8 sm:px-4">
```

---

## UX 패턴

### 상태 피드백

| 상황 | UI 패턴 | 예시 |
|------|---------|------|
| 페이지 로딩 | Skeleton UI | 목록, 대시보드 |
| 버튼 액션 | Spinner + 비활성화 | 저장, 삭제 |
| 성공 | 토스트 (sonner) | 저장 완료 |
| 에러 | 인라인 메시지 + 재시도 | 네트워크 오류 |
| 빈 상태 | 안내 메시지 + CTA | 목록 비어있음 |

```typescript
// 로딩 상태
{isLoading ? (
  <Skeleton className="h-12 w-full" />
) : (
  <DataList data={data} />
)}

// 버튼 로딩
<Button disabled={isSubmitting}>
  {isSubmitting ? <><Spinner /> 저장 중...</> : '저장'}
</Button>

// 토스트 알림
import { toast } from 'sonner';
toast.success('저장되었습니다.');
toast.error('저장에 실패했습니다.');
```

### 사용자 플로우

```
✅ 사용자 플로우는 3단계 이내로 단순화
✅ 모든 비동기 작업에 로딩 상태 표시
✅ 에러 발생 시 명확한 메시지와 복구 방법 제공
✅ 빈 상태에 안내 메시지와 다음 액션 제시
```

### CRUD 플로우

```
[생성] 목록 → + 버튼 → 생성 폼 → 저장 → 상세 페이지
[조회] 목록 → 항목 클릭 → 상세 페이지
[수정] 상세 → 수정 버튼 → 수정 폼 → 저장 → 상세 페이지
[삭제] 목록/상세 → 삭제 버튼 → 확인 다이얼로그 → 삭제 → 목록
```

---

## 접근성 (A11y)

### WCAG 2.1 AA 준수

| 항목 | 요구사항 |
|------|----------|
| 텍스트 대비율 | 4.5:1 이상 |
| 포커스 표시 | `focus-visible:ring-2` |
| 키보드 접근 | 모든 기능 Tab/Enter/Escape |
| 스크린 리더 | Radix UI 기본 지원 |

### 키보드 지원

| 키 | 동작 |
|-----|------|
| `Tab` | 다음 포커스 요소로 이동 |
| `Enter` / `Space` | 버튼 클릭 |
| `Escape` | 모달/드롭다운 닫기 |
| `Arrow Keys` | 메뉴/리스트 내 이동 |

### 포커스 스타일

```typescript
<button className="
  focus:outline-none
  focus-visible:ring-2
  focus-visible:ring-btn-brand
  focus-visible:ring-offset-2
">
```

### ARIA 속성

```typescript
// 모달
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">

// 에러 상태
<input aria-invalid={!!error} aria-describedby="error-message" />
<p id="error-message" role="alert">{error}</p>

// 로딩 상태
<button aria-busy={isLoading} disabled={isLoading}>
```

---

## 코딩 컨벤션

### TypeScript

```typescript
// ✅ 명시적 타입 정의 (any 금지)
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
}

// ✅ Union Types 활용
type Status = 'idle' | 'loading' | 'success' | 'error';
```

### 컴포넌트 구조

```typescript
// 1. Import
import { useState } from 'react';
import type { User } from '@/types/common/user.types';

// 2. Types
interface UserCardProps {
  user: User;
}

// 3. Component
export const UserCard = ({ user }: UserCardProps) => {
  // State (UI 상태만 useState)
  const [isExpanded, setIsExpanded] = useState(false);

  // Early return
  if (!user) return null;

  // JSX
  return <div>{user.name}</div>;
};
```

### 상태 관리

| 상태 유형 | 도구 | 예시 |
|----------|------|------|
| UI 상태 | `useState` | 모달 열림, 토글, 폼 입력 |
| 전역 상태 | `Zustand` | 인증, 테마, 사이드바 상태 |
| 서버 상태 | `React Query` | API 데이터 (캐싱, refetch) |

```typescript
// ❌ 서버 데이터에 useState 사용 금지
const [users, setUsers] = useState([]);

// ✅ React Query 사용
const { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => userService.getUsers(),
});
```

### Import 순서

```typescript
import React, { useState } from 'react';              // 1. React
import { useNavigate } from 'react-router-dom';       // 2. 외부 라이브러리
import { Button } from '@/components/common';         // 3. 공통 컴포넌트
import { userService } from '@/services/common/userService';  // 4. 서비스
import { useAuthStore } from '@/store/common/authStore';      // 5. 스토어
import type { User } from '@/types/common/user.types';        // 6. 타입
```

---

## API 통합

### Axios 설정

```typescript
// services/common/api/axiosInstance.ts
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
});

// Request Interceptor (토큰)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### React Query 패턴

```typescript
// hooks/queries/useUsersQuery.ts
export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });
};

// hooks/mutations/useUserMutations.ts
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateUserRequest) => userService.createUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

---

## 작업 순서

```
Types → API Service → React Query Hook → Component
```

1. `types/` 에 타입 정의
2. `services/` 에 API 함수 작성
3. `hooks/` 에 React Query 훅 작성
4. `components/` 또는 `pages/` 에 컴포넌트 구현

---

## Git 컨벤션

### 브랜치 네이밍

```
타입/이슈번호-설명

feat/123-user-login
fix/456-auth-validation
refactor/ui-restructure
```

| 타입 | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `docs` | 문서 |
| `chore` | 설정/빌드 |

### 커밋 메시지

```
[태그] 제목 (#이슈번호)

- 변경사항 1
- 변경사항 2
```

예시:
- `[Feat] 로그인 API 구현 (#123)`
- `[Fix] 토큰 검증 오류 (#456)`
- `[Refactor] 서비스 분리 (#789)`

---

## 문서 참조

### Design System

- [Design Conventions Overview](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/README.md)
- [Design Implementation (CVA, Radix)](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/00-DESIGN-CONVENTIONS.md)
- [Design Tokens (Common)](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/01-DESIGN-TOKENS-COMMON.md)
- [Design Tokens (Tenant)](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/02-DESIGN-TOKENS-TENANT-TEMPLATE.md)

### UX Guide

- [UX Patterns](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/03-UX-PATTERNS.md)
- [UX Pages](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/04-UX-PAGES.md)
- [UX Components](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/05-UX-COMPONENTS.md)
- [UX Responsive](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/06-UX-RESPONSIVE.md)
- [UX Animations](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/07-UX-ANIMATIONS.md)
- [UX Accessibility](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/08-UX-ACCESSIBILITY.md)
- [UX Error Messages](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/09-UX-ERROR-MESSAGES.md)
- [UX Forms](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/design/10-UX-FORMS.md)

### React Conventions

- [React TypeScript Core](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/10-REACT-TYPESCRIPT-CORE.md)
- [React Component Conventions](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/12-REACT-COMPONENT-CONVENTIONS.md)
- [React State Management](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/13-REACT-STATE-MANAGEMENT.md)
- [React API Integration](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/14-REACT-API-INTEGRATION.md)

### Others

- [Git Conventions](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/conventions/02-GIT-CONVENTIONS.md)
- [Frontend Pages Structure](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/structure/frontend/pages.md)
- [User Roles](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/context/user-roles.md)
