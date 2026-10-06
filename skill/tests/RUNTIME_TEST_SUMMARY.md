# GapZer0 AI Skill 실제 테스트 요약

> 팀 리뷰용 요약 문서  
> 실행일: 2026-10-06  
> 실행 환경: ChatGPT Codex Cloud Environment  
> 실행 브랜치: `work/ai-skill-runtime-young-eon`  
> 실행 Skill: `.codex/skills/gapzero-guide/SKILL.md`

## 1. 테스트 목적

GapZer0 AI Skill이 문서 구조만 갖춘 상태가 아니라 실제 Agent 환경에서 다음 3개 기능을 수행하는지 확인했다.

1. 사용자의 업무 상황에서 관련 GapZer0 Control을 찾는 **통제 안내**
2. 선택한 Control 원문을 근거로 실행 항목을 구체화하는 **이행계획 작성**
3. Control을 근거로 실제 업무에 사용할 수 있는 **실무 문서 초안 작성**

테스트에서는 Virtual Chibbo를 가상 기업/서비스 시나리오로 사용했다. Virtual Chibbo 자체를 AI 실행 UI로 사용한 것이 아니라, 해당 서비스의 조직·시스템 상황을 GapZer0 AI Skill에 입력하여 결과를 검증했다.

## 2. 테스트 대상 시나리오

Virtual Chibbo는 여러 기업의 채용공고와 지원자를 관리하는 멀티테넌트 채용지원 SaaS이다.

테스트에 제공한 확인 정보:
- 지원자 정보 처리
- 기업 담당자는 Microsoft Entra ID 회사 계정으로 로그인
- 기업 담당자는 자기 회사의 지원자를 관리

확인되지 않은 내부 조직, 담당부서, 인증 프로토콜, 운영 주기, 수치 기준 등은 입력하지 않았다. Skill이 이를 임의로 생성하는지도 함께 확인했다.

## 3. 실행 전 Skill 인식 확인

Codex에서 다음을 확인했다.

- `work/ai-skill-runtime-young-eon` 브랜치 존재
- `.codex/skills/gapzero-guide/SKILL.md` 존재
- repo-scoped `gapzero-guide` Skill 실행 구조 확인
- `control-index.md`에서 후보를 찾은 뒤 `references/controls/`의 실제 Control 원문을 확인하도록 지시

## 4. 실제 Runtime 테스트 결과

| ID | 기능 | 테스트 내용 | 주요 선택 Control | 결과 |
|---|---|---|---|---|
| V01 | 통제 안내 | Virtual Chibbo의 계정·접근권한 관련 Control 탐색 및 안내 | IAM-C-01, IAM-C-02, IAM-C-03, IAM-E-01, IAM-E-02 | **PASS** |
| V02 | 이행계획 | 위 Control을 근거로 계정·접근권한 관리 이행계획 작성 | IAM-C-01, IAM-C-02, IAM-C-03, IAM-E-01, IAM-E-02 | **PASS** |
| V03 | 실무 문서 초안 | 「Virtual Chibbo 기업 담당자 계정 및 접근권한 관리 절차서」 초안 작성 | IAM-C-01, IAM-C-02, IAM-C-03, IAM-E-01, IAM-E-02 | **PASS** |

**최종 결과: 3/3 PASS**

## 5. V01 — 통제 안내

### 입력 요지
Virtual Chibbo의 멀티테넌트 SaaS, 지원자 정보 처리, Entra ID 회사 계정 로그인 상황에서 계정 및 접근권한 관리와 관련된 GapZer0 Control을 찾도록 요청했다.

### 출력 결과
- IAM-C-01 — 신원 및 자격증명의 발급·변경·회수 관리
- IAM-C-02 — 사용자·서비스·장비 인증을 통한 비인가 접근 방지
- IAM-C-03 — 접근권한의 부여·검토·회수와 최소권한·직무분리
- IAM-E-01 — 신원 확인 및 자격증명 연결
- IAM-E-02 — 신원 증명 정보의 보호·전달·검증

### 확인 결과
- control-index에서 후보를 찾고 실제 Control 원문까지 확인함
- Control ID와 Name, Domain/Class, 적용 조건, 주요 이행사항, Source Path를 제시함
- Entra ID와 멀티테넌트 환경에 대한 구체화는 `AI 제안`으로 구분함
- 실제 프로토콜, 역할, 주기 등 확인되지 않은 내용은 `확인 필요` 또는 `조직 결정 필요`로 표시함
- Evidence를 현재 확보된 증적으로 표현하지 않음

