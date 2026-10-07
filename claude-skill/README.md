# GapZer0 AI Skill — Claude Port

**Claude-compatible portable package — 구조 포팅 완료 / Claude Runtime 미검증.**

The Claude port does not replace the Codex Skill.
Both ports use the same GapZer0 Control sources and behavioral rules.

## 목적과 기존 Skill 관계

기존 `skill/SKILL.md`와 `.codex/skills/gapzero-guide/`의 행동 규칙을 유지하면서, Claude에서도 자료를 읽어 활용할 수 있는 독립적인 portable package를 제공한다. 공식 Claude 자동 인식·설치 형식이 검증된 패키지라고 주장하지 않는다. 기존 Codex 디렉터리는 변경하지 않았다.

## 규격 판단

2026-10-07의 확인 시도에서 다음 공식 주소는 네트워크 프록시의 403으로 읽지 못했다.

- https://code.claude.com/docs/en/skills
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview

저장소에 기존 Claude Skill 구성은 발견되지 않았으며 `claude` 실행기도 확인되지 않았다. 이에 사용자 요청의 fallback 경로 `claude-skill/`을 사용했다. 이 주소의 현재 내용·설치 경로·문법은 확인된 것으로 인용하지 않는다. `/opt/codex/bin/codex`는 존재하지만 이것이 Claude 실행 가능성을 의미하지 않는다.

## 구조

```text
claude-skill/
├── SKILL.md                 # 원본 지침 + portable 경계 설명
├── FUNCTION_SPEC.md         # canonical 원본의 동일 bytes
├── INTEGRATION_SPEC.md      # canonical 원본의 동일 bytes
├── references/              # 32개 원본 파일의 동일 bytes snapshot
│   ├── framework-overview.md
│   ├── output-formats.md
│   ├── control-index.md
│   ├── control-index-schema.md
│   └── controls/            # 28개 Control source 파일
├── tests/
│   ├── cross-runtime-scenarios.md
│   ├── CLAUDE_PORT_VALIDATION.md
│   ├── source-manifest.json
│   ├── validate_port.py
│   └── static-validation-results.json
└── README.md
```

## Source of Truth

최신 승인된 Control 원문 → Framework overview → control-index 순으로 따른다. Canonical 자료는 `../skill/references/`이며 portable references는 배포 시점 snapshot이다. snapshot을 별도로 편집하지 않고 canonical에서 갱신한 후 manifest를 재생성·검증한다. canonical 원문의 승인 상태 자체를 새로 인증한 것은 아니다.

`FUNCTION_SPEC.md`와 `INTEGRATION_SPEC.md`는 원본 명세 보존 자료이다. 그 문서의 `skill/` 경로·A/B 통합 이력·스크립트 설명은 canonical 구조를 가리키며 Claude 설치 명령이 아니다. 실제 패키지 entry는 이 디렉터리의 `SKILL.md`, 자료 접근은 `references/` 상대경로이다.

## 세 가지 기능

1. Control 안내: ID·이름·관련성·조건·이행사항·추가 확인·원문 위치.
2. 이행계획: 목표·활동·Owner·Stakeholders·시점·Evidence·조직 결정사항.
3. 실무 문서 초안: 목적·범위·역할·절차·Evidence·검토·관련 Control.

## 사용 예시

파일을 실제 읽을 수 있는 실행기에 SKILL.md를 제공하고 다음과 같이 요청한다. 공식 Claude CLI 명령은 규격 미확인으로 제시하지 않는다.

> 이 패키지의 SKILL.md 절차를 따르고 control-index에서 후보를 검색한 뒤 Control 원문까지 확인해줘. 직원이 퇴사하면 계정과 접근권한을 어떻게 회수해야 해?

다른 예시: `CON-C-01 이행계획을 작성해줘`, `클라우드 외주 공급자 도입 전 보안 검토 절차 초안을 작성해줘`. 단순히 지침을 붙여넣는 것은 공식 Skill 설치나 Runtime 검증이 아니다.

## 안전 규칙

없는 Control·Mapping·법률 조항·주기·보유기간·수치·부서를 만들지 않는다. 실제 source를 읽고 applicability를 비교한다. Evidence 예시는 보유 Evidence가 아니다. 최종 인증 가능 여부를 판정하지 않는다. [가이드라인 근거], [AI 제안], [확인 필요], [조직 결정 필요]를 구분한다.

## 테스트 방법과 현재 검증 수준

저장소 루트에서 정적 검증:

```bash
PYTHONDONTWRITEBYTECODE=1 python claude-skill/tests/validate_port.py
```

이 명령은 파일·hash·인덱스/source 연결·원본 규칙 보존을 검사한다. Claude 실행을 대신하지 않는다. 3개 Runtime 시나리오는 [cross-runtime-scenarios.md](tests/cross-runtime-scenarios.md)를 따른다. 결과와 비교표는 [CLAUDE_PORT_VALIDATION.md](tests/CLAUDE_PORT_VALIDATION.md)에 있다.

| 항목 | 상태 |
|---|---|
| Porting Status | COMPLETE — portable 구조 |
| Static Validation | PASS — 결과 JSON 참조 |
| Claude Runtime Validation | NOT TESTED |
| Cross-Runtime Agreement | NOT MEASURED |

## Known Limitations

- 공식 Claude Skill 형식·자동 발견·설치·호출 미검증.
- 실제 Claude 파일 접근·검색·응답 품질 미검증.
- C01~C03 Codex/Claude paired run 미실행; 기존 Codex 성적을 재사용하지 않음.
- 검색 알고리즘 스크립트는 이 패키지에 복제하지 않는다. 지침은 인덱스와 원문 파일 검색을 요구하며 Runtime별 검색 방식은 미검증이다.
- 복사본은 자동 갱신되지 않는다. manifest hash와 canonical 비교가 필요하다.
