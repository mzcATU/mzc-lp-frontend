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
- **Styling**: TailwindCSS + CSS Variables (design tokens)
- **State**: Zustand (클라이언트) + React Query (서버)
- **UI**: Radix UI primitives + lucide-react icons
- **Routing**: react-router-dom v7

## 아키텍처

### 역할 기반 라우팅 구조

4개의 사용자 역할에 따른 독립적인 라우트 및 레이아웃:

| 경로 | 역할 | 레이아웃 |
|------|------|----------|
| `/sa/*` | Super Admin | SuperAdminLayout |
| `/ta/*` | Tenant Admin | TenantAdminLayout |
| `/to/*` | Tenant Operator | TenantOperatorLayout |
| `/tu/*` | Tenant User | TenantUserLayout |

각 역할은 `src/config/sidebar-menus.ts`에서 고유한 메뉴 구조를 가짐.

### 레이아웃 시스템

- `AdminLayout`: 공통 어드민 레이아웃 (사이드바 + 메인 콘텐츠)
- 역할별 Layout 컴포넌트들이 AdminLayout을 래핑하여 메뉴 데이터 주입
- 사이드바는 다크/라이트 모드, 접기/펼치기, 한/영 언어 전환 지원

### 디자인 시스템

- `src/styles/design-tokens.ts`: 시맨틱 컬러 토큰 정의 (WCAG AA 준수)
- `tailwind.config.js`: CSS 변수를 통해 디자인 토큰 연결
- 어드민 사이드바는 Neutral 톤만 사용 (브랜드 컬러 미사용)

### 컴포넌트 구조

```
src/components/
├── common/     # 재사용 가능한 공통 컴포넌트 (Button, Input, Badge)
├── layout/     # 레이아웃 및 사이드바 컴포넌트
└── ui/         # Radix 기반 기본 UI 컴포넌트
```

## 코딩 규칙

- `any` 타입 금지 → 명시적 타입 정의 필수
- 서버 상태: React Query 사용 (useState는 UI 상태만)
- API: `src/services/api/axiosInstance.ts` 사용
- 임포트 경로: `@/` 별칭 사용 (예: `@/components/common`)

## 작업 순서

```
Types → API Service → React Query Hook → Component
```

## 문서 참조

- [컨벤션](https://github.com/mzcATU/mzc-lp-docs/tree/main/docs/conventions)
- [화면 정의서](https://github.com/mzcATU/mzc-lp-docs/tree/main/docs/design-specs)
- [설정 가이드](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/context/frontend-setup.md)
