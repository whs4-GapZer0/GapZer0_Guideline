// GitBook replaces .book during menu/history navigation. Module script tags in
// the injected page are not re-executed, so initialize through its lifecycle.
(function () {
    var moduleUrl = new URL('../assessment/app.mjs?v=control6', document.currentScript.src).href;
    function initializeAssessment() {
        var root = document.getElementById('assessment-app');
        if (!root) return;
        import(moduleUrl).then(function (app) { app.boot(); }).catch(function () {
            if (root.isConnected) root.textContent = '자가 진단 화면을 불러오지 못했습니다. 새로고침 후 다시 시도하세요.';
        });
    }
    window.gitbook.events.on('page.change', initializeAssessment);
    initializeAssessment();
}());

// Local review: expandable Domain navigation.
(function () {
    var domains = [["/controls/governance/", "Governance"], ["/controls/asset-management/", "Asset Management"], ["/controls/continuity/", "Continuity"], ["/controls/human-resource-security/", "Human Resource Security"], ["/controls/identity-access-management/", "Identity and Access Management"], ["/controls/information-protection/", "Information Protection"], ["/controls/information-security-assurance/", "Information Security Assurance"], ["/controls/information-security-event-management/", "Information Security Event Management"], ["/controls/legal-compliance/", "Legal and Compliance"], ["/controls/physical-security/", "Physical Security"], ["/controls/application-security/", "Application Security"], ["/controls/secure-configuration/", "Secure Configuration"], ["/controls/supplier-relationships-security/", "Supplier Relationships Security"], ["/controls/system-network-security/", "System and Network Security"], ["/controls/threat-vulnerability-management/", "Threat and Vulnerability Management"]];
    var expanded = location.pathname.indexOf('/controls/') === 0;
    function initializeDomains() {
        var link = document.querySelector('.book-summary .summary a[href="/controls/"]');
        if (!link || link.parentElement.querySelector('.domain-menu')) return;
        var cleanLink = document.createElement('button');
        cleanLink.type = 'button';
        cleanLink.textContent = link.textContent.trim();
        cleanLink.removeAttribute('onclick');
        var reference = link.cloneNode(false);
        reference.hidden = true;
        reference.tabIndex = -1;
        reference.setAttribute('aria-hidden', 'true');
        reference.removeAttribute('onclick');
        link.replaceWith(cleanLink);
        cleanLink.before(reference);
        link = cleanLink;
        var list = document.createElement('ul');
        list.className = 'domain-menu';
        list.id = 'control-domain-menu';
        domains.forEach(function (domain, index) {
            var item = document.createElement('li');
            var child = document.createElement('a');
            child.href = domain[0];
            child.textContent = (index + 1) + '. ' + domain[1];
            if (location.pathname.indexOf(domain[0]) === 0) {
                item.className = 'active';
                child.setAttribute('aria-current', 'page');
            }
            item.appendChild(child); list.appendChild(item);
        });
        link.parentElement.appendChild(list);
        link.setAttribute('aria-controls', list.id);
        function update() {
            list.hidden = !expanded;
            link.setAttribute('aria-expanded', String(expanded));
            link.classList.add('domain-toggle');
        }
        link.addEventListener('click', function (event) {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); event.stopImmediatePropagation();
            expanded = !expanded; update();
        }, true);
        update();
    }
    window.gitbook.events.on('page.change', initializeDomains);
    initializeDomains();
}());
/* Framework details open in an accessible right-side dialog. */
(function () {
 var content = {"domains": ["15개 보안 영역", "<p>GapZer0의 Security Domain은 <strong>ISO/IEC 27002:2022의 Operational Capabilities(운영 역량) 15개 분류를 차용</strong>하여 구성했습니다. ISO가 사용하는 운영 역량 분류를 GapZer0에서는 Control을 묶는 보안 영역으로 활용합니다.</p><p>각 영역의 설명은 본 프레임워크의 Control을 이해하기 위한 요약입니다.</p><dl class=\"framework-domain-list\"><div><dt>Governance</dt><dd>보안 전략·정책·역할과 책임을 정하고 경영진의 의사결정과 감독에 연결합니다.</dd></div><div><dt>Asset Management</dt><dd>하드웨어·소프트웨어·데이터 등 자산을 식별하고 중요도와 수명주기를 관리합니다.</dd></div><div><dt>Continuity</dt><dd>백업·복구와 자원 확보를 통해 업무와 서비스의 연속성을 유지합니다.</dd></div><div><dt>Human Resource Security</dt><dd>인력의 업무 전 과정에서 보안 책임·인식·역량을 확보합니다.</dd></div><div><dt>Identity and Access Management</dt><dd>신원·인증과 접근권한을 관리하여 비인가 접근을 방지합니다.</dd></div><div><dt>Information Protection</dt><dd>정보의 저장·전송·처리 과정에서 기밀성·무결성·가용성을 보호합니다.</dd></div><div><dt>Information Security Assurance</dt><dd>점검·평가·시험·훈련을 통해 보안 활동의 적절성과 효과를 확인합니다.</dd></div><div><dt>Information Security Event Management</dt><dd>이상 징후를 탐지·분석하고 사고 대응과 복구로 연결합니다.</dd></div><div><dt>Legal and Compliance</dt><dd>법률·규제·계약상 의무와 개인정보 처리의 적법성 요구사항을 관리합니다.</dd></div><div><dt>Physical Security</dt><dd>시설·장비의 물리적 접근과 환경적 위협을 통제합니다.</dd></div><div><dt>Application Security</dt><dd>소프트웨어의 개발과 운영 전 과정에 보안을 반영합니다.</dd></div><div><dt>Secure Configuration</dt><dd>승인된 보안 설정을 유지하고 비인가 변경·코드 실행을 방지합니다.</dd></div><div><dt>Supplier Relationships Security</dt><dd>외부 공급자와 제3자 관계에서 발생하는 보안 위험을 관리합니다.</dd></div><div><dt>System and Network Security</dt><dd>시스템·네트워크의 접근과 사용을 보호합니다.</dd></div><div><dt>Threat and Vulnerability Management</dt><dd>위협·취약점을 식별·평가하고 위험에 따른 대응을 추적합니다.</dd></div></dl>"], "controls": ["121개 Control", "<h3>Control이란?</h3><p>조직이 특정 보안 목적을 달성하기 위해 수행·유지해야 하는 활동의 관리 단위입니다. 정책·절차, 기술적 설정, 검토·교육 등 여러 활동이 포함될 수 있습니다.</p><p>GapZer0에서는 <strong>하나의 보안 목적을 지니고 독립적으로 평가할 수 있는 활동 묶음</strong>을 Control의 기본 단위로 삼았습니다.</p><h3>왜 121개인가요?</h3><p>NIST CSF 2.0의 106개 Subcategory와 ISMS-P의 101개 인증기준을 세부 요구사항 단위로 매핑한 뒤, 그 결과를 <strong>실무에서 이행하고 평가할 수 있는 Control 단위로 재구성</strong>했습니다.</p><p>보안 목적·수행 활동·Evidence가 실질적으로 같은 요구사항은 통합하고, 목적·책임자·수행 주기·Evidence가 독립적인 활동은 별도 Control로 분리했습니다. 여기에 CSF 목표를 충족하기 위해 보완할 사항과 국내 고유 요구사항을 반영했습니다.</p><p>이 과정을 거쳐 최종적으로 <strong>121개 Control</strong>을 구성했습니다. 121개는 두 기준의 항목 수를 단순히 더한 수가 아니라, 매핑 결과를 Control의 목적과 활동에 따라 통합·분리하여 정리한 결과입니다.</p>"], "common": ["Common Control · 76개", "<h3>1. 어떻게 만든 Control인가요?</h3><p>NIST CSF 2.0과 ISMS-P를 매핑한 결과, <strong>보안 목적과 수행 활동이 충분히 겹치는 요구사항을 통합</strong>하여 만든 Control입니다. 국내 기준과 CSF Outcome을 하나의 Control 단위로 관리할 수 있도록 구성했습니다.</p><h3>2. 예시</h3><p><strong>GOV-C-01 · 전략 결과 검토·방향 조정</strong></p><p>ISMS-P의 <strong>1.4.2 관리체계 점검·1.1.1 경영진의 참여</strong>와 CSF의 <strong>GV.OV-01 위험관리 전략의 결과 검토·방향 조정</strong>을 연결했습니다.</p><p>두 기준 모두 <strong>운영 결과를 검토하고 경영진의 의사결정에 반영한다</strong>는 목적과 활동을 공유하므로, 공통 Control로 통합할 수 있다고 판단했습니다.</p>"], "enhancement": ["Enhancement Control · 30개", "<h3>1. 어떻게 만든 Control인가요?</h3><p>NIST CSF 2.0과 ISMS-P를 매핑한 결과, <strong>ISMS-P만으로 CSF Outcome의 요구범위를 충분히 충족하기 어려운 부분을 보완</strong>하도록 만든 확장·신규 Control입니다. 국내 대응기준이 있지만 일부 요구사항이 부족한 경우와 직접 대응기준이 없는 경우를 포함합니다.</p><p>Gap 분석에서 식별한 <strong>30개 CSF 항목</strong>을 바탕으로 Enhancement Control 30개를 구성했습니다. 연결된 ISMS-P 요구사항도 포함하므로, Control 전체를 선택사항으로 보는 것은 적절하지 않습니다.</p><h3>2. 예시</h3><p><strong>GOV-E-01 · 조직 미션-위험관리 방향 연계</strong></p><p>ISMS-P의 관리체계 범위 설정·경영진 참여 요구사항은 조직의 운영 기반을 다루지만, CSF <strong>GV.OC-01</strong>에서 요구하는 조직 미션과 사이버보안 위험관리 방향의 연계를 충분히 명시하지 않습니다.</p><p>이를 보완하여 조직의 미션과 핵심 사업목표를 위험관리 전략·우선순위에 반영하도록 합니다. 가이드라인의 <strong>ISMS-P Limitation</strong>과 <strong>CSF Coverage 항목에서 두 요구사항 간의 Gap</strong>을 확인할 수 있습니다.</p>"], "local": ["Local Control · 15개", "<h3>1. 어떻게 만든 Control인가요?</h3><p>NIST CSF 2.0과 ISMS-P를 매핑한 결과, <strong>CSF에 직접 대응되지 않지만 국내 인증을 위해 유지해야 하는 ISMS-P 고유 요구사항</strong>을 반영하여 만든 Control입니다. 식별된 15개 요구사항은 모두 개인정보 처리단계 요구사항에 포함됩니다.</p><h3>2. 예시</h3><p><strong>LCM-L-01 · 개인정보 수집·이용</strong></p><p>ISMS-P의 <strong>3.1.1 개인정보 수집·이용</strong>은 매핑 분석에서 <strong>직접 대응되는 NIST CSF 2.0 Subcategory가 확인되지 않은 요구사항</strong>입니다. 국내 인증을 위해 유지해야 하는 요구사항이므로 Local Control로 구성했으며, 매핑된 CSF 항목은 <strong>N/A</strong>로 표시됩니다.</p>"]};
 var opener;
 var pageScroll=[];
 function restorePageScroll() {
  pageScroll.forEach(function(position){position.el.scrollTop=position.top;position.el.scrollLeft=position.left;});
 }
 function explain(event) {
  var trigger=event.target.closest('[data-framework-topic]');
  if (!trigger) return;
  if (event.type==='keydown' && event.key!==' ' && event.key!=='Enter') return;
  event.preventDefault(); event.stopImmediatePropagation();
  var panel=document.getElementById('framework-detail');
  var info=content[trigger.dataset.frameworkTopic];
  if (!panel || !info) return;
  opener=trigger;
  panel.querySelector('#framework-detail-title').textContent=info[0];
  panel.querySelector('.framework-drawer-content').innerHTML=info[1];
  if (!panel.open) {
   pageScroll=Array.from(document.querySelectorAll('.book-body,.body-inner,.book-summary')).concat([document.scrollingElement]).filter(Boolean).map(function(el){return {el:el,top:el.scrollTop,left:el.scrollLeft};});
   document.documentElement.classList.add("framework-drawer-open");
   document.querySelectorAll(".book-body,.body-inner,.book-summary").forEach(function(el){el.dataset.drawerOverflow=el.style.overflow; el.style.overflow="hidden";});
   panel.showModal();
   restorePageScroll();
  }
  panel.querySelector('.framework-drawer-content').scrollTop=0;
  panel.querySelector('button').focus({preventScroll:true});
  restorePageScroll();
 }
 document.addEventListener('click',function(event){
  if(event.target.closest('[data-close-framework]')) { document.getElementById('framework-detail').close(); return; }
  explain(event);
 },true);
 document.addEventListener('keydown',explain,true);
 function initializeDrawer() {
  var panel=document.getElementById('framework-detail');
  if(!panel || panel.dataset.bound) return;
  panel.dataset.bound='true';
  panel.addEventListener('close',function(){
   document.documentElement.classList.remove('framework-drawer-open');
   document.querySelectorAll('.book-body,.body-inner,.book-summary').forEach(function(el){if(el.dataset.drawerOverflow!==undefined){el.style.overflow=el.dataset.drawerOverflow;delete el.dataset.drawerOverflow;}});
   if(opener && opener.isConnected) opener.focus({preventScroll:true});
   restorePageScroll();
  });
 }
 window.gitbook.events.on('page.change',initializeDrawer);
 initializeDrawer();
}());

