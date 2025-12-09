# Frontend - AI 작업 가이드

> MZC Learn Platform Frontend Web App

---

## 문서 참조

| 작업 | 문서 |
|------|------|
| 컨벤션 | [mzc-lp-docs/docs/conventions/](https://github.com/mzcATU/mzc-lp-docs/tree/main/docs/conventions) |
| 화면 정의서 | [mzc-lp-docs/docs/design-specs/](https://github.com/mzcATU/mzc-lp-docs/tree/main/docs/design-specs) |
| 설정 가이드 | [mzc-lp-docs/docs/context/frontend-setup.md](https://github.com/mzcATU/mzc-lp-docs/blob/main/docs/context/frontend-setup.md) |

> 전체 문서: [mzc-lp-docs](https://github.com/mzcATU/mzc-lp-docs)

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Language | TypeScript |
| Framework | React 19 |
| Build | Vite |
| Styling | TailwindCSS |
| State | Zustand + React Query |

---

## 핵심 규칙

```
✅ any 타입 금지 → 명시적 타입 정의
✅ 서버 상태: React Query (useState는 UI 상태만)
✅ API: Axios Instance + handleApiError
✅ 컴포넌트: Props Destructuring + Early Return
```

---

## 작업 순서

```
Types → API Service → React Query Hook → Component → Test
```

---

## 실행 방법

```bash
npm install
npm run dev
```
