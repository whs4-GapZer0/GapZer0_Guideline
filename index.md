---
layout: home
title: "GapZer0 가이드라인"
permalink: /
---

<style>
  /* home 레이아웃이 자동으로 출력하는 제목은 아래 표지 제목으로 대체합니다. */
  .book .book-body .page-wrapper .page-inner section.normal > h1:first-of-type {
    display: none;
  }

  .gz-home {
    --gz-paper: #f7f6f2;
    --gz-ink: #242925;
    --gz-muted: #68716b;
    --gz-line: #d8ddd9;
    --gz-accent: #527565;
    --gz-accent-dark: #365547;
    max-width: 1080px;
    margin: 0 auto;
    color: var(--gz-ink);
  }

  .gz-home * {
    box-sizing: border-box;
  }

  .gz-cover {
    padding: clamp(3rem, 8vw, 6.5rem) clamp(1.5rem, 6vw, 4.75rem);
    border-top: 5px solid var(--gz-accent);
    border-bottom: 1px solid var(--gz-line);
    background: var(--gz-paper);
  }

  .gz-eyebrow {
    margin: 0 0 1.6rem;
    color: var(--gz-accent-dark);
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }

  .gz-cover h1 {
    max-width: 760px;
    margin: 0;
    color: var(--gz-ink) !important;
    font-size: clamp(2.7rem, 7vw, 5.3rem);
    font-weight: 500;
    line-height: 1.02;
    letter-spacing: -0.055em;
  }

  .gz-cover-subtitle {
    max-width: 780px;
    margin: 1.35rem 0 0;
    color: var(--gz-accent-dark);
    font-size: clamp(1.15rem, 2.5vw, 1.55rem);
    font-weight: 500;
    line-height: 1.45;
  }

  .gz-lead {
    max-width: 730px;
    margin: 1.8rem 0 0;
    color: #4f5852;
    font-size: 1rem;
    line-height: 1.75;
  }

  .gz-lead + .gz-lead {
    margin-top: 0.9rem;
  }

  .gz-guide-role {
    max-width: 760px;
    margin: 1.5rem 0 0;
    padding-left: 1rem;
    border-left: 3px solid var(--gz-accent);
    color: var(--gz-ink);
    font-size: 0.98rem;
    font-weight: 500;
    line-height: 1.7;
  }

  .gz-facts {
    margin: 2rem 0 0;
    color: var(--gz-muted);
    font-size: 0.9rem;
  }

  .gz-facts span {
    margin: 0 0.55rem;
    color: #a8afa9;
  }

  .gz-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem 1.7rem;
    margin-top: 2.2rem;
  }

  .gz-links a {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding-bottom: 0.28rem;
    border-bottom: 1px solid currentColor;
    color: var(--gz-accent-dark) !important;
    font-weight: 500;
    text-decoration: none !important;
  }

  .gz-links a:hover {
    color: var(--gz-accent) !important;
  }

  .gz-section {
    padding: clamp(2.6rem, 6vw, 4.5rem) clamp(0.2rem, 3vw, 2rem) 0;
  }

  .gz-section-head {
    margin-bottom: 1.7rem;
  }

  .gz-section-label {
    margin: 0 0 0.7rem;
    color: var(--gz-accent-dark);
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.11em;
    text-transform: uppercase;
  }

  .gz-section-title {
    margin: 0;
    color: var(--gz-ink) !important;
    font-size: clamp(1.45rem, 3vw, 2rem);
    font-weight: 500;
    line-height: 1.35;
  }

  .gz-flow {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr) auto) minmax(0, 1fr);
    align-items: center;
    gap: 0.75rem;
  }

  .gz-flow span {
    display: flex;
    min-height: 72px;
    align-items: center;
    justify-content: center;
    padding: 0.8rem 0.65rem;
    border: 1px solid var(--gz-line);
    border-radius: 4px;
    background: #fafaf7;
    color: var(--gz-ink);
    font-size: 0.92rem;
    font-weight: 500;
    text-align: center;
  }

  .gz-flow i {
    color: #9da59f;
    font-style: normal;
  }

  .gz-menu {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border-top: 1px solid var(--gz-line);
  }

  .gz-menu-item {
    display: flex;
    min-height: 132px;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.45rem 1rem 1.45rem 0;
    border-bottom: 1px solid var(--gz-line);
    color: var(--gz-ink) !important;
    text-decoration: none !important;
  }

  .gz-menu-item:nth-child(odd) {
    padding-right: 2rem;
    border-right: 1px solid var(--gz-line);
  }

  .gz-menu-item:nth-child(even) {
    padding-left: 2rem;
  }

  .gz-menu-item h3 {
    margin: 0 0 0.55rem;
    color: var(--gz-ink) !important;
    font-size: 1.05rem;
    font-weight: 500;
  }

  .gz-menu-item p {
    margin: 0;
    color: var(--gz-muted);
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .gz-menu-arrow {
    flex: 0 0 auto;
    color: var(--gz-accent);
    font-size: 1.05rem;
    transition: transform 0.15s ease;
  }

  .gz-menu-item:hover .gz-menu-arrow {
    transform: translateX(3px);
  }

  .gz-menu-item:focus-visible,
  .gz-links a:focus-visible {
    outline: 2px solid var(--gz-accent);
    outline-offset: 4px;
  }

  .gz-note {
    margin: 2.4rem 0 0;
    padding: 1rem 0;
    border-top: 1px solid var(--gz-line);
    color: var(--gz-muted);
    font-size: 0.88rem;
    line-height: 1.65;
  }

  @media (max-width: 720px) {
    .gz-flow {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
    }

    .gz-flow span {
      width: 100%;
      min-height: 58px;
    }

    .gz-flow i {
      display: none;
    }

    .gz-menu {
      grid-template-columns: 1fr;
    }

    .gz-menu-item:nth-child(odd),
    .gz-menu-item:nth-child(even) {
      min-height: 0;
      padding: 1.25rem 0;
      border-right: 0;
    }
  }
</style>

<div class="gz-home gz-home-v2">
<header class="gz-home-header"><a href="/" class="gz-home-brand" aria-label="GapZer0 가이드라인 홈"><span class="gz-wordmark">GapZer0</span><span class="gz-brand-label">Guideline</span></a><nav aria-label="프로젝트 저장소"><a href="https://github.com/whs4-GapZer0/GapZer0_Guideline" target="_blank" rel="noopener noreferrer" aria-label="GitHub 레포지토리 (새 탭)" title="GitHub 레포지토리"><i class="fa fa-github" aria-hidden="true"></i><span>GitHub</span></a></nav></header>
<section class="gz-home-hero gz-static-hero" aria-labelledby="gz-title"><p class="gz-home-team">Team GapZer0</p><h1 id="gz-title">GAP을 찾고, GAP을 메운다</h1><p class="gz-project-title"><strong>NIST CSF 2.0을 기반으로 국내 정보보호 컴플라이언스 프레임워크 만들기</strong></p><p class="gz-project-credit">화이트햇스쿨 4기 · 2차 팀 프로젝트</p></section>
<section class="gz-home-why" aria-labelledby="why-title"><h2 id="why-title">Why GapZer0?</h2><div class="gz-why-columns"><article><h3>인증 이후에도 점검은 필요합니다</h3><p>인증을 보유한 조직에서도 보안사고와 운영 결함이 발생합니다. Control이 실제로 이행되고 보안 목적을 달성하는지 지속적으로 확인해야 합니다.</p></article><article><h3>국내 기준과 국제 목표를 연결합니다</h3><p>NIST CSF 2.0과 ISMS-P를 매핑하고 개인정보 보호법을 검토했습니다. 공통 요구사항과 보완할 사항을 하나의 Control 체계로 정리했습니다.</p></article><article><h3>이행 방법과 확인 자료를 제시합니다</h3><p>Control별 Implementation Guide와 Evidence를 통해 수행할 활동과 확인할 자료를 안내합니다. 현재 상태를 점검하고 개선계획을 세울 수 있습니다.</p></article></div></section>
<section class="gz-home-solutions" aria-labelledby="solutions-title"><h2 id="solutions-title">가이드라인으로 이행부터 개선까지</h2>
<article class="gz-solution"><img src="/assets/images/home-mapping.svg" alt="NIST CSF와 ISMS-P의 요구사항을 연결하고 Gap을 구분한 그림" width="640" height="400" loading="lazy"/><div><h3>프레임워크의 구성과 적용 목적을 이해합니다</h3><p>두 체계의 요구사항을 통합한 GapZer0 Framework의 목적, Control 구성과 활용 대상을 확인합니다.</p><a href="/introduction/">가이드라인 소개 보기</a></div></article>
<article class="gz-solution"><img src="/assets/images/home-guide.svg" alt="Control 정보와 이행 방법, Evidence가 정리된 문서 그림" width="640" height="400" loading="lazy"/><div><h3>Control별 이행 방법과 Evidence를 확인합니다</h3><p>조직에 필요한 Control을 선택하고, Control 목표와 적용 조건, 책임자, Implementation Guide와 Evidence를 함께 살펴봅니다.</p><a href="/controls/">Control 이행 안내 보기</a></div></article>
<article class="gz-solution"><img src="/assets/images/home-assessment.svg" alt="Control의 이행 상태와 확인한 증적, 개선계획을 기록하는 자가진단 그림" width="640" height="400" loading="lazy"/><div><h3>현재 상태를 평가하고 개선계획을 세웁니다</h3><p>Control의 이행 상태를 점검하고 평가 근거, 확인한 증적과 개선조치를 기록합니다. 작성 내용은 브라우저에 저장하고 Excel 파일로 보관할 수 있습니다.</p><a href="/self-assessment/">자가진단 활용 안내 보기</a></div></article></section>
<section class="gz-home-related" aria-labelledby="related-title"><h2 id="related-title">Related Link</h2><p>프레임워크·인증기준의 공식 자료를 확인할 수 있습니다.</p><div><a href="https://www.nist.gov/cyberframework">NIST Cybersecurity Framework <span>CSF 2.0 공식 자료</span></a><a href="https://isms.kisa.or.kr/main/">KISA ISMS-P <span>인증제도와 인증기준 안내</span></a></div></section>
</div>
