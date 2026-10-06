// GitBook replaces .book during menu/history navigation. Module script tags in
// the injected page are not re-executed, so initialize through its lifecycle.
(function () {
    var moduleUrl = new URL('../assessment/app.mjs', document.currentScript.src).href;
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
