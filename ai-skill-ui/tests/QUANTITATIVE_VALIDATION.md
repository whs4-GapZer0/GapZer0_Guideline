# Quantitative Showcase — local validation

## Scope

UI-only implementation and local Chromium tests. No new Codex/Claude Runtime execution, no new search evaluation, no latest Guideline sync, no commit/push/deploy. All dashboard metrics are selected-test results, not general AI accuracy, overall Control fulfillment or a global hallucination rate.

Existing uncommitted `skill/scripts/test-control-search.mjs` is preserved byte-for-byte against the task-start snapshot. Current search implementation was read only for algorithm traceability.

## Executive metrics

| Metric | Numerator / denominator | Display rate | Source |
|---|---:|---:|---|
| Codex Runtime | 13/13 | 100% | `skill/tests/runtime-test-results.md` |
| Core Functions | 3/3 | 100% | `skill/tests/runtime-test-results.md` |
| Regression Scenarios | 10/10 | 100% | `skill/tests/runtime-test-results.md` |
| Search Top-3 Case | 7/8 | 87.5% | `skill/tests/AI_SKILL_QUANTITATIVE_EVALUATION.md` |
| Search Top-5 Case | 8/8 | 100% | `skill/tests/AI_SKILL_QUANTITATIVE_EVALUATION.md` |
| Expected-Control Top-3 Hit | 10/11 | 90.9% | `skill/tests/AI_SKILL_QUANTITATIVE_EVALUATION.md` |
| Expected-Control Top-5 Hit | 11/11 | 100% | `skill/tests/AI_SKILL_QUANTITATIVE_EVALUATION.md` |
| Claude Runtime | 3/3 | 100% | `claude-skill/tests/CLAUDE_PORT_VALIDATION.md` |
| Cross-runtime Representative Agreement | 3/3 | 100% | `claude-skill/tests/CLAUDE_PORT_VALIDATION.md` |
| UI Tests | 10/10 | 100% | `ai-skill-ui/tests/ui-test-results.json` |
| UX Tests | 12/12 | 100% | `ai-skill-ui/tests/ux-test-results.json` |
| Readability Tests | 13/13 | 100% | `ai-skill-ui/tests/readability-test-results.json` |
| Showcase Tests | 30/30 | 100% | `ai-skill-ui/tests/showcase-test-results.json` |

Ratios and scope come from source reports / test-result JSON. The builder asserts source excerpts and SHA-256; VAL31 compares all source hashes, report excerpts, n/d and rendered calculated percentages. Source links are pinned to the recorded baseline commit. New UI changes remain local and are not presented as publicly deployed.

## Quantitative / interaction checks

- Five SVG donuts: Codex, Top-5 Case, Top-5 Expected-Control hit, Claude, Showcase. Centers contain percentage only; denominator, scope and accessible labels are separate.
- Four comparison bars: Top-3 / Top-5 case and hit. 7/8 = 87.5%; 10/11 = 90.9%.
- HRS-C-01: initial rank 6 → rank 4, score 29.6031; absent Top-3, present Top-5. Five general algorithm improvements are sourced to the quantitative report / read-only implementation.
- Thirteen-row matrix; T01–T10 expected behavior/result/checkpoint explorer; T05 and T06 observations 0/1 each. These two are single negative-scenario observations, not general rates.
- Codex / Claude three representative functional comparisons, not identical input paired tests or identical generated text.
- Source→separate Codex/Claude validation→static Web Demo diagram; five methodology rows; explicit production and runtime limitations.
- Dataset charts computed at runtime, chart→Domain/Class filter, total vs filtered counts.
- Demo Control ID→exact Explorer detail; safe CTA only for existing Demo containing that Control; unsupported combinations disabled.
- Full original fields preserved; Evidence chips are examples, not secured evidence; Control→Objective→Statement→Evidence→Source chain and actual repository paths.

## Dataset snapshot

Total Controls: 121; Domains: 15.

| Class | Count |
|---|---:|
| Common | 76 |
| Enhancement | 30 |
| Local | 15 |

| Domain | Count |
|---|---:|
| Application Security | 1 |
| Asset Management | 9 |
| Continuity | 11 |
| Governance | 17 |
| Human Resource Security | 3 |
| Identity and Access Management | 6 |
| Information Protection | 6 |
| Information Security Assurance | 5 |
| Information Security Event Management | 22 |
| Legal and Compliance | 10 |
| Physical Security | 4 |
| Secure Configuration | 2 |
| Supplier Relationships Security | 14 |
| System and Network Security | 1 |
| Threat and Vulnerability Management | 10 |

## Actual local execution

Python 3.12, Node 22, installed Playwright with `/usr/bin/chromium`, headless Chromium. Server: `python -m http.server 8944 --bind 127.0.0.1` (repository root).

