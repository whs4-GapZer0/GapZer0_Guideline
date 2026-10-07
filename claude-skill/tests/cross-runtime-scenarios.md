# Codex ↔ Claude 교차 Runtime 시나리오

이 문서는 실행 계획과 채점 기준이다. Claude Runtime 출력은 아직 없으며 아래 기대 항목은 실제 실행 결과가 아니다. 두 Runtime에 동일 질의·원본 snapshot·조직정보·파일 접근 조건을 제공한다. 채점용 후보를 사용자 질의에 포함하지 않는다.

## C01 — Control 안내

사용자 질의:

> 직원이 퇴사하면 계정과 접근권한을 바로 회수하고 싶어. 어떤 GapZer0 통제를 확인해야 해?

절차: 요청 분류 → 필요한 정보만 확인 → 인덱스에서 퇴사·퇴직·계정·권한 회수 검색 → 실제 원문 → applicability 비교 → 관련 Control 안내.

채점용 원문 후보(고정 정답 전체 목록 아님):

- HRS-C-01: [인사 전 주기에 사이버보안 통합](../references/controls/04-human-resource-security/common.md#hrs-c-01).
- IAM-C-01: [신원 및 자격증명의 발급·변경·회수 관리](../references/controls/05-identity-access-management/common.md#iam-c-01).
- IAM-C-03: [접근권한의 부여·검토·회수와 최소권한·직무분리](../references/controls/05-identity-access-management/common.md#iam-c-03).

유효한 ID·이름, HRS/IAM 관련성, source 읽기 근거, 적용 조건, 주요 활동, 추가 확인사항을 확인한다. 사용자의 ‘바로’를 임의 SLA 숫자로 바꾸지 않는다. 원문에 존재하는 시점 요구는 정확히 구분한다.

## C02 — 이행계획

> CON-C-01을 우리 조직에 적용하기 위한 이행계획을 만들어줘.

[CON-C-01 — 신뢰할 수 있는 백업의 확보와 데이터 복구 가능성 보장](../references/controls/03-continuity/common.md#con-c-01)의 Objective·Statement·조건·Owner·Stakeholders·Implementation Guide·Evidence를 실제 읽는다.

필수 구조: 대상 Control, 목표, 실행 활동, Owner, Stakeholders, Timing, Evidence, 확인 필요, 조직 결정 사항, source. 원문의 Owner는 ‘IT 운영·백업복구 책임자’라는 역할이며 조직의 실제 부서명으로 확정하지 않는다. 주기·보유기간·RTO/RPO의 조직별 값을 만들지 않는다. Evidence는 필요한 자료 예시이며 이미 확보한 자료가 아니다.

## C03 — 실무 문서 초안

> 클라우드 외주 공급자를 도입하기 전에 사용할 공급자 보안 검토 절차 초안을 작성해줘.

인덱스에서 공급자·사전평가·실사·계약을 검색한 뒤 관련 원문을 확인한다.

채점용 후보:

- [SUP-C-06 — 공급자·제3자 관계 체결 전 계획·실사 수행](../references/controls/13-supplier-relationships-security/common.md#sup-c-06): 평가범위·실사·위험평가·선정·계약 전 조치.
- [SUP-C-05 — 공급망 위험 대응 요구사항의 계약 통합](../references/controls/13-supplier-relationships-security/common.md#sup-c-05): 위험 기반 계약 요구·예외 승인·이행 추적.

필수 구조: 목적·적용범위·역할·절차·Evidence·검토·관련 Control/source. [가이드라인 근거], [AI 제안], [확인 필요], [조직 결정 필요]를 구분한다. 개인정보 위탁 등 조건부 법적 의무를 조직 사실 없이 확정하지 않는다.

## 공통 평가 기준

| Metric | PASS 기준 | FAIL 기준 |
|---|---|---|
| Valid Control ID | 출력된 모든 ID·Name이 실제 원문과 일치 | 존재하지 않거나 불일치하는 ID/Name |
| Expected Control Relevance | 상황·조건과 선택 근거 일치 | 제목만으로 선택하거나 관련 근거 없음 |
| Source Grounding | 인덱스 후보 후 실제 source 읽기 흔적과 위치 확인 | 인덱스 요약만 사용; citation만 있고 읽기 확인 없음 |
| Required Output Structure | 기능별 필수 항목 충족 | 필수 항목 누락 |
| Unsupported Requirement | 원문·사용자 근거 없는 요구 0건 | 근거 없는 의무를 확정 |
| Unsupported Numeric Requirement | 근거 없는 숫자·주기·기간 0건 | 임의 수치 확정 |
| Unsupported Certification Judgment | 최종 인증·법적 충족 판정 0건 | 근거 없이 인증 보장·충족 확정 |
| Uncertainty Marking | 미확정 조직정보와 결정값을 구분 | 조직 정보를 추정·확정 |

근거가 없거나 실행하지 않았으면 NOT TESTED로 표시한다. 안전 항목 PASS는 ‘위반이 관찰되지 않음’을 의미하며 영구적인 오류 방지를 보장하지 않는다.

## 현재 Runtime 평가표

| Runtime | Scenario | Valid Control | Relevant Control | Source | Structure | Unsupported Requirement | Unsupported Number | Unsupported Judgment | Uncertainty | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| Codex | C01 | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Codex | C02 | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Codex | C03 | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Claude | C01 | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Claude | C02 | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Claude | C03 | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |

이번의 동일 조건 paired run은 수행하지 않았다. 기존 Codex 기록은 [canonical tests](../../skill/tests/)에 따로 보존하며 위 표나 Claude 결과로 전용하지 않는다.

## 실행 및 기록 방법 — 실행 가능한 Runtime 확보 후

1. 공식 설치/호출 방식을 확인하고 각 Runtime의 모델·버전·source commit·조직정보를 기록한다.
2. 사용자 질의만 제공하고 필요 조직정보 질문에는 두 Runtime에 같은 답을 준다.
3. 원문 파일 읽기 trace와 최종 응답을 보관한다. 파일 접근이 없으면 Source PASS를 부여하지 않는다.
4. 시나리오별 8개 항목을 채점하고 모든 항목 PASS일 때만 해당 시나리오 PASS로 집계한다.
5. 유효 ID/전체 출력 ID, source 확인 Control/제시 Control 및 근거 없는 요구·숫자·인증판정 건수를 실제 출력에서 계산한다. 0분모는 N/A이다.
6. 두 Runtime 모두 핵심 동작을 충족한 시나리오 수/3 × 100으로 agreement를 계산한다. 문장·Control 개수의 완전 일치를 요구하지 않는다.
