# GapZer0_Guideline

본 저장소는 **NIST CSF 2.0과 ISMS-P를 기반으로 구성한 GapZer0 Framework의 실무 이행 가이드라인**을 관리하기 위한 GitHub Repository입니다.

이 Repository는 일반 문서 저장소가 아니라 **Jekyll + GitHub Pages + jekyll-gitbook 테마**를 이용하여 Markdown 문서를 웹사이트 형태로 배포하는 구조입니다.


---

# 1. Jekyll이 무엇인가?

Jekyll은 Markdown(`.md`) 파일을 HTML 웹페이지로 변환해 주는 **정적 사이트 생성기(Static Site Generator)** 입니다.

예를 들어 팀원들이 GitHub에 다음과 같은 Markdown 파일을 작성하면,

```text
_pages/01-introduction.md
_pages/04-control-guide.md
```

Jekyll이 이 파일을 읽어 실제 웹사이트의 페이지로 만들어 줍니다.

우리 프로젝트에서는 GitHub Pages가 Jekyll을 이용하여 Repository의 내용을 자동으로 빌드하고 배포합니다.

따라서 일반적인 작업 흐름은 다음과 같습니다.

```text
Markdown 파일 작성
        ↓
GitHub에 Commit
        ↓
GitHub Pages가 Jekyll Build 수행
        ↓
웹사이트에 변경사항 반영
```

## 왜 GitHub + Jekyll 구조를 사용하는가?

GapZer0 Guideline을 설계하면서 중요하게 생각한 것은  **가이드라인을 한 번 만들고 끝내는 것이 아니라, 향후 Framework와 관련 기준이 변경될 때 지속적으로 수정·보완하기 쉬운 형태로 만들어야 한다**는 멘토님의 피드백이었습니다.

PDF나 한글 문서처럼 하나의 완성본 파일을 중심으로 관리하면 수정할 때마다 파일 전체를 다시 편집하고 새 버전을 배포해야 하며, 여러 팀원이 동시에 작업하거나 변경 이력을 추적하기도 어렵습니다.

반면 현재의 **GitHub + Markdown + Jekyll** 구조는 가이드라인을 여러 개의 작은 문서 파일로 나누어 관리하기 때문에 이러한 유지보수 문제를 줄일 수 있습니다.

### 1. 필요한 부분만 수정할 수 있음

가이드라인 전체가 하나의 문서로 묶여 있지 않고 Domain과 Control Class별 Markdown 파일로 분리되어 있습니다.

예를 들어 Governance의 Common Control만 변경해야 한다면 다음 파일만 수정하면 됩니다.

```text
_pages/control-guide/01-governance/common.md
```

다른 Domain이나 페이지를 다시 편집할 필요가 없기 때문에 Framework 일부가 변경되었을 때 **변경 범위를 작게 유지할 수 있습니다.**

### 2. 모든 변경 이력을 Git으로 확인할 수 있음

GitHub에서 작업하는 것이므로 문서의 변경 이력을 관리하고 추적할 수 있습니다.

가이드라인 내용이 담긴 md 파일을 누가 수정했고/언제 수정했으며/ 어떤 내용이 추가·삭제되었는지 확인할 수 있습니다.

### 3. 여러 팀원이 나누어 작업하기 쉬움

Control Guide가 Domain과 Class별 파일로 분리되어 있기 때문에 팀원별로 서로 다른 파일을 맡아 작업할 수 있습니다.

예를 들어,

```text
팀원 A → Governance
팀원 B → Asset Management
팀원 C → Continuity
```

처럼 작업 범위를 나눌 수 있습니다.

### 4. 문서 수정과 웹사이트 업데이트가 연결됨

Markdown 파일을 수정하고 GitHub에 반영하면 GitHub Pages가 Jekyll Build를 수행하여 웹사이트를 다시 생성합니다.

즉,

```text
가이드라인 내용 수정
        ↓
GitHub Commit
        ↓
자동 Build
        ↓
웹 가이드라인 업데이트
```

의 흐름으로 관리할 수 있습니다.

따라서 문서를 수정한 뒤 별도로 HTML 페이지를 다시 만들거나 새로운 PDF 파일을 매번 배포할 필요가 없습니다.

