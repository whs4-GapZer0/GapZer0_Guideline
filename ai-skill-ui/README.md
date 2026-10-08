# GapZer0 AI Assistant — Web UI MVP

프레임워크·추가 백엔드 없이 HTML/CSS/JavaScript와 Python 정적 서버로 실행하는 발표용 UI다. 별도 `ai-skill-ui/` 디렉터리를 사용하여 기존 Skill·검색 알고리즘·원문·보고서와 분리했다. 기존 `assets/assessment/` 화면의 청록색 `#156b71`을 참고했으며 공식 브랜드색으로 주장하지 않는다.

## Public Demo URL

배포 상태: **PENDING**. 요청 공개 주소: `https://whs4-gapzer0.github.io/GapZer0_Guideline/ai-skill-ui/`. 실제 URL 검증이 완료되지 않아 Live Demo라고 표기하지 않는다.

현재 main에는 Jekyll 빌드 결과를 `site` 브랜치로 보내는 Oracle VM 배포 workflow가 있다. GitHub Pages Settings API 접근이 프록시 403으로 차단되어 Pages source branch는 미확인이다. 현재 작업 브랜치 push만으로 공개 배포를 보장하지 않는다. 기존 `_config.yml`, CNAME 및 workflow는 변경하지 않았다. [공개 배포 검증 기록](tests/PAGES_DEPLOYMENT.md)을 참고한다.

## 실행 방법

Python 3가 필요하다. **저장소 루트에서** 실행한다. Source는 UI 내부 `sources/`의 읽기 전용 원문 snapshot을 제공한다. 원문 변경 시 `build-demo.py`로 갱신한다.

```bash
python -m http.server 8893 --bind 127.0.0.1
```

브라우저 주소창에서 `http://127.0.0.1:8893/ai-skill-ui/`를 연다. Windows에서는 `python` 대신 `py`를 사용할 수 있다. 포트가 사용 중이면 다른 포트를 선택한다. `file://`로 HTML을 여는 방식은 JSON 로딩 제약 때문에 지원하지 않는다.

## 기능 / Demo Mode

- Control 안내: IAM-C-01 / IAM-C-03 / HRS-C-01 및 조건부 PHY-C-02.
- 이행계획: CON-C-01 목표·활동·원문 역할·조건·Evidence·Status·결정 사항.
- 실무 문서 초안: 공급자 도입 검토 및 공급자 관계 전 과정과 연결되는 9개 Control.
- Source를 표시하고 실제 원문 경로를 표시하고 UI 내부의 해당 Control 원문 snapshot 링크를 제공한다. 이 링크는 Pages project base path에서도 상대경로로 동작한다.
- 가이드라인 근거 / AI 제안 / 확인 필요 / 조직 결정 필요를 구분한다.

**실시간 LLM 호출이 아니다.** 현재 API 키, Runtime API, 백엔드 검색, 조직정보 저장, Evidence 생성·GRC ingestion 기능이 없다. 사용자 입력을 외부로 보내거나 저장하지 않는다. 세 예시와 선택 기능이 정확히 일치하는 요청만 지원한다. 지원하지 않는 입력은 안내 메시지를 표시하고 결과를 생성하지 않는다.

Demo는 실제 검증된 시나리오와 Control source를 바탕으로 **새롭게 재구성한 표시 데이터**다. 기존 Runtime 응답 전문의 복사나 새로운 AI Runtime 실행 검증으로 해석하지 않는다. Evidence 목록은 필요한 자료 예시이며 확보된 증적이 아니다. Owner·Stakeholders는 원문 역할이며 조직의 실제 부서로 확정하지 않는다. 주기·기한·숫자·승인 기준은 조직 결정 필요로 남긴다. 인증·법적 충족을 판단하지 않는다.

## 실제 Skill과의 관계 / 데이터 근거

행동 규칙은 기존 `skill/SKILL.md` 및 `.codex/skills/gapzero-guide/SKILL.md`를 참조한다. 기존 Skill은 수정하지 않는다. `build-demo.py`는 canonical Index에서 각 후보의 경로를 찾고 실제 Control 원문의 이름·Domain·Class·목표·조건·역할·Implementation Guide·Evidence를 추출한다. 원문 요약을 근거 없이 생성하지 않고 해당 필드 텍스트를 그대로 표시한다. 원문 파일 SHA-256을 JSON에 기록한다.

- [실제 Codex Runtime 기록](../skill/tests/runtime-test-results.md): V01–V03 및 T01–T03.
- [실제 Claude 대표 Runtime 기록](../claude-skill/tests/CLAUDE_PORT_VALIDATION.md): C01–C03. 사용자 제공 실제 실행 요약임을 유지한다.

