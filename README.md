# GapZer0 Guideline

NIST CSF 2.0과 ISMS-P를 기반으로 만든 GapZer0 Framework의 실무 이행 가이드라인입니다. **15개 보안 영역의 121개 Control**에 대한 이행 방법과 Evidence, 자가진단 기능을 제공합니다.

[가이드라인 사이트](https://docs.whs4-gapzer0.kro.kr/)

## 문서 구성

| 페이지 | 파일 | 내용 |
|---|---|---|
| 홈페이지 | `index.md` | 프로젝트 소개와 관련 자료 |
| 01. GapZer0 가이드라인 소개 | `_pages/01-introduction.md` | 제작 배경·목적, 프레임워크 구성과 사용 대상 |
| 02. 가이드라인 활용 방법 | `_pages/02-how-to-use.md` | 활용 순서와 자가진단 작성 예시 |
| 03. 주요 용어 | `_pages/03-term-explanation.md` | 프레임워크·이행 안내·자가진단 용어 설명 |
| 04. Control 이행 안내 | `_pages/04-control-guide.md` | 보안 영역별 Control 안내 |
| 05. 자가 진단 | `_pages/05-self-assessment.md` | 평가 기준, 기록 방법과 Excel 사용 안내 |
| 자가진단 작성 | `_pages/self-assessment/form.md` | Control별 평가 결과·근거·증적·개선계획 입력 |

## Control 문서

`_pages/control-guide/` 아래에 보안 영역별 폴더가 있으며 Control Class별 파일에서 해당 영역의 Control을 관리합니다.

```text
_pages/control-guide/
└── 01-governance/           # 보안 영역별 폴더 예시
    ├── index.md            # 영역 소개
    ├── common.md           # Common Control
    └── enhancement.md      # Enhancement Control
```

Local Control이 있는 영역에는 `local.md`가 추가됩니다. 각 Class 파일에는 여러 Control이 포함되며 Control ID별로 목적·요구사항·적용 조건·책임자·Stakeholders·기준 매핑·Implementation Guide·Evidence를 작성합니다.

## 주요 설정·기능 파일

| 경로 | 역할 |
|---|---|
| `_config.yml` | 사이트 주소, Jekyll과 테마 설정 |
| `_data/navigation.yml` | 왼쪽 목차 구성 |
| `_includes/` | 목차·공통 스크립트 등 테마 구성 일부 재정의 |
| `assets/gitbook/custom-local.css`, `custom-local.js` | 공통 디자인과 화면 동작 |
| `assets/images/`, `assets/fonts/` | 그림과 글꼴 |
| `assets/assessment/controls.json` | 자가진단에 사용하는 Control 데이터 |
| `assets/assessment/app.mjs`, `app.css` | 자가진단 화면과 브라우저 저장 |
| `assets/assessment/transfer.mjs` | 평가 데이터 구조와 입력 검증 |
| `assets/assessment/excel.mjs`, `excel-import.mjs` | Excel 생성과 불러오기 |
| `assets/assessment/control-template.xlsx` | 안내 페이지에서 다운로드하는 빈 Excel 템플릿 |
| `assets/assessment/legacy/` | 이전 질문별 평가 기록의 백업 지원 |
| `tests/` | 데이터·Excel·브라우저 동작 검증 |
| `.github/workflows/` | 빌드 검증과 자동 배포 |

자가진단은 121개 Control을 **충족·부분 충족·미충족·적용 제외**로 평가합니다. 작성 내용은 브라우저에 저장하며 Excel로 다운로드하거나 다시 불러올 수 있습니다. 작성 내용과 불러온 Excel 파일은 서버로 전송하지 않습니다.

## 수정과 배포

문서 수정은 해당 `_pages/` 파일에서 진행합니다. Control ID·이름 등 자가진단 기준을 변경하면 `controls.json`과 빈 Excel 템플릿도 함께 확인합니다.

사이트는 **Jekyll + jekyll-gitbook**으로 빌드합니다. `main` 반영 시 GitHub Actions의 `Publish site for Oracle VM`이 결과물을 `site` 브랜치에 게시하고 Oracle 서버가 5분 주기로 가져와 공개 사이트를 갱신합니다. `site` 브랜치의 생성 파일을 직접 수정하지 않고 원본 문서를 수정합니다.