### 5. 구조를 유지하면서 지속적으로 확장할 수 있음

새로운 Control이 추가되거나 기존 Control이 수정되더라도 현재 폴더 구조 안에서 필요한 파일만 수정하면 됩니다.

또한 향후 다음과 같은 기능도 별도의 파일로 추가할 수 있습니다.

```text
Assessment Question 데이터
Self Assessment JavaScript
CSV Export
PDF Export
```

즉, 문서 자체와 기능을 한 Repository에서 함께 발전시킬 수 있습니다.


현재 구조는 다음과 같은 유지보수 흐름을 목표로 합니다.

```text
Framework 또는 기준 변경
        ↓
영향받는 Domain / Control 식별
        ↓
해당 Markdown 파일만 수정
        ↓
Commit으로 변경 이력 기록
        ↓
필요 시 팀원 Review
        ↓
GitHub Pages 자동 Build
        ↓
최신 가이드라인 배포
```

이 프로젝트에서 사용하는 테마는 다음과 같습니다.

```yaml
remote_theme: sighingnow/jekyll-gitbook
```

즉, Jekyll을 이용해 문서를 웹페이지로 만들고, 화면 디자인은 **jekyll-gitbook** 테마를 사용합니다.

---

# 2. Repository 전체 구조

현재 주요 구조는 다음과 같습니다.

```text
GapZer0_Guideline/
│
├── _config.yml
├── README.md
├── index.md
│
├── _data/
│   └── navigation.yml
│
├── _includes/
│   └── toc-date.html
│
└── _pages/
    ├── 01-introduction.md
    ├── 02-how-to-use.md
    ├── 03-term-explanation.md
    ├── 04-control-guide.md
    ├── 05-self-assessment.md
    │
    └── control-guide/
        ├── 01-governance/
        ├── 02-asset-management/
        ├── 03-continuity/
        ├── 04-human-resource-security/
        ├── 05-identity-access-management/
        ├── 06-information-protection/
        ├── 07-information-security-assurance/
        ├── 08-information-security-event-management/
        ├── 09-legal-compliance/
        ├── 10-physical-security/
        ├── 11-application-security/
        ├── 12-secure-configuration/
        ├── 13-supplier-relationships-security/
        ├── 14-system-network-security/
        └── 15-threat-vulnerability-management/
```


# 3. 최상위 파일

## 3.1 `README.md`

**Repository에서 작업하는 팀원들을 위한 개발·운영 설명서**입니다.

---

## 3.2 `index.md`

GapZer0 Guideline 웹사이트의 **첫 화면(Home Page)** 입니다.

현재 다음 내용을 제공합니다.

- GapZer0 Guideline 설명
- 가이드라인 활용 흐름
- 01~05 목차 설명
- 각 목차 페이지로 이동하는 링크

Front Matter의

```yaml
layout: home
permalink: /
```

설정 때문에 이 파일이 사이트의 루트 페이지가 됩니다.

즉,

```text
https://whs4-gapzer0.github.io/GapZer0_Guideline/
```

로 접속하면 이 파일의 내용이 표시됩니다.

---

## 3.3 `_config.yml`

Jekyll 사이트 전체의 **환경설정 파일**입니다.

사이트 제목, URL, 테마, Markdown 설정, Collection 설정 등 사이트 전체 동작을 결정합니다.

현재 중요한 설정은 다음과 같습니다.

### 사이트 기본 정보

```yaml
title: GapZer0 Guideline
longtitle: GapZer0 Security Framework Guideline
author: GapZer0
```

### GitHub Pages 주소

```yaml
url: "https://whs4-gapzer0.github.io"
baseurl: "/GapZer0_Guideline"
```

### jekyll-gitbook 테마

```yaml
remote_theme: sighingnow/jekyll-gitbook
```

### `_pages` Collection 설정

```yaml
collections:
  pages:
    output: true
    permalink: /:collection/:path/
```

이 설정이 있기 때문에 `_pages` 폴더 안의 Markdown 파일이 실제 웹페이지로 빌드될 수 있습니다.


