# GapZer0 AI Skill 정량 평가 계획

## 목적
멘토링 피드백에 따라 기존 PASS/FAIL 중심 검증을 분자/분모가 명확한 정량 지표로 확장한다. 기존 Runtime 결과를 재사용하되, 기존 기록만으로 계산할 수 없는 지표는 별도 실행 후 확정한다.

## 평가 지표

| 지표 | 정의 | 현재 증빙 | 현재 값 |
|---|---|---|---|
| Runtime Scenario Pass Rate | PASS 시나리오 / 전체 실제 Runtime 시나리오 | V01~V03, T01~T10 | **13/13 (100%)** |
| Core Function Pass Rate | 통제 안내·이행계획·실무 문서 초안 PASS / 3 | V01~V03 | **3/3 (100%)** |
| Regression Scenario Pass Rate | T01~T10 PASS / 10 | T01~T10 | **10/10 (100%)** |
| Top-5 Search Case Pass Rate | 모든 기대 Control이 Top-5에 포함된 검색 케이스 / 전체 검색 케이스 | search smoke test | **8/8 (100%)** |
| Fake Control Generation | 존재하지 않는 ID 요청에서 가짜 Control을 생성한 건수 | T05 | **0/1건** |
| Unsupported Certification Decision | 인증 가능 여부를 근거 없이 최종 판정한 건수 | T06 | **0/1건** |
| Top-3 Hit Rate | 기대 Control별 Top-3 포함 수 / 전체 기대 Control 수 | 추가 측정 필요 | **TBD** |
| Expected-Control Recall | Runtime 기대 Control 중 실제 응답에 포함된 Control 수 / 기대 Control 수 | 세부 응답 로그 기준 재계수 필요 | **TBD** |
| Source Grounding Rate | 실제 Control 원문을 확인한 응답 / grounding 평가 대상 응답 | 세부 응답 로그 기준 재계수 필요 | **TBD** |
| Required-field Completion Rate | 요청 유형별 필수 출력 항목 충족 수 / 전체 필수 항목 수 | output-formats 기준 재계수 필요 | **TBD** |
| Unsupported Requirement Rate | 원문/사용자 정보에 없는 의무·수치·주기 등을 확정한 응답 / 평가 대상 응답 | 세부 응답 로그 기준 재계수 필요 | **TBD** |

## 현재 확정 산식
- Runtime Scenario Pass Rate = 13 / 13 × 100 = **100%**
- Core Function Pass Rate = 3 / 3 × 100 = **100%**
- Regression Scenario Pass Rate = 10 / 10 × 100 = **100%**
- Top-5 Search Case Pass Rate = 8 / 8 × 100 = **100%**
- Fake Control Generation = **0건** (T05)
- Unsupported Certification Decision = **0건** (T06)

## 해석 시 주의사항
1. 13/13 PASS는 현재 정의된 테스트 세트에서의 성공률이며 전체 보안 질의에 대한 일반 정확도를 의미하지 않는다.
2. Top-5 8/8은 검색 스크립트의 8개 대표 검색 케이스에 한정한다.
3. T05와 T06의 0건 결과는 각각 단일 부정 테스트 결과이므로 일반적인 hallucination rate로 확대 해석하지 않는다.
4. Top-3, Grounding, 출력 충족률 등은 실제 응답 로그 또는 추가 실행 결과를 확보한 뒤 확정한다.
5. 최종 발표에서는 지표명과 함께 반드시 분자/분모 및 테스트 범위를 제시한다.

## 다음 실행
1. 검색 스크립트에 Top-3 측정 결과를 추가한다.
2. V01~V03, T01~T10 실제 응답을 rubric으로 재채점한다.
3. 최종 정량 결과를 본 문서에 업데이트한다.
4. PPT에는 핵심 지표와 테스트 범위를 함께 표기한다.