`runtime-adapter.js`의 `initialize()`, `examples()`, `ask({mode, question})`가 현재 Demo 경계다. 추후 실제 Runtime adapter로 교체할 수 있으나 인증, source 검증, 출력 validation, 오류 처리 및 서버 측 secret 관리는 별도 구현이 필요하다. 이 MVP에서 API 연동 성공을 주장하지 않는다.

원문이 변경되면 저장소 루트에서 재생성하고 변경 내용을 검토한다:

```bash
python ai-skill-ui/build-demo.py
```

## 발표 시연

1. 상단의 Demo Mode 및 실시간 AI 호출 없음 표시를 설명한다.
2. ‘퇴사자 접근권한 회수’ 예시를 누르고 질문한다. 핵심/조건부 Control과 Source를 보여준다.
3. ‘CON-C-01 이행계획’을 선택하고 목표·활동·역할·Evidence·조직 결정 사항을 보여준다.
4. ‘클라우드 공급자 사전 보안검토’를 선택하고 문서 구조와 원문 근거/제안 구분을 보여준다.
5. 하단에서 Framework→Guideline→AI Skill과 별도의 Chibbo→Evidence→GRC 관계를 설명한다.

## 테스트 / 현재 한계

[검증 보고서](tests/UI_VALIDATION.md), [실행 결과 JSON](tests/ui-test-results.json), [화면 캡처](tests/main-screen.png)를 확인한다. 10/10은 이 Demo UI의 선정된 테스트 성공률이며 AI 정확도·Control 충족률이 아니다.

브라우저 테스트는 Node.js와 Playwright, Chromium이 필요하다. 이미 설치된 실행 환경에서 사용했다. 서버를 위 명령으로 실행한 뒤:

```bash
UI_URL=http://127.0.0.1:8893/ai-skill-ui/ node ai-skill-ui/tests/ui-tests.cjs
```

Windows PowerShell에서는 `$env:UI_URL='http://127.0.0.1:8893/ai-skill-ui/'`로 설정한다. Chromium 경로는 `CHROMIUM_PATH`로 지정한다. 테스트 의존성은 일반 UI 실행에 필요 없다. 개발용 테스트 도구가 없다면 UI와 별도로 Playwright를 설치해야 한다.

현재 한계: 임의 자연어 질의 미지원, live Skill 연결 미구현, 인증/멀티테넌트/저장/내보내기 미구현, 원문 Markdown은 DOM으로 렌더링, 공개 배포 PENDING, UI에서 운영 GRC 연결 미실행. 원문에 있는 조건부 법령은 실제 조직 적용 여부를 따로 확인해야 한다.

## 결과 가독성 개선

추천 결과에는 실제 원문에서 계산한 Control·실행 항목·Evidence 항목 합계를 표시한다. 항목 합계는 Control 사이에 중복될 수 있으며 이행 완료 수가 아니다. 각 카드에는 원문 목표, 최초 3개 실행 제목, 최초 3개 Evidence 제목을 보여주고 나머지는 접힌 상세에서 모두 확인할 수 있다. Source 경로는 ‘가이드라인 근거 보기’ 안에서 확인한다. Quick navigation은 해당 Control 카드로 이동한다.

Markdown은 렌더링 단계에서 제목·목록·강조·안전한 HTTP(S) 링크로 표현한다. Raw HTML은 실행하지 않는다. Source snapshot 페이지도 숨겨진 원문 텍스트를 같은 renderer로 표시하며 원문 데이터는 유지한다. UI는 로그인 없이 사용하는 정적 Demo이고 이번 변경은 commit/push까지만 진행한다. 운영 URL에 반영되었다고 주장하지 않는다.

[가독성 검증](tests/READABILITY_VALIDATION.md), [로컬 결과 화면](tests/readability-desktop.png)을 참고한다. ‘5~10초 이해’는 디자인 목표이며 실제 사용자 소요시간은 측정하지 않았다.

## Interactive AI Skill Showcase — 로컬 검토 단계

상단 6개 navigation으로 소개, Demo, Control 탐색, 동작 원리, 검증 결과, GapZer0 연결을 확인한다. 설명은 펼치기 방식으로 제공하고 기존 디자인과 세 Demo 시나리오는 유지한다. 이번 변경은 로컬 검토용이며 **commit / push / deploy를 수행하지 않는다**. 위 Public Demo URL은 기존 배포 안내이고 새 Showcase 반영 여부를 뜻하지 않는다.