`_config.yml`은 사이트 전체에 영향을 주므로, 단순한 콘텐츠 작성 작업에서는 가급적 수정하지 않는 걸 권장합니다.

---

# 4. `_data` 폴더

## 4.1 `_data/navigation.yml`

웹사이트 왼쪽 Sidebar에 표시할 **메인 목차 데이터**입니다.

현재 Sidebar에는 다음 5개 메뉴만 표시하고 있습니다.

```text
01. GapZer0 가이드라인 소개
02. 가이드라인 활용 방법
03. 주요 용어
04. Control Implementation Guide
05. Self Assessment
```

예시 구조는 다음과 같습니다.

```yaml
- title: "01. GapZer0 가이드라인 소개"
  url: /introduction/
```

`title`은 Sidebar에 표시되는 이름이고, `url`은 클릭했을 때 이동할 페이지 주소입니다.


Control Guide 하위의 15개 Security Domain은 Sidebar에 직접 표시하지 않았습니다.

사용자는

```text
04. Control Implementation Guide
        ↓
Security Domain 선택
        ↓
Control Class 선택
```

방식으로 이동합니다.

---

# 5. `_includes` 폴더

## 5.1 `_includes/toc-date.html`

jekyll-gitbook의 **왼쪽 Sidebar(목차)를 실제 HTML로 만들어 주는 템플릿 파일**입니다.

기본 jekyll-gitbook 테마는 Collection의 페이지를 자동으로 Sidebar에 출력하지만, 저희 가이드라인에서는 Sidebar를 01~05만 표시하도록 직접 수정했습니다.

현재 구조는 다음과 같습니다.

```text
_data/navigation.yml
        ↓
toc-date.html
        ↓
웹사이트 왼쪽 Sidebar
```

따라서 Sidebar 메뉴를 추가하거나 삭제하려면 일반적으로 `navigation.yml`을 수정합니다.

`toc-date.html`은 Sidebar 구조 자체를 변경할 때만 수정합니다.

이 파일을 잘못 수정하면 사이트 전체 Sidebar가 깨질 수 있으므로 일반 콘텐츠 작성 시에는 수정하지 않는 걸 권장합니다.

---

# 6. `_pages` 폴더

`_pages`는 실제 GapZer0 Guideline의 **본문 콘텐츠를 관리하는 핵심 폴더**입니다.

---

## 6.1 `01-introduction.md`

**01. GapZer0 가이드라인 소개** 페이지입니다.

주요 내용은 다음과 같습니다.

- GapZer0 Guideline 정의
- 개발 목적
- 사용 대상
- 가이드라인이 제공하는 역할

---

## 6.2 `02-how-to-use.md`

**02. 가이드라인 활용 방법** 페이지입니다.

실무자가 GapZer0 Guideline을 어떻게 활용하는지 설명합니다.

기본 활용 절차는 다음과 같습니다.

```text
적용할 Control 선택
        ↓
Implementation Guide 확인
        ↓
Evidence 확인
        ↓
Self Assessment
        ↓
미흡사항 개선
```

---

## 6.3 `03-term-explanation.md`

**03. 주요 용어** 페이지입니다.

GapZer0 Framework에서 사용하는 주요 용어를 설명합니다.

예:

- Security Domain
- Control
- Control Class
- Common
- Enhancement
- Local
- Control Objective
- Control Statement
- Implementation Guide
- Assessment Question
- Evidence
- ISMS-P Limitation
- CSF Coverage

Framework 용어나 필드 정의가 변경될 경우 이 페이지도 함께 수정합니다.

---

## 6.4 `04-control-guide.md`

**04. Control Implementation Guide의 시작 페이지(Hub Page)** 입니다.

GapZer0 Framework의 15개 Security Domain을 보여주며, 각 Domain 이름에는 해당 Domain 페이지로 이동하는 링크가 설정되어 있습니다.

구조는 다음과 같습니다.

```text
04. Control Implementation Guide
        ↓
15 Security Domains
        ↓
Domain별 index.md
        ↓
Common / Enhancement / Local
        ↓
Control 상세 내용
```

---

# 7. `_pages/control-guide` 폴더

실제 GapZer0 Framework의 **Security Domain별 Control Implementation Guide**를 관리하는 폴더입니다.

