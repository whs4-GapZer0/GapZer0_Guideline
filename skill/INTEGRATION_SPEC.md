# GapZer0 AI Skill 사전 통합 규격 v0.1

이 문서는 A 파트와 B 파트를 결합할 때 파일 구조와 참조 경로가 어긋나지 않도록 통합 규칙을 정의한다.

## 1. 목표 구조

```text
skill/
├── SKILL.md
├── FUNCTION_SPEC.md
├── INTEGRATION_SPEC.md
├── examples.md
├── references/
│   ├── framework-overview.md
│   ├── control-index.md
│   ├── control-index-schema.md
│   ├── output-formats.md
│   └── controls/
│       ├── 01-governance/
│       │   ├── common.md
│       │   └── enhancement.md
│       └── ...
├── scripts/
│   ├── build-control-data.mjs
│   ├── validate-control-data.mjs
│   └── test-control-search.mjs
└── tests/
    ├── control-search-cases.md
    ├── test-scenarios.md
    ├── integration-checklist.md
    └── validation-results.md
```

## 2. 경로 규칙

- Skill 진입 문서는 `skill/SKILL.md`이다.
- Control 검색은 `skill/references/control-index.md`를 사용한다.
- 실제 답변의 근거는 `skill/references/controls/` 아래의 Control 원문이다.
- Framework 공통 설명은 `skill/references/framework-overview.md`를 사용한다.
- 출력 구조는 `skill/references/output-formats.md`를 사용한다.
- 테스트 자료는 `skill/tests/`에 둔다.
- 원본 동기화와 구조 검증 스크립트는 `skill/scripts/`에 둔다.
- 인덱스의 Source Path는 `references/controls/...`처럼 SKILL.md 기준 상대경로로 기록한다.

## 3. controls 디렉터리 규칙

기존 가이드라인의 Domain 구조를 최대한 유지한다.

- Domain 폴더명은 기존 가이드라인과 동일한 번호-슬러그 형식을 사용한다.
- Class 파일명은 `common.md`, `enhancement.md`, `local.md` 중 실제 존재하는 Class만 둔다.
- Control ID와 Control Name을 임의로 변경하지 않는다.
- 웹사이트 표시용 요소가 Skill의 원문 해석을 방해하는 경우에만 정리하며 통제 의미는 변경하지 않는다.
- 새 통제 내용을 재작성하기보다 최신 승인된 가이드라인 원문을 재사용한다.

## 4. control-index 연결 계약

`control-index.md`의 각 레코드는 최소한 다음 값을 제공한다.

`Control ID | Control Name | Domain | Class | Search Keywords | Applying Condition Summary | Source Path`

세부 작성 규칙은 `references/control-index-schema.md`를 따른다.

Skill은 인덱스에서 후보를 찾은 뒤 Source Path의 실제 원문을 다시 읽어야 한다. Source Path가 없거나 파일이 존재하지 않으면 해당 후보만으로 최종 요구사항을 확정하지 않는다.

## 5. 자료 우선순위

1. 최신 승인된 Control 원문
2. Framework 공통 설명
3. control-index

인덱스와 원문이 충돌하면 원문을 우선하고 인덱스 수정 필요 사항을 표시한다.

## 6. 통합 시 차단 조건

다음 중 하나라도 발생하면 해당 Control에 대한 최종 답변 생성을 중단하거나 '확인 필요'로 처리한다.

- 인덱스의 Control ID가 원문에 없음
- Control ID와 Control Name이 원문과 불일치
- Source Path가 존재하지 않음
- Domain 또는 Class가 원문과 불일치
- 원문을 읽지 못했는데 인덱스 요약만으로 답변하려는 경우

## 7. B 파트 완료 후 통합 순서

1. `control-index.md` 존재 여부 확인
2. `references/controls/`의 Domain/Class 파일 확인
3. 인덱스의 모든 Source Path 연결 확인
4. ID·Name·Domain·Class 원문 일치 여부 확인
5. `tests/integration-checklist.md` 수행
6. `tests/test-scenarios.md`의 T01~T10 실행
7. FAIL 항목 수정 후 재시험
8. 전체 PASS 후 PR 검토 요청

Control Guide 원문이 변경되면 `scripts/build-control-data.mjs`를 다시 실행한 뒤 `scripts/validate-control-data.mjs`로 ID, 경로와 본문 동일성을 확인한다. `scripts/test-control-search.mjs`는 대표 실무 표현으로 예상 Control 후보가 검색되는지 확인하는 간이 검색 검증에 사용한다.

## 8. 현재 A 파트 상태

A 파트는 기능 명세, Skill 지침, Framework 공통 설명, 출력 형식, Index 작성 규격, 사용 예시, 테스트 시나리오, 통합 QA 체크리스트를 제공한다.

`control-index.md`와 `references/controls/`는 B 파트와 통합되는 시점에 연결하고 실제 시나리오 검증을 수행한다.
