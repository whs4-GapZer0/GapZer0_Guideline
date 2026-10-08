# Result readability validation

검증일: 2026-10-08 (Asia/Seoul). 로컬 Chromium 검증. 운영 배포는 수행하지 않는다.

| Suite | Total | PASS | FAIL |
|---|---|---|---|
| UI U01–U10 | 10 | 10 | 0 |
| UX UX01–UX12 | 12 | 12 | 0 |
| Readability READ01–READ13 | 13 | 13 | 0 |

각 테스트셋은 종료 코드 0, 브라우저 오류 0건이다. READ11/12는 먼저 실제 실행한 UI/UX 결과를 확인한다. 100%는 이 테스트셋의 성공률이며 AI 정확도 또는 실제 사용자 이해도를 뜻하지 않는다. 5~10초 내 이해는 디자인 목표로, 실제 시간 측정은 수행하지 않았다.

## 화면 구성과 데이터 보존

- 결과 요약: 추천 Control 수 및 원문 `####` 실행 항목 / Evidence bullet 제목 수의 합계. 중복 가능성과 이행 완료 수가 아님을 고지.
- 카드: ID·이름 → 원문 목표 → 최초 3개 실행 제목 → 최초 3개 Evidence 제목 → 상세/Source. 3개는 표시 개수 제한이며 원문 요구사항의 중요도를 새롭게 판정한 값이 아니다.
- 전체 Implementation Guide, Evidence, 조건, 계획·문서 상세는 기본 접힘. 역할·절차·증적은 Control별 그룹으로 분리.
- Markdown 제목·강조·목록·링크는 DOM 요소로 렌더링. Raw HTML은 평가하지 않고 HTTP(S) 링크만 활성화.
- 원문 source 페이지의 raw text는 숨겨진 pre에 그대로 보존하고 renderer로 전체 표시한다. 원문 텍스트 14/14가 변경 전과 동일함을 별도 비교했다.
- `demo-data.json`, `runtime-adapter.js`는 SHA-256 동일. 기존 Guideline·원문·Index·Skills·workflow·보고서 등 UI 외 파일 변경 0.

## 실행

저장소 루트에서:

```bash
python -m http.server 8922 --bind 127.0.0.1
UI_URL=http://127.0.0.1:8922/ai-skill-ui/ node ai-skill-ui/tests/ui-tests.cjs
UI_URL=http://127.0.0.1:8922/ai-skill-ui/ UX_BASELINE=/tmp/readability-before.json node ai-skill-ui/tests/ux-tests.cjs
UI_URL=http://127.0.0.1:8922/ai-skill-ui/ UX_BASELINE=/tmp/readability-before.json node ai-skill-ui/tests/readability-tests.cjs
```

UX_BASELINE은 작업 시작 전 파일 경로→SHA-256을 저장한 임시 입력이다. 다른 작업에서 재실행할 때는 그 작업의 수정 전 snapshot을 제공해야 한다.

초기 UX09는 Source가 기본 접힘으로 바뀌면서 FAIL했다. 실제 사용자 동작과 같이 Source 상세를 펼친 뒤 원문 경로를 검사하도록 수정했다. 경로·HTTP 접근·Control ID 검증은 그대로 유지했으며 최종 UX12개 모두 PASS다. 기존 UI 테스트 파일은 수정하지 않았다.

## READ 항목

READ01 Markdown 기호 노출 없음, READ02 Control별 카드/그룹, READ03 기본 접힘, READ04 열기/닫기, READ05 실제 원문 활동·수치, READ06 Evidence, READ07 Source/원문 보존, READ08 navigation, READ09 Demo 유지, READ10 자동 선택, READ11 UX12개 유지, READ12 UI10개 유지, READ13 UI 외 변경 0.

[결과 JSON](readability-test-results.json), [데스크톱](readability-desktop.png), [모바일](readability-mobile.png). 공개 사이트 접근과 배포 결과는 이 로컬 검증 범위에 포함하지 않는다.
