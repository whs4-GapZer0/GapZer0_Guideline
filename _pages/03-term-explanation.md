---
layout: post
title: "03. 주요 용어"
permalink: /terms/
---

GapZer0 가이드라인과 Control Guide에서 사용하는 주요 용어를 설명합니다. 각 용어는 Framework와 가이드라인을 동일한 기준으로 이해하고 적용하기 위한 공통 기준입니다.

## Security Domain

GapZer0 Framework에서 유사한 보안 목적과 활동을 묶어 분류하기 위한 보안 영역입니다. 각 Control은 해당 보안 활동의 성격에 따라 Security Domain에 배치됩니다.

## Control

조직이 특정 보안 목적을 달성하기 위해 수행해야 하는 관리적·기술적·물리적 활동입니다. GapZer0 가이드라인에서는 각 Control별로 목적, 요구사항, 적용 조건, 책임 주체, 구현 방법 및 확인 가능한 Evidence를 제공합니다.

## Control Class

GapZer0 Control을 **ISMS-P와 NIST CSF 2.0 사이에서 수행하는 역할**에 따라 구분한 분류입니다. Control Class는 **Common, Enhancement, Local**로 구성되며, 조직의 이행 수준이나 중요도를 나타내는 등급이 아닙니다.

### Common

**ISMS-P 요구사항과 NIST CSF 2.0의 보안 결과가 충분히 중첩되는 영역**을 정규화한 Control입니다. 두 기준에서 공통적으로 요구하는 보안 목적·활동·범위를 GapZer0의 하나의 Control로 표현합니다.

> 여기서 Common은 NIST SP 800-53에서 사용하는 ‘common control’과는 다른 의미이며, GapZer0 Framework의 Control Class를 의미합니다.

### Enhancement

**ISMS-P에 관련 요구사항이 존재하지만 NIST CSF 2.0의 해당 Outcome을 완전히 충족하기 위해 추가 보완이 필요한 영역**을 구체화한 Control입니다. 기존 ISMS-P 요구사항을 대체하는 것이 아니라, 매핑 과정에서 확인된 잔여 Gap을 보완하는 역할을 합니다.

Enhancement Control에는 보완이 필요한 기존 ISMS-P의 잔여 한계를 설명하는 **ISMS-P Limitation**과, 해당 Control을 통해 보완되는 CSF 결과를 설명하는 **CSF Coverage**가 함께 제시됩니다.

### Local

**NIST CSF 2.0에 직접 대응되는 Subcategory는 없지만 국내 ISMS-P 인증을 위해 유지해야 하는 요구사항**을 반영한 Control입니다. 따라서 Local Control의 매핑된 CSF 항목은 **N/A**로 표시되며, 국내 인증 및 개인정보보호 환경에서 필요한 요구사항을 보존합니다.

## Control Objective

해당 Control을 통해 조직이 달성하려는 **보안·프라이버시 목적과 기대 결과**를 설명합니다. 구체적인 수행 절차보다는 Control이 궁극적으로 달성해야 하는 결과를 이해하는 데 사용합니다.

## Control Statement

조직이 해당 Control을 충족하기 위해 **의무적으로 수행해야 하는 정책·절차·기술적 조치와 핵심 요구사항**을 설명합니다. Control Objective가 달성하려는 결과를 나타낸다면, Control Statement는 그 결과를 달성하기 위해 조직이 무엇을 수행해야 하는지를 제시합니다.

## 적용 조건

해당 Control이 현재 조직에 적용되는지를 판단하기 위한 조건입니다. **NIST Organizational Profile의 Scope 원칙과 법적·업무·기술적 조건**을 고려하여 적용 범위를 판단하며, 법적 의무가 있는 Control은 해당 법령의 적용 여부를 우선 확인합니다. 비적용하는 경우에는 그 근거를 확인할 수 있도록 관리합니다.

## Control Owner

해당 Control의 **설계·이행·유지·점검에 최종 책임을 지는 역할**입니다. 실제 조직에서는 가이드라인에 제시된 역할을 참고하여 조직 구조와 업무 분장에 맞는 책임자를 지정합니다.

## Stakeholders

해당 Control을 수행하는 데 필요한 **협업 역할**입니다. Control Owner와 함께 정보 제공, 실행, 검토, 협의 등 Control 운영에 필요한 활동에 참여합니다.

## Implementation Guide

Control을 실제 조직 환경에서 구현하기 위한 **구체적인 이행 방법**을 설명합니다. ISMS-P 인증기준·주요 확인사항, Gap 보완 방향 및 NIST의 구현·모니터링 원칙을 바탕으로 조직이 수행할 핵심 활동과 실행 방향을 제시합니다.

## Assessment Question

Control의 이행 여부와 목표 달성 여부를 Self-Assessment에서 검증하기 위한 질문입니다. ISMS-P의 주요 확인사항과 CSF Outcome 달성 여부를 확인할 수 있도록 구성하며, 관련 Evidence와 함께 현재 이행 상태를 판단하는 데 활용합니다.

## Evidence

Control의 이행 여부를 객관적으로 입증하기 위한 **설계·설정·승인·운영·점검·개선 관련 자료**를 의미합니다. 정책, 절차, 승인 기록, 설정정보, 로그, 점검 결과, 보고서 등이 포함될 수 있으며, 가이드라인의 Evidence는 실제 이행 사실을 어떤 자료로 확인할 수 있는지 판단하는 기준으로 활용합니다.

## 평가 상태

Self-Assessment 결과를 표현하는 상태입니다.

- **충족**: 요구되는 활동이 이행되고 필요한 Evidence를 통해 확인할 수 있는 상태
- **부분 충족**: 일부 활동은 수행되고 있으나 대상, 절차, 기준 또는 운영 측면에서 보완이 필요한 상태
- **미충족**: 요구되는 활동이 구현 또는 운영되지 않은 상태
- **확인 필요**: 판단에 필요한 정보나 Evidence가 충분하지 않아 추가 확인이 필요한 상태
- **적용 제외**: 조직의 적용 범위나 업무 특성상 해당 Control이 적용되지 않으며 그 사유를 확인한 상태

## ISMS-P Limitation

**Enhancement Control에만 적용되는 항목**으로, 매핑 과정에서 확인된 **기존 ISMS-P 요구사항의 잔여 한계**를 설명합니다. 이를 통해 해당 ISMS-P 요구사항만으로는 CSF Outcome을 완전히 충족하기 어려운 부분과 추가 보완이 필요한 지점을 확인할 수 있습니다.

## CSF Coverage

**Enhancement Control에만 적용되는 항목**으로, 해당 보완 Control을 이행했을 때 **충족·보완되는 NIST CSF 2.0 Outcome**을 설명합니다. ISMS-P Limitation과 함께 확인하여 기존 요구사항의 잔여 Gap과 이를 보완하는 CSF 결과의 관계를 이해하는 데 활용합니다.
