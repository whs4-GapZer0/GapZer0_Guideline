# GapZer0 AI Skill 최종 QA 체크리스트

## 현재 상태

- A 파트 Skill 구조 및 출력 형식 작성 완료
- Virtual Chibbo 실전 시나리오 V01~V06 작성 완료
- 통합 행동 테스트 T01~T10 + V01~V06 결과 기록지 작성 완료
- 최종 시연용 Demo 1~5 프롬프트 작성 완료
- B Control Index PR #44는 현재 통합 대기 상태이며, 실제 실행 PASS는 아직 기록하지 않음

## Merge 후 QA 순서

### 1. 데이터 연결
- [ ] 15개 Domain / 121개 Control Index 확인
- [ ] Control ID 중복·누락 확인
- [ ] Source Path 121개 연결 확인
- [ ] Control 원문과 Skill 참조본 일치 확인
- [ ] 줄바꿈 정규화 validator 재실행

### 2. 기본 행동 테스트
- [ ] T01 Control 탐색
- [ ] T02 Control 상세 안내
- [ ] T03 이행계획
- [ ] T04 문서 초안
- [ ] T05 복수 Control 탐색
- [ ] T06 정보 부족 상황
- [ ] T07 존재하지 않는 Control ID
- [ ] T08 Evidence 구분
- [ ] T09 인증 판단 범위
- [ ] T10 공급자 문서 초안

### 3. Virtual Chibbo 실전 테스트
- [ ] V01 ALB HTTPS SSL 취약점
- [ ] V02 AWS·외부 공급자
- [ ] V03 퇴사자 권한 회수
- [ ] V04 S3 이력서 보호
- [ ] V05 긴급 변경
- [ ] V06 공급자 관계 종료

### 4. 결과 판정

PASS는 다음 조건을 모두 만족할 때만 기록한다.

- 관련 Control이 실제 Index에 존재함
- Control 원문과 답변의 핵심 내용이 일치함
- 적용 조건을 실제 상황과 비교함
- Evidence 예시와 실제 확보 증적을 구분함
- 조직이 결정하지 않은 담당자·주기·승인자 등을 임의 확정하지 않음
- 존재하지 않는 Control이나 매핑을 생성하지 않음
- 출력 형식을 지킴

### 5. 검색 품질

기존 8개 smoke test의 Top 12 PASS를 유지하면서 핵심 실무 검색은 Top 3~5를 별도로 확인한다.

우선 확인 검색어:
- 퇴사자 접근권한 권한 회수
- 개인정보 국외이전 해외 SaaS
- 공급자 보안관리
- S3 이력서 보호
- 긴급 변경 위험평가

### 6. 최종 시연

Virtual Chibbo 상황 제시
→ AI Skill에 사용자 요청 입력
→ 관련 Control 탐색
→ Control 원문 근거 확인
→ 이행계획 또는 문서 초안 생성
→ Evidence 및 추가 결정사항 제시

## 최종 기록 원칙

실행하지 않은 항목은 '미실행' 또는 '대기'로 기록한다.

테스트 결과가 PASS인 경우에도 어떤 Control을 선택했는지와 원문 근거를 함께 남긴다.

FAIL 발생 시:
1. 실패 입력 기록
2. 잘못된 Control/출력 확인
3. 원인 분류(Index / SKILL.md / 검색 / 출력 형식)
4. 수정
5. 동일 입력 재시험
6. 재시험 결과 기록
