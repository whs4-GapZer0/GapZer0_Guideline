# AI Skill UI MVP Validation

검증일: 2026-10-08 (Asia/Seoul). 실제 로컬 정적 서버와 Chromium/Playwright를 사용했다. 실시간 LLM 실행은 없다.

| KPI | Result |
|---|---|
| Total Tests | 10 |
| PASS | 10 |
| FAIL | 0 |
| Pass Rate | 10 / 10 × 100 = 100% |
| Browser JavaScript errors | 0 |
| Exit code | 0 |

| ID | 실제 검증 | 결과 |
|---|---|---|
| U01 | 제목 및 JSON 준비 상태, 렌더링 오류 없음 | PASS |
| U02 | 세 기능 버튼의 단일 선택 상태 | PASS |
| U03 | 세 예시 입력과 기능 자동 선택 | PASS |
| U04 | 퇴사자 4개 카드·핵심 ID·원문 활동 펼치기 | PASS |
| U05 | 계획 목표·활동·역할·Timing·Evidence·Status·Source | PASS |
| U06 | 문서 필수 구조 및 공급자 9개 카드 | PASS |
| U07 | 전체 14개 카드의 Source snapshot HTTP 200 및 원문 ID 존재 | PASS |
| U08 | 네 안전성 태그 표시 | PASS |
| U09 | 빈 입력·지원하지 않는 문자열·잘못된 기능 조합, 오래된 결과 숨김 | PASS |
| U10 | Demo/실시간 아님 표시, 1440px·390px 가로 넘침 없음, 캡처 | PASS |

실행 명령:

```bash
python -m http.server 8893 --bind 127.0.0.1
UI_URL=http://127.0.0.1:8893/ai-skill-ui/ node ai-skill-ui/tests/ui-tests.cjs
```

처음 기본 포트 8765는 이미 사용 중이어서 서버 시작에 실패했다. 이를 성공으로 집계하지 않았으며 8893으로 변경하여 위 테스트를 실행했다. [JSON](ui-test-results.json)은 최종 성공 실행 결과다. [캡처](main-screen.png)는 데스크톱 Control 안내 결과를 포함한다. 화면을 직접 검토했다.

원문 데이터 추출은 Index 경로 확인 → 실제 Control 원문 필드 읽기 → snapshot 순서다. 100%는 UI 테스트 10건의 결과이며 일반 자연어 검색 성능, AI Runtime 정확도, 법적/인증 충족을 뜻하지 않는다.

## 기존 파일 보호

작업 시작 시 해시와 비교하여 기존 `skill/`, `.codex/`, `claude-skill/`의 모든 파일이 변경되지 않았음을 확인했다. Control sources, control-index, Codex Skill, Claude Skill, 검색 알고리즘, 정량 평가 보고서, E03 보고서를 모두 보호했다. 기존 미커밋 검색 스크립트 변경도 보존하고 UI 커밋에서 제외했다.

Pages 준비 후 `/GapZer0_Guideline/ai-skill-ui/`와 같은 project base path를 로컬에서 재현하고 U01–U10 10/10 PASS를 다시 확인했다. 공개 URL 검증으로 해석하지 않는다. 서버는 `/workspace`를 root로 하는 8902 포트를 사용했고, UI_URL은 `http://127.0.0.1:8902/GapZer0_Guideline/ai-skill-ui/`였다. Source 링크는 UI 내부 HTML snapshot으로 변경했다.
