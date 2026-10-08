# Interactive AI Skill Showcase — local validation

검증일: 2026-10-08 (Asia/Seoul). 현재 단계는 정보구조·기능 구현과 로컬 검토다. **commit / push / merge / deploy 없음.** 최종 디자인 리뉴얼, 최신 Guideline 전체 동기화, 실시간 LLM/API를 포함하지 않는다.

## 범위와 구조

상단 6개 navigation: AI Skill / 직접 사용하기 / Control 탐색 / 동작 원리 / 검증 결과 / GapZer0 연결. 기존 목적·사용법·질문 영역·Demo·가독성 구조를 유지했다. 소개·안전장치·구성요소·검증 상세·프로젝트 연결은 펼쳐서 읽는다. 긴 전체 문서를 초기 상태에서 노출하지 않는다.

- Explorer 단일 데이터: `data/controls.json`, 121개 Control / 15개 Domain / Common·Enhancement·Local. 후보 metadata와 keyword는 현재 Skill Index, 상세와 전체 원문은 실제 `skill/references/controls/`에서 읽었다. 121/121 source hash·원문 텍스트 대조 완료.
- ID·Name·keyword 문자열 검색, Domain/Class 복합 필터, 초기화, 12개씩 더 보기, 선택 상세와 원문 펼치기. 기존 Skill 검색 알고리즘의 랭킹을 실행하는 기능이 아니다.
- `data/showcase.json`은 기존 보고서 근거 8개 metric과 source/hash를 보관한다. 범위·판정·제한·Report Source를 함께 표시한다.
- 저장소 링크는 데이터 생성 시점 source commit 기준이다. 현재 AI Skill snapshot일 뿐 최신 `_pages/` 전체 동기화 완료를 주장하지 않는다.
- 기존 Demo 3개와 adapter, 원문·Index·Codex/Claude Skill·기존 보고서·Jekyll/workflow·UI 외 모든 파일은 변경하지 않았다. 작업 전부터 수정된 검색 스크립트도 그대로 보존했다.

## Dashboard 근거

| Metric | Display | Actual source |
|---|---|---|
| Codex Runtime | 13/13 | skill/tests/runtime-test-results.md |
| Core Functions | 3/3 | 같은 Runtime 보고서, V01–V03 |
| Regression Scenarios | 10/10 | 같은 Runtime 보고서, T01–T10 |
| Search Top-5 Case | 8/8 | skill/tests/AI_SKILL_QUANTITATIVE_EVALUATION.md |
| Expected-Control Top-5 Hit | 11/11 | 같은 정량 보고서 |
| Claude Runtime | 3/3 | claude-skill/tests/CLAUDE_PORT_VALIDATION.md |
| Cross-runtime Representative Agreement | 3/3 | 같은 Claude 보고서 |
| UI Tests | 10/10 | ai-skill-ui/tests/ui-test-results.json |

모든 수치는 정의한 시나리오 범위 기준이다. AI 일반 정확도나 Control 전체 충족률이 아니다. Claude는 사용자 제공 실제 웹 실행 요약이며 Cross-runtime 수치는 대표 기능 충족 비교로, 텍스트 동일성이나 동일 입력 paired 실행의 일치율이 아니다. 검색 보고서의 Top-3 Case는 7/8로 남아 있음을 상세에서 알린다.

Virtual Chibbo 설명은 `skill/tests/VIRTUAL_CHIBBO_GRC_E2E_E03.md`의 합성 fixture → XLSX → 실제 GRC consumer/parser → instance/Control → assessment 로컬 D 검증을 따른다. 운영 S3·DB·API·UI와 TVM-E-04는 미검증이다.

## 실행 결과

| Suite | Total | PASS | FAIL | Exit |
|---|---|---|---|---|
| 기존 UI | 10 | 10 | 0 | 0 |
| 기존 UX | 12 | 12 | 0 | 0 |
| 기존 Readability | 13 | 13 | 0 | 0 |
| 신규 Showcase | 30 | 30 | 0 | 0 |

브라우저 JavaScript 오류 0건. 기존 테스트 파일과 판정 기준을 변경하지 않고 실행했다. 100%는 해당 UI 테스트셋 성공률이며 실제 사용자 이해도를 측정한 수치가 아니다. SHOW29는 앞서 실제 실행한 세 suite 결과를 확인한다.

