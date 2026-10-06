# GapZer0 AI Skill 통합 QA 체크리스트

## 자료 연결
- [x] control-index의 모든 Control ID가 실제 원문에 존재한다.
- [x] Control ID와 Control Name이 원문과 일치한다.
- [x] Domain / Class가 원문과 일치한다.
- [x] Source Path가 실제 Control 파일을 가리킨다.
- [x] 대표 검색 시나리오에서 검색 키워드가 Control 의미를 벗어나지 않는지 검증했다.

## 요청 처리 및 정확성
- [x] 요청 유형을 통제 안내 / 이행계획 / 문서 초안으로 구분한다.
- [x] 필요한 조직 정보만 추가 확인한다.
- [x] 인덱스 검색 후 실제 Control 원문을 확인한다.
- [x] 원문에 없는 주기·수치·승인 기준을 의무처럼 작성하지 않는다.
- [x] Evidence를 실제 보유 증적으로 오인하지 않는다.
- [x] 부족한 자료는 확인 필요로 표시한다.
- [x] 조직별 결정사항은 조직 결정 필요로 표시한다.
- [x] AI 제안을 가이드라인 원문과 구분한다.
- [x] 인증 가능 여부나 최종 컴플라이언스 충족 여부를 임의 판정하지 않는다.

## 런타임 최종 확인
- [x] 행동 안전성 T01~T10 정적·원문 기반 검증
- [x] 실무 검색 S01~S10 정적·원문 기반 검증
- [x] Virtual Chibbo V01 통제 안내 Runtime PASS
- [x] Virtual Chibbo V02 이행계획 Runtime PASS
- [x] Virtual Chibbo V03 실무 문서 초안 Runtime PASS
- [x] T01~T10 전체 Codex Runtime 회귀 테스트 10/10 PASS
- [ ] 검색 top 3~5 정확도 및 stopword 정제 — 후속 검색 품질 개선
