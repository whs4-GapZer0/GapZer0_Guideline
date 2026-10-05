# GapZer0 AI Skill 가상기업 테스트 시나리오 — Virtual Chibbo v0.1

## 목적

GRC팀이 제공한 가상기업 **치뽀(virtual_chibbo)** 환경을 실제 조직 상황으로 가정하여 GapZer0 AI Skill의 Control 탐색, 이행계획 작성, 실무 문서 초안 기능을 검증한다.

가상기업 저장소:
https://github.com/whs4-GapZer0/virtual_chibbo

테스트는 가상기업의 실제 저장소에 존재하는 자산·공급자·변경관리 정보를 입력 상황으로 사용한다. 단, 가상기업 저장소의 정보가 GapZer0 Control 요구사항 자체를 대체하지 않으며, 최종 답변은 Skill의 Control 원문을 근거로 작성되어야 한다.

## 가상기업 핵심 정보

- 서비스: 합성 데이터 전용 멀티테넌트 채용지원 SaaS
- 주요 인프라: AWS, ECS Fargate, ECR, ALB, RDS PostgreSQL, S3
- 주요 데이터: 지원자·고객사 데이터, S3 이력서
- 보안·감사: IAM, KMS, CloudTrail, Config, CloudFormation
- 배포: GitHub Actions
- 공급자: AWS, Docker Official Image Node, npm, 자체 CI
- 직원 역할 예시: CEO, Cloud Engineer, Release Engineer, Security-Privacy, Ops Partner

관련 가상기업 자료:
- `README.md`: 서비스 개요
- `governance/assets.json`: 자산 대장
- `governance/suppliers.json`: 공급자 대장
- `governance/README.md`: 변경·예외·위험수용 관리 방식
- `config/workforce.example.yaml`: 가상 인력 및 역할

---

## V01. ALB HTTPS SSL 취약점 대응

**우선 검증 Control:** `TVM-C-01`, `TVM-C-03`, `TVM-C-04`, `TVM-C-05`, 필요 시 `INF-E-01`

### 사용자 요청

> 치뽀 채용지원 플랫폼의 공개 HTTPS ALB에서 insecure SSL cipher 문제가 발견되었습니다. 어떤 GapZer0 Control을 확인해야 하고, 어떻게 대응계획을 세워야 하나요?

### 가상기업 근거

`governance/assets.json`의 A-03(ALB 공개 HTTPS 진입점)에 다음 취약점 기록이 존재한다.

- vulnerability_level: medium
- vulnerability_ref: Prowler INF-E-01 2026-10-04
- 내용: elbv2_insecure_ssl_ciphers 실패

### 확인할 기능

- 관련 Control 안내
- 이행계획

### 예상 후보 Control

- INF-E-01 — 전송 데이터 기밀성·무결성·가용성
- TVM-C-01 — 자산 취약점 식별·검증·기록
- TVM-C-03 — 취약점 악용 위협의 영향·발생가능성 식별·기록
- TVM-C-04 — 위협·취약점·영향으로 위험 산정·우선순위화
- TVM-C-05 — 위험 대응 선택·우선순위화·계획·추적·전달

### 통과 기준

- ALB와 SSL 취약점이라는 상황을 관련 Control과 연결한다.
- 하나의 Control만 무조건 확정하지 않고 요청 목적에 따라 후보와 관련 이유를 설명한다.
- 취약점 발견 사실을 실제 Evidence로 오인하지 않는다.
- 대응계획에는 원문에 있는 활동과 조직이 결정해야 할 사항을 구분한다.

---

## V02. AWS·외부 공급자 보안관리

**우선 검증 Control:** `AST-C-03`, `SUP-C-01`, `SUP-C-02`, `SUP-E-02`

### 사용자 요청

> 치뽀는 AWS, Docker Official Image Node, npm을 사용하고 있습니다. 외부 공급자와 서비스를 관리할 때 어떤 GapZer0 Control을 적용해야 하나요?

### 가상기업 근거

`governance/suppliers.json`에 다음 공급자가 등록되어 있다.

- Amazon Web Services
- Docker Official Image node
- npm registry
- 치뽀 CI 빌드

### 확인할 기능

- 관련 Control 안내
- 실무 문서 초안

### 예상 후보 Control

- AST-C-03 — 공급자 제공 서비스 목록 유지
- SUP-C-01 — 외부 서비스와 공급자 활동에서 발생하는 보안 이상 및 침해 징후 탐지
- SUP-C-02 — 외부 의존성 파악·전달
- SUP-E-02 — 공급자 위험도 우선순위화

### 통과 기준

- 공급자 목록과 외부 서비스 사용이라는 상황을 관련 Control과 연결한다.
- 공급자 자체의 보안성을 임의로 판정하지 않는다.
- 공급자별 위험도나 승인 여부가 필요한 경우 조직 결정 필요 사항으로 구분한다.

---

## V03. 직원 퇴사에 따른 계정·권한 회수

**우선 검증 Control:** `IAM-C-01`, `IAM-C-03`

### 사용자 요청

> 치뽀의 직원이 퇴사했습니다. 해당 직원의 AWS와 GitHub 접근권한을 어떻게 처리해야 하나요?

### 가상기업 근거

`config/workforce.example.yaml`에는 CEO, Cloud Engineer, Release Engineer, Security-Privacy, Ops Partner 등의 역할과 권한 세트가 정의되어 있다.

### 확인할 기능

- 관련 Control 안내
- 이행계획

### 예상 후보 Control

- IAM-C-01 — 신원 및 자격증명의 발급·변경·회수 관리
- IAM-C-03 — 접근권한의 부여·검토·회수와 최소권한·직무분리

