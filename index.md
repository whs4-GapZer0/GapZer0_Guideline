---
layout: home
title: GapZer0 Guideline
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

  .gz-lead {
    max-width: 730px;
    margin: 1.7rem 0 0;
    color: #4f5852;
    font-size: clamp(1rem, 2vw, 1.2rem);
    line-height: 1.8;
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

<div class="gz-home">
  <section class="gz-cover" aria-labelledby="gz-title">
    <p class="gz-eyebrow">NIST CSF 2.0 × ISMS-P</p>
    <h1 id="gz-title">GapZer0 Guideline</h1>
    <p class="gz-lead">
      국내 조직이 정보보호·개인정보보호 통제를 이해하고 실제 업무에 적용할 수 있도록,
      통제 선택부터 이행과 평가, 개선까지의 기준을 안내합니다.
    </p>
    <p class="gz-facts">15 Security Domains <span>·</span> 121 Controls <span>·</span> Common · Enhancement · Local</p>
    <div class="gz-links">
      <a href="{{ '/introduction/' | relative_url }}">가이드라인 소개 보기 <span aria-hidden="true">→</span></a>
      <a href="{{ '/controls/' | relative_url }}">Control Guide 바로가기 <span aria-hidden="true">→</span></a>
    </div>
  </section>

  <section class="gz-section" aria-labelledby="gz-flow-title">
    <div class="gz-section-head">
      <p class="gz-section-label">How to use</p>
      <h2 class="gz-section-title" id="gz-flow-title">통제 선택부터 개선까지 한 흐름으로 확인합니다.</h2>
    </div>
    <div class="gz-flow" aria-label="가이드라인 활용 흐름">
      <span>Control 선택</span><i aria-hidden="true">→</i>
      <span>이행 방법 확인</span><i aria-hidden="true">→</i>
      <span>Evidence 확인</span><i aria-hidden="true">→</i>
      <span>현재 상태 평가</span><i aria-hidden="true">→</i>
      <span>미흡사항 개선</span>
    </div>
  </section>

  <section class="gz-section" aria-labelledby="gz-menu-title">
    <div class="gz-section-head">
      <p class="gz-section-label">Quick menu</p>
      <h2 class="gz-section-title" id="gz-menu-title">원하는 내용부터 바로 확인하세요.</h2>
    </div>

    <nav class="gz-menu" aria-label="GapZer0 Guideline 주요 메뉴">
      <a class="gz-menu-item" href="{{ '/introduction/' | relative_url }}">
        <span><h3>가이드라인 소개</h3><p>GapZer0 Framework의 정의, 목적, 사용 대상과 전체 구성을 확인합니다.</p></span>
        <span class="gz-menu-arrow" aria-hidden="true">→</span>
      </a>
      <a class="gz-menu-item" href="{{ '/how-to-use/' | relative_url }}">
        <span><h3>가이드라인 활용 방법</h3><p>Control 선택부터 이행, 평가, 개선과 재평가까지의 절차를 확인합니다.</p></span>
        <span class="gz-menu-arrow" aria-hidden="true">→</span>
      </a>
      <a class="gz-menu-item" href="{{ '/terms/' | relative_url }}">
        <span><h3>주요 용어</h3><p>Security Domain, Control Class, Evidence 등 주요 개념을 확인합니다.</p></span>
        <span class="gz-menu-arrow" aria-hidden="true">→</span>
      </a>
      <a class="gz-menu-item" href="{{ '/controls/' | relative_url }}">
        <span><h3>Control Implementation Guide</h3><p>15개 Security Domain의 Control과 구체적인 이행 방법을 확인합니다.</p></span>
        <span class="gz-menu-arrow" aria-hidden="true">→</span>
      </a>
      <a class="gz-menu-item" href="{{ '/self-assessment/' | relative_url }}">
        <span><h3>Self Assessment</h3><p>Assessment Questions와 Evidence를 바탕으로 현재 이행 상태를 평가합니다.</p></span>
        <span class="gz-menu-arrow" aria-hidden="true">→</span>
      </a>
    </nav>
  </section>

  <p class="gz-note">각 Control은 조직의 업무, 정보자산, 개인정보 처리환경과 위험 수준을 고려하여 적용합니다.</p>
</div>