```text
01-governance
02-asset-management
03-continuity
04-human-resource-security
05-identity-access-management
06-information-protection
07-information-security-assurance
08-information-security-event-management
09-legal-compliance
10-physical-security
11-application-security
12-secure-configuration
13-supplier-relationships-security
14-system-network-security
15-threat-vulnerability-management
```

폴더 앞의 번호는 Framework상에서 정렬된 순서로 폴더를 정렬하고 싶어서 붙였습니다.

웹페이지 주소는 각 Markdown 파일 내부의 `permalink`를 사용하므로 폴더 번호가 웹 URL에 직접 노출되지 않습니다.

예를 들어 실제 파일 경로가

```text
_pages/control-guide/01-governance/index.md
```

여도 Front Matter가

```yaml
permalink: /controls/governance/
```

로 설정되어 있기 때문에 실제 웹 주소는

```text
/controls/governance/
```

가 됩니다.

---

# 8. 각 Domain 폴더의 구조

Domain 폴더에는 기본적으로 다음 파일이 들어갑니다.

```text
Domain/
├── index.md
├── common.md
├── enhancement.md
└── local.md
```

단, 모든 Domain에 Common / Enhancement / Local이 전부 존재하는 것은 아닙니다.

**실제 Framework에 해당 Class의 Control이 존재하는 경우에만 파일을 생성합니다.**

---

## 8.1 `index.md`

각 Security Domain의 **대표 페이지**입니다.

예:

```text
_pages/control-guide/01-governance/index.md
```

이 페이지에서는 해당 Domain에 어떤 Control Class가 존재하는지 보여주고, 각 Class 페이지로 이동할 수 있도록 링크를 제공합니다.

예:

```text
Governance
├── Common
└── Enhancement
```

---

## 8.2 `common.md`

해당 Security Domain의 **Common Control**을 작성하는 파일입니다.

```text
Control ID
Security Domain
Control Class
Control Objective
Control Statement
적용 조건
Control Owner
Stakeholders
매핑된 ISMS-P 항목
매핑된 CSF 항목
Implementation Guide
Evidence
```

---

## 8.3 `enhancement.md`

해당 Security Domain의 **Enhancement Control**을 작성하는 파일입니다.

Common Control과 다르게 아래의 두 항목이 추가로 들어갑니다. 

```text
ISMS-P Limitation
CSF Coverage
```

---

## 8.4 `local.md`

국내 법·제도 또는 ISMS-P 환경에서 별도로 고려해야 하는 **Local Control**을 작성하는 파일입니다.

모든 Domain에 Local Control이 존재하는 것은 아니며, Framework에 Local Control이 있는 Domain에만 이 파일이 존재합니다.

---

# 9. Markdown 파일의 Front Matter

Jekyll 페이지의 맨 위에는 다음과 같은 영역이 있습니다.

```yaml
---
layout: post
title: "Governance - Common Controls"
permalink: /controls/governance/common/
---
```

이 부분을 **Front Matter**라고 합니다.

각 값의 의미는 다음과 같습니다.

| 항목 | 의미 |
|---|---|
| `layout` | 어떤 Jekyll 화면 레이아웃을 사용할지 지정 |
| `title` | 페이지 제목 |
| `permalink` | 실제 웹사이트에서 사용할 URL |

### 매우 중요한 주의사항

파일이나 폴더 이름을 변경하더라도 `permalink`를 유지하면 웹 URL을 유지할 수 있습니다.

따라서 파일 이동이나 이름 변경 시에는 **Front Matter의 permalink를 임의로 변경하지 않는 것**을 권장합니다.

---

# 10. `05-self-assessment.md`

`05-self-assessment.md`는 향후 GapZer0 Guideline을 단순 문서가 아니라 **실제 자가진단 도구**로 확장하기 위한 페이지입니다.

현재는 기본 화면과 평가 기준만 만들어 둔 상태이며, 기능은 단계적으로 추가할 예정입니다.

## 10.1 05 Self Assessment 구조

현재 파일에는 다음 다섯 가지 평가 상태가 정의되어 있습니다.

