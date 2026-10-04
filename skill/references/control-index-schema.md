# Control Index 작성 규격

B 담당자가 작성하는 `control-index.md`와 A 담당자의 `SKILL.md`가 일관되게 연결되도록 최소 필드를 정의한다.

## 필수 필드

| 필드 | 작성 규칙 |
|---|---|
| Control ID | 최신 승인된 GapZer0 Control의 ID를 그대로 사용 |
| Control Name | Control 원문의 명칭을 그대로 사용 |
| Domain | 15개 Security Domain 중 원문 소속 Domain |
| Class | Common / Enhancement / Local |
| Search Keywords | 실무자가 사용할 수 있는 검색 표현. 원문의 의미를 확장하거나 새로운 요구사항을 만들지 않음 |
| Applying Condition Summary | 원문의 적용 조건을 짧게 요약. 원문에 없는 적용 조건을 추가하지 않음 |
| Source Path | 상세 Control 원문 파일의 정확한 경로 |

## 작성 원칙
1. 인덱스는 검색을 위한 목차이며 최종 요구사항의 근거로 사용하지 않는다.
2. Control ID, Name, Domain, Class는 원문과 정확히 일치해야 한다.
3. 검색 키워드는 동의어와 실무 표현을 추가할 수 있지만 새로운 통제 의미를 만들면 안 된다.
4. 적용 조건 요약에서 법적 적용 여부를 새로 판단하지 않는다.
5. 하나의 업무 표현이 여러 Control과 관련될 수 있으므로 중복 키워드를 허용한다.
6. Source Path는 Skill이 실제 원문을 다시 읽을 수 있도록 정확한 위치를 기록한다.

## 권장 레코드 형식

| Control ID | Control Name | Domain | Class | Search Keywords | Applying Condition Summary | Source Path |
|---|---|---|---|---|---|---|
| [ID] | [원문 명칭] | [Domain] | [Class] | 키워드1, 키워드2 | [원문 기반 요약] | references/controls/... |

## 연결 검수
- 인덱스의 모든 ID가 실제 Control 원문에 존재하는가?
- ID와 Name이 원문과 일치하는가?
- Source Path가 실제 파일을 가리키는가?
- 키워드가 Control 의미를 벗어나지 않는가?
- 적용 조건 요약이 원문보다 강한 의무로 표현되지 않았는가?
