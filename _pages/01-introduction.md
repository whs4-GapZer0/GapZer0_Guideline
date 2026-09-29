---
layout: post
title: "01. GapZer0 가이드라인 소개"
permalink: /introduction/
---


## 1.1 가이드라인의 정의

GapZer0 가이드라인은 NIST Cybersecurity Framework 2.0(NIST CSF 2.0)과 ISMS-P를 연계하여 설계한 GapZer0 Framework를 국내 조직의 정보보호 및 개인정보보호 업무에 적용하기 위한 실무 지침서입니다.

GapZer0 Framework가 조직이 달성해야 할 보안 목적과 수행해야 할 Control을 정의한다면, 본 가이드라인은 각 Control을 **누가, 언제, 어떻게 이행하고 무엇으로 결과를 확인할 것인지** 설명합니다. 실무자는 가이드라인을 통해 적용할 Control을 선택하고, 책임자와 협업 부서를 정하며, 구체적인 이행 활동과 필요한 증적을 확인할 수 있습니다.

웹 가이드라인은 다음 5개 페이지로 구성합니다.

1. **GapZer0 가이드라인 소개**: Framework의 정의, 목적, 사용 대상과 전체 구성을 설명합니다.
2. **가이드라인 활용 방법**: 적용할 Control을 선택하고 이행·평가·개선하는 절차를 설명합니다.
3. **주요 용어**: Security Domain, Control Class, Implementation Guide, Evidence 등 Framework의 주요 용어를 설명합니다.
4. **Control Implementation Guide**: 15개 Security Domain별 Control의 목적, 적용 조건, 책임, 구현 방법과 Evidence를 제공합니다.
5. **Self Assessment**: Assessment Questions를 이용하여 Control 이행 상태와 근거를 기록하는 평가 기준과 활용 방법을 제공합니다.

본 가이드라인은 모든 조직에 동일한 기술이나 운영방식을 요구하지 않습니다. 조직은 업무 특성, 규모, 정보자산, 개인정보 처리현황, 기술환경 및 위험 수준을 고려하여 Control의 적용 범위와 구현 수준을 합리적으로 조정할 수 있습니다.

## 1.2 가이드라인의 목적

본 가이드라인은 국내 조직이 기존 ISMS-P 관리체계와 운영 경험을 최대한 활용하면서, NIST CSF 2.0의 Outcome과 사이버보안 생애주기 관점을 바탕으로 보안 수준을 지속적으로 진단하고 개선하도록 지원하는 것을 목적으로 합니다.

NIST CSF 2.0과의 연계는 ISMS-P를 대체하기 위한 것이 아닙니다. 두 기준의 공통 요구사항과 차이를 함께 제시하여 국내 인증 요구사항의 목적과 구현 방향을 실무자가 일관되게 이해하고, 기존 관리체계에서 부족한 부분을 보완할 수 있도록 합니다.

### 1.2.1 적용 판단 지원

조직의 관리체계 범위, 업무와 정보자산, 개인정보 처리 여부, 위탁·클라우드 이용 여부 및 위험 수준을 바탕으로 각 Control의 적용 여부를 판단하도록 지원합니다. 적용 결과는 조직의 운영 기준에 따라 **필수, 권고, 조건부 또는 적용 제외**로 구분할 수 있으며, 적용 제외 시에는 그 사유와 승인 근거를 기록합니다.

### 1.2.2 실행 방법과 책임 명확화

각 Control의 목적과 핵심 요구사항을 설명하고, Control Owner와 Stakeholders를 구분하여 통제의 책임자와 협업 주체를 명확히 합니다. 또한 적용 시점, 적용 대상, 관련 법령, 핵심 이행 활동과 세부 설명을 함께 제공하여 실무자가 실제 업무에 적용할 수 있도록 안내합니다.

### 1.2.3 증적에 기반한 현재 상태 확인

Self Assessment의 평가 질문을 정책, 절차, 시스템 설정, 승인내역 및 운영기록 등의 Evidence와 연결하여 문서의 존재 여부뿐 아니라 실제 운영 여부를 함께 확인합니다. 평가 결과는 **충족, 부분 충족, 미충족, 적용 제외 또는 확인 필요**로 구분하여 기록합니다.

### 1.2.4 목표 설정과 개선 관리

Current Profile과 Target Profile을 비교하여 미흡한 부분을 식별하고, 이를 개선조치, 담당자, 목표일 및 완료 기준이 포함된 개선과제로 전환합니다. 개선조치가 완료된 후에는 해당 Control을 다시 평가하여 실제 보안 수준이 향상되었는지 확인합니다.

## 1.3 사용 대상

본 가이드라인의 우선 적용 대상은 ISMS-P 인증을 준비하거나 인증 취득 후 관리체계를 운영·갱신하고 있는 국내 조직입니다. 주요 사용자는 조직 내 정보보호 및 개인정보보호 담당자이며, Control 이행 과정에서 경영진, 인사, 개발, IT·인프라 운영, 법무·컴플라이언스, 업무부서 및 외부 공급자와 협업합니다.

