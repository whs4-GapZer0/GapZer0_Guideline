# GapZer0 AI Skill 통합 테스트 실행계획 v0.2

## 목적

B 파트의 Control Index 및 Control 원문이 A 파트의 SKILL.md, 출력 형식과 결합된 뒤 실제 사용자 요청을 입력하여 다음 세 기능이 정상 동작하는지 검증한다.

1. 관련 Control 안내
2. Control 이행계획
3. 실무 문서 초안

가상기업 테스트는 GRC팀의 `virtual_chibbo` 저장소를 사용한다.

- Repository: https://github.com/whs4-GapZer0/virtual_chibbo

## 실행 전 확인

- [ ] `skill/SKILL.md` 존재
- [ ] `skill/references/control-index.md` 존재
- [ ] `skill/references/controls/` 존재
- [ ] `skill/references/framework-overview.md` 존재
- [ ] `skill/references/output-formats.md` 존재
- [ ] Index의 Source Path가 실제 원문과 연결됨
- [ ] Control ID / Name / Domain / Class 일치
- [ ] A/B 통합 후 최신 승인본 기준으로 테스트함

## 테스트 절차

### Step 1. Control 탐색

사용자 상황을 그대로 입력하고 Skill이 관련 Control을 찾는지 확인한다.

확인:
- 핵심 업무·위험을 올바르게 파악하는가?
- 관련 후보 Control을 누락하지 않는가?
- 여러 후보가 있으면 각각의 관련 이유를 설명하는가?
- Index만 보지 않고 실제 원문을 확인하는가?

### Step 2. 원문 추적

답변에 표시된 Control ID와 원문 위치를 따라가 실제 원문과 비교한다.

확인:
- ID / Name 일치
- 적용 조건 일치
- 주요 이행사항의 의미 보존
- Owner / Stakeholders 일치
- Evidence 의미 보존

### Step 3. 이행계획

동일 Control에 대해 이행계획을 요청한다.

확인:
- Objective와 Statement가 목표에 반영되는가?
- Implementation Guide가 실행 활동으로 연결되는가?
- Owner / Stakeholders가 정확한가?
- Evidence 예시와 실제 확보된 증적을 구분하는가?
- 조직이 정하지 않은 주기·담당자·승인자를 임의 확정하지 않는가?

### Step 4. 문서 초안

동일 상황에서 정책·절차·체크리스트 초안을 요청한다.

확인:
- 목적 → 범위 → 역할 → 절차 → 기록/Evidence → 검토·개선 순서가 유지되는가?
- Control 원문에 없는 의무를 추가하지 않는가?
- 관련 Control ID가 표시되는가?
- AI 제안과 가이드라인 근거가 구분되는가?

## 실행 시나리오

### V01 — ALB HTTPS SSL 취약점

입력:
> 치뽀 채용지원 플랫폼의 공개 HTTPS ALB에서 insecure SSL cipher 문제가 발견되었습니다. 어떤 GapZer0 Control을 확인해야 하고, 어떻게 대응계획을 세워야 하나요?

가상기업 근거:
`governance/assets.json`의 A-03 공개 HTTPS 진입점 및 취약점 기록.

확인 기능:
- Control 안내
- 이행계획

### V02 — AWS·외부 공급자

입력:
> 치뽀는 AWS, Docker Official Image Node, npm을 사용하고 있습니다. 외부 공급자와 서비스를 관리할 때 어떤 GapZer0 Control을 적용해야 하나요?

가상기업 근거:
`governance/suppliers.json`의 공급자 목록.

확인 기능:
- Control 안내
- 문서 초안

### V03 — 퇴사자 권한 회수

입력:
> 치뽀의 직원이 퇴사했습니다. 해당 직원의 AWS와 GitHub 접근권한을 어떻게 처리해야 하나요?

가상기업 근거:
`config/workforce.example.yaml`의 역할 및 권한 정보.

확인 기능:
- Control 안내
- 이행계획

### V04 — S3 이력서 보호

입력:
> 치뽀는 지원자 이력서를 S3에 저장합니다. 이 데이터 저장과 보호에 어떤 GapZer0 Control을 확인해야 하나요?

가상기업 근거:
`governance/assets.json`의 A-06 S3 이력서 버킷.

확인 기능:
- Control 안내
- 문서 초안

### V05 — 긴급 변경

입력:
> 치뽀에서 긴급한 AWS 콘솔 변경이 필요합니다. 변경 전에 어떤 위험관리와 승인 절차를 확인해야 하나요?

가상기업 근거:
`governance/README.md`의 콘솔·CLI 변경 관리 방식.

확인 기능:
- Control 안내
- 이행계획

### V06 — 공급자 관계 종료

입력:
> npm이나 외부 공급자와의 관계를 종료하게 되었습니다. 계정, 데이터, 연결과 관련해서 어떤 보안조치를 해야 하나요?

가상기업 근거:
`governance/suppliers.json`, `governance/assets.json`.

확인 기능:
- Control 안내
- 문서 초안

## 결과 기록

| ID | 기능 | 결과 | 선택 Control | 원문 일치 | 출력 형식 | 문제점 | 수정 | 재시험 |
|---|---|---|---|---|---|---|---|---|
| V01 | 안내/이행계획 |  |  |  |  |  |  |  |
| V02 | 안내/문서초안 |  |  |  |  |  |  |  |
| V03 | 안내/이행계획 |  |  |  |  |  |  |  |
| V04 | 안내/문서초안 |  |  |  |  |  |  |  |
| V05 | 안내/이행계획 |  |  |  |  |  |  |  |
| V06 | 안내/문서초안 |  |  |  |  |  |  |  |

## 판정 기준

### PASS
- 관련 Control이 원문 근거와 함께 적절하게 선택됨
- 원문 내용이 답변에 정확히 반영됨
- 출력 형식을 지킴
- 미확정 사항을 확인 필요/조직 결정 필요로 구분함
- 근거 없는 Control, 법적 의무, 주기, 수치 등을 생성하지 않음

### FAIL
- 존재하지 않는 Control을 생성함
- Index만 보고 원문 확인 없이 요구사항을 확정함
- 적용 조건과 다른 Control을 확정함
- Owner / Stakeholders / Evidence를 임의 변경함
- Evidence 예시를 실제 증적으로 표현함
- 조직이 결정하지 않은 사항을 확정함
- 인증 가능 여부나 충족 여부를 자동 판정함

## 중요

이 문서는 **실제 Skill 실행 결과를 대신하지 않는다.**

B 파트가 A 브랜치에 통합된 후 실제 AI 환경에서 V01~V06을 실행하고 PASS/FAIL을 기록한다. 결과가 확인되기 전에는 성공으로 표시하지 않는다.