| 평가 | 의미 |
|---|---|
| 충족 | 요구사항이 모두 충족되고 객관적인 근거를 확인할 수 있음 |
| 부분 충족 | 요구사항의 일부가 미흡하거나 적용 범위·절차 등이 불완전함 |
| 미충족 | 요구사항을 이행하지 않음 |
| 적용 제외 | 조직 환경상 해당 요구사항이 적용되지 않음 |
| 확인 필요 | 현재 확보된 자료만으로 판단하기 어려움 |

이 평가 상태는 조직의 보안 담당자가 저희가 만든 Assessment Question을 읽고, Question에 대한 조직의 이행 수준을 총 다섯 가지 척도로 평가하라고 만들었습니다. 

페이지 하단에는 다음 HTML 영역이 있습니다.

```html
<div id="assessment-app"></div>
```

이 영역은 향후 JavaScript가 Self Assessment 화면을 동적으로 생성할 위치입니다.

최종적으로는 다음 구조를 목표로 합니다.

```text
Security Domain 선택
        ↓
Control 선택
        ↓
Assessment Question 표시
        ↓
평가 상태 선택(5가지)
        ↓
평가 근거 작성
        ↓
Evidence 기록
        ↓
결과 저장 및 요약
```

## 10.2 향후 추가 계획

Self Assessment 기능 개발 시 다음 파일을 추가할 예정입니다.

```text
_data/
└── assessment.yml

assets/
└── js/
    └── assessment.js
```

### `_data/assessment.yml`

각 Security Domain, Control, Assessment Question을 구조화하여 저장할 데이터 파일입니다.

예상 구조:

```yaml
domains:
  - id: governance
    name: Governance
    controls:
      - id: GZ-GV-01
        name: Control Name
        questions:
          - id: AQ-01
            text: Assessment Question
```

즉 Markdown 본문에 평가 질문을 직접 하드코딩하는 것이 아니라, 평가 질문을 데이터 파일에서 관리하여 유지보수하기 쉽게 만드는 것을 목표로 합니다.

### `assets/js/assessment.js`

Self Assessment 페이지의 동작을 담당할 JavaScript 파일입니다.

향후 다음 기능을 구현하는 것을 목표로 합니다.

- Security Domain 선택
- Control 선택
- Assessment Question 자동 표시
- 충족 / 부분 충족 / 미충족 / 적용 제외 / 확인 필요 선택
- 평가 근거 입력
- Evidence 입력
- 브라우저 내 임시 저장
- 평가 결과 요약
- 결과 초기화
- 결과 Export

별도의 서버나 Backend를 두지 않는 범위에서는 브라우저의 `localStorage`를 이용하여 사용자의 평가 결과를 임시 저장하는 방식을 우선 고려합니다.

예상 동작 구조는 다음과 같습니다.

```text
assessment.yml
      ↓
assessment.js가 데이터 로드
      ↓
05-self-assessment.md의
#assessment-app 영역에 화면 생성
      ↓
사용자 평가 수행
      ↓
localStorage 등에 결과 저장
```

---

## 10.3 Self Assessment 최종 목표

Self Assessment의 최종 목표는 사용자가 GapZer0 Framework의 Control을 기준으로 조직의 현재 상태를 평가한 뒤, **평가 결과를 외부 파일로 Export할 수 있도록 하는 것**입니다.

우선적으로 고려하는 Export 형식은 다음과 같습니다.

### CSV Export

평가 결과를 다음과 같은 형태로 저장하는 기능을 목표로 합니다.

```text
Security Domain
Control ID
Control Name
Assessment Question
평가 결과
평가 근거
Evidence
```

CSV는 Excel 등에서 쉽게 열 수 있으므로, 실무자가 평가 결과를 추가 분석하거나 관리하기에 적합합니다.

### PDF Export

최종 단계에서는 평가 결과를 보고서 형태로 출력할 수 있도록 PDF Export 기능도 검토합니다.

예상 결과에는 다음 내용을 포함할 수 있습니다.

```text
조직 / 평가 정보
평가 일자
Security Domain별 평가 결과
Control별 평가 결과
평가 근거
Evidence
미충족 / 부분 충족 항목
개선 필요 항목
```

최종적으로 Self Assessment는 다음 흐름을 지원하는 것을 목표로 합니다.