Each browser suite was run with:

```bash
UI_URL=http://127.0.0.1:8944/ai-skill-ui/ UX_BASELINE=/tmp/quantitative-before.json node ai-skill-ui/tests/ui-tests.cjs
UI_URL=http://127.0.0.1:8944/ai-skill-ui/ UX_BASELINE=/tmp/quantitative-before.json node ai-skill-ui/tests/ux-tests.cjs
UI_URL=http://127.0.0.1:8944/ai-skill-ui/ UX_BASELINE=/tmp/quantitative-before.json node ai-skill-ui/tests/readability-tests.cjs
UI_URL=http://127.0.0.1:8944/ai-skill-ui/ UX_BASELINE=/tmp/quantitative-before.json node ai-skill-ui/tests/showcase-tests.cjs
python ai-skill-ui/build-quantitative.py
UI_URL=http://127.0.0.1:8944/ai-skill-ui/ UX_BASELINE=/tmp/quantitative-before.json node ai-skill-ui/tests/quantitative-tests.cjs
```

| Suite | PASS / total | FAIL | Exit |
|---|---:|---:|---:|
| ui | 10/10 | 0 | 0 |
| ux | 12/12 | 0 | 0 |
| readability | 13/13 | 0 | 0 |
| showcase | 30/30 | 0 | 0 |
| quantitative | 32/32 | 0 | 0 |

These 97/97 browser checks cover UI test behavior only. Historical Runtime metrics were not rerun.

## VAL01–VAL32

| ID | Check | Result |
|---|---|---|
| VAL01 | Executive summary 13 actual metrics | PASS |
| VAL02 | Donut rendering and accessible labels | PASS |
| VAL03 | Donut denominators and scope | PASS |
| VAL04 | Top3 Top5 comparison and HRS case | PASS |
| VAL05 | 87.5 calculation | PASS |
| VAL06 | 90.9 calculation | PASS |
| VAL07 | Validation Matrix 13 sourced rows | PASS |
| VAL08 | Test Explorer T01-T10 details | PASS |
| VAL09 | T05 safety single observation | PASS |
| VAL10 | T06 safety single observation | PASS |
| VAL11 | Cross-runtime representative functional comparison | PASS |
| VAL12 | Runtime diagram source Codex Claude static Demo | PASS |
| VAL13 | Control total runtime calculation | PASS |
| VAL14 | Domain count runtime calculation | PASS |
| VAL15 | Domain distribution counts sum and values | PASS |
| VAL16 | Classification distribution counts | PASS |
| VAL17 | Search result count updates | PASS |
| VAL18 | Distribution click filters domain and class | PASS |
| VAL19 | Demo Control to Explorer and safe CTA | PASS |
| VAL20 | Evidence explanation does not claim secured evidence | PASS |
| VAL21 | Source evidence trace links actual paths | PASS |
| VAL22 | Methodology actual five methods | PASS |
| VAL23 | Limitations scope and offline distinctions | PASS |
| VAL24 | Artifact map all actual repository paths | PASS |
| VAL25 | Desktop and mobile chart screenshots no overflow | PASS |
| VAL26 | Accessibility keyboard links details filter and charts | PASS |
| VAL27 | showcase existing regression 30/30 | PASS |
| VAL28 | ui existing regression 10/10 | PASS |
| VAL29 | ux existing regression 12/12 | PASS |
| VAL30 | readability existing regression 13/13 | PASS |
| VAL31 | No invented metrics: provenance and all calculations | PASS |
| VAL32 | Outside ai-skill-ui changes zero; demo adapter unchanged | PASS |

## Screenshots

- [Main desktop](quantitative-main-desktop.png)
- [Validation desktop](quantitative-dashboard-desktop.png)
- [Explorer desktop](quantitative-explorer-desktop.png)
- [Validation mobile](quantitative-mobile.png)
- [Charts mobile](quantitative-charts-mobile.png)

Desktop 1440×1080; mobile 390×844. Screenshots are actual local browser captures. VAL25 asserts no horizontal viewport overflow; VAL26 tests keyboard Enter for distribution buttons and details, plus SVG labels. They do not establish full WCAG compliance or measured user comprehension time.

## Protected files and limitations

Task-start SHA snapshot compares every file outside `ai-skill-ui/`, including existing uncommitted search changes. Demo JSON and Runtime adapter are unchanged. Existing Guideline, Control source/index, Codex/Claude Skill, workflow, main/site and external reports remain unchanged.

Production S3/API/UI, latest source synchronization, arbitrary web LLM questions, and full 121-Control correctness are outside this stage. No invented confidence or safety percentage is emitted.

Commit: not performed. Push: not performed. Deployment: not performed. Current HEAD remains `60f78e8f8d0be0c037b78c4262f0b14e93c64cb8`.
