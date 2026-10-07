# GapZer0 AI Skill Runtime 테스트 가이드

이 문서는 `skill/SKILL.md`와 통합된 Control 데이터를 실제 AI 실행 환경에서 검증하기 위한 최소 실행 절차입니다.

## 목적

별도 웹앱을 새로 만드는 것이 아니라, **파일/프로젝트 자료를 읽을 수 있는 AI Agent 환경**에 `skill/` 자료를 제공하여 Skill의 세 기능을 실제 응답으로 검증합니다.

검증 대상:
1. 관련 Control 안내
2. Control 이행계획
3. 실무 문서 초안

Virtual Chibbo는 AI 실행기가 아니라 **가상 기업/서비스 시나리오 제공 대상**으로 사용합니다.

## 실행에 필요한 자료

AI 실행 환경이 최소한 다음 파일을 읽을 수 있어야 합니다.

- `skill/SKILL.md`
- `skill/references/control-index.md`
- `skill/references/controls/`
- `skill/references/framework-overview.md`
- `skill/references/output-formats.md`

## 실행 절차

1. 위 자료를 AI Agent의 작업공간/프로젝트에 제공합니다.
2. Agent가 `SKILL.md`를 우선 지침으로 사용하도록 합니다.
3. 아래 공통 지시문과 테스트 프롬프트를 입력합니다.
4. 응답의 Control ID와 Name을 Index에서 확인합니다.
5. Source Path의 실제 Control 원문을 열어 응답 근거를 대조합니다.
6. `tests/runtime-test-results.md`에 PASS / FAIL / BLOCKED를 기록합니다.

## 공통 지시문

> GapZer0 Guideline AI Skill을 사용해 답변해 주세요. 반드시 control-index에서 후보를 찾은 뒤 해당 Control 원문을 확인하세요. 원문에 없는 Control ID, 요구사항, 수행 주기, 수치, 담당부서, 법적 의무를 만들지 마세요. 확인되지 않은 조직 정보는 '확인 필요' 또는 '조직 결정 필요'로 표시하고, 답변 끝에 근거 Control ID와 원문 위치를 표시하세요.

## Virtual Chibbo 테스트 시나리오

현재 확인된 공개 정보만 사용합니다.

> Virtual Chibbo는 여러 기업의 채용공고와 지원자를 관리하는 멀티테넌트 채용지원 SaaS입니다. 지원자 정보를 처리하며, 기업 담당자는 Microsoft Entra ID 회사 계정으로 로그인하여 소속 회사의 지원자를 관리합니다. 실제 Entra/AWS/S3 연결값과 직원 이메일 등 확인되지 않은 정보는 가정하지 마세요.

### V01 — 통제 안내

> 위 Virtual Chibbo 환경에서 계정 및 접근권한 관리와 관련하여 적용을 검토해야 할 GapZer0 Control을 안내해 주세요. 각 Control의 ID와 이름, 관련 이유, 적용 조건, 주요 이행사항, 추가 확인사항, 원문 위치를 제시해 주세요.

### V02 — 이행계획

> 위 Virtual Chibbo 환경의 계정 및 접근권한 관리에 대해 관련 GapZer0 Control 원문을 근거로 이행계획 초안을 작성해 주세요. 담당 역할, 협업 역할, 시점 또는 조건, 필요한 Evidence와 조직 결정 필요 사항을 구분해 주세요. 원문에 없는 주기나 기한은 임의로 만들지 마세요.

### V03 — 실무 문서 초안

> 위 Virtual Chibbo 환경에서 기업 담당자 계정과 접근권한을 관리하기 위한 절차서 초안을 작성해 주세요. 목적, 적용 범위, 역할과 책임, 업무 절차, 기록/Evidence, 검토·개선, 관련 Control 순서로 작성하고, 가이드라인 근거와 AI 제안을 구분해 주세요.

## PASS 기준

- 존재하는 Control ID/Name만 사용
- Index 후보 검색 후 실제 Control 원문을 근거로 사용
- Virtual Chibbo에서 확인되지 않은 환경을 사실처럼 가정하지 않음
- 원문에 없는 수치·주기·기한·담당부서·법적 의무를 강제하지 않음
- Evidence 예시를 이미 확보된 증적으로 표현하지 않음
- `확인 필요` / `조직 결정 필요`를 적절히 사용
- Control ID와 Source Path를 표시
- 요청한 출력 형식을 따름

하나라도 핵심 안전성 기준을 위반하면 FAIL로 기록하고 수정 후 재시험합니다.

## 기존 T01~T10

일반 행동 검증은 `tests/control-search-cases.md`의 T01~T10을 동일한 실행 환경에서 순서대로 입력하여 검증합니다. 정적 검증 결과와 실제 AI 런타임 결과를 혼동하지 않습니다.
