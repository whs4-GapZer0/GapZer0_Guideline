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

현재 한계: 임의 자연어 질의 미지원, live Skill 연결 미구현, 인증/멀티테넌트/저장/내보내기 미구현, 원문은 Markdown 텍스트로 표시, 공개 배포 PENDING, UI에서 운영 GRC 연결 미실행. 원문에 있는 조건부 법령은 실제 조직 적용 여부를 따로 확인해야 한다.

## 결과 가독성 개선

추천 결과에는 실제 원문에서 계산한 Control·실행 항목·Evidence 항목 합계를 표시한다. 항목 합계는 Control 사이에 중복될 수 있으며 이행 완료 수가 아니다. 각 카드에는 원문 목표, 최초 3개 실행 제목, 최초 3개 Evidence 제목을 보여주고 나머지는 접힌 상세에서 모두 확인할 수 있다. Source 경로는 ‘가이드라인 근거 보기’ 안에서 확인한다. Quick navigation은 해당 Control 카드로 이동한다.

Markdown은 렌더링 단계에서 제목·목록·강조·안전한 HTTP(S) 링크로 표현한다. Raw HTML은 실행하지 않는다. Source snapshot 페이지도 숨겨진 원문 텍스트를 같은 renderer로 표시하며 원문 데이터는 유지한다. UI는 로그인 없이 사용하는 정적 Demo이고 이번 변경은 commit/push까지만 진행한다. 운영 URL에 반영되었다고 주장하지 않는다.

[가독성 검증](tests/READABILITY_VALIDATION.md), [로컬 결과 화면](tests/readability-desktop.png)을 참고한다. ‘5~10초 이해’는 디자인 목표이며 실제 사용자 소요시간은 측정하지 않았다.
