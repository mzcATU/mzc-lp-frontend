# PR 생성 가이드

## ✅ 완료된 작업
- 브랜치 생성 및 푸시: `feat/unify-designer-instructor-role`
- 커밋 완료 (푸터 제거됨)
- dev 브랜치 최신화

---

## 📝 1단계: 이슈 생성

### URL
https://github.com/mzcATU/mzc-lp-frontend/issues/new/choose

### 템플릿 선택
**Feature Request**

### 입력 내용

#### Title
```
[Feat] 강사(DESIGNER/INSTRUCTOR) 역할 통합 및 프로필 분리
```

#### 설명
```
DESIGNER와 INSTRUCTOR 역할을 사용자 입장에서 하나의 "강사" 역할로 통합하고, B2C/B2B 프로필 페이지를 분리하여 각 사용자 유형에 맞는 UI를 제공합니다.
```

#### 작업 내용
```
- [x] 역할 선택 페이지 4개 카드 → 2개 카드로 단순화
- [x] 관리자 모드 선택 시 역할 기반 자동 라우팅 구현
- [x] GlobalRoleSwitcher에서 DESIGNER/INSTRUCTOR를 TU로 통합 표시
- [x] 역할 전환 시 INSTRUCTOR 우선 선택 로직 구현
- [x] B2C 프로필 페이지에서 부서/직급 필드 제거
- [x] B2B 마이페이지에 부서/직급 미입력 안내 배너 추가
- [x] B2B 프로필 수정 버튼 경로 수정
```

#### API 스펙
```
해당 없음 (프론트엔드 UI 개선만)
```

#### 관련 브랜치
```
feat/unify-designer-instructor-role
```

#### Labels
`feat`

#### Assignees
kmjk1117-sketch

---

## 🔄 2단계: PR 생성

### URL
https://github.com/mzcATU/mzc-lp-frontend/compare/dev...feat/unify-designer-instructor-role

### PR 정보

#### Title
```
feat: 강사(DESIGNER/INSTRUCTOR) 역할 통합 및 프로필 분리
```

#### Description (아래 전체 복사)

```markdown
## Summary

DESIGNER와 INSTRUCTOR 역할을 사용자 관점에서 하나의 "강사" 역할로 통합하고, B2C/B2B 프로필 페이지를 분리하여 각 사용자 유형에 맞는 UI를 제공합니다.

## Related Issue

- Closes #[생성한_이슈_번호_입력]

## Changes

### 1. 역할 선택 페이지 개선
- 기존 4개 카드(학습자/설계자/강사/운영자)를 2개 카드(학습자 모드/관리자 모드)로 단순화
- 관리자 모드 선택 시 사용자 역할에 따라 자동 라우팅
  - TENANT_ADMIN → /ta/dashboard
  - OPERATOR → /co/dashboard
  - INSTRUCTOR/DESIGNER → /tu/dashboard

### 2. GlobalRoleSwitcher 통합
- DESIGNER와 INSTRUCTOR를 하나의 TU(강사) 역할로 통합 표시
- 역할 전환 시 INSTRUCTOR 우선 선택 로직 구현

### 3. B2C/B2B 프로필 페이지 분리
- B2C 프로필 페이지: 부서/직급 필드 제거 (개인 학습자 전용)
- B2B 프로필 페이지: 부서/직급 필드 유지 (기업 교육 전용)
- B2B 마이페이지에 부서/직급 미입력 시 안내 배너 추가

### 4. B2B 마이페이지 개선
- 프로필 수정 버튼을 B2B 전용 경로(/tu/b2b/mypage/profile)로 수정
- 부서/직급 미입력 시 시각적 안내 배너 표시 (클릭 시 프로필 수정으로 이동)

## Type of Change

- [x] Feat: 새로운 기능
- [ ] Fix: 버그 수정
- [ ] Refactor: 리팩토링
- [ ] Docs: 문서 수정
- [ ] Test: 테스트 추가/수정
- [ ] Chore: 설정/빌드 변경

## Checklist

- [x] 코드가 컨벤션을 따르고 있습니다
- [x] Self-review를 완료했습니다
- [x] 테스트를 추가/수정했습니다 (N/A - UI 변경만)
- [x] 로컬에서 테스트가 통과합니다
- [x] 문서를 업데이트했습니다 (N/A - API 변경 없음)

## Screenshots (Optional)

### 역할 선택 페이지
- 기존: 4개 카드 → 변경: 2개 카드

### GlobalRoleSwitcher
- DESIGNER/INSTRUCTOR → TU로 통합 표시

### B2B 마이페이지
- 부서/직급 미입력 시 안내 배너

## Additional Notes

- 이 변경은 프론트엔드 UI/UX 개선으로 API 변경이 없습니다
- 백엔드에서는 여전히 DESIGNER와 INSTRUCTOR를 별도 역할로 관리하며, 프론트엔드에서만 통합 표시합니다
- B2C/B2B 프로필 분리로 각 사용자 유형에 맞는 최적화된 UI를 제공합니다
```

#### Base branch
`dev`

#### Compare branch
`feat/unify-designer-instructor-role`

#### Reviewers (필수)
- hyuniii0920-mz
- hjj240228mz
- hseegr-mz
- Minseong-mz

#### Assignees
kmjk1117-sketch

#### Labels
`feat`

---

## 📋 변경된 파일 목록

```
src/components/layout/common/GlobalRoleSwitcher/GlobalRoleSwitcher.tsx
src/pages/auth/RoleSelectionPage.tsx
src/pages/tu/b2b/B2BMyPageHome.tsx
src/pages/tu/mypage/MyPageHome.tsx
src/pages/tu/mypage/ProfilePage.tsx
```

---

## ⚡ 빠른 링크

1. **이슈 생성**: https://github.com/mzcATU/mzc-lp-frontend/issues/new/choose
2. **PR 생성**: https://github.com/mzcATU/mzc-lp-frontend/compare/dev...feat/unify-designer-instructor-role

---

## ✨ 작업 순서

1. 위 URL에서 이슈 생성
2. 생성된 이슈 번호 확인 (예: #485)
3. PR 생성 시 "Related Issue" 부분에 이슈 번호 입력
4. Reviewers 지정
5. PR 제출

완료!
