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
        var cleanLink = link.cloneNode(true);
        cleanLink.removeAttribute('onclick');
        link.replaceWith(cleanLink);
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
