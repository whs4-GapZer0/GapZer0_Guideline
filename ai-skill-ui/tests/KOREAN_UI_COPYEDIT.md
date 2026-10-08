# UI 한국어 윤문 검토

## 문체 참고 지침

- [im-not-ai README](https://github.com/epoko77-ai/im-not-ai/blob/2f3d943d08056b612a92e12bfb72ea94dd2acd18/README.md): 의미·사실·수치·고유명사·인용 보존, 문제 구간만 수정, 장르 유지, 과윤문 금지.
- [실제 SKILL.md](https://github.com/epoko77-ai/im-not-ai/blob/2f3d943d08056b612a92e12bfb72ea94dd2acd18/skills/humanize-korean/SKILL.md): 내용 앵커 보존, 불확실한 수정은 되돌리기.
- [Quick Rules](https://github.com/epoko77-ai/im-not-ai/blob/2f3d943d08056b612a92e12bfb72ea94dd2acd18/skills/humanize-korean/references/quick-rules.md): 번역투·불필요한 영어·명사형 표현 정리. 부정·유보·의무 강도와 보안 전문 용어는 유지.

문체 참고로만 사용했다. 외부 설치·shim·스크립트·에이전트 workflow는 실행하지 않았다. GitHub API contents 조회는 403이었지만 raw 파일과 공개 Git HEAD를 직접 읽어 지침을 확인했다.

## 수정 범위 / 의미 검토

- 수정: **22개 문장 + 4개 짧은 안내·제목 = 26개 검토 항목**.
- 의미 변경: **0건** — 각 항목의 사실·범위·부정·유보·확신 정도를 직접 대조했다. 자연어 의미 동일성을 형식적으로 증명했다는 뜻은 아니다.
- 각 수정 구간의 숫자·Control ID 앵커를 검사했다. 안내 문구를 마스킹한 전후 HTML/JS는 동일하므로 rendering/event/계산 코드나 구조를 변경하지 않았다.
- 보호 파일 223개 SHA-256 대조 통과: UI 밖 파일 전체, UI data JSON, sources HTML, demo-data.json, Runtime adapter.
- 원문 Control ID/Name/Objective/Statement/Owner/Stakeholders/Evidence, 매핑·인용·Source path·검색 알고리즘·정량 지표·분자/분모는 변경하지 않았다.
- 기존 동기화 작업의 미커밋 변경과 기존 미커밋 검색 알고리즘 변경을 보존했다. 이번 작업에서 `ai-skill-ui/` 밖 변경은 0건이다.
- 이미 자연스러운 첫 화면 핵심 안내와 버튼은 유지했다. 윤문량을 늘리기 위한 일괄 단어 치환은 하지 않았다.

## 변경 전후 비교표

| ID | 파일 | 변경 전 | 변경 후 | 이유 | 의미 변경 |
|---|---|---|---|---|---|
| COPY01 | `ai-skill-ui/index.html` | GapZer0 AI Skill은 조직 상황에서 관련 Control을 찾고 실제 원문을 확인한 뒤 실무 적용을 지원합니다. | GapZer0 AI Skill은 조직 상황에 맞는 Control을 찾고, 실제 원문을 확인해 실무에 적용하도록 돕습니다. | 추상적인 지원 표현을 구체적인 동사로 수정 | 없음 |
| COPY02 | `ai-skill-ui/index.html` | 명시된 최신 원격 main Guideline 커밋과 동기화한 AI Skill source snapshot 기준입니다. | AI Skill 자료는 명시된 최신 원격 main Guideline 커밋과 동기화한 시점의 사본입니다. | 혼합된 영어 설명을 한국어로 정리 | 없음 |
| COPY03 | `ai-skill-ui/index.html` | 이 탐색은 ID·이름·키워드의 문자열 필터이며 Skill의 검색 랭킹 평가와는 별도입니다. | 이 탐색은 ID·이름·키워드로 문자열을 걸러내는 기능이며, Skill의 검색 랭킹 평가와는 별도입니다. | 기능 설명의 번역투 정리 | 없음 |
| COPY04 | `ai-skill-ui/index.html` | 관련 후보를 찾는 것에서 끝나지 않고 실제 Control 원문과 조직 상황을 대조합니다. | 관련 후보를 찾은 뒤 실제 Control 원문과 조직 상황을 대조합니다. | 불필요한 대비 표현 제거 | 없음 |
| COPY05 | `ai-skill-ui/index.html` | 업무 대상·행위·위험에서 후보를 찾습니다. | 업무 대상·행위·위험을 기준으로 후보를 찾습니다. | 조사 수정 | 없음 |
| COPY06 | `ai-skill-ui/index.html` | 미확정 정보는 ‘확인 필요’, 조직에서 정할 값은 ‘조직 결정 필요’로 구분합니다. | 아직 확인하지 못한 정보는 ‘확인 필요’, 조직에서 정할 값은 ‘조직 결정 필요’로 구분합니다. | 추상어를 풀어 설명 | 없음 |
| COPY07 | `ai-skill-ui/index.html` | 이는 실제 Skill 규칙의 요약이며 모든 향후 응답의 오류 방지를 보장하지 않습니다. | 실제 Skill 규칙을 요약한 내용이며, 앞으로 나올 모든 응답에 오류가 없다고 보장하지는 않습니다. | 명사형 표현과 부자연스러운 면책 문구 정리 | 없음 |
| COPY08 | `ai-skill-ui/index.html` | 검증된 대표 Scenario를 체험하는 Demo Interface · 실시간 LLM 없음 | 검증된 대표 시나리오를 체험하는 Demo 화면 · 실시간 LLM 없음 | 일반 안내의 불필요한 영어 정리 | 없음 |
| COPY09 | `ai-skill-ui/index.html` | Control을 찾고 적용하는 일을 돕는 단계이며, 실제 이행과 증적 평가는 별도 과정입니다. | AI Skill은 Control을 찾고 적용하는 일을 돕습니다. 실제 이행과 증적 평가는 별도로 진행합니다. | 주어를 밝히고 긴 문장 분리 | 없음 |
| COPY10 | `ai-skill-ui/index.html` | Evidence를 기반으로 평가·관리 | Evidence로 평가·관리 | 불필요한 형식 표현 정리 | 없음 |
| COPY11 | `ai-skill-ui/index.html` | 이 연결은 프로젝트 역할 설명입니다. | 이 연결은 프로젝트에서 각 요소가 맡는 역할을 설명합니다. | 명사 연결을 동사 문장으로 수정 | 없음 |
| COPY12 | `ai-skill-ui/index.html` | 직접 사용하기는 검증 완료된 대표 Scenario 3개만 지원합니다. | 직접 사용하기에서는 검증 완료된 대표 시나리오 3개만 사용할 수 있습니다. | 기능 제한 설명을 자연스럽게 수정 | 없음 |
| COPY13 | `ai-skill-ui/index.html` | 이 변경에서 최종 디자인 리뉴얼·운영 배포·workflow 변경은 하지 않습니다. | 이번 변경에는 최종 디자인 개편·운영 배포·workflow 변경이 포함되지 않습니다. | 어색한 조사와 불필요한 외래어 수정 | 없음 |
| COPY14 | `ai-skill-ui/index.html` | 이 화면은 원문과 검증 기록을 바탕으로 재구성한 Demo입니다. | 이 화면은 원문과 검증 기록으로 구성한 Demo입니다. | 불필요한 수식 표현 정리 | 없음 |
| COPY15 | `ai-skill-ui/quantitative.js` | 정량 평가 대상 범위에서 Top-5까지 후보를 확장하면 평가 대상 expected control이 모두 검색 범위에 포함됩니다. | 정량 평가 대상 범위에서는 Top-5까지 확인하면 기대 Control이 모두 검색 범위에 포함됩니다. | 중복과 혼합 영어 설명 정리 | 없음 |
| COPY16 | `ai-skill-ui/quantitative.js` | 위 수치는 해당 검증 Scenario에서 관찰된 결과이며 전체 질의에 대한 발생률을 의미하지 않습니다. | 위 수치는 해당 검증 시나리오에서 관찰한 결과이며, 전체 질의에 대한 발생률을 의미하지 않습니다. | 불필요한 영어와 피동 표현 정리 | 없음 |
| COPY17 | `ai-skill-ui/quantitative.js` | 0/1은 해당 부정 시나리오에서 관찰된 건수입니다. | 0/1은 해당 부정 시나리오에서 관찰한 건수입니다. | 피동 표현 정리 | 없음 |
| COPY18 | `ai-skill-ui/quantitative.js` | 보고서에 기록된 선정 테스트셋만 사용했습니다. | 보고서에 기록된 선정 테스트셋만 평가했습니다. | 평가 대상을 명확히 설명 | 없음 |
| COPY19 | `ai-skill-ui/quantitative.js` | Control Dataset은 명시된 원격 main 커밋의 Guideline과 동기화한 snapshot입니다. | Control Dataset은 명시된 원격 main 커밋의 Guideline과 동기화한 시점의 사본입니다. | 일반 설명의 혼합 영어 정리 | 없음 |
| COPY20 | `ai-skill-ui/quantitative.js` | 상시 자동 동기화나 이후 변경까지 보장하지 않습니다. | 계속 자동으로 동기화하거나 이후 변경을 반영한다고 보장하지 않습니다. | 명사형 안내를 동사형으로 수정 | 없음 |
| COPY21 | `ai-skill-ui/quantitative.js` | 정량 평가는 선정된 Test Set 기준입니다. | 정량 평가는 선정된 테스트셋을 기준으로 합니다. | 불필요한 영어와 조사 정리 | 없음 |
| COPY22 | `ai-skill-ui/quantitative.js` | Claude 검증은 대표 3개 Scenario 기준입니다. | Claude 검증은 대표 시나리오 3개를 기준으로 합니다. | 번역투 정리 | 없음 |
| COPY23 | `ai-skill-ui/quantitative.js` | 분포 백분율의 분모는 전체 snapshot Control 수입니다. | 분포 백분율의 분모는 동기화 시점의 사본에 포함된 전체 Control 수입니다. | 분모 설명을 자연스러운 한국어로 수정 | 없음 |
| COPY24 | `ai-skill-ui/showcase.js` | 변경은 복사본에만 반영했습니다. | 변경사항은 복사본에만 반영했습니다. | 자연스러운 목적어로 수정 | 없음 |
| COPY25 | `ai-skill-ui/quantitative.js` | Executive Dashboard | 주요 검증 결과 | 전문 용어는 유지하고 일반 제목의 불필요한 영어를 정리 | 없음 |
| COPY26 | `ai-skill-ui/quantitative.js` | Control Dataset — 현재 snapshot | Control Dataset — 동기화 시점의 사본 | 전문 용어는 유지하고 일반 제목의 불필요한 영어를 정리 | 없음 |

## 실제 재실행 결과

| 검증 | PASS / 전체 | FAIL |
|---|---:|---:|
| SYNC | 18/18 | 0 |
| ui | 10/10 | 0 |
| ux | 12/12 | 0 |
| readability | 13/13 | 0 |
| showcase | 30/30 | 0 |
| quantitative | 32/32 | 0 |
| guideline-sync | 6/6 | 0 |

테스트 결과 JSON은 이전 성공 결과와 byte 단위로 동일하며 PASS/FAIL 수·테스트 수·수치를 임의 변경하지 않았다. 새 실행으로 검증했으며 과거 파일만 읽고 PASS라고 판단하지 않았다. 외부 Codex/Claude Runtime 실행은 이번 윤문 검증에 포함되지 않는다.

실행 명령:

```bash
PYTHONDONTWRITEBYTECODE=1 python skill/scripts/validate-guideline-sync.py
python -m http.server 8948 --bind 127.0.0.1
export UI_URL=http://127.0.0.1:8948/ai-skill-ui/
export UX_BASELINE=/tmp/korean-ui-before.json
node ai-skill-ui/tests/ui-tests.cjs
node ai-skill-ui/tests/ux-tests.cjs
node ai-skill-ui/tests/readability-tests.cjs
node ai-skill-ui/tests/showcase-tests.cjs
node ai-skill-ui/tests/quantitative-tests.cjs
node ai-skill-ui/tests/guideline-sync-tests.cjs
```

`/tmp/korean-ui-before.json`은 동기화 완료 후, 이번 윤문 시작 전에 만든 SHA snapshot이다. 실제 보호 검사는 이 시점을 기준으로 한다.

### 중간 문제와 수정

- 이전 로컬 서버 8946이 Empty reply를 반환하여 첫 브라우저 실행은 중단했다. 결과로 계산하지 않고 응답을 확인한 새 서버 8948에서 모든 검증을 다시 실행했다.
- SHOW 첫 완료 실행은 29/30: SHOW26의 기존 문자열 “3개만 지원”이 새 문구와 불일치했다. 검사 문자열만 “3개만 사용할 수 있습니다”로 바꾸고 재실행하여 30/30을 확인했다. 제한 의미·테스트 수·동작 검사는 그대로다.
- SHOW 재검증 완료 뒤 VAL도 다시 실행하여 32/32를 확인했다.

## 이번 작업 변경 파일

- `ai-skill-ui/index.html`
- `ai-skill-ui/quantitative.js`
- `ai-skill-ui/showcase.js`
- `ai-skill-ui/tests/KOREAN_UI_COPYEDIT.json`
- `ai-skill-ui/tests/KOREAN_UI_COPYEDIT.md`
- `ai-skill-ui/tests/guideline-sync-desktop.png`
- `ai-skill-ui/tests/guideline-sync-mobile.png`
- `ai-skill-ui/tests/main-screen.png`
- `ai-skill-ui/tests/quantitative-charts-mobile.png`
- `ai-skill-ui/tests/quantitative-dashboard-desktop.png`
- `ai-skill-ui/tests/quantitative-explorer-desktop.png`
- `ai-skill-ui/tests/quantitative-main-desktop.png`
- `ai-skill-ui/tests/quantitative-mobile.png`
- `ai-skill-ui/tests/readability-mobile.png`
- `ai-skill-ui/tests/showcase-explorer-desktop.png`
- `ai-skill-ui/tests/showcase-tests.cjs`
- `ai-skill-ui/tests/showcase-validation-desktop.png`
- `ai-skill-ui/tests/ux-main-mobile.png`
- `ai-skill-ui/tests/ux-result-desktop.png`

원문 변경: 0. UI 밖 이번 작업 변경: 0. Commit / Push / Deployment: 모두 미실행.