로컬 실행 명령 (저장소 루트):

```bash
python ai-skill-ui/build-showcase.py
python -m http.server 8933 --bind 127.0.0.1
UI_URL=http://127.0.0.1:8933/ai-skill-ui/ node ai-skill-ui/tests/ui-tests.cjs
UI_URL=http://127.0.0.1:8933/ai-skill-ui/ UX_BASELINE=/tmp/showcase-before.json node ai-skill-ui/tests/ux-tests.cjs
UI_URL=http://127.0.0.1:8933/ai-skill-ui/ UX_BASELINE=/tmp/showcase-before.json node ai-skill-ui/tests/readability-tests.cjs
UI_URL=http://127.0.0.1:8933/ai-skill-ui/ UX_BASELINE=/tmp/showcase-before.json node ai-skill-ui/tests/showcase-tests.cjs
```

UX_BASELINE은 수정 전 파일 상대경로→SHA-256 JSON이다. 다음 작업에서 무변경 검증을 재현하려면 그 작업 시작 전 snapshot을 제공해야 한다. `/tmp/showcase-before.json`은 이번 작업의 임시 입력이다.

## 신규 테스트 상세

| ID | Check | Result |
|---|---|---|
| SHOW01 | AI Skill 소개와 6개 navigation | PASS |
| SHOW02 | Problem/Solution 요약 펼치기 | PASS |
| SHOW03 | 3개 기능에서 직접 사용하기 이동 | PASS |
| SHOW04 | Demo 3개와 오류 없는 결과 | PASS |
| SHOW05 | 다른 기능에서 예시 자동 선택 | PASS |
| SHOW06 | 결과 요약·실제 Control 수 | PASS |
| SHOW07 | Control 원문 접기·펼치기 | PASS |
| SHOW08 | Markdown DOM 렌더링 | PASS |
| SHOW09 | Explorer 121개 단일 source와 pagination | PASS |
| SHOW10 | Control ID 검색·빈 결과 | PASS |
| SHOW11 | keyword·이름 검색·HTML 입력 안전 | PASS |
| SHOW12 | Domain 실제 값 filter | PASS |
| SHOW13 | Class 실제 값·복합 filter | PASS |
| SHOW14 | Control 상세 실제 필드·Source | PASS |
| SHOW15 | 7단계 Skill Flow | PASS |
| SHOW16 | 실제 Skill 구성요소 repository path | PASS |
| SHOW17 | 3개 기능 Output 구조·원문 format | PASS |
| SHOW18 | 실제 Grounding 원칙 | PASS |
| SHOW19 | Source traceability 결과→원문 | PASS |
| SHOW20 | 실제 report 근거 8개 metric | PASS |
| SHOW21 | metric마다 검증 내용·범위·PASS 기준·제한·report | PASS |
| SHOW22 | Codex/Claude/Web UI 구분 | PASS |
| SHOW23 | GapZer0 전체 Flow·상세 | PASS |
| SHOW24 | E03 실제 report local D·Production 미검증 | PASS |
| SHOW25 | 실제 Repository 산출물 | PASS |
| SHOW26 | 현재 제한과 향후 기능 명확 | PASS |
| SHOW27 | Desktop navigation·레이아웃·캡처 | PASS |
| SHOW28 | Mobile navigation·Explorer·Demo·캡처 | PASS |
| SHOW29 | 기존 실제 UI/UX/READ regression 0 | PASS |
| SHOW30 | ai-skill-ui 외 변경/삭제/추가 0 | PASS |

## 화면 캡처

- [Desktop 소개 / Demo](showcase-desktop.png)
- [Desktop Explorer](showcase-explorer-desktop.png)
- [Desktop 검증 Dashboard](showcase-validation-desktop.png)
- [Mobile 소개](showcase-mobile.png)
- [Mobile Control 상세](showcase-explorer-mobile.png)

1440×1080 및 390×844에서 렌더링과 가로 넘침을 검사했고 캡처를 직접 검토했다. 공개 URL 반영은 수행하거나 확인하지 않았다. 최종 디자인/문체 가이드 적용은 별도 단계다.