// Present Control Markdown as handbook rows without modifying its content.
(function () {
    function initializeDocument() {
        var main = document.querySelector('.markdown-section');
        if (!main) return;
        main.id = 'doc-main';
        main.tabIndex = -1;
        if (!document.querySelector('.doc-skip')) {
            var skip = document.createElement('a');
            skip.className = 'doc-skip'; skip.href = '#doc-main';
            skip.textContent = '본문 바로가기'; document.body.prepend(skip);
        }
        document.querySelectorAll('#book-search-input input').forEach(function (input) {
            input.setAttribute('aria-label', '가이드라인 검색');
        });
        Array.from(main.children).filter(function (node) {
            return node.tagName === 'H2' && /^[A-Z]{3}-[CEL]-\d{2}$/.test(node.textContent.trim());
        }).forEach(function (heading) {
            if (heading.parentElement.classList.contains('doc-control')) return;
            var control = document.createElement('div'); control.className = 'doc-control';
            heading.before(control);
            var cursor = heading.nextSibling; control.appendChild(heading);
            while (cursor && !(cursor.nodeType === 1 && cursor.tagName === 'H2')) {
                var next = cursor.nextSibling; control.appendChild(cursor); cursor = next;
            }
            Array.from(control.children).filter(function (node) { return node.tagName === 'H3'; }).forEach(function (label) {
                var name = label.textContent.trim();
                var field = document.createElement('div'); field.className = 'doc-field';
                if (name === 'Implementation Guide' || name === 'Evidence') field.classList.add('doc-detail');
                if (name === 'Evidence') field.classList.add('doc-evidence');
                var value = document.createElement('div'); value.className = 'doc-value';
                label.before(field); var cursor = label.nextSibling; field.appendChild(label); field.appendChild(value);
                while (cursor && !(cursor.nodeType === 1 && cursor.tagName === 'H3')) {
                    var next = cursor.nextSibling; value.appendChild(cursor); cursor = next;
                }
            });
        });
    }
    window.gitbook.events.on('page.change', initializeDocument);
    initializeDocument();
}());
