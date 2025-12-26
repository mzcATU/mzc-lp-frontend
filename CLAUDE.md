# Frontend - AI 작업 가이드

> MZC Learn Platform Frontend (React 19 + TypeScript + Vite)

---

## 문서 참조

| 작업 | 문서 |
|------|------|
| **전체 가이드 (필수)** | `../mzc-lp-docs/docs/CLAUDE.md` |
| 컨벤션 | `../mzc-lp-docs/docs/conventions/` |
| 디자인 시스템 | `../mzc-lp-docs/docs/conventions/design/` |
| 사용자 역할 | `../mzc-lp-docs/docs/context/user-roles.md` |

> 로컬에 없으면: https://github.com/mzcATU/mzc-lp-docs

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React 19 + TypeScript 5.x + Vite |
| Styling | TailwindCSS + CVA (class-variance-authority) |
| State | Zustand (클라이언트) + React Query (서버) |
| UI | Radix UI primitives + lucide-react icons |
| Routing | react-router-dom v7 |

---

## 핵심 규칙

```
✅ any 타입 금지 → 명시적 타입 정의
✅ 서버 상태: React Query (useState는 UI 상태만)
✅ 디자인 토큰 사용 → 하드코딩 금지
✅ CVA로 컴포넌트 Variant 관리
✅ Radix UI 기반 접근성 확보
```

---

## 디자인 시스템

```
⚠️ 색상 하드코딩 금지 → designTokens 필수
⚠️ 스타일 작업 전 → src/styles/admin-design-tokens.ts 읽을 것
⚠️ 새 컴포넌트 → src/components/common/index.ts에서 기존 것 먼저 확인
```

---

## 역할 기반 라우팅

| 경로 | 역할 | 설명 |
|------|------|------|
| `/sa/*` | Super Admin | 플랫폼 전체 관리 |
| `/ta/*` | Tenant Admin | 테넌트 최고 관리자 |
| `/to/*` | Tenant Operator | 운영자 |
| `/tu/*` | Tenant User | 일반 사용자 |

---

## 디렉토리 구조

```
src/
├── components/
│   ├── common/      # 공통 컴포넌트 (59개, 8개 카테고리)
│   ├── domain/      # 도메인별 컴포넌트
│   └── layout/      # 레이아웃 (AdminLayout, Sidebar)
├── pages/{sa,ta,to,tu}/  # 역할별 페이지
├── routes/          # 라우팅 설정
├── services/        # API 호출
├── hooks/           # React Query 훅
├── store/           # Zustand 스토어
├── styles/          # 디자인 토큰
└── types/           # TypeScript 타입
```

---

## 작업 순서

```
Types → API Service → React Query Hook → Component
```

---

## 컴포넌트

- **전체 목록**: `src/components/common/index.ts`
- **8개 카테고리**: Primitives, Form Inputs, Overlay, Layout, Data Display, Feedback, Navigation, Domain Specific
- **사용 전**: 컴포넌트 파일의 JSDoc 주석 확인 (사용 예시 포함)

---

## 모범 페이지 (패턴 참고용)

| 페이지 유형 | 참고 경로 | 포함 패턴 |
|------------|----------|----------|
| 설정 페이지 | `src/pages/tu/settings/` | Card, Switch, RadioOptionCard |
| 목록 페이지 | `src/pages/tu/my-content/` | DataTable, EmptyState, ViewToggle |
| 대시보드 | `src/pages/tu/dashboard/` | StatsCard, Chart |

---

## 새 페이지 생성 시

1. **역할 확인**: SA/TA/TO/TU 중 어떤 역할용인지
2. **경로 확인**: `src/pages/{역할}/` 하위에 생성
3. **라우트 등록**: `src/routes/` 에서 해당 역할 라우트에 추가
4. **패턴 참고**: 위 모범 페이지 코드 참고

---

## API 연동 시

- 백엔드: `../mzc-lp-backend/` 또는 Swagger 문서
- 타입: `src/types/` 하위 역할별 구분
- React Query: `src/hooks/queries/`, `src/hooks/mutations/`

---

## 실행 방법

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
```