주요 활용 대상은 다음과 같습니다.

- ISMS-P 인증을 신규로 준비하는 조직
- ISMS-P 인증 취득 후 관리체계를 운영하거나 갱신하는 조직
- 기존 ISMS-P 통제를 NIST CSF 2.0 관점에서 점검하려는 조직
- 정보보호 및 개인정보보호 업무의 책임, 수행방법과 증적을 표준화하려는 조직
- Current Profile과 Target Profile을 활용하여 개선과제를 체계적으로 관리하려는 조직

초기 버전은 기존 ISMS-P 관리체계를 운영하는 조직을 우선 대상으로 합니다. 향후에는 ISMS-P 인증 대상이 아닌 중소규모 조직도 조직의 규모와 위험 수준에 맞게 활용할 수 있도록 적용 범위와 실무 예시를 확장합니다.

## 1.4 GapZer0 Framework 구성

GapZer0 Framework는 **Security Domain → Control Class → 개별 Control**의 구조로 구성합니다. Security Domain은 유사한 보안 목적과 업무영역을 묶고, Control Class는 ISMS-P와 NIST CSF 2.0 간 매핑에서 각 Control이 수행하는 역할을 구분합니다.

### 1.4.1 Control Class

| Control Class | 매핑 기준 | 의미 |
| --- | --- | --- |
| Common Control | ISMS-P와 NIST CSF 2.0이 중첩되는 요구사항 | 국내 기준과 CSF Outcome을 함께 충족하기 위한 공통 Control입니다. |
| Enhancement Control | NIST CSF 2.0과의 비교에서 확인된 Gap | ISMS-P만으로 충분히 다루기 어려운 CSF Outcome을 보완하는 확장 또는 신규 Control입니다. |
| Local Control | NIST CSF 2.0과 직접 매핑되지 않는 ISMS-P 요구사항 | CSF에 직접 대응하지 않더라도 국내 법령과 인증 요구사항 준수를 위해 유지해야 하는 Control입니다. |

Control Class는 Control의 중요도나 이행 우선순위를 나타내는 등급이 아닙니다. ISMS-P와 NIST CSF 2.0 사이에서 해당 Control이 수행하는 역할과 도입 근거를 구분하기 위한 기준입니다.

### 1.4.2 Framework v0.1 구성 현황

GapZer0 Framework v0.1은 **15개 Security Domain과 121개 Control**로 구성합니다. Control Class별로는 Common Control 76개, Enhancement Control 30개, Local Control 15개입니다.

| Security Domain | Common | Enhancement | Local | 합계 |
| --- | ---: | ---: | ---: | ---: |
| Governance | 11 | 6 | 0 | 17 |
| Asset Management | 7 | 2 | 0 | 9 |
| Continuity | 8 | 3 | 0 | 11 |
| Human Resource Security | 3 | 0 | 0 | 3 |
| Identity and Access Management | 3 | 2 | 1 | 6 |
| Information Protection | 1 | 2 | 3 | 6 |
| Information Security Assurance | 5 | 0 | 0 | 5 |
| Information Security Event Management | 18 | 4 | 0 | 22 |
| Legal and Compliance | 0 | 1 | 9 | 10 |
| Physical Security | 3 | 0 | 1 | 4 |
| Application Security | 0 | 1 | 0 | 1 |
| Secure Configuration | 2 | 0 | 0 | 2 |
| Supplier Relationships Security | 8 | 5 | 1 | 14 |
| System and Network Security | 1 | 0 | 0 | 1 |
| Threat and Vulnerability Management | 6 | 4 | 0 | 10 |
| **합계** | **76** | **30** | **15** | **121** |

Domain별 폴더에는 Framework에 실제로 존재하는 Control Class의 페이지만 구성합니다. 예를 들어 Local Control이 없는 Domain에는 `local.md`를 별도로 작성하지 않습니다.

### 1.4.3 Control별 구성 항목

각 Control은 다음 항목으로 구성합니다.

| 구성 항목 | 설명 |
| --- | --- |
| Control ID | Security Domain과 Control 순서를 식별하는 고유번호입니다. |
| Security Domain | Control이 속한 보안 업무영역입니다. |
| Control Class | Common, Enhancement 또는 Local 중 해당 분류를 표시합니다. |
| Control Name | Control의 핵심 내용을 간결하게 표현한 명칭입니다. |
| Control Objective | Control을 통해 달성하려는 보안 목적을 설명합니다. |
| Control Statement | 조직이 충족해야 할 핵심 요구사항과 필요한 이유를 설명합니다. |
| 적용 조건 | 적용 시점, 적용 대상 및 관련 법령을 구분하여 제시합니다. |
| Control Owner | Control 이행과 결과에 최종적인 책임을 지는 역할입니다. |
| Stakeholders | Control 이행 과정에서 협업하거나 정보를 제공해야 하는 역할입니다. |
| 매핑된 ISMS-P 항목 | 관련 ISMS-P 번호와 항목명을 함께 제시합니다. |
| 매핑된 CSF 항목 | 관련 NIST CSF 2.0 Subcategory와 Outcome 설명을 제시합니다. |
| Implementation Guide | 핵심 이행 활동과 세부 설명을 단계별로 제공합니다. |
| Assessment Questions | Control의 설계와 실제 운영 여부를 점검하기 위한 평가 질문입니다. |
| Evidence | Control의 설계와 실제 운영 여부를 확인할 수 있는 증적 예시입니다. |
| ISMS-P Limitation | Enhancement Control에서 기존 ISMS-P 요구사항만으로 충분히 다루기 어려운 부분을 설명합니다. |
| CSF Coverage | Enhancement Control이 해당 CSF Outcome을 어떻게 보완하는지 설명합니다. |

