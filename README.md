# mzc-lp-frontend

> MZC Learn Platform - Frontend Web App

---

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| Language | TypeScript | 5.x |
| Framework | React | 19.x |
| Build | Vite | 7.x |
| Styling | TailwindCSS | - |
| State | Zustand + React Query | - |

---

## 실행 방법

### 1. 환경 설정

```bash
cp .env.example .env
# .env 파일 수정
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 접속 확인

- http://localhost:3000

### 5. UI 컴포넌트 미리보기

- http://localhost:3000/showcase
- shadcn/ui 기반 컴포넌트 전체 목록 확인 가능

---

## 프로젝트 구조

```
src/
├── api/                     # API 클라이언트
├── components/              # 공통 컴포넌트
├── features/                # 기능별 모듈
├── hooks/                   # 공통 훅
├── stores/                  # 상태 관리 (Zustand)
├── types/                   # TypeScript 타입
└── utils/                   # 유틸리티
```

---

## 관련 문서

| 문서 | 위치 |
|------|------|
| 전체 문서 | [mzc-lp-docs](https://github.com/mzcATU/mzc-lp-docs) |
| 컨벤션 | [docs/conventions/](https://github.com/mzcATU/mzc-lp-docs/tree/main/docs/conventions) |
| 화면 정의서 | [docs/design-specs/](https://github.com/mzcATU/mzc-lp-docs/tree/main/docs/design-specs) |