- Explorer: 현재 `skill/references/control-index.md`와 실제 원문에서 구성한 121개 Control, 15개 Domain, 실제 Class 값 3개. ID/Name/keyword 문자열 검색, Domain/Class 복합 필터, 초기화, 12개씩 더 보기, 선택 상세와 전체 원문 보기.
- Explorer의 유일한 Control dataset: `data/controls.json`. 후보 metadata·keywords는 Index, 상세 필드는 실제 source에서 가져온다. missing field를 생성하지 않는다. 기존 `demo-data.json`은 과거 검증된 대표 Demo snapshot으로 유지하며 Explorer UI에 Control을 중복 hardcoding하지 않는다.
- Dashboard: 기존 Codex Runtime·검색 품질·Claude 보고서와 실제 로컬 UI 결과에서 8개 metric을 읽어 구성한 `data/showcase.json`. 각 지표에는 범위·판정 기준·제한·report source를 표시한다. 일반 정확도나 모든 질의의 안전성을 보장하지 않는다.
- GitHub 근거 링크는 기준 commit에 고정되어 있다. 원문 경로·SHA-256·source commit을 JSON에 남긴다.
- E03는 합성 fixture의 로컬 D 검증만 설명하며 운영 S3/DB/API/UI와 TVM-E-04 미검증을 표시한다.

현재 AI Skill snapshot만 재생성하려면 저장소 루트에서:

```bash
python ai-skill-ui/build-showcase.py
```

이 명령은 기존 Control/Skill/report를 읽기만 하고 UI data만 갱신한다. source 보고서의 근거가 없으면 중단하며 지표를 새로 추정하지 않는다. 최신 `_pages/`와의 전체 동기화는 별도 단계다.

[Showcase 검증 보고서](tests/SHOWCASE_VALIDATION.md), [Desktop](tests/showcase-desktop.png), [Mobile](tests/showcase-mobile.png). 최종 디자인 리뉴얼, 실시간 LLM/API, 운영 배포는 포함하지 않는다.

## Quantitative Showcase — 정량 근거 확장

`검증 결과`에 13개 지표, 5개 SVG 도넛, Top-3/Top-5 비교 4개 bar, 검증 Matrix, T01–T10 탐색, T05/T06 단일 안전성 관찰, Codex/Claude 대표 기능 비교와 Runtime 구조를 추가했다. **선정된 검증 범위의 결과이며 전체 AI 정확도·전체 Control 충족률이 아니다.** 분자·분모·범위·측정 의미·Source를 확인할 수 있고 백분율은 JS로 계산한다.

Explorer 통계와 Domain/Class 분포는 기존 `data/controls.json`에서 실행 시 집계한다. 분포를 클릭하면 필터에 적용된다. Demo의 Control ID는 Explorer 원문으로 연결된다. 추가 기능 CTA는 같은 Control이 포함된 기존 Demo에만 연결하고 지원하지 않는 조합은 비활성화한다. Evidence는 필요한 자료 예시이며 실제 확보됐다고 주장하지 않는다.

- 정량 snapshot: [data/quantitative.json](data/quantitative.json)
- 재생성: `python ai-skill-ui/build-quantitative.py` — 실제 보고서·결과 파일을 대조하고 source SHA-256을 기록. Control·Skill·검색 코드 수정 없음.
- 검증: [QUANTITATIVE_VALIDATION.md](tests/QUANTITATIVE_VALIDATION.md), [VAL01–VAL32 결과](tests/quantitative-test-results.json)
- 새 단계는 로컬 구현·테스트·캡처만 완료. **commit / push / deploy 미실행**. 운영 공개 URL에 반영되지 않았다.

검증 순서는 `ui-tests.cjs`, `ux-tests.cjs` → `readability-tests.cjs` → `showcase-tests.cjs` → snapshot 재생성 → `quantitative-tests.cjs`다. `UX_BASELINE`에는 작업 전 파일 SHA-256 map JSON 경로를 설정한다. 이번 실행은 다음 환경을 사용했다:

```bash
python -m http.server 8944 --bind 127.0.0.1
# 다른 터미널, repository root
export UI_URL=http://127.0.0.1:8944/ai-skill-ui/
export UX_BASELINE=/tmp/quantitative-before.json
node ai-skill-ui/tests/ui-tests.cjs
node ai-skill-ui/tests/ux-tests.cjs
node ai-skill-ui/tests/readability-tests.cjs
node ai-skill-ui/tests/showcase-tests.cjs
python ai-skill-ui/build-quantitative.py
node ai-skill-ui/tests/quantitative-tests.cjs
```