### 통과 기준

- 퇴직·계약종료가 적용 조건에 포함되는지 확인한다.
- 계정/자격증명 회수와 접근권한 회수를 구분하여 설명한다.
- 가상기업의 실제 승인자나 회수 완료 여부를 추정하지 않는다.

---

## V04. S3 이력서 버킷 보호

**우선 검증 Control:** `INF-C-01`, `IAM-C-03`

### 사용자 요청

> 치뽀는 지원자 이력서를 S3에 저장합니다. 이 데이터 저장과 보호에 어떤 GapZer0 Control을 확인해야 하나요?

### 가상기업 근거

`governance/assets.json`의 A-06은 S3 이력서 버킷이며 다음 정보가 기록되어 있다.

- criticality: high
- business_impact: high
- 공개 차단·기본 암호화·TLS 전용 정책 통과
- SSE-KMS 및 버전 관리 사용

### 확인할 기능

- 관련 Control 안내
- 실무 문서 초안

### 예상 후보 Control

- INF-C-01 — 저장 데이터의 기밀성·무결성·가용성 보장
- IAM-C-03 — 접근권한의 부여·검토·회수와 최소권한·직무분리

### 통과 기준

- S3라는 기술 자체보다 저장되는 데이터의 보호 목적을 기준으로 Control을 찾는다.
- 가상기업의 '통과' 기록을 근거로 전체 통제가 충족되었다고 판정하지 않는다.
- Evidence 예시와 실제 확보된 증적을 구분한다.

---

## V05. 콘솔을 통한 긴급 변경

**우선 검증 Control:** `TVM-C-06`

### 사용자 요청

> 치뽀에서 긴급한 AWS 콘솔 변경이 필요합니다. 변경 전에 어떤 위험관리와 승인 절차를 확인해야 하나요?

### 가상기업 근거

`governance/README.md`에 PR로 남지 않는 콘솔·CLI 변경은 `change` 이슈를 실행 전에 작성하고, 승인자가 `change-approved` 라벨을 붙이는 방식으로 관리한다고 명시되어 있다.

### 확인할 기능

- 관련 Control 안내
- 이행계획

### 예상 후보 Control

- TVM-C-06 — 변경·예외를 위험평가로 관리·기록·추적

### 통과 기준

- 중요 시스템·구성 변경 상황과 TVM-C-06을 연결한다.
- 가상기업의 운영 규칙과 GapZer0 Control 원문을 구분한다.
- 실제 승인자, 승인 완료 여부, 긴급 변경의 허용 여부를 임의로 확정하지 않는다.

---

## V06. 공급자 관계 종료

**우선 검증 Control:** `SUP-C-08`, `SUP-E-03`, 필요 시 `IAM-C-01`

### 사용자 요청

> npm이나 외부 공급자와의 관계를 종료하게 되었습니다. 계정, 데이터, 연결과 관련해서 어떤 보안조치를 해야 하나요?

### 가상기업 근거

`governance/suppliers.json`에 공급자와 상태가 기록되어 있으며, `governance/assets.json`에는 서비스·데이터·연결 자산 정보가 관리되고 있다.

### 확인할 기능

- 관련 Control 안내
- 실무 문서 초안

### 예상 후보 Control

- SUP-C-08 — 공급자 관계 종료 후 보안조치 계획 및 이행
- SUP-E-03 — 공급자 관계 전 기간 위험관리
- IAM-C-01 — 신원 및 자격증명의 발급·변경·회수 관리

### 통과 기준

- 공급자 관계 종료라는 적용 조건을 확인한다.
- 계정·데이터·장비·연결·서비스를 종료 대상에 포함할 수 있는지 원문을 확인한다.
- 실제 삭제·회수 완료 여부는 증적 확인 없이는 판정하지 않는다.

---

## 테스트 결과 기록

| ID | 결과 | 선택 Control | 문제점 | 수정 내용 | 재시험 |
|---|---|---|---|---|---|
| V01 |  |  |  |  |  |
| V02 |  |  |  |  |  |
| V03 |  |  |  |  |  |
| V04 |  |  |  |  |  |
| V05 |  |  |  |  |  |
| V06 |  |  |  |  |  |

## 공통 평가 기준

1. 사용자 상황을 정확히 파악했는가?
2. 관련 Control 후보를 적절하게 찾았는가?
3. Control 원문을 확인했는가?
4. 적용 조건을 실제 상황과 비교했는가?
5. Control 원문과 가상기업 운영정보를 혼동하지 않았는가?
6. Evidence 예시와 실제 확보된 증적을 구분했는가?
7. AI 제안과 가이드라인 근거를 구분했는가?
8. 조직 결정 필요 사항을 임의로 확정하지 않았는가?
9. 존재하지 않는 Control이나 매핑을 생성하지 않았는가?
10. 답변에 Control ID와 원문 위치를 남겼는가?

## 테스트 원칙

이 문서는 **테스트 입력과 기대 검증 기준**을 정의한다. 실제 PASS/FAIL 결과는 Skill과 Control 원문이 통합된 뒤 실행하여 기록한다.


## Control 검증 주의사항

위 Control은 **테스트 실행 전에 설정한 기대 후보**이다. 실제 AI Skill 실행 결과가 이 목록과 다르다고 즉시 FAIL로 판정하지 않는다. 사용자 요청과 가이드라인 원문을 함께 확인하여 실제로 더 적절한 Control이 있는지 검토한 뒤 판정한다. 특히 V01처럼 하나의 상황에 자산·취약점·위험평가·위험대응이 함께 포함되는 경우 복수 Control이 자연스러울 수 있다.
