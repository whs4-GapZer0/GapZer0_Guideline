---
layout: post
title: "자가진단 작성"
permalink: /self-assessment/form/
---

[작성 방법 및 평가 기준 보기]({{ '/self-assessment/' | relative_url }})

평가 기본정보를 입력하고 Control별 질문에 따라 충족 여부, 근거, 확인한 증적과 개선조치를 작성하세요. 작성 내용은 이 브라우저에 자동 저장됩니다. 필요한 내용은 CSV로 내려받아 보관하세요.

<link rel="stylesheet" href="{{ '/assets/assessment/app.css' | relative_url }}">
<div id="assessment-app" data-questions="{{ '/assets/assessment/questions.json' | relative_url }}">자가 진단 질문을 불러오는 중입니다.</div>
<noscript>자가 진단 입력 화면을 사용하려면 JavaScript를 허용해야 합니다. 작성 방법 및 평가 기준은 안내 페이지에서 확인할 수 있습니다.</noscript>
<script type="module" src="{{ '/assets/assessment/app.mjs' | relative_url }}"></script>