`/tmp/quantitative-before.json`은 이번 작업공간의 시작 snapshot이다. 다른 환경에서는 해당 작업 시작 시 snapshot을 새로 생성해야 한다. 기존 미커밋 검색 알고리즘 변경은 읽기 전용으로 대조·보존했으며 UI 변경에 포함하지 않는다. 최신 Guideline 동기화·실시간 자유질의·Production Chibbo/GRC 연결은 별도 검증이 필요하다.

## Guideline → Skill synchronization

이번 동기화는 **조회 시점 원격 `main`의 `25b323acee87af4cb9a4d4dbca9708834069127e`**를 고정하여 수행했다. 작업 브랜치 HEAD는 `f80d34e…`로 유지했고 `_pages/`, main/site/workflow는 수정하지 않았다. 따라서 오래된 로컬 `_pages/` 대신 고정 Git 객체의 공식 원문을 읽는다. 개별 Control의 별도 승인서가 확보됐다는 의미는 아니며, 공식 main 원문·이력을 기준으로 삼았다.

전수 비교: 121 Controls / 15 Domains, 변경 Control 121개 / 변경 필드 220개, Evidence 변경 11개. ID·이름·Domain·Class·추가·삭제·Source 경로 변경은 없다. ISMS-P 표시명 변경 6개는 최신 원문을 그대로 반영했고 번호는 변경되지 않았다. 공식 용어 페이지의 Statement·Owner 정의 2개도 반영했다.

[Sync report](tests/GUIDELINE_SKILL_SYNC_REPORT.md), [전수 old/new structural diff](tests/GUIDELINE_SKILL_STRUCTURAL_DIFF.json), [실제 검색 재실행 결과](data/guideline-sync.json), [정적 검증](../skill/tests/guideline-sync-validation.json).

```bash
# 이미 fetch된 공식 main 커밋을 사용. 원문/branch/workflow 변경 없이 분석.
python skill/scripts/sync-guideline.py --revision 25b323acee87af4cb9a4d4dbca9708834069127e
# 분석의 unresolved가 0이고 source identity가 명확할 때만 copy 적용
python skill/scripts/sync-guideline.py --revision 25b323acee87af4cb9a4d4dbca9708834069127e --apply
python ai-skill-ui/build-sync-data.py
python ai-skill-ui/build-showcase.py
python ai-skill-ui/build-demo.py
python ai-skill-ui/build-quantitative.py
node skill/scripts/validate-control-data.mjs
node skill/scripts/validate-codex-skill.mjs
python claude-skill/tests/validate_port.py
PYTHONDONTWRITEBYTECODE=1 python skill/scripts/validate-guideline-sync.py
```

`guideline-provenance.json`에 공식 원문 commit·28개 source/mirror SHA·Index SHA·assessment source를 기록한다. 일반 `build-control-data.mjs`와 validator도 이 provenance가 있으면 같은 고정 원문을 읽어 오래된 작업 트리로 되돌아가는 것을 막는다. 새 main commit은 읽기 전용으로 fetch한 뒤 다시 비교해야 하며 자동으로 최신이라고 주장하지 않는다.

검색 Before는 작업 시작 전 snapshot을 임시 디렉터리에서 같은 알고리즘으로 실제 실행했다. `/tmp` snapshot이 없는 환경에서는 이미 기록된 Before 측정만 유지하고 After만 다시 실행한다. 전수 validator의 작업 시작 SHA snapshot(`/tmp/guideline-sync-before.json`)과 브라우저 회귀의 동기화 후 SHA snapshot(`/tmp/guideline-sync-ui-baseline.json`)은 이번 작업공간 기준이며 다른 작업에서는 새 snapshot이 필요하다. 이전 UI-only guard는 **동기화 후 브라우저 검증 단계**에 적용하고, 전체 작업의 허용 범위는 별도 SYNC17에서 검사한다.

Codex/Claude 실제 외부 Runtime은 이번에 실행하지 않았다. Dashboard의 기존 Runtime·T05/T06 값은 과거 기록임을 표시했다. 검색 수치는 새 실제 실행 결과를 사용한다. 상시 자동 동기화·외부 Runtime 재검증·Production Chibbo/GRC·운영 배포는 이번 범위가 아니다. 기존 “전체 동기화 미수행” 안내는 이 섹션의 고정 commit 기준 동기화 상태로 대체된다. commit/push/deploy 미실행.
