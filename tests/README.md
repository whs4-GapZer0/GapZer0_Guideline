# Self-assessment 검증

## 실행

Node.js 22 이상에서 다음 명령으로 평가 규칙과 질문은행을 검사합니다.

```sh
node --test tests/assessment.test.mjs
```

저장소 루트에서 정적 HTTP 서버를 실행한 뒤 `tests/assessment-preview.html`을 열면 입력 화면을 독립적으로 확인할 수 있습니다. 이 화면은 Jekyll 테마 통합 검증을 대신하지 않습니다.

## 수동 확인

- 각 응답에서 필수 입력값이 없으면 확정되지 않는지 확인합니다.
- 미충족의 증적 없음 사유, 확인 필요의 추가 확인 계획, 완료 시 결과·증적·완료일을 확인합니다.
- 확정 후 변경 사유를 작성하여 재평가하고 이전 기록이 유지되는지 확인합니다.
- 새로고침 복원, JSON 백업·불러오기, 잘못된 버전·ID 거부를 확인합니다.
- 브라우저 저장 차단·용량 부족 시 실패 안내와 JSON 백업이 제공되는지 확인합니다.
- 최종 PR 전에는 실제 Jekyll 테마에서 직접 진입 및 메뉴 이동, 모바일, 상대 경로를 확인합니다.

## 테마 통합 점검 (2026-09-29)

공개 GapZer0 사이트의 HTML 셸·CSS·JavaScript를 로컬에 복제하고 이 브랜치의 본문과 앱을 넣어 Edge에서 검사했습니다. 본문 Markdown은 marked로 변환했습니다. Ruby/Jekyll이 없는 환경이므로 전체 Jekyll 빌드 및 GitHub Pages 배포 검증을 대신하지 않습니다. PR 전 Jekyll 빌드 결과에서도 아래 항목을 확인해야 합니다.

- 소개 페이지에서 처음 자가 진단 진입, 다른 메뉴 왕복, 뒤로/앞으로 가기, 새로고침 시 질문 표시 및 입력 유지.
- 실제 테마 안에서 JSON 백업 다운로드.
- 1440px 데스크톱 및 390px 모바일 화면, 메뉴 열기/닫기, 모바일 첫 진입과 메뉴 왕복.
- 데스크톱에서 모바일로 크기를 변경한 뒤 본문 좌우 잘림 여부.
- White/Sepia/Night에서 입력값 및 평가 관점 색상 확인.

GitBook의 `page.change`에서 앱을 초기화하도록 `assets/gitbook/custom-local.js`를 추가했습니다. 삽입된 모듈 스크립트가 메뉴 이동 시 다시 실행되지 않는 문제를 처리하고 중복 초기화를 방지합니다. 모바일 너비에서는 테마 splitter가 남긴 데스크톱 위치값을 자가 진단 페이지에 한정해 보정합니다.

## 질문은행 출처 및 범위

121개 Control·489개 질문은 담당자가 편집한 `GapZer0_Assessment_Questions.xlsx`의 질문 목록에서 가져왔습니다. Control 명칭·Domain·가이드라인 링크는 질문은행 원본과 Control ID로 연결했습니다. 기준 가이드라인 커밋은 `questions.json`의 `sourceCommit`에 기록합니다.

이 구현은 브라우저별 단일 평가 작업을 지원합니다. 계정·서버 저장·공동 편집·증적 파일 업로드·점수 집계는 포함하지 않습니다. JSON 백업에는 평가 내용과 자료 참조가 포함됩니다.


## 전체 Jekyll 빌드 검증

`.github/workflows/validate-jekyll.yml`은 검토 브랜치 push 및 main 대상 PR에서 GitHub Pages 공식 빌드 환경으로 전체 사이트를 생성합니다. 배포 단계는 없습니다. 생성된 자가 진단 HTML의 경로, 앱 파일 및 질문은행 121/489개를 검사하고, Chromium에서 메뉴 왕복·뒤로/앞으로 가기·새로고침·입력 유지·모바일·테마 전환을 검사합니다. 결과물은 실행 페이지의 `jekyll-site` 아티팩트로 7일간 보관됩니다.

첫 전체 빌드 및 생성 파일 검사 통과: https://github.com/whs4-GapZer0/GapZer0_Guideline/actions/runs/36582883780

위 로컬 미리보기의 Jekyll 미검증 제한은 이 CI 빌드 결과로 보완합니다. 테스트 소스는 사이트 출력에서 제외합니다.
