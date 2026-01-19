#!/bin/bash

# GitHub 설정
GITHUB_TOKEN="${GITHUB_TOKEN}"  # 환경 변수에서 토큰 가져오기
REPO_OWNER="mzcATU"
REPO_NAME="mzc-lp-frontend"
BASE_BRANCH="dev"
HEAD_BRANCH="feat/unify-designer-instructor-role"

# 색상 코드
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}GitHub Issue & PR 생성 스크립트${NC}"
echo "=========================================="

# GitHub 토큰 확인
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}에러: GITHUB_TOKEN 환경 변수가 설정되지 않았습니다.${NC}"
    echo ""
    echo "GitHub Personal Access Token이 필요합니다."
    echo ""
    echo "1. https://github.com/settings/tokens 방문"
    echo "2. 'Generate new token (classic)' 클릭"
    echo "3. repo 권한 선택"
    echo "4. 토큰 생성 후 복사"
    echo ""
    echo "사용법:"
    echo "  export GITHUB_TOKEN='your_token_here'"
    echo "  bash create-issue-pr.sh"
    exit 1
fi

echo "✓ GitHub 토큰 확인 완료"

# 1. 이슈 생성
echo ""
echo -e "${YELLOW}Step 1: 이슈 생성 중...${NC}"

ISSUE_BODY=$(cat <<'EOF'
DESIGNER와 INSTRUCTOR 역할을 사용자 입장에서 하나의 "강사" 역할로 통합하고, B2C/B2B 프로필 페이지를 분리하여 각 사용자 유형에 맞는 UI를 제공합니다.

## 작업 내용

- [x] 역할 선택 페이지 4개 카드 → 2개 카드로 단순화
- [x] 관리자 모드 선택 시 역할 기반 자동 라우팅 구현
- [x] GlobalRoleSwitcher에서 DESIGNER/INSTRUCTOR를 TU로 통합 표시
- [x] 역할 전환 시 INSTRUCTOR 우선 선택 로직 구현
- [x] B2C 프로필 페이지에서 부서/직급 필드 제거
- [x] B2B 마이페이지에 부서/직급 미입력 안내 배너 추가
- [x] B2B 프로필 수정 버튼 경로 수정

## 변경 사항 상세

### 1. 역할 선택 페이지 (RoleSelectionPage)
- 기존: 학습자/설계자/강사/운영자 4개 카드
- 변경: 학습자 모드/관리자 모드 2개 카드
- 관리자 모드 선택 시 사용자 역할에 따라 자동 라우팅:
  - TENANT_ADMIN → /ta/dashboard
  - OPERATOR → /co/dashboard
  - INSTRUCTOR/DESIGNER → /tu/dashboard

### 2. GlobalRoleSwitcher
- DESIGNER와 INSTRUCTOR를 하나의 TU(강사) 역할로 통합 표시
- 역할 전환 시 INSTRUCTOR가 있으면 INSTRUCTOR 우선, 없으면 DESIGNER 선택

### 3. B2C/B2B 프로필 분리
- B2C 프로필: 부서/직급 필드 제거 (개인 학습자용)
- B2B 프로필: 부서/직급 필드 유지 (기업 교육용)
- B2B 마이페이지에 부서/직급 미입력 시 시각적 안내 배너 표시

## 관련 브랜치
feat/unify-designer-instructor-role
EOF
)

ISSUE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/issues" \
  -d @- <<EOF
{
  "title": "[Feat] 강사(DESIGNER/INSTRUCTOR) 역할 통합 및 프로필 분리",
  "body": $(echo "$ISSUE_BODY" | jq -Rs .),
  "labels": ["feat"],
  "assignees": ["kmjk1117-sketch"]
}
EOF
)

ISSUE_NUMBER=$(echo "$ISSUE_RESPONSE" | grep -o '"number":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$ISSUE_NUMBER" ]; then
    echo -e "${RED}✗ 이슈 생성 실패${NC}"
    echo "응답: $ISSUE_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓ 이슈 #$ISSUE_NUMBER 생성 완료${NC}"
echo "  URL: https://github.com/$REPO_OWNER/$REPO_NAME/issues/$ISSUE_NUMBER"

# 2. PR 생성
echo ""
echo -e "${YELLOW}Step 2: PR 생성 중...${NC}"

PR_BODY=$(cat <<EOF
## Summary

DESIGNER와 INSTRUCTOR 역할을 사용자 관점에서 하나의 "강사" 역할로 통합하고, B2C/B2B 프로필 페이지를 분리하여 각 사용자 유형에 맞는 UI를 제공합니다.

## Related Issue

- Closes #$ISSUE_NUMBER

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
EOF
)

PR_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pulls" \
  -d @- <<EOF
{
  "title": "feat: 강사(DESIGNER/INSTRUCTOR) 역할 통합 및 프로필 분리",
  "body": $(echo "$PR_BODY" | jq -Rs .),
  "head": "$HEAD_BRANCH",
  "base": "$BASE_BRANCH"
}
EOF
)

PR_NUMBER=$(echo "$PR_RESPONSE" | grep -o '"number":[0-9]*' | head -1 | grep -o '[0-9]*')

if [ -z "$PR_NUMBER" ]; then
    echo -e "${RED}✗ PR 생성 실패${NC}"
    echo "응답: $PR_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓ PR #$PR_NUMBER 생성 완료${NC}"
echo "  URL: https://github.com/$REPO_OWNER/$REPO_NAME/pull/$PR_NUMBER"

# 3. PR에 리뷰어 추가
echo ""
echo -e "${YELLOW}Step 3: 리뷰어 추가 중...${NC}"

curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pulls/$PR_NUMBER/requested_reviewers" \
  -d '{
    "reviewers": ["hyuniii0920-mz", "hjj240228mz", "hseegr-mz", "Minseong-mz"]
  }' > /dev/null

echo -e "${GREEN}✓ 리뷰어 추가 완료${NC}"
echo "  - hyuniii0920-mz"
echo "  - hjj240228mz"
echo "  - hseegr-mz"
echo "  - Minseong-mz"

# 4. PR에 라벨 추가
echo ""
echo -e "${YELLOW}Step 4: 라벨 추가 중...${NC}"

curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/issues/$PR_NUMBER/labels" \
  -d '{
    "labels": ["feat"]
  }' > /dev/null

echo -e "${GREEN}✓ 라벨 추가 완료${NC}"

# 5. PR에 Assignee 추가
echo ""
echo -e "${YELLOW}Step 5: Assignee 추가 중...${NC}"

curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/issues/$PR_NUMBER/assignees" \
  -d '{
    "assignees": ["kmjk1117-sketch"]
  }' > /dev/null

echo -e "${GREEN}✓ Assignee 추가 완료${NC}"

echo ""
echo "=========================================="
echo -e "${GREEN}✨ 모든 작업 완료!${NC}"
echo ""
echo "이슈: https://github.com/$REPO_OWNER/$REPO_NAME/issues/$ISSUE_NUMBER"
echo "PR:   https://github.com/$REPO_OWNER/$REPO_NAME/pull/$PR_NUMBER"
echo ""