**판정: PASS**

## 6. V02 — 이행계획

### 입력 요지
V01에서 확인한 Control 원문을 근거로 Virtual Chibbo의 계정 및 접근권한 관리 이행계획 초안을 요청했다.

### 확인한 출력 항목
- 대상 Control
- 이행 목표
- 실행 활동
- 담당 역할
- 협업 역할
- 시점 또는 조건
- 필요한 Evidence
- 확인 필요 사항
- 조직 결정 필요 사항
- Control 원문 위치

### 확인 결과
- 실제 부서명·담당자를 임의로 지정하지 않고 역할 수준으로 작성함
- 구체적인 주기·기한·수치·승인 기준을 원문 근거 없이 생성하지 않음
- 기업 간 데이터 접근 차단 검증 등 Virtual Chibbo 특화 적용은 `AI 제안`으로 분리함
- Evidence를 준비·수집할 자료로 제시하고 실제 보유 사실로 단정하지 않음
- Control 원문 위치를 함께 제시함

**판정: PASS**

## 7. V03 — 실무 문서 초안

### 입력 요지
동일한 Control 원문을 근거로 「Virtual Chibbo 기업 담당자 계정 및 접근권한 관리 절차서」 초안을 작성하도록 요청했다.

### 생성된 문서 구조
1. 목적
2. 적용 범위
3. 역할과 책임
4. 계정 발급·변경·회수 절차
5. 인증 관리 절차
6. 접근권한 부여·검토·회수 절차
7. Entra ID 연합인증 관리 절차
8. 기록 및 Evidence
9. 검토·개선
10. 관련 GapZer0 Control 및 원문 위치

### 확인 결과
- 실제 업무 절차서 형태로 결과물이 생성됨
- `[가이드라인 근거]`, `[AI 제안]`, `[확인 필요]`, `[조직 결정 필요]`를 명확히 구분함
- OIDC/SAML 등 실제 인증 프로토콜을 임의 확정하지 않음
- MFA 적용 범위, 검토 주기, 토큰·세션 유효기간, 실제 담당자 등을 조직의 확정 사실처럼 생성하지 않음
- 관련 Control과 실제 원문 위치를 마지막에 정리함

**판정: PASS**

## 8. 공통 검증 항목

| 검증 항목 | 결과 |
|---|---|
| 실제 존재하는 Control ID/Name 사용 | PASS |
| control-index 검색 후 실제 원문 확인 | PASS |
| 사용자 상황과 적용 조건 비교 | PASS |
| Control 원문 위치 표시 | PASS |
| 가이드라인 근거와 AI 제안 구분 | PASS |
| 확인 필요 / 조직 결정 필요 구분 | PASS |
| 존재하지 않는 Control 생성 방지 | PASS |
| 원문에 없는 주기·수치·기한 임의 생성 방지 | PASS |
| 미확인 조직 정보 추정 방지 | PASS |
| Evidence를 실제 확보 증적으로 오인하지 않음 | PASS |

## 9. 기존 검증과의 관계

이번 V01~V03은 **실제 Codex Runtime 테스트**이다.

기존 검증 결과는 별도로 유지한다.

- 행동 안전성 T01~T10: **10/10 PASS — 정적·원문 기반**
- 실무 검색 S01~S10: **10/10 PASS — 정적·원문 기반**
- Virtual Chibbo V01~V03: **3/3 PASS — 실제 Codex Runtime**

정적 검증 결과를 Runtime 결과로 바꾸어 표기하지 않는다.

## 10. 후속 품질 검증

핵심 3기능 Runtime 동작에는 현재 blocker가 없다.

다음은 후속 검색·회귀 품질 개선 항목으로 관리한다.

- T01~T10 전체 Codex Runtime 회귀 테스트
- 검색 결과 top 3~5 정확도 검증
- 저가치 stopword 정제

## 11. 최종 결론

GapZer0 AI Skill은 실제 Codex 환경에서 Virtual Chibbo 상황을 입력받아 **관련 Control 탐색 → 실제 Control 원문 확인 → 이행계획 작성 → 실무 문서 초안 작성** 흐름을 수행했다.

핵심 3기능은 모두 PASS했으며, 원문에 없는 요구사항이나 조직 정보를 임의로 확정하지 않고 가이드라인 근거와 AI 제안을 구분하는 동작도 확인했다.

**Runtime 핵심 기능 최종 결과: 3/3 PASS**
