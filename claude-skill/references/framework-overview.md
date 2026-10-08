# GapZer0 Framework Overview

## 목적
GapZer0는 NIST CSF 2.0과 국내 ISMS-P 요구사항의 연계를 바탕으로 국내 조직이 정보보호·개인정보보호 통제를 이해하고 이행하는 데 활용할 수 있도록 구성한 프레임워크 및 가이드라인이다.

## 구성
가이드라인은 15개 Security Domain을 중심으로 Control을 분류한다. 현재 프로젝트에서 확정한 Control Catalog와 가이드라인의 최신본을 기준으로 사용하며, 개수나 ID가 변경되면 최신 원문을 우선한다.

## Control Class
### Common
NIST CSF 2.0과 ISMS-P의 요구사항이 충분히 연계되는 영역을 기반으로 구성한 통제이다.

### Enhancement
ISMS-P만으로는 NIST CSF 2.0의 결과를 충분히 설명하기 어려운 Gap을 보완하기 위한 통제이다.

### Local
국내 정보보호·개인정보보호 환경에서 필요한 요구사항 중 NIST CSF에 직접 대응되는 결과가 없는 국내 특화 통제이다.

## 주요 필드
- **Control ID:** Control의 고유 식별자
- **Control Name:** 통제의 내용을 나타내는 명칭
- **Security Domain:** 관련 보안 주제를 기준으로 Control을 묶은 상위 영역
- **Control Class:** Common / Enhancement / Local 구분
- **Control Objective:** 해당 Control을 통해 달성하려는 보안·프라이버시 목적
- **Control Statement:** Control의 목적을 달성하기 위해 수행해야 하는 핵심 요구사항입니다.
- **적용 조건:** 통제가 언제, 어떤 대상에 적용되는지 판단하기 위한 정보. 가이드라인에서는 필요한 경우 관련 법령도 함께 제시한다.
- **Control Owner:** Control의 이행과 유지에 책임을 지는 부서 또는 역할입니다.
- **Stakeholders:** 통제 수행에 참여하거나 정보 제공·검토·협업하는 관계자
- **ISMS-P / CSF Mapping:** Control과 연계된 기준 항목
- **Implementation Guide:** 실무자가 Control을 실제로 이행하기 위한 활동과 설명
- **Evidence:** Implementation Guide의 이행 여부를 확인하기 위한 증적
- **ISMS-P Limitation / CSF Coverage:** Enhancement Control에서 보완 필요성과 CSF 결과의 범위를 설명하는 정보

## 사용 원칙
AI는 이 문서를 Control 원문 대신 사용하지 않는다. 관련 Control을 찾은 뒤 반드시 최신 Control Guide 원문을 읽는다.

Control의 ID, Name, Owner, Stakeholders, Mapping 등은 원문을 우선하며 임의로 생성하거나 변경하지 않는다.

조직마다 다른 담당부서명, 수행 주기, 승인 기준, 적용 범위 등은 사용자가 제공하지 않은 경우 확정하지 않는다.

## 가이드라인 활용 흐름
적용할 Control 탐색 → 적용 조건 확인 → Implementation Guide 확인 → 필요한 Evidence 확인 → 조직 환경에 맞는 실행계획 수립 → 이행 및 검토 → 개선

## 버전 원칙
Skill은 GapZer0 가이드라인의 최신 승인본을 기준으로 동작한다. 인덱스와 Control 원문이 불일치할 경우 Control 원문을 우선하고 인덱스 수정 필요 사항을 표시한다.

## 용어 동기화 근거
위 Control Statement와 Control Owner 정의는 canonical main `25b323acee87af4cb9a4d4dbca9708834069127e`의 `_pages/03-term-explanation.md` 원문 정의를 사용합니다. 개별 Control 요구사항과 실제 조직 책임 지정은 해당 Control 원문과 조직 정보를 우선합니다.