Framework 원본에는 Assessment Questions를 Control별 항목으로 포함합니다. 다만 웹사이트의 Control Implementation Guide 페이지에는 평가 질문을 중복하여 작성하지 않고, `05. Self Assessment`와 향후 추가할 구조화 데이터 파일에서 별도로 관리합니다. 이를 통해 평가 질문, 평가 결과, 평가 근거와 Evidence를 하나의 평가체계로 운영할 수 있습니다.

## 1.5 가이드라인 활용 절차

GapZer0 가이드라인은 조직이 필요한 Control을 확인하는 것에서 끝나지 않습니다. Control의 이행 방법을 확인하고 현재 상태를 평가한 뒤, 미흡한 부분을 개선하고 재평가하는 과정까지 지원합니다.

본 페이지에서는 전체 활용 흐름을 요약합니다. 세부적인 사용 방법은 `02. 가이드라인 활용 방법`에서 안내하며, 실무자는 다음 5단계에 따라 가이드라인을 활용합니다.

### STEP 1. 적용할 Control을 선택합니다

조직의 관리체계 범위, 업무, 정보자산, 개인정보 처리환경, 외부 공급자와 클라우드 이용현황 및 위험 수준을 확인합니다. 이후 각 Control의 적용 조건과 Control Class를 검토하여 적용 여부를 결정하고, 적용 제외 항목은 사유와 승인 근거를 기록합니다.

### STEP 2. 이행 방법과 책임을 확인합니다

선택한 Control의 Control Objective와 Control Statement를 통해 달성해야 할 목적과 핵심 요구사항을 확인합니다. Control Owner와 Stakeholders를 지정하고, Implementation Guide를 참고하여 조직의 환경에 맞는 세부 활동, 수행 시점, 주기와 역할을 정합니다.

### STEP 3. Control을 이행하고 Evidence를 관리합니다

정책·절차 수립, 기술적 설정, 승인, 점검 및 교육 등 필요한 활동을 수행합니다. 이행 결과는 Control별 Evidence 예시를 참고하여 정책, 절차서, 시스템 설정, 승인기록, 점검결과 및 운영기록 등으로 남기고 최신 상태로 관리합니다.

### STEP 4. 현재 상태를 평가하고 개선과제를 수립합니다

`05. Self Assessment`에서 제공하는 Assessment Questions를 활용하여 Control의 설계와 실제 운영 여부를 평가합니다. 결과는 충족, 부분 충족, 미충족, 적용 제외 또는 확인 필요로 기록합니다. 부분 충족 및 미충족 항목은 원인과 위험을 확인한 뒤 개선조치, 담당자, 목표일 및 완료 기준이 포함된 개선과제로 전환합니다.

### STEP 5. 재평가하고 지속적으로 관리합니다

개선조치 완료 후 해당 Control을 재평가하여 Current Profile을 갱신하고 Target Profile과의 차이가 해소되었는지 확인합니다. 또한 Framework, 법령, 조직, 시스템 또는 위협환경이 변경되면 영향을 받는 Control의 적용 여부와 이행 상태를 다시 검토합니다.

## 1.6 Framework 업데이트 및 변경사항 확인 방법

### 1.6.1 원본 관리와 배포 방식

Framework의 기준 정보는 버전이 표시된 Excel 원본으로 관리하고, 웹 가이드라인은 Markdown 형식으로 작성하여 GitHub Repository에서 관리합니다. Framework v0.1의 Control 구조와 매핑을 기준으로 Domain과 Control Class별 Markdown 문서를 작성합니다.

웹 문서는 Security Domain별 작업 브랜치에서 수정하고 Pull Request를 통해 팀원 간 상호 검토한 뒤 main 브랜치에 Merge합니다. Merge된 Markdown 문서는 Jekyll과 `jekyll-gitbook` 테마를 통해 HTML 문서 사이트로 변환되며, GitHub Pages가 이를 자동으로 배포합니다.

```text
Framework 또는 관련 기준 변경
        ↓
영향받는 Domain과 Control 식별
        ↓
해당 Domain / Class의 Markdown 파일 수정
        ↓
작업 브랜치에 Commit
        ↓
Pull Request 및 팀원 상호검토
        ↓
main 브랜치에 Merge
        ↓
GitHub Pages Build 및 배포
```