```text
GapZer0 Control 확인
        ↓
Assessment Question 기반 평가
        ↓
평가 결과 및 Evidence 기록
        ↓
결과 요약
        ↓
CSV / PDF Export
        ↓
개선 활동에 활용
```

---

# 11. 페이지 링크 작성 시 `relative_url` 사용

현재 GitHub Pages 사이트는 Repository 이름이 URL에 포함되는 Project Page 구조입니다.

따라서 Markdown에서 내부 링크를 작성할 때는 다음 형식을 권장합니다.

```liquid
[Governance]({{ '/controls/governance/' | relative_url }})
```

이렇게 하면 Jekyll이 자동으로 `baseurl`을 붙여 줍니다.

단순히

```markdown
[Governance](/controls/governance/)
```

처럼 작성하면 GitHub Pages 환경에 따라 잘못된 주소로 이동할 수 있으므로 주의합니다.

---

# 12. 팀원 콘텐츠 작성 방법

Control 내용을 작성하는 팀원은 대부분 다음 파일만 수정하면 됩니다.

```text
_pages/control-guide/[Domain]/common.md
_pages/control-guide/[Domain]/enhancement.md
_pages/control-guide/[Domain]/local.md
```

각 파일 안에는 기본 작성 틀이 마련되어 있으므로 `내용 작성 예정` 부분을 실제 Framework 내용으로 교체하면 됩니다.

예:

```markdown
## [Control Name]

### Control ID

GZ-GV-01

### Security Domain

Governance

### Control Class

Common

### Control Objective

실제 Control Objective 작성

### Control Statement

실제 Control Statement 작성

...
```

하나의 Class에 여러 Control이 있는 경우 같은 구조를 반복하여 작성합니다.

---

# 13. 일반 작업 시 수정하지 않아도 되는 파일

가이드라인 본문을 작성하는 팀원은 일반적으로 아래 파일을 수정할 필요가 없습니다.

```text
_config.yml
_includes/toc-date.html
_data/navigation.yml
```

각 파일은 사이트 전체 설정 또는 Navigation 구조를 담당하므로, 변경이 필요할 경우 팀 내부에서 먼저 합의하는 것을 권장합니다.

반대로 실제 Control 내용을 작성할 때는 주로 다음 위치만 수정합니다.

```text
_pages/control-guide/
```

---

# 14. 변경 후 확인 방법

GitHub에서 파일을 수정하고 Commit하면 GitHub Pages가 사이트를 다시 Build합니다.

변경사항이 바로 보이지 않을 경우 다음을 확인합니다.

1. GitHub Repository의 **Actions** 탭에서 Pages Build가 성공했는지 확인
2. Build가 완료된 뒤 사이트 새로고침
3. 필요한 경우 브라우저에서 `Ctrl + F5` 또는 `Ctrl + Shift + R`로 강제 새로고침

Jekyll Front Matter나 Liquid 문법에 오류가 있으면 Build가 실패할 수 있으므로 Actions 로그를 확인합니다.

---

# 15. 프로젝트의 기본 관리 원칙

"가이드라인 작성" 프로젝트는 혼자서 하는 것이 아니라 3명의 팀원이 힘을 합쳐서 만드는 것이기 때문에, 작업 전 기본적인 공통 수칙을 만들어 두는 것이 필요합니다.
다음은 기본적인 관리 원칙 예시입니다.
**이 부분은 팀 내 합의 후에 정하는 걸로 하겠습니다**

- 하나의 Control 수정은 가능한 한 해당 Domain / Class 파일 안에서 수행
- 사이트 전체 설정 파일은 불필요하게 수정하지 않기
- `permalink`는 특별한 이유가 없으면 변경하지 않기
- Control 구조와 용어가 변경되면 관련 설명 페이지도 함께 확인하기
- Assessment Question은 향후 `assessment.yml`에서 데이터 형태로 관리하기
- 중요한 변경은 Commit 메시지에 변경 목적을 명확히 작성하기

이 구조를 유지하면 Framework 내용과 웹 가이드라인을 분리하면서도 GitHub를 통해 변경 이력과 유지보수를 관리할 수 있습니다.
